import { NextResponse } from "next/server";
import { backendFetch, readJsonSafe } from "@/lib/backend";

export async function POST(request: Request) {
  const body = await request.text();
  const response = await backendFetch("/api/auth/register", {
    method: "POST",
    body
  });

  const data = await readJsonSafe(response);

  if (!response.ok) {
    return NextResponse.json(data ?? { message: "Falha no cadastro" }, { status: response.status });
  }

  const nextResponse = NextResponse.json(data, { status: response.status });
  nextResponse.cookies.set("access_token", data.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 24
  });

  return nextResponse;
}
