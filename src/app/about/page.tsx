
"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUpRight,
  BookOpen,
  Heart,
  Mic2,
  Users,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

const profileImages = [
  {
    src: "/images/pastor olawale smith 002.jpg",
    alt: "Pastor Olawale Smith",
    className:
      "absolute left-0 top-0 h-[62%] w-[68%] sm:w-[64%]",
  },
  {
    src: "/images/pastor olawale smith 003.jpg",
    alt: "Pastor Olawale Smith",
    className:
      "absolute bottom-0 right-0 h-[62%] w-[68%] sm:w-[64%]",
  },
  {
    src: "/images/pastor olawale smith 023.jpg",
    alt: "Pastor Olawale Smith",
    className:
      "absolute left-[28%] top-[19%] z-10 h-[58%] w-[47%] sm:left-[29%] sm:w-[44%]",
  },
];

const ministryFocus = [
  {
    icon: BookOpen,
    number: "01",
    title: "The Word",
    text: "A ministry grounded in Scripture and committed to communicating the truth of God's Word faithfully.",
  },
  {
    icon: Mic2,
    number: "02",
    title: "Teaching",
    text: "Making spiritual truth practical, understandable, and relevant to everyday life and growth.",
  },
  {
    icon: Users,
    number: "03",
    title: "People",
    text: "Building people, strengthening faith, developing character, and helping individuals discover purpose.",
  },
  {
    icon: Heart,
    number: "04",
    title: "Kingdom Impact",
    text: "Equipping people to live intentionally and become meaningful expressions of God's Kingdom.",
  },
];

