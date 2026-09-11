"use client";

import Link from "next/link";
import { ArrowUpRight, HandHeart, Users } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function PartnerSection() {
return ( <section
   id="partner"
   className="relative overflow-hidden bg-ivory px-6 py-24 text-charcoal sm:px-8 sm:py-28 lg:px-12 lg:py-36"
 >
{/* ------------------------------------------------------------------ */}
{/* Atmospheric background                                             */}
{/* ------------------------------------------------------------------ */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    <div className="absolute right-[-12%] top-[-20%] h-[560px] w-[560px] rounded-full bg-blue-soft/[0.11] blur-[150px]" />

    <div className="absolute left-[-14%] bottom-[-25%] h-[480px] w-[480px] rounded-full bg-blue-light/[0.08] blur-[140px]" />

    <div className="absolute left-[38%] top-[38%] h-[280px] w-[280px] rounded-full bg-gold/[0.07] blur-[120px]" />

    <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_28%,rgba(59,130,208,0.08),transparent_34%)]" />

    <div className="absolute -right-40 -top-40 h-[540px] w-[540px] rounded-full border border-blue-soft/[0.16]" />

    <div className="absolute -right-16 -top-16 h-[360px] w-[360px] rounded-full border border-gold/[0.14]" />

    <div className="absolute bottom-[-190px] left-[40%] h-[430px] w-[430px] rounded-full border border-blue/[0.08]" />

    <div className="absolute bottom-[28%] left-0 h-px w-[28%] bg-gradient-to-r from-transparent via-blue-soft/30 to-transparent" />
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Content                                                             */}
  {/* ------------------------------------------------------------------ */}

  <div className="relative z-10 mx-auto max-w-7xl">
    <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-24">
      {/* ---------------------------------------------------------------- */}
      {/* Main statement                                                   */}
      {/* ---------------------------------------------------------------- */}

      <div>
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-bronze" />

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze">
              Partner With Us
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="display-heading mt-7 max-w-5xl text-5xl leading-[0.94] tracking-[-0.04em] text-charcoal sm:text-6xl lg:text-[6rem]">
            The work continues
            <br />
            <span className="relative inline-block text-bronze">
              through people.
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-bronze via-blue-soft to-transparent opacity-70"
              />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="body-copy mt-8 max-w-2xl text-base leading-8 text-charcoal/55 sm:text-lg">
            Partner with the ministry as we continue to share the
            message, raise people, and advance kingdom impact. Together,
            we can help carry the work further and reach more lives.
          </p>
        </Reveal>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Supporting information                                           */}
      {/* ---------------------------------------------------------------- */}

      <Reveal delay={0.2}>
        <div className="relative">
          <div className="absolute -inset-8 bg-blue-soft/[0.07] blur-3xl" />

          <div className="relative border-t border-charcoal/10">
            {/* Kingdom Impact */}
            <div className="flex items-start gap-5 border-b border-charcoal/10 py-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-bronze/25 bg-white/40 text-bronze">
                <HandHeart size={18} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-bronze">
                  Kingdom Impact
                </p>

                <p className="mt-2 max-w-sm text-sm leading-7 text-charcoal/50">
                  Your partnership helps create room for the ministry to
                  share the message, equip people, and extend its reach.
                </p>
              </div>
            </div>

            {/* Shared Mission */}
            <div className="flex items-start gap-5 border-b border-charcoal/10 py-7">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-soft/25 bg-blue-soft/[0.06] text-blue-deep">
                <Users size={18} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-blue-deep">
                  More than giving
                </p>

                <p className="mt-2 max-w-sm text-sm leading-7 text-charcoal/50">
                  Discover the different ways you can stand with the
                  ministry and become part of the work.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-7">
              <Link
                href="/partner"
                className="group relative inline-flex items-center gap-4 overflow-hidden border border-bronze/60 bg-bronze px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-ivory transition-all duration-300 hover:-translate-y-0.5 hover:bg-charcoal sm:px-7 sm:text-xs"
              >
                <span className="relative z-10">Givings</span>

                <ArrowUpRight
                  size={17}
                  strokeWidth={1.5}
                  className="relative z-10 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />

                <span
                  aria-hidden="true"
                  className="absolute inset-0 translate-y-full bg-blue/20 transition-transform duration-500 group-hover:translate-y-0"
                />
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-[0.3em] text-charcoal/25">
              Olawale Smith Ministries
            </span>

            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-bronze/40" />
              <span className="h-px w-4 bg-blue-soft/40" />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
</section>

);
}
