"use client";

import Link from "next/link";
import { ArrowUpRight, CalendarDays, MessageCircle } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function InviteSection() {
return ( <section
   id="invite"
   className="relative overflow-hidden bg-charcoal px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36"
 >
{/* ------------------------------------------------------------------ */}
{/* Atmospheric background                                             */}
{/* ------------------------------------------------------------------ */}
  <div
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 overflow-hidden"
  >
    {/* Blue atmosphere */}
    <div className="absolute right-[-12%] top-[-18%] h-[520px] w-[520px] rounded-full bg-blue/10 blur-[150px]" />

    <div className="absolute left-[-14%] bottom-[-24%] h-[440px] w-[440px] rounded-full bg-blue-soft/[0.07] blur-[130px]" />

    {/* Gold counterbalance */}
    <div className="absolute left-[34%] top-[35%] h-[280px] w-[280px] rounded-full bg-gold/[0.05] blur-[120px]" />

    {/* Directional blue light */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(59,130,208,0.10),transparent_35%)]" />

    {/* Architectural rings */}
    <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-blue-soft/10" />

    <div className="absolute -right-16 -top-16 h-[350px] w-[350px] rounded-full border border-gold/10" />

    <div className="absolute bottom-[-180px] left-[40%] h-[420px] w-[420px] rounded-full border border-blue/5" />

    {/* Fine horizontal line */}
    <div className="absolute left-0 top-[55%] h-px w-[26%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent" />
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Content                                                             */}
  {/* ------------------------------------------------------------------ */}

  <div className="relative z-10 mx-auto max-w-7xl">
    <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24">
      {/* ---------------------------------------------------------------- */}
      {/* Main copy                                                        */}
      {/* ---------------------------------------------------------------- */}

      <div>
        <Reveal>
          <div className="flex items-center gap-4">
            <span className="h-px w-12 bg-gold" />

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
              Ministry Invitations
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="display-heading mt-7 max-w-4xl text-5xl leading-[0.94] tracking-[-0.04em] text-ivory sm:text-6xl lg:text-[6rem]">
            Invite Pastor
            <br />
            <span className="relative inline-block text-gold">
              Olawale Smith.
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70"
              />
            </span>
          </h2>
        </Reveal>

        <Reveal delay={0.16}>
          <p className="body-copy mt-8 max-w-2xl text-base leading-8 text-ivory/60 sm:text-lg">
            Invite Pastor Olawale Smith to minister at your church,
            conference, convention, program, or special gathering.
          </p>
        </Reveal>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* Supporting information                                           */}
      {/* ---------------------------------------------------------------- */}

      <Reveal delay={0.2}>
        <div className="relative">
          <div className="absolute -inset-8 bg-blue/5 blur-3xl" />

          <div className="relative border-t border-white/10">
            <div className="flex items-start gap-5 border-b border-white/10 py-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-white/[0.015] text-gold">
                <CalendarDays size={17} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-gold">
                  Speaking Engagements
                </p>

                <p className="mt-2 max-w-sm text-sm leading-7 text-ivory/55">
                  Churches, conferences, conventions, special programs,
                  and other ministry gatherings.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 border-b border-white/10 py-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-blue-soft/20 bg-blue/5 text-blue-soft">
                <MessageCircle size={17} strokeWidth={1.5} />
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-blue-soft">
                  Official Requests
                </p>

                <p className="mt-2 max-w-sm text-sm leading-7 text-ivory/55">
                  Visit the invitation page for the official process and
                  ministry contact information.
                </p>
              </div>
            </div>
          </div>

          <Reveal delay={0.24}>
          <Link
            href="/invite"
            className="group relative mt-9 inline-flex items-center gap-4 border border-gold/50 px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:bg-gold hover:text-charcoal sm:px-7 sm:text-xs"
          >
            <span>Invite</span>

            <ArrowUpRight
              size={17}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
            />

          </Link>
        </Reveal>

          <div className="mt-6 flex items-center justify-between">
            <span className="text-[8px] uppercase tracking-[0.3em] text-ivory/20">
              Olawale Smith Ministries
            </span>

            <div className="flex items-center gap-2">
              <span className="h-px w-8 bg-gold/40" />
              <span className="h-px w-4 bg-blue-soft/30" />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  </div>
</section>

);
}
