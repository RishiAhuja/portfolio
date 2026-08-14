import { createResumeRoute } from '../../lib/resumeRedirect';

export const prerender = false;
export const { GET, HEAD } = createResumeRoute('research');
