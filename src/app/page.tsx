import PageLayout from "@/components/layout/PageLayout";
import Hero from "@/components/home/Hero";
import ResourceCategories from "@/components/home/ResourceCategories";
import FeaturedResource from "@/components/home/FeaturedResource";
// import LatestArticles from "@/components/home/LatestArticles";
import InviteSection from "@/components/home/InviteSection";
import PartnerSection from "@/components/home/PartnerSection";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  return (
    <PageLayout theme="dark">
      <Hero />
      <AboutSection />
      <FeaturedResource />
      <ResourceCategories />
      {/* <LatestArticles /> */}
      <InviteSection />
      <PartnerSection />
    </PageLayout>
  );
}