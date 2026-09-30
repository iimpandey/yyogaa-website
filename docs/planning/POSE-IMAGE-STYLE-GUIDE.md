# YYOGAA Pose Image Style Guide

**Status:** Approved direction (v1). No pose images exist yet.
**Applies to:** every image used on a Yoga Library pose page (`/yoga/poses/<slug>`) and its library card.
**Related:** `YOGA-LIBRARY-IMPLEMENTATION-PLAN.md` §9 (pose images), `src/content.config.ts` (the `image` field rules).

This guide is for the YYOGAA owner and for any illustrator who creates pose images. Its goal is that hundreds of pose images, made over months or years, look like **one calm, premium, editorial set** and teach each pose clearly.

---

## 1. The visual standard at a glance

| Aspect | Standard |
|---|---|
| Medium | Original **line illustration** (SVG) in one style: human-created **or** original AI-generated under the rules in §3. Photography only later, as a planned shoot. |
| Canvas | **1600 × 1200 px, 4:3 landscape**, for every pose. |
| Palette | Charcoal lines `#1d1d19`; one muted-gold accent `#baa060` (floor/mat line only); sand `#d4cab4` for props. No other colours. |
| Background | **Transparent.** The website supplies the cream background. No scenery, shadows, gradients or text. |
| View | Side view at eye level, figure facing left, **by default**. Anatomical clarity always wins over consistency (see §5). |
| Framing | Same floor line, same figure scale, same safe margin in every image. |
| Figure | One inclusive, realistic adult figure; calm, not "fitness model". |
| Clothing | Fitted long top, ankle-length leggings, barefoot, no logos or jewellery. |
| Files | Clean, optimised SVG, usually under 30 KB. |
| Review | Style check + qualified yoga teacher alignment check before `imageStatus: final`. |

---

## 2. Image size and aspect ratio

- **Every pose image is 4:3 landscape.** This matches the fixed 4:3 frames already built into the pose page and the library cards, so nothing is ever cropped unexpectedly.
- **Illustrations (SVG):** artboard / `viewBox` of **1600 × 1200** (`viewBox="0 0 1600 1200"`, `width="1600" height="1200"`).
- **Photographs (only if ever used):** at least **1600 × 1200 px**, exported at that size.
- The website shows the image at about 540 px wide on the pose page (desktop) and about 270–340 px wide on library cards, so every image must stay **clear when small**.

---

## 3. Photography vs illustration

**Recommendation: original line illustrations.** They may be **human-created** or **original AI-generated** (see "AI-generated illustrations" below). Both must meet every rule in this guide.

Why illustrations:
- Hundreds of drawings by one illustrator from one template stay consistent far more easily than photos taken over years.
- A drawing can show joints and alignment more clearly than a photo (no loose clothing, shadows or distractions).
- Small files, sharp at any size, easy to match to the brand palette.
- No model releases, locations or photo shoots needed.
- Fits the premium, editorial, minimal YYOGAA look.

**Photography** is allowed later **only** as a planned shoot: same model(s), same room, same light, same mat, a signed model release, and a qualified teacher on set checking alignment.

### AI-generated illustrations (permitted, with conditions)

Original AI-generated illustrations **are permitted** for YYOGAA pose images, alongside human-created ones, **provided that all of the following are true:**

1. **Exact style match:** the image follows this style guide exactly (canvas, palette, line weight, transparent background, framing, figure, clothing, file rules). AI output usually needs cleaning up or redrawing as a clean vector SVG to meet §7 and §9.
2. **Created specifically for YYOGAA:** generated for YYOGAA from YYOGAA's own prompts/briefs, and **not** a copy, trace, "variation" or image-to-image transformation of an existing image (including Yoga.com, stock photos, books, apps or other websites).
3. **No imitation of a specific living artist:** prompts must not name or imitate the style of any specific living artist or illustrator. Describe the YYOGAA style itself instead (e.g. "minimal charcoal line drawing, 6 px strokes, transparent background").
4. **Anatomy and alignment reviewed before publication:** AI images often get hands, feet, joints and limb counts wrong. Every image is checked against the pose's written instructions before it appears on the site, even as a `placeholder`.
5. **Teacher review before `final`:** a teaching pose image must be reviewed by a **qualified yoga teacher** before its `imageStatus` becomes `final`.
6. **Provenance recorded where appropriate:** keep a private record for each AI image (tool/model and version, date, the prompt(s) used, and what was edited by hand afterwards), stored with the other source files outside the public repository. See §11.

Human-created illustrations remain fully permitted and follow the same style, review and licensing rules.

**Not allowed for pose instruction images:**
- Stock photos (Unsplash, Pexels, etc.): usually the wrong pose, poor alignment, inconsistent look.
- AI images that break any of the conditions above (e.g. unreviewed, imitating a living artist, or derived from an existing image).
- Anything copied or traced from Yoga.com, other websites, books or apps.

