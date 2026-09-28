---
name: scannable-case-studies
description: Use this when writing, rewriting, or tightening a product design portfolio case study (or its summary card, TL;DR, captions, or metrics) so it's short, scannable, and impact-first for hiring managers.
---

# Scannable portfolio case studies

Goal: a hiring manager should get the case study in 30 seconds and believe it in 3 minutes. The page earns the interview; depth belongs in the interview.

## In this repo

- Content lives in `src/data/caseStudies/<slug>.ts`, typed by `src/data/caseStudies/types.ts`, and renders through `src/components/CaseStudyTemplate/`. Register new studies in `src/data/caseStudies/index.ts`.
- Template fields map to the default template below: `title` (claim) · `meta` (role, team, timeline, platform, status) · `tldr` (≤60 words + one key result) · `context` (why it was hard) · `decisions` (2–3, each with `alternative` and `tradeoff`) · optional `behavior` (AI state map) · optional `shipped` (gallery) · `result` · optional `reflection`.
- Every number or fact the designer has not supplied gets a `// TODO(seb): verify` comment in the content source. Numbers only the designer can supply stay out of the rendered page; list them as `[TK]` in the PR or draft notes instead of guessing.
- Verified numbers live in `VERIFIED_IMPACT` (`src/data/profile.ts`). Match titles, dates, and scope to `PROFILE_ROLES`.
- The older scroll-driven layout is documented in `.claude/skills/scrollytelling-case-study/`; it is now only a fallback for slugs without structured content.

## 1. Principles

- **Conclusion first.** Outcome, role, and product go at the top. Why: 79% of users in NN/g's study scanned pages rather than reading them.
- **Decisions over process.** Show 2–3 calls, the alternatives, and what you gave up. Why: everyone's process looks alike, and judgment is what gets evaluated.
- **Headlines carry the story.** Someone reading only the headlines and captions should get the whole argument. Why: that is all most readers will see.
- **Visuals do the lifting, captions make the point.** Why: skimmers jump to images first.
- **Proof over adjectives.** Use numbers with baselines, shipped status, and adoption. Why: in NN/g's testing, objective wording beat promotional wording, and inflated metrics cost trust.
- **Cut until it hurts.** Why: restraint signals seniority, and short pages get finished.
- **Make ownership clear.** "I" for what you did, "we" for the team. Why: a vague "we" hides your level.

## 2. Default template

| # | Section | Words | Must answer |
|---|---|---|---|
| 0 | Homepage card | Title ≤12, line ≤25 | What changed, for whom? One strong visual or a short looping video. |
| 1 | Hero / TL;DR | ≤60 + meta row | Title = the outcome as a claim. Meta: role · team · timeline · platform · status (shipped/pilot/concept). 2–3 sentences: problem → what I did → result. One hero visual, or video if it's interactive. |
| 2 | Context: why it was hard | 40–80 | What was at stake, and which constraint (technical, regulatory, org, time) shaped everything? |
| 3 | Decisions ×2–3 | 60–120 each | Claim headline. What were the options? What did I pick, and why? What tradeoff did I accept? Each decision gets a visual, ideally one rejected option next to the shipped one. |
| 4 | Result | 40–80 | Metrics with baselines, or shipped status plus qualitative proof. What happened next (adoption, reuse)? |
| 5 | Reflection (optional) | 30–60 | One specific thing I'd change, or what comes next. |

Body total: 400–750 words, hard cap about 900. Put anything longer behind a "Deep dive" link or save it for the interview.

Visuals: 4–8, roughly one for every 80–120 words. Use motion for anything interactive.

Order can flex to fit the story, but the outcome still comes first and the decisions stay explicit.

## 3. Tests (run both before delivering)

**30-second skim test.** Read only the title, meta row, TL;DR, headlines, captions, and bold numbers. From those alone, answer:

- What is the product, and who uses it?
- What did this designer personally own?
- What changed, and how do we know?
- Why was it hard?

If any answer is missing, fix the headlines and TL;DR, not the body.

**3-minute read test.** A full read should show:

- 2–3 decisions, each with a real alternative and a named tradeoff
- evidence behind every claim
- no paragraph that could be pasted unchanged into someone else's case study

**Outline test.** List the headlines on their own. They should read as a coherent argument, not as "Overview / Research / Ideation / Solution".

## 4. Intake questions

