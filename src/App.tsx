import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "shop" | "roulette" | "profile" | "admin";
type AuthMode = "login" | "register";

// ── Images ────────────────────────────────────────────────────────────────────
const IMGS = {
  ak47:   "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/b69c5b6b-c128-451c-90b1-fa13f3f74d90.jpg",
  desert: "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/5f20183c-3876-401c-a414-bde1e468d5dc.jpg",
  gloves: "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/a98191ba-b9fc-4122-83d1-e4d7c0d03207.jpg",
  app:    "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/4aa5889a-e801-49da-8900-8b96889a4010.jpg",
  glock:  "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/b64d7e61-7e10-44cc-bd99-55996b8f198d.jpg",
  dragon: "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/bd5cd0a7-1114-4392-9d7c-35afa857850c.jpg",
  m4:     "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/8e8de2ee-839e-48e6-884d-4cc64bcbe3ec.jpg",
  knife:  "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/a873d093-fa92-4305-93aa-bd4469b7705d.jpg",
  gold:   "https://cdn.poehali.dev/projects/da2e36e0-ead2-42a1-8762-27a9d75ad908/files/de333366-83ab-4b7b-a898-c825e19fa8f7.jpg",
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface User {
  id: string; name: string; email: string; isAdmin: boolean;
  gold: number; balance: number;
  inventory: InvItem[]; history: HistItem[];
  password?: string;
}
interface InvItem  { id: number; name: string; type: string; rarity: string; image: string; value: number; }
interface HistItem { id: number; type: string; item: string; amount: number; currency: string; date: string; }
interface ShopItem { id: number; name: string; type: string; image: string; rarity: string; price: number; priceType: string; description: string; active: boolean; }

// ── Rarity config ─────────────────────────────────────────────────────────────
const RC: Record<string, { cls: string; glow: string; label: string }> = {
  legendary: { cls: "text-yellow-300 border-yellow-500/60 bg-yellow-500/10", glow: "shadow-[0_0_20px_rgba(234,179,8,.5)]",   label: "Легендарный" },
  epic:      { cls: "text-purple-300 border-purple-500/60 bg-purple-500/10", glow: "shadow-[0_0_20px_rgba(168,85,247,.5)]",  label: "Эпический"   },
  rare:      { cls: "text-blue-300   border-blue-500/60   bg-blue-500/10",   glow: "shadow-[0_0_20px_rgba(59,130,246,.5)]",  label: "Редкий"      },
  uncommon:  { cls: "text-green-300  border-green-500/60  bg-green-500/10",  glow: "shadow-[0_0_12px_rgba(34,197,94,.4)]",   label: "Необычный"   },
  common:    { cls: "text-gray-400   border-gray-600/60   bg-gray-700/20",   glow: "",                                        label: "Обычный"     },
};

// ── Default shop items ─────────────────────────────────────────────────────────
const DEFAULT_ITEMS: ShopItem[] = [
  { id:1, name:"AK-47 | Void Storm",    type:"pistol", image:IMGS.ak47,   rarity:"legendary", price:1200, priceType:"gold", description:"Легендарная штурмовая винтовка", active:true },
  { id:2, name:"Dragon Fist Gauntlet",  type:"glove",  image:IMGS.dragon, rarity:"epic",      price:650,  priceType:"gold", description:"Эпические перчатки с энергией дракона", active:true },
  { id:3, name:"Cyber Orb App",         type:"app",    image:IMGS.app,    rarity:"rare",      price:300,  priceType:"gold", description:"Редкое приложение с кибер-интерфейсом", active:true },
  { id:4, name:"Glock | Blood Red",     type:"pistol", image:IMGS.glock,  rarity:"rare",      price:280,  priceType:"gold", description:"Компактный пистолет с красным прицелом", active:true },
  { id:5, name:"Tactical Gloves",       type:"glove",  image:IMGS.gloves, rarity:"uncommon",  price:180,  priceType:"gold", description:"Тактические кожаные перчатки", active:true },
  { id:6, name:"Desert Eagle | Chrome", type:"pistol", image:IMGS.desert, rarity:"epic",      price:890,  priceType:"gold", description:"Хромированный Desert Eagle", active:true },
  { id:7, name:"M4A1 | Blaze",          type:"pistol", image:IMGS.m4,     rarity:"legendary", price:1500, priceType:"gold", description:"M4A1 в огненном исполнении", active:true },
  { id:8, name:"Golden Karambit",        type:"knife",  image:IMGS.knife,  rarity:"legendary", price:2200, priceType:"gold", description:"Золотой нож-керамбит", active:true },
  { id:9, name:"Shadow Gloves",         type:"glove",  image:IMGS.gloves, rarity:"epic",      price:430,  priceType:"gold", description:"Теневые перчатки из тёмной кожи", active:true },
];

const ITEMS_KEY = "ss_items";
const USERS_KEY = "ss_users";
const SESSION_KEY = "ss_session";
const ADMIN_EMAIL = "admin@stanskill.gg";
const ADMIN_PASS  = "admin123";

function getItems(): ShopItem[] {
  try { const s = localStorage.getItem(ITEMS_KEY); return s ? JSON.parse(s) : DEFAULT_ITEMS; } catch { return DEFAULT_ITEMS; }
}
function saveItems(items: ShopItem[]) { localStorage.setItem(ITEMS_KEY, JSON.stringify(items)); }
function getUsers(): User[] {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); } catch { return []; }
}
function saveUsers(u: User[]) { localStorage.setItem(USERS_KEY, JSON.stringify(u)); }
function getSession(): User | null {
  try { const id = localStorage.getItem(SESSION_KEY); return id ? getUsers().find(u => u.id === id) ?? null : null; } catch { return null; }
}
function setSession(u: User | null) { if (u) { localStorage.setItem(SESSION_KEY, u.id); } else { localStorage.removeItem(SESSION_KEY); } }

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg }: { msg: string }) {
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] glass-dark border border-white/15 text-white px-6 py-3 rounded-2xl font-oswald tracking-wider animate-scale-in shadow-2xl text-sm whitespace-nowrap">
      {msg}
    </div>
  );
}
function useToast() {
  const [msg, setMsg] = useState<string | null>(null);
  const show = (m: string) => { setMsg(m); setTimeout(() => setMsg(null), 2800); };
  return { msg, show };
}

