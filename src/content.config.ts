// Content collections: the "rulebooks" (schemas) for YYOGAA's structured content.
// See docs/planning/YOGA-LIBRARY-IMPLEMENTATION-PLAN.md §6 for the field-by-field reasoning.
//
// Astro 7 notes (checked against the installed astro@7.3.5):
// - `z` is imported from 'astro/zod' (importing it from 'astro:content' is deprecated in Astro 7).
// - `reference()` turns a value into { id, collection }. Astro only LOGS an error when a
//   referenced entry is missing; it does not stop the build. So src/lib/poses.js checks every
//   reference again and throws, which does stop the build (the plan's "second safety net").
import { defineCollection, reference } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';

// ---------- Controlled vocabularies (src/content/taxonomy/*.yaml) ----------
// Each YAML file is a list of { id, name, description }. The `id` is what pose files use.
const term = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

const levels = defineCollection({ loader: file('src/content/taxonomy/levels.yaml'), schema: term });
const poseCategories = defineCollection({ loader: file('src/content/taxonomy/pose-categories.yaml'), schema: term });
const bodyFocus = defineCollection({ loader: file('src/content/taxonomy/body-focus.yaml'), schema: term });
const props = defineCollection({ loader: file('src/content/taxonomy/props.yaml'), schema: term });
const goals = defineCollection({ loader: file('src/content/taxonomy/goals.yaml'), schema: term });

// Caution types carry one standard safety sentence each, reused on every pose that lists them.
const cautionTypes = defineCollection({
  loader: file('src/content/taxonomy/caution-types.yaml'),
  schema: z.object({
    name: z.string().min(1),
    text: z.string().min(20),
  }),
});

// ---------- Authors / reviewers (src/content/authors/*.yaml, one file per person) ----------
const authors = defineCollection({
  loader: glob({ pattern: '*.yaml', base: './src/content/authors' }),
  schema: z.object({
    name: z.string().min(1),
    /** true only for a real, qualified yoga teacher who actually reviews content. */
    qualifiedReviewer: z.boolean().default(false),
  }),
});

// ---------- Poses (src/content/poses/<slug>.md) ----------
// Use the raw file name as the ID (no automatic "slugifying"), so a badly named file
// (capitals, spaces, accents) is caught by the slug check in src/lib/poses.js instead of
// being silently renamed.
const poseFileId = ({ entry }: { entry: string }) => entry.replace(/\.md$/, '');

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Alt text that says nothing useful. Alt text must describe the SHAPE of the body instead.
const LAZY_ALT = /^\s*(image|photo|picture|illustration|drawing)\s+(of|showing)\b|^\s*yoga pose\.?\s*$/i;