---

## 4. Background treatment

- **Transparent SVG background.** The website provides the colour: cream (`#f5f1e7`) on the pose page and a slightly darker cream (`#e8e0cf`) on library cards.
- **No** scenery, rooms, windows, plants, textures, shadows, gradients, vignettes, borders or text inside the image.
- **Floor/mat:** one thin horizontal line in muted gold `#baa060` under the figure. This is the **only** gold in the image.
- **Props** (block, strap, bolster, blanket, chair): simple shapes with a sand `#d4cab4` fill and charcoal outline.

---

## 5. Subject framing

### Default (use whenever it teaches the pose clearly)
- **Side view at eye level**, drawn as a flat, straight-on profile (no dramatic perspective).
- **Figure faces left** (head / front of the body toward the left edge), so the library reads as a matching set.
- **Floor line at 80% of the height** (y = 960 on the 1200 px canvas) in every image.
- **Consistent scale:** a standing figure is always about **720 px tall** (standing head-to-heel), so seated and lying poses naturally appear smaller. Never enlarge a pose just to fill the frame.
- **Safe margin:** about 8% on every side (≈128 px left/right, ≈96 px top/bottom). No part of the figure or props crosses it.
- Figure horizontally centred within the safe area.

### Clarity rule: anatomical clarity takes priority
Consistent viewing direction is **preferred**, but **clear alignment always comes first.** A pose **may** use a different viewing angle or direction when that is necessary to teach it clearly, for example:
- **Front view** when the key alignment is side-to-side (e.g. Warrior II, Triangle, Goddess).
- **Back view or three-quarter view** when a twist or shoulder position can't be seen from the side.
- **Top view** (rarely) for floor poses whose shape only reads from above.
- **Facing right** when a side-specific pose must show a particular leg or arm forward, or when facing left would hide the important limb.

When using a non-default view:
- Keep **everything else** the same: canvas, floor line (where a floor is visible), figure scale, line weight, palette, margins, clothing.
- Record the reason in the pose file comment (e.g. `# front view: shows knee over ankle`) so reviewers know it was deliberate.
- If the pose needs **both** views to be understood, a second image (e.g. side + front) may be added later; the first/primary image should still be the clearest single view.

---

## 6. Figure and clothing direction

**Figure**
- One consistent adult figure used across the whole library.
- Realistic, average build: not muscular, not a fitness model, not idealised or sexualised.
- No facial features (a simple head shape); no specific age, gender or ethnicity implied.
- Hair tied back (simple bun) so the neck and shoulders are visible.
- Calm, easeful expression of the pose: soft joints, relaxed hands, no visible strain. Show the **beginner-appropriate** version of the pose as the primary image (e.g. knees softly bent where the pose instructions recommend it).

**Clothing**
- Fitted long-sleeve top and ankle-length leggings, drawn as simple outlines, so the knees, hips, elbows and shoulders stay visible.
- Barefoot.
- No logos, patterns, jewellery, watches, shoes or gym equipment.

**Inclusivity**
- Supplementary images (modifications with a block, chair, wall, etc.) may show different body types in the same drawing style, same line weight and same palette.

---

## 7. Line and drawing style

- **Line colour:** charcoal `#1d1d19`, 100% opacity.
- **Main contour line:** **6 px** stroke on the 1600 × 1200 canvas (shrinks to roughly 1.3 px on a card, still readable). Minimum 5 px.
- **Inner detail lines** (clothing seams, fingers, toes): 3–4 px, used sparingly.
- Round line caps and round joins; smooth, confident curves.
- Figure body has **no fill** (or a cream fill `#f5f1e7` only where overlapping limbs need separating). No shading, hatching or gradients.
- Minimal detail: enough to read hands, feet, knees, hips, shoulders and head position; nothing decorative.
- No arrows, labels, numbers or text in the image (instructions live in the page text).

---

## 8. Keeping hundreds of images consistent

