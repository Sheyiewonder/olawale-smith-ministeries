import PageLayout from "@/components/layout/PageLayout";
import Hero from "@/components/home/Hero";
import ResourceCategories from "@/components/home/ResourceCategories";
import FeaturedResource from "@/components/home/FeaturedResource";
import LatestArticles from "@/components/home/LatestArticles";

export default function Home() {
  return (
    <PageLayout theme="dark">
      <Hero />
      <FeaturedResource />
      <ResourceCategories />
      <LatestArticles />
    </PageLayout>
  );
}