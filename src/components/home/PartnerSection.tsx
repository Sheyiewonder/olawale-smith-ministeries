import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/motion/Reveal";

export default function PartnerSection() {
  return (
    <section
      id="partner"
      className="relative overflow-hidden px-6 py-28 sm:px-8 lg:px-12 lg:py-40"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="eyebrow text-gold">Partner With Us</p>
        </Reveal>

        <Reveal delay={0.08}>
          <h2 className="display-heading mt-6 max-w-5xl text-5xl sm:text-7xl lg:text-[8rem]">
            The work
            <br />
            continues <span className="text-gold">through people.</span>
          </h2>
        </Reveal>

        <div className="mt-12 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <Reveal delay={0.16}>
            <p className="body-copy max-w-xl text-base text-ivory-muted sm:text-lg">
              Partner with the ministry as we continue to share the message,
              raise people, and advance kingdom impact.
            </p>
          </Reveal>

          <Reveal delay={0.24}>
            <a
              href="#"
              className="group inline-flex w-fit items-center gap-3 rounded-full border border-gold/40 px-6 py-3.5 text-sm font-medium text-ivory transition-all duration-300 hover:bg-gold hover:text-charcoal"
            >
              Partner With Us
              <ArrowUpRight
                size={17}
                className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}