# YYOGAA — project guide for Claude

## What YYOGAA is
A calm, beginner-friendly yoga and wellness website (yoga, breathwork, meditation, sound,
journal), growing into a larger platform with a yoga pose library, practices, education and
simple yoga tools. The owner is **not an experienced developer**: explain results in plain
English, handle routine engineering yourself, and keep production decisions with the human.

Live site: https://yyogaa-website.vercel.app (Vercel, deploys from `main`; every pushed branch
gets a Vercel preview). Repo: https://github.com/iimpandey/yyogaa-website

## Architecture (what actually exists)
- **Astro 7.3.5, static output** (`output: 'static'`, `build.format: 'file'`, `trailingSlash: 'never'`,
  `compressHTML: false` — keep this, removing it glues words together). One dependency: `astro`.
  Node ≥ 22.12 (local: v24). No framework, no Tailwind, no database, no accounts.
- **Clean URLs** via `vercel.json` (`cleanUrls`, `trailingSlash: false`, 308 redirects from the old
  `*.html` addresses). Pages are `/`, `/yoga`, `/breathwork`, `/meditation`, `/sound`, `/journal`,
  `/about`, `/contact`, `/thank-you`, `/health-disclaimer`, `/yoga/poses`, `/yoga/poses/<slug>`.
- **Layout/components:** `src/layouts/BaseLayout.astro` (head, fonts, `/style.css`, Header, Footer,
  `/script.js`); `src/components/{Header,MobileMenu,Footer}.astro` are shared by every page.
- **Global CSS/JS:** `public/style.css` and `public/script.js` (mobile menu + Formspree contact
  form). These are copies of the original site files — edit with care; every page uses them.
- **Yoga Pose Library:**
  - Content collections in `src/content.config.ts`: `poses` (`src/content/poses/<slug>.md`),
    taxonomy collections from `src/content/taxonomy/*.yaml` (levels, pose-categories, body-focus,
    props, goals, caution-types) and `authors`.
  - `src/lib/poses.js` → `getPublishedPoses()` re-checks every reference and **throws**, so a broken
    pose file fails the build. Always load poses through it.
  - Pages: `src/pages/yoga/poses/index.astro` (library, grouped by category) and
    `src/pages/yoga/poses/[slug].astro` (one template for every pose).
  - Components: `src/components/library/PoseCard.astro`, `ListSection.astro`,
    `src/components/ui/SafetyNote.astro`. Library styles: `src/styles/library.css` (classes `pl-*`).
  - Images: `src/content/poses/images/<slug>.png`, 4:3, referenced from the pose file with
    `image: { src, alt, credit, license }` + `imageStatus`. Rendered with Astro `<Image>` (sharp, bundled).
- **Docs:** `docs/planning/` (master blueprint, library plan, pose image style guide, migration
  checkpoint) and `docs/research/` (site audit, reference research). Read the relevant plan before
  larger features.
- **Legacy files:** `index.html`, `yoga.html`, … `style.css`, `script.js` in the repo root are the
  pre-Astro site. They are not built or served. Do not edit; do not delete without approval.

## Commands
- `npm install` — install dependencies (only when `package.json` changes).
- `npm run dev` — local dev server at http://localhost:4321.
- `npm run build` — production build into `dist/`. **Must pass before anything is reviewed.**
- `npm run preview` — serve `dist/` at http://localhost:4321 (stop the dev server first).
- Git is **not on PATH**. Use GitHub Desktop's bundled git:
  `& "C:\Users\hp\AppData\Local\GitHubDesktop\app-3.6.6\resources\app\git\cmd\git.exe" <args>`
  (the version folder may change after GitHub Desktop updates). This git cannot push (no GitHub
  sign-in); the owner pushes with GitHub Desktop.
- Shell is Windows PowerShell 5.1: no `&&`; write files with UTF-8 and no BOM (prefer the editor
  tools over `Set-Content`).

## Design conventions (keep the YYOGAA look)
- Palette (`public/style.css` `:root`): cream `#f5f1e7`, cream-dark `#e8e0cf`, charcoal `#1d1d19`,
  gold `#baa060`, sand `#d4cab4`, line `#ddd5c6`, text-soft `#68645c`. Library adds
  `--gold-text #765f2e` for small gold text on light backgrounds (brand gold fails contrast there).
- Fonts: DM Sans (body/headings) + Playfair Display italic for accent words (e.g. "at *a time.*").
- Patterns to reuse: `.section`, `.page-width`, `.center-heading`, `.section-kicker` (small gold
  uppercase label), `.button` + `.button-gold` / `.button-gold-dark` (rounded pills), thin `--line`
  borders and 18px-radius cards rather than shadows, dark charcoal hero bands.
- Voice: calm, plain, beginner-friendly ("Move · Breathe · Return"). No medical claims.
- Responsive breakpoints in use: 950px (mobile menu), 850px and 650px (library).
- Accessibility baseline: real labels, semantic HTML, visible `:focus-visible` outlines,
  `aria-*` kept in sync by scripts, works without JavaScript where possible.
- New page-specific styles go in the page's scoped `<style>` or `src/styles/library.css`; don't
  restyle shared global rules in `public/style.css` unless the task is about them.

## Content and safety rules
- Pose content is original YYOGAA writing. Never copy text, images or branding from Yoga.com or
  any other site. No claims that a pose cures, treats, prevents or heals anything.
- Every pose keeps `reviewStatus: not-reviewed` and every image `imageStatus: placeholder` until a
  qualified yoga teacher reviews it. Never mark content reviewed/final without the owner.
- Pose slugs (file names) are permanent URLs. Never rename or delete a pose without approval.
- Do not generate, download or invent pose images unless the owner explicitly provides/asks.

## Git workflow
1. Start from an up-to-date `main` (local `main` == `origin/main`), then create a feature branch.
2. **Never commit to `main`.** All work happens on the feature branch.
3. Commit only the files belonging to the task; check `git status`/`git diff --stat` first.
4. The owner pushes the branch (GitHub Desktop), checks the Vercel preview, and merges via a PR.

## Agent workflow
Agents live in `.claude/agents/`. Subagents cannot start other subagents, so **the main Claude
session orchestrates** the loop:

Feature request
→ `yyogaa-lead-engineer` inspects and plans
→ `yyogaa-builder` implements, tests, runs the build
→ `yyogaa-reviewer` reviews independently (PASS or FAIL report)
→ on FAIL: builder fixes → reviewer rechecks (repeat)
→ **READY FOR HUMAN REVIEW**
→ the human decides about commit/push/merge/deploy.

Pass each agent the full context it needs (request, plan, branch, changed files); agents do not
see this conversation.

## Autonomy
Do **not** stop to ask about routine work: reading files, choosing implementation details,
editing feature files, running builds and safe local tests, fixing bugs in the feature, re-testing.

**Human approval is required for:** merging into `main`; production deployment; pushing (the
owner pushes); destructive operations (deleting content/files/branches, history rewrites, force
operations); anything involving secrets or credentials; major architectural changes; new
dependencies; ambiguous product decisions with real user-facing consequences.

## Safety rules (always)
- Never work directly on `main`; never merge into `main` or deploy without explicit approval.
- Never delete content or major functionality without explicit approval.
- Never expose or commit secrets (`.env*` is git-ignored; keep it that way).
- Never silently change unrelated functionality; report every file changed.
- Never claim a test passed if it was not actually run. Clearly separate **code inspection /
  automated checks** from **real browser testing**; if browser or device testing could not be done,
  say so plainly.
