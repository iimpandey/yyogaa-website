# YOGA.COM WEBSITE INVESTIGATION REPORT

- **Investigation date:** 2026-09-30
- **Target:** https://yoga.com/ (public pages only)
- **Purpose:** Phase 1 research to inform an ORIGINAL yoga website. Nothing was built.
- **Method:** Built-in browser (page text, accessibility tree, read-only JavaScript inspection of DOM/meta/CSS/performance entries, network log, screenshots at 1280px and 375px), plus WebFetch for robots.txt, sitemap.xml, llms.txt and four legal/policy pages.
- **Safety:** robots.txt was read first and respected (`/api/`, `/lib/`, `/pixel/` are disallowed; no direct calls were made to them). No form was submitted, no account was created, nothing was typed into email/password/name fields, and the cookie banner was left alone. It only offers "Got it" and has no decline button, so accepting was avoided. Page text is summarized and not copied.

## How to read the evidence labels

| Label | Meaning |
|---|---|
| **VERIFIED** | Directly observed (in DOM, network log, headers, CSS or on screen). What was observed is stated. |
| **INFERRED** | Reasonable engineering conclusion. The reasoning is given. |
| **UNKNOWN** | Cannot be determined from public access. |

---

## 1. Executive summary

1. **What the site is (VERIFIED):** yoga.com is an editorial yoga library with a calm, evidence-first tone. It has about 370 articles (37 list pages x 10), a pose library of 230 asanas with animated ink-drawing illustrations, two free multi-chapter "courses", long reference guides, and a large **US yoga-studio directory** (about 19,000 listings across 50 states + DC, each with a "Studio Score"). It is monetized or planned to be monetized through a paid, invitation-only "Yoga Club" walk-in membership for studios, and through search ads.
2. **Operator (VERIFIED from the privacy policy and terms, via WebFetch):** Inter Media Digital Marketing LLC in Dubai, UAE. The footer credits that agency. The Organization JSON-LD gives `foundingDate` 2026.
3. **Architecture (mostly INFERRED, with strong evidence):** This is a hybrid.
   - Content pages are **pre-rendered static HTML served from Google Cloud Storage** behind Google's load balancer/CDN. VERIFIED headers: `x-goog-*`, `server: UploadServer`, `via: 1.1 google`, `cache-control: public,max-age=604800,stale-while-revalidate=2592000`.
   - Interactivity uses **small vanilla JavaScript**: `main.min.js` is about 13 KB, with inline scripts. No SPA framework runs on content pages.
   - Dynamic features run as **separate services**: a React auth app at `/auth` (Vite-style hashed bundle), `/api/*` endpoints on the same domain, a studio-directory API on **Google Cloud Run** (`yoga-directory-…us-central1.run.app`), and the personalized course demo on another Cloud Run service.
4. **Design (VERIFIED):** The palette is warm paper/cream (`#f7f4ef`), ink (`#2b2a26`), ochre/gold accent (`#c2a366`) and deep sage (`#2c3a31`). Headings use Figtree 800, body text uses Plus Jakarta Sans, and italic accents use Fraunces. Buttons are pill-shaped (`999px`). All fonts are self-hosted WOFF2 files and all images are WebP.
5. **Content system (VERIFIED):** There are 12 topic "pillars" (category hubs) plus tags, authors, breadcrumbs, "Most read", "Editor's picks", per-article table of contents, sources sections, share bar, author box and related posts. Pose pages follow a strict template: At a Glance → How to → Benefits → Mistakes/Cues → Modifications → Cautions → Related Poses.
6. **Search (VERIFIED):** The header search goes to `/search?q=`. That page shows Google-powered results and loads **Google AdSense for Search** (`syndicatedsearch.goog`) plus the Meta pixel. The pose library has a separate **instant client-side filter** (text, level, category, sort) with no network calls.
7. **Auth (VERIFIED UI + endpoint names only):** It offers email/password sign-in and registration (password minimum 8, email verification) and "Continue with Google". Endpoint names appear in the public JS bundle, and none were called by me. There is **no visible "forgot password" link**.
8. **SEO (VERIFIED):** Every page type has strong basics: canonical URLs, OG/Twitter tags, JSON-LD (`Organization`, `WebSite`, `BlogPosting`+`MedicalWebPage`, `BreadcrumbList`, `CollectionPage`, `ProfilePage`, `LocalBusiness`/`HealthClub`) and clean slug URLs. There are gaps:
   - Studio pages are `noindex`.
   - The sitemap omits `/poses`, the studio directory and some pose URLs.
   - Search result pages are indexable.
9. **Notable issues observed:**
   - At 375px the header's menu button is partly off-screen.
   - The mobile menu lacks the studio-finder links.
   - Buttons are nested inside links on studio cards.
   - Small eyebrow text is slightly below AA contrast.
   - Analytics cookies (`_ga`, `_clck`, `_fbp`) are present before any consent click.
   - Two pillars show a "cornerstone" article from a different pillar.
   - One duplicate studio listing was seen.
   - A second, dark "buying guide" page template with ads exists outside the main design system.
10. **For our own site:** An MVP can reproduce the *kinds* of features (pose library with filters, article/pillar system, simple studio finder, newsletter, auth) with original content and branding. A simple static-first stack is recommended, such as Next.js or Astro with Markdown/MDX or a headless CMS, plus Postgres for studios and users. See sections 23–24.

---

## 2. Site map

Legend: **[V]** = visited, **[L]** = seen only as a link or sitemap entry and not visited, **[D]** = dynamic/app.

```
yoga.com/
├── /                                   Homepage                                   [V] (desktop + 375px)
├── /yoga-club                          Yoga Club landing + invitation form        [V]
├── Pillars (12 category hubs)          "A YOGA.COM PILLAR" template
│   ├── /yoga-basics                                                               [V]
│   ├── /yoga-styles                                                               [V]
│   ├── /practice-sequences                                                        [V]
│   ├── /body-mobility-posture  /breath-nervous-system  /healthy-aging             [L]
│   ├── /food-ayurveda-simple-wellness  /lifestyle-daily-living                    [L]
│   ├── /stress-sleep-emotional-wellbeing  /mindfulness-meditation                 [L]
│   └── /yoga-philosophy-wisdom  /yoga-retreats                                    [L]
│       └── /{pillar}/{long-article-slug}   Article                                [V] x2
├── /article/{slug}                     Older flat article URLs (14 in sitemap)    [L]
├── /articles                           All articles, paginated                    [V]
│   └── /articles/page/{n}              (n up to 37)                               [V] page 2
├── /poses                              Pose library (230) with filters            [V] (desktop + 375px)
│   └── /pose/{slug}                    Pose page                                  [V] cobra-pose
│       └── some left-side variants redirect to the right-side slug                [V] bikram-triangle-left → -right
├── /tag/{slug}  (+ /page/{n})          Tag archive (47 in sitemap)                [V] /tag/beginners
├── /authors                            Authors index                              [L]
│   └── /author/{slug}                  Author profile (ProfilePage)               [V]
├── Courses / cornerstone guides (flat URLs)
│   ├── /pranayama-breathing-guide      Course hub (6 chapters)                    [V]
│   │   └── /pranayama-*                Chapter pages with prev/next               [V] 1 chapter
│   ├── /yoga-for-sleep (+ /yoga-sleep-*, /yoga-nidra-for-sleep, …)               [L]
│   ├── /first-year-yoga-poses  /home-yoga-practice-setup                          [L]
│   ├── /yoga-terms-plain-english       Glossary-style reference                   [V]
│   └── /yoga-for-kids  /baby-yoga                                                 [L]
├── /course                             "Your Personal Yoga Course" (iframe)       [V] [D]
│   └── yoga-course-demo-…run.app       Separate Cloud Run app                     [V] [D]
├── Studio directory
│   ├── /yoga-studios                   Finder: search, geolocation, map, states   [V] [D]
│   ├── /yoga-studios/{state}           State page (e.g. /tx)                      [V]
│   ├── /yoga-studios/{state}/{city}    City page (e.g. /tx/austin)                [V]
│   ├── /studio/{name-city-state}       Studio profile (noindex)                   [V]
│   ├── /claim?s={studio-slug}          Claim listing                              [L]
│   └── /for-studios                    B2B landing + two forms + FAQ              [V]
├── /search?q=                          Google-powered results + search ads        [V] [D]
├── /{a-guide-to-…}                     Dark "buying guide" template with ads      [V] 1 example
├── /auth                               Sign in (React app)                        [V] [D]
│   └── /auth/register                  Create account                             [V] [D]
├── /about  /contact                                                               [V]
├── /how-we-create-our-content  /accessibility  /privacy-policy  /terms            [V] (WebFetch)
├── /cookie-policy  /advertising-disclosure  /health-safety-disclaimer             [L]
├── /consumer-health-data-privacy-policy                                           [L]
├── /robots.txt  /sitemap.xml  /llms.txt                                           [V]
└── /{anything-unknown}                 Custom 404 (real HTTP 404, noindex)        [V]
```

**Things the brief expected that are named differently or do not exist:**
- **"Basics"** = `/yoga-basics` and **"Styles"** = `/yoga-styles`. Both are ordinary pillar hubs.
- **"Guides"** in the main nav goes to `/articles`.
- **Courses:** there is no `/courses` index. Courses live on flat URLs, plus `/course`.
- **Studio finder:** `/yoga-studios`.
- **Newsletter:** there is no separate page. It appears in the footer, in a delayed modal, and in a homepage band.
- **Contact:** there is **no contact form**. The page has an email address and a phone number.

