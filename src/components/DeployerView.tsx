import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Server, Cloud, Link2, Play, Terminal, CheckCircle2, 
  HelpCircle, AlertTriangle, ShieldCheck, Cpu, GitBranch, RotateCcw, Eye, FileText, X, RefreshCcw
} from "lucide-react";
import { TavanaProject, DeploymentProvider, DeploymentStatus, DeploymentVersion } from "../types";

interface DeployerViewProps {
  activeProject: TavanaProject | null;
  addPoints: (amount: number, reason: string) => void;
  updateProject: (project: TavanaProject) => void;
  unlockReward: (id: string) => void;
}

const PROVIDERS = [
  { id: "Netlify", name: "Netlify", desc: "استقرار رایگان، پایدار و پرسرعت برای برنامه‌های کوچک استاتیک.", type: "Static" },
  { id: "Cloudflare-Pages", name: "Cloudflare Pages", desc: "توزیع ابری جهانی با لایه امنیتی قدرتمند کلاودفلر.", type: "Static" },
  { id: "Custom-VPS", name: "سرور شخصی VPS", desc: "میزبانی مستقل در سرورهای اوبونتو بدون هیچگونه محدودیت تمدنی.", type: "Dynamic/VPS" },
  { id: "Firebase", name: "Firebase Hosting", desc: "سازگار با موتور دیتابیس Firestore برای پروژه‌های تمدنی بزرگ.", type: "Fullstack" }
];

