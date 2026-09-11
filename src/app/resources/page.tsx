import { Suspense } from "react";

import PageLayout from "@/components/layout/PageLayout";
import AudioPlayerProvider from "@/components/audio/AudioPlayerProvider";
import AudioPlayerBar from "@/components/audio/AudioPlayerBar";
import ResourcesPage from "@/components/resources/ResourcesPage";

function ResourcesPageFallback() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-ivory text-charcoal">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[720px] overflow-hidden"
      >
        <div className="absolute -right-32 -top-40 h-[620px] w-[620px] rounded-full bg-blue-soft/[0.10] blur-3xl" />

        <div className="absolute left-[28%] top-[120px] h-[280px] w-[280px] rounded-full bg-blue-light/[0.07] blur-3xl" />

        <div className="absolute right-[18%] top-[280px] h-px w-[340px] rotate-[-18deg] bg-blue/[0.16]" />

        <div className="absolute right-[7%] top-[360px] h-[190px] w-[190px] rounded-full border border-blue/[0.10]" />

        <div className="absolute right-[10%] top-[390px] h-[130px] w-[130px] rounded-full border border-gold/[0.12]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-36 lg:px-8">
        <div className="max-w-4xl">
          <p className="eyebrow text-bronze">
            Olawale Smith Ministries
          </p>

          <h1 className="display-heading mt-5 text-6xl sm:text-7xl lg:text-[7rem]">
            The Resource
            <br />
            <span className="relative inline-block text-bronze">
              Library.
              <span
                aria-hidden="true"
                className="absolute -bottom-2 left-0 h-px w-16 bg-blue"
              />
            </span>
          </h1>

          <p className="body-copy mt-7 max-w-2xl text-base text-charcoal/60 sm:text-lg">
            Explore sermons, teachings, ebooks, songs, podcasts and other
            resources from Olawale Smith Ministries.
          </p>

          <div className="mt-9 flex items-center gap-3">
            <span className="h-px w-10 bg-blue/[0.45]" />

            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-deep/60">
              Faith · Purpose · Impact
            </span>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="border-y border-charcoal/10 py-5">
          <div className="h-10 animate-pulse rounded-md bg-charcoal/[0.04]" />
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-20">
        <div className="mb-8 flex items-center gap-3">
          <span className="h-px w-6 bg-blue/[0.35]" />

          <div className="h-2.5 w-28 animate-pulse rounded-full bg-charcoal/5" />
        </div>

        <div
          className={[
            "grid",
            "grid-cols-2",
            "gap-x-4 gap-y-8",
            "sm:grid-cols-3 sm:gap-x-5 sm:gap-y-9",
            "md:grid-cols-4",
            "lg:grid-cols-5 lg:gap-x-6 lg:gap-y-10",
          ].join(" ")}
        >
          {Array.from({ length: 20 }).map((_, index) => (
            <div key={index}>
              <div className="relative aspect-square overflow-hidden rounded-md bg-charcoal/5 sm:rounded-lg">
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-blue-soft/[0.035]"
                />

                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-blue-soft/[0.07] blur-xl"
                />
              </div>

              <div className="mt-2.5 h-2.5 w-20 animate-pulse rounded-full bg-charcoal/5" />

              <div className="mt-2 h-4 w-3/4 animate-pulse rounded-full bg-charcoal/5" />

              <div className="mt-1.5 h-3 w-1/2 animate-pulse rounded-full bg-charcoal/5" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ResourcesRoute() {
  return (
    <PageLayout theme="light">
      <AudioPlayerProvider>
        <Suspense fallback={<ResourcesPageFallback />}>
          <ResourcesPage />
        </Suspense>

        <AudioPlayerBar />
      </AudioPlayerProvider>
    </PageLayout>
  );
}
