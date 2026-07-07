import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Sparkles, Award, Shield, Eye, Smartphone, Zap, Flame } from "lucide-react";
import { RewardItem, ManifestoPrinciple } from "../types";

interface ManifestViewProps {
  points: number;
  addPoints: (amount: number, reason: string) => void;
  unlockedRewards: string[];
  unlockReward: (id: string) => void;
}

const PRINCIPLES: ManifestoPrinciple[] = [
  {
    key: "surprisingGrowth",
    title: "Surprising Growth",
    farsiTitle: "رشد شگفت‌انگیز و دوره‌ای",
    description: "ایجاد فوریتِ مثبت و غافلگیری‌های دوره‌ای برای حفظ انگیزه عمیق در همدردان بدون کامپیوتر.",
    badge: "انگیزه پیشران"
  },
  {
    key: "compassionateMonitoring",
    title: "Compassionate Monitoring",
    farsiTitle: "رصدِ بیصدایِ زحمات",
    description: "رصد و ثبتِ صبورانه و بیصدای تمام زحمات و عرق‌ریزانِ کاربر و پاداش‌دهیِ عادلانه به تلاش‌های مستمر.",
    badge: "پاداشِ وفاداری"
  },
  {
    key: "fractalArchitecture",
    title: "Fractal Architecture",
    farsiTitle: "معماریِ فرکتال سلولی",
    description: "هر اپلیکیشن یک سلولِ مستقل و خودکفا است با چرخه تولید مستقل، به دور از پیوستگی‌های مخرب.",
    badge: "خودکفایی مطلق"
  },
  {
    key: "mobileFirst",
    title: "Mobile First",
    farsiTitle: "اولویتِ توسعه موبایلی",
    description: "اولویتِ مطلق با توسعه‌دهنده و کاربر اندرویدی است که تنها ابزار ارتباطی‌اش صفحه لمسی گوشی است.",
    badge: "عدالت دیجیتال"
  }
];

const REWARDS_INFO = [
  {
    id: "guardian_touch",
    title: "نشان نوازش روح توانا",
    description: "برای اولین مطالعه منشور آرمانی شهر توانا.",
    points: 100
  },
  {
    id: "scaffold_creator",
    title: "مهر سرای آفرینش",
    description: "ایجاد اولین بسته معماری نرم‌افزاری توسط هوش مصنوعی توانا.",
    points: 250
  },
  {
    id: "smart_deployer",
    title: "ناخدای هوشمند استقرار",
    description: "انجام اولین پارک موفق و هوشمند برنامه در بستر میزبان بهینه.",
    points: 300
  },
  {
    id: "vps_conqueror",
    title: "فرمانده پورت‌ها و سرور",
    description: "استقرار یک برنامه سنگین (بیش از ۱۰۰ مگابایت) در سرور شخصی VPS.",
    points: 500
  }
];