export default function DeployerView({ 
  activeProject, 
  addPoints, 
  updateProject,
  unlockReward 
}: DeployerViewProps) {
  
  const [deploying, setDeploying] = useState(false);
  const [connectedHosts, setConnectedHosts] = useState<string[]>(["Netlify"]);
  const [connectingHost, setConnectingHost] = useState<string | null>(null);
  const [commitMessage, setCommitMessage] = useState("");
  const [simulateFailure, setSimulateFailure] = useState(false);
  const [viewingVersion, setViewingVersion] = useState<DeploymentVersion | null>(null);

  if (!activeProject) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center" id="deploy_no_project">
        <Server className="w-16 h-16 text-slate-700 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-300">پروژه‌ای انتخاب نشده است</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          برای دپلو‌ی و پارکِ هوشمند برنامه‌ها، ابتدا بایستی پروژه‌ای را از دستیار معماری خلق یا برگزینید.
        </p>
      </div>
    );
  }

  // Connect a new host provider (Simulated with point awards)
  const connectHost = (providerId: string) => {
    if (connectedHosts.includes(providerId)) return;
    
    setConnectingHost(providerId);
    setTimeout(() => {
      setConnectedHosts(prev => [...prev, providerId]);
      setConnectingHost(null);
      addPoints(40, `برقراری اتصال امن با بستر میزبان ${providerId}`);
      
      const updatedLog = [
        ...activeProject.automationLog,
        `[Tavana Deployer]: پل ارتباطی ایمن با بستر ابری ${providerId} با موفقیت به انبار اتصالات افزوده شد.`
      ];
      updateProject({
        ...activeProject,
        automationLog: updatedLog
      });
    }, 1500);
  };

  // Run the Smart Deployment automation logic
  const runSmartDeploy = () => {
    if (deploying) return;

    setDeploying(true);
    addPoints(50, `آغاز فرآیند استقرار خودکار پروژه ${activeProject.name}`);

    // Update log
    let logs = [
      ...activeProject.automationLog,
      `[Deploy Engine - ${new Date().toLocaleTimeString()}]: شروع فرآیند استقرار خودکار (Auto-Deploy)...`,
      `[Deploy Engine]: سنجش فایل‌های پروژه و آنالیز فایروال آغاز شد...`,
      `[Deploy Engine]: حجم کل پکیج برابر با ${activeProject.sizeMB} مگابایت محاسبه گردید.`
    ];

    setTimeout(() => {
      // Determine target and decision
      const isHeavy = activeProject.sizeMB > 100;
      const targetProvider: DeploymentProvider = isHeavy ? "Custom-VPS" : "Netlify";

      if (isHeavy) {
        logs.push(`[Decision]: هشدار! حجم پروژه (${activeProject.sizeMB}MB) بیش از حد توان بستر‌های اشتراکی رایگان است.`);
        logs.push(`[Decision]: انتقال و استقرار به سرور شخصی VPS با دسترسی روت لینوکس آغاز شد...`);
      } else {
        logs.push(`[Decision]: حجم نرمال (${activeProject.sizeMB}MB). بستر Netlify انتخاب مناسب و پرسرعت تشخیص داده شد.`);
        logs.push(`[Decision]: فشرده‌سازی فایل‌های استاتیک در سلول‌های فرکتالی انجام شد...`);
      }

      setTimeout(() => {
        const isSuccess = !simulateFailure;
        const currentVersionNumber = (activeProject.deployments?.length || 0) + 1;

        if (isSuccess) {
          logs.push(`[Deploy Engine]: انتقال دارایی‌های رسانه‌ای به گالری دارایی‌های ${targetProvider}...`);
          logs.push(`[Deploy Engine]: تزریق کلیدها و پیکربندیِ نهایی دایرکتوری استقرار...`);
          logs.push(`[Deploy Engine]: تبریک! پروژه در بستر ${targetProvider} با موفقیت پارک شد (نسخه ${currentVersionNumber}).`);
        } else {
          logs.push(`[Deploy Engine]: خطا! انتقال دارایی‌های رسانه‌ای به علت اختلال در فایروال میزبان ${targetProvider} متوقف شد.`);
          logs.push(`[Deploy Engine]: لغو عملیات استقرار. ثبت نسخه ناموفق ${currentVersionNumber} در سیستم کنترل نسخه.`);
        }

        const newVersion: DeploymentVersion = {
          id: "dep_" + Date.now(),
          versionNumber: currentVersionNumber,
          timestamp: new Date().toLocaleDateString("fa-IR") + "، " + new Date().toLocaleTimeString("fa-IR"),
          status: isSuccess ? "Success" : "Failed",
          provider: targetProvider,
          files: [...activeProject.files],
          sizeMB: activeProject.sizeMB,
          commitMessage: commitMessage.trim() || `تغییرات خودکار نسخه ${currentVersionNumber}`
        };

        const updated: TavanaProject = {
          ...activeProject,
          status: isSuccess ? "Parked" : "Failed",
          location: isSuccess ? targetProvider : activeProject.location,
          automationLog: logs,
          deployments: [...(activeProject.deployments || []), newVersion]
        };

        updateProject(updated);
        setDeploying(false);
        setCommitMessage(""); // Reset commit message

        if (isSuccess) {
          // Award points & unlock rewards based on conditions
          if (isHeavy) {
            addPoints(150, "کلاهک طلایی استقرار برنامه سنگین در VPS اختصاصی");
            unlockReward("vps_conqueror");
          } else {
            addPoints(100, `استقرار موفق در بستر پرسرعت ابری ${targetProvider}`);
            unlockReward("smart_deployer");
          }
        } else {
          addPoints(15, `ثبت شکست فرآیند دپلوی در لاگ کنترل نسخه`);
        }

      }, 2000);
    }, 1500);
  };

  const handleRollback = (version: DeploymentVersion) => {
    if (confirm(`آیا از بازگردانی پروژه به نسخه شماره ${version.versionNumber} اطمینان دارید؟ تمام فایل‌های جاری شما با فایل‌های این نسخه جایگزین خواهند شد.`)) {
      const logs = [
        ...activeProject.automationLog,
        `[Version Control - ${new Date().toLocaleTimeString()}]: بازگردانی (Rollback) به نسخه شماره ${version.versionNumber} آغاز شد.`,
        `[Version Control]: جایگزینی تعداد ${version.files.length} فایل از بک‌آپ نسخه ${version.versionNumber}...`,
        `[Version Control]: بازگردانی با موفقیت انجام شد.`
      ];

      const updated: TavanaProject = {
        ...activeProject,
        files: [...version.files],
        status: "Scaffolded",
        automationLog: logs
      };

      updateProject(updated);
      addPoints(80, `بازگردانی پیروزمندانه پروژه به نسخه ${version.versionNumber}`);
    }
  };

  const isProjectHeavy = activeProject.sizeMB > 100;

  return (
    <div className="space-y-8" id="deployer_view_container">
      
      {/* Smart Analysis Summary */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        
        <div className="md:col-span-2 text-right">
          <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2.5 py-1 rounded border border-blue-500/20 font-bold uppercase font-mono">
            Tavana Smart Engine / تصمیم‌گیری هوشمند خانه
          </span>
          <h2 className="text-lg font-bold text-slate-100 mt-2">
            آنالیز معماری و محاسبه تخصیص میزبان
          </h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            موتور خانه توانا حجم سلول شما را بررسی می‌کند. پروژه‌های تا سقف ۱۰۰ مگابایت به صورت استاتیک در بسترهای پرسرعت ابری جهانی مستقر می‌شوند. برنامه‌های سنگین‌تر با تخصیص پورت پویا مستقیماً روی سرورهای VPS شخصی لینوکس پارک خواهند شد.
          </p>

          <div className="flex gap-4 mt-4 text-xs font-mono">
            <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-900">
              <span className="text-slate-500">حجم محاسبه‌شده:</span>{" "}
              <span className={isProjectHeavy ? "text-amber-500 font-bold" : "text-emerald-400 font-bold"}>
                {activeProject.sizeMB} مگابایت
              </span>
            </div>
            <div className="bg-slate-950 px-3 py-1.5 rounded border border-slate-900">
              <span className="text-slate-500">میزبان پیشنهادی:</span>{" "}
              <span className="text-blue-400 font-bold">
                {isProjectHeavy ? "سرور اختصاصی VPS" : "ابر فشرده Netlify"}
              </span>
            </div>
          </div>
        </div>

        {/* Big deploy button and Configuration */}
        <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-5 text-right flex flex-col justify-between h-full">
          <div>
            <span className="text-[10px] text-slate-500 uppercase font-mono block mb-3">تنظیمات و فرمان اتوماسیون</span>
            
            {/* Commit Message input */}
            <div className="mb-4">
              <label className="text-[10px] text-slate-400 block mb-1">توضیحات تغییرات (Commit Message):</label>
              <input 
                type="text"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="مثلاً: بهبود استایل‌ها یا افزودن ماژول گالری"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors text-right"
                dir="rtl"
              />
            </div>

            {/* Simulate failure toggle */}
            <div className="flex items-center justify-between mb-4 bg-slate-900/20 p-2.5 rounded-lg border border-slate-900/60">
              <span className="text-[11px] text-slate-400">شبیه‌سازی خطای استقرار</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-8 h-4.5 bg-slate-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-rose-600 peer-checked:after:bg-white"></div>
              </label>
            </div>
          </div>
          
          <div>
            {deploying ? (
              <div className="w-full bg-blue-600/10 border border-blue-500/20 text-blue-400 py-3 rounded-xl text-xs font-bold font-mono flex items-center justify-center gap-2 animate-pulse">
                <RefreshCcw className="w-4 h-4 animate-spin" />
                <span>در حال پردازش و دپلوی سلول...</span>
              </div>
            ) : (
              <button
                id="deploy_engine_btn"
                onClick={runSmartDeploy}
                disabled={activeProject.status === "Draft"}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 disabled:opacity-50 text-white py-3 rounded-xl text-xs font-bold font-mono transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/15 glow-btn cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white animate-pulse" />
                <span>{activeProject.status === "Parked" ? "به‌روزرسانی و دپلویِ جدید" : "اجرای دپلویِ خودکار (Deploy)"}</span>
              </button>
            )}

            {activeProject.status === "Draft" && (
              <span className="text-[10px] text-amber-500 bg-amber-500/10 px-2 py-1 rounded mt-2 block text-center">
                ⚠️ ابتدا فایل را از تب فایل‌سیستم بازگشایی کنید.
              </span>
            )}
          </div>
        </div>

      </div>

      {/* Connection Hosts and Logs Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Col 1: Host Connections */}
        <div className="lg:col-span-7 space-y-4 text-right">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 justify-end">
            <Link2 className="w-4 h-4 text-blue-500" />
            بسترهای میزبانی امن (Host Providers)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {PROVIDERS.map((prov) => {
              const isConnected = connectedHosts.includes(prov.id);
              const isConnecting = connectingHost === prov.id;

              return (
                <div
                  key={prov.id}
                  className={`bg-slate-900/30 border rounded-xl p-4 flex flex-col justify-between h-40 transition-all ${
                    isConnected
                      ? "border-emerald-500/30 shadow-md shadow-emerald-500/5"
                      : "border-slate-800"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase">{prov.type}</span>
                      {isConnected ? (
                        <span className="text-[9px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">
                          متصل شده
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded-full">
                          غیرفعال
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-slate-200 mt-2">{prov.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed text-right">{prov.desc}</p>
                  </div>

                  {!isConnected && (
                    <button
                      onClick={() => connectHost(prov.id)}
                      disabled={!!connectingHost}
                      className="w-full bg-slate-950 hover:bg-slate-900 text-slate-300 py-1.5 rounded-lg text-[10px] font-bold border border-slate-800 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {isConnecting ? "در حال اتصال امن..." : "ایجاد اتصال ابری"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Col 2: Automation Telemetry Logs */}
        <div className="lg:col-span-5 space-y-4 text-right">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 justify-end">
            <Terminal className="w-4 h-4 text-blue-500" />
            لاگ‌های تلمتری و اتوماسیون سرای آفرینش
          </h3>

          <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 font-mono text-[11px] h-40 overflow-y-auto space-y-2 text-left flex flex-col justify-start" dir="ltr">
            {activeProject.automationLog.length === 0 ? (
              <span className="text-slate-600 block italic text-center">لاگی برای نمایش وجود ندارد. فرآیندی را آغاز کنید.</span>
            ) : (
              activeProject.automationLog.map((logLine, idx) => {
                let colorClass = "text-slate-400";
                if (logLine.includes("[Decision]")) colorClass = "text-amber-400 font-bold";
                else if (logLine.includes("[Tavana") || logLine.includes("[System]")) colorClass = "text-blue-400";
                else if (logLine.includes("تبریک") || logLine.includes("موفقیت") || logLine.includes("Parked") || logLine.includes("رول‌بک")) colorClass = "text-emerald-400 font-bold";
                else if (logLine.includes("خطا") || logLine.includes("هشدار") || logLine.includes("خطر")) colorClass = "text-rose-400 font-bold";

                return (
                  <div key={idx} className={`${colorClass} leading-relaxed break-all`}>
                    {logLine}
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Version Control History Panel */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 text-right" id="version_control_history_panel">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 mb-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <GitBranch className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-200">تاریخچه نسخه‌ها و پشتیبانی از رول‌بک (Rollback)</h3>
              <p className="text-xs text-slate-500 mt-0.5">تمام تلاش‌های استقرار با برچسب زمان و پرچم وضعیت ثبت می‌شوند.</p>
            </div>
          </div>
          <div className="text-xs text-slate-400 font-mono bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-900">
            نسخه‌های ثبت شده: <span className="text-blue-400 font-bold font-mono">{(activeProject.deployments || []).length}</span>
          </div>
        </div>

        {(!activeProject.deployments || activeProject.deployments.length === 0) ? (
          <div className="text-center py-8 text-slate-600 text-xs italic">
            هنوز هیچ نسخه‌ای در آرشیو این پروژه ثبت نشده است. با اجرای اولین استقرار، نسخه‌گذاری خودکار آغاز می‌گردد.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs">
              <thead>
                <tr className="border-b border-slate-800/60 text-slate-500 font-bold">
                  <th className="py-2.5 px-3">شماره نسخه</th>
                  <th className="py-2.5 px-3">زمان استقرار</th>
                  <th className="py-2.5 px-3">توضیحات (Commit Message)</th>
                  <th className="py-2.5 px-3">بستر هدف</th>
                  <th className="py-2.5 px-3">وضعیت استقرار</th>
                  <th className="py-2.5 px-3">اندازه / فایل‌ها</th>
                  <th className="py-2.5 px-3 text-left">عملیات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/30">
                {[...(activeProject.deployments || [])].reverse().map((dep) => (
                  <tr key={dep.id} className="hover:bg-slate-900/20 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-300">v{dep.versionNumber}</td>
                    <td className="py-3.5 px-3 text-slate-400 font-mono text-[11px]" dir="ltr">{dep.timestamp}</td>
                    <td className="py-3.5 px-3 font-medium text-slate-200 max-w-xs truncate" title={dep.commitMessage}>
                      {dep.commitMessage}
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-900 text-[10px] text-slate-400 font-mono">
                        {dep.provider}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        dep.status === "Success" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${dep.status === "Success" ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
                        {dep.status === "Success" ? "موفق" : "ناموفق"}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-500">
                      {dep.sizeMB}MB / {dep.files?.length || 0} فایل
                    </td>
                    <td className="py-3.5 px-3 text-left">
                      <div className="inline-flex gap-2" dir="ltr">
                        <button
                          onClick={() => setViewingVersion(dep)}
                          className="bg-slate-950 hover:bg-slate-900 text-slate-300 border border-slate-800 rounded-lg px-2.5 py-1.5 transition-all text-[11px] flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>مشاهده فایل‌ها</span>
                        </button>
                        
                        <button
                          onClick={() => handleRollback(dep)}
                          disabled={dep.status !== "Success"}
                          className={`rounded-lg px-2.5 py-1.5 transition-all text-[11px] flex items-center gap-1 cursor-pointer ${
                            dep.status === "Success"
                              ? "bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20"
                              : "bg-slate-950 text-slate-600 border border-slate-900 cursor-not-allowed"
                          }`}
                          title={dep.status === "Success" ? "بازگردانی فایل‌های پروژه به این نسخه" : "نسخه‌های ناموفق قابل بازگردانی نیستند"}
                        >
                          <RotateCcw className="w-3 h-3" />
                          <span>رول‌بک</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Archive Files Viewer Modal */}
      <AnimatePresence>
        {viewingVersion && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col h-[520px] text-right"
              id="archive_files_modal"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
                <button 
                  onClick={() => setViewingVersion(null)}
                  className="text-slate-400 hover:text-slate-200 bg-slate-900 border border-slate-800 rounded-lg p-1.5 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-200">آرشیو فایل‌های نسخه #{viewingVersion.versionNumber}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5" dir="ltr">{viewingVersion.commitMessage}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60 text-[11px] text-slate-400 leading-relaxed text-right">
                  تعداد فایل‌های بایگانی شده در این نسخه: <span className="text-blue-400 font-bold font-mono">{(viewingVersion.files || []).length}</span> عدد. شما می‌توانید محتوای فایل‌ها را بازبینی کنید.
                </div>

                <div className="space-y-3">
                  {(viewingVersion.files || []).map((file, fIdx) => (
                    <div key={fIdx} className="bg-slate-950 border border-slate-850 rounded-xl overflow-hidden">
                      <div className="bg-slate-900/60 px-4 py-1.5 border-b border-slate-850 flex items-center justify-between" dir="ltr">
                        <span className="text-[11px] font-mono text-blue-400">{file.path}</span>
                        <span className="text-[9px] text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-900 font-mono">
                          {file.content ? (file.content.length * 2 / 1024).toFixed(2) : 0} KB
                        </span>
                      </div>
                      <pre className="p-3 overflow-x-auto text-left text-slate-300 font-mono text-[11px] leading-relaxed bg-slate-950 max-h-32 overflow-y-auto" dir="ltr">
                        {file.content || "// فایل خالی"}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <button
                  onClick={() => setViewingVersion(null)}
                  className="bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  بستن پنجره
                </button>
                {viewingVersion.status === "Success" && (
                  <button
                    onClick={() => {
                      setViewingVersion(null);
                      handleRollback(viewingVersion);
                    }}
                    className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/10 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>بازگردانی به این نسخه</span>
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

