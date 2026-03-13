import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard-client";
import type { Order, UserProfile } from "@/lib/types";

const BACKEND_URL = process.env.BACKEND_GATEWAY_URL ?? "http://localhost:8080";

async function fetchBackend(path: string, token: string) {
  return fetch(`${BACKEND_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`
    },
    cache: "no-store"
  });
}

export default async function DashboardPage() {
  const token = (await cookies()).get("access_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const meResponse = await fetchBackend("/api/auth/me", token);

  if (!meResponse.ok) {
    redirect("/login");
  }

  const user = (await meResponse.json()) as UserProfile;
  const ordersResponse = await fetchBackend("/api/orders", token);
  const orders = ordersResponse.ok ? ((await ordersResponse.json()) as Order[]) : [];

  return <DashboardClient user={user} initialOrders={orders} />;
}