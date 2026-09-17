"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface AccountCardProps {
  currency: "Naira" | "Dollar";
  accountNumber: string;
  bankName: string;
  accountName: string;
}

export default function AccountCard({
  currency,
  accountNumber,
  bankName,
  accountName,
}: AccountCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(accountNumber);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // Clipboard access can be unavailable in some browsers/contexts.
    }
  }

  const isDollar = currency === "Dollar";

  return (
    <div className="group relative">
      {/* ------------------------------------------------------------------ */}
      {/* Ambient outer glow                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div
        aria-hidden="true"
        className={[
          "pointer-events-none absolute -inset-3 rounded-[2rem] opacity-60 blur-2xl",
          "transition-all duration-700",
          "group-hover:-inset-5 group-hover:opacity-100",
          isDollar ? "bg-blue/10" : "bg-gold/10",
        ].join(" ")}
      />

      {/* ------------------------------------------------------------------ */}
      {/* Card                                                                 */}
      {/* ------------------------------------------------------------------ */}

      <div
        className={[
          "relative overflow-hidden rounded-3xl border p-6 sm:p-7",
          "backdrop-blur-xl transition-all duration-500",
          isDollar
            ? [
                "border-blue-deep/15 bg-blue-pale/70",
                "hover:border-blue/30",
                "hover:bg-blue-pale/80",
                "hover:shadow-[0_0_45px_rgba(59,130,208,0.10)]",
              ].join(" ")
            : [
                "border-bronze/20 bg-white/55",
                "hover:border-gold/40",
                "hover:bg-white/65",
                "hover:shadow-[0_0_45px_rgba(183,154,91,0.12)]",
              ].join(" "),
        ].join(" ")}
      >
        {/* ---------------------------------------------------------------- */}
        {/* Inner atmospheric glow                                            */}
        {/* ---------------------------------------------------------------- */}

        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -right-20 -top-20 h-48 w-48",
            "rounded-full blur-3xl transition-all duration-700",
            "group-hover:scale-125",
            isDollar ? "bg-blue/10" : "bg-gold/10",
          ].join(" ")}
        />

        {/* Subtle lower glow */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none absolute -bottom-24 -left-20 h-40 w-40",
            "rounded-full blur-3xl opacity-40 transition-opacity duration-700",
            "group-hover:opacity-70",
            isDollar ? "bg-blue-soft/[0.06]" : "bg-bronze/[0.07]",
          ].join(" ")}
        />

        <div className="relative">
          {/* Currency */}
          <div className="mb-7 flex items-center justify-between">
            <span
              className={[
                "text-[11px] font-medium uppercase tracking-[0.22em]",
                isDollar ? "text-blue-deep/70" : "text-bronze",
              ].join(" ")}
            >
              {currency} Account
            </span>

            <span
              className={[
                "text-xs uppercase tracking-[0.18em]",
                isDollar ? "text-blue-deep/45" : "text-bronze/55",
              ].join(" ")}
            >
              {isDollar ? "USD" : "NGN"}
            </span>
          </div>

          {/* Account number */}
          <div className="mb-7">
            <p className="mb-2 text-xs text-charcoal/45">
              Account Number
            </p>

            <div className="flex items-center gap-3">
              <p className="min-w-0 flex-1 truncate font-mono text-xl tracking-[0.08em] text-charcoal sm:text-2xl">
                {accountNumber}
              </p>

              <button
                type="button"
                onClick={handleCopy}
                aria-label={
                  copied
                    ? "Account number copied"
                    : "Copy account number"
                }
                className={[
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  "border transition-all duration-300",
                  copied
                    ? "border-blue/30 bg-blue-pale text-blue-deep"
                    : [
                        "border-charcoal/10 bg-white/50 text-charcoal/60",
                        "hover:border-gold/40 hover:bg-white hover:text-charcoal",
                        "hover:shadow-[0_0_20px_rgba(183,154,91,0.10)]",
                      ].join(" "),
                ].join(" ")}
              >
                {copied ? (
                  <Check size={16} strokeWidth={1.8} />
                ) : (
                  <Copy size={16} strokeWidth={1.6} />
                )}
              </button>
            </div>

            {/* Copied confirmation */}
            <div
              className={[
                "mt-2 h-4 text-xs transition-all duration-300",
                copied
                  ? "translate-y-0 text-blue-deep opacity-100"
                  : "pointer-events-none -translate-y-1 opacity-0",
              ].join(" ")}
              aria-live="polite"
            >
              Copied
            </div>
          </div>

          {/* Account details */}
          <div className="grid gap-5 border-t border-charcoal/10 pt-5 sm:grid-cols-2">
            <div>
              <p className="mb-1 text-xs text-charcoal/45">
                Bank Name
              </p>

              <p className="text-sm font-medium text-charcoal/80">
                {bankName}
              </p>
            </div>

            <div>
              <p className="mb-1 text-xs text-charcoal/45">
                Account Name
              </p>

              <p className="text-sm font-medium text-charcoal/80">
                {accountName}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}