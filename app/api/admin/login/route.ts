import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { signToken } from "@/app/lib/auth";

const ADMIN_USER = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASS = process.env.ADMIN_PASSWORD || "powerprint2026";

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const expires = Date.now() + 1000 * 60 * 60 * 24; // 24 hours
      const token = signToken({ username, expires });

      const cookieStore = await cookies();
      cookieStore.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        expires: new Date(expires),
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Credenciales inválidas" },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Ocurrió un error en el servidor" },
      { status: 500 }
    );
  }
}
