import Link from "next/link";
import {
  ArrowUpRight,
  HandHeart,
  Users,
  CreditCard,
  HeartHandshake,
} from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";
import AccountCard from "@/components/partner/AccountCard";

export default function PartnerPage() {
  return (
    <PageLayout theme="light">
      <Section
        theme="light"
        className="relative overflow-hidden bg-ivory px-6 pb-24 pt-40 text-charcoal sm:px-8 sm:pb-28 sm:pt-44 lg:px-12 lg:pb-36 lg:pt-52"
      >
        {/* ------------------------------------------------------------------ */}
        {/* Atmospheric background                                             */}
        {/* ------------------------------------------------------------------ */}

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {/* Blue atmosphere */}
          <div className="absolute right-[-12%] top-[-20%] h-[560px] w-[560px] rounded-full bg-blue-soft/[0.11] blur-[150px]" />

          <div className="absolute bottom-[-25%] left-[-14%] h-[480px] w-[480px] rounded-full bg-blue-light/[0.08] blur-[140px]" />

          {/* Gold counterbalance */}
          <div className="absolute left-[38%] top-[38%] h-[280px] w-[280px] rounded-full bg-gold/[0.07] blur-[120px]" />

          {/* Directional blue light */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_28%,rgba(59,130,208,0.08),transparent_34%)]" />

          {/* Architectural rings */}
          <div className="absolute -right-40 -top-40 h-[540px] w-[540px] rounded-full border border-blue-soft/[0.16]" />

          <div className="absolute -right-16 -top-16 h-[360px] w-[360px] rounded-full border border-gold/[0.14]" />

          <div className="absolute bottom-[-190px] left-[40%] h-[430px] w-[430px] rounded-full border border-blue/[0.08]" />

          {/* Fine horizontal line */}
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
              <div className="partner-page-reveal">
                <div className="flex items-center gap-4">
                  <span className="h-px w-12 bg-bronze" />

                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-bronze">
                    Partner With Us
                  </p>
                </div>
              </div>

              <div className="partner-page-reveal partner-page-delay-80">
                <h1 className="display-heading mt-7 max-w-5xl text-5xl leading-[0.94] tracking-[-0.04em] text-charcoal sm:text-6xl lg:text-[7rem]">
                  The work continues
                  <br />
                  <span className="relative inline-block text-bronze">
                    through people.

                    <span
                      aria-hidden="true"
                      className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-bronze via-blue-soft to-transparent opacity-70"
                    />
                  </span>
                </h1>
              </div>

              <div className="partner-page-reveal partner-page-delay-160">
                <p className="body-copy text-justify mt-8 max-w-2xl text-base leading-8 text-charcoal/55 sm:text-lg">
                  Partner with the ministry as we continue to share the
                  message, raise people, and advance kingdom impact. Together,
                  we can help carry the work further and reach more lives.
                </p>
              </div>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Supporting information                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="partner-page-reveal partner-page-delay-200">
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

                      <p className="mt-2 max-w-sm text-sm text-justify leading-7 text-charcoal/50">
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

                      <p className="mt-2 max-w-sm text-sm text-justify leading-7 text-charcoal/50">
                        Discover the different ways you can stand with the
                        ministry and become part of the work.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* Partnership details                                                */}
          {/* ------------------------------------------------------------------ */}

          <section
            id="partnership-details"
            className="relative overflow-hidden bg-ivory px-6 py-24 sm:px-10 lg:px-16 lg:py-32"
          >
            <div className="mx-auto max-w-6xl">
              <div className="max-w-2xl">
                <p className="mb-5 text-xs font-medium uppercase tracking-[0.25em] text-bronze">
                  Partnership
                </p>

                <h2 className="text-4xl font-semibold leading-[0.95] tracking-[-0.04em] text-charcoal sm:text-5xl lg:text-6xl">
                  Stand with
                  <br />
                  the work.
                </h2>

                <p className="mt-7 max-w-xl text-base leading-7 text-charcoal/60 sm:text-lg">
                  Your partnership helps support the work of the ministry
                  and makes it possible to continue sharing the message,
                  raising people, and advancing kingdom impact.
                </p>
              </div>

              <div className="mt-14 grid gap-5 lg:grid-cols-2">
                <AccountCard
                  currency="Naira"
                  accountNumber="0000000000"
                  bankName="Bank Name"
                  accountName="Olawale Smith Ministries"
                />

                <AccountCard
                  currency="Dollar"
                  accountNumber="0000000000"
                  bankName="Bank Name"
                  accountName="Olawale Smith Ministries"
                />
              </div>

              <div className="mt-10 border-t border-charcoal/10 pt-7">
                <p className="max-w-2xl text-sm leading-6 text-charcoal/50">
                  After making a transfer, you may retain your payment
                  confirmation for your records. Thank you for standing
                  with the work of the ministry.
                </p>
              </div>
            </div>
          </section>
        </div>
      </Section>
    </PageLayout>
  );
}