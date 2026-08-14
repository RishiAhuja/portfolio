export type ResumeTrack = 'engineering' | 'research';

export const RESUME_TRACKS: Record<
  ResumeTrack,
  {
    prefix: string;
    pattern: RegExp;
    fileName: (version: number) => string;
    hint: string;
    label: string;
    publicPaths: string[];
  }
> = {
  engineering: {
    prefix: 'resume/',
    pattern: /^rishi-resume-v(\d+)\.pdf$/i,
    fileName: (version) => `rishi-resume-v${version}.pdf`,
    hint: 'rishi-resume-v<number>.pdf',
    label: 'Engineering',
    publicPaths: ['/resume'],
  },
  research: {
    prefix: 'resume/research/',
    pattern: /^rishi-research-resume-v(\d+)\.pdf$/i,
    fileName: (version) => `rishi-research-resume-v${version}.pdf`,
    hint: 'rishi-research-resume-v<number>.pdf',
    label: 'Research',
    publicPaths: ['/research/resume', '/rsh/resume'],
  },
};

export function isResumeTrack(value: unknown): value is ResumeTrack {
  return value === 'engineering' || value === 'research';
}
