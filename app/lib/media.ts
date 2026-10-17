/**
 * Cloudinary delivery URLs for uploaded media (team avatars, project covers,
 * service images) were served as-is: 2 MB PNG avatars displayed at ~300 px.
 * Cloudinary resizes and re-encodes on the fly when transformation flags sit
 * right after /image/upload/:
 *   f_auto  — WebP/AVIF for browsers that accept them
 *   q_auto  — perceptual quality instead of lossless
 *   c_limit — scale down to `width`, never up
 *
 * Any other URL (local uploads, S3, already-transformed Cloudinary URLs) is
 * returned unchanged.
 */
const CLOUDINARY_UPLOAD = /^(https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\/)(.+)$/;

/** First path segment is a transformation if it isn't a version (v123…) or folder. */
const TRANSFORMATION_SEGMENT = /^[a-z]{1,3}_[^/]*(,[a-z]{1,3}_[^/]*)*$/;

export function optimizeMediaUrl(url: string, width: number): string {
  const match = url ? CLOUDINARY_UPLOAD.exec(url) : null;
  if (!match) return url;

  const [, prefix, rest] = match;
  if (TRANSFORMATION_SEGMENT.test(rest.split("/")[0])) return url;

  return `${prefix}f_auto,q_auto,c_limit,w_${Math.round(width)}/${rest}`;
}
