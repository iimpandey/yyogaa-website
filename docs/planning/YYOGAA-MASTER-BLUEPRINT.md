# YYOGAA — Master Platform Blueprint

- **Status:** Planning document only. No website code has been changed.
- **Date:** 2026-09-30
- **Inputs:**
  - `docs/research/yyogaa-current-site-audit.md` (called **"the audit"** below; section names are cited, e.g. *Audit §19 Bugs*).
  - `docs/research/yoga-com-reference-research.md` (called **"the reference report"** below, e.g. *Ref §3.5 Pose library*).
  - A look at the repository itself on 2026-09-30: 9 HTML pages, `style.css`, `script.js`, `README.md`, the two research reports, and an untracked `.claude/` folder. There is no `package.json`, `vercel.json` or `.gitignore`.
- **Checked in official docs today (2026-09-30):**
  - Astro install guide: it needs Node.js `v22.12.0` or higher, and odd versions such as v23 are not supported. Its docs mention upgrade guides up to v7.
  - Astro content-collections guide: `src/content.config.ts`, the `glob()` and `file()` loaders, and Zod schemas.
  - Vercel `vercel.json` reference: `cleanUrls` sends a 308 redirect from `.html` to the address without it, and `redirects` entries with `permanent: true` send a 308.
  - Vercel Hobby plan page: free, "non-commercial, personal use only", 50,000 Web Analytics events a month.
  - Anything else about versions, prices or free tiers is marked **(verify at build time)**. Prices and limits change often.

### How to read this document

| Label | Meaning |
|---|---|
| **ASSUMPTION** | Something I am assuming because it could not be checked. Please confirm or correct it. |
| **(Audit …)** / **(Ref …)** | The claim comes from that section of a research report. |
| **Recommendation card** | A box for each big technology decision: *What it is / Why YYOGAA needs it / Now or later / Simpler alternative / Downsides*. |

### Main assumptions (please confirm)

1. **ASSUMPTION A1:** You own (or can buy) the domain `yyogaa.com`. The contact email `hello@yyogaa.com` suggests you do (*Audit §25*).
2. **ASSUMPTION A2:** The live site is on Vercel at `yyogaa-website.vercel.app` and deploys automatically from GitHub `main`. The audit infers this but could not confirm it (*Audit §25*).
3. **ASSUMPTION A3:** For now you are the only person editing the site, and you are learning as you go.
4. **ASSUMPTION A4:** The first audience is English-speaking and international. Privacy rules such as GDPR (EU) and India's DPDP Act may apply once you collect emails or accounts, so plan for them.
5. **ASSUMPTION A5:** YYOGAA will eventually make money (memberships or courses). That matters for hosting: Vercel's free Hobby plan is for **non-commercial** use only, so you would need the Pro plan once the site earns money.
6. **ASSUMPTION A6:** No budget has been set. This plan keeps V1 free or almost free.

---

## 0. Glossary (plain-English meanings)

Terms are listed in the order you will meet them.

| Term | Simple meaning |
|---|---|
| **Static site** | A website made of ready-made files (HTML, CSS, JS). The server just hands them out. YYOGAA is one today. |
| **HTML / CSS / JS** | HTML is the content and structure, CSS is the look, and JavaScript (JS) is the behaviour (menus, forms). |
| **Repository (repo)** | The project folder tracked by Git, stored on GitHub. |
| **Git / commit / push** | Git records versions of your files. A *commit* is one saved version. A *push* uploads commits to GitHub. |
| **Branch / pull request (PR)** | A *branch* is a parallel copy of the code where you can work safely. A *pull request* asks to merge that branch into `main`, with a chance to review first. |
| **Deploy** | Put a new version of the site on the internet. |
| **Vercel** | The hosting company that serves your site. It watches GitHub and redeploys when `main` changes. |
| **Preview deployment** | A temporary private copy of the site that Vercel builds for each branch or PR, so you can check it before it goes live. |
| **Framework / static site generator (SSG)** | A tool that *builds* your HTML pages from templates and content files, so you write a header once instead of 9 times. |
| **Astro** | The framework recommended here. It turns templates plus Markdown into plain static HTML. |
| **Build / build step** | The command that turns your source files into the final website files (the folder `dist/`). |
| **Node.js / npm** | Node.js runs JavaScript on your computer and is needed to run Astro. npm installs the tools a project needs. |
| **Dependency / package** | A piece of someone else's code your project uses (for example Astro itself). |
| **Component** | A reusable piece of page, such as `Header.astro`, used on every page. |
| **Layout** | A page template that holds the shared parts (head, header, footer). Each page fills in the middle. |
| **Markdown (.md)** | A simple way to write formatted text in a plain file (`# Heading`, `**bold**`). |
| **Frontmatter** | The block of data at the top of a Markdown file, between `---` lines (title, date, tags…). |
| **YAML / JSON** | Two plain-text formats for data. YAML is easier to read by eye, and JSON is stricter. |
| **Content collection** | Astro's name for a folder of content of one type (for example all poses), checked against a schema. |
| **Schema / Zod** | A schema is a rulebook for what a record must contain. Zod is the tool that checks it, so a pose file with a missing name fails the build instead of breaking the page. |
| **Slug** | The URL-friendly name of an item, e.g. `downward-facing-dog`. |
| **Taxonomy** | The system of categories and tags used to organise content. |
| **CMS (content management system)** | A friendly editing screen so you can add content without touching code. |
| **Git-based CMS** | A CMS that saves your edits as files in the repo, so no database is needed. |
| **Database (DB)** | An organised store for data that changes per user (accounts, favourites). |
| **PostgreSQL (Postgres)** | A very widely used, reliable database. |
| **Supabase** | A hosted service that gives you a Postgres database plus login (auth) and file storage. |
| **Authentication (auth) / authorization** | *Authentication* checks who you are (log in). *Authorization* checks what you are allowed to do. |
| **Session / cookie** | After login, the browser keeps a small *cookie* that proves who you are for a while. That period is the *session*. |
| **Row Level Security (RLS)** | A database rule such as "a user can only read their own rows". It is essential with Supabase. |
| **API / endpoint** | A URL that returns or accepts data instead of a web page, e.g. `POST /api/favorites`. |
| **Serverless function** | A small piece of server code that Vercel runs only when it is called. You don't manage a server. |
| **SSR / on-demand rendering** | The page is built at the moment someone asks for it, not ahead of time. It is needed for per-user pages. |
| **Island / progressive enhancement** | The page works as plain HTML, and a small script adds extras (a filter, a timer) on top. |
| **SEO** | Search-engine optimisation: helping Google understand and rank your pages. |
| **Canonical URL** | The one "official" address of a page, declared in a tag, so search engines don't see duplicates. |
| **Sitemap / robots.txt** | A sitemap is a list of all your pages for search engines. `robots.txt` tells crawlers what they may visit. |
| **Structured data (JSON-LD)** | Hidden data in a page that tells Google "this is an article, by X, published on Y". |
| **Open Graph (OG) tags** | Tags that control the title, image and text shown when a link is shared on social apps. |
| **Redirect (301 / 308)** | "This page moved permanently. Go here instead." Search engines pass rankings to the new address. |
| **WCAG / AA** | The international accessibility guidelines. "AA" is the standard level to aim for. |
| **Contrast ratio** | How readable text is against its background. Small text needs at least 4.5:1. |
| **ARIA** | Extra HTML attributes that tell screen readers what a control does, e.g. `aria-expanded`. |
| **Honeypot** | A hidden form field that humans never fill in. Bots fill it, so those submissions get rejected. |
| **CAPTCHA / Turnstile** | A check that the visitor is human. Cloudflare Turnstile is a mostly invisible, privacy-friendly one. |
| **CDN** | A network of servers worldwide that serves your files from somewhere close to each visitor. Vercel includes one. |
| **LCP / CLS** | Core Web Vitals. LCP is how fast the main image or text appears. CLS is how much the layout jumps while loading. |
| **Pagefind** | A search tool that builds a search index from your finished pages. It needs no server. |
| **Environment variable / `.env`** | A secret setting (like an API key) kept outside the code. `.env` is the local file that holds them and is never committed. |
| **MVP / V1** | Minimum viable product: the first version worth launching. |

---

## 1. What YYOGAA currently has

A small, good-looking, **static brochure site with no real practice content yet**.

| Area | Today | Source |
|---|---|---|
| Pages | 9 hand-written HTML files: `index`, `yoga`, `breathwork`, `meditation`, `sound`, `journal`, `about`, `contact`, `thank-you`. No 404, privacy or article pages. | Audit §2, "Pages found" |
| Styling | One `style.css` (1,598 lines) with 8 colour tokens, about 15 hard-coded near-duplicate colours, and 4 breakpoints designed desktop-first. | Audit §15, §16 |
| JavaScript | One `script.js` (65 lines): a mobile-menu toggle and an AJAX Formspree submit. | Audit §14 |
| Forms | Contact form → Formspree (`mgavdlkl`), then a redirect to a hard-coded thank-you URL. | Audit §13 |
| Images | 17 Unsplash photos, hot-linked, with no lazy loading, width/height or srcset. | Audit §22 |
| Fonts | Google Fonts: DM Sans 400–700 and Playfair Display italic 500/600. | Audit §15 Typography |
| Content | Strong, gentle copy, but **no actual practices, poses, techniques, audio or articles**. 32 practice CTAs lead to Contact. | Audit §5–9, §19 |
| Hosting | Probably Vercel, auto-deploying `main`. No build step, no config. | Audit §25 |
| SEO | Unique titles and descriptions. No canonical, OG, sitemap, robots, favicon or JSON-LD. | Audit §21 |
| Accessibility | Good landmarks and labels. Contrast fails on gold text, and there is no skip link, `aria-expanded` or reduced-motion support. | Audit §20 |
| History | 53 commits made with the GitHub web editor over about 3.5 hours. | Audit §1 Git history |

---

## 2. What to preserve

These are the brand's heart. Every later phase must keep them (*Audit "Visual identity"*, *"What should NOT be changed unnecessarily"*).

1. **Palette:** cream `#f5f1e7`, warm charcoal `#1d1d19`, antique gold `#baa060`, sand `#d8cfbc`/`#d4cab4`, hairline `#ddd5c6`, footer `#171713`. There are no bright colours, pure white or pure black.
2. **Hairlines, not shadows:** 1px `--line` borders and tonal section backgrounds.
3. **Typography signature:** a bold DM Sans headline with **one italic gold Playfair Display word** ("Breathe *easy.*"), and tracked uppercase kickers.
4. **Wordmark:** text-only **"YYOGAA"**, DM Sans 700, letter-spacing 0.24em.
5. **Voice:** "Move · Breathe · Return", "Start where you are.", "Your practice. Your pace." The voice is beginner-first, has no hype and makes no medical claims.
6. **Four pillars + journal:** Yoga, Breath, Meditation, Sound, plus Journal, About and Contact.
7. **Section rhythm:** dark hero → cream content → sand grounding band → dark photo CTA → footer.
8. **Components that work well:** split hero with floating cards, numbered foundation cards (01–04), explore tiles, principles grid, featured "Start here" box, pill buttons, soft 13–22px radii.
9. **Existing URLs.** Every current address must keep working, either directly or through a permanent redirect.
10. **Simplicity.** Keep a site you can understand. No heavy frameworks unless there is a clear reason.

---

## 3. What to improve (keep the thing, make it better)

