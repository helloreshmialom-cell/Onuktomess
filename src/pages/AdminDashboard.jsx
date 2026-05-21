import { useState } from "react";
import { useApp } from "../App";
import MemberManager from "../components/admin/MemberManager";
import MealControl from "../components/admin/MealControl";
import PaymentManager from "../components/admin/PaymentManager";
import BazarTracker from "../components/admin/BazarTracker";
import NoticeBoard from "../components/admin/NoticeBoard";
import WeeklyMenuAdmin from "../components/admin/WeeklyMenuAdmin";
import ReportPanel from "../components/admin/ReportPanel";
import SettingsPanel from "../components/admin/SettingsPanel";
import ComplaintManager from "../components/admin/ComplaintManager";

const TABS = [
  { id: "dashboard", label: "ড্যাশবোর্ড", icon: "🏠" },
  { id: "members", label: "মেম্বার", icon: "👥" },
  { id: "meals", label: "খাবার", icon: "🍽️" },
  { id: "payments", label: "পেমেন্ট", icon: "💰" },
  { id: "bazar", label: "বাজার", icon: "🛒" },
  { id: "menu", label: "মেনু", icon: "📋" },
  { id: "notice", label: "নোটিশ", icon: "📢" },
  { id: "complaints", label: "অভিযোগ", icon: "⚠️" },
  { id: "reports", label: "রিপোর্ট", icon: "📊" },
  { id: "settings", label: "সেটিংস", icon: "⚙️" },
];

