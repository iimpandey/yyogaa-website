# YYOGAA — Current Site Audit

- **Scope:** Read-only audit of the repository at `C:\Users\hp\OneDrive\Documents\GitHub\yyogaa-website` (branch `main`, 53 commits, HEAD `78077ac`).
- **Date of audit:** 2026-09-30
- **Method:** Every tracked file was read in full. Links and asset references were checked against the file list. Git history was inspected with read-only commands. Nothing was run in a browser; runtime behaviour is reasoned from source.
- **Evidence tags:** **VERIFIED** means seen directly in a file (cited as `file:line`). **INFERRED** means reasoned from evidence (the evidence is stated). **UNKNOWN** means it cannot be determined from the repository.

---

## 1. Folder and file structure

```
yyogaa-website/                         (git repo, remote: github.com/iimpandey/yyogaa-website)
├── .claude/                            (UNTRACKED; not part of the website)
│   └── agents/senior-fullstack-engineer.md   15,637 B
├── .git/
├── README.md                              47 B
├── index.html                         16,021 B
├── yoga.html                           8,867 B
├── breathwork.html                     8,958 B
├── meditation.html                     9,076 B
├── sound.html                          9,107 B
├── journal.html                        9,049 B
├── about.html                          7,181 B
├── contact.html                        7,379 B
├── thank-you.html                      2,646 B
├── style.css                          24,412 B   (single stylesheet for all pages)
├── script.js                           1,716 B   (single script for all pages)
└── docs/research/yyogaa-current-site-audit.md   (this report; the only file added)
```

- The site is a flat folder of 12 tracked files (`git ls-files`). There are no subfolders, no local images, fonts or icons, and no `assets/` folder. **VERIFIED**
- The repo contains **none** of these files: `CNAME`, `netlify.toml`, `vercel.json`, `_redirects`, `_headers`, `.github/workflows`, `robots.txt`, `sitemap.xml`, `manifest.json`/`site.webmanifest`, `favicon.*`, `package.json`, `.gitignore`, `404.html`, `.env*`. **VERIFIED** (directory listing)
- `README.md` holds two lines: the heading "yyogaa-website" and "Official website for Yyogaa". **VERIFIED** (`README.md:1-2`)

### Git history context
- There are 53 commits by `iimpandey`. The committer on every commit is "GitHub". The first commit is `2026-09-29 22:15 +0530` ("Initial commit") and the last is `2026-09-30 01:39 +0530` ("Update script.js"). **VERIFIED**
- Every message is a GitHub default ("Create X.html" / "Update X.html"), and the committer is "GitHub". **INFERRED:** the whole site was written or pasted through the GitHub web editor over about 3.5 hours, one file at a time, without a local build step.
- The last 8 commits (01:09 to 01:39) created `thank-you.html`, made repeated changes to `contact.html` and added the form logic to `script.js`. **INFERRED:** the contact form and its redirect were the most recent and least-settled work.

---

## 2. Every existing page

| File | `<title>` | Meta description | Hero type | Exists? |
|---|---|---|---|---|
| index.html | "Yyogaa — Move. Breathe. Return." (`:7`) | yes (`:9-12`) | Split dark hero + image + 3 floating story cards | yes |
| yoga.html | "Yoga — Yyogaa" (`:7`) | yes | `.inner-hero` photo + gradient overlay | yes |
| breathwork.html | "Breathwork — Yyogaa" | yes | `.inner-hero` | yes |
| meditation.html | "Meditation — Yyogaa" | yes | `.inner-hero` | yes |
| sound.html | "Sound — Yyogaa" | yes | `.inner-hero` | yes |
| journal.html | "Journal — Yyogaa" | yes | Dark text-only hero | yes |
| about.html | "About — Yyogaa" | yes | Dark split hero (text + rounded image) | yes |
| contact.html | "Contact — Yyogaa" | yes | Dark split hero | yes |
| thank-you.html | "Thank You — Yyogaa" (`:7`) | **no** | `.final-cta` reused, inline `style="min-height: 75vh;"` (`:61`) | yes |

- All 9 requested pages exist. No other pages exist: there are no article pages, no 404 page and no legal or privacy page. **VERIFIED**

---

## 3. Navigation between pages

### Shared navigation blocks (all pages)
- **Header logo** "YYOGAA" links to `index.html`.
- **Desktop nav:** Yoga, Breath, Meditation, Sound, Journal, About.
- **Header right:** "Explore" goes to `index.html#explore` (missing on thank-you), and "Contact" goes to `contact.html`.
- **Footer:** Yoga, Breath, Meditation, Sound, Journal, About, Contact, plus the logo linking to index.

### Link matrix (outgoing links in page body, excluding header and footer)

| From \ To | index | yoga | breath | medit. | sound | journal | about | contact | thank-you |
|---|---|---|---|---|---|---|---|---|---|
| index | – | many | many | many | 2 | 4 | 1 | 1 | – |
| yoga | – | #practice | – | – | – | – | – | **8** (all "Explore →" + CTAs) | – |
| breathwork | – | – | #practice | – | – | – | – | **8** | – |
| meditation | – | – | – | #practice | – | – | – | **8** | – |
| sound | – | – | – | – | #practice | – | – | **8** | – |
| journal | – | 5 | 2 | 5 | 3 | – | 2 | – | – |
| about | – | 2 | 1 | 1 | 1 | – | – | 1 | – |
| contact | – | 2 | 1 | 1 | 1 | – | – | – | JS / `_next` redirect only |
| thank-you | 1 | – | – | – | – | – | – | – | – |

