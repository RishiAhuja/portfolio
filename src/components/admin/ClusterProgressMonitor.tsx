import React, { useEffect, useMemo, useState } from 'react';

interface ClusterSnapshot {
  received_at: string;
  campaign?: string;
  source: string;
  host: string | null;
  generated_at: string;
  done: number | null;
  total: number | null;
  percent: number | null;
  running: number | null;
  held: number | null;
  queued: number | null;
  eta_label: string | null;
  eta_note: string | null;
  progress_text: string;
}

interface ClusterProgressResponse {
  campaign?: string;
  latest: ClusterSnapshot | null;
  history: ClusterSnapshot[];
  updated_at?: string;
}

interface ClusterProgressMonitorProps {
  token: string;
}

const ACTIVE_CAMPAIGN = 'pair-ctrl-external-top10-20260811';
const ACTIVE_CAMPAIGN_LABEL = 'PAIR-CTRL External Top 10';

const formatTime = (value?: string | null) => {
  if (!value) return 'n/a';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const formatPercent = (value: number | null) => {
  if (value === null || Number.isNaN(value)) return 'n/a';
  return `${value.toFixed(1)}%`;
};

const formatCount = (value: number | null) =>
  value === null || Number.isNaN(value) ? 'n/a' : value.toLocaleString();

interface RunningJobProgress {
  tag: string;
  rows: number;
  expectedRows: number;
}

const parseRunningJob = (progressText: string): RunningJobProgress | null => {
  for (const line of progressText.split('\n')) {
    const match = line.match(/^\d+\s+(\S+)\s+running\s+(\d+)\/(\d+)\s*$/i);
    if (!match) continue;
    return {
      tag: match[1],
      rows: Number(match[2]),
      expectedRows: Number(match[3]),
    };
  }
  return null;
};

const formatRemaining = (minutes: number) => {
  if (minutes <= 1) return '<1 min remaining';
  if (minutes < 60) return `${Math.round(minutes)} min remaining`;
  const hours = Math.floor(minutes / 60);
  const remainder = Math.round(minutes % 60);
  return `${hours}h ${remainder}m remaining`;
};

const Stat = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="bg-codGray border border-gunSmoke/20 rounded-sm p-4">
    <div className="text-xs font-ptMono text-gunSmoke mb-2">{label}</div>
    <div className="text-lg font-ptMono text-quillGray">{value}</div>
  </div>
);