export default function AdminDashboard() {
  const { data, currentUser, logout } = useApp();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const today = new Date().toISOString().split("T")[0];
  const todayOrders = data.mealOrders.filter(o => o.date === today);
  const totalBalance = data.members.filter(m => m.role === "member").reduce((s, m) => s + m.balance, 0);
  const pendingPayments = data.transactions.filter(t => t.type === "deposit" && t.status === "pending").length;
  const pendingComplaints = data.complaints.filter(c => c.status === "pending").length;
  const activeMembers = data.members.filter(m => m.role === "member" && m.mealActive).length;
  const todayLunch = todayOrders.filter(o => o.meal === "lunch").length;
  const todayDinner = todayOrders.filter(o => o.meal === "dinner").length;

  const s = {
    app: { display: "flex", minHeight: "100vh", background: "#0f172a", fontFamily: "'Segoe UI', sans-serif", color: "#f1f5f9" },
    sidebar: {
      width: sidebarOpen ? 220 : 64, background: "#1e293b",
      borderRight: "1px solid #334155", display: "flex", flexDirection: "column",
      transition: "width 0.3s", overflow: "hidden", flexShrink: 0
    },
    sideHeader: { padding: "1.25rem 1rem", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", gap: 10 },
    logo: { fontSize: 22, flexShrink: 0 },
    logoText: { fontSize: 14, fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap" },
    nav: { flex: 1, padding: "0.5rem", overflowY: "auto" },
    navItem: (active) => ({
      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
      borderRadius: 10, cursor: "pointer", marginBottom: 2,
      background: active ? "rgba(59,130,246,0.2)" : "transparent",
      border: active ? "1px solid rgba(59,130,246,0.4)" : "1px solid transparent",
      color: active ? "#60a5fa" : "#94a3b8",
      whiteSpace: "nowrap", fontSize: 13, fontWeight: active ? 600 : 400,
      transition: "all 0.15s"
    }),
    navIcon: { fontSize: 16, flexShrink: 0, width: 20, textAlign: "center" },
    main: { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
    header: {
      background: "#1e293b", borderBottom: "1px solid #334155",
      padding: "0.875rem 1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between"
    },
    content: { flex: 1, overflowY: "auto", padding: "1.5rem" },
  };

  return (
    <div style={s.app}>
      <div style={s.sidebar}>
        <div style={s.sideHeader}>
          <span style={s.logo}>🍽️</span>
          {sidebarOpen && <span style={s.logoText}>{data.settings.messName}</span>}
        </div>
        <nav style={s.nav}>
          {TABS.map(t => (
            <div key={t.id} style={s.navItem(activeTab === t.id)} onClick={() => setActiveTab(t.id)}>
              <span style={s.navIcon}>{t.icon}</span>
              {sidebarOpen && t.label}
              {t.id === "payments" && pendingPayments > 0 && sidebarOpen && (
                <span style={{ marginLeft: "auto", background: "#ef4444", color: "#fff", borderRadius: 10, fontSize: 11, padding: "1px 6px" }}>{pendingPayments}</span>
              )}
              {t.id === "complaints" && pendingComplaints > 0 && sidebarOpen && (
                <span style={{ marginLeft: "auto", background: "#f59e0b", color: "#fff", borderRadius: 10, fontSize: 11, padding: "1px 6px" }}>{pendingComplaints}</span>
              )}
            </div>
          ))}
        </nav>
        {sidebarOpen && (
          <div style={{ padding: "1rem", borderTop: "1px solid #334155" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: "0.75rem" }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>A</div>
              <div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: "#f1f5f9" }}>Admin</p>
                <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>Super Admin</p>
              </div>
            </div>
            <button onClick={logout} style={{ width: "100%", padding: "7px", borderRadius: 8, border: "1px solid #334155", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}>লগআউট</button>
          </div>
        )}
      </div>

      <div style={s.main}>
        <div style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 20, padding: 4 }}>☰</button>
            <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "#f1f5f9" }}>
              {TABS.find(t => t.id === activeTab)?.icon} {TABS.find(t => t.id === activeTab)?.label}
            </h2>
          </div>
          <div style={{ display: "flex", gap: 8, fontSize: 13, color: "#64748b" }}>
            <span>{new Date().toLocaleDateString("bn-BD", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        <div style={s.content}>
          {activeTab === "dashboard" && (
            <DashboardHome
              activeMembers={activeMembers}
              totalBalance={totalBalance}
              todayLunch={todayLunch}
              todayDinner={todayDinner}
              pendingPayments={pendingPayments}
              pendingComplaints={pendingComplaints}
              data={data}
            />
          )}
          {activeTab === "members" && <MemberManager />}
          {activeTab === "meals" && <MealControl />}
          {activeTab === "payments" && <PaymentManager />}
          {activeTab === "bazar" && <BazarTracker />}
          {activeTab === "menu" && <WeeklyMenuAdmin />}
          {activeTab === "notice" && <NoticeBoard isAdmin />}
          {activeTab === "complaints" && <ComplaintManager />}
          {activeTab === "reports" && <ReportPanel />}
          {activeTab === "settings" && <SettingsPanel />}
        </div>
      </div>
    </div>
  );
}

function DashboardHome({ activeMembers, totalBalance, todayLunch, todayDinner, pendingPayments, pendingComplaints, data }) {
  const cards = [
    { label: "সক্রিয় মেম্বার", value: activeMembers + " জন", icon: "👥", color: "#3b82f6", bg: "rgba(59,130,246,0.1)" },
    { label: "মোট ব্যালেন্স", value: "৳" + totalBalance.toLocaleString(), icon: "💰", color: "#10b981", bg: "rgba(16,185,129,0.1)" },
    { label: "আজ দুপুর", value: todayLunch + " জন", icon: "☀️", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
    { label: "আজ রাত", value: todayDinner + " জন", icon: "🌙", color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
    { label: "Pending পেমেন্ট", value: pendingPayments + "টি", icon: "⏳", color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    { label: "নতুন অভিযোগ", value: pendingComplaints + "টি", icon: "⚠️", color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
  ];

  const lowBalance = data.members.filter(m => m.role === "member" && m.balance < 500);

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
        {cards.map(c => (
          <div key={c.label} style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 22 }}>{c.icon}</span>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: c.color }} />
            </div>
            <p style={{ margin: 0, fontSize: 22, fontWeight: 700, color: "#f1f5f9" }}>{c.value}</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#64748b" }}>{c.label}</p>
          </div>
        ))}
      </div>

      {lowBalance.length > 0 && (
        <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: 12, padding: "1rem", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 8px", color: "#ef4444", fontSize: 14, fontWeight: 600 }}>⚠️ কম ব্যালেন্স সতর্কতা</h3>
          {lowBalance.map(m => (
            <div key={m.id} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", fontSize: 13, color: "#fca5a5" }}>
              <span>{m.name}</span>
              <span>৳{m.balance}</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>সাম্প্রতিক লেনদেন</h3>
          {data.transactions.slice(-5).reverse().map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1e293b", fontSize: 13 }}>
              <span style={{ color: "#94a3b8" }}>{data.members.find(m => m.id === t.memberId)?.name}</span>
              <span style={{ color: t.amount > 0 ? "#10b981" : "#ef4444", fontWeight: 600 }}>
                {t.amount > 0 ? "+" : ""}৳{Math.abs(t.amount)}
              </span>
            </div>
          ))}
        </div>

        <div style={{ background: "#1e293b", borderRadius: 12, padding: "1rem", border: "1px solid #334155" }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600, color: "#94a3b8" }}>সাম্প্রতিক নোটিশ</h3>
          {data.notices.slice(0, 3).map(n => (
            <div key={n.id} style={{ padding: "6px 0", borderBottom: "1px solid #334155" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#f1f5f9", fontWeight: 500 }}>{n.title}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#64748b" }}>{n.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
