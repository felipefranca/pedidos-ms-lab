const BACKEND_URL = process.env.BACKEND_GATEWAY_URL ?? "http://localhost:8080";

export async function backendFetch(path: string, init?: RequestInit) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  return response;
}

export async function readJsonSafe(response: Response) {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}