| # | Improvement | Why (audit ref) | When |
|---|---|---|---|
| 1 | Add the mobile menu to the 6 pages that lack it, and add `aria-expanded`, Escape-to-close and close-on-resize. | **Critical**: there is no navigation on phones on 6 pages (*Audit §16, §19.1*). | Phase 0 |
| 2 | Make the thank-you redirect work on any domain. | High: it is hard-coded to the vercel.app URL (*Audit §13, §19.2*). | Phase 0 |
| 3 | Add form spam protection (Formspree `_gotcha` honeypot) and inline, accessible form messages instead of `alert()`. | High (*Audit §13, §23*). | Phase 0 |
| 4 | Stop the dead "Explore →" / "Begin practice" links from pointing to Contact. Point them to real anchors or honest "Coming soon" states. | High (*Audit §19.3*). | Phase 0 |
| 5 | Fix contrast: add a darker "gold text" token (about `#765f2e`, roughly 5.4:1 on cream by my calculation; verify with a checker). Keep `#baa060` for buttons and for text on dark backgrounds. | High (*Audit §20*). | Phase 0 |
| 6 | Add a skip link, `:focus-visible` styles, `aria-current`, `prefers-reduced-motion`, and fix heading order. | Medium (*Audit §20*). | Phase 0 |
| 7 | thank-you: add an `<h1>`, a meta description and `noindex`. | Medium (*Audit §12, §21*). | Phase 0 |
| 8 | Fix the About hero `:last-child` selector. | Low (*Audit §10*). | Phase 0 |
| 9 | Images: `loading="lazy"`, width/height and smaller Unsplash parameters. | Medium (*Audit §22*). | Phase 0 |
| 10 | SEO basics: favicon, OG tags, canonical, `robots.txt`, `sitemap.xml`, 404 page. | Medium (*Audit §21*). | Phase 0 |
| 11 | Put all colours into tokens and reorganise `style.css`. | Low, but it prevents drift (*Audit §15*). | Phase 1 |
| 12 | Write the brand name one way ("YYOGAA" as the wordmark, "Yyogaa" in running text). Decide once and document it. | Low (*Audit §21*). | Phase 0 (decision) |
| 13 | Add `.gitignore` (ignore `.claude/`, `node_modules/`, `.env`, `dist/`) and a real README. | Low (*Audit §23*). | Phase 0 |

---

## 4. What to eventually replace

| Current thing | Replace with | Why | When |
|---|---|---|---|
| Header and footer copy-pasted into 9 HTML files | One `Header` and one `Footer` **component** in Astro | The copies have already drifted (*Audit §17*). | Phase 1 |
| Hand-written HTML for every page | Astro **layouts + templates** fed by content files | Needed to scale from 9 pages to hundreds. | Phase 1–2 |
| Hard-coded journal "mock-up" cards | Real articles in Markdown, listed automatically | There are no real articles today (*Audit §9*). | Phase 2 |
| `.html` URLs (`/yoga.html`) | Clean URLs (`/yoga`), with 308 redirects from the old ones | Cleaner and future-proof. | Phase 1 |
| Hot-linked Unsplash images | Local, optimised images (`src/assets`), built into WebP/AVIF with sizes | Speed, control and licence records. | Phase 1–2 |
| Google Fonts from Google's servers | Self-hosted font files | Speed, and visitor privacy (*Audit §23 Privacy*). | Phase 1 |
| `alert()` form errors | Inline status text announced to screen readers | Accessibility. | Phase 0 |
| Single 24 KB global stylesheet | Token file + base + component CSS (Astro only ships what a page uses) | Maintainability. | Phase 1 |

**Kept, not replaced (for now):** Formspree for the contact form, Vercel hosting and vanilla JavaScript.

---

## 5. Useful ideas from Yoga.com (patterns, not content)

These are general, common web patterns. We will build our own versions with our own design, words and images.

| Idea | What we learned (Ref) | YYOGAA version |
|---|---|---|
| **Pose library with instant filters** | 230 poses; text, level and category filters; a live "2 of 230" count (*Ref §3.5*). | Same idea, **but the filters are saved in the URL** so they can be shared, which improves on the reference (*Ref §3.5 item 12*). |
| **Fixed pose-page template** | At a glance → how to → benefits → mistakes → modifications → cautions → related (*Ref §3.6*). | Our own order and wording, adding "Breath cue" and "Beginner version" and a softer tone. |
| **Structured sequences** | Their sequences are plain prose with no pose links (*Ref §13 "Opportunity"*). | A sequence is an **ordered list of poses with hold times**, linked to pose pages and usable in a practice player. |
| **Topic hubs with a "start here" item** | Pillars with one cornerstone article (*Ref §3.2*). | Our 4 pillars plus "Explore" topic hubs (Sleep, Flexibility…), each with a hand-picked starting point. |
| **Multi-chapter free courses** | Hub + chapters with previous/next links (*Ref §3.9, §14*). | "Programs" (e.g. a 7-day beginner start). Progress is saved later, once accounts exist. |
| **Article trust features** | Author, dates, sources, table of contents, related posts (*Ref §3.4*). | Same, plus a clear health note and "reviewed by" when a qualified teacher reviews the piece. |
| **Strong SEO basics** | Canonicals, OG tags, JSON-LD, breadcrumbs, custom 404 (*Ref §19*). | Built into our layouts from day one. |
| **Onboarding path** | Numbered steps for beginners (*Ref §4 row 8*). | We already have 01–04 foundation cards. Evolve them into a "First week" path. |
| **Newsletter** | Footer form and band (*Ref §16*). | A simple footer and band form with double opt-in. **No** timed pop-up. |
| **Legal and trust pages** | Health & safety disclaimer, editorial policy, accessibility statement (*Ref §2*). | Write our own versions. |
| **Static pages + separate small services** | Mostly pre-built HTML, with APIs only for accounts (*Ref §1.3, §21*). | The same overall strategy: static first, small server code later. |
| **Search** | Header search (*Ref §12*). | Our own search over our own content (Pagefind), with **no ads**. |
| **Saved items** | Heart/save buttons (*Ref §10*). | Favourites, first stored on the device and later synced to an account. |

---

## 6. What NOT to copy from Yoga.com

**Legal and ethical (never):**
- Their **text** (articles, pose instructions, slogans, section names like "The Groundwork" or "Begin gently", pillar names, quotes), their **images**, **ink-drawing illustrations**, **animations**, **logo**, **code** or **studio data** (*Ref §24.5, §23 Phase 3*).
- Their **visual identity**. Note that their palette (paper/ink/ochre) and even their hero line "Breathe easy." look similar to YYOGAA's (*Ref §4 row 2, §6.1*). YYOGAA's "Breathe *easy.*" was in its own audited site first (*Audit §4*). Still, to avoid any look of copying and to build a distinct brand, **do not move further toward their look**: no Figtree/Fraunces fonts, no sage green, no dot eyebrows. Consider giving the home H1 a more ownable YYOGAA line in future (optional; a brand decision for you).

**Bad practices (avoid):**
- Analytics cookies set before consent, and a cookie banner with only "Got it" (*Ref §18 item 9, §21 Consent*).
- Ad-driven site search, and indexable search result pages (*Ref §12*).
- A delayed newsletter pop-up.
- A menu button made from a `span`, a `<button>` nested inside a link, missing `aria-expanded`, and a header that overflows at 375px (*Ref §17, §18*).
- A separate "buying guide" ad template outside the design system (*Ref §3.15*).
- `MedicalWebPage` markup without a real medical reviewer (*Ref §19 Gaps*).
- Client-side redirects instead of real 301/308 redirects (*Ref §3.6*).
- A pose photo that does not show the pose (*Ref §3.6*).
- Loading 12 font files (*Ref §20*).
- Scraping business listings for a studio directory (*Ref §15 Data quality*).

---

## 7. Proposed information architecture

**Information architecture (IA)** means how content is grouped and connected. YYOGAA keeps its **four pillars** as the backbone and adds **libraries** under each pillar, plus **cross-pillar "Explore" topics** (the 9 tiles that already exist on the homepage, *Audit §4 item 8*).

```
YYOGAA
├── PRACTICE PILLARS (the four doors)
│   ├── Yoga ─────── Poses library · Styles · Sequences · Beginner guide
│   ├── Breathwork ─ Techniques library · Breath for goals (calm, focus, sleep…)
│   ├── Meditation ─ Practices library · Meditation types
│   └── Sound ────── Sessions library · Learn about sound
├── EXPLORE (cross-pillar topics = goals & themes)
│   └── Beginner · Flexibility · Strength · Sleep · Calm/Stress · Focus · Energy · Lifestyle · Philosophy
├── PROGRAMS (multi-day guided paths, e.g. "First 7 days")          [V2]
├── JOURNAL (articles: education, wellness, philosophy)
│   └── Categories · Tags · Authors
├── SEARCH (everything)
├── ACCOUNT (saved, history, progress, settings)                     [V3]
├── ABOUT · CONTACT · NEWSLETTER
└── TRUST & LEGAL (health disclaimer, privacy, terms, accessibility, editorial policy, image credits)
```

**Rule of thumb:** a *pillar* answers "what kind of practice?", an *Explore topic* answers "what do I need?", and the *journal* answers "help me understand". Every practice item belongs to **one** pillar and may belong to **several** Explore topics (goals).

---

## 8. Complete page hierarchy (with URL patterns)

URL rules:
- Lowercase and hyphenated, with **no `.html`** and **no trailing slash** (from Phase 1).
- Old URLs redirect permanently (see §30).
- `[slug]` means "filled in per item".

| URL | Page | Phase |
|---|---|---|
| `/` | Home | Now (improve) |
| `/yoga` | Yoga pillar hub | Now (improve) |
| `/yoga/poses` | Pose library (search, filters: `?level=&category=&focus=`) | V1 |
| `/yoga/poses/[slug]` | Pose page, e.g. `/yoga/poses/mountain-pose` | V1 |
| `/yoga/styles` · `/yoga/styles/[slug]` | Yoga styles, e.g. `/yoga/styles/hatha` | V1 (few) |
| `/yoga/sequences` · `/yoga/sequences/[slug]` | Sequences, e.g. `/yoga/sequences/gentle-morning-10` | V1 (read-only), V2 (player) |
| `/yoga/beginners` | Beginner's guide to yoga | V1 |
| `/breathwork` | Breathwork hub | Now (improve) |
| `/breathwork/techniques` · `/breathwork/techniques/[slug]` | Technique library and pages, e.g. `/breathwork/techniques/box-breathing` | V1 |
| `/meditation` | Meditation hub | Now (improve) |
| `/meditation/practices` · `/meditation/practices/[slug]` | Meditation library and pages | V1 |
| `/sound` | Sound hub | Now (improve) |
| `/sound/sessions` · `/sound/sessions/[slug]` | Sound sessions (audio) | V2 |
| `/explore` · `/explore/[topic]` | Cross-pillar topics, e.g. `/explore/sleep` | V1 |
| `/programs` · `/programs/[slug]` · `/programs/[slug]/[day-or-lesson]` | Guided programs / courses | V2 |
| `/journal` | Journal index (newest first) | V1 |
| `/journal/page/[n]` | Older pages of the list | V1 (when more than 12 articles) |
| `/journal/[slug]` | Article, e.g. `/journal/how-to-start-yoga-at-home` | V1 |
| `/journal/category/[slug]` | Article category | V1 |
| `/tags/[slug]` | Everything tagged X (all content types) | V2 |
| `/authors/[slug]` | Author or teacher bio | V1 (1–2 authors) |
| `/glossary` | Plain-English yoga terms | V2 |
| `/search` | Site search (`noindex`) | V1 |
| `/newsletter` | Newsletter sign-up and confirmation pages | V1 |
| `/about` · `/contact` · `/thank-you` | As today (`thank-you` gets `noindex`) | Now |
| `/health-disclaimer` · `/privacy` · `/terms` · `/accessibility` · `/editorial-policy` · `/image-credits` | Trust and legal | V1 |
| `/404` | Friendly not-found page (real 404 status) | Phase 0 |
| `/account/login` · `/account/signup` · `/account/reset-password` | Auth pages (`noindex`) | V3 |
| `/account` · `/account/saved` · `/account/history` · `/account/progress` · `/account/settings` | Personal area (`noindex`) | V3 |
| `/teachers/[slug]` · `/studios/[country]/[city]` · `/events/[slug]` · `/retreats/[slug]` · `/membership` · `/community` | Future platform | Long-term |

**Why `/yoga/poses/...` and not `/poses/...`:** it keeps the four-pillar structure visible in the address, and it keeps the existing `/yoga` hub as the natural parent for breadcrumbs.

---

## 9. Navigation structure

