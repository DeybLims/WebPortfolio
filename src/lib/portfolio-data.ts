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
    { title: "Databases", items: ["PostgreSQL", "Firebase", "Google Sheets API"] },
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
      tags: ["Full-stack", "APIs", "Dokploy"],
      image: {
        src: "/images/projects/buildmaster.png",
        alt: "BuildMaster product page screenshot",
      },
      links: [{ label: "Contact", href: "#contact" }],
    },
    {
      title: "ColorAid",
      year: "2024",
      description:
        "Web app integrating real-time adaptive color correction for individuals with color vision deficiencies.",
      tags: ["Python", "Flask", "Firebase", "GCP"],
      links: [{ label: "GitHub", href: "https://github.com/DeybLims" }],
    },
    {
      title: "Paluto Reservation Website",
      description:
        "Full-stack reservation app for food orders with a Python backend interfacing with the Google Sheets API and a clean HTML/CSS/JS front end.",
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
      tags: ["Streamlit", "Python", "Gemini API"],
      links: [{ label: "GitHub", href: "https://github.com/DeybLims" }],
    },
    {
      title: "Káon",
      year: "2023",
      description:
        "Mobile app for tracking daily food intake and calorie consumption with an intuitive interface and helpful insights.",
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
  ],
  contact: {
    email: "daveemanuel.lima@wvsu.edu.ph",
    github: "https://github.com/DeybLims",
  },
};

