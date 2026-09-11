"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Section from "@/components/layout/Section";

export default function Hero() {
return ( <Section
   theme="dark"
   className="relative min-h-screen overflow-hidden"
 >
{/* ------------------------------------------------------------------ */}
{/* Atmospheric background                                             */}
{/* ------------------------------------------------------------------ */}

```
  <div className="pointer-events-none absolute inset-0 overflow-hidden">
    {/* Warm gold glow */}
    <motion.div
      initial={{ opacity: 0.35, scale: 0.92 }}
      animate={{
        opacity: [0.3, 0.45, 0.3],
        scale: [0.92, 1, 0.92],
      }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute left-[8%] top-[16%] h-[420px] w-[420px] rounded-full bg-gold/10 blur-[120px]"
    />

    {/* Cool blue atmosphere */}
    <motion.div
      initial={{ opacity: 0.35, scale: 0.94 }}
      animate={{
        opacity: [0.3, 0.48, 0.3],
        scale: [0.94, 1.04, 0.94],
      }}
      transition={{
        duration: 11,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute right-[3%] top-[4%] h-[600px] w-[600px] rounded-full bg-blue/10 blur-[150px]"
    />

    <motion.div
      animate={{
        x: [0, -25, 0],
        y: [0, 20, 0],
        opacity: [0.18, 0.28, 0.18],
      }}
      transition={{
        duration: 13,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="absolute bottom-[-12%] right-[-8%] h-[520px] w-[520px] rounded-full bg-blue-soft/10 blur-[120px]"
    />

    {/* Directional blue light */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_28%,rgba(59,130,208,0.13),transparent_34%)]" />

    {/* Gold counter-light */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_72%,rgba(183,154,91,0.08),transparent_30%)]" />

    {/* Cinematic gradients */}
    <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/35" />

    <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-charcoal/25" />

    {/* ---------------------------------------------------------------- */}
    {/* Architectural rings                                              */}
    {/* ---------------------------------------------------------------- */}

    <motion.div
      animate={{ rotate: 360 }}
      transition={{
        duration: 55,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute right-[-12%] top-[6%] h-[720px] w-[720px] rounded-full border border-blue/10"
    />

    <motion.div
      animate={{ rotate: -360 }}
      transition={{
        duration: 70,
        repeat: Infinity,
        ease: "linear",
      }}
      className="absolute right-[0%] top-[14%] h-[560px] w-[560px] rounded-full border border-gold/10"
    />

    <div className="absolute right-[9%] top-[23%] h-[400px] w-[400px] rounded-full border border-blue-soft/10" />

    {/* Fine blue horizon */}
    <div className="absolute bottom-0 left-0 h-px w-[55%] bg-gradient-to-r from-transparent via-blue-soft/30 to-transparent" />
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Hero content                                                       */}
  {/* ------------------------------------------------------------------ */}

  <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl items-end px-6 pb-16 pt-32 sm:pb-20 lg:px-8 lg:pb-24 lg:pt-40">
    <div className="grid w-full items-end gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.72fr)] lg:gap-16 xl:gap-24">
      {/* ---------------------------------------------------------------- */}
      {/* Copy                                                              */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="max-w-4xl"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.15,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-gold"
        >
          Olawale Smith Ministries
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.22,
            duration: 0.9,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="display-heading max-w-5xl text-6xl text-ivory sm:text-7xl lg:text-[7.8rem] xl:text-[8.5rem]"
        >
          Resources for
          <br />
          <span className="relative inline-block text-gold">
            Kingdom Impact.
            <motion.span
              initial={{ scaleX: 0, transformOrigin: "left" }}
              animate={{ scaleX: 1 }}
              transition={{
                delay: 0.85,
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="absolute -bottom-2 left-0 h-px w-2/3 bg-gradient-to-r from-gold via-blue-soft to-transparent opacity-70"
            />
          </span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.42,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-8 max-w-xl"
        >
          <p className="body-copy max-w-xl text-base text-ivory/65 sm:text-lg">
            Explore a growing library of sermons, teachings, ebooks,
            songs, podcasts and other resources designed to strengthen
            your faith and deepen your walk with God.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.55,
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <Link
            href="/resources"
            className="group inline-flex min-w-[190px] items-center justify-center bg-gold px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-charcoal transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-light hover:shadow-[0_12px_40px_rgba(183,154,91,0.18)]"
          >
            <span>Explore Resources</span>

            <span className="ml-3 h-px w-0 bg-charcoal transition-all duration-300 group-hover:w-5" />
          </Link>

          <Link
            href="/partner"
            className="group inline-flex min-w-[190px] items-center justify-center border border-white/20 bg-white/[0.02] px-7 py-4 text-xs font-bold uppercase tracking-[0.18em] text-ivory backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-blue-soft/50 hover:bg-blue/5 hover:text-blue-soft hover:shadow-[0_12px_40px_rgba(59,130,208,0.12)]"
          >
            <span>Partner with us</span>

            <span className="ml-3 h-px w-0 bg-blue-soft transition-all duration-300 group-hover:w-5" />
          </Link>
        </motion.div>
      </motion.div>

      {/* ---------------------------------------------------------------- */}
      {/* Premium image card                                               */}
      {/* ---------------------------------------------------------------- */}

      <motion.div
        initial={{ opacity: 0, y: 45, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          delay: 0.35,
          duration: 1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative mx-auto w-full max-w-[520px] lg:mx-0 lg:ml-auto"
      >
        {/* Outer blue aura */}
        <motion.div
          animate={{
            opacity: [0.28, 0.42, 0.28],
            scale: [0.98, 1.02, 0.98],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -inset-6 rounded-[2.5rem] bg-blue/15 blur-3xl"
        />

        {/* Floating blue architectural layer */}
        <motion.div
          animate={{
            y: [0, -8, 0],
            rotate: [0, 0.4, 0],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-3 -top-3 h-full w-full rounded-[2rem] border border-blue-soft/30 bg-blue/[0.16] backdrop-blur-md"
        />

        {/* Gold offset frame */}
        <motion.div
          animate={{
            y: [0, 5, 0],
            x: [0, 2, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-3 -left-3 h-full w-full rounded-[2rem] border border-gold/15 bg-gold/[0.03]"
        />

        {/* Main glass frame */}
        <div className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-blue/[0.10] p-2 shadow-[0_35px_100px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          {/* Blue inner glow */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_15%,rgba(111,168,230,0.25),transparent_32%)]" />

          {/* Image */}
          <div className="relative aspect-[4/5] overflow-hidden rounded-[1.55rem] bg-blue-deep">
            <Image
              src="/images/pastor olawale smith 014.jpg"
              alt="Olawale Smith Ministries"
              fill
              priority
              sizes="(max-width: 1024px) 90vw, 42vw"
              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.045]"
            />

            {/* Cinematic image treatment */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/5 to-blue/[0.10] mix-blend-multiply" />

            <div className="absolute inset-0 bg-gradient-to-br from-blue/[0.18] via-transparent to-gold/[0.08] mix-blend-overlay" />

            {/* Glass reflection */}
            <motion.div
              initial={{ x: "-120%" }}
              whileHover={{ x: "120%" }}
              transition={{
                duration: 1.2,
                ease: "easeInOut",
              }}
              className="absolute inset-y-0 w-1/3 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/[0.12] to-transparent blur-sm"
            />

            {/* Fine inner border */}
            <div className="pointer-events-none absolute inset-0 rounded-[1.55rem] border border-white/10" />
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Floating card label                                              */}
          {/* ---------------------------------------------------------------- */}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1,
              duration: 0.6,
            }}
            className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4"
          >
            <div className="rounded-full border border-white/15 bg-charcoal/[0.52] px-4 py-2 backdrop-blur-xl">
              <span className="text-[9px] font-semibold uppercase tracking-[0.24em] text-ivory/75">
                Faith • Teaching • Impact
              </span>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-soft/30 bg-blue/[0.25] text-blue-soft backdrop-blur-xl transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-soft shadow-[0_0_14px_rgba(111,168,230,0.75)]" />
            </div>
          </motion.div>
        </div>

        {/* Small floating accent */}
        <motion.div
          animate={{
            y: [0, -12, 0],
            opacity: [0.55, 0.9, 0.55],
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -right-5 top-[18%] hidden h-14 w-14 items-center justify-center rounded-full border border-blue-soft/20 bg-blue/[0.10] backdrop-blur-xl lg:flex"
        >
          <span className="h-2 w-2 rounded-full bg-blue-soft shadow-[0_0_18px_rgba(111,168,230,0.8)]" />
        </motion.div>
      </motion.div>
    </div>
  </div>

  {/* ------------------------------------------------------------------ */}
  {/* Scroll indicator                                                    */}
  {/* ------------------------------------------------------------------ */}

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 1.2, duration: 0.8 }}
    className="absolute bottom-8 right-8 hidden items-center gap-4 lg:flex"
  >
    <span className="text-[9px] uppercase tracking-[0.3em] text-ivory/40">
      Scroll to explore
    </span>

    <div className="relative h-px w-16 overflow-hidden bg-ivory/15">
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          repeatDelay: 1,
        }}
        className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-gold to-blue-soft"
      />
    </div>
  </motion.div>
</Section>


);
}