### Desktop header (≥ 951px)
```
YYOGAA   Yoga  Breathwork  Meditation  Sound  Journal  About     [Search icon]  (Explore)  (Contact)
```
- Keep the current layout (*Audit §3*). Rename "Breath" to "Breathwork" to match the page name, or keep "Breath" if you prefer the shorter word. It is your choice; be consistent.
- The **"Explore" pill** now goes to `/explore` (the topics page) instead of an in-page anchor.
- Add a **search icon button** (V1, once search exists).
- In V2, pillars can get a simple dropdown (e.g. Yoga → Poses, Styles, Sequences, Beginners). Start without dropdowns.
- In V3 a **"Sign in" / avatar** link is added, and "Contact" moves to the footer.
- The current page is marked with `aria-current="page"` and a thin gold underline.

### Mobile (≤ 950px)
- Header: wordmark, search icon, and a **real `<button>`** menu toggle (at least 44×44px) with `aria-expanded` and `aria-controls`.
- The menu panel is a full-width cream sheet containing: Yoga, Breathwork, Meditation, Sound, Journal, Explore, About, Contact. Later it also holds "Programs" and "Sign in".
- Behaviour: focus moves into the menu when it opens; Escape closes it; tapping a link closes it; it closes if the window is widened; page scroll is locked while it is open.
- **The same component on every page**, so it can never go missing again (*Audit §17*).
- **No bottom tab bar in V1.** Consider one in V3 (Home · Practice · Search · Saved · Me) if analytics show heavy mobile use.

### Footer (all pages)
| Column | Links |
|---|---|
| Practice | Yoga, Poses, Breathwork, Meditation, Sound, Sequences |
| Learn | Journal, Beginners, Explore topics, Glossary (V2) |
| YYOGAA | About, Contact, Newsletter, Editorial policy |
| Legal | Health disclaimer, Privacy, Terms, Accessibility, Image credits |
| Bottom row | Wordmark, "Move · Breathe · Return", newsletter mini-form (V1), © year |

### Wayfinding
- Breadcrumbs as `<nav aria-label="Breadcrumb">` on every page below a hub (e.g. Home › Yoga › Poses › Mountain Pose).
- Previous/next links on poses, sequences and program lessons.
- A "Continue your practice" block with related items at the end of every content page.

---

## 10. Content taxonomy

**Taxonomy** means the labels used to organise content. Keep a **small, fixed list** for each kind of label, stored in one file (`src/content/taxonomy/*.yaml`) so spelling never drifts.

| Label type | Applies to | Values (starting set, editable) | Controlled? |
|---|---|---|---|
| **Pillar** | every practice item | `yoga`, `breathwork`, `meditation`, `sound` | Fixed |
| **Content type** | everything | `pose`, `style`, `sequence`, `breath-technique`, `meditation`, `sound-session`, `article`, `program` | Fixed |
| **Level** | practices | `beginner`, `intermediate`, `advanced` | Fixed |
| **Goal / Explore topic** | practices + articles | `calm`, `sleep`, `focus`, `energy`, `flexibility`, `strength`, `mobility`, `recovery`, `posture`, `beginner-friendly` | Controlled list |
| **Pose category** | poses | `standing`, `seated`, `forward-fold`, `backbend`, `twist`, `balance`, `hip-opener`, `inversion`, `supine`, `prone`, `restorative` | Controlled list |
| **Body focus** | poses, sequences | `hamstrings`, `hips`, `spine`, `shoulders`, `core`, `legs`, `chest`, `neck`, `wrists`, `feet` | Controlled list |
| **Duration band** | practices | `under-5`, `5-15`, `15-30`, `30-plus` (minutes, worked out from the number) | Automatic |
| **Journal category** | articles | `beginners`, `practice`, `breath`, `meditation`, `sound`, `wellness`, `philosophy`, `lifestyle` | Controlled list |
| **Tags** | anything | Free but reviewed words, e.g. `desk-workers`, `morning`, `no-props` | Semi-free |
| **Props** | poses, sequences | `none`, `mat`, `block`, `strap`, `bolster`, `blanket`, `chair`, `wall` | Controlled list |

Rules:
1. **Goals power the "Explore" pages.** `/explore/sleep` automatically lists every pose, sequence, breath technique, meditation, sound session and article with the goal `sleep`.
2. Tags are optional. Don't create a tag page until at least 3 items use that tag. Thin pages hurt SEO (*Ref §3.7*).
3. Every label has a display name and a one-line description (used for page intros and SEO).

---

## 11. Yoga pose data structure

Each pose is one Markdown file: `src/content/poses/mountain-pose.md`. The data sits in the frontmatter. Optional longer notes go in the body. The build checks it against this table and refuses to publish a pose with a missing required field.

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `slug` | text | `mountain-pose` | Yes | Taken from the file name. Used in the URL. Never change it after publishing (or add a redirect). |
| `name` | text | `Mountain Pose` | Yes | English name. |
| `sanskritName` | text | `Tadasana` | No | Plain spelling. |
| `sanskritDiacritics` | text | `Tāḍāsana` | No | Spelling with accent marks. |
| `alsoKnownAs` | list of text | `["Standing pose"]` | No | Helps search. |
| `summary` | text (≤ 160 chars) | `A grounded standing pose that teaches alignment…` | Yes | Card text and meta description. |
| `level` | one of levels | `beginner` | Yes | See §10. |
| `category` | one of pose categories | `standing` | Yes | |
| `bodyFocus` | list | `["legs","core","posture"]` | No | |
| `goals` | list of goals | `["calm","posture"]` | No | Feeds `/explore`. |
| `props` | list | `["none"]` | No | |
| `holdGuide` | text | `5–8 breaths` | No | |
| `steps` | list of text | `["Stand with feet hip-width…", "…"]` | Yes | 3–8 short, original steps. |
| `breathCue` | text | `Inhale to lengthen, exhale to soften the shoulders.` | No | |
| `benefits` | list of text | `["Encourages steady posture"]` | Yes | Gentle wording, no medical claims. |
| `commonMistakes` | list of {mistake, fix} | `[{mistake:"Locking knees", fix:"Micro-bend the knees"}]` | No | |
| `modifications` | list of text | `["Stand with your back near a wall"]` | No | Easier options. |
| `variations` | list of pose slugs | `["tree-pose"]` | No | Harder options. |
| `cautions` | list of text | `["If you feel dizzy, sit down"]` | Yes (may be empty) | Always shown with the health disclaimer. |
| `relatedPoses` | list of {slug, relation} | `[{slug:"tree-pose", relation:"progression"}]` | No | Relation is one of `preparation`, `progression`, `counter`, `similar`. |
| `image` | {src, alt, credit, license} | `{src:"./mountain.jpg", alt:"Person standing tall…", credit:"Photo: A. Sharma", license:"commissioned"}` | Yes | The image **must actually show the pose**. |
| `illustration` | image path | `./mountain-line.svg` | No | Future original line art. |
| `tags` | list | `["no-props","morning"]` | No | |
| `author` | author slug | `yyogaa-team` | Yes | |
| `reviewedBy` | author slug | `priya-teacher` | No | A qualified teacher, if one reviewed it. |
| `publishedAt` / `updatedAt` | date | `2026-11-02` | Yes / No | |
| `draft` | true/false | `false` | No | Drafts are not built. |

**Example record** (`src/content/poses/mountain-pose.md`):
```yaml
---
name: Mountain Pose
sanskritName: Tadasana
summary: A grounded standing pose that teaches the basics of alignment and steady breath.
level: beginner
category: standing
bodyFocus: [legs, core]
goals: [calm, posture, beginner-friendly]
props: [none]
holdGuide: 5–8 breaths
steps:
  - Stand with your feet hip-width apart and spread your toes.
  - Let your arms rest by your sides, palms facing forward.
  - Lengthen up through the crown of the head and soften the shoulders.
breathCue: Inhale to grow tall, exhale to settle.
benefits:
  - Builds awareness of posture
  - A calm place to begin or end a practice
cautions:
  - If you feel light-headed, sit down and breathe normally.
relatedPoses:
  - { slug: tree-pose, relation: progression }
image: { src: ./images/mountain-pose.jpg, alt: "A person standing tall in Mountain Pose on a cream mat", credit: "YYOGAA", license: owned }
author: yyogaa-team
publishedAt: 2026-11-02
---
Optional extra notes in normal Markdown…
```

**Related structures:**
- **Yoga style:** `slug, name, summary, pace (slow|moderate|dynamic), goodFor[], history (Markdown), typicalClassLength, relatedSequences[]`.
- **Sequence:**

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `title` | text | `Gentle Morning Flow` | Yes | |
| `summary` | text | `Ten unhurried minutes to wake up the body.` | Yes | |
| `level` | level | `beginner` | Yes | |
| `durationMinutes` | number | `10` | Yes | |
| `goals` | list | `["energy","mobility"]` | No | |
| `props` | list | `["mat"]` | No | |
| `steps` | list of {pose, hold, side?, note?} | `{pose: mountain-pose, hold: "5 breaths"}` | Yes | `pose` must be a real pose slug. The build checks this with Astro's reference feature. |
| `image`, `author`, `publishedAt` | as for poses | | Yes | |

Example: `steps: [{pose: mountain-pose, hold: "5 breaths"}, {pose: cat-cow, hold: "6 rounds"}, {pose: childs-pose, hold: "1 minute", note: "Rest here as long as you like"}]`

---

## 12. Breathwork data structure

File: `src/content/breathwork/box-breathing.md`

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `name` | text | `Box Breathing` | Yes | |
| `alsoKnownAs` | list | `["Square breathing","Sama vritti"]` | No | |
| `summary` | text | `An even four-part breath for steadiness.` | Yes | |
| `level` | level | `beginner` | Yes | |
| `goals` | list | `["calm","focus"]` | Yes | |
| `pattern` | {inhale, holdIn, exhale, holdOut} in seconds | `{inhale:4, holdIn:4, exhale:4, holdOut:4}` | No | Powers the future breath pacer. Leave it empty for techniques without a count. |
| `rounds` | number | `6` | No | |
| `durationMinutes` | number | `5` | Yes | |
| `posture` | text | `Seated or lying down` | No | |
| `steps` | list of text | `["Sit comfortably…"]` | Yes | Original wording. |
| `howItFeels` | text | `Most people notice a slower, steadier rhythm.` | No | Describes experience, not medical outcome. |
| `includesBreathHolds` | true/false | `true` | Yes | If true, extra cautions are shown automatically. |
| `cautions` | list | `["Skip the holds if you are pregnant or have high blood pressure…"]` | Yes | Reviewed wording, with a general disclaimer. |
| `contraindicationLevel` | `gentle` / `moderate` / `strong` | `moderate` | Yes | Controls how prominent the safety box is. |
| `audio` | {src, durationSeconds, transcript} | — | No | V2 guided audio. A transcript is required if audio exists. |
| `relatedTechniques` | list of slugs | `["4-7-8-breathing"]` | No | |
| `image`, `author`, `reviewedBy`, `publishedAt`, `updatedAt`, `tags`, `draft` | as for poses | | | |

**Example record:**
```yaml
---
name: Box Breathing
summary: An even four-part breath that helps you feel steady and clear.
level: beginner
goals: [calm, focus]
pattern: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }
rounds: 6
durationMinutes: 5
steps:
  - Sit comfortably with a long spine and relaxed shoulders.
  - Breathe in through the nose for a count of four.
  - Pause gently for four, breathe out for four, pause for four.
includesBreathHolds: true
contraindicationLevel: moderate
cautions:
  - Keep the pauses soft. If they feel uncomfortable, skip them and just breathe evenly.
author: yyogaa-team
publishedAt: 2026-11-05
---
```

---

## 13. Meditation data structure

