import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/sections/hero";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { ExperienceSection } from "@/components/sections/experience";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      <SiteNav />
      <main id="content">
        <Hero />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ProjectsSection />
          <SkillsSection />
          <ExperienceSection />
          <Footer />
        </div>
      </main>
    </div>
  );
}
