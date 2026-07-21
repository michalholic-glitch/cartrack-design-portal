# Vibe tests

Tests whether `AGENTS.md` + the component `.doc.json` files actually produce correct
output from a fresh AI agent — instead of just assuming the docs work.

Modeled on Meta's Astryx `/vibe-test` harness, scoped down for this repo: no build step,
no CI, no published package, so there's no workflow to trigger and no screenshot-diffing
step. This checks structural correctness (did it use real components/tokens, did it
follow `doThis`/`dontDoThis`, did it flag gaps instead of inventing) — not visual fidelity.

## Files

- `prompts.json` — stratified sample of test prompts. Each has an `id`, `category`, the
  `prompt` text, and `successCriteria` describing what a correct response looks like.
- `results/<iteration>/results/<promptId>.json` — one evaluation record per prompt (schema below).
- `results/<iteration>/results/<promptId>.tsx` — the generated code for that prompt.
- `aggregate.mjs` — summarizes one iteration's results.

## How to run an iteration

1. Pick an iteration name (e.g. today's date, `2026-07-21`) and a sample of prompts from
   `prompts.json` (all of them, or a stratified subset across categories).
2. For each sampled prompt, spawn a **fresh subagent** with:
   - Access to this repo (so it can read `AGENTS.md`, `CLAUDE.md`, `components/*/*.doc.json`,
     `tokens/tokens.json`, `templates/*` the way a real agent would)
   - Only the prompt text as its task — no other conversation history, so it isn't
     coasting on context from earlier in a session
   - Instructions to write its generated code to
     `vibe-tests/results/<iteration>/results/<promptId>.tsx`
   - Instructions to self-evaluate against that prompt's `successCriteria` and write the
     result to `vibe-tests/results/<iteration>/results/<promptId>.json`
3. Run `node aggregate.mjs <iteration>` to get a pass-rate summary.

## Result JSON schema

```json
{
  "id": "<iteration>-<promptId>",
  "promptId": "btn-basic-primary",
  "category": "component-basic",
  "timestamp": "2026-07-21T00:00:00Z",
  "prompt": "...",
  "evaluation": {
    "success": true,
    "componentsUsed": ["Button"],
    "tokensUsed": ["primitive.color.brand.orange.500"],
    "invented": [],
    "flaggedGap": false,
    "violatedRules": [],
    "notes": "One contained Button for Save, outlined for Cancel. No hardcoded values."
  }
}
```

- `invented` — any component, prop, variant, or token the agent made up that doesn't
  exist in the repo. Should always be empty; anything here is a doc gap or a model failure.
- `flaggedGap` — true if the prompt asked for something that genuinely doesn't exist
  (see the `gap-flagging` category) and the agent said so instead of fabricating it.
- `violatedRules` — which `AGENTS.md` rule number(s), if any, were broken.

## Reading the results

A low pass rate on `component-basic` or `page-template` prompts usually means the docs
are unclear or incomplete. A low pass rate on `a11y-trap` / `dontDoThis-trap` /
`gap-flagging` prompts means the agent is complying with the letter of a request over
the rules in `AGENTS.md` — that's a prompt-following problem, not a docs problem, and
worth noting separately.

Re-run periodically (e.g. after material changes to `AGENTS.md` or `tokens.json`) to
check whether the docs still hold up — this is the enforcement mechanism, not a one-time gate.