**Sitemap facts (VERIFIED by counting `<loc>` entries in-page):**
- The sitemap has **465 URLs**: 180 `/pose/*`, about 190 pillar articles, 47 tags, 14 authors, and the legal/cornerstone pages.
- It does **not** include `/poses`, `/yoga-club`, `/yoga-studios*`, `/studio/*`, `/for-studios`, `/course` or the `/a-guide-to-…` pages.
- It has no image sitemap tags.
- (A WebFetch summary had reported 595 URLs. The direct in-page count of 465 is the reliable figure.)

---

## 3. Page-type inventory

The 19 points are condensed per page type. Colors and fonts are shared; see section 6.

### 3.1 Homepage (`/`)
See section 4 for full anatomy.
- **Purpose:** Brand promise ("Breathe easy.") and routing into three jobs: *learn* (guides), *find* (studios) and *practice* (courses/sequences).
- **SEO (VERIFIED):**
  - Title "yoga.com | a place to unroll your mat."; meta description present.
  - Canonical, OG and Twitter tags (1200x630 default image with alt text).
  - JSON-LD `Organization` and `WebSite` (with `potentialAction`, meaning a sitelinks SearchAction).
  - Google and Bing site-verification meta tags.
- **Heading issue (VERIFIED):** The first section title "Latest from the Journal" is an `H3` that comes before any `H2`. The heading order is therefore h1 → h3 → h2.

### 3.2 Pillar / category hub (e.g. `/yoga-basics`, `/yoga-styles`, `/practice-sequences`)
1. **Purpose:** A topic landing page that lists every article in the pillar.
2. **Layout (VERIFIED classes):** `phead` header → `feature` cornerstone block → `cols` (article list on the main side, sidebar with "Most read here" and "Other pillars").
3. **Header:** Global.
4. **Sections:**
   - Breadcrumb (Home · Pillar), eyebrow "A YOGA.COM PILLAR", H1 and a one-line intro.
   - "Start here · the cornerstone" featured article.
   - "All in this pillar" list.
   - Top-3 most-read list.
   - Links to the other 11 pillars.
5. **Components:** Article card (category eyebrow, title, excerpt, author, date, read time), numbered most-read list, pillar link list.
6–8. Shared design system.
9. **Images:** Card thumbnails (11 on /yoga-basics).
10. **CTA:** "Read the cornerstone →".
11. **Forms:** None besides the global ones.
12. **Interactions:** Hover states only.
13. **Animation:** Card lift on hover (transition tokens seen).
14. **Mobile:** Stacks to one column (INFERRED from breakpoints).
15. **States:** No empty state seen.
16. **Accessibility:** The breadcrumb is plain text links and not a `<nav aria-label="Breadcrumb">` (VERIFIED: only "Primary" and "Mobile" nav landmarks exist).
17. **SEO (VERIFIED):**
    - JSON-LD `CollectionPage` + `BreadcrumbList`.
    - The meta description is generic ("Browse Yoga Basics articles on Yoga.com").
    - No pagination was seen on pillar hubs; all items are listed.
18. **Internal linking:** Strong (cornerstone, list, most-read, other pillars).
19. **Organization:** Content is grouped by pillar, and each pillar has one cornerstone article.
- **Content issue (VERIFIED):**
  - `/practice-sequences` shows a doshas article as its cornerstone.
  - `/yoga-styles` shows a grocery-shopping article as its cornerstone.
  - The "cornerstone" slot seems to be configured per pillar and is mis-set on at least two pillars.

### 3.3 All articles (`/articles`, `/articles/page/{n}`)
- **Structure (VERIFIED):** A 10-item list with numbered pagination (1…7…37, "Next →"), a "Most read" sidebar and "Browse by thread" (tags).
- **SEO (VERIFIED):**
  - Each page has a **self-referencing canonical** (`/articles/page/2` points to itself).
  - The page number is in the title.
  - `CollectionPage` JSON-LD.
  - There are no `rel=prev/next` link tags. Google no longer uses them, so this is minor.
- **Pagination markup (VERIFIED):** A `div.pagination` without `aria-label` or a `nav` wrapper.

### 3.4 Article (e.g. `/yoga-basics/what-is-yoga-beginners-guide`, `/practice-sequences/yoga-warm-up-…`)
1. **Purpose:** Long-form guides of about 1,200–1,700 words.
2. **Layout (VERIFIED):** A centered reading column (body `p` max-width 640px, font-size about 21.6px, line-height 1.5) with a hero figure.
3. **Top of page:** Breadcrumb, category eyebrow, H1, standfirst/dek, author initials avatar, read time, published date and updated date.
4. **Sections:**
   - "On this page" table of contents (`.toc`).
   - Body built from H2/H3.
   - "Sources" section with external links to medical and research sites (e.g. NIH/PMC and NCCIH).
   - Tag chips (`.tags`), prev/next article, share bar (`.sharebar`: X, Facebook, LinkedIn, WhatsApp, Copy link), author box (`.authorbox`), "Continue your practice" related grid.
5. **Components:** TOC, reading-progress indicator (an element with class containing "progress" exists; VERIFIED DOM, behavior INFERRED), share bar, author box, related cards, tag chips.
9. **Media:** One `figure` hero. No video. Sequence articles use numbered H3 steps and **do not link to pose pages** (0 `/pose/` links in the warm-up sequence) — a missed internal-linking chance.
16. **Accessibility:** Headings are in logical order. Share links have `aria-label`s ("Share on X", etc.).
17. **SEO (VERIFIED):**
    - `og:type=article`, `article:published_time` and `modified_time` metas, `meta author`.
    - JSON-LD `BlogPosting` + `BreadcrumbList`. Pose articles are additionally typed `MedicalWebPage`.
18. **Internal linking:** Tags, pillar breadcrumb, author, related posts and prev/next.

### 3.5 Pose library index (`/poses`)
1. **Purpose:** Browse all 230 poses by category and level.
2. **Layout (VERIFIED):**
   - Sticky-feeling toolbar: search input, "Filters" button, "Sort by" select.
   - Then 9 category sections (Standing 53, Seated 32, Backbends 31, Twists 24, Balancing 22, Arm Balances 25, Inversions 24, Prone 10, Supine 9).
   - Each section is a card grid: 4 columns at 1280px and 2 columns (160px each) at 375px.
5. **Pose card (VERIFIED markup):**
   - `a.pcard` with `data-slug`, `data-cat` and `data-lv`.
   - Thumbnail: a static WebP ink drawing, 1152x864, hosted on a Google Cloud Storage bucket.
   - Play badge ("Watch the steps") that plays a step animation.
   - English name with a level dot, and the Sanskrit name in italics.
11. **Forms:**
    - Search input (`aria-label` "Search poses by name or Sanskrit") with a clear button.
    - Filter popover: Level chips Beginner/Intermediate/Advanced and 9 Category chips, "Clear" and "Done".
    - Sort select: Category / A to Z / Difficulty.
12. **Interactions (VERIFIED):**
    - Typing "cobra" instantly narrowed the grid to 2 cards.
    - The live region `.pxcount` (`aria-live="polite"`) announced "2 of 230 poses".
    - **No network requests** were made and the URL did not change, so filters are not shareable or bookmarkable.
13. **Animation:** Animated line drawings (the `art-anim` class and play badge); the popover has a blurred backdrop.
14. **Mobile (VERIFIED screenshot):** Two-column grid. Filters open as a floating panel over a blurred page.
16. **Accessibility:**
    - The chips use `aria-pressed`.
    - The play badge is a `span role="button" tabindex="-1"` inside a link, so it is not keyboard-reachable.
    - The Filters button lacks `aria-expanded` (it has `aria-controls="fdlg"`).
17. **SEO:** Title "Yoga Poses - The Full Pose Library with Sanskrit Names"; JSON-LD `CollectionPage`. **`/poses` is not in the sitemap.**
- **Performance (VERIFIED):** HTML is 45 KB compressed and 460 KB decoded, because all 230 cards are server-rendered. 226 of the 230 images use `loading="lazy"`.

### 3.6 Pose page (`/pose/{slug}`, e.g. `/pose/cobra-pose`)
1. **Purpose:** A step-by-step guide to one asana.
4. **Fixed section template (VERIFIED H2s):** At a Glance (Level / Type / Targets / Good for) → How to Do → Benefits → Common Mistakes and Alignment Cues → Modifications and Props → Cautions (+ medical disclaimer line) → Related Poses → tags → prev/next pose → share → author box → Continue your practice.
   - The TOC mirrors these H2s.
   - Byline shows the author, read time, published date and updated date.
9. **Media:** Hero photo (`/media/{uuid}_large.webp`). On the sampled page, the photo did not visibly depict the pose (a portrait), which is a content-quality observation.
17. **SEO (VERIFIED):**
    - Title pattern "{Pose}: How to, Benefits & Cautions | Yoga.com".
    - Description = the lede.
    - JSON-LD `["BlogPosting","MedicalWebPage"]` + `BreadcrumbList`; OG image = the hero.
18. **Linking:** Related poses, tags, 1–2 contextual links to sequences, and the pillar breadcrumb ("Body, Mobility & Posture").
- **Redirect behavior (VERIFIED):** `/pose/bikram-triangle-left` showed a "Redirecting..." page and landed on `/pose/bikram-triangle-right`. This was a client-side or meta redirect, not a 301 seen in the headers. INFERRED: this consolidates left/right variants, which would explain 230 cards vs 180 sitemap pose URLs.

