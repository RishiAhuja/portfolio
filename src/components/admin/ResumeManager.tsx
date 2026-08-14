import React, { useEffect, useMemo, useState } from 'react';
import { LINKS } from '../../lib/constants';
import { RESUME_TRACKS, type ResumeTrack } from '../../lib/resumeTracks';

interface ResumeFile {
  key: string;
  fileName: string;
  url: string;
  size: number;
  lastModified: string | null;
  version: number;
}

interface ResumeManagerProps {
  token: string;
}

const TRACKS: ResumeTrack[] = ['engineering', 'research'];

const FALLBACK_URLS: Record<ResumeTrack, string> = {
  engineering: LINKS.RESUME_FALLBACK,
  research: LINKS.RESEARCH_RESUME_FALLBACK,
};

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDate(value: string | null): string {
  if (!value) return 'Unknown';
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

const ResumeManager: React.FC<ResumeManagerProps> = ({ token }) => {
  const [track, setTrack] = useState<ResumeTrack>('engineering');
  const [resumes, setResumes] = useState<ResumeFile[]>([]);
  const [latestResume, setLatestResume] = useState<ResumeFile | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [targetFileName, setTargetFileName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trackConfig = RESUME_TRACKS[track];
  const nextVersionFileName = useMemo(() => {
    const nextVersion = (latestResume?.version || 0) + 1;
    return trackConfig.fileName(nextVersion);
  }, [latestResume, trackConfig]);

  useEffect(() => {
    loadResumes(track);
    setSelectedFile(null);
    setTargetFileName('');
    setError(null);
  }, [track]);

  useEffect(() => {
    if (!selectedFile) {
      setTargetFileName(nextVersionFileName);
    }
  }, [nextVersionFileName, selectedFile]);

  const loadResumes = async (activeTrack: ResumeTrack) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/resume/list?track=${activeTrack}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || 'Failed to load resumes');
      }

      const data = await response.json();
      setResumes(data.resumes || []);
      setLatestResume(data.latest || null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);

    if (!file) {
      setTargetFileName(nextVersionFileName);
      return;
    }

    const matchingName = file.name.match(trackConfig.pattern);
    setTargetFileName(matchingName ? file.name : nextVersionFileName);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Select a PDF first.');
      return;
    }

    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Only PDF resumes are allowed.');
      return;
    }

    if (!trackConfig.pattern.test(targetFileName.trim())) {
      setError(`Target filename must match ${trackConfig.hint}`);
      return;
    }

    setIsUploading(true);
    setError(null);
    const uploadFileName = targetFileName.trim();

    try {
      const presignResponse = await fetch('/api/resume/presign', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: uploadFileName,
          contentType: 'application/pdf',
          track,
        }),
      });

      const presignBody = await presignResponse.json();
      if (!presignResponse.ok) {
        throw new Error(presignBody.error || 'Failed to prepare upload');
      }

      const uploadResponse = await fetch(presignBody.uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/pdf' },
        body: selectedFile,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.text().catch(() => '');
        throw new Error(uploadError || 'R2 upload failed');
      }

      setSelectedFile(null);
      setTargetFileName('');
      await loadResumes(track);
      alert(`Uploaded ${uploadFileName}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h2 className="text-xl font-bold font-ptMono text-quillGray">Resume Tracker</h2>
            <p className="text-sm text-gunSmoke font-ptMono mt-2">
              Versioned PDFs in R2 at {trackConfig.prefix}{trackConfig.hint}.
            </p>
          </div>
          <button
            onClick={() => loadResumes(track)}
            disabled={isLoading}
            className="px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm text-gunSmoke
              hover:border-accent-light hover:text-accent-light transition-colors font-ptMono text-sm disabled:opacity-50"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {TRACKS.map((item) => (
            <button
              key={item}
              onClick={() => setTrack(item)}
              className={`px-4 py-2 rounded-sm font-ptMono text-sm border transition-colors ${
                track === item
                  ? 'bg-accent-light/10 border-accent-light/40 text-accent-light'
                  : 'bg-codGray border-gunSmoke/30 text-gunSmoke hover:border-accent-light hover:text-accent-light'
              }`}
            >
              {RESUME_TRACKS[item].label}
            </button>
          ))}
        </div>

        <div className="mt-4 text-xs text-gunSmoke font-ptMono">
          Public:{' '}
          {trackConfig.publicPaths.map((path, index) => (
            <React.Fragment key={path}>
              {index > 0 && ' · '}
              <a
                href={path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-light hover:text-quillGray transition-colors"
              >
                rishia.in{path}
              </a>
            </React.Fragment>
          ))}
        </div>

        {latestResume ? (
          <div className="mt-5 border border-accent-light/40 bg-accent-light/5 rounded-sm p-4">
            <div className="text-xs text-accent-light font-ptMono mb-2">
              Latest {trackConfig.label} Resume
            </div>
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="font-ptMono text-quillGray">{latestResume.fileName}</div>
                <div className="text-xs text-gunSmoke font-ptMono mt-1">
                  v{latestResume.version} · {formatBytes(latestResume.size)} · {formatDate(latestResume.lastModified)}
                </div>
              </div>
              <a
                href={latestResume.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded-sm
                  text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray
                  transition-all duration-200 text-center"
              >
                Open Latest
              </a>
            </div>
          </div>
        ) : (
          <div className="mt-5 border border-gunSmoke/30 rounded-sm p-4 text-sm text-gunSmoke font-ptMono">
            No versioned {trackConfig.label.toLowerCase()} resume PDFs in R2 yet.
            Public URLs currently fall back to{' '}
            <a
              href={FALLBACK_URLS[track]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-light hover:text-quillGray transition-colors"
            >
              the existing PDF
            </a>
            .
          </div>
        )}
      </div>

      <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-5">
        <h3 className="text-base font-bold font-ptMono text-quillGray mb-4">
          Upload {trackConfig.label} Resume
        </h3>
        <div className="grid gap-4 md:grid-cols-[1fr_280px_auto] md:items-end">
          <div>
            <label className="block text-sm font-ptMono text-gunSmoke mb-2">PDF File</label>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={handleFileChange}
              className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-ptMono text-gunSmoke mb-2">R2 Filename</label>
            <input
              type="text"
              value={targetFileName}
              onChange={(event) => setTargetFileName(event.target.value)}
              className="w-full px-4 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none"
              placeholder={nextVersionFileName}
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={isUploading || !selectedFile}
            className="px-4 py-2 bg-accent-light/10 border border-accent-light/40 rounded-sm
              text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray
              transition-all duration-200 disabled:opacity-50 disabled:hover:bg-accent-light/10 disabled:hover:text-accent-light"
          >
            {isUploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        {error && (
          <div className="mt-4 border border-red-400/40 bg-red-400/10 text-red-300 rounded-sm p-3 font-ptMono text-sm">
            {error}
          </div>
        )}
      </div>

      <div className="bg-darkGrey border border-gunSmoke/30 rounded-sm p-5">
        <h3 className="text-base font-bold font-ptMono text-quillGray mb-4">
          All {trackConfig.label} Resumes
        </h3>
        {isLoading ? (
          <p className="text-gunSmoke font-ptMono text-sm">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <p className="text-gunSmoke font-ptMono text-sm">No resumes found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-ptMono text-sm">
              <thead>
                <tr className="border-b border-gunSmoke/30 text-gunSmoke">
                  <th className="py-2 pr-4 font-normal">Version</th>
                  <th className="py-2 pr-4 font-normal">File</th>
                  <th className="py-2 pr-4 font-normal">Size</th>
                  <th className="py-2 pr-4 font-normal">Modified</th>
                  <th className="py-2 font-normal">Open</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((resume, index) => (
                  <tr key={resume.key} className="border-b border-gunSmoke/10 text-quillGray">
                    <td className="py-3 pr-4">
                      v{resume.version}
                      {index === 0 && (
                        <span className="ml-2 text-[10px] text-accent-light border border-accent-light/40 rounded-sm px-2 py-0.5">
                          latest
                        </span>
                      )}
                    </td>
                    <td className="py-3 pr-4">{resume.fileName}</td>
                    <td className="py-3 pr-4 text-gunSmoke">{formatBytes(resume.size)}</td>
                    <td className="py-3 pr-4 text-gunSmoke">{formatDate(resume.lastModified)}</td>
                    <td className="py-3">
                      <a
                        href={resume.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent-light hover:text-quillGray transition-colors"
                      >
                        Open
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeManager;
