import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-charcoal">
      {/* Placeholder visual */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_40%,rgba(183,154,91,0.14),transparent_32%)]" />

        <div className="absolute right-0 top-0 h-full w-full bg-gradient-to-l from-black/20 via-transparent to-charcoal" />

        <div className="absolute right-[-10%] top-[10%] h-[650px] w-[650px] rounded-full border border-gold/10" />

        <div className="absolute right-[4%] top-[18%] h-[500px] w-[500px] rounded-full border border-gold/10" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-20 pt-40 lg:px-8 lg:pb-28">
        <div className="max-w-4xl">
          <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-gold">
            Olawale Smith Ministries
          </p>

            <h1 className="display-heading max-w-5xl text-6xl text-ivory sm:text-7xl lg:text-[8.5rem]">
                Resources for
                <br />
                <span className="text-gold">Kingdom Impact.</span>
            </h1>

            <div className="mt-8 max-w-xl">
                <p className="body-copy max-w-xl text-base text-ivory/65 sm:text-lg">              Explore a growing library of sermons, teachings, ebooks, songs,
                podcasts and other resources designed to strengthen your faith
                and deepen your walk with God.
                </p>
            </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/resources"
              className="bg-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-charcoal transition-transform hover:-translate-y-0.5"
            >
              Explore Resources
            </Link>

            <Link
              href="/partner"
              className="border border-white/20 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-gold hover:text-gold"
            >
                Partner with us

            </Link>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 right-8 hidden items-center gap-4 lg:flex">
        <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40">
          Scroll to explore
        </span>

        <div className="h-px w-16 bg-gold/50" />
      </div>
    </section>
  );
}