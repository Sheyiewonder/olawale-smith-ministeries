// "use client";

// import Link from "next/link";
// import { usePathname, useRouter } from "next/navigation";
// import {
//   LayoutDashboard,
//   Library,
//   FolderOpen,
//   LogOut,
//   Menu,
//   X,
// } from "lucide-react";
// import { useState } from "react";

// import { clearAdminToken } from "@/lib/admin-api";

// const navigation = [
//   {
//     label: "Dashboard",
//     href: "/admin/dashboard",
//     icon: LayoutDashboard,
//   },
//   {
//     label: "Resources",
//     href: "/admin/dashboard/resources",
//     icon: Library,
//   },
//   {
//     label: "Categories",
//     href: "/admin/dashboard/categories",
//     icon: FolderOpen,
//   },
// ];

// export default function AdminSidebar() {
//   const pathname = usePathname();
//   const router = useRouter();

//   const [open, setOpen] = useState(false);

//   function handleLogout() {
//     clearAdminToken();
//     router.push("/admin/login");
//   }

//   function isActive(href: string) {
//     if (href === "/admin/dashboard") {
//       return pathname === href;
//     }

//     return (
//       pathname === href ||
//       pathname.startsWith(`${href}/`)
//     );
//   }

//   return (
//     <>
//       {/* ------------------------------------------------------------------ */}
//       {/* Mobile Header                                                      */}
//       {/* ------------------------------------------------------------------ */}

//       <div className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-charcoal/10 bg-white px-5 lg:hidden">
//         <Link
//           href="/admin/dashboard"
//           className="display-heading text-lg"
//         >
//           Olawale Smith
//         </Link>

//         <button
//           type="button"
//           onClick={() => setOpen(true)}
//           className="flex h-10 w-10 items-center justify-center border border-charcoal/10 text-charcoal transition-colors hover:border-bronze hover:text-bronze"
//           aria-label="Open admin menu"
//         >
//           <Menu size={20} />
//         </button>
//       </div>

//       {/* ------------------------------------------------------------------ */}
//       {/* Mobile Overlay                                                     */}
//       {/* ------------------------------------------------------------------ */}

//       {open && (
//         <button
//           type="button"
//           aria-label="Close admin menu"
//           onClick={() => setOpen(false)}
//           className="fixed inset-0 z-40 bg-charcoal/30 lg:hidden"
//         />
//       )}

//       {/* ------------------------------------------------------------------ */}
//       {/* Sidebar                                                             */}
//       {/* ------------------------------------------------------------------ */}

//       <aside
//         className={[
//           "fixed left-0 top-0 z-50 flex h-screen w-[280px] flex-col",
//           "border-r border-charcoal/10 bg-white",
//           "transition-transform duration-300",
//           open
//             ? "translate-x-0"
//             : "-translate-x-full lg:translate-x-0",
//         ].join(" ")}
//       >
//         {/* Brand */}

//         <div className="flex h-20 items-center justify-between border-b border-charcoal/10 px-7">
//           <Link
//             href="/admin/dashboard"
//             onClick={() => setOpen(false)}
//           >
//             <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-bronze">
//               Olawale Smith Ministries
//             </p>

//             <p className="display-heading mt-1 text-xl">
//               Admin
//             </p>
//           </Link>

//           <button
//             type="button"
//             onClick={() => setOpen(false)}
//             className="flex h-9 w-9 items-center justify-center text-charcoal/40 hover:text-charcoal lg:hidden"
//             aria-label="Close admin menu"
//           >
//             <X size={19} />
//           </button>
//         </div>

//         {/* Navigation */}

//         <nav className="flex-1 px-4 py-7">
//           <p className="px-3 text-[9px] font-semibold uppercase tracking-[0.18em] text-charcoal/30">
//             Management
//           </p>

//           <div className="mt-4 space-y-1">
//             {navigation.map((item) => {
//               const Icon = item.icon;
//               const active = isActive(item.href);

//               return (
//                 <Link
//                   key={item.href}
//                   href={item.href}
//                   onClick={() => setOpen(false)}
//                   className={[
//                     "flex items-center gap-3 px-3 py-3",
//                     "text-xs font-medium",
//                     "transition-all duration-200",
//                     active
//                       ? "bg-charcoal text-ivory"
//                       : "text-charcoal/55 hover:bg-charcoal/5 hover:text-charcoal",
//                   ].join(" ")}
//                 >
//                   <Icon
//                     size={16}
//                     strokeWidth={1.6}
//                   />

//                   <span>{item.label}</span>
//                 </Link>
//               );
//             })}
//           </div>
//         </nav>

//         {/* Bottom */}

//         <div className="border-t border-charcoal/10 p-4">
//           <button
//             type="button"
//             onClick={handleLogout}
//             className="flex w-full items-center gap-3 px-3 py-3 text-xs font-medium text-charcoal/50 transition-colors hover:bg-red-500/5 hover:text-red-500"
//           >
//             <LogOut
//               size={16}
//               strokeWidth={1.6}
//             />

//             Sign out
//           </button>
//         </div>
//       </aside>
//     </>
//   );
// }