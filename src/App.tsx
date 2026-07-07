import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Shield, FileArchive, Wand2, Server, Plus, Trash2, 
  Menu, X, Sparkles, Award, Compass, Heart, RefreshCw, Smartphone, Users,
  Car
} from "lucide-react";

import { TavanaProject, TavanaFile } from "./types";
import { MOCK_PROJECTS } from "./data/mockProjects";

import ManifestView from "./components/ManifestView";
import FileSystemView from "./components/FileSystemView";
import ArchitectView from "./components/ArchitectView";
import DeployerView from "./components/DeployerView";
import VitalityLabView from "./components/VitalityLabView";
import SocialClubView from "./components/SocialClubView";
import HavenView from "./components/HavenView";

export default function App() {
  // Tab navigation
  const [activeTab, setActiveTab] = useState<"manifest" | "files" | "architect" | "deployer" | "haven" | "vitality_lab" | "social_club">("haven");
  
  // Projects State
  const [projects, setProjects] = useState<TavanaProject[]>(() => {
    const saved = localStorage.getItem("tavana_projects");
    return saved ? JSON.parse(saved) : MOCK_PROJECTS;
  });
  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    const saved = localStorage.getItem("tavana_active_project_id");
    if (saved) return saved;
    const savedProjects = localStorage.getItem("tavana_projects");
    const projList = savedProjects ? JSON.parse(savedProjects) : MOCK_PROJECTS;
    return projList[0]?.id || "";
  });

  // Points State (Silent Monitoring)
  const [points, setPoints] = useState<number>(() => {
    const saved = localStorage.getItem("tavana_points");
    return saved ? parseInt(saved) : 100;
  });

  // Unlocked Rewards
  const [unlockedRewards, setUnlockedRewards] = useState<string[]>(() => {
    const saved = localStorage.getItem("tavana_unlocked_rewards");
    return saved ? JSON.parse(saved) : [];
  });

  // Notifications / Silent toast state
  const [toasts, setToasts] = useState<Array<{ id: string; text: string; points?: number }>>([]);

  // Collapsible sidebar state (for mobile first design)
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("tavana_projects", JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem("tavana_active_project_id", activeProjectId);
  }, [activeProjectId]);

  useEffect(() => {
    localStorage.setItem("tavana_points", points.toString());
  }, [points]);

  useEffect(() => {
    localStorage.setItem("tavana_unlocked_rewards", JSON.stringify(unlockedRewards));
  }, [unlockedRewards]);

  // Helpers
  const addPoints = (amount: number, reason: string) => {
    setPoints(prev => prev + amount);
    
    // Create custom notification toast
    const newToast = {
      id: "toast_" + Date.now() + "_" + Math.random(),
      text: reason,
      points: amount
    };
    setToasts(prev => [newToast, ...prev].slice(0, 4));

    // Automatically remove after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4000);
  };

  const unlockReward = (id: string) => {
    if (!unlockedRewards.includes(id)) {
      setUnlockedRewards(prev => [...prev, id]);
    }
  };

  const addProject = (proj: TavanaProject) => {
    setProjects(prev => [proj, ...prev]);
  };

  const updateProject = (updatedProj: TavanaProject) => {
    setProjects(prev => prev.map(p => p.id === updatedProj.id ? updatedProj : p));
  };

  const deleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("آیا از حذف این سلول توسعه اطمینان دارید؟ تمامی گالری‌ها و فایل‌های مرتبط پاک خواهند شد.")) {
      const filtered = projects.filter(p => p.id !== id);
      setProjects(filtered);
      addPoints(-20, "حذف پروژه از مخزن");
      if (activeProjectId === id && filtered.length > 0) {
        setActiveProjectId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveProjectId("");
      }
    }
  };

  const handleCreateNewBlankProject = () => {
    const name = prompt("نام برنامه خود را وارد کنید:");
    if (!name) return;

    const newProj: TavanaProject = {
      id: "proj_" + Date.now(),
      name: name,
      tagline: "سلول خودکفای خام",
      description: "یک ماژول مستقل که آماده دریافت فایل و توسعه بر اساس منشور توانا است.",
      idea: "ایجاد دستی سلول",
      sizeMB: Math.floor(Math.random() * 5) + 1,
      status: "Draft",
      files: [
        { path: "index.html", content: `<h1>خوش آمدید به ${name}</h1>` }
      ],
      galleries: {
        code: "- Added index.html",
        assets: "",
        config: ""
      },
      createdAt: new Date().toLocaleDateString("fa-IR"),
      automationLog: ["[System]: ایجاد دستی سلول خام. آماده برای تزریق کدهای تمدنی."]
    };

    addProject(newProj);
    setActiveProjectId(newProj.id);
    addPoints(25, `شروع مستقل ساخت برنامه "${name}"`);
  };

  const activeProject = projects.find(p => p.id === activeProjectId) || null;

  return (
    <div className="min-h-screen bg-tavana-bg text-slate-100 cyber-grid relative flex flex-col antialiased">
      
      {/* Floating Silent Monitoring Toasts */}
      <div className="fixed top-5 left-5 z-50 space-y-3 pointer-events-none max-w-sm text-left">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: -50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -50, scale: 0.9 }}
              className="bg-slate-900/90 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl shadow-2xl flex items-center gap-3 backdrop-blur-md"
            >
              <div className="bg-emerald-500/10 p-2 rounded-lg shrink-0">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              </div>
              <div className="text-right flex-1">
                <span className="text-[10px] text-slate-500 block">رصد بیصدا / پاداش زحمت</span>
                <span className="text-xs font-medium text-slate-100 block mt-0.5">{toast.text}</span>
              </div>
              {toast.points && (
                <span className="font-mono text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
                  +{toast.points}
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Primary Top Header */}
      <header className="bg-slate-950/80 border-b border-tavana-border/80 sticky top-0 z-40 backdrop-blur-lg px-4 py-3" id="main_header">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Right side: App Brand */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-slate-100 border border-slate-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </div>
              <div className="text-right">
                <h1 className="text-sm font-black text-slate-100 tracking-wide font-display">سرایِ آفرینشِ توانا</h1>
                <span className="text-[9px] text-slate-500 block font-mono">TAVANA MASTER HUB</span>
              </div>
            </div>
          </div>

          {/* Left side: Points Tracker & Profile */}
          <div className="flex items-center gap-4 font-mono">
            <div className="bg-slate-900 border border-tavana-border px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-slate-400">زحمت:</span>
              <span className="text-sm font-bold text-amber-400">{points}</span>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-right">
              <span className="text-[10px] text-slate-400 font-bold block">همیار توسعه‌دهنده</span>
              <span className="text-[9px] text-slate-500 font-mono block">siavashhamiri@gmail.com</span>
            </div>
          </div>

        </div>
      </header>

      {/* App Body Shell */}
      <div className="flex-1 flex max-w-7xl mx-auto w-full relative">
        
        {/* Sidebar Panel: Workspace / Cell Manager */}
        <aside
          className={`lg:block shrink-0 w-72 bg-slate-950/60 border-l border-tavana-border p-5 space-y-6 absolute lg:relative top-0 bottom-0 right-0 z-30 transition-transform duration-300 lg:translate-x-0 ${
            sidebarOpen ? "translate-x-0 bg-slate-950" : "translate-x-full"
          }`}
          id="project_sidebar"
        >
          {/* Mobile close trigger */}
          <div className="flex justify-between items-center lg:hidden pb-4 border-b border-slate-900">
            <span className="text-xs font-bold text-slate-400">مخازن آفرینش توانا</span>
            <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-slate-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section: Workspace Projects list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono font-bold uppercase">Workspaces / سلول‌ها</span>
              <button
                onClick={handleCreateNewBlankProject}
                className="p-1 text-slate-400 hover:text-blue-400 border border-slate-800 rounded bg-slate-900 transition-colors"
                title="ایجاد دستی سلول خام جدید"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2 max-h-[420px] overflow-y-auto" id="projects_list">
              {projects.length === 0 ? (
                <div className="text-center py-6 text-slate-600 text-xs italic">
                  مخزنی یافت نشد. یک پروژه خلق کنید!
                </div>
              ) : (
                projects.map((proj) => {
                  const isActive = proj.id === activeProjectId;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => {
                        setActiveProjectId(proj.id);
                        setSidebarOpen(false); // Auto-close on mobile selection
                        addPoints(5, `تغییر محیط کار به ${proj.name}`);
                      }}
                      className={`w-full text-right p-3 rounded-xl border transition-all text-xs group flex flex-col justify-between relative overflow-hidden cursor-pointer ${
                        isActive
                          ? "bg-slate-900 border-blue-500/80 shadow-md shadow-blue-500/5"
                          : "bg-slate-950/40 border-slate-900 hover:bg-slate-900 hover:border-slate-800"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-extrabold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {proj.name}
                        </span>
                        
                        <button
                          onClick={(e) => deleteProject(proj.id, e)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-rose-400 p-0.5 transition-opacity duration-200"
                          title="حذف سلول"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[180px]">
                        {proj.tagline || proj.idea}
                      </span>

                      <div className="flex items-center justify-between w-full mt-3 border-t border-slate-900/60 pt-2 text-[9px] font-mono">
                        <span className="text-slate-500">{proj.createdAt}</span>
                        <span className={`px-1.5 py-0.5 rounded ${
                          proj.status === "Parked" ? "text-emerald-400 bg-emerald-500/10" :
                          proj.status === "Scaffolded" ? "text-blue-400 bg-blue-500/10" : "text-amber-500 bg-amber-500/10"
                        }`}>
                          {proj.status === "Draft" ? "پکیج اولیه" : 
                           proj.status === "Scaffolded" ? "آماده توسعه" : "پارک شده"}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Simple Manifesto Credit Box */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-3 text-center">
            <span className="text-[9px] text-slate-500 font-bold block leading-relaxed uppercase font-mono">
              سرای آفرینش توانا v1.2
            </span>
            <span className="text-[10px] text-slate-400 mt-1 block">
              «چرخه آفرینش و استقرار موبایلی»
            </span>
          </div>

        </aside>

        {/* Main Panel Content Area */}
        <main className="flex-1 p-6 md:p-8 space-y-6 overflow-x-hidden">
          
          {/* Active Tab Sub-navigation Bar */}
          <div className="flex border-b border-tavana-border/60 pb-px" id="navigation_tabs">
            <button
              onClick={() => setActiveTab("manifest")}
              className={`pb-3 text-xs font-bold font-display relative transition-all px-4 flex items-center gap-1.5 ${
                activeTab === "manifest" 
                  ? "text-blue-400 font-extrabold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Shield className="w-4 h-4" />
              منشور و جوایز
              {activeTab === "manifest" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" layoutId="active_tab_indicator" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("files")}
              className={`pb-3 text-xs font-bold font-display relative transition-all px-4 flex items-center gap-1.5 ${
                activeTab === "files" 
                  ? "text-blue-400 font-extrabold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <FileArchive className="w-4 h-4" />
              موتور فایل‌سیستم
              {activeTab === "files" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" layoutId="active_tab_indicator" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("architect")}
              className={`pb-3 text-xs font-bold font-display relative transition-all px-4 flex items-center gap-1.5 ${
                activeTab === "architect" 
                  ? "text-blue-400 font-extrabold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Wand2 className="w-4 h-4" />
              دستیار آفرینش هوش مصنوعی
              {activeTab === "architect" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" layoutId="active_tab_indicator" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("deployer")}
              className={`pb-3 text-xs font-bold font-display relative transition-all px-4 flex items-center gap-1.5 ${
                activeTab === "deployer" 
                  ? "text-blue-400 font-extrabold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Server className="w-4 h-4" />
              هسته دپلو‌ی هوشمند
              {activeTab === "deployer" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" layoutId="active_tab_indicator" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("haven")}
              className={`pb-3 text-xs font-bold font-display relative transition-all px-4 flex items-center gap-1.5 ${
                activeTab === "haven" 
                  ? "text-blue-400 font-extrabold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Car className="w-4 h-4 text-indigo-400" />
              سایبان و کارپورت‌ها (Haven)
              {activeTab === "haven" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" layoutId="active_tab_indicator" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("vitality_lab")}
              className={`pb-3 text-xs font-bold font-display relative transition-all px-4 flex items-center gap-1.5 ${
                activeTab === "vitality_lab" 
                  ? "text-blue-400 font-extrabold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Smartphone className="w-4 h-4 text-blue-400" />
              آزمایشگاه سرزندگی لمس
              {activeTab === "vitality_lab" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" layoutId="active_tab_indicator" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("social_club")}
              className={`pb-3 text-xs font-bold font-display relative transition-all px-4 flex items-center gap-1.5 ${
                activeTab === "social_club" 
                  ? "text-blue-400 font-extrabold" 
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Users className="w-4 h-4 text-blue-400" />
              باشگاه فمیلی و چت‌روم
              {activeTab === "social_club" && (
                <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" layoutId="active_tab_indicator" />
              )}
            </button>
          </div>

          {/* Dynamic Inner View Switch */}
          <div className="min-h-[450px]">
            {activeTab === "manifest" && (
              <ManifestView
                points={points}
                addPoints={addPoints}
                unlockedRewards={unlockedRewards}
                unlockReward={unlockReward}
              />
            )}
            {activeTab === "files" && (
              <FileSystemView
                activeProject={activeProject}
                addPoints={addPoints}
                updateProject={updateProject}
                unlockReward={unlockReward}
              />
            )}
            {activeTab === "architect" && (
              <ArchitectView
                addProject={addProject}
                setActiveProjectById={setActiveProjectId}
                addPoints={addPoints}
                unlockReward={unlockReward}
              />
            )}
            {activeTab === "deployer" && (
              <DeployerView
                activeProject={activeProject}
                addPoints={addPoints}
                updateProject={updateProject}
                unlockReward={unlockReward}
              />
            )}
            {activeTab === "haven" && (
              <HavenView
                points={points}
                addPoints={addPoints}
                activeProject={activeProject}
              />
            )}
            {activeTab === "vitality_lab" && (
              <VitalityLabView
                activeProject={activeProject}
                addPoints={addPoints}
                unlockReward={unlockReward}
              />
            )}
            {activeTab === "social_club" && (
              <SocialClubView
                points={points}
                addPoints={addPoints}
                setPoints={setPoints}
                unlockReward={unlockReward}
              />
            )}
          </div>

        </main>

      </div>

      {/* Footer System Details */}
      <footer className="bg-slate-950/80 border-t border-tavana-border/60 py-4 px-6 text-center text-[11px] text-slate-500 font-mono mt-auto flex flex-col sm:flex-row items-center justify-between max-w-7xl mx-auto w-full">
        <span>سرای آفرینش توانا - تمدن تكنولوژیكِ خودکفایِ همدردانِ بدون رایانه</span>
        <span>نشانی توسعه: siavashhamiri@gmail.com | کلاود ران</span>
      </footer>

    </div>
  );
}
