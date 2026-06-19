import crypto from "crypto";

const SECRET_KEY = process.env.SESSION_SECRET || "default-fallback-super-secret-key-powerprint-2026";

export interface SessionPayload {
  username: string;
  expires: number;
}

/**
 * Signs a payload to create a secure JWT token.
 */
export function signToken(payload: SessionPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

/**
 * Verifies a token and returns the payload if valid, otherwise null.
 */
export function verifyToken(token: string | undefined): SessionPayload | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [header, body, signature] = parts;
    
    const expectedSignature = crypto
      .createHmac("sha256", SECRET_KEY)
      .update(`${header}.${body}`)
      .digest("base64url");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payload = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as SessionPayload;
    if (Date.now() > payload.expires) {
      return null;
    }
    return payload;
  } catch (e) {
    return null;
  }
}
