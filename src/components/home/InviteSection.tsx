import {
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import Stagger from "@/components/motion/Stagger";

const contacts = [
  {
    icon: Mail,
    label: "Email",
    value: "invitations@olawalesmithministries.org",
    href: "mailto:invitations@olawalesmithministries.org",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+234 XXX XXX XXXX",
    href: "tel:+234XXXXXXXXXX",
  },
  {
    icon: MapPin,
    label: "Ministry Office",
    value: "Lagos, Nigeria",
    href: "#",
  },
];

export default function InviteSection() {
  return (
    <section
      id="invite"
      className="relative overflow-hidden bg-charcoal px-6 py-24 sm:px-8 lg:px-12 lg:py-36"
    >
      {/* ------------------------------------------------------------------ */}
      {/* Atmospheric background                                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Blue atmosphere */}
        <div className="absolute right-[-10%] top-[8%] h-[520px] w-[520px] rounded-full bg-blue/10 blur-[140px]" />

        <div className="absolute left-[-12%] bottom-[-20%] h-[460px] w-[460px] rounded-full bg-blue-soft/[0.07] blur-[130px]" />

        {/* Warm gold counterbalance */}
        <div className="absolute left-[20%] top-[35%] h-[300px] w-[300px] rounded-full bg-gold/[0.06] blur-[110px]" />

        {/* Directional blue light */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_30%,rgba(59,130,208,0.09),transparent_34%)]" />

        {/* Top transition */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-deep/10 to-transparent" />

        {/* Architectural rings */}
        <div className="absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full border border-blue-soft/10" />

        <div className="absolute -right-20 -top-20 h-[360px] w-[360px] rounded-full border border-gold/10" />

        <div className="absolute bottom-[-180px] left-[42%] h-[420px] w-[420px] rounded-full border border-blue/5" />

        {/* Fine horizontal line */}
        <div className="absolute left-0 top-[52%] h-px w-[28%] bg-gradient-to-r from-transparent via-blue-soft/20 to-transparent" />
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Content                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-24">
          {/* ---------------------------------------------------------------- */}
          {/* Heading / copy                                                   */}
          {/* ---------------------------------------------------------------- */}

          <div>
            <Reveal>
              <div className="mb-8 flex items-center gap-4">
                <span className="h-px w-12 bg-gold" />

                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                  Ministry Invitations
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="display-heading max-w-4xl text-5xl text-ivory sm:text-6xl lg:text-[6.5rem]">
                Invite Pastor
                <br />
                <span className="relative inline-block text-gold">
                  Olawale Smith.
                  <span className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70" />
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="body-copy mt-8 max-w-xl text-base leading-8 text-ivory/60 sm:text-lg">
                Would you like to invite Pastor Olawale Smith to minister at
                your church, conference, convention, program, or special
                gathering?
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="body-copy mt-5 max-w-xl text-base leading-8 text-ivory/60 sm:text-lg">
                For official ministry invitations and engagements, kindly
                contact the ministry through any of the channels provided.
              </p>
            </Reveal>

            {/* Small supporting statement */}
            <Reveal delay={0.32}>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-px w-8 bg-blue-soft/40" />

                <span className="text-[9px] uppercase tracking-[0.28em] text-ivory/30">
                  Speaking Engagements
                </span>
              </div>
            </Reveal>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Contact list                                                     */}
          {/* ---------------------------------------------------------------- */}

          <Stagger className="relative">
            {/* Contact panel atmosphere */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-8 bg-blue/5 blur-3xl"
            />

            <div className="relative border-t border-white/10">
              {contacts.map((contact, index) => {
                const Icon = contact.icon;

                return (
                  <Reveal key={contact.label}>
                    <a
                      href={contact.href}
                      className="group relative flex items-center justify-between border-b border-white/10 py-7 transition-all duration-300 hover:border-blue-soft/30"
                    >
                      {/* Hover atmosphere */}
                      <div className="absolute inset-y-0 left-0 w-0 bg-blue/5 transition-all duration-500 group-hover:w-full" />

                      <div className="relative z-10 flex items-center gap-5 sm:gap-6">
                        {/* Number */}
                        <span className="hidden w-5 text-[9px] font-medium tracking-[0.2em] text-ivory/20 sm:block">
                          0{index + 1}
                        </span>

                        {/* Icon */}
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-white/[0.015] text-gold transition-all duration-300 group-hover:border-gold/50 group-hover:bg-gold group-hover:text-charcoal">
                          <Icon size={18} strokeWidth={1.5} />
                        </div>

                        {/* Information */}
                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-[0.24em] text-gold">
                            {contact.label}
                          </p>

                          <p className="mt-2 text-sm text-ivory/80 transition-colors duration-300 group-hover:text-ivory sm:text-base">
                            {contact.value}
                          </p>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="relative z-10 ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-ivory/30 transition-all duration-300 group-hover:border-blue-soft/40 group-hover:bg-blue/10 group-hover:text-blue-soft">
                        <ArrowUpRight
                          size={18}
                          strokeWidth={1.5}
                          className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                        />
                      </div>
                    </a>
                  </Reveal>
                );
              })}
            </div>

            {/* Bottom accent */}
            <div className="mt-7 flex items-center justify-between">
              <span className="text-[8px] uppercase tracking-[0.3em] text-ivory/20">
                Olawale Smith Ministries
              </span>

              <div className="flex items-center gap-2">
                <span className="h-px w-8 bg-gold/40" />
                <span className="h-px w-4 bg-blue-soft/30" />
              </div>
            </div>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
