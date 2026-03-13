import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  return (
    <main className="page-shell">
      <div className="page-grid auth-grid">
        <section className="hero">
          <div className="top-nav">
            <strong>Pedidos Web</strong>
            <Link className="btn btn-ghost" href="/register">Criar conta</Link>
          </div>
          <h1>Entre no painel de pedidos</h1>
          <p>
            Esta tela chama a rota interna `/api/auth/login`, que por sua vez chama o gateway do backend.
            O token retornado vira um cookie HTTP-only, mais seguro do que guardar JWT em localStorage.
          </p>
        </section>

        <section className="card">
          <h2>Login</h2>
          <AuthForm mode="login" />
          <p className="inline-note">
            Ainda nao tem conta? <Link href="/register">Crie uma agora</Link>.
          </p>
        </section>
      </div>
    </main>
  );
}
