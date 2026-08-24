import Link from "next/link";
import Section from "@/components/layout/Section";

export default function FeaturedResource() {
  return (
    <Section theme="dark" className="py-24 sm:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
        <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                Featured Resource
              </span>
            </div>

            <h2 className="font-[var(--font-bricolage)] text-6xl leading-[0.92] text-ivory sm:text-7xl">
              The Placeholder
              <br />
              <span className="text-gold">Collection</span>
            </h2>

            <p className="mt-8 max-w-lg text-base leading-8 text-ivory/60">
              A placeholder for one of the ministry's featured teachings,
              books or audio resources. This section will automatically pull
              the resource marked as featured from the CMS.
            </p>

            <Link
              href="/resources"
              className="mt-9 inline-flex border border-gold/60 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-charcoal"
            >
              View Resource
            </Link>
          </div>

          <div className="aspect-[4/5] bg-charcoal-soft">
            <div className="flex h-full items-center justify-center border border-white/5">
              <span className="text-[10px] uppercase tracking-[0.35em] text-ivory/25">
                Resource Artwork
              </span>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}