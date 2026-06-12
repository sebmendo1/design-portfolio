---
description: Pinned-stage scrollytelling case study component — scroll-driven choreography with converging artifact cards, crossfading headlines, and cluster organization beats. Use when building or modifying CaseStudyScrolly, adding a new case study config, or debugging scroll animation behavior.
---

# Pinned-Stage Scrollytelling Case Study

## What this is

A data-driven, scroll-scrubbed case study experience. A tall scroll track pins a full-viewport stage while `scrollYProgress` drives every animation. Headlines crossfade in place. Artifact cards scatter, converge into a central product frame, then re-emerge into labeled clusters. Everything scrubs forward and backward — no one-shot animations.

Interaction pattern inspired by pool.day's scrollytelling mechanic. **Only the motion pattern is replicated — all content, copy, imagery, and brand are the designer's own.**

---

## Stack

- React 18+ / Vite
- `framer-motion` (`motion` package): `useScroll`, `useTransform`, `useSpring`, `useReducedMotion`
- Plain CSS with custom property tokens — no Tailwind, no UI kit, no GSAP, no Lenis

---

## Core architecture rule

**This is a data-driven system.** One config object = one fully-rendered case study. Zero component changes between case studies.

---

## `CaseStudyConfig` type

```ts
type CaseStudyConfig = {
  slug: string;
  title: string;
  trackHeightVh: number;           // total scroll distance, e.g. 500
  stage: {
    centerpiece: {
      src: string;
      width: number;               // px at desktop, scaled responsively
      frame: "phone" | "browser" | "none";
    };
  };
  beats: Beat[];
  cards: ArtifactCard[];
  clusters: Cluster[];
};

type Beat = {
  id: string;
  headline: string;
  range: [number, number];         // progress window, e.g. [0, 0.25]
};

type ArtifactCard = {
  id: string;
  src: string;
  label?: string;
  seed: number;                    // drives deterministic PRNG params
  enterAt: number;                 // progress offset where card starts converging
  clusterId?: string;
};

type Cluster = {
  id: string;
  label: string;
  anchor: { x: number; y: number }; // percentage coordinates on stage
};
```

---

## Component tree

```
<CaseStudyScrolly config={...}>
  <ScrollTrack>           // div, height: config.trackHeightVh + "vh"
    <Stage>               // position: sticky; top: 0; height: 100dvh; overflow: hidden
      <Centerpiece />
      <HeadlineStack />   // all headlines absolutely stacked at same coords
      <CardField />       // all ArtifactCards absolutely positioned
      <ClusterLabels />
      <ProgressRail />    // thin vertical indicator + beat markers
    </Stage>
  </ScrollTrack>
</CaseStudyScrolly>
```

---

## Scroll plumbing (do it exactly this way)

```ts
// One scroll source at the top of CaseStudyScrolly
const { scrollYProgress } = useScroll({
  target: trackRef,
  offset: ["start start", "end end"],
});

// One spring — every animated element derives from this, never raw scroll
const smooth = useSpring(scrollYProgress, {
  stiffness: 100,
  damping: 30,
  restDelta: 0.001,
});

// Segment helper — remap a sub-range to 0→1 with clamping
function segment(progress: MotionValue<number>, from: number, to: number) {
  return useTransform(progress, [from, to], [0, 1], { clamp: true });
}
```

**Rule:** No element reads `scrollYProgress` directly. All animations use `smooth` via `useTransform`. Do not stack additional springs per card.

---

## Motion choreography

### Headlines

- All absolutely positioned at identical coordinates (upper third on desktop, centered on mobile).
- Layout never shifts — headlines stack in place, not in document flow.
- Per-beat animation (beat `i` with range `[a, b]`):
  - `opacity`: 0→1 over `[a, a+0.06]`, hold, 1→0 over `[b-0.06, b]`
  - `y`: 24px→0→-24px across the beat window
  - `filter`: `blur(6px)`→`blur(0px)`→`blur(6px)`
