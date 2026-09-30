# YYOGAA — Yoga Library Implementation Plan

- **Status:** Planning document only. No website file has been changed, nothing was installed, nothing was committed.
- **Date:** 2026-09-30
- **Builds on:** `docs/planning/YYOGAA-MASTER-BLUEPRINT.md` (called **"the blueprint"**, cited as *BP §n*), `docs/research/yyogaa-current-site-audit.md` (*Audit §n*), `docs/research/yoga-com-reference-research.md` (*Ref §n*, used for layout and feature ideas only).
- **Current code looked at:** `yoga.html`, `index.html`, `style.css` (section list), `script.js` (includes the mobile-menu fix, commit `a897254`), and the file list. There is still no `package.json`, `vercel.json` or `.gitignore`.
- **Checked in official docs today (2026-09-30):**
  - Astro configuration reference: `build.format` (`'directory'` default, `'file'`, `'preserve'`) and `trailingSlash` (`'ignore'` default, `'always'`, `'never'`).
  - Astro content collections guide: `src/content.config.ts`, the `glob()` loader, IDs made from file names, `reference()` for links between entries, `getCollection()` / `getEntry()`, and `getStaticPaths()`.
  - Vercel `vercel.json` reference: `cleanUrls: true` serves `about.html` at `/about` and sends a 308 redirect from `/about.html` to `/about`. `trailingSlash: false` sends a 308 redirect from `/about/` to `/about`.
  - Pagefind docs: it runs after the build and indexes the output folder (`pagefind --site <folder>`); it supports `data-pagefind-body`, `-filter`, `-meta` and `-ignore` attributes.
  - Anything not in this list is marked **(verify at build time)**.

### Labels used in this document

| Label | Meaning |
|---|---|
| **ASSUMPTION** | I am assuming this. Please confirm or correct it. |
| **DECISION** | The single recommendation for this topic. |
| **DEVIATION** | I differ from the blueprint here. The reason is given. |
| **(verify at build time)** | Could not be fully checked today. Test it on a preview deployment before relying on it. |

### Assumptions

1. **A1:** You are the only editor for now, and you will edit Markdown files in VS Code (as in *BP §21*).
2. **A2:** The site still deploys from GitHub `main` to Vercel with no build step (*BP A2*).
3. **A3:** You don't have pose photos or illustrations yet, and there is no budget set for them.
4. **A4:** You don't yet have a qualified yoga teacher to review content. The plan works without one, but publishing is safer with one.
5. **A5:** English is the only language for now.

---

## 0. New words in this document

The blueprint glossary (*BP §0*) covers Astro, build, component, layout, Markdown, frontmatter, YAML, content collection, schema/Zod, slug, taxonomy, Pagefind, redirect, and so on. A few extra ones:

| Term | Simple meaning |
|---|---|
| **Template** | One page design that is filled with different data to make many pages. One pose template makes all pose pages. |
| **Data file** | One small text file holding the facts for one thing (one pose). |
| **Controlled vocabulary** | A fixed list of allowed words for a field (e.g. level can only be `beginner`, `intermediate` or `advanced`). Typos become build errors. |
| **Reference** | A field that points to another item by its ID, e.g. "related pose: `tree-pose`". The build checks that the item really exists. |
| **Build error** | The build stops and prints a message. Vercel then keeps the old live site, so a mistake never reaches visitors. |
| **Reverse lookup** | Working out a link backwards at build time. Example: a sequence lists its poses, so each pose page can show "appears in these sequences" without you typing it twice. |
| **Query string / URL parameters** | The `?level=beginner&category=standing` part of an address. We use it to store filter choices so links can be shared. |
| **Progressive enhancement** | The page works as plain HTML. JavaScript only adds extras (instant filtering). |
| **IAST** | The standard way to write Sanskrit in Latin letters with accent marks, e.g. *Tāḍāsana*. |
| **Pilot** | A small first batch (10 poses) to test the whole system before scaling. |

---

## 1. Summary of decisions

| Topic | DECISION |
|---|---|
| Technology | **Astro static build**, as in the blueprint. One Markdown data file per pose, one reusable template. No database for the library. |
| Order | **Do the Astro migration of the existing 9 pages first (blueprint Phase 1, steps 7–10), then build the library.** Writing pose content can start now, in parallel. |
| Pose ID | The **file name is the permanent ID and URL slug** (`downward-facing-dog`). It is lowercase English, ASCII only, and never changes. |
| URLs | `/yoga/poses/downward-facing-dog`: no `.html` and **no trailing slash** (same as *BP §8*). |
| Validation | Every pose is checked by a schema. Categories, levels, body focus, props, goals and caution types are controlled lists. Every related-pose reference must point to a real pose, or the build fails. |
| Filters | All pose cards are in the HTML (works without JS). A small plain-JS script filters them instantly and writes the filters into the URL. Each category also gets its own static page. |
| Search | **Pagefind** across the whole site. A quick name filter on the library page. |
| Images | **Launch without pose images.** Add one consistent set of **original line illustrations** later. No mismatched stock photos. (DEVIATION: the blueprint makes `image` required; here it is optional. See §9.) |
| Favourites / progress | Designed now, built later: the pose ID is the key. V2 stores it in `localStorage`; V3 uses Supabase (*BP §17–18*). |
| Start small | 10-pose pilot, then 30–40 for V1, then grow by batches of 10. |

---

## 2. Architecture in one picture

```
 YOU WRITE (plain text files)                ASTRO BUILDS (npm run build)            VISITORS GET (static files on Vercel)
 ─────────────────────────────               ───────────────────────────             ──────────────────────────────────────
 src/content/poses/*.md       ─┐
 src/content/sequences/*.md    │   1. read every file
 src/content/yoga-styles/*.md  ├─► 2. check it against the schema  ─┐
 src/content/learning-paths/*  │      (stop the build on any error)  │
 src/content/taxonomy/*.yaml  ─┘   3. fill templates:                ├─► /yoga/poses                (library + filters)
                                      [slug].astro × every pose ─────┤   /yoga/poses/<slug>         (one page per pose)
 src/pages/yoga/poses/[slug].astro    category page × every category ┤   /yoga/categories/<slug>
 (ONE template for all poses)         style, sequence, path pages ───┤   /yoga/styles/<slug> …
                                   4. Pagefind indexes the output ───┴─► /pagefind/* (search index files)
```

**How it works in plain words:** you never write a pose's HTML. You write one small file with the pose's facts (name, steps, cautions…). Astro reads all pose files, checks them, and pours each one into the same pose-page template. With 10 files you get 10 pages. With 400 files you get 400 pages. Changing the template changes every pose page at once. The output is still plain static HTML, CSS and a little JS, just like today, so it stays fast, cheap and needs no server.

**What does NOT change:** hosting (Vercel + GitHub), plain CSS with your existing look, plain JavaScript, no database, no accounts, no CMS (optional Keystatic later, *BP §21*).

---

## 3. Order: does the library need the Astro migration first?

**DECISION: yes. Do blueprint Phase 1 steps 7–10 first (install tools, move the 9 pages into Astro with the same look, clean URLs with redirects). Then build the library.** Steps 11–12 (splitting CSS into tokens, self-hosting fonts, local images, legal pages) can be done alongside the library, except the **Health Disclaimer page**, which must exist before any pose goes live.

**Why not build the library first?**