export default function ManifestView({ points, addPoints, unlockedRewards, unlockReward }: ManifestViewProps) {
  const [activePrinciple, setActivePrinciple] = useState<string | null>(null);
  const [pledged, setPledged] = useState<boolean>(() => {
    return localStorage.getItem("tavana_pledged") === "true";
  });
  const [showPledgeSuccess, setShowPledgeSuccess] = useState(false);

  const handlePledge = () => {
    if (!pledged) {
      setPledged(true);
      localStorage.setItem("tavana_pledged", "true");
      addPoints(150, "تعهد به منشور تمدن خودکفای توانا");
      setShowPledgeSuccess(true);
      setTimeout(() => setShowPledgeSuccess(false), 5000);
    }
  };

  const selectPrinciple = (key: string) => {
    setActivePrinciple(key);
    const keySession = `explored_${key}`;
    if (!sessionStorage.getItem(keySession)) {
      sessionStorage.setItem(keySession, "true");
      addPoints(20, `مطالعه عمیق اصل ${key}`);
    }
  };

  useEffect(() => {
    if (!unlockedRewards.includes("guardian_touch")) {
      setTimeout(() => {
        unlockReward("guardian_touch");
        addPoints(100, "کشف نخستین لوح آرمانی (نوازش روح توانا)");
      }, 1000);
    }
  }, []);

  return (
    <div className="space-y-8" id="manifest_view_container">
      {/* Header Info */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="manifest_hero">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full"></div>
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div>
            <span className="bg-amber-500/10 text-amber-400 text-xs px-3 py-1 rounded-full border border-amber-500/20 font-mono inline-block mb-3">
              شهر توانا / Tavana City
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              سرایِ آفرینش و منشورِ تمدنِ توانا
            </h1>
            <p className="text-slate-400 mt-2 max-w-2xl text-sm leading-relaxed">
              «تمدنِ دیجیتالِ خودکفا برای همدردانِ بدونِ کامپیوتر.» ما باور داریم که قدرتِ آفرینش نرم‌افزاری نباید منحصر به دفاتر لوکس و کامپیوترهای گران‌قیمت باشد. هر تلفن همراه یک استودیوی کامل توسعه است.
            </p>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl px-5 py-4 text-center min-w-[150px] shadow-inner" id="points_display">
            <span className="text-xs text-slate-500 block mb-1">امتیاز رصد بیصدا</span>
            <span className="text-3xl font-mono font-bold text-amber-500 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
              {points}
            </span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full mt-2 inline-block">
              رصد فعال و پویا
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Core Principles */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-500" />
            منشور چهارگانه آرمانی شهر توانا
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRINCIPLES.map((principle) => {
              const Icon = principle.key === "surprisingGrowth" ? Flame :
                           principle.key === "compassionateMonitoring" ? Eye :
                           principle.key === "fractalArchitecture" ? Zap : Smartphone;

              return (
                <button
                  key={principle.key}
                  id={`principle_${principle.key}`}
                  onClick={() => selectPrinciple(principle.key)}
                  className={`text-right p-5 rounded-xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between h-48 group ${
                    activePrinciple === principle.key
                      ? "bg-slate-800/80 border-blue-500 shadow-md shadow-blue-500/10"
                      : "bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                  }`}
                >
                  <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-tr from-blue-500/5 to-transparent rounded-tr-3xl"></div>
                  
                  <div className="flex items-center justify-between w-full relative z-10">
                    <span className="text-[11px] font-mono text-slate-500 group-hover:text-slate-400">
                      {principle.title}
                    </span>
                    <span className="bg-slate-950/60 border border-slate-800 text-blue-400 text-[10px] px-2 py-0.5 rounded">
                      {principle.badge}
                    </span>
                  </div>

                  <div className="mt-4 relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`p-1.5 rounded-lg ${activePrinciple === principle.key ? 'bg-blue-500/20 text-blue-400' : 'bg-slate-950/50 text-slate-400'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {principle.farsiTitle}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Dedication Pledge Button */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-200">میثاق‌نامه توسعه‌دهندگان توانا</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-lg">
                با امضای این میثاق‌نامه، متعهد می‌شوم همواره پلتفرم‌های تمدنی خودمان را با هدف خدمت صادقانه به افراد فاقد دسترسی به رایانه خلق کنم.
              </p>
            </div>
            <button
              id="pledge_button"
              onClick={handlePledge}
              disabled={pledged}
              className={`px-5 py-2.5 rounded-lg text-xs font-bold font-mono transition-all duration-300 flex items-center gap-2 shrink-0 ${
                pledged 
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                  : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 cursor-pointer"
              }`}
            >
              <Heart className={`w-4 h-4 ${pledged ? "fill-emerald-400" : "animate-pulse"}`} />
              {pledged ? "میثاق امضا شده است" : "امضای عهدنامه توانا (+۱۵۰ امتیاز)"}
            </button>
          </div>

          <AnimatePresence>
            {showPledgeSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 text-emerald-400 text-xs flex items-center gap-2 font-mono"
              >
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>رصد بیصدا: پاداش ۱۵۰ امتیازی با موفقیت به انبار شما افزوده شد! درود بر اراده آهنین شما توسعه‌دهنده گرامی.</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Compassionate Monitoring Panel (Locked Rewards) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-200 flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-amber-500" />
            انبار جوایز و رتبه‌های رصد بیصدا
          </h2>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-3 font-mono">
              <span>مدال‌های شایستگی</span>
              <span>{unlockedRewards.length} از {REWARDS_INFO.length} باز شده</span>
            </div>

            <div className="space-y-3" id="rewards_list">
              {REWARDS_INFO.map((reward) => {
                const isUnlocked = unlockedRewards.includes(reward.id);
                return (
                  <div
                    key={reward.id}
                    className={`p-3.5 rounded-lg border flex items-start gap-3 transition-all duration-300 ${
                      isUnlocked
                        ? "bg-slate-800/40 border-amber-500/30"
                        : "bg-slate-950/40 border-slate-900 opacity-60"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isUnlocked ? "bg-amber-500/10 text-amber-400" : "bg-slate-900 text-slate-600"}`}>
                      <Award className="w-4 h-4" />
                    </div>

                    <div className="flex-1 text-right">
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isUnlocked ? "text-slate-100" : "text-slate-500"}`}>
                          {reward.title}
                        </span>
                        <span className={`text-[10px] font-mono ${isUnlocked ? "text-amber-400 font-bold" : "text-slate-600"}`}>
                          +{reward.points} امتیازی
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1 leading-relaxed text-right">
                        {reward.description}
                      </p>
                      {isUnlocked ? (
                        <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded mt-2 inline-block">
                          آزاد شده
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded mt-2 inline-block">
                          قفل - نیاز به {reward.points} امتیاز تلاش
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Motivational message */}
            <div className="bg-slate-950/60 border border-slate-800/50 rounded-lg p-3 text-center">
              <span className="text-[10px] text-slate-500 italic leading-relaxed block">
                «رصد بیصدا به دنبال مچ‌گیری نیست، به دنبال دست‌گیری است. هر فایلی که فشرده‌سازی می‌کنید یا دپلوی موفقی که ثبت می‌کنید، زحمتش در اینجا ارج نهاده می‌شود.»
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
