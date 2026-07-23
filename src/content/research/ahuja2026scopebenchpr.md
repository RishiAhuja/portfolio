---
title: "Do LLM Reviewers Respect Scope? ScopeBench-PR: A Benchmark for Scope Fairness in Peer Review"
description: "Accepted at GlobalSouthAI @ IJCAI-ECAI 2026. A counterfactual benchmark for measuring whether LLM reviewers respect papers' stated geographic, linguistic, and empirical scope."
tldr: "ScopeBench-PR audits LLM peer reviewers for scope fairness using counterfactual prestige and language-of-study variants. Regional penalties are model-dependent, scope-aware prompting helps unevenly, and rebuttal often leaves a sticky score penalty."
abstract: "LLMs are increasingly used to draft, summarize, and audit peer reviews, but it remains unclear whether they evaluate papers against the claims those papers actually make. Hence, we study scope fairness, i.e., whether an LLM reviewer respects a paper's stated geographic, linguistic, and empirical scope, rather than penalizing it for not satisfying broader English-language, global, or multilingual defaults. It matters for those venues where many contributions are received covering underrepresented languages, communities, and deployment settings. In view of this, we introduce ScopeBench-PR, a counterfactual benchmark and audit pipeline that preserves each article's scientific spine while varying two axes of framing including institutional prestige and language of study. ScopeBench-PR contains 30 scientific papers, 4,204 LLM review runs, 4,898 matched score-robustness pairs, 25,588 scope-criticism items, 633 rebuttal-repair items, and a 500-item human validation study with four trained annotators requiring 240-250 trained annotator-hours. The observed result reveal three patterns: (i) regional language-of-study penalties are model-dependent rather than universal; (ii) scope-aware prompting reduces some penalties but does not reliably eliminate them; and (iii) rebuttal/meta-review can recognize unfair scope demands while leaving final scores only partially repaired. Furthermore, it suggests that LLM reviewer bias may operate less as explicit hostility and more as unequal standards of generality. Specifically, regional and low-resource work is sometimes judged by English or global expectations it never claimed to satisfy."
venue: "GlobalSouthAI @ IJCAI-ECAI 2026"
proceedings: "Accepted to GlobalSouthAI (IJCAI-ECAI 2026)"
status: "accepted"
sort_date: 2026-07-21
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
  announcement: "Accepted to GlobalSouthAI at IJCAI-ECAI 2026. I will present ScopeBench-PR in Bremen, Germany."
  label: "To be presented at"
  venue: "GlobalSouthAI @ IJCAI-ECAI 2026"
  location: "Bremen, Germany"
  start_date: "2026-08-17"
  end_date: "2026-08-17"
  url: "https://sites.google.com/view/globalsouthai-ijcai26/home"
  verified_links:
    - label: "GlobalSouthAI workshop"
      url: "https://sites.google.com/view/globalsouthai-ijcai26/home"
links:
  - label: "Workshop site"
    url: "https://sites.google.com/view/globalsouthai-ijcai26/home"
    primary: true
  - label: "GitHub"
    url: "https://github.com/RishiAhuja/ScopeBench-PR"
  - label: "Dataset (HF)"
    url: "https://huggingface.co/datasets/rishia2220/scopebench-pr"
primary_url: "https://sites.google.com/view/globalsouthai-ijcai26/home"
same_as:
  - "https://sites.google.com/view/globalsouthai-ijcai26/home"
  - "https://github.com/RishiAhuja/ScopeBench-PR"
  - "https://huggingface.co/datasets/rishia2220/scopebench-pr"
---