### 3.7 Tag archive (`/tag/{slug}`)
- **VERIFIED:** H1 "Tagged: Beginners", intro line, paginated list (`/tag/beginners/page/2`), canonical and indexable.
- **Generic description:** "Articles tagged Beginners on Yoga.com". This is thin-content risk.

### 3.8 Author page (`/author/{slug}`)
- **VERIFIED:** Breadcrumb Home · Authors · Name; H1 name; long bio; list of the author's posts.
- JSON-LD `ProfilePage`. There are no external profile links (`sameAs`) on the page, which is an E-E-A-T opportunity.

### 3.9 Course hub and chapters (`/pranayama-breathing-guide`, `/pranayama-*`)
- **VERIFIED:** The hub is a long `Article` page with an intro, a safety section, "The chapters" (6 links), a dosage section ("How often, and how long") and Sources.
- Chapter pages have a breadcrumb-less header (eyebrow "YOGA.COM"), read time, updated date and a References section.
- Chapter pages have prev/next **chapter** links ("← How Breathing Actually Works", "Calm on Demand … →").
- No progress tracking, quiz, enrollment or login gate is visible.
- **Minor issue:** The first H2 repeats the H1 nearly verbatim.

### 3.10 Personalized course (`/course` → Cloud Run app)
- **VERIFIED:** `/course` embeds an iframe (`allow="autoplay; fullscreen; encrypted-media"`, no `sandbox`) pointing at `yoga-course-demo-…-uc.a.run.app`, with an "open in new tab" link.
- The app asks "What should your trainer call you?" (text input, maxlength 40). It then promises a personal recorded welcome, and shows a video player with captions (CC) and lesson navigation.
- Its `app.js` (about 10 KB) references `/api/manifest`, `/api/greeting`, `/api/greeting/{id}` (with polling) and `/cues/lesson_*` (INFERRED to be caption/cue files).
- INFERRED: the name is sent to a backend that generates a personalized greeting video or audio, possibly with AI speech or avatar generation. This is UNKNOWN because I did not enter a name.

### 3.11 Studio finder (`/yoga-studios`), state, city and studio pages
See section 15.

### 3.12 Yoga Club (`/yoga-club`)
- **VERIFIED:** A minimal page with a hero ("By invitation.") explaining a paid walk-in membership where studios receive a published flat rate per visit.
- Form fields: **email** (required) and **city**, plus "Request an invitation". The form has no `action` attribute, so submission is JS-handled (INFERRED).
- The nav shows a "NEW" badge on this item.
- The page has no OG image.

### 3.13 For studios (`/for-studios`)
- **VERIFIED:** B2B landing page.
- Sections:
  - Four terms: flat rate, zero cut, cap, no fines.
  - A comparison against named competitors (ClassPass, Mindbody vs Yoga Club).
  - Four onboarding steps: claim → set cap/rate → QR check-in → paid per visit.
  - FAQ.
- Two forms:
  - A studio lookup (a `studio` text field).
  - "Add your studio": studio name, street, city, state, zip, phone, website, contact name, role (select), email and message.

### 3.14 Search results (`/search?q=`)
See section 12.

### 3.15 "Buying guide" template (`/a-guide-to-…`)
- **VERIFIED:** Visually a different, **dark** template with a minimal header, 5 footer links and title suffix "– Yoga.".
- No author meta. JSON-LD `Article`.
- It loads the Meta pixel, Google scripts and a `syndicatedsearch.goog` ads iframe.
- It appears in site search results but not in the sitemap.
- INFERRED: a monetization landing template, probably for search-ad arbitrage/"related search" units. A cookie named `rsoc_seen` was observed, and "RSOC" is a common name for Google's "related search on content" ad product. The naming is suggestive but not confirmed.

### 3.16 Auth (`/auth`, `/auth/register`)
See section 11.

### 3.17 About, contact and legal
- **About (VERIFIED):** About 960 words with 5 H2s (mission, library, "not trying to sell you anything", practice at home, how we work). Links to the studio directory, the Club and the editorial policy.
- **Contact (VERIFIED):** No form. An email address and a phone number (UAE +971 country code), with a two-business-day reply promise.
- **Privacy / Terms (VERIFIED via WebFetch summaries):**
  - Last updated 2026-08-04; Dubai law; operator Inter Media Digital Marketing LLC.
  - They mention a "Practice log and Maya" feature for members (UNKNOWN what Maya is; INFERRED to be an assistant or companion feature behind login).
  - Named processors: GA4, Microsoft Clarity (session replay), SendGrid (email) and Google Cloud.
  - Advertising is described as "not currently active". However, I observed AdSense-for-Search and the Meta pixel on the search and guide pages. Either the policy is out of date or the summary missed it (flagged, not concluded).
- **Accessibility statement:** Claims a WCAG 2.1 AA target.
- **Editorial policy:** Sources are cited, and pages are checked before publishing. The summary noted no explicit mention of AI or of review by a medical professional.

### 3.18 404
- **VERIFIED:** A real **HTTP 404**, `noindex, follow`, a friendly on-brand message ("Lost your drishti?") and a single "Back to home" link.
- There is no search box or suggested links on the 404 page.

---

## 4. Homepage anatomy (desktop 1280px, VERIFIED unless marked)

| # | Section | Contents / components | Notes |
|---|---|---|---|
| 0 | Skip link | "Skip to content" → `#main` | Good accessibility |
| 1 | Header (sticky, translucent paper `rgba(247,244,239,.92)`) | Logo (WebP 150x40), primary nav (Yoga Club + NEW badge, Basics, Styles, Poses, Guides), account icon → `/auth?next=/`, "For studios" (ghost pill), "Find a studio" (dark pill), search icon, burger | The studio buttons show only at wide widths |
| 2 | Hero | Rotating background photos (4 WebP slides with separate `-mobile` variants; first preloaded with `fetchpriority=high`; `heroZoom` keyframe), eyebrow "LEARN · FIND · PRACTICE", H1 in two lines (sans "Breathe" + italic serif gold "easy."), gold rule, CTAs "Studios near you" (gold pill) + "Read a guide ▸" (ghost pill), "Latest" strip of 2–3 mini cards | Strong, calm first impression |
| 3 | Quote band | Large quote mark and a rotating spiritual quote with citation (inline script `.quote-band .q-opt`) | |
| 4 | Latest from the Journal | 8 article cards in a 2-column grid + "Most read" top-5 sidebar + "Explore the pillars" list; "All articles →" and "Visit the journal →" | Card: image, category eyebrow, title, excerpt, author, date, read time |
| 5 | Latest · Featured | One large feature (image left, text right, "Read the story →") | |
| 6 | Editor's Picks | Horizontal carousel with prev/next arrow buttons (7 cards) | |
| 7 | The Groundwork | "Guided courses" (2 course cards: chapter count + FREE, "Start the course →") and "Reference guides" (5 image cards) + "Find a yoga studio near you →" | Cornerstone library |
| 8 | Begin gently | 3 numbered step cards (01–03) linking to pillars, on a sand background | New-user onboarding path |
| 9 | Explore by Category | 12 pillar cards with image and article count | |
| 10 | Newsletter band | Eyebrow "The yoga.com letter", H2, one line, CTA | |
| 11 | Footer (dark `#26231d`) | Logo, social icons (Instagram, Facebook, LinkedIn, YouTube), newsletter form, link columns (topics, site, legal), "Cookie settings" and "Your privacy choices" (`href="#"`), Sign in, agency credit | |
| 12 | Overlays | Search dialog, mobile menu dialog, newsletter modal (`data-delay="35"` s, `data-cap-days="30"`, `data-wait-consent="1"`), cookie banner (single "Got it"), scroll-to-top control (`.scrollnav`, "Page scroll" group) | |

- **Performance (VERIFIED, first uncached load):** TTFB about 1.1 s, DOMContentLoaded about 2.7 s, load about 3.2 s. HTML is 29 KB brotli (141 KB decoded). 53 resources, about 2 MB of images, 728 DOM nodes and 49 `<img>` tags.

---

## 5. Navigation system (VERIFIED)

- **Primary nav (desktop):** 5 items. The first item, "Yoga Club", is styled in gold with a "NEW" badge. Each link has a small dot `<i class="d">` for the active/hover indicator. Items are uppercase 12.5px, weight 600, letter-spacing about 0.37px, color `#7d6434`.
- **Utility actions:** account avatar link, "For studios", "Find a studio", search (opens a modal dialog with `role=search`, placeholder "Search poses, breath, programs…", Esc close) and burger.
- **Mobile menu:**
  - A full-screen sage dialog (`role=dialog`, `aria-modal`) with Yoga Club, Basics, Styles, Poses, Guides, All articles, then Sign in, Search, All articles.
  - **"Find a studio" and "For studios" are missing** from the mobile menu.
  - The burger is a `span role="button" tabindex="0"`, not a `<button>`. It lacks `aria-expanded`.
  - Enter opened the menu and Esc closed it. Focus did **not** move into the dialog when it opened.
- **Footer nav:**
  - Topics: Yoga Basics, Yoga Styles, Practice & Sequences, Body/Mobility, Breath.
  - Site: Home, All Articles, Your Course, Search, About, How We Create Our Content, Advertising Disclosure, Accessibility, Contact.
  - Legal: Terms, Privacy, Cookie Policy, Health & Safety Disclaimer, Consumer Health Data Privacy.
  - Also: Cookie settings, Your Privacy Choices, Sign in.
- **Wayfinding:** Breadcrumbs on pillar, article, pose, tag, author and studio pages. Sidebars cross-link the pillars. "Continue your practice" appears at article ends. Prev/next links appear on poses and course chapters.

