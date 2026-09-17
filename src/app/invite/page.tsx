import {
  ArrowUpRight,
  CalendarDays,
  MessageCircle,
} from "lucide-react";

import {
  FaEnvelope,
  FaPhoneAlt,
  FaTelegramPlane,
  FaWhatsapp,
} from "react-icons/fa";

import PageLayout from "@/components/layout/PageLayout";
import Section from "@/components/layout/Section";

export default function InvitePage() {
  return (
    <PageLayout theme="dark">
      <Section
        theme="dark"
        className="relative overflow-hidden px-6 pb-24 pt-40 sm:px-8 sm:pb-28 sm:pt-44 lg:px-12 lg:pb-36 lg:pt-52"
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

          <div className="absolute bottom-[-24%] left-[-14%] h-[440px] w-[440px] rounded-full bg-blue-soft/[0.07] blur-[130px]" />

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
        {/* Content                                                            */}
        {/* ------------------------------------------------------------------ */}

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-24">
            {/* ---------------------------------------------------------------- */}
            {/* Main statement                                                   */}
            {/* ---------------------------------------------------------------- */}

            <div>
              <div className="invite-page-reveal flex items-center gap-4">
                <span className="h-px w-12 bg-gold" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                  Ministry Invitations
                </p>
              </div>

              <h1 className="invite-page-reveal invite-page-delay-80 display-heading mt-7 max-w-5xl text-5xl leading-[0.94] tracking-[-0.04em] text-ivory sm:text-6xl lg:text-[7rem]">
                Invite Pastor
                <br />
                <span className="relative inline-block text-gold">
                  Olawale Smith.

                  <span
                    aria-hidden="true"
                    className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70"
                  />
                </span>
              </h1>

              <p className="invite-page-reveal invite-page-delay-160 body-copy mt-8 max-w-2xl text-base text-justify leading-8 text-ivory/60 sm:text-lg">
                Invite Pastor Olawale Smith to minister at your church,
                conference, convention, program, or special gathering.
              </p>
            </div>

            {/* ---------------------------------------------------------------- */}
            {/* Supporting information                                           */}
            {/* ---------------------------------------------------------------- */}

            <div className="invite-page-reveal invite-page-delay-200 relative">
              <div className="absolute -inset-8 bg-blue/5 blur-3xl" />

              <div className="relative border-t border-white/10">
                {/* Speaking engagements */}
                <div className="flex items-start gap-5 border-b border-white/10 py-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-white/[0.015] text-gold">
                    <CalendarDays size={18} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-gold">
                      Speaking Engagements
                    </p>

                    <p className="mt-2 max-w-sm text-sm text-justify leading-7 text-ivory/55">
                      Churches, conferences, conventions, special programs,
                      and other ministry gatherings.
                    </p>
                  </div>
                </div>

                {/* Official requests */}
                <div className="flex items-start gap-5 border-b border-white/10 py-7">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-blue-soft/20 bg-blue/5 text-blue-soft">
                    <MessageCircle size={18} strokeWidth={1.5} />
                  </div>

                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-blue-soft">
                      Official Requests
                    </p>

                    <p className="mt-2 max-w-sm text-sm text-justify leading-7 text-ivory/55">
                      Submit your invitation through the official ministry
                      process and provide the details needed for consideration.
                    </p>
                  </div>
                </div>
              </div>

              {/* ---------------------------------------------------------------- */}
              {/* Official contact area                                            */}
              {/* ---------------------------------------------------------------- */}

              <div className="invite-page-reveal invite-page-delay-240 pt-10">
                <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-gold">
                  Official Contacts
                </p>

                <p className="mt-3 max-w-md text-sm text-justify leading-7 text-ivory/45">
                  For ministry invitations and speaking engagements, please
                  reach out through the official ministry contact channels
                  below.
                </p>

                <div className="mt-6 space-y-4">
                  {/* Phone */}
                  <a
                    href="tel:+2348166467898"
                    className="group flex items-center gap-3 text-sm text-ivory/70 transition-colors duration-300 hover:text-gold"
                  >
                    <FaPhoneAlt
                      size={14}
                      className="shrink-0 text-gold transition-transform duration-300 group-hover:scale-105"
                    />

                    <span>+234 816 646 7898</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:olaolasmith@gmail.com"
                    className="group flex items-center gap-3 text-sm text-ivory/70 transition-colors duration-300 hover:text-blue-soft"
                  >
                    <FaEnvelope
                      size={14}
                      className="shrink-0 text-blue-soft transition-transform duration-300 group-hover:scale-105"
                    />

                    <span>olaolasmith@gmail.com</span>
                  </a>
                </div>

                {/* Prayers & Counselling */}
                 <p className="text-[9px] pt-10 font-bold uppercase tracking-[0.24em] text-blue-soft">
                  For prayers and counselling
                </p>

                <div className="mt-6 space-y-4">
                  {/* Phone */}
                  <a
                    href="tel:+2347010172131"
                    className="group flex items-center gap-3 text-sm text-ivory/70 transition-colors duration-300 hover:text-gold"
                  >
                    <FaPhoneAlt
                      size={14}
                      className="shrink-0 text-gold transition-transform duration-300 group-hover:scale-105"
                    />

                    <span>+234 701 017 2131</span>
                  </a>

                  {/* Telegram */}
                  <a
                    href="https://t.me/+2347010172131"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-ivory/70 transition-colors duration-300 hover:text-blue-soft"
                  >
                    <FaTelegramPlane
                      size={15}
                      className="shrink-0 text-blue-soft transition-transform duration-300 group-hover:scale-105"
                    />

                    <span>Telegram: +234 701 017 2131</span>
                  </a>

                  {/* WhatsApp */}
                  <a
                    href="https://wa.me/2348166467898"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 text-sm text-ivory/70 transition-colors duration-300 hover:text-gold"
                  >
                    <FaWhatsapp
                      size={16}
                      className="shrink-0 text-gold transition-transform duration-300 group-hover:scale-105"
                    />

                    <span>WhatsApp: +234 816 646 7898</span>
                  </a>

                  {/* Email */}
                  <a
                    href="mailto:olaolasmith@gmail.com"
                    className="group flex items-center gap-3 text-sm text-ivory/70 transition-colors duration-300 hover:text-blue-soft"
                  >
                    <FaEnvelope
                      size={14}
                      className="shrink-0 text-blue-soft transition-transform duration-300 group-hover:scale-105"
                    />

                    <span>olaolasmith@gmail.com</span>
                  </a>
                </div>
              </div>

              <div className="mt-7 flex items-center justify-between">
                <span className="text-[8px] uppercase tracking-[0.3em] text-ivory/20">
                  Olawale Smith Ministries
                </span>

                <div className="flex items-center gap-2">
                  <span className="h-px w-8 bg-gold/40" />
                  <span className="h-px w-4 bg-blue-soft/30" />
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------------ */}
          {/* Invitation details                                                 */}
          {/* ------------------------------------------------------------------ */}

          <div
            id="invitation-details"
            className="invite-page-reveal invite-page-delay-240 mt-28 border-t border-white/10 pt-12 sm:mt-36 lg:mt-44"
          >
            <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.28em] text-gold">
                  Invitation Process
                </p>

                <h2 className="display-heading mt-5 max-w-md text-3xl leading-[1] tracking-[-0.03em] text-ivory sm:text-4xl">
                  A clear path for
                </h2>
                  <h2 className="display-heading max-w-md text-3xl leading-[1] tracking-[-0.03em] text-gold sm:text-4xl">
                  ministry invitations.
                </h2>
              </div>

              <div className="max-w-2xl">
                <p className="body-copy text-base text-justify leading-8 text-ivory/55 sm:text-lg">
                  We are committed to making ministry invitations clear and
                  orderly. Provide the relevant details about your gathering,
                  and the ministry team can review the request through the
                  appropriate channel.
                </p>

                <div className="mt-10 grid gap-0 border-t border-white/10">
                  {/* 01 */}
                  <div className="flex gap-5 border-b border-white/10 py-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold">
                      01
                    </span>

                    <div>
                      <p className="text-sm  font-medium text-ivory">
                        Share your invitation
                      </p>

                      <p className="mt-2 text-sm text-justify leading-7 text-ivory/45">
                        Provide the details of your church, organization,
                        conference, or special gathering.
                      </p>
                    </div>
                  </div>

                  {/* 02 */}
                  <div className="flex gap-5 border-b border-white/10 py-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-blue-soft">
                      02
                    </span>

                    <div>
                      <p className="text-sm font-medium text-ivory">
                        Ministry review
                      </p>

                      <p className="mt-2 text-justify text-sm leading-7 text-ivory/45">
                        The invitation can be reviewed alongside the relevant
                        ministry and scheduling considerations.
                      </p>
                    </div>
                  </div>

                  {/* 03 */}
                  <div className="flex gap-5 py-6">
                    <span className="text-[10px] font-bold tracking-[0.2em] text-gold">
                      03
                    </span>

                    <div>
                      <p className="text-sm font-medium text-ivory">
                        Official response
                      </p>

                      <p className="mt-2 text-sm text-justify leading-7 text-ivory/45">
                        The ministry team will provide the appropriate response
                        and next steps through the official contact channel.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}