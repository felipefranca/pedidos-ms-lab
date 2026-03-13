import Link from "next/link";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  return (
    <main className="page-shell">
      <div className="page-grid auth-grid">
        <section className="hero">
          <div className="top-nav">
            <strong>Pedidos Web</strong>
            <Link className="btn btn-ghost" href="/login">Ja tenho conta</Link>
          </div>
          <h1>Crie sua conta para testar o sistema</h1>
          <p>
            O cadastro gera um usuario no `auth-service`, devolve um JWT e o Next guarda esse token em cookie.
            Assim voce ja cai autenticado no painel para estudar a integracao completa.
          </p>
        </section>

        <section className="card">
          <h2>Cadastro</h2>
          <AuthForm mode="register" />
        </section>
      </div>
    </main>
  );
}
