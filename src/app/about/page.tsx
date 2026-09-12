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
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";

/* -------------------------------------------------------------------------- */
/* Data                                                                       */
/* -------------------------------------------------------------------------- */

const profileImages = [
  {
    src: "/images/pastor olawale smith 031.jpg",
    alt: "Pastor Olawale Smith",
    className:
      "absolute left-0 top-0 h-[62%] w-[68%] sm:w-[64%]",
  },
  {
    src: "/images/pastor olawale smith 002.jpg",
    alt: "Pastor Olawale Smith",
    className:
      "absolute bottom-0 right-0 h-[62%] w-[68%] sm:w-[64%]",
  },
  {
    src: "/images/pastor olawale smith 003.jpg",
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
/* Motion Study Visual                                                        */
/* -------------------------------------------------------------------------- */

function MinistryMotionVisual() {
  return (
    <div className="relative mx-auto h-[520px] w-full max-w-[620px] overflow-hidden sm:h-[620px]">
      {/* Atmospheric blue light */}
      <div className="absolute left-[12%] top-[24%] h-72 w-72 rounded-full bg-blue-soft/[0.09] blur-[100px]" />

      <div className="absolute right-[4%] top-[13%] h-64 w-64 rounded-full bg-gold/[0.10] blur-[100px]" />

      <div className="absolute bottom-[3%] left-[25%] h-56 w-56 rounded-full bg-blue/[0.07] blur-[90px]" />

      {/* Directional motion trails */}
      <div className="pointer-events-none absolute left-[5%] top-[47%] h-px w-[78%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent [transform:rotate(-8deg)] motion-trail" />

      <div className="pointer-events-none absolute left-[15%] top-[58%] h-px w-[65%] bg-gradient-to-r from-transparent via-gold/20 to-transparent [transform:rotate(-8deg)] motion-trail [animation-delay:0.8s]" />

      <div className="pointer-events-none absolute left-[9%] top-[67%] h-px w-[52%] bg-gradient-to-r from-transparent via-blue/15 to-transparent [transform:rotate(-8deg)] motion-trail [animation-delay:1.4s]" />

      {/* Motion dashes */}
      <div className="absolute left-[13%] top-[31%] h-px w-12 bg-blue-soft/30 motion-dash" />
      <div className="absolute left-[9%] top-[39%] h-px w-20 bg-blue-soft/20 motion-dash [animation-delay:0.5s]" />
      <div className="absolute left-[18%] top-[74%] h-px w-14 bg-gold/20 motion-dash [animation-delay:1s]" />
      <div className="absolute right-[12%] top-[26%] h-px w-10 bg-gold/20 motion-dash [animation-delay:1.6s]" />

      {/* Small particles */}
      <span className="absolute left-[22%] top-[23%] h-1 w-1 rounded-full bg-blue-soft/50 motion-particle" />
      <span className="absolute left-[12%] top-[60%] h-1.5 w-1.5 rounded-full bg-gold/40 motion-particle [animation-delay:0.7s]" />
      <span className="absolute right-[19%] top-[39%] h-1 w-1 rounded-full bg-blue-soft/40 motion-particle [animation-delay:1.2s]" />
      <span className="absolute right-[13%] bottom-[24%] h-1.5 w-1.5 rounded-full bg-gold/30 motion-particle [animation-delay:1.8s]" />

      {/* Far photographic afterimage */}
      <Image
        src="/images/pastor olawale smith 038.png"
        alt=""
        aria-hidden="true"
        width={700}
        height={900}
        className="pointer-events-none absolute bottom-[-1%] left-1/2 z-10 w-[350px] -translate-x-[calc(50%+48px)] opacity-[0.075] blur-[1.5px] mix-blend-multiply motion-ghost-two sm:w-[390px]"
      />

      {/* Middle photographic afterimage */}
      <Image
        src="/images/pastor olawale smith 038.png"
        alt=""
        aria-hidden="true"
        width={700}
        height={900}
        className="pointer-events-none absolute bottom-[-1%] left-1/2 z-10 w-[365px] -translate-x-[calc(50%+27px)] opacity-[0.10] blur-[0.8px] mix-blend-multiply motion-ghost-one sm:w-[410px]"
      />

      {/* Subtle blue color echo */}
      <Image
        src="/images/pastor olawale smith 038.png"
        alt=""
        aria-hidden="true"
        width={700}
        height={900}
        className="pointer-events-none absolute bottom-[-1%] left-1/2 z-10 w-[370px] -translate-x-[calc(50%-17px)] opacity-[0.045] blur-[3px] mix-blend-screen motion-color-echo sm:w-[420px]"
      />

      {/* Main subject */}
      <Image
        src="/images/pastor olawale smith 038.png"
        alt="Pastor Olawale Smith"
        width={700}
        height={900}
        priority
        className="absolute bottom-[-1%] left-1/2 z-20 w-[390px] -translate-x-1/2 object-contain motion-subject sm:w-[430px] lg:w-[460px]"
      />

      {/* Side light */}
      <div className="pointer-events-none absolute bottom-[18%] right-[9%] z-10 h-44 w-24 rounded-full bg-blue-soft/[0.11] blur-[55px]" />

      {/* Label */}
      <div className="absolute bottom-[9%] left-[7%] z-30 flex items-center gap-3 rounded-full border border-charcoal/10 bg-ivory/75 px-4 py-2 backdrop-blur-xl">
        <span className="h-1.5 w-1.5 rounded-full bg-blue" />
        <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/65">
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
              <Reveal>
                <p className="eyebrow text-gold">
                  About the Ministry
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="display-heading mt-6 max-w-5xl text-5xl text-ivory sm:text-7xl lg:text-[8rem] lg:leading-[0.88]">
                  A life given
                  <br />
                  <span className="text-gold">
                    to the work.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="body-copy mt-8 max-w-2xl text-base text-ivory/60 sm:text-lg lg:text-xl">
                  Olawale Smith Ministries exists to reach,
                  teach, strengthen, and equip people through
                  the message of Christ and the transforming
                  power of God's Word.
                </p>
              </Reveal>

              <Reveal delay={0.24}>
                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Link
                    href="#man-of-god"
                    className="group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-light"
                  >
                    Meet the man of God
                    <ArrowDown
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-y-1"
                    />
                  </Link>

                  <Link
                    href="/resources"
                    className="group inline-flex items-center gap-3 rounded-full border border-ivory/15 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/75 transition-all duration-300 hover:border-blue-soft/50 hover:bg-blue-soft/10 hover:text-ivory"
                  >
                    Explore resources
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </Reveal>
            </div>

            {/* Hero portrait */}
            <Reveal delay={0.2} className="relative">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden border border-ivory/10 bg-charcoal-soft">
                <Image
                  src="/images/pastor olawale smith 031.jpg"
                  alt="Pastor Olawale Smith"
                  fill
                  priority
                  className="object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold">
                    Olawale Smith Ministries
                  </p>

                  <p className="mt-2 text-sm text-ivory/60">
                    Faith · Teaching · Impact
                  </p>
                </div>

                <div className="absolute inset-4 border border-ivory/10" />
              </div>
            </Reveal>
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
              {/* Photography */}
              <Reveal>
                <div className="relative mx-auto aspect-[0.84] w-full max-w-[540px]">
                  <div className="absolute inset-[7%] border border-blue/[0.16]" />

                  <div className="absolute left-[5%] top-[8%] h-[82%] w-[82%] border border-gold/[0.18]" />

                  {profileImages.map((image, index) => (
                    <div
                      key={image.src}
                      className={`${image.className} overflow-hidden bg-ivory-muted shadow-[0_25px_70px_rgba(17,17,15,0.10)] ${
                        index === 2
                          ? "border-[6px] border-ivory shadow-[0_30px_80px_rgba(17,17,15,0.16)]"
                          : ""
                      }`}
                    >
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 80vw, 40vw"
                      />
                    </div>
                  ))}

                  <div className="absolute bottom-[4%] left-[5%] z-20 flex items-center gap-3 rounded-full border border-charcoal/10 bg-ivory/80 px-4 py-2 backdrop-blur-xl">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue" />
                    <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/60">
                      The Man of God
                    </span>
                  </div>
                </div>
              </Reveal>

              {/* Profile */}
              <div className="max-w-2xl">
                <Reveal>
                  <p className="eyebrow text-bronze">
                    The Man of God
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-7xl">
                    Called to
                    <br />
                    <span className="text-bronze">
                      serve people.
                    </span>
                  </h2>
                </Reveal>

                <Reveal delay={0.14}>
                  <p className="mt-9 text-base leading-8 text-charcoal/70 sm:text-lg">
                    Pastor Olawale Smith is a born-again child
                    of God, burning with a special passion to
                    reach the world for Christ. He is a preacher,
                    a teacher, a public speaker, a prolific
                    reader, and a writer of the words of the
                    gospel of Jesus Christ.
                  </p>
                </Reveal>

                <Reveal delay={0.2}>
                  <p className="mt-7 text-base leading-8 text-charcoal/70 sm:text-lg">
                    His ministries involve evangelism,
                    teaching, prophecy, and deliverance. In all,
                    he ministers in various gifts of the Holy
                    Spirit to the GLORY OF GOD ALMIGHTY.
                  </p>
                </Reveal>

                <Reveal delay={0.26}>
                  <p className="mt-7 text-base leading-8 text-charcoal/70 sm:text-lg">
                    He is graced with a leadership instinct; he
                    takes responsibility in every facet of life
                    where he finds himself, which eventually
                    puts him at the forefront and in leadership
                    roles in all his circles of influence.
                  </p>
                </Reveal>

                <Reveal delay={0.32}>
                  <p className="mt-7 text-base leading-8 text-charcoal/70 sm:text-lg">
                    He is an intelligent idea creator,
                    innovative-events developer, Manager, and
                    Achor. He currently pastors in The Redeemed
                    Christian Church of God, Grace...
                  </p>
                </Reveal>
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
                <Reveal>
                  <p className="eyebrow text-gold">
                    Calling & Ministry
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-6xl">
                    A ministry
                    <br />
                    <span className="text-gold">
                      in motion.
                    </span>
                  </h2>
                </Reveal>
              </div>

              <div className="max-w-3xl">
                <Reveal delay={0.12}>
                  <p className="text-lg leading-9 text-ivory/70 sm:text-xl">
                    The ministry is centered on the Word of
                    God, spiritual growth, and the
                    transformation of lives through the message
                    of Christ.
                  </p>
                </Reveal>

                <Reveal delay={0.18}>
                  <p className="mt-8 text-base leading-8 text-ivory/55 sm:text-lg">
                    Through preaching, teaching, evangelism,
                    leadership, prayer, resources, and
                    relationships, the work seeks to create
                    environments where people can encounter
                    truth, grow in faith, discover purpose, and
                    become equipped for meaningful Kingdom
                    service.
                  </p>
                </Reveal>

                <Reveal delay={0.24}>
                  <p className="mt-8 text-base leading-8 text-ivory/55 sm:text-lg">
                    The ministry extends beyond a pulpit. It
                    finds expression through churches,
                    conferences, gatherings, media, written
                    resources, conversations, mentorship,
                    outreach, and the everyday responsibility
                    of building people.
                  </p>
                </Reveal>

                <Reveal delay={0.3}>
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
                </Reveal>
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

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="max-w-3xl">
              <Reveal>
                <p className="eyebrow text-bronze">
                  Ministry Focus
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-7xl">
                  What the work
                  <br />
                  <span className="text-bronze">
                    is built around.
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-7 max-w-2xl text-base leading-8 text-charcoal/60 sm:text-lg">
                  Four simple expressions capture the heart
                  of the ministry and the kind of impact it
                  desires to leave in people.
                </p>
              </Reveal>
            </div>

            <div className="mt-16 grid border-t border-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
              {ministryFocus.map((item, index) => {
                const Icon = item.icon;

                return (
                  <Reveal
                    key={item.number}
                    delay={index * 0.07}
                  >
                    <div className="group border-b border-charcoal/10 px-0 py-10 sm:nth-[odd]:pr-8 sm:nth-[even]:pl-8 lg:border-b-0 lg:border-r lg:px-8 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0">
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
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------------ */}
        {/* Ministry In Motion                                                 */}
        {/* ------------------------------------------------------------------ */}

        <section className="relative overflow-hidden bg-ivory">
          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <div className="order-2 lg:order-1">
                <Reveal>
                  <p className="eyebrow text-bronze">
                    Ministry Activities
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-7xl">
                    A ministry
                    <br />
                    <span className="text-blue">
                      in motion.
                    </span>
                  </h2>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="mt-7 max-w-xl text-base leading-8 text-charcoal/60 sm:text-lg">
                    A glimpse into the gatherings, teachings,
                    conferences, worship moments, outreach, and
                    people that form part of the ministry&apos;s
                    ongoing work.
                  </p>
                </Reveal>

                <Reveal delay={0.22}>
                  <div className="mt-10 border-l border-blue/25 pl-6">
                    <p className="text-sm leading-7 text-charcoal/55">
                      The work continues wherever people gather,
                      learn, worship, serve, pray, and grow.
                    </p>
                  </div>
                </Reveal>
              </div>

              <div className="order-1 lg:order-2">
                <Reveal delay={0.12}>
                  <MinistryMotionVisual />
                </Reveal>
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
                <Reveal>
                  <p className="eyebrow text-gold">
                    Selected Moments
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-7xl">
                    People,
                    <br />
                    <span className="text-gold">
                      places, moments.
                    </span>
                  </h2>
                </Reveal>
              </div>

              <Reveal delay={0.16}>
                <p className="max-w-sm text-sm leading-7 text-ivory/45">
                  A visual record of some of the gatherings,
                  relationships, teachings, and moments that
                  form part of the ministry&apos;s journey.
                </p>
              </Reveal>
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
                  <Reveal
                    key={activity.src}
                    delay={(index % 4) * 0.05}
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
                  </Reveal>
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
                <Reveal>
                  <p className="eyebrow text-bronze">
                    The Way We Serve
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-6xl">
                    Truth with
                    <br />
                    <span className="text-bronze">
                      responsibility.
                    </span>
                  </h2>
                </Reveal>
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
                ].map((item, index) => (
                  <Reveal
                    key={item.number}
                    delay={index * 0.06}
                  >
                    <div className="border-t border-charcoal/10 pt-7">
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
                  </Reveal>
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
                <Reveal>
                  <p className="eyebrow text-gold">
                    The Journey Continues
                  </p>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-7xl">
                    The work
                    <br />
                    <span className="text-gold">
                      continues.
                    </span>
                  </h2>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="mt-7 max-w-2xl text-base leading-8 text-ivory/55 sm:text-lg">
                    There is still more to teach, more people
                    to reach, more lives to build, and more
                    Kingdom work to do. Explore the resources,
                    invite the ministry, or find a meaningful
                    way to partner with the work.
                  </p>
                </Reveal>
              </div>

              <Reveal delay={0.22}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/resources"
                    className="group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal transition-all duration-300 hover:bg-gold-light"
                  >
                    Explore resources

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/invite"
                    className="group inline-flex items-center gap-3 rounded-full border border-ivory/15 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/70 transition-all duration-300 hover:border-blue-soft/40 hover:bg-blue-soft/10 hover:text-ivory"
                  >
                    Invite the ministry

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>

                  <Link
                    href="/partner"
                    className="group inline-flex items-center gap-3 rounded-full border border-ivory/15 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/70 transition-all duration-300 hover:border-gold/50 hover:bg-gold/[0.08] hover:text-ivory"
                  >
                    Partner with us

                    <ArrowUpRight
                      size={15}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <style jsx global>{`
        @keyframes motionSubjectFloat {
          0%,
          100% {
            transform: translateX(-50%) translateY(0);
          }

          50% {
            transform: translateX(-50%) translateY(-7px);
          }
        }

        @keyframes motionGhostOne {
          0%,
          100% {
            transform: translateX(calc(-50% + 27px));
            opacity: 0.1;
          }

          50% {
            transform: translateX(calc(-50% + 38px));
            opacity: 0.06;
          }
        }

        @keyframes motionGhostTwo {
          0%,
          100% {
            transform: translateX(calc(-50% + 48px));
            opacity: 0.075;
          }

          50% {
            transform: translateX(calc(-50% + 63px));
            opacity: 0.035;
          }
        }

        @keyframes motionColorEcho {
          0%,
          100% {
            transform: translateX(calc(-50% - 17px));
            opacity: 0.045;
          }

          50% {
            transform: translateX(calc(-50% - 5px));
            opacity: 0.02;
          }
        }

        @keyframes motionTrail {
          0%,
          100% {
            opacity: 0.2;
            transform: translateX(-10px) rotate(-8deg);
          }

          50% {
            opacity: 0.55;
            transform: translateX(18px) rotate(-8deg);
          }
        }

        @keyframes motionParticle {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.2;
          }

          50% {
            transform: translate(12px, -8px);
            opacity: 0.7;
          }
        }

        @keyframes motionDash {
          0%,
          100% {
            transform: translateX(0) rotate(-8deg);
            opacity: 0.15;
          }

          50% {
            transform: translateX(15px) rotate(-8deg);
            opacity: 0.5;
          }
        }

        .motion-subject {
          animation: motionSubjectFloat 5s ease-in-out infinite;
        }

        .motion-ghost-one {
          animation: motionGhostOne 4.5s ease-in-out infinite;
        }

        .motion-ghost-two {
          animation: motionGhostTwo 5.5s ease-in-out infinite;
        }

        .motion-color-echo {
          animation: motionColorEcho 5s ease-in-out infinite;
        }

        .motion-trail {
          animation: motionTrail 4s ease-in-out infinite;
        }

        .motion-particle {
          animation: motionParticle 3.5s ease-in-out infinite;
        }

        .motion-dash {
          animation: motionDash 3.8s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .motion-subject,
          .motion-ghost-one,
          .motion-ghost-two,
          .motion-color-echo,
          .motion-trail,
          .motion-particle,
          .motion-dash {
            animation: none !important;
          }
        }
      `}</style>
    </PageLayout>
  );
}