Ask all of these in one batch before drafting. If questions 1–5 can't be answered, draft with [TK] placeholders and never fill the gaps with guesses.

1. Product and user in one sentence. Can the company be named, or do you need an NDA-safe descriptor ("a top-5 US bank")?
2. Your role: title, what you owned end to end, team makeup, timeline, and your share of the work.
3. The hard part: which constraint shaped the solution most?
4. Decisions: your 2–3 biggest calls. Options considered, the choice, why, and what you gave up.
5. Outcome: Did it ship, and when and where? For each metric: value, baseline, timeframe, source, and whether it's measured or estimated. Any quotes, adoption, or reuse elsewhere?
6. Visuals available: final UI, video or prototype, before/after, rejected explorations, system diagrams.
7. NDA: what must be renamed, blurred, or left out? Which numbers are cleared to publish?
8. Target: which role or company is this for, and what should the reader conclude about you?

## 5. Metrics honesty

- Never invent, round up, or extrapolate a number. Flag any number the designer didn't supply.
- Give every metric its value, direction, baseline, timeframe, and scope. For example: "Drop-off 18% → 9% in the application flow, first 90 days after launch."
- Label confidence next to the number: measured, estimated, or directional (a pilot, or a usability test with n=8).
- Be honest about attribution. Write "contributed to" when other teams also moved the metric.
- Under NDA, use relative change, ranges, or qualitative proof, and only with approval.
- No metrics? Use shipped status, scale ("live on iOS and Android"), adoption ("became the pattern for 3 other teams"), or a real quote.
- Leave out any number the designer can't defend in an interview.

## 6. Writing rules

- Use claim headlines, not labels. "The problem" becomes "People trusted the answer but not the source." A small label eyebrow above the claim is fine.
- One idea per paragraph, 1–3 sentences, with the point in the first sentence.
- Captions argue. Say what changed and why, in 25 words or fewer. "Final screen" is not a caption.
- Active voice, first person for your own actions.
- Plain words. Cut: leveraged, seamless, delightful, holistic, robust, user-centric, empower, "crafted meaningful experiences."
- Cut process theater: personas, empathy maps, double-diamond diagrams, method montages, sticky-note walls, tool lists, "I learned so much." Research gets one sentence: the insight that changed the design.
- Use numerals and bold at most one key number per section.
- Match the CV and LinkedIn on titles, dates, and scope.

## 7. AI and agent product case studies

Show that you can design around uncertainty, latency, errors, and trust. Evidence beats "AI-native" labels.

- Show behavior, not static screens. Use a short video or live prototype of a real exchange, including a turn where the model is wrong or unsure.
- Show the state map: idle → thinking/streaming → partial → success → low confidence → can't/won't → error/timeout → human handoff.
- Show the boundary. What can the agent do? What must it never do? How does it hand off, and does the context travel with it? The handoff is often the real design work.
- Show user control: correct, undo, override, steer, and see sources or reasoning.
- Say how quality was judged in one or two sentences: eval set, rubric, red-teaming, pilot transcripts.
- State your layer honestly: conversation design, prompts, tool definitions, evals, prototype code.
- Use AI metrics only if they're real: task success, resolution or containment, handoff rate, correction rate, latency.
- Skip speculative redesigns of famous AI products. They're a weak signal next to shipped or honestly scoped work.

## 8. Before / after (fictional example)

Invented project for illustration: an invoice assistant in a small-business accounting app.

**Before (typical):**

> Overview. In this project I worked on the invoicing experience. We followed the double diamond process, starting with user research. We interviewed 12 users and created three personas... After many iterations we delivered a seamless AI-powered experience that delighted users and improved efficiency.

**After:**

> **Title:** An assistant that drafts invoices, and makes every draft quick to check
> **Meta:** Lead product designer · PM + 4 engineers · 5 months · Web · Shipped [TK month, year]
> **TL;DR:** Owners were losing evenings to invoicing. I designed an assistant that drafts invoices from past jobs and flags every field it's unsure about. [TK]% of invoices now start as drafts, and median time-to-send fell from [TK] to [TK] minutes (measured, first 60 days).
>
> **Decision headline:** Flag uncertainty inline instead of asking for confirmation
> We tested a confirm-everything modal against inline flags. People clicked straight through the modal. Inline flags on low-confidence fields kept review under a minute. The tradeoff: fewer fields auto-filled at launch.
>
> **Caption:** Low-confidence fields get a dotted underline and link to the job they came from. One click accepts; typing overrides.