const ClusterProgressMonitor: React.FC<ClusterProgressMonitorProps> = ({ token }) => {
  const [data, setData] = useState<ClusterProgressResponse>({ latest: null, history: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = async () => {
    try {
      setError(null);
      const response = await fetch(
        `/api/cluster-progress/latest?campaign=${encodeURIComponent(ACTIVE_CAMPAIGN)}`,
        {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: 'no-store',
        },
      );
      if (!response.ok) {
        throw new Error(`Progress API returned ${response.status}`);
      }
      const payload = (await response.json()) as ClusterProgressResponse;
      setData({
        campaign: payload.campaign ?? ACTIVE_CAMPAIGN,
        latest: payload.latest ?? null,
        history: Array.isArray(payload.history) ? payload.history : [],
        updated_at: payload.updated_at,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load progress');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProgress();
    const id = window.setInterval(loadProgress, 30000);
    return () => window.clearInterval(id);
  }, [token]);

  const latest = data.latest;
  const recentHistory = useMemo(() => data.history.slice(-12).reverse(), [data.history]);
  const progressWidth = latest?.percent === null || latest?.percent === undefined
    ? 0
    : Math.min(100, Math.max(0, latest.percent));
  const latestAgeMs = latest ? Date.now() - new Date(latest.received_at).getTime() : Infinity;
  const isLive = Number.isFinite(latestAgeMs) && latestAgeMs < 15 * 60 * 1000;
  const currentJobEta = useMemo(() => {
    if (!latest) return null;
    const currentJob = parseRunningJob(latest.progress_text);
    if (!currentJob) return null;

    const samples = data.history
      .map((snapshot) => {
        const job = parseRunningJob(snapshot.progress_text);
        return job?.tag === currentJob.tag
          ? { rows: job.rows, timestamp: new Date(snapshot.received_at).getTime() }
          : null;
      })
      .filter((sample): sample is { rows: number; timestamp: number } =>
        sample !== null && Number.isFinite(sample.timestamp)
      )
      .sort((a, b) => a.timestamp - b.timestamp);

    if (samples.length < 2) return null;
    const first = samples[0];
    const last = samples[samples.length - 1];
    const elapsedMinutes = (last.timestamp - first.timestamp) / 60_000;
    const completedRows = last.rows - first.rows;
    if (elapsedMinutes < 1 || completedRows <= 0) return null;

    const rowsPerMinute = completedRows / elapsedMinutes;
    const finishAt = new Date(
      last.timestamp + ((currentJob.expectedRows - last.rows) / rowsPerMinute) * 60_000,
    );
    const remainingMinutes = Math.max(0, (finishAt.getTime() - Date.now()) / 60_000);

    return {
      ...currentJob,
      rowsPerMinute,
      finishAt,
      remainingMinutes,
      sampleCount: samples.length,
    };
  }, [data.history, latest]);

  if (isLoading) {
    return <p className="text-gunSmoke font-ptMono">Loading cluster progress...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-sm p-4">
        <p className="text-red-400 font-ptMono text-sm">{error}</p>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-6">
        <p className="text-gunSmoke font-ptMono text-sm">No cluster progress has been posted yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-5">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-bold font-ptMono text-quillGray">
                {ACTIVE_CAMPAIGN_LABEL}
              </h2>
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-ptMono uppercase tracking-wide ${
                  isLive
                    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                    : 'border-amber-400/40 bg-amber-400/10 text-amber-300'
                }`}
              >
                {isLive ? 'Live' : 'Stale'}
              </span>
            </div>
            <p className="text-xs font-ptMono text-gunSmoke mt-1">
              Last posted {formatTime(latest.received_at)} from {latest.host || latest.source}
            </p>
            <p className="text-[10px] font-ptMono text-gunSmoke/80 mt-1 break-all">
              {data.campaign || latest.campaign || ACTIVE_CAMPAIGN}
            </p>
          </div>
          <button
            onClick={loadProgress}
            className="px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm text-gunSmoke
              hover:border-accent-light hover:text-accent-light transition-colors font-ptMono text-sm"
          >
            Refresh
          </button>
        </div>

        <div className="mb-5">
          <div className="flex justify-between text-xs font-ptMono text-gunSmoke mb-2">
            <span>{formatPercent(latest.percent)}</span>
            <span>{formatCount(latest.done)} / {formatCount(latest.total)} rows</span>
          </div>
          <div className="h-3 bg-codGray border border-gunSmoke/20 rounded-sm overflow-hidden">
            <div
              className="h-full bg-accent-light transition-all duration-500"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Stat
            label="Current job ETA"
            value={currentJobEta ? formatTime(currentJobEta.finishAt.toISOString()) : latest.eta_label || 'n/a'}
          />
          <Stat label="Running" value={latest.running ?? 'n/a'} />
          <Stat label="Held" value={latest.held ?? 'n/a'} />
          <Stat label="Queued" value={latest.queued ?? 'n/a'} />
        </div>

        {latest.eta_note && (
          <p className="text-xs font-ptMono text-gunSmoke mt-4">{latest.eta_note}</p>
        )}
        {currentJobEta && (
          <p className="text-xs font-ptMono text-gunSmoke mt-2">
            {currentJobEta.tag}: {formatCount(currentJobEta.rows)} /{' '}
            {formatCount(currentJobEta.expectedRows)} rows · {currentJobEta.rowsPerMinute.toFixed(1)} rows/min ·{' '}
            {formatRemaining(currentJobEta.remainingMinutes)} · {currentJobEta.sampleCount} historical samples
          </p>
        )}
      </div>

      <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-5">
        <h3 className="text-sm font-ptMono text-quillGray mb-3">Recent posts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-ptMono text-xs">
            <thead className="text-gunSmoke border-b border-gunSmoke/20">
              <tr>
                <th className="py-2 pr-4">Time</th>
                <th className="py-2 pr-4">Progress</th>
                <th className="py-2 pr-4">Rows</th>
                <th className="py-2 pr-4">ETA</th>
              </tr>
            </thead>
            <tbody className="text-quillGray">
              {recentHistory.map((item, index) => (
                <tr key={`${item.received_at}-${index}`} className="border-b border-gunSmoke/10">
                  <td className="py-2 pr-4 whitespace-nowrap">{formatTime(item.received_at)}</td>
                  <td className="py-2 pr-4">{formatPercent(item.percent)}</td>
                  <td className="py-2 pr-4 whitespace-nowrap">
                    {formatCount(item.done)} / {formatCount(item.total)}
                  </td>
                  <td className="py-2 pr-4">{item.eta_label || 'n/a'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-5">
        <h3 className="text-sm font-ptMono text-quillGray mb-3">Raw progress</h3>
        <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap text-xs leading-relaxed font-ptMono text-gunSmoke bg-codGray border border-gunSmoke/20 rounded-sm p-4">
          {latest.progress_text || 'No raw progress text posted.'}
        </pre>
      </div>
    </div>
  );
};

export default ClusterProgressMonitor;
