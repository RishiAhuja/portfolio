export interface ResearchAuthor {
  name: string;
  isMe?: boolean;
  isCorresponding?: boolean;
  profile?: string;
}

export interface ResearchLink {
  label: string;
  url: string;
  primary?: boolean;
}

export interface ResearchEventLink {
  label: string;
  url: string;
}

export interface ResearchEvent {
  label: string;
  venue: string;
  location: string;
  datesLabel: string;
  startDate?: string;
  endDate?: string;
  url: string;
  verifiedLinks?: ResearchEventLink[];
}

export interface ResearchPaper {
  slug: string;
  title: string;
  status: 'Accepted' | 'Published';
  statusLabel: string;
  publishedIsoDate?: string;
  authors?: ResearchAuthor[];
  authorsDisplay?: string;
  affiliationNote?: string;
  venue: string;
  proceedings: string;
  tldr: string;
  abstract: string;
  award?: string;
  event?: ResearchEvent;
  links: ResearchLink[];
  bibtex?: string;
  primaryUrl?: string;
  sameAs?: string[];
}

export const researchPapers: ResearchPaper[] = [
  {
    slug: 'icfd-31k',
    title: 'ICFD-31k: A Large-Scale Dataset and Benchmark for Real-Time Conversational Fraud Detection',
    status: 'Accepted',
    statusLabel: 'Accepted Apr 30, 2026',
    authorsDisplay: 'Rishi Ahuja and collaborators',
    affiliationNote: 'Camera-ready metadata and public artifacts will be added after the final proceedings release.',
    venue: 'IJCAI-ECAI 2026 Special Track (Main Conference)',
    proceedings: 'Accepted to IJCAI-ECAI 2026',
    tldr: 'ICFD-31k introduces 31,000+ Indian English/Hinglish fraud-call transcripts with chunk-level streaming labels and slow-thinking rationales, plus RoBERTa baselines that reach 99.40 F1 in-domain and 92.97 F1 on unseen scam types.',
    abstract: `The proliferation of sophisticated telephone scams poses a significant societal and economic threat, impacting diverse linguistic contexts in a country like India. Furthermore, the lack of large-scale, publicly available datasets remains a critical barrier impacting research on robust, real-time countermeasures. In view of this, the proposed work introduces ICFD-31k, the first Indian Conversational Fraud Dataset, representing a new benchmark containing over 31,000 realistic conversational transcripts. ICFD-31k comprises systematically generated content, covering 10 distinct fraud umbrellas spanning from financial impersonation to job scams. ICFD-31k transcripts feature rich annotations comprising a final verdict, chunk-level streaming labels, and detailed "slow-thinking" rationales. In addition, the human-in-the-loop evaluation validates the ICFD-31k's quality, achieving a Cohen's Kappa of 0.534 that confirms annotation reliability. Furthermore, the proposed work introduces two fine-tuned models based on RoBERTa: M1 for non-streaming data and M2 for streaming data. The comprehensive experiments with strong baselines (M1, M2) further demonstrate the ICFD-31k's utility.`,
    event: {
      label: 'To be presented at',
      venue: 'IJCAI-ECAI 2026',
      location: 'Bremen, Germany',
      datesLabel: 'Aug 15-21, 2026',
      startDate: '2026-08-15',
      endDate: '2026-08-21',
      url: 'https://2026.ijcai.org/',
      verifiedLinks: [
        { label: 'IJCAI-ECAI 2026 venue', url: 'https://2026.ijcai.org/' },
      ],
    },
    links: [
      { label: 'Conference site', url: 'https://2026.ijcai.org/', primary: true },
    ],
    primaryUrl: 'https://2026.ijcai.org/',
    sameAs: ['https://2026.ijcai.org/'],
  },
  {
    slug: 'retrieval-tsfm',
    title: 'Retrieval Mechanisms Surpass Long-Context Scaling in Time Series Forecasting',
    status: 'Published',
    statusLabel: 'Published Mar 2, 2026',
    publishedIsoDate: '2026-03-02',
    authors: [
      { name: 'Rishi Ahuja', isMe: true, isCorresponding: false, profile: 'https://openreview.net/profile?id=~Rishi_Ahuja1' },
      { name: 'Kumar Prateek', isMe: false, isCorresponding: false, profile: 'https://openreview.net/profile?id=~Kumar_Prateek1' },
      { name: 'Simranjit Singh', isMe: false, isCorresponding: true, profile: 'https://openreview.net/profile?id=~Simranjit_Singh4' },
      { name: 'Vijay Kumar', isMe: false, isCorresponding: false, profile: 'https://openreview.net/profile?id=~Dr_Vijay_Kumar1' },
    ],
    affiliationNote: 'Department of Information Technology, Dr. B.R. Ambedkar National Institute of Technology Jalandhar',
    venue: '1st ICLR Workshop on Time Series in the Age of Large Models',
    proceedings: 'Proceedings of ICLR 2026',
    tldr: 'Long contexts hurt time series forecasting by adding noise (inverse scaling, >68% worse at 3k steps), while selective retrieval (RAFT) beats them with lower MSE (0.379 vs 0.647) and less compute - future TSFMs should embed retrieval instead.',
    abstract: `Time Series Foundation Models (TSFMs) have borrowed the long context paradigm from natural language processing under the premise that feeding more history into the model improves forecast quality. But in stochastic domains, distant history is often just high-frequency noise, not signal. Hence, the proposed work tests whether this premise actually holds by running continuous context architectures (PatchTST included) through the ETTh1 benchmark. The obtained results contradict the premise: an inverse scaling law shows up clearly, with forecasting error rising as context gets longer. A 3,000-step window causes performance to drop by over 68%, evidence that attention mechanisms are poor at ignoring irrelevant historical volatility. Retrieval-Augmented Forecasting (RAFT) is evaluated as an alternative. RAFT achieves a mean squared error (MSE) of 0.379 with a fixed 720-step window and selective retrieval, well below the 0.647 MSE of the best long-context configuration despite requiring far less computation. In addition, the retrieval step injects only the most relevant historical segments as dynamic exogenous variables, which gives the model a context-informed inductive bias it cannot build on its own from raw sequences. Therefore, foundation models going forward need to shift architecturally toward selective retrieval.`,
    award: '$2,025 ICLR travel grant',
    event: {
      label: 'Presented poster at',
      venue: 'ICLR 2026 Workshop (TSALM)',
      location: 'Rio de Janeiro, Brazil',
      datesLabel: 'Apr 26-27, 2026',
      startDate: '2026-04-26',
      endDate: '2026-04-27',
      url: 'https://iclr.cc/Conferences/2026',
      verifiedLinks: [
        { label: 'ICLR 2026 venue', url: 'https://iclr.cc/Conferences/2026' },
        { label: 'workshop dates', url: 'https://iclr.cc/Conferences/2026/Dates' },
        { label: 'paper forum', url: 'https://openreview.net/forum?id=Qj96MlCmZw' },
      ],
    },
    links: [
      { label: 'OpenReview', url: 'https://openreview.net/forum?id=Qj96MlCmZw', primary: true },
      { label: 'Paper PDF', url: 'https://openreview.net/pdf?id=Qj96MlCmZw', primary: true },
      { label: 'Poster', url: 'https://artifacts.rishia.in/research/ahuja2026retrieval/poster.pdf' },
      { label: 'Code & Data', url: 'https://github.com/RishiAhuja/ahuja2026retrieval' },
      { label: 'ICLR Virtual', url: 'https://iclr.cc/virtual/2026/10013856' },
      { label: 'TSALM Workshop', url: 'https://tsalm-workshop.github.io/' },
    ],
    bibtex: `@inproceedings{
  ahuja2026retrieval,
  title={Retrieval Mechanisms Surpass Long-Context Scaling in Time Series Forecasting},
  author={Rishi Ahuja and Kumar Prateek and Simranjit Singh and Dr Vijay Kumar},
  booktitle={1st ICLR Workshop on Time Series in the Age of Large Models},
  year={2026},
  url={https://openreview.net/forum?id=Qj96MlCmZw}
}`,
    primaryUrl: 'https://openreview.net/forum?id=Qj96MlCmZw',
    sameAs: [
      'https://openreview.net/forum?id=Qj96MlCmZw',
      'https://openreview.net/pdf?id=Qj96MlCmZw',
      'https://iclr.cc/virtual/2026/10013856',
      'https://github.com/RishiAhuja/ahuja2026retrieval',
    ],
  },
];
