"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Church,
  Heart,
  Mic2,
  Users,
} from "lucide-react";

import Reveal from "@/components/motion/Reveal";

/* -------------------------------------------------------------------------- */
/* Image Data                                                                 */
/* -------------------------------------------------------------------------- */

const profileImages = {
  main: "/images/pastor olawale smith 031.jpg",
  secondary: "/images/pastor olawale smith 002.jpg",
  tertiary: "/images/pastor olawale smith 003.jpg",
};

const ministryActivities = [
  {
    id: 1,
    src: "/images/ministry/activity-01.jpg",
    alt: "Pastor Olawale Smith ministering",
    tag: "Teaching",
    location: "Ministry Gathering",
    date: "2026",
    size: "large",
  },
  {
    id: 2,
    src: "/images/ministry/activity-02.jpg",
    alt: "Pastor Olawale Smith speaking at a ministry gathering",
    tag: "Conference",
    location: "Conference",
    date: "2026",
    size: "small",
  },
  {
    id: 3,
    src: "/images/ministry/activity-03.jpg",
    alt: "Ministry worship gathering",
    tag: "Worship",
    location: "Church Gathering",
    date: "2026",
    size: "small",
  },
  {
    id: 4,
    src: "/images/ministry/activity-04.jpg",
    alt: "Pastor Olawale Smith with members of the ministry",
    tag: "Community",
    location: "Ministry Community",
    date: "2026",
    size: "wide",
  },
  {
    id: 5,
    src: "/images/ministry/activity-05.jpg",
    alt: "Pastor Olawale Smith during a teaching session",
    tag: "Word & Teaching",
    location: "Ministry Gathering",
    date: "2026",
    size: "small",
  },
  {
    id: 6,
    src: "/images/ministry/activity-06.jpg",
    alt: "Pastor Olawale Smith during prayer",
    tag: "Prayer",
    location: "Prayer Gathering",
    date: "2026",
    size: "small",
  },
  {
    id: 7,
    src: "/images/ministry/activity-07.jpg",
    alt: "Pastor Olawale Smith at a ministry event",
    tag: "Outreach",
    location: "Ministry Outreach",
    date: "2026",
    size: "large",
  },
  {
    id: 8,
    src: "/images/ministry/activity-08.jpg",
    alt: "Pastor Olawale Smith engaging with people",
    tag: "Leadership",
    location: "Ministry Gathering",
    date: "2026",
    size: "small",
  },
] as const;

/* -------------------------------------------------------------------------- */
/* Focus Items                                                                */
/* -------------------------------------------------------------------------- */

const ministryFocus = [
  {
    icon: BookOpen,
    label: "The Word",
  },
  {
    icon: Mic2,
    label: "Teaching",
  },
  {
    icon: Users,
    label: "People",
  },
  {
    icon: Heart,
    label: "Kingdom Impact",
  },
];

/* -------------------------------------------------------------------------- */
/* Ministry Motion Visual                                                     */
/* -------------------------------------------------------------------------- */

/*
 * Photographic motion-study:
 *
 * - The main PNG remains the dominant subject.
 * - Multiple low-opacity copies create a directional photographic echo.
 * - The echoes move horizontally behind the subject.
 * - Blue and gold directional trails reinforce movement.
 * - Small dashes and particles provide subtle kinetic detail.
 * - No rings, spheres, flames, orbital paths, or foreground geometry.
 */