- Use a large display typeface (portfolio brand tokens). Max width ~14ch, `text-wrap: balance`.

### Card field (the signature mechanic)

**Deterministic randomness from `seed`** — use a mulberry32-style PRNG so layout is stable across renders:

```ts
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

Each card gets from its seed: scatter position (ring radius 30–48% of stage), rotation (-10°…+10°), scale (0.85–1.05), z-index, parallax factor (0.8–1.2).

**Beat 1 — scatter:** Cards drift at scatter positions with slow y-parallax (`parallaxFactor * scroll * smallMultiplier`). Ambient, alive.

**Beat 2 — convergence ("suction"):** Each card interpolates x/y → centerpiece center over `[card.enterAt, card.enterAt + 0.12]`. Scale to ~0.3, opacity to 0 as it "enters" the frame. Stagger `enterAt` values so cards arrive in 3–4 overlapping waves.

**Beat 3 — clustering:** Cards with `clusterId` re-emerge and interpolate to their cluster's `anchor` (percentage-to-px via ResizeObserver on stage). Each card in a cluster offsets 6–10px and rotates ±4°. Cluster labels fade in when first card of the cluster lands.

**Beat 4 — payoff:** Clusters scale to 1.02 and settle. Final headline states metrics. Optional hero metric card scales center-stage.

**Rotation rule:** Rotation eases toward 0 as any card approaches its target (scatter → convergence, scatter → cluster). Things "straighten out" when they get organized.

---

## Performance rules (non-negotiable)

- Animate **only** `transform` and `opacity`. Never animate top/left/width/height/margin.
- `will-change: transform` on cards and centerpiece only — not on static elements.
- Cap simultaneous moving cards at ~12 desktop, ~6 mobile.
- Cards outside their active progress range: render at resting transform, no live subscriptions doing work.
- All artifact images: explicit `width`/`height`, `loading="lazy"` (except centerpiece).
- No layout property reads inside transform callbacks (causes layout thrash).

---

## Responsive strategy

- All stage positions in percentage coordinates, converted to px via ResizeObserver on the stage element.
- Never duplicate layout logic per breakpoint — one implementation scales.
- Mobile (<768px): render subset of cards (mobile-flagged or first N per cluster), shrink travel distances ~40%, center headlines, use `100dvh`.
- Tablet: same as desktop with scaled centerpiece.

---

## Accessibility & escape hatches

```tsx
const shouldReduce = useReducedMotion();

