# Astro Migration — Checkpoint & Plan (Phase 1)

- **Date:** 2026-09-30
- **Scope:** move the *current* 9-page static site into Astro, locally, with no redesign. Owner-approved.
- **Not in scope:** Yoga Library, new content, accounts, database, auth, payments, CSS refactor, self-hosted fonts/images, Phase 0 fixes, commit, push, deploy.

---

## 1. Snapshot of the current state (before any change)

- **Git HEAD:** `a8972541aa294fbcc083039f987988a89f3982ef` (branch `main`, commit "Fix mobile navigation on all pages")
- **Tracked files:** `README.md`, the 9 `.html` pages, `style.css`, `script.js`
- **Untracked at start:** `.claude/`, `docs/`
- **Tools:** Node v24.21.0, npm 11.19.0 (installed by the owner). Git is not on PATH; GitHub Desktop's bundled git is used for read-only commands only.

### SHA-256 hashes of the original files (these must NOT change)

| File | Bytes | SHA-256 |
|---|---|---|
| index.html | 16127 | `0F8FB4E63DC34C79A6151516609C60DE3F44325E76EE1A15AF57A90D1A1F7F27` |
| yoga.html | 9442 | `9C21C5F6AAE763EADF01913D42E32CFC946C6B85EAD1B01BFD1DC1B06511446E` |
| breathwork.html | 9533 | `9D7ED18025BEE8CE94348E53023A9C27D224AACAC8C500210150266809014CFE` |
| meditation.html | 9651 | `503135D18059975670F3AC3D54706E79986F51A6F96D4AD119E9E4BFDE603F67` |
| sound.html | 9682 | `C0603050CE5D5F15E667BA05DB542AC521735FBECED9BE8ECF8E85C68AC4E26C` |
| journal.html | 9624 | `E05F650720D778241CE13F7E037EE38F5E1AC3EEB2DC8DD62F24AE5AC7264503` |
| about.html | 7756 | `275A179CE298AD72643E933D19EA21B4DE9862D46EBDA111440A8DCE545CAF54` |
| contact.html | 7485 | `386B1E95CE575A1B8124E64F8ADDC84B5C6CDC6D655034BFB7F7B9C620AE2CE6` |
| thank-you.html | 2752 | `D5C69AF7E5D9EB5B72CE96B7CC88887B75FCB3B00FDF5B8185D8CC2C930806CC` |
| style.css | 24412 | `639BF1C4253984D19743EDED11D3BD0E21F0B90CB0EA026B66713C25B2F01BFF` |
| script.js | 3311 | `0A133CCB43AC663151A034453DBDBE27D3318AA968AAF67260B93F4B58A88A71` |

To re-check them in PowerShell from the project folder:

```powershell
Get-FileHash -Algorithm SHA256 *.html, style.css, script.js
```

---

## 2. What the pages share (findings from re-reading all files)

| Element | Finding | Plan |
|---|---|---|
| `<head>` | Same on all 9 pages: charset, viewport, `<title>`, meta description, 2 preconnects, one Google Fonts link, `style.css`. **thank-you has no meta description.** | `BaseLayout.astro` with `title` and optional `description` props. If there is no description, no meta tag is output (matches thank-you today). |
| Header | Same on 8 pages. **thank-you's `nav-right` has no "Explore" link** (only "Contact" plus the menu button). No page marks an active link. | `Header.astro` with a `showExplore` prop (default `true`; `false` on thank-you). No active-link styling added, because none exists today. |
| Mobile menu | Same markup on all 9 pages (id `mobile-menu`, 7 links). | `MobileMenu.astro`, used inside `Header`. |
| Footer | Same links and text on all 9 pages. Only the source formatting differs (index/contact spread over more lines), and whitespace does not change the rendered result. | One `Footer.astro`. |
| Script | `<script src="script.js">` at the end of `<body>` on every page. | The same tag in `BaseLayout`, loaded from `/script.js` (`is:inline`, so Astro does not bundle or change it). |
| Page-specific | thank-you's section has `style="min-height: 75vh;"`. contact has the Formspree form. | Kept exactly in the page files. |

