import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileArchive, FolderTree, Database, UploadCloud, CheckCircle2, 
  Code, Image, Settings2, Trash2, Plus, Play, Info 
} from "lucide-react";
import { TavanaProject, TavanaFile } from "../types";

interface FileSystemViewProps {
  activeProject: TavanaProject | null;
  addPoints: (amount: number, reason: string) => void;
  updateProject: (project: TavanaProject) => void;
  unlockReward: (id: string) => void;
}

export default function FileSystemView({ 
  activeProject, 
  addPoints, 
  updateProject,
  unlockReward 
}: FileSystemViewProps) {
  
  const [extracting, setExtracting] = useState<boolean>(false);
  const [extractionProgress, setExtractionProgress] = useState<number>(0);
  const [newFilePath, setNewFilePath] = useState<string>("");
  const [newFileContent, setNewFileContent] = useState<string>("");
  const [selectedGallery, setSelectedGallery] = useState<"code" | "assets" | "config">("code");
  const [dragOver, setDragOver] = useState<boolean>(false);

  if (!activeProject) {
    return (
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center" id="fs_no_project">
        <FileArchive className="w-16 h-16 text-slate-700 mx-auto mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-slate-300">پروژه‌ای انتخاب نشده است</h3>
        <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
          برای کار با موتور فایل‌سیستم توانا، لطفاً ابتدا از بخش «دستیار معماری و هوش مصنوعی» یک پروژه جدید تعریف کنید یا یکی از پروژه‌های آماده را انتخاب نمایید.
        </p>
      </div>
    );
  }

  // Simulate extraction progress
  const runExtraction = () => {
    if (extracting || activeProject.status !== "Draft") return;
    
    setExtracting(true);
    setExtractionProgress(0);
    addPoints(30, "آغاز فرآیند بازگشاییِ بسته آفرینش");

    const interval = setInterval(() => {
      setExtractionProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setExtracting(false);
          
          // Complete extraction
          const updated = {
            ...activeProject,
            status: "Scaffolded" as const,
            automationLog: [
              ...activeProject.automationLog,
              `[Tavana System - ${new Date().toLocaleTimeString()}]: در حال بازگشایی بسته آفرینش...`,
              `[Tavana System]: استخراج کامل فایلهای پروژه ${activeProject.name} با موفقیت پایان یافت.`,
              `[Tavana System]: چیدمان خودکار در پوشه‌ها بر اساس معماری فرکتال سلولی انجام شد.`,
              `[Tavana System]: دسته‌بندی و انتقال دارایی‌ها به گالری‌های سه‌گانه با موفقیت ثبت شد.`
            ]
          };
          updateProject(updated);
          addPoints(70, `بازگشایی و تفکیک کامل دارایی‌های پروژه ${activeProject.name}`);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const addCustomFile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFilePath || !newFileContent) return;

    const newFile: TavanaFile = {
      path: newFilePath,
      content: newFileContent
    };

    // Determine type for galleries log
    let updatedGalleries = { ...activeProject.galleries };
    if (newFilePath.endsWith(".ts") || newFilePath.endsWith(".tsx") || newFilePath.endsWith(".js")) {
      updatedGalleries.code = (updatedGalleries.code || "") + `\n- Added ${newFilePath}`;
    } else if (newFilePath.endsWith(".png") || newFilePath.endsWith(".jpg") || newFilePath.endsWith(".css") || newFilePath.endsWith(".svg")) {
      updatedGalleries.assets = (updatedGalleries.assets || "") + `\n- Added ${newFilePath}`;
    } else {
      updatedGalleries.config = (updatedGalleries.config || "") + `\n- Added ${newFilePath}`;
    }

    const updated: TavanaProject = {
      ...activeProject,
      files: [...activeProject.files, newFile],
      galleries: updatedGalleries,
      automationLog: [
        ...activeProject.automationLog,
        `[Tavana FS]: افزودن دستی فایل جدید: ${newFilePath}`
      ]
    };

    updateProject(updated);
    setNewFilePath("");
    setNewFileContent("");
    addPoints(15, `ایجاد فایل جدید ${newFilePath}`);
  };

  const deleteFile = (path: string) => {
    const filteredFiles = activeProject.files.filter(f => f.path !== path);
    const updated: TavanaProject = {
      ...activeProject,
      files: filteredFiles,
      automationLog: [
        ...activeProject.automationLog,
        `[Tavana FS]: حذف فایل: ${path}`
      ]
    };
    updateProject(updated);
    addPoints(5, `حذف فایل از پروژه`);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    // Simulate drop ZIP file
    addPoints(50, "آپلود مستقیم بسته فشرده ZIP از درگ‌اند‌دراپ");
    const updated: TavanaProject = {
      ...activeProject,
      status: "Draft" as const,
      automationLog: [
        ...activeProject.automationLog,
        `[Tavana FileSystem]: دریافت بسته فشرده خارجی از طریق Drag & Drop. آماده برای بازگشایی.`
      ]
    };
    updateProject(updated);
  };

  // Group files for Static vs Dynamic architecture visualization
  const staticFiles = activeProject.files.filter(f => 
    f.path.endsWith(".html") || f.path.endsWith(".css") || f.path.includes("assets/") || f.path.endsWith(".png") || f.path.endsWith(".jpg")
  );

  const dynamicFiles = activeProject.files.filter(f => 
    !staticFiles.some(sf => sf.path === f.path)
  );

  return (
    <div className="space-y-8" id="file_system_view_container">
      {/* Overview Block */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-right w-full md:w-auto">
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl border border-blue-500/20">
            <FileArchive className="w-8 h-8" />
          </div>
          <div>
            <span className="text-[10px] text-amber-500 font-mono font-bold uppercase">Tavana FileSystem Engine</span>
            <h2 className="text-lg font-extrabold text-slate-100 mt-0.5">
              مدیریت فایلی پروژه: {activeProject.name}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              تعداد فایل‌ها: {activeProject.files.length} عدد | حجم تقریبی بسته: {activeProject.sizeMB} مگابایت
            </p>
          </div>
        </div>

        {/* Action Button: Extract Package */}
        <div className="shrink-0">
          {activeProject.status === "Draft" ? (
            <button
              id="extract_package_btn"
              onClick={runExtraction}
              disabled={extracting}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-6 py-2.5 rounded-xl text-xs font-bold font-mono transition-all duration-300 flex items-center gap-2 shadow-lg shadow-blue-500/10 glow-btn cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              {extracting ? `در حال استخراج (${extractionProgress}%)` : "۱. بازگشایی بسته آفرینش (Extract)"}
            </button>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>پکیج بازگشایی شده است</span>
            </div>
          )}
        </div>
      </div>

      {/* Upload Drag & Drop & Progress Indicator */}
      <AnimatePresence>
        {extracting && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-900/60 border border-blue-500/30 rounded-xl p-5"
          >
            <div className="flex justify-between text-xs text-slate-400 mb-2 font-mono">
              <span>در حال فشرده‌برداری و فیلتر کردن کدهای مخرب...</span>
              <span>{extractionProgress}%</span>
            </div>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <motion.div 
                className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full"
                animate={{ width: `${extractionProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Smart Drag & Drop Area */}
      {activeProject.status === "Draft" && !extracting && (
        <div
          id="drop_zone"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-6 text-center transition-all ${
            dragOver 
              ? "border-blue-500 bg-blue-500/5 text-blue-400 scale-[0.99]" 
              : "border-slate-800 bg-slate-900/20 text-slate-400 hover:border-slate-700"
          }`}
        >
          <UploadCloud className="w-10 h-10 mx-auto mb-2 text-slate-500" />
          <h4 className="text-xs font-bold text-slate-300">کشیدن و رها کردن فایل زیپ (ZIP) پروژه‌ها</h4>
          <p className="text-[10px] text-slate-500 mt-1">
            یک فایل فشرده محتوی ساختار وب را به اینجا بکشید تا مستقیماً به انبار توسعه سرای آفرینش افزوده شود.
          </p>
        </div>
      )}

      {/* Main Structuring & Galleries Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Col 1: Cellular Fractal Folder Structuring (Static vs Dynamic) */}
        <div className="lg:col-span-5 space-y-4 text-right">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <FolderTree className="w-4 h-4 text-blue-500" />
            ۲. ساختاردهی و سلول مستقل معماری (Static vs Dynamic)
          </h3>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center gap-2 bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
              <Info className="w-4 h-4 text-amber-500 shrink-0" />
              <p className="text-[10px] text-slate-400 leading-relaxed text-right">
                معماری فرکتال توانا، فایل‌ها را به دو هسته مجزا تقسیم می‌کند تا استقرار موبایلی در میزبان‌های رایگان مثل نتلیفای با بیشترین سرعت انجام شود.
              </p>
            </div>

            {/* Static Cell */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full inline-block font-bold">
                  بخش استاتیک (Static Assets)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">تعداد: {staticFiles.length}</span>
              </div>
              <div className="bg-slate-950/50 border border-slate-900 rounded-lg p-3 space-y-1.5 max-h-48 overflow-y-auto">
                {staticFiles.length === 0 ? (
                  <span className="text-[10px] text-slate-600 italic block text-center">فایل استاتیکی یافت نشد.</span>
                ) : (
                  staticFiles.map(f => (
                    <div key={f.path} className="flex items-center justify-between text-xs text-slate-400 hover:bg-slate-900/50 p-1.5 rounded">
                      <button onClick={() => deleteFile(f.path)} className="text-slate-600 hover:text-red-400 p-0.5 transition-colors cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[11px] text-emerald-500/90 text-left" dir="ltr">{f.path}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Dynamic Cell */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full inline-block font-bold">
                  بخش منطق داینامیک (Dynamic Logic)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">تعداد: {dynamicFiles.length}</span>
              </div>
              <div className="bg-slate-950/50 border border-slate-900 rounded-lg p-3 space-y-1.5 max-h-48 overflow-y-auto">
                {dynamicFiles.length === 0 ? (
                  <span className="text-[10px] text-slate-600 italic block text-center">فایلی یافت نشد.</span>
                ) : (
                  dynamicFiles.map(f => (
                    <div key={f.path} className="flex items-center justify-between text-xs text-slate-400 hover:bg-slate-900/50 p-1.5 rounded">
                      <button onClick={() => deleteFile(f.path)} className="text-slate-600 hover:text-red-400 p-0.5 transition-colors cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-[11px] text-blue-400/90 text-left" dir="ltr">{f.path}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Col 2: The Three Galleries & Add File Form */}
        <div className="lg:col-span-7 space-y-4 text-right">
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
            <Database className="w-4 h-4 text-blue-500" />
            ۳. گالری‌های سه‌گانه دارایی‌ها (Three Galleries Management)
          </h3>

          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-4">
            {/* Gallery Tabs */}
            <div className="flex border-b border-slate-800">
              <button
                onClick={() => setSelectedGallery("code")}
                className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                  selectedGallery === "code" 
                    ? "border-blue-500 text-blue-400 bg-blue-500/5" 
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                گالری کد (Source)
              </button>
              <button
                onClick={() => setSelectedGallery("assets")}
                className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                  selectedGallery === "assets" 
                    ? "border-amber-500 text-amber-400 bg-amber-500/5" 
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                گالری رسانه (Media)
              </button>
              <button
                onClick={() => setSelectedGallery("config")}
                className={`flex-1 py-2 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-1.5 ${
                  selectedGallery === "config" 
                    ? "border-purple-500 text-purple-400 bg-purple-500/5" 
                    : "border-transparent text-slate-400 hover:text-slate-300"
                }`}
              >
                <Settings2 className="w-3.5 h-3.5" />
                تنظیمات (Configs)
              </button>
            </div>

            {/* Gallery Content View */}
            <div className="bg-slate-950/80 border border-slate-900 rounded-lg p-4 font-mono text-[11px] text-slate-300 min-h-[120px] whitespace-pre-line max-h-52 overflow-y-auto text-left" dir="ltr">
              {selectedGallery === "code" && (
                <div>
                  <span className="text-slate-500 block mb-2">// مسیر ذخیره‌سازی: ./storage/source-code</span>
                  {activeProject.galleries.code || "هیچ کدی در گالری ذخیره نشده است."}
                  <div className="mt-4 border-t border-slate-900 pt-2 text-slate-500">
                    {activeProject.files.filter(f => f.path.endsWith(".ts") || f.path.endsWith(".tsx") || f.path.endsWith(".js") || f.path.endsWith(".json")).map(f => (
                      <div key={f.path} className="flex items-center gap-2 mt-1">
                        <span className="text-blue-400">✓</span>
                        <span>{f.path} ({f.content.length} کاراکتر)</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGallery === "assets" && (
                <div>
                  <span className="text-slate-500 block mb-2">// مسیر ذخیره‌سازی: ./storage/media-assets</span>
                  {activeProject.galleries.assets || "هیچ دارایی گرافیکی یا رسانه‌ای ذخیره نشده است."}
                  <div className="mt-4 border-t border-slate-900 pt-2 text-slate-500">
                    {activeProject.files.filter(f => f.path.endsWith(".css") || f.path.includes("assets/") || f.path.endsWith(".png") || f.path.endsWith(".jpg")).map(f => (
                      <div key={f.path} className="flex items-center gap-2 mt-1">
                        <span className="text-emerald-400">✓</span>
                        <span>{f.path}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedGallery === "config" && (
                <div>
                  <span className="text-slate-500 block mb-2">// مسیر ذخیره‌سازی: ./storage/manifests</span>
                  {activeProject.galleries.config || "هیچ فایل پیکربندی یا مانیفستی ذخیره نشده است."}
                  <div className="mt-4 border-t border-slate-900 pt-2 text-slate-500">
                    {activeProject.files.filter(f => f.path.endsWith(".json") || f.path.endsWith(".xml") || f.path.endsWith(".yaml") || f.path.endsWith(".yml")).map(f => (
                      <div key={f.path} className="flex items-center gap-2 mt-1">
                        <span className="text-purple-400">✓</span>
                        <span>{f.path}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick File Injector Form */}
            <form onSubmit={addCustomFile} className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-[11px] font-bold text-slate-400 block text-right">افزودن دستی فایل به گالری دارایی‌ها:</span>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-4">
                  <input
                    type="text"
                    required
                    placeholder="مثال: src/components/button.tsx"
                    value={newFilePath}
                    onChange={(e) => setNewFilePath(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div className="md:col-span-6">
                  <input
                    type="text"
                    required
                    placeholder="کد یا محتوای آزمایشی فایل..."
                    value={newFileContent}
                    onChange={(e) => setNewFileContent(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder-slate-600 focus:border-blue-500 focus:outline-none font-mono text-left"
                    dir="ltr"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    تزریق فایل
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