---

## 6. Design system observations (VERIFIED from `:root` CSS variables and computed styles)

### 6.1 Color palette

| Token | Hex | Use |
|---|---|---|
| `--paper` / `--cream` | `#f7f4ef` | Page background |
| `--paper-2` | `#fbf9f5` | Raised surfaces |
| `--sunken` | `#efe9df` | Inset areas |
| `--sand` | `#d6cdbc` | Section backgrounds ("Begin gently") |
| `--hair` | `#e6dfce` | Hairline borders |
| `--ink` | `#2b2a26` | Headings and primary text; `theme-color` |
| `--read` | `#322d26` | Reading text |
| `--t2` | `#4f4636` | Secondary text / excerpts |
| `--muted` | `#6d6557` | Meta text |
| `--ochre` / `--gold` | `#c2a366` | Primary button background and accents |
| `--ochre7` | `#7d6434` | Nav link color |
| `--gold-deep` | `#8a6f3c` | Eyebrows |
| `--gold-light` | `#e6c68a` | Highlights on dark |
| `--ochre-100` | `#f2ead8` | Tints |
| `--on-gold` | `#1a120a` | Text on gold buttons |
| `--sage` / `--footer-bg` | `#2c3a31` | Dark panels (mobile menu, auth side panel) |
| footer (computed) | `#26231d` | Footer background |

**Measured contrast ratios (WCAG):**
- ink on paper: 13.1
- `--t2` on paper: 8.5
- muted on paper: 5.3
- nav `#7d6434` on paper: 5.1
- **eyebrow `#8a6f3c` on paper: 4.33, which fails AA for small text**
- `#c2a366` on paper: 2.2, so it must never be used for text on paper
- dark text on gold button: 7.7
- white on gold: 2.4, which would fail

### 6.2 Typography

| Role | Family | Size / weight / line-height (desktop computed) |
|---|---|---|
| Display H1 (hero) | Figtree 800 | 71.7px / 1.0 / +0.36px tracking |
| H1 (pose page, desktop) | Figtree 800 | about 44–50px (visual) |
| H2 (sections) | Figtree 800 | 30.4–31.2px / 1.05–1.15 / −0.46px |
| H3 (cards) | Figtree 700 | 22.4px / −0.18px |
| Body (general) | Plus Jakarta Sans 400 | 16–16.8px / 1.55 |
| Article body | Plus Jakarta Sans 400 | 21.6px / 1.5, max-width 640px (`--measure: 46rem` token) |
| Italic accent | Fraunces italic 500 | Hero "easy.", Sanskrit names |
| Eyebrow / buttons | Plus Jakarta Sans 600, uppercase | 12.5–13px, letter-spacing up to 1.57px |
| Also preloaded | Merriweather 400 | Use not confirmed (INFERRED legacy or serif fallback) |

- **Mobile H1:** 44.8px.
- **Fonts:** All self-hosted WOFF2 under `/assets/fonts/`, with 5 preloaded. Fraunces is also requested from Google Fonts on the studio pages.

### 6.3 Spacing, radii, shadows, motion
- **Buttons:** `--btn-r: 999px` (pill). Padding tokens: sm `9px 18px`, md `13px 24px`, lg `15px 30px`.
- **Radii in use:** 50% (avatars/icon buttons, 48 rules), 999px, 22px, 20px, 18px, 16px, 14px, 12px (most common card radius), 10px, 8px, 6px, 2px.
- **Shadows:** Soft, warm and negative-spread. Examples: `0 18px 40px -18px rgba(43,42,38,.28)` and `0 16px 40px -22px rgba(26,18,10,.35)`. Focus-style rings: `0 0 0 3px rgba(194,163,102,.2)`.
- **Easing:** `--ease: cubic-bezier(.22,1,.36,1)`. Transitions: 0.15–0.6s on transform, box-shadow, background and color. Hero crossfade is 1.4s.
- **Keyframes:** `heroZoom`, `yga-breathe`, `yga-blink`, `yga-pop`, `nlp-in` (newsletter popup), `sbdrop` (search dropdown), `mmf` (mobile menu).
- **`prefers-reduced-motion: reduce`** media query present. Print styles present.
- **Footer padding:** `64px 0 96px`.

### 6.4 Breakpoints (VERIFIED media queries)
- **Max-width queries:** 1240, 1100, 1040, 980, 920, 900, 880, 780, 768, 760, 720, 680, 640, 600, 560px.
- **Min-width queries:** 881 and 961px.
- There is no single breakpoint scale. INFERRED: per-component breakpoints written by hand.
- **Practical tiers:** ≥1100 desktop, about 880–980 tablet (the primary nav collapses to the burger), ≤680 phone.

---

## 7. Reusable component inventory (VERIFIED class names where shown)

| Component | Where | Notes |
|---|---|---|
| Header / masthead with sticky translucent bar | All | `.mast-btn` ghost/dark pills |
| Search modal | All | `#searchbar`, `role=dialog`, form → `/search` |
| Mobile menu dialog | All | `#mm`, `.burger` |
| Cookie banner | All | `.geo-consent` (name suggests geo-aware behavior; INFERRED) |
| Newsletter modal + inline forms | All | `.nlp`, `form[data-newsletter]` |
| Button | All | `.btn`, `.btn.ghost` |
| Eyebrow label | All | Uppercase, gold-deep, dot prefix |
| Article card (vertical and horizontal) | Home, pillars, articles, tags | Image, category, title, excerpt, author, date, read time |
| Hero-strip mini card | Home | `.hl-item` |
| Feature block | Home, pillar | `.feature` |
| Carousel with arrow buttons | Home | Editor's Picks |
| Numbered "Most read" list | Home, pillars, articles | |
| Pillar/category card with count | Home | `.catcard` |
| Step card (01/02/03) | Home | `.sh-card` |
| Course card / reference guide card | Home | |
| Breadcrumb | Most pages | Plain links, not a nav landmark |
| TOC "On this page" | Articles, poses | `.toc` |
| Reading progress bar | Articles | Class contains "progress" |
| Share bar | Articles, poses | `.sharebar` |
| Author box / author avatar initials | Articles, author page | `.authorbox` |
| Tag chips | Articles | `.tags` |
| Prev / next navigation | Poses, chapters | |
| Pagination | Lists | `.pagination` |
| Pose card with play animation | /poses | `.pcard`, `.playbadge` |
| Filter chips + popover + sort select + live count | /poses | `data-fgroup`, `.pxcount` |
| Studio card | Directory | `.scard`: art image, "Verified" chip, heart/save button, score badge (`.sc`), rating word, styles, price and beginner tags |
| Score badge + sub-score bars | Studio page | Six sub-scores out of 100 |
| Leaflet map | Finder, studio page | OSM tiles |
| Pricing table, amenities list, CTA row (Visit website / Directions / Call) | Studio page | |
| Badge embed code copier | Studio page | "Verified on yoga.com" badge |
| FAQ | /for-studios | |
| Auth split card (dark sage panel + form) | /auth | |
| 404 message block | 404 | |

---

## 8. Content architecture

- **Content types (VERIFIED):**
  - Article
  - Pose (a special article with a fixed template and pose metadata: level, category, Sanskrit name, animation)
  - Pillar/category
  - Tag ("thread")
  - Author
  - Course hub + chapter
  - Reference guide
  - Studio (with state and city hierarchy)
  - Legal page
  - "Buying guide" (separate template)
- **Taxonomy (VERIFIED):**
  - 12 pillars.
  - About 47 tags.
  - For poses: 9 categories and 3 levels.
  - For studios: state → city, plus styles, "beginner-friendly", price and amenities.
- **URL patterns (VERIFIED):**
  - `/{pillar}/{long-descriptive-slug}` for current articles.
  - `/article/{slug}` for older ones.
  - `/pose/{slug}`, `/tag/{slug}`, `/author/{slug}`.
  - `/yoga-studios/{state}/{city}`, `/studio/{name-city-state}` (with a `-2` suffix for duplicates).
  - Flat slugs for cornerstone content.
- **Metadata per article (VERIFIED):** Author, published and updated dates (ISO with milliseconds, e.g. `2025-11-15T21:12:49.629Z`), read time, pillar, tags, hero image, excerpt/dek, sources.
- **Media storage (VERIFIED):**
  - `/media/{uuid}_{small|medium|large}.webp` for article images, in three generated sizes used in `srcset`.
  - `/uploads/…` for site assets.
  - `storage.googleapis.com/yoga-maison-…/pose-anim/{slug}-static.webp` for pose drawings.
  - `/brand-assets/studio-art/sa-NNN.webp` for placeholder studio illustrations.
- **Authoring volume (VERIFIED dates):** Many pose pages are dated within days of each other (e.g. 28–30 July 2026) with rotating author names. INFERRED: batch production. The rate of production cannot be verified further.
- **CMS:** UNKNOWN. INFERRED to be a custom CMS or generator. The UUID media names, generated size variants and `category_{timestamp}.webp` / `logo_{timestamp}.webp` upload naming look like a custom upload pipeline rather than WordPress (no `wp-content` paths) or a known headless CMS CDN.

---

## 9. User journeys (as observed)

