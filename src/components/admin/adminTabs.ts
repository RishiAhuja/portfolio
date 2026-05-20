export type AdminTabId =
  | 'uncompiled'
  | 'sidequests'
  | 'gallery'
  | 'resumes'
  | 'bootcamp'
  | 'students'
  | 'upstream'
  | 'cluster';

export const ADMIN_TAB_ORDER_KEY = 'admin_tab_order';

export const DEFAULT_ADMIN_TAB_ORDER: AdminTabId[] = [
  'uncompiled',
  'sidequests',
  'gallery',
  'resumes',
  'bootcamp',
  'students',
  'upstream',
  'cluster',
];

export const ADMIN_TAB_LABELS: Record<AdminTabId, string> = {
  uncompiled: 'Uncompiled',
  sidequests: 'Side Quests',
  gallery: 'Gallery',
  resumes: 'Resumes',
  bootcamp: 'Bootcamp',
  students: 'Students',
  upstream: 'Upstream',
  cluster: 'Cluster',
};

export function loadAdminTabOrder(): AdminTabId[] {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_TAB_ORDER;

  try {
    const stored = localStorage.getItem(ADMIN_TAB_ORDER_KEY);
    if (!stored) return DEFAULT_ADMIN_TAB_ORDER;

    const parsed = JSON.parse(stored) as unknown;
    if (!Array.isArray(parsed)) return DEFAULT_ADMIN_TAB_ORDER;

    const valid = parsed.filter(
      (id): id is AdminTabId =>
        typeof id === 'string' && id in ADMIN_TAB_LABELS
    );

    const missing = DEFAULT_ADMIN_TAB_ORDER.filter((id) => !valid.includes(id));
    return [...valid, ...missing];
  } catch {
    return DEFAULT_ADMIN_TAB_ORDER;
  }
}

export function saveAdminTabOrder(order: AdminTabId[]): void {
  localStorage.setItem(ADMIN_TAB_ORDER_KEY, JSON.stringify(order));
}
