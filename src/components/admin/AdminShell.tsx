"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  FolderOpen,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

import { useEffect, useState } from "react";

import {
  clearAdminToken,
  getCurrentAdmin,
  type Admin,
} from "@/lib/admin-api";

const navigation = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Resources",
    href: "/admin/dashboard/resources",
    icon: Library,
  },
  {
    label: "Categories",
    href: "/admin/dashboard/categories",
    icon: FolderOpen,
  },
  {
    label: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
  },
];

export default function AdminShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);

  useEffect(() => {
    async function loadAdmin() {
      try {
        const response = await getCurrentAdmin();
        setAdmin(response.data);
      } catch {
        clearAdminToken();
        router.replace("/admin/login");
      }
    }

    loadAdmin();
  }, [router]);

  useEffect(() => {
    function handleToggle() {
      setSidebarOpen((current) => !current);
    }

    window.addEventListener(
      "admin:toggle-sidebar",
      handleToggle,
    );

    return () => {
      window.removeEventListener(
        "admin:toggle-sidebar",
        handleToggle,
      );
    };
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function handleLogout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  return (
    <div className="min-h-screen bg-ivory text-charcoal">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-charcoal/30 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col",
          "border-r border-charcoal/10 bg-white",
          "transition-transform duration-300",
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-[88px] items-center justify-between border-b border-charcoal/10 px-7">
          <Link
            href="/admin/dashboard"
            className="group"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-bronze">
              Olawale Smith
            </p>

            <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-charcoal">
              Ministries
            </p>

            <p className="mt-1 text-[8px] uppercase tracking-[0.18em] text-charcoal/35">
              Administration
            </p>
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center text-charcoal/40 hover:bg-charcoal/5 hover:text-charcoal lg:hidden"
            aria-label="Close navigation"
          >
            <X size={18} strokeWidth={1.5} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-7">
          <p className="px-3 pb-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/30">
            Administration
          </p>

          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;

              const active =
                item.href === "/admin/dashboard"
                  ? pathname === "/admin/dashboard"
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={[
                    "group flex items-center gap-3 px-3 py-3",
                    "text-xs font-medium transition-all",
                    active
                      ? "bg-charcoal text-ivory"
                      : "text-charcoal/55 hover:bg-charcoal/5 hover:text-charcoal",
                  ].join(" ")}
                >
                  <Icon
                    size={17}
                    strokeWidth={1.5}
                  />

                  <span>{item.label}</span>

                  {active && (
                    <ChevronRight
                      size={14}
                      className="ml-auto text-bronze"
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Admin profile */}
        <div className="border-t border-charcoal/10 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center bg-bronze/10 text-bronze">
              <ShieldCheck
                size={17}
                strokeWidth={1.5}
              />
            </div>

            <div className="min-w-0">
              <p className="truncate text-xs font-medium">
                {admin?.name ?? "Administrator"}
              </p>

              <p className="mt-0.5 truncate text-[9px] uppercase tracking-[0.12em] text-charcoal/35">
                {admin?.role ?? "ADMIN"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-5 flex w-full items-center gap-3 border border-charcoal/10 px-3 py-2.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal/45 transition-colors hover:border-red-500/20 hover:bg-red-500/5 hover:text-red-500"
          >
            <LogOut
              size={14}
              strokeWidth={1.5}
            />

            Sign out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="lg:pl-[270px]">
        {/* Global mobile header */}
        <div className="sticky top-0 z-30 flex h-16 items-center border-b border-charcoal/10 bg-white/95 px-5 backdrop-blur lg:hidden">
          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="flex h-10 w-10 items-center justify-center border border-charcoal/10 text-charcoal transition-colors hover:border-bronze hover:text-bronze"
            aria-label="Open admin navigation"
          >
            <Menu
              size={19}
              strokeWidth={1.5}
            />
          </button>

          <Link
            href="/admin/dashboard"
            className="ml-4"
          >
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-bronze">
              Olawale Smith Ministries
            </p>

            <p className="mt-0.5 text-[8px] uppercase tracking-[0.15em] text-charcoal/35">
              Administration
            </p>
          </Link>
        </div>

        {/* Page */}
        <main>{children}</main>
      </div>
    </div>
  );
}