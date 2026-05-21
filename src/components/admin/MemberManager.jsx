import { useState } from "react";
import { useApp } from "../../App";

export default function MemberManager() {
  const { data, updateData } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", username: "", password: "1234", phone: "", room: "", foodPref: "normal", allergies: "" });
  const [addBalance, setAddBalance] = useState({});
  const [search, setSearch] = useState("");

  const members = data.members.filter(m => m.role === "member" && (m.name.toLowerCase().includes(search.toLowerCase()) || m.username.includes(search)));

  function addMember() {
    if (!form.name || !form.username) return;
    const newMember = { ...form, id: Date.now(), role: "member", balance: 0, mealActive: false, joinDate: new Date().toISOString().split("T")[0] };
    updateData({ ...data, members: [...data.members, newMember] });
    setForm({ name: "", username: "", password: "1234", phone: "", room: "", foodPref: "normal", allergies: "" });
    setShowAdd(false);
  }

  function removeMember(id) {
    if (!confirm("এই মেম্বারকে remove করবেন?")) return;
    updateData({ ...data, members: data.members.filter(m => m.id !== id) });
  }

  function toggleMeal(id) {
    updateData({ ...data, members: data.members.map(m => m.id === id ? { ...m, mealActive: !m.mealActive } : m) });
  }

  function doAddBalance(memberId) {
    const amount = parseInt(addBalance[memberId] || 0);
    if (!amount || amount <= 0) return;
    const newTx = { id: Date.now(), memberId, type: "deposit", amount, note: "Admin direct add", txId: "ADMIN" + Date.now(), status: "approved", date: new Date().toISOString().split("T")[0] };
    const updated = data.members.map(m => m.id === memberId ? { ...m, balance: m.balance + amount, mealActive: m.balance + amount >= data.settings.depositRequired || m.mealActive } : m);
    updateData({ ...data, members: updated, transactions: [...data.transactions, newTx] });
    setAddBalance({ ...addBalance, [memberId]: "" });
  }

  const inputStyle = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, boxSizing: "border-box", outline: "none" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="মেম্বার খুঁজুন..." style={{ ...inputStyle, width: 220 }} />
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          + নতুন মেম্বার
        </button>
      </div>

      {showAdd && (
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 1rem", fontSize: 15, color: "#f1f5f9" }}>নতুন মেম্বার যোগ করুন</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "নাম", key: "name", ph: "পূর্ণ নাম" },
              { label: "Username", key: "username", ph: "username" },
              { label: "Password", key: "password", ph: "password" },
              { label: "ফোন", key: "phone", ph: "01XXXXXXXXX" },
              { label: "রুম নম্বর", key: "room", ph: "101" },
              { label: "Allergy", key: "allergies", ph: "থাকলে লিখুন" },
            ].map(f => (
              <div key={f.key}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{f.label}</label>
                <input value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} style={inputStyle} />
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10 }}>
            <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>খাবার পছন্দ</label>
            <select value={form.foodPref} onChange={e => setForm({ ...form, foodPref: e.target.value })} style={inputStyle}>
              <option value="normal">স্বাভাবিক</option>
              <option value="spicy">ঝাল বেশি</option>
              <option value="less_spicy">ঝাল কম</option>
              <option value="no_spicy">ঝাল নেই</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: 8, marginTop: "1rem" }}>
            <button onClick={addMember} style={{ padding: "8px 20px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>যোগ করুন</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: "8px 20px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>বাতিল</button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {members.map(m => (
          <div key={m.id} style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 16 }}>
                  {m.name[0]}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>{m.name}</p>
                  <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>@{m.username} · Room {m.room} · {m.phone}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 8, background: m.mealActive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: m.mealActive ? "#10b981" : "#ef4444" }}>
                  {m.mealActive ? "Meal চালু" : "Meal বন্ধ"}
                </span>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #334155" }}>
              <div>
                <span style={{ fontSize: 18, fontWeight: 700, color: m.balance < 500 ? "#ef4444" : "#10b981" }}>৳{m.balance.toLocaleString()}</span>
                <span style={{ fontSize: 11, color: "#64748b", marginLeft: 4 }}>ব্যালেন্স</span>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  type="number" placeholder="টাকা" value={addBalance[m.id] || ""}
                  onChange={e => setAddBalance({ ...addBalance, [m.id]: e.target.value })}
                  style={{ ...inputStyle, width: 90 }}
                />
                <button onClick={() => doAddBalance(m.id)} style={{ padding: "7px 12px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 12, cursor: "pointer" }}>Add</button>
                <button onClick={() => toggleMeal(m.id)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                  {m.mealActive ? "বন্ধ করুন" : "চালু করুন"}
                </button>
                <button onClick={() => removeMember(m.id)} style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(239,68,68,0.3)", background: "transparent", color: "#ef4444", fontSize: 12, cursor: "pointer" }}>Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
