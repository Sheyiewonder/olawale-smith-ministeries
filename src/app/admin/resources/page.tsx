import { redirect } from "next/navigation";

export default function LegacyResourcesPage() {
  redirect("/admin/dashboard/resources");
}