import Link from "next/link";
import Section from "@/components/layout/Section";

export default function FeaturedResource() {
  return (
    <Section
      theme="dark"
      className="relative overflow-hidden py-24 sm:py-32 lg:py-40"
    >
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Cool blue atmosphere */}
        <div className="absolute right-[-8%] top-[12%] h-[520px] w-[520px] rounded-full bg-blue/10 blur-[140px]" />

        <div className="absolute left-[-12%] bottom-[-18%] h-[460px] w-[460px] rounded-full bg-blue-soft/8 blur-[130px]" />

        {/* Warm gold counterbalance */}
        <div className="absolute left-[18%] top-[28%] h-[320px] w-[320px] rounded-full bg-gold/7 blur-[110px]" />

        {/* Directional blue light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_35%,rgba(59,130,208,0.10),transparent_34%)]" />

        {/* Subtle transition */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-deep/15 to-transparent" />

        {/* Fine architectural line */}
        <div className="absolute right-0 top-1/2 h-px w-[35%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
          {/* Content */}
          <div>
            <div className="mb-8 flex items-center gap-4">
              <span className="h-px w-12 bg-gold" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                Featured Resource
              </span>
            </div>

            <h2 className="font-[var(--font-bricolage)] text-6xl leading-[0.92] text-ivory sm:text-7xl lg:text-[6.5rem]">
              The Placeholder
              <br />
              <span className="relative inline-block text-gold">
                Collection
                <span className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70" />
              </span>
            </h2>

            <p className="mt-8 max-w-lg text-base leading-8 text-ivory/60">
              A placeholder for one of the ministry&apos;s featured teachings,
              books or audio resources. This section will automatically pull
              the resource marked as featured from the CMS.
            </p>

            <Link
              href="/resources"
              className="group mt-9 inline-flex min-w-[190px] items-center justify-center border border-gold/60 bg-transparent px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-charcoal"
            >
              <span>View Resource</span>

              <span className="ml-3 h-px w-0 bg-charcoal transition-all duration-300 group-hover:w-5" />
            </Link>
          </div>

          {/* Featured artwork */}
          <div className="group relative">
            {/* Outer glow */}
            <div className="absolute -inset-5 rounded-[2px] bg-blue/5 opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-100" />

            <div className="relative aspect-[4/5] overflow-hidden border border-white/10 bg-charcoal-soft">
              {/* Blue atmospheric wash */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-deep/20 via-transparent to-gold/5" />

              {/* Artwork frame */}
              <div className="absolute inset-5 border border-blue-soft/15 transition-colors duration-500 group-hover:border-blue-soft/30" />

              {/* Architectural rings */}
              <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full border border-blue-soft/10 transition-transform duration-700 group-hover:scale-105" />

              <div className="absolute -right-4 top-8 h-52 w-52 rounded-full border border-gold/10" />

              <div className="absolute bottom-[-80px] left-[-80px] h-64 w-64 rounded-full border border-blue/10" />

              {/* Center artwork mark */}
              <div className="relative flex h-full items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-blue-soft/20">
                  <div className="absolute inset-3 rounded-full border border-gold/15" />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-ivory/30">
                    Resource
                  </span>
                </div>
              </div>

              {/* Bottom information line */}
              <div className="absolute bottom-7 left-7 right-7 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/30">
                  Olawale Smith Ministries
                </span>

                <span className="h-px w-10 bg-gradient-to-r from-gold to-blue-soft opacity-60" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-blue/0 transition-colors duration-500 group-hover:bg-blue/5" />
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}