if (shouldReduce) {
  // Render static stacked layout — beats become normal sections
  // headline + static grid of that beat's artifacts
  // Identical content, zero pinning
}
```

- Headlines are real `<h2>` elements in DOM order.
- Stage is **not** `aria-hidden`.
- Persistent "Skip to outcomes" anchor link at top of track.
- ProgressRail beat markers are clickable — each scrolls to `trackOffset + beat.range[0] * trackHeight`.
- Keyboard (space/arrows) drives the experience identically to pointer scroll.

---

## Visual tokens (establish before building)

Define in CSS custom properties:
- 4–6 named palette colors from portfolio brand
- Display typeface + body typeface with real personality (not default Inter)
- Card treatment: rounded 12–16px corners, 1px hairline border, layered shadow that deepens while card is in motion and flattens when settled (motion state is legible through shadow)
- Centerpiece: minimal frame, no skeuomorphic excess

---

## Four-beat demo config (AI home-lending case study)

```ts
const aiLendingConfig: CaseStudyConfig = {
  slug: "ai-lending",
  title: "AI Home Lending Workspace",
  trackHeightVh: 500,
  stage: {
    centerpiece: {
      src: "/assets/lending-ui.png",
      width: 480,
      frame: "browser",
    },
  },
  beats: [
    {
      id: "problem",
      headline: "Loan officers were drowning in 14 disconnected tools.",
      range: [0, 0.22],
    },
    {
      id: "research",
      headline: "We watched 30 hours of real workflows to find what actually mattered.",
      range: [0.22, 0.48],
    },
    {
      id: "solution",
      headline: "One agentic workspace, organized around the borrower.",
      range: [0.48, 0.75],
    },
    {
      id: "payoff",
      headline: "Cycle time down 38%. Adoption in 6 weeks.",
      range: [0.75, 1.0],
    },
  ],
  cards: [
    // seeds spread across range; enterAt staggered in 4 waves
    { id: "c1", src: "/assets/sticky-1.png", label: "Workflow map", seed: 1, enterAt: 0.24, clusterId: "research" },
    { id: "c2", src: "/assets/screen-1.png", label: "Current tool #1", seed: 2, enterAt: 0.26, clusterId: "research" },
    { id: "c3", src: "/assets/screen-2.png", label: "Current tool #2", seed: 3, enterAt: 0.28, clusterId: "research" },
    { id: "c4", src: "/assets/flow-1.png",   label: "Decision flow",  seed: 4, enterAt: 0.30, clusterId: "flows" },
    { id: "c5", src: "/assets/flow-2.png",   label: "Edge case flow", seed: 5, enterAt: 0.32, clusterId: "flows" },
    { id: "c6", src: "/assets/ui-1.png",     label: "Borrower view",  seed: 6, enterAt: 0.34, clusterId: "shipped" },
    { id: "c7", src: "/assets/ui-2.png",     label: "Pipeline view",  seed: 7, enterAt: 0.36, clusterId: "shipped" },
    { id: "c8", src: "/assets/metric-1.png", label: "Cycle time −38%",seed: 8, enterAt: 0.38, clusterId: "impact" },
    { id: "c9", src: "/assets/sticky-2.png", label: "Interview notes", seed: 9, enterAt: 0.25 },
    { id: "c10",src: "/assets/sticky-3.png", label: "Opportunity map", seed: 10, enterAt: 0.27 },
    { id: "c11",src: "/assets/screen-3.png", label: "Current tool #3", seed: 11, enterAt: 0.29 },
    { id: "c12",src: "/assets/ui-3.png",     label: "Agent surface",   seed: 12, enterAt: 0.35, clusterId: "shipped" },
  ],
  clusters: [
    { id: "research", label: "Discovery",   anchor: { x: 18, y: 30 } },
    { id: "flows",    label: "Flows",       anchor: { x: 82, y: 30 } },
    { id: "shipped",  label: "Shipped UI",  anchor: { x: 18, y: 70 } },
    { id: "impact",   label: "Impact",      anchor: { x: 82, y: 70 } },
  ],
};
```

---

## Acceptance criteria checklist

Before presenting any implementation, verify all of these:

- [ ] Scroll down then back up: every element scrubs forward and reverse with zero pops or layout shifts
- [ ] Headlines never move the layout; they crossfade in place
- [ ] Cards converge in visible staggered waves, rotation straightening as they approach targets
- [ ] Clusters form with labels in beat 3; outcome metric lands in beat 4
- [ ] `prefers-reduced-motion` renders the full static fallback with all content visible
- [ ] 60fps with DevTools performance panel showing no purple (layout) work during scroll
- [ ] Works at 375px, 768px, and 1440px widths
- [ ] New case study = new config object only; zero component changes required

---

## Common mistakes to avoid

- Reading `scrollYProgress` directly in any animated element (always go through `smooth`)
- Stacking extra springs on individual cards (the single top-level spring is sufficient)
- Using `whileInView` for stage elements (breaks reverse scrubbing)
- Animating layout properties like `top`, `left`, `width` (kills performance)
- Hardcoding pixel positions instead of percentage-of-stage coordinates (breaks responsive)
- Forgetting `will-change: transform` removal from static elements (wastes compositing layers)
- Forgetting the reduced-motion static fallback (accessibility requirement)
