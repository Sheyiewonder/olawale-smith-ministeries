import Navbar from "@/components/navigation/Navbar";
import Hero from "@/components/home/Hero";
import ResourceCategories from "@/components/home/ResourceCategories";
import FeaturedResource from "@/components/home/FeaturedResource";
import LatestArticles from "@/components/home/LatestArticles";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />

      <Hero />

      <FeaturedResource />

      <ResourceCategories />

      <LatestArticles />
    </main>
  );
}