| Option | What it means | Verdict |
|---|---|---|
| **A. Migrate first, then library** | The 9 pages become Astro pages with one shared Header and Footer. The library is then just new folders. | **Recommended.** One header, one URL style, one build. |
| B. Library first, old pages untouched | Astro builds only the library, and the 9 old `.html` files are copied as-is (from Astro's `public/` folder). | Rejected. The header and footer would exist in two places again (Astro component + 9 HTML copies). That is exactly the drift that caused the mobile-menu bug (*Audit §17*). You would also mix `.html` and clean URLs, and still have to migrate later. Keep it only as an emergency fallback. |
| C. Hand-written HTML pose pages | Copy `yoga.html` for each pose. | Rejected. Not maintainable past about 10 pages, no validation, no filters from data. |

**What can start today, before any code:** writing the 10 pilot poses as drafts (§11), choosing the illustration approach (§9), drafting the health disclaimer wording, and finishing the remaining Phase 0 quick fixes (*BP §40* items 2–6). None of these needs new tools.

**How this fits the blueprint phases:**

| Blueprint phase | Library work in it |
|---|---|
| Phase 0 (current HTML) | Nothing technical. Content drafting and image decisions start. |
| Phase 1 (Astro foundation) | The prerequisite. Also: `--gold-text` token, `SafetyNote` component, Health Disclaimer page. |
| **Phase 2 (content core, V1)** | **The library is built here**: steps L1–L14 in §13. Blueprint item 14 ("pose collection → template → library with URL filters") is this plan. |
| Phase 3 (V1 launch) | Library in the sitemap, Search Console, performance and accessibility review. |
| Phase 4 (V2) | Practice player for sequences, "saved on this device", learning-path progress on the device, illustrations, 80+ poses. |
| Phase 5 (V3) | Supabase accounts, synced favourites and progress, keyed by the same pose IDs. |

---

## 4. URL structure

**DECISION:** follow the blueprint's rules (*BP §8*): lowercase, hyphens, no `.html`, **no trailing slash**. The task brief showed trailing slashes as an example; I kept the blueprint's rule so the whole site uses one style.

| URL | Page | Built from | Phase |
|---|---|---|---|
| `/yoga` | Yoga hub (today's `yoga.html`, later with links into the library) | `src/pages/yoga/index.astro` | Phase 1 |
| `/yoga/poses` | Pose library: all poses, filters, count | `src/pages/yoga/poses/index.astro` | V1 |
| `/yoga/poses?level=beginner&category=standing,balance&focus=hips&q=tree` | Same page with filters applied (shareable link) | same page + `filters.js` | V1 |
| `/yoga/poses/<slug>` e.g. `/yoga/poses/downward-facing-dog` | One pose | `src/pages/yoga/poses/[slug].astro` | V1 |
| `/yoga/categories` | List of pose categories | `src/pages/yoga/categories/index.astro` | V1 |
| `/yoga/categories/<slug>` e.g. `/yoga/categories/twist` | All poses in one category (static; works without JS; good for search engines) | `src/pages/yoga/categories/[slug].astro` | V1 |
| `/yoga/styles` · `/yoga/styles/<slug>` e.g. `/yoga/styles/hatha` | Yoga styles | `src/pages/yoga/styles/…` | V1 |
| `/yoga/sequences` · `/yoga/sequences/<slug>` e.g. `/yoga/sequences/gentle-morning-10` | Sequences (read-only in V1, player in V2) | `src/pages/yoga/sequences/…` | V1 |
| `/yoga/beginners` | Beginner's guide (kept from *BP §8*) | `src/pages/yoga/beginners.astro` (or Markdown page) | V1 |
| `/yoga/learn` · `/yoga/learn/<slug>` e.g. `/yoga/learn/first-two-weeks` | Beginner learning paths | `src/pages/yoga/learn/…` | V1 (1 path) → V2 |
| `/search?q=` | Site search (Pagefind), `noindex` | `src/pages/search.astro` | V1 |

Filter parameter names: `q` (text), `level`, `category`, `focus` (body focus), `props`, `goal`, `sort` (`az`, `level`, `new`). Several values are separated by commas. Unknown values are ignored, never shown on the page.

**How the pages become clean URLs (DECISION):**
- In `astro.config.mjs`: `build.format: 'file'` and `trailingSlash: 'never'`. Per the Astro docs, `'file'` makes `src/pages/yoga/index.astro` build to `dist/yoga.html` and `[slug].astro` build to `dist/yoga/poses/downward-facing-dog.html`.
- In `vercel.json`: `"cleanUrls": true` and `"trailingSlash": false`. Per the Vercel docs, `yoga.html` is then served at `/yoga`, and `/yoga/` redirects to `/yoga`.

**Redirect of the existing `yoga.html`:** with `cleanUrls: true`, Vercel automatically answers `/yoga.html` with a **308 permanent redirect to `/yoga`** (verified in the docs). The same applies to all 9 old pages. Anchors survive, because the browser keeps the `#practice` part: `/yoga.html#practice` ends at `/yoga#practice`. For safety, also list the 9 old addresses explicitly in `vercel.json` `redirects` (as in *BP §30*), plus `/index` and `/index.html` → `/`. **(verify at build time:** open each old URL on the preview deployment and confirm a 308 to the right place.)

**Slug rules:**
1. The slug is the file name without `.md`: `src/content/poses/downward-facing-dog.md` becomes `/yoga/poses/downward-facing-dog`.
2. Only `a–z`, `0–9` and single hyphens. **English name only, no Sanskrit, no accents.** Example: `warrior-ii-pose`, not `virabhadrasana-ii` and not `vīrabhadrāsana`. Reason: English is what most beginners search, and ASCII URLs never break in emails or chats.
3. **Never rename a published slug.** If you really must, add the old slug to `formerSlugs` in the pose file **and** add a 308 redirect in `vercel.json` (log it in `docs/planning/redirects.md`, *BP §30*).
4. Sides: **one page per pose**, not separate left/right pages. The steps say "repeat on the other side" and the field `sided: true` shows it. (The reference site made separate left/right pages and then had to redirect them, *Ref §3.6*.)

---

## 5. Folder structure (exact paths)

Only library-related paths are shown. The rest follows *BP §33*.

```
yyogaa-website/
├── astro.config.mjs                     # site URL, build.format 'file', trailingSlash 'never', sitemap
├── vercel.json                          # cleanUrls, trailingSlash false, redirects, security headers
├── package.json / package-lock.json     # astro, @astrojs/sitemap, pagefind (pinned versions)
├── docs/
│   ├── planning/
│   │   ├── YOGA-LIBRARY-IMPLEMENTATION-PLAN.md   # this file
│   │   └── redirects.md                           # why each redirect exists
│   └── content-templates/
│       ├── pose.md                      # copy-and-fill template for a new pose
│       ├── sequence.md
│       ├── yoga-style.md
│       ├── learning-path.md
│       └── pose-review-checklist.md     # the checklist in §11
├── src/
│   ├── content.config.ts                # schemas (rulebooks) for every collection
│   ├── content/
│   │   ├── poses/
│   │   │   ├── downward-facing-dog.md   # one file per pose
│   │   │   ├── mountain-pose.md
│   │   │   └── images/                  # pose illustrations/photos (optional, see §9)
│   │   │       └── downward-facing-dog.svg
│   │   ├── sequences/
│   │   │   └── gentle-morning-10.md
│   │   ├── yoga-styles/                 # DEVIATION: blueprint says "styles/"; renamed so it
│   │   │   └── hatha.md                 #   is never confused with the CSS folder src/styles/
│   │   ├── learning-paths/
│   │   │   └── first-two-weeks.md
│   │   └── taxonomy/                    # controlled vocabularies (one list per file)
│   │       ├── levels.yaml
│   │       ├── pose-categories.yaml
│   │       ├── body-focus.yaml
│   │       ├── props.yaml
│   │       ├── goals.yaml
│   │       └── caution-types.yaml       # reviewed, standard safety wording
│   ├── pages/
│   │   └── yoga/
│   │       ├── index.astro              # yoga hub (ported from yoga.html)
│   │       ├── beginners.astro
│   │       ├── poses/
│   │       │   ├── index.astro          # library page
│   │       │   └── [slug].astro         # THE pose template (one file → every pose page)
│   │       ├── categories/
│   │       │   ├── index.astro
│   │       │   └── [slug].astro
│   │       ├── styles/
│   │       │   ├── index.astro
│   │       │   └── [slug].astro
│   │       ├── sequences/
│   │       │   ├── index.astro
│   │       │   └── [slug].astro
│   │       └── learn/
│   │           ├── index.astro
│   │           └── [slug].astro
│   ├── components/
│   │   ├── layout/                      # BaseLayout parts: Header, Footer, Breadcrumbs, SEO (Phase 1)
│   │   ├── ui/SafetyNote.astro          # shared health note
│   │   └── library/
│   │       ├── PoseCard.astro
│   │       ├── PoseGrid.astro
│   │       ├── FilterBar.astro
│   │       ├── ResultCount.astro
│   │       ├── AtAGlance.astro
│   │       ├── ListSection.astro        # heading + list; renders NOTHING if the list is empty
│   │       ├── MistakesList.astro
│   │       ├── RelatedPoses.astro
│   │       ├── PoseFigure.astro         # image/illustration, or nothing
│   │       ├── SequenceSteps.astro
│   │       └── PrevNext.astro
│   ├── lib/
│   │   ├── poses.js                     # getPublishedPoses(), requirePose(), sorting, reverse lookups
│   │   └── text.js                      # removeDiacritics() for search/filter matching
│   ├── scripts/
│   │   └── pose-filters.js              # plain-JS filtering (about 3 KB)
│   └── styles/
│       └── library.css                  # new library styles, using existing tokens
└── (after the build) dist/              # generated output; git-ignored; never edited by hand
```

---

## 6. Pose data structure

### 6.1 Controlled vocabularies (stored in `src/content/taxonomy/*.yaml`)

Each list entry has an `id` (used in data and URLs), a `name` (shown to people) and a one-line `description` (used for category-page intros and meta descriptions). The starting values come from *BP §10*, with the small changes marked.

| List | File | Starting values | Notes |
|---|---|---|---|
| **Level** | `levels.yaml` | `beginner`, `intermediate`, `advanced` | Fixed. Exactly one per pose. |
| **Pose category** | `pose-categories.yaml` | `standing`, `seated`, `forward-fold`, `backbend`, `twist`, `balance`, `hip-opener`, `inversion`, `arm-balance`, `supine`, `prone`, `restorative` | One **primary** category per pose, plus optional `alsoIn` categories. **Addition:** `arm-balance` (needed once you pass about 60 poses; the blueprint list lacks it). |
| **Body focus** | `body-focus.yaml` | `hamstrings`, `hips`, `spine`, `shoulders`, `core`, `legs`, `chest`, `neck`, `wrists`, `feet`, `glutes`, `side-body` | **Additions:** `glutes`, `side-body`. **Fix:** the blueprint's example used `posture` as body focus, but `posture` is a goal, not a body part. |
| **Props** | `props.yaml` | `none`, `mat`, `block`, `strap`, `bolster`, `blanket`, `chair`, `wall` | |
| **Goals** | `goals.yaml` | `calm`, `sleep`, `focus`, `energy`, `flexibility`, `strength`, `mobility`, `recovery`, `posture`, `beginner-friendly` | Shared with breathwork, meditation and articles (powers `/explore/<goal>`, *BP §10*). |
| **Caution types** | `caution-types.yaml` | `wrists`, `knees`, `lower-back`, `neck`, `shoulders`, `balance-falls`, `head-below-heart`, `deep-backbend`, `deep-twist`, `pregnancy`, `recent-injury-or-surgery` | **New.** Each entry holds one **reviewed standard sentence**, e.g. `head-below-heart`: "Poses with the head below the heart may not suit people with high or low blood pressure, glaucoma or dizziness. Check with a health professional." It is written once, reviewed once, and reused on every pose. This keeps safety wording consistent across hundreds of pages. |

Example `src/content/taxonomy/pose-categories.yaml`:
```yaml
- id: standing
  name: Standing poses
  description: Poses on your feet that build steadiness, strength and awareness of alignment.
- id: twist
  name: Twists
  description: Gentle rotations of the spine, practised slowly and with a long back.
```

**Adding a new value** (e.g. a new category) is a deliberate change: add it to the YAML file in its own small PR. It then appears automatically in filters and gets its own category page.

### 6.2 Field table

File: `src/content/poses/<slug>.md`. Data in the frontmatter, optional extra notes in the body.

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| *(file name)* | slug / ID | `downward-facing-dog` | Yes | **Permanent ID** and URL. ASCII, lowercase, hyphens. Checked by a pattern at build time. |
| `name` | text (≤ 60) | `Downward-Facing Dog` | Yes | English name used in H1, cards and titles. |
| `sanskrit` | object | see §6.4 | No | `{ iast, simple, devanagari? }`. |
| `alsoKnownAs` | list of text | `["Down Dog"]` | No | Helps search and filtering. |
| `summary` | text (70–160 chars) | `A calm, full-body shape…` | Yes | Card text and meta description. Length checked. |
| `level` | → `levels` | `beginner` | Yes | One value. |
| `category` | → `pose-categories` | `standing` | Yes | Primary category (breadcrumb, prev/next). |
| `alsoIn` | list → `pose-categories` | `[inversion]` | No | Also listed on these category pages and filters. |
| `bodyFocus` | list → `body-focus` | `[hamstrings, shoulders, spine]` | Yes (1–4) | |
| `goals` | list → `goals` | `[energy, flexibility]` | No | Feeds Explore pages. |
| `props` | list → `props` | `[mat]` | Yes (min 1) | Use `none` when nothing is needed. |
| `sided` | true/false | `false` | Yes | `true` = practise on both sides. |
| `holdGuide` | text | `5–8 slow breaths` | No | Plain words, not a precise prescription. |
| `setup` | text | `Start on hands and knees…` | No | One line on where to begin. |
| `steps` | list of text (3–10) | see example | Yes | Short, original, one action per step. |
| `breathCue` | text | `Exhale as you lift the hips.` | No | |
| `comingOut` | text | `Lower the knees and rest in Child's Pose.` | No | How to leave the pose safely. |
| `benefits` | list of text (1–6) | `Stretches the back of the legs` | Yes | Experience-based wording, no medical claims (see §11). |
| `commonMistakes` | list of `{mistake, fix}` | `{mistake: "Rounding the back", fix: "Bend the knees more"}` | No | |
| `modifications` | list of text | `Rest the forearms on a chair seat` | No | Easier options. At least 1 is **strongly** recommended for beginner poses (the review checklist asks for it). |
| `variations` | list → `poses` | `[three-legged-dog]` | No | Harder or different versions that have their own page. |
| `relatedPoses` | list of `{pose → poses, relation}` | `{pose: childs-pose, relation: counter}` | No | `relation` is one of `preparation`, `progression`, `counter`, `similar`. |
| `cautions` | list of text (min 1) | `Keep the knees bent if your hamstrings feel strained` | Yes | Pose-specific notes. |
| `cautionTypes` | list → `caution-types` | `[wrists, head-below-heart]` | No | Adds the standard reviewed sentences. |
| `image` | `{src, alt, credit, license, modelRelease?}` | see §9 | **No** (DEVIATION) | Must show exactly this pose. See §9. |
| `imageStatus` | `none` / `placeholder` / `final` | `none` | Yes (default `none`) | Lets you list poses still needing artwork. |
| `sources` | list of `{title, url}` | `{title: "…", url: "https://…"}` | No | References you checked facts against. Never copy their wording. |
| `tags` | list of text | `[no-props, morning]` | No | Free but reviewed words. |
| `author` | → `authors` | `yyogaa-team` | Yes | |
| `reviewedBy` | → `authors` | `teacher-name` | No | Only a real, qualified reviewer. Never invented. |
| `reviewedAt` | date | `2026-11-20` | No | Required if `reviewedBy` is set. |
| `publishedAt` | date | `2026-11-20` | Yes | |
| `updatedAt` | date | `2027-01-10` | No | Shown as "Updated …". |
| `formerSlugs` | list of text | `[down-dog]` | No | Only after a rename. Keeps old favourites and links working. |
| `draft` | true/false | `true` | No (default `false`) | Drafts are not built in production. |
| *(body)* | Markdown | "About this pose" notes | No | Optional longer notes, history or tips. |

### 6.3 How the build checks the data

The schema lives in `src/content.config.ts`. This is a **sketch** to show the idea. The exact import names must be checked against the Astro version installed at the time **(verify at build time)**.

```ts
// src/content.config.ts  (sketch, not final code)
import { defineCollection, reference, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

const levels         = defineCollection({ loader: file('src/content/taxonomy/levels.yaml'),          schema: z.object({ name: z.string(), description: z.string() }) });
const poseCategories = defineCollection({ loader: file('src/content/taxonomy/pose-categories.yaml'), schema: z.object({ name: z.string(), description: z.string() }) });
// …bodyFocus, props, goals, cautionTypes the same way…

const poses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/poses' }),
  schema: ({ image }) => z.object({
    name: z.string().max(60),
    summary: z.string().min(70).max(160),
    level: reference('levels'),
    category: reference('poseCategories'),
    alsoIn: z.array(reference('poseCategories')).default([]),
    bodyFocus: z.array(reference('bodyFocus')).min(1).max(4),
    steps: z.array(z.string()).min(3).max(10),
    cautions: z.array(z.string()).min(1),
    relatedPoses: z.array(z.object({
      pose: reference('poses'),
      relation: z.enum(['preparation', 'progression', 'counter', 'similar']),
    })).default([]),
    image: z.object({ src: image(), alt: z.string().min(15), credit: z.string(), license: z.string() }).optional(),
    // …the other fields from the table…
  }),
});

export const collections = { levels, poseCategories, poses /* , … */ };
```

What each check gives you:

1. **Typo in a controlled word** (e.g. `level: beginer`): build error naming the file and field.
2. **Missing required field** (e.g. no `cautions`): build error.
3. **Related pose that doesn't exist** (e.g. `pose: tree-pos`): Astro's `reference()` is designed to catch this. As a **second safety net**, the helper `requirePose(id)` in `src/lib/poses.js` looks the pose up and **throws an error if it's missing**. That fails the build with a clear message like `downward-facing-dog.md → relatedPoses → "tree-pos" does not exist`. Belt and braces, because a silently broken link is the most likely scaling bug.
4. **Related pose that is still a draft:** hidden on the live site, and a warning is printed during the build.
5. **Bad slug** (capitals, spaces, accents in the file name): `getStaticPaths` checks each ID against `^[a-z0-9]+(-[a-z0-9]+)*$` and throws.
6. **Image file missing:** `image()` fails the build.
7. **Slug collision with a `formerSlugs` entry of another pose:** checked in `src/lib/poses.js`; throws.

Because Vercel keeps serving the last good version when a build fails, **a broken pose file can never break the live site.**

### 6.4 Sanskrit names and diacritics

**DECISION:** store three forms; use each for one job.

```yaml
sanskrit:
  iast: Adho Mukha Śvānāsana      # correct scholarly spelling with accent marks; shown on the page
  simple: Adho Mukha Svanasana    # no accent marks; used in <title>, search matching, "also known as"
  devanagari: अधोमुखश्वानासन        # optional; Sanskrit script, only if checked by someone who reads it
```

- **Files are saved as UTF-8** (VS Code's default), so accent marks and Devanagari are safe in YAML.
- **Display:** English name as the H1 (bold DM Sans). The IAST name sits under it in **Playfair Display italic**, the brand's accent font, marked `<span lang="sa-Latn">`, so screen readers don't try to read it as English. Devanagari, if present, is marked `lang="sa"`. On the dark hero it uses gold (`#baa060`, about 6.7:1 on charcoal, passes). On cream it uses the darker `--gold-text` token (*BP §3 item 5*).
- **Search and filtering:** the library filter compares text after removing accents (`"Śvānāsana".normalize('NFD')` with the accent marks stripped becomes `svanasana`). Typing "svanasana", "Svānāsana" or "down dog" all find the pose. For Pagefind, the `simple` spelling is visible on the page ("Also known as"), so it gets indexed either way. **(verify at build time** how Pagefind treats accented letters.)
- **Accuracy rule:** if you are not sure of the diacritics, **leave `iast` out**. The page falls back to `simple`. A wrong accent looks worse than none.
- **Slugs never use Sanskrit or accents** (§4).

### 6.5 Full example pose file

The wording below is original, written for this plan. It still needs the normal review (§11) before publishing.

```yaml
# src/content/poses/downward-facing-dog.md
---
name: Downward-Facing Dog
sanskrit:
  iast: Adho Mukha Śvānāsana
  simple: Adho Mukha Svanasana
alsoKnownAs: [Down Dog, Downward Dog]
summary: A calm, full-body shape that lengthens the back and legs and teaches you to share weight between hands and feet.
level: beginner
category: standing
alsoIn: [inversion]
bodyFocus: [hamstrings, shoulders, spine]
goals: [energy, flexibility, beginner-friendly]
props: [mat]
sided: false
holdGuide: 5–8 slow breaths
setup: Start on your hands and knees, hands a little in front of your shoulders.
steps:
  - Spread your fingers wide and press evenly through both palms.
  - Tuck your toes under.
  - On an exhale, lift your knees and send your hips up and back.
  - Keep your knees bent at first, so your back can stay long.
  - Let your head hang between your upper arms, neck relaxed.
  - Slowly straighten the legs only as far as your back stays long.
breathCue: Breathe in to lengthen the spine, breathe out to soften the shoulders away from the ears.
comingOut: Bend your knees, lower them to the mat, and rest back into Child's Pose.
benefits:
  - Stretches the back of the legs and the spine
  - Builds steady strength in the arms and shoulders
  - A familiar resting point in many flowing practices
commonMistakes:
  - mistake: Rounding the lower back to get the heels down
    fix: Bend your knees generously. A long back matters more than straight legs.
  - mistake: Sinking into the shoulders
    fix: Press the floor away and let the upper arms roll gently outward.
modifications:
  - Rest your forearms on the seat of a sturdy chair instead of the floor.
  - Keep the knees bent the whole time.
variations: []
relatedPoses:
  - { pose: childs-pose, relation: counter }
  - { pose: cat-cow, relation: preparation }
  - { pose: mountain-pose, relation: similar }
cautions:
  - If your wrists complain, come onto your forearms or use the chair version.
  - Come down straight away if you feel dizzy or pressure in your head.
cautionTypes: [wrists, head-below-heart]
imageStatus: none
author: yyogaa-team
publishedAt: 2026-11-20
draft: true
---
Many people meet this pose in their first class and keep returning to it for years.
It rarely feels "finished". That is fine. Let it change with you.
```

---

## 7. The single reusable pose template

File: `src/pages/yoga/poses/[slug].astro`. Plain idea: *"for every published pose, make a page, and fill these sections with its data."*

```astro
---
// sketch
import { getPublishedPoses } from '../../../lib/poses.js';
export async function getStaticPaths() {
  const poses = await getPublishedPoses();          // drafts removed in production
  return poses.map((pose) => ({ params: { slug: pose.id }, props: { pose } }));
}
const { pose } = Astro.props;
---
<BaseLayout title={`${pose.data.name}${pose.data.sanskrit ? ` (${pose.data.sanskrit.simple})` : ''}: How to Practice`} description={pose.data.summary}>
  … sections below …
</BaseLayout>
```

### Page sections, in order, and what happens when data is missing

The page follows the brand rhythm (*BP §2 item 7*): dark hero → cream content → sand band → footer. It uses hairlines, not shadows, and 18px card radii.

| # | Section | Data used | If data is missing |
|---|---|---|---|
| 1 | Breadcrumbs `nav` | category | Always shown: Home › Yoga › Poses › *Name*. |
| 2 | **Dark hero** (like the journal hero, text only) | kicker `CATEGORY · LEVEL`, H1 `name`, Sanskrit line, `summary` | No Sanskrit: the line is left out. |
| 3 | Figure | `image` | **No image: nothing is rendered.** No grey box, no stock photo. Text runs full width. |
| 4 | **At a glance** (sand band, small grid) | level, category + alsoIn (linked), bodyFocus, props, holdGuide, sided | Each item shows only if present. Level, category, focus and props always exist. |
| 5 | Short safety line (`SafetyNote`, compact) | fixed text + link to `/health-disclaimer` | Always shown. |
| 6 | **How to practise** (numbered list) | setup, steps, breathCue, comingOut | Steps always exist. Missing setup, breath cue or coming-out lines are simply skipped. |
| 7 | Benefits | benefits | Always (required). |
| 8 | Common mistakes | commonMistakes | **Section and its heading hidden if empty.** |
| 9 | Make it easier | modifications | Hidden if empty. |
| 10 | Go further | variations (cards) | Hidden if empty. |
| 11 | **Cautions** (bordered box) | cautions + standard sentences from cautionTypes + disclaimer link | **Always shown.** Can never be empty (schema requires 1+). |
| 12 | About this pose | Markdown body | Hidden if the body is empty. |
| 13 | Related poses (grouped: prepare with / counter with / progress to / similar) | relatedPoses | Hidden if empty. A group with no items is also hidden. |
| 14 | Appears in these sequences | **reverse lookup** from sequences | Hidden if none. |
| 15 | Prev / next pose | same primary category, A–Z | Hidden at the ends. |
| 16 | Byline | author, reviewedBy/At, publishedAt/updatedAt | "Reviewed by" only if real data exists. |
| 17 | Save button | — | **Not rendered in V1.** Slot reserved for V2 (§10). |

**Rules that keep hundreds of pages tidy:**
- One generic `ListSection` component draws "heading + list" and **renders nothing when the list is empty**. That way no page ever shows an empty heading.
- Headings stay in order (one H1, then H2 per section), so the table of contents and accessibility stay correct automatically.
- **SEO** is built into the template: title pattern `Downward-Facing Dog (Adho Mukha Svanasana): How to Practice — YYOGAA`, description from `summary`, canonical URL, OG tags, and JSON-LD `Article` (or `HowTo`) + `BreadcrumbList`. **Not `MedicalWebPage`** (*BP §24*).
- **Pagefind markers:** `data-pagefind-body` on the main content; `data-pagefind-filter="type:pose"` plus level and category; `data-pagefind-meta` for the Sanskrit name.

---

## 8. Library page, category pages, filters and search

### 8.1 Library page `/yoga/poses`

1. **Built in HTML at build time:** every published pose is a `PoseCard` (name, Sanskrit in italics, level, category, optional thumbnail), **grouped by category** with a small "jump to category" link list at the top. Each card carries data attributes:
   `data-level="beginner" data-category="standing inversion" data-focus="hamstrings shoulders spine" data-props="mat" data-goal="energy flexibility" data-name="downward-facing dog adho mukha svanasana down dog"`
   (`data-name` is lowercased and has the accents removed, so matching is easy.)
2. **Filter bar** (`FilterBar.astro`) is a real `<form method="get" action="/yoga/poses">` with:
   - a text box (`q`) labelled "Search poses by name";
   - `<fieldset>` groups with a `<legend>`: Level, Category, Body focus, Props, made of **checkboxes** styled as the brand's pill buttons;
   - a Sort `<select>`;
   - a "Clear all" link.
3. **With JavaScript** (`src/scripts/pose-filters.js`, plain JS, about 3 KB):
   - On load it reads `location.search`, ticks the matching checkboxes and applies them.
   - On every change it shows or hides cards (`hidden` attribute), hides empty category groups, and **updates the URL with `history.replaceState`**. The link can then be shared and reloading keeps the filters.
   - Within one group the choices are OR (standing **or** balance). Across groups they are AND (beginner **and** standing).
   - Live count "12 of 40 poses" in an element with `aria-live="polite"`.
   - Empty state: "No poses match these filters." plus a Clear button.
   - Respects `prefers-reduced-motion` (no animation on show/hide).
4. **Without JavaScript:** all poses are visible, grouped by category, and the category links go to the static category pages. Submitting the form just reloads the full list (a static page cannot filter by itself). Nothing breaks and every pose stays reachable. This is the honest limit of a static site, and it is acceptable.

### 8.2 Category pages `/yoga/categories/<slug>`

- One page per entry in `pose-categories.yaml`, generated by `[slug].astro`.
- Content: H1 from the category name, intro from its `description`, the grid of poses whose `category` or `alsoIn` includes it, and links to the other categories.
- **Thin-page rule:** a category page is only built once it has **at least 3 published poses** (*BP §10 rule 2*). Until then it is left out of the build and out of the category list.
- These pages are the no-JS fallback **and** strong search-engine landing pages ("twists yoga poses").
- **Levels** are a filter only (`/yoga/poses?level=beginner`). There are no separate level pages in V1, to avoid many near-duplicate pages. The beginner guide covers the "beginner" intent.

### 8.3 Site search (Pagefind)

- Build command becomes `astro build && pagefind --site dist` (in `package.json` `scripts.build`). `pagefind` is installed as a **pinned dev dependency**, not downloaded fresh on every build.
- `/search` (`noindex`) uses Pagefind's ready-made UI, restyled with brand tokens. A header search icon comes in V1 (*BP §9*).
- Filters inside search results: type (pose / sequence / style / article), level.
- **(verify at build time):** with `build.format: 'file'`, Pagefind may record result URLs ending in `.html`. They still work (Vercel's `cleanUrls` redirects them), but the plan is to strip `.html` from result links in the search page script so they point straight to clean URLs. Test this in step L12.

### 8.4 Performance with hundreds of poses (estimates, INFERRED)

| Poses | Library HTML (compressed, estimate) | Approach |
|---|---|---|
| 10–100 | small (roughly 5–15 KB) | Everything on one page. |
| 100–400 | roughly 15–50 KB | Still one page. Thumbnails `loading="lazy"` with width/height set; first row eager. Filtering 400 cards in plain JS is instant. |
| 400+ | larger | Show the library as category sections with "Show all 60 standing poses →" links to category pages; keep Pagefind for search. Revisit only if measured as slow (*BP §15 "Scale limit"*). |

- **Build time:** Astro makes pages from Markdown quickly. The slow part will be **image processing** (every image makes several sizes). Keep to 2–3 sizes per image and use SVG illustrations where possible (tiny, no resizing needed).
- **Repository size:** photos add up (300 poses × 2 images × ~300 KB ≈ 180 MB). Rules: source images at most 1600 px wide and about 300 KB each, or SVG line art (often under 20 KB). Reconsider external image hosting only past about 500 photos.

---

## 9. Pose images: a realistic plan

**The honest problem:** a pose page is only useful if the picture shows **exactly** that pose, correctly aligned, in a consistent style. Stock photo sites rarely have 40, let alone 300, correct and consistent pose photos. The reference site even showed a pose page whose photo didn't match the pose (*Ref §3.6*). A wrong image is worse than none, because beginners copy what they see.

**DECISION: three stages.**

| Stage | What | Why |
|---|---|---|
| **1. Launch text-only (pilot and V1)** | `imageStatus: none`. Pages use the typographic dark hero, which already fits the editorial brand. Library cards are text tiles, like the existing Explore tiles (*Audit §4 item 8*). | Removes the biggest blocker. Clear, accurate steps matter most. |
| **2. Original line illustrations (V2)** | **One illustrator**, one style guide, delivered as **SVG** in the brand palette (charcoal lines on cream, a gold accent), one figure per pose, plus side views where alignment matters. Commission in batches of 10 with a written agreement that YYOGAA owns the work (or has an exclusive licence). | Consistent, small files, easy to keep on-brand, no model-release issues, easy to add alt text. |
| 3. Photography (optional, later) | Only as a **planned shoot**: same model(s), same room, same light, same mat, a signed **model release**, a teacher on set checking alignment. | Photos are appealing but hard to keep consistent over hundreds of poses and years. |

**Not recommended for pose instruction images:**
- **Unsplash/Pexels stock:** usually the wrong pose or poor alignment, inconsistent looks, and no model releases (*BP §21*). They're fine for mood images on hubs, not on pose pages.
- **AI-generated pose images:** they often get anatomy and hand/foot positions wrong, and the licensing and ownership position is still unsettled. Don't use them for instruction. (Revisit if the law and quality change; always with teacher review.)
- **Anything copied from other yoga sites or books**, including tracing their drawings (*BP §6*).

**Image record (when an image is added):**
```yaml
image:
  src: ./images/downward-facing-dog.svg
  alt: "Line drawing of a person in Downward-Facing Dog: hands and feet on the mat, hips lifted high, knees slightly bent, body forming an upside-down V."
  credit: "Illustration: <illustrator name> for YYOGAA"
  license: commissioned          # owned | commissioned | licensed-<source>
  modelRelease: true             # photos of people only
imageStatus: final
```

**Alt-text rules:** describe the **shape of the body** (what a blind learner needs), not the mood. Mention key alignment (bent knees, arm position). About 1–2 sentences. Never "yoga pose" or "image of". Every credit appears on `/image-credits` automatically (built from the data).

**Consistency checklist for the illustrator brief (future file `docs/brand/pose-illustration-guide.md`):** same figure proportions, line weight, facing direction (default: facing left), mat shown as one line, props drawn simply, palette tokens only, a neutral non-gendered figure, and 4:3 artboard.

---

## 10. Styles, sequences and learning paths

**Principle: store each relationship once, and compute the reverse.** A sequence lists its poses, so pose pages work out "appears in these sequences". A sequence names its style, so style pages work out "sequences in this style". Nothing is typed twice, so nothing drifts.

### 10.1 Yoga style — `src/content/yoga-styles/<slug>.md`

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| *(file name)* | slug | `hatha` | Yes | `/yoga/styles/hatha` |
| `name` | text | `Hatha` | Yes | |
| `summary` | text (≤160) | `A steady, unhurried style that holds each pose for a few breaths.` | Yes | |
| `pace` | `slow` / `moderate` / `dynamic` | `slow` | Yes | |
| `goodFor` | list → goals | `[beginner-friendly, calm]` | No | |
| `typicalClassMinutes` | number | `60` | No | |
| `keyPoses` | list → poses | `[mountain-pose, downward-facing-dog]` | No | Build checks each one exists. |
| `cautions` | list of text | `["Heated styles are not advised in pregnancy or with heart conditions."]` | No | For hot or very vigorous styles. |
| `author`, `publishedAt`, `updatedAt`, `draft` | as poses | | | |
| *(body)* | Markdown | origins, what a class is like | Yes | Original wording. |

V1: about 5 styles (*BP §35*): Hatha, Vinyasa, Yin, Restorative, Gentle.

### 10.2 Sequence — `src/content/sequences/<slug>.md`

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| *(file name)* | slug | `gentle-morning-10` | Yes | |
| `title` | text | `Gentle Morning Flow` | Yes | |
| `summary` | text (≤160) | `Ten unhurried minutes to wake up the body.` | Yes | |
| `level` | → levels | `beginner` | Yes | |
| `durationMinutes` | number (1–120) | `10` | Yes | |
| `style` | → yoga-styles | `gentle` | No | Style pages list their sequences via reverse lookup. |
| `goals`, `props` | lists | `[energy]`, `[mat]` | No | |
| `steps` | list of `{pose → poses, hold, holdSeconds?, side?, note?}` | `{pose: cat-cow, hold: "6 slow rounds"}` | Yes (min 2) | Every `pose` checked. `side`: `left`/`right`/`both`. `holdSeconds` is optional now, but it will power the V2 player. |
| `cautions` | list of text | | No | The poses' own caution types are also **collected automatically** and shown once at the top. |
| `author`, `publishedAt`, `updatedAt`, `draft` | as poses | | | |

The sequence page shows numbered steps. Each step links to its pose page (improving on *Ref §13*) and is printable. First sequence to write: the existing "Your first 20-minute practice" promise on `yoga.html` (*BP §31*).

### 10.3 Learning path — `src/content/learning-paths/<slug>.md`

A **learning path** is an ordered list of small lessons for beginners (e.g. "Your first two weeks"). The blueprint's cross-pillar **Programs** (V2, `/programs`) are a bigger idea. Learning paths are yoga-only and simpler, and could later be promoted into programs.

| Field | Type | Example | Required? | Notes |
|---|---|---|---|---|
| `title` | text | `Your First Two Weeks` | Yes | |
| `summary` | text | `Six short lessons that build a calm, safe foundation.` | Yes | |
| `level` | → levels | `beginner` | Yes | |
| `estimatedDays` | number | `14` | No | |
| `steps` | list of `{title, pose? → poses, sequence? → sequences, page?, note}` | `{title: "Learn to stand well", pose: mountain-pose}` | Yes | **Exactly one** of `pose`, `sequence` or `page` (an internal path like `/yoga/beginners`) per step. The schema enforces this. |
| `author`, `publishedAt`, `updatedAt`, `draft` | as poses | | | |

Page: `/yoga/learn/<slug>` shows numbered steps with links. Progress ticks arrive in V2 (§10.4).

### 10.4 Future favourites, accounts and progress (design only; nothing built in V1)

Everything hangs on the **stable content key** `type` + `id`, for example `pose` + `downward-facing-dog`. This matches the blueprint's `content_type` + `content_slug` (*BP §17*).

| Version | Favourites | Progress | Where stored |
|---|---|---|---|
| V1 | none | none | — |
| **V2** | Heart button on pose, sequence, style and path pages. Saved list at `/saved`. | "Mark as done" on learning-path steps; sequence completions logged by the V2 player. | Browser `localStorage`, keys `yyogaa:saved:v1` = `[{type, id, savedAt}]` and `yyogaa:progress:v1` = `[{type, id, step?, doneAt}]`. The page tells visitors "saved on this device only". |
| **V3** | Same buttons, synced to an account. One-time merge of device data on first login. | Same, synced. | Supabase tables `favorites`, `practice_sessions`, `program_progress` with Row Level Security (*BP §17–19*). |

Supporting pieces, designed now so they slot in later:
- A build-time **content index** (`src/pages/content-index.json.js`, a static JSON file): `{type, id, title, url, summary, level}` for every item. The `/saved` page (V2) and the V3 server both use it to turn saved IDs into cards and to reject IDs that don't exist.
- **Renames:** `formerSlugs` feeds a small alias map in the content index, so an old saved ID still resolves to the new page.
- **Deleted poses:** a saved item that no longer exists shows "No longer available" instead of an error.
- The `localStorage` keys carry a version (`:v1`), so the format can change safely later.
- **Privacy:** V2 sends nothing to any server. No health data (injuries, pregnancy) is ever collected (*BP §16*).

---

## 11. Content workflow, quality and safety review

### 11.1 Adding one pose (checklist; also saved later as `docs/content-templates/pose-review-checklist.md`)

1. **Pick the slug** (English, lowercase, hyphens). Check it isn't taken.
2. **Copy** `docs/content-templates/pose.md` to `src/content/poses/<slug>.md`. Keep `draft: true`.
3. **Research** the pose in 2–3 reputable sources (teacher-training manuals, respected teachers' books, public-health pages such as NCCIH for general safety). Record them in `sources`.
4. **Write in your own words**, in the YYOGAA voice: short sentences, gentle imperatives, "you can", never "you must". **Never paste or lightly rephrase** someone else's text, including Yoga.com's (*BP §21*).
5. **Safety pass:**
   - at least one pose-specific caution;
   - correct `cautionTypes` (inversions → `head-below-heart`; weight on hands → `wrists`; deep backbends → `deep-backbend`, `lower-back`);
   - a `comingOut` line for anything held or inverted;
   - at least one modification for beginner poses.
6. **Claims pass:** benefits describe experience ("stretches", "builds", "many people find it calming"), **never** treatment ("cures", "treats", "heals", "fixes back pain", "detoxes").
7. **Links:** add 1–4 `relatedPoses`. Only link poses that exist; the build checks this anyway.
8. **Sanskrit:** add `iast` only if checked; otherwise `simple` only.
9. **Image:** `imageStatus: none` is fine. If adding one, fill credit, licence and alt text (§9).
10. **Run** `npm run dev`, open `http://localhost:4321/yoga/poses/<slug>`, read it on a phone-width window. Then run `npm run build`; it must pass.
11. **Review** (below), then set `draft: false`, add `publishedAt`, open a pull request, check the Vercel preview, merge.

### 11.2 Review levels

| Level | Who | Required for |
|---|---|---|
| **Self-review** | You, using the checklist, on a different day from writing | Every pose |
| **Teacher review** | A certified yoga teacher (e.g. with a recognised 200-hour qualification) checks steps, cautions and cues; they are recorded in `reviewedBy`/`reviewedAt` with an entry in `src/content/authors/` | **Strongly recommended** before publishing intermediate/advanced poses, inversions, deep backbends and arm balances. For beginner poses, publish after self-review and add teacher review when available. |
| **Legal review** | A lawyer | The Health Disclaimer and terms, **before monetisation or accounts** (*BP §21*) |

**AI-assisted drafting** is allowed only as a first draft: a human rewrites it in the YYOGAA voice, checks every fact against sources, and runs the safety and claims passes (*BP §21*).

**Yearly review:** re-check every published pose once a year; update `updatedAt`. A simple list comes from sorting by `updatedAt`.

### 11.3 Health and safety messaging (always on)

- **Health Disclaimer page** (`/health-disclaimer`) must be live **before the first pose is public**. Suggested core line (from *BP §21*): *"YYOGAA offers general wellness information, not medical advice. Listen to your body. If you are pregnant, injured, or have a medical condition, check with a qualified health professional before starting."*
- A compact `SafetyNote` near the top of every pose, sequence and path page, and the full **Cautions** box on every pose.
- Sequences automatically gather their poses' caution types into one note at the top.
- No personalised medical advice anywhere, no "safe for pregnancy" labels, no injury-based recommendations (*BP §16*).

### 11.4 Start small, then scale

| Stage | Size | Goal | Exit criteria |
|---|---|---|---|
| **Pilot** | **10 poses**: `mountain-pose`, `tree-pose`, `warrior-ii-pose`, `downward-facing-dog`, `childs-pose`, `cat-cow`, `cobra-pose`, `bridge-pose`, `seated-forward-fold`, `supine-twist` (all beginner, covering about 9 categories) + **1 sequence** using them | Test schema, template, filters, safety wording and your writing speed | All 10 reviewed. The build catches deliberate mistakes. Pages read well on a phone. You know your minutes-per-pose. |
| **V1** | 30–40 poses, 5 styles, 5 sequences, beginner guide, 1 learning path (*BP §35*) | Launchable library | Every category page has ≥ 3 poses. Library is in the sitemap. Accessibility and Lighthouse checks pass. |
| **V2** | ~80 poses (*BP §36*), illustrations begin | Depth | Illustration style locked; batches of 10. |
| **Later** | Hundreds | Breadth | Only as fast as review allows. **Depth over volume** (*BP §24*). |

**Realistic content effort (ASSUMPTION, rough):** about 1–2 hours to research and write one pose well, plus review. 300 poses is therefore roughly 400–600 hours of writing. **Content, not code, is the real limit.** Plan a steady rhythm (e.g. 5 poses a week), not a sprint.

**Batch workflow for scaling:** one branch and one PR per batch of 5–10 poses. That keeps reviews small and makes it easy to undo one batch.

---

## 12. Visual identity in the library

Nothing new is invented. The library reuses the existing design language (*BP §2*, *Audit "Visual identity"*):

| Library element | Reuses |
|---|---|
| Pose page hero | Dark text-only hero (like `.journal-page-hero`); kicker in tracked uppercase; H1 bold DM Sans; Sanskrit line in **gold italic Playfair**, which is the brand's accent word pattern. |
| At a glance | Sand grounding band (`#d8cfbc`) with hairline dividers, like `.principles-grid`. |
| Steps | Numbered `01, 02…` markers like the foundation and principle cards. |
| Pose cards (text-only) | Explore-tile styling: 1px `--line` border, 12–18px radius, charcoal invert on hover **and** on keyboard focus. |
| Filter chips | The existing pill button shape (`border-radius: 40px`), `aria-pressed`/checkbox states. |
| Cautions box | Cream card, hairline border, a gold left rule, `--gold-text` heading. No red alarm styling. Calm, not scary. |
| Final CTA | Existing `.final-cta` band: "Put it together in a sequence →". |

New styles go into **`src/styles/library.css`**, using existing tokens only. The existing styles are **not edited** for the library. The only token change the library needs is `--gold-text` (already planned in *BP §3 item 5*).

---

## 13. What to build first (ordered steps)

Each step is **one branch → one pull request → one Vercel preview check → merge**. Each one leaves the live site working. **Undo** for any step means reverting that one merge commit (or Vercel "Instant Rollback"). Steps L0.x are the blueprint's Phase 1 prerequisite, and are repeated here so the order is clear.

### Prerequisite (blueprint Phase 1, steps 7–10)

| Step | What | How to test | Done when |
|---|---|---|---|
| **L0.1** | With your permission: install Git for Windows, Node.js LTS (v22.12+ or newer **even** version), VS Code. Clone the repo locally. | `node -v`, `git --version` in PowerShell | Versions print. |
| **L0.2** | Branch `astro-migration`: create the Astro project in the same repo; move `style.css` **unchanged** to `src/styles/global.css`; build `BaseLayout`, `Header` (with the fixed mobile menu), `Footer`. | `npm run dev` → `http://localhost:4321` | Home page looks identical to live. |
| **L0.3** | Port all 9 pages as `.astro` (paste their `<main>` HTML). Add `.gitignore` (`node_modules/`, `dist/`, `.astro/`, `.env`, `.vercel/`, `.claude/`). | Side-by-side comparison at 375 / 768 / 1280 px on the Vercel **preview** | No visual difference. |
| **L0.4** | `astro.config.mjs`: `build.format: 'file'`, `trailingSlash: 'never'`, `site`. `vercel.json`: `cleanUrls: true`, `trailingSlash: false`, explicit redirects. Vercel project settings: Framework **Astro**, build `npm run build`, output `dist`, Node version = local. | On the preview, open every old `.html` URL (including `/yoga.html#practice`) | Each gives a 308 to the clean URL. Contact form still reaches thank-you. |
| **L0.5** | Merge to `main`. Production now builds with Astro. | Re-check old URLs on production | Live site identical; clean URLs work. |

### The library (Phase 2)

| Step | What | How to test | Done when |
|---|---|---|---|
| **L1** | Health Disclaimer page + `SafetyNote` component + `--gold-text` token. | Read on phone; contrast checker ≥ 4.5:1 | Page live and linked in the footer. |
| **L2** | `src/content/taxonomy/*.yaml` + `src/content.config.ts` (poses schema only) + **one** pose file (`mountain-pose.md`, `draft: true`). No pages yet. | `npm run build` passes. Then **deliberately** type `level: beginer`, confirm the build fails with a clear message, and undo. | Validation proven. Live site unchanged. |
| **L3** | Minimal template `src/pages/yoga/poses/[slug].astro` (hero, steps, cautions, safety note) + `src/lib/poses.js`. Temporarily allow drafts in dev only. | `http://localhost:4321/yoga/poses/mountain-pose` | Page renders in brand style. No draft pages in the production build. |
| **L4** | Full template: all sections from §7, `ListSection` empty-hiding, related poses with `requirePose()`, prev/next, SEO tags, JSON-LD. Add 2 more pilot poses that reference each other. | Delete a field and see the section vanish cleanly. Reference a non-existent pose and see the build fail. Validate JSON-LD with Google's Rich Results Test on the preview. | Template complete. |
| **L5** | Library page `/yoga/poses`: cards grouped by category, **no JS yet**. | Browse with JavaScript turned off | All poses reachable. |
| **L6** | `pose-filters.js`: instant filtering, URL sync, live count, empty state. | Filter, copy the URL into a new tab, same result. Back button works. Keyboard only. Screen reader (NVDA) announces the count. | Filters done. |
| **L7** | Category pages `/yoga/categories/<slug>` (with the ≥ 3 poses rule) + `/yoga/categories`. | Only categories with 3+ poses appear | Done. |
| **L8** | **Write and review the 10 pilot poses** (§11.4). Mostly writing, not code. One PR per 5 poses. | Checklist §11.1 for each | 10 poses `draft: false`. |
| **L9** | Sequence collection + template + the first sequence ("Your first 20-minute practice"); "Appears in these sequences" on pose pages. | Every step links to a live pose; a bad pose ID fails the build | Done. |
| **L10** | Connect the site: yoga hub cards and CTAs → library, categories and the sequence (§14); add "Poses" to the footer Practice column; sitemap includes library pages. **Library goes public here.** | Click every link on the yoga hub; no link goes to Contact any more | Pilot live. |
| **L11** | Yoga styles collection + 2 styles, then up to 5. | Style pages list key poses and their sequences | Done. |
| **L12** | Pagefind: build script, `/search` page, header search icon, filters by type/level; strip `.html` from result links if needed (§8.3). | Search "svanasana", "down dog", "twist" on the preview | Relevant results; `/search` is `noindex`. |
| **L13** | Beginner guide `/yoga/beginners` + learning-path collection + first path `/yoga/learn/first-two-weeks`. | Every step link works | Done. |
| **L14** | Scale to 30–40 poses in batches of 5–10; 5 sequences. | Build passes; every category page has ≥ 3 poses | **V1 library complete.** |

---

## 14. Exactly which existing files change, and how

Because of the Astro migration (L0), every existing root HTML file is **replaced by an `.astro` page with the same content** and then removed from the repo root at the switch (L0.5). Their URLs keep working through clean URLs and 308 redirects. **Removing the old files is a deletion, so you will be asked to confirm it at that step.**

| Existing file | Change in Phase 1 (migration) | Extra change for the library |
|---|---|---|
| `yoga.html` | Becomes `src/pages/yoga/index.astro`; header/footer come from components. | The 6 "Explore →" links (all go to `contact.html` today, `yoga.html:150–245`) are retargeted: Beginner → `/yoga/beginners`; Morning → `/yoga/sequences/gentle-morning-10`; Flexibility → `/yoga/poses?goal=flexibility`; Strength → `/yoga/poses?goal=strength`; Mobility → `/yoga/poses?goal=mobility`; Restorative → `/yoga/categories/restorative` (only once it has ≥ 3 poses; until then the filter link `?category=restorative`). "Begin Practice" (`:283`) → the first sequence. New short section "The pose library" (4 beginner pose cards + "Browse all poses →"). Final CTA "Start Practicing" (`:361`) → `/yoga/learn/first-two-weeks`. |
| `index.html` | Becomes `src/pages/index.astro`. | Featured "Your First 20-Minute Yoga Practice" button → the sequence page. Explore tiles "Beginner Yoga", "Flexibility", "Strength" → the matching library links (until `/explore/<topic>` pages exist, *BP §8*). Hero and foundation links to `/yoga` stay the same. |
| `breathwork.html`, `meditation.html`, `sound.html`, `journal.html`, `about.html`, `contact.html`, `thank-you.html` | Become `.astro` pages. | **None**, apart from the shared Footer gaining a "Poses" link (one change in `Footer.astro`, not in each page). |
| `style.css` | Moved unchanged to `src/styles/global.css`; later split into tokens/components (*BP §40 step 11*). Gains `--gold-text`. | **No edits.** Library styles live in the new `src/styles/library.css`. |
| `script.js` | Split into `src/scripts/menu.js` (mobile menu, unchanged logic) and `src/scripts/contact-form.js`; the thank-you redirect becomes relative (*BP §40 step 2*). | **None.** Filters are a new file. |
| `README.md` | "How to run and build". | Adds "How to add a pose" (points to the checklist). |
| `docs/research/*`, `docs/planning/YYOGAA-MASTER-BLUEPRINT.md` | — | None. (Note: the whole `docs/` folder is currently **untracked** in Git; commit it when you are ready.) |

### New files and folders (all created in later steps, none now)

**Project setup (L0):**
- `package.json`, `package-lock.json`
- `astro.config.mjs`
- `vercel.json`
- `.gitignore`
- `src/layouts/BaseLayout.astro`
- `src/components/layout/Header.astro`, `Footer.astro`, `Breadcrumbs.astro`, `SEO.astro`
- `src/styles/global.css`
- `src/scripts/menu.js`, `src/scripts/contact-form.js`
- `src/pages/index.astro`, `src/pages/about.astro`, `src/pages/contact.astro`, `src/pages/thank-you.astro`, `src/pages/journal.astro`, `src/pages/breathwork/index.astro`, `src/pages/meditation/index.astro`, `src/pages/sound/index.astro`, `src/pages/yoga/index.astro`
- `docs/planning/redirects.md`

**Library (L1–L14):**
- `src/pages/health-disclaimer.astro`
- `src/components/ui/SafetyNote.astro`
- `src/content.config.ts`
- `src/content/taxonomy/levels.yaml`, `pose-categories.yaml`, `body-focus.yaml`, `props.yaml`, `goals.yaml`, `caution-types.yaml`
- `src/content/poses/*.md` and `src/content/poses/images/`
- `src/content/sequences/*.md`
- `src/content/yoga-styles/*.md`
- `src/content/learning-paths/*.md`
- `src/content/authors/yyogaa-team.yaml`
- `src/lib/poses.js`, `src/lib/text.js`
- `src/components/library/PoseCard.astro`, `PoseGrid.astro`, `FilterBar.astro`, `ResultCount.astro`, `AtAGlance.astro`, `ListSection.astro`, `MistakesList.astro`, `RelatedPoses.astro`, `PoseFigure.astro`, `SequenceSteps.astro`, `PrevNext.astro`
- `src/scripts/pose-filters.js`
- `src/styles/library.css`
- `src/pages/yoga/poses/index.astro`, `src/pages/yoga/poses/[slug].astro`
- `src/pages/yoga/categories/index.astro`, `src/pages/yoga/categories/[slug].astro`
- `src/pages/yoga/styles/index.astro`, `src/pages/yoga/styles/[slug].astro`
- `src/pages/yoga/sequences/index.astro`, `src/pages/yoga/sequences/[slug].astro`
- `src/pages/yoga/beginners.astro`
- `src/pages/yoga/learn/index.astro`, `src/pages/yoga/learn/[slug].astro`
- `src/pages/search.astro`
- `src/pages/image-credits.astro`
- `docs/content-templates/pose.md`, `sequence.md`, `yoga-style.md`, `learning-path.md`, `pose-review-checklist.md`

**V2 (later):**
- `src/pages/content-index.json.js`
- `src/pages/saved.astro`
- `src/scripts/saved.js`
- `docs/brand/pose-illustration-guide.md`

---

## 15. Risks and migration concerns

| Risk | Why it matters | Mitigation |
|---|---|---|
| **Migration must come first** | Delays the library by the Phase 1 time (roughly 2–4 weeks part-time, *BP §34*). | Write pilot pose content in parallel, so no time is lost. Keep Phase 1 to steps L0.1–L0.5 only; CSS refactoring can wait. |
| **URL change hurts SEO or breaks shared links** | `/yoga.html` becomes `/yoga`. | `cleanUrls` gives automatic 308s; explicit redirects as backup; check every old URL on preview and production; submit the sitemap in Search Console. The site is young with little ranking to lose (*Audit §21*), so now is the cheapest time to do it. |
| **Trailing-slash / file-format interaction** | A wrong setting could make `/yoga/poses` 404 or double-redirect. | Settings chosen from the docs (§4). **Test on a preview before merging** (L0.4). Fallback: Astro's default `'directory'` format, with the test repeated. |
| **Header/footer duplication** | Two copies drift (the mobile-menu bug). | Migrate first (option A, §3); one `Header.astro` and one `Footer.astro`. |
| **CSS reuse** | New pages could look "off-brand", or edits could break old pages. | Move `style.css` unchanged; library styles in a separate file using existing tokens; compare screenshots at 3 widths. |
| **Vercel switches from "no build" to "build step"** | Wrong preset, build command or output folder = failed deploy. | Change settings on the migration branch's preview first. A failed build never replaces the live site. Instant Rollback is available. |
| **Node version mismatch** | Builds pass locally but fail on Vercel (or the reverse). | Same Node major version locally and in Vercel settings; add `"engines": { "node": ">=22.12.0" }` to `package.json` (verify the exact value at install time). |
| **Keeping the live site working during migration** | Visitors must never see a half-migrated site. | All work on branches; merge only after preview checks; the old HTML stays on `main` until the switch PR. |
| **Framework updates** | Astro major versions can change content-collection APIs. | Pinned versions (lock file); upgrade deliberately with the official guide, never on a launch day. The code sketches here are marked "verify". |
| **Content volume** | Hundreds of good poses take hundreds of hours (§11.4). | Pilot of 10 → 40 → batches; depth over volume; templates and checklist speed up writing. |
| **Medical / safety liability** | Wrong or careless guidance can hurt someone. | Disclaimer before launch; required cautions; reviewed standard caution sentences; no medical claims; teacher review for riskier poses; legal review before monetising. |
| **Images** | Wrong or inconsistent images mislead learners; licence problems. | Text-only launch; one commissioned illustration style; licence and credit fields; `/image-credits`; no stock or AI images for instruction (§9). |
| **Copyright / looking like Yoga.com** | Legal and brand risk (*BP §6*). | Original wording only; own section names ("Make it easier", "Go further", not theirs); YYOGAA's own look. |
| **Broken internal links as content grows** | Hundreds of cross-references. | `reference()` + `requirePose()` fail the build on any broken link. |
| **Thin pages** | Near-empty category pages hurt SEO. | ≥ 3 poses rule; no level pages in V1. |
| **Repository growing large** | Slow clones and builds. | SVG illustrations; image size limits (§8.4). |
| **Beginner overwhelm** | Too many new things at once. | One small step at a time (§13), each with a clear test and an easy undo. |

---

## 16. Open questions for you

1. Do you agree with **migrating first** (§3), and with writing the 10 pilot poses in parallel?
2. Is a **text-only launch** for pose pages acceptable, with illustrations added in V2 (§9)?
3. Do you know a **certified yoga teacher** who could review poses (paid or as a credited reviewer)?
4. Are you happy with the URL words **`categories`**, **`learn`** and **`beginners`**, and with keeping the existing pillar name "Yoga"?
5. Is there any budget for an illustrator in V2? (This affects when stage 2 of §9 can start.)
