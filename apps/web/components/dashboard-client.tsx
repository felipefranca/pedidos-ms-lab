"use client";

import { useState, useTransition } from "react";
import type { Order, OrderStatus, UserProfile } from "@/lib/types";
import { LogoutButton } from "@/components/logout-button";

const statusOptions: OrderStatus[] = ["CREATED", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"];

type Props = {
  user: UserProfile;
  initialOrders: Order[];
};

export function DashboardClient({ user, initialOrders }: Props) {
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalAmount = orders.reduce((sum, order) => sum + Number(order.amount), 0);

  async function refreshOrders() {
    const response = await fetch("/api/orders", { cache: "no-store" });
    const data = await response.json();
    setOrders(data);
  }

  async function handleCreateOrder(formData: FormData) {
    setError(null);
    setSuccess(null);

    const payload = {
      itemName: String(formData.get("itemName") ?? ""),
      amount: Number(formData.get("amount") ?? 0)
    };

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      setError("Nao foi possivel criar o pedido.");
      return;
    }

    setSuccess("Pedido criado com sucesso.");
    await refreshOrders();
  }

  async function handleUpdateStatus(orderId: number, status: OrderStatus) {
    setError(null);
    setSuccess(null);

    const response = await fetch(`/api/orders/${orderId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      setError("Nao foi possivel atualizar o status.");
      return;
    }

    setSuccess(`Status do pedido #${orderId} atualizado para ${status}.`);
    await refreshOrders();
  }

  return (
    <main className="page-shell">
      <div className="page-grid">
        <section className="hero">
          <div className="top-nav">
            <div>
              <strong>Painel de pedidos</strong>
              <h1>Bem-vindo, {user.name}</h1>
              <p>
                Aqui voce ve o fluxo completo do frontend: autenticacao, leitura do usuario atual,
                criacao de pedidos e atualizacao de status usando o gateway por tras das rotas do Next.
              </p>
            </div>
            <LogoutButton />
          </div>
        </section>

        <section className="kpis">
          <article className="kpi">
            <span>Total de pedidos</span>
            <strong>{orders.length}</strong>
          </article>
          <article className="kpi">
            <span>Volume total</span>
            <strong>R$ {totalAmount.toFixed(2)}</strong>
          </article>
          <article className="kpi">
            <span>Ultimo papel</span>
            <strong>{user.role}</strong>
          </article>
        </section>

        <section className="dashboard-grid">
          <article className="card">
            <h2>Criar pedido</h2>
            <form
              className="form-stack"
              action={(formData) => startTransition(() => { void handleCreateOrder(formData); })}
            >
              <div className="field">
                <label htmlFor="itemName">Item</label>
                <input id="itemName" name="itemName" placeholder="Notebook, mouse, teclado..." required />
              </div>
              <div className="field">
                <label htmlFor="amount">Valor</label>
                <input id="amount" name="amount" type="number" step="0.01" min="0.01" required />
              </div>
              <button className="btn btn-primary" disabled={isPending} type="submit">
                {isPending ? "Salvando..." : "Criar pedido"}
              </button>
            </form>

            <div className="help-text" style={{ marginTop: 18 }}>
              O token nao fica no navegador em localStorage. Ele fica em cookie HTTP-only e o Next usa
              rotas internas para conversar com o backend.
            </div>
          </article>

          <article className="card">
            <h2>Pedidos do usuario</h2>
            {error ? <div className="notice notice-error">{error}</div> : null}
            {success ? <div className="notice notice-success">{success}</div> : null}

            <div className="order-list" style={{ marginTop: 16 }}>
              {orders.length === 0 ? (
                <p className="inline-note">Nenhum pedido ainda. Crie o primeiro ao lado.</p>
              ) : (
                orders.map((order) => (
                  <div className="order-item" key={order.id}>
                    <div className="order-top">
                      <div>
                        <h3>#{order.id} - {order.itemName}</h3>
                        <div className="order-meta">
                          Cliente: {order.customerName} | Valor: R$ {Number(order.amount).toFixed(2)}
                        </div>
                        <div className="order-meta">
                          Criado em: {new Date(order.createdAt).toLocaleString("pt-BR")}
                        </div>
                      </div>
                      <span className="status-chip">{order.status}</span>
                    </div>

                    <div className="actions" style={{ marginTop: 14 }}>
                      {statusOptions.map((status) => (
                        <button
                          key={status}
                          className={status === order.status ? "btn btn-primary" : "btn btn-secondary"}
                          type="button"
                          onClick={() => void handleUpdateStatus(order.id, status)}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
