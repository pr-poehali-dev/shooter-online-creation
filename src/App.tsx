import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "shop" | "roulette" | "profile" | "admin";

const mockUser = {
  name: "ShadowBlade99",
  avatar: "🎮",
  level: 47,
  gold: 12_450,
  balance: 2_340,
  inventory: [
    { id: 1, name: "AK-47 | Crimson", type: "pistol", rarity: "legendary", emoji: "🔫", value: 850 },
    { id: 2, name: "Dragon Fist", type: "glove", rarity: "epic", emoji: "🥊", value: 420 },
    { id: 3, name: "Нео-Клинок", type: "app", rarity: "rare", emoji: "⚡", value: 230 },
    { id: 4, name: "Shadow Glove X", type: "glove", rarity: "rare", emoji: "🧤", value: 190 },
    { id: 5, name: "Desert Eagle", type: "pistol", rarity: "uncommon", emoji: "🔫", value: 120 },
    { id: 6, name: "Турбо-Бустер", type: "app", rarity: "epic", emoji: "🚀", value: 600 },
  ],
  history: [
    { id: 1, type: "purchase", item: "Dragon Fist", amount: -420, currency: "gold", date: "2026-05-11" },
    { id: 2, type: "roulette", item: "AK-47 | Crimson", amount: -100, currency: "gold", date: "2026-05-10" },
    { id: 3, type: "deposit", item: "Пополнение", amount: +1000, currency: "gold", date: "2026-05-09" },
    { id: 4, type: "withdraw", item: "Вывод средств", amount: -500, currency: "rub", date: "2026-05-08" },
  ],
};

const shopItems = [
  { id: 1, name: "AK-47 | Void Storm", type: "pistol", emoji: "🔫", rarity: "legendary", price: 1200, priceType: "gold" },
  { id: 2, name: "Phantom Gloves", type: "glove", emoji: "🧤", rarity: "epic", price: 650, priceType: "gold" },
  { id: 3, name: "Speed Hack Pro", type: "app", emoji: "⚡", rarity: "rare", price: 300, priceType: "gold" },
  { id: 4, name: "Glock | Blood Red", type: "pistol", emoji: "🔫", rarity: "rare", price: 280, priceType: "gold" },
  { id: 5, name: "Iron Fist", type: "glove", emoji: "🥊", rarity: "uncommon", price: 180, priceType: "gold" },
  { id: 6, name: "Dark Matter App", type: "app", emoji: "🌑", rarity: "legendary", price: 2500, priceType: "rub" },
  { id: 7, name: "Desert Eagle | Chrome", type: "pistol", emoji: "🔫", rarity: "epic", price: 890, priceType: "gold" },
  { id: 8, name: "Cyber Gloves V2", type: "glove", emoji: "🧤", rarity: "rare", price: 420, priceType: "gold" },
  { id: 9, name: "AutoBot Plus", type: "app", emoji: "🤖", rarity: "uncommon", price: 150, priceType: "gold" },
];

const rouletteItems = [
  { emoji: "🔫", name: "AK-47 | Void", rarity: "legendary", value: 2400 },
  { emoji: "🧤", name: "Phantom Gloves", rarity: "epic", value: 650 },
  { emoji: "💰", name: "500 Gold", rarity: "rare", value: 500 },
  { emoji: "🔫", name: "Glock | Red", rarity: "rare", value: 280 },
  { emoji: "💎", name: "1000 Gold", rarity: "epic", value: 1000 },
  { emoji: "🥊", name: "Iron Fist", rarity: "uncommon", value: 180 },
  { emoji: "⚡", name: "Speed Hack", rarity: "rare", value: 300 },
  { emoji: "🎯", name: "250 Gold", rarity: "common", value: 250 },
  { emoji: "🔫", name: "Desert Eagle", rarity: "uncommon", value: 120 },
  { emoji: "🚀", name: "Turbo App", rarity: "epic", value: 600 },
];

