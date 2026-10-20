export type WritingNavItem = {
  slug: string;
  title: string;
};

export type PostSummary = WritingNavItem & {
  excerpt: string | null;
  tags: string[];
  published_at: string | null;
  cover_image_url: string | null;
};

export type Post = PostSummary & {
  id: string;
  content: string;
  published: boolean;
  updated_at: string;
};

export type PostInput = {
  id: string | null;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  tags: string[];
  cover_image_url: string | null;
  published: boolean;
  published_at: string | null;
  previousSlug: string | null;
};