function MinistryMotionVisual() {
  const subject = "/images/pastor olawale smith 038.png";

  return (
    <div className="relative flex min-h-[520px] w-full select-none items-center justify-center overflow-visible sm:min-h-[600px] lg:min-h-[640px]">
      {/* ------------------------------------------------------------------ */}
      {/* Ambient atmosphere                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[48%] top-[48%] z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-soft/[0.09] blur-[110px] sm:h-[400px] sm:w-[400px] lg:h-[460px] lg:w-[460px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[43%] top-[58%] z-0 h-[190px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.055] blur-[100px]"
      />

      {/* ------------------------------------------------------------------ */}
      {/* Directional motion field                                            */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5 overflow-visible"
      >
        {/* Long blue motion trail */}
        <div className="absolute left-[4%] top-[39%] h-px w-[62%] origin-left bg-gradient-to-r from-transparent via-blue-soft/10 to-blue-soft/45 blur-[0.5px] animate-[motionTrail_5s_ease-in-out_infinite]" />

        {/* Second blue trail */}
        <div className="absolute left-[12%] top-[45%] h-px w-[48%] origin-left bg-gradient-to-r from-transparent via-blue/10 to-blue-soft/30 animate-[motionTrail_6s_ease-in-out_infinite_0.8s]" />

        {/* Gold trail */}
        <div className="absolute left-[24%] top-[66%] h-px w-[42%] origin-left bg-gradient-to-r from-transparent via-gold/10 to-gold/35 animate-[motionTrail_5.5s_ease-in-out_infinite_1.2s]" />

        {/* Soft broad directional wash */}
        <div className="absolute left-[2%] top-[34%] h-[120px] w-[58%] -rotate-3 bg-gradient-to-r from-blue-soft/[0.025] via-blue-soft/[0.045] to-transparent blur-2xl animate-[motionWash_7s_ease-in-out_infinite]" />

        {/* Small motion dashes */}
        <span className="absolute left-[13%] top-[30%] h-px w-12 bg-blue-soft/35 animate-[motionDash_4.5s_ease-in-out_infinite]" />

        <span className="absolute left-[8%] top-[57%] h-px w-7 bg-blue/30 animate-[motionDash_5.5s_ease-in-out_infinite_0.9s]" />

        <span className="absolute right-[11%] top-[34%] h-px w-10 bg-gold/35 animate-[motionDash_5s_ease-in-out_infinite_1.4s]" />

        <span className="absolute right-[8%] top-[61%] h-px w-6 bg-blue-soft/30 animate-[motionDash_4s_ease-in-out_infinite_0.5s]" />

        {/* Tiny motion particles */}
        <span className="absolute left-[22%] top-[25%] h-1 w-1 rounded-full bg-blue-soft/45 shadow-[0_0_10px_rgba(111,168,230,0.35)] animate-[motionParticle_4s_ease-in-out_infinite]" />

        <span className="absolute left-[17%] top-[69%] h-1 w-1 rounded-full bg-gold-light/45 shadow-[0_0_10px_rgba(201,180,125,0.3)] animate-[motionParticle_5s_ease-in-out_infinite_0.8s]" />

        <span className="absolute right-[19%] top-[22%] h-1 w-1 rounded-full bg-blue-soft/35 animate-[motionParticle_4.5s_ease-in-out_infinite_1.2s]" />

        <span className="absolute bottom-[23%] right-[15%] h-1 w-1 rounded-full bg-gold/40 animate-[motionParticle_5.5s_ease-in-out_infinite_1.7s]" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Photographic afterimages                                            */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        {/* Furthest photographic echo */}
        <div className="absolute w-[230px] -translate-x-[48px] opacity-[0.075] blur-[1.5px] mix-blend-multiply sm:w-[285px] lg:w-[330px] xl:w-[350px] animate-[motionGhostTwo_6s_ease-in-out_infinite]">
          <Image
            src={subject}
            alt=""
            width={600}
            height={800}
            aria-hidden="true"
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Middle photographic echo */}
        <div className="absolute w-[245px] -translate-x-[27px] opacity-[0.10] blur-[0.8px] mix-blend-multiply sm:w-[300px] lg:w-[345px] xl:w-[365px] animate-[motionGhostOne_5s_ease-in-out_infinite_0.35s]">
          <Image
            src={subject}
            alt=""
            width={600}
            height={800}
            aria-hidden="true"
            className="h-auto w-full object-contain"
          />
        </div>

        {/* Subtle blue photographic color echo */}
        <div className="absolute w-[250px] translate-x-[17px] opacity-[0.045] blur-[3px] mix-blend-screen sm:w-[305px] lg:w-[350px] xl:w-[370px] animate-[motionColorEcho_7s_ease-in-out_infinite_0.6s]">
          <Image
            src={subject}
            alt=""
            width={600}
            height={800}
            aria-hidden="true"
            className="h-auto w-full object-contain brightness-110 saturate-75"
          />
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Main subject                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative z-20 w-[260px] animate-[subjectFloat_7s_ease-in-out_infinite] sm:w-[320px] lg:w-[370px] xl:w-[390px]">
        <Image
          src={subject}
          alt="Pastor Olawale Smith"
          width={600}
          height={800}
          priority
          className="h-auto w-full object-contain drop-shadow-[0_25px_35px_rgba(17,17,15,0.20)]"
        />

        {/* Very subtle subject-side light */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-[22%] h-[34%] w-10 rounded-full bg-blue-soft/[0.08] blur-2xl"
        />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Editorial marker                                                    */}
      {/* ------------------------------------------------------------------ */}

      <div className="absolute bottom-4 right-2 z-30 hidden items-center gap-3 sm:flex lg:right-0">
        <span className="h-px w-8 bg-blue-soft/40" />

        <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-charcoal/25">
          The work continues
        </span>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Motion-study animation keyframes                                   */}
      {/* ------------------------------------------------------------------ */}

      <style jsx>{`
        @keyframes subjectFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -5px, 0);
          }
        }

        @keyframes motionGhostOne {
          0%,
          100% {
            transform: translate3d(-27px, 0, 0);
            opacity: 0.1;
          }

          50% {
            transform: translate3d(-43px, -2px, 0);
            opacity: 0.055;
          }
        }

        @keyframes motionGhostTwo {
          0%,
          100% {
            transform: translate3d(-48px, 0, 0);
            opacity: 0.075;
          }

          50% {
            transform: translate3d(-68px, -3px, 0);
            opacity: 0.035;
          }
        }

        @keyframes motionColorEcho {
          0%,
          100% {
            transform: translate3d(17px, 0, 0);
            opacity: 0.045;
          }

          50% {
            transform: translate3d(32px, -2px, 0);
            opacity: 0.02;
          }
        }

        @keyframes motionTrail {
          0%,
          100% {
            transform: scaleX(0.78);
            opacity: 0.25;
          }

          50% {
            transform: scaleX(1);
            opacity: 0.65;
          }
        }

        @keyframes motionWash {
          0%,
          100% {
            transform: translateX(-12px) rotate(-3deg);
            opacity: 0.35;
          }

          50% {
            transform: translateX(18px) rotate(-3deg);
            opacity: 0.7;
          }
        }

        @keyframes motionParticle {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate3d(12px, -6px, 0);
            opacity: 0.75;
          }
        }

        @keyframes motionDash {
          0%,
          100% {
            transform: translateX(-8px);
            opacity: 0.15;
          }

          50% {
            transform: translateX(12px);
            opacity: 0.65;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          :global(*) {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* About Section                                                              */
/* -------------------------------------------------------------------------- */

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative overflow-hidden bg-ivory text-charcoal"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Atmospheric Background                                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Blue atmospheric glow */}
        <div className="absolute left-[-15%] top-[8%] h-[560px] w-[560px] rounded-full bg-blue-soft/[0.10] blur-[150px]" />

        <div className="absolute right-[-15%] top-[32%] h-[620px] w-[620px] rounded-full bg-blue/[0.075] blur-[160px]" />

        {/* Gold atmosphere */}
        <div className="absolute left-[38%] top-[20%] h-[320px] w-[320px] rounded-full bg-gold/[0.08] blur-[130px]" />

        <div className="absolute bottom-[-10%] right-[20%] h-[460px] w-[460px] rounded-full bg-bronze/[0.07] blur-[140px]" />

        {/* Architectural rings */}
        <div className="absolute -left-64 top-[10%] h-[620px] w-[620px] rounded-full border border-blue-soft/[0.13]" />

        <div className="absolute -left-40 top-[16%] h-[470px] w-[470px] rounded-full border border-gold/[0.12]" />

        <div className="absolute -right-72 bottom-[4%] h-[720px] w-[720px] rounded-full border border-blue/[0.10]" />

        <div className="absolute -right-52 bottom-[12%] h-[520px] w-[520px] rounded-full border border-gold/[0.10]" />

        {/* Fine horizontal lines */}
        <div className="absolute left-0 top-[18%] h-px w-[26%] bg-gradient-to-r from-transparent via-blue-soft/35 to-transparent" />

        <div className="absolute right-0 top-[58%] h-px w-[22%] bg-gradient-to-l from-transparent via-gold/30 to-transparent" />

        <div className="absolute bottom-[14%] left-0 h-px w-[18%] bg-gradient-to-r from-transparent via-blue-soft/25 to-transparent" />

        {/* Overall wash */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,208,0.055),transparent_30%),radial-gradient(circle_at_75%_65%,rgba(183,154,91,0.045),transparent_32%)]" />
      </div>

      <div className="relative z-10">
        {/* ================================================================== */}
        {/* SECTION 01 — THE MAN OF GOD                                       */}
        {/* ================================================================== */}

        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          {/* Section heading */}
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <Reveal>
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-bronze" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze">
                  About the Man of God
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="lg:ml-auto lg:max-w-3xl">
                <h2 className="display-heading text-5xl leading-[0.94] tracking-[-0.045em] text-blue-deep sm:text-6xl lg:text-[5.8rem]">
                  A life given
                  <br />
                  <span className="relative inline-block text-bronze">
                    to the work.
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-bronze via-blue-soft to-transparent opacity-70"
                    />
                  </span>
                </h2>
              </div>
            </Reveal>
          </div>

          {/* Profile layout */}
          <div className="mt-20 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 xl:gap-28">
            {/* Photography */}
            <Reveal delay={0.12}>
              <div className="relative">
                {/* Blue architectural layer */}
                <div
                  aria-hidden="true"
                  className="absolute -left-5 top-7 h-[72%] w-[82%] border border-blue-soft/[0.20] bg-blue-soft/[0.045]"
                />

                {/* Gold offset frame */}
                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -right-5 h-[68%] w-[72%] border border-gold/[0.24]"
                />

                {/* Main image */}
                <div className="relative z-10 aspect-[4/5] overflow-hidden border border-blue-soft/60 bg-charcoal-soft shadow-[0_30px_80px_rgba(17,17,15,0.12)]">
                  <Image
                    src={profileImages.main}
                    alt="Pastor Olawale Smith"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover transition-transform duration-1000 hover:scale-[1.035]"
                  />

                  {/* Image treatment */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-blue-deep/[0.12]" />

                  <div className="absolute inset-0 border border-white/[0.10]" />

                  {/* Image label */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gold-light">
                        Olawale Smith
                      </p>

                      <p className="mt-1 text-xs text-white/60">
                        Pastor • Teacher • Minister
                      </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-charcoal/40 backdrop-blur-md">
                      <Church
                        size={15}
                        strokeWidth={1.4}
                        className="text-gold-light"
                      />
                    </div>
                  </div>
                </div>

                {/* Supporting images */}
                <div className="absolute -bottom-10 -left-4 z-20 hidden w-[30%] max-w-[170px] sm:block">
                  <div className="relative aspect-[3/4] overflow-hidden border border-blue-soft/40 bg-white shadow-2xl">
                    <Image
                      src={profileImages.secondary}
                      alt="Pastor Olawale Smith"
                      fill
                      sizes="170px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                    <div className="absolute inset-0 border border-white/[0.10]" />
                  </div>
                </div>

                <div className="absolute -right-7 top-16 z-20 hidden w-[25%] max-w-[145px] sm:block">
                  <div className="relative aspect-[3/4] overflow-hidden border border-blue-soft/40 bg-white shadow-2xl">
                    <Image
                      src={profileImages.tertiary}
                      alt="Pastor Olawale Smith"
                      fill
                      sizes="145px"
                      className="object-cover transition-transform duration-700 hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/50 to-transparent" />
                    <div className="absolute inset-0 border border-white/[0.10]" />
                  </div>
                </div>

                {/* Floating index */}
                <div className="absolute -right-2 bottom-10 z-30 flex h-16 w-16 items-center justify-center border border-blue-soft/25 bg-ivory/[0.82] shadow-xl backdrop-blur-xl sm:-right-8">
                  <div className="text-center">
                    <span className="block text-[8px] font-bold uppercase tracking-[0.2em] text-blue-deep">
                      Profile
                    </span>

                    <span className="mt-1 block text-lg font-medium text-charcoal">
                      01
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Profile Content */}
            <div className="flex flex-col justify-center lg:pt-8">
              <Reveal delay={0.18}>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-deep">
                  The Man Behind the Ministry
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <h3 className="mt-5 max-w-2xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-charcoal sm:text-4xl">
                  Pastor Olawale Smith
                </h3>
              </Reveal>

              <Reveal delay={0.3}>
                <div className="mt-7 max-w-2xl space-y-5 text-sm leading-8 text-charcoal/55 sm:text-base">
                  <p>
                    Pastor Olawale Smith is a minister committed to the work
                    of the Gospel and to helping people encounter Christ,
                    grow in faith, and live with kingdom purpose.
                  </p>

                  <p>
                    Through teaching, preaching, leadership, prayer, and
                    ministry engagements, his work continues to reach people
                    in different places and across different expressions of
                    ministry.
                  </p>

                  <p>
                    His ministry is centered on the Word of God, spiritual
                    growth, and the transformation of lives through the
                    message of Christ.
                  </p>
                </div>
              </Reveal>

              {/* Focus items */}
              <Reveal delay={0.36}>
                <div className="mt-10 grid grid-cols-2 border-y border-charcoal/10 sm:grid-cols-4">
                  {ministryFocus.map((item, index) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className={`group flex items-center gap-3 py-5 ${
                          index > 0
                            ? "border-l border-charcoal/10 pl-4 sm:pl-5"
                            : ""
                        }`}
                      >
                        <Icon
                          size={15}
                          strokeWidth={1.4}
                          className="shrink-0 text-bronze transition-transform duration-300 group-hover:scale-110"
                        />

                        <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-charcoal/45 transition-colors duration-300 group-hover:text-charcoal/75">
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Reveal>

              {/* CTA */}
              <Reveal delay={0.42}>
                <div className="mt-9">
                  <Link
                    href="/about"
                    className="group inline-flex items-center gap-4 border border-bronze/55 bg-bronze/[0.08] px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-bronze transition-all duration-300 hover:-translate-y-0.5 hover:border-bronze hover:bg-bronze hover:text-ivory sm:px-7 sm:text-xs"
                  >
                    <span>Read full profile</span>

                    <ArrowUpRight
                      size={16}
                      strokeWidth={1.5}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="h-px bg-gradient-to-r from-transparent via-charcoal/10 to-transparent" />
        </div>

        {/* ================================================================== */}
        {/* SECTION 02 — MINISTRY ACTIVITIES                                   */}
        {/* ================================================================== */}

        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          {/* Ministry Activities Intro */}
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-2 xl:grid-cols-[0.88fr_1.12fr]">
            {/* LEFT — TEXT */}
            <div className="relative z-40 max-w-2xl">
              <Reveal>
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-blue-soft" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-deep">
                    Ministry Activities
                  </p>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="display-heading mt-7 text-left text-5xl leading-[0.94] tracking-[-0.045em] text-charcoal sm:text-6xl lg:text-[5.4rem] xl:text-[5.8rem]">
                  A ministry
                  <br />
                  <span className="relative inline-block text-blue-deep">
                    in motion.
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-blue-deep via-blue-soft to-transparent opacity-60"
                    />
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-7 max-w-xl text-left text-sm leading-8 text-charcoal/45 sm:text-base sm:leading-8">
                  A glimpse into the gatherings, teachings, conferences,
                  worship moments, outreach, and people that form part of the
                  ministry&apos;s ongoing work.
                </p>
              </Reveal>
            </div>

            {/* RIGHT — ANIMATED VISUAL */}
            <Reveal delay={0.14}>
              <div className="relative lg:-mr-14 xl:-mr-22">
                <MinistryMotionVisual />
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.22}>
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-10 bg-gold/50" />

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-charcoal/30">
                Selected moments
              </span>
            </div>
          </Reveal>

          {/* Gallery */}
          <div className="mt-8 grid auto-rows-[220px] grid-cols-1 gap-4 sm:auto-rows-[240px] sm:grid-cols-2 lg:mt-4 lg:auto-rows-[230px] lg:grid-cols-4">
            {ministryActivities.map((activity, index) => {
              const isLarge = activity.size === "large";
              const isWide = activity.size === "wide";

              return (
                <Reveal
                  key={activity.id}
                  delay={Math.min(index * 0.05, 0.3)}
                  className={`${isLarge ? "sm:row-span-2 lg:col-span-2 lg:row-span-2" : ""} ${isWide ? "sm:col-span-2 lg:col-span-2 lg:row-span-1" : ""}`}
                >
                  <article className="group relative h-full min-h-[220px] overflow-hidden border border-charcoal/10 bg-charcoal-soft shadow-[0_15px_45px_rgba(17,17,15,0.08)]">
                    {/* Image */}
                    <Image
                      src={activity.src}
                      alt={activity.alt}
                      fill
                      sizes={
                        isLarge
                          ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                          : isWide
                            ? "(max-width: 640px) 100vw, 50vw"
                            : "(max-width: 640px) 100vw, 50vw"
                      }
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                    />

                    {/* Image color treatment */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                    {/* Cool blue atmospheric overlay */}
                    <div className="absolute inset-0 bg-blue-deep/[0.08] mix-blend-screen transition-opacity duration-500 group-hover:bg-blue/[0.14]" />

                    {/* Border */}
                    <div className="absolute inset-0 border border-white/[0.10] transition-colors duration-500 group-hover:border-blue-soft/30" />

                    {/* Top metadata */}
                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                      <span className="inline-flex items-center border border-white/15 bg-charcoal/50 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-ivory backdrop-blur-md">
                        {activity.tag}
                      </span>

                      <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/45">
                        {String(activity.id).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Bottom information */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                      <div className="translate-y-2 transition-transform duration-500 group-hover:translate-y-0">
                        <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.18em] text-blue-soft">
                          <span>{activity.location}</span>

                          <span className="h-px w-4 bg-blue-soft/50" />

                          <span>{activity.date}</span>
                        </div>

                        <div className="mt-3 flex items-end justify-between gap-4">
                          <p className="max-w-md text-sm font-medium leading-6 text-ivory sm:text-base">
                            {activity.alt}
                          </p>

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/15 bg-charcoal/40 opacity-0 backdrop-blur-md transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
                            <ArrowUpRight
                              size={14}
                              strokeWidth={1.5}
                              className="text-gold-light"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Hover glow */}
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-soft/10 blur-3xl" />

                      <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </div>

          {/* Gallery footer */}
          <Reveal delay={0.25}>
            <div className="mt-12 flex flex-col gap-6 border-t border-charcoal/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="h-px w-10 bg-gold/50" />

                <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-charcoal/30">
                  The work continues
                </p>
              </div>

              <Link
                href="/about"
                className="group inline-flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-blue-deep transition-colors duration-300 hover:text-bronze"
              >
                <span>Explore the ministry</span>

                <ArrowUpRight
                  size={15}
                  strokeWidth={1.5}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}