const adminItems = [
  { id: 1, name: "AK-47 | Void Storm", category: "pistol", price: 1200, stock: 45, active: true },
  { id: 2, name: "Phantom Gloves", category: "glove", price: 650, stock: 23, active: true },
  { id: 3, name: "Speed Hack Pro", category: "app", price: 300, stock: 100, active: false },
  { id: 4, name: "Dark Matter App", category: "app", price: 2500, stock: 8, active: true },
];

const rarityColors: Record<string, string> = {
  legendary: "text-yellow-400 border-yellow-500/40 bg-yellow-500/10",
  epic: "text-purple-400 border-purple-500/40 bg-purple-500/10",
  rare: "text-blue-400 border-blue-500/40 bg-blue-500/10",
  uncommon: "text-green-400 border-green-500/40 bg-green-500/10",
  common: "text-gray-400 border-gray-500/40 bg-gray-500/10",
};

const rarityLabel: Record<string, string> = {
  legendary: "Легендарный",
  epic: "Эпический",
  rare: "Редкий",
  uncommon: "Необычный",
  common: "Обычный",
};

function Navbar({ page, setPage, gold, balance }: { page: Page; setPage: (p: Page) => void; gold: number; balance: number }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-game-red/20 bg-game-dark/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <button onClick={() => setPage("home")} className="font-oswald text-2xl font-bold text-white tracking-widest">
            VAULT<span className="text-game-red text-glow-red">X</span>
          </button>
          <div className="hidden md:flex items-center gap-1">
            {([
              { key: "home", label: "ГЛАВНАЯ", icon: "Home" },
              { key: "shop", label: "МАГАЗИН", icon: "ShoppingBag" },
              { key: "roulette", label: "РУЛЕТКА", icon: "Dices" },
              { key: "profile", label: "ПРОФИЛЬ", icon: "User" },
            ] as { key: Page; label: string; icon: string }[]).map((item) => (
              <button
                key={item.key}
                onClick={() => setPage(item.key)}
                className={`flex items-center gap-2 px-4 py-2 font-oswald text-sm tracking-wider transition-all duration-200 border-b-2 ${
                  page === item.key
                    ? "text-game-red border-game-red"
                    : "text-gray-400 border-transparent hover:text-white hover:border-white/30"
                }`}
              >
                <Icon name={item.icon} size={14} />
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-game-dark-2 border border-game-gold/30 rounded px-3 py-1.5">
            <span className="text-game-gold text-sm font-bold font-oswald">{gold.toLocaleString()}</span>
            <span className="text-xs text-game-gold/60">GOLD</span>
          </div>
          <div className="flex items-center gap-2 bg-game-dark-2 border border-green-500/30 rounded px-3 py-1.5">
            <span className="text-green-400 text-sm font-bold font-oswald">{balance.toLocaleString()} ₽</span>
          </div>
          <button
            onClick={() => setPage("admin")}
            className="w-9 h-9 rounded bg-game-dark-2 border border-white/10 flex items-center justify-center text-gray-400 hover:text-game-red transition-colors"
            title="Админ-панель"
          >
            <Icon name="Settings" size={16} />
          </button>
          <div className="w-9 h-9 rounded bg-game-red/20 border border-game-red/40 flex items-center justify-center text-lg">
            {mockUser.avatar}
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ setPage }: { setPage: (p: Page) => void }) {
  const featuredItems = shopItems.slice(0, 3);
  return (
    <div className="space-y-0">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-game-red/5 via-transparent to-game-dark" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-game-red/5 rounded-full blur-[100px]" />
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-game-red/10 border border-game-red/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 bg-game-red rounded-full animate-pulse" />
            <span className="text-game-red text-xs font-oswald tracking-widest">LIVE PLATFORM</span>
          </div>
          <h1 className="font-oswald text-7xl md:text-9xl font-bold text-white mb-4 tracking-tight">
            VAULT<span className="text-game-red text-glow-red">X</span>
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl font-light mb-2 tracking-wider">
            Игровые предметы. Рулетка. Реальные деньги.
          </p>
          <p className="text-gray-600 text-sm mb-12 tracking-widest uppercase">Выигрывай · Покупай · Выводи</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setPage("roulette")}
              className="glow-red animate-pulse-red bg-game-red hover:bg-game-red-light text-white font-oswald text-lg tracking-widest px-10 py-4 rounded transition-all duration-300 hover:scale-105"
            >
              🎰 КРУТИТЬ РУЛЕТКУ
            </button>
            <button
              onClick={() => setPage("shop")}
              className="bg-transparent border border-white/20 hover:border-white/50 text-white font-oswald text-lg tracking-widest px-10 py-4 rounded transition-all duration-300 hover:bg-white/5"
            >
              🛒 В МАГАЗИН
            </button>
          </div>
        </div>
        <div className="absolute left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 opacity-40">
          {["🔫", "🧤", "⚡"].map((e, i) => (
            <div key={i} className="animate-float text-4xl" style={{ animationDelay: `${i * 0.8}s` }}>{e}</div>
          ))}
        </div>
        <div className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 opacity-40">
          {["💎", "🥊", "🚀"].map((e, i) => (
            <div key={i} className="animate-float text-4xl" style={{ animationDelay: `${i * 0.6}s` }}>{e}</div>
          ))}
        </div>
      </section>

      <section className="bg-game-dark-2 border-y border-white/5 py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: "Игроков онлайн", value: "1,247", icon: "Users" },
            { label: "Предметов в магазине", value: "500+", icon: "Package" },
            { label: "Выплачено сегодня", value: "₽ 84,500", icon: "TrendingUp" },
            { label: "Рулеток сыграно", value: "12,890", icon: "Dices" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-game-red mb-1 flex justify-center"><Icon name={stat.icon} size={20} /></div>
              <div className="font-oswald text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500 tracking-wider uppercase">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-oswald text-3xl font-bold text-white tracking-wider">🔥 ТОПОВЫЕ ПРЕДМЕТЫ</h2>
          <button onClick={() => setPage("shop")} className="text-game-red text-sm font-oswald tracking-wider hover:text-game-red-light flex items-center gap-1">
            ВСЕ ПРЕДМЕТЫ <Icon name="ChevronRight" size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredItems.map((item, i) => (
            <div key={item.id} className="card-glass rounded-lg p-6 border border-white/5 hover:border-game-red/30 transition-all duration-300 hover:scale-[1.02] group animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="text-6xl mb-4 group-hover:animate-float">{item.emoji}</div>
              <div className={`inline-block text-xs px-2 py-0.5 rounded border font-oswald tracking-wider mb-2 ${rarityColors[item.rarity]}`}>
                {rarityLabel[item.rarity]}
              </div>
              <h3 className="font-oswald text-lg text-white mb-3">{item.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-game-gold font-bold font-oswald">{item.price.toLocaleString()} GOLD</span>
                <button onClick={() => setPage("shop")} className="text-xs bg-game-red/20 border border-game-red/40 text-game-red px-3 py-1 rounded hover:bg-game-red hover:text-white transition-all font-oswald tracking-wider">
                  КУПИТЬ
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="relative overflow-hidden rounded-xl border border-game-gold/20 bg-gradient-to-r from-game-dark-2 via-game-gold/5 to-game-dark-2 p-8 md:p-12">
          <div className="absolute top-0 right-0 w-64 h-64 bg-game-gold/5 rounded-full blur-[60px]" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="font-oswald text-3xl md:text-4xl font-bold text-white mb-2 tracking-wider">💱 ОБМЕН ГОЛДА</h2>
              <p className="text-gray-400 text-lg">1000 GOLD = 100 ₽ · Выводи реальные деньги в любое время</p>
            </div>
            <div className="flex gap-3">
              <button className="bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-widest px-8 py-3 rounded transition-all hover:scale-105">
                КУПИТЬ GOLD
              </button>
              <button className="border border-game-gold/40 text-game-gold font-oswald tracking-widest px-8 py-3 rounded hover:bg-game-gold/10 transition-all">
                ВЫВЕСТИ
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ShopPage() {
  const [filter, setFilter] = useState<"all" | "pistol" | "glove" | "app">("all");
  const [sortBy, setSortBy] = useState<"price" | "name">("price");

  const filtered = shopItems
    .filter((i) => filter === "all" || i.type === filter)
    .sort((a, b) => sortBy === "price" ? a.price - b.price : a.name.localeCompare(b.name));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-oswald text-4xl font-bold text-white tracking-wider mb-2">🛒 МАГАЗИН</h1>
        <p className="text-gray-500">Покупай предметы за голд или реальные деньги</p>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex gap-2 flex-wrap">
          {([
            { key: "all", label: "ВСЕ" },
            { key: "pistol", label: "🔫 ПИСТОЛЕТЫ" },
            { key: "glove", label: "🧤 ПЕРЧАТКИ" },
            { key: "app", label: "⚡ ПРИЛОЖЕНИЯ" },
          ] as { key: typeof filter; label: string }[]).map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`font-oswald text-sm tracking-wider px-4 py-2 rounded border transition-all ${
                filter === f.key
                  ? "bg-game-red border-game-red text-white"
                  : "border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "price" | "name")}
          className="bg-game-dark-2 border border-white/10 text-gray-300 rounded px-3 py-2 text-sm font-oswald"
        >
          <option value="price">По цене</option>
          <option value="name">По названию</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="card-glass rounded-lg border border-white/5 hover:border-game-red/40 transition-all duration-300 hover:scale-[1.02] group overflow-hidden">
            <div className="bg-game-dark-2 p-6 flex items-center justify-center text-5xl group-hover:animate-float">
              {item.emoji}
            </div>
            <div className="p-4">
              <div className={`inline-block text-xs px-2 py-0.5 rounded border font-oswald tracking-wider mb-2 ${rarityColors[item.rarity]}`}>
                {rarityLabel[item.rarity]}
              </div>
              <h3 className="font-oswald text-sm text-white mb-3 leading-tight">{item.name}</h3>
              <div className="flex items-center justify-between">
                <div>
                  {item.priceType === "gold" ? (
                    <span className="text-game-gold font-bold font-oswald text-sm">{item.price.toLocaleString()} G</span>
                  ) : (
                    <span className="text-green-400 font-bold font-oswald text-sm">{item.price.toLocaleString()} ₽</span>
                  )}
                </div>
                <button className="text-xs bg-game-red text-white px-3 py-1.5 rounded hover:bg-game-red-light transition-all font-oswald tracking-wider hover:scale-105">
                  КУПИТЬ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoulettePage() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof rouletteItems[0] | null>(null);
  const [bet, setBet] = useState(100);
  const [offset, setOffset] = useState(0);

  const itemWidth = 130;
  const visibleItems = [...rouletteItems, ...rouletteItems, ...rouletteItems, ...rouletteItems, ...rouletteItems];

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const winner = rouletteItems[Math.floor(Math.random() * rouletteItems.length)];
    const winnerIndex = Math.floor(Math.random() * rouletteItems.length) + rouletteItems.length * 2;
    const targetOffset = winnerIndex * itemWidth - (itemWidth * 3.5);
    setOffset(targetOffset);
    setTimeout(() => {
      setSpinning(false);
      setResult(winner);
    }, 4000);
  };

  const betOptions = [50, 100, 250, 500, 1000];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="font-oswald text-4xl font-bold text-white tracking-wider mb-2">🎰 РУЛЕТКА</h1>
        <p className="text-gray-500">Крути — выигрывай предметы и голд</p>
      </div>

      <div className="relative mb-8 overflow-hidden rounded-xl border border-game-red/30 bg-game-dark-2 glow-red-sm">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-full">
          <div className="w-0.5 h-full bg-game-red opacity-80" />
        </div>
        <div
          className="flex items-center py-4 px-4"
          style={{
            transform: `translateX(-${offset}px)`,
            transition: spinning ? "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none",
            width: "max-content",
          }}
        >
          {visibleItems.map((item, i) => (
            <div
              key={i}
              className={`flex-shrink-0 w-[120px] mx-1 rounded-lg border p-3 text-center ${rarityColors[item.rarity]}`}
            >
              <div className="text-3xl mb-1">{item.emoji}</div>
              <div className="text-xs font-oswald leading-tight truncate">{item.name}</div>
              <div className="text-xs opacity-60 mt-0.5">{item.value}G</div>
            </div>
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-game-dark-2 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-game-dark-2 to-transparent pointer-events-none" />
      </div>

      {result && (
        <div className={`mb-6 p-4 rounded-xl border text-center animate-scale-in ${rarityColors[result.rarity]}`}>
          <div className="text-4xl mb-1">{result.emoji}</div>
          <div className="font-oswald text-xl font-bold">{result.name}</div>
          <div className="text-sm opacity-80">+{result.value} Gold</div>
        </div>
      )}

      <div className="max-w-lg mx-auto space-y-4">
        <div>
          <label className="text-xs text-gray-500 font-oswald tracking-wider mb-2 block">СТАВКА (GOLD)</label>
          <div className="flex gap-2 flex-wrap">
            {betOptions.map((b) => (
              <button
                key={b}
                onClick={() => setBet(b)}
                className={`font-oswald text-sm px-4 py-2 rounded border transition-all ${
                  bet === b
                    ? "bg-game-red border-game-red text-white"
                    : "border-white/10 text-gray-400 hover:border-white/30"
                }`}
              >
                {b}G
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className={`w-full font-oswald text-xl tracking-widest py-4 rounded-lg border transition-all duration-300 ${
            spinning
              ? "border-gray-600 text-gray-500 cursor-not-allowed bg-transparent"
              : "glow-red bg-game-red hover:bg-game-red-light border-game-red text-white hover:scale-[1.02] animate-pulse-red"
          }`}
        >
          {spinning ? "⏳ КРУТИТСЯ..." : `🎰 КРУТИТЬ ЗА ${bet} GOLD`}
        </button>

        <div className="grid grid-cols-3 gap-3">
          {["pistol", "glove", "gold"].map((type) => (
            <button
              key={type}
              className="card-glass border border-white/5 hover:border-game-red/30 rounded-lg p-3 text-center transition-all hover:scale-[1.02]"
            >
              <div className="text-2xl mb-1">{type === "pistol" ? "🔫" : type === "glove" ? "🧤" : "💰"}</div>
              <div className="font-oswald text-xs text-gray-400 tracking-wider">
                {type === "pistol" ? "ПИСТОЛЕТЫ" : type === "glove" ? "ПЕРЧАТКИ" : "ГОЛД"}
              </div>
              <div className="text-xs text-game-red mt-0.5">{bet * 2}G старт</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const [tab, setTab] = useState<"inventory" | "history" | "wallet">("inventory");

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="card-glass rounded-xl border border-white/5 p-6 mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
        <div className="w-20 h-20 rounded-xl bg-game-red/20 border border-game-red/40 flex items-center justify-center text-4xl glow-red-sm">
          {mockUser.avatar}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="font-oswald text-2xl font-bold text-white">{mockUser.name}</h1>
            <span className="text-xs bg-game-red/20 border border-game-red/40 text-game-red px-2 py-0.5 rounded font-oswald">
              LVL {mockUser.level}
            </span>
          </div>
          <div className="flex gap-6 text-sm">
            <div><span className="text-gray-500">Предметов: </span><span className="text-white font-oswald">{mockUser.inventory.length}</span></div>
            <div><span className="text-gray-500">Голд: </span><span className="text-game-gold font-oswald font-bold">{mockUser.gold.toLocaleString()}</span></div>
            <div><span className="text-gray-500">Баланс: </span><span className="text-green-400 font-oswald font-bold">{mockUser.balance.toLocaleString()} ₽</span></div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-wider px-4 py-2 rounded text-sm transition-all hover:scale-105">
            💱 ОБМЕНЯТЬ
          </button>
          <button className="border border-green-500/40 text-green-400 font-oswald tracking-wider px-4 py-2 rounded text-sm hover:bg-green-500/10 transition-all">
            💸 ВЫВЕСТИ
          </button>
        </div>
      </div>

      <div className="flex gap-1 mb-6 border-b border-white/5">
        {([
          { key: "inventory", label: "🎒 ИНВЕНТАРЬ" },
          { key: "history", label: "📜 ИСТОРИЯ" },
          { key: "wallet", label: "💳 КОШЕЛЁК" },
        ] as { key: typeof tab; label: string }[]).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`font-oswald text-sm tracking-wider px-5 py-3 border-b-2 transition-all ${
              tab === t.key
                ? "text-game-red border-game-red"
                : "text-gray-500 border-transparent hover:text-gray-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "inventory" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in">
          {mockUser.inventory.map((item) => (
            <div key={item.id} className={`card-glass rounded-lg border p-4 text-center hover:scale-[1.05] transition-all cursor-pointer group ${rarityColors[item.rarity]}`}>
              <div className="text-4xl mb-2 group-hover:animate-float">{item.emoji}</div>
              <div className="font-oswald text-xs leading-tight mb-1">{item.name}</div>
              <div className="text-xs opacity-60">{item.value}G</div>
            </div>
          ))}
        </div>
      )}

      {tab === "history" && (
        <div className="space-y-3 animate-fade-in">
          {mockUser.history.map((h) => (
            <div key={h.id} className="card-glass rounded-lg border border-white/5 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded flex items-center justify-center text-sm ${
                  h.amount > 0 ? "bg-green-500/20 text-green-400" : "bg-game-red/20 text-game-red"
                }`}>
                  {h.amount > 0 ? "+" : "-"}
                </div>
                <div>
                  <div className="font-oswald text-white text-sm">{h.item}</div>
                  <div className="text-xs text-gray-500">{h.date}</div>
                </div>
              </div>
              <div className={`font-oswald font-bold ${h.amount > 0 ? "text-green-400" : "text-game-red"}`}>
                {h.amount > 0 ? "+" : ""}{h.amount} {h.currency === "gold" ? "G" : "₽"}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "wallet" && (
        <div className="max-w-lg space-y-4 animate-fade-in">
          <div className="card-glass rounded-xl border border-game-gold/20 p-6">
            <div className="text-xs text-gray-500 font-oswald tracking-wider mb-1">БАЛАНС ГОЛДА</div>
            <div className="font-oswald text-4xl font-bold text-game-gold glow-gold mb-4">{mockUser.gold.toLocaleString()} G</div>
            <div className="flex gap-3">
              <button className="flex-1 bg-game-gold hover:bg-game-gold-dark text-black font-oswald tracking-wider py-2.5 rounded text-sm transition-all">
                КУПИТЬ GOLD
              </button>
              <button className="flex-1 border border-game-gold/40 text-game-gold font-oswald tracking-wider py-2.5 rounded text-sm hover:bg-game-gold/10 transition-all">
                → РУБЛИ
              </button>
            </div>
          </div>
          <div className="card-glass rounded-xl border border-green-500/20 p-6">
            <div className="text-xs text-gray-500 font-oswald tracking-wider mb-1">РУБЛЁВЫЙ СЧЁТ</div>
            <div className="font-oswald text-4xl font-bold text-green-400 mb-4">{mockUser.balance.toLocaleString()} ₽</div>
            <div className="text-xs text-gray-600 mb-3">1000 GOLD = 100 ₽ · Мин. вывод 500 ₽</div>
            <button className="w-full border border-green-500/40 text-green-400 font-oswald tracking-wider py-2.5 rounded text-sm hover:bg-green-500/10 transition-all">
              💸 ВЫВЕСТИ НА КАРТУ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminPage() {
  const [items, setItems] = useState(adminItems);

  const toggleActive = (id: number) => {
    setItems(items.map((i) => i.id === id ? { ...i, active: !i.active } : i));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-oswald text-4xl font-bold text-white tracking-wider mb-1">⚙️ АДМИН-ПАНЕЛЬ</h1>
          <p className="text-gray-500 text-sm">Управление товарами, ценами и рулеткой</p>
        </div>
        <button className="bg-game-red hover:bg-game-red-light text-white font-oswald tracking-widest px-5 py-2.5 rounded text-sm transition-all hover:scale-105">
          + ДОБАВИТЬ ТОВАР
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Всего товаров", value: "9", icon: "Package", color: "text-blue-400" },
          { label: "Активных", value: "7", icon: "CheckCircle", color: "text-green-400" },
          { label: "Продаж сегодня", value: "34", icon: "ShoppingBag", color: "text-game-gold" },
          { label: "Выручка", value: "₽ 12,400", icon: "TrendingUp", color: "text-game-red" },
        ].map((s, i) => (
          <div key={i} className="card-glass rounded-lg border border-white/5 p-4">
            <div className={`mb-1 ${s.color}`}><Icon name={s.icon} size={18} /></div>
            <div className="font-oswald text-2xl font-bold text-white">{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card-glass rounded-xl border border-white/5 overflow-hidden mb-6">
        <div className="grid grid-cols-5 px-4 py-3 text-xs text-gray-500 font-oswald tracking-wider border-b border-white/5">
          <span>ТОВАР</span>
          <span>КАТЕГОРИЯ</span>
          <span>ЦЕНА (GOLD)</span>
          <span>НА СКЛАДЕ</span>
          <span>СТАТУС</span>
        </div>
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-5 items-center px-4 py-4 border-b border-white/5 hover:bg-white/[0.02] transition-colors">
            <span className="font-oswald text-white text-sm">{item.name}</span>
            <span className="text-gray-400 text-sm">
              {item.category === "pistol" ? "🔫 Пистолет" : item.category === "glove" ? "🧤 Перчатка" : "⚡ Приложение"}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-game-gold font-oswald font-bold">{item.price.toLocaleString()}</span>
              <button className="text-xs text-gray-600 hover:text-white transition-colors">
                <Icon name="Pencil" size={12} />
              </button>
            </div>
            <span className={`text-sm font-oswald ${item.stock < 10 ? "text-game-red" : "text-gray-300"}`}>
              {item.stock} шт.
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => toggleActive(item.id)}
                className={`relative inline-flex h-5 w-9 rounded-full transition-colors ${item.active ? "bg-game-red" : "bg-gray-700"}`}
              >
                <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${item.active ? "translate-x-4" : "translate-x-0"}`} />
              </button>
              <span className={`text-xs font-oswald ${item.active ? "text-game-red" : "text-gray-600"}`}>
                {item.active ? "АКТИВЕН" : "ОТКЛ"}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="card-glass rounded-xl border border-game-gold/20 p-6">
        <h2 className="font-oswald text-lg text-white tracking-wider mb-4">💱 КУРС ОБМЕНА</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-oswald tracking-wider block mb-2">GOLD → РУБЛИ (1000 GOLD =)</label>
            <div className="flex items-center gap-2">
              <input defaultValue="100" className="bg-game-dark-3 border border-white/10 text-white rounded px-3 py-2 w-24 font-oswald" />
              <span className="text-gray-400">₽</span>
            </div>
          </div>
          <div className="flex-1">
            <label className="text-xs text-gray-500 font-oswald tracking-wider block mb-2">МИН. СУММА ВЫВОДА</label>
            <div className="flex items-center gap-2">
              <input defaultValue="500" className="bg-game-dark-3 border border-white/10 text-white rounded px-3 py-2 w-24 font-oswald" />
              <span className="text-gray-400">₽</span>
            </div>
          </div>
          <div className="flex items-end">
            <button className="bg-game-red hover:bg-game-red-light text-white font-oswald tracking-wider px-6 py-2 rounded text-sm transition-all">
              СОХРАНИТЬ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [gold] = useState(mockUser.gold);
  const [balance] = useState(mockUser.balance);

  return (
    <div className="min-h-screen bg-background">
      <Navbar page={page} setPage={setPage} gold={gold} balance={balance} />
      <main className="pt-16">
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "shop" && <ShopPage />}
        {page === "roulette" && <RoulettePage />}
        {page === "profile" && <ProfilePage />}
        {page === "admin" && <AdminPage />}
      </main>
    </div>
  );
}