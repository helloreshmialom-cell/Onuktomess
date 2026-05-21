import { useState } from "react";
import { useApp } from "../App";
import MealOrder from "../components/member/MealOrder";
import MemberBalance from "../components/member/MemberBalance";
import PaymentRequest from "../components/member/PaymentRequest";
import MemberNotice from "../components/member/MemberNotice";
import GroupChat from "../components/member/GroupChat";
import MemberComplaints from "../components/member/MemberComplaints";
import MemberMenu from "../components/member/MemberMenu";

const TABS = [
  { id: "home", label: "হোম", icon: "🏠" },
  { id: "meal", label: "খাবার", icon: "🍽️" },
  { id: "balance", label: "ব্যালেন্স", icon: "💰" },
  { id: "payment", label: "পেমেন্ট", icon: "📱" },
  { id: "menu", label: "মেনু", icon: "📋" },
  { id: "notice", label: "নোটিশ", icon: "📢" },
  { id: "chat", label: "চ্যাট", icon: "💬" },
  { id: "complaint", label: "অভিযোগ", icon: "⚠️" },
];

export default function MemberDashboard() {
  const { data, currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState("home");

  const member = data.members.find(m => m.id === currentUser.id);
  const today = new Date().toISOString().split("T")[0];
  const myOrders = data.mealOrders.filter(o => o.memberId === currentUser.id && o.date === today);
  const hasLunch = myOrders.some(o => o.meal === "lunch");
  const hasDinner = myOrders.some(o => o.meal === "dinner");
  const myTx = data.transactions.filter(t => t.memberId === currentUser.id);
  const unreadNotices = data.notices.length;

  const s = {
    app: { minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', sans-serif", color: "#f1f5f9", display: "flex", flexDirection: "column" },
    header: { background: "#1e293b", borderBottom: "1px solid #334155", padding: "0.875rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between" },
    content: { flex: 1, padding: "1rem", overflowY: "auto" },
    bottomNav: {
      background: "#1e293b", borderTop: "1px solid #334155",
      display: "flex", padding: "0.5rem 0"
    },
    navBtn: (active) => ({
      flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      padding: "6px 0", background: "none", border: "none", cursor: "pointer",
      color: active ? "#3b82f6" : "#64748b", fontSize: 10, fontFamily: "inherit"
    }),
  };

  return (
    <div style={s.app}>
      <div style={s.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 9, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14 }}>
            {member?.name?.[0]}
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 600 }}>{member?.name}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Room {member?.room}</p>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 700, color: member?.balance < 500 ? "#ef4444" : "#10b981" }}>
              ৳{member?.balance?.toLocaleString()}
            </p>
            <p style={{ margin: 0, fontSize: 10, color: "#64748b" }}>ব্যালেন্স</p>
          </div>
          <button onClick={logout} style={{ background: "none", border: "1px solid #334155", color: "#94a3b8", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 12 }}>লগআউট</button>
        </div>
      </div>

      <div style={s.content}>
        {member?.balance < 500 && (
          <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 10, padding: "10px 14px", marginBottom: "1rem", fontSize: 13, color: "#fca5a5" }}>
            ⚠️ তোমার ব্যালেন্স কম! টাকা add করো।
          </div>
        )}

        {activeTab === "home" && <MemberHome member={member} hasLunch={hasLunch} hasDinner={hasDinner} data={data} myTx={myTx} />}
        {activeTab === "meal" && <MealOrder />}
        {activeTab === "balance" && <MemberBalance />}
        {activeTab === "payment" && <PaymentRequest />}
        {activeTab === "menu" && <MemberMenu />}
        {activeTab === "notice" && <MemberNotice />}
        {activeTab === "chat" && <GroupChat />}
        {activeTab === "complaint" && <MemberComplaints />}
      </div>

      <div style={s.bottomNav}>
        {TABS.map(t => (
          <button key={t.id} style={s.navBtn(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
            <span style={{ fontSize: 18 }}>{t.icon}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function MemberHome({ member, hasLunch, hasDinner, data, myTx }) {
  const now = new Date();
  const hour = now.getHours();
  const canLunch = hour < 10;
  const canDinner = hour < 19;

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <p style={{ color: "#64748b", fontSize: 13, margin: "0 0 4px" }}>
          {now.toLocaleDateString("bn-BD", { weekday: "long", month: "long", day: "numeric" })}
        </p>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>
          {hour < 12 ? "সুপ্রভাত" : hour < 17 ? "শুভ বিকাল" : "শুভ সন্ধ্যা"}, {member?.name?.split(" ")[0]}!
        </h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1rem" }}>
        <div style={{ background: hasLunch ? "rgba(16,185,129,0.1)" : "rgba(59,130,246,0.08)", border: `1px solid ${hasLunch ? "rgba(16,185,129,0.3)" : "#334155"}`, borderRadius: 12, padding: "0.875rem" }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b" }}>দুপুরের খাবার</p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: hasLunch ? "#10b981" : "#94a3b8" }}>
            {hasLunch ? "✓ নেওয়া হয়েছে" : canLunch ? "Order দিতে পারবে" : "সময় শেষ"}
          </p>
          {!canLunch && !hasLunch && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>১০টার পরে আর দেওয়া যায় না</p>}
        </div>
        <div style={{ background: hasDinner ? "rgba(16,185,129,0.1)" : "rgba(59,130,246,0.08)", border: `1px solid ${hasDinner ? "rgba(16,185,129,0.3)" : "#334155"}`, borderRadius: 12, padding: "0.875rem" }}>
          <p style={{ margin: "0 0 4px", fontSize: 12, color: "#64748b" }}>রাতের খাবার</p>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: hasDinner ? "#10b981" : "#94a3b8" }}>
            {hasDinner ? "✓ নেওয়া হয়েছে" : canDinner ? "Order দিতে পারবে" : "সময় শেষ"}
          </p>
          {!canDinner && !hasDinner && <p style={{ margin: "2px 0 0", fontSize: 11, color: "#64748b" }}>৭টার পরে আর দেওয়া যায় না</p>}
        </div>
      </div>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", marginBottom: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>আজকের মেনু</h3>
        {(() => {
          const days = ["রবিবার","সোমবার","মঙ্গলবার","বুধবার","বৃহস্পতিবার","শুক্রবার","শনিবার"];
          const today = data.weeklyMenu?.[new Date().getDay()];
          return today ? (
            <div>
              <div style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#64748b", width: 50 }}>দুপুর:</span>
                <span style={{ fontSize: 13, color: "#f1f5f9" }}>{today.lunch}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12, color: "#64748b", width: 50 }}>রাত:</span>
                <span style={{ fontSize: 13, color: "#f1f5f9" }}>{today.dinner}</span>
              </div>
            </div>
          ) : <p style={{ color: "#64748b", fontSize: 13 }}>মেনু দেওয়া হয়নি</p>;
        })()}
      </div>

      <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
        <h3 style={{ margin: "0 0 10px", fontSize: 14, color: "#94a3b8", fontWeight: 600 }}>সাম্প্রতিক লেনদেন</h3>
        {myTx.slice(-4).reverse().map(t => (
          <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #334155", fontSize: 13 }}>
            <span style={{ color: "#94a3b8" }}>{t.note}</span>
            <span style={{ color: t.amount > 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
              {t.amount > 0 ? "+" : ""}৳{Math.abs(t.amount)}
            </span>
          </div>
        ))}
        {myTx.length === 0 && <p style={{ color: "#64748b", fontSize: 13 }}>কোনো লেনদেন নেই</p>}
      </div>
    </div>
  );
}
