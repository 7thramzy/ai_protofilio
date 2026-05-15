import { LangProvider } from "@/contexts/LangContext";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Skills } from "@/components/Skills";
import { Projects } from "@/components/Projects";
import { Experience } from "@/components/Experience";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { Chatbot } from "@/components/Chatbot";
import { CustomSections } from "@/components/CustomSections";
import { ReadingProgress } from "@/components/ReadingProgress";

const Index = () => {
  return (
    <LangProvider>
      <div className="min-h-screen">
        <ReadingProgress />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Skills />
          <Projects />
          <Experience />
          <CustomSections />
          <Contact />
        </main>
        <Footer />
        <Chatbot />
      </div>
    </LangProvider>
  );
};

export default Index;