1. **Curious beginner:** Home → "Begin gently" step 01 → `/yoga-basics` → cornerstone article → TOC → Sources → "Continue your practice" → the newsletter modal appears after about 35s (only after consent, per `data-wait-consent`).
2. **Learn a pose:** Nav "Poses" → `/poses` → type a name or filter by level/category → play the ink animation → open the pose page → follow Related Poses or prev/next.
3. **Find a studio:** Hero "Studios near you" → `/yoga-studios` → "Use my location" (browser geolocation) *or* type a city *or* pick a state → city page (verified-first list with a price summary) → studio profile (score breakdown, pricing, map, Directions/Call/Website) → Save (heart) → which may require sign-in (INFERRED from the `/auth?next=` reference in the directory script).
4. **Studio owner:** Header "For studios" → value proposition and comparison → claim an existing listing (`/claim?s=…`) or submit "Add your studio" → join the Club.
5. **Structured learning:** Home "The Groundwork" → course hub → chapter 1 → next → … (no login required).
6. **Personalized course:** Footer "Your Course" → `/course` → enter a first name → generated welcome → 6 video lessons (not exercised).
7. **Member:** Account icon → `/auth` → sign in with email/password or Google → return to `next` URL. What members get beyond this is UNKNOWN; the register page advertises course library access and saved progress.

---

## 10. Feature inventory

| Feature | Status | Evidence |
|---|---|---|
| Editorial articles with pillars, tags, authors | Live | VERIFIED |
| Pose library (230) with instant search, filter, sort, animated drawings | Live | VERIFIED |
| Pose detail template with related poses | Live | VERIFIED |
| Free multi-chapter courses (Pranayama, Sleep) | Live | VERIFIED |
| Reference guides (glossary, first-year poses, home setup, kids, baby) | Live | VERIFIED (2 visited) |
| Personalized video course (name-based greeting) | Demo | VERIFIED UI; backend INFERRED |
| Studio directory (~19k), state/city pages, map, geolocation, scores | Live | VERIFIED |
| Studio reviews (read + "Write a review") | Live UI, 0 reviews on the sampled page | VERIFIED UI; write flow not tested |
| Save/favourite studios | Present | VERIFIED button; storage UNKNOWN |
| Claim listing / badge embed for studios | Present | VERIFIED links and UI |
| Yoga Club invitation list | Present | VERIFIED form (not submitted) |
| Site search (Google-powered, with ads) | Live | VERIFIED |
| Newsletter (footer, modal, band) | Present | VERIFIED forms; endpoint name `/api/newsletter` seen in JS |
| Accounts: email/password, Google, email verification | Present | VERIFIED UI + endpoint names |
| Practice log, "Maya" | Mentioned in legal pages only | UNKNOWN |
| Social share, copy link | Live | VERIFIED |
| Cookie banner, privacy choices | Present | VERIFIED |
| llms.txt for AI discovery | Present | VERIFIED |

---

## 11. Authentication / account observations

- **VERIFIED UI:**
  - `/auth` is a two-panel card with a dark sage marketing panel and a form: Email (`type=email`, `autocomplete=email`, required) and Password (`autocomplete=current-password`, required), "Sign in", "or", "Continue with Google", and "No account yet? Create one".
  - `/auth/register`: Email, Name (`autocomplete=given-name`), Password (`minlength=8`, `autocomplete=new-password`), and a note that a verification link will be emailed.
  - Browser-native validation messages appear for empty fields (checked read-only via `validationMessage`, not by submitting).
  - `robots: noindex, follow`. Redirect-back is done via `?next=`.
- **VERIFIED gaps:**
  - No "Forgot password?" link.
  - No terms/privacy consent text or checkbox on registration.
  - The marketing copy looks like a white-label template ("One account, this studio").
- **VERIFIED technical:**
  - The auth UI is a separate **React** bundle (`/auth/assets/app-[hash].js`, about 104 KB; the hashed filename suggests **Vite**, INFERRED).
  - Endpoint names in the public bundle: `/api/auth/config` (the only one the page itself called, which returned 200), `/api/auth/me`, `/api/auth/login`, `/api/auth/register`, `/api/auth/resend-verification`, `/api/auth/google`.
  - A `g_state` cookie was present, which is used by Google Identity Services.
- **INFERRED:** Server-side sessions via cookies. The privacy policy summary mentions hashed passwords and session cookies. No token was visible in `localStorage` (only referrer keys).
- **UNKNOWN:** Session lifetime, CSRF protection, rate limiting, password hashing algorithm, MFA, what signed-in users can do.

---

## 12. Search system observations

- **Global search (VERIFIED):**
  - The header icon opens a modal with a GET form → `/search?q=…`.
  - The results page title is "Search – Yoga." (a different title suffix than the rest of the site). The H1 is `Results for "…"` and the page says "Powered by Google".
  - The results list "Web Results" (title, URL, snippet).
  - The page loads `google.com/adsense/search/ads.js`, `partner.googleadservices.com` and iframes from `syndicatedsearch.goog`. This is **Google AdSense for Search / Programmable Search**.
  - It also loads the Meta pixel (`connect.facebook.net`).
- **SEO issue (VERIFIED):** `/search?q=…` pages are `index, follow`. Internal search results are usually set to `noindex`.
- **Result quality (VERIFIED):** For "breath", the top results were the root-level "buying guide" pages rather than the main breathing course. INFERRED: the search engine is tuned toward monetized pages, or is not restricted to the editorial content.
- **Pose search (VERIFIED):** A separate client-side filter over the 230 server-rendered cards. It is instant, uses no network, is announced through an `aria-live` count and does not update the URL.
- **Studio search (VERIFIED):**
  - Finder page script `dir.js` (about 10 KB) downloads **`/studios-index.json` (about 587 KB)** on load and references `/api/search?q=` and `/api/search?la=` (lat/long).
  - It uses `navigator.geolocation` for "Use my location".
  - Typing "Austin" (without submitting) showed no visible autocomplete.
- **Search JSON-LD (VERIFIED):** `WebSite.potentialAction` (sitelinks search box) is declared.

---

## 13. Yoga pose / content system

- **Data fields per pose:**
  - VERIFIED from card attributes and page: slug, English name, Sanskrit name (with diacritics), category (standing/seated/backbend/twist/balance/arm-balance/inversion/prone/supine), level (beginner/intermediate/advanced), static drawing + step animation, hero photo.
  - Structured "At a Glance" fields: Level, Type, Targets, Good for.
  - Ordered steps, benefits list, mistakes→cues pairs, modifications/props, cautions, related poses (with a reason line each), tags, author, dates.
- **Variants (VERIFIED):** Many side-specific variants exist (Left/Right leg). At least one left variant redirects to its right counterpart.
- **Illustrations:** An original-looking ink-line style on a cream tile. Animated step sequences are available on demand. File names contain `-static.webp`; the animation file format is UNKNOWN (not triggered).
- **Relationship model (INFERRED):**
  - Pose ↔ Pose ("related", "preparation", "progression", "counter-pose").
  - Pose ↔ Sequence article (contextual links).
  - Pose → Pillar ("Body, Mobility & Posture") and Tags.
- **Opportunity for our site:** Sequences are prose articles with no structured pose list and no pose links. A structured "sequence = ordered list of poses + hold times" model would be a clear improvement.

---

## 14. Course system

- **Type A: editorial courses (VERIFIED):**
  - "Pranayama, Plainly" and "Yoga for Sleep" are each a hub page plus 6 chapter pages on flat URLs.
  - Chapters have prev/next links, references and read time.
  - They are free and do not require login.
  - No progress tracking, completion state or quizzes are visible.
- **Type B: personalized course (VERIFIED UI):**
  - A separate Cloud Run web app embedded by iframe. Six lessons "for absolute beginners".
  - The learner types a first name, and a personalized greeting is prepared ("Your trainer is preparing your welcome…").
  - Custom video player with play/pause, time, seek slider, CC and lesson arrows.
  - API names: `/api/manifest`, `/api/greeting` (+ polling), `/cues/lesson_*`.
  - Stores something in `localStorage` (VERIFIED keyword in the script; contents not inspected).
- **Account tie-in:** The register page promises "full course library access" and "save your progress". Whether courses become gated is UNKNOWN.

---

## 15. Studio-finder system

- **Scale (VERIFIED):** State counts are listed (e.g. CA 2,142; NY 1,343; TX 1,115), about 19,000 in total. Texas: 1,115 studios, 634 "verified against their own website". Austin: 124 studios, 86 verified.
- **Finder page `/yoga-studios` (VERIFIED):**
  - Photo hero with a search form (city/studio/state, "Use my location", "Search").
  - Style chips: Hot yoga, Beginner-friendly, Prenatal, Vinyasa, Yin, Meditation.
  - "Editor's picks" studio cards.
  - A disclaimer that card art is illustrative until a studio claims its page.
  - "Browse by state" with counts.
  - A Leaflet 1.9.4 map (from unpkg) with **OpenStreetMap tiles** loaded directly from `tile.openstreetmap.org` (20 tile requests). Note: the OSM tile usage policy discourages heavy production use.
  - JSON-LD `CollectionPage` + `ItemList` of states.
- **State page `/yoga-studios/tx`:** H1, a generated statistics paragraph (counts, styles, drop-in price range, beginner-friendly count), a city list with counts, and editor's picks. JSON-LD `CollectionPage` + `ItemList`.
- **City page `/yoga-studios/tx/austin`:**
  - Statistics paragraph and "Top-rated" list (all 124 cards; no pagination).
  - Sections for styles offered and class prices.
  - JSON-LD `ItemList` + `BreadcrumbList`.
