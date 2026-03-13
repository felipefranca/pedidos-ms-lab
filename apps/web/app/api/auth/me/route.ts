import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch, readJsonSafe } from "@/lib/backend";

export async function GET() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    return NextResponse.json({ message: "Nao autenticado" }, { status: 401 });
  }

  const response = await backendFetch("/api/auth/me", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await readJsonSafe(response);
  return NextResponse.json(data, { status: response.status });
}
