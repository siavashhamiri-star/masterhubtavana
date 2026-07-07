import { TavanaProject } from "../types";

export const MOCK_PROJECTS: TavanaProject[] = [
  {
    id: "tavana_habits",
    name: "یار نوید (یار همدرد)",
    tagline: "خودساز همراه برای تمدن خودکفا",
    description: "سیستم هوشمند پایش و ثبت عادات زندگی و سلامت شخصی که با رویکرد آفلاین و با اولویت مطلق موبایل طراحی شده است.",
    idea: "برنامه اندروید سبک ثبت عادات بدون نیاز به اینترنت",
    sizeMB: 12,
    status: "Scaffolded",
    createdAt: "۱۴۰۵/۰۴/۱۴",
    files: [
      { path: "index.html", content: "<!-- یار نوید -->\n<!DOCTYPE html>\n<html lang='fa' dir='rtl'>\n<head>\n  <meta charset='UTF-8'>\n  <title>یار نوید</title>\n</head>\n<body>\n  <h1>یار نوید - سیستم ثبت عادات</h1>\n</body>\n</html>" },
      { path: "src/main.ts", content: "console.log('یار نوید آماده خدمت به همدردان است.');" },
      { path: "src/habits.ts", content: "export interface Habit {\n  id: string;\n  title: string;\n  streak: number;\n}" },
      { path: "assets/logo.png", content: "binary_mock_logo_data" }
    ],
    galleries: {
      code: "- src/main.ts (توسعه یافته)\n- src/habits.ts (ماژول عادات)",
      assets: "- assets/logo.png (طرح برداری)\n- src/theme.css (استایل سنتی)",
      config: "- metadata.json (مانیفست اندروید)"
    },
    automationLog: [
      "[System]: پروژه با موفقیت توسط موتور آفرینش ایجاد گردید.",
      "[System]: گالری‌های سه‌گانه با دارایی‌های اولیه پر شدند."
    ],
    deployments: [
      {
        id: "dep_v1_seed",
        versionNumber: 1,
        timestamp: "۱۴۰۵/۰۴/۱۴، ۱۰:۳۰:۰۰",
        status: "Success",
        provider: "Netlify",
        files: [
          { path: "index.html", content: "<!-- یار نوید نسخه اول -->\n<!DOCTYPE html>\n<html lang='fa' dir='rtl'>\n<head>\n  <meta charset='UTF-8'>\n  <title>یار نوید</title>\n</head>\n<body>\n  <h1>یار نوید - سیستم ثبت عادات نسخه ۱</h1>\n</body>\n</html>" },
          { path: "src/main.ts", content: "console.log('نسخه اولیه یار نوید.')" }
        ],
        sizeMB: 12,
        commitMessage: "انتشار نسخه اولیه و پایدار با رابط کاربری روان"
      }
    ]
  },
  {
    id: "tavana_dictionary",
    name: "فرهنگ توانا",
    tagline: "فرهنگ‌لغت لایتنر جیبی و آفلاین",
    description: "جعبه لایتنر و لغت‌نامه فشرده و مستقل برای ذخیره‌سازی، جستجو و به یاد سپردن واژگان بدون اتصال به شبکه.",
    idea: "یک جعبه لایتنر آفلاین صوتی سبک برای موبایل",
    sizeMB: 124, // >100MB, will trigger VPS deployment!
    status: "Draft",
    createdAt: "۱۴۰۵/۰۴/۱۵",
    files: [
      { path: "index.html", content: "<!-- فرهنگ توانا -->\n<h1>فرهنگ لغات توانا</h1>" },
      { path: "src/leitner.ts", content: "export class LeitnerBox { cards: any[] = []; }" },
      { path: "assets/audio_database.bin", content: "large_bin_for_leitner_audio" }
    ],
    galleries: {
      code: "- src/leitner.ts (کنترلر جعبه)",
      assets: "- assets/audio_database.bin (بانک صوتی لغات)",
      config: "- config/settings.json (پیکربندی پایگاه داده)"
    },
    automationLog: [
      "[Tavana FileSystem]: پکیج فشرده با موفقیت بارگذاری شد. در انتظار دستور استخراج و فشرده‌برداری (Extract)."
    ]
  }
];
