import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/app/lib/auth";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  const payload = verifyToken(session);

  if (payload) {
    return NextResponse.json({ loggedIn: true, username: payload.username });
  }

  return NextResponse.json({ loggedIn: false });
}
