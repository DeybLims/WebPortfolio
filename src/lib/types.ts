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
  };
};