1. **This style guide** is the single written reference.
2. **A master template file** (e.g. a Figma, Illustrator or Affinity file) containing: the 1600 × 1200 artboard, floor line at y = 960, safe-margin guides, a 720 px standing-height guide, stroke presets (6 px / 3–4 px), the four colour swatches, and a reference figure. **Every pose starts from this template.**
3. **One illustrator** for the whole set wherever possible. If AI generation is used, keep **one saved prompt template and one tool/model version** for a batch, and always clean up the output to the master template, so AI images match each other and any human-drawn ones.
4. **Start with a style trial of 3 poses:** Downward-Facing Dog (inversion/arm-supported), one standing pose (e.g. Mountain or Warrior II) and one lying pose (e.g. Child's Pose or Bridge). Approve the style before any batch.
5. **Then batches of 10**, reviewed together side by side.
6. **Two checks before an image goes live:**
   - **Style check** against this guide (canvas, floor line, scale, colours, line weight, margins, file rules).
   - **Alignment check** by a qualified yoga teacher.
   For AI-generated images, an anatomy/alignment check against the written instructions is also required before the image appears on the site at all (even as `placeholder`).
   Only after both: set `imageStatus: final`. Use `imageStatus: placeholder` for anything temporary.
7. The `imageStatus` field lets us list which poses still need artwork.
8. Keep the **editable source files** for every image so any correction can be made in the same style.

---

## 9. File format and optimisation

**Illustrations: SVG**
- `viewBox="0 0 1600 1200"` with `width="1600" height="1200"`.
- Pure vector shapes/paths only.
- **Not allowed inside the SVG:** embedded raster images (PNG/JPG), text or fonts, scripts, external links or references, CSS `@import`, filters/blur effects, masks that aren't needed.
- Transparent background (no full-canvas background rectangle).
- Colours written as the exact hex values in §4 and §7.
- Remove editor metadata, hidden layers and unused definitions. Run once through an SVG optimiser (e.g. the free SVGO / SVGOMG) before adding to the site, keeping the `viewBox`.
- Target size: **under 30 KB** (hard limit 100 KB).
- Note: SVG handling in the site's image pipeline has not yet been tested with a real file; the first real image (Downward-Facing Dog) is that test.

**Photographs (only if used later)**
- Master: JPG, 1600 × 1200 px, sRGB, under 300 KB. The website automatically creates smaller WebP versions.

**File location and naming**
- Folder: `src/content/poses/images/`
- Name: the pose's slug, lowercase with hyphens, e.g. `downward-facing-dog.svg`.
- Extra views later: `<slug>-front.svg`, `<slug>-with-block.svg`, etc.

---

## 10. Accessibility and alt-text rules

The site already enforces: alt text required whenever an image exists, at least 40 characters, and it must not start with "Image of…" or just say "yoga pose".

- **Pose page:** 1–2 sentences describing the **shape of the body** and the key alignment, so someone who can't see the image understands the pose. Start with the medium ("Line drawing of a person in…").
- **Library cards:** empty alt (already built), because the card title names the pose and the card is one link.
- If the image shows a **modification**, say so ("…with hands resting on a block").
- If a non-default view is used, it can help to say so ("Front view of…").
- Describe the pose, not the mood ("calm", "beautiful" add nothing).
- Never rely on colour to explain anything; the gold floor line is decoration only.
- No text inside images.

---

## 11. Copyright and licensing

*General guidance, not legal advice. Have the agreement checked by someone qualified.*

- **Written agreement before any work starts**, stating that:
  - YYOGAA owns the illustrations outright (copyright assignment), **or** holds an exclusive, perpetual, worldwide licence;
  - YYOGAA may edit, adapt, crop and reuse them anywhere (website, apps, print, social media);
  - the work is original, and not traced or copied from other people's photos, illustrations, books, apps or websites (including Yoga.com). The illustrator may use their own reference photos or photos taken of a paid, consenting model.
- **Keep safely, outside the public code repository:** the signed agreement, invoices and editable source files.
- **In each pose file**, record `license` (`owned`, `commissioned`, or `licensed-<source>`) and, if wanted, `credit`. The site already requires `license` whenever an image is present.
- A future `/image-credits` page will list all credits automatically from this data.
- Photos of real people (if ever used) need a signed **model release**, recorded as `modelRelease: true`.

**AI-generated illustrations**
- Use only AI tools whose terms of service allow commercial use of the output, and keep a copy/note of the terms that applied on the date of generation.
- In the pose file, use `license: owned` for an AI illustration made by or for YYOGAA. If you want visitors to know, a credit such as `credit: "Illustration: YYOGAA (AI-assisted)"` can be used. The current schema has no separate provenance field, so a short YAML comment (e.g. `# AI-assisted: <tool>, <date>; details in private image log`) can note it in the file.
- Keep the **private provenance log** described in §3 (tool/model and version, date, prompts, manual edits) with the other source files, outside the public repository.
- Be aware that in some countries purely AI-generated images may have limited or no copyright protection, which means others might be able to reuse them. Substantial human editing and the written record help. Take advice if this matters commercially.
- The same "no copying, no tracing, no imitating a specific living artist" rules apply as in §3.

---

## 12. Adding an approved image to the site

1. Save the file as `src/content/poses/images/<slug>.svg`.
2. In `src/content/poses/<slug>.md`, replace `imageStatus: none` with:
   ```yaml
   image:
     src: ./images/<slug>.svg
     alt: "<alt text following §10>"
     credit: "Illustration: <illustrator name> for YYOGAA"   # optional
     license: commissioned
   imageStatus: final   # or placeholder
   ```
3. Run `npm run build`. A wrong path or weak alt text stops the build with a clear message.
4. Check the pose page and the library card at phone and desktop widths.
