---
title: "ICFD-31k: A Large-Scale Dataset and Benchmark for Real-Time Conversational Fraud Detection"
description: "Accepted at IJCAI-ECAI 2026 main conference special track. A large-scale Indian bilingual fraud-call benchmark with streaming labels and rationales."
tldr: "ICFD-31k introduces 31,000+ Indian English/Hinglish fraud-call transcripts with chunk-level streaming labels and slow-thinking rationales, plus RoBERTa baselines that reach 99.40 F1 in-domain and 92.97 F1 on unseen scam types."
abstract: "The proliferation of sophisticated telephone scams poses a significant societal and economic threat, impacting diverse linguistic contexts in a country like India. Furthermore, the lack of large-scale, publicly available datasets remains a critical barrier impacting research on robust, real-time countermeasures. In view of this, the proposed work introduces ICFD-31k, the first Indian Conversational Fraud Dataset, representing a new benchmark containing over 31,000 realistic conversational transcripts. ICFD-31k comprises systematically generated content, covering 10 distinct fraud umbrellas spanning from financial impersonation to job scams. ICFD-31k transcripts feature rich annotations comprising a final verdict, chunk-level streaming labels, and detailed slow-thinking rationales. In addition, the human-in-the-loop evaluation validates the ICFD-31k's quality, achieving a Cohen's Kappa of 0.534 that confirms annotation reliability. Furthermore, the proposed work introduces two fine-tuned models based on RoBERTa: M1 for non-streaming data and M2 for streaming data. The comprehensive experiments with strong baselines (M1, M2) further demonstrate the ICFD-31k's utility."
venue: "IJCAI-ECAI 2026 Special Track (Main Conference)"
proceedings: "Accepted to IJCAI-ECAI 2026"
status: "accepted"
status_label: "Accepted Apr 30, 2026"
sort_date: 2026-04-30
authors:
  - name: "Rishi Ahuja"
    is_me: true
    profile: "https://openreview.net/profile?id=~Rishi_Ahuja1"
  - name: "Kumar Prateek"
    profile: "https://openreview.net/profile?id=~Kumar_Prateek1"
  - name: "Simranjit Singh"
    is_corresponding: true
    profile: "https://openreview.net/profile?id=~Simranjit_Singh4"
affiliation_note: "Department of Information Technology, Dr. B.R. Ambedkar National Institute of Technology Jalandhar"
event:
  announcement: "Accepted to the IJCAI-ECAI 2026 main conference special track. Presentation scheduled in Bremen, Germany (Aug 15-21, 2026)."
  label: "To be presented at"
  venue: "IJCAI-ECAI 2026"
  location: "Bremen, Germany"
  dates_label: "Aug 15-21, 2026"
  start_date: "2026-08-15"
  end_date: "2026-08-21"
  url: "https://2026.ijcai.org/"
  verified_links:
    - label: "IJCAI-ECAI 2026 venue"
      url: "https://2026.ijcai.org/"
links:
  - label: "Conference site"
    url: "https://2026.ijcai.org/"
    primary: true
primary_url: "https://2026.ijcai.org/"
same_as:
  - "https://2026.ijcai.org/"
---

## Highlights

- 31,000+ realistic conversational transcripts built for the Indian fraud landscape.
- Bilingual coverage across English and Hinglish, including code-switching patterns.
- Chunk-level streaming labels for real-time fraud detection experiments.
- Slow-thinking rationales for explainability and auditability.
- RoBERTa baselines for both static and streaming settings.

## Why it matters

Most fraud-detection datasets either focus on transactions, emails, or monolingual contexts. This paper pushes toward a more deployable benchmark for live call settings, where the hard part is not just classification, but early intervention under incomplete context.

## Release note

I will add camera-ready metadata and any public artifacts here once the final proceedings and release flow are ready.
