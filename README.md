# Crestline · Grey Infra case study

A standalone marketing site. One scrolling page telling how we found 12.2 crore
trapped inside an EPC contractor's own ERP, where it was going, and what changed.

Next.js 16 (App Router, Turbopack) · React 19 · TypeScript strict · Tailwind v4 ·
Apache ECharts 5. One static route. **Light theme only** — there is no dark mode and no
`prefers-color-scheme` block; every colour is painted explicitly so the page holds its
own ground whatever theme the reader's browser is in.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static export into out/
```

`next.config.ts` sets `output: "export"`, so the build is plain files — deploy it to
Vercel, Netlify, S3 or any static host. Nothing runs on a server and nothing touches a
database.

## One page, three chapters

It is a single continuous scroll. There is no navbar. The document outline lives
in a sticky rail down the right (`components/shell/outline-rail.tsx`): chapters
are always listed, the one being read opens to show its sections, and a gradient
thread fills as the reader descends. Below 1280px the rail drops away and the
progress becomes a hairline across the top of the viewport.

The masthead sits inside the sheet, top left, the way a report is signed. The
mark is a vector traced from `public/crestline-logo.png` rather than the bitmap
itself, so it stays sharp at any size and takes the ink colour around it.

`lib/outline.ts` is the single list of anchors, read by both the page (which
stamps the ids) and the rail (which follows them), so the rail can never point at
a section the page no longer has.

| Chapter | The beat |
|---|---|
| `#found` What we found | The client pays in 45 days, the vendors in 28. The cycle drawn to scale, the funding trough, which projects eat the capital. |
| `#leaked` Where it leaked | Every vendor paid before the client. Terms against what actually happened. Contract to cash. A live simulator. |
| `#changed` What we changed | Process discovered from the event log, bottlenecks ranked by money, before against since, and the loop that closes a ticket on evidence. |

Each beat runs in the same order: the problem, then what it is now, then a `How?`
rule, then the chart that proves it. Everything sits on one rounded sheet so the
page reads as a document rather than a dashboard.

Copy is first person throughout ("we found", "we cut"), and carries no dashes as
punctuation, matching the product's own house rule.

## Where the figures come from

Every number in `lib/data.ts` was extracted from Grey Infra's live Postgres through
Crestline's own `repository → derive → view-model` layer, so each one is a figure the
product itself prints. Nothing is authored, rounded for effect or back-solved to a
target. To refresh it, run `scripts/extract-case-study.ts` in the main Crestline repo
and copy the figures across.

Two rules the copy holds to, the same ones the product holds to:

- **Measured and target are labelled separately and never summed.** The ₹12.2 Cr
  release is the cycle simulator run at terms already present in the contracts — a
  target, and the target each commitment is closed against. Vendor carry, process
  waste, overdue and the before/since figures are measured.
- **A null is never a zero.** Where a source could not supply something it reads NA.

`lib/simulate.ts` is a port of the product's own `lib/finance/cycle-simulation.ts` and
is **verified against it**: all six projects reproduce the product's released-cash and
cycle figures to within rounding. It is pure — no clock, no I/O — and the sliders stop
where the evidence stops: certification cannot go below the contract's window,
collection below the term the client signed, and vendor credit cannot exceed what the
vendors themselves agreed. Cash can never be released by paying late.

## Layout

```
app/
  layout.tsx          fonts, header, the soft aura behind the top of every page
  globals.css         Tailwind v4 @theme tokens — one light palette, no dark block
  page.tsx            01 The position
  leaks/page.tsx      02 The leaks
  execution/page.tsx  03 Execution
components/
  charts/             one file per chart, each a client component over ECharts
  charts/echart.tsx   the single mount point: init, resize, dispose
  sections/           tables and the operating loop
  ui/                 primitives, pills, verdict rows
  shell/              the sticky header
lib/
  data.ts             the extracted figures, typed
  simulate.ts         the cycle simulator, pure
  chart-theme.ts      one chart language: palette, tooltip, axes
  format.ts           crore and lakh, never millions
```

### One cast, and why

`asOption()` in `lib/chart-theme.ts` is the only type escape on the site. ECharts'
published types under-declare its own runtime: `label.color` and
`itemStyle.borderColor` accept a callback at runtime but are typed as plain strings,
and `markPoint.data` demands a `name` it never uses. Rather than scatter a cast per
property, every chart builds a plain option object and passes it through that one
function. `npx tsc --noEmit` is clean.