- **Broken links: none.** Every `href` points to one of the 9 existing lowercase filenames, and the filenames on disk match exactly (safe on case-sensitive hosts). The anchors `#explore` (`index.html:638`) and `#practice` (`yoga/breathwork/meditation/sound.html:107-108`, `index.html:531`) exist. **VERIFIED**
- **Unused anchors:** `index.html#journal` (`:190`) and `#start` (`:676`) are never linked. **VERIFIED**
- **Placeholder / misleading links:**
  - On all 4 practice pages, each of the 6 "Explore →" card links and each "Begin Practice" / "Start …" CTA goes to `contact.html`, not to any practice content (e.g. `yoga.html:134,153,172,191,210,229,267,345`). **VERIFIED**
  - Journal "article" titles have no article pages. The Most-read list and article cards link back to category pages (e.g. `journal.html:147,272-294`; `index.html:322-345`). **VERIFIED**
  - On the homepage, the 4 journal `story-card`s, the 4 `editor-card`s and the 3 `hero-story` cards are **not links at all** (`index.html:119-164, 216-309, 451-520`). **VERIFIED**
- **No "current page" indicator:** no `aria-current` and no active class in any nav. **VERIFIED**
- **thank-you.html** is reachable only after a form submission. Nothing links to it. **VERIFIED**

---

## 4. Homepage (index.html), section by section

1. **Header** (`:27-63`): sticky cream bar with the wordmark, 6 nav links, the "Explore" pill (outline), the "Contact" pill (charcoal) and a hamburger button. The mobile menu `div` holds 7 links.
2. **Hero** (`:70-168`): 43/57 grid. The left side is charcoal with the eyebrow "MOVE · BREATHE · RETURN", the H1 "Breathe *easy.*" (with "easy." in gold Playfair italic), a description and two buttons: "Start practicing" (gold, goes to yoga) and "Explore Yyogaa" (outline, goes to about). The right side is a full-height Unsplash image (w=1400, q=90). Along the bottom edge is a strip of 3 floating dark glass cards (Beginner yoga 8 min / Breath 5 min / Meditation 6 min). The cards are not links.
3. **Quote** (`:173-185`): a large gold quote mark, then an italic Playfair H2: "The body opens through movement, and the mind settles through breath." It is signed "YYOGAA".
4. **Journal** (`#journal`, `:190-379`): header "LATEST FROM THE JOURNAL / Practice. Learn. Grow." with a "View all articles →" link to journal.html. It holds a 2×2 grid of story cards (image, category, title, excerpt, read time) that are not clickable, and a sidebar with "MOST READ" (5 numbered links) and "EXPLORE YYOGAA" (8 topic links).
5. **Featured practice** (`:384-425`): a bordered card with a large image and "Your First 20-Minute Yoga Practice". The "Start the practice" button goes to yoga.html.
6. **Editor's Picks** (`:430-526`): a centered heading and a 4-column grid of cards (Rest, Breath, Movement, Meditation). The cards are not clickable.
7. **The Yyogaa Foundation** (`#practice`, `:531-633`): a sand-coloured section with a 2×2 grid of photo cards. Each card is a link with a gradient overlay, a number 01–04, a title and a CTA (yoga, breathwork, meditation, sound). On hover the image zooms.
8. **Explore Yyogaa** (`#explore`, `:638-671`): a 3×3 grid of text tiles (Beginner Yoga, Flexibility, Strength, Breathwork, Meditation, Sound, Sleep, Lifestyle, Philosophy). On hover a tile inverts to charcoal and lifts 2px.
9. **Final CTA** (`#start`, `:676-701`): full-bleed photo with a dark overlay (set as a CSS background at `style.css:933-936`), "Your practice starts here." and a "Join Yyogaa" button that goes to contact.html.
10. **Footer** (`:706-742`): charcoal-black with the wordmark, the tagline "Move · Breathe · Return", 7 links and "© 2026 YYOGAA".

---

## 5–8. Practice pages (Yoga, Breathwork, Meditation, Sound)

All four pages use **the same template** (same section classes, prefixed `yoga-*` even on non-yoga pages). **VERIFIED**

| Section | Yoga | Breathwork | Meditation | Sound |
|---|---|---|---|---|
| Hero kicker / H1 | YYOGAA PRACTICE / "Move with *intention.*" | YYOGAA BREATH / "Breathe with *awareness.*" | YYOGAA MEDITATION / "Return to *stillness.*" | YYOGAA SOUND / "Listen *deeply.*" |
| Hero CTA | Explore Yoga → `#practice` | Explore Breathwork → `#practice` | Explore Meditation → `#practice` | Explore Sound → `#practice` |
| Intro (2-col) | "Yoga doesn't have to be complicated." | "The breath is always with you." | "Meditation is not about stopping your thoughts." | "Sometimes listening is the practice." |
| 6 category cards | Beginner, Morning, Flexibility, Strength, Mobility, Restorative | Calm, Focus, Energy, Sleep, Recovery, Breath Awareness | Beginner, Calm, Focus, Sleep, Walking, Body Awareness | Sound Baths, Singing Bowls, Sound Meditation, Restorative Listening, Nature & Sound, Yoga + Sound |
| Featured "START HERE" | "Your first 20-minute practice." | "A 5-minute breathing reset." | "A 5-minute meditation for presence." | "A simple sound meditation." |
| 4 principles | Move slowly / Breathe deeply / Listen inward / Stay consistent | Notice first / Stay gentle / Follow your body / Practice often | Start small / Notice / Return gently / Practice consistently | Get comfortable / Notice sound / Stay curious / Rest afterward |
| Final CTA | "Meet yourself on the mat." | "Come back to your breath." | "Nothing to chase. Nowhere to go." | "Let sound create space." |

