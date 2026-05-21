import { useState } from "react";
import { useApp } from "../App";

export default function Login() {
  const { login, data } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [tab, setTab] = useState("login");

  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regMsg, setRegMsg] = useState("");

  function handleLogin(e) {
    e.preventDefault();
    if (!login(username, password)) {
      setError("ভুল username বা password!");
    }
  }

  function handleRegister(e) {
    e.preventDefault();
    setRegMsg("✓ Registration সফল! Admin approve করলে login করতে পারবে।");
    setRegName(""); setRegPhone(""); setRegUser(""); setRegPass("");
  }

  return (
    <div style={{
      minHeight: "100vh", background: "#0f172a",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontFamily: "'Segoe UI', sans-serif", padding: "1rem"
    }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, margin: "0 auto 1rem", boxShadow: "0 0 0 8px rgba(59,130,246,0.15)"
          }}>🍽️</div>
          <h1 style={{ color: "#f1f5f9", fontSize: 26, fontWeight: 700, margin: 0 }}>
            {data.settings.messName}
          </h1>
          <p style={{ color: "#64748b", fontSize: 14, margin: "4px 0 0" }}>Mess Management System</p>
        </div>

        <div style={{
          background: "#1e293b", borderRadius: 16, padding: "2rem",
          border: "1px solid #334155"
        }}>
          <div style={{ display: "flex", marginBottom: "1.5rem", background: "#0f172a", borderRadius: 10, padding: 4 }}>
            {["login", "register"].map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                flex: 1, padding: "8px 0", borderRadius: 8, border: "none", cursor: "pointer",
                background: tab === t ? "#3b82f6" : "transparent",
                color: tab === t ? "#fff" : "#64748b",
                fontWeight: tab === t ? 600 : 400, fontSize: 14, transition: "all 0.2s"
              }}>
                {t === "login" ? "লগইন" : "রেজিস্ট্রেশন"}
              </button>
            ))}
          </div>

          {tab === "login" && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Username</label>
                <input
                  value={username} onChange={e => setUsername(e.target.value)}
                  placeholder="username লিখুন"
                  style={{
                    width: "100%", padding: "10px 14px", borderRadius: 10,
                    border: "1px solid #334155", background: "#0f172a",
                    color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none"
                  }}
                />
              </div>
              <div style={{ marginBottom: "1rem", position: "relative" }}>
                <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>Password</label>
                <input
                  type={showPass ? "text" : "password"}
                  value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="password লিখুন"
                  style={{
                    width: "100%", padding: "10px 40px 10px 14px", borderRadius: 10,
                    border: "1px solid #334155", background: "#0f172a",
                    color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none"
                  }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{
                  position: "absolute", right: 12, top: 34, background: "none",
                  border: "none", color: "#64748b", cursor: "pointer", fontSize: 16
                }}>{showPass ? "🙈" : "👁️"}</button>
              </div>
              {error && <p style={{ color: "#ef4444", fontSize: 13, marginBottom: "1rem" }}>{error}</p>}
              <button type="submit" style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer"
              }}>লগইন করুন</button>
              <div style={{ marginTop: "1rem", padding: "10px", background: "#0f172a", borderRadius: 8 }}>
                <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>
                  Admin: admin / admin123 | Member: fahim / 1234
                </p>
              </div>
            </form>
          )}

          {tab === "register" && (
            <form onSubmit={handleRegister}>
              {[
                { label: "পূর্ণ নাম", val: regName, set: setRegName, ph: "আপনার নাম" },
                { label: "ফোন নম্বর", val: regPhone, set: setRegPhone, ph: "01XXXXXXXXX" },
                { label: "Username", val: regUser, set: setRegUser, ph: "username বেছে নিন" },
                { label: "Password", val: regPass, set: setRegPass, ph: "password দিন" },
              ].map(f => (
                <div key={f.label} style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "block", color: "#94a3b8", fontSize: 13, marginBottom: 6 }}>{f.label}</label>
                  <input
                    value={f.val} onChange={e => f.set(e.target.value)}
                    placeholder={f.ph} required
                    style={{
                      width: "100%", padding: "10px 14px", borderRadius: 10,
                      border: "1px solid #334155", background: "#0f172a",
                      color: "#f1f5f9", fontSize: 14, boxSizing: "border-box", outline: "none"
                    }}
                  />
                </div>
              ))}
              {regMsg && <p style={{ color: "#22c55e", fontSize: 13, marginBottom: "1rem" }}>{regMsg}</p>}
              <button type="submit" style={{
                width: "100%", padding: "12px", borderRadius: 10, border: "none",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer"
              }}>রেজিস্ট্রেশন করুন</button>
              <p style={{ color: "#475569", fontSize: 12, marginTop: "0.75rem", textAlign: "center" }}>
                Registration এর পর Admin approve করলে meal নিতে পারবে
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
