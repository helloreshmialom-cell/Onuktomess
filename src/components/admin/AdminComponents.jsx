import { useState } from "react";
import { useApp } from "../../App";

export function BazarTracker() {
  const { data, updateData } = useApp();
  const [item, setItem] = useState(""); const [amount, setAmount] = useState("");

  const inp = { padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, outline: "none" };

  function add() {
    if (!item || !amount) return;
    const entry = { id: Date.now(), date: new Date().toISOString().split("T")[0], item, amount: parseInt(amount), addedBy: "Admin" };
    updateData({ ...data, bazarCosts: [...data.bazarCosts, entry] });
    setItem(""); setAmount("");
  }

  const total = data.bazarCosts.reduce((s, b) => s + b.amount, 0);
  const todayTotal = data.bazarCosts.filter(b => b.date === new Date().toISOString().split("T")[0]).reduce((s, b) => s + b.amount, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1rem" }}>
        <div style={{ background: "#1e293b", borderRadius: 10, padding: "0.875rem", border: "1px solid #334155" }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f1f5f9" }}>৳{total.toLocaleString()}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>মোট বাজার খরচ</p>
        </div>
        <div style={{ background: "#1e293b", borderRadius: 10, padding: "0.875rem", border: "1px solid #334155" }}>
          <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#f59e0b" }}>৳{todayTotal.toLocaleString()}</p>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>আজকের বাজার</p>
        </div>
      </div>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginBottom: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8" }}>নতুন বাজার খরচ যোগ করুন</h3>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={item} onChange={e => setItem(e.target.value)} placeholder="item নাম (যেমন: মুরগি ২ কেজি)" style={{ ...inp, flex: 2 }} />
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="টাকা" style={{ ...inp, width: 90 }} />
          <button onClick={add} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 13, cursor: "pointer" }}>Add</button>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[...data.bazarCosts].reverse().map(b => (
          <div key={b.id} style={{ background: "#1e293b", borderRadius: 10, padding: "10px 14px", border: "1px solid #334155", display: "flex", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: 14, color: "#f1f5f9" }}>{b.item}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{b.date}</p>
            </div>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#ef4444" }}>৳{b.amount.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NoticeBoard({ isAdmin }) {
  const { data, updateData } = useApp();
  const [title, setTitle] = useState(""); const [body, setBody] = useState("");
  const inp = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, boxSizing: "border-box", outline: "none" };

  function add() {
    if (!title || !body) return;
    const n = { id: Date.now(), title, body, date: new Date().toISOString().split("T")[0], author: "Admin" };
    updateData({ ...data, notices: [...data.notices, n] });
    setTitle(""); setBody("");
  }

  function del(id) {
    updateData({ ...data, notices: data.notices.filter(n => n.id !== id) });
  }

  return (
    <div>
      {isAdmin && (
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginBottom: "1rem", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8" }}>নতুন নোটিশ দিন</h3>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="নোটিশের শিরোনাম" style={{ ...inp, marginBottom: 8 }} />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="নোটিশের বিস্তারিত..." rows={3} style={{ ...inp, resize: "vertical" }} />
          <button onClick={add} style={{ marginTop: 8, padding: "8px 20px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 13, cursor: "pointer" }}>পোস্ট করুন</button>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {[...data.notices].reverse().map(n => (
          <div key={n.id} style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 style={{ margin: "0 0 6px", fontSize: 15, color: "#f1f5f9" }}>{n.title}</h3>
              {isAdmin && <button onClick={() => del(n.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 16 }}>×</button>}
            </div>
            <p style={{ margin: "0 0 8px", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{n.body}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#475569" }}>{n.date} · {n.author}</p>
          </div>
        ))}
        {data.notices.length === 0 && <p style={{ color: "#475569", fontSize: 13 }}>কোনো নোটিশ নেই</p>}
      </div>
    </div>
  );
}

export function WeeklyMenuAdmin() {
  const { data, updateData } = useApp();
  const [menu, setMenu] = useState(data.weeklyMenu);

  function update(idx, field, val) {
    const newMenu = menu.map((m, i) => i === idx ? { ...m, [field]: val } : m);
    setMenu(newMenu);
    updateData({ ...data, weeklyMenu: newMenu });
  }

  const inp = { width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, boxSizing: "border-box", outline: "none" };

  return (
    <div>
      <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>প্রতিদিনের মেনু edit করুন — মেম্বাররা দেখতে পাবে।</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {menu.map((m, i) => (
          <div key={i} style={{ background: "#1e293b", borderRadius: 12, padding: "0.875rem", border: "1px solid #334155" }}>
            <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#f1f5f9" }}>{m.day}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <label style={{ display: "block", color: "#64748b", fontSize: 11, marginBottom: 4 }}>☀️ দুপুর</label>
                <input value={m.lunch} onChange={e => update(i, "lunch", e.target.value)} style={inp} />
              </div>
              <div>
                <label style={{ display: "block", color: "#64748b", fontSize: 11, marginBottom: 4 }}>🌙 রাত</label>
                <input value={m.dinner} onChange={e => update(i, "dinner", e.target.value)} style={inp} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReportPanel() {
  const { data } = useApp();
  const members = data.members.filter(m => m.role === "member");
  const today = new Date();
  const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const monthOrders = data.mealOrders.filter(o => o.date.startsWith(monthStr));
  const totalMeals = monthOrders.length;
  const totalRevenue = data.transactions.filter(t => t.type === "deposit" && t.status === "approved" && t.date.startsWith(monthStr)).reduce((s, t) => s + t.amount, 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 10, marginBottom: "1.5rem" }}>
        {[
          { label: "এই মাসে মোট Meal", value: totalMeals + "টি", color: "#3b82f6" },
          { label: "এই মাসে Income", value: "৳" + totalRevenue.toLocaleString(), color: "#10b981" },
          { label: "মোট মেম্বার", value: members.length + " জন", color: "#8b5cf6" },
          { label: "মোট ব্যালেন্স", value: "৳" + members.reduce((s, m) => s + m.balance, 0).toLocaleString(), color: "#f59e0b" },
        ].map(c => (
          <div key={c.label} style={{ background: "#1e293b", borderRadius: 10, padding: "0.875rem", border: "1px solid #334155" }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 700, color: c.color }}>{c.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{c.label}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, color: "#94a3b8" }}>মেম্বার ব্যালেন্স রিপোর্ট</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ color: "#64748b", borderBottom: "1px solid #334155" }}>
              {["নাম", "ব্যালেন্স", "Meal Status", "রুম"].map(h => <th key={h} style={{ textAlign: "left", padding: "6px 0", fontWeight: 500 }}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {members.map(m => (
              <tr key={m.id} style={{ borderBottom: "1px solid #334155" }}>
                <td style={{ padding: "8px 0", color: "#f1f5f9" }}>{m.name}</td>
                <td style={{ padding: "8px 0", color: m.balance < 500 ? "#ef4444" : "#10b981", fontWeight: 600 }}>৳{m.balance.toLocaleString()}</td>
                <td style={{ padding: "8px 0" }}>
                  <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 6, background: m.mealActive ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: m.mealActive ? "#10b981" : "#ef4444" }}>
                    {m.mealActive ? "চালু" : "বন্ধ"}
                  </span>
                </td>
                <td style={{ padding: "8px 0", color: "#94a3b8" }}>{m.room}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function SettingsPanel() {
  const { data, updateData } = useApp();
  const [settings, setSettings] = useState(data.settings);
  const [saved, setSaved] = useState(false);

  function save() {
    updateData({ ...data, settings });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  const inp = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, boxSizing: "border-box", outline: "none" };
  const fields = [
    { label: "মেসের নাম", key: "messName", type: "text" },
    { label: "প্রতি Meal দাম (৳)", key: "mealPrice", type: "number" },
    { label: "মাসিক charge (৳)", key: "monthlyCharge", type: "number" },
    { label: "Deposit required (৳)", key: "depositRequired", type: "number" },
    { label: "দুপুর deadline", key: "lunchDeadline", type: "time" },
    { label: "রাত deadline", key: "dinnerDeadline", type: "time" },
    { label: "bKash নম্বর", key: "bkashNumber", type: "text" },
    { label: "Nagad নম্বর", key: "nagadNumber", type: "text" },
  ];

  return (
    <div>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1.25rem", border: "1px solid #334155", maxWidth: 600 }}>
        <h3 style={{ margin: "0 0 1.25rem", fontSize: 15, color: "#f1f5f9" }}>মেস সেটিংস</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {fields.map(f => (
            <div key={f.key}>
              <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>{f.label}</label>
              <input type={f.type} value={settings[f.key]} onChange={e => setSettings({ ...settings, [f.key]: f.type === "number" ? parseInt(e.target.value) : e.target.value })} style={inp} />
            </div>
          ))}
        </div>
        <button onClick={save} style={{ marginTop: "1.25rem", padding: "10px 28px", borderRadius: 8, border: "none", background: saved ? "#10b981" : "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", transition: "background 0.2s" }}>
          {saved ? "✓ সেভ হয়েছে!" : "সেভ করুন"}
        </button>
      </div>
    </div>
  );
}

export function ComplaintManager() {
  const { data, updateData } = useApp();

  function resolve(id) {
    updateData({ ...data, complaints: data.complaints.map(c => c.id === id ? { ...c, status: "resolved" } : c) });
  }

  return (
    <div>
      {data.complaints.length === 0 && <p style={{ color: "#475569", fontSize: 13 }}>কোনো অভিযোগ নেই</p>}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {data.complaints.map(c => {
          const m = data.members.find(mb => mb.id === c.memberId);
          return (
            <div key={c.id} style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: `1px solid ${c.status === "pending" ? "rgba(245,158,11,0.3)" : "#334155"}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <h3 style={{ margin: "0 0 4px", fontSize: 15, color: "#f1f5f9" }}>{c.title}</h3>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#94a3b8" }}>{c.body}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#475569" }}>{m?.name} · {c.date}</p>
                </div>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, background: c.status === "pending" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: c.status === "pending" ? "#f59e0b" : "#10b981" }}>
                  {c.status === "pending" ? "Pending" : "Resolved"}
                </span>
              </div>
              {c.status === "pending" && (
                <button onClick={() => resolve(c.id)} style={{ marginTop: "0.75rem", padding: "7px 16px", borderRadius: 8, border: "none", background: "#10b981", color: "#fff", fontSize: 12, cursor: "pointer" }}>✓ Resolved</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default BazarTracker;
