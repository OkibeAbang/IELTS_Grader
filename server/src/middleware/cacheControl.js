/**
 * Sets a public Cache-Control header for routes serving content that's
 * identical for every user (the static reading/listening/speaking/writing
 * banks) — lets the browser (and any CDN in front of it) skip the network
 * entirely on a repeat visit instead of re-fetching 100KB+ of JSON every
 * time. Content only changes when a new batch is deployed, so a modest
 * max-age trades a little staleness for a lot less repeat load.
 */
export function cacheControl(maxAgeSeconds) {
  return (_req, res, next) => {
    res.set("Cache-Control", `public, max-age=${maxAgeSeconds}`);
    next();
  };
}
