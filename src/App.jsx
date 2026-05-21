import { useState, createContext, useContext, useEffect } from "react";
import { db, ref, set, onValue } from "./firebase";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MemberDashboard from "./pages/MemberDashboard";

export const AppContext = createContext(null);

const INITIAL_DATA = {
  settings: {
    messName: "অনুক্ত মেস",
    mealPrice: 50,
    monthlyCharge: 3000,
    depositRequired: 2500,
    lunchDeadline: "10:00",
    dinnerDeadline: "19:00",
    bkashNumber: "01700-000000",
    nagadNumber: "01700-000000",
  },
  members: [
    { id: 1, name: "Admin", username: "admin", password: "admin123", role: "admin", balance: 0, mealActive: true, phone: "01700-000000", room: "101", joinDate: "2025-01-01", foodPref: "normal", allergies: "" },
    { id: 2, name: "Fahim Ahmed", username: "fahim", password: "1234", role: "member", balance: 3200, mealActive: true, phone: "01711-111111", room: "102", joinDate: "2025-01-05", foodPref: "less_spicy", allergies: "" },
    { id: 3, name: "Rahim Mia", username: "rahim", password: "1234", role: "member", balance: 800, mealActive: true, phone: "01722-222222", room: "103", joinDate: "2025-01-10", foodPref: "normal", allergies: "chingri" },
    { id: 4, name: "Karim Uddin", username: "karim", password: "1234", role: "member", balance: 2100, mealActive: true, phone: "01733-333333", room: "104", joinDate: "2025-01-15", foodPref: "spicy", allergies: "" },
    { id: 5, name: "Nasir Hossain", username: "nasir", password: "1234", role: "member", balance: 450, mealActive: false, phone: "01744-444444", room: "105", joinDate: "2025-02-01", foodPref: "normal", allergies: "" },
  ],
  mealOrders: [],
  transactions: [
    { id: 1, memberId: 2, type: "deposit", amount: 2500, note: "bKash deposit", txId: "BK240101", status: "approved", date: "2025-05-01" },
    { id: 2, memberId: 3, type: "deposit", amount: 1500, note: "Nagad deposit", txId: "NG240102", status: "approved", date: "2025-05-02" },
    { id: 3, memberId: 4, type: "deposit", amount: 3000, note: "bKash deposit", txId: "BK240103", status: "approved", date: "2025-05-03" },
    { id: 4, memberId: 5, type: "deposit", amount: 500, note: "bKash deposit", txId: "BK240110", status: "approved", date: "2025-05-10" },
    { id: 5, memberId: 2, type: "meal", amount: -150, note: "3 meals", status: "auto", date: "2025-05-15" },
    { id: 6, memberId: 3, type: "monthly", amount: -700, note: "Monthly charge partial", status: "auto", date: "2025-05-01" },
  ],
  notices: [
    { id: 1, title: "মেস মিটিং", body: "আগামীকাল রাত ৯টায় ছাদে মেস মিটিং আছে।", date: "2025-05-18", author: "Admin" },
    { id: 2, title: "বিদ্যুৎ বিল", body: "এই মাসের বিদ্যুৎ বিল বেশি এসেছে। AC কম ব্যবহার করুন।", date: "2025-05-15", author: "Admin" },
  ],
  complaints: [
    { id: 1, memberId: 2, title: "পানির চাপ কম", body: "সকালে পানির চাপ খুব কম থাকে।", status: "pending", date: "2025-05-17" },
  ],
  weeklyMenu: [
    { day: "শনিবার", lunch: "ভাত, ডাল, মুরগি", dinner: "খিচুড়ি, ডিম ভুনা" },
    { day: "রবিবার", lunch: "ভাত, ডাল, মাছ", dinner: "ভাত, সবজি, ডাল" },
    { day: "সোমবার", lunch: "ভাত, গরু মাংস", dinner: "ভাত, ডাল, ডিম" },
    { day: "মঙ্গলবার", lunch: "ভাত, ডাল, মুরগি", dinner: "ভাত, মাছ" },
    { day: "বুধবার", lunch: "ভাত, খাসি মাংস", dinner: "ভাত, সবজি" },
    { day: "বৃহস্পতিবার", lunch: "ভাত, ডাল, মাছ", dinner: "বিরিয়ানি" },
    { day: "শুক্রবার", lunch: "পোলাও, গরু মাংস", dinner: "ভাত, ডাল, ডিম" },
  ],
  bazarCosts: [
    { id: 1, date: "2025-05-18", item: "মুরগি ৩ কেজি", amount: 900, addedBy: "Admin" },
    { id: 2, date: "2025-05-18", item: "সবজি", amount: 250, addedBy: "Admin" },
    { id: 3, date: "2025-05-17", item: "মাছ ২ কেজি", amount: 700, addedBy: "Admin" },
  ],
  leaveNotices: [],
  cleaningSchedule: [
    { memberId: 2, day: "শনিবার" },
    { memberId: 3, day: "রবিবার" },
    { memberId: 4, day: "সোমবার" },
    { memberId: 5, day: "মঙ্গলবার" },
    { memberId: 2, day: "বুধবার" },
    { memberId: 3, day: "বৃহস্পতিবার" },
    { memberId: 4, day: "শুক্রবার" },
  ],
  guestMeals: [],
  mealRatings: [],
  chatMessages: [],
  photos: [],
};

function loadUserId() {
  try {
    const saved = localStorage.getItem("onukto-mess-userid");
    return saved ? parseInt(saved) : null;
  } catch (e) { return null; }
}

export function useApp() {
  return useContext(AppContext);
}

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(loadUserId);

  const currentUser = userId && data ? (data.members.find(m => m.id === userId) || null) : null;
  const page = currentUser ? (currentUser.role === "admin" ? "admin" : "member") : "login";

  // Firebase থেকে real-time data load করো
  useEffect(() => {
    const dataRef = ref(db, "messData");
    const unsub = onValue(dataRef, (snapshot) => {
      if (snapshot.exists()) {
        setData(snapshot.val());
      } else {
        // প্রথমবার — initial data Firebase এ save করো
        set(ref(db, "messData"), INITIAL_DATA);
        setData(INITIAL_DATA);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  function updateData(newData) {
    setData(newData);
    set(ref(db, "messData"), newData);
  }

  function login(username, password) {
    const user = data.members.find(m => m.username === username && m.password === password);
    if (user) {
      setUserId(user.id);
      localStorage.setItem("onukto-mess-userid", String(user.id));
      return true;
    }
    return false;
  }

  function logout() {
    setUserId(null);
    localStorage.removeItem("onukto-mess-userid");
  }

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh", background: "#0f172a",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🍽️</div>
          <p style={{ color: "#64748b", fontSize: 14 }}>Loading...</p>
        </div>
      </div>
    );
  }

  const ctx = { data, updateData, currentUser, login, logout };

  return (
    <AppContext.Provider value={ctx}>
      {page === "login" && <Login />}
      {page === "admin" && <AdminDashboard />}
      {page === "member" && <MemberDashboard />}
    </AppContext.Provider>
  );
}
