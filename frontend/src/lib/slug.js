// Turn a title into a URL-friendly slug. "Dietlytic AI" -> "dietlytic-ai"
export function slugify(str) {
  return (str || '')
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