- Hero backgrounds are set in CSS per page: `.yoga-page-hero` (`style.css:14-18`), `.breath-page-hero` (`:1146-1150`), `.meditation-page-hero` (`:1155-1159`) and `.sound-page-hero` (`:1164-1168`). A 90° dark gradient overlay keeps the text readable (`:20-31`). **VERIFIED**
- **No actual practice content exists.** There are no videos, audio, timers or step-by-step sequences. Every card and CTA goes to contact.html. **VERIFIED**
- **None of these four pages has the mobile menu button or mobile menu markup** (`yoga.html:41-44`, `breathwork.html:41-44`, `meditation.html:41-44`, `sound.html:41-44`). See Bugs. **VERIFIED**
- Breathwork includes a responsible safety line: "Stop or return to normal breathing if a practice feels uncomfortable." (`breathwork.html:297`). **VERIFIED**

## 9. Journal page (journal.html)
- **Hero:** dark, text-only, "Learn. *Practice.* Return." (`:51-70`).
- **Featured:** "Beginner Yoga: Where Do You Actually Start?" with an "Explore Yoga" button (to yoga.html).
- **"From the Journal":** 6 story cards with an image, category, title, excerpt and an "Explore X →" link to the category page. The Most-read sidebar has 5 links and the Topics sidebar has 7.
- **Final CTA:** "Practice begins with curiosity." with a button to about.html.
- There are no articles, dates, authors or pagination. The journal is a **mock-up of a blog index**. **VERIFIED**
- Mobile menu missing (`:41-44`). **VERIFIED**

## 10. About page (about.html)
- **Hero:** "A simpler way to *practice.*", a description and "Explore Yoga", with a rounded image.
- **Story:** "Start where you are." with 3 paragraphs about approachability.
- **Values:** 4 principles (Accessibility, Awareness, Consistency, Curiosity), reusing `.principles-grid`.
- **Pillars:** "Four ways to return." reuses `.foundation-grid`.
- **CTA:** "Your practice. Your pace." with a button to contact.
- There is no founder, team, credentials or location information. **VERIFIED**
- A styling selector misses: `.about-hero-grid > div:first-child > p:last-child` (`style.css:1276`) expects the paragraph to be the last child, but on about.html an `<a>` button follows it (`about.html:64-71`). The hero paragraph therefore gets no top margin, no muted colour and no max-width, and the button sits directly against the text with no gap. **VERIFIED** (selector vs markup). The visual effect is **INFERRED**.
- Mobile menu missing (`:41-44`). **VERIFIED**

## 11. Contact page (contact.html)
- **Hero:** "Let's *connect.*" with an image.
- **Contact info:** email `hello@yyogaa.com` as a `mailto:` link (`:125`). Instagram, Classes and Location all read "Coming soon".
- **Form card:** see §13.
- **"Where would you like to begin?"** 4 tiles linking to the practice pages.
- **Final CTA:** "Start where you are." with a button to yoga.
- The form markup has inconsistent indentation, a leftover from the web-editor edits (`:152-220`). This is cosmetic only. **VERIFIED**

## 12. Thank-you page (thank-you.html)
- It reuses `.final-cta` with an inline min-height: "Your message has been sent.", followed by a "Return Home" button.
- It has no meta description, no `noindex`, and no "Explore" pill in the header (`:36-44`). It **does** include the mobile menu. Its only heading is an `<h2>`, so the page has no `<h1>`. **VERIFIED**

---

## 13. Contact form behaviour

