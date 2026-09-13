import { HorizontalLine } from "@/components/horizontal-line";
import BackgroundSection from "@/components/background-section";
import ProfileSection from "@/components/profile-section";
import WorkExperiences from "@/components/work-experiences";
import Projects from "@/components/projects";
import { GithubGraph } from "@/components/github-graph";
import TechnologySection from "@/components/technology-section";
import BlogSection from "@/components/blog-section";
import GallerySection from "@/components/gallery-section";
import FooterWordsSection from "@/components/footer-words-section";
import FooterGridSection from "@/components/footer-grid-section";
import { TableOfContentDesktop } from "@/components/toc-desktop";

export default function Home() {
  return (
    <>
      {/* Desktop Table of Contents on the left side */}
      <aside className="fixed top-20 left-[max(1.5rem,calc(50vw-20vw-200px))] z-30 hidden xl:block w-40">
        <TableOfContentDesktop />
      </aside>

      <BackgroundSection />
      <HorizontalLine bleed />
      <section id="about" className="scroll-mt-12">
        <ProfileSection />
      </section>
      <HorizontalLine bleed />
      <section id="experience" className="scroll-mt-12">
        <WorkExperiences />
      </section>
      <HorizontalLine bleed />
      <section id="projects" className="scroll-mt-12">
        <Projects />
      </section>
      <section id="github" className="scroll-mt-12">
        <GithubGraph />
      </section>
      <HorizontalLine bleed />
      <section id="technologies" className="scroll-mt-12">
        <TechnologySection />
      </section>
      <HorizontalLine bleed />
      <section id="blog" className="scroll-mt-12">
        <BlogSection />
      </section>
      <HorizontalLine bleed />
      <section id="gallery" className="scroll-mt-12">
        <GallerySection />
      </section>
      <HorizontalLine bleed />
      <FooterWordsSection />
      <HorizontalLine bleed />
      <FooterGridSection />
    </>
  );
}
