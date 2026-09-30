// Helpers for the pose library.
//
// Why this file exists: Astro's schema checks the SHAPE of every pose file, but in
// Astro 7 a reference to something that does not exist (e.g. `level: beginer` or a related
// pose `tree-pos`) is only printed as an error; the build still carries on. The plan
// (§6.3) asks for a "second safety net", so every page in the library gets its poses from
// getPublishedPoses(), which checks all references and THROWS. A thrown error stops
// `npm run build`, so a broken pose file can never reach the live site.
import { getCollection, getEntry } from 'astro:content';

const SLUG_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// The taxonomy/author fields on a pose, and which collection each one points to.
const SINGLE_REFS = {
  level: 'levels',
  category: 'poseCategories',
  author: 'authors',
  reviewedBy: 'authors',
};
const LIST_REFS = {
  alsoIn: 'poseCategories',
  bodyFocus: 'bodyFocus',
  goals: 'goals',
  props: 'props',
  cautionTypes: 'cautionTypes',
  variations: 'poses',
};

const where = (poseId, field) => `src/content/poses/${poseId}.md → ${field}`;

let validated; // production builds run the checks once, not once per page

/** Checks every pose's slug and references. Throws one error listing every problem found. */
async function validateAllPoses() {
  const poses = await getCollection('poses');
  const poseIds = new Set(poses.map((p) => p.id));
  const problems = [];

  const checkRef = async (poseId, field, ref) => {
    if (!ref) return;
    const found = ref.collection === 'poses' ? poseIds.has(ref.id) : await getEntry(ref.collection, ref.id);
    if (!found) {
      problems.push(`${where(poseId, field)}: "${ref.id}" does not exist in "${ref.collection}".`);
    }
  };

  for (const pose of poses) {
    const { id, data } = pose;

    if (!SLUG_PATTERN.test(id)) {
      problems.push(
        `src/content/poses/${id}.md: the file name must be lowercase a-z, 0-9 and single hyphens (e.g. "downward-facing-dog.md").`,
      );
    }

    for (const [field] of Object.entries(SINGLE_REFS)) {
      await checkRef(id, field, data[field]);
    }
    for (const [field] of Object.entries(LIST_REFS)) {
      for (const [i, ref] of (data[field] ?? []).entries()) {
        await checkRef(id, `${field}[${i}]`, ref);
      }
    }
    for (const [i, rel] of data.relatedPoses.entries()) {
      await checkRef(id, `relatedPoses[${i}].pose`, rel.pose);
      if (rel.pose.id === id) problems.push(`${where(id, `relatedPoses[${i}].pose`)}: a pose cannot be related to itself.`);
    }

    // A former slug must not clash with a current pose.
    for (const old of data.formerSlugs) {
      if (poseIds.has(old)) problems.push(`${where(id, 'formerSlugs')}: "${old}" is still used by another pose.`);
    }
  }

  if (problems.length) {
    throw new Error(`Pose library check failed:\n  - ${problems.join('\n  - ')}`);
  }
  return poses;
}

/** Every pose that should be built. Drafts are included in `npm run dev` only. */
export async function getPublishedPoses() {
  // Cache in production builds only; in `npm run dev` re-check after every edit.
  const poses = import.meta.env.PROD ? await (validated ??= validateAllPoses()) : await validateAllPoses();
  const visible = import.meta.env.PROD ? poses.filter((p) => !p.data.draft) : poses;
  return visible.sort((a, b) => a.data.name.localeCompare(b.data.name, 'en'));
}

/**
 * Looks up one pose by ID and throws a clear error if it does not exist.
 * Returns null (with a build warning) if it is a draft in production, so links to
 * unfinished poses are hidden rather than broken.
 */
export async function requirePose(id, context = 'a pose reference') {
  const pose = await getEntry('poses', id);
  if (!pose) throw new Error(`${context}: pose "${id}" does not exist.`);
  if (import.meta.env.PROD && pose.data.draft) {
    console.warn(`[pose library] ${context}: "${id}" is a draft, so the link is hidden.`);
    return null;
  }
  return pose;
}

/** Turns a list of references into their full entries (name, description, text…). */
export async function resolveAll(refs = []) {
  const entries = await Promise.all(refs.map((ref) => getEntry(ref.collection, ref.id)));
  return entries.filter(Boolean);
}

/** Resolves one reference, or returns undefined if it is not set. */
export async function resolveOne(ref) {
  return ref ? getEntry(ref.collection, ref.id) : undefined;
}

/** Link to a pose page. One place to change if the URL pattern ever changes. */
export const poseUrl = (id) => `/yoga/poses/${id}`;

/** Human-readable date, e.g. "30 September 2026". Uses UTC so the date never shifts. */
export const formatDate = (date) =>
  date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