- **Studio card:** Placeholder art, "Verified" chip, heart/save button (**`<button>` nested inside the card `<a>`**, which is invalid interactive nesting), Studio Score (0–100) + word (Excellent/Great…), top 3 styles, drop-in price, "Beginner-friendly".
- **Studio profile `/studio/{slug}` (VERIFIED):**
  - Breadcrumb (Studios / State / City / Name), score badge, "Verified from their own site", founding year.
  - Feature chips with emoji; CTAs: Visit website / Directions / Call.
  - Placeholder image labelled "Illustration", generated description paragraph.
  - Pricing (drop-in, community rate) with a "confirm current rates" note; "New here?" checklist; styles and levels; amenities with emoji; contact block; Leaflet map.
  - **Studio Score breakdown:** six sub-scores (verified from own site, information depth, welcoming to beginners, teacher credentials, time in community, easy to find) + "How we score →".
  - Reviews (loaded dynamically; "No reviews yet"; "Write a review" button).
  - Nearby studios; "Own this studio?" box with claim link, badge embed code (light/dark, "Copy badge code") and a "Manage or remove this listing" link.
  - **SEO:** `robots: noindex,follow` (VERIFIED). JSON-LD `["LocalBusiness","HealthClub"]` with address, geo, url and telephone + `BreadcrumbList`.
  - **Runtime calls made by the page itself (VERIFIED in performance entries):** `https://yoga-directory-175304043411.us-central1.run.app/api/studio/{slug}/overrides` and `/api/reviews/{slug}`. That is a separate Google Cloud Run directory service. INFERRED: the studio HTML is pre-generated, and "overrides" (owner edits after claiming) and reviews are fetched live.
- **Data quality (VERIFIED):**
  - The same studio name appeared twice on the finder with slugs `…-ca` and `…-ca-2`.
  - A massage business appeared among Austin's top yoga studios.
  - INFERRED: the directory was seeded from an automated data source and enriched by crawling studio websites. This matches the "verified from their own site" wording.
- **Score algorithm:** UNKNOWN beyond the six published dimension names.

---

## 16. Newsletter / forms

| Form | Fields | Validation hints | Endpoint | Submitted? |
|---|---|---|---|---|
| Footer newsletter | email (`type=email`, required, `autocomplete=email`, `aria-label`) | Native HTML5 | `/api/newsletter` (name in `main.min.js`) | No |
| Newsletter modal | Same; appears after 35s, capped to once per 30 days, waits for consent; success text shown inline | Native | Same | No |
| Search modal | `q` | none | GET `/search` | Not submitted (visited a `/search?q=` URL directly) |
| Yoga Club invite | email (required), city | Native | JS-handled (no action) | No |
| For studios: lookup | studio | none | JS | No |
| For studios: add studio | studio_name, street, city, state, zip, phone (`tel`), website (`url`), name, role (select), email, message | Native types | JS | No |
| Studio finder | q | none | GET `/yoga-studios` + `/api/search` | No (typed only, no submit) |
| Sign in / Register | See section 11 | Native + minlength 8 | `/api/auth/*` | No |
| Personalized course | name (max 40) | maxlength | `/api/greeting` | No |
| Contact | **None**; email/phone only | – | – | – |

- **Missing:** No visible CAPTCHA or bot protection on any form. Server-side protection is UNKNOWN.
- **Newsletter provider:** SendGrid (from the privacy policy summary; INFERRED as the sending service).

---

## 17. Responsive / mobile observations (375px emulation, VERIFIED)

- The hero uses dedicated `-mobile.webp` crops. The H1 drops to 44.8px and the CTAs stack full-width.
- The primary nav is hidden, and account, search and burger icons remain (42–46px tap targets, which is good).
- **Bug:** The header's right-hand group extends to x=414 on a 375px screen, so **the burger and the menu's close "×" are partly cut off**. The browser widened the layout viewport to 414px.
- The mobile menu opens as a full-screen sage panel. The **dark logo is almost invisible** on the dark sage background (about 1.2:1).
- The pose grid shows 2 columns, and the filter popover works well.
- Carousels scroll horizontally (cards off-screen by design).
- No bottom tab bar.
- Studio "Find a studio" / "For studios" buttons are hidden on mobile and **absent from the mobile menu**.

---

## 18. Accessibility observations

**Good (VERIFIED):**
- `lang="en"` and a skip link.
- `header`, `main`, `footer` and `aside` landmarks; named navs ("Primary", "Mobile").
- Dialogs use `role=dialog`, `aria-modal` and labels.
- Search uses `role=search`. Icon buttons have `aria-label`s.
- Nearly all images have alt text (pose drawings: "Animated ink drawing of …"; decorative art has `alt=""`).
- The pose count uses `aria-live`. Filter chips use `aria-pressed`.
- A `:focus-visible` style exists, and so does `prefers-reduced-motion`.
- The 404 page has a proper status code.
- The accessibility statement targets WCAG 2.1 AA.

**Issues (VERIFIED):**
1. The burger is a `span role=button` without `aria-expanded`, and focus stays on the burger when the menu dialog opens (no focus move or trap observed).
2. The Filters button lacks `aria-expanded`.
3. The play badge on pose cards is a `span role=button tabindex=-1` inside a link, so animation is unreachable by keyboard.
4. A save `<button>` is nested inside a card `<a>` on studio cards (invalid; confusing for screen readers).
5. Breadcrumbs are not a navigation landmark. Pagination is not a `nav` with a label.
6. Heading order on the homepage goes h1 → h3 → h2. The course chapter H2 duplicates the H1.
7. Eyebrow text `#8a6f3c` on `#f7f4ef` = 4.33:1 (below 4.5:1 for small text).
8. At 375px the menu control is partly off-screen.
9. The cookie banner offers only "Got it", with no reject or settings option in the banner itself.
10. Studio placeholder images use `alt=""` while being labelled "Illustration" visually (acceptable). Emoji are used as icons in amenity lists; screen readers will read them aloud.

**Not tested / UNKNOWN:** Full keyboard pass through every page, screen reader output, zoom/reflow at 400%, video captions in the course app.

---

## 19. SEO observations

**Strengths (VERIFIED):**
- Unique titles with consistent suffixes and descriptive meta descriptions on content pages.
- Self-referencing canonicals, including on paginated pages.
- `robots` `max-image-preview:large, max-snippet:-1`.
- Full OG/Twitter tags; `article:published_time` / `modified_time`.
- Rich JSON-LD graph (`Organization` with `sameAs`, `WebSite` + SearchAction, `BlogPosting`, `MedicalWebPage` on poses, `BreadcrumbList`, `CollectionPage`, `ItemList`, `ProfilePage`, `LocalBusiness`/`HealthClub`, `Article`).
- Clean, keyword-rich URLs; strong internal linking (pillars, tags, related, prev/next, most-read).
- Author pages with bios; cited sources on articles.
- `llms.txt` present. robots.txt explicitly allows AI *search* bots and declares `ai-train=no` in Content-Signal.
- Custom 404 with a real 404 status.

**Gaps / risks (VERIFIED unless noted):**
- `/poses`, the whole studio directory, `/yoga-club`, `/for-studios` and `/course` are **missing from `sitemap.xml`**. Only 180 of 230 poses appear there.
- Studio profiles are `noindex`. INFERRED: intentional while data is unverified, but it leaves about 19k potential local landing pages out of search.
- `/search?q=` pages are indexable.
- Generic descriptions on pillars and tags ("Browse X articles…").
- A pose page's hero image may not depict the pose (content/SEO image relevance).
- Two pillars show off-topic cornerstones.
- `MedicalWebPage` markup without visible medical-reviewer credentials. INFERRED risk under Google's YMYL/E-E-A-T expectations.
- Separate "buying guide" pages use a different template and title suffix, and carry ads. INFERRED: a site-reputation or quality signal risk.
- Client-side (not 301) redirect for merged pose variants.

---

## 20. Performance observations

**Homepage, first load (VERIFIED):**
- HTTP/2 (h3 advertised via `alt-svc`) and brotli compression.
- 29 KB HTML over the wire, TTFB about 1.1s, DCL about 2.7s, load about 3.2s.
- 53 requests, about 2 MB of images, 5 small scripts; CSS is fully inline (about 96 KB of rules across 6 inline `<style>` blocks, no external CSS files).

**Poses index, repeat load (VERIFIED):** TTFB about 0.2s, load about 0.56s, 460 KB decoded HTML, lazy images.

**Good practices (VERIFIED):**
- Hero image preloaded, with a mobile variant and `fetchpriority`.
- 5 fonts preloaded as WOFF2.
- WebP everywhere with `srcset` size variants (small/medium/large).
- `loading="lazy"` below the fold; width/height set on many images.
- Long `cache-control` (7 days + 30 days stale-while-revalidate).
- Tiny JS budget on content pages.

**Costs (VERIFIED):**
- 12 font files in total are downloaded (Jakarta 400/500/600/700, Figtree 400/600/700/800, Merriweather, Fraunces, plus Google Fonts on studio pages).
- 4 hero slides are downloaded up front (desktop and mobile variants seen).
- The studio finder downloads a 587 KB JSON index plus Leaflet and OSM tiles.
- Third-party scripts: GA4 (two properties: `G-SC15WFTEQM`, `G-V9S8EVN89C`), Microsoft Clarity (session replay), and the Meta pixel + AdSense for Search on search/guide pages.
- `/cdn-cgi/trace` is requested and returns 404. INFERRED: a leftover Cloudflare geo-lookup call from the consent script, now failing because the site is not behind Cloudflare.
- Some image requests were aborted (`ERR_ABORTED`), which is normal when responsive images switch sources.

**Core Web Vitals (LCP/CLS/INP):** UNKNOWN. Not measured with field data; lab timings above only.

