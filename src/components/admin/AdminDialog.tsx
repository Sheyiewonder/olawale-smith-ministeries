"use client";

import type { ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react";

interface AdminDialogProps {
  open: boolean;

  title: string;

  description?: string;

  children?: ReactNode;

  confirmLabel?: string;
  cancelLabel?: string;

  variant?: "default" | "danger" | "success";

  loading?: boolean;

  onConfirm?: () => void;
  onCancel: () => void;
}

export default function AdminDialog({
  open,
  title,
  description,
  children,
  confirmLabel = "Continue",
  cancelLabel = "Close",
  variant = "default",
  loading = false,
  onConfirm,
  onCancel,
}: AdminDialogProps) {
  if (!open) {
    return null;
  }

  const Icon =
    variant === "danger"
      ? AlertTriangle
      : variant === "success"
        ? CheckCircle2
        : Info;

  const accentClasses =
    variant === "danger"
      ? "bg-red-600"
      : variant === "success"
        ? "bg-gold"
        : "bg-charcoal";

  const iconClasses =
    variant === "danger"
      ? "bg-red-50 text-red-600"
      : variant === "success"
        ? "bg-gold/10 text-bronze"
        : "bg-charcoal text-gold";

  const confirmClasses =
    variant === "danger"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "success"
        ? "bg-charcoal text-ivory hover:bg-bronze"
        : "bg-charcoal text-gold hover:bg-bronze hover:text-ivory";

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-5"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-dialog-title"
      aria-describedby={
        description
          ? "admin-dialog-description"
          : undefined
      }
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onCancel}
        disabled={loading}
        className="absolute inset-0 cursor-default bg-charcoal/60 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      {/* Dialog */}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-[2rem] border border-charcoal/10 bg-ivory shadow-2xl shadow-charcoal/20">
        {/* Top accent */}
        <div
          className={`h-1 w-full ${accentClasses}`}
        />

        <div className="p-7 sm:p-8">
          {/* Close */}
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-charcoal/35 transition hover:bg-charcoal/5 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Close"
          >
            <X size={17} />
          </button>

          {/* Icon */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${iconClasses}`}
          >
            <Icon size={20} />
          </div>

          {/* Content */}
          <div className="mt-6">
            <h2
              id="admin-dialog-title"
              className="text-2xl font-medium tracking-[-0.03em] text-charcoal"
            >
              {title}
            </h2>

            {description && (
              <p
                id="admin-dialog-description"
                className="mt-3 text-sm leading-7 text-charcoal/55"
              >
                {description}
              </p>
            )}

            {children && (
              <div className="mt-5">
                {children}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            {/* Cancel / Close */}
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="rounded-full border border-charcoal/10 px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/60 transition hover:border-charcoal/20 hover:text-charcoal disabled:cursor-not-allowed disabled:opacity-40"
            >
              {cancelLabel}
            </button>

            {/* Confirm */}
            {onConfirm && (
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className={`rounded-full px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-50 ${confirmClasses}`}
              >
                {loading
                  ? "Please wait..."
                  : confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
