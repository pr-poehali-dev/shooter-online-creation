import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "shop" | "roulette" | "profile" | "admin";
type AuthMode = "login" | "register";

// ─── Images ───────────────────────────────────────────────────────────────────
const IMGS = {
  ak47:    "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/b69c5b6b-c128-451c-90b1-fa13f3f74d90.jpg",
  desert:  "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/5f20183c-3876-401c-a414-bde1e468d5dc.jpg",
  gloves:  "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/a98191ba-b9fc-4122-83d1-e4d7c0d03207.jpg",
  app:     "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/4aa5889a-e801-49da-8900-8b96889a4010.jpg",
  glock:   "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/b64d7e61-7e10-44cc-bd99-55996b8f198d.jpg",
  dragon:  "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/bd5cd0a7-1114-4392-9d7c-35afa857850c.jpg",
};

// ─── Types ────────────────────────────────────────────────────────────────────
interface User {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  gold: number;
  balance: number;
  inventory: InventoryItem[];
  history: HistoryItem[];
}

interface InventoryItem {
  id: number;
  name: string;
  type: string;
  rarity: string;
  image: string;
  value: number;
}

interface HistoryItem {
  id: number;
  type: string;
  item: string;
  amount: number;
  currency: string;
  date: string;
}

interface ShopItem {
  id: number;
  name: string;
  type: string;
  image: string;
  rarity: string;
  price: number;
  priceType: string;
  description: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const SHOP_ITEMS: ShopItem[] = [
  { id: 1, name: "AK-47 | Void Storm",    type: "pistol", image: IMGS.ak47,   rarity: "legendary", price: 1200, priceType: "gold", description: "Легендарная штурмовая винтовка с уникальным скином" },
  { id: 2, name: "Dragon Fist Gauntlet",  type: "glove",  image: IMGS.dragon, rarity: "epic",      price: 650,  priceType: "gold", description: "Эпические перчатки с энергией дракона" },
  { id: 3, name: "Cyber Orb App",         type: "app",    image: IMGS.app,    rarity: "rare",      price: 300,  priceType: "gold", description: "Редкое приложение с кибер-интерфейсом" },
  { id: 4, name: "Glock | Blood Red",     type: "pistol", image: IMGS.glock,  rarity: "rare",      price: 280,  priceType: "gold", description: "Компактный пистолет с красным прицелом" },
  { id: 5, name: "Tactical Gloves",       type: "glove",  image: IMGS.gloves, rarity: "uncommon",  price: 180,  priceType: "gold", description: "Тактические кожаные перчатки" },
  { id: 6, name: "Desert Eagle | Chrome", type: "pistol", image: IMGS.desert, rarity: "epic",      price: 890,  priceType: "gold", description: "Хромированный Desert Eagle с красными акцентами" },
  { id: 7, name: "AK-47 | Crimson",       type: "pistol", image: IMGS.ak47,   rarity: "rare",      price: 520,  priceType: "gold", description: "АК-47 в багровом исполнении" },
  { id: 8, name: "Shadow Gloves",         type: "glove",  image: IMGS.gloves, rarity: "epic",      price: 430,  priceType: "gold", description: "Теневые перчатки из тёмной кожи" },
  { id: 9, name: "Matrix App Pro",        type: "app",    image: IMGS.app,    rarity: "legendary", price: 2500, priceType: "rub",  description: "Профессиональное игровое приложение" },
];

const ROULETTE_ITEMS = [
  { id: 1, name: "AK-47 | Void Storm",    image: IMGS.ak47,   rarity: "legendary", value: 1200 },
  { id: 2, name: "Dragon Fist",           image: IMGS.dragon, rarity: "epic",      value: 650 },
  { id: 3, name: "500 Gold",              image: IMGS.app,    rarity: "rare",      value: 500 },
  { id: 4, name: "Glock | Red",           image: IMGS.glock,  rarity: "rare",      value: 280 },
  { id: 5, name: "1000 Gold",             image: IMGS.app,    rarity: "epic",      value: 1000 },
  { id: 6, name: "Tactical Gloves",       image: IMGS.gloves, rarity: "uncommon",  value: 180 },
  { id: 7, name: "Cyber Orb",             image: IMGS.app,    rarity: "rare",      value: 300 },
  { id: 8, name: "Desert Eagle",          image: IMGS.desert, rarity: "uncommon",  value: 250 },
  { id: 9, name: "AK-47 | Crimson",       image: IMGS.ak47,   rarity: "rare",      value: 520 },
  { id: 10, name: "Shadow Gloves",        image: IMGS.gloves, rarity: "epic",      value: 430 },
];

const RARITY_COLORS: Record<string, string> = {
  legendary: "text-yellow-400 border-yellow-500/50 bg-yellow-500/10",
  epic:      "text-purple-400 border-purple-500/50 bg-purple-500/10",
  rare:      "text-blue-400  border-blue-500/50  bg-blue-500/10",
  uncommon:  "text-green-400 border-green-500/50 bg-green-500/10",
  common:    "text-gray-400  border-gray-500/50  bg-gray-500/10",
};

const RARITY_LABEL: Record<string, string> = {
  legendary: "Легендарный",
  epic:      "Эпический",
  rare:      "Редкий",
  uncommon:  "Необычный",
  common:    "Обычный",
};

// ─── Local storage helpers ─────────────────────────────────────────────────────
const USERS_KEY = "ss_users";
const SESSION_KEY = "ss_session";

function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}
function getSession(): User | null {
  try {
    const id = localStorage.getItem(SESSION_KEY);
    if (!id) return null;
    return getUsers().find(u => u.id === id) || null;
  } catch { return null; }
}
function setSession(user: User | null) {
  if (user) localStorage.setItem(SESSION_KEY, user.id);
  else localStorage.removeItem(SESSION_KEY);
}