const ministryActivities = [
  {
    src: "/images/pastor olawale smith 017.jpg",
    category: "Family",
    context: "Church Gathering",
    year: "2026",
    size: "large",
  },
  {
    src: "/images/pastor olawale smith 026.jpg",
    category: "Family",
    context: "Church Gathering",
    year: "2026",
    size: "large",
  },
  {
    src: "/images/pastor olawale smith 013.jpg",
    category: "Church",
    context: "Ministry Gathering",
    year: "2026",
    size: "large",
  },
  {
    src: "/images/pastor olawale smith 010.jpg",
    category: "Pastoring",
    context: "Conference",
    year: "2026",
    size: "small",
  },
  {
    src: "/images/pastor olawale smith 027.jpg",
    category: "Worship",
    context: "Church Gathering",
    year: "2026",
    size: "small",
  },
  {
    src: "/images/pastor olawale smith 029.jpg",
    category: "Community",
    context: "Ministry Community",
    year: "2026",
    size: "large",
  },
  {
    src: "/images/pastor olawale smith 036.jpg",
    category: "Word & Teaching",
    context: "Teaching Podcast",
    year: "2026",
    size: "small",
  },
  {
    src: "/images/pastor olawale smith 028.jpg",
    category: "Prayer",
    context: "Prayer Gathering",
    year: "2026",
    size: "small",
  },
  {
    src: "/images/pastor olawale smith 009.jpg",
    category: "Outreach",
    context: "Ministry Outreach",
    year: "2026",
    size: "large",
  },
  {
    src: "/images/pastor olawale smith 034.jpg",
    category: "Leadership",
    context: "Love Feast",
    year: "2026",
    size: "small",
  },
  {
    src: "/images/pastor olawale smith 019.jpg",
    category: "Prayer",
    context: "Pastoral Ministry",
    year: "2026",
    size: "small",
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
        className="pointer-events-none absolute inset-0 z-[5] overflow-visible"
      >
        <div className="motion-trail motion-trail-one absolute left-[4%] top-[39%] h-px w-[62%] origin-left bg-gradient-to-r from-transparent via-blue-soft/10 to-blue-soft/45 blur-[0.5px]" />

        <div className="motion-trail motion-trail-two absolute left-[12%] top-[45%] h-px w-[48%] origin-left bg-gradient-to-r from-transparent via-blue/10 to-blue-soft/30" />

        <div className="motion-trail motion-trail-three absolute left-[24%] top-[66%] h-px w-[42%] origin-left bg-gradient-to-r from-transparent via-gold/10 to-gold/35" />

        <div className="motion-wash absolute left-[2%] top-[34%] h-[120px] w-[58%] -rotate-3 bg-gradient-to-r from-blue-soft/[0.025] via-blue-soft/[0.045] to-transparent blur-2xl" />

        <span className="motion-dash absolute left-[13%] top-[30%] h-px w-12 bg-blue-soft/35" />
        <span className="motion-dash motion-dash-two absolute left-[8%] top-[57%] h-px w-7 bg-blue/30" />
        <span className="motion-dash motion-dash-three absolute right-[11%] top-[34%] h-px w-10 bg-gold/35" />
        <span className="motion-dash motion-dash-four absolute right-[8%] top-[61%] h-px w-6 bg-blue-soft/30" />

        <span className="motion-particle absolute left-[22%] top-[25%] h-1 w-1 rounded-full bg-blue-soft/45 shadow-[0_0_10px_rgba(111,168,230,0.35)]" />
        <span className="motion-particle motion-particle-two absolute left-[17%] top-[69%] h-1 w-1 rounded-full bg-gold-light/45 shadow-[0_0_10px_rgba(201,180,125,0.3)]" />
        <span className="motion-particle motion-particle-three absolute right-[19%] top-[22%] h-1 w-1 rounded-full bg-blue-soft/35" />
        <span className="motion-particle motion-particle-four absolute bottom-[23%] right-[15%] h-1 w-1 rounded-full bg-gold/40" />
      </div>

      {/* Photographic afterimages */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center"
      >
        <div className="motion-ghost-two absolute w-[230px] -translate-x-[48px] opacity-[0.075] blur-[1.5px] mix-blend-multiply sm:w-[285px] lg:w-[330px] xl:w-[350px]">
          <Image
            src={subject}
            alt=""
            width={600}
            height={800}
            aria-hidden="true"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="motion-ghost-one absolute w-[245px] -translate-x-[27px] opacity-[0.10] blur-[0.8px] mix-blend-multiply sm:w-[300px] lg:w-[345px] xl:w-[365px]">
          <Image
            src={subject}
            alt=""
            width={600}
            height={800}
            aria-hidden="true"
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="motion-color-echo absolute w-[250px] translate-x-[17px] opacity-[0.045] blur-[3px] mix-blend-screen sm:w-[305px] lg:w-[350px] xl:w-[370px]">
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
      <div className="motion-subject relative z-20 w-[260px] sm:w-[320px] lg:w-[370px] xl:w-[390px]">
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
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AboutPage() {
  return (
    <PageLayout theme="light">
      <main className="relative overflow-hidden bg-ivory text-charcoal">
        {/* ------------------------------------------------------------------ */}
        {/* Hero                                                               */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-charcoal text-ivory">
          {/* Atmosphere */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-soft/[0.08] blur-[130px]" />

            <div className="absolute right-[-10%] top-[15%] h-[500px] w-[500px] rounded-full bg-gold/[0.08] blur-[150px]" />

            <div className="absolute bottom-[-15%] left-[30%] h-[450px] w-[450px] rounded-full bg-blue/[0.06] blur-[140px]" />

            <div className="absolute inset-x-0 top-[34%] h-px bg-gradient-to-r from-transparent via-blue-soft/10 to-transparent" />
          </div>

          <div className="relative mx-auto grid min-h-[88vh] w-full max-w-7xl items-end gap-14 px-6 pb-20 pt-40 sm:pb-28 sm:pt-48 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20 lg:px-8 lg:pb-32">
            <div className="relative z-10">
              <p className="eyebrow text-gold about-fade-in about-delay-1">
                About the Ministry
              </p>

              <h1 className="display-heading about-fade-in about-delay-2 mt-6 max-w-5xl text-5xl text-ivory sm:text-7xl lg:text-[8rem] lg:leading-[0.88]">
                A life given
                <br />
                <span className="text-gold">to the work.</span>
              </h1>

              <p className="body-copy about-fade-in about-delay-3 mt-8 max-w-2xl text-base text-ivory/60 sm:text-lg lg:text-xl">
                Olawale Smith Ministries reaches, teaches,
                strengthens and equips people through the message
                of Christ and the transforming power of God's Word.
              </p>

              <div className="about-fade-in about-delay-4 mt-10 flex flex-wrap items-center gap-4">
                <Link
                  href="#man-of-god"
                  className="group inline-flex items-center gap-3 bg-gold px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-light"
                >
                  Meet the man of God

                  <ArrowDown
                    size={14}
                    className="transition-transform duration-300 group-hover:translate-y-1"
                  />
                </Link>

                <Link
                  href="/resources"
                  className="group inline-flex items-center gap-3 border border-ivory/15 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/75 transition-all duration-300 hover:border-blue-soft/50 hover:bg-blue-soft/10 hover:text-ivory"
                >
                  Explore resources

                  <ArrowUpRight
                    size={14}
                    className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>

            {/* Hero portrait */}
            <div className="about-hero-portrait relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto">
              {/* Outer blue aura */}
              <div className="about-hero-aura absolute -inset-6 rounded-[2.5rem] bg-blue/15 blur-3xl" />

              {/* Floating blue architectural layer */}
              <div className="about-hero-blue-frame absolute -right-3 -top-3 h-full w-full rounded-[2rem] border border-blue-soft/30 bg-blue/[0.12] backdrop-blur-md" />

              {/* Gold offset frame */}
              <div className="about-hero-gold-frame absolute -bottom-3 -left-3 h-full w-full rounded-[2rem] border border-gold/20 bg-gold/[0.035]" />

              {/* Main glass frame */}
              <div className="group relative overflow-hidden rounded-[2rem] border border-charcoal/10 bg-white/[0.28] p-2 shadow-[0_35px_100px_rgba(17,17,15,0.16)] backdrop-blur-xl">
                {/* Blue inner atmosphere */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(111,168,230,0.22),transparent_34%)]"
                />

                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-blue-deep">
                  <Image
                    src="/images/pastor olawale smith 003.jpg"
                    alt="Pastor Olawale Smith"
                    fill
                    priority
                    sizes="(max-width: 1024px) 90vw, 42vw"
                    className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
                  />

                  {/* Cinematic image treatment */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-charcoal/[0.04] to-blue/[0.10] mix-blend-multiply" />

                  <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.16] via-transparent to-gold/[0.08] mix-blend-overlay" />

                  {/* Subtle blue atmospheric wash */}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(111,168,230,0.16),transparent_30%)] opacity-80" />

                  {/* Glass reflection */}
                  <div className="about-glass-reflection pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent blur-sm" />

                  {/* Fine inner border */}
                  <div className="pointer-events-none absolute inset-0 rounded-[1.55rem] border border-white/15" />

                  {/* Bottom cinematic gradient */}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-charcoal/55 to-transparent" />
                </div>

                {/* Floating image label */}
                <div className="about-hero-label absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
                  <div className="rounded-full border border-white/15 bg-charcoal/[0.52] px-4 py-2 backdrop-blur-xl">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/75">
                      Faith • Calling • Impact
                    </span>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-soft/30 bg-blue/[0.25] text-blue-soft backdrop-blur-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-soft shadow-[0_0_14px_rgba(111,168,230,0.75)]" />
                  </div>
                </div>
              </div>

              {/* Small floating accent */}
              <div className="about-hero-accent absolute -right-5 top-[18%] hidden h-14 w-14 items-center justify-center rounded-full border border-blue-soft/20 bg-blue/[0.08] backdrop-blur-xl lg:flex">
                <span className="h-2 w-2 rounded-full bg-blue-soft shadow-[0_0_18px_rgba(111,168,230,0.8)]" />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* The Man of God                                                     */}
        {/* ------------------------------------------------------------------ */}

        <section
          id="man-of-god"
          className="relative overflow-hidden bg-ivory"
        >
          {/* Atmospheric details */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-12%] top-[20%] h-96 w-96 rounded-full bg-blue-soft/[0.08] blur-[130px]" />
            <div className="absolute right-[-12%] bottom-[8%] h-96 w-96 rounded-full bg-gold/[0.08] blur-[130px]" />

            <div className="absolute left-0 top-[18%] h-px w-[30%] bg-gradient-to-r from-blue-soft/20 to-transparent" />

            <div className="absolute right-0 bottom-[18%] h-px w-[25%] bg-gradient-to-l from-gold/20 to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="grid items-center gap-20 lg:grid-cols-[0.9fr_1.1fr] lg:gap-28">
              {/* Premium Photography Composition */}
              <div className="about-photo-composition relative mx-auto aspect-[0.84] w-full max-w-[540px]">
                {/* Atmospheric depth */}
                <div
                  aria-hidden="true"
                  className="about-photo-aura absolute -inset-8 rounded-[3rem] bg-blue/10 blur-3xl"
                />

                <div
                  aria-hidden="true"
                  className="about-photo-gold-glow absolute -bottom-10 left-[8%] h-[260px] w-[260px] rounded-full bg-gold/10 blur-[100px]"
                />

                {/* Architectural framing */}
                <div
                  aria-hidden="true"
                  className="absolute inset-[6%] border border-blue-soft/[0.16]"
                />

                <div
                  aria-hidden="true"
                  className="about-gold-frame absolute left-[4%] top-[7%] h-[84%] w-[83%] border border-gold/[0.20] bg-gold/[0.018]"
                />

                <div
                  aria-hidden="true"
                  className="about-blue-frame absolute -right-2 -top-2 h-[88%] w-[83%] border border-blue-soft/25 bg-blue/[0.055] backdrop-blur-[2px]"
                />

                {/* Rear photograph */}
                <div className="about-photo-rear absolute left-[4%] top-[12%] z-10 h-[56%] w-[47%] overflow-hidden border border-blue-soft/25 bg-ivory-muted shadow-[0_30px_80px_rgba(17,17,15,0.12)]">
                  <Image
                    src={profileImages[0].src}
                    alt={profileImages[0].alt}
                    fill
                    className="object-cover transition-transform duration-[1400ms] ease-out hover:scale-[1.045]"
                    sizes="(max-width: 1024px) 40vw, 20vw"
                  />

                  <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.12] via-transparent to-gold/[0.08] mix-blend-overlay" />

                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/35 via-transparent to-transparent" />

                  <div className="pointer-events-none absolute inset-0 border border-white/15" />
                </div>

                {/* Main photograph */}
                <div className="about-photo-main group absolute right-[5%] top-[7%] z-20 h-[70%] w-[67%] overflow-hidden rounded-[1.5rem] border border-white/30 bg-blue-deep p-1.5 shadow-[0_40px_100px_rgba(17,17,15,0.20)]">
                  <div className="relative h-full w-full overflow-hidden rounded-[1.1rem]">
                    <Image
                      src={profileImages[1].src}
                      alt={profileImages[1].alt}
                      fill
                      priority
                      className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
                      sizes="(max-width: 1024px) 65vw, 32vw"
                    />

                    {/* Cinematic image treatment */}
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/65 via-transparent to-blue/[0.12] mix-blend-multiply" />

                    <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.16] via-transparent to-gold/[0.08] mix-blend-overlay" />

                    {/* Subtle blue atmosphere */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_15%,rgba(111,168,230,0.20),transparent_32%)]" />

                    {/* Glass reflection */}
                    <div className="about-glass-reflection about-glass-reflection-slow pointer-events-none absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.14] to-transparent blur-sm" />

                    {/* Fine inner border */}
                    <div className="pointer-events-none absolute inset-0 rounded-[1.1rem] border border-white/15" />
                  </div>
                </div>

                {/* Foreground photograph */}
                <div className="about-photo-front group absolute bottom-[5%] left-[9%] z-30 h-[47%] w-[48%] overflow-hidden border-[6px] border-ivory bg-ivory shadow-[0_35px_90px_rgba(17,17,15,0.18)]">
                  <Image
                    src={profileImages[2].src}
                    alt={profileImages[2].alt}
                    fill
                    className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.055]"
                    sizes="(max-width: 1024px) 45vw, 24vw"
                  />

                  {/* Dark cinematic wash */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/45 via-transparent to-blue/[0.06] mix-blend-multiply" />

                  {/* Gold counter-light */}
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gold/[0.10] mix-blend-overlay" />

                  {/* Inner edge */}
                  <div className="pointer-events-none absolute inset-0 border border-white/20" />
                </div>

                {/* Gold depth accent */}
                <div
                  aria-hidden="true"
                  className="about-gold-depth absolute bottom-[3%] left-[6%] z-5 h-[48%] w-[48%] border border-gold/20 bg-gold/[0.025]"
                />

                {/* Small floating blue accent */}
                <div className="about-photo-accent absolute -right-5 top-[28%] z-40 hidden h-14 w-14 items-center justify-center rounded-full border border-blue-soft/25 bg-blue/[0.08] backdrop-blur-xl sm:flex">
                  <span className="h-2 w-2 rounded-full bg-blue-soft shadow-[0_0_18px_rgba(111,168,230,0.8)]" />
                </div>

                {/* Glass identity label */}
                <div className="about-identity-label absolute bottom-[3%] right-[4%] z-40 flex items-center gap-3 rounded-full border border-charcoal/10 bg-ivory/[0.78] px-4 py-2.5 shadow-[0_15px_40px_rgba(17,17,15,0.10)] backdrop-blur-xl">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-soft opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-blue" />
                  </span>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/60">
                    The Man of God
                  </span>
                </div>

                {/* Fine directional accents */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-[22%] h-px w-[18%] bg-gradient-to-r from-transparent via-blue-soft/35 to-transparent"
                />

                <div
                  aria-hidden="true"
                  className="absolute bottom-[18%] right-0 h-px w-[20%] bg-gradient-to-l from-transparent via-gold/30 to-transparent"
                />
              </div>

              {/* Profile */}
              <div className="max-w-2xl">
                <p className="eyebrow text-bronze">The Man of God</p>

                <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-7xl">
                  Called to
                  <br />
                  <span className="text-bronze">serve</span>
                </h2>

                <p className="mt-9 text-base leading-8 text-charcoal/70 sm:text-lg">
                  Pastor Olawale Smith is a born-again child
                  of God, burning with a special passion to
                  reach the world for Christ. He is a preacher,
                  a teacher, a public speaker, a prolific
                  reader, and a writer of the words of the
                  gospel of Jesus Christ. His ministries involve
                  evangelism, teaching, prophecy, and deliverance.
                  In all, he ministers in various gifts of the Holy
                  Spirit to the glory of GOD ALMIGHTY.
                </p>

                <p className="mt-7 text-base leading-8 text-charcoal/70 sm:text-lg">
                  He is graced with a leadership instinct; he
                  takes responsibility in every facet of life
                  where he finds himself, which eventually
                  puts him at the forefront and in leadership
                  roles in all his circles of influence.
                  He is an intelligent idea creator,
                  innovative-events developer, Manager, and Anchor.
                  Pastor Olawale Smith is kind-hearted, Simple, cool,
                  and easy-going, a friendly person to be with.
                  He is an excellent fashion sense dresser, a
                  Fashion Stylist, and a Fashion Retailer.
                </p>

                <p className="mt-7 text-base leading-8 text-charcoal/70 sm:text-lg">
                  He is a graduate of computer science from the
                  Lagos State University of Science and Technology
                  (LASUSTECH). He is currently the Pastor in charge
                  of The Redeemed Christian Church of God,
                  <b> Grace Assembly Parish</b>, Lagos Province 12,
                  Asipa, Ayobo Lagos. He hails from Oyo State in
                  Nigeria, and he is happily married to his beloved
                  wife Oluwadamilola Dorcas Smith.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Calling                                                             */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-charcoal text-ivory">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-15%] top-[10%] h-[500px] w-[500px] rounded-full bg-blue/[0.08] blur-[150px]" />

            <div className="absolute right-[-10%] bottom-[-10%] h-[450px] w-[450px] rounded-full bg-gold/[0.07] blur-[140px]" />

            <div className="absolute left-[8%] top-[28%] h-px w-[28%] bg-gradient-to-r from-blue-soft/20 to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="grid gap-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-28">
              <div>
                <p className="eyebrow text-gold">Calling & Ministry</p>

                <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-6xl">
                  A ministry
                  <br />
                  <span className="text-gold">in motion.</span>
                </h2>
              </div>

              <div className="max-w-3xl">
                <p className="text-lg leading-9 text-ivory/70 sm:text-xl">
                  The ministry is centered on the Word of
                  God, spiritual growth, and the
                  transformation of lives through the message
                  of Christ.
                </p>

                <p className="mt-8 text-base leading-8 text-ivory/55 sm:text-lg">
                  Through preaching, teaching, evangelism,
                  leadership, prayer, resources, and
                  relationships, the work seeks to create
                  environments where people can encounter
                  truth, grow in faith, discover purpose, and
                  become equipped for meaningful Kingdom
                  service.
                </p>

                <p className="mt-8 text-base leading-8 text-ivory/55 sm:text-lg">
                  The ministry extends beyond a pulpit. It
                  finds expression through churches,
                  conferences, gatherings, media, written
                  resources, conversations, mentorship,
                  outreach, and the everyday responsibility
                  of building people.
                </p>

                <div className="mt-12 grid gap-6 border-t border-ivory/10 pt-8 sm:grid-cols-2">
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                      Ministry Expression
                    </span>

                    <p className="mt-3 text-sm leading-7 text-ivory/55">
                      Evangelism · Teaching · Prophecy ·
                      Deliverance
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                      Ministry Foundation
                    </span>

                    <p className="mt-3 text-sm leading-7 text-ivory/55">
                      The Word · Spiritual Growth · People ·
                      Kingdom Impact
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Ministry Focus                                                      */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-ivory">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-[-10%] top-[15%] h-[420px] w-[420px] rounded-full bg-blue-soft/[0.07] blur-[140px]" />

            <div className="absolute left-[-12%] bottom-[5%] h-[400px] w-[400px] rounded-full bg-gold/[0.07] blur-[130px]" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-20 pb-0 sm:py-32 lg:px-8 lg:py-40">
            <div className="max-w-3xl">
              <p className="eyebrow text-bronze">Ministry Focus</p>

              <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-7xl">
                What the work
                <br />
                <span className="text-bronze">is built around.</span>
              </h2>

              <p className="mt-7 max-w-2xl text-base leading-8 text-charcoal/60 sm:text-lg">
                Four simple expressions capture the heart
                of the ministry and the kind of impact it
                desires to leave in people.
              </p>
            </div>

            <div className="mt-16 grid border-t border-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
              {ministryFocus.map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.number}
                    className="group border-b border-charcoal/10 px-0 py-10 sm:nth-[odd]:pr-8 sm:nth-[even]:pl-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-semibold tracking-[0.16em] text-bronze">
                        {item.number}
                      </span>

                      <Icon
                        size={19}
                        strokeWidth={1.4}
                        className="text-blue transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>

                    <h3 className="mt-8 text-2xl font-medium tracking-[-0.025em] text-charcoal">
                      {item.title}
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-charcoal/60">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Ministry In Motion                                                 */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-ivory">
          <div className="relative mx-auto w-full max-w-7xl px-4 py-20 sm:py-24 lg:px-8 lg:py-40">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div className="order-2 lg:order-1">
                <p className="eyebrow text-bronze">
                  Ministry Activities
                </p>

                <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-7xl">
                  A ministry
                  <br />
                  <span className="text-blue">in motion.</span>
                </h2>

                <p className="mt-7 max-w-xl text-base leading-8 text-charcoal/60 sm:text-lg">
                  A glimpse into the gatherings, teachings,
                  conferences, worship moments, outreach, and
                  people that form part of the ministry&apos;s
                  ongoing work.
                </p>

                <div className="mt-10 border-l border-blue/25 pl-6">
                  <p className="text-sm leading-7 text-charcoal/55">
                    The work continues wherever people gather,
                    learn, worship, serve, pray, and grow.
                  </p>
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <MinistryMotionVisual />
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Selected Moments                                                   */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-charcoal text-ivory">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[-12%] top-[25%] h-[420px] w-[420px] rounded-full bg-blue/[0.07] blur-[140px]" />

            <div className="absolute right-[-12%] bottom-[15%] h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-[140px]" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-gold">Selected Moments</p>

                <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-7xl">
                  People,
                  <br />
                  <span className="text-gold">places, moments.</span>
                </h2>
              </div>

              <p className="max-w-sm text-sm leading-7 text-ivory/45">
                A visual record of some of the gatherings,
                relationships, teachings, and moments that
                form part of the ministry&apos;s journey.
              </p>
            </div>

            <div className="mt-16 grid auto-rows-[220px] grid-cols-2 gap-3 sm:auto-rows-[250px] sm:gap-4 lg:grid-cols-4">
              {ministryActivities.map((activity, index) => {
                const isLarge = activity.size === "large";

                const spans = [
                  "col-span-2 row-span-2",
                  "col-span-1 row-span-2",
                  "col-span-1 row-span-2",
                  "col-span-1 row-span-1",
                  "col-span-1 row-span-1",
                  "col-span-2 row-span-2",
                  "col-span-1 row-span-1",
                  "col-span-1 row-span-1",
                  "col-span-2 row-span-2",
                  "col-span-1 row-span-1",
                  "col-span-1 row-span-1",
                ];

                return (
                  <div
                    key={activity.src}
                    className={`${
                      isLarge ? "sm:row-span-2" : ""
                    } ${spans[index] ?? ""}`}
                  >
                    <div className="group relative h-full overflow-hidden bg-charcoal-soft">
                      <Image
                        src={activity.src}
                        alt={`${activity.category} — ${activity.context}`}
                        fill
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.045]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/5 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-95" />

                      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                        <div className="flex items-end justify-between gap-3">
                          <div>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.16em] text-gold">
                              {activity.category}
                            </p>

                            <p className="mt-1 text-xs text-ivory/70">
                              {activity.context}
                            </p>
                          </div>

                          <span className="text-[8px] font-medium tracking-[0.14em] text-ivory/40">
                            {activity.year}
                          </span>
                        </div>
                      </div>

                      <div className="absolute inset-3 border border-ivory/0 transition-colors duration-500 group-hover:border-ivory/15" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Values / Way of Working                                             */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-ivory">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[15%] top-[-15%] h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-[140px]" />
            <div className="absolute right-[-10%] bottom-[5%] h-[420px] w-[420px] rounded-full bg-blue-soft/[0.07] blur-[140px]" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              <div>
                <p className="eyebrow text-bronze">
                  The Way We Serve
                </p>

                <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-6xl">
                  Truth with
                  <br />
                  <span className="text-bronze">
                    responsibility.
                  </span>
                </h2>
              </div>

              <div className="grid gap-10 sm:grid-cols-2">
                {[
                  {
                    number: "01",
                    title: "Faithfulness",
                    text: "Remain grounded in the Word and faithful to the message entrusted to the ministry.",
                  },
                  {
                    number: "02",
                    title: "Character",
                    text: "Build influence on integrity, humility, responsibility, and a life that reflects what is taught.",
                  },
                  {
                    number: "03",
                    title: "People",
                    text: "Treat people as the heart of ministry, with a commitment to growth, development, and genuine care.",
                  },
                  {
                    number: "04",
                    title: "Excellence",
                    text: "Approach ideas, communication, events, resources, and leadership with thoughtfulness and excellence.",
                  },
                ].map((item) => (
                  <div
                    key={item.number}
                    className="border-t border-charcoal/10 pt-7"
                  >
                    <span className="text-[10px] font-semibold tracking-[0.16em] text-bronze">
                      {item.number}
                    </span>

                    <h3 className="mt-5 text-xl font-medium tracking-[-0.02em] text-charcoal">
                      {item.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-charcoal/55">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Closing CTA                                                        */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-charcoal text-ivory">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[10%] top-[20%] h-[380px] w-[380px] rounded-full bg-blue/[0.08] blur-[140px]" />

            <div className="absolute right-[-5%] bottom-[-20%] h-[500px] w-[500px] rounded-full bg-gold/[0.07] blur-[150px]" />

            <div className="absolute left-0 top-1/2 h-px w-[32%] bg-gradient-to-r from-transparent via-blue-soft/15 to-transparent" />
          </div>

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="flex flex-col gap-12 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <p className="eyebrow text-gold">
                  The Journey Continues
                </p>

                <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-7xl">
                  The work
                  <br />
                  <span className="text-gold">continues.</span>
                </h2>

                <p className="mt-7 max-w-2xl text-base leading-8 text-ivory/55 sm:text-lg">
                  There is still more to teach, more people
                  to reach, more lives to build, and more
                  Kingdom work to do. Explore the resources,
                  invite the ministry, or find a meaningful
                  way to partner with the work.
                </p>
              </div>

              <div className="flex w-full max-w-[480px] flex-col gap-3">
                {/* Invite + Partner */}
                <div className="flex w-full gap-3">
                  <Link
                    href="/invite"
                    className="group inline-flex h-[56px] flex-1 items-center justify-center gap-3 border border-ivory/15 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/70 transition-all duration-300 hover:border-blue-soft/40 hover:bg-blue-soft/10 hover:text-ivory"
                  >
                    Invite

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/partner"
                    className="group inline-flex h-[56px] flex-1 items-center justify-center gap-3 border border-ivory/15 px-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/70 transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.08] hover:text-ivory"
                  >
                    Partner

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>
                </div>

                {/* Explore Resources */}
                <Link
                  href="/resources"
                  className="group inline-flex h-[56px] w-full items-center justify-center gap-3 bg-gold px-6 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-light"
                >
                  Explore resources

                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        /* ------------------------------------------------------------------ */
        /* Lightweight page entrance motion                                   */
        /* ------------------------------------------------------------------ */

        @keyframes aboutFadeIn {
          from {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }

          to {
            opacity: 1;
            transform: translate3d(0, 0, 0);
          }
        }

        .about-fade-in {
          opacity: 0;
          animation: aboutFadeIn 0.75s cubic-bezier(0.22, 1, 0.36, 1)
            forwards;
        }

        .about-delay-1 {
          animation-delay: 0.08s;
        }

        .about-delay-2 {
          animation-delay: 0.16s;
        }

        .about-delay-3 {
          animation-delay: 0.24s;
        }

        .about-delay-4 {
          animation-delay: 0.32s;
        }

        /* ------------------------------------------------------------------ */
        /* Hero portrait motion                                                */
        /* ------------------------------------------------------------------ */

        @keyframes aboutHeroAura {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(0.98);
          }

          50% {
            opacity: 0.32;
            transform: scale(1.018);
          }
        }

        @keyframes aboutHeroBlueFrame {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -5px, 0);
          }
        }

        @keyframes aboutHeroGoldFrame {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(1px, 3px, 0);
          }
        }

        @keyframes aboutHeroPortrait {
          0% {
            opacity: 0;
            transform: translate3d(0, 35px, 0) scale(0.975);
          }

          100% {
            opacity: 1;
            transform: translate3d(0, 0, 0) scale(1);
          }
        }

        @keyframes aboutHeroAccent {
          0%,
          100% {
            opacity: 0.45;
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: 0.72;
            transform: translate3d(0, -9px, 0);
          }
        }

        .about-hero-portrait {
          opacity: 0;
          animation: aboutHeroPortrait 0.9s
            cubic-bezier(0.22, 1, 0.36, 1) 0.35s forwards;
        }

        .about-hero-aura {
          animation: aboutHeroAura 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .about-hero-blue-frame {
          animation: aboutHeroBlueFrame 9s ease-in-out infinite;
          will-change: transform;
        }

        .about-hero-gold-frame {
          animation: aboutHeroGoldFrame 10s ease-in-out infinite;
          will-change: transform;
        }

        .about-hero-accent {
          animation: aboutHeroAccent 5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        /* ------------------------------------------------------------------ */
        /* Glass reflection                                                    */
        /* ------------------------------------------------------------------ */

        @keyframes aboutGlassReflection {
          0% {
            transform: translate3d(-140%, 0, 0) skewX(-18deg);
          }

          100% {
            transform: translate3d(420%, 0, 0) skewX(-18deg);
          }
        }

        .about-glass-reflection {
          transform: translate3d(-140%, 0, 0) skewX(-18deg);
          transition: transform 1.2s ease-in-out;
        }

        .group:hover .about-glass-reflection {
          transform: translate3d(420%, 0, 0) skewX(-18deg);
        }

        .about-glass-reflection-slow {
          transition-duration: 1.25s;
        }

        /* ------------------------------------------------------------------ */
        /* Man of God photography                                             */
        /* ------------------------------------------------------------------ */

        @keyframes aboutPhotoAura {
          0%,
          100% {
            opacity: 0.22;
            transform: scale(0.97);
          }

          50% {
            opacity: 0.31;
            transform: scale(1.015);
          }
        }

        @keyframes aboutPhotoGoldGlow {
          0%,
          100% {
            opacity: 0.12;
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: 0.18;
            transform: translate3d(7px, -3px, 0);
          }
        }

        @keyframes aboutGoldFrame {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(1px, 3px, 0);
          }
        }

        @keyframes aboutBlueFrame {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -4px, 0);
          }
        }

        @keyframes aboutRearPhoto {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(-1.2deg);
          }

          50% {
            transform: translate3d(0, -3px, 0) rotate(-0.8deg);
          }
        }

        @keyframes aboutMainPhoto {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -4px, 0);
          }
        }

        @keyframes aboutFrontPhoto {
          0%,
          100% {
            transform: translate3d(0, 0, 0) rotate(1.5deg);
          }

          50% {
            transform: translate3d(0, 4px, 0) rotate(2deg);
          }
        }

        @keyframes aboutGoldDepth {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(2px, 4px, 0);
          }
        }

        @keyframes aboutPhotoAccent {
          0%,
          100% {
            opacity: 0.45;
            transform: translate3d(0, 0, 0);
          }

          50% {
            opacity: 0.72;
            transform: translate3d(0, -8px, 0);
          }
        }

        .about-photo-aura {
          animation: aboutPhotoAura 10s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .about-photo-gold-glow {
          animation: aboutPhotoGoldGlow 12s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .about-gold-frame {
          animation: aboutGoldFrame 10s ease-in-out infinite;
          will-change: transform;
        }

        .about-blue-frame {
          animation: aboutBlueFrame 11s ease-in-out infinite;
          will-change: transform;
        }

        .about-photo-rear {
          animation: aboutRearPhoto 11s ease-in-out infinite;
          will-change: transform;
        }

        .about-photo-main {
          animation: aboutMainPhoto 12s ease-in-out infinite;
          will-change: transform;
        }

        .about-photo-front {
          animation: aboutFrontPhoto 10s ease-in-out infinite;
          will-change: transform;
        }

        .about-gold-depth {
          animation: aboutGoldDepth 10s ease-in-out infinite;
          will-change: transform;
        }

        .about-photo-accent {
          animation: aboutPhotoAccent 5.5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        /* ------------------------------------------------------------------ */
        /* Ministry in Motion                                                  */
        /* ------------------------------------------------------------------ */

        @keyframes subjectFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(0, -4px, 0);
          }
        }

        @keyframes motionGhostOne {
          0%,
          100% {
            transform: translate3d(-27px, 0, 0);
            opacity: 0.1;
          }

          50% {
            transform: translate3d(-40px, -2px, 0);
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
            transform: translate3d(-63px, -3px, 0);
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
            transform: translate3d(29px, -2px, 0);
            opacity: 0.02;
          }
        }

        @keyframes motionTrail {
          0%,
          100% {
            transform: scaleX(0.84);
            opacity: 0.2;
          }

          50% {
            transform: scaleX(1);
            opacity: 0.55;
          }
        }

        @keyframes motionWash {
          0%,
          100% {
            transform: translate3d(-10px, 0, 0) rotate(-3deg);
            opacity: 0.3;
          }

          50% {
            transform: translate3d(14px, 0, 0) rotate(-3deg);
            opacity: 0.58;
          }
        }

        @keyframes motionParticle {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate3d(10px, -5px, 0);
            opacity: 0.65;
          }
        }

        @keyframes motionDash {
          0%,
          100% {
            transform: translate3d(-7px, 0, 0);
            opacity: 0.15;
          }

          50% {
            transform: translate3d(10px, 0, 0);
            opacity: 0.55;
          }
        }

        .motion-subject {
          animation: subjectFloat 8s ease-in-out infinite;
          will-change: transform;
        }

        .motion-ghost-one {
          animation: motionGhostOne 6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .motion-ghost-two {
          animation: motionGhostTwo 7s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .motion-color-echo {
          animation: motionColorEcho 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .motion-trail {
          animation: motionTrail 6s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .motion-trail-two {
          animation-duration: 7s;
          animation-delay: 0.7s;
        }

        .motion-trail-three {
          animation-duration: 6.5s;
          animation-delay: 1.1s;
        }

        .motion-wash {
          animation: motionWash 8s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .motion-dash {
          animation: motionDash 5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .motion-dash-two {
          animation-duration: 6s;
          animation-delay: 0.8s;
        }

        .motion-dash-three {
          animation-duration: 5.5s;
          animation-delay: 1.2s;
        }

        .motion-dash-four {
          animation-duration: 4.5s;
          animation-delay: 0.45s;
        }

        .motion-particle {
          animation: motionParticle 4.5s ease-in-out infinite;
          will-change: transform, opacity;
        }

        .motion-particle-two {
          animation-duration: 5.5s;
          animation-delay: 0.7s;
        }

        .motion-particle-three {
          animation-duration: 5s;
          animation-delay: 1.1s;
        }

        .motion-particle-four {
          animation-duration: 6s;
          animation-delay: 1.5s;
        }

        /* ------------------------------------------------------------------ */
        /* Performance hints                                                   */
        /* ------------------------------------------------------------------ */

        .about-hero-aura,
        .about-hero-blue-frame,
        .about-hero-gold-frame,
        .about-hero-accent,
        .about-photo-aura,
        .about-photo-gold-glow,
        .about-gold-frame,
        .about-blue-frame,
        .about-photo-rear,
        .about-photo-main,
        .about-photo-front,
        .about-gold-depth,
        .about-photo-accent,
        .motion-subject,
        .motion-ghost-one,
        .motion-ghost-two,
        .motion-color-echo,
        .motion-trail,
        .motion-wash,
        .motion-dash,
        .motion-particle {
          backface-visibility: hidden;
          transform-style: preserve-3d;
        }

        /* ------------------------------------------------------------------ */
        /* Reduced motion                                                      */
        /* ------------------------------------------------------------------ */

        @media (prefers-reduced-motion: reduce) {
          .about-fade-in,
          .about-hero-portrait,
          .about-hero-aura,
          .about-hero-blue-frame,
          .about-hero-gold-frame,
          .about-hero-accent,
          .about-photo-aura,
          .about-photo-gold-glow,
          .about-gold-frame,
          .about-blue-frame,
          .about-photo-rear,
          .about-photo-main,
          .about-photo-front,
          .about-gold-depth,
          .about-photo-accent,
          .motion-subject,
          .motion-ghost-one,
          .motion-ghost-two,
          .motion-color-echo,
          .motion-trail,
          .motion-wash,
          .motion-dash,
          .motion-particle {
            animation: none !important;
          }

          .about-fade-in,
          .about-hero-portrait {
            opacity: 1 !important;
          }

          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </PageLayout>
  );
}