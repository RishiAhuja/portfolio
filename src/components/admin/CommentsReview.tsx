import React, { useCallback, useEffect, useState } from 'react';

type Status = 'pending' | 'approved' | 'rejected';

interface BlurbComment {
  id: string;
  slug: string;
  name: string;
  body: string;
  status: Status;
  created_at: string;
}

interface CommentsReviewProps {
  token: string;
}

const FILTERS: { id: Status; label: string }[] = [
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
];

// What each list offers: approve or reject new comments, and undo either decision.
const ACTIONS: Record<Status, { status: Status; label: string; primary?: boolean }[]> = {
  pending: [{ status: 'approved', label: 'Approve', primary: true }, { status: 'rejected', label: 'Reject' }],
  approved: [{ status: 'rejected', label: 'Hide' }],
  rejected: [{ status: 'approved', label: 'Approve' }],
};

const formatDate = (value: string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(value));

const CommentsReview: React.FC<CommentsReviewProps> = ({ token }) => {
  const [filter, setFilter] = useState<Status>('pending');
  const [comments, setComments] = useState<BlurbComment[]>([]);
  const [pending, setPending] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (status: Status) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/comments?status=${status}`, { headers: { Authorization: `Bearer ${token}` } });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not load comments');
      setComments(body.comments);
      setPending(body.pending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load comments');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => { load(filter); }, [filter, load]);

  const review = async (comment: BlurbComment, status: Status) => {
    setBusy(comment.id);
    setError(null);
    try {
      const response = await fetch('/api/admin/comments', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: comment.id, status }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || 'Could not update the comment');
      setComments((current) => current.filter((entry) => entry.id !== comment.id));
      if (comment.status === 'pending') setPending((count) => Math.max(0, count - 1));
      if (status === 'pending') setPending((count) => count + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update the comment');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="comments-review">
      <div className="comments-filters" role="group" aria-label="Show comments">
        {FILTERS.map((entry) => (
          <button key={entry.id} type="button" aria-pressed={filter === entry.id} onClick={() => setFilter(entry.id)}>
            {entry.label}
            {entry.id === 'pending' && pending > 0 && <span className="comments-count">{pending}</span>}
          </button>
        ))}
      </div>

      {error && <p className="admin-error" role="alert">{error}</p>}

      {isLoading ? (
        <p className="comments-empty">Loading…</p>
      ) : comments.length === 0 ? (
        <p className="comments-empty">No {filter} comments.</p>
      ) : (
        <ol className="comments-list">
          {comments.map((comment) => (
            <li key={comment.id}>
              <p className="comments-meta">
                <strong>{comment.name}</strong>
                <a href={`https://rishia.in/blurb/${comment.slug}`} target="_blank" rel="noopener noreferrer">{comment.slug} ↗</a>
                <time dateTime={comment.created_at}>{formatDate(comment.created_at)}</time>
              </p>
              <p className="comments-body">{comment.body}</p>
              <div className="comments-actions">
                {ACTIONS[comment.status].map((action) => (
                  <button
                    key={action.status}
                    type="button"
                    className={`admin-button${action.primary ? ' admin-button-primary' : ''}`}
                    disabled={busy === comment.id}
                    onClick={() => review(comment, action.status)}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default CommentsReview;
