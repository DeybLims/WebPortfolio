export type NavItem = {
  label: string;
  href: string;
};

export type SkillGroup = {
  title: string;
  items: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
  /** Renders a theme-safe store badge. The label is the accessible name. */
  badge?: "app-store" | "google-play";
};

export type Project = {
  title: string;
  description: string;
  longDescription?: string;
  /** Case study: problem statement */
  problem: string;
  /** Case study: technical / business constraints */
  constraints: string;
  /** Case study: what you shipped (solution) */
  solution: string;
  /** Public result. Leave empty when the only outcome is still a TODO. */
  metrics: string;
  /**
   * Notes for Dave. Never render these. They are placeholders for numbers
   * he still needs to confirm.
   */
  metricTodos?: string[];
  tags: string[];
  links: ProjectLink[];
  /** When true, hide stack tags. Description stays the NDA sentence. */
  nda?: boolean;
  image?: {
    src: string;
    alt: string;
  };
  /** Extra screenshots for the project page. `image` is the first, if set. */
  images?: {
    src: string;
    alt: string;
  }[];
  imageFit?: "cover" | "contain" | "shot";
  year?: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  location?: string;
  year: string;
  highlights: string[];
  projects?: string[];
};

export type PortfolioData = {
  name: string;
  location: string;
  headline: string;
  summary: string;
  nav: NavItem[];
  skills: SkillGroup[];
  projects: Project[];
  experience: ExperienceItem[];
  contact: {
    email: string;
    github: string;
    linkedin: string;
    /** Public URL for resume PDF (e.g. `/Dave_Lima_Resume.pdf` in `public/`) */
    resumePdfPath?: string;
  };
};