File: `src/content/meditations/five-minute-presence.md`

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `title` | text | `A 5-Minute Meditation for Presence` | Yes | Reuses existing copy (*Audit §5–8 "START HERE"*). |
| `summary` | text | `Arrive in the body and the breath, one moment at a time.` | Yes | |
| `type` | one of `breath-awareness`, `body-scan`, `loving-kindness`, `walking`, `visualisation`, `open-awareness`, `sleep` | `breath-awareness` | Yes | |
| `level` | level | `beginner` | Yes | |
| `goals` | list | `["calm","focus"]` | Yes | |
| `durationMinutes` | number | `5` | Yes | |
| `posture` | text | `Seated, lying down or walking` | No | |
| `guidance` | Markdown body | the written script | Yes | Readable script. It also works as the transcript. |
| `audio` | {src, durationSeconds, narrator} | `{src:"https://…/presence-5.mp3", durationSeconds:312, narrator:"YYOGAA"}` | No | V2. Original recordings only. |
| `backgroundSound` | sound-session slug | `soft-bowls` | No | |
| `cautions` | list | `["If difficult memories come up, open your eyes and pause."]` | No | Trauma-sensitive note. |
| `image`, `author`, `publishedAt`, `updatedAt`, `tags`, `draft` | as above | | | |

**Example record:**
```yaml
---
title: A 5-Minute Meditation for Presence
summary: Arrive in the body and the breath, one moment at a time.
type: breath-awareness
level: beginner
goals: [calm, focus]
durationMinutes: 5
posture: Seated or lying down
author: yyogaa-team
publishedAt: 2026-11-08
---
Find a position that feels comfortable. Let your eyes close or soften…
```

**Sound session** (same idea, V2): `title, summary, instruments[] (singing-bowl, gong, chimes, nature…), durationMinutes, goals[], audio{src, durationSeconds}, listeningTips[], cautions[] (e.g. keep volume low; not while driving), recordedBy, license`.

---

## 14. Journal / article data structure

File: `src/content/journal/how-to-start-yoga-at-home.md`

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `title` | text | `How to Start Yoga at Home` | Yes | Becomes the `<h1>`. |
| `dek` | text | `No studio, no problem — a gentle first week.` | Yes | Subtitle, card excerpt and meta description. |
| `category` | journal category | `beginners` | Yes | |
| `tags` | list | `["home-practice","no-props"]` | No | |
| `goals` | list | `["beginner-friendly"]` | No | Feeds Explore. |
| `author` | author slug | `yyogaa-team` | Yes | |
| `reviewedBy` | author slug | — | No | |
| `publishedAt` | date | `2026-11-10` | Yes | |
| `updatedAt` | date | — | No | Shown as "Updated …". |
| `heroImage` | {src, alt, credit, license} | as for poses | Yes | |
| `readingTime` | number | *(calculated)* | Auto | Worked out from word count at build time. |
| `featured` | true/false | `true` | No | For the "Featured" slot on home or journal. |
| `relatedContent` | list of {type, slug} | `[{type:"pose", slug:"mountain-pose"}]` | No | Hand-picked. Tag matches fill the rest automatically. |
| `sources` | list of {title, url} | `[{title:"NCCIH: Yoga", url:"https://www.nccih.nih.gov/…"}]` | No (Yes for health topics) | Cite reputable sources. |
| `seoTitle` | text | — | No | Only if different from `title`. |
| `draft` | true/false | `false` | No | |
| *body* | Markdown | the article | Yes | Headings H2/H3 become the table of contents. |

**Example record:**
```yaml
---
title: How to Start Yoga at Home
dek: No studio, no problem — a gentle first week, one small practice at a time.
category: beginners
tags: [home-practice, no-props]
goals: [beginner-friendly]
author: yyogaa-team
publishedAt: 2026-11-10
heroImage: { src: ./images/home-practice.jpg, alt: "A rolled mat beside a window in soft morning light", credit: "Unsplash / Photographer Name", license: unsplash }
relatedContent:
  - { type: pose, slug: mountain-pose }
  - { type: sequence, slug: gentle-morning-10 }
---
## Start where you are
…
```

**Author** (`src/content/authors/*.yaml`): `name, slug, role, bio, credentials (e.g. "RYT-200", optional), photo, links[]`. Only claim credentials that are real.

---

## 15. Search & filtering architecture

Two separate tools, each chosen for its job.

### A. Site-wide search → **Pagefind**

> **Recommendation card: Pagefind**
> - **What it is:** A free tool that runs after the site is built. It reads every finished page and creates a small search index made of files. The search box downloads only the small pieces it needs.
> - **Why YYOGAA needs it:** It lets people search poses, techniques and articles in one box, with no server, no database and no monthly cost.
> - **Now or later:** V1 (Phase 2), once there are about 30 or more content pages.
> - **Simpler alternative:** No search at all, plus good navigation and Explore pages. That is fine until around 30 pages.
> - **Downsides:** Results only update when the site is rebuilt (fine for us). It can't search private per-user data. It gets heavier at tens of thousands of pages (not a concern for years). If needed later, move to Postgres full-text search or a hosted service (Algolia, Meilisearch).

How it works:
1. `npm run build` creates the site, then Pagefind indexes the `dist/` folder.
2. `/search?q=box+breathing` shows results. The page is `noindex` (*Ref §12* lesson).
3. Content templates mark filterable data (for example `data-pagefind-filter="type"` and `level`), so results can be narrowed by content type and level.
4. Pages that should not be searchable (thank-you, legal) are excluded.

### B. Library filters (poses, techniques, meditations) → **build-time JSON + small vanilla script**
1. At build time, Astro writes the **full list as HTML cards** (so it works with no JavaScript and is indexable). It also writes a small data attribute on each card (`data-level="beginner" data-category="standing"`).
2. A roughly 3 KB script shows or hides cards when filters change, and **writes the filters into the URL** (`/yoga/poses?level=beginner&category=standing`). Links can then be shared and the back button works, which improves on the reference (*Ref §3.5*).
3. A live count ("12 of 40 poses") is announced to screen readers via `aria-live="polite"`.
4. Filter controls are real `<button aria-pressed>` or checkboxes, and each filter group is a `<fieldset>` with a legend.
5. Sorting: A–Z, level, newest.
6. **Scale limit:** fine up to about 500 items per library. Beyond that, paginate or move filtering to the server (V3+).

### C. Future (V3+)
- A "search within my saved items" feature runs against the database.
- Search analytics (top queries with no results) show what content to write next.

---

## 16. User account architecture (V3 — not in V1)

**Why wait?** Accounts add passwords, privacy law duties, security risk, email delivery, support requests and a database. None of that is needed to launch a genuinely useful library. V2 gives visitors **"saved on this device"** features first (§17), which proves demand before building accounts.

When accounts arrive (V3), they use **Supabase Auth** (§20). Supabase keeps the login data (email, password hash) in its own protected `auth.users` table. YYOGAA keeps a **profile** table linked to it.

**Table `profiles`**

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `id` | UUID (unique ID) | `8c1f…` | Yes | Same ID as the Supabase login user. |
| `display_name` | text (≤ 40) | `Asha` | No | Never shown publicly in V3. |
| `experience_level` | `beginner` / `intermediate` / `advanced` | `beginner` | No | For recommendations. |
| `goals` | list of goals | `{calm,sleep}` | No | Chosen in a short, optional onboarding step. |
| `preferred_minutes` | number | `10` | No | |
| `newsletter_opt_in` | true/false | `false` | Yes (default false) | Consent must be explicit. |
| `timezone` | text | `Asia/Kolkata` | No | For streaks and "today". |
| `created_at` / `updated_at` | date-time | `2027-03-01T09:12:00Z` | Yes | Set automatically. |
| `deleted_at` | date-time | — | No | Supports the "delete my account" flow. |

**Example record:** `{ id: "8c1f…", display_name: "Asha", experience_level: "beginner", goals: ["calm","sleep"], preferred_minutes: 10, newsletter_opt_in: false, timezone: "Asia/Kolkata" }`

**Deliberately NOT stored:** date of birth, gender, medical conditions, injuries, pregnancy status, weight. These are sensitive health-type data with legal weight. If you ever need "injury-aware" suggestions, plan it with legal advice first.

**Account features (V3):** sign up, log in, log out, magic-link or password, reset password, verify email, change email, **download my data**, **delete my account**, and optional Google sign-in.

---

## 17. Favorites / saved-content architecture

Two steps, so value arrives early without a database.

### Step 1 (V2): "Saved on this device" — no account
- A heart button on every pose, technique, meditation, sequence and article.
- Saved items are stored in the browser's `localStorage` (a small storage area inside the visitor's own browser) as a list of `{type, slug, savedAt}`.
- A `/saved` page reads that list and shows cards, using a small JSON index of all content built at deploy time.
- Honest note on the page: "Saved on this device only. Clearing your browser removes them."
- It sends no data to us, so there is no privacy burden.

### Step 2 (V3): synced favourites for signed-in users

**Table `favorites`**

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `id` | UUID | `f2a…` | Yes | |
| `user_id` | UUID → `profiles.id` | `8c1f…` | Yes | Protected by RLS: users see only their own rows. |
| `content_type` | `pose` / `sequence` / `breath-technique` / `meditation` / `sound-session` / `article` / `program` | `pose` | Yes | |
| `content_slug` | text | `mountain-pose` | Yes | Content lives in files, so we store the slug and not a database ID. |
| `collection` | text | `evening` | No | V3.5: user-named lists. |
| `created_at` | date-time | `2027-03-02T20:01:00Z` | Yes | |

- **Unique rule:** one row per (`user_id`, `content_type`, `content_slug`), so the same item can't be saved twice.
- **Merge on first login:** any device-saved items are uploaded once, then cleared locally.
- **Renamed or deleted content:** if a slug changes, add a redirect *and* a small "slug alias" list, so old favourites still resolve. Deleted items show "no longer available".

**Example record:** `{ user_id: "8c1f…", content_type: "breath-technique", content_slug: "box-breathing", created_at: "2027-03-02T20:01:00Z" }`

---

## 18. Progress / history architecture

Same two-step idea: **device-only first (V2), synced later (V3)**.

**Table `practice_sessions`** (a log of each practice done)

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `id` | UUID | `p91…` | Yes | |
| `user_id` | UUID | `8c1f…` | Yes | RLS protected. |
| `content_type` | as above | `sequence` | Yes | |
| `content_slug` | text | `gentle-morning-10` | Yes | |
| `started_at` | date-time | `2027-03-03T06:45:00Z` | Yes | |
| `duration_seconds` | number | `612` | Yes | |
| `completed` | true/false | `true` | Yes | |
| `source` | `player` / `manual` | `player` | Yes | Manual = "I practiced offline". |
| `note` | text (≤ 500) | `Hips felt tight.` | No | Private. |
| `feeling_after` | 1–5 | `4` | No | Optional and simple. Explained clearly and deletable. |

**Table `program_progress`** (for multi-day programs)

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `user_id` | UUID | `8c1f…` | Yes | |
| `program_slug` | text | `first-seven-days` | Yes | |
| `lesson_slug` | text | `day-3` | Yes | |
| `completed_at` | date-time | `2027-03-05T07:00:00Z` | Yes | Unique per user + program + lesson. |

