import { supabase } from './supabase';

let recordedPath: string | null = null;
let countRequest: Promise<number> | null = null;

// The desktop and mobile footer counters share one recording for this page.
export function getVisitorCount(): Promise<number> {
  const path = window.location.pathname;
  if (recordedPath === path && countRequest) return countRequest;
  recordedPath = path;
  countRequest = (async () => {
    let sessionId = sessionStorage.getItem('visitor_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      sessionStorage.setItem('visitor_session_id', sessionId);
    }
    const visit = await supabase.rpc('log_visit', { p_page_path: path, p_session_id: sessionId });
    if (visit.error) throw visit.error;
    const total = await supabase.rpc('get_total_visitors');
    if (total.error || total.data == null) throw total.error || new Error('Visitor count unavailable');
    return Number(total.data) + 5747;
  })();
  return countRequest;
}
