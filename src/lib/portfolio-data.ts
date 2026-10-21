import type { PortfolioData } from "@/lib/types";
import {
  buildMasterPublic,
  resumeEmail,
  resumeGitHub,
  resumeJobs,
  resumeLinkedIn,
  resumeSkillGroups,
} from "@/lib/resume-public";

export const portfolioData: PortfolioData = {
  name: "Dave Emanuel G. Lima",
  location: "Iloilo City, Philippines",
  headline: "I am a senior software engineer. I develop tools, websites, and applications.",
  summary: "I am a senior software engineer. I develop tools, websites, and applications.",
  nav: [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  skills: resumeSkillGroups,
  projects: [
    {
      title: "CarPass — QR Vehicle Entry System",
      year: "2026",
      description:
        "Freelance: built a QR vehicle-entry system for a student team's thesis. Each car gets a QR code, and a scan logs the date and time. The public site is a sign-in screen.",
      tags: [],
      links: [
        {
          label: "Visit",
          href: "https://other-projects-qr-carpass-frontend.62.146.237.193.nip.io/dashboard",
        },
      ],
      image: {
        src: "/images/projects/carpass-dashboard.jpg",
        alt: "CarPass dashboard",
      },
      images: [
        {
          src: "/images/projects/carpass-dashboard.jpg",
          alt: "CarPass dashboard",
        },
        {
          src: "/images/projects/carpass-cars.jpg",
          alt: "CarPass list of registered cars, with personal details hidden",
        },
        {
          src: "/images/projects/carpass-register.jpg",
          alt: "Empty CarPass form to register a car",
        },
      ],
      imageFit: "shot",
      problem:
        "A student team needed a vehicle-entry system for their thesis: one QR code per car, and a log of the date and time of each scan.",
      constraints: "",
      solution:
        "Freelance: I built a QR vehicle-entry system for that thesis. The signed-in app has a dashboard, a list of registered cars, and a form to register a car and generate its QR code. The public site stops at a sign-in screen.",
      metrics: "The public page is the sign-in screen.",
    },
    {
      title: "TenantHub",
      description: "A rental and tenant management dashboard built for a private client.",
      tags: [],
      links: [],
      problem: "A private client needed a dashboard for rentals and tenants.",
      constraints: "",
      solution:
        "I built TenantHub as a freelance project: a rental and tenant management dashboard. The work stays private.",
      metrics: "",
    },
    {
      title: "PinPoint — Smart Attendance Platform",
      year: "2025",
      description:
        "Smart geofenced attendance and time-aware student portal built with Laravel and React. Teachers, students, and admins each have dedicated panels: admins create accounts and define classroom geofence points, teachers monitor live attendance, and students sign in from allowed locations and times. The backend enforces GPS and schedule rules, logs time-stamped events, and exposes REST APIs for the frontend.",
      longDescription:
        "PinPoint was built as a thesis-turned-production project to make attendance painless for both faculty and students. It combines a Laravel 9 backend and React SPA front end. Admins configure geofenced classroom locations and school schedules, then onboard students and teachers. Students sign in from their phones within allowed geofences and time windows, while teachers see live attendance dashboards and historical logs. The system enforces business rules on the server, exposes REST endpoints for the web app and future mobile clients, and is designed to be deployed on modern PaaS platforms.",
      tags: ["Laravel", "React", "Geofencing", "Attendance"],
      image: {
        src: "/images/projects/pinpoint.svg",
        alt: "PinPoint attendance logo",
      },
      imageFit: "contain",
      links: [{ label: "Contact", href: "#contact" }],
      problem:
        "Faculty needed trustworthy attendance that reflected real classroom presence without paper sign-in sheets or easy-to-game manual logs. Students needed a mobile-friendly flow that still respected schedules and campus boundaries.",
      constraints:
        "Thesis-grade quality with Laravel 9 + React SPA, deployable architecture, server-enforced rules (not UI-only), and a path toward future mobile clients via REST.",
      solution:
        "Built role-separated panels for admins, teachers, and students; configured geofenced classroom points and time windows; implemented GPS + schedule validation on the server; shipped time-stamped event logs, dashboards for live views, and REST endpoints consumed by the web app.",
      metrics: `Demonstrated a full production-minded loop from requirements to deployable stack.

Geofencing and device variability reinforced designing explicit error states, auditability, and backend as the source of truth.`,
    },
    {
      title: "ERPNext (Frappe) — Internal ERP",
      year: "2025–Present",
      description:
        "Develop and maintain ERP features in Frappe/ERPNext for internal operations customizing workflows and modules to match business processes and keep day-to-day systems reliable.",
      longDescription:
        "At Quirao Group of Companies, this internal ERPNext instance is the backbone for day-to-day operations. I extend and customize Frappe/ERPNext doctypes, workflows, and reports to match real business processes, from approvals to inventory and finance. My work focuses on translating stakeholder requirements into maintainable server-side logic, clear forms, and dashboards while keeping upgrades and performance in mind.",
      tags: ["ERPNext", "Frappe", "Full-stack", "Business Workflows"],
      image: {
        src: "/images/projects/frappe.svg",
        alt: "Frappe logo",
      },
      imageFit: "contain",
      links: [{ label: "Contact", href: "#contact" }],
      problem:
        "Internal teams needed ERP workflows that matched how the business actually operates—not generic defaults—without breaking upgrades or day-to-day reliability.",
      constraints:
        "Frappe/ERPNext platform conventions, stakeholder-driven customization, maintainable server-side logic, and safe iteration alongside live operations.",
      solution:
        "Extended ERPNext with tailored doctypes, workflows, and reports; translated approvals, inventory, and finance-adjacent processes into clear forms and dashboards; kept customizations structured for upgrades and performance.",
      metrics: `Delivered repeatable patterns for turning messy process notes into shippable ERP changes.

Learned to balance stakeholder urgency with long-term maintainability: naming, documentation, and avoiding one-off scripts that become silent debt.`,
    },
    {
      title: "BuildMaster",
      year: "2025–Present",
      description: buildMasterPublic,
      tags: [],
      links: [
        {
          label: "App Store",
          href: "https://apps.apple.com/us/app/buildmasterph/id6757141909",
          badge: "app-store",
        },
        {
          label: "Google Play",
          href: "https://play.google.com/store/apps/details?id=com.buildmasterph",
          badge: "google-play",
        },
      ],
      image: {
        src: "/images/projects/buildmaster-app-store.jpg",
        alt: "BuildMaster listing header on the App Store",
      },
      images: [
        {
          src: "/images/projects/buildmaster-app-store.jpg",
          alt: "BuildMaster listing header on the App Store",
        },
        {
          src: "/images/projects/buildmaster-play.jpg",
          alt: "BuildMaster listing header on Google Play",
        },
        {
          src: "/images/projects/buildmaster-app-store-mobile.jpg",
          alt: "BuildMaster listing header on the App Store, phone width",
        },
        {
          src: "/images/projects/buildmaster-play-mobile.jpg",
          alt: "BuildMaster listing header on Google Play, phone width",
        },
      ],
      imageFit: "shot",
      problem:
        "Contractors, builders and homeowners in the Philippines usually source construction materials by calling several suppliers, comparing prices by hand and chasing deliveries.",
      constraints: "",
      solution:
        "Senior Software Engineer. I own the backend infrastructure behind the mobile app, including the APIs, data, integrations and production reliability. I work with the tech lead, product and QA from design through release.",
      metrics:
        "The app is live on iOS and Android, connecting buyers with verified suppliers in one place. Technical details are under NDA.",
    },
    {
      title: "MSL Philippines Website",
      year: "2025",
      description:
        "I built the React interfaces for the MSL Philippines site, on a Laravel backend. The live site is the official student leader body of Mobile Legends: Bang Bang in the Philippines.",
      tags: ["React", "Laravel", "TypeScript", "RESTful APIs"],
      image: {
        src: "/images/projects/msl-desktop.jpg",
        alt: "MSL Philippines homepage on a desktop browser",
      },
      images: [
        {
          src: "/images/projects/msl-desktop.jpg",
          alt: "MSL Philippines homepage on a desktop browser",
        },
        {
          src: "/images/projects/msl-mobile.jpg",
          alt: "MSL Philippines homepage on a phone",
        },
      ],
      imageFit: "shot",
      links: [{ label: "Visit", href: "https://msl2026.moontonslph.org/" }],
      problem:
        "MSL Philippines needed a public site for student-gamers and campus communities, with programs, events, and news.",
      constraints: "",
      solution:
        "I built and maintained the React interfaces on the Laravel backend, and worked with backend developers on the REST APIs. The site at msl2026.moontonslph.org presents MSL Philippines as the official student leader body of Mobile Legends: Bang Bang in the Philippines.",
      metrics: "The site is live for students and partners.",
    },
    {
      title: "ColorAid",
      year: "2024",
      description:
        "College thesis from 2024. A web app for real-time adaptive color correction for people with color vision deficiencies.",
      longDescription:
        "ColorAid helps people with color vision deficiencies better distinguish colors on screen. Users run through a vision test and then interact with tools that adapt colors in real time using Python, Firebase, and GCP. The goal was to explore accessibility-focused UI and data-driven adjustments, while learning how to ship a small but meaningful product end to end.",
      tags: ["Python", "Firebase", "GCP"],
      image: {
        src: "/images/projects/Logo 1.png",
        alt: "ColorAid logo",
      },
      imageFit: "contain",
      links: [],
      problem:
        "Color vision differences make everyday interfaces harder to parse; users need guided assessment and adaptive rendering—not a one-size palette tweak.",
      constraints:
        "Python + Firebase + GCP stack, accessibility-first UX goals, and a small product scope that still needed a credible end-to-end story.",
      solution:
        "Implemented a vision test flow and real-time adaptive color tooling; connected services on Firebase/GCP to persist progress and support interactive adjustments with acceptable latency.",
      metrics: "2024 college thesis. It is finished, and I do not work on it now.",
    },
    {
      title: "Paluto Reservation Website",
      description:
        "Full-stack reservation app for food orders with a Python backend interfacing with the Google Sheets API and a clean HTML/CSS/JS front end.",
      longDescription:
        "Paluto is a reservation and ordering website that connects customers to a food business. The backend uses Python and the Google Sheets API as a lightweight data store, while the frontend is kept intentionally simple with HTML, CSS, and JavaScript so it can run reliably in low-resource environments. I built the reservation flow, admin views for managing orders, and the integration that keeps Google Sheets data in sync.",
      tags: ["Python", "Google Sheets API", "HTML", "CSS", "JavaScript"],
      links: [],
      problem:
        "A small food business needed reservations without standing up a heavy database—fast to iterate, easy to operate.",
      constraints:
        "Python backend, Google Sheets as lightweight storage, and a deliberately simple HTML/CSS/JS front end for reliability on modest hosting.",
      solution:
        "Built the customer reservation journey and admin views; implemented Sheets-backed persistence and sync logic so orders stayed consistent without over-engineering infrastructure.",
      metrics: `Proved you can ship a real booking loop with boring tech if the data model and validation are disciplined.

Sheets-as-DB is a tradeoff: great for speed, but you earn your keep with careful writes and guardrails.`,
    },
    {
      title: "Story Creation with Gemini",
      year: "2023",
      description:
        "AI app that generates stories from user inputs using the Gemini API, with conversation history and reset support.",
      longDescription:
        "Story Creation with Gemini lets users define prompts such as setting, theme, and character details, then generates complete narratives using the Gemini API. It keeps a running conversation history so users can refine their stories over multiple interactions. The project was a way to experiment with LLM-powered UX, prompt design, and how to present AI responses in a way that feels approachable for non-technical users.",
      tags: ["Streamlit", "Python", "Gemini API"],
      links: [{ label: "GitHub", href: "https://github.com/DeybLims/CCS229-FinalProj" }],
      problem:
        "Non-technical users want iterative storytelling with an LLM, without feeling like they’re “prompt engineering” in a terminal.",
      constraints:
        "Streamlit + Python, Gemini API usage, conversation memory, reset/clear flows, and latency-conscious UX.",
      solution:
        "Shipped prompt-driven story generation with structured inputs, preserved conversation history for refinement passes, and added controls to reset state safely when users wanted a fresh narrative.",
      metrics: `Validated a simple pattern: progressive disclosure beats dumping raw model output.

Learned prompt UX is product design—constraints, examples, and recovery paths matter as much as the model.`,
    },
    {
      title: "Káon",
      year: "2023",
      description:
        "Mobile app for tracking daily food intake and calorie consumption with an intuitive interface and helpful insights.",
      longDescription:
        "Káon is a Flutter mobile app aimed at helping users understand their eating habits. Built with Dart, Flutter, and Python-backed services, it lets users log meals, track calories, and review trends over time. The project focused on mobile UI design patterns, offline-first considerations, and presenting nutrition data in a way that feels friendly instead of overwhelming.",
      tags: ["Dart", "Flutter", "Python"],
      image: {
        src: "/images/projects/kaon.png",
        alt: "Káon app logo",
      },
      imageFit: "contain",
      links: [{ label: "GitHub", href: "https://github.com/DeybLims/CC206_Kaon" }],
      problem:
        "People struggle to build consistent nutrition habits when logging feels like chores and insights feel judgmental.",
      constraints:
        "Flutter/Dart client, Python-backed services, mobile-first UX, and offline-ish considerations for flaky connectivity.",
      solution:
        "Built meal logging, calorie tracking, and trend views with a friendly UI language; structured data flows so summaries stayed understandable as history grew.",
      metrics: `Focused on habit-forming clarity: fewer taps, clearer feedback loops, less "spreadsheet energy."

Mobile performance and empty states are features—if onboarding feels brittle, retention dies early.`,
    },
  ],
  experience: resumeJobs.map((job) => ({
    role: job.role,
    company: job.company,
    location: job.location,
    year: job.dates,
    highlights: job.bullets,
    projects: job.projects,
  })),
  contact: {
    email: resumeEmail,
    github: resumeGitHub,
    linkedin: resumeLinkedIn,
    resumePdfPath: "/Dave_Lima_Resume.pdf",
  },
};

