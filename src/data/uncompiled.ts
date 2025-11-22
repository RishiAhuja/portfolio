// Uncompiled - Philosophical writings and thoughts
export interface UncompiledEntry {
  date: string;
  title: string;
  slug: string;
  content: string;
}

export const uncompiledData: UncompiledEntry[] = [
  {
    date: '23 Nov 2025',
    title: 'The Horizon Effect (Why 100kg isn\'t enough)',
    slug: 'horizon-effect',
    content: `The gym teaches you something brutal about human nature: there is no "enough."

When I started lifting, 60kg felt impossible. Then I hit it. Then 80kg. Then 100kg. Each milestone felt like the summit—until I stood on it and realized I was still in the foothills.

This isn't about fitness. It's about the fundamental delusion of goal-setting. We think: "Once I achieve X, I'll be satisfied." But satisfaction is a moving target. The horizon retreats as you approach it.

The Stoics knew this. Seneca wrote about how the person who seeks happiness in achievement is like someone trying to catch their shadow—the faster you run, the faster it runs from you.

So what's the alternative? Maybe the point isn't to reach the horizon. Maybe it's to understand that the journey itself is the only destination that exists. The 100kg isn't the goal. The version of you that can lift 100kg—that's what matters.

And that version of you? They're already looking at 120kg.`
  },
  {
    date: '20 Nov 2025',
    title: 'Narcissism as a Utility Function',
    slug: 'narcissism-utility',
    content: `Here's an uncomfortable truth: every ambitious person is, at some level, a narcissist.

Not in the clinical sense. But in the sense that you believe your time, your ideas, your work matters more than the default. You believe you can build something that changes things. That's not humility—that's ego.

The question isn't whether you're narcissistic. The question is whether your narcissism is *useful*.

Useful narcissism builds. It ships products, writes code, creates value. It's directed outward—"I want to prove I can do this."

Useless narcissism performs. It tweets, virtue signals, optimizes for status. It's directed inward—"I want people to think I'm the kind of person who does this."

Marcus Aurelius, the most powerful man in the world, wrote his meditations not for publication, but for himself. That's useful narcissism. He believed his thoughts mattered enough to write them down, but not enough to broadcast them.

The modern world inverts this. We broadcast everything and examine nothing.

If you're going to be a narcissist—and you are, if you're reading this—at least be the useful kind.`
  },
  {
    date: '15 Nov 2025',
    title: 'The "Codeforces vs. Builder" Identity Crisis',
    slug: 'codeforces-builder-crisis',
    content: `There are two types of programmers, and they hate each other.

**Type 1: The Algorithm Monk**
They worship at the altar of Codeforces. They can implement a segment tree in their sleep. They think "real" programming is solving problems that have objective answers, clear constraints, and a leaderboard.

**Type 2: The Builder**
They ship products. They think in systems, users, and deployment pipelines. They look at algorithmic problems and think, "Who cares? When will I ever need to implement Dijkstra's algorithm in production?"

I've been both. And here's what I learned: they're both wrong.

The Algorithm Monk is training for a war that never comes. 90% of software engineering is duct-taping APIs together and fighting CORS errors. Optimal algorithms don't matter if your startup dies because you spent 3 months optimizing a search feature 10 people use.

But the Builder who dismisses algorithms entirely is building on sand. When your product scales, when the database starts choking, when the "it works on my machine" code meets 10,000 concurrent users—that's when you realize: fundamentals matter.

The answer isn't to choose. The answer is to hold both identities lightly.

Be the Algorithm Monk when you're learning. Be the Builder when you're shipping. And recognize that the identity crisis itself is the mark of someone who's thinking clearly.

The danger isn't being both. The danger is being neither.`
  },
  {
    date: '01 Nov 2025',
    title: 'Entropy and the Art of Maintenance',
    slug: 'entropy-maintenance',
    content: `Software rots. Codebases decay. Systems drift toward chaos.

This isn't a bug—it's thermodynamics. The second law of thermodynamics says entropy always increases. Order requires energy. Neglect guarantees disorder.

Your codebase is no exception.

Every dependency you don't update is a time bomb. Every "TODO: fix this later" is a lie. Every "it works, don't touch it" is entropy winning.

The Stoics understood this at a deeper level. Marcus Aurelius: "Confine yourself to the present." Not because the future doesn't matter, but because the present is where entropy is fought.

You can't fix six months of decay in one weekend. But you can spend 15 minutes today updating a dependency. You can refactor one function. You can write one test.

Maintenance isn't the opposite of creation. Maintenance *is* creation—the creation of sustainability.

The best programmers I know aren't the ones who write the most clever code. They're the ones who write code that future-them won't hate. They're the ones who understand that "done" means "maintained."

Entropy is undefeated. But you can slow it down. And in the long run, that's the only thing that matters.`
  }
];
