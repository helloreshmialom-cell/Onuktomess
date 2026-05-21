import { useState } from "react";
import { useApp } from "../../App";

export function MealOrder() {
  const { data, updateData, currentUser } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [successMsg, setSuccessMsg] = useState("");

  const member = data.members.find(m => m.id === currentUser.id);
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const isToday = selectedDate === todayStr;
  const canLunch = !isToday || now.getHours() < 10;
  const canDinner = !isToday || now.getHours() < 19;

  const existingOrders = data.mealOrders.filter(o => o.memberId === currentUser.id && o.date === selectedDate);
  const hasLunch = existingOrders.some(o => o.meal === "lunch" && !o.isGuest);
  const hasDinner = existingOrders.some(o => o.meal === "dinner" && !o.isGuest);

  function toggleMeal(meal) {
    if (!member?.mealActive) { alert("Meal চালু নেই। ৳" + data.settings.depositRequired + " deposit করুন।"); return; }
    const canOrder = meal === "lunch" ? canLunch : canDinner;
    const hasOrder = meal === "lunch" ? hasLunch : hasDinner;

    if (hasOrder) {
      const order = existingOrders.find(o => o.meal === meal && !o.isGuest);
      const refund = data.settings.mealPrice;
      const updMembers = data.members.map(m => m.id === currentUser.id ? { ...m, balance: m.balance + refund } : m);
      const refundTx = { id: Date.now(), memberId: currentUser.id, type: "refund", amount: refund, note: `Meal cancel (${meal})`, status: "auto", date: todayStr };
      updateData({ ...data, mealOrders: data.mealOrders.filter(o => o.id !== order?.id), members: updMembers, transactions: [...data.transactions, refundTx] });
      setSuccessMsg("Meal cancel হয়েছে ✓");
    } else {
      if (!canOrder) { alert(meal === "lunch" ? "সকাল ১০টার পরে দুপুরের meal দেওয়া যায় না।" : "সন্ধ্যা ৭টার পরে রাতের meal দেওয়া যায় না।"); return; }
      if (member.balance < data.settings.mealPrice) { alert("ব্যালেন্স কম! টাকা add করুন।"); return; }
      const newOrder = { id: Date.now(), memberId: currentUser.id, date: selectedDate, meal, isGuest: false };
      const newTx = { id: Date.now() + 1, memberId: currentUser.id, type: "meal", amount: -data.settings.mealPrice, note: `${meal === "lunch" ? "দুপুর" : "রাত"} meal`, status: "auto", date: selectedDate };
      const updMembers = data.members.map(m => m.id === currentUser.id ? { ...m, balance: m.balance - data.settings.mealPrice } : m);
      updateData({ ...data, mealOrders: [...data.mealOrders, newOrder], transactions: [...data.transactions, newTx], members: updMembers });
      setSuccessMsg("Meal order দেওয়া হয়েছে ✓");
    }
    setTimeout(() => setSuccessMsg(""), 2000);
  }

  const weekDates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d.toISOString().split("T")[0];
  });

  return (
    <div>
      {successMsg && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: "#10b981" }}>{successMsg}</div>}

      {!member?.mealActive && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: "#fca5a5" }}>
          Meal বন্ধ আছে। ৳{data.settings.depositRequired} deposit করলে চালু হবে।
        </div>
      )}

      <div style={{ display: "flex", gap: 6, marginBottom: "1.5rem", overflowX: "auto", paddingBottom: 4 }}>
        {weekDates.map(d => {
          const dayName = new Date(d).toLocaleDateString("bn-BD", { weekday: "short" });
          const dayNum = new Date(d).getDate();
          const isSelected = d === selectedDate;
          const hasAny = data.mealOrders.some(o => o.memberId === currentUser.id && o.date === d);
          return (
            <button key={d} onClick={() => setSelectedDate(d)} style={{
              minWidth: 54, padding: "8px 6px", borderRadius: 10, border: `1px solid ${isSelected ? "#3b82f6" : "#334155"}`,
              background: isSelected ? "rgba(59,130,246,0.15)" : "#1e293b",
              color: isSelected ? "#60a5fa" : "#94a3b8", fontSize: 11, cursor: "pointer", position: "relative"
            }}>
              <div style={{ fontSize: 10 }}>{dayName}</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{dayNum}</div>
              {hasAny && <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#10b981", position: "absolute", top: 4, right: 4 }} />}
            </button>
          );
        })}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { meal: "lunch", label: "দুপুর", icon: "☀️", time: "১০:০০ এর আগে", has: hasLunch, can: canLunch },
          { meal: "dinner", label: "রাত", icon: "🌙", time: "৭:০০ এর আগে", has: hasDinner, can: canDinner },
        ].map(m => (
          <div key={m.meal} onClick={() => toggleMeal(m.meal)} style={{
            background: m.has ? "rgba(16,185,129,0.1)" : "#1e293b",
            border: `1px solid ${m.has ? "rgba(16,185,129,0.4)" : "#334155"}`,
            borderRadius: 14, padding: "1.25rem", cursor: "pointer",
            opacity: (!m.can && !m.has && isToday) ? 0.5 : 1
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{m.icon}</div>
            <p style={{ margin: "0 0 4px", fontSize: 15, fontWeight: 600, color: "#f1f5f9" }}>{m.label}ের খাবার</p>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#64748b" }}>{m.time} deadline</p>
            <div style={{
              padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, textAlign: "center",
              background: m.has ? "#10b981" : (!m.can && isToday) ? "#334155" : "#3b82f6",
              color: "#fff"
            }}>
              {m.has ? "✓ নেওয়া হয়েছে (Cancel করুন)" : (!m.can && isToday) ? "সময় শেষ" : "নিন (৳" + data.settings.mealPrice + ")"}
            </div>
          </div>
        ))}
      </div>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginTop: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 8px", fontSize: 13, color: "#94a3b8" }}>আজকের মেনু</h3>
        {(() => {
          const today = data.weeklyMenu?.[new Date().getDay()];
          return today ? (
            <div>
              <p style={{ margin: "0 0 4px", fontSize: 13, color: "#f1f5f9" }}>☀️ দুপুর: {today.lunch}</p>
              <p style={{ margin: 0, fontSize: 13, color: "#f1f5f9" }}>🌙 রাত: {today.dinner}</p>
            </div>
          ) : <p style={{ color: "#64748b", fontSize: 13, margin: 0 }}>মেনু দেওয়া হয়নি</p>;
        })()}
      </div>
    </div>
  );
}