[TK] marks numbers only the designer can supply.

## 9. Deliverable format

Return:

- The homepage card
- The page draft, following the template
- A shot list with a caption for each visual
- Open [TK] items and flagged numbers
- The skim-test answers, so the designer can check the page communicates what they intend

## 10. Final QA checklist

- [ ] Title states an outcome or claim in ≤12 words
- [ ] Role, team, timeline, and status are visible above the fold
- [ ] TL;DR is ≤60 words and covers problem → action → result
- [ ] Headlines alone tell the story (outline test)
- [ ] 2–3 decisions, each with an alternative and a tradeoff
- [ ] Every visual has an argumentative caption; interactive work uses motion
- [ ] Every number came from the designer and carries baseline, timeframe, and confidence
- [ ] "I" and "we" are used precisely
- [ ] No process theater and no banned words; paragraphs ≤3 sentences
- [ ] Body ≤750 words (hard cap ~900)
- [ ] NDA review done
- [ ] AI work shows at least one failure state and the handoff
- [ ] Passes the 30-second and 3-minute tests
- [ ] Homepage card, page, and CV tell the same story

## Appendix: patterns from strong portfolios and sources

**Portfolios**

- Jenny Wen (jennywen.ca): the portfolio is a dated log. Each entry is 1–2 sentences stating her role and what shipped, linked to the live product. Maximum signal, minimum words.
- Ed Chao, Dropbox mobile redesign (thatedchao.com/published/2018/03/09/dropbox-mobile-redesign): one scope sentence ("I led the redesign…"), then a claim headline per change ("Rapid retrieval with a simpler home"), each backed by one short paragraph with the insight behind it. About 500 words.
- Emil Kowalski, "Building a toast component" (emilkowal.ski/ui/building-a-toast-component): the adoption proof is in the first sentence. Each section is a decision with a live demo. It closes with "Why is Sonner successful?"
- Rauno Freiberg (rauno.me/craft): video-first craft posts. His essay "What will you ship?" names the north stars and what the team refused to build ("if an animation… felt pompous… we didn't build it").
- Paco Coursey (paco.me/craft): each item is a one-line claim plus a working demo.
- Marissa Cui (marissacui.com): project cards of 2–3 sentences, each naming her role ("the only designer") and the outcome (conversion, growth, savings).
- Karri Saarinen, Airbnb DLS (karrisaarinen.com/dls/): short labeled sections covering goal, key decision, and adoption. Deeper writing sits behind links.
- Marco Cornacchia (marco.fyi): embeds interactive prototypes instead of static mocks (featured in Figma's portfolio roundup).

**Guidance**

- NN/g, "How Users Read on the Web": 79% of users scan; concise text scored 58% better on usability, scannable layout 47%, objective wording 27%. Recommends the inverted pyramid and one idea per paragraph. nngroup.com/articles/how-users-read-on-the-web/
- Tobias van Schneider, "The portfolio case study is broken": start from a 300-character paragraph; visuals do "90% of the heavy lifting"; build around the story, not a template. vanschneider.com/blog/portfolio-tips/the-old-case-study-is-not-working/
- Open Doors: "Hiring managers do not read your case studies. They skim them," plus a 30-second recall test (2025). Generic process headings "say nothing," and AI should appear "as evidence," not a label (2026). blog.opendoorscareers.com
- UX Companion (2026): a 3–4 sentence hero summary, a decisions section as the heart, honest outcomes; flags "Inflated metrics" with no baseline. uxcompanion.co.uk/ux-portfolio-examples
- Linear, "How we hire" (2026): they look for craft, judgment, ownership, and clarity ("You don't hide weak ideas behind complexity"). Designers walk through past work "and the tradeoffs behind it." linear.app/now/how-we-hire-at-linear
- Anna Nerz: about 3 minutes per candidate; she skims, then opens the project closest to her business. annanerz.substack.com/p/how-i-actually-screen-for-design
- Google PAIR, "Errors + Graceful Failure": give users paths forward and return control to them. This is the basis for showing failure and handoff states. pair.withgoogle.com/chapter/errors-failing/
- UX Collective, "The case study factory": templated bootcamp structures leave case studies that "feel complete, but few feel smart." essays.uxdesign.cc/case-study-factory/
