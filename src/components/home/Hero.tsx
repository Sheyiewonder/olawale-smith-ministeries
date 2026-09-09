import Link from "next/link";
import Section from "@/components/layout/Section";

export default function Hero() {
  return (
    <Section
      theme="dark"
      className="relative min-h-screen overflow-hidden"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Warm gold glow */}
        <div className="absolute left-[12%] top-[18%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]" />

        {/* Cool blue atmosphere */}
        <div className="absolute right-[8%] top-[8%] h-[560px] w-[560px] rounded-full bg-blue/10 blur-[140px]" />

        <div className="absolute right-[-8%] bottom-[-12%] h-[520px] w-[520px] rounded-full bg-blue-soft/8 blur-[120px]" />

        {/* Directional blue/gold light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(59,130,208,0.12),transparent_34%)]" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(183,154,91,0.08),transparent_30%)]" />

        {/* Dark cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-charcoal/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/25" />

        {/* Architectural rings */}
        <div className="absolute right-[-10%] top-[8%] h-[680px] w-[680px] rounded-full border border-blue/10" />

        <div className="absolute right-[2%] top-[16%] h-[540px] w-[540px] rounded-full border border-gold/10" />

        <div className="absolute right-[10%] top-[24%] h-[400px] w-[400px] rounded-full border border-blue-soft/10" />

        {/* Fine blue horizon */}
        <div className="absolute bottom-0 left-0 h-px w-[55%] bg-gradient-to-r from-transparent via-blue-soft/30 to-transparent" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-20 pt-40 lg:px-8 lg:pb-28">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Olawale Smith Ministries
          </p>

          <h1 className="display-heading max-w-5xl text-6xl text-ivory sm:text-7xl lg:text-[8.5rem]">
            Resources for
            <br />
            <span className="relative inline-block text-gold">
              Kingdom Impact.
              <span className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70" />
            </span>
          </h1>

          <div className="mt-8 max-w-xl">
            <p className="body-copy max-w-xl text-base text-ivory/65 sm:text-lg">
              Explore a growing library of sermons, teachings, ebooks, songs,
              podcasts and other resources designed to strengthen your faith
              and deepen your walk with God.
            </p>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Link
              href="/resources"
              className="group inline-flex min-w-[190px] items-center justify-center bg-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light"
            >
              <span>Explore Resources</span>
              <span className="ml-3 h-px w-0 bg-charcoal transition-all duration-300 group-hover:w-5" />
            </Link>

            <Link
              href="/partner"
              className="group inline-flex min-w-[190px] items-center justify-center border border-white/20 bg-white/[0.02] px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-soft/50 hover:bg-blue/5 hover:text-blue-soft"
            >
              <span>Partner with us</span>
              <span className="ml-3 h-px w-0 bg-blue-soft transition-all duration-300 group-hover:w-5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 hidden items-center gap-4 lg:flex">
        <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40">
          Scroll to explore
        </span>

        <div className="relative h-px w-16 overflow-hidden bg-ivory/15">
          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-gold to-blue-soft" />
        </div>
      </div>
    </Section>
  );
}
