"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type Props = {
  mode: "login" | "register";
};

export function AuthForm({ mode }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? "")
    };

    const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/register";
    const body = mode === "login"
      ? JSON.stringify({ email: payload.email, password: payload.password })
      : JSON.stringify(payload);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(typeof data === "string" ? data : "Nao foi possivel autenticar.");
      setLoading(false);
      return;
    }

    if (mode === "register") {
      setMessage("Conta criada com sucesso. Voce ja esta autenticado.");
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <form className="form-stack" onSubmit={handleSubmit}>
      {mode === "register" ? (
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" placeholder="Seu nome" required />
        </div>
      ) : null}

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" placeholder="voce@exemplo.com" required />
      </div>

      <div className="field">
        <label htmlFor="password">Senha</label>
        <input id="password" name="password" type="password" placeholder="123456" required minLength={6} />
      </div>

      {error ? <div className="notice notice-error">{error}</div> : null}
      {message ? <div className="notice notice-success">{message}</div> : null}

      <button className="btn btn-primary" type="submit" disabled={loading}>
        {loading ? "Processando..." : mode === "login" ? "Entrar" : "Criar conta"}
      </button>
    </form>
  );
}
