/** Public booking link. `NEXT_PUBLIC_CALENDLY_URL` overrides this at build time. */
export const calendlyUrl =
  process.env.NEXT_PUBLIC_CALENDLY_URL?.trim() || "https://calendly.com/davelima2/30min";
