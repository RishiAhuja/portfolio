import React, { useState, useEffect, useCallback } from 'react';
import {
  getUpstreamOverrides,
  upsertUpstreamOverride,
  deleteUpstreamOverride,
  type UpstreamOverrideAdmin,
} from '../../lib/admin';
import { fetchUserPRs, fetchUserIssues, type GitHubPR, type GitHubIssue } from '../../lib/github-upstream';

interface UpstreamEditorProps {
  token: string;
}

type ItemType = 'pr' | 'issue';
type DisplayItem = (GitHubPR | GitHubIssue) & { itemType: ItemType };

const STATE_OPTIONS_PR = ['open', 'merged', 'closed'] as const;
const STATE_OPTIONS_ISSUE = ['open', 'closed'] as const;

const stateBadge = (state: string) => {
  switch (state) {
    case 'open':    return 'bg-accent-light/10 text-accent-light border-accent-light/30';
    case 'merged':  return 'bg-purple-400/10 text-purple-400 border-purple-400/30';
    case 'closed':  return 'bg-gunSmoke/10 text-gunSmoke border-gunSmoke/30';
    default:        return 'bg-gunSmoke/10 text-gunSmoke border-gunSmoke/30';
  }
};

const UpstreamEditor: React.FC<UpstreamEditorProps> = ({ token }) => {
  const [prs, setPrs] = useState<GitHubPR[]>([]);
  const [issues, setIssues] = useState<GitHubIssue[]>([]);
  const [overrides, setOverrides] = useState<Map<string, UpstreamOverrideAdmin>>(new Map());
  const [activeTab, setActiveTab] = useState<ItemType>('pr');
  const [isLoading, setIsLoading] = useState(true);
  const [editingUrl, setEditingUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Draft state for the currently open editor panel
  const [draft, setDraft] = useState<{
    visible: boolean;
    state_override: string;
    title_override: string;
    notes: string;
  }>({ visible: true, state_override: '', title_override: '', notes: '' });

  const loadAll = useCallback(async () => {
    setIsLoading(true);
    try {
      const [fetchedPRs, fetchedIssues, fetchedOverrides] = await Promise.all([
        fetchUserPRs(),
        fetchUserIssues(),
        getUpstreamOverrides(token),
      ]);
      setPrs(fetchedPRs);
      setIssues(fetchedIssues);
      const map = new Map<string, UpstreamOverrideAdmin>();
      for (const ov of fetchedOverrides) map.set(ov.pr_url, ov);
      setOverrides(map);
    } catch (err) {
      console.error('Failed to load upstream data', err);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const openEditor = (item: DisplayItem) => {
    const ov = overrides.get(item.url);
    setDraft({
      visible: ov ? ov.visible : true,
      state_override: ov?.state_override ?? '',
      title_override: ov?.title_override ?? '',
      notes: ov?.notes ?? '',
    });
    setEditingUrl(item.url);
  };

  const closeEditor = () => setEditingUrl(null);

  const handleSave = async (item: DisplayItem) => {
    setSaving(true);
    try {
      const payload: Omit<UpstreamOverrideAdmin, 'id' | 'created_at' | 'updated_at'> = {
        pr_url: item.url,
        item_type: item.itemType,
        visible: draft.visible,
        state_override: (draft.state_override as UpstreamOverrideAdmin['state_override']) || null,
        title_override: draft.title_override.trim() || null,
        notes: draft.notes.trim() || null,
      };
      await upsertUpstreamOverride(token, payload);
      await loadAll();
      closeEditor();
    } catch (err) {
      console.error('Save error', err);
      alert('Error saving override');
    } finally {
      setSaving(false);
    }
  };

  const handleClearOverride = async (url: string) => {
    const ov = overrides.get(url);
    if (!ov) return;
    if (!confirm('Remove all overrides for this item?')) return;
    setSaving(true);
    try {
      await deleteUpstreamOverride(token, ov.id);
      await loadAll();
      closeEditor();
    } finally {
      setSaving(false);
    }
  };

  const items: DisplayItem[] = (activeTab === 'pr' ? prs : issues).map(item => ({
    ...item,
    itemType: activeTab,
  }));

  const stateOptions = activeTab === 'pr' ? STATE_OPTIONS_PR : STATE_OPTIONS_ISSUE;

  const editingItem = editingUrl ? items.find(i => i.url === editingUrl) ?? null : null;

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-14 bg-darkGrey/30 rounded-sm animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left – List */}
      <div className="space-y-4">
        <div className="flex gap-2 mb-2">
          {(['pr', 'issue'] as ItemType[]).map(tab => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); closeEditor(); }}
              className={`px-3 py-1.5 font-ptMono text-xs rounded-sm transition-all duration-200 border ${
                activeTab === tab
                  ? 'bg-accent-light/10 text-accent-light border-accent-light/30'
                  : 'bg-darkGrey/20 text-gunSmoke border-darkGrey/40 hover:border-darkGrey/60'
              }`}
            >
              {tab === 'pr' ? `Pull Requests (${prs.length})` : `Issues (${issues.length})`}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {items.map(item => {
            const ov = overrides.get(item.url);
            const effectiveState = ov?.state_override ?? item.state;
            const effectiveTitle = ov?.title_override ?? item.title;
            const hidden = ov?.visible === false;
            const isEditing = editingUrl === item.url;

            return (
              <div
                key={item.url}
                role="button"
                tabIndex={0}
                onClick={() => openEditor(item)}
                onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && openEditor(item)}
                className={`
                  p-3 rounded-sm border cursor-pointer transition-all duration-200
                  ${isEditing
                    ? 'border-accent-light/40 bg-accent-light/5'
                    : 'border-darkGrey/40 bg-darkGrey/20 hover:border-darkGrey/70'}
                  ${hidden ? 'opacity-40' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className={`font-ptMono text-sm flex-1 leading-snug ${hidden ? 'line-through' : 'text-quillGray'}`}>
                    {effectiveTitle}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {ov && (
                      <span className="px-1.5 py-0.5 text-[9px] font-ptMono rounded border bg-yellow-500/10 text-yellow-400 border-yellow-400/30">
                        OVERRIDDEN
                      </span>
                    )}
                    <span className={`px-2 py-0.5 text-[10px] font-ptMono rounded border ${stateBadge(effectiveState)}`}>
                      {effectiveState.toUpperCase()}
                    </span>
                  </div>
                </div>
                <p className="text-xs font-ptMono text-gunSmoke mt-1 opacity-60">{item.repo}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right – Editor Panel */}
      <div>
        {editingItem ? (
          <div className="bg-darkGrey/20 border border-darkGrey/40 rounded-sm p-5 space-y-5 sticky top-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-ptMono text-sm text-quillGray font-medium leading-snug">
                  {editingItem.title}
                </h3>
                <p className="text-xs text-gunSmoke font-ptMono mt-0.5 opacity-60">{editingItem.repo}</p>
              </div>
              <button
                onClick={closeEditor}
                className="text-gunSmoke hover:text-quillGray text-lg leading-none flex-shrink-0"
              >
                ×
              </button>
            </div>

            {/* Visibility toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="visibility-toggle" className="font-ptMono text-sm text-gunSmoke">Visible on portfolio</label>
              <button
                id="visibility-toggle"
                onClick={() => setDraft(d => ({ ...d, visible: !d.visible }))}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                  draft.visible ? 'bg-accent-light/60' : 'bg-gunSmoke/30'
                }`}
              >
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                  draft.visible ? 'translate-x-4' : 'translate-x-1'
                }`} />
              </button>
            </div>

            {/* State override */}
            <div>
              <label htmlFor="state-override" className="block font-ptMono text-sm text-gunSmoke mb-1.5">
                State override <span className="opacity-50">(leave blank to use GitHub state)</span>
              </label>
              <div id="state-override" className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setDraft(d => ({ ...d, state_override: '' }))}
                  className={`px-3 py-1.5 font-ptMono text-xs rounded-sm border transition-colors ${
                    draft.state_override === ''
                      ? 'bg-accent-light/10 text-accent-light border-accent-light/30'
                      : 'bg-darkGrey/30 text-gunSmoke border-darkGrey/50 hover:border-gunSmoke/60'
                  }`}
                >
                  auto
                </button>
                {stateOptions.map(s => (
                  <button
                    key={s}
                    onClick={() => setDraft(d => ({ ...d, state_override: s }))}
                    className={`px-3 py-1.5 font-ptMono text-xs rounded-sm border transition-colors ${
                      draft.state_override === s
                        ? `${stateBadge(s)}`
                        : 'bg-darkGrey/30 text-gunSmoke border-darkGrey/50 hover:border-gunSmoke/60'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Title override */}
            <div>
              <label htmlFor="title-override" className="block font-ptMono text-sm text-gunSmoke mb-1.5">
                Title override <span className="opacity-50">(optional)</span>
              </label>
              <input
                id="title-override"
                type="text"
                value={draft.title_override}
                onChange={e => setDraft(d => ({ ...d, title_override: e.target.value }))}
                placeholder={editingItem.title}
                className="w-full px-3 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none"
              />
            </div>

            {/* Notes */}
            <div>
              <label htmlFor="notes" className="block font-ptMono text-sm text-gunSmoke mb-1.5">
                Notes <span className="opacity-50">(internal only)</span>
              </label>
              <textarea
                id="notes"
                value={draft.notes}
                onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
                rows={3}
                placeholder="e.g. reverted upstream, or not merged yet..."
                className="w-full px-3 py-2 bg-codGray border border-gunSmoke/30 rounded-sm
                  text-quillGray font-ptMono text-sm focus:border-accent-light focus:outline-none resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => handleSave(editingItem)}
                disabled={saving}
                className="flex-1 py-2 bg-accent-light/10 border border-accent-light/40 rounded-sm
                  text-accent-light font-ptMono text-sm hover:bg-accent-light hover:text-codGray
                  transition-all duration-200 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              {overrides.has(editingItem.url) && (
                <button
                  onClick={() => handleClearOverride(editingItem.url)}
                  disabled={saving}
                  className="px-4 py-2 bg-red-500/5 border border-red-400/30 rounded-sm
                    text-red-400 font-ptMono text-sm hover:bg-red-400 hover:text-codGray
                    transition-all duration-200 disabled:opacity-50"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-40 border border-darkGrey/30 rounded-sm">
            <p className="font-ptMono text-sm text-gunSmoke opacity-50">
              Select an item to configure overrides
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UpstreamEditor;
