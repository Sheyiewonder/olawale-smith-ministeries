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

import Section from "@/components/layout/Section";

import type { CSSProperties } from "react";



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
    src: "/images/pastor olawale smith 017.jpg",
    alt: "Pastor Olawale Smith & his beautiful wife",
    tag: "Family",
    location: "Church Gathering",
    date: "2026",
    size: "large",
  },
  {
    id: 2,
    src: "/images/pastor olawale smith 026.jpg",
    alt: "Pastor Olawale Smith engaging with people",
    tag: "Family",
    location: "Church Gathering",
    date: "2026",
    size: "large",
  },
  {
    id: 3,
    src: "/images/pastor olawale smith 013.jpg",
    alt: "Pastor Olawale Smith ministering",
    tag: "Church",
    location: "Ministry Gathering",
    date: "2026",
    size: "large",
  },
  {
    id: 4,
    src: "/images/pastor olawale smith 010.jpg",
    alt: "Pastor Olawale Smith at a church gathering",
    tag: "Pastoring",
    location: "Conference",
    date: "2026",
    size: "small",
  },
  {
    id: 5,
    src: "/images/pastor olawale smith 027.jpg",
    alt: "Ministry worship gathering",
    tag: "Worship",
    location: "Church Gathering",
    date: "2026",
    size: "small",
  },
  {
    id: 6,
    src: "/images/pastor olawale smith 029.jpg",
    alt: "Pastor Olawale Smith during a church event",
    tag: "Community",
    location: "Ministry Community",
    date: "2026",
    size: "large",
  },
  {
    id: 7,
    src: "/images/pastor olawale smith 036.jpg",
    alt: "Pastor Olawale Smith during a teaching session",
    tag: "Word & Teaching",
    location: "Teaching Podcast",
    date: "2026",
    size: "small",
  },
  {
    id: 8,
    src: "/images/pastor olawale smith 028.jpg",
    alt: "Pastor Olawale Smith during prayer",
    tag: "Prayer",
    location: "Prayer Gathering",
    date: "2026",
    size: "small",
  },
  {
    id: 9,
    src: "/images/pastor olawale smith 009.jpg",
    alt: "Pastor Olawale Smith on evangelism",
    tag: "Outreach",
    location: "Ministry Outreach",
    date: "2026",
    size: "large",
  },
  {
    id: 10,
    src: "/images/pastor olawale smith 034.jpg",
    alt: "Pastor Olawale Smith engaging with people",
    tag: "Leadership",
    location: "Love Feast",
    date: "2026",
    size: "small",
  },
  {
    id: 11,
    src: "/images/pastor olawale smith 019.jpg",
    alt: "Pastor Olawale Smith praying passionately",
    tag: "Prayer",
    location: "Pastoral Ministry",
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

function MinistryMotionVisual() {
  const subject = "/images/pastor olawale smith 038.png";

  return (
    <div className="relative flex min-h-[520px] w-full select-none items-center justify-center overflow-visible sm:min-h-[600px] lg:min-h-[640px]">
      {/* Ambient atmosphere */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[48%] top-[48%] z-0 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-soft/[0.09] blur-[110px] sm:h-[400px] sm:w-[400px] lg:h-[460px] lg:w-[460px]"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[43%] top-[58%] z-0 h-[190px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/[0.055] blur-[100px]"
      />

      {/* Directional motion field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-5 overflow-visible"
      >
        <div className="absolute left-[4%] top-[39%] h-px w-[62%] origin-left bg-gradient-to-r from-transparent via-blue-soft/10 to-blue-soft/45 blur-[0.5px] motion-trail motion-trail-slow" />

        <div className="absolute left-[12%] top-[45%] h-px w-[48%] origin-left bg-gradient-to-r from-transparent via-blue/10 to-blue-soft/30 motion-trail motion-trail-medium motion-delay-800" />

        <div className="absolute left-[24%] top-[66%] h-px w-[42%] origin-left bg-gradient-to-r from-transparent via-gold/10 to-gold/35 motion-trail motion-trail-gold motion-delay-1200" />

        <div className="absolute left-[2%] top-[34%] h-[120px] w-[58%] -rotate-3 bg-gradient-to-r from-blue-soft/[0.025] via-blue-soft/[0.045] to-transparent blur-2xl motion-wash" />

        <span className="absolute left-[13%] top-[30%] h-px w-12 bg-blue-soft/35 motion-dash" />

        <span className="absolute left-[8%] top-[57%] h-px w-7 bg-blue/30 motion-dash motion-dash-slow motion-delay-900" />

        <span className="absolute right-[11%] top-[34%] h-px w-10 bg-gold/35 motion-dash motion-delay-1400" />

        <span className="absolute right-[8%] top-[61%] h-px w-6 bg-blue-soft/30 motion-dash motion-dash-fast motion-delay-500" />

        <span className="absolute left-[22%] top-[25%] h-1 w-1 rounded-full bg-blue-soft/45 shadow-[0_0_10px_rgba(111,168,230,0.35)] motion-particle" />

        <span className="absolute left-[17%] top-[69%] h-1 w-1 rounded-full bg-gold-light/45 shadow-[0_0_10px_rgba(201,180,125,0.3)] motion-particle motion-particle-slow motion-delay-800" />

        <span className="absolute right-[19%] top-[22%] h-1 w-1 rounded-full bg-blue-soft/35 motion-particle motion-delay-1200" />

        <span className="absolute bottom-[23%] right-[15%] h-1 w-1 rounded-full bg-gold/40 motion-particle motion-particle-slower motion-delay-1700" />
      </div>

      {/* Photographic afterimages */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="absolute w-[230px] -translate-x-[48px] opacity-[0.075] blur-[1.5px] mix-blend-multiply sm:w-[285px] lg:w-[330px] xl:w-[350px] motion-ghost-two">
          <Image
            src={subject}
            alt=""
            width={600}
            height={800}
            aria-hidden="true"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="absolute w-[245px] -translate-x-[27px] opacity-[0.10] blur-[0.8px] mix-blend-multiply sm:w-[300px] lg:w-[345px] xl:w-[365px] motion-ghost-one">
          <Image
            src={subject}
            alt=""
            width={600}
            height={800}
            aria-hidden="true"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="absolute w-[250px] translate-x-[17px] opacity-[0.045] blur-[3px] mix-blend-screen sm:w-[305px] lg:w-[350px] xl:w-[370px] motion-color-echo">
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

      {/* Main subject */}
      <div className="relative z-20 w-[260px] motion-subject-float sm:w-[320px] lg:w-[370px] xl:w-[390px]">
        <Image
          src={subject}
          alt="Pastor Olawale Smith"
          width={600}
          height={800}
          priority
          className="h-auto w-full object-contain drop-shadow-[0_25px_35px_rgba(17,17,15,0.20)]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-4 top-[22%] h-[34%] w-10 rounded-full bg-blue-soft/[0.08] blur-2xl"
        />
      </div>

      {/* Editorial marker */}
      <div className="absolute bottom-4 right-2 z-30 hidden items-center gap-3 sm:flex lg:right-0">
        <span className="h-px w-8 bg-blue-soft/40" />

        <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-charcoal/25">
          The work continues
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* About Section                                                              */
/* -------------------------------------------------------------------------- */

export default function AboutSection() {
  return (
    <Section theme="light"
      id="about"
      className="relative overflow-hidden bg-ivory text-charcoal"
    >
      {/* Atmospheric Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute left-[-15%] top-[8%] h-[560px] w-[560px] rounded-full bg-blue-soft/[0.10] blur-[150px]" />

        <div className="absolute right-[-15%] top-[32%] h-[620px] w-[620px] rounded-full bg-blue/[0.075] blur-[160px]" />

        <div className="absolute left-[38%] top-[20%] h-[320px] w-[320px] rounded-full bg-gold/[0.08] blur-[130px]" />

        <div className="absolute bottom-[-10%] right-[20%] h-[460px] w-[460px] rounded-full bg-bronze/[0.07] blur-[140px]" />

        <div className="absolute -left-64 top-[10%] h-[620px] w-[620px] rounded-full border border-blue-soft/[0.13]" />

        <div className="absolute -left-40 top-[16%] h-[470px] w-[470px] rounded-full border border-gold/[0.12]" />

        <div className="absolute -right-72 bottom-[4%] h-[720px] w-[720px] rounded-full border border-blue/[0.10]" />

        <div className="absolute -right-52 bottom-[12%] h-[520px] w-[520px] rounded-full border border-gold/[0.10]" />

        <div className="absolute left-0 top-[18%] h-px w-[26%] bg-gradient-to-r from-transparent via-blue-soft/35 to-transparent" />

        <div className="absolute right-0 top-[58%] h-px w-[22%] bg-gradient-to-l from-transparent via-gold/30 to-transparent" />

        <div className="absolute bottom-[14%] left-0 h-px w-[18%] bg-gradient-to-r from-transparent via-blue-soft/25 to-transparent" />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,208,0.055),transparent_30%),radial-gradient(circle_at_75%_65%,rgba(183,154,91,0.045),transparent_32%)]" />
      </div>

      <div className="relative z-10">
        {/* ================================================================== */}
        {/* SECTION 01 — THE MAN OF GOD                                       */}
        {/* ================================================================== */}

        <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 sm:py-28 lg:px-12 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:items-end">
            <div className="about-reveal">
              <div className="flex items-center gap-4">
                <span className="h-px w-12 bg-bronze" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze">
                  About the Man of God
                </p>
              </div>
            </div>

            <div className="about-reveal about-delay-80 lg:ml-auto lg:max-w-3xl">
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
          </div>

          <div className="mt-20 grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20 xl:gap-28">
            {/* Photography */}
            <div className="about-reveal about-delay-120">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -left-5 top-7 h-[72%] w-[82%] border border-blue-soft/[0.20] bg-blue-soft/[0.045]"
                />

                <div
                  aria-hidden="true"
                  className="absolute -bottom-5 -right-5 h-[68%] w-[72%] border border-gold/[0.24]"
                />

                <div className="relative z-10 aspect-[4/5] overflow-hidden border border-blue-soft/60 bg-charcoal-soft shadow-[0_30px_80px_rgba(17,17,15,0.12)]">
                  <Image
                    src={profileImages.main}
                    alt="Pastor Olawale Smith"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 52vw"
                    className="object-cover transition-transform duration-1000 hover:scale-[1.035]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-blue-deep/[0.12]" />

                  <div className="absolute inset-0 border border-white/[0.10]" />

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
            </div>

            {/* Profile Content */}
            <div className="flex flex-col justify-center lg:pt-8">
              <div className="about-reveal about-delay-180">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-deep">
                  Meet The Man of God
                </p>
              </div>

              <div className="about-reveal about-delay-240">
                <h3 className="mt-5 max-w-2xl text-3xl font-medium leading-[1.05] tracking-[-0.025em] text-charcoal sm:text-4xl">
                  Pastor Olawale Smith
                </h3>
              </div>

              <div className="about-reveal about-delay-300">
                <div className="mt-7 max-w-2xl space-y-5 text-justify text-sm leading-8 text-charcoal/55 sm:text-base">
                  <p>
                    Pastor Olawale Smith is a born-again child of God, burning
                    with a special passion to reach the world for Christ. He
                    is a preacher, a teacher, a public speaker, a prolific
                    reader, and a writer of the words of the gospel of Jesus
                    Christ. His ministries involve evangelism, teaching,
                    prophecy, and deliverance. In all, he ministers in various
                    gifts of the Holy Spirit to the GLORY OF GOD ALMIGHTY.
                  </p>

                  <p>
                    He is graced with a leadership instinct; he takes
                    responsibility in every facet of life where he finds
                    himself, which eventually puts him at the forefront and in
                    leadership roles in all his circles of influence. He is an
                    intelligent idea creator, innovative-events developer,
                    Manager, and Achor. He currently pastors in The Redeemed
                    Christian Church of God, Grace...
                  </p>
                </div>
              </div>

              <div className="about-reveal about-delay-360">
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
              </div>

              <div className="about-reveal about-delay-420">
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
              </div>
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
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-2 xl:grid-cols-[0.88fr_1.12fr]">
            {/* LEFT — TEXT */}
            <div className="relative z-40 max-w-2xl">
              <div className="about-reveal">
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-blue-soft" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-deep">
                    Ministry Activities
                  </p>
                </div>
              </div>

              <div className="about-reveal about-delay-80">
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
              </div>

              <div className="about-reveal about-delay-160">
                <p className="mt-7 max-w-xl text-left text-justify text-sm leading-8 text-charcoal/45 sm:text-base sm:leading-8">
                  A glimpse into the gatherings, teachings, conferences,
                  worship moments, outreach, and people that form part of the
                  ministry&apos;s ongoing work.
                </p>
              </div>
            </div>

            {/* RIGHT — ANIMATED VISUAL */}
            <div className="about-reveal about-delay-140">
              <div className="relative lg:-mr-14 xl:-mr-22">
                <MinistryMotionVisual />
              </div>
            </div>
          </div>

          <div className="about-reveal about-delay-220">
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-10 bg-gold/50" />

              <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-charcoal/30">
                Selected moments
              </span>
            </div>
          </div>

          {/* Gallery */}
          <div className="mt-8 grid auto-rows-[220px] grid-cols-1 gap-4 sm:auto-rows-[240px] sm:grid-cols-2 lg:mt-4 lg:auto-rows-[230px] lg:grid-cols-4">
            {ministryActivities.map((activity, index) => {
              const isLarge = activity.size === "large";

              return (
                <div
                  key={activity.id}
                  className={`about-gallery-item ${
                    isLarge
                      ? "sm:row-span-2 lg:col-span-2 lg:row-span-2"
                      : ""
                  }`}
                  style={
                    {
                      "--about-delay": `${Math.min(index * 50, 300)}ms`,
                    } as CSSProperties
                  }
                >
                  <article className="group relative h-full min-h-[220px] overflow-hidden border border-charcoal/10 bg-charcoal-soft shadow-[0_15px_45px_rgba(17,17,15,0.08)]">
                    <Image
                      src={activity.src}
                      alt={activity.alt}
                      fill
                      sizes={
                        isLarge
                          ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw"
                          : "(max-width: 640px) 100vw, 50vw"
                      }
                      className="object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.06]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                    <div className="absolute inset-0 bg-blue-deep/[0.08] mix-blend-screen transition-opacity duration-500 group-hover:bg-blue/[0.14]" />

                    <div className="absolute inset-0 border border-white/[0.10] transition-colors duration-500 group-hover:border-blue-soft/30" />

                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between">
                      <span className="inline-flex items-center border border-white/15 bg-charcoal/50 px-3 py-2 text-[8px] font-bold uppercase tracking-[0.2em] text-ivory backdrop-blur-md">
                        {activity.tag}
                      </span>

                      <span className="text-[8px] font-medium uppercase tracking-[0.2em] text-white/45">
                        {String(activity.id).padStart(2, "0")}
                      </span>
                    </div>

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

                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
                      <div className="absolute -right-20 -top-20 h-48 w-48 rounded-full bg-blue-soft/10 blur-3xl" />

                      <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-gold/10 blur-3xl" />
                    </div>
                  </article>
                </div>
              );
            })}
          </div>

          {/* Gallery footer */}
          <div className="about-reveal about-delay-250">
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
          </div>
        </div>
      </div>
    </Section>
  );
}