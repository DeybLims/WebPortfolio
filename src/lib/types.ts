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
  /** Case study: metrics, outcomes, and lessons learned (use blank lines for multiple callouts) */
  metrics: string;
  tags: string[];
  links: ProjectLink[];
  image?: {
    src: string;
    alt: string;
  };
  imageFit?: "cover" | "contain";
  year?: string;
};

export type ExperienceItem = {
  role: string;
  company: string;
  location?: string;
  year: string;
  highlights: string[];
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
    /** Public URL for resume PDF (e.g. `/Dave_Lima_Resume.pdf` in `public/`) */
    resumePdfPath?: string;
  };
};

