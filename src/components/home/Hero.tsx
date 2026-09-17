import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";

export default function Hero() {
  return (
    <Section
      theme="dark"
      className="relative min-h-screen overflow-hidden"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Atmospheric background                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Warm gold glow */}
        <div className="hero-gold-glow absolute left-[8%] top-[16%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]" />

        {/* Cool blue atmosphere */}
        <div className="hero-blue-glow absolute right-[3%] top-[4%] h-[600px] w-[600px] rounded-full bg-blue/10 blur-[150px]" />

        {/* Lower blue atmosphere */}
        <div className="hero-blue-glow-secondary absolute bottom-[-12%] right-[-8%] h-[520px] w-[520px] rounded-full bg-blue-soft/10 blur-[120px]" />

        {/* Directional blue light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(59,130,208,0.13),transparent_34%)]" />

        {/* Gold counter-light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(183,154,91,0.08),transparent_30%)]" />

        {/* Cinematic gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/35" />

        <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/25" />

        {/* ---------------------------------------------------------------- */}
        {/* Architectural rings                                               */}
        {/* ---------------------------------------------------------------- */}

        <div className="hero-ring-one absolute right-[-12%] top-[6%] h-[720px] w-[720px] rounded-full border border-blue/10" />

        <div className="hero-ring-two absolute right-[0%] top-[14%] h-[560px] w-[560px] rounded-full border border-gold/10" />

        <div className="absolute right-[9%] top-[23%] h-[400px] w-[400px] rounded-full border border-blue-soft/10" />

        {/* Fine blue horizon */}
        <div className="absolute bottom-0 left-0 h-px w-[55%] bg-gradient-to-r from-transparent via-blue-soft/30 to-transparent" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Hero content                                                       */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-16 pt-32 sm:pb-20 lg:px-8 lg:pb-24 lg:pt-40">
        <div className="grid w-full items-end gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:gap-16 xl:gap-24">
          {/* ---------------------------------------------------------------- */}
          {/* Copy                                                              */}
          {/* ---------------------------------------------------------------- */}

          <div className="hero-copy max-w-4xl">
            <p className="hero-copy-item hero-copy-label mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
              Olawale Smith Ministries
            </p>

            <h1 className="hero-copy-item hero-copy-heading display-heading max-w-5xl text-5xl text-ivory sm:text-7xl lg:text-[7.8rem] xl:text-[8.5rem]">
              Resources for
              <br />
              <span className="relative inline-block text-gold">
                Kingdom Impact.
                <span className="hero-heading-line absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70" />
              </span>
            </h1>

            <div className="hero-copy-item hero-copy-description mt-8 max-w-xl">
              <p className="body-copy text-justify max-w-xl text-base text-ivory/65 sm:text-lg">
                Explore a growing library of sermons, teachings, ebooks,
                songs, podcasts and other resources designed to strengthen
                your faith and deepen your walk with God.
              </p>
            </div>

            <div className="hero-copy-item hero-copy-actions mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/resources"
                className="group inline-flex min-w-[190px] items-center justify-center bg-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_12px_40px_rgba(183,154,91,0.18)]"
              >
                <span>Explore Resources</span>

                <span className="ml-3 h-px w-0 bg-charcoal transition-all duration-300 group-hover:w-5" />
              </Link>

              <Link
                href="/partner"
                className="group inline-flex min-w-[190px] items-center justify-center border border-white/20 bg-white/[0.02] px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-soft/50 hover:bg-blue/5 hover:text-blue-soft hover:shadow-[0_12px_40px_rgba(59,130,208,0.12)]"
              >
                <span>Partner with us</span>

                <span className="ml-3 h-px w-0 bg-blue-soft transition-all duration-300 group-hover:w-5" />
              </Link>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Premium image card                                               */}
          {/* ---------------------------------------------------------------- */}

          <div className="hero-card-wrapper relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto">
            {/* Outer blue aura */}
            <div className="hero-card-aura absolute -inset-6 rounded-[2.5rem] bg-blue/15 blur-3xl" />

            {/* Floating blue architectural layer */}
            <div className="hero-card-blue-layer absolute -right-3 -top-3 h-full w-full rounded-[2rem] border border-blue-soft/30 bg-blue/[0.16] backdrop-blur-md" />

            {/* Gold offset frame */}
            <div className="hero-card-gold-layer absolute -bottom-3 -left-3 h-full w-full rounded-[2rem] border border-gold/15 bg-gold/[0.03]" />

            {/* Main glass frame */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-blue/[0.10] p-2 shadow-[0_35px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              {/* Blue inner glow */}
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(111,168,230,0.25),transparent_32%)]" />

              {/* Image */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-blue-deep">
                <Image
                  src="/images/pastor olawale smith 003.jpg"
                  alt="Olawale Smith Ministries"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 42vw"
                  className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
                />

                {/* Cinematic image treatment */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/5 to-blue/[0.10] mix-blend-multiply" />

                <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.18] via-transparent to-gold/[0.08] mix-blend-overlay" />

                {/* Glass reflection */}
                <div className="hero-image-reflection absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent blur-sm" />

                {/* Fine inner border */}
                <div className="pointer-events-none absolute inset-0 rounded-[1.55rem] border border-white/10" />
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* Floating card label                                              */}
              {/* ---------------------------------------------------------------- */}

              <div className="hero-card-label absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                <div className="rounded-full border border-white/15 bg-charcoal/[0.52] px-4 py-2 backdrop-blur-xl">
                  <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/75">
                    Faith • Teaching • Impact
                  </span>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-soft/30 bg-blue/[0.25] text-blue-soft backdrop-blur-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-soft shadow-[0_0_14px_rgba(111,168,230,0.75)]" />
                </div>
              </div>
            </div>

            {/* Small floating accent */}
            <div className="hero-floating-accent absolute -right-5 top-[18%] hidden h-14 w-14 items-center justify-center rounded-full border border-blue-soft/20 bg-blue/[0.10] backdrop-blur-xl lg:flex">
              <span className="h-2 w-2 rounded-full bg-blue-soft shadow-[0_0_18px_rgba(111,168,230,0.8)]" />
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Scroll indicator                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="hero-scroll-indicator absolute bottom-8 right-8 hidden items-center gap-4 lg:flex">
        <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40">
          Scroll to explore
        </span>

        <div className="relative h-px w-16 overflow-hidden bg-ivory/15">
          <div className="hero-scroll-line absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-gold to-blue-soft" />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Lightweight CSS motion                                             */}
      {/* ------------------------------------------------------------------ */}

     
    </Section>
  );
}