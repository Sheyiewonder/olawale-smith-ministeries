"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Resources", href: "/resources" },
  { label: "Articles", href: "/articles" },
  { label: "About", href: "/about" },
  { label: "Invite", href: "/invite" },
  { label: "Partner With Us", href: "/partner" },
];

interface MobileMenuProps {
  lightPage?: boolean;
}

export default function MobileMenu({
  lightPage = false,
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);

  const closeMenu = () => setOpen(false);

  const pathname = usePathname();

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          "relative z-[70] flex h-10 w-10 items-center justify-center",
          "rounded-full border backdrop-blur-md transition-colors duration-300",
          lightPage
            ? "border-charcoal/15 bg-ivory/70 text-charcoal hover:border-bronze/50 hover:text-bronze"
            : "border-ivory/15 bg-charcoal/60 text-ivory hover:border-gold/50 hover:text-gold",
        ].join(" ")}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={18} strokeWidth={1.5} />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu size={18} strokeWidth={1.5} />
            </motion.div>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="fixed inset-0 z-40 cursor-default bg-charcoal/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-3xl border border-ivory/10 bg-charcoal-soft/95 p-5 shadow-2xl backdrop-blur-2xl"
              initial={{
                opacity: 0,
                y: -12,
                scale: 0.97,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: -8,
                scale: 0.98,
              }}
              transition={{
                duration: 0.3,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <div className="mb-4 border-b border-ivory/10 pb-4">
                <p className="eyebrow text-gold">Navigation</p>
              </div>

              <nav className="flex flex-col">
                {navigation.map((item, index) => {
                  const active =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);

                  return (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.04 + index * 0.05,
                        duration: 0.35,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMenu}
                        aria-current={active ? "page" : undefined}
                        className={[
                          "group flex items-center justify-between",
                          "border-b py-4 text-sm font-medium uppercase",
                          "tracking-[0.1em] transition-colors duration-300",
                          active
                            ? "border-gold/30 text-gold"
                            : "border-ivory/10 text-ivory/80 hover:text-gold",
                        ].join(" ")}
                      >
                        {item.label}

                        <ArrowUpRight
                          size={16}
                          strokeWidth={1.5}
                          className={[
                            "transition-all duration-300",
                            active
                              ? "text-gold"
                              : "text-ivory/30 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold",
                          ].join(" ")}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="mt-5"
              >
                <Link
                  href="/resources"
                  onClick={closeMenu}
                  className="flex items-center justify-center rounded-full bg-gold px-5 py-3.5 text-xs font-semibold uppercase tracking-[0.16em] text-charcoal transition-colors duration-300 hover:bg-gold-light"
                >
                  Explore Resources
                </Link>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}