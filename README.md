# 🍽️ অনুক্ত মেস ম্যানেজমেন্ট সিস্টেম

## ✅ Features
- Admin ও Member আলাদা login
- Meal order (দুপুর ১০টা / রাত ৭টা deadline)
- Auto balance deduction (৳৫০/meal)
- bKash/Nagad manual payment
- Weekly menu
- Notice board
- Group chat
- Complaint box
- Bazar cost tracking
- Monthly report
- Settings (meal price, monthly charge পরিবর্তন)

---

## 🚀 PC তে চালানোর নিয়ম

### ধাপ ১ — Node.js install করো
👉 https://nodejs.org → LTS version download করো

### ধাপ ২ — Project চালাও
```bash
# Terminal খোলো, এই folder এ যাও
cd onukto-mess

# Dependencies install করো (প্রথমবার)
npm install

# Website চালাও
npm run dev
```
Browser এ যাও: **http://localhost:5173**

---

## 🔐 Default Login
| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Member | `fahim` | `1234` |
| Member | `rahim` | `1234` |
| Member | `karim` | `1234` |

---

## 🌐 Vercel এ Deploy করার নিয়ম

### ধাপ ১ — GitHub এ upload করো
1. github.com এ account খোলো
2. New Repository → নাম দাও `onukto-mess`
3. এই folder এর সব files upload করো

### ধাপ ২ — Vercel এ deploy করো
1. vercel.com → GitHub দিয়ে login
2. "Add New Project" → তোমার repo select করো
3. Deploy click করো
4. পাবে: **https://onukto-mess.vercel.app** 🎉

---

## ⚠️ গুরুত্বপূর্ণ নোট
এই version এ data localStorage এ save হয়।
Vercel deploy এর পরে Firebase যোগ করলে data সার্ভারে save হবে।

---

## 📞 সাহায্য দরকার?
Claude AI কে জিজ্ঞেস করো!