| Aspect | Current state | Tag |
|---|---|---|
| Endpoint | `action="https://formspree.io/f/mgavdlkl"`, `method="POST"` | VERIFIED `contact.html:152-156` |
| Service | Formspree (third-party form backend) | VERIFIED (URL) |
| Fields | `name` (text, required), `email` (type=email, required), `interest` (select: Yoga/Breathwork/Meditation/Sound/Collaboration/Other; default "Yoga", not required), `message` (textarea rows=6, required) | VERIFIED `:163-208` |
| Labels | All 4 fields have a `<label for>` that matches the input `id` | VERIFIED |
| Hidden fields | `_next` = `https://yyogaa-website.vercel.app/thank-you.html` (`:157-161`); `_subject` = "New Yyogaa Website Message" (`:210-214`) | VERIFIED |
| Validation | HTML5 only (`required`, `type=email`). No length limits, no custom messages. The browser blocks submission before the JS `submit` handler runs. | VERIFIED markup; blocking order INFERRED (standard browser behaviour) |
| Submission with JS | `script.js:23-64`: `preventDefault()`; the button is disabled and reads "Sending..."; `fetch(form.action, {POST, FormData, Accept: application/json})`. On `response.ok` the page goes to the **hard-coded absolute URL** `https://yyogaa-website.vercel.app/thank-you.html` (`script.js:45-46`). On failure or network error it shows `alert()` and the button is restored. | VERIFIED |
| Submission without JS | A normal HTML POST to Formspree. What happens next depends on Formspree: it may honour `_next`, show its own confirmation page and/or a CAPTCHA step. | INFERRED. Whether `_next` works on this account's plan is **UNKNOWN** (Formspree plan settings are not in the repo) |
| Spam protection | No honeypot field (e.g. Formspree's `_gotcha`), no CAPTCHA widget, no JS time-trap in the repo. Any Formspree-side filtering is set in the Formspree dashboard. | VERIFIED absence in repo; server-side filtering UNKNOWN |
| Accessibility of feedback | Errors appear only in `alert()`. There is no inline or `aria-live` status. | VERIFIED |
| Redirect robustness | Because the thank-you URL is absolute, a submission from localhost, a preview deploy or a future custom domain always sends the user to the production Vercel domain. | VERIFIED (code); impact INFERRED |

---

## 14. JavaScript functionality (script.js, 65 lines, loaded at the end of `<body>` on every page)

1. **Mobile menu toggle** (`:5-13`): finds `.mobile-menu-button` and `.mobile-menu`. If both exist, a click toggles the `open` class on both. CSS turns the hamburger into an X (`style.css:1574-1584`) and shows the menu (`:1570-1572`).
   - It is null-guarded, so pages without the button throw **no errors**. **VERIFIED**
   - It does not update `aria-expanded`, does not change the `aria-label` ("Open menu" stays the same), has no Escape-to-close, does not close on link click or outside click, and does not move focus. **VERIFIED**
   - If the menu is opened on a narrow screen and the window is then widened past 950px, `.mobile-menu.open` stays visible on desktop, because no rule hides it above 950px. **INFERRED** from CSS.
2. **Contact form AJAX submit** (`:20-65`): described in §13. It is null-guarded by `if (contactForm)`. **VERIFIED**
   - The success check only looks at `response.ok`. It does not read Formspree's JSON `errors`, which is fine functionally. **VERIFIED**
   - The restored button text "Send Message" is duplicated as a string literal and matches the markup. **VERIFIED**
- The code uses no frameworks, no modules and no `defer` (the script sits at the end of the body, so the effect is similar). **VERIFIED**

---

## 15. CSS / design system (style.css, 1,598 lines, one file)

### Colour tokens (`:root`, `style.css:232-241`), VERIFIED
| Token | Hex | Used? |
|---|---|---|
| `--cream` | `#f5f1e7` | yes (body background, cards, inputs) |
| `--cream-dark` | `#e8e0cf` | **unused** |
| `--charcoal` | `#1d1d19` | yes (text, dark heroes, primary pill) |
| `--charcoal-soft` | `#292823` | **unused** |
| `--gold` | `#baa060` | yes (accents, kickers, primary buttons) |
| `--sand` | `#d4cab4` | **unused** |
| `--line` | `#ddd5c6` | yes (borders, dividers) |
| `--text-soft` | `#68645c` | yes (body copy on light backgrounds) |

**Hard-coded colours outside tokens (VERIFIED):**
- Section backgrounds: `#f8f5ee`, `#f9f6ef`, `#fbf8f2`, `#f7f4ed`, `#faf7ef`, and sand `#d8cfbc` (note: not `--sand`).
- Footer: `#171713`.
- Gold/brown text variants: `#7c6735`, `#856f3e`, `#837452`, `#7b6d4b`, `#917941`, `#867a65`, `#9c8248`, `#8b7546`, `#806b3c`.
- Muted text: `#5e594f`, `#615d54`, `#5f5a50`.
- Overlays: `rgba(24,23,19,…)`, `rgba(25,24,20,.78)`, `rgba(19,18,15,.8)`.

In short, the palette is **consistent in feel but not tokenised**: about 15 near-duplicate hex values.

### Typography
- **Loading:** Google Fonts CSS2 with `display=swap` and preconnect to both font origins, placed in each page `<head>` (e.g. `index.html:14-20`). **VERIFIED**
- **Families:** **DM Sans** 400/500/600/700 (body and all headings) and **Playfair Display** italic 500/600 (accent words, the quote). **VERIFIED**
- **Fallbacks:** `sans-serif` and `serif`. **VERIFIED**
- **Headings:** default browser weight (bold, 700). **VERIFIED**
- **Quote H2:** asks for italic Playfair at bold (700), but only 500/600 are loaded, so the browser uses 600 (or synthesises). **INFERRED**
- **Type scale (VERIFIED):**
  - Kickers/eyebrows 0.7rem, 700, letter-spacing .2em, uppercase in the copy
  - Nav 0.79rem uppercase .06em
  - Buttons 0.8rem uppercase 700 .06em
  - Body 1rem; lead paragraphs 1.05rem
  - Card H3 1.35rem (cards), 1.7rem (category cards), 1.8rem (foundation)
  - Section H2 `clamp(2.5rem,4vw,4rem)`, with variants up to 4.8rem
  - Hero H1 `clamp(4.6rem,7vw,7.5rem)` with line-height .88
- **Signature pattern:** a bold sans H1 with one italic gold Playfair word on its own line. **VERIFIED**

### Spacing and layout (VERIFIED)
- Container: `.page-width { width: min(1180px, 90%) }`.
- `.section` padding: 105px, or 72px at 650px and below.
- Grid gaps: 12–90px.
- There is no spacing scale or tokens.

### Components (VERIFIED)
- **Buttons:** `.button` is a pill (radius 40px, min-height 48px). Variants:
  - `.button-gold`: gold background, charcoal text.
  - `.button-gold-dark`: identical to `.button-gold` (duplicate, `:420-432`).
  - `.button-outline`: white 55% border.
  - Buttons have no hover, active or focus styles.
- **Nav pills:** `.nav-secondary` (outline) and `.nav-primary` (charcoal); radius 30px.
- **Cards and radii:** story-card image 13px, hero-story 15px, editor-card 15px, yoga-category-card 18px, foundation-card 18px, featured-box 22px, principles 14px, contact tiles 16px, form card 20px, inputs 10px, explore tiles 12px.
- **Shadows:** none. The design relies on 1px `--line` borders and tonal backgrounds. **VERIFIED** (no `box-shadow` in the file)
- **Glass effect:** `backdrop-filter: blur(12px)` on the navbar and the hero story cards.
- **Animations:**
  - `html { scroll-behavior: smooth }`
  - foundation image `transform .5s` scale 1.04 on hover
  - explore tiles `all .2s` plus translateY(-2px)
  - hamburger lines `.25s`
  - no keyframes and **no `prefers-reduced-motion`**

### File organisation (VERIFIED)
The stylesheet was built by appending blocks, and its order is:
1. Yoga-page styles, placed before `:root` and the reset (`:1-231`)
2. Globals and homepage (`:232-1141`)
3. Breath, Meditation and Sound hero backgrounds (`:1142-1168`)
4. Journal (`:1169-1243`)
5. About (`:1244-1338`)
6. Contact (`:1339-1533`)
7. Mobile menu (`:1534-1598`)

Some breakpoint rules are duplicated: `.desktop-nav` is hidden at `:1014` and again at `:1591`. The order causes no specificity bugs, because the universal reset has zero specificity.

---

## 16. Responsive / mobile behaviour

**Breakpoints (VERIFIED):** 950px (main), 900px (practice pages), 850px (journal/about/contact), 650px (small). Everything is `max-width`, so the CSS is desktop-first.

| Width | Behaviour |
|---|---|
| ≤950px | Desktop nav and "Explore" pill hidden; hamburger shown **only where it exists in markup**. Home hero stacks to 1 column; only the first hero story card is shown. Journal sidebar goes to 2 columns; featured box and editor grid go to 1 and 2 columns. |
| ≤900px | Practice intro and category grids go to 1 column; principles go to 2 columns. |
| ≤850px | Journal feature, about and contact grids go to 1 column. |
| ≤650px | Navbar 68px; logo 1.15rem; hero H1 fixed at 4.4rem; inner H1 fixed at 4.2rem; most grids go to 1 column; footer stacks. |

**Critical finding:**
- On **yoga, breathwork, meditation, sound, journal and about**, there is no navigation at 950px and below. The desktop nav is hidden (`style.css:1014-1016, 1591-1593`) and the "Explore" pill is hidden (`:1595-1597`). The hamburger markup is absent from those 6 files.
- A phone user on 6 of 9 pages therefore sees only the logo and the "Contact" pill. They can still reach other pages through the footer, body links or the logo. **VERIFIED** (markup and CSS). The effect is **INFERRED**, not visually tested.

**Overflow risks (INFERRED, not browser-tested):**
- **Inner hero H1 at 4.2rem (~67px):** the Playfair italic words "awareness." and "intention." are about 10 characters, roughly 330px or more. They may be wider than 90% of a 360px viewport. `.inner-hero` has `overflow:hidden` (`style.css:11`), so the text would be **clipped** rather than cause a horizontal scroll.
- **Home H1 "Breathe" at 4.4rem:** close to the limit on 320px devices.
- **Footer between 651 and about 900px:** a three-column grid with 7 non-wrapping links (`.footer-links` wraps only at 650px and below, `:1133-1135`) may squeeze or overflow.
- **Desktop header between 951 and about 1150px:** the wordmark (letter-spacing .24em), 6 links with 30px gaps and two pills may crowd the 90%-width container.
- **Opened mobile menu:** it persists after resizing to desktop (see §14).

---

## 17. Reusable patterns / components

| Pattern | Where | Duplicated? | Consistent? |
|---|---|---|---|
| Header / navbar | all 9 pages | Copy-pasted into each HTML file (no includes) | **No.** 3 pages have the hamburger and mobile menu, 6 do not. thank-you lacks the "Explore" pill. |
| Footer | all 9 pages | Copy-pasted | Yes, the content is identical (whitespace differs) |
| `.final-cta` photo band | all 9 pages | Markup copied; always the same background photo | Yes |
| `.inner-hero` | 4 practice pages | Copied | Yes |
| `.center-heading`, `.section-kicker` | most pages | — | Yes |
| `.yoga-category-card` grid | 4 practice pages | Copied | Yes (the class name is yoga-specific) |
| `.featured-box` | home + 4 practice pages | Copied | Yes |
| `.principles-grid` | 4 practice pages + about | Copied | Yes |
| `.foundation-card` | home + about | Copied | Yes |
| `.story-card` + `.journal-sidebar` | home + journal | Copied | Mostly. Home cards have no link and show a read time; journal cards have a link and no read time. |
| Font `<link>` block | all 9 pages | Copied | Yes |

**INFERRED:** because there is no templating, any header or footer change must be made by hand in 9 files. The mobile-menu inconsistency is the kind of drift this causes.

---

## 18. Current strengths
- There is a **coherent, calm, premium visual language** (cream/charcoal/antique gold, bold sans plus italic serif accent) applied across every page. **VERIFIED**
- The copy is strong: warm, simple, beginner-friendly, consistent triads ("Move · Breathe · Return"), and it avoids hype or medical claims. **VERIFIED**
- Plain HTML/CSS/JS with **zero build step and zero dependencies** makes it very easy to host and understand. **VERIFIED**
- Every page has `lang="en"`, the viewport meta, a unique title and (except thank-you) a meta description. **VERIFIED**
- Semantic landmarks (`header`, `nav`, `main`, `footer`, `section`, `article`, `aside`) are used. **VERIFIED**
- **No broken internal links.** Filenames are lowercase and consistent. **VERIFIED**
- The form has proper `<label for>` pairs, sensible input types, `required`, a disabled "Sending..." state and error handling. **VERIFIED**
- The JS is null-guarded and does not error on pages that lack elements. **VERIFIED**
- Fonts use preconnect plus `display=swap`. Unsplash URLs use `auto=format` (modern formats) and size parameters. **VERIFIED**
- All external URLs are HTTPS (no mixed content). **VERIFIED**

---

## 19. Bugs / broken functionality

1. **The mobile nav is missing on 6 of 9 pages** (yoga, breathwork, meditation, sound, journal, about). There is no way to open a menu at 950px and below. *Critical for mobile UX.* **VERIFIED**
2. **The thank-you redirect is hard-coded to the absolute Vercel URL** (`script.js:45-46`, `contact.html:160`). It breaks on local testing, on preview deploys and on any future custom domain. **VERIFIED**
3. **Every practice CTA and "Explore →" link goes to the contact page** (32 links across 4 pages). Users expect practice content. **VERIFIED**
4. **The homepage journal, editor and hero-story cards are not clickable**, even though they look like article links. **VERIFIED**
5. **The About hero paragraph is unstyled** because of a `:last-child` selector mismatch (`style.css:1276` vs `about.html:64-71`). **VERIFIED**
6. **The mobile menu stays open after resizing to desktop.** There is no `aria-expanded`, and there is no close on Escape or link click. **VERIFIED / INFERRED**
7. **The thank-you page has no `<h1>`**, no meta description and no `noindex`. **VERIFIED**
8. **Journal "articles" do not exist.** The sidebar "Most read" titles link to category pages. **VERIFIED**
9. **Whether the no-JS `_next` redirect works depends on the Formspree plan.** **UNKNOWN**

---

## 20. Accessibility issues

| Item | Finding | Tag |
|---|---|---|
| `lang` | `lang="en"` on all pages | VERIFIED |
| Landmarks | header/nav/main/footer present. `<nav>` has no `aria-label`; the mobile menu is a `<div>`, not a `<nav>` | VERIFIED |
| Skip link | None | VERIFIED |
| Headings | Home: H1, then H3 (hero cards, `index.html:128`), then H2 (quote), so a level is skipped. The quote is marked up as an H2 although it is not a section heading. thank-you has no H1. Other pages have a logical H1 → H2 → H3 order. | VERIFIED |
| Alt text | Every `<img>` has alt text, but it is generic and repeated ("Yoga practice", "Meditation", "Breathwork"). The hero-story thumbnails and foundation-card images duplicate adjacent text, so `alt=""` would suit them better. | VERIFIED |
| Form labels | All present and associated | VERIFIED |
| Form feedback | `alert()` only; no inline errors or `aria-live` | VERIFIED |
| Nav toggle | Has `aria-label="Open menu"`. It is missing `aria-expanded`, `aria-controls` and a label change. | VERIFIED |
| Current page | No `aria-current` | VERIFIED |
| Focus states | There are no custom `:focus`/`:focus-visible` styles, and outlines are **not** removed, so browser default rings remain. On dark and gold backgrounds they may be hard to see. | VERIFIED / INFERRED |
| Hover-only effects | Foundation zoom and explore-tile inversion have no `:focus` equivalent | VERIFIED |
| Reduced motion | No `prefers-reduced-motion`, and `scroll-behavior: smooth` applies globally | VERIFIED |
| Touch targets | Buttons are at least 48px high; the hamburger is 42×42px (slightly under 44px) | VERIFIED |
| Contrast (estimated WCAG ratios, calculated from hex) | Gold `#baa060` kicker text on cream `#f5f1e7`: **about 2.3:1 (fails AA)**. Story category `#917941` on `#f8f5ee`: **about 3.8:1 (fails AA for small text)**. Quote signature `#837452` on cream: **about 4.1:1 (fails at 0.7rem)**. Principles number `#856f3e` on sand plus white overlay: **about 3.5:1 (fails)**. `--text-soft` `#68645c` on cream: about 5.2:1 (passes). Gold on charcoal: about 6.7:1 (passes). Charcoal on gold button: about 6.7:1 (passes). | INFERRED (calculated, not measured in a browser) |
| Text over images | Inner heroes and CTAs use strong dark overlays, so they are likely fine. Foundation cards use a gradient from transparent at 35%. | INFERRED |

---

## 21. SEO issues

| Item | Finding | Tag |
|---|---|---|
| Titles | Unique and descriptive on all 9 pages | VERIFIED |
| Meta description | On 8 of 9 pages (missing on thank-you) | VERIFIED |
| Canonical | None on any page | VERIFIED |
| Open Graph / Twitter cards | None, so social shares get no image or title card | VERIFIED |
| Structured data (JSON-LD) | None (e.g. Organization / WebSite) | VERIFIED |
| robots.txt / sitemap.xml | Absent | VERIFIED |
| Favicon / apple-touch-icon / manifest | Absent. Browsers will request `/favicon.ico` and get a 404. | VERIFIED absence; the 404 is INFERRED |
| thank-you indexable | No `noindex` | VERIFIED |
| Headings | Each page has one H1 except thank-you. The home H1 "Breathe easy." contains no keyword and the brand is not in it. | VERIFIED |
| Content depth | The practice and journal pages are shallow. There are no real articles, so the "Journal" offers little indexable content. | VERIFIED |
| Brand casing | "YYOGAA" (wordmark), "Yyogaa" (titles and copy) and "yyogaa" (repo) are all used | VERIFIED |
| URLs | `.html` extensions; clean, lowercase and hyphenated | VERIFIED |

---

## 22. Performance issues

- **All images are hot-linked from `images.unsplash.com`.** There are 17 unique photos, reused across pages (`grep`). The homepage alone loads 17 `<img>` plus 1 CSS background. **VERIFIED**
- **No `loading="lazy"`**, no `width`/`height` attributes and no `srcset`/`sizes` on any image. **VERIFIED** **INFERRED:** below-the-fold images compete with the hero for bandwidth, and layout shift (CLS) is likely.
- **Heavy image parameters:**
  - Home hero `w=1400&q=90`
  - Inner hero backgrounds `w=1800&q=90`
  - Card images `w=1000&q=85` shown at about 300–500px
  - Hero-story thumbnails `w=500` shown at 82×72px

  **VERIFIED** (params); the wasted bytes are INFERRED.
- The LCP hero image is not preloaded, and on inner pages it is a CSS `background`, which the browser discovers later. **VERIFIED / INFERRED**
- **Render-blocking:** the Google Fonts stylesheet and `style.css` block rendering. The fonts are preconnected with `display=swap`, which is reasonable. `script.js` sits at the end of the body, so it does not block. **VERIFIED**
- **Unused CSS:** each page downloads the full 24KB stylesheet, including every other page's rules. Three unused tokens exist. The CSS is not minified. The absolute size is small. **VERIFIED**
- **Unused font weight:** DM Sans 500 appears unused (no `font-weight: 500` on DM Sans text; the 500s are Playfair). **INFERRED**
- **Cache and compression headers:** there is no hosting config in the repo, so they depend on host defaults. **UNKNOWN**

---

## 23. Security concerns

| Item | Finding | Tag |
|---|---|---|
| Secrets / API keys | None in the repo | VERIFIED |
| Formspree form ID `mgavdlkl` | Public by design (every client-side form exposes it). The risk is spam or abuse of the endpoint, and there is no honeypot. | VERIFIED; risk INFERRED |
| Email `hello@yyogaa.com` | Plain-text `mailto:`, so it can be harvested by spam bots | VERIFIED |
| Author email in git history | Commit metadata shows the author email (normal for public repos) | VERIFIED |
| `target="_blank"` | Not used anywhere, so there is no `rel=noopener` risk | VERIFIED |
| Third-party origins | fonts.googleapis.com, fonts.gstatic.com, images.unsplash.com, formspree.io. There are **no** third-party scripts and no analytics or trackers. | VERIFIED |
| Mixed content | None; all URLs are HTTPS | VERIFIED |
| Security headers (CSP, HSTS, X-Frame-Options, Referrer-Policy) | No config in the repo; they depend on the host | UNKNOWN |
| Privacy | Form collects name and email. There is no privacy notice or policy page, and Google Fonts sends visitor IPs to Google. | VERIFIED absence; the compliance relevance depends on the audience (UNKNOWN) |
| Untracked `.claude/` folder | Not website content. It should not be deployed or committed by accident (there is no `.gitignore`). | VERIFIED |

---

## 24. Current technical architecture

- **Type:** a static multi-page website of hand-written HTML5, one global CSS file and one vanilla JS file. There is no framework, bundler, package manager, templating, CMS or backend code. **VERIFIED**
- **Data:** all content is hard-coded in HTML. **VERIFIED**
- **Dynamic behaviour:** (1) the mobile-menu toggle and (2) the contact-form POST to **Formspree**, a hosted form-to-email service that acts as the only "backend". **VERIFIED**
- **External dependencies at runtime:** Google Fonts, Unsplash image CDN and Formspree. **VERIFIED**
- **Routing:** file-based (`/page.html`). **VERIFIED**

```
Browser ──GET──> Static host (Vercel, INFERRED) ──> *.html, style.css, script.js
   ├──> fonts.googleapis.com / fonts.gstatic.com (fonts)
   ├──> images.unsplash.com (all imagery)
   └──POST (fetch or HTML form)──> formspree.io/f/mgavdlkl ──> email to owner (INFERRED)
            └─ on success ──> https://yyogaa-website.vercel.app/thank-you.html
```

## 25. Deployment / configuration (repository evidence only)

- **Source hosting:** GitHub, `origin = https://github.com/iimpandey/yyogaa-website.git`, branch `main`, up to date with `origin/main`. **VERIFIED** (`git remote -v`, `git status`)
- **Production host:** most likely **Vercel** at `https://yyogaa-website.vercel.app`. The evidence is that this URL is hard-coded in `script.js:46` and `contact.html:160`. **INFERRED**
- **Deploy mechanism:** probably Vercel's Git integration, auto-deploying `main` as a zero-config static site. **INFERRED**. The repo contains no `vercel.json` or workflow, and the exact setup is **UNKNOWN**.
- **Custom domain:** none configured in the repo (no `CNAME`). The email domain `yyogaa.com` suggests a domain may be owned. Whether it is wired to the site is **UNKNOWN**.
- **Build step:** none. The files are served as-is. **VERIFIED** (no package.json or build config)
- **Environment variables:** none used. **VERIFIED**
- **Formspree account configuration** (recipient, plan, spam settings, redirect allowance): **UNKNOWN**.

---

## Visual identity (to preserve)

- **Palette:** warm, earthy and low-saturation.
  - Base: **cream `#f5f1e7`** with off-white section variants.
  - Dark anchor: **deep warm charcoal `#1d1d19`** (footer `#171713`).
  - Accent: **muted antique gold `#baa060`**.
  - Mid-tones: **sand `#d8cfbc`** for "grounding" bands.
  - Hairline dividers: `#ddd5c6`.
  - The site uses no bright colours, pure white backgrounds or pure black.
- **Typography:** a modern geometric sans (DM Sans) in bold, very large, tightly leaded headings, paired with **one italic Playfair Display word in gold**: "Breathe *easy.*", "Move with *intention.*", "Listen *deeply.*". Small uppercase, widely tracked gold kickers sit above headings. This sans + italic-serif pairing is the site's signature.
- **Wordmark:** text-only **"YYOGAA"** in DM Sans 700, uppercase, letter-spacing 0.24em. There is no logo graphic or favicon. The doubled letters and wide tracking give a calm, spacious, fashion-editorial feel.
- **Layout mood:** an editorial wellness magazine. It uses a split dark hero, generous whitespace, 1px hairlines instead of shadows, softly rounded cards (13–22px) and pill buttons. Numbered items (01–04) create a quiet rhythm.
- **Imagery:** natural-light Unsplash stock of yoga poses, meditation, nature, singing bowls and calm interiors. The tones are warm and muted, the people are shown mid-practice, and nothing is overly staged or neon. The images are softened with dark gradients where text overlays them.
- **Tone of copy:** gentle, reassuring, inclusive and beginner-first ("You do not need to already be flexible, calm or experienced."). It uses short declarative lines and triads ("Move. Breathe. Return." / "One movement. One breath. One moment at a time."). It avoids hype, pressure and medical claims, and uses soft imperatives ("Start where you are.", "Return gently.").
- **Brand voice keywords:** simple, approachable, grounded, present, unhurried, modern-minimal.
- **Taglines in use:** "Move · Breathe · Return", "Breathe easy.", "Start where you are.", "Your practice. Your pace."

---

## Pages found
1. `index.html` (Home)
2. `yoga.html`
3. `breathwork.html`
4. `meditation.html`
5. `sound.html`
6. `journal.html` (a blog index mock-up; no article pages)
7. `about.html`
8. `contact.html` (Formspree form)
9. `thank-you.html` (post-submit confirmation)

The site has no 404, privacy, terms or article pages.

## Features found
- Sticky header with a translucent blur and a text wordmark.
- Hamburger mobile menu with an animated X (on 3 pages only).
- Split editorial home hero with floating "practice" cards.
- Photo heroes with gradient overlays on the practice pages.
- Category card grids, a featured-practice block, principles grids, foundation photo cards (hover zoom) and explore tiles (hover invert).
- Journal layout with Most-read and Topics sidebars.
- Contact form posting to Formspree via `fetch`, with a loading state, alert on error, redirect to thank-you, and a no-JS fallback POST.
- Smooth scrolling to anchors.
- Responsive layout with 4 breakpoints.

## Problems found (prioritised)

**Critical**
1. There is no mobile navigation on yoga, breathwork, meditation, sound, journal and about. The menu is hidden at 950px and below, and the hamburger markup is missing from those 6 files.

**High**
2. The thank-you redirect is hard-coded to the absolute `yyogaa-website.vercel.app` URL in both JS and `_next`, so it breaks outside production.
3. About 32 "Explore →" / "Begin Practice" / "Start …" CTAs on the practice pages all lead to contact.html. The advertised practice content does not exist.
4. Several contrast failures: gold kickers on cream (about 2.3:1) and several small brown/gold labels (about 3.5–4.1:1).
5. The form has no spam protection in the repo (no honeypot or CAPTCHA), and the email address is exposed in plain text.

**Medium**
6. Homepage story, editor and hero cards look clickable but are not links. Journal "articles" do not exist.
7. The mobile toggle has no `aria-expanded`, no Escape/close handling, and stays open after resizing. There is no skip link, no `aria-current`, no custom focus styles and no reduced-motion support.
8. Images have no lazy loading, width/height or srcset, and are oversized (q=85–90, w=1000–1800 for small slots). The hero image is not preloaded.
9. SEO basics are missing: canonical, OG/Twitter tags, favicon, robots.txt, sitemap.xml and structured data. thank-you is indexable with no H1 or description.
10. The header and footer are copy-pasted into 9 files, which has already drifted (menu, Explore pill).
11. Heading order skips on home (H1 → H3). The quote is misused as an H2.

**Low**
12. The About hero paragraph is unstyled because of a `:last-child` selector mismatch.
13. The CSS is disorganised (page styles before `:root`, duplicated breakpoints, `.button-gold-dark` identical to `.button-gold`, 3 unused tokens, about 15 hard-coded near-duplicate colours).
14. Possible heading clipping on narrow phones (inner hero H1 at 4.2rem) and footer or header crowding at mid widths (INFERRED).
15. The brand is written three ways (YYOGAA / Yyogaa / yyogaa). Alt text is generic. The hamburger is 42px.
16. The README is minimal, there is no `.gitignore`, and there is no privacy notice for form data.

## What is already working well
- A distinctive, cohesive, calm visual identity used consistently across every page.
- Excellent, on-brand, beginner-friendly copy.
- A simple, dependency-free static architecture that is easy to host and maintain.
- A working contact form flow (labels, required fields, loading state, error alert, thank-you page).
- No broken internal links or case-sensitivity problems, and HTTPS everywhere.
- Unique titles and meta descriptions, `lang` set, semantic landmarks, and fonts loaded sensibly.
- Null-safe JavaScript with no console errors expected on any page.

## What should NOT be changed unnecessarily
- The **palette** (cream / warm charcoal / antique gold / sand) and the absence of heavy shadows.
- The **DM Sans + italic gold Playfair accent-word** headline pattern and the tracked uppercase kickers.
- The **"YYOGAA" spaced wordmark** treatment.
- The **copy voice and taglines** ("Move · Breathe · Return", "Start where you are.").
- The **four-pillar information architecture** (Yoga, Breath, Meditation, Sound, plus Journal, About and Contact) and the existing URLs/filenames. Changing them would break links and any indexed pages.
- The **section rhythm**: dark hero, cream content, sand grounding band, dark photo CTA, footer.
- The **simple static stack and the Formspree form**. They work and need no backend.

## Top opportunities for future improvement
1. **Fix mobile navigation on all pages.** Use one shared header, give the toggle proper ARIA, and close it on Escape or resize.
2. **Make the thank-you redirect relative**, add a Formspree honeypot (`_gotcha`), and give inline, accessible form feedback.
3. **Build real practice content** (sequences, timers, audio) or honest "coming soon / join the waitlist" states instead of sending every CTA to Contact.
4. **Make the journal real**: article pages or a lightweight Markdown or static-site workflow, and make the cards clickable.
5. **Accessibility pass:** darken gold and brown label text for AA contrast, add a skip link, `:focus-visible` styles, `aria-current` and `prefers-reduced-motion`, and fix heading order.
6. **Image performance:** add `loading="lazy"`, width/height, `srcset`, lower quality settings and a preloaded hero. Consider self-hosting optimised images.
7. **SEO foundation:** add a favicon, OG/Twitter tags, canonical, `robots.txt`, `sitemap.xml`, Organization JSON-LD, and `noindex` on thank-you.
8. **Maintainability:** tokenise all colours and spacing, reorganise `style.css`, and add a `.gitignore` and a proper README. Consider a tiny static-site generator or includes to stop header/footer drift. This must preserve the current look.
