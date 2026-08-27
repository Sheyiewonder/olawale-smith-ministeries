"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  FileText,
  FolderOpen,
  LogOut,
  Plus,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  clearAdminToken,
  getAdminCategories,
  getAdminResources,
  getCurrentAdmin,
  type Admin,
  type AdminCategory,
  type AdminResource,
} from "@/lib/admin-api";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [admin, setAdmin] =
    useState<Admin | null>(null);

  const [resources, setResources] =
    useState<AdminResource[]>([]);

  const [categories, setCategories] =
    useState<AdminCategory[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [
          adminResponse,
          resourceResponse,
          categoryResponse,
        ] = await Promise.all([
          getCurrentAdmin(),
          getAdminResources(),
          getAdminCategories(),
        ]);

        setAdmin(adminResponse.data);
        setResources(resourceResponse.data);
        setCategories(categoryResponse.data);
      } catch {
        clearAdminToken();
        router.replace("/admin/login");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, [router]);

  function logout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ivory">
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-charcoal/40">
          Loading dashboard...
        </p>
      </main>
    );
  }

  const publishedCount =
    resources.filter(
      (resource) => resource.published,
    ).length;

  const articleCount =
    resources.filter(
      (resource) => resource.type === "ARTICLE",
    ).length;

  const videoCount =
    resources.filter(
      (resource) =>
        resource.type === "VIDEO" ||
        resource.media?.some(
          (media) => media.type === "VIDEO",
        ),
    ).length;

  return (
    <main className="min-h-screen bg-ivory text-charcoal">
      {/* Header */}
      <header className="border-b border-charcoal/10 bg-white/60">
        <div className="mx-auto flex h-20 w-full max-w-[1600px] items-center justify-between px-6 lg:px-10">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-bronze">
              Olawale Smith Ministries
            </p>

            <p className="mt-1 text-sm font-medium">
              Administration
            </p>
          </div>

          <div className="flex items-center gap-5">
            {admin && (
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium">
                  {admin.name}
                </p>

                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                  {admin.role.replace("_", " ")}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={logout}
              className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/50 transition-colors hover:text-bronze"
            >
              <LogOut size={15} />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto w-full max-w-[1600px] px-6 py-12 lg:px-10 lg:py-16">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-bronze">
              Dashboard
            </p>

            <h1 className="display-heading mt-4 text-4xl sm:text-5xl">
              Welcome back.
            </h1>

            <p className="mt-4 max-w-xl text-sm leading-7 text-charcoal/55">
              Manage the ministry&apos;s resources and
              published content.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/dashboard/resources/new",
              )
            }
            className="group inline-flex w-fit items-center gap-3 bg-charcoal px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory transition-colors hover:bg-bronze"
          >
            <Plus size={15} />
            New Resource
          </button>
        </div>

        {/* Stats */}
        <div className="mt-12 grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard
            label="Total Resources"
            value={resources.length}
            icon={<BookOpen size={18} />}
          />

          <StatCard
            label="Published"
            value={publishedCount}
            icon={<FileText size={18} />}
          />

          <StatCard
            label="Articles"
            value={articleCount}
            icon={<FileText size={18} />}
          />

          <StatCard
            label="Video Content"
            value={videoCount}
            icon={<Video size={18} />}
          />

          <StatCard
            label="Categories"
            value={categories.length}
            icon={<FolderOpen size={18} />}
          />
        </div>

        {/* Categories */}
        <section className="mt-16">
          <div className="flex items-end justify-between border-b border-charcoal/10 pb-5">
            <div>
              <p className="eyebrow text-bronze">
                Organization
              </p>

              <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
                Categories
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/categories",
                )
              }
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45 transition-colors hover:text-bronze"
            >
              Manage categories
            </button>
          </div>

          <div className="mt-6 grid gap-px overflow-hidden border border-charcoal/10 bg-charcoal/10 sm:grid-cols-2 lg:grid-cols-4">
            {categories.length === 0 ? (
              <div className="bg-white px-6 py-12 text-center sm:col-span-2 lg:col-span-4">
                <FolderOpen
                  size={22}
                  className="mx-auto text-charcoal/25"
                />

                <p className="mt-4 text-sm text-charcoal/45">
                  No categories yet.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/admin/dashboard/categories/new",
                    )
                  }
                  className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze"
                >
                  Create category
                </button>
              </div>
            ) : (
              categories
                .slice(0, 8)
                .map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() =>
                      router.push(
                        `/admin/dashboard/categories/${category.id}/edit`,
                      )
                    }
                    className="group bg-white p-6 text-left transition-colors hover:bg-charcoal hover:text-ivory"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <FolderOpen
                        size={18}
                        className="text-bronze transition-colors group-hover:text-gold"
                      />

                      <span className="text-[9px] font-semibold uppercase tracking-[0.12em] text-charcoal/30 transition-colors group-hover:text-ivory/40">
                        Edit
                      </span>
                    </div>

                    <p className="mt-8 font-medium">
                      {category.name}
                    </p>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.12em] text-charcoal/35 transition-colors group-hover:text-ivory/45">
                      {category._count?.resources ?? 0}{" "}
                      {category._count?.resources === 1
                        ? "resource"
                        : "resources"}
                    </p>
                  </button>
                ))
            )}
          </div>
        </section>

        {/* Recent resources */}
        <section className="mt-16">
          <div className="flex items-end justify-between border-b border-charcoal/10 pb-5">
            <div>
              <p className="eyebrow text-bronze">
                Content
              </p>

              <h2 className="mt-3 text-2xl font-medium tracking-[-0.03em]">
                Recent resources
              </h2>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/dashboard/resources",
                )
              }
              className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/45 transition-colors hover:text-bronze"
            >
              View all
            </button>
          </div>

          <div className="mt-6 overflow-hidden border border-charcoal/10 bg-white">
            {resources.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-sm text-charcoal/45">
                  No resources yet.
                </p>
              </div>
            ) : (
              resources
                .slice(0, 8)
                .map((resource) => {
                  const category =
                    resource.categories?.[0]?.category;

                  return (
                    <div
                      key={resource.id}
                      className="flex flex-col gap-4 border-b border-charcoal/10 px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-medium">
                          {resource.title}
                        </p>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/40">
                          {category && (
                            <>
                              <span className="text-bronze">
                                {category.name}
                              </span>

                              <span className="h-1 w-1 rounded-full bg-charcoal/20" />
                            </>
                          )}

                          <span>
                            {resource.type}
                          </span>

                          <span className="h-1 w-1 rounded-full bg-charcoal/20" />

                          <span
                            className={
                              resource.published
                                ? "text-green-600"
                                : "text-charcoal/40"
                            }
                          >
                            {resource.published
                              ? "Published"
                              : "Draft"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/admin/dashboard/resources/${resource.id}`,
                          )
                        }
                        className="w-fit text-[10px] font-semibold uppercase tracking-[0.14em] text-bronze"
                      >
                        Edit
                      </button>
                    </div>
                  );
                })
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <span className="text-charcoal/30">
          {icon}
        </span>

        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-charcoal/35">
          {label}
        </span>
      </div>

      <p className="mt-8 text-4xl font-medium tracking-[-0.04em]">
        {value}
      </p>
    </div>
  );
}
