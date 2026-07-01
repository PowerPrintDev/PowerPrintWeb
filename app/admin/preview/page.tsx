import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/app/lib/auth";
import PreviewClient from "./PreviewClient";

export const dynamic = "force-dynamic";

export default async function PreviewPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const payload = verifyToken(session);

  if (!payload) {
    redirect("/admin/login");
  }

  return <PreviewClient />;
}
