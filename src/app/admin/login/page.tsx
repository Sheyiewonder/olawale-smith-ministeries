"use client";

import { FormEvent, useState } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  adminLogin,
  setAdminToken,
} from "@/lib/admin-api";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await adminLogin(
        email,
        password,
      );

      setAdminToken(response.data.token);

      router.replace("/admin/dashboard");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to sign in",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-charcoal text-ivory">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center px-6 py-16 lg:px-8">
        <div className="grid w-full gap-16 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          {/* Brand side */}
          <div className="hidden lg:block">
            <p className="eyebrow text-gold">
              Olawale Smith Ministries
            </p>

            <h1 className="display-heading mt-6 max-w-3xl text-6xl text-ivory xl:text-8xl">
              Ministry
              <br />
              <span className="text-gold">
                Administration.
              </span>
            </h1>

            <p className="mt-8 max-w-xl text-base leading-8 text-ivory/55">
              Manage resources, teachings, media,
              and ministry content from one place.
            </p>
          </div>

          {/* Login */}
          <div className="mx-auto w-full max-w-md">
            <div className="mb-10">
              <p className="eyebrow text-gold">
                Admin Portal
              </p>

              <h2 className="mt-4 text-3xl font-medium tracking-[-0.03em] text-ivory">
                Welcome back.
              </h2>

              <p className="mt-3 text-sm leading-6 text-ivory/50">
                Sign in to manage the ministry
                platform.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/45"
                >
                  Email
                </label>

                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  className="h-14 w-full border border-ivory/10 bg-white/[0.04] px-4 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/25 focus:border-gold/60"
                  placeholder="admin@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.14em] text-ivory/45"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  className="h-14 w-full border border-ivory/10 bg-white/[0.04] px-4 text-sm text-ivory outline-none transition-colors placeholder:text-ivory/25 focus:border-gold/60"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="border border-red-400/20 bg-red-400/5 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-14 w-full items-center justify-center gap-3 bg-gold text-charcoal transition-all duration-300 hover:bg-gold/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2
                      size={16}
                      className="animate-spin"
                    />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}