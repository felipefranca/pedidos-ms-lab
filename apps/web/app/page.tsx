import Link from "next/link";

export default function HomePage() {
  return (
    <main className="page-shell">
      <div className="page-grid">
        <section className="hero">
          <div className="top-nav">
            <strong>Pedidos Web</strong>
            <div className="top-links">
              <Link className="btn btn-ghost" href="/login">Entrar</Link>
              <Link className="btn btn-ghost" href="/register">Criar conta</Link>
            </div>
          </div>
          <h1>Um frontend moderno para estudar pedidos, JWT e microservicos</h1>
          <p>
            Este app em Next.js conversa com o gateway do backend e usa rotas internas como uma camada BFF.
            Assim voce aprende frontend React, integracao com APIs, cookies seguros e organizacao de monorepo.
          </p>
        </section>

        <section className="dashboard-grid">
          <article className="card">
            <h2>O que este frontend ensina</h2>
            <div className="form-stack help-text">
              <p>App Router do Next.js com paginas e rotas internas.</p>
              <p>BFF simples: o navegador chama o proprio Next, e o Next chama o gateway.</p>
              <p>Cookie HTTP-only para guardar o token sem usar localStorage.</p>
              <p>Fluxo completo de cadastro, login, criacao e atualizacao de pedidos.</p>
            </div>
          </article>

          <article className="card">
            <h2>Fluxo de navegacao</h2>
            <div className="kpis">
              <div className="kpi">
                <span>1</span>
                <strong>Cadastro</strong>
              </div>
              <div className="kpi">
                <span>2</span>
                <strong>Login</strong>
              </div>
              <div className="kpi">
                <span>3</span>
                <strong>Painel</strong>
              </div>
              <div className="kpi">
                <span>4</span>
                <strong>Pedidos</strong>
              </div>
            </div>
            <div className="actions" style={{ marginTop: 20 }}>
              <Link className="btn btn-primary" href="/register">Comecar estudando</Link>
              <Link className="btn btn-secondary" href="/dashboard">Abrir painel</Link>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
