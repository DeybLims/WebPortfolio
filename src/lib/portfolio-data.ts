import type { PortfolioData } from "@/lib/types";

export const portfolioData: PortfolioData = {
  name: "Dave Emanuel G. Lima",
  location: "Iloilo City, Philippines",
  headline:
    "Versatile Software Developer specializing in full-stack web and mobile application development.",
  summary:
    "Skilled in building data-driven and AI-powered solutions using modern technologies. Passionate about developing innovative tools that solve practical problems and collaborating in team environments to deliver impactful digital experiences.",
  nav: [
    { label: "Projects", href: "#projects" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Contact", href: "#contact" },
  ],
  skills: [
    {
      title: "Frontend",
      items: [
        "React.js",
        "Next.js",
        "Flutter (Dart)",
        "HTML5/CSS3",
        "Tailwind CSS",
        "Laravel",
      ],
    },
    {
      title: "Backend",
      items: [
        "Python (Flask, Streamlit)",
        "Frappe / ERPNext",
        "Node.js",
        "RESTful APIs",
        "Google Cloud Functions",
      ],
    },
    {
      title: "Databases",
      items: ["PostgreSQL", "MySQL", "MariaDB", "Firebase", "Google Sheets API"],
    },
    {
      title: "Cloud/Deploy",
      items: [
        "Vercel",
        "Google Cloud Platform",
        "Render.com",
        "DigitalOcean",
        "Contabo",
        "Dokploy",
      ],
    },
    { title: "Tools", items: ["Git", "GitHub", "Figma", "Postman", "Jira"] },
  ],
  projects: [
    {
      title: "PinPoint — Smart Attendance Platform",
      year: "2024",
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
    },
    {
      title: "ERPNext (Frappe) — Internal ERP",
      year: "2026",
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
    },
    {
      title: "BuildMaster App & Website",
      description:
        "Started as an intern and was hired as a Junior Software Engineer. Shipped new features for the website and built API endpoints to support the mobile team, while keeping deployments healthy through routine checkups.",
      longDescription:
        "BuildMaster is a commercial construction marketplace where I contributed first as an intern and later as a Junior Software Engineer. I owned full-stack tickets on the web app: building new UX flows, refactoring legacy views, and wiring them to new and existing APIs. I also designed and implemented REST endpoints used by a separate mobile team, making sure contracts, validation, and error handling were solid. Part of the role involved monitoring deployments and health checks via Dokploy, helping keep the platform stable for end users.",
      tags: ["Full-stack", "APIs", "Dokploy"],
      image: {
        src: "/images/projects/buildmaster.png",
        alt: "BuildMaster product page screenshot",
      },
      links: [
        { label: "Website", href: "https://buildmaster.ph" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "MSL Philippines Website",
      year: "2026",
      description:
        "Front-end development for the official MSL Philippines website, building dynamic interfaces with React and Laravel integration.",
      longDescription:
        "MSL Philippines is the official website for Mobile Legends: Bang Bang esports in the Philippines. I developed and maintained dynamic user interfaces using React (JSX/TSX) within a Laravel-based backend framework. The role involved collaborating with backend developers to integrate RESTful APIs, applying responsive design principles, and implementing component-based architecture for a scalable, maintainable UI.",
      tags: ["React", "Laravel", "TypeScript", "RESTful APIs"],
      image: {
        src: "/images/projects/MSL.png",
        alt: "MSL Philippines website screenshot",
      },
      links: [
        { label: "Website", href: "https://www.moontonslph.org" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "ColorAid",
      year: "2024",
      description:
        "Web app integrating real-time adaptive color correction for individuals with color vision deficiencies.",
      longDescription:
        "ColorAid helps people with color vision deficiencies better distinguish colors on screen. Users run through a vision test and then interact with tools that adapt colors in real time using Python, Flask, Firebase, and GCP. The goal was to explore accessibility-focused UI and data-driven adjustments, while learning how to ship a small but meaningful product end to end.",
      tags: ["Python", "Flask", "Firebase", "GCP"],
      image: {
        src: "/images/projects/Logo 1.png",
        alt: "ColorAid logo",
      },
      imageFit: "contain",
      links: [{ label: "GitHub", href: "https://github.com/DeybLims" }],
    },
    {
      title: "Paluto Reservation Website",
      description:
        "Full-stack reservation app for food orders with a Python backend interfacing with the Google Sheets API and a clean HTML/CSS/JS front end.",
      longDescription:
        "Paluto is a reservation and ordering website that connects customers to a food business. The backend uses Python and the Google Sheets API as a lightweight data store, while the frontend is kept intentionally simple with HTML, CSS, and JavaScript so it can run reliably in low-resource environments. I built the reservation flow, admin views for managing orders, and the integration that keeps Google Sheets data in sync.",
      tags: ["Python", "Google Sheets API", "HTML", "CSS", "JavaScript"],
      links: [
        {
          label: "Live",
          href: "https://unli-paluto.render.com/unli-paluto",
        },
      ],
    },
    {
      title: "Story Creation with Gemini",
      year: "2023",
      description:
        "AI app that generates stories from user inputs using the Gemini API, with conversation history and reset support.",
      longDescription:
        "Story Creation with Gemini lets users define prompts such as setting, theme, and character details, then generates complete narratives using the Gemini API. It keeps a running conversation history so users can refine their stories over multiple interactions. The project was a way to experiment with LLM-powered UX, prompt design, and how to present AI responses in a way that feels approachable for non-technical users.",
      tags: ["Streamlit", "Python", "Gemini API"],
      links: [{ label: "GitHub", href: "https://github.com/DeybLims" }],
    },
    {
      title: "Káon",
      year: "2023",
      description:
        "Mobile app for tracking daily food intake and calorie consumption with an intuitive interface and helpful insights.",
      longDescription:
        "Káon is a Flutter mobile app aimed at helping users understand their eating habits. Built with Dart, Flutter, and Python-backed services, it lets users log meals, track calories, and review trends over time. The project focused on mobile UI design patterns, offline-first considerations, and presenting nutrition data in a way that feels friendly instead of overwhelming.",
      tags: ["Dart", "Flutter", "Python"],
      links: [{ label: "GitHub", href: "https://github.com/DeybLims" }],
    },
  ],
  experience: [
    {
      role: "Junior ERPNext Developer",
      company: "Quirao Group of Companies",
      location: "La Paz, Iloilo City",
      year: "2026",
      highlights: [
        "Develop and maintain ERP features using Frappe/ERPNext to support internal operations.",
        "Build, customize, and improve ERP workflows and modules based on business requirements.",
        "Collaborate with stakeholders to translate processes into reliable, maintainable ERP solutions.",
        "Support deployments and operational checkups to keep systems stable and available.",
      ],
    },
    {
      role: "Front-End Web Developer",
      company: "MSL Philippines",
      year: "2026",
      highlights: [
        "Developed and maintained dynamic user interfaces using React (JSX/TSX) within a Laravel-based backend framework.",
        "Collaborated with backend developers to integrate RESTful APIs for seamless data flow and performance.",
        "Applied responsive design principles and component-based architecture for scalable, maintainable UI.",
        "Improved front-end build processes and code quality through modern development practices and tooling.",
      ],
    },
    {
      role: "Junior Software Engineer (formerly Intern)",
      company: "BuildMaster",
      year: "2025–2026",
      highlights: [
        "Started as an intern and transitioned into a Junior Software Engineer role.",
        "Developed and shipped new features for the website (full-stack ownership where needed).",
        "Built backend API endpoints to support mobile development (handoff to a dedicated mobile developer).",
        "Performed deployment checkups and basic operational monitoring using Dokploy.",
      ],
    },
  ],
  contact: {
    email: "daveemanuel.lima@wvsu.edu.ph",
    github: "https://github.com/DeybLims",
  },
};

