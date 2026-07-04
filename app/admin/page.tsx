import { getContent } from "@/app/lib/content";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/app/lib/auth";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const payload = verifyToken(session);

  if (!payload) {
    redirect("/admin/login");
  }

  const content = await getContent();

  return <AdminPanel initialContent={content} />;
}
