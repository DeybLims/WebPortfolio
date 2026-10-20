import { SiteFrame } from "@/components/site-frame";
import { Hero } from "@/components/sections/hero";
import { SignatureDeploymentSection } from "@/components/sections/signature-deployment";
import { SkillsSection } from "@/components/sections/skills";
import { PublicRecordSection } from "@/components/sections/public-record";
import { ProjectsSection } from "@/components/sections/projects";
import { ExperienceSection } from "@/components/sections/experience";
import { SystemArchitectureSection } from "@/components/sections/system-architecture";
import { LiveIDESnippetSection } from "@/components/sections/live-ide-snippet";
import { OperatingManualSection } from "@/components/sections/operating-manual";
import { RecruiterFAQSection } from "@/components/sections/recruiter-faq";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <SiteFrame>
      <Hero />
      <SignatureDeploymentSection />
      <ProjectsSection />
      <SkillsSection />
      <PublicRecordSection />
      <SystemArchitectureSection />
      <LiveIDESnippetSection />
      <ExperienceSection />
      <div className="note-spread">
        <OperatingManualSection />
        <RecruiterFAQSection />
      </div>
      <Footer />
    </SiteFrame>
  );
}
