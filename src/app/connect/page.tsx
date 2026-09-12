"use client";

import Link from "next/link";

import {
  FaFacebookF,
  FaInstagram,
  FaYoutube,
  FaTiktok,
} from "react-icons/fa6";

import {
  ArrowUpRight,
  MessageCircle,
  Phone,
  Mail,
  Heart,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import Reveal from "@/components/motion/Reveal";

const socialNetworks = [
  {
    name: "YouTube",
    description: "Watch sermons, teachings, podcasts, and ministry moments.",
    href: "#",
    icon: FaYoutube,
    accent: "hover:border-red-500/30 hover:bg-red-500/[0.04]",
  },
  {
    name: "Facebook",
    description: "Follow ministry updates, teachings, and announcements.",
    href: "#",
    icon: FaFacebookF,
    accent: "hover:border-blue-soft/40 hover:bg-blue-soft/[0.06]",
  },
  {
    name: "Instagram",
    description: "Stay connected to ministry life, moments, and inspiration.",
    href: "#",
    icon: FaInstagram,
    accent: "hover:border-gold/40 hover:bg-gold/[0.05]",
  },
  {
    name: "TikTok",
    description: "Discover short teachings, moments, and words of encouragement.",
    href: "#",
    icon: FaTiktok,
    accent: "hover:border-charcoal/25 hover:bg-charcoal/[0.03]",
  },
];

export default function ConnectPage() {
  return (
    <PageLayout theme="light">
      <main className="min-h-screen bg-ivory text-charcoal">
        {/* ---------------------------------------------------------------- */}
        {/* Hero                                                             */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden">
          {/* Atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-20 h-[420px] w-[420px] rounded-full bg-blue-soft/[0.08] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-140px] top-[-80px] h-[420px] w-[420px] rounded-full bg-gold/[0.10] blur-[120px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-[-180px] left-[38%] h-[360px] w-[360px] rounded-full bg-blue/[0.05] blur-[110px]"
          />

          <div className="relative mx-auto w-full max-w-7xl px-6 pb-24 pt-36 sm:pb-32 sm:pt-44 lg:px-8 lg:pb-40">
            <div className="max-w-4xl">
              <Reveal>
                <div className="mb-8 flex items-center gap-4">
                  <span className="h-px w-10 bg-blue-soft/50" />

                  <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-charcoal/45">
                    Connect
                  </span>
                </div>
              </Reveal>

              <Reveal delay={0.08}>
                <h1 className="max-w-4xl text-[clamp(3.2rem,8vw,7.5rem)] font-semibold leading-[0.88] tracking-[-0.055em] text-blue-deep">
                  Stay connected.
                  <br />
                  <span className="text-bronze">
                    Stay in the work.
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-8 max-w-2xl text-base leading-7 text-charcoal/60 sm:text-lg sm:leading-8">
                  Connect with Pastor Olawale Smith and stay close to the
                  teachings, conversations, ministry moments, and resources
                  being shared across our media networks.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Social Networks                                                  */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden border-t border-charcoal/10">
          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
              {/* Intro */}
              <div>
                <Reveal>
                  <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-blue/70">
                    01 / Media Networks
                  </span>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="text-blue-deep mt-6 max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl">
                    Connect with
                  </h2>
                  <h2 className="text-bronze max-w-md text-4xl font-semibold leading-[0.95] tracking-[-0.04em] sm:text-5xl">
                    Pastor Olawale Smith on all media networks.
                  </h2>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="mt-7 max-w-md text-sm leading-7 text-charcoal/55 sm:text-base">
                    Follow, watch, listen, and stay informed through the
                    platforms where the ministry continues to share the Word,
                    teachings, conversations, and moments from the work.
                  </p>
                </Reveal>
              </div>

              {/* Social cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                {socialNetworks.map((network, index) => {
                  const Icon = network.icon;

                  return (
                    <Reveal key={network.name} delay={0.08 + index * 0.06}>
                      <Link
                        href={network.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative flex min-h-[220px] flex-col justify-between border border-charcoal/10 bg-white/[0.45] p-6 backdrop-blur-sm transition-all duration-500 sm:p-7 ${network.accent}`}
                      >
                        {/* Top */}
                        <div className="flex items-start justify-between">
                          <div className="flex h-11 w-11 items-center justify-center border border-charcoal/10 bg-ivory text-bronze transition-all duration-300 group-hover:-translate-y-1 group-hover:border-blue-soft/30">
                            <Icon size={19} strokeWidth={1.7} />
                          </div>

                          <ArrowUpRight
                            size={17}
                            className="text-charcoal/25 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-blue"
                          />
                        </div>

                        {/* Bottom */}
                        <div>
                          <h3 className="text-bronze text-xl font-semibold tracking-[-0.02em]">
                            {network.name}
                          </h3>

                          <p className="mt-3 max-w-xs text-xs leading-6 text-blue-deep">
                            {network.description}
                          </p>

                          <div className="mt-5 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-charcoal/35 transition-colors duration-300 group-hover:text-blue">
                            Connect
                            <span className="h-px w-5 bg-current" />
                          </div>
                        </div>
                      </Link>
                    </Reveal>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Prayer & Counselling                                             */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden bg-charcoal text-ivory">
          {/* Atmospheric blue / gold light */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-32 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-blue/[0.10] blur-[140px]"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[-120px] top-[-100px] h-[420px] w-[420px] rounded-full bg-gold/[0.08] blur-[130px]"
          />

          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_0.8fr] lg:gap-24">
              {/* Copy */}
              <div>
                <Reveal>
                  <div className="flex items-center gap-4">
                    <span className="h-px w-10 bg-gold/50" />

                    <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-ivory/40">
                      02 / Personal Ministry
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={0.08}>
                  <h2 className="mt-7 max-w-3xl text-5xl font-semibold leading-[0.92] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
                    For Prayers
                    <br />
                    <span className="text-bronze">& Counselling.</span>
                  </h2>
                </Reveal>

                <Reveal delay={0.16}>
                  <p className="mt-8 max-w-xl text-sm leading-7 text-ivory/55 sm:text-base sm:leading-8">
                    If you would like to reach out for prayers, counselling,
                    spiritual guidance, or personal ministry support, use the
                    official contact channel below.
                  </p>
                </Reveal>

                <Reveal delay={0.24}>
                  <div className="mt-10">
                    <Link
                      href="#"
                      className="group inline-flex items-center justify-center gap-3 bg-gold px-7 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-charcoal transition-all duration-300 hover:bg-gold-light"
                    >
                      Contact

                      <ArrowUpRight
                        size={15}
                        className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </Reveal>
              </div>

              {/* Contact card */}
              <Reveal delay={0.18}>
                <div className="relative border border-ivory/10 bg-ivory/[0.035] p-7 backdrop-blur-xl sm:p-9">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-soft/[0.05] via-transparent to-gold/[0.04]" />

                  <div className="relative">
                    <div className="flex h-12 w-12 items-center justify-center border border-gold/20 bg-gold/[0.08] text-gold">
                      <Heart size={20} strokeWidth={1.5} />
                    </div>

                    <h3 className="mt-8 text-2xl font-semibold tracking-[-0.025em]">
                      We are here to listen.
                    </h3>

                    <p className="mt-4 text-sm leading-7 text-ivory/45">
                      Reach the ministry through the official contact details
                      provided below.
                    </p>

                    <div className="mt-8 space-y-3">
                      <Link
                        href="#"
                        className="group flex items-center gap-4 border border-ivory/10 px-4 py-4 transition-colors duration-300 hover:border-blue-soft/30 hover:bg-blue-soft/[0.06]"
                      >
                        <MessageCircle
                          size={17}
                          className="text-blue-soft/70"
                        />

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ivory/30">
                            WhatsApp
                          </p>

                          <p className="mt-1 text-sm text-ivory/70">
                            +234 XXX XXX XXXX
                          </p>
                        </div>

                        <ArrowUpRight
                          size={14}
                          className="ml-auto text-ivory/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </Link>

                      <Link
                        href="tel:+2340000000000"
                        className="group flex items-center gap-4 border border-ivory/10 px-4 py-4 transition-colors duration-300 hover:border-blue-soft/30 hover:bg-blue-soft/[0.06]"
                      >
                        <Phone size={17} className="text-blue-soft/70" />

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ivory/30">
                            Phone
                          </p>

                          <p className="mt-1 text-sm text-ivory/70">
                            +234 XXX XXX XXXX
                          </p>
                        </div>

                        <ArrowUpRight
                          size={14}
                          className="ml-auto text-ivory/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </Link>

                      <Link
                        href="mailto:placeholder@example.com"
                        className="group flex items-center gap-4 border border-ivory/10 px-4 py-4 transition-colors duration-300 hover:border-gold/30 hover:bg-gold/[0.05]"
                      >
                        <Mail size={17} className="text-gold/70" />

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-ivory/30">
                            Email
                          </p>

                          <p className="mt-1 text-sm text-ivory/70">
                            placeholder@example.com
                          </p>
                        </div>

                        <ArrowUpRight
                          size={14}
                          className="ml-auto text-ivory/25 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Closing CTA                                                      */}
        {/* ---------------------------------------------------------------- */}

        <section className="relative overflow-hidden bg-ivory">
          <div className="relative mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-36">
            <Reveal>
              <div className="flex flex-col justify-between gap-10 border-t border-charcoal/10 pt-8 sm:flex-row sm:items-end">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.28em] text-charcoal/30">
                    Keep exploring
                  </span>

                  <h2 className="mt-4 max-w-xl text-3xl font-semibold leading-tight tracking-[-0.035em] sm:text-4xl">
                    There is more to discover.
                  </h2>
                </div>

                <Link
                  href="/resources"
                  className="group inline-flex shrink-0 items-center gap-3 border border-charcoal/15 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-ivory bg-bronze transition-all duration-300 hover:border-blue-soft/20 hover:bg-bronze/85"
                >
                  Explore resources

                  <ArrowUpRight
                    size={15}
                    className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}