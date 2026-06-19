import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/app/lib/auth";
import fs from "fs/promises";
import path from "path";
import AdminPanel from "./AdminPanel";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const payload = verifyToken(session);

  if (!payload) {
    redirect("/admin/login");
  }

  let content = null;
  try {
    const filePath = path.join(process.cwd(), "data", "content.json");
    const fileContent = await fs.readFile(filePath, "utf8");
    content = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error loading content for admin panel:", error);
  }

  return <AdminPanel initialContent={content} />;
}