**Things worked out from these rows (never stored twice):**
- Total minutes, sessions this week and a gentle "streak". Use kind language: "3 days this week", not "You broke your streak!".
- Program percent complete = completed lessons ÷ total lessons (the total comes from the program's content file).

**Example records:**
- `{ user_id:"8c1f…", content_type:"sequence", content_slug:"gentle-morning-10", started_at:"2027-03-03T06:45:00Z", duration_seconds:612, completed:true, source:"player" }`
- `{ user_id:"8c1f…", program_slug:"first-seven-days", lesson_slug:"day-3", completed_at:"2027-03-05T07:00:00Z" }`

**Personalised recommendations (V3), rule-based and not AI:**
1. Match the profile's goals and level to content labels.
2. Boost items related to what the user recently completed or saved.
3. Hide items completed in the last 3 days.
4. Always include one "beginner-friendly" option.

It is explainable ("Because you like *calm*"), cheap and private. Machine-learning recommendations are a long-term option only.

---

## 19. Database architecture

> **Recommendation card: Supabase (hosted PostgreSQL)**
> - **What it is:** An online service that gives you a Postgres database, login and file storage, managed through a web dashboard.
> - **Why YYOGAA needs it:** Accounts, favourites, history and progress change per user, so they can't live in files.
> - **Now or later:** **Later (V3).** V1 and V2 need **no database**: content lives in files, and device-only features use the browser.
> - **Simpler alternative:** Keep everything device-only (V2 approach) for longer. Or use a Git-based CMS for content and never add a database until accounts are truly needed.
> - **Downsides:** It is another service to learn and secure. RLS rules **must** be written correctly or data can leak. The free tier pauses inactive projects and has limits (verify at build time). You depend on a vendor, but because it is standard Postgres you can move to Neon, AWS or others later.
> - **Other options considered:** Neon plus a separate auth library (more pieces to connect); Firebase (a NoSQL database, harder to move away from, and weaker for relational data like "favourites of content").

**What lives where:**

| Data | Where | Why |
|---|---|---|
| Poses, techniques, meditations, sequences, articles, programs, authors, taxonomy | **Files in Git** (Markdown/YAML) | Free, version-controlled, reviewable, fast static pages. |
| Images for content | **Repo** (`src/assets`), optimised at build | Simple. Fine for a few hundred images. |
| Audio (sound, guided meditation) | **Object storage** (Vercel Blob in V2; Supabase Storage from V3) | Audio files are large; Git and repos are bad at big binary files. |
| Users, profiles, favourites, sessions, program progress | **Supabase Postgres** (V3) | Per-user, changing data. |
| Newsletter subscribers | **Newsletter provider** (§21 card) | They handle consent, unsubscribe and delivery. |
| Contact messages | **Formspree** (then email) | Already works. |

**Tables (V3):** `profiles`, `favorites`, `practice_sessions`, `program_progress`, and later `collections`.

**Future tables:** `teachers`, `studios`, `events`, `retreats`, `memberships`, `orders`, `reviews`, `community_posts`, `reports` (moderation).

**Rules:**
- Every user table has **RLS on**, with the policy "`user_id = auth.uid()`" for select, insert, update and delete.
- Use indexes on `user_id` and on (`user_id`, `content_type`, `content_slug`).
- Keep migrations (scripted changes to tables) as files in the repo under `supabase/migrations/`, so the database structure is versioned like code.
- Separate projects: **dev** (for testing) and **prod** (real users). Never test against production.
- Backups: Supabase takes daily backups on paid plans (verify at build time). Also export regularly.

**Why content is not moved into the database even later:** files plus Git give free history, review and rollback, and keep content pages fully static and fast. Move content to a database only if you get many non-technical editors and a Git-based CMS stops being enough. That is unlikely before V4.

---

## 20. Authentication approach

> **Recommendation card: Supabase Auth**
> - **What it is:** The login system built into Supabase. It handles sign-up, password hashing, email verification, password reset, magic links and "Sign in with Google", so we never write our own password code.
> - **Why YYOGAA needs it:** Accounts in V3 for synced favourites, history and programs.
> - **Now or later:** **Later (V3).**
> - **Simpler alternative:** No accounts (V1/V2). Or **magic-link only** (no passwords at all: the user types an email and clicks a link), which is the simplest safe start inside Supabase Auth.
> - **Downsides:** It ties login to Supabase. Email sending needs a proper provider (custom SMTP, e.g. Resend) for real volumes. Server-side cookie handling in Astro must follow Supabase's official SSR guide (verify at build time). Mistakes in redirect URLs can break login.
> - **Other options:** Better Auth or Auth.js (you then need your own database wiring, which means more work); Clerk (very easy, but costs grow with users and your user data sits with another company).

**Design:**
1. **Login methods at launch:** email magic link and Google. Add email + password (minimum 8 characters, checked against known-breached passwords where supported) if users ask for it.
2. **Sessions:** secure, `HttpOnly`, `SameSite=Lax` cookies set by the server (Astro on-demand pages, using Supabase's SSR helper). No tokens in `localStorage`.
3. **Protected pages:** everything under `/account/*` is rendered on demand. A middleware check redirects to `/account/login?next=…` when the visitor isn't signed in. The `next` value must be a **relative** path on our own site, so it can't be used to send people to other websites.
4. **Authorization:** the database enforces it through RLS, so even buggy page code can't read another user's rows.
5. **Rate limits and bot protection:** Supabase's built-in auth rate limits, plus **Cloudflare Turnstile** on sign-up if bots appear.
6. **Emails:** branded YYOGAA templates for verify, magic link and reset.
7. **Account deletion and data export:** required from day one of accounts.
8. **Secrets:** the Supabase URL and the public "anon" key go in environment variables. The **service-role key is never sent to the browser** and is used only in server code, if at all.

---

## 21. Content-management approach

**V1 (Phase 1–3): "files are the CMS".**
- You edit Markdown/YAML files in **VS Code** (a free code editor) on your computer, or directly on GitHub in the browser, just as you do today.
- A **content template** file for each type (`docs/content-templates/pose.md` etc.) shows exactly which fields to fill in.
- The build **validates** each file against its schema (Zod). A missing or misspelt field gives a clear error, and Vercel won't publish a broken page.
- Every change goes through a **branch → preview deployment → check → merge** flow (§29).

> **Recommendation card: Keystatic (Git-based CMS)**
> - **What it is:** A free, open-source editing dashboard that runs inside your site (e.g. at `/keystatic`). You fill in forms, and it saves Markdown/YAML files into your GitHub repo.
> - **Why YYOGAA needs it:** Once you have more than about 50 content items, or someone else writes content, forms are friendlier and safer than raw files.
> - **Now or later:** **Later (V2).** It is optional; skip it if you are happy editing files.
> - **Simpler alternative:** Keep editing files in VS Code or the GitHub web editor. Another option is **Decap CMS** (older, very similar idea).
> - **Downsides:** It is another dependency to keep updated. Editing on the live site needs GitHub app setup. Its schema must be kept in step with Astro's schema (two places to define fields). Check the current Astro integration guide before adopting (verify at build time).
> - **Not recommended now:** hosted CMSs (Sanity, Contentful, Storyblok). They are powerful, but add accounts, API keys, costs, and content living outside your repo. Reconsider only with a larger editorial team.

**Editorial workflow (all versions):**
1. Draft (`draft: true`).
2. Self-check using the content checklist (original wording, safety notes, alt text, image licence recorded, sources).
3. Optional teacher review (`reviewedBy`).
4. Publish (`draft: false`), then merge.
5. Review health-related pages yearly and update `updatedAt`.

**Content and legal note (important):**
- **Originality:** All pose, breath, meditation and article text must be **written by YYOGAA** (or a writer you hire with a written agreement that YYOGAA owns the work). Do not paste or lightly rephrase text from Yoga.com, books or other sites. Facts (e.g. "Tadasana is a standing pose") are free to state; someone's wording is not.
- **AI-assisted drafts:** if you use AI to help draft, a human must fact-check, rewrite in the YYOGAA voice, and check for safety. Never publish unreviewed health guidance.
- **Health and safety:**
  - Add a site-wide **Health Disclaimer** page, and a short safety note on every practice page. For example: "YYOGAA offers general wellness information, not medical advice. Listen to your body. If you are pregnant, injured, or have a medical condition, check with a qualified health professional before starting."
  - Breathwork with breath holds or fast breathing gets a stronger caution box (the `contraindicationLevel` field).
  - **No medical claims** ("cures anxiety", "treats back pain"). Use gentle, experience-based wording ("many people find…"). This matches the current voice (*Audit §18*).
  - Do **not** use `MedicalWebPage` structured data unless a qualified medical professional actually reviews the content (*Ref §19 Gaps*).
  - Have the disclaimer, privacy policy and terms checked by a lawyer before accounts or payments launch.
- **Image licensing:**
  - Record `credit` and `license` for **every** image (`owned`, `commissioned`, `unsplash`, `pexels`, `licensed-<source>`), and list credits on `/image-credits`.
  - The Unsplash licence generally allows free commercial use without attribution. However, it does not include model or property releases, and does not allow compiling photos into a competing photo service. Pose pages need **accurate** images of the exact pose, which stock rarely provides.
  - **Plan to commission original photos or line illustrations** for the pose library. Get a signed model release for any person photographed.
  - Never use images from Yoga.com or any site without a licence.
- **Audio:** only original recordings or properly licensed music. Keep the licence file with each audio item.

---

## 22. Frontend architecture

> **Recommendation card: Astro (framework)**
> - **What it is:** A tool that builds your website from reusable components and content files into **plain static HTML/CSS** with almost no JavaScript, much like your current site but without copy-pasting.
> - **Why YYOGAA needs it:**
>   1. One Header and Footer for all pages (fixes the drift).
>   2. Hundreds of pose, technique and article pages generated from files.
>   3. Content validation.
>   4. Built-in image optimisation and sitemap.
>   5. Your existing HTML and CSS can be moved in almost unchanged, because Astro templates *are* HTML.
>   6. It can later add server pages for accounts (on-demand rendering on Vercel) without switching frameworks.
> - **Now or later:** **Phase 1**, right after the quick fixes in Phase 0.
> - **Simpler alternative:** Stay plain HTML and fix bugs by hand. That is fine for 9 pages, but impossible for 200. **Eleventy (11ty)** is similar and also simple, but has a smaller built-in toolkit for images, validation and future server features.
> - **Why not Next.js:** Next.js is excellent for app-heavy sites but is built on React. It would require rewriting every page into React components, learning React, and shipping more JavaScript. It adds complexity YYOGAA doesn't need until much later, if ever. (The reference report suggested Next.js *or* Astro, *Ref §24.1*. For a beginner with content first, Astro is the better fit.)
> - **Downsides:** You need Node.js and a build step (a new concept). Astro releases major versions fairly often, so follow the upgrade guides. Server features (V3) are a bit less "all-in-one" than in Next.js. Requirements checked today: **Node.js v22.12.0 or newer, even-numbered versions only**. Use the current **LTS** (long-term support) Node release.

**Frontend decisions:**

| Decision | Choice | Reason |
|---|---|---|
| Output mode | **Static** for all content pages; on-demand only for `/account/*` and `/api/*` (V3) | Fast, cheap, secure. |
| Styling | **Plain CSS with custom properties (tokens)**. The existing `style.css` is split into `tokens.css`, `base.css`, `components/*.css` and scoped `<style>` in components | Keeps the current look exactly. Nothing new to learn. No Tailwind. |
| Design tokens | Colours (all ~15 near-duplicates reduced to about 10 named tokens), including a new `--gold-text` for accessible gold text, spacing scale, radii, font sizes | Fixes drift and contrast (*Audit §15, §20*). |
| JavaScript | **Vanilla JS** in small `<script>` tags inside components (menu, form, filters, pacer, player) | No framework needed. Each page loads only what it uses. |
| UI framework (React, Preact…) | **None**. Revisit only if the V2 practice player becomes complex | Less to learn. |
| TypeScript | Only where Astro needs it (`content.config.ts`); everything else in plain JS | Beginner-friendly. |
| Fonts | Self-hosted DM Sans (400/600/700 only; drop the unused 500, *Audit §22*) and Playfair Display italic 500/600, preloaded | Speed and privacy. |
| Images | Astro `<Image>` / `<Picture>` from local files, giving WebP/AVIF, `srcset`, width/height and lazy loading automatically | Fixes *Audit §22*. Optimised at build time, so it uses none of Vercel's image quota. |
| Components (first set) | `BaseLayout`, `SEO`, `Header`, `MobileMenu`, `Footer`, `Breadcrumbs`, `Button`, `Kicker`, `AccentHeading` (the sans + gold italic word), `InnerHero`, `CategoryCard`, `FeaturedBox`, `PrinciplesGrid`, `FoundationCard`, `ExploreTile`, `StoryCard`, `FinalCta`, `ContactForm`, `NewsletterForm`, `SafetyNote` | Directly mirrors the existing patterns (*Audit §17*). |
| Practice player (V2) | Vanilla JS component: shows the current pose and hold timer, next/pause, optional chime; a **breath pacer** animation for techniques (respects reduced motion) | The core interactive feature. |

---

## 23. Backend / API architecture

**V1–V2: effectively no backend of our own.**

| Need | Service | Notes |
|---|---|---|
| Contact form | **Formspree** (keep) | Add the `_gotcha` honeypot, relative redirect and inline messages. Check the Formspree dashboard's spam filtering and allowed domains. |
| Newsletter | **Newsletter provider** (card below) | Its hosted form endpoint. Double opt-in. |
| Search | **Pagefind** (static files) | |
| Analytics | **Vercel Web Analytics** (card below) | |
| Audio files (V2) | **Vercel Blob** | Upload through the dashboard. Public URLs go in content files. |

> **Recommendation card: Newsletter — Buttondown**
> - **What it is:** A simple, privacy-respecting email newsletter service. You write in Markdown and it sends the emails and handles unsubscribes.
> - **Why YYOGAA needs it:** It builds an audience from day one (V1). A plain HTML form can post directly to it, so no server is needed.
> - **Now or later:** **V1 (Phase 3).**
> - **Simpler alternative:** Collect interest through the existing Formspree contact form ("Collaboration/Other"). This is not good for sending newsletters, and you must not bulk-email people who only sent a message.
> - **Downsides:** Paid once the list grows past the free tier (verify current limits and prices at build time). Fewer marketing automations than MailerLite or Kit. **MailerLite** is a reasonable alternative if you want a bigger free tier and visual email design, at the cost of a heavier embed script.
> - **Must-haves:** double opt-in, a clear consent line and link to `/privacy`, and a honeypot on the form.

> **Recommendation card: Analytics — Vercel Web Analytics**
> - **What it is:** Visitor statistics (page views, top pages, countries, devices) built into Vercel. Vercel describes it as privacy-friendly and **cookie-free**.
> - **Why YYOGAA needs it:** To learn what content people use and where they come from, and to decide what to build next.
> - **Now or later:** **V1 (Phase 3)**, switched on in the Vercel dashboard plus one small script.
> - **Simpler alternative:** None at all, or Google Search Console only (free; shows search queries, not visitors). **Add Search Console in any case.**
> - **Downsides:** The Hobby plan includes 50,000 events a month and 1 month of history (verified today). Collection pauses if you exceed that. Less detail than GA4. Tied to Vercel. **Plausible** (paid) or self-hosted **Umami** are good privacy-first alternatives. **Avoid GA4 plus Meta pixel**: they need a real consent banner (*Ref §21 Consent*).

**V3: small server layer inside the same Astro project, on Vercel.**
- Astro **on-demand pages** and **API endpoints** run as Vercel serverless functions through the official Vercel adapter (verify setup at build time).
- Endpoints (all require login, validate input and return JSON):

| Method + path | Purpose |
|---|---|
| `GET /api/me` | Current user's profile |
| `PATCH /api/me` | Update profile (validated) |
| `GET/POST/DELETE /api/favorites` | List / add / remove a favourite |
| `POST /api/sessions` | Log a practice session |
| `GET /api/sessions?from=&to=` | History |
| `POST /api/programs/[slug]/progress` | Mark a lesson done |
| `GET /api/recommendations` | Rule-based suggestions |
| `POST /api/account/export` · `POST /api/account/delete` | Privacy rights |

- **Input validation:** every endpoint checks its input with **Zod** (e.g. `content_slug` must match a real slug from the content index, and `duration_seconds` must be 0–14400).
- **Content check:** the server loads the build-time content index, so it rejects favourites for items that don't exist.
- **Errors:** friendly JSON messages. Details are logged privately and never sent to the browser.
- **Contact form upgrade (optional, V3):** replace Formspree with `/api/contact` using **Resend** (an email-sending API) plus Turnstile, only if Formspree limits become a problem.

**Long-term:** payments via **Stripe** (hosted Checkout plus webhooks to `/api/stripe/webhook`); teacher and studio dashboards; moderation tools. Consider a separate backend service only if serverless functions become limiting.

---

## 24. SEO architecture

Built into `BaseLayout` and `SEO.astro`, so **every page gets it automatically**.

| Item | Rule |
|---|---|
| `<title>` | `{Page title} — YYOGAA` (home: `YYOGAA — Move. Breathe. Return.`). Pose pattern: `{Pose} ({Sanskrit}): How to Practice — YYOGAA`, written in our own words. |
| Meta description | From `summary` / `dek`. 120–160 characters. Unique. |
| Canonical | The absolute URL on the **production domain** (from one `site` setting in `astro.config.mjs`). |
| Open Graph / Twitter | Title, description, 1200×630 image (per item, or a branded default), `og:type` article/website. |
| Structured data (JSON-LD) | `Organization` + `WebSite` (home); `BreadcrumbList` (everything below a hub); `Article` (journal); `HowTo` or `Article` for poses and techniques (**not** `MedicalWebPage`); `CollectionPage` for libraries; `Person` for authors. Validate with Google's Rich Results Test. |
| Headings | One `<h1>` per page; logical H2/H3 order (fixes *Audit §20* heading skip). |
| Sitemap | `@astrojs/sitemap` generates `sitemap-index.xml` automatically. It excludes `noindex` pages, and includes **all** libraries (unlike *Ref §19 Gaps*). |
| `robots.txt` | Allow all. Point to the sitemap. Disallow `/account/`, `/api/`, `/search`. |
| `noindex` | `/thank-you`, `/search`, `/account/*`, newsletter confirm pages, drafts, and tag pages with fewer than 3 items. |
| Preview deployments | Vercel adds `noindex` to preview URLs by default (per Vercel docs; verify). Production must be the only indexed copy. |
| Redirects | Real **308** redirects (vercel.json) for every old or renamed URL. Never client-side redirects (*Ref §3.6*). |
| Domain | Pick **one** host (`yyogaa.com` or `www.yyogaa.com`) and redirect the other and `yyogaa-website.vercel.app` to it (ASSUMPTION A1). |
| Internal links | Breadcrumbs; related content; sequences link to every pose they use (improves on *Ref §3.4*); Explore pages link across pillars. |
| Images | Descriptive alt text; `alt=""` for decorative images; descriptive file names (`mountain-pose.jpg`). |
| 404 | A friendly custom page, a **real 404 status**, a search box and pillar links (improves on *Ref §3.18*). |
| Search Console | Verify the domain, submit the sitemap, watch coverage. |
| Content quality | Depth over volume: 40 excellent poses beat 200 thin ones. Always show author and updated date. |
| `llms.txt` | Optional, long-term. |

---

## 25. Accessibility requirements

**Target: WCAG 2.2 level AA** on every page. It is a requirement, not a nice extra.

| Requirement | Detail | Fixes |
|---|---|---|
| Colour contrast | Body text ≥ 4.5:1; large text (≥ 24px, or ≥ 18.66px bold) ≥ 3:1; UI borders and icons ≥ 3:1. Use `--gold-text` (about `#765f2e`) for small gold text on cream. Gold `#baa060` only on dark backgrounds or as decoration. | *Audit §20* (2.3:1 kickers) |
| Keyboard | Everything usable with Tab, Enter, Space and Escape. No keyboard traps. Visible `:focus-visible` ring (2px charcoal on light, 2px gold on dark). | *Audit §20* |
| Skip link | "Skip to content" as the first element. | *Audit §20* |
| Landmarks | `header`, `nav aria-label="Main"`, `main`, `footer`; breadcrumb `nav`. | |
| Menu | `<button aria-expanded aria-controls>`, focus handling, Escape to close. | *Audit §14* |
| Current page | `aria-current="page"`. | |
| Headings | One H1; no skipped levels; decorative quote is a `<blockquote>`, not an H2. | *Audit §20* |
| Images | Meaningful alt text; `alt=""` for decorative images and duplicate thumbnails. | *Audit §20* |
| Forms | Labels (already good), `autocomplete`, errors shown next to fields and announced via `aria-live`, no `alert()`. | *Audit §13* |
| Motion | `prefers-reduced-motion` turns off smooth scroll, zooms and the breath-pacer animation (show a counting text version instead). | *Audit §20* |
| Touch targets | At least 44×44px (the hamburger is currently 42px). | *Audit §20* |
| Audio / video | Transcript for every guided audio; captions for any video; no autoplay with sound. | |
| Timers | The practice player can be paused, and times can be extended (WCAG "Timing adjustable"). | |
| Zoom and reflow | Usable at 200% zoom and at 320px width without sideways scrolling. | *Audit §16* overflow risks |
| Language | `lang="en"` (already present); Sanskrit terms can use `lang="sa-Latn"`. | |
| Testing | Automated axe checks (browser extension, later in CI) plus a manual keyboard pass plus one screen-reader pass (NVDA on Windows, free) for each new template. | |
| Statement | Publish `/accessibility` with contact details for problems. | |

---

## 26. Security considerations

| Area | Now (V1) | Later (V3+) |
|---|---|---|
| Secrets | None in the repo today (*Audit §23*). Add `.gitignore` with `.env`. | All keys only in Vercel environment variables. `.env.example` with placeholders. Rotate a key if one is ever exposed. |
| Forms / spam | Formspree `_gotcha` honeypot; check Formspree's spam settings and restrict the form to our domain. | Turnstile on sign-up, contact and newsletter if bots appear; server-side rate limits. |
| Email harvesting | Keep `mailto:` (simple), or show the address only in the form's success message. Low priority. | |
| Security headers | Add in `vercel.json`: `Content-Security-Policy` (allow only self, Formspree, the newsletter provider, Vercel analytics, the audio host), `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (disable camera, mic, geolocation), `X-Frame-Options: DENY` / `frame-ancestors 'none'`. Test in a preview deployment first, because a wrong CSP breaks pages. | The same, plus auth domains. |
| Dependencies | Few packages; `npm audit` each month; Dependabot (GitHub's automatic update PRs) turned on. | Same. |
| Auth | — | Supabase Auth only; HttpOnly cookies; RLS on every table; the service-role key never reaches the browser; validate `next=` redirects. |
| Input validation | — | Zod on every endpoint; parameterised queries via Supabase client (never string-built SQL). |
| XSS | Astro escapes text by default. **Never** insert user text as raw HTML (`set:html`) unless it has been sanitised. | User notes shown only to their owner, and escaped. |
| CSRF | — | SameSite cookies plus POST-only changes; check the `Origin` header on API routes. |
| Privacy | Privacy policy page before the newsletter launches; self-host fonts (no Google IP sharing); cookieless analytics, so no cookie banner is needed for analytics (confirm with the privacy policy review). | Data minimisation (§16); export and delete; a data-processing list (Supabase, Vercel, newsletter provider, Formspree). |
| Repo hygiene | `.claude/` and other local folders are git-ignored. Turn on GitHub **branch protection** for `main` once you use PRs. Turn on 2-factor login for GitHub, Vercel, Formspree and the domain registrar. | |
| Backups | Git is the backup for content. | Database backups and occasional exports. |

---

## 27. Performance considerations

**Budgets (targets)** for a typical content page on a mid-range phone:
- LCP under 2.5 s, CLS under 0.1, INP under 200 ms (Core Web Vitals "good").
- Page weight under 500 KB on first load (excluding optional audio).
- JavaScript under 30 KB per page (V1).

| Technique | Detail |
|---|---|
| Static HTML | Pre-built pages served from Vercel's CDN. |
| Optimised images | Astro `<Picture>`: AVIF/WebP, `srcset`, correct sizes, `width`/`height` (no layout jump), `loading="lazy"` below the fold, hero `fetchpriority="high"` and **no CSS-background hero images** (so the browser finds them early, fixing *Audit §22*). |
| Fonts | Self-host only the weights used (about 5 files), `font-display: swap`, preload the 2 most important ones. |
| CSS | Astro bundles and minifies CSS and ships page-specific styles only. |
| JS | Only small scripts on pages that need them; no frameworks. |
| Caching | Vercel caches static files; Astro gives built CSS/JS unique file names, so they can be cached for a year. |
| Library pages | Server-rendered cards with lazy images. Paginate beyond about 60 cards. |
| Audio | Streamed (never preloaded) with `preload="none"`; compressed files (e.g. 96–128 kbps for spoken word). |
| Monitoring | Lighthouse in Chrome DevTools for each new template; **Vercel Speed Insights** (free tier limited; verify) for real-user numbers. |

---

## 28. Mobile strategy

1. **Mobile-first CSS from Phase 1 onward.** Write the phone layout first and add `min-width` media queries for bigger screens. (The current CSS is desktop-first, *Audit §16*.) Do this gradually, component by component, while preserving the look.
2. **Fix the critical mobile nav in Phase 0** (on the current HTML), before anything else.
3. **Test widths:** 320, 375, 414, 768, 1024, 1280 px, including the hero H1 overflow risk at 320–360 px (*Audit §16*). Use `clamp()` sizes that shrink further on small screens.
4. **Practice-friendly mobile UX** (V2): a large, readable practice player; screen stays awake during a practice (Screen Wake Lock API, where supported); big pause button; works in landscape.
5. **Progressive Web App (PWA)** (V3, optional): a web manifest and icons let people "Add to home screen"; offline access to saved practices through a service worker. This comes **before** any native app.
6. **Native apps** (iOS/Android): long-term only, if usage data justifies them. The same Supabase backend would serve them.

---

## 29. Deployment strategy with GitHub + Vercel

**Today (ASSUMPTION A2):** GitHub `main` → Vercel auto-deploys a static site with no build step.

**Target workflow (from Phase 1):**
```
Your computer (VS Code + Git + Node)
   │ 1. create a branch, e.g. "feature/pose-library"
   │ 2. edit, run "npm run dev" to preview locally at http://localhost:4321
   │ 3. run "npm run build" to be sure it builds
   ▼
GitHub  ── push branch ── open Pull Request
   │                        │
   │                        ▼
   │                 Vercel builds a PREVIEW deployment (private URL)
   │                 → you check it on phone + desktop
   ▼
Merge PR into main  ──►  Vercel builds PRODUCTION  ──►  yyogaa.com
```

| Topic | Plan |
|---|---|
| Tools to install (Phase 1, **ask before installing**) | **Git for Windows** (it is not on PATH now), **Node.js LTS** (v22.12+ or a newer even version), **VS Code**. |
| Vercel settings | Framework preset "Astro" (auto-detected); build command `npm run build` (includes Pagefind); output `dist`; Node version matching local. |
| Config file | `vercel.json` holds redirects, security headers and `trailingSlash: false`. |
| Environment variables | None in V1–V2 (except maybe a newsletter form ID, which is public anyway). In V3, Supabase URL and anon key, set separately for Preview (dev database) and Production (prod database). |
| Domains | Add `yyogaa.com` in Vercel; redirect `www` (or the reverse) and the `vercel.app` domain to the main one. |
| Rollback | Vercel keeps every deployment. "Promote" or "Instant Rollback" an older one if a release breaks. |
| Checks before merge | Build passes (includes content validation) → click through the preview → Lighthouse on changed templates. Later: a GitHub Action running a link checker and axe. |
| Plan | **Hobby (free)** while the site is personal and non-commercial. **Move to Pro before any monetisation** (memberships, ads, paid courses). Hobby is limited to "non-commercial, personal use only" (verified today). Pro is currently $20 per developer seat per month (verify at the time). |
| Branch protection | Once comfortable with PRs, require PRs to merge into `main`. |

---

## 30. How the existing static site can safely evolve (no big-bang rewrite)

**Principle:** the site stays live and working after **every** step. Each step is small, done on its own branch, checked on a Vercel preview, then merged.

### Step 0 — Fix the current HTML in place (Phase 0, no new tools)
All in the existing files, low risk:
1. Copy the working mobile-menu markup from `index.html` into the 6 pages that lack it. Improve `script.js`: `aria-expanded`, label toggle, Escape, close on link click and resize.
2. Thank-you redirect: in `script.js`, redirect to the relative path `thank-you.html` instead of the absolute URL. Formspree's no-JS `_next` field stays as-is for now (it becomes the new domain later).
3. Add `<input type="text" name="_gotcha" style="display:none" tabindex="-1" autocomplete="off">` (Formspree's honeypot field). Replace `alert()` with an inline `role="status"` message.
4. Dead "Explore →" and "Begin practice" links: point them to `#practice` anchors or relabel them "Coming soon". Do **not** send them to Contact. The homepage "Join Yyogaa" button can stay on Contact until the newsletter exists.
5. Contrast token and focus styles, skip link, reduced motion, `aria-current`, heading fixes, About selector fix.
6. thank-you: `<h1>`, meta description, `<meta name="robots" content="noindex">`.
7. Add `.gitignore`, `robots.txt`, a favicon, OG tags, canonical tags (to the current domain), a simple `404.html`, and `loading="lazy"` plus width/height on images.

### Step 1 — Move the same site into Astro with identical looks (Phase 1)
1. Create the Astro project **in the same repo** on a branch `astro-migration`. Keep the old HTML files until the switch.
2. Move `style.css` in first, unchanged, so the look is guaranteed. Then build `BaseLayout`, `Header` and `Footer` from the existing markup.
3. Rebuild each of the 9 pages as `.astro` files by pasting their `<main>` HTML (almost no changes).
4. **Visual check:** compare old and new pages side by side at 375 / 768 / 1280 px on the Vercel preview. They should look identical, apart from the Phase 0 fixes.
5. **Switch URLs to clean ones and add permanent redirects** in `vercel.json` (308, verified behaviour):
   ```
   /index.html      → /
   /yoga.html       → /yoga
   /breathwork.html → /breathwork
   /meditation.html → /meditation
   /sound.html      → /sound
   /journal.html    → /journal
   /about.html      → /about
   /contact.html    → /contact
   /thank-you.html  → /thank-you
   ```
   Anchors keep working (`/yoga#practice`). Update the Formspree `_next` value and canonicals.
6. Merge. Vercel now builds with Astro. **Check each old `.html` URL in the browser redirects correctly.**
7. Then, in small separate PRs, refactor CSS into tokens and components and self-host fonts and images, re-checking visuals each time.

### Step 2 onward — add, don't rewrite
New sections (poses, techniques, journal articles) are **new folders and templates**. Existing pages only gain links to them. Accounts (V3) are added as a separate `/account` area with on-demand rendering, and the content pages stay static.

**Safety nets:**
- Every change goes through a preview deployment.
- Vercel Instant Rollback is available.
- A redirect list is maintained in `vercel.json` for any future slug change.
- Keep a `docs/planning/redirects.md` log explaining why each redirect exists.

---

## 31. Existing files/content that can be reused

| Existing | Reuse as |
|---|---|
| `style.css` (colours, type scale, components) | Starting `global.css`, later split into `tokens.css` + component styles. Values are kept exactly. |
| Header markup (`index.html` version with mobile menu) | `Header.astro` + `MobileMenu.astro` |
| Footer markup | `Footer.astro` |
| Home sections (hero, quote, journal grid, featured practice, editor's picks, foundation 01–04, explore tiles, final CTA) | Home page components; the Explore tiles become links to `/explore/[topic]` |
| Practice page template (inner hero, intro, 6 category cards, "Start here" box, 4 principles, final CTA) | `PillarHub` layout used by Yoga, Breathwork, Meditation, Sound |
| The 24 practice category names (Beginner, Morning, Calm, Focus, Sleep, Singing Bowls…) (*Audit §5–8*) | Seed values for goals, meditation types and sound instruments in the taxonomy |
| "START HERE" titles ("Your first 20-minute practice", "A 5-minute breathing reset", "A 5-minute meditation for presence", "A simple sound meditation") | The **first four real content items** to write in Phase 2 |
| The 16 principles (Move slowly, Notice first, Start small…) | Pillar hubs and beginner guides |
| Journal mock titles and excerpts | A backlog of the first articles to write (e.g. "Beginner Yoga: Where Do You Actually Start?") |
| About copy and values (Accessibility, Awareness, Consistency, Curiosity) | About page, editorial policy and brand guide |
| Breathwork safety line (*Audit §5–8*) | Seed for the `SafetyNote` component wording |
| `script.js` menu and form logic | `MobileMenu` and `ContactForm` component scripts (improved) |
| Contact form + Formspree ID | `ContactForm.astro` (same endpoint) |
| Unsplash images | Temporary imagery, then downloaded locally with licence records and gradually replaced |
| Audit "Visual identity" section | The basis of `docs/brand/brand-guide.md` (to write in Phase 1) |

---

## 32. What to migrate eventually

| From | To | When |
|---|---|---|
| 9 `.html` files | `.astro` pages | Phase 1 |
| `.html` URLs | clean URLs + 308 redirects | Phase 1 |
| Hot-linked Unsplash | local optimised images → commissioned originals | Phase 1 → V2 |
| Google Fonts CDN | self-hosted fonts | Phase 1 |
| Hard-coded journal cards | Markdown articles in a content collection | Phase 2 |
| Hard-coded category cards on pillar pages | Generated from taxonomy and content | Phase 2 |
| Device-only favourites and history (V2) | Supabase tables (with one-time merge) | V3 |
| Audio on Vercel Blob | Supabase Storage (to keep user and premium files together), if premium audio arrives | V3+ |
| Formspree | optional `/api/contact` + Resend | V3, only if needed |
| Editing files by hand | Keystatic forms | V2 (optional) |
| `yyogaa-website.vercel.app` | `yyogaa.com` custom domain | V1 launch (Phase 3) |

---

## 33. Suggested folder/project structure (after Phase 1–2)

```
yyogaa-website/
├── .github/
│   └── dependabot.yml              # automatic dependency update PRs
├── docs/
│   ├── research/                   # audits (existing)
│   ├── planning/                   # this blueprint, redirects log
│   ├── brand/brand-guide.md        # palette, type, voice, wordmark rules
│   └── content-templates/          # copy-and-fill templates: pose.md, breath.md, article.md…
├── public/                         # copied as-is to the site root
│   ├── favicon.svg, favicon.ico, apple-touch-icon.png
│   ├── robots.txt
│   ├── og-default.jpg
│   └── fonts/                      # self-hosted DM Sans + Playfair italic
├── src/
│   ├── assets/images/              # images optimised at build time
│   ├── components/
│   │   ├── layout/                 # Header, MobileMenu, Footer, Breadcrumbs, SEO
│   │   ├── ui/                     # Button, Kicker, AccentHeading, Card, SafetyNote
│   │   ├── sections/               # InnerHero, FeaturedBox, PrinciplesGrid, FinalCta…
│   │   ├── library/                # PoseCard, FilterBar, ResultCount
│   │   └── forms/                  # ContactForm, NewsletterForm
│   ├── content/
│   │   ├── poses/*.md
│   │   ├── styles/*.md
│   │   ├── sequences/*.md
│   │   ├── breathwork/*.md
│   │   ├── meditations/*.md
│   │   ├── sound/*.md              # V2
│   │   ├── journal/*.md
│   │   ├── programs/<slug>/*.md    # V2
│   │   ├── authors/*.yaml
│   │   ├── pages/*.md              # legal/trust pages
│   │   └── taxonomy/               # goals.yaml, levels.yaml, pose-categories.yaml, journal-categories.yaml
│   ├── content.config.ts           # schemas (the rulebooks) for every collection
│   ├── layouts/                    # BaseLayout, PillarHubLayout, ArticleLayout, PracticeItemLayout
│   ├── pages/                      # each file/folder = a URL (see §8)
│   │   ├── index.astro
│   │   ├── yoga/index.astro, yoga/poses/index.astro, yoga/poses/[slug].astro …
│   │   ├── breathwork/…, meditation/…, sound/…, explore/…, journal/…
│   │   ├── search.astro, 404.astro, thank-you.astro, about.astro, contact.astro
│   │   ├── account/…               # V3 (on-demand)
│   │   └── api/…                   # V3 (on-demand)
│   ├── scripts/                    # menu.js, contact-form.js, filters.js, saved.js, player.js
│   ├── styles/                     # tokens.css, base.css, utilities.css
│   └── lib/                        # small helpers: reading time, SEO data, content index, supabase (V3)
├── supabase/migrations/            # V3: database structure as files
├── astro.config.mjs                # site URL, integrations (sitemap), output settings
├── vercel.json                     # redirects + security headers
├── package.json / package-lock.json
├── .env.example                    # V3: placeholder names only
├── .gitignore                      # node_modules, dist, .env, .claude, .vercel, .astro
└── README.md                       # how to run, build, add content
```

---

## 34. Development phases

| Phase | Name | Goal | Needs new tools? | Rough effort* |
|---|---|---|---|---|
| **0** | Stabilise | Fix critical/high audit issues on the current HTML | No | 1–2 weeks |
| **1** | Foundation | Same site in Astro: components, tokens, clean URLs with redirects, SEO base, legal pages | Git, Node, VS Code | 2–4 weeks |
| **2** | Content core (V1) | Pose library, breathwork and meditation libraries, sequences (read-only), journal, Explore topics, search | No more | 4–8 weeks (mostly writing content) |
| **3** | V1 launch | Newsletter, analytics, custom domain, Search Console, accessibility and performance audit | Accounts on those services | 1–2 weeks |
| **4** | Practice experience (V2) | Practice player, breath pacer, sound library with audio, programs, device-only saved and history, glossary, tags, optional Keystatic | Vercel Blob | 6–10 weeks |
| **5** | Accounts (V3) | Supabase auth, synced favourites, history, progress, recommendations, PWA | Supabase | 6–10 weeks |
| **6+** | Platform | Teachers, events, retreats, memberships, community, studios | Stripe etc. | Ongoing |

\*Very rough, for a beginner working part-time with AI help. It depends mostly on how fast **original content** is written and photographed.

---

## 35. MVP / Version 1 feature list (Phases 0–3; no accounts, no database)

**Fixes and foundation**
- [ ] Working, accessible mobile navigation on every page
- [ ] Contact form: relative thank-you redirect, honeypot, inline accessible messages
- [ ] No dead CTAs; honest "Coming soon" labels where content doesn't exist yet
- [ ] AA contrast, skip link, focus styles, reduced motion, heading order
- [ ] Astro components (one header and footer), design tokens, self-hosted fonts, optimised images
- [ ] Clean URLs with 308 redirects from every old `.html` address

**Content (original, with safety notes)**
- [ ] **Pose library:** about 30–40 beginner and intermediate poses, with filters saved in the URL, and individual pose pages
- [ ] **Yoga styles:** about 5 (e.g. Hatha, Vinyasa, Yin, Restorative, Gentle)
- [ ] **Sequences (read-only pages):** about 5, linking to their poses
- [ ] **Beginner guide** (`/yoga/beginners`)
- [ ] **Breathwork library:** about 8 techniques with pages
- [ ] **Meditation library:** about 6 written practices with pages
- [ ] **Sound:** hub page with education content (audio waits for V2)
- [ ] **Journal:** about 8–10 real articles, categories, author page, related content
- [ ] **Explore topic pages** (`/explore/sleep`, etc.), generated from goals
- [ ] **Site search** (Pagefind)

**Trust, reach and measurement**
- [ ] Health disclaimer, privacy, terms, accessibility statement, editorial policy, image credits
- [ ] SEO: canonicals, OG images, JSON-LD, sitemap, robots, custom 404
- [ ] Newsletter sign-up (double opt-in)
- [ ] Vercel Web Analytics + Google Search Console
- [ ] Custom domain `yyogaa.com` with redirects from the `vercel.app` address
- [ ] Security headers in `vercel.json`

**Out of V1:** accounts, database, audio, practice player, programs, CMS.

---

## 36. Version 2 (practice experience, still no accounts)

- **Practice player** for sequences: pose-by-pose display, hold timer, pause, optional soft chime, keeps the screen awake, keyboard and screen-reader friendly.
- **Breath pacer** for breathwork techniques, using the `pattern` field (animated circle, or counting text for reduced motion).
- **Guided audio** for meditations and **sound sessions library** (original recordings on Vercel Blob; transcripts).
- **Programs:** e.g. "First 7 Days", "Better Sleep Week", as multi-lesson pages with previous/next links.
- **Saved on this device** (favourites) and **practice history on this device**, via `localStorage`.
- **Glossary**, **tag pages**, more content (target: about 80 poses, 15 techniques, 12 meditations, 25 articles).
- **Keystatic** editor (optional).
- Original pose **illustrations or photography** begin replacing stock.
- Print-friendly sequence pages.

---

## 37. Version 3 (accounts & personalisation)

- **Accounts** (Supabase Auth: magic link + Google; password optional), with verify, reset, delete and export.
- **Synced favourites and collections**, with a one-time merge of device-saved items.
- **Practice history and gentle progress** (minutes, sessions per week, program completion).
- **Program progress tracking.**
- **Rule-based recommendations** on a simple "For you" home section.
- **Short optional onboarding** (level, goals, preferred length).
- **PWA:** installable, with offline access to saved practices.
- Turnstile and rate limits where needed; lawyer-reviewed privacy policy and terms.
- Move to the **Vercel Pro** plan if the site is commercial by then (ASSUMPTION A5).

---

## 38. Long-term platform features (only when justified by real demand)

| Feature | Prerequisites and notes |
|---|---|
| **Teachers and teacher profiles** | Verified credentials, profile editing, moderation; clear agreements. |
| **Paid memberships and premium courses** | Stripe, tax handling, refund policy, legal review, content gating via accounts (the database holds entitlements). |
| **Live or on-demand video classes** | A video host (e.g. Mux or Cloudflare Stream), captions, bandwidth costs. |
| **Events and retreats** | Listings first; bookings and payments later; cancellation policies. |
| **Studios and studio discovery** | Needs a **legitimate data source** (owner-submitted listings), maps with a production-friendly tile provider, claim and moderation flows, reviews moderation. Never scrape (*Ref §15*). |
| **Community** (comments, groups) | Moderation tools, reporting, safety policies. High effort and high risk; do it last. |
| **Multilingual site** (e.g. Hindi) | Astro supports i18n routing; translation workflow. |
| **Native mobile apps** | Only after the PWA proves demand; same Supabase backend. |
| **Smarter recommendations / AI assistant** | Only with clear safety limits (no medical advice) and privacy review. |
| **Admin dashboard** | For teachers, events, users and moderation. Could be Supabase dashboard + Keystatic at first. |

---

## 39. Risks & technical challenges

| Risk | Why it matters | Mitigation |
|---|---|---|
| **Beginner overwhelm** | Too many new tools at once leads to stalled progress. | Phase 0 needs no new tools; one new concept per phase; small PRs; this plan. |
| **Content is the real bottleneck** | Hundreds of quality, safe, original items take far longer than code. | Start with 30–40 excellent items; content templates; a steady weekly writing rhythm; depth over breadth. |
| **Health and safety liability** | Wrong guidance can hurt someone. | Disclaimers, cautions on every item, no medical claims, teacher review, legal review before accounts and payments. |
| **Copyright and image licensing** | Copying text or images, or using stock without releases, is a legal risk. | Originality rules, licence fields, `/image-credits`, commissioned originals for poses. |
| **Looking too similar to Yoga.com** | The palettes and "Breathe easy." line are already close (*Ref §6.1, §4*). | Keep YYOGAA's own fonts, wordmark and voice; don't adopt their patterns visually; consider a new home headline. |
| **Breaking URLs or SEO during migration** | Lost rankings, broken shared links. | Explicit 308 redirects, check every old URL after the switch, update Search Console. |
| **Visual regressions in the Astro move** | Brand drift. | Move CSS unchanged first; compare side by side on previews at 3 widths. |
| **Framework churn** (Astro major versions) | Upgrades can break builds. | Pin versions (lock file), upgrade deliberately with the official guides, never on a launch day. |
| **Vercel Hobby non-commercial rule** | Account restrictions if the site earns money. | Move to Pro before monetising. |
| **Free-tier limits** (analytics events, Supabase pausing, newsletter) | Features pause unexpectedly. | Monitor usage; budget small monthly costs from V3. |
| **Auth and RLS mistakes** | Data leaks. | Use Supabase Auth; RLS tests (try reading another user's rows with a test account); code review before launch. |
| **Privacy law** (GDPR, DPDP, etc.) | Fines and loss of trust. | Collect the minimum; cookieless analytics; clear policy; export and delete. |
| **Audio hosting costs** | Bandwidth grows with popularity. | Compressed files, `preload="none"`, monitor Blob usage, move to cheaper storage if needed. |
| **Spam** | Inbox floods. | Honeypot now; Turnstile if needed. |
| **Single maintainer** | Knowledge lives in one head. | README, content templates, this blueprint, and small commits with clear messages. |

---

## 40. Recommended build order

Each item is one small branch, one preview check and one merge.

**Phase 0 — Stabilise (current HTML, no installs)**
1. **Mobile menu on all 9 pages** + accessible toggle behaviour in `script.js`. *(Critical; recommended FIRST step.)*
2. Contact form: relative redirect, `_gotcha` honeypot, inline `aria-live` messages.
3. Replace dead practice CTAs with anchors or "Coming soon" labels.
4. Accessibility pass: gold-text contrast token, skip link, `:focus-visible`, `aria-current`, reduced motion, heading fixes, About selector fix, 44px hamburger.
5. thank-you `<h1>` + `noindex` + description; `404.html`; `robots.txt`; favicon; OG tags; `.gitignore`; README.
6. Image quick wins: `loading="lazy"`, width/height, lighter Unsplash parameters.

**Phase 1 — Foundation**

7. Install Git, Node LTS and VS Code (with your OK). Clone the repo locally.
8. Create the Astro project on a branch; move `style.css` unchanged; build `BaseLayout`, `Header`, `MobileMenu`, `Footer`, `SEO`.
9. Port the 9 pages; visual comparison on the preview.
10. Clean URLs + `vercel.json` redirects + security headers (tested on the preview); merge; verify every old URL.
11. Tokenise CSS and self-host fonts; move images local with licence records.
12. Legal and trust pages (health disclaimer first).

**Phase 2 — Content core**

13. `content.config.ts` + taxonomy files + content templates.
14. Pose collection → `/yoga/poses/[slug]` template → library page with URL-based filters. Write the first 10 poses, then grow to 30–40.
15. Breathwork techniques (start with the existing "5-minute breathing reset") → meditation practices → yoga styles → read-only sequences.
16. Journal: article template, index, categories, author page; publish the first 5 articles.
17. Explore topic pages; wire homepage tiles and cards to real content (fixes non-clickable cards, *Audit §19.4*).
18. Pagefind search page + header search button.

**Phase 3 — V1 launch**

19. Newsletter form (Buttondown) + privacy text.
20. Vercel Web Analytics + Search Console + sitemap submission.
21. Custom domain + redirects from `vercel.app`.
22. Full accessibility and performance review; fix; **launch V1**.

**Phase 4 → 5:** follow §36 (V2), then §37 (V3), in the order listed there.

---

### Summary of technology decisions

| Decision | Recommendation | When |
|---|---|---|
| Framework | **Astro** (static output) | Phase 1 |
| Content format | **Markdown + YAML frontmatter**, validated with Zod schemas | Phase 2 |
| Styling | **Plain CSS + design tokens** (existing styles kept) | Phase 1 |
| Interactivity | **Vanilla JavaScript** | Now |
| CMS | **Files in Git** → optional **Keystatic** | V1 → V2 |
| Search | **Pagefind** | V1 |
| Forms | **Formspree** (keep) + honeypot | Now |
| Newsletter | **Buttondown** (double opt-in) | V1 |
| Analytics | **Vercel Web Analytics** + Google Search Console | V1 |
| Hosting | **Vercel** (Hobby → Pro before monetising) + GitHub | Now |
| Audio storage | **Vercel Blob** | V2 |
| Database | **Supabase Postgres** with RLS | V3 |
| Auth | **Supabase Auth** (magic link + Google) | V3 |
| Bot protection | Honeypot now; **Cloudflare Turnstile** if needed | Now / V3 |
| Payments | **Stripe** | Long-term |
