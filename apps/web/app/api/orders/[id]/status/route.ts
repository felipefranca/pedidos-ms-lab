import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { backendFetch, readJsonSafe } from "@/lib/backend";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const token = (await cookies()).get("access_token")?.value;
  const body = await request.text();

  const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await backendFetch(`/api/orders/${id}/status`, {
    method: "PATCH",
    headers,
    body
  });

  const data = await readJsonSafe(response);
  return NextResponse.json(data, { status: response.status });
}