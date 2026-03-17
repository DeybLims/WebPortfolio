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
        "Node.js",
        "RESTful APIs",
        "Google Cloud Functions",
      ],
    },
    { title: "Databases", items: ["PostgreSQL", "Firebase", "Google Sheets API"] },
    { title: "Cloud/Deploy", items: ["Vercel", "Google Cloud Platform", "Render.com"] },
    { title: "Tools", items: ["Git", "GitHub", "Figma", "Postman", "Jira"] },
  ],
  projects: [
    {
      title: "BuildMaster App & Website",
      description:
        "Improved user experience through front-end development while ensuring quality via QA testing and maintaining reliable data workflows through database administration.",
      tags: ["Frontend", "QA", "Database Admin"],
      links: [{ label: "GitHub", href: "https://github.com/DeybLims" }],
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
      role: "Web Developer",
      company: "Quirao Group of Companies",
      location: "La Paz, Iloilo City",
      year: "2025",
      highlights: [
        "Oversaw QA for internal web and mobile applications to ensure optimal functionality, performance, and user experience.",
        "Administered and maintained company databases, ensuring integrity, security, and availability across platforms.",
        "Led the development and deployment of reservation-based websites, streamlining customer booking processes.",
        "Collaborated with cross-functional teams to deliver scalable and responsive web solutions.",
      ],
    },
    {
      role: "Front-End Web Developer",
      company: "MSL Philippines",
      year: "2025",
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

