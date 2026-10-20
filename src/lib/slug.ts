export function slugify(value: string) {
  const slug = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
  return slug;
}

export function isSlug(value: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 80;
}
