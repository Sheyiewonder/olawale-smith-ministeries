"use client";

import { useEffect, useState } from "react";

const SPLASH_KEY = "olawale-smith-splash-seen";
const MIN_DURATION = 900;

export default function SiteSplash() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    // Only show the branded entrance once per browser session.
    const alreadySeen = sessionStorage.getItem(SPLASH_KEY);

    if (alreadySeen) {
      return;
    }

    setVisible(true);

    const startedAt = performance.now();

    const finish = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_DURATION - elapsed);

      window.setTimeout(() => {
        setLeaving(true);

        window.setTimeout(() => {
          sessionStorage.setItem(SPLASH_KEY, "true");
          setVisible(false);
        }, 650);
      }, remaining);
    };

    // If the page has already loaded, finish immediately.
    if (document.readyState === "complete") {
      finish();
      return;
    }

    window.addEventListener("load", finish, { once: true });

    return () => {
      window.removeEventListener("load", finish);
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      className={[
        "fixed inset-0 z-[9999] flex items-center justify-center",
        "bg-charcoal text-ivory",
        "transition-all duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)]",
        leaving
          ? "pointer-events-none -translate-y-full opacity-0"
          : "translate-y-0 opacity-100",
      ].join(" ")}
    >
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Blue glow */}
        <div
          className={[
            "absolute left-1/2 top-1/2",
            "h-[420px] w-[420px]",
            "-translate-x-1/2 -translate-y-1/2",
            "rounded-full bg-blue-soft/[0.07]",
            "blur-[120px]",
          ].join(" ")}
        />

        {/* Gold glow */}
        <div
          className={[
            "absolute left-[25%] top-[35%]",
            "h-[220px] w-[220px]",
            "rounded-full bg-gold/[0.055]",
            "blur-[100px]",
          ].join(" ")}
        />

        {/* Fine architectural line */}
        <div
          className={[
            "absolute left-1/2 top-1/2",
            "h-px w-[min(70vw,520px)]",
            "-translate-x-1/2",
            "bg-gradient-to-r",
            "from-transparent via-gold/[0.18] to-transparent",
          ].join(" ")}
        />
      </div>

      {/* Brand */}
      <div
        className={[
          "relative z-10 flex flex-col items-center",
          "transition-all duration-700",
          leaving
            ? "translate-y-[-18px] scale-[0.98] opacity-0"
            : "translate-y-0 scale-100 opacity-100",
        ].join(" ")}
      >
        {/* OS mark */}
        <div
          className={[
            "relative mb-7 flex h-16 w-16 items-center justify-center",
            "border border-gold/35",
            "bg-ivory/[0.025]",
            "shadow-[0_0_50px_rgba(111,168,230,0.06)]",
          ].join(" ")}
        >
          <div className="absolute inset-[5px] border border-ivory/[0.07]" />

          <span className="relative font-sans text-[21px] font-semibold tracking-[-0.06em] text-ivory">
            OS
          </span>

          <span className="absolute -bottom-px left-1/2 h-[2px] w-5 -translate-x-1/2 bg-gold" />
        </div>

        {/* Ministry name */}
        <p className="text-center text-[10px] font-semibold uppercase tracking-[0.42em] text-gold-light/75">
          Olawale Smith
        </p>

        <p className="mt-2 text-center text-[9px] font-medium uppercase tracking-[0.38em] text-ivory/45">
          Ministries
        </p>

        {/* Loading line */}
        <div className="mt-9 h-px w-32 overflow-hidden bg-ivory/[0.08]">
          <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-gold to-blue-soft animate-[splashLoad_1.4s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Bottom editorial detail */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap">
        <span className="h-px w-6 bg-ivory/10" />

        <span className="text-[8px] font-medium uppercase tracking-[0.32em] text-ivory/25">
          Faith · Teaching · Impact
        </span>

        <span className="h-px w-6 bg-ivory/10" />
      </div>

      <style jsx>{`
        @keyframes splashLoad {
          0% {
            transform: translateX(-120%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(220%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}