const ADMIN_EMAIL = "admin@stanskill.gg";
const ADMIN_PASS  = "admin123";

// ─── Auth Modal ───────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (u: User) => void }) {
  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName]       = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]     = useState("");

  const submit = () => {
    setError("");
    if (!email || !password) { setError("Заполни все поля"); return; }

    if (mode === "login") {
      // Admin shortcut
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        const admin: User = { id: "admin", name: "Admin", email: ADMIN_EMAIL, isAdmin: true, gold: 999999, balance: 999999, inventory: [], history: [] };
        const users = getUsers();
        if (!users.find(u => u.id === "admin")) { users.push(admin); saveUsers(users); }
        setSession(admin); onAuth(admin); return;
      }
      const users = getUsers();
      const found = users.find(u => u.email === email && (u as User & { password?: string }).password === password);
      if (!found) { setError("Неверный email или пароль"); return; }
      setSession(found); onAuth(found);
    } else {
      if (!name) { setError("Введи никнейм"); return; }
      if (password.length < 6) { setError("Пароль минимум 6 символов"); return; }
      const users = getUsers();
      if (users.find(u => u.email === email)) { setError("Email уже используется"); return; }
      const newUser: User & { password: string } = {
        id: Date.now().toString(), name, email, isAdmin: false,
        gold: 500, balance: 0,
        inventory: [], history: [{ id: 1, type: "bonus", item: "Стартовый бонус", amount: 500, currency: "gold", date: new Date().toISOString().slice(0,10) }],
        password,
      };
      users.push(newUser); saveUsers(users);
      setSession(newUser); onAuth(newUser);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md mx-4 card-glass rounded-2xl border border-white/10 p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><Icon name="X" size={20} /></button>
        <div className="text-center mb-8">
          <h2 className="font-oswald text-3xl font-bold text-white tracking-widest">
            STAN<span className="text-game-red">SKILL</span>
          </h2>
          <div className="flex mt-4 rounded-lg overflow-hidden border border-white/10">
            <button onClick={() => setMode("login")}    className={`flex-1 py-2 font-oswald text-sm tracking-wider transition-all ${mode==="login"    ? "bg-game-red text-white" : "text-gray-400 hover:text-white"}`}>ВХОД</button>
            <button onClick={() => setMode("register")} className={`flex-1 py-2 font-oswald text-sm tracking-wider transition-all ${mode==="register" ? "bg-game-red text-white" : "text-gray-400 hover:text-white"}`}>РЕГИСТРАЦИЯ</button>
          </div>
        </div>
        <div className="space-y-4">
          {mode === "register" && (
            <div>
              <label className="text-xs text-gray-500 font-oswald tracking-wider mb-1 block">НИКНЕЙМ</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="ShadowBlade99"
                className="w-full bg-game-dark-3 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-game-red transition-colors" />
            </div>
          )}
          <div>
            <label className="text-xs text-gray-500 font-oswald tracking-wider mb-1 block">EMAIL</label>
            <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="you@example.com"
              className="w-full bg-game-dark-3 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-game-red transition-colors" />
          </div>
          <div>
            <label className="text-xs text-gray-500 font-oswald tracking-wider mb-1 block">ПАРОЛЬ</label>
            <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="••••••"
              onKeyDown={e => e.key === "Enter" && submit()}
              className="w-full bg-game-dark-3 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-game-red transition-colors" />
          </div>
          {error && <div className="text-game-red text-sm text-center">{error}</div>}
          <button onClick={submit} className="w-full bg-game-red hover:bg-game-red-light text-white font-oswald tracking-widest py-3 rounded transition-all hover:scale-[1.02] glow-red-sm mt-2">
            {mode === "login" ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ"}
          </button>
          {mode === "login" && (
            <p className="text-center text-xs text-gray-600">
              Нет аккаунта? <button onClick={() => setMode("register")} className="text-game-red hover:underline">Зарегистрироваться</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Admin Auth Modal ──────────────────────────────────────────────────────────
function AdminAuthModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");

  const submit = () => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASS) { onSuccess(); }
    else { setError("Неверные данные администратора"); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 card-glass rounded-2xl border border-game-red/30 p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white"><Icon name="X" size={20} /></button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-game-red/20 border border-game-red/40 flex items-center justify-center mx-auto mb-3">
            <Icon name="ShieldAlert" size={24} className="text-game-red" />
          </div>
          <h2 className="font-oswald text-xl text-white tracking-wider">ДОСТУП АДМИНИСТРАТОРА</h2>
        </div>
        <div className="space-y-4">
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Admin email"
            className="w-full bg-game-dark-3 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-game-red transition-colors" />
          <input value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Пароль"
            onKeyDown={e => e.key === "Enter" && submit()}
            className="w-full bg-game-dark-3 border border-white/10 rounded px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-game-red transition-colors" />
          {error && <div className="text-game-red text-sm text-center">{error}</div>}
          <button onClick={submit} className="w-full bg-game-red hover:bg-game-red-light text-white font-oswald tracking-widest py-3 rounded transition-all">
            ВОЙТИ КАК ADMIN
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, onAuthOpen, onLogout }: {
  page: Page; setPage: (p: Page) => void;
  user: User | null; onAuthOpen: () => void; onLogout: () => void;
}) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-game-red/20 bg-black/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-6">
          <button onClick={() => setPage("home")} className="font-oswald text-2xl font-bold text-white tracking-widest">
            STAN<span className="text-game-red text-glow-red">SKILL</span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {([
              { key: "home",     label: "ГЛАВНАЯ",  icon: "Home" },
              { key: "shop",     label: "МАГАЗИН",  icon: "ShoppingBag" },
              { key: "roulette", label: "РУЛЕТКА",  icon: "Dices" },
            ] as { key: Page; label: string; icon: string }[]).map(item => (
              <button key={item.key} onClick={() => setPage(item.key)}
                className={`flex items-center gap-2 px-4 py-2 font-oswald text-sm tracking-wider transition-all border-b-2 h-16 ${
                  page === item.key ? "text-game-red border-game-red" : "text-gray-400 border-transparent hover:text-white"}`}>
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-2 bg-black/50 border border-game-gold/30 rounded px-3 py-1.5">
                <span className="text-game-gold text-sm font-bold font-oswald">{user.gold.toLocaleString()}</span>
                <span className="text-xs text-game-gold/50">GOLD</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-black/50 border border-green-500/30 rounded px-3 py-1.5">
                <span className="text-green-400 text-sm font-bold font-oswald">{user.balance.toLocaleString()} ₽</span>
              </div>
              {user.isAdmin && (
                <button onClick={() => setPage("admin")}
                  className={`w-9 h-9 rounded bg-game-red/20 border border-game-red/40 flex items-center justify-center text-game-red hover:bg-game-red/30 transition-colors ${page==="admin"?"glow-red-sm":""}`}>
                  <Icon name="Shield" size={15} />
                </button>
              )}
              <button onClick={() => setPage("profile")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all ${page==="profile" ? "border-game-red/50 bg-game-red/10 text-game-red" : "border-white/10 text-gray-300 hover:border-white/30"}`}>
                <Icon name="User" size={14} />
                <span className="font-oswald text-sm hidden sm:inline">{user.name}</span>
              </button>
              <button onClick={onLogout} className="w-9 h-9 rounded border border-white/10 flex items-center justify-center text-gray-500 hover:text-game-red hover:border-game-red/40 transition-all">
                <Icon name="LogOut" size={14} />
              </button>
            </>
          ) : (
            <button onClick={onAuthOpen} className="bg-game-red hover:bg-game-red-light text-white font-oswald tracking-wider px-5 py-2 rounded text-sm transition-all hover:scale-105 glow-red-sm">
              ВОЙТИ
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Item Card ────────────────────────────────────────────────────────────────
function ItemCard({ item, onBuy, owned }: { item: ShopItem; onBuy?: () => void; owned?: boolean }) {
  return (
    <div className="card-glass rounded-xl border border-white/5 hover:border-game-red/40 transition-all duration-300 hover:scale-[1.02] group overflow-hidden flex flex-col">
      <div className="relative bg-gradient-to-b from-game-dark-3 to-game-dark-2 h-44 overflow-hidden">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded border font-oswald tracking-wider ${RARITY_COLORS[item.rarity]}`}>
          {RARITY_LABEL[item.rarity]}
        </div>
        {owned && (
          <div className="absolute top-2 right-2 bg-green-500/80 text-white text-xs px-2 py-0.5 rounded font-oswald">
            В ИНВЕНТАРЕ
          </div>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-oswald text-sm text-white mb-1 leading-tight">{item.name}</h3>
        <p className="text-xs text-gray-600 mb-3 flex-1">{item.description}</p>
        <div className="flex items-center justify-between">
          {item.priceType === "gold"
            ? <span className="text-game-gold font-bold font-oswald">{item.price.toLocaleString()} G</span>
            : <span className="text-green-400 font-bold font-oswald">{item.price.toLocaleString()} ₽</span>}
          {onBuy && !owned && (
            <button onClick={onBuy} className="text-xs bg-game-red text-white px-3 py-1.5 rounded hover:bg-game-red-light transition-all font-oswald tracking-wider hover:scale-105">
              КУПИТЬ
            </button>
          )}
          {owned && <span className="text-xs text-green-400 font-oswald">✓ Получен</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
function HomePage({ setPage, user, onAuthOpen }: { setPage: (p: Page) => void; user: User | null; onAuthOpen: () => void }) {
  return (
    <div>
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-game-red/5 via-transparent to-background" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-game-red/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="relative z-10 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-game-red/10 border border-game-red/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-game-red rounded-full animate-pulse" />
            <span className="text-game-red text-xs font-oswald tracking-widest">LIVE · {(1247).toLocaleString()} игроков онлайн</span>
          </div>
          <h1 className="font-oswald text-7xl md:text-[108px] font-bold text-white mb-2 tracking-tight leading-none">
            STAN<span className="text-game-red text-glow-red">SKILL</span>
          </h1>
          <p className="text-gray-400 text-xl mb-1 tracking-wider">Игровые предметы · Рулетка · Реальные деньги</p>
          <p className="text-gray-600 text-sm mb-12 tracking-widest uppercase">Выигрывай · Покупай · Выводи</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => setPage("roulette")}
              className="glow-red animate-pulse-red bg-game-red hover:bg-game-red-light text-white font-oswald text-lg tracking-widest px-10 py-4 rounded transition-all duration-300 hover:scale-105">
              🎰 КРУТИТЬ РУЛЕТКУ
            </button>
            {!user && (
              <button onClick={onAuthOpen}
                className="bg-transparent border border-white/20 hover:border-white/50 text-white font-oswald text-lg tracking-widest px-10 py-4 rounded transition-all hover:bg-white/5">
                СОЗДАТЬ АККАУНТ
              </button>
            )}
          </div>
          {!user && (
            <p className="text-gray-600 text-sm mt-6">Регистрация даёт <span className="text-game-gold font-bold">500 GOLD</span> стартового бонуса</p>
          )}
        </div>
        {/* Floating weapon images */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 hidden xl:block opacity-20 animate-float" style={{ animationDelay: "0s" }}>
          <img src={IMGS.ak47} alt="" className="w-48 rounded-xl" />
        </div>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden xl:block opacity-20 animate-float" style={{ animationDelay: "1.2s" }}>
          <img src={IMGS.desert} alt="" className="w-48 rounded-xl" />
        </div>
      </section>

      {/* Stats */}
      <section className="bg-game-dark-2 border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Игроков онлайн",     value: "1,247",    icon: "Users",      color: "text-game-red" },
            { label: "Предметов в продаже", value: "500+",     icon: "Package",    color: "text-blue-400" },
            { label: "Выплачено сегодня",   value: "₽84,500",  icon: "TrendingUp", color: "text-green-400" },
            { label: "Рулеток сыграно",     value: "12,890",   icon: "Dices",      color: "text-game-gold" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`mb-1 flex justify-center ${stat.color}`}><Icon name={stat.icon} size={22} /></div>
              <div className="font-oswald text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 tracking-wider uppercase mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Items */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-oswald text-3xl font-bold text-white tracking-wider">🔥 ТОПОВЫЕ ПРЕДМЕТЫ</h2>
          <button onClick={() => setPage("shop")} className="text-game-red text-sm font-oswald tracking-wider hover:text-game-red-light flex items-center gap-1">
            ВСЕ ПРЕДМЕТЫ <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SHOP_ITEMS.filter(i => i.rarity === "legendary" || i.rarity === "epic").slice(0,3).map(item => (
            <ItemCard key={item.id} item={item} onBuy={() => setPage("shop")} />
          ))}
        </div>
      </section>

      {/* Exchange Banner */}
      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl border border-game-gold/20 bg-gradient-to-r from-game-dark-2 via-game-gold/5 to-game-dark-2 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-72 h-72 bg-game-gold/5 rounded-full blur-[80px]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-oswald text-3xl md:text-4xl font-bold text-white mb-2 tracking-wider">💱 ОБМЕН ГОЛДА</h2>
              <p className="text-gray-400 text-lg">1 000 GOLD = 100 ₽ · Выводи реальные деньги в любое время</p>
            </div>
            <div className="flex gap-3">
              <button onClick={user ? undefined : onAuthOpen} className="bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-widest px-8 py-3 rounded transition-all hover:scale-105">
                КУПИТЬ GOLD
              </button>
              <button onClick={user ? undefined : onAuthOpen} className="border border-game-gold/40 text-game-gold font-oswald tracking-widest px-8 py-3 rounded hover:bg-game-gold/10 transition-all">
                ВЫВЕСТИ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Shop Page ────────────────────────────────────────────────────────────────
function ShopPage({ user, setUser, onAuthOpen }: { user: User | null; setUser: (u: User) => void; onAuthOpen: () => void }) {
  const [filter, setFilter] = useState<"all" | "pistol" | "glove" | "app">("all");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = SHOP_ITEMS.filter(i => filter === "all" || i.type === filter);

  const buy = (item: ShopItem) => {
    if (!user) { onAuthOpen(); return; }
    if (item.priceType === "gold") {
      if (user.gold < item.price) { showToast("❌ Недостаточно голда!"); return; }
      const updated: User = {
        ...user,
        gold: user.gold - item.price,
        inventory: [...user.inventory, { id: Date.now(), name: item.name, type: item.type, rarity: item.rarity, image: item.image, value: item.price }],
        history: [{ id: Date.now(), type: "purchase", item: item.name, amount: -item.price, currency: "gold", date: new Date().toISOString().slice(0,10) }, ...user.history],
      };
      const users = getUsers().map(u => u.id === user.id ? { ...u, ...updated } : u);
      saveUsers(users); setUser(updated); setSession(updated);
      showToast(`✅ ${item.name} куплен!`);
    } else {
      showToast("💳 Оплата картой — в разработке");
    }
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const owned = (item: ShopItem) => user?.inventory.some(i => i.name === item.name) ?? false;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-game-dark-2 border border-white/20 text-white px-6 py-3 rounded-xl font-oswald tracking-wider animate-fade-in shadow-xl">
          {toast}
        </div>
      )}
      <div className="mb-8">
        <h1 className="font-oswald text-4xl font-bold text-white tracking-wider mb-2">🛒 МАГАЗИН</h1>
        <p className="text-gray-500">Покупай предметы за голд. Твой баланс: <span className="text-game-gold font-bold">{user?.gold.toLocaleString() ?? "—"} GOLD</span></p>
      </div>
      <div className="flex flex-wrap gap-2 mb-8">
        {([
          { key: "all",    label: "ВСЕ ПРЕДМЕТЫ" },
          { key: "pistol", label: "🔫 ПИСТОЛЕТЫ" },
          { key: "glove",  label: "🧤 ПЕРЧАТКИ" },
          { key: "app",    label: "⚡ ПРИЛОЖЕНИЯ" },
        ] as { key: typeof filter; label: string }[]).map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`font-oswald text-sm tracking-wider px-4 py-2 rounded border transition-all ${
              filter === f.key ? "bg-game-red border-game-red text-white" : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} onBuy={() => buy(item)} owned={owned(item)} />
        ))}
      </div>
    </div>
  );
}

// ─── Roulette Page ────────────────────────────────────────────────────────────
function RoulettePage({ user, setUser, onAuthOpen }: { user: User | null; setUser: (u: User) => void; onAuthOpen: () => void }) {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult]     = useState<typeof ROULETTE_ITEMS[0] | null>(null);
  const [bet, setBet]           = useState(100);
  const [offset, setOffset]     = useState(0);
  const [toast, setToast]       = useState<string | null>(null);

  const ITEM_W = 148;
  const FULL   = [...ROULETTE_ITEMS, ...ROULETTE_ITEMS, ...ROULETTE_ITEMS, ...ROULETTE_ITEMS, ...ROULETTE_ITEMS];

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const spin = () => {
    if (!user) { onAuthOpen(); return; }
    if (spinning) return;
    if (user.gold < bet) { showToast("❌ Недостаточно голда!"); return; }

    setSpinning(true); setResult(null);

    const winIdx  = Math.floor(Math.random() * ROULETTE_ITEMS.length);
    const winner  = ROULETTE_ITEMS[winIdx];
    const baseIdx = ROULETTE_ITEMS.length * 2 + winIdx;
    const target  = baseIdx * ITEM_W - 4 * ITEM_W + Math.random() * (ITEM_W - 20) + 10;
    setOffset(target);

    setTimeout(() => {
      const won = winner.rarity === "legendary" || winner.rarity === "epic"
        ? winner
        : (Math.random() > 0.6 ? winner : ROULETTE_ITEMS[Math.floor(Math.random() * ROULETTE_ITEMS.length)]);

      const isGold  = won.name.includes("Gold");
      const goldWon = isGold ? won.value : 0;
      const newItem  = !isGold ? { id: Date.now(), name: won.name, type: "pistol", rarity: won.rarity, image: won.image, value: won.value } : null;

      const updated: User = {
        ...user,
        gold: user.gold - bet + goldWon,
        inventory: newItem ? [...user.inventory, newItem] : user.inventory,
        history: [{
          id: Date.now(), type: "roulette",
          item: won.name,
          amount: isGold ? goldWon - bet : -bet,
          currency: "gold",
          date: new Date().toISOString().slice(0,10),
        }, ...user.history],
      };
      const users = getUsers().map(u => u.id === user.id ? { ...u, ...updated } : u);
      saveUsers(users); setUser(updated); setSession(updated);
      setResult(won); setSpinning(false);
    }, 4200);
  };

  const betOptions = [50, 100, 250, 500, 1000];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-game-dark-2 border border-white/20 text-white px-6 py-3 rounded-xl font-oswald tracking-wider animate-fade-in shadow-xl">
          {toast}
        </div>
      )}
      <div className="mb-8 text-center">
        <h1 className="font-oswald text-4xl font-bold text-white tracking-wider mb-2">🎰 РУЛЕТКА</h1>
        <p className="text-gray-500">Крути и выигрывай предметы и голд · Баланс: <span className="text-game-gold font-bold">{user?.gold.toLocaleString() ?? "—"} GOLD</span></p>
      </div>

      {/* Roulette strip */}
      <div className="relative mb-8 overflow-hidden rounded-xl border border-game-red/40 bg-game-dark-2 glow-red-sm" style={{ height: 180 }}>
        {/* Center line */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-0.5 bg-game-red z-10 shadow-[0_0_8px_2px_rgba(220,38,38,0.6)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-game-red rotate-45 z-10 -translate-y-2 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-game-red rotate-45 z-10 translate-y-2" />

        <div className="flex items-center h-full py-4"
          style={{
            transform: `translateX(calc(50% - ${offset}px - ${ITEM_W/2}px))`,
            transition: spinning ? "transform 4.2s cubic-bezier(0.05, 0.8, 0.25, 1)" : "none",
            width: "max-content",
          }}>
          {FULL.map((item, i) => (
            <div key={i} className={`flex-shrink-0 mx-1 rounded-lg border overflow-hidden ${RARITY_COLORS[item.rarity]}`}
              style={{ width: ITEM_W - 8, height: 148 }}>
              <img src={item.image} alt={item.name} className="w-full h-24 object-cover" />
              <div className="px-2 pt-1">
                <div className="text-xs font-oswald leading-tight truncate">{item.name}</div>
                <div className="text-xs opacity-50">{item.value}G</div>
              </div>
            </div>
          ))}
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 inset-y-0 w-28 bg-gradient-to-r from-game-dark-2 to-transparent pointer-events-none" />
        <div className="absolute right-0 inset-y-0 w-28 bg-gradient-to-l from-game-dark-2 to-transparent pointer-events-none" />
      </div>

      {/* Result */}
      {result && (
        <div className={`mb-6 p-5 rounded-xl border text-center animate-scale-in flex items-center justify-center gap-4 ${RARITY_COLORS[result.rarity]}`}>
          <img src={result.image} alt={result.name} className="w-16 h-16 rounded-lg object-cover" />
          <div>
            <div className="font-oswald text-xl font-bold">{result.name}</div>
            <div className="text-sm opacity-70">{RARITY_LABEL[result.rarity]} · {result.value} Gold</div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="text-xs text-gray-500 font-oswald tracking-wider mb-2 block">СТАВКА (GOLD)</label>
          <div className="flex gap-2 flex-wrap">
            {betOptions.map(b => (
              <button key={b} onClick={() => setBet(b)}
                className={`font-oswald text-sm px-4 py-2 rounded border transition-all ${
                  bet === b ? "bg-game-red border-game-red text-white" : "border-white/10 text-gray-400 hover:border-white/30"}`}>
                {b}G
              </button>
            ))}
          </div>
        </div>
        <button onClick={spin} disabled={spinning}
          className={`w-full font-oswald text-xl tracking-widest py-4 rounded-lg border transition-all duration-300 ${
            spinning
              ? "border-gray-600 text-gray-500 cursor-not-allowed bg-transparent"
              : "glow-red bg-game-red hover:bg-game-red-light border-game-red text-white hover:scale-[1.02] animate-pulse-red"}`}>
          {spinning ? "⏳ КРУТИТСЯ..." : `🎰 КРУТИТЬ ЗА ${bet} GOLD`}
        </button>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────
function ProfilePage({ user, setUser }: { user: User; setUser: (u: User) => void }) {
  const [tab, setTab] = useState<"inventory" | "history" | "wallet">("inventory");
  const [goldInput, setGoldInput] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const buyGold = () => {
    const amount = parseInt(goldInput);
    if (!amount || amount < 100) { showToast("Минимум 100 голда"); return; }
    showToast("💳 Оплата картой — скоро доступно");
  };

  const withdraw = () => {
    if (user.gold < 1000) { showToast("❌ Минимум 1000 GOLD для вывода"); return; }
    showToast("💸 Вывод средств — скоро доступно");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-game-dark-2 border border-white/20 text-white px-6 py-3 rounded-xl font-oswald tracking-wider animate-fade-in shadow-xl">
          {toast}
        </div>
      )}

      {/* Profile header */}
      <div className="card-glass rounded-2xl border border-white/5 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-20 h-20 rounded-xl bg-game-red/20 border border-game-red/40 flex items-center justify-center text-4xl glow-red-sm">
          🎮
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="font-oswald text-2xl font-bold text-white">{user.name}</h1>
            {user.isAdmin && (
              <span className="text-xs bg-game-red/30 border border-game-red/50 text-game-red px-2 py-0.5 rounded font-oswald">ADMIN</span>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2">{user.email}</p>
          <div className="flex flex-wrap gap-6 text-sm">
            <div><span className="text-gray-500">Предметов: </span><span className="text-white font-oswald">{user.inventory.length}</span></div>
            <div><span className="text-gray-500">Голд: </span><span className="text-game-gold font-oswald font-bold">{user.gold.toLocaleString()}</span></div>
            <div><span className="text-gray-500">Баланс: </span><span className="text-green-400 font-oswald font-bold">{user.balance.toLocaleString()} ₽</span></div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={withdraw} className="bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-wider px-4 py-2 rounded text-sm transition-all hover:scale-105">
            💱 ОБМЕНЯТЬ
          </button>
          <button onClick={withdraw} className="border border-green-500/40 text-green-400 font-oswald tracking-wider px-4 py-2 rounded text-sm hover:bg-green-500/10 transition-all">
            💸 ВЫВЕСТИ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/5">
        {([
          { key: "inventory", label: "🎒 ИНВЕНТАРЬ" },
          { key: "history",   label: "📜 ИСТОРИЯ" },
          { key: "wallet",    label: "💳 КОШЕЛЁК" },
        ] as { key: typeof tab; label: string }[]).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`font-oswald text-sm tracking-wider px-5 py-3 border-b-2 transition-all ${
              tab === t.key ? "text-game-red border-game-red" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Inventory */}
      {tab === "inventory" && (
        user.inventory.length === 0
          ? <div className="text-center py-20 text-gray-600">
              <Icon name="Package" size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-oswald text-lg">Инвентарь пуст</p>
              <p className="text-sm mt-1">Купи предметы в магазине или крути рулетку</p>
            </div>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in">
              {user.inventory.map(item => (
                <div key={item.id} className={`card-glass rounded-xl border overflow-hidden hover:scale-[1.03] transition-all cursor-pointer group ${RARITY_COLORS[item.rarity]}`}>
                  <img src={item.image} alt={item.name} className="w-full h-28 object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="p-3">
                    <div className="font-oswald text-xs leading-tight mb-0.5">{item.name}</div>
                    <div className="text-xs opacity-50">{item.value}G</div>
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* History */}
      {tab === "history" && (
        user.history.length === 0
          ? <div className="text-center py-20 text-gray-600 font-oswald">История пуста</div>
          : <div className="space-y-3 animate-fade-in">
              {user.history.map(h => (
                <div key={h.id} className="card-glass rounded-lg border border-white/5 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${h.amount > 0 ? "bg-green-500/20 text-green-400" : "bg-game-red/20 text-game-red"}`}>
                      <Icon name={h.amount > 0 ? "ArrowDownLeft" : "ArrowUpRight"} size={16} />
                    </div>
                    <div>
                      <div className="font-oswald text-white text-sm">{h.item}</div>
                      <div className="text-xs text-gray-600">{h.date} · {h.type === "purchase" ? "Покупка" : h.type === "roulette" ? "Рулетка" : h.type === "bonus" ? "Бонус" : h.type}</div>
                    </div>
                  </div>
                  <div className={`font-oswald font-bold ${h.amount > 0 ? "text-green-400" : "text-game-red"}`}>
                    {h.amount > 0 ? "+" : ""}{h.amount} {h.currency === "gold" ? "G" : "₽"}
                  </div>
                </div>
              ))}
            </div>
      )}

      {/* Wallet */}
      {tab === "wallet" && (
        <div className="max-w-lg space-y-4 animate-fade-in">
          <div className="card-glass rounded-2xl border border-game-gold/20 p-6">
            <div className="text-xs text-gray-500 font-oswald tracking-wider mb-1">БАЛАНС ГОЛДА</div>
            <div className="font-oswald text-4xl font-bold text-game-gold glow-gold mb-4">{user.gold.toLocaleString()} G</div>
            <div className="flex gap-2 mb-4">
              <input value={goldInput} onChange={e => setGoldInput(e.target.value)} type="number" placeholder="Кол-во GOLD"
                className="flex-1 bg-game-dark-3 border border-white/10 rounded px-3 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-game-gold transition-colors font-oswald" />
              <button onClick={buyGold} className="bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-wider px-4 py-2 rounded text-sm transition-all">
                КУПИТЬ
              </button>
            </div>
            <button onClick={withdraw} className="w-full border border-game-gold/40 text-game-gold font-oswald tracking-wider py-2.5 rounded text-sm hover:bg-game-gold/10 transition-all">
              → КОНВЕРТИРОВАТЬ В РУБЛИ
            </button>
          </div>
          <div className="card-glass rounded-2xl border border-green-500/20 p-6">
            <div className="text-xs text-gray-500 font-oswald tracking-wider mb-1">РУБЛЁВЫЙ СЧЁТ</div>
            <div className="font-oswald text-4xl font-bold text-green-400 mb-1">{user.balance.toLocaleString()} ₽</div>
            <div className="text-xs text-gray-600 mb-4">1 000 GOLD = 100 ₽ · Мин. вывод 500 ₽</div>
            <button onClick={withdraw} className="w-full border border-green-500/40 text-green-400 font-oswald tracking-wider py-2.5 rounded text-sm hover:bg-green-500/10 transition-all">
              💸 ВЫВЕСТИ НА КАРТУ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Admin Page ───────────────────────────────────────────────────────────────
function AdminPage() {
  const [items, setItems] = useState(SHOP_ITEMS.map(i => ({ ...i, active: true })));
  const [rate, setRate] = useState("100");
  const [minWithdraw, setMinWithdraw] = useState("500");
  const [toast, setToast] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editPrice, setEditPrice] = useState("");

  const users = getUsers().filter(u => u.id !== "admin");
  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const toggleActive = (id: number) => setItems(items.map(i => i.id === id ? { ...i, active: !i.active } : i));

  const savePrice = (id: number) => {
    const p = parseInt(editPrice);
    if (!p || p <= 0) return;
    setItems(items.map(i => i.id === id ? { ...i, price: p } : i));
    setEditId(null); showToast("✅ Цена обновлена");
  };

  const totalSales = users.reduce((s, u) => s + u.history.filter(h => h.type === "purchase").length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-game-dark-2 border border-white/20 text-white px-6 py-3 rounded-xl font-oswald tracking-wider animate-fade-in shadow-xl">
          {toast}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="font-oswald text-4xl font-bold text-white tracking-wider">⚙️ ADMIN PANEL</h1>
          <p className="text-gray-500 text-sm mt-1">StanSkill · Управление платформой</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Пользователей",  value: users.length,  icon: "Users",       color: "text-blue-400" },
          { label: "Активных товаров", value: items.filter(i => i.active).length, icon: "CheckCircle", color: "text-green-400" },
          { label: "Продаж всего",   value: totalSales,    icon: "ShoppingBag", color: "text-game-gold" },
          { label: "Товаров итого",  value: items.length,  icon: "Package",     color: "text-game-red" },
        ].map((s, i) => (
          <div key={i} className="card-glass rounded-xl border border-white/5 p-4">
            <div className={`mb-1 ${s.color}`}><Icon name={s.icon} size={18} /></div>
            <div className="font-oswald text-3xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Items table */}
      <div className="card-glass rounded-xl border border-white/5 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-oswald text-white tracking-wider">УПРАВЛЕНИЕ ТОВАРАМИ</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 font-oswald tracking-wider border-b border-white/5">
                <th className="px-4 py-3 text-left">ТОВАР</th>
                <th className="px-4 py-3 text-left">КАТ.</th>
                <th className="px-4 py-3 text-left">ЦЕНА</th>
                <th className="px-4 py-3 text-left">РЕДКОСТЬ</th>
                <th className="px-4 py-3 text-left">СТАТУС</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover" />
                      <span className="font-oswald text-white text-sm">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-sm">
                    {item.type === "pistol" ? "🔫" : item.type === "glove" ? "🧤" : "⚡"}
                  </td>
                  <td className="px-4 py-3">
                    {editId === item.id ? (
                      <div className="flex items-center gap-2">
                        <input value={editPrice} onChange={e => setEditPrice(e.target.value)} type="number"
                          className="w-20 bg-game-dark-3 border border-game-red/40 text-white rounded px-2 py-1 text-sm font-oswald" />
                        <button onClick={() => savePrice(item.id)} className="text-green-400 hover:text-green-300"><Icon name="Check" size={14} /></button>
                        <button onClick={() => setEditId(null)} className="text-gray-500 hover:text-white"><Icon name="X" size={14} /></button>
                      </div>
                    ) : (
                      <button onClick={() => { setEditId(item.id); setEditPrice(item.price.toString()); }}
                        className="flex items-center gap-2 text-game-gold font-oswald font-bold hover:text-game-gold-dark transition-colors group">
                        {item.price.toLocaleString()} {item.priceType === "gold" ? "G" : "₽"}
                        <Icon name="Pencil" size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded border font-oswald ${RARITY_COLORS[item.rarity]}`}>
                      {RARITY_LABEL[item.rarity]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleActive(item.id)}
                        className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${item.active ? "bg-game-red" : "bg-gray-700"}`}>
                        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${item.active ? "translate-x-4" : ""}`} />
                      </button>
                      <span className={`text-xs font-oswald ${item.active ? "text-green-400" : "text-gray-600"}`}>
                        {item.active ? "ВКЛ" : "ОТКЛ"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users table */}
      <div className="card-glass rounded-xl border border-white/5 overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-white/5">
          <h2 className="font-oswald text-white tracking-wider">ПОЛЬЗОВАТЕЛИ ({users.length})</h2>
        </div>
        {users.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-600 font-oswald text-sm">Нет зарегистрированных пользователей</div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 font-oswald tracking-wider border-b border-white/5">
                <th className="px-4 py-3 text-left">ИГРОК</th>
                <th className="px-4 py-3 text-left">EMAIL</th>
                <th className="px-4 py-3 text-left">ГОЛД</th>
                <th className="px-4 py-3 text-left">ПРЕДМЕТОВ</th>
                <th className="px-4 py-3 text-left">ПОКУПОК</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                  <td className="px-4 py-3 font-oswald text-white">{u.name}</td>
                  <td className="px-4 py-3 text-gray-400 text-sm">{u.email}</td>
                  <td className="px-4 py-3 text-game-gold font-oswald font-bold">{u.gold.toLocaleString()}</td>
                  <td className="px-4 py-3 text-gray-300 font-oswald">{u.inventory.length}</td>
                  <td className="px-4 py-3 text-gray-300 font-oswald">{u.history.filter(h => h.type === "purchase").length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Exchange rates */}
      <div className="card-glass rounded-xl border border-game-gold/20 p-6">
        <h2 className="font-oswald text-lg text-white tracking-wider mb-4">💱 НАСТРОЙКИ ОБМЕНА</h2>
        <div className="flex flex-col md:flex-row gap-6">
          <div>
            <label className="text-xs text-gray-500 font-oswald tracking-wider block mb-2">1000 GOLD =</label>
            <div className="flex items-center gap-2">
              <input value={rate} onChange={e => setRate(e.target.value)} type="number"
                className="bg-game-dark-3 border border-white/10 text-white rounded px-3 py-2 w-24 font-oswald focus:outline-none focus:border-game-gold" />
              <span className="text-gray-400">₽</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 font-oswald tracking-wider block mb-2">МИН. ВЫВОД</label>
            <div className="flex items-center gap-2">
              <input value={minWithdraw} onChange={e => setMinWithdraw(e.target.value)} type="number"
                className="bg-game-dark-3 border border-white/10 text-white rounded px-3 py-2 w-24 font-oswald focus:outline-none focus:border-game-gold" />
              <span className="text-gray-400">₽</span>
            </div>
          </div>
          <div className="flex items-end">
            <button onClick={() => showToast("✅ Настройки сохранены")}
              className="bg-game-red hover:bg-game-red-light text-white font-oswald tracking-wider px-6 py-2 rounded text-sm transition-all hover:scale-105">
              СОХРАНИТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUserState] = useState<User | null>(getSession);
  const [page, setPage]      = useState<Page>("home");
  const [showAuth, setShowAuth]       = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  const setUser = (u: User) => { setUserState(u); setSession(u); };
  const logout  = () => { setUserState(null); setSession(null); setPage("home"); };

  const handleSetPage = (p: Page) => {
    if (p === "profile" && !user) { setShowAuth(true); return; }
    if (p === "admin") {
      if (!user) { setShowAuth(true); return; }
      if (!user.isAdmin) { setShowAdminAuth(true); return; }
    }
    setPage(p);
  };

  const handleAuth = (u: User) => {
    setUser(u); setShowAuth(false);
    if (u.isAdmin) setPage("admin");
    else setPage("profile");
  };

  const handleAdminAuth = () => { setShowAdminAuth(false); setPage("admin"); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar page={page} setPage={handleSetPage} user={user} onAuthOpen={() => setShowAuth(true)} onLogout={logout} />
      <main className="pt-16">
        {page === "home"     && <HomePage setPage={handleSetPage} user={user} onAuthOpen={() => setShowAuth(true)} />}
        {page === "shop"     && <ShopPage user={user} setUser={setUser} onAuthOpen={() => setShowAuth(true)} />}
        {page === "roulette" && <RoulettePage user={user} setUser={setUser} onAuthOpen={() => setShowAuth(true)} />}
        {page === "profile"  && user && <ProfilePage user={user} setUser={setUser} />}
        {page === "admin"    && (user?.isAdmin ? <AdminPage /> : null)}
      </main>

      {showAuth      && <AuthModal onClose={() => setShowAuth(false)} onAuth={handleAuth} />}
      {showAdminAuth && <AdminAuthModal onClose={() => setShowAdminAuth(false)} onSuccess={handleAdminAuth} />}
    </div>
  );
}