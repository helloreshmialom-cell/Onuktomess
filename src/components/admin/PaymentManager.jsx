import { useState } from "react";
import { useApp } from "../../App";

export default function PaymentManager() {
  const { data, updateData } = useApp();
  const [filter, setFilter] = useState("pending");

  const transactions = data.transactions.filter(t => t.type === "deposit" && (filter === "all" || t.status === filter));

  function approve(txId) {
    const tx = data.transactions.find(t => t.id === txId);
    if (!tx) return;
    const updTx = data.transactions.map(t => t.id === txId ? { ...t, status: "approved" } : t);
    const updMembers = data.members.map(m => {
      if (m.id !== tx.memberId) return m;
      const newBalance = m.balance + tx.amount;
      const mealActive = newBalance >= data.settings.depositRequired || m.mealActive;
      return { ...m, balance: newBalance, mealActive };
    });
    updateData({ ...data, transactions: updTx, members: updMembers });
  }

  function reject(txId) {
    updateData({ ...data, transactions: data.transactions.map(t => t.id === txId ? { ...t, status: "rejected" } : t) });
  }

  const pendingCount = data.transactions.filter(t => t.type === "deposit" && t.status === "pending").length;

  const btnStyle = (active) => ({
    padding: "6px 14px", borderRadius: 8, border: `1px solid ${active ? "#3b82f6" : "#334155"}`,
    background: active ? "rgba(59,130,246,0.15)" : "transparent",
    color: active ? "#60a5fa" : "#94a3b8", fontSize: 12, cursor: "pointer"
  });

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: "1rem" }}>
        {[["pending", `Pending (${pendingCount})`], ["approved", "Approved"], ["rejected", "Rejected"], ["all", "সব"]].map(([v, l]) => (
          <button key={v} style={btnStyle(filter === v)} onClick={() => setFilter(v)}>{l}</button>
        ))}
      </div>

      {transactions.length === 0 && (
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "2rem", textAlign: "center", border: "1px solid #334155" }}>
          <p style={{ color: "#475569", fontSize: 14 }}>কোনো পেমেন্ট request নেই</p>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {transactions.map(tx => {
          const member = data.members.find(m => m.id === tx.memberId);
          return (
            <div key={tx.id} style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>{member?.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{tx.date} · TxID: {tx.txId}</p>
                  <p style={{ margin: "4px 0 0", fontSize: 13, color: "#94a3b8" }}>{tx.note}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "#10b981" }}>৳{tx.amount.toLocaleString()}</p>
                  <span style={{
                    fontSize: 11, padding: "3px 8px", borderRadius: 6,
                    background: tx.status === "pending" ? "rgba(245,158,11,0.15)" : tx.status === "approved" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)",
                    color: tx.status === "pending" ? "#f59e0b" : tx.status === "approved" ? "#10b981" : "#ef4444"
                  }}>{tx.status === "pending" ? "Pending" : tx.status === "approved" ? "Approved" : "Rejected"}</span>
                </div>
              </div>
              {tx.status === "pending" && (
                <div style={{ display: "flex", gap: 8, marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #334155" }}>
                  <button onClick={() => approve(tx.id)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>✓ Approve</button>
                  <button onClick={() => reject(tx.id)} style={{ flex: 1, padding: "8px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#ef4444", fontSize: 13, cursor: "pointer" }}>✗ Reject</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
