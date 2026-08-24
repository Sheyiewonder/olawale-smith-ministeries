"use client";

import { usePageTheme } from "@/components/theme/ThemeProvider";

export default function SectionHeading({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  const { config } = usePageTheme();

  return (
    <div>
      <p className={`eyebrow ${config.accent.text}`}>
        {eyebrow}
      </p>

      <h2 className="display-heading mt-4">
        {title}
      </h2>
    </div>
  );
}