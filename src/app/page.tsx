import { SiteNav } from "@/components/site-nav";
import { Hero } from "@/components/sections/hero";
import { SkillsSection } from "@/components/sections/skills";
import { ProjectsSection } from "@/components/sections/projects";
import { ExperienceSection } from "@/components/sections/experience";
import { SystemArchitectureSection } from "@/components/sections/system-architecture";
import { Footer } from "@/components/sections/footer";
import { FloatingPageArtifacts } from "@/components/floating-page-artifacts";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-zinc-950 dark:bg-black dark:text-white">
      <SiteNav />
      <FloatingPageArtifacts />
      <main id="content" className="overflow-x-hidden">
        <Hero />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <ProjectsSection />
          <SkillsSection />
          <SystemArchitectureSection />
          <ExperienceSection />
          <Footer />
        </div>
      </main>
    </div>
  );
}
