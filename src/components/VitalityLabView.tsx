import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Smartphone, Gauge, Fingerprint, RefreshCw, Layers, CheckCircle2, 
  Sparkles, ShieldAlert, Award, HelpCircle, AlertCircle, Play, Info
} from "lucide-react";
import { TavanaProject, TavanaFile } from "../types";

interface VitalityLabProps {
  activeProject: TavanaProject | null;
  addPoints: (amount: number, reason: string) => void;
  unlockReward: (id: string) => void;
}

export default function VitalityLabView({ activeProject, addPoints, unlockReward }: VitalityLabProps) {
  const [deviceModel, setDeviceModel] = useState<"affordable" | "standard" | "tablet">("affordable");
  const [showHeatmap, setShowHeatmap] = useState(false);
  const [auditing, setAuditing] = useState(false);
  const [auditScores, setAuditScores] = useState<{
    offline: number;
    touch: number;
    payload: number;
    overall: number;
    suggestions: string[];
  } | null>(null);

  const [simulatedTaps, setSimulatedTaps] = useState<Array<{ x: number; y: number; success: boolean }>>([]);

  // Check if project contains touch targets or external CDNs
  const runAudit = () => {
    if (!activeProject) return;
    setAuditing(true);
    addPoints(30, `آغاز ممیزی سرزندگی سلول تمدنی ${activeProject.name}`);

    setTimeout(() => {
      let offlineScore = 85;
      let touchScore = 70;
      let payloadScore = 95;
      const suggestions: string[] = [];

      // Heuristic analysis of active files
      const codeFiles = activeProject.files.filter(f => f.path.endsWith(".html") || f.path.endsWith(".css") || f.path.endsWith(".ts") || f.path.endsWith(".tsx"));
      
      let hasExternalCDN = false;
      let inlineStyleCount = 0;
      let buttonCount = 0;

      codeFiles.forEach(file => {
        if (file.content.includes("http://") || file.content.includes("https://") || file.content.includes("bootstrap") || file.content.includes("cdnjs")) {
          hasExternalCDN = true;
        }
        if (file.content.includes("style=")) {
          inlineStyleCount++;
        }
        if (file.content.includes("<button") || file.content.includes("onClick")) {
          buttonCount++;
        }
      });

      if (hasExternalCDN) {
        offlineScore -= 35;
        suggestions.push("⚠️ ارجاع به CDN خارجی یافت شد. برای خودکفایی مطلق در نواحی دورافتاده، دارایی‌ها را بومی‌سازی کنید.");
      } else {
        suggestions.push("✅ پایداری آفلاین بی‌نظیر! هیچ منبع وابسته به شبکه اینترنتی شناسایی نشد.");
      }

      if (inlineStyleCount > 2) {
        touchScore -= 15;
        suggestions.push("⚠️ استفاده از استایل‌های درون‌خطی مانع از انعطاف‌پذیری لمسی در گوشی‌های کوچک می‌شود.");
      }

      if (buttonCount === 0) {
        suggestions.push("ℹ️ هیچ دکمه یا هدف کلیکی در کدهای اصلی شناسایی نشد. اهداف لمسی ارگونومیک اضافه کنید.");
      } else {
        touchScore += 10;
        suggestions.push(`✅ تعداد ${buttonCount} هدف لمسی شناسایی شد. فواصل و پدینگ‌ها برای انگشت شست انسان ایمن به نظر می‌رسند.`);
      }

      // Payload Score based on project size
      if (activeProject.sizeMB > 100) {
        payloadScore = 45;
        suggestions.push("⚠️ حجم بسته سلول فراتر از ۱۰۰ مگابایت است. لود اولیه روی گوشی‌های ارزان‌قیمت همدردان با کندی مواجه خواهد شد.");
      } else {
        payloadScore = 90 + Math.min(10, 10 - activeProject.sizeMB);
        suggestions.push("✅ حجم بسته بسیار سبک و چابک است و در حافظه موقت ضعیف‌ترین تراشه‌ها نیز روان اجرا می‌شود.");
      }

      // Bound scores
      offlineScore = Math.max(10, Math.min(100, offlineScore));
      touchScore = Math.max(10, Math.min(100, touchScore));
      payloadScore = Math.max(10, Math.min(100, payloadScore));
      const overall = Math.round((offlineScore + touchScore + payloadScore) / 3);

      setAuditScores({
        offline: offlineScore,
        touch: touchScore,
        payload: payloadScore,
        overall,
        suggestions
      });

      setAuditing(false);
      addPoints(70, `تکمیل سنجش سه شاخص کلیدی برای ${activeProject.name}`);
      
      if (overall >= 90) {
        unlockReward("smart_deployer");
        addPoints(50, "کسب رتبه طلایی ارگونومی و خودکفایی توانا");
      }
    }, 2000);
  };

  // Run audit automatically when project changes
  useEffect(() => {
    if (activeProject) {
      setAuditScores(null);
      setSimulatedTaps([]);
    }
  }, [activeProject]);

  const handleDeviceTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if (showHeatmap) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.round(((e.clientX - rect.left) / rect.width) * 100);
      const y = Math.round(((e.clientY - rect.top) / rect.height) * 100);
      
      // Determine if touch is easy to reach with thumb
      // Hand model: holding with right hand, thumb pivots from bottom-right.
      // Green zone is between 40% to 90% vertical and 30% to 95% horizontal.
      const isEasyReach = y > 35 && y < 85 && x > 20 && x < 95;

      setSimulatedTaps(prev => [...prev, { x, y, success: isEasyReach }]);
      
      if (isEasyReach) {
        addPoints(5, "ثبت لمس موفق در منطقه ارگونومیک سبز");
      } else {
        addPoints(2, "ثبت لمس فرعی در منطقه دور از دسترس (قرمز/زرد)");
      }
    }
  };

  if (!activeProject) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center" id="vitality_no_project">
        <Smartphone className="w-16 h-16 text-slate-700 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-300">پروژه‌ای انتخاب نشده است</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          برای راه‌یابی به آزمایشگاه ارگونومی و سنجش سرزندگی لمس، لطفاً ابتدا یک پروژه فعال از سلول‌های سمت راست برگزینید.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-right" id="vitality_lab_container">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900/80 to-blue-950/20 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="vitality_header">
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <span className="bg-blue-500/10 text-blue-400 text-[10px] px-3 py-1 rounded-full border border-blue-500/20 font-mono font-bold">
            Tavana Ergonomics & Vitality Engine / شاهکار خلاقیت تمدنی
          </span>
          <h2 className="text-xl font-extrabold text-slate-100 mt-3">
            آزمایشگاه سرزندگی و شبیه‌ساز ارگونومی لمس توانا
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-3xl leading-relaxed">
            این بستر، با تکیه بر منشور عدالت دیجیتال، کدهای خلق‌شده شما را برای استفاده با یک دست بر روی صفحات لمسی گوشی‌های ارزان‌قیمت ارزیابی می‌کند. با فعال‌سازی هیت‌مپ لمس، مناطق بهینه را رصد کرده و استقلال آفلاین سلول خود را تضمین نمایید. این کاری است منحصربه‌فرد که برنامه‌های هم‌کلاس شما را به زانو در می‌آورد!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Col: Device Simulator & Heatmap (7 Cols on large screen) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col items-center">
            
            {/* Device Controls */}
            <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowHeatmap(!showHeatmap)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    showHeatmap 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-500/15" 
                      : "bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{showHeatmap ? "غیرفعال‌سازی نقشه لمس" : "فعال‌سازی نقشه لمس (Thumb Heatmap)"}</span>
                </button>
                {showHeatmap && (
                  <button
                    onClick={() => setSimulatedTaps([])}
                    className="bg-slate-950 hover:bg-slate-900 text-slate-400 px-2.5 py-1.5 rounded-lg text-xs border border-slate-800 cursor-pointer transition-colors"
                  >
                    پاک کردن لمس‌ها
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-bold">مدل سخت‌افزار:</span>
                <select
                  value={deviceModel}
                  onChange={(e: any) => setDeviceModel(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                >
                  <option value="affordable">گوشی همدرد ارزان (۴.۵ اینچ)</option>
                  <option value="standard">گوشی استاندارد تمدنی (۶ اینچ)</option>
                  <option value="tablet">تبلت توانا (۹ اینچ)</option>
                </select>
              </div>
            </div>

            {/* Simulated Device Frame wrapper */}
            <div className="relative pt-4 flex justify-center w-full">
              <div 
                className={`relative bg-slate-950 border-[10px] border-slate-800 rounded-[36px] overflow-hidden transition-all duration-300 shadow-2xl ${
                  deviceModel === "affordable" ? "w-[280px] h-[520px]" :
                  deviceModel === "standard" ? "w-[320px] h-[600px]" : "w-[420px] h-[550px]"
                }`}
                onClick={handleDeviceTap}
                style={{ cursor: showHeatmap ? "crosshair" : "default" }}
              >
                {/* Speaker Grill */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-1 bg-slate-800 rounded-full z-20"></div>
                {/* Camera punch hole */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rounded-full z-20 border border-slate-800"></div>

                {/* Simulated Screen Content */}
                <div className="absolute inset-0 pt-8 pb-4 px-4 flex flex-col justify-between text-right overflow-y-auto">
                  
                  {/* Status Bar */}
                  <div className="flex justify-between items-center text-[9px] text-slate-500 font-mono select-none px-1">
                    <span>۱۰۰٪ 🔋</span>
                    <span className="text-emerald-400 font-bold">● Tavana Offline Net</span>
                    <span>۱۲:۰۰ UTC</span>
                  </div>

                  {/* Inside App Content Simulation */}
                  <div className="flex-1 mt-4 space-y-4">
                    <div className="bg-slate-900/60 border border-slate-850 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-blue-400 font-mono uppercase">محیط آزمایشی فعال</span>
                      <h4 className="text-xs font-bold text-slate-200 mt-1">{activeProject.name}</h4>
                      <p className="text-[9px] text-slate-400 mt-1">{activeProject.tagline}</p>
                    </div>

                    {/* Simulated Project Interface Mockup based on files */}
                    <div className="bg-slate-900/30 border border-slate-850/50 rounded-xl p-3 space-y-2.5">
                      <span className="text-[9px] text-slate-500 block">ساختار بصری رندر شده:</span>
                      <div className="h-6 bg-slate-950/80 rounded border border-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400">
                        {activeProject.files.find(f => f.path.endsWith("index.html")) ? "✓ فایل HTML لود شد" : "فاقد صفحه وب"}
                      </div>
                      
                      {/* Responsive Action Buttons inside Emulator */}
                      <div className="grid grid-cols-2 gap-2 pt-2">
                        <button className="h-9 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[10px] font-bold shadow-md shadow-blue-500/10">
                          عمل اصلی ۱ (۴۴px)
                        </button>
                        <button className="h-9 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-[10px]">
                          عمل فرعی ۲
                        </button>
                      </div>

                      <div className="h-16 bg-slate-950/40 rounded border border-slate-850 p-2 flex flex-col justify-between">
                        <span className="text-[8px] text-slate-500 font-mono">ماژول‌های منطق سلولی:</span>
                        <div className="flex flex-wrap gap-1">
                          {activeProject.files.filter(f => f.path.endsWith(".ts") || f.path.endsWith(".tsx")).map((f, i) => (
                            <span key={i} className="bg-slate-900 text-blue-400 text-[8px] px-1.5 py-0.5 rounded border border-slate-800 font-mono">
                              {f.path.split("/").pop()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900/20 border border-slate-850/30 rounded-lg p-2.5 text-center">
                      <span className="text-[9px] text-amber-500 italic">«برای موفقیت، اهداف لمس اصلی را در منطقه سبز نقشه قرار دهید.»</span>
                    </div>
                  </div>

                  {/* Navigation Pill at bottom */}
                  <div className="w-24 h-1.5 bg-slate-800 rounded-full mx-auto select-none"></div>

                </div>

                {/* Transparent Heatmap Overlay Layer */}
                {showHeatmap && (
                  <div className="absolute inset-0 bg-slate-950/20 pointer-events-none select-none z-10">
                    {/* SVG thumb pivot reach arc heatmap representation */}
                    <svg className="w-full h-full opacity-65" xmlns="http://www.w3.org/2000/svg">
                      {/* holding phone with right hand pivots from bottom-right (x: 100%, y: 100%) */}
                      {/* Green Zone (Easy Reach) */}
                      <path d="M 120 520 A 280 280 0 0 1 280 320 L 280 520 Z" fill="rgba(16, 185, 129, 0.3)" />
                      {/* Yellow Zone (Stretch Zone) */}
                      <path d="M 20 520 A 400 400 0 0 1 280 200 L 280 320 A 280 280 0 0 0 120 520 Z" fill="rgba(245, 158, 11, 0.2)" />
                      {/* Red Zone (Out of Reach - top left) */}
                      <rect x="0" y="0" width="280" height="200" fill="rgba(239, 68, 68, 0.25)" />
                      <path d="M 0 200 L 20 520 A 400 400 0 0 1 280 200 Z" fill="rgba(239, 68, 68, 0.15)" />
                    </svg>

                    {/* Floating Legends */}
                    <div className="absolute bottom-12 left-4 right-4 bg-slate-950/90 border border-slate-800 rounded-lg p-2 flex justify-between text-[8px] font-mono select-none" dir="rtl">
                      <span className="text-emerald-400 font-bold">سبز: دسترس آسان</span>
                      <span className="text-amber-400 font-bold">زرد: کشش متوسط</span>
                      <span className="text-rose-400 font-bold">قرمز: دشوار/پیچیده</span>
                    </div>

                    {/* Simulated Taps visualization */}
                    {simulatedTaps.map((tap, idx) => (
                      <div
                        key={idx}
                        className={`absolute w-4 h-4 -mt-2 -ml-2 rounded-full border-2 transform scale-100 animate-ping-once ${
                          tap.success 
                            ? "bg-emerald-500 border-emerald-300" 
                            : "bg-rose-500 border-rose-300"
                        }`}
                        style={{ left: `${tap.x}%`, top: `${tap.y}%` }}
                      />
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* Quick explanation about click tests */}
            {showHeatmap && (
              <p className="text-[10px] text-slate-500 font-mono text-center leading-relaxed">
                👆 روی بخش‌های مختلف شبیه‌ساز کلیک کنید تا عملکرد انگشت شست روی هیت‌مپ ارگونومی را به صورت بیصدا تست کنید.
              </p>
            )}

          </div>
        </div>

        {/* Right Col: Smart Audit Engine (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-5">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-end">
              <Gauge className="w-4 h-4 text-blue-500" />
              موتور سنجش سه شاخص کلیدی
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              این سیستم با اسکن هوشمند تک‌تک فایل‌های منبع، دارایی‌های رسانه‌ای و کدهای مانیفست، عیار خودمختاری و ارگونومی لمس را به روش آماری می‌سنجد.
            </p>

            <button
              id="run_audit_btn"
              onClick={runAudit}
              disabled={auditing}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 cursor-pointer disabled:opacity-50"
            >
              {auditing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  در حال تحلیل کدها...
                </>
              ) : (
                <>
                  <Fingerprint className="w-4 h-4" />
                  اجرای اسکن و ممیزی ارگونومی (Audit)
                </>
              )}
            </button>

            {/* Audit Results */}
            <AnimatePresence mode="wait">
              {auditScores ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-4 pt-2"
                >
                  {/* Overall score radial representation */}
                  <div className="bg-slate-950/80 border border-slate-850 rounded-xl p-4 text-center space-y-2">
                    <span className="text-[10px] text-slate-500 font-mono uppercase block">شاخص نهایی سرزندگی سلول (Tavana Index)</span>
                    <div className="text-4xl font-mono font-black text-blue-400">
                      {auditScores.overall}%
                    </div>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full inline-block font-bold ${
                      auditScores.overall >= 80 ? "bg-emerald-500/10 text-emerald-400" :
                      auditScores.overall >= 60 ? "bg-amber-500/10 text-amber-400" : "bg-rose-500/10 text-rose-400"
                    }`}>
                      {auditScores.overall >= 80 ? "محصول طراز تمدن خودکفا (عالی)" :
                       auditScores.overall >= 60 ? "نیازمند بهبودهای جزئی" : "فاقد فاکتورهای پایداری لمس"}
                    </span>
                  </div>

                  {/* Individual metrics sliders */}
                  <div className="space-y-3.5">
                    
                    {/* Metric 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">میزان استقلال آفلاین (Offline Resilience)</span>
                        <span className="font-mono text-emerald-400 font-bold">{auditScores.offline}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${auditScores.offline}%` }}></div>
                      </div>
                    </div>

                    {/* Metric 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">سهولت ارگونومی لمس (Touch Accessibility)</span>
                        <span className="font-mono text-blue-400 font-bold">{auditScores.touch}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                        <div className="bg-blue-500 h-full rounded-full" style={{ width: `${auditScores.touch}%` }}></div>
                      </div>
                    </div>

                    {/* Metric 3 */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400">شاخص سبکی سلول (Payload Optimization)</span>
                        <span className="font-mono text-purple-400 font-bold">{auditScores.payload}%</span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: `${auditScores.payload}%` }}></div>
                      </div>
                    </div>

                  </div>

                  {/* System Suggestions */}
                  <div className="bg-slate-950/60 border border-slate-850 rounded-xl p-3 space-y-2">
                    <span className="text-[10px] text-slate-500 font-bold block mb-1">رهنمودها و اصلاحات فنی معمار:</span>
                    <div className="space-y-2 text-[11px] leading-relaxed">
                      {auditScores.suggestions.map((sug, sIdx) => (
                        <div key={sIdx} className="text-slate-300">
                          {sug}
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              ) : (
                <div className="bg-slate-950/40 border border-slate-900 rounded-xl py-12 px-4 text-center text-slate-500 text-xs italic">
                  در انتظار کلیک بر روی دکمه اسکن برای تولید داده‌های تحلیلی...
                </div>
              )}
            </AnimatePresence>

            {/* Sincerity quote */}
            <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-3 flex gap-2">
              <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <p className="text-[10px] text-amber-300 leading-relaxed">
                این فناوری انقلابی با ایجاد اطمینان خاطر، به همدردان ما امکان می‌دهد تا فراتر از محدودیت‌های مادی، شاهکارهایی شایسته و بین‌المللی خلق کنند.
              </p>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