---

## 21. Technical-stack evidence

| Area | Finding | Level | Evidence |
|---|---|---|---|
| Hosting of HTML | Static objects in **Google Cloud Storage** behind a Google front end/CDN | VERIFIED | Response headers `x-goog-generation`, `x-goog-storage-class: STANDARD`, `x-goog-hash`, `server: UploadServer`, `via: 1.1 google`, `age: 5761` |
| Rendering | Pre-rendered static HTML (SSG) | INFERRED | Full content in the HTML, GCS object storage, `last-modified` set on the object, no hydration framework |
| Content-page JS | Vanilla JS: `main.min.js?v=1.0.5` (13 KB) + inline IIFEs | VERIFIED | Script sources; no `__NEXT_DATA__`, `__NUXT__`, React/Vue globals |
| CSS | Hand-written CSS inlined per page, custom properties, no utility framework | VERIFIED / INFERRED | 6 inline sheets; class names like `.pcard`, `.scard`, no Tailwind patterns |
| Auth app | React SPA built with a Vite-style bundler under `/auth/` | VERIFIED (React strings) / INFERRED (Vite) | `app-rMIBb7k4.js`, `createElement` |
| Same-domain APIs | `/api/auth/*`, `/api/newsletter`, `/api/search` | VERIFIED (names in public JS; only `/api/auth/config` observed being called) | Bundles |
| Directory API | Google **Cloud Run** service `yoga-directory-…us-central1.run.app` | VERIFIED | Performance entries on the studio page |
| Course app | Separate Cloud Run service (`yoga-course-demo-…-uc.a.run.app`) with its own vanilla `app.js` | VERIFIED | iframe src |
| Backend language / DB | UNKNOWN. ISO timestamps with milliseconds suggest a JavaScript/Node backend | INFERRED (weak) | `2025-11-15T21:12:49.629Z` format |
| Pose animation assets | GCS bucket `yoga-maison-…` | VERIFIED | Image URLs |
| Maps | Leaflet 1.9.4 (unpkg) + OpenStreetMap tiles | VERIFIED | Script + tile requests |
| Search | Google Programmable Search / AdSense for Search | VERIFIED | `adsense/search/ads.js`, `syndicatedsearch.goog`, "Powered by Google" |
| Analytics | GA4 x2, Microsoft Clarity, Meta pixel (search/guide pages) | VERIFIED | Scripts and cookies `_ga`, `_clck`, `_clsk`, `_fbp` |
| Email | SendGrid | INFERRED (privacy policy summary) | |
| Security headers | `x-content-type-options: nosniff`, `x-frame-options: SAMEORIGIN`; **no CSP or HSTS header seen** on the HEAD response; `access-control-allow-origin: *` on HTML | VERIFIED | Headers |
| Anti-framing script | Inline check `window.top !== window.self` with an allow-list | VERIFIED | Inline script start |
| Consent | Custom geo-aware banner (`.geo-consent`); analytics cookies present before any consent click | VERIFIED (cookies present without clicking) | `document.cookie` names |

---

## 22. VERIFIED / INFERRED / UNKNOWN findings table

| # | Finding | Level |
|---|---|---|
| 1 | robots.txt allows all except `/api/`, `/lib/`, `/pixel/`; Content-Signal `ai-train=no` | VERIFIED |
| 2 | Sitemap has 465 URLs; excludes /poses, studio directory, Club, course | VERIFIED |
| 3 | HTML served from Google Cloud Storage via Google front end, 7-day cache | VERIFIED |
| 4 | Site is statically pre-generated | INFERRED |
| 5 | Content pages use vanilla JS only | VERIFIED |
| 6 | Auth UI is React; bundler is Vite | VERIFIED / INFERRED |
| 7 | Auth endpoints `/api/auth/{config,me,login,register,resend-verification,google}` | VERIFIED (names) |
| 8 | Google sign-in offered | VERIFIED |
| 9 | No forgot-password link | VERIFIED |
| 10 | Password hashing, sessions, rate limits | UNKNOWN |
| 11 | Studio directory API on Cloud Run (overrides, reviews) | VERIFIED |
| 12 | Studio pages are `noindex` | VERIFIED |
| 13 | About 19k studios across 50 states + DC | VERIFIED (sum of listed counts, approximate) |
| 14 | Studio data seeded automatically and enriched from studio websites | INFERRED |
| 15 | Studio Score algorithm (weights) | UNKNOWN |
| 16 | Pose library: 230 poses, 9 categories, 3 levels, client-side filtering | VERIFIED |
| 17 | Pose left variants can redirect to right variants | VERIFIED (1 case) |
| 18 | Pose drawings stored on a GCS bucket | VERIFIED |
| 19 | Article images in 3 sizes `/media/{uuid}_{size}.webp` | VERIFIED |
| 20 | CMS product | UNKNOWN (custom INFERRED) |
| 21 | Database engine | UNKNOWN |
| 22 | Global search is Google-powered with AdSense for Search | VERIFIED |
| 23 | Search pages indexable | VERIFIED |
| 24 | Newsletter posts to `/api/newsletter`; provider SendGrid | VERIFIED (name) / INFERRED (provider) |
| 25 | Newsletter modal: 35s delay, 30-day cap, waits for consent | VERIFIED (data attributes) |
| 26 | Analytics cookies set before consent interaction | VERIFIED |
| 27 | Privacy policy says ads not active, but ad scripts load on search | VERIFIED observation; policy text via WebFetch summary |
| 28 | Personalized course generates a greeting from the user's name | VERIFIED UI / INFERRED mechanism |
| 29 | "Maya" / practice log member features | UNKNOWN |
| 30 | Mobile header overflows at 375px | VERIFIED |
| 31 | Mobile menu lacks studio links | VERIFIED |
| 32 | Eyebrow contrast 4.33:1 | VERIFIED |
| 33 | No CSP / HSTS header observed | VERIFIED (on one HEAD response) |
| 34 | `/cdn-cgi/trace` 404 (Cloudflare leftover) | VERIFIED 404 / INFERRED cause |
| 35 | Operator: Inter Media Digital Marketing LLC, Dubai | VERIFIED (policies, footer) |
| 36 | Content produced in batches with rotating authors | INFERRED |
| 37 | Core Web Vitals field data | UNKNOWN |
| 38 | Traffic, revenue, user counts | UNKNOWN |

---

## 23. Features we would need to build for our own website (prioritized)

All content, illustrations, photos, names, copy and the logo must be **our own** (or properly licensed). The items below describe *functional* patterns, which are common across the web and not owned by yoga.com.

### MVP (Phase 1: a solid, launchable site)
1. **Design system:** our own palette, type pairing and tokens (colors, spacing, radius, shadow). Responsive layout that works at 375px with no overflow (learn from their header bug).
2. **Global layout:** header with a real `<button>` menu toggle (`aria-expanded`, focus moves into the menu), footer, skip link, breadcrumbs as `<nav aria-label="Breadcrumb">`, 404 page.
3. **Pose library:**
   - Pose data model, index page with search/filter/sort **that updates the URL** (shareable), pose detail template (at-a-glance, steps, benefits, mistakes, modifications, cautions, related).
   - Start with about 30–50 poses and original illustrations (commissioned or self-drawn) or licensed photos.
4. **Articles and categories:** Markdown/MDX articles with categories (our own pillars), tags, author, dates, table of contents, sources section, related posts, pagination.
5. **Basic SEO:** titles, descriptions, canonicals, OG images, JSON-LD (`Article`, `BreadcrumbList`, `Organization`, `WebSite`), a complete auto-generated `sitemap.xml`, `robots.txt`, `noindex` on search results.
6. **Site search:** simple built-in search over our own content (for example Pagefind for a static site). This avoids ad-driven third-party search.
7. **Newsletter signup:**
   - Collects only an email.
   - Uses double opt-in through an email provider.
   - Has honest privacy text and a honeypot field or rate limit to stop bots.
8. **Legal and trust pages:** About, Contact (form with spam protection, or email), Privacy, Terms, Health & Safety disclaimer, Accessibility statement, editorial policy.
9. **Consent:** a cookie banner with **Accept and Reject** options. Analytics load only after consent, or use a cookieless analytics tool.
10. **Accessibility baseline:** WCAG 2.1 AA contrast (check small labels), keyboard access for all controls, `prefers-reduced-motion`.

### Phase 2 (accounts and practice)
11. Accounts via a proven auth library: email + password **with forgot-password**, email verification, optional Google sign-in.
12. Favorites/bookmarks for poses and articles, and a practice log.
13. Structured **sequences** built from poses (ordered list with hold times, printable, "start practice" timer mode). This improves on the reference site.
14. Multi-chapter courses with progress tracking for signed-in users.

### Phase 3 (larger, only if needed)
15. Studio directory: studio model, state/city pages, map (with a tile provider whose terms fit production use), geolocation search, claim-your-listing flow, reviews with moderation. This needs a real data source and legal review. **Do not scrape or copy yoga.com's studio data.**
16. Admin/CMS for non-developers.
17. Pose step animations.
18. Membership/payments (Stripe) — only with clear business and legal planning.

---

## 24. Recommended architecture for an ORIGINAL implementation (plain-language)

**The idea in one sentence:** Build a fast website whose pages are mostly prepared ahead of time (like printing brochures), and add a small server and database only for the parts that must change per user (accounts, favorites, newsletter).

