"use client";

import { useEffect, useState } from "react";

const MIN_DISPLAY_TIME = 1800;
const EXIT_DURATION = 750;

export default function SiteSplash() {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const startedAt = performance.now();

    const dismiss = () => {
      const elapsed = performance.now() - startedAt;
      const remaining = Math.max(0, MIN_DISPLAY_TIME - elapsed);

      window.setTimeout(() => {
        setIsLeaving(true);

        window.setTimeout(() => {
          setIsVisible(false);
        }, EXIT_DURATION);
      }, remaining);
    };

    // Give the page a chance to mount and paint first.
    const frame = window.requestAnimationFrame(() => {
      if (document.readyState === "complete") {
        dismiss();
      } else {
        window.addEventListener("load", dismiss, { once: true });
      }
    });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("load", dismiss);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2147483647,
        background: "#11110f",
        color: "#f5f0e6",
        pointerEvents: isLeaving ? "none" : "auto",
      }}
      className={[
        "flex items-center justify-center",
        "transition-[opacity,transform]",
        "ease-[cubic-bezier(0.76,0,0.24,1)]",
        isLeaving
          ? "-translate-y-full opacity-0 duration-700"
          : "translate-y-0 opacity-100 duration-300",
      ].join(" ")}
    >
      {/* Atmospheric background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Central blue glow */}
        <div
          className="absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px]"
          style={{
            background: "rgba(111, 168, 230, 0.08)",
          }}
        />

        {/* Gold glow */}
        <div
          className="absolute left-[18%] top-[24%] h-[240px] w-[240px] rounded-full blur-[110px]"
          style={{
            background: "rgba(183, 154, 91, 0.07)",
          }}
        />

        {/* Blue secondary glow */}
        <div
          className="absolute bottom-[10%] right-[16%] h-[200px] w-[200px] rounded-full blur-[100px]"
          style={{
            background: "rgba(59, 130, 208, 0.06)",
          }}
        />

        {/* Architectural horizontal line */}
        <div
          className="absolute left-1/2 top-1/2 h-px w-[min(80vw,620px)] -translate-x-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(183,154,91,0.18), transparent)",
          }}
        />

        {/* Vertical architectural line */}
        <div
          className="absolute left-1/2 top-1/2 h-[55vh] w-px -translate-x-1/2 -translate-y-1/2"
          style={{
            background:
              "linear-gradient(180deg, transparent, rgba(111,168,230,0.08), transparent)",
          }}
        />
      </div>

      {/* Branding */}
      <div
        className={[
          "relative z-10 flex flex-col items-center",
          "transition-[opacity,transform]",
          "duration-700",
          "ease-[cubic-bezier(0.76,0,0.24,1)]",
          isLeaving
            ? "-translate-y-8 scale-[0.96] opacity-0"
            : "translate-y-0 scale-100 opacity-100",
        ].join(" ")}
      >
        {/* OS mark */}
        <div
          className="relative flex h-[72px] w-[72px] items-center justify-center"
          style={{
            border: "1px solid rgba(183,154,91,0.38)",
            background: "rgba(245,240,230,0.025)",
            boxShadow: "0 0 60px rgba(111,168,230,0.07)",
          }}
        >
          <div
            className="absolute inset-[6px]"
            style={{
              border: "1px solid rgba(245,240,230,0.08)",
            }}
          />

          <span
            className="relative font-sans text-[22px] font-semibold tracking-[-0.08em]"
            style={{
              color: "#f5f0e6",
            }}
          >
            OS
          </span>

          <span
            className="absolute -bottom-px left-1/2 h-[2px] w-6 -translate-x-1/2"
            style={{
              background: "#b79a5b",
            }}
          />
        </div>

        {/* Ministry name */}
        <div className="mt-7 text-center">
          <p
            className="text-[10px] font-semibold uppercase tracking-[0.42em]"
            style={{
              color: "#c9b47d",
            }}
          >
            Olawale Smith
          </p>

          <p
            className="mt-2 text-[9px] font-medium uppercase tracking-[0.4em]"
            style={{
              color: "rgba(245,240,230,0.42)",
            }}
          >
            Ministries
          </p>
        </div>

        {/* Loading bar */}
        <div
          className="relative mt-10 h-px w-36 overflow-hidden"
          style={{
            background: "rgba(245,240,230,0.09)",
          }}
        >
          <div
            className="absolute inset-y-0 left-0 w-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent, #b79a5b, #6fa8e6, transparent)",
              animation: "splash-progress 1.4s ease-in-out infinite",
            }}
          />
        </div>

        <p
          className="mt-4 text-[7px] font-medium uppercase tracking-[0.3em]"
          style={{
            color: "rgba(245,240,230,0.24)",
          }}
        >
          Preparing the experience
        </p>
      </div>

      {/* Bottom signature */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 items-center gap-3 whitespace-nowrap">
        <span
          className="h-px w-7"
          style={{
            background: "rgba(245,240,230,0.10)",
          }}
        />

        <span
          className="text-[8px] font-medium uppercase tracking-[0.32em]"
          style={{
            color: "rgba(245,240,230,0.25)",
          }}
        >
          Faith · Teaching · Impact
        </span>

        <span
          className="h-px w-7"
          style={{
            background: "rgba(245,240,230,0.10)",
          }}
        />
      </div>

      <style jsx>{`
        @keyframes splash-progress {
          0% {
            transform: translateX(-130%);
          }

          50% {
            transform: translateX(100%);
          }

          100% {
            transform: translateX(260%);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation: none !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}