import { SiteFrame } from "@/components/site-frame";
import { Hero } from "@/components/sections/hero";
import { WritingSection } from "@/components/sections/writing";
import { listPublishedPosts } from "@/lib/blog";
import { SignatureDeploymentSection } from "@/components/sections/signature-deployment";
import { SkillsSection } from "@/components/sections/skills";
import { PublicRecordSection } from "@/components/sections/public-record";
import { DeferredDemos } from "@/components/sections/deferred-demos";
import { ProjectsSection } from "@/components/sections/projects";
import { EducationSection, ExperienceSection } from "@/components/sections/experience";
import { OperatingManualSection } from "@/components/sections/operating-manual";
import { RecruiterFAQSection } from "@/components/sections/recruiter-faq";
import { Footer } from "@/components/sections/footer";

export const revalidate = 60;

export default async function Home() {
  const posts = await listPublishedPosts();
  const latest = posts.slice(0, 3);

  return (
    <SiteFrame writing={latest}>
      <Hero />
      <SignatureDeploymentSection />
      <ProjectsSection />
      <WritingSection posts={latest} />
      <SkillsSection />
      <PublicRecordSection />
      <DeferredDemos />
      <ExperienceSection />
      <EducationSection />
      <div className="note-spread">
        <OperatingManualSection />
        <RecruiterFAQSection />
      </div>
      <Footer />
    </SiteFrame>
  );
}
