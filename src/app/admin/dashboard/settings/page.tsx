"use client";

import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  ChevronDown,
  Copy,
  KeyRound,
  Loader2,
  LockKeyhole,
  MoreHorizontal,
  Plus,
  Shield,
  ShieldCheck,
  Trash2,
  UserRound,
  UserRoundCheck,
  UserRoundX,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  adminRequest,
  clearAdminToken,
  getAdminToken,
  getCurrentAdmin,
  type AdminRole,
} from "@/lib/admin-api";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getRoleLabel(role: AdminRole) {
  return role === "SUPER_ADMIN"
    ? "Super Admin"
    : "Administrator";
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(
      (part) =>
        part[0]?.toUpperCase() ?? "",
    )
    .join("");
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function SettingsPage() {
  const [currentAdmin, setCurrentAdmin] =
    useState<AdminUser | null>(null);

  const [admins, setAdmins] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [adminsLoading, setAdminsLoading] =
    useState(false);

  const [pageError, setPageError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  /* ------------------------------------------------------------------------ */
  /* Password form                                                            */
  /* ------------------------------------------------------------------------ */

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [changingPassword, setChangingPassword] =
    useState(false);

  const [passwordError, setPasswordError] =
    useState("");

  /* ------------------------------------------------------------------------ */
  /* Admin modal                                                              */
  /* ------------------------------------------------------------------------ */

  const [showAdminModal, setShowAdminModal] =
    useState(false);

  const [editingAdmin, setEditingAdmin] =
    useState<AdminUser | null>(null);

  const [adminName, setAdminName] =
    useState("");

  const [adminEmail, setAdminEmail] =
    useState("");

  const [adminPassword, setAdminPassword] =
    useState("");

  const [
    adminConfirmPassword,
    setAdminConfirmPassword,
  ] = useState("");

  const [adminRole, setAdminRole] =
    useState<AdminRole>("ADMIN");

  const [savingAdmin, setSavingAdmin] =
    useState(false);

  const [adminFormError, setAdminFormError] =
    useState("");

  /* ------------------------------------------------------------------------ */
  /* Action state                                                             */
  /* ------------------------------------------------------------------------ */

  const [actionAdminId, setActionAdminId] =
    useState<string | null>(null);

  const [resetPassword, setResetPassword] =
    useState<{
      admin: AdminUser;
      password: string;
    } | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<AdminUser | null>(null);

  const [deactivateTarget, setDeactivateTarget] =
    useState<AdminUser | null>(null);

  const [copied, setCopied] =
    useState(false);

  /* ------------------------------------------------------------------------ */
  /* Derived values                                                           */
  /* ------------------------------------------------------------------------ */

  const isSuperAdmin =
    currentAdmin?.role === "SUPER_ADMIN";

  const activeAdminCount = useMemo(
    () =>
      admins.filter(
        (admin) => admin.isActive,
      ).length,
    [admins],
  );

  const superAdminCount = useMemo(
    () =>
      admins.filter(
        (admin) =>
          admin.role === "SUPER_ADMIN" &&
          admin.isActive,
      ).length,
    [admins],
  );

  /* ------------------------------------------------------------------------ */
  /* Load administrators                                                      */
  /* ------------------------------------------------------------------------ */

  async function loadAdmins() {
  try {
    const response = await adminRequest<{
      data: AdminUser[];
    }>("/admin/users");

    setAdmins(response.data);
  } catch (error) {
    setPageError(
      error instanceof Error
        ? error.message
        : "Failed to load administrators",
    );
  }
}

  /* ------------------------------------------------------------------------ */
  /* Load current admin                                                       */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    let mounted = true;

    async function loadSettings() {
      const token = getAdminToken();

      if (!token) {
        window.location.replace(
          "/admin/login",
        );

        return;
      }

      try {
        setLoading(true);
        setPageError("");

        const response =
          await getCurrentAdmin();

        if (!mounted) {
          return;
        }

        const admin =
          response.data as AdminUser;

        setCurrentAdmin(admin);

        if (admin.role === "SUPER_ADMIN") {
          await loadAdmins();
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load settings.";

        /*
         * A failed /me request means the current
         * authentication session cannot be trusted.
         *
         * Remove the existing token and return
         * the administrator to the login page.
         */
        clearAdminToken();

        setPageError(message);

        window.setTimeout(() => {
          window.location.replace(
            "/admin/login",
          );
        }, 400);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadSettings();

    return () => {
      mounted = false;
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Change own password                                                      */
  /* ------------------------------------------------------------------------ */

  async function handleChangePassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordError("");
    setSuccessMessage("");

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordError(
        "Please complete all password fields.",
      );

      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "The new passwords do not match.",
      );

      return;
    }

    if (newPassword.length < 12) {
      setPasswordError(
        "Your new password must be at least 12 characters.",
      );

      return;
    }

    try {
      setChangingPassword(true);

      await adminRequest(
        "/admin/auth/change-password",
        {
          method: "POST",
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        },
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setSuccessMessage(
        "Your password has been changed successfully.",
      );
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Failed to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Open create admin                                                        */
  /* ------------------------------------------------------------------------ */

  function openCreateAdmin() {
    setEditingAdmin(null);

    setAdminName("");
    setAdminEmail("");
    setAdminPassword("");
    setAdminConfirmPassword("");
    setAdminRole("ADMIN");
    setAdminFormError("");

    setShowAdminModal(true);
  }

  /* ------------------------------------------------------------------------ */
  /* Open edit admin                                                          */
  /* ------------------------------------------------------------------------ */

  function openEditAdmin(
    admin: AdminUser,
  ) {
    setEditingAdmin(admin);

    setAdminName(admin.name);
    setAdminEmail(admin.email);
    setAdminPassword("");
    setAdminConfirmPassword("");
    setAdminRole(admin.role);
    setAdminFormError("");

    setShowAdminModal(true);
  }

  /* ------------------------------------------------------------------------ */
  /* Save admin                                                               */
  /* ------------------------------------------------------------------------ */

  async function handleSaveAdmin(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setAdminFormError("");
    setSuccessMessage("");

    if (!adminName.trim()) {
      setAdminFormError(
        "Administrator name is required.",
      );

      return;
    }

    if (!adminEmail.trim()) {
      setAdminFormError(
        "Administrator email is required.",
      );

      return;
    }

    if (!editingAdmin) {
      if (!adminPassword) {
        setAdminFormError(
          "A password is required.",
        );

        return;
      }

      if (adminPassword.length < 12) {
        setAdminFormError(
          "Password must be at least 12 characters.",
        );

        return;
      }

      if (
        adminPassword !==
        adminConfirmPassword
      ) {
        setAdminFormError(
          "The passwords do not match.",
        );

        return;
      }
    }

    try {
      setSavingAdmin(true);

      if (editingAdmin) {
        await adminRequest(
          `/admin/users/${editingAdmin.id}`,
          {
            method: "PATCH",
            body: JSON.stringify({
              name: adminName.trim(),
              email: adminEmail
                .trim()
                .toLowerCase(),
              role: adminRole,
            }),
          },
        );

        setSuccessMessage(
          "Administrator details updated successfully.",
        );
      } else {
        /*
         * The backend requires both password
         * and confirmPassword when creating
         * an administrator.
         */
        await adminRequest(
          "/admin/users",
          {
            method: "POST",
            body: JSON.stringify({
              name: adminName.trim(),
              email: adminEmail
                .trim()
                .toLowerCase(),
              password: adminPassword,
              confirmPassword:
                adminConfirmPassword,
              role: adminRole,
            }),
          },
        );

        setSuccessMessage(
          "Administrator created successfully.",
        );
      }

      setShowAdminModal(false);

      await loadAdmins();
    } catch (error) {
      setAdminFormError(
        error instanceof Error
          ? error.message
          : "Failed to save administrator.",
      );
    } finally {
      setSavingAdmin(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Toggle admin status                                                      */
  /* ------------------------------------------------------------------------ */

  async function handleToggleStatus(
    admin: AdminUser,
  ) {
    setSuccessMessage("");
    setPageError("");

    try {
      setActionAdminId(admin.id);

      await adminRequest(
        `/admin/users/${admin.id}/status`,
        {
          method: "PATCH",
          body: JSON.stringify({
            isActive: !admin.isActive,
          }),
        },
      );

      setSuccessMessage(
        admin.isActive
          ? `${admin.name} has been deactivated.`
          : `${admin.name} has been reactivated.`,
      );

      setDeactivateTarget(null);

      await loadAdmins();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to update administrator status.",
      );
    } finally {
      setActionAdminId(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Reset password                                                           */
  /* ------------------------------------------------------------------------ */

  async function handleResetPassword(
    admin: AdminUser,
  ) {
    setSuccessMessage("");
    setPageError("");

    try {
      setActionAdminId(admin.id);

      const result =
        await adminRequest<{
          admin: AdminUser;
          temporaryPassword: string;
        }>(
          `/admin/users/${admin.id}/reset-password`,
          {
            method: "POST",
          },
        );

      setResetPassword({
        admin: result.admin,
        password:
          result.temporaryPassword,
      });

      setSuccessMessage(
        `A temporary password has been generated for ${admin.name}.`,
      );
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to reset administrator password.",
      );
    } finally {
      setActionAdminId(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Delete admin                                                             */
  /* ------------------------------------------------------------------------ */

  async function handleDeleteAdmin(
    admin: AdminUser,
  ) {
    setSuccessMessage("");
    setPageError("");

    try {
      setActionAdminId(admin.id);

      await adminRequest(
        `/admin/users/${admin.id}`,
        {
          method: "DELETE",
        },
      );

      setDeleteTarget(null);

      setSuccessMessage(
        `${admin.name} has been permanently deleted.`,
      );

      await loadAdmins();
    } catch (error) {
      setPageError(
        error instanceof Error
          ? error.message
          : "Failed to delete administrator.",
      );
    } finally {
      setActionAdminId(null);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Copy temporary password                                                  */
  /* ------------------------------------------------------------------------ */

  async function handleCopyPassword() {
    if (!resetPassword) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        resetPassword.password,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setCopied(false);
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Logout                                                                   */
  /* ------------------------------------------------------------------------ */

  async function handleLogout() {
    try {
      await adminRequest(
        "/admin/auth/logout",
        {
          method: "POST",
        },
      );
    } catch {
      /*
       * Logout should still succeed locally
       * if the API request fails.
       */
    } finally {
      clearAdminToken();

      window.location.replace(
        "/admin/login",
      );
    }
  }

  /* ------------------------------------------------------------------------ */
  /* Loading state                                                             */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <main className="min-h-screen bg-ivory">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-6">
          <div className="flex items-center gap-3 text-sm text-charcoal/60">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading settings…
          </div>
        </div>
      </main>
    );
  }

  /* ------------------------------------------------------------------------ */
  /* Page                                                                      */
  /* ------------------------------------------------------------------------ */

  return (
    <>
      <main className="min-h-screen bg-ivory pb-24">
        <div className="mx-auto max-w-7xl px-6 py-10 sm:px-8 lg:px-10">
          {/* ---------------------------------------------------------------- */}
          {/* Header                                                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="mb-10 max-w-3xl">
            <p className="eyebrow text-bronze">
              Administration
            </p>

            <h1 className="display-heading mt-4 text-4xl text-charcoal sm:text-5xl">
              Settings
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-7 text-charcoal/60">
              Manage your account, security, and
              administrator access from one place.
            </p>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Messages                                                          */}
          {/* ---------------------------------------------------------------- */}

          {pageError && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <X className="mt-0.5 h-4 w-4 shrink-0" />

              <span>{pageError}</span>

              <button
                type="button"
                onClick={() =>
                  setPageError("")
                }
                className="ml-auto shrink-0 text-red-500 transition hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
              <Check className="mt-0.5 h-4 w-4" />

              <span>{successMessage}</span>

              <button
                type="button"
                onClick={() =>
                  setSuccessMessage("")
                }
                className="ml-auto shrink-0 text-emerald-500 transition hover:text-emerald-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="grid gap-8">
            {/* ============================================================= */}
            {/* My Account                                                      */}
            {/* ============================================================= */}

            <section className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-[0_20px_60px_rgba(17,17,15,0.04)] sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-charcoal text-ivory">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                        My Account
                      </h2>

                      <p className="mt-1 text-sm text-charcoal/50">
                        Your administrator profile.
                      </p>
                    </div>
                  </div>
                </div>

                {currentAdmin && (
                  <div
                    className={[
                      "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium",
                      currentAdmin.role ===
                      "SUPER_ADMIN"
                        ? "bg-bronze/10 text-bronze"
                        : "bg-charcoal/5 text-charcoal/65",
                    ].join(" ")}
                  >
                    {currentAdmin.role ===
                    "SUPER_ADMIN" ? (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    ) : (
                      <Shield className="h-3.5 w-3.5" />
                    )}

                    {getRoleLabel(
                      currentAdmin.role,
                    )}
                  </div>
                )}
              </div>

              {currentAdmin && (
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                  <InfoItem
                    label="Name"
                    value={currentAdmin.name}
                  />

                  <InfoItem
                    label="Email"
                    value={currentAdmin.email}
                  />

                  <InfoItem
                    label="Role"
                    value={getRoleLabel(
                      currentAdmin.role,
                    )}
                  />

                  <InfoItem
                    label="Account status"
                    value={
                      currentAdmin.isActive
                        ? "Active"
                        : "Inactive"
                    }
                    valueClassName="text-emerald-700"
                  />
                </div>
              )}
            </section>

            {/* ============================================================= */}
            {/* Security                                                        */}
            {/* ============================================================= */}

            <section className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-[0_20px_60px_rgba(17,17,15,0.04)] sm:p-8">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bronze/10 text-bronze">
                  <LockKeyhole className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                    Security
                  </h2>

                  <p className="mt-1 text-sm text-charcoal/50">
                    Change the password used to access
                    the admin dashboard.
                  </p>
                </div>
              </div>

              <form
                onSubmit={
                  handleChangePassword
                }
                className="mt-8 max-w-2xl"
              >
                {passwordError && (
                  <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {passwordError}
                  </div>
                )}

                <div className="grid gap-5">
                  <PasswordField
                    label="Current password"
                    value={currentPassword}
                    onChange={
                      setCurrentPassword
                    }
                    autoComplete="current-password"
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <PasswordField
                      label="New password"
                      value={newPassword}
                      onChange={
                        setNewPassword
                      }
                      autoComplete="new-password"
                    />

                    <PasswordField
                      label="Confirm new password"
                      value={confirmPassword}
                      onChange={
                        setConfirmPassword
                      }
                      autoComplete="new-password"
                    />
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-charcoal/45">
                    Use at least 12 characters with
                    uppercase, lowercase, number, and
                    special characters.
                  </p>

                  <Button
                    type="submit"
                    isDisabled={
                      changingPassword
                    }
                    className="h-11 rounded-xl bg-charcoal px-5 text-ivory hover:bg-charcoal/90"
                  >
                    {changingPassword ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating…
                      </>
                    ) : (
                      <>
                        <KeyRound className="mr-2 h-4 w-4" />
                        Change password
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </section>

            {/* ============================================================= */}
            {/* Session                                                         */}
            {/* ============================================================= */}

            <section className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-[0_20px_60px_rgba(17,17,15,0.04)] sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-charcoal/5 text-charcoal">
                    <Shield className="h-5 w-5" />
                  </div>

                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                      Session
                    </h2>

                    <p className="mt-1 text-sm text-charcoal/50">
                      Sign out of this administrator
                      session.
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="h-11 rounded-xl border-charcoal/10 px-5 text-charcoal hover:bg-charcoal hover:text-ivory"
                >
                  Sign out
                </Button>
              </div>
            </section>

            {/* ============================================================= */}
            {/* Administration — Super Admin only                             */}
            {/* ============================================================= */}

            {isSuperAdmin && (
              <section className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-[0_20px_60px_rgba(17,17,15,0.04)] sm:p-8">
                <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-bronze/10 text-bronze">
                      <Users className="h-5 w-5" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold tracking-tight text-charcoal">
                        Administration
                      </h2>

                      <p className="mt-1 max-w-xl text-sm leading-6 text-charcoal/50">
                        Manage administrators who have
                        access to the ministry dashboard.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={
                      openCreateAdmin
                    }
                    className="h-11 rounded-xl bg-charcoal px-5 text-ivory hover:bg-charcoal/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create administrator
                  </Button>
                </div>

                {/* Stats */}
                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  <StatCard
                    label="Total administrators"
                    value={admins.length}
                  />

                  <StatCard
                    label="Active accounts"
                    value={
                      activeAdminCount
                    }
                  />

                  <StatCard
                    label="Super administrators"
                    value={
                      superAdminCount
                    }
                  />
                </div>

                {/* Admin list */}
                <div className="mt-8 overflow-hidden rounded-2xl border border-charcoal/10">
                  {adminsLoading ? (
                    <div className="flex items-center justify-center gap-3 px-6 py-12 text-sm text-charcoal/50">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Loading administrators…
                    </div>
                  ) : admins.length === 0 ? (
                    <div className="px-6 py-12 text-center">
                      <Users className="mx-auto h-8 w-8 text-charcoal/20" />

                      <p className="mt-3 text-sm text-charcoal/50">
                        No administrators found.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Desktop header */}
                      <div className="hidden border-b border-charcoal/10 bg-charcoal/[0.025] px-5 py-3 text-xs font-medium uppercase tracking-[0.12em] text-charcoal/40 md:grid md:grid-cols-[minmax(0,1fr)_150px_110px_48px] md:gap-4">
                        <span>
                          Administrator
                        </span>

                        <span>Role</span>

                        <span>Status</span>

                        <span />
                      </div>

                      <div className="divide-y divide-charcoal/10">
                        {admins.map(
                          (admin) => (
                            <AdminRow
                              key={admin.id}
                              admin={admin}
                              currentAdmin={
                                currentAdmin
                              }
                              loading={
                                actionAdminId ===
                                admin.id
                              }
                              onEdit={() =>
                                openEditAdmin(
                                  admin,
                                )
                              }
                              onReset={() =>
                                handleResetPassword(
                                  admin,
                                )
                              }
                              onToggle={() =>
                                admin.isActive
                                  ? setDeactivateTarget(
                                      admin,
                                    )
                                  : handleToggleStatus(
                                      admin,
                                    )
                              }
                              onDelete={() =>
                                setDeleteTarget(
                                  admin,
                                )
                              }
                            />
                          ),
                        )}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      {/* ==================================================================== */}
      {/* Create/Edit Administrator Modal                                      */}
      {/* ==================================================================== */}

      {showAdminModal && (
        <Modal
          title={
            editingAdmin
              ? "Edit administrator"
              : "Create administrator"
          }
          description={
            editingAdmin
              ? "Update this administrator's account details and role."
              : "Create a new account with access to the admin dashboard."
          }
          onClose={() =>
            setShowAdminModal(false)
          }
        >
          <form
            onSubmit={handleSaveAdmin}
            className="space-y-5"
          >
            {adminFormError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {adminFormError}
              </div>
            )}

            <Field
              label="Full name"
              value={adminName}
              onChange={setAdminName}
              placeholder="Enter administrator name"
            />

            <Field
              label="Email address"
              type="email"
              value={adminEmail}
              onChange={setAdminEmail}
              placeholder="admin@example.com"
            />

            {!editingAdmin && (
              <>
                <PasswordField
                  label="Password"
                  value={adminPassword}
                  onChange={
                    setAdminPassword
                  }
                  autoComplete="new-password"
                />

                <PasswordField
                  label="Confirm password"
                  value={
                    adminConfirmPassword
                  }
                  onChange={
                    setAdminConfirmPassword
                  }
                  autoComplete="new-password"
                />
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-medium text-charcoal">
                Role
              </label>

              <div className="relative">
                <select
                  value={adminRole}
                  onChange={(event) =>
                    setAdminRole(
                      event.target
                        .value as AdminRole,
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-charcoal/10 bg-ivory/40 px-4 pr-10 text-sm text-charcoal outline-none transition focus:border-bronze focus:ring-2 focus:ring-bronze/10"
                >
                  <option value="ADMIN">
                    Administrator
                  </option>

                  <option value="SUPER_ADMIN">
                    Super Admin
                  </option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/40" />
              </div>

              <p className="mt-2 text-xs leading-5 text-charcoal/40">
                Super administrators can create,
                edit, deactivate, reset, and delete
                administrator accounts.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setShowAdminModal(false)
                }
                className="h-11 rounded-xl border-charcoal/10"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                isDisabled={savingAdmin}
                className="h-11 rounded-xl bg-charcoal px-5 text-ivory hover:bg-charcoal/90"
              >
                {savingAdmin ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : editingAdmin ? (
                  "Save changes"
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Create administrator
                  </>
                )}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* ==================================================================== */}
      {/* Temporary Password Modal                                             */}
      {/* ==================================================================== */}

      {resetPassword && (
        <Modal
          title="Temporary password"
          description={`A new temporary password has been generated for ${resetPassword.admin.name}.`}
          onClose={() => {
            setResetPassword(null);
            setCopied(false);
          }}
        >
          <div className="rounded-2xl border border-bronze/20 bg-bronze/[0.05] p-5">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-bronze">
              Temporary password
            </p>

            <div className="mt-3 flex items-center gap-2">
              <code className="min-w-0 flex-1 break-all rounded-xl border border-charcoal/10 bg-white px-4 py-3 font-mono text-sm text-charcoal">
                {resetPassword.password}
              </code>

              <Button
                type="button"
                variant="outline"
                onClick={
                  handleCopyPassword
                }
                className="h-11 shrink-0 rounded-xl border-charcoal/10 px-3"
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            <p className="mt-4 text-xs leading-5 text-charcoal/50">
              This password is shown only once. Give
              it securely to the administrator and ask
              them to change it after signing in.
            </p>
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              type="button"
              onClick={() => {
                setResetPassword(null);
                setCopied(false);
              }}
              className="h-11 rounded-xl bg-charcoal px-5 text-ivory hover:bg-charcoal/90"
            >
              Done
            </Button>
          </div>
        </Modal>
      )}

      {/* ==================================================================== */}
      {/* Deactivate Confirmation                                              */}
      {/* ==================================================================== */}

      {deactivateTarget && (
        <ConfirmModal
          title="Deactivate administrator?"
          description={`"${deactivateTarget.name}" will no longer be able to access the admin dashboard. Their account and data will remain intact.`}
          confirmLabel="Deactivate"
          danger
          loading={
            actionAdminId ===
            deactivateTarget.id
          }
          onClose={() =>
            setDeactivateTarget(null)
          }
          onConfirm={() =>
            handleToggleStatus(
              deactivateTarget,
            )
          }
        />
      )}

      {/* ==================================================================== */}
      {/* Delete Confirmation                                                  */}
      {/* ==================================================================== */}

      {deleteTarget && (
        <ConfirmModal
          title="Delete administrator?"
          description={`"${deleteTarget.name}" will be permanently removed. This action cannot be undone.`}
          confirmLabel="Delete administrator"
          danger
          loading={
            actionAdminId ===
            deleteTarget.id
          }
          onClose={() =>
            setDeleteTarget(null)
          }
          onConfirm={() =>
            handleDeleteAdmin(
              deleteTarget,
            )
          }
        />
      )}
    </>
  );
}

/* ========================================================================== */
/* Info Item                                                                  */
/* ========================================================================== */

function InfoItem({
  label,
  value,
  valueClassName = "",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal/35">
        {label}
      </p>

      <p
        className={[
          "mt-2 break-words text-sm font-medium text-charcoal",
          valueClassName,
        ].join(" ")}
      >
        {value}
      </p>
    </div>
  );
}

/* ========================================================================== */
/* Stat Card                                                                  */
/* ========================================================================== */

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-ivory/35 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-[0.1em] text-charcoal/35">
        {label}
      </p>

      <p className="mt-2 text-2xl font-semibold tracking-tight text-charcoal">
        {value}
      </p>
    </div>
  );
}

/* ========================================================================== */
/* Admin Row                                                                  */
/* ========================================================================== */

function AdminRow({
  admin,
  currentAdmin,
  loading,
  onEdit,
  onReset,
  onToggle,
  onDelete,
}: {
  admin: AdminUser;
  currentAdmin: AdminUser | null;
  loading: boolean;
  onEdit: () => void;
  onReset: () => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] =
    useState(false);

  const isCurrent =
    currentAdmin?.id === admin.id;

  return (
    <div className="relative px-5 py-5">
      <div className="grid items-center gap-4 md:grid-cols-[minmax(0,1fr)_150px_110px_48px]">
        {/* Administrator */}
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={[
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
              admin.role === "SUPER_ADMIN"
                ? "bg-bronze/10 text-bronze"
                : "bg-charcoal/5 text-charcoal/60",
            ].join(" ")}
          >
            {getInitials(admin.name)}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate text-sm font-semibold text-charcoal">
                {admin.name}
              </p>

              {isCurrent && (
                <span className="rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.08em] text-charcoal/45">
                  You
                </span>
              )}
            </div>

            <p className="truncate text-xs text-charcoal/45">
              {admin.email}
            </p>
          </div>
        </div>

        {/* Role */}
        <div>
          <span
            className={[
              "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-medium",
              admin.role === "SUPER_ADMIN"
                ? "bg-bronze/10 text-bronze"
                : "bg-charcoal/5 text-charcoal/55",
            ].join(" ")}
          >
            {getRoleLabel(admin.role)}
          </span>
        </div>

        {/* Status */}
        <div>
          <span
            className={[
              "inline-flex items-center gap-1.5 text-xs font-medium",
              admin.isActive
                ? "text-emerald-700"
                : "text-charcoal/35",
            ].join(" ")}
          >
            <span
              className={[
                "h-1.5 w-1.5 rounded-full",
                admin.isActive
                  ? "bg-emerald-500"
                  : "bg-charcoal/20",
              ].join(" ")}
            />

            {admin.isActive
              ? "Active"
              : "Inactive"}
          </span>
        </div>

        {/* Actions */}
        <div className="relative flex justify-end">
          <Button
            type="button"
            variant="ghost"
            isDisabled={loading}
            onClick={() =>
              setOpen((value) => !value)
            }
            className="h-9 w-9 rounded-lg p-0 text-charcoal/45 hover:bg-charcoal/5 hover:text-charcoal"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>

          {open && (
            <>
              <button
                type="button"
                aria-label="Close actions"
                className="fixed inset-0 z-20 cursor-default"
                onClick={() =>
                  setOpen(false)
                }
              />

              <div className="absolute right-0 top-11 z-30 w-52 overflow-hidden rounded-2xl border border-charcoal/10 bg-white p-1.5 shadow-[0_18px_50px_rgba(17,17,15,0.14)]">
                <ActionButton
                  icon={UserRound}
                  label="Edit administrator"
                  onClick={() => {
                    setOpen(false);
                    onEdit();
                  }}
                />

                <ActionButton
                  icon={KeyRound}
                  label="Reset password"
                  onClick={() => {
                    setOpen(false);
                    onReset();
                  }}
                />

                <ActionButton
                  icon={
                    admin.isActive
                      ? UserRoundX
                      : UserRoundCheck
                  }
                  label={
                    admin.isActive
                      ? "Deactivate"
                      : "Reactivate"
                  }
                  onClick={() => {
                    setOpen(false);
                    onToggle();
                  }}
                />

                {!isCurrent && (
                  <ActionButton
                    icon={Trash2}
                    label="Delete administrator"
                    danger
                    onClick={() => {
                      setOpen(false);
                      onDelete();
                    }}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile metadata */}
      <div className="mt-4 flex items-center gap-4 pl-[52px] md:hidden">
        <span className="text-[11px] text-charcoal/35">
          Added {formatDate(admin.createdAt)}
        </span>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Action Button                                                              */
/* ========================================================================== */

function ActionButton({
  icon: Icon,
  label,
  onClick,
  danger = false,
}: {
  icon: typeof UserRound;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
        danger
          ? "text-red-600 hover:bg-red-50"
          : "text-charcoal/70 hover:bg-charcoal/5 hover:text-charcoal",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {label}
    </button>
  );
}

/* ========================================================================== */
/* Field                                                                      */
/* ========================================================================== */

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-charcoal">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        className="h-11 w-full rounded-xl border border-charcoal/10 bg-ivory/40 px-4 text-sm text-charcoal outline-none transition placeholder:text-charcoal/25 focus:border-bronze focus:ring-2 focus:ring-bronze/10"
      />
    </div>
  );
}

/* ========================================================================== */
/* Password Field                                                             */
/* ========================================================================== */

function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-charcoal">
        {label}
      </label>

      <input
        type="password"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        autoComplete={autoComplete}
        placeholder="••••••••••••"
        className="h-11 w-full rounded-xl border border-charcoal/10 bg-ivory/40 px-4 text-sm text-charcoal outline-none transition placeholder:text-charcoal/25 focus:border-bronze focus:ring-2 focus:ring-bronze/10"
      />
    </div>
  );
}

/* ========================================================================== */
/* Modal                                                                      */
/* ========================================================================== */

function Modal({
  title,
  description,
  children,
  onClose,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/45 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl border border-charcoal/10 bg-white p-6 shadow-[0_30px_100px_rgba(17,17,15,0.22)] sm:p-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-charcoal">
              {title}
            </h2>

            {description && (
              <p className="mt-2 text-sm leading-6 text-charcoal/50">
                {description}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-charcoal/40 transition hover:bg-charcoal/5 hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-7">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================== */
/* Confirm Modal                                                              */
/* ========================================================================== */

function ConfirmModal({
  title,
  description,
  confirmLabel,
  loading,
  danger = false,
  onClose,
  onConfirm,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  loading: boolean;
  danger?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-charcoal/45 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!loading) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-charcoal/10 bg-white p-6 shadow-[0_30px_100px_rgba(17,17,15,0.22)] sm:p-7">
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-2xl",
            danger
              ? "bg-red-50 text-red-600"
              : "bg-charcoal/5 text-charcoal",
          ].join(" ")}
        >
          <Trash2 className="h-5 w-5" />
        </div>

        <h2 className="mt-5 text-xl font-semibold tracking-tight text-charcoal">
          {title}
        </h2>

        <p className="mt-2 text-sm leading-6 text-charcoal/55">
          {description}
        </p>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            isDisabled={loading}
            onClick={onClose}
            className="h-11 rounded-xl border-charcoal/10"
          >
            Cancel
          </Button>

          <Button
            type="button"
            isDisabled={loading}
            onClick={onConfirm}
            className={[
              "h-11 rounded-xl px-5 text-white",
              danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-charcoal hover:bg-charcoal/90",
            ].join(" ")}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing…
              </>
            ) : (
              confirmLabel
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}