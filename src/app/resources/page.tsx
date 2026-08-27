import PageLayout from "@/components/layout/PageLayout";
import ResourceGrid from "@/components/resources/ResourceGrid";
import ResourceFilters from "@/components/resources/ResourceFilters";
import ResourceSearch from "@/components/resources/ResourceSearch";
import { getResources } from "@/lib/api";

interface ResourcesPageProps {
  searchParams: Promise<{
    type?: string;
    category?: string;
    search?: string;
  }>;
}

export default async function ResourcesPage({
  searchParams,
}: ResourcesPageProps) {
  const params = await searchParams;

  const response = await getResources({
    type: params.type as
      | "SERMON"
      | "EBOOK"
      | "SONG"
      | "VIDEO"
      | "PODCAST"
      | "ARTICLE"
      | undefined,

    category: params.category,

    search: params.search,
  });

  return (
    <PageLayout theme="light">
      <main className="min-h-screen pt-32">
        {/* Page Header */}
        <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-8">
          <div className="max-w-3xl">
            <p className="eyebrow text-bronze">
              The Library
            </p>

            <h1 className="display-heading mt-5 text-5xl text-charcoal sm:text-6xl lg:text-8xl">
              Resources for
              <br />
              <span className="text-bronze">
                Kingdom Impact.
              </span>
            </h1>

            <p className="body-copy mt-7 max-w-2xl text-base text-charcoal/60 sm:text-lg">
              Explore sermons, teachings, ebooks, songs,
              podcasts, articles and other resources from
              Olawale Smith Ministries.
            </p>
          </div>
        </section>

        {/* Search, Filters & Resources */}
        <section className="mx-auto w-full max-w-7xl px-6 pb-32 lg:px-8">
          {/* Search */}
          <ResourceSearch />

          {/* Filters */}
          <div className="mt-6">
            <ResourceFilters />
          </div>

          {/* Resource Grid */}
          <div className="mt-12">
            <ResourceGrid resources={response.data} />
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