### 24.1 Recommended stack (beginner-friendly, current mainstream)
- **Framework: Next.js (React, TypeScript) with the App Router.**
  - It can pre-build content pages (fast, cheap, SEO-friendly, which is what yoga.com gets from static files) *and* run server code for logins and forms in the same project.
  - Beginner alternative: **Astro**, which is simpler for a content-only site but a little more work once accounts arrive.
  - Exact current versions will be checked in official docs at planning time.
- **Content (poses, articles, courses): Markdown/MDX files in the repo** at first. They are free, version-controlled with Git and easy to learn.
  - Later, if non-developers need to edit, add a headless CMS such as Sanity, Contentful, Payload or Decap. That decision can wait.
- **Database: PostgreSQL** (hosted, e.g. Neon or Supabase free tier), with the **Prisma** or **Drizzle** ORM. The ORM uses safe parameterized queries by default. The database is needed only for users, favorites, practice logs, newsletter and, later, studios.
- **Auth: Auth.js (NextAuth) or Better Auth.** Both are well-known libraries that handle password hashing, sessions, email verification, password reset and Google sign-in. Never hand-roll auth.
- **Search:** Pagefind (static search index built at deploy time, no server cost) or a simple database full-text search. Pose filtering stays client-side like theirs, but the filters are stored in the URL.
- **Styling:** Plain CSS with custom properties (like theirs) or Tailwind CSS. For a beginner, CSS Modules plus a `tokens.css` file keeps things understandable.
- **Images:** The framework's image component (`next/image`) automatically generates WebP/AVIF sizes and lazy-loads. This is what yoga.com does by hand with `_small/_medium/_large`.
- **Email:** Resend, Postmark or SendGrid for verification emails and the newsletter (double opt-in).
- **Hosting:**
  - Vercel (simplest for Next.js) or Netlify; a static Astro site can also go on Cloudflare Pages.
  - Environment variables for all secrets (`.env` is git-ignored, and `.env.example` holds placeholders).
- **Analytics:** Privacy-friendly and cookieless (Plausible or Umami), or GA4 loaded **only after consent**.

### 24.2 Conceptual data models

```
Pose        id, slug, englishName, sanskritName, category, level, targets[], goodFor[],
            steps[], benefits[], mistakes[{mistake, cue}], modifications[], cautions[],
            relatedPoses[{poseId, relation: preparation|progression|counter|similar}],
            image, illustration, tags[], author, publishedAt, updatedAt
Sequence    id, slug, title, level, durationMin, goal, items[{poseId, holdSeconds|breaths, note}]
Article     id, slug, title, dek, body(MDX), categoryId, tags[], authorId, heroImage,
            sources[{title, url}], publishedAt, updatedAt, readTime
Category    id, slug, name, intro, cornerstoneArticleId
Tag         id, slug, name
Author      id, slug, name, bio, credentials, avatar, links[]
Course      id, slug, title, description, chapters[{order, articleId}]
User        id, email, name, passwordHash (via auth library), emailVerified, createdAt
Favorite    userId, itemType (pose|article|sequence), itemId, createdAt
PracticeLog userId, date, sequenceId?, minutes, note
CourseProgress userId, courseId, completedChapters[]
Subscriber  email, status (pending|confirmed|unsubscribed), confirmedAt, source
(Later) Studio  id, slug, name, address, city, state, lat, lng, styles[], prices[], amenities[],
                website, verified, claimedByUserId, score?  +  Review, Claim
```

In the MVP, content models (Pose, Article…) live in files. User-related models live in Postgres.

### 24.3 Routes (our own naming)

```
/                       Home
/poses                  Library with ?q=&level=&category=&sort= in the URL
/poses/[slug]           Pose detail
/sequences, /sequences/[slug]
/learn/[category]       Category hub          /learn/[category]/[slug]  Article
/tags/[tag]             Tag archive           /authors/[slug]
/courses/[slug]         Course hub            /courses/[slug]/[chapter]
/search                 (noindex)
/account/login, /account/register, /account/forgot-password, /account (favorites, log)
/about /contact /privacy /terms /disclaimer /accessibility /editorial-policy
/api/newsletter         POST (validated, rate-limited)
/api/favorites          GET/POST/DELETE (auth required)
sitemap.xml, robots.txt (generated)
```

### 24.4 Security basics we will apply
- Server-side validation of every form (e.g. with Zod).
- Parameterized queries via the ORM.
- Hashed passwords handled by the auth library; secure, HttpOnly, SameSite cookies.
- CSRF protection (built into the auth library and form actions).
- Rate limiting on login and newsletter.
- Security headers: Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy (yoga.com lacked CSP and HSTS on the response checked).
- Secrets only in environment variables.
- `npm audit` in the routine.

### 24.5 Originality rules for our build
- Our own brand name, logo, colors and wording. Do not reuse yoga.com's slogans, pillar names, section names ("The Groundwork", "Begin gently", etc.), quotes selection, or illustrations or photos.
- Write our own pose instructions from reputable references, cite our sources, and ideally have a qualified yoga teacher review them.
- Use our own or properly licensed images. Placeholder illustrations are fine during development.

---

## 25. Questions that still cannot be answered from public access

1. Which CMS or generator builds the static pages, and how editors publish? (Custom is INFERRED.)
2. What backend language, framework and database power `/api/*` and the Cloud Run services?
3. How are passwords hashed and sessions managed? Is there rate limiting, CSRF protection or MFA?
4. What do signed-in members actually get ("practice log", "Maya", course library, progress)?
5. How exactly is the Studio Score calculated (weights, data sources, update frequency)?
6. Where did the ~19k studio records come from, and how often are they re-verified?
7. How are Yoga Club payments, QR check-ins and studio payouts implemented, and is the Club live anywhere?
8. How is the personalized course greeting generated (voice/video model, vendor, cost, data retention of names)?
9. What does the newsletter pipeline look like (list provider, double opt-in, frequency)?
10. How much content is AI-assisted versus human-written, and is there medical review?
11. Real traffic, Core Web Vitals field data, search rankings and revenue.
12. Why studio pages are `noindex` and why the directory is missing from the sitemap (intentional strategy or oversight).
13. What the "buying guide" pages' role is in the business, and whether search-ad monetization is intended long term.
14. Server security configuration beyond the response headers observed (WAF, DDoS protection, backups).

---

## Appendix A: URLs actually visited (2026-09-30)

Browser (rendered and inspected):
1. https://yoga.com/ (desktop 1024/1280px and mobile 375px)
2. https://yoga.com/yoga-club
3. https://yoga.com/yoga-basics
4. https://yoga.com/poses (desktop and 375px; typed "cobra" into the on-page filter; opened the Filters popover)
5. https://yoga.com/pose/cobra-pose
6. https://yoga.com/pose/bikram-triangle-left → redirected to https://yoga.com/pose/bikram-triangle-right
7. https://yoga.com/articles
8. https://yoga.com/articles/page/2
9. https://yoga.com/yoga-basics/what-is-yoga-beginners-guide
10. https://yoga.com/practice-sequences
11. https://yoga.com/practice-sequences/yoga-warm-up-how-to-prepare-the-body-before-you-practice
12. https://yoga.com/yoga-styles
13. https://yoga.com/tag/beginners
14. https://yoga.com/author/hannah-cole
15. https://yoga.com/course
16. https://yoga-course-demo-bjpl673azq-uc.a.run.app/ (linked from /course; viewed only, no name entered)
17. https://yoga.com/yoga-studios (typed "Austin" in the search field without submitting)
18. https://yoga.com/yoga-studios/tx
19. https://yoga.com/yoga-studios/tx/austin
20. https://yoga.com/studio/charles-macinerney-austin-tx (a sample studio profile; public business listing)
21. https://yoga.com/for-studios
22. https://yoga.com/search?q=breath (visited by URL; no form submitted)
23. https://yoga.com/a-guide-to-breath-retention-exercise-tools-what-they-are-and-how-to-choose-one
24. https://yoga.com/auth?next=%2F
25. https://yoga.com/auth/register
26. https://yoga.com/about
27. https://yoga.com/contact
28. https://yoga.com/this-page-does-not-exist-xyz123 (404 test)
29. https://yoga.com/pranayama-breathing-guide
30. https://yoga.com/pranayama-diaphragmatic-breathing-for-beginners
31. https://yoga.com/yoga-terms-plain-english

WebFetch (raw fetch, summarized):

32. https://yoga.com/robots.txt
33. https://yoga.com/sitemap.xml (also counted in-page)
34. https://yoga.com/llms.txt
35. https://yoga.com/privacy-policy
36. https://yoga.com/how-we-create-our-content
37. https://yoga.com/accessibility
38. https://yoga.com/terms

Public static assets read (same files the browser downloads; read-only, for endpoint names and framework hints only):
- https://yoga.com/assets/compiled/main.min.js?v=1.0.5
- https://yoga.com/dir.js
- https://yoga.com/auth/assets/app-rMIBb7k4.js
- https://yoga-course-demo-bjpl673azq-uc.a.run.app/app.js
- One HEAD request to https://yoga.com/ and one to the 404 URL (response headers/status only)

**Not visited** (seen as links or in the sitemap only):
- The other 9 pillar hubs; `/article/*`; `/authors`
- `/yoga-for-sleep` and its chapters; `/first-year-yoga-poses`; `/home-yoga-practice-setup`; `/yoga-for-kids`; `/baby-yoga`
- `/claim`; `/cookie-policy`; `/advertising-disclosure`; `/health-safety-disclaimer`; `/consumer-health-data-privacy-policy`

**Never called directly:** Any `/api/*` endpoint on yoga.com or the Cloud Run services. The only API traffic observed was made by the pages themselves.
