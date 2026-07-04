import Navbar from "@/components/home/Navbar";
import HeroAndShowcase from "@/components/home/HeroAndShowcase";
import ClientLogos from "@/components/home/ClientLogos";
import SuccessStories from "@/components/home/SuccessStories";
import Services from "@/components/home/Services";
import FactoryTour from "@/components/home/FactoryTour";
import Sliderfabrica from "@/components/home/Sliderfabrica";
import CTASection from "@/components/home/CTASection";
import FAQSection from "@/components/home/FAQSection";
import Footer from "@/components/home/Footer";
import { getContent } from "@/app/lib/content";

export const dynamic = "force-dynamic";


export default async function Home() {
  const content = await getContent();

  return (
    <div className="min-h-screen w-full flex flex-col font-sans antialiased bg-gradient-to-t from-neutral-50 via-neutral-50 to-orange-200/50 overflow-x-clip selection:bg-orange-200/80 selection:text-orange-950">

      {/* Navigation Header */}
      <Navbar data={content?.navbar} categories={content?.heroAndShowcase?.categories} />

      {/* Main Sections */}
      <main className="flex-1 w-full flex flex-col items-center">
        {/* Scrolllytelling Hero & Category Showcase */}
        <HeroAndShowcase data={content?.heroAndShowcase} />

        {/* Full-width manufacturer slider banner */}
        <Sliderfabrica data={content?.sliderFabrica} />

        {/* Partners Marquee Roller */}
        <ClientLogos data={content?.clientLogos} />

        {/* Case Studies Display */}
        <SuccessStories data={content?.successStories} />

        {/* Services List Grid */}
        <Services data={content?.services} />

        {/* Factory Interactive Hotspots Tour */}
        <FactoryTour data={content?.factoryTour} />



        {/* Call to Action Slogan Panel */}
        <CTASection data={{ ...content?.ctaSection, logoTypo: content?.navbar?.logoWhite }} />

        {/* Frequently Asked Questions */}
        <FAQSection data={content?.faqSection} />
      </main>

      {/* Footer Branding Navigation */}
      <Footer data={content?.footer} />

    </div>
  );
}

