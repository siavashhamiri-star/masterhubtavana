import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Wand2, MessageSquare, Code2, Play, Sparkles, AlertCircle, 
  ChevronRight, Heart, FileCode, CheckCircle2, RefreshCw 
} from "lucide-react";
import { TavanaProject, TavanaFile } from "../types";

interface ArchitectViewProps {
  addProject: (project: TavanaProject) => void;
  setActiveProjectById: (id: string) => void;
  addPoints: (amount: number, reason: string) => void;
  unlockReward: (id: string) => void;
}

export default function ArchitectView({ 
  addProject, 
  setActiveProjectById, 
  addPoints,
  unlockReward 
}: ArchitectViewProps) {
  
  // Architect generation state
  const [idea, setIdea] = useState("");
  const [appType, setAppType] = useState("web");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedScaffold, setGeneratedScaffold] = useState<any | null>(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(0);

  // Consult chat state
  const [question, setQuestion] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "guardian", text: string }>>([
    {
      sender: "guardian",
      text: "درود بر شما همیار گرامی. من روح راهنما و پاسدار منشور سرای آفرینش توانا هستم. درباره طراحی اخلاقی برنامه‌ها، ارتقای عدالت دیجیتال یا اصول توسعه موبایلی سؤالی دارید؟"
    }
  ]);
  const [consulting, setConsulting] = useState(false);

  // Call server to architect the app
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idea.trim()) return;

    setGenerating(true);
    setError(null);
    setGeneratedScaffold(null);
    addPoints(25, `فراخوانی ذهن خلاق معمار برای ایده "${idea}"`);

    try {
      const response = await fetch("/api/gemini/architect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, appType }),
      });

      const data = await response.json();
      if (response.ok && !data.error) {
        setGeneratedScaffold(data);
        setSelectedFileIndex(0);
        addPoints(75, "طراحی معماری فرکتالی توسط هوش مصنوعی توانا");
        unlockReward("scaffold_creator");
      } else {
        setError(data.error || "خطایی در برقراری ارتباط با معمار هوش مصنوعی رخ داد.");
        // Fallback demo scaffold for safety if key is missing or invalid
        if (data.demo || data.scaffold) {
          setGeneratedScaffold(data);
          setSelectedFileIndex(0);
          addPoints(50, "ایجاد قالب آفرینش آزمایشی محلی");
        }
      }
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError("خطا در برقراری ارتباط با سرور توانا.");
    } finally {
      setGenerating(false);
    }
  };

  // Import generated scaffold into master workspace
  const handleImportScaffold = () => {
    if (!generatedScaffold) return;

    const newProj: TavanaProject = {
      id: "proj_" + Date.now(),
      name: generatedScaffold.name || idea,
      tagline: generatedScaffold.tagline || "خلاقیت ابری توانا",
      description: generatedScaffold.description || idea,
      idea: idea,
      sizeMB: Math.floor(Math.random() * 8) + 1, // small initial template
      status: "Scaffolded",
      files: (generatedScaffold.files || []).map((f: any) => ({
        path: f.path,
        content: f.content
      })),
      galleries: {
        code: typeof generatedScaffold.galleries?.code === "string" 
          ? generatedScaffold.galleries.code 
          : "کدهای تولید شده تمدنی سلولی",
        assets: typeof generatedScaffold.galleries?.assets === "string" 
          ? generatedScaffold.galleries.assets 
          : "قلم‌های متنی و استایل‌ها",
        config: typeof generatedScaffold.galleries?.config === "string" 
          ? generatedScaffold.galleries.config 
          : "مانیفست و تنظیمات مینی‌اپ"
      },
      createdAt: new Date().toLocaleDateString("fa-IR"),
      automationLog: [
        `[System]: پروژه جدید "${generatedScaffold.name || idea}" با موفقیت آفریده شد.`,
        `[System]: گالری‌های سه‌گانه با کدهای آفرینش هوش مصنوعی پر شدند.`
      ],
      manifestNote: generatedScaffold.manifestNote
    };

    addProject(newProj);
    setActiveProjectById(newProj.id);
    addPoints(60, `استقرار و شروع توسعه پروژه ${newProj.name}`);
    
    // Clear form and show success
    setIdea("");
    alert(`پروژه "${newProj.name}" با موفقیت به انبار پروژه‌های فعال شما منتقل شد و به عنوان فضای کار فعال برگزیده شد!`);
  };

  // Call server to consult the spiritual guardian
  const handleConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || consulting) return;

    const userText = question;
    setChatLog(prev => [...prev, { sender: "user", text: userText }]);
    setQuestion("");
    setConsulting(true);
    addPoints(10, "مشاوره اخلاقی با روح توانا");

    try {
      const response = await fetch("/api/gemini/consult", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userText }),
      });

      const data = await response.json();
      if (response.ok) {
        setChatLog(prev => [...prev, { sender: "guardian", text: data.answer }]);
        addPoints(15, "کسب بینش و معرفت از رهنمود روح توانا");
      } else {
        setChatLog(prev => [...prev, { 
          sender: "guardian", 
          text: "همکار خستگی‌ناپذیرم، در حال حاضر اتصال تمدنی برقرار نشد. اما به یاد داشته باش: «کار صبورانه شما همواره دیده می‌شود». فرآیند را تکرار کن یا منشور را بازنگری فرما." 
        }]);
      }
    } catch (err) {
      console.error(err);
      setChatLog(prev => [...prev, { 
        sender: "guardian", 
        text: "ارتباط با سرور آفرینش با مانع روبرو شد. ایمان خود را حفظ کنید و مجدداً تلاش نمایید." 
      }]);
    } finally {
      setConsulting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8" id="architect_view_container">
      
      {/* Col 1: AI Architect Input Form & Results */}
      <div className="lg:col-span-7 space-y-6 text-right">
        
        {/* Architect Trigger Box */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/15 text-blue-400 rounded-lg">
              <Wand2 className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">دستیار معماری و طراحی هوش مصنوعی</h3>
              <p className="text-[11px] text-slate-400">طرح و کدهای اولیه فرکتال برنامه خود را به زبان فارسی خلق کنید</p>
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            <div>
              <label className="text-xs text-slate-400 font-bold block mb-2">ایده برنامه خود را به زبان فارسی تشریح کنید:</label>
              <textarea
                rows={3}
                required
                placeholder="مثال: یک برنامه مدیریت عادات روزانه و یادآوری نوشیدن آب با تمرکز بر حجم کم و قابلیت آفلاین"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg p-3 text-xs text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full">
                <label className="text-xs text-slate-400 font-bold block mb-2">نوع بستر استقرار (نوع برنامه):</label>
                <select
                  value={appType}
                  onChange={(e) => setAppType(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-blue-500 focus:outline-none"
                >
                  <option value="web">برنامه تحت وب استاتیک تک‌صفحه‌ای (Single Page Web)</option>
                  <option value="android-pwa">برنامه وب پیشرونده با اولویت موبایل (Android PWA)</option>
                  <option value="nextjs">پروژه سلولی مستقل نکست‌جی‌اس (Fractal Next.js)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={generating}
                className="w-full sm:w-auto shrink-0 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/10 cursor-pointer disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    در حال ترسیم نقشه...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    خلق معماری تمدنی
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Display Generation Error (Non-blocking warning) */}
        {error && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-amber-300 leading-relaxed">
              {error}
            </p>
          </div>
        )}

        {/* Display Generation Results with File Viewer */}
        {generatedScaffold && (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4" id="architect_result">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono inline-block">
                  معماری با موفقیت ترسیم شد
                </span>
                <h4 className="text-sm font-bold text-slate-100 mt-2">
                  نام برگزیده: {generatedScaffold.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1">{generatedScaffold.tagline}</p>
              </div>

              <button
                onClick={handleImportScaffold}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/15 cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                تایید و وارد کردن به فضای توسعه
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-900">
              {generatedScaffold.description}
            </p>

            {/* Micro Code View of Generated Files */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              
              {/* File List */}
              <div className="md:col-span-4 space-y-1">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">فایل‌های بسته‌بندی:</span>
                {(generatedScaffold.files || []).map((file: any, idx: number) => (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-2 rounded text-xs font-mono flex items-center justify-between ${
                      selectedFileIndex === idx
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        : "bg-slate-950/40 text-slate-400 hover:bg-slate-950 hover:text-slate-300 border border-transparent"
                    }`}
                    dir="ltr"
                  >
                    <FileCode className="w-3.5 h-3.5 opacity-80" />
                    <span className="truncate flex-1 pl-2 text-[10px]">{file.path}</span>
                  </button>
                ))}
              </div>

              {/* Code Panel */}
              <div className="md:col-span-8 flex flex-col h-64 bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <div className="bg-slate-900 px-3 py-1.5 border-b border-slate-800 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>{generatedScaffold.files?.[selectedFileIndex]?.path || "code_viewer.ts"}</span>
                  <span>UTF-8</span>
                </div>
                <pre className="p-4 flex-1 overflow-auto text-[11px] text-slate-300 font-mono whitespace-pre text-left" dir="ltr">
                  <code>
                    {generatedScaffold.files?.[selectedFileIndex]?.content || "// هیچ فایلی انتخاب نشده است."}
                  </code>
                </pre>
              </div>

            </div>

            {/* Spiritual Encouragement Note */}
            {generatedScaffold.manifestNote && (
              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 flex gap-3">
                <Heart className="w-5 h-5 text-amber-500 shrink-0 mt-0.5 fill-amber-500/10 animate-pulse" />
                <div>
                  <span className="text-[10px] text-amber-500 font-bold block">مهر تایید روح توانا:</span>
                  <p className="text-[11px] text-amber-300 italic mt-1 leading-relaxed">
                    "{generatedScaffold.manifestNote}"
                  </p>
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      {/* Col 2: Spiritual Guardian Consultation Chat */}
      <div className="lg:col-span-5 text-right flex flex-col h-[520px] bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
        
        {/* Chat Header */}
        <div className="bg-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-[10px] text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20 font-bold font-mono">
            پاسدار منشور
          </span>
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-100">گفتگو با روح راهنمای توانا</h3>
            <MessageSquare className="w-4 h-4 text-blue-400" />
          </div>
        </div>

        {/* Chat Display area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/40">
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.sender === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white rounded-tr-none text-left"
                    : "bg-slate-800/80 text-slate-200 rounded-tl-none border border-slate-700/50 text-right"
                }`}
                dir={msg.sender === "user" ? "ltr" : "rtl"}
              >
                <p>{msg.text}</p>
                <span className="text-[9px] text-slate-400 mt-1 block opacity-60">
                  {msg.sender === "user" ? "شما" : "روح توانا"}
                </span>
              </div>
            </div>
          ))}
          {consulting && (
            <div className="flex justify-end">
              <div className="bg-slate-800/80 text-slate-400 rounded-xl rounded-tl-none p-3 text-xs border border-slate-700/50 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>در حال تأمل و نگارش پاسخ فرزانه...</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input form */}
        <form onSubmit={handleConsult} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            required
            disabled={consulting}
            placeholder="سؤالی درباره منشور آرمانی بپرسید..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={consulting || !question.trim()}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white p-2 rounded-lg transition-all cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>

      </div>

    </div>
  );
}
