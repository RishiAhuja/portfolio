---
title: "Retrieval Mechanisms Surpass Long-Context Scaling in Time Series Forecasting"
description: "Published at the ICLR 2026 TSALM Workshop. A paper arguing that selective retrieval beats brute-force long context in time-series forecasting."
tldr: "Long contexts hurt time series forecasting by adding noise (inverse scaling, >68% worse at 3k steps), while selective retrieval (RAFT) beats them with lower MSE (0.379 vs 0.647) and less compute - future TSFMs should embed retrieval instead."
abstract: "Time Series Foundation Models (TSFMs) have borrowed the long context paradigm from natural language processing under the premise that feeding more history into the model improves forecast quality. But in stochastic domains, distant history is often just high-frequency noise, not signal. Hence, the proposed work tests whether this premise actually holds by running continuous context architectures (PatchTST included) through the ETTh1 benchmark. The obtained results contradict the premise: an inverse scaling law shows up clearly, with forecasting error rising as context gets longer. A 3,000-step window causes performance to drop by over 68%, evidence that attention mechanisms are poor at ignoring irrelevant historical volatility. Retrieval-Augmented Forecasting (RAFT) is evaluated as an alternative. RAFT achieves a mean squared error (MSE) of 0.379 with a fixed 720-step window and selective retrieval, well below the 0.647 MSE of the best long-context configuration despite requiring far less computation. In addition, the retrieval step injects only the most relevant historical segments as dynamic exogenous variables, which gives the model a context-informed inductive bias it cannot build on its own from raw sequences. Therefore, foundation models going forward need to shift architecturally toward selective retrieval."
venue: "1st ICLR Workshop on Time Series in the Age of Large Models"
proceedings: "ICLR 2026"
status: "published"
sort_date: 2026-03-02
published_date: 2026-03-02
authors:
  - name: "Rishi Ahuja"
    is_me: true
    profile: "https://openreview.net/profile?id=~Rishi_Ahuja1"
  - name: "Kumar Prateek"
    profile: "https://openreview.net/profile?id=~Kumar_Prateek1"
  - name: "Simranjit Singh"
    is_corresponding: true
    profile: "https://openreview.net/profile?id=~Simranjit_Singh4"
  - name: "Vijay Kumar"
    profile: "https://openreview.net/profile?id=~Dr_Vijay_Kumar1"
affiliation_note: "Department of Information Technology, Dr. B.R. Ambedkar National Institute of Technology Jalandhar"
award: "$2,025 ICLR travel grant"
event:
  announcement: "Recently presented this work as an ICLR 2026 TSALM Workshop poster. Received a $2,025 ICLR travel grant."
  label: "Presented poster at"
  venue: "ICLR 2026 Workshop (TSALM)"
  location: "Rio de Janeiro, Brazil"
  start_date: "2026-04-26"
  end_date: "2026-04-27"
  url: "https://iclr.cc/Conferences/2026"
  verified_links:
    - label: "ICLR 2026 venue"
      url: "https://iclr.cc/Conferences/2026"
    - label: "workshop dates"
      url: "https://iclr.cc/Conferences/2026/Dates"
    - label: "paper forum"
      url: "https://openreview.net/forum?id=Qj96MlCmZw"
links:
  - label: "OpenReview"
    url: "https://openreview.net/forum?id=Qj96MlCmZw"
    primary: true
  - label: "Poster"
    url: "https://artifacts.rishia.in/research/ahuja2026retrieval/poster.pdf"
  - label: "Code & Data"
    url: "https://github.com/RishiAhuja/ahuja2026retrieval"
  - label: "ICLR Virtual"
    url: "https://iclr.cc/virtual/2026/10013856"
  - label: "TSALM Workshop"
    url: "https://tsalm-workshop.github.io/"
bibtex: |
  @inproceedings{
    ahuja2026retrieval,
    title={Retrieval Mechanisms Surpass Long-Context Scaling in Time Series Forecasting},
    author={Rishi Ahuja and Kumar Prateek and Simranjit Singh and Dr Vijay Kumar},
    booktitle={1st ICLR Workshop on Time Series in the Age of Large Models},
    year={2026},
    url={https://openreview.net/forum?id=Qj96MlCmZw}
  }
primary_url: "https://openreview.net/forum?id=Qj96MlCmZw"
same_as:
  - "https://openreview.net/forum?id=Qj96MlCmZw"
  - "https://iclr.cc/virtual/2026/10013856"
  - "https://github.com/RishiAhuja/ahuja2026retrieval"
---