---

## 3. What will be created

```
package.json            scripts dev/build/preview, engines node >=22.12, dependency: astro
package-lock.json       created by npm
astro.config.mjs        output 'static', build.format 'file', trailingSlash 'never', compressHTML false, dev toolbar off
vercel.json             cleanUrls, trailingSlash false, 9 permanent redirects, build command + output dir
.gitignore              node_modules, dist, .astro, .vercel, .env
public/style.css        byte-for-byte COPY of /style.css
public/script.js        byte-for-byte COPY of /script.js
src/layouts/BaseLayout.astro
src/components/Header.astro
src/components/MobileMenu.astro
src/components/Footer.astro
src/pages/index.astro, yoga.astro, breathwork.astro, meditation.astro, sound.astro,
          journal.astro, about.astro, contact.astro, thank-you.astro
```

Each page's `<main>` markup is pasted in as it is. Only internal `href`s change to the clean URLs below.

---

## 4. URL mapping and redirects

| Old URL (still works after deploy) | New clean URL | Built file |
|---|---|---|
| `/index.html` | `/` | `dist/index.html` |
| `/yoga.html` | `/yoga` | `dist/yoga.html` |
| `/breathwork.html` | `/breathwork` | `dist/breathwork.html` |
| `/meditation.html` | `/meditation` | `dist/meditation.html` |
| `/sound.html` | `/sound` | `dist/sound.html` |
| `/journal.html` | `/journal` | `dist/journal.html` |
| `/about.html` | `/about` | `dist/about.html` |
| `/contact.html` | `/contact` | `dist/contact.html` |
| `/thank-you.html` | `/thank-you` | `dist/thank-you.html` |

- Link changes inside pages: `index.html` → `/`, `index.html#explore` → `/#explore`, `x.html` → `/x`. `#practice` anchors and `mailto:` stay as they are.
- **Redirects live in `vercel.json`** as permanent 308s, with `cleanUrls: true` as a second safety net. They only take effect on Vercel.
- **Astro's own `redirects` option is NOT used.** With `build.format: 'file'`, a redirect from `/about.html` would try to write `dist/about.html`, the same file as the real About page, so the two would conflict.
- **Unchanged:** the Formspree `action`, fields, `_next` (`https://yyogaa-website.vercel.app/thank-you.html`) and the redirect URL in `script.js`. After deploy, that `.html` address gets a 308 to `/thank-you`, which exists.

---

## 5. How to roll back

1. The old files are **never modified**. The live site keeps working from them until a deploy happens.
2. To undo locally, delete only the new files and folders: `package.json`, `package-lock.json`, `astro.config.mjs`, `vercel.json`, `.gitignore`, `public/`, `src/`, `node_modules/`, `dist/`, `.astro/`, and `.claude/launch.json` if created. Afterwards, `git status` should show only `.claude/` and `docs/` as untracked, as at the start.
3. Nothing is committed, pushed or deployed in this phase.
4. After a future deploy, use Vercel "Instant Rollback" to the previous deployment.

---

## 6. Test checklist

- [ ] `npm run build` succeeds; list the files in `dist`
- [ ] All 9 pages load in the Astro version at 1280 / 768 / 375 px
- [ ] Correct `<title>` and meta description on each page (none on thank-you, as today)
- [ ] No console errors; no failed requests for local assets
- [ ] Old vs new: visible text (`body.innerText`) identical per page
- [ ] Old vs new: document height and computed styles of key elements identical, at desktop and mobile
- [ ] Screenshots compared for a sample of pages
- [ ] Desktop nav links go to the right pages
- [ ] Mobile menu on every page: open/close, `aria-expanded`, Escape closes and returns focus, link click closes and navigates, widening past 950px resets it
- [ ] Crawl every internal `href` on the 9 pages: all return 200
- [ ] Contact form markup identical to the old one (action, method, fields, names, hidden inputs); fetch intercepted, **no real submission**
- [ ] Old root files still match the hashes in §1
- [ ] All servers stopped; browser viewport reset
