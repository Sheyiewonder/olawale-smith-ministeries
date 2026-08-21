import { Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";
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
      className="relative overflow-hidden bg-charcoal-soft px-6 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      {/* Decorative element */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full border border-gold/10"
      />

      <div className="mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <Reveal>
              <p className="eyebrow text-gold">Ministry Invitations</p>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="display-heading mt-6 max-w-3xl text-5xl sm:text-6xl lg:text-8xl">
                Invite Pastor
                <br />
                <span className="text-gold">Olawale Smith.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="body-copy mt-8 max-w-xl text-base text-ivory-muted sm:text-lg">
                Would you like to invite Pastor Olawale Smith to minister at
                your church, conference, convention, program, or special
                gathering?
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="body-copy mt-4 max-w-xl text-base text-ivory-muted sm:text-lg">
                For official ministry invitations and engagements, kindly
                contact the ministry through the channels provided.
              </p>
            </Reveal>
          </div>

          <Stagger className="space-y-4">
            {contacts.map((contact) => {
              const Icon = contact.icon;

              return (
                <Reveal key={contact.label}>
                  <a
                    href={contact.href}
                    className="group flex items-center justify-between border-b border-ivory/10 py-6 transition-colors duration-300 hover:border-gold/50"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/20 text-gold transition-colors duration-300 group-hover:border-gold/50 group-hover:bg-gold group-hover:text-charcoal">
                        <Icon size={18} strokeWidth={1.5} />
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gold">
                          {contact.label}
                        </p>

                        <p className="mt-1 text-base text-ivory sm:text-lg">
                          {contact.value}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      size={20}
                      strokeWidth={1.5}
                      className="text-ivory/40 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-gold"
                    />
                  </a>
                </Reveal>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}