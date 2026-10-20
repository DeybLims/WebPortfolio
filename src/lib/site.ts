export function siteUrl() {
  const value = process.env.NEXT_PUBLIC_SITE_URL ?? "https://davelims.vercel.app";
  return value.replace(/\/$/, "");
}