// ── Input ─────────────────────────────────────────────────────────────────────
function Input({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) {
  return (
    <div>
      {label && <label className="block text-xs text-gray-500 font-oswald tracking-wider mb-1.5">{label}</label>}
      <input {...props} className={`w-full glass border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-game-red/70 focus:shadow-[0_0_0_2px_rgba(220,38,38,.15)] transition-all bg-transparent ${props.className ?? ""}`} />
    </div>
  );
}

// ── Auth Modal ────────────────────────────────────────────────────────────────
function AuthModal({ onClose, onAuth }: { onClose: () => void; onAuth: (u: User) => void }) {
  const [mode, setMode]     = useState<AuthMode>("login");
  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [pass, setPass]     = useState("");
  const [err, setErr]       = useState("");

  const submit = () => {
    setErr("");
    if (!email || !pass) { setErr("Заполни все поля"); return; }
    if (mode === "login") {
      if (email === ADMIN_EMAIL && pass === ADMIN_PASS) {
        const admin: User = { id:"admin", name:"Admin", email:ADMIN_EMAIL, isAdmin:true, gold:999999, balance:999999, inventory:[], history:[] };
        const users = getUsers(); if (!users.find(u => u.id==="admin")) { users.push(admin); saveUsers(users); }
        setSession(admin); onAuth(admin); return;
      }
      const found = getUsers().find(u => u.email===email && u.password===pass);
      if (!found) { setErr("Неверный email или пароль"); return; }
      setSession(found); onAuth(found);
    } else {
      if (!name) { setErr("Введи никнейм"); return; }
      if (pass.length < 6) { setErr("Пароль минимум 6 символов"); return; }
      if (getUsers().find(u => u.email===email)) { setErr("Email уже используется"); return; }
      const u: User = { id:Date.now().toString(), name, email, password:pass, isAdmin:false, gold:500, balance:0,
        inventory:[], history:[{ id:1, type:"bonus", item:"Стартовый бонус", amount:500, currency:"gold", date:new Date().toISOString().slice(0,10) }] };
      saveUsers([...getUsers(), u]); setSession(u); onAuth(u);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm" onClick={e => { if (e.target===e.currentTarget) onClose(); }}>
      <div className="relative w-full max-w-md mx-4 glass-dark rounded-3xl border border-white/10 p-8 animate-scale-in shadow-[0_30px_80px_rgba(0,0,0,.7)]">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-600 hover:text-white transition-colors"><Icon name="X" size={18}/></button>
        <div className="text-center mb-7">
          <h2 className="font-oswald text-3xl font-bold tracking-widest">
            STAN<span className="text-game-red text-glow-red">SKILL</span>
          </h2>
          <div className="flex mt-5 rounded-xl overflow-hidden border border-white/10 bg-black/30">
            {(["login","register"] as AuthMode[]).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 font-oswald text-sm tracking-wider transition-all ${mode===m ? "bg-game-red text-white" : "text-gray-500 hover:text-white"}`}>
                {m==="login" ? "ВХОД" : "РЕГИСТРАЦИЯ"}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          {mode==="register" && <Input label="НИКНЕЙМ" value={name} onChange={e=>setName(e.target.value)} placeholder="ShadowBlade99"/>}
          <Input label="EMAIL" value={email} onChange={e=>setEmail(e.target.value)} type="email" placeholder="you@example.com"/>
          <Input label="ПАРОЛЬ" value={pass} onChange={e=>setPass(e.target.value)} type="password" placeholder="••••••" onKeyDown={e=>e.key==="Enter"&&submit()}/>
          {err && <p className="text-game-red text-sm text-center">{err}</p>}
          <button onClick={submit} className="w-full bg-game-red hover:bg-game-red-light text-white font-oswald tracking-widest py-3.5 rounded-xl transition-all hover:scale-[1.02] glow-red-sm mt-1">
            {mode==="login" ? "ВОЙТИ" : "СОЗДАТЬ АККАУНТ"}
          </button>
          {mode==="login" && (
            <p className="text-center text-xs text-gray-600">
              Нет аккаунта? <button onClick={()=>setMode("register")} className="text-game-red hover:underline">Зарегистрироваться</button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Admin Auth Modal ──────────────────────────────────────────────────────────
function AdminAuthModal({ onClose, onSuccess }: { onClose:()=>void; onSuccess:()=>void }) {
  const [email,setEmail] = useState(""); const [pass,setPass] = useState(""); const [err,setErr] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-sm mx-4 glass-dark rounded-3xl border border-game-red/30 p-8 animate-scale-in">
        <button onClick={onClose} className="absolute top-5 right-5 text-gray-600 hover:text-white"><Icon name="X" size={18}/></button>
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-game-red/15 border border-game-red/40 flex items-center justify-center mx-auto mb-3 glow-red-sm">
            <Icon name="ShieldAlert" size={24} className="text-game-red"/>
          </div>
          <h2 className="font-oswald text-xl text-white tracking-wider">ADMIN ACCESS</h2>
        </div>
        <div className="space-y-3">
          <Input type="email" placeholder="admin@stanskill.gg" value={email} onChange={e=>setEmail(e.target.value)}/>
          <Input type="password" placeholder="Пароль" value={pass} onChange={e=>setPass(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(email===ADMIN_EMAIL&&pass===ADMIN_PASS?onSuccess():setErr("Неверные данные"))}/>
          {err && <p className="text-game-red text-sm text-center">{err}</p>}
          <button onClick={()=>email===ADMIN_EMAIL&&pass===ADMIN_PASS?onSuccess():setErr("Неверные данные")}
            className="w-full bg-game-red hover:bg-game-red-light text-white font-oswald tracking-widest py-3 rounded-xl transition-all">
            ВОЙТИ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar({ page, setPage, user, onAuthOpen, onLogout }: {
  page:Page; setPage:(p:Page)=>void; user:User|null; onAuthOpen:()=>void; onLogout:()=>void;
}) {
  const navItems = [
    { key:"home",     label:"ГЛАВНАЯ",  icon:"Home"        },
    { key:"shop",     label:"МАГАЗИН",  icon:"ShoppingBag" },
    { key:"roulette", label:"РУЛЕТКА",  icon:"Dices"       },
  ] as { key:Page; label:string; icon:string }[];

  return (
    <nav className="fixed top-0 inset-x-0 z-40 h-16 border-b border-white/5 bg-black/80 backdrop-blur-xl">
      {/* Top accent line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-game-red to-transparent opacity-60"/>
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">
        <div className="flex items-center gap-6">
          <button onClick={()=>setPage("home")} className="font-oswald text-2xl font-bold tracking-widest">
            STAN<span className="text-game-red text-glow-red">SKILL</span>
          </button>
          <div className="hidden md:flex">
            {navItems.map(it => (
              <button key={it.key} onClick={()=>setPage(it.key)}
                className={`relative flex items-center gap-2 px-4 h-16 font-oswald text-sm tracking-wider transition-colors ${page===it.key ? "text-white" : "text-gray-500 hover:text-gray-300"}`}>
                <Icon name={it.icon} size={14}/>
                {it.label}
                {page===it.key && <span className="absolute bottom-0 inset-x-2 h-[2px] bg-game-red rounded-t-full shadow-[0_0_8px_rgba(220,38,38,.8)]"/>}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-game-gold/10 border border-game-gold/25">
                <span className="text-game-gold font-bold font-oswald text-sm">{user.gold.toLocaleString()}</span>
                <span className="text-game-gold/50 text-xs">G</span>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/25">
                <span className="text-green-400 font-bold font-oswald text-sm">{user.balance.toLocaleString()} ₽</span>
              </div>
              {user.isAdmin && (
                <button onClick={()=>setPage("admin")} className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all ${page==="admin"?"bg-game-red/20 border-game-red/60 text-game-red glow-red-sm":"border-white/10 text-gray-500 hover:border-game-red/40 hover:text-game-red"}`}>
                  <Icon name="Shield" size={15}/>
                </button>
              )}
              <button onClick={()=>setPage("profile")}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${page==="profile"?"border-game-red/50 bg-game-red/10 text-white":"border-white/10 text-gray-400 hover:border-white/25 hover:text-white"}`}>
                <div className="w-6 h-6 rounded-lg bg-game-red/20 flex items-center justify-center text-xs">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-oswald text-sm hidden sm:inline">{user.name}</span>
              </button>
              <button onClick={onLogout} className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center text-gray-600 hover:text-game-red hover:border-game-red/40 transition-all">
                <Icon name="LogOut" size={14}/>
              </button>
            </>
          ) : (
            <button onClick={onAuthOpen} className="bg-game-red hover:bg-game-red-light text-white font-oswald tracking-wider px-5 py-2 rounded-xl text-sm transition-all hover:scale-105 glow-red-sm">
              ВОЙТИ
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

// ── Item Card ─────────────────────────────────────────────────────────────────
function ItemCard({ item, onBuy, owned }: { item:ShopItem; onBuy?:()=>void; owned?:boolean }) {
  const r = RC[item.rarity] ?? RC.common;
  return (
    <div className={`relative glass rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 group ${r.cls.split(" ").find(c=>c.startsWith("border-")) ?? "border-white/10"}`}>
      {/* Shimmer on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer pointer-events-none rounded-2xl"/>
      <div className="relative h-44 overflow-hidden bg-gradient-to-b from-black/20 to-black/60">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"/>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>
        <span className={`absolute top-2.5 left-2.5 text-xs px-2.5 py-0.5 rounded-lg border font-oswald tracking-wider backdrop-blur-sm ${r.cls}`}>
          {r.label}
        </span>
        {owned && (
          <span className="absolute top-2.5 right-2.5 text-xs px-2 py-0.5 rounded-lg bg-green-500/80 text-white font-oswald backdrop-blur-sm">✓</span>
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-oswald text-sm text-white mb-1 leading-tight">{item.name}</h3>
        <p className="text-xs text-gray-600 mb-3 flex-1 leading-relaxed">{item.description}</p>
        <div className="flex items-center justify-between">
          {item.priceType==="gold"
            ? <span className="text-game-gold font-bold font-oswald">{item.price.toLocaleString()} G</span>
            : <span className="text-green-400 font-bold font-oswald">{item.price.toLocaleString()} ₽</span>}
          {!owned && onBuy && (
            <button onClick={onBuy} className="text-xs bg-game-red hover:bg-game-red-light text-white px-4 py-1.5 rounded-lg font-oswald tracking-wider transition-all hover:scale-105 glow-red-sm">
              КУПИТЬ
            </button>
          )}
          {owned && <span className="text-xs text-green-400 font-oswald">В инвентаре</span>}
        </div>
      </div>
    </div>
  );
}

// ── Home Page ──────────────────────────────────────────────────────────────────
function HomePage({ setPage, user, onAuthOpen }: { setPage:(p:Page)=>void; user:User|null; onAuthOpen:()=>void }) {
  const items = getItems().filter(i=>i.active);
  const featured = items.filter(i=>i.rarity==="legendary"||i.rarity==="epic").slice(0,3);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        {/* BG glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-game-red/6 rounded-full blur-[140px] pointer-events-none"/>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"/>
        <div className="absolute top-20 right-0 w-[300px] h-[300px] bg-game-red/5 rounded-full blur-[80px] pointer-events-none"/>

        {/* Floating weapons */}
        <div className="absolute left-[5%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none" style={{animationDelay:"0s"}}>
          <div className="animate-float opacity-25">
            <img src={IMGS.ak47} alt="" className="w-52 rounded-2xl rotate-[-8deg]" style={{filter:"drop-shadow(0 0 20px rgba(220,38,38,.4))"}}/>
          </div>
        </div>
        <div className="absolute right-[5%] top-1/2 -translate-y-1/2 hidden xl:block pointer-events-none" style={{animationDelay:"1.5s"}}>
          <div className="animate-float opacity-25">
            <img src={IMGS.knife} alt="" className="w-44 rounded-2xl rotate-[6deg]" style={{filter:"drop-shadow(0 0 20px rgba(251,191,36,.4))"}}/>
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2.5 glass border border-game-red/30 rounded-full px-5 py-2 mb-10">
            <span className="w-2 h-2 bg-game-red rounded-full animate-pulse shadow-[0_0_8px_rgba(220,38,38,1)]"/>
            <span className="text-game-red text-xs font-oswald tracking-widest">LIVE · 1,247 игроков онлайн</span>
          </div>

          <h1 className="font-oswald text-[80px] md:text-[120px] font-bold text-white leading-none mb-4" style={{letterSpacing:"-0.02em"}}>
            STAN<span className="text-game-red text-glow-red">SKILL</span>
          </h1>

          {/* Divider line */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-game-red/50"/>
            <span className="text-gray-500 text-xs tracking-[0.3em] font-oswald">ИГРОВАЯ ПЛАТФОРМА</span>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-game-red/50"/>
          </div>

          <p className="text-gray-400 text-lg mb-12 tracking-wide">Покупай оружие · Крути рулетку · Выводи деньги</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={()=>setPage("roulette")}
              className="relative overflow-hidden group/btn bg-game-red hover:bg-game-red-light text-white font-oswald text-lg tracking-widest px-12 py-4 rounded-2xl transition-all duration-300 hover:scale-105 glow-red animate-pulse-red">
              <span className="relative z-10">🎰 КРУТИТЬ РУЛЕТКУ</span>
              <div className="absolute inset-0 bg-white/0 group-hover/btn:bg-white/10 transition-all duration-300"/>
            </button>
            <button onClick={()=>setPage("shop")}
              className="glass border border-white/15 hover:border-white/30 text-white font-oswald text-lg tracking-widest px-12 py-4 rounded-2xl transition-all duration-300 hover:scale-105">
              🛒 МАГАЗИН
            </button>
          </div>

          {!user && (
            <div className="mt-8 glass border border-game-gold/20 rounded-2xl px-6 py-3 inline-flex items-center gap-3">
              <span className="text-game-gold text-lg">🎁</span>
              <span className="text-gray-300 text-sm">Регистрация даёт <span className="text-game-gold font-bold font-oswald">500 GOLD</span> бонуса</span>
              <button onClick={onAuthOpen} className="text-game-red text-xs font-oswald tracking-wider hover:underline">ПОЛУЧИТЬ →</button>
            </div>
          )}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="border-y border-white/5 py-8" style={{background:"linear-gradient(to right, rgba(220,38,38,.03), transparent, rgba(220,38,38,.03))"}}>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { v:"1,247",   l:"Онлайн",           icon:"Users",      c:"text-game-red" },
            { v:"500+",    l:"Предметов",         icon:"Package",    c:"text-blue-400" },
            { v:"₽84,500", l:"Выплачено сегодня", icon:"TrendingUp", c:"text-green-400" },
            { v:"12,890",  l:"Рулеток сыграно",   icon:"Dices",      c:"text-game-gold" },
          ].map((s,i) => (
            <div key={i} className="text-center group">
              <div className={`flex justify-center mb-2 ${s.c} transition-transform group-hover:scale-110`}><Icon name={s.icon} size={24}/></div>
              <div className="font-oswald text-2xl font-bold text-white">{s.v}</div>
              <div className="text-xs text-gray-600 tracking-widest uppercase mt-0.5">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured ── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="font-oswald text-4xl font-bold text-white tracking-wider">ТОПОВЫЕ ПРЕДМЕТЫ</h2>
            <div className="h-1 w-16 bg-game-red rounded-full mt-2 shadow-[0_0_8px_rgba(220,38,38,.8)]"/>
          </div>
          <button onClick={()=>setPage("shop")} className="glass border border-white/10 hover:border-game-red/40 text-gray-400 hover:text-game-red font-oswald text-sm tracking-wider px-4 py-2 rounded-xl transition-all flex items-center gap-1.5">
            ВСЕ <Icon name="ArrowRight" size={14}/>
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map(item => (
            <ItemCard key={item.id} item={item} onBuy={()=>setPage("shop")}/>
          ))}
        </div>
      </section>

      {/* ── Exchange banner ── */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        <div className="relative overflow-hidden rounded-3xl border border-game-gold/20 p-10 md:p-14"
          style={{background:"linear-gradient(135deg, rgba(251,191,36,.05) 0%, rgba(0,0,0,0) 60%, rgba(251,191,36,.03) 100%)"}}>
          <div className="absolute inset-0 grid-bg opacity-30"/>
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-game-gold/6 rounded-full blur-[60px]"/>
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="font-oswald text-4xl font-bold text-white tracking-wider mb-2">💱 ОБМЕН ГОЛДА</h2>
              <p className="text-gray-400 text-lg">1 000 GOLD = 100 ₽ · Вывод в любое время без комиссии</p>
            </div>
            <div className="flex gap-3">
              <button onClick={user?undefined:onAuthOpen} className="bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-widest px-8 py-3.5 rounded-2xl transition-all hover:scale-105 font-bold">
                КУПИТЬ GOLD
              </button>
              <button onClick={user?undefined:onAuthOpen} className="glass border border-game-gold/40 text-game-gold font-oswald tracking-widest px-8 py-3.5 rounded-2xl hover:bg-game-gold/10 transition-all">
                ВЫВЕСТИ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Shop Page ──────────────────────────────────────────────────────────────────
function ShopPage({ user, setUser, onAuthOpen }: { user:User|null; setUser:(u:User)=>void; onAuthOpen:()=>void }) {
  const [filter, setFilter] = useState<string>("all");
  const { msg, show } = useToast();
  const [items, setItems] = useState<ShopItem[]>(getItems().filter(i=>i.active));

  useEffect(() => { setItems(getItems().filter(i=>i.active)); }, []);

  const types = ["all","pistol","glove","knife","app"];
  const typeLabel: Record<string,string> = { all:"ВСЕ", pistol:"🔫 ПИСТОЛЕТЫ", glove:"🧤 ПЕРЧАТКИ", knife:"🔪 НОЖИ", app:"⚡ ПРИЛОЖЕНИЯ" };
  const filtered = items.filter(i => filter==="all" || i.type===filter);

  const buy = (item: ShopItem) => {
    if (!user) { onAuthOpen(); return; }
    if (item.priceType==="gold") {
      if (user.gold < item.price) { show("❌ Недостаточно голда!"); return; }
      if (user.inventory.some(i=>i.name===item.name)) { show("Этот предмет уже в инвентаре"); return; }
      const u: User = { ...user, gold:user.gold-item.price,
        inventory:[...user.inventory,{id:Date.now(),name:item.name,type:item.type,rarity:item.rarity,image:item.image,value:item.price}],
        history:[{id:Date.now(),type:"purchase",item:item.name,amount:-item.price,currency:"gold",date:new Date().toISOString().slice(0,10)},...user.history] };
      saveUsers(getUsers().map(x=>x.id===user.id?{...x,...u}:x)); setUser(u); setSession(u);
      show(`✅ ${item.name} добавлен в инвентарь!`);
    } else { show("💳 Оплата картой — скоро"); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {msg && <Toast msg={msg}/>}
      <div className="mb-8">
        <h1 className="font-oswald text-4xl font-bold text-white tracking-wider mb-1">МАГАЗИН</h1>
        <div className="h-1 w-14 bg-game-red rounded-full mb-3 shadow-[0_0_8px_rgba(220,38,38,.8)]"/>
        <p className="text-gray-600">Баланс: <span className="text-game-gold font-bold font-oswald">{user?.gold.toLocaleString()??"—"} GOLD</span></p>
      </div>
      <div className="flex gap-2 flex-wrap mb-8">
        {types.map(t => (
          <button key={t} onClick={()=>setFilter(t)}
            className={`font-oswald text-sm tracking-wider px-4 py-2 rounded-xl border transition-all ${filter===t?"bg-game-red border-game-red text-white glow-red-sm":"glass border-white/10 text-gray-500 hover:text-white hover:border-white/25"}`}>
            {typeLabel[t]}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map(item => (
          <ItemCard key={item.id} item={item} onBuy={()=>buy(item)} owned={user?.inventory.some(i=>i.name===item.name)}/>
        ))}
        {filtered.length===0 && (
          <div className="col-span-full text-center py-20 text-gray-700">
            <Icon name="Package" size={48} className="mx-auto mb-3 opacity-30"/>
            <p className="font-oswald">Нет предметов в этой категории</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Roulette Page ─────────────────────────────────────────────────────────────
function RoulettePage({ user, setUser, onAuthOpen }: { user:User|null; setUser:(u:User)=>void; onAuthOpen:()=>void }) {
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner]     = useState<typeof ROULETTE_ITEMS[0] | null>(null);
  const [won, setWon]           = useState(false);
  const [bet, setBet]           = useState(100);
  const stripRef = useRef<HTMLDivElement>(null);
  const { msg, show } = useToast();

  // Items pool for roulette (uses real images)
  const ALL_ITEMS = getItems().filter(i => i.active);
  const ROULETTE_ITEMS = [
    ...ALL_ITEMS.map(i=>({ name:i.name, image:i.image, rarity:i.rarity, value:i.price, isGold:false })),
    { name:"500 Gold",  image:IMGS.gold, rarity:"rare",      value:500,  isGold:true },
    { name:"1000 Gold", image:IMGS.gold, rarity:"epic",      value:1000, isGold:true },
    { name:"200 Gold",  image:IMGS.gold, rarity:"uncommon",  value:200,  isGold:true },
    { name:"2500 Gold", image:IMGS.gold, rarity:"legendary", value:2500, isGold:true },
  ];

  const TILE_W    = 160; // px including gap
  const TILE_GAP  = 8;
  const POOL_SIZE = 60;

  // Generate big pool for smooth animation
  const pool = Array.from({ length:POOL_SIZE }, (_, i) => ROULETTE_ITEMS[i % ROULETTE_ITEMS.length]);

  const spin = () => {
    if (!user) { onAuthOpen(); return; }
    if (spinning) return;
    if (user.gold < bet) { show("❌ Недостаточно голда!"); return; }

    setSpinning(true); setWinner(null); setWon(false);

    // Pick a winner slot in the 2nd half of pool (far enough to animate)
    const winIdx = Math.floor(POOL_SIZE * 0.6) + Math.floor(Math.random() * Math.floor(POOL_SIZE * 0.2));
    const winItem = ROULETTE_ITEMS[Math.floor(Math.random() * ROULETTE_ITEMS.length)];
    // Override the tile at winIdx
    pool[winIdx] = winItem;

    // Center tile on screen: strip left = container_center - winIdx*TILE_W - TILE_W/2
    const containerW = stripRef.current?.parentElement?.clientWidth ?? 800;
    const targetX = winIdx * (TILE_W + TILE_GAP) - containerW / 2 + TILE_W / 2;

    if (stripRef.current) {
      stripRef.current.style.transition = "none";
      stripRef.current.style.transform  = "translateX(0)";
      // Force reflow
      void stripRef.current.offsetWidth;
      stripRef.current.style.transition = "transform 5s cubic-bezier(0.05, 0.85, 0.2, 1)";
      stripRef.current.style.transform  = `translateX(-${targetX}px)`;
    }

    setTimeout(() => {
      const goldWon = winItem.isGold ? winItem.value : 0;
      const newInvItem = !winItem.isGold
        ? { id:Date.now(), name:winItem.name, type:"pistol", rarity:winItem.rarity, image:winItem.image, value:winItem.value }
        : null;
      const u: User = {
        ...user,
        gold: user.gold - bet + goldWon,
        inventory: newInvItem ? [...user.inventory, newInvItem] : user.inventory,
        history: [{ id:Date.now(), type:"roulette", item:winItem.name, amount:winItem.isGold?goldWon-bet:-bet, currency:"gold", date:new Date().toISOString().slice(0,10) }, ...user.history],
      };
      saveUsers(getUsers().map(x=>x.id===user.id?{...x,...u}:x));
      setUser(u); setSession(u); setWinner(winItem); setWon(true); setSpinning(false);
    }, 5100);
  };

  const betOpts = [50,100,250,500,1000];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {msg && <Toast msg={msg}/>}
      <div className="mb-8 text-center">
        <h1 className="font-oswald text-5xl font-bold text-white tracking-wider mb-1">РУЛЕТКА</h1>
        <div className="h-1 w-14 bg-game-red rounded-full mx-auto mb-3 shadow-[0_0_8px_rgba(220,38,38,.8)]"/>
        <p className="text-gray-600 text-sm">Баланс: <span className="text-game-gold font-bold font-oswald">{user?.gold.toLocaleString()??"—"} GOLD</span></p>
      </div>

      {/* ── Roulette strip ── */}
      <div className={`relative overflow-hidden rounded-2xl border mb-8 scanlines ${won?"animate-winner-flash border-game-red/80":"border-white/10"}`}
        style={{ height:200, background:"linear-gradient(to bottom, #0a0a0a, #111, #0a0a0a)" }}>

        {/* Center marker */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[2px] bg-gradient-to-b from-transparent via-game-red to-transparent z-20 shadow-[0_0_12px_rgba(220,38,38,.9)]"/>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20" style={{width:0,height:0,borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderTop:"14px solid #dc2626",filter:"drop-shadow(0 0 6px rgba(220,38,38,.9))"}}/>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-20 rotate-180" style={{width:0,height:0,borderLeft:"10px solid transparent",borderRight:"10px solid transparent",borderTop:"14px solid #dc2626",filter:"drop-shadow(0 0 6px rgba(220,38,38,.9))"}}/>

        {/* Strip */}
        <div className="absolute inset-y-0 flex items-center" style={{left:0,paddingLeft:`calc(50% - ${TILE_W/2}px)`}}>
          <div ref={stripRef} className="flex items-center" style={{gap:TILE_GAP}}>
            {pool.map((item, i) => {
              const r = RC[item.rarity] ?? RC.common;
              return (
                <div key={i} className={`flex-shrink-0 rounded-xl border overflow-hidden ${r.cls.split(" ").find(c=>c.startsWith("border-"))??"border-white/10"}`}
                  style={{ width:TILE_W-TILE_GAP, height:168 }}>
                  <img src={item.image} alt={item.name} className="w-full h-28 object-cover"/>
                  <div className="px-2 py-1.5 bg-black/60">
                    <p className="text-xs font-oswald text-white leading-tight truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.value} G</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fade edges */}
        <div className="absolute left-0 inset-y-0 w-32 z-10 pointer-events-none" style={{background:"linear-gradient(to right, #0d0d0d, transparent)"}}/>
        <div className="absolute right-0 inset-y-0 w-32 z-10 pointer-events-none" style={{background:"linear-gradient(to left, #0d0d0d, transparent)"}}/>
      </div>

      {/* ── Winner ── */}
      {winner && (
        <div className={`mb-6 p-5 rounded-2xl border text-center animate-scale-in flex items-center justify-center gap-5 ${(RC[winner.rarity]??RC.common).cls} ${(RC[winner.rarity]??RC.common).glow}`}>
          <img src={winner.image} alt={winner.name} className="w-16 h-16 rounded-xl object-cover"/>
          <div className="text-left">
            <p className="font-oswald text-2xl font-bold">{winner.name}</p>
            <p className="text-sm opacity-70">{(RC[winner.rarity]??RC.common).label} · {winner.value} Gold</p>
          </div>
        </div>
      )}

      {/* ── Controls ── */}
      <div className="max-w-md mx-auto space-y-5">
        <div>
          <label className="block text-xs text-gray-600 font-oswald tracking-widest mb-2.5">СТАВКА (GOLD)</label>
          <div className="flex gap-2 flex-wrap">
            {betOpts.map(b => (
              <button key={b} onClick={()=>setBet(b)}
                className={`font-oswald text-sm px-5 py-2.5 rounded-xl border transition-all ${bet===b?"bg-game-red border-game-red text-white glow-red-sm":"glass border-white/10 text-gray-500 hover:border-white/25 hover:text-white"}`}>
                {b}G
              </button>
            ))}
          </div>
        </div>
        <button onClick={spin} disabled={spinning}
          className={`w-full font-oswald text-xl tracking-widest py-5 rounded-2xl border transition-all duration-300 ${
            spinning
              ? "border-gray-800 text-gray-700 cursor-not-allowed bg-transparent"
              : "bg-game-red hover:bg-game-red-light border-game-red text-white hover:scale-[1.02] glow-red animate-pulse-red"}`}>
          {spinning ? "⏳  КРУТИТСЯ..." : `🎰  КРУТИТЬ ЗА ${bet} GOLD`}
        </button>
        <p className="text-center text-xs text-gray-700">Случайный предмет или голд · Больше ставка — выше шанс редкого дропа</p>
      </div>
    </div>
  );
}

// ── Profile Page ──────────────────────────────────────────────────────────────
function ProfilePage({ user, setUser }: { user:User; setUser:(u:User)=>void }) {
  const [tab, setTab] = useState<"inventory"|"history"|"wallet">("inventory");
  const { msg, show } = useToast();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {msg && <Toast msg={msg}/>}
      {/* Header card */}
      <div className="relative overflow-hidden glass rounded-3xl border border-white/8 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-gradient-to-r from-game-red/5 to-transparent pointer-events-none"/>
        <div className="relative w-20 h-20 rounded-2xl bg-game-red/15 border border-game-red/40 flex items-center justify-center text-3xl font-bold font-oswald text-white glow-red-sm">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1 flex-wrap">
            <h1 className="font-oswald text-2xl font-bold text-white">{user.name}</h1>
            {user.isAdmin && <span className="text-xs glass border border-game-red/50 text-game-red px-2.5 py-0.5 rounded-lg font-oswald">ADMIN</span>}
          </div>
          <p className="text-xs text-gray-600 mb-3">{user.email}</p>
          <div className="flex flex-wrap gap-5 text-sm">
            <div><span className="text-gray-600">Предметов: </span><span className="text-white font-oswald font-bold">{user.inventory.length}</span></div>
            <div><span className="text-gray-600">Голд: </span><span className="text-game-gold font-oswald font-bold">{user.gold.toLocaleString()}</span></div>
            <div><span className="text-gray-600">Баланс: </span><span className="text-green-400 font-oswald font-bold">{user.balance.toLocaleString()} ₽</span></div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button onClick={()=>show("💳 Оплата — скоро доступно")} className="bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-wider px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105">
            💱 ОБМЕНЯТЬ
          </button>
          <button onClick={()=>show("💸 Вывод — скоро доступно")} className="glass border border-green-500/40 text-green-400 font-oswald tracking-wider px-5 py-2.5 rounded-xl text-sm hover:bg-green-500/10 transition-all">
            💸 ВЫВЕСТИ
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-white/5 pb-px">
        {([
          {k:"inventory",l:"🎒 ИНВЕНТАРЬ"},
          {k:"history",  l:"📜 ИСТОРИЯ"},
          {k:"wallet",   l:"💳 КОШЕЛЁК"},
        ] as {k:typeof tab;l:string}[]).map(t => (
          <button key={t.k} onClick={()=>setTab(t.k)}
            className={`relative font-oswald text-sm tracking-wider px-5 py-3 transition-all ${tab===t.k?"text-white":"text-gray-600 hover:text-gray-400"}`}>
            {t.l}
            {tab===t.k && <span className="absolute bottom-0 inset-x-2 h-[2px] bg-game-red rounded-t-full shadow-[0_0_6px_rgba(220,38,38,.8)]"/>}
          </button>
        ))}
      </div>

      {tab==="inventory" && (
        user.inventory.length===0
          ? <div className="text-center py-24 text-gray-700">
              <Icon name="Package" size={52} className="mx-auto mb-4 opacity-20"/>
              <p className="font-oswald text-xl">Инвентарь пуст</p>
              <p className="text-sm mt-1 text-gray-700">Купи предметы в магазине или крути рулетку</p>
            </div>
          : <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-up">
              {user.inventory.map(item => {
                const r = RC[item.rarity]??RC.common;
                return (
                  <div key={item.id} className={`glass rounded-2xl border overflow-hidden hover:scale-[1.05] transition-all cursor-pointer group ${r.cls.split(" ").find(c=>c.startsWith("border-"))??"border-white/10"}`}>
                    <img src={item.image} alt={item.name} className="w-full h-28 object-cover group-hover:scale-110 transition-transform duration-500"/>
                    <div className="p-2.5">
                      <p className="font-oswald text-xs text-white leading-tight truncate">{item.name}</p>
                      <p className="text-xs text-gray-600 mt-0.5">{item.value}G</p>
                    </div>
                  </div>
                );
              })}
            </div>
      )}

      {tab==="history" && (
        user.history.length===0
          ? <div className="text-center py-24 text-gray-700 font-oswald">История пуста</div>
          : <div className="space-y-3 animate-fade-up">
              {user.history.map(h => (
                <div key={h.id} className="glass rounded-2xl border border-white/5 p-4 flex items-center justify-between hover:border-white/10 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${h.amount>0?"bg-green-500/15 text-green-400":"bg-game-red/15 text-game-red"}`}>
                      <Icon name={h.amount>0?"ArrowDownLeft":"ArrowUpRight"} size={18}/>
                    </div>
                    <div>
                      <p className="font-oswald text-white text-sm">{h.item}</p>
                      <p className="text-xs text-gray-600">{h.date} · {h.type==="purchase"?"Покупка":h.type==="roulette"?"Рулетка":h.type==="bonus"?"Бонус":"Операция"}</p>
                    </div>
                  </div>
                  <span className={`font-oswald font-bold ${h.amount>0?"text-green-400":"text-game-red"}`}>
                    {h.amount>0?"+":""}{h.amount} {h.currency==="gold"?"G":"₽"}
                  </span>
                </div>
              ))}
            </div>
      )}

      {tab==="wallet" && (
        <div className="max-w-lg space-y-5 animate-fade-up">
          <div className="relative overflow-hidden glass rounded-3xl border border-game-gold/25 p-7">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-game-gold/8 rounded-full blur-2xl"/>
            <p className="text-xs text-gray-600 font-oswald tracking-widest mb-1">БАЛАНС ГОЛДА</p>
            <p className="font-oswald text-5xl font-bold text-game-gold glow-gold mb-5">{user.gold.toLocaleString()} G</p>
            <div className="flex gap-3">
              <button onClick={()=>show("💳 Оплата картой — скоро")} className="flex-1 bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-wider py-3 rounded-xl text-sm transition-all">КУПИТЬ</button>
              <button onClick={()=>show("⚙️ Конвертация — скоро")} className="flex-1 glass border border-game-gold/40 text-game-gold font-oswald tracking-wider py-3 rounded-xl text-sm hover:bg-game-gold/10 transition-all">→ РУБЛИ</button>
            </div>
          </div>
          <div className="relative overflow-hidden glass rounded-3xl border border-green-500/25 p-7">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-green-500/5 rounded-full blur-2xl"/>
            <p className="text-xs text-gray-600 font-oswald tracking-widest mb-1">РУБЛЁВЫЙ СЧЁТ</p>
            <p className="font-oswald text-5xl font-bold text-green-400 mb-1">{user.balance.toLocaleString()} ₽</p>
            <p className="text-xs text-gray-700 mb-5">1 000 GOLD = 100 ₽ · Мин. вывод 500 ₽</p>
            <button onClick={()=>show("💸 Вывод — скоро доступно")} className="w-full glass border border-green-500/40 text-green-400 font-oswald tracking-wider py-3 rounded-xl text-sm hover:bg-green-500/10 transition-all">
              💸 ВЫВЕСТИ НА КАРТУ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Admin Page ────────────────────────────────────────────────────────────────
function AdminPage() {
  const [items, setItemsState] = useState<(ShopItem&{active:boolean})[]>(getItems());
  const { msg, show } = useToast();
  const users = getUsers().filter(u=>u.id!=="admin");

  // Add-item form
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name:"", type:"pistol", image:"", rarity:"rare", price:"", priceType:"gold", description:"" });

  const persist = (next: ShopItem[]) => { saveItems(next); setItemsState(next); };

  const toggleActive = (id:number) => persist(items.map(i=>i.id===id?{...i,active:!i.active}:i));
  const deleteItem   = (id:number) => { if (!confirm("Удалить товар?")) return; persist(items.filter(i=>i.id!==id)); show("🗑️ Товар удалён"); };

  const [editId,setEditId]     = useState<number|null>(null);
  const [editPrice,setEditPrice] = useState("");

  const savePrice = (id:number) => {
    const p = parseInt(editPrice); if (!p||p<=0) return;
    persist(items.map(i=>i.id===id?{...i,price:p}:i));
    setEditId(null); show("✅ Цена обновлена");
  };

  const addItem = () => {
    if (!form.name||!form.price||!form.image) { show("Заполни имя, цену и URL картинки"); return; }
    const newItem: ShopItem = { id:Date.now(), name:form.name, type:form.type, image:form.image,
      rarity:form.rarity, price:parseInt(form.price), priceType:form.priceType, description:form.description, active:true };
    persist([...items, newItem]);
    setForm({name:"",type:"pistol",image:"",rarity:"rare",price:"",priceType:"gold",description:""});
    setShowForm(false); show("✅ Товар добавлен!");
  };

  const totalSales = users.reduce((s,u)=>s+u.history.filter(h=>h.type==="purchase").length,0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {msg && <Toast msg={msg}/>}

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
        <div>
          <h1 className="font-oswald text-4xl font-bold text-white tracking-wider">ADMIN PANEL</h1>
          <div className="h-1 w-14 bg-game-red rounded-full mt-2 shadow-[0_0_8px_rgba(220,38,38,.8)]"/>
        </div>
        <button onClick={()=>setShowForm(!showForm)}
          className={`flex items-center gap-2 font-oswald tracking-wider px-5 py-2.5 rounded-xl text-sm transition-all hover:scale-105 ${showForm?"bg-gray-700 text-white border border-white/15":"bg-game-red text-white glow-red-sm"}`}>
          <Icon name={showForm?"X":"Plus"} size={16}/>
          {showForm?"ОТМЕНА":"ДОБАВИТЬ ТОВАР"}
        </button>
      </div>

      {/* Add item form */}
      {showForm && (
        <div className="glass rounded-3xl border border-game-red/25 p-6 mb-8 animate-scale-in">
          <h2 className="font-oswald text-xl text-white tracking-wider mb-5">НОВЫЙ ТОВАР</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Input label="НАЗВАНИЕ" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="AK-47 | Fire Storm"/>
            <div>
              <label className="block text-xs text-gray-500 font-oswald tracking-wider mb-1.5">КАТЕГОРИЯ</label>
              <select value={form.type} onChange={e=>setForm({...form,type:e.target.value})}
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-game-red/70 bg-transparent">
                {["pistol","glove","knife","app"].map(t=><option key={t} value={t} className="bg-game-dark-2">{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 font-oswald tracking-wider mb-1.5">РЕДКОСТЬ</label>
              <select value={form.rarity} onChange={e=>setForm({...form,rarity:e.target.value})}
                className="w-full glass border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-game-red/70 bg-transparent">
                {Object.keys(RC).map(r=><option key={r} value={r} className="bg-game-dark-2">{RC[r].label}</option>)}
              </select>
            </div>
            <Input label="URL ИЗОБРАЖЕНИЯ" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} placeholder="https://..."/>
            <div>
              <label className="block text-xs text-gray-500 font-oswald tracking-wider mb-1.5">ЦЕНА</label>
              <div className="flex gap-2">
                <input type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} placeholder="0"
                  className="flex-1 glass border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-game-red/70 bg-transparent"/>
                <select value={form.priceType} onChange={e=>setForm({...form,priceType:e.target.value})}
                  className="glass border border-white/10 rounded-xl px-3 py-3 text-white focus:outline-none bg-transparent">
                  <option value="gold" className="bg-game-dark-2">GOLD</option>
                  <option value="rub"  className="bg-game-dark-2">₽</option>
                </select>
              </div>
            </div>
            <Input label="ОПИСАНИЕ" value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Краткое описание предмета"/>
          </div>
          {/* Preview */}
          {form.image && (
            <div className="mt-4 flex items-center gap-4">
              <img src={form.image} alt="preview" className="w-20 h-20 rounded-xl object-cover border border-white/10" onError={e=>{(e.target as HTMLImageElement).style.display="none"}}/>
              <div>
                <p className="font-oswald text-white">{form.name||"Название"}</p>
                <p className="text-xs text-gray-600">{form.description||"Описание"}</p>
              </div>
            </div>
          )}
          <button onClick={addItem} className="mt-5 bg-game-red hover:bg-game-red-light text-white font-oswald tracking-widest px-8 py-3 rounded-xl transition-all hover:scale-105 glow-red-sm">
            ДОБАВИТЬ ТОВАР
          </button>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {l:"Пользователей", v:users.length,                            icon:"Users",       c:"text-blue-400"},
          {l:"Активных",      v:items.filter(i=>i.active).length,        icon:"CheckCircle", c:"text-green-400"},
          {l:"Продаж всего",  v:totalSales,                              icon:"ShoppingBag", c:"text-game-gold"},
          {l:"Всего товаров", v:items.length,                            icon:"Package",     c:"text-game-red"},
        ].map((s,i)=>(
          <div key={i} className="glass rounded-2xl border border-white/5 p-5">
            <div className={`mb-1.5 ${s.c}`}><Icon name={s.icon} size={20}/></div>
            <div className="font-oswald text-3xl font-bold text-white">{s.v}</div>
            <div className="text-xs text-gray-600 mt-0.5">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Items table */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="font-oswald text-white tracking-wider">УПРАВЛЕНИЕ ТОВАРАМИ ({items.length})</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-600 font-oswald tracking-wider border-b border-white/5">
                <th className="px-5 py-3 text-left">ТОВАР</th>
                <th className="px-5 py-3 text-left">КАТ.</th>
                <th className="px-5 py-3 text-left">ЦЕНА</th>
                <th className="px-5 py-3 text-left">РЕДКОСТЬ</th>
                <th className="px-5 py-3 text-left">СТАТУС</th>
                <th className="px-5 py-3 text-left"></th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const r = RC[item.rarity]??RC.common;
                return (
                  <tr key={item.id} className="border-b border-white/5 hover:bg-white/[0.015] transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-xl object-cover" onError={e=>{(e.target as HTMLImageElement).src=IMGS.app}}/>
                        <span className="font-oswald text-white text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-sm capitalize">{item.type}</td>
                    <td className="px-5 py-3">
                      {editId===item.id ? (
                        <div className="flex items-center gap-2">
                          <input value={editPrice} onChange={e=>setEditPrice(e.target.value)} type="number"
                            className="w-20 glass border border-game-red/40 text-white rounded-lg px-2 py-1 text-sm font-oswald focus:outline-none"/>
                          <button onClick={()=>savePrice(item.id)} className="text-green-400 hover:text-green-300 transition-colors"><Icon name="Check" size={14}/></button>
                          <button onClick={()=>setEditId(null)} className="text-gray-600 hover:text-white transition-colors"><Icon name="X" size={14}/></button>
                        </div>
                      ) : (
                        <button onClick={()=>{setEditId(item.id);setEditPrice(item.price.toString());}}
                          className="flex items-center gap-1.5 group/price text-game-gold font-oswald font-bold hover:text-white transition-colors">
                          {item.price.toLocaleString()} {item.priceType==="gold"?"G":"₽"}
                          <Icon name="Pencil" size={11} className="opacity-0 group-hover/price:opacity-100 transition-opacity"/>
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-oswald ${r.cls}`}>{r.label}</span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={()=>toggleActive(item.id)}
                          className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${item.active?"bg-game-red":"bg-gray-800"}`}>
                          <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${item.active?"translate-x-4":""}`}/>
                        </button>
                        <span className={`text-xs font-oswald ${item.active?"text-green-400":"text-gray-700"}`}>{item.active?"ВКЛ":"ОТКЛ"}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <button onClick={()=>deleteItem(item.id)} className="text-gray-700 hover:text-game-red transition-colors">
                        <Icon name="Trash2" size={14}/>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Users */}
      <div className="glass rounded-3xl border border-white/5 overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-white/5">
          <h2 className="font-oswald text-white tracking-wider">ПОЛЬЗОВАТЕЛИ ({users.length})</h2>
        </div>
        {users.length===0
          ? <p className="px-5 py-8 text-center text-gray-700 font-oswald text-sm">Нет зарегистрированных пользователей</p>
          : <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-600 font-oswald tracking-wider border-b border-white/5">
                    <th className="px-5 py-3 text-left">ИГРОК</th><th className="px-5 py-3 text-left">EMAIL</th>
                    <th className="px-5 py-3 text-left">ГОЛД</th><th className="px-5 py-3 text-left">ПРЕДМЕТОВ</th>
                    <th className="px-5 py-3 text-left">ПОКУПОК</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u=>(
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.015]">
                      <td className="px-5 py-3 font-oswald text-white">{u.name}</td>
                      <td className="px-5 py-3 text-gray-500 text-sm">{u.email}</td>
                      <td className="px-5 py-3 text-game-gold font-oswald font-bold">{u.gold.toLocaleString()}</td>
                      <td className="px-5 py-3 text-gray-300 font-oswald">{u.inventory.length}</td>
                      <td className="px-5 py-3 text-gray-300 font-oswald">{u.history.filter(h=>h.type==="purchase").length}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
        }
      </div>

      {/* Exchange settings */}
      <div className="glass rounded-3xl border border-game-gold/20 p-6">
        <h2 className="font-oswald text-lg text-white tracking-wider mb-5">💱 НАСТРОЙКИ ОБМЕНА</h2>
        <div className="flex flex-col md:flex-row gap-5 items-end">
          <Input label="1000 GOLD =" defaultValue="100" className="max-w-[120px]"/>
          <span className="text-gray-500 pb-3">₽</span>
          <Input label="МИН. ВЫВОД" defaultValue="500" className="max-w-[120px]"/>
          <span className="text-gray-500 pb-3">₽</span>
          <button onClick={()=>show("✅ Настройки сохранены")} className="bg-game-red hover:bg-game-red-light text-white font-oswald tracking-wider px-6 py-3 rounded-xl text-sm transition-all hover:scale-105 mb-0">
            СОХРАНИТЬ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUserState] = useState<User|null>(getSession);
  const [page, setPageState] = useState<Page>("home");
  const [showAuth,      setShowAuth]      = useState(false);
  const [showAdminAuth, setShowAdminAuth] = useState(false);

  const setUser = (u: User) => { setUserState(u); setSession(u); };
  const logout  = () => { setUserState(null); setSession(null); setPageState("home"); };

  const setPage = (p: Page) => {
    if (p==="profile"&&!user) { setShowAuth(true); return; }
    if (p==="admin") {
      if (!user)         { setShowAuth(true);      return; }
      if (!user.isAdmin) { setShowAdminAuth(true); return; }
    }
    setPageState(p);
    window.scrollTo({ top:0, behavior:"smooth" });
  };

  const handleAuth = (u: User) => { setUser(u); setShowAuth(false); setPageState(u.isAdmin?"admin":"profile"); };
  const handleAdminAuth = () => { setShowAdminAuth(false); setPageState("admin"); };

  return (
    <div className="min-h-screen bg-background relative">
      {/* Global ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-game-red/40 to-transparent pointer-events-none z-50"/>

      <Navbar page={page} setPage={setPage} user={user} onAuthOpen={()=>setShowAuth(true)} onLogout={logout}/>
      <main className="pt-16 relative z-10">
        {page==="home"     && <HomePage     setPage={setPage} user={user} onAuthOpen={()=>setShowAuth(true)}/>}
        {page==="shop"     && <ShopPage     user={user} setUser={setUser} onAuthOpen={()=>setShowAuth(true)}/>}
        {page==="roulette" && <RoulettePage user={user} setUser={setUser} onAuthOpen={()=>setShowAuth(true)}/>}
        {page==="profile"  && user && <ProfilePage user={user} setUser={setUser}/>}
        {page==="admin"    && user?.isAdmin && <AdminPage/>}
      </main>

      {showAuth      && <AuthModal       onClose={()=>setShowAuth(false)}      onAuth={handleAuth}/>}
      {showAdminAuth && <AdminAuthModal  onClose={()=>setShowAdminAuth(false)} onSuccess={handleAdminAuth}/>}
    </div>
  );
}