const poses = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/poses', generateId: poseFileId }),
  // `image` is Astro's image helper: it checks the file exists (relative to the pose's .md
  // file), reads its width/height, and lets <Image> make optimised, responsive versions.
  schema: ({ image }) => z
    .object({
      // Names
      name: z.string().min(1).max(60),
      sanskrit: z
        .object({
          /** Scholarly spelling with diacritics. Leave out if you are not sure it is correct. */
          iast: z.string().min(1).optional(),
          /** Plain spelling without accent marks (used in titles and search). */
          simple: z.string().min(1),
          /** Devanagari script. Only if checked by someone who reads it. */
          devanagari: z.string().min(1).optional(),
        })
        .optional(),
      alsoKnownAs: z.array(z.string().min(1)).default([]),
      summary: z.string().min(70).max(160),

      // Controlled vocabularies (each value must exist in src/content/taxonomy/*.yaml)
      level: reference('levels'),
      category: reference('poseCategories'),
      alsoIn: z.array(reference('poseCategories')).default([]),
      bodyFocus: z.array(reference('bodyFocus')).min(1).max(4),
      goals: z.array(reference('goals')).default([]),
      props: z.array(reference('props')).min(1),

      // Practice
      sided: z.boolean(),
      holdGuide: z.string().min(1).optional(),
      setup: z.string().min(1).optional(),
      steps: z.array(z.string().min(1)).min(3).max(10),
      breathCue: z.string().min(1).optional(),
      comingOut: z.string().min(1).optional(),
      benefits: z.array(z.string().min(1)).min(1).max(6),
      commonMistakes: z
        .array(z.object({ mistake: z.string().min(1), fix: z.string().min(1) }))
        .default([]),
      modifications: z.array(z.string().min(1)).default([]),

      // Links to other poses (each must be a real pose; checked again in src/lib/poses.js)
      variations: z.array(reference('poses')).default([]),
      relatedPoses: z
        .array(
          z.object({
            pose: reference('poses'),
            relation: z.enum(['preparation', 'progression', 'counter', 'similar']),
          }),
        )
        .default([]),

      // Safety
      cautions: z.array(z.string().min(1)).min(1),
      cautionTypes: z.array(reference('cautionTypes')).default([]),

      // Image (optional, plan §9). Text-only poses simply leave this out.
      // Files live next to the poses: src/content/poses/images/<slug>.<svg|png|jpg|webp>
      // and are referenced relative to the .md file: `src: ./images/<slug>.svg`.
      image: z
        .object({
          /** Path to the file. A wrong path fails the build. */
          src: image(),
          /**
           * REQUIRED. Describe the shape of the body, for someone who cannot see it:
           * where the hands, feet and hips are, and key alignment (e.g. bent knees).
           * 1-2 sentences. Never "image of…" or just "yoga pose".
           */
          alt: z
            .string()
            .trim()
            .min(40, 'Image alt text must be at least 40 characters: describe the shape of the body in the pose.')
            .max(300, 'Image alt text must be 300 characters or fewer (1-2 sentences).')
            .refine((alt) => !LAZY_ALT.test(alt), {
              message: 'Image alt text must describe the pose itself, not start with "Image of…" or say only "yoga pose".',
            }),
          /** Shown under the image when present, e.g. "Illustration: A. Name for YYOGAA". */
          credit: z.string().trim().min(3).optional(),
          /** Who may use it: owned | commissioned | licensed-<source>. Always recorded. */
          license: z.string().regex(/^(owned|commissioned|licensed-[a-z0-9-]+)$/, 'license must be "owned", "commissioned" or "licensed-<source>".'),
          /** Photos of people only: a signed model release exists. */
          modelRelease: z.boolean().optional(),
        })
        .optional(),
      /** none = text only; placeholder = temporary artwork; final = approved artwork. */
      imageStatus: z.enum(['none', 'placeholder', 'final']).default('none'),

      // Sources and tags
      sources: z.array(z.object({ title: z.string().min(1), url: z.url() })).default([]),
      tags: z.array(z.string().regex(SLUG_PATTERN)).default([]),

      // Authorship and review
      author: reference('authors'),
      /**
       * Review status (owner decision: the library must be professionally reviewed before it
       * is treated as authoritative). Shown on the page.
       * - not-reviewed: written, not yet checked by anyone else
       * - self-reviewed: checked by the YYOGAA team against the review checklist
       * - teacher-reviewed: checked by a qualified yoga teacher (needs reviewedBy + reviewedAt)
       */
      reviewStatus: z.enum(['not-reviewed', 'self-reviewed', 'teacher-reviewed']).default('not-reviewed'),
      reviewedBy: reference('authors').optional(),
      reviewedAt: z.coerce.date().optional(),

      // Dates and publishing
      publishedAt: z.coerce.date(),
      updatedAt: z.coerce.date().optional(),
      formerSlugs: z.array(z.string().regex(SLUG_PATTERN)).default([]),
      draft: z.boolean().default(false),
    })
    .superRefine((pose, ctx) => {
      // imageStatus and image must agree.
      if (pose.image && pose.imageStatus === 'none') {
        ctx.addIssue({
          code: 'custom',
          path: ['imageStatus'],
          message: 'This pose has an image, so imageStatus must be "placeholder" or "final" (not "none").',
        });
      }
      if (!pose.image && pose.imageStatus !== 'none') {
        ctx.addIssue({
          code: 'custom',
          path: ['image'],
          message: `imageStatus is "${pose.imageStatus}", so an image (src + alt + license) is required.`,
        });
      }
      // A teacher review must name a real reviewer and a date; never invented.
      if (pose.reviewStatus === 'teacher-reviewed' && (!pose.reviewedBy || !pose.reviewedAt)) {
        ctx.addIssue({
          code: 'custom',
          path: ['reviewStatus'],
          message: 'reviewStatus "teacher-reviewed" needs both reviewedBy and reviewedAt.',
        });
      }
      if (pose.reviewedBy && pose.reviewStatus !== 'teacher-reviewed') {
        ctx.addIssue({
          code: 'custom',
          path: ['reviewedBy'],
          message: 'reviewedBy is only allowed when reviewStatus is "teacher-reviewed".',
        });
      }
    }),
});

export const collections = {
  levels,
  poseCategories,
  bodyFocus,
  props,
  goals,
  cautionTypes,
  authors,
  poses,
};
