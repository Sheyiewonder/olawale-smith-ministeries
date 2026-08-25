import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import Reveal from "@/components/motion/Reveal";

export default function AboutPage() {
  return (
    <PageLayout theme="dark">
      {/* Hero */}
      <Section theme="dark" className="pt-40 sm:pt-48">
        <div className="mx-auto w-full max-w-7xl px-6 pb-28 lg:px-8 lg:pb-40">
          <div className="max-w-5xl">
            <Reveal>
              <p className="eyebrow text-gold">
                About the Ministry
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h1 className="display-heading mt-6 text-5xl text-ivory sm:text-7xl lg:text-9xl">
                Called to
                <br />
                <span className="text-gold">
                  kingdom impact.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="body-copy mt-8 max-w-2xl text-base text-ivory/65 sm:text-lg">
                Olawale Smith Ministries exists to help people
                know God, discover purpose, grow in spiritual
                maturity, and become a meaningful expression
                of the Kingdom wherever they are called.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Story */}
      <Section theme="light">
        <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-24 sm:py-32 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24 lg:px-8 lg:py-40">
          <Reveal>
            <div>
              <p className="eyebrow text-bronze">
                Our Story
              </p>

              <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-6xl">
                Built around
                <br />
                <span className="text-bronze">
                  transformation.
                </span>
              </h2>
            </div>
          </Reveal>

          <div className="max-w-2xl">
            <Reveal delay={0.08}>
              <p className="text-base leading-8 text-charcoal/65 sm:text-lg">
                Ministry is more than gathering people in a
                room. It is about seeing lives transformed by
                the knowledge of God and equipped to fulfil
                their assignment.
              </p>
            </Reveal>

            <Reveal delay={0.14}>
              <p className="mt-7 text-base leading-8 text-charcoal/65 sm:text-lg">
                Olawale Smith Ministries is committed to
                teaching the Word, strengthening faith,
                developing people, and creating resources that
                help believers walk intentionally with God.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-7 text-base leading-8 text-charcoal/65 sm:text-lg">
                Through teachings, resources, relationships,
                invitations, and partnerships, the ministry
                seeks to make the message of Christ practical,
                accessible, and transformational.
              </p>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Vision / Mission */}
      <Section theme="dark">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <Reveal>
            <p className="eyebrow text-gold">
              What Drives Us
            </p>
          </Reveal>

          <div className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-ivory/10 bg-ivory/10 lg:grid-cols-2">
            <Reveal>
              <div className="bg-charcoal p-8 sm:p-12 lg:p-16">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Our Vision
                </span>

                <h2 className="mt-6 text-3xl font-medium tracking-[-0.03em] text-ivory sm:text-4xl">
                  To see people become everything God has
                  called them to be.
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/60 sm:text-base">
                  We envision a generation that knows God,
                  understands identity and purpose, and lives
                  with the courage to influence their world
                  for the Kingdom.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="bg-charcoal-soft p-8 sm:p-12 lg:p-16">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                  Our Mission
                </span>

                <h2 className="mt-6 text-3xl font-medium tracking-[-0.03em] text-ivory sm:text-4xl">
                  Equip, empower, and send.
                </h2>

                <p className="mt-6 max-w-xl text-sm leading-7 text-ivory/60 sm:text-base">
                  We teach the Word, build people, create
                  practical resources, and cultivate
                  environments where individuals can grow and
                  step confidently into their calling.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </Section>

      {/* Values */}
      <Section theme="light">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="max-w-3xl">
            <Reveal>
              <p className="eyebrow text-bronze">
                Our Values
              </p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="display-heading mt-5 text-4xl text-charcoal sm:text-5xl lg:text-6xl">
                What we refuse
                <br />
                <span className="text-bronze">
                  to compromise.
                </span>
              </h2>
            </Reveal>
          </div>

          <div className="mt-16 grid gap-10 border-t border-charcoal/10 pt-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                number: "01",
                title: "The Word",
                text: "We remain grounded in Scripture and committed to teaching truth faithfully.",
              },
              {
                number: "02",
                title: "Character",
                text: "We believe influence should be built on integrity, humility, and responsibility.",
              },
              {
                number: "03",
                title: "Purpose",
                text: "We help people understand their God-given identity, assignment, and potential.",
              },
              {
                number: "04",
                title: "Impact",
                text: "We measure ministry by the lives transformed and people equipped to serve others.",
              },
            ].map((value, index) => (
              <Reveal
                key={value.number}
                delay={index * 0.06}
              >
                <div>
                  <span className="text-[10px] font-semibold tracking-[0.16em] text-bronze">
                    {value.number}
                  </span>

                  <h3 className="mt-5 text-2xl font-medium tracking-[-0.025em] text-charcoal">
                    {value.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-charcoal/60">
                    {value.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section theme="dark">
        <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32 lg:px-8 lg:py-40">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <Reveal>
                <p className="eyebrow text-gold">
                  Be Part of the Journey
                </p>
              </Reveal>

              <Reveal delay={0.08}>
                <h2 className="display-heading mt-5 text-4xl text-ivory sm:text-5xl lg:text-7xl">
                  There is more
                  <br />
                  <span className="text-gold">
                    ahead.
                  </span>
                </h2>
              </Reveal>

              <Reveal delay={0.16}>
                <p className="mt-7 max-w-xl text-base leading-8 text-ivory/60">
                  Explore the ministry, discover resources,
                  invite us to connect with your community, or
                  find a meaningful way to partner with what we
                  are building.
                </p>
              </Reveal>
            </div>

            <Reveal delay={0.2}>
              <Link
                href="/resources"
                className="group inline-flex shrink-0 items-center gap-3 rounded-full border border-gold/40 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold transition-all duration-300 hover:border-gold hover:bg-gold hover:text-charcoal"
              >
                Explore Resources

                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </Link>
            </Reveal>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}