/** NDA-safe public résumé. The PDF and the site timeline both read this. */

export const resumeIdentity = {
  name: "Dave Emanuel G. Lima",
  contact:
    "Iloilo City, Iloilo, Philippines · daveemanuel.lima@wvsu.edu.ph · github.com/DeybLims · davelims.vercel.app",
};

export const resumeSummary =
  "Software engineer with hands-on experience in full-stack web and mobile development. Builds production systems using React, TypeScript, Expo/React Native, Hono, Laravel, Python, Flutter, Firebase, and Frappe/ERPNext. Comfortable owning APIs, product features, and database work from implementation through testing and release.";

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
    role: "Freelance Web Developer",
    dates: "",
    company: "Independent / Contract",
    location: "Iloilo, Philippines",
    bullets: [
      "Designed, built, and delivered two production systems for clients — from requirements through deployment and handoff.",
    ],
    projects: [
      "PinPoint — Geofenced Attendance System: Attendance system using geofencing so students can sign in only when they are physically inside the classroom. Blocked remote check-ins and stored timestamped attendance logs.",
      "CarPass — QR Vehicle Entry System: Vehicle entry system that scans a unique QR code per car when it enters an establishment. Logged the date and time of each scan for a clear entry history.",
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
      "Expo / React Native",
      "Flutter (Dart)",
      "HTML5",
      "CSS3",
      "JavaScript",
      "TypeScript",
      "Laravel",
    ],
  },
  {
    title: "Backend",
    items: ["Hono", "Node.js", "Python (Flask, Streamlit)", "REST APIs", "Google Cloud Functions"],
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
