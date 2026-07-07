import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Home, Car, Smartphone, Globe, Heart, Sparkles, Plus, Search, 
  Award, ShieldCheck, Check, ExternalLink, Eye, Share2, HelpCircle, AlertCircle, RefreshCw, Layers
} from "lucide-react";

interface HostedApp {
  id: string;
  name: string;
  platform: "Web" | "Android" | "iOS" | "Others";
  url: string;
  owner: string;
  description: string;
  carportStyle: "Golden-Elite" | "Passive-Slate" | "Cyber-Hood";
  slotNumber: number;
  respectCount: number;
  hostedAt: string;
}

interface HavenViewProps {
  points: number;
  addPoints: (amount: number, reason: string) => void;
  activeProject: any | null;
}

const DEFAULT_HOSTED_APPS: HostedApp[] = [
  {
    id: "app_1",
    name: "سامانه ملی وب‌شهر توانا",
    platform: "Web",
    url: "https://tavana-webshahr.ir",
    owner: "سهراب ممیز",
    description: "طراحی جامع هاب خدمات شهری و نقشه‌های ارگونومیک آفلاین برای همدردان.",
    carportStyle: "Golden-Elite",
    slotNumber: 101,
    respectCount: 142,
    hostedAt: "۱۴۰۵/۰۴/۱۱"
  },
  {
    id: "app_2",
    name: "مسیریاب صوتی همدرد",
    platform: "Android",
    url: "https://hamdard-nav.org",
    owner: "آناهیتا کدر",
    description: "اپلیکیشن اندرویدی برای ناوبری صوتی و آفلاین در شهرهای محروم با فشرده‌سازی اطلاعات.",
    carportStyle: "Cyber-Hood",
    slotNumber: 204,
    respectCount: 89,
    hostedAt: "۱۴۰۵/۰۴/۱۲"
  },
  {
    id: "app_3",
    name: "ارگونومی لمس سیمرغ",
    platform: "iOS",
    url: "https://simurgh-touch.com",
    owner: "آرش تستر",
    description: "بهینه‌ساز مصرف باتری تبلت‌ها و تنظیم فواصل کلیدها برای دست‌های لرزان.",
    carportStyle: "Passive-Slate",
    slotNumber: 302,
    respectCount: 74,
    hostedAt: "۱۴۰۵/۰۴/۱۳"
  },
  {
    id: "app_4",
    name: "پایگاه ذخیره تمدنی کویر",
    platform: "Others",
    url: "https://kavir-pasive.net",
    owner: "حامد اسکنر",
    description: "محیط همگام‌سازی ابری همتابه‌همتا (P2P) بدون تکیه بر سرورهای تمرکزی غربی.",
    carportStyle: "Passive-Slate",
    slotNumber: 405,
    respectCount: 115,
    hostedAt: "۱۴۰۵/۰۴/۱۴"
  }
];

