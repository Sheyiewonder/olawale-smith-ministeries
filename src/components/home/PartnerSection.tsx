import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function PartnerSection() {
  return (
    <section
      id="partner"
      className="relative overflow-hidden bg-charcoal px-6 py-28 sm:px-8 lg:px-12 lg:py-40"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Atmospheric background                                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Blue atmosphere */}
        <div className="absolute right-[-10%] top-[-18%] h-[560px] w-[560px] rounded-full bg-blue/10 blur-[150px]" />

        <div className="absolute left-[-14%] bottom-[-22%] h-[480px] w-[480px] rounded-full bg-blue-soft/[0.07] blur-[130px]" />

        {/* Warm gold atmosphere */}
        <div className="absolute left-[34%] top-[35%] h-[300px] w-[300px] rounded-full bg-gold/[0.055] blur-[120px]" />

        {/* Directional light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(59,130,208,0.10),transparent_34%)]" />

        {/* Architectural rings */}
        <div className="absolute -right-44 -top-44 h-[620px] w-[620px] rounded-full border border-blue-soft/10" />

        <div className="absolute -right-24 -top-24 h-[420px] w-[420px] rounded-full border border-gold/10" />

        <div className="absolute bottom-[-220px] left-[38%] h-[500px] w-[500px] rounded-full border border-blue/5" />

        {/* Fine horizontal line */}
        <div className="absolute bottom-[22%] left-0 h-px w-[32%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Content                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative z-10 mx-auto max-w-7xl">
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              Partner With Us
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="display-heading mt-7 max-w-6xl text-5xl leading-[0.92] tracking-[-0.04em] text-ivory sm:text-7xl lg:text-[7.5rem]">
            The work
            <br />
            continues{" "}
            <span className="relative inline-block text-gold">
              through people.
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70"
              />
            </span>
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10 border-t border-white/10 pt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-12">
          <Reveal delay={0.16}>
            <div className="max-w-xl">
              <p className="body-copy text-base leading-8 text-ivory/60 sm:text-lg">
                Partner with the ministry as we continue to share the message,
                raise people, and advance kingdom impact.
              </p>

              <div className="mt-7 flex items-center gap-4">
                <span className="h-px w-8 bg-blue-soft/40" />

                <span className="text-[9px] uppercase tracking-[0.28em] text-ivory/30">
                  Kingdom Impact
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.24}>
            <a
              href="#"
              className="group relative inline-flex w-fit items-center gap-4 overflow-hidden border border-gold/50 px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-charcoal"
            >
              <span className="relative z-10">Partner With Us</span>

              <ArrowUpRight
                size={17}
                strokeWidth={1.5}
                className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />

              {/* Subtle blue hover wash */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -z-0 translate-y-full bg-blue/10 transition-transform duration-500 group-hover:translate-y-0"
              />
            </a>
          </Reveal>
        </div>

        {/* Bottom ministry signature */}
        <Reveal delay={0.32}>
          <div className="mt-20 flex items-center justify-between border-t border-white/5 pt-6">
            <span className="text-[8px] uppercase tracking-[0.3em] text-ivory/20">
              Olawale Smith Ministries
            </span>

            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-gold/40" />
              <span className="h-px w-4 bg-blue-soft/30" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
