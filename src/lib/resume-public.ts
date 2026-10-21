/** NDA-safe public résumé. The PDF and the site timeline both read this. */

export const resumeEmail = "davelima2@gmail.com";
export const resumeLinkedIn = "https://www.linkedin.com/in/dave-emanuel-lima-a65856326";
export const resumeGitHub = "https://github.com/DeybLims";

export const resumeIdentity = {
  name: "Dave Emanuel G. Lima",
  contact: `Iloilo City, Iloilo, Philippines · ${resumeEmail} · github.com/DeybLims · LinkedIn · davelims.vercel.app`,
};

export const resumeSummary =
  "I am a senior software engineer in Iloilo. I build production web and mobile systems, and I am comfortable owning APIs, product features, and database work from implementation through testing and release.";

export type ResumeJob = {
  role: string;
  dates: string;
  company: string;
  location?: string;
  bullets: string[];
  projects: string[];
};

export const resumeJobs: ResumeJob[] = [
  {
    role: "Software Engineer (Junior → Senior)",
    dates: "November 2025 – Present",
    company: "Quirao Group of Companies",
    location: "La Paz, Iloilo City",
    bullets: [
      "Started as a Junior Software Engineer and was promoted to Senior, taking ownership of backend APIs, mobile/web features, and production reliability.",
      "Shipped features end-to-end with product and QA — design, implementation, testing, code review, and release.",
      "Administered application databases, keeping data integrity, security, and availability across platforms.",
    ],
    projects: [
      "BuildMaster — Commercial construction product. Details under NDA.",
      "Quirao Group ERP (Frappe / ERPNext): Customized the company ERP on Frappe/ERPNext for operations, finance, and inventory across Quirao Group of Companies. Implemented DocTypes, workflows, reports, and role-based permissions to match internal processes. Supported integration, deployment, data setup, and day-to-day process improvements.",
    ],
  },
  {
    role: "Web Development Intern, Web Dev / Tech Ops Team",
    dates: "January 2025 – April 2025",
    company: "Quirao Group of Companies",
    location: "La Paz, Iloilo City",
    bullets: [
      "Built and deployed the Unli-Paluto reservation system for a local dining brand: mobile-first UI, unique reservation IDs, and HTTP(S) uptime monitoring.",
      "QA-tested web and Android builds of a commercial e-commerce platform (under NDA), documenting bugs and acceptance criteria for the dev team.",
      "Managed backend product data: bulk CSV uploads, SKU and inventory cleanup, and category standardization.",
      "Wrote admin, logistics, and POS user manuals, a driver FAQ, and video tutorials; helped onboard and train delivery staff.",
    ],
    projects: [],
  },
  {
    role: "Freelance Web Developer",
    dates: "",
    company: "Independent / Contract",
    location: "Iloilo, Philippines",
    bullets: [
      "Designed, built, and delivered three production systems for clients — from requirements through deployment and handoff.",
    ],
    projects: [
      "TenantHub — A rental and tenant management dashboard built for a private client.",
      "PinPoint — Geofenced Attendance System: Attendance system using geofencing so students can sign in only when they are physically inside the classroom. Blocked remote check-ins and stored timestamped attendance logs.",
      "CarPass — QR Vehicle Entry System: Freelance: built a QR vehicle-entry system for a student team's thesis. Each car has a unique QR code, and each scan logs the date and time. The public page is a sign-in screen.",
    ],
  },
  {
    role: "Front-End Web Developer",
    dates: "2025",
    company: "MSL Philippines",
    bullets: [
      "Built and maintained React (JSX/TSX) interfaces on a Laravel backend.",
      "Worked with backend developers on REST APIs for reliable data flow and performance.",
      "Used responsive, component-based patterns so the UI stayed maintainable as it grew.",
      "Helped improve front-end build process and code quality with consistent tooling.",
    ],
    projects: [],
  },
];

export const resumeSkillGroups: { title: string; items: string[] }[] = [
  {
    title: "Frontend",
    items: [
      "React.js (JSX/TSX)",
      "Flutter (Dart)",
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "Expo / React Native",
    ],
  },
  {
    title: "Backend",
    items: ["Node.js", "Laravel", "Python (Flask, Streamlit)", "REST APIs", "Google Cloud Functions", "Hono"],
  },
  {
    title: "Database",
    items: ["MySQL", "PostgreSQL", "Firebase (Realtime DB & Firestore)", "SQL"],
  },
  {
    title: "ERP",
    items: ["Frappe", "ERPNext", "Oracle"],
  },
  {
    title: "Cloud & tools",
    items: [
      "Vercel",
      "GCP",
      "Render",
      "Firebase Hosting",
      "Git",
      "GitHub",
      "Figma",
      "Jira",
      "Selenium",
      "Canva",
    ],
  },
];

export const resumeReferences = "Available upon request.";

export const buildMasterPublic = "Commercial construction product. Details under NDA.";