export default function HavenView({ points, addPoints, activeProject }: HavenViewProps) {
  const [hostedApps, setHostedApps] = useState<HostedApp[]>(() => {
    const saved = localStorage.getItem("tavana_hosted_carport_apps");
    return saved ? JSON.parse(saved) : DEFAULT_HOSTED_APPS;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<"All" | "Web" | "Android" | "iOS" | "Others">("All");
  const [selectedApp, setSelectedApp] = useState<HostedApp | null>(null);

  // Form states for adding new application
  const [newAppName, setNewAppName] = useState("");
  const [newAppPlatform, setNewAppPlatform] = useState<"Web" | "Android" | "iOS" | "Others">("Web");
  const [newAppUrl, setNewAppUrl] = useState("");
  const [newAppOwner, setNewAppOwner] = useState("");
  const [newAppDesc, setNewAppDesc] = useState("");
  const [newAppStyle, setNewAppStyle] = useState<"Golden-Elite" | "Passive-Slate" | "Cyber-Hood">("Passive-Slate");
  const [showAddForm, setShowAddForm] = useState(false);

  // Success celebration state
  const [celebrationMsg, setCelebrationMsg] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("tavana_hosted_carport_apps", JSON.stringify(hostedApps));
  }, [hostedApps]);

  const handleHostNewApp = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newAppName.trim();
    const owner = newAppOwner.trim() || "توسعه‌دهنده گمنام";
    const url = newAppUrl.trim() || "http://localhost:3000";
    const desc = newAppDesc.trim() || "برنامه تحت وب برای ارتقاء سلامت و خدمت‌رسانی عمومی.";

    if (!name) {
      alert("⚠️ لطفا نام وب‌اپلیکیشن یا پروژه خودروی خود را وارد نمایید.");
      return;
    }

    // Allocate an empty carport slot based on platform
    const platformBase = newAppPlatform === "Web" ? 100 : newAppPlatform === "Android" ? 200 : newAppPlatform === "iOS" ? 300 : 400;
    const occupiedSlots = hostedApps.filter(a => a.platform === newAppPlatform).map(a => a.slotNumber);
    let slot = platformBase + 1;
    while (occupiedSlots.includes(slot)) {
      slot++;
    }

    const newApp: HostedApp = {
      id: "app_" + Date.now(),
      name,
      platform: newAppPlatform,
      url,
      owner,
      description: desc,
      carportStyle: newAppStyle,
      slotNumber: slot,
      respectCount: 1,
      hostedAt: new Date().toLocaleDateString("fa-IR")
    };

    setHostedApps(prev => [newApp, ...prev]);
    addPoints(60, `میزبانی آزاد و تخصیص سایبان شماره ${slot} به برنامه [${name}]`);
    
    setCelebrationMsg(`🎉 با افتخار! خودروی نرم‌افزاری «${name}» در سایبان ${slot} پناهگاه تمدنی توانا پارک شد و با کمال احترام مورد میزبانی قرار گرفت.`);
    setTimeout(() => setCelebrationMsg(null), 6000);

    // Reset Form
    setNewAppName("");
    setNewAppUrl("");
    setNewAppOwner("");
    setNewAppDesc("");
    setNewAppStyle("Passive-Slate");
    setShowAddForm(false);
  };

  const handleShowRespect = (appId: string) => {
    setHostedApps(prev => prev.map(app => {
      if (app.id === appId) {
        const updated = { ...app, respectCount: app.respectCount + 1 };
        if (selectedApp && selectedApp.id === appId) {
          setSelectedApp(updated);
        }
        return updated;
      }
      return app;
    }));
    addPoints(10, "ابراز احترام و تقدیر از دستاورد همدرد گرامی در سرپناه");
  };

  const filteredApps = hostedApps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = selectedPlatformFilter === "All" || app.platform === selectedPlatformFilter;
    return matchesSearch && matchesPlatform;
  });

  // Calculate statistics
  const totalApps = hostedApps.length;
  const webCount = hostedApps.filter(a => a.platform === "Web").length;
  const androidCount = hostedApps.filter(a => a.platform === "Android").length;
  const iosCount = hostedApps.filter(a => a.platform === "iOS").length;
  const otherCount = hostedApps.filter(a => a.platform === "Others").length;
  const totalRespect = hostedApps.reduce((acc, curr) => acc + curr.respectCount, 0);

  return (
    <div className="space-y-8 text-right" id="haven_view_container" dir="rtl">
      
      {/* Dopamine Celebration Notification */}
      <AnimatePresence>
        {celebrationMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 border-2 border-blue-400 rounded-2xl p-5 shadow-[0_0_30px_rgba(59,130,246,0.35)] flex items-center gap-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-xl rounded-full"></div>
            <div className="bg-white/20 p-3 rounded-xl shrink-0 flex items-center justify-center animate-bounce">
              <Car className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] bg-blue-500/50 text-white px-2 py-0.5 rounded-full font-bold uppercase font-mono block w-max">
                ✓ میزبانی تمدنی جدید ثبت شد
              </span>
              <p className="text-xs font-bold text-slate-100 mt-1 leading-relaxed">
                {celebrationMsg}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Jumbotron Header */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900/80 to-indigo-950/20 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="haven_jumbotron">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-600/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-600/5 blur-2xl rounded-full"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex-1 space-y-2">
            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] px-2.5 py-1 rounded border border-indigo-500/20 font-bold uppercase font-mono inline-block">
              🏠 UNIVERSAL APPLICATION HAVEN & CARPORTS
            </span>
            <h1 className="text-xl font-black text-slate-100 leading-tight">
              سرپناه جهانی و کارپورت‌های خودروهای نرم‌افزاری توانا
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
              اینجا خانه بزرگ، هاب بی‌مرز و سایبان امن وب‌اپلیکیشن‌های شماست. پلتفرمی برای استراحت، اسکان آزادانه، میزبانی و ادای احترام کامل به زحمات نخبگان. اگر وب‌اپلیکیشن شما مثل یک خودرو است، سایبان‌ها، پارکینگ‌ها و پورت‌های اختصاصی آن به صورت دائمی، محترمانه و رایگان در این پناهگاه تمدنی آماده خدمت‌رسانی است.
            </p>
          </div>
          <div className="shrink-0 flex flex-col gap-3">
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl border border-indigo-500/20 shadow-lg shadow-indigo-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-indigo-200" />
              <span>پذیرش و اسکان اپلیکیشن جدید (ثبت سایبان)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hospitality Statistics Hub */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4" id="haven_statistics_grid">
        
        <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-bold">کل پناهندگان</span>
            <span className="text-base font-black text-slate-200 mt-1 block font-mono">{totalApps} خودرو</span>
          </div>
          <div className="bg-indigo-500/10 p-2 rounded-lg">
            <Home className="w-5 h-5 text-indigo-400" />
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-bold">بخش وب‌اپلیکیشن</span>
            <span className="text-base font-black text-slate-200 mt-1 block font-mono">{webCount} سایبان</span>
          </div>
          <div className="bg-emerald-500/10 p-2 rounded-lg">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-bold">سرپناه اندروید</span>
            <span className="text-base font-black text-slate-200 mt-1 block font-mono">{androidCount} سایبان</span>
          </div>
          <div className="bg-blue-500/10 p-2 rounded-lg">
            <Smartphone className="w-5 h-5 text-blue-400" />
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-bold">کریدور iOS</span>
            <span className="text-base font-black text-slate-200 mt-1 block font-mono">{iosCount} سایبان</span>
          </div>
          <div className="bg-amber-500/10 p-2 rounded-lg">
            <Smartphone className="w-5 h-5 text-amber-400" />
          </div>
        </div>

        <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl flex items-center justify-between col-span-2 md:col-span-1">
          <div className="text-right">
            <span className="text-[10px] text-slate-500 block font-bold">احترامات تمدنی</span>
            <span className="text-base font-black text-amber-400 mt-1 block font-mono">{totalRespect} احترام</span>
          </div>
          <div className="bg-red-500/10 p-2 rounded-lg">
            <Heart className="w-5 h-5 text-red-400 fill-red-400/20" />
          </div>
        </div>

      </div>

      {/* Host New App Form Panel */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handleHostNewApp}
              className="bg-slate-950/60 border border-slate-850 p-6 rounded-2xl space-y-4"
            >
              <div className="flex items-center gap-2 border-b border-slate-900 pb-3 mb-2">
                <Car className="w-5 h-5 text-indigo-400" />
                <h3 className="text-xs font-bold text-slate-200">فرم پذیرش، میزبانی و تخصیص سایبان اختصاصی خودروهای نرم‌افزاری</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">نام وب‌اپلیکیشن یا پروژه:</label>
                  <input
                    type="text"
                    value={newAppName}
                    onChange={(e) => setNewAppName(e.target.value)}
                    placeholder="مثلا: نقشه صوتی ممیزان ارگونومیک"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">پلتفرم اجرایی:</label>
                  <select
                    value={newAppPlatform}
                    onChange={(e) => setNewAppPlatform(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Web">وب‌اپلیکیشن عمومی (Web App)</option>
                    <option value="Android">بستر اندروید (Android Space)</option>
                    <option value="iOS">سرور اپل (iOS Space)</option>
                    <option value="Others">سایر پلتفرم‌ها (سخت‌افزار محروم / رزبری)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">نشانی وب یا گیت‌هاب (URL):</label>
                  <input
                    type="text"
                    value={newAppUrl}
                    onChange={(e) => setNewAppUrl(e.target.value)}
                    placeholder="https://tavana-app.ir یا localhost"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 text-left font-mono"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">نام سازنده / تیم آفرینش‌گر:</label>
                  <input
                    type="text"
                    value={newAppOwner}
                    onChange={(e) => setNewAppOwner(e.target.value)}
                    placeholder="مثلا: فمیلی معماران امید"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 text-right"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">تیپ و سبک طراحی سایبان (Carport Style):</label>
                  <select
                    value={newAppStyle}
                    onChange={(e) => setNewAppStyle(e.target.value as any)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Passive-Slate">سایبان ارگونومیک تیره (Passive Slate)</option>
                    <option value="Golden-Elite">سایبان طلایی افتخاری نخبگان (Golden Elite)</option>
                    <option value="Cyber-Hood">کلاهک شب‌رنگ سایبرپانک (Cyber Hood)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-slate-400 block font-bold">کارکرد اصلی یا امکان برجسته:</label>
                  <input
                    type="text"
                    value={newAppDesc}
                    onChange={(e) => setNewAppDesc(e.target.value)}
                    placeholder="کاهش چشمگیر بار مصرفی پردازنده و تبلت‌ها..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 text-right"
                  />
                </div>

              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="bg-slate-900 hover:bg-slate-850 text-slate-400 px-4 py-2 rounded-xl text-xs transition-colors cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs px-5 py-2 rounded-xl border border-indigo-500/20 transition-all cursor-pointer"
                >
                  🛡️ ثبت و تخصیص سایبان مهمان‌نوازی (+۶۰ زحمت)
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Exploration Grid and Platform Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Filter and Interactive Carports Spaces */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Header and Platform Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="text-right">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-end">
                <Layers className="w-4 h-4 text-indigo-400" />
                پورت‌ها و تالارهای پارک خودروهای نرم‌افزاری تمدن
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">برای مشاهده شناسنامه و ادای احترام تمدنی، روی خودروها کلیک نمایید.</p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-850 font-mono text-[10px]">
              {(["All", "Web", "Android", "iOS", "Others"] as const).map((plat) => (
                <button
                  key={plat}
                  onClick={() => {
                    setSelectedPlatformFilter(plat);
                    addPoints(2, "فیلتر بسترها");
                  }}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedPlatformFilter === plat
                      ? "bg-indigo-600 text-white shadow"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {plat === "All" ? "کل فضاها" : plat}
                </button>
              ))}
            </div>
          </div>

          {/* Map of Platforms and Carports */}
          <div className="space-y-8">
            
            {/* PLATFORM 1: Web Applications Space */}
            {(selectedPlatformFilter === "All" || selectedPlatformFilter === "Web") && (
              <div className="bg-slate-900/20 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] text-slate-500 font-mono">100 series slots</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Globe className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-xs font-black text-slate-200">تالار اختصاصی وب‌اپلیکیشن‌ها (Web Space)</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {/* Generate 4 carport bays */}
                  {[101, 102, 103, 104].map((slotNum) => {
                    const occupiedApp = hostedApps.find(a => a.platform === "Web" && a.slotNumber === slotNum);
                    return (
                      <div 
                        key={slotNum}
                        onClick={() => occupiedApp && setSelectedApp(occupiedApp)}
                        className={`border rounded-xl p-3 flex flex-col justify-between h-28 relative cursor-pointer transition-all ${
                          occupiedApp 
                            ? occupiedApp.carportStyle === "Golden-Elite"
                              ? "border-amber-500/40 bg-gradient-to-b from-slate-950 to-amber-950/20 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                              : occupiedApp.carportStyle === "Cyber-Hood"
                              ? "border-indigo-500/40 bg-gradient-to-b from-slate-950 to-indigo-950/20 hover:border-indigo-400"
                              : "border-slate-850 bg-gradient-to-b from-slate-950 to-slate-900/20 hover:border-slate-700"
                            : "border-dashed border-slate-800 bg-slate-950/20 hover:bg-slate-950/40"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-slate-600">BAY #{slotNum}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${occupiedApp ? "bg-emerald-400 animate-ping" : "bg-slate-800"}`}></span>
                        </div>

                        {occupiedApp ? (
                          <div className="text-right mt-1">
                            <span className="text-[10px] font-extrabold text-slate-200 block truncate">{occupiedApp.name}</span>
                            <span className="text-[9px] text-slate-500 block truncate">توسط: {occupiedApp.owner}</span>
                            <div className="mt-2 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                              <span className="flex items-center gap-0.5 text-red-400">
                                <Heart className="w-2.5 h-2.5 fill-red-400" /> {occupiedApp.respectCount}
                              </span>
                              <span className="text-[9px] bg-slate-900/60 px-1 py-0.5 rounded text-indigo-400 font-bold">باکیفیت</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 space-y-1">
                            <span className="text-[9px] text-slate-600 block">سایبان خالی</span>
                            <span className="text-[8px] text-indigo-500 font-bold hover:underline block" onClick={(e) => { e.stopPropagation(); setShowAddForm(true); }}>+ رزرو سریع</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PLATFORM 2: Android Applications Space */}
            {(selectedPlatformFilter === "All" || selectedPlatformFilter === "Android") && (
              <div className="bg-slate-900/20 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] text-slate-500 font-mono">200 series slots</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Smartphone className="w-4 h-4 text-blue-400" />
                    <h4 className="text-xs font-black text-slate-200">سرپناه اندروید (Android Space)</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[201, 202, 203, 204].map((slotNum) => {
                    const occupiedApp = hostedApps.find(a => a.platform === "Android" && a.slotNumber === slotNum);
                    return (
                      <div 
                        key={slotNum}
                        onClick={() => occupiedApp && setSelectedApp(occupiedApp)}
                        className={`border rounded-xl p-3 flex flex-col justify-between h-28 relative cursor-pointer transition-all ${
                          occupiedApp 
                            ? occupiedApp.carportStyle === "Golden-Elite"
                              ? "border-amber-500/40 bg-gradient-to-b from-slate-950 to-amber-950/20 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                              : occupiedApp.carportStyle === "Cyber-Hood"
                              ? "border-indigo-500/40 bg-gradient-to-b from-slate-950 to-indigo-950/20 hover:border-indigo-400"
                              : "border-slate-850 bg-gradient-to-b from-slate-950 to-slate-900/20 hover:border-slate-700"
                            : "border-dashed border-slate-800 bg-slate-950/20 hover:bg-slate-950/40"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-slate-600">BAY #{slotNum}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${occupiedApp ? "bg-emerald-400 animate-ping" : "bg-slate-800"}`}></span>
                        </div>

                        {occupiedApp ? (
                          <div className="text-right mt-1">
                            <span className="text-[10px] font-extrabold text-slate-200 block truncate">{occupiedApp.name}</span>
                            <span className="text-[9px] text-slate-500 block truncate">توسط: {occupiedApp.owner}</span>
                            <div className="mt-2 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                              <span className="flex items-center gap-0.5 text-red-400">
                                <Heart className="w-2.5 h-2.5 fill-red-400" /> {occupiedApp.respectCount}
                              </span>
                              <span className="text-[9px] bg-slate-900/60 px-1 py-0.5 rounded text-blue-400 font-bold">باکیفیت</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 space-y-1">
                            <span className="text-[9px] text-slate-600 block">سایبان خالی</span>
                            <span className="text-[8px] text-blue-500 font-bold hover:underline block" onClick={(e) => { e.stopPropagation(); setShowAddForm(true); }}>+ رزرو سریع</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PLATFORM 3: iOS Corridor */}
            {(selectedPlatformFilter === "All" || selectedPlatformFilter === "iOS") && (
              <div className="bg-slate-900/20 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] text-slate-500 font-mono">300 series slots</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Smartphone className="w-4 h-4 text-amber-500" />
                    <h4 className="text-xs font-black text-slate-200">کریدور اختصاصی iOS (Apple Haven)</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[301, 302, 303, 304].map((slotNum) => {
                    const occupiedApp = hostedApps.find(a => a.platform === "iOS" && a.slotNumber === slotNum);
                    return (
                      <div 
                        key={slotNum}
                        onClick={() => occupiedApp && setSelectedApp(occupiedApp)}
                        className={`border rounded-xl p-3 flex flex-col justify-between h-28 relative cursor-pointer transition-all ${
                          occupiedApp 
                            ? occupiedApp.carportStyle === "Golden-Elite"
                              ? "border-amber-500/40 bg-gradient-to-b from-slate-950 to-amber-950/20 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                              : occupiedApp.carportStyle === "Cyber-Hood"
                              ? "border-indigo-500/40 bg-gradient-to-b from-slate-950 to-indigo-950/20 hover:border-indigo-400"
                              : "border-slate-850 bg-gradient-to-b from-slate-950 to-slate-900/20 hover:border-slate-700"
                            : "border-dashed border-slate-800 bg-slate-950/20 hover:bg-slate-950/40"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-slate-600">BAY #{slotNum}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${occupiedApp ? "bg-emerald-400 animate-ping" : "bg-slate-800"}`}></span>
                        </div>

                        {occupiedApp ? (
                          <div className="text-right mt-1">
                            <span className="text-[10px] font-extrabold text-slate-200 block truncate">{occupiedApp.name}</span>
                            <span className="text-[9px] text-slate-500 block truncate">توسط: {occupiedApp.owner}</span>
                            <div className="mt-2 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                              <span className="flex items-center gap-0.5 text-red-400">
                                <Heart className="w-2.5 h-2.5 fill-red-400" /> {occupiedApp.respectCount}
                              </span>
                              <span className="text-[9px] bg-slate-900/60 px-1 py-0.5 rounded text-amber-500 font-bold">باکیفیت</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 space-y-1">
                            <span className="text-[9px] text-slate-600 block">سایبان خالی</span>
                            <span className="text-[8px] text-amber-500 font-bold hover:underline block" onClick={(e) => { e.stopPropagation(); setShowAddForm(true); }}>+ رزرو سریع</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* PLATFORM 4: Other Platforms Space */}
            {(selectedPlatformFilter === "All" || selectedPlatformFilter === "Others") && (
              <div className="bg-slate-900/20 border border-slate-850 p-5 rounded-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <span className="text-[10px] text-slate-500 font-mono">400 series slots</span>
                  <div className="flex items-center gap-1.5 justify-end">
                    <Layers className="w-4 h-4 text-purple-400" />
                    <h4 className="text-xs font-black text-slate-200">پایانه سایر پلتفرم‌ها (رزبری، سخت‌افزارهای محروم و مستقل)</h4>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[401, 402, 403, 404, 405].map((slotNum) => {
                    const occupiedApp = hostedApps.find(a => a.platform === "Others" && a.slotNumber === slotNum);
                    return (
                      <div 
                        key={slotNum}
                        onClick={() => occupiedApp && setSelectedApp(occupiedApp)}
                        className={`border rounded-xl p-3 flex flex-col justify-between h-28 relative cursor-pointer transition-all ${
                          occupiedApp 
                            ? occupiedApp.carportStyle === "Golden-Elite"
                              ? "border-amber-500/40 bg-gradient-to-b from-slate-950 to-amber-950/20 shadow-lg shadow-amber-500/5 hover:border-amber-400"
                              : occupiedApp.carportStyle === "Cyber-Hood"
                              ? "border-indigo-500/40 bg-gradient-to-b from-slate-950 to-indigo-950/20 hover:border-indigo-400"
                              : "border-slate-850 bg-gradient-to-b from-slate-950 to-slate-900/20 hover:border-slate-700"
                            : "border-dashed border-slate-800 bg-slate-950/20 hover:bg-slate-950/40"
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] font-mono text-slate-600">BAY #{slotNum}</span>
                          <span className={`w-1.5 h-1.5 rounded-full ${occupiedApp ? "bg-emerald-400 animate-ping" : "bg-slate-800"}`}></span>
                        </div>

                        {occupiedApp ? (
                          <div className="text-right mt-1">
                            <span className="text-[10px] font-extrabold text-slate-200 block truncate">{occupiedApp.name}</span>
                            <span className="text-[9px] text-slate-500 block truncate">توسط: {occupiedApp.owner}</span>
                            <div className="mt-2 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                              <span className="flex items-center gap-0.5 text-red-400">
                                <Heart className="w-2.5 h-2.5 fill-red-400" /> {occupiedApp.respectCount}
                              </span>
                              <span className="text-[9px] bg-slate-900/60 px-1 py-0.5 rounded text-purple-400 font-bold">باکیفیت</span>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-2 space-y-1">
                            <span className="text-[9px] text-slate-600 block">سایبان خالی</span>
                            <span className="text-[8px] text-purple-500 font-bold hover:underline block" onClick={(e) => { e.stopPropagation(); setShowAddForm(true); }}>+ رزرو سریع</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>

        {/* Right Column: Active Inspection card and rules */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section 1: Detailed Inspection Card of Selected App */}
          <div className="bg-slate-950/60 border border-indigo-500/20 p-5 rounded-2xl space-y-4" id="app_inspection_card">
            <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider block font-mono border-b border-slate-900 pb-2 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              شناسنامه و کارت فنی خودروی نرم‌افزاری
            </h4>

            {selectedApp ? (
              <div className="space-y-4">
                
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono font-bold">
                      سایبان {selectedApp.slotNumber}
                    </span>
                    <h3 className="text-sm font-black text-slate-100">{selectedApp.name}</h3>
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-1">آفرینش‌گر: <span className="text-slate-300 font-bold">{selectedApp.owner}</span></span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-900 text-xs text-slate-400 leading-relaxed">
                  {selectedApp.description}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="bg-slate-900 p-2 rounded-lg text-center border border-slate-900">
                    <span className="text-slate-500 block">پلتفرم</span>
                    <span className="text-indigo-400 font-bold mt-1 block">{selectedApp.platform}</span>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg text-center border border-slate-900">
                    <span className="text-slate-500 block">تاریخ پذیرش</span>
                    <span className="text-slate-300 font-bold mt-1 block">{selectedApp.hostedAt}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    onClick={() => handleShowRespect(selectedApp.id)}
                    className="w-full bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-[11px] font-extrabold py-2.5 rounded-xl border border-rose-500/20 flex items-center justify-center gap-2 transition-all shadow-lg shadow-rose-500/10 cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-white text-white animate-pulse" />
                    <span>ادای احترام و صلوات تمدنی (+۱۰ زحمت)</span>
                  </button>

                  <a
                    href={selectedApp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-850 text-[11px] font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>بازدید مستقیم از تارنما / کدهای منبع</span>
                  </a>
                </div>

                <div className="text-[9px] text-slate-500 text-center leading-normal">
                  تاکنون <span className="text-amber-400 font-bold font-mono">{selectedApp.respectCount}</span> همدرد گرامی به این دستاورد ادای احترام کرده‌اند.
                </div>

              </div>
            ) : (
              <div className="text-center py-12 text-slate-600 text-xs italic">
                یکی از خودروهای مستقر در سایبان‌ها را انتخاب نمایید تا شناسنامه ارگونومیک آن نمایش داده شود.
              </div>
            )}
          </div>

          {/* Section 2: Deployer vs Haven rules */}
          <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl space-y-3" id="haven_rules_info">
            <h4 className="text-xs font-bold text-amber-500 flex items-center gap-1.5 justify-end">
              <Award className="w-4 h-4 text-amber-500" />
              مقررات میزبانی و تفاوت با استقرار مستقیم
            </h4>
            
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed text-right">
              <p>
                سرپناه توانا، یک هاب بی‌مرز برای تمامیِ توسعه‌دهندگان وب، اندروید و iOS است تا کارهای خود را در آن ثبت کنند و با کمال افتخار و احترام میزبانی شوند.
              </p>
              
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[11px] space-y-2">
                <span className="text-amber-400 block font-bold">⚡ دو حالت متمایز وجود دارد:</span>
                <ul className="list-disc list-inside space-y-1.5 pr-1.5">
                  <li>
                    <span className="text-slate-200 font-bold">۱. میزبانی آزاد (برای همگان):</span> هر کسی با هر اپلیکیشنی در دنیا می‌تواند یک سایبان خالی رزرو کرده و آدرس آن را ثبت کند تا مورد بازدید و احترام جامعه همدردان قرار گیرد.
                  </li>
                  <li>
                    <span className="text-slate-200 font-bold">۲. دپلوی خودکار (ویژه سازندگان اینجا):</span> تنها افرادی که کدهای خود را داخل فایل‌سیستم سرایِ توانا می‌نویسند می‌توانند از تب <span className="text-blue-400 font-bold">«هسته دپلوی هوشمند»</span> برای استقرار مستقیم و تخصیص پورت خودکار روی سرورهای VPS و Netlify توانا استفاده نمایند.
                  </li>
                </ul>
              </div>

              <div className="pt-2 border-t border-slate-900 text-center">
                <span className="text-[10px] text-slate-500 font-mono block">
                  «حمایت همه‌جانبه، استقرار پایدار، نفی وابستگی»
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
