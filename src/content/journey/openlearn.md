---
title: "Building OpenLearn"
subtitle: "the complete journey of developing a modern cohort-based educational platform"
description: "The story behind OpenLearn — a production-grade platform built for scalable, structured, and role-based education. This chapter traces how the first real version came to life in less than a week."
publishedDate: 2025-07-24
tags: ["TypeScript", "Express", "PostgreSQL", "Prisma", "Docker", "Render", "NeonDB"]
category: "project"
projectId: "openlearn"
eventId: "timeline-13 Jun 2025"
---

## chapter 1

The idea for OpenLearn started in a casual conversation with a friend from IIT Kanpur. We discussed how seniors could actively involve juniors in real projects, creating a space where learning happens through doing. That evolved into something much bigger, a cohort-based, role-driven learning model built around structure, progress, and autonomy. This was the very first webpage that captured that early version.

**[Initial webpage for OpenLearn](https://openlearnnitj.web.app/)**

We wanted OpenLearn to focus on practical domains like finance and machine learning. The ones that don't get enough attention in traditional classrooms. To test the idea, we launched ML Fest, a 3-day college-wide event. The turnout, retention, and response told us we were onto something real.

<!-- Note: Carousel images would go here in a custom component -->

The success of the event gave us momentum. On June 9, 2025, we held an offline orientation at NIT Jalandhar. Over 70 students attended, and the first OpenLearn cohort was officially live.

We could have managed everything on WhatsApp and Google Sheets. But we knew we needed to build it the right way — a real system with logins, access control, learning paths, submissions, and real-time progress tracking. Two of us sat through the night and built it. OpenLearn was coded, tested, and deployed in under half a week.

The backend was built with TypeScript, Express.js, and Prisma, running on PostgreSQL. Over 25 tables were designed, 100+ endpoints written, all containerized with Docker. We used Render for deployment, NeonDB for the database, and Vercel for the frontend.

**[OpenLearn live platform](https://openlearn.org.in/)**

**[OpenLearn GitHub](https://github.com/openlearnnitj/)**

Everything ran smoother than expected. The platform handled live traffic from 120+ users, with a complete status system, zero downtime, and full observability from day one.

**[OpenLearn Status Page](https://api.openlearn.org.in/status-page)**

Eventually, we hit NeonDB's free-tier limits. But even that didn't break us. We migrated the entire system — data, users, progress — to a new PostgreSQL instance with zero downtime. It was the first major incident, and it proved the resilience of the system.

To scale properly, we moved to a self-managed EC2 server. We hardened the deployment, added Redis caching, wrote CI/CD pipelines, and added a real health monitoring layer. Now, OpenLearn runs on a stable, high-performance infrastructure built for real education at scale.

Looking back, the only reason this came together was because we had a small, high-agency, high-vision team. That's what it takes. Not just code, not just deadlines, clarity of purpose and people who execute.

We are now preparing for our biggest project yet — a large-scale, nationwide college hackathon powered by OpenLearn. The announcement will be coming soon.

This is just chapter 1. More stories from behind the scenes are coming soon.
