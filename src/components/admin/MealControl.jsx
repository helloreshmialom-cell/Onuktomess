import { useState } from "react";
import { useApp } from "../../App";

export default function MealControl() {
  const { data, updateData } = useApp();
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const [guestMember, setGuestMember] = useState("");
  const [guestMeal, setGuestMeal] = useState("lunch");
  const [guestCount, setGuestCount] = useState(1);

  const orders = data.mealOrders.filter(o => o.date === selectedDate);
  const members = data.members.filter(m => m.role === "member");

  const inputStyle = { padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, outline: "none" };

  function addGuestMeal() {
    if (!guestMember) return;
    const memberId = parseInt(guestMember);
    const member = data.members.find(m => m.id === memberId);
    if (!member) return;
    const cost = guestCount * data.settings.mealPrice;
    if (member.balance < cost) { alert("ব্যালেন্স কম!"); return; }
    const newOrder = { id: Date.now(), memberId, date: selectedDate, meal: guestMeal, isGuest: true, guestCount, addedBy: "admin" };
    const newTx = { id: Date.now() + 1, memberId, type: "meal", amount: -cost, note: `Guest meal (${guestCount} জন)`, status: "auto", date: selectedDate };
    const updMembers = data.members.map(m => m.id === memberId ? { ...m, balance: m.balance - cost } : m);
    updateData({ ...data, mealOrders: [...data.mealOrders, newOrder], transactions: [...data.transactions, newTx], members: updMembers });
  }

  function removeOrder(orderId) {
    const order = data.mealOrders.find(o => o.id === orderId);
    if (!order) return;
    const refundTx = { id: Date.now(), memberId: order.memberId, type: "refund", amount: data.settings.mealPrice * (order.guestCount || 1), note: "Meal order cancel (refund)", status: "auto", date: today };
    const updMembers = data.members.map(m => m.id === order.memberId ? { ...m, balance: m.balance + refundTx.amount } : m);
    updateData({ ...data, mealOrders: data.mealOrders.filter(o => o.id !== orderId), transactions: [...data.transactions, refundTx], members: updMembers });
  }

  const lunchOrders = orders.filter(o => o.meal === "lunch");
  const dinnerOrders = orders.filter(o => o.meal === "dinner");

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginBottom: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
        <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} style={inputStyle} />
        <span style={{ fontSize: 13, color: "#64748b" }}>
          দুপুর: {lunchOrders.length} জন · রাত: {dinnerOrders.length} জন
        </span>
      </div>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginBottom: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: 14, color: "#94a3b8" }}>Guest Meal যোগ করুন</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <select value={guestMember} onChange={e => setGuestMember(e.target.value)} style={inputStyle}>
            <option value="">মেম্বার বেছে নিন</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <select value={guestMeal} onChange={e => setGuestMeal(e.target.value)} style={inputStyle}>
            <option value="lunch">দুপুর</option>
            <option value="dinner">রাত</option>
          </select>
          <input type="number" min="1" max="10" value={guestCount} onChange={e => setGuestCount(parseInt(e.target.value))} style={{ ...inputStyle, width: 70 }} placeholder="কত জন" />
          <button onClick={addGuestMeal} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: "#3b82f6", color: "#fff", fontSize: 13, cursor: "pointer" }}>
            Guest Meal Add
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[{ label: "☀️ দুপুরের অর্ডার", orders: lunchOrders }, { label: "🌙 রাতের অর্ডার", orders: dinnerOrders }].map(section => (
          <div key={section.label} style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
            <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>{section.label} ({section.orders.length} জন)</h3>
            {section.orders.length === 0 && <p style={{ color: "#475569", fontSize: 13 }}>কোনো অর্ডার নেই</p>}
            {section.orders.map(o => {
              const m = data.members.find(mb => mb.id === o.memberId);
              return (
                <div key={o.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid #334155" }}>
                  <div>
                    <span style={{ fontSize: 13, color: "#f1f5f9" }}>{m?.name}</span>
                    {o.isGuest && <span style={{ fontSize: 11, background: "rgba(245,158,11,0.15)", color: "#f59e0b", borderRadius: 4, padding: "1px 5px", marginLeft: 6 }}>Guest ×{o.guestCount}</span>}
                  </div>
                  <button onClick={() => removeOrder(o.id)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", fontSize: 12 }}>×</button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginTop: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8" }}>Shopping List — {selectedDate}</h3>
        <p style={{ color: "#f1f5f9", fontSize: 13 }}>দুপুর: {lunchOrders.reduce((s, o) => s + (o.guestCount || 1), 0)} জনের রান্না দরকার</p>
        <p style={{ color: "#f1f5f9", fontSize: 13 }}>রাত: {dinnerOrders.reduce((s, o) => s + (o.guestCount || 1), 0)} জনের রান্না দরকার</p>
        <p style={{ color: "#64748b", fontSize: 12, marginTop: 6 }}>আনুমানিক বাজার খরচ: ৳{((lunchOrders.reduce((s, o) => s + (o.guestCount || 1), 0) + dinnerOrders.reduce((s, o) => s + (o.guestCount || 1), 0)) * 80).toLocaleString()}</p>
      </div>
    </div>
  );
}