export function MemberBalance() {
  const { data, currentUser } = useApp();
  const myTx = data.transactions.filter(t => t.memberId === currentUser.id);
  const member = data.members.find(m => m.id === currentUser.id);

  const totalDeposit = myTx.filter(t => t.type === "deposit" && t.status === "approved").reduce((s, t) => s + t.amount, 0);
  const totalSpent = myTx.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1rem" }}>
        {[
          { label: "বর্তমান ব্যালেন্স", value: "৳" + member?.balance?.toLocaleString(), color: member?.balance < 500 ? "#ef4444" : "#10b981" },
          { label: "মোট জমা", value: "৳" + totalDeposit.toLocaleString(), color: "#3b82f6" },
          { label: "মোট খরচ", value: "৳" + totalSpent.toLocaleString(), color: "#f59e0b" },
        ].map(c => (
          <div key={c.label} style={{ background: "#1e293b", borderRadius: 10, padding: "0.875rem", border: "1px solid #334155" }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: c.color }}>{c.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>{c.label}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 14, color: "#94a3b8" }}>লেনদেনের ইতিহাস</h3>
        {myTx.length === 0 && <p style={{ color: "#475569", fontSize: 13 }}>কোনো লেনদেন নেই</p>}
        {[...myTx].reverse().map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #334155" }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: "#f1f5f9" }}>{t.note}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{t.date} · {t.status}</p>
            </div>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.amount > 0 ? "#10b981" : "#ef4444" }}>
              {t.amount > 0 ? "+" : ""}৳{Math.abs(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentRequest() {
  const { data, updateData, currentUser } = useApp();
  const [method, setMethod] = useState("bkash");
  const [amount, setAmount] = useState("");
  const [txId, setTxId] = useState("");
  const [msg, setMsg] = useState("");

  const inp = { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none" };

  function submit(e) {
    e.preventDefault();
    if (!amount || !txId) return;
    const newTx = { id: Date.now(), memberId: currentUser.id, type: "deposit", amount: parseInt(amount), note: `${method === "bkash" ? "bKash" : "Nagad"} payment request`, txId, status: "pending", date: new Date().toISOString().split("T")[0] };
    updateData({ ...data, transactions: [...data.transactions, newTx] });
    setMsg("✓ Request submit হয়েছে! Admin approve করলে balance add হবে।");
    setAmount(""); setTxId("");
    setTimeout(() => setMsg(""), 4000);
  }

  return (
    <div>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 15, color: "#f1f5f9" }}>টাকা পাঠানোর নম্বর</h3>
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#64748b" }}>নিচের নম্বরে টাকা পাঠিয়ে Transaction ID দিন</p>
        <div style={{ display: "flex", gap: 10 }}>
          {[["bKash", data.settings.bkashNumber, "#e91e8c"], ["Nagad", data.settings.nagadNumber, "#f7941d"]].map(([name, num, color]) => (
            <div key={name} style={{ flex: 1, background: "#0f172a", borderRadius: 10, padding: "0.875rem", border: "1px solid #334155", cursor: "pointer" }} onClick={() => setMethod(name.toLowerCase())}>
              <p style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 700, color }}>{name}</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#f1f5f9" }}>{num}</p>
            </div>
          ))}
        </div>
      </div>

      {msg && <div style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: "#10b981" }}>{msg}</div>}

      <form onSubmit={submit} style={{ background: "#1e293b", borderRadius: 12, padding: "1.25rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: 15, color: "#f1f5f9" }}>Payment Request</h3>
        <div style={{ display: "flex", gap: 10, marginBottom: "1rem" }}>
          {["bkash", "nagad"].map(m => (
            <button key={m} type="button" onClick={() => setMethod(m)} style={{
              flex: 1, padding: "8px", borderRadius: 8, border: `1px solid ${method === m ? "#3b82f6" : "#334155"}`,
              background: method === m ? "rgba(59,130,246,0.15)" : "transparent",
              color: method === m ? "#60a5fa" : "#94a3b8", fontSize: 13, cursor: "pointer", fontWeight: method === m ? 600 : 400
            }}>
              {m === "bkash" ? "bKash" : "Nagad"}
            </button>
          ))}
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>পরিমাণ (৳)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="টাকার পরিমাণ" required style={inp} />
        </div>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", color: "#94a3b8", fontSize: 12, marginBottom: 4 }}>Transaction ID</label>
          <input value={txId} onChange={e => setTxId(e.target.value)} placeholder="Transaction ID দিন" required style={inp} />
        </div>
        <button type="submit" style={{ width: "100%", padding: "12px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
          Submit করুন
        </button>
      </form>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginTop: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8" }}>আমার Payment History</h3>
        {data.transactions.filter(t => t.memberId === currentUser.id && t.type === "deposit").reverse().map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: "1px solid #334155" }}>
            <div>
              <p style={{ margin: 0, fontSize: 13, color: "#f1f5f9" }}>৳{t.amount} — TxID: {t.txId}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{t.date}</p>
            </div>
            <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 6, height: "fit-content", background: t.status === "pending" ? "rgba(245,158,11,0.15)" : t.status === "approved" ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)", color: t.status === "pending" ? "#f59e0b" : t.status === "approved" ? "#10b981" : "#ef4444" }}>
              {t.status === "pending" ? "Pending" : t.status === "approved" ? "Approved" : "Rejected"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberNotice() {
  const { data } = useApp();
  return (
    <div>
      {[...data.notices].reverse().map(n => (
        <div key={n.id} style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginBottom: 10, border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 15, color: "#f1f5f9" }}>📢 {n.title}</h3>
          <p style={{ margin: "0 0 8px", fontSize: 13, color: "#94a3b8", lineHeight: 1.6 }}>{n.body}</p>
          <p style={{ margin: 0, fontSize: 11, color: "#475569" }}>{n.date} · {n.author}</p>
        </div>
      ))}
      {data.notices.length === 0 && <p style={{ color: "#475569", fontSize: 13 }}>কোনো নোটিশ নেই</p>}
    </div>
  );
}

export function GroupChat() {
  const { data, updateData, currentUser } = useApp();
  const [msg, setMsg] = useState("");
  const member = data.members.find(m => m.id === currentUser.id);

  function send(e) {
    e.preventDefault();
    if (!msg.trim()) return;
    const newMsg = { id: Date.now(), memberId: currentUser.id, name: member?.name, text: msg.trim(), time: new Date().toLocaleTimeString("bn-BD", { hour: "2-digit", minute: "2-digit" }) };
    updateData({ ...data, chatMessages: [...(data.chatMessages || []), newMsg] });
    setMsg("");
  }

  return (
    <div>
      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155", minHeight: 300, marginBottom: 10 }}>
        {(data.chatMessages || []).length === 0 && <p style={{ color: "#475569", fontSize: 13, textAlign: "center", marginTop: 80 }}>এখনো কোনো message নেই</p>}
        {(data.chatMessages || []).map(m => {
          const isMe = m.memberId === currentUser.id;
          return (
            <div key={m.id} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "70%", background: isMe ? "#3b82f6" : "#334155", borderRadius: isMe ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "8px 12px" }}>
                {!isMe && <p style={{ margin: "0 0 2px", fontSize: 11, color: "#94a3b8" }}>{m.name}</p>}
                <p style={{ margin: 0, fontSize: 13, color: "#f1f5f9" }}>{m.text}</p>
                <p style={{ margin: "2px 0 0", fontSize: 10, color: isMe ? "rgba(255,255,255,0.6)" : "#64748b", textAlign: "right" }}>{m.time}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={send} style={{ display: "flex", gap: 8 }}>
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="Message লিখুন..." style={{ flex: 1, padding: "10px 14px", borderRadius: 10, border: "1px solid #334155", background: "#1e293b", color: "#f1f5f9", fontSize: 13, outline: "none" }} />
        <button type="submit" style={{ padding: "10px 18px", borderRadius: 10, border: "none", background: "#3b82f6", color: "#fff", fontSize: 14, cursor: "pointer" }}>↑</button>
      </form>
    </div>
  );
}

export function MemberComplaints() {
  const { data, updateData, currentUser } = useApp();
  const [title, setTitle] = useState(""); const [body, setBody] = useState(""); const [msg, setMsg] = useState("");
  const myComplaints = data.complaints.filter(c => c.memberId === currentUser.id);
  const inp = { width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid #334155", background: "#0f172a", color: "#f1f5f9", fontSize: 13, boxSizing: "border-box", outline: "none" };

  function submit(e) {
    e.preventDefault();
    const c = { id: Date.now(), memberId: currentUser.id, title, body, status: "pending", date: new Date().toISOString().split("T")[0] };
    updateData({ ...data, complaints: [...data.complaints, c] });
    setMsg("✓ অভিযোগ submit হয়েছে!"); setTitle(""); setBody("");
    setTimeout(() => setMsg(""), 2000);
  }

  return (
    <div>
      <form onSubmit={submit} style={{ background: "#1e293b", borderRadius: 12, padding: "1.25rem", marginBottom: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 1rem", fontSize: 15, color: "#f1f5f9" }}>অভিযোগ দিন</h3>
        {msg && <p style={{ color: "#10b981", fontSize: 13, marginBottom: 8 }}>{msg}</p>}
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="সমস্যার শিরোনাম" required style={{ ...inp, marginBottom: 8 }} />
        <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="বিস্তারিত লিখুন..." rows={3} required style={{ ...inp, resize: "vertical" }} />
        <button type="submit" style={{ marginTop: 8, width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#f59e0b", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Submit করুন</button>
      </form>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {myComplaints.map(c => (
          <div key={c.id} style={{ background: "#1e293b", borderRadius: 10, padding: "0.875rem", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p style={{ margin: "0 0 4px", fontSize: 14, color: "#f1f5f9", fontWeight: 500 }}>{c.title}</p>
              <span style={{ fontSize: 11, padding: "2px 6px", borderRadius: 6, background: c.status === "pending" ? "rgba(245,158,11,0.15)" : "rgba(16,185,129,0.15)", color: c.status === "pending" ? "#f59e0b" : "#10b981" }}>
                {c.status === "pending" ? "Pending" : "Resolved"}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: 12, color: "#64748b" }}>{c.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MemberMenu() {
  const { data } = useApp();
  const todayIdx = new Date().getDay();
  return (
    <div>
      <p style={{ color: "#64748b", fontSize: 13, marginBottom: "1rem" }}>সাপ্তাহিক মেনু</p>
      {data.weeklyMenu?.map((m, i) => (
        <div key={i} style={{ background: i === todayIdx ? "rgba(59,130,246,0.1)" : "#1e293b", borderRadius: 12, padding: "0.875rem", marginBottom: 8, border: `1px solid ${i === todayIdx ? "rgba(59,130,246,0.4)" : "#334155"}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ margin: "0 0 4px", fontSize: 14, fontWeight: 600, color: i === todayIdx ? "#60a5fa" : "#f1f5f9" }}>{m.day} {i === todayIdx ? "(আজ)" : ""}</p>
          </div>
          <p style={{ margin: "0 0 2px", fontSize: 13, color: "#94a3b8" }}>☀️ {m.lunch}</p>
          <p style={{ margin: 0, fontSize: 13, color: "#94a3b8" }}>🌙 {m.dinner}</p>
        </div>
      ))}
    </div>
  );
}
