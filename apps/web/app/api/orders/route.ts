import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch, readJsonSafe } from "@/lib/backend";

async function authHeader(): Promise<Record<string, string>> {
  const token = (await cookies()).get("access_token")?.value;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
  const response = await backendFetch("/api/orders", {
    headers: await authHeader()
  });

  const data = await readJsonSafe(response);
  return NextResponse.json(data, { status: response.status });
}

export async function POST(request: Request) {
  const body = await request.text();
  const response = await backendFetch("/api/orders", {
    method: "POST",
    headers: await authHeader(),
    body
  });

  const data = await readJsonSafe(response);
  return NextResponse.json(data, { status: response.status });
}