import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with recommended user agent and server-side key
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    console.warn("GEMINI_API_KEY is not configured or contains placeholder.");
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

const ai = getGeminiClient();

// API Endpoints
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Tavana Server is running gracefully." });
});

// 1. Tavana AI Architect endpoint to generate custom app scaffolds
app.post("/api/gemini/architect", async (req, res) => {
  try {
    const { idea, appType = "web" } = req.body;
    if (!idea) {
      return res.status(400).json({ error: "Idea is required." });
    }

    if (!ai) {
      return res.status(200).json({
        error: "سرویس هوش مصنوعی توانا در حال حاضر با کلید فعال واقعی پیکربندی نشده است. نگران نباشید! یک قالب آفرینش آزمایشی برای شما آماده شد.",
        demo: true,
        name: idea,
        tagline: "جلوه‌ای از خلاقیت آزاد و مستقل",
        description: `یک بستر دیجیتال برای پیاده‌سازی تفکر مستقل و خلاق متناسب با ایده "${idea}" که با رویکرد عدالت دیجیتال شهر توانا همسو است.`,
        files: [
          { path: "index.html", content: `<!-- نمای پیش‌نمایش آزمایشی برای ${idea} -->\n<!DOCTYPE html>\n<html>\n<head>\n  <title>${idea}</title>\n</head>\n<body>\n  <h1>خوش آمدید به ${idea}</h1>\n  <p>این برنامه با رویکرد اولویت موبایل شهر توانا ساخته شده است.</p>\n</body>\n</html>` },
          { path: "src/main.ts", content: `// موتور آفرینش تمدنی توانا\nconsole.log("خوش آمدید به ${idea} تحت لوای شهر توانا!");` },
          { path: "src/style.css", content: `/* استایل‌های سفارشی تمدن دیجیتال خودکفا */\nbody { background: #0f172a; color: #f8fafc; font-family: sans-serif; }` }
        ],
        galleries: {
          code: `کدهای تولید شده پروژه ${idea} با معماری سلولی فرکتال.`,
          assets: "نگاره‌ها و قلم‌های برداری متناسب با اولویت اندروید.",
          config: "تنظیمات مانیفست و تعاریف استقرار ابری."
        },
        manifestNote: "این ایده پتانسیل بالایی برای ایجاد فوریت مثبت و خودکفایی جامعه همدرد فاقد رایانه دارد. کار روی آن را ادامه دهید!"
      });
    }

    const systemPrompt = `You are the AI Architect of Tavana City (سرای آفرینش توانا).
Your job is to take an idea for an app and generate a beautiful, highly structured project blueprint that adheres to the Tavana Manifesto principles:
1. Mobile-First UX (اولویت مطلق با گوشی همراه)
2. Self-containment and self-sufficiency (خودکفایی دیجیتال)
3. Three Galleries structure (تفکیک به کد منبع، دارایی‌های رسانه‌ای، و تنظیمات)

Generate a JSON response that contains:
1. "name": An elegant Persian name for the application (e.g. "یار نوید" or similar literal but beautiful name).
2. "tagline": A Persian tagline.
3. "description": A Persian description explaining how this serves users.
4. "files": An array of files, each containing {"path": string, "content": string} with basic boilerplate code in TypeScript or HTML, comments in Persian.
5. "galleries": An object containing:
   - "code": Summary of source code stored.
   - "assets": Summary of media assets (fonts, icons, themes).
   - "config": Suggested manifest/JSON config.
6. "manifestNote": A brief encouraging note in Persian from the "Tavana Spirit" about this creation.

Return ONLY a valid JSON object matching the requested schema. Do not output markdown code blocks or wrapper text, just the raw JSON string. Use 'gemini-3.5-flash'.`;

    const userPrompt = `برنامه پیشنهادی کاربر: "${idea}" با نوع استقرار: "${appType}"`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        temperature: 0.7,
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    res.json(parsed);

  } catch (error: any) {
    console.error("Architect error:", error);
    res.status(500).json({ error: error.message || "خطا در پردازش هوش مصنوعی توانا." });
  }
});

// 2. Tavana Ethical Counselor / Consultation endpoint
app.post("/api/gemini/consult", async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required." });
    }

    if (!ai) {
      return res.status(200).json({
        answer: "همکار گرامی، به علت عدم دسترسی سرور به کلید هوش مصنوعی فعال، روح توانا در حالت محلی با شما صحبت می‌کند. در تمدن توانا اصل بر این است: «کار صادقانه و رصد بیصدا زحمت ما را برکت می‌دهد». هرگز خسته نشوید و با امکانات کم هم بهترین ابزارها را برای برادران و خواهرانی که رایانه ندارند خلق کنید."
      });
    }

    const systemPrompt = `You are the Spiritual Guardian of Tavana City (روح راهنمای سرای آفرینش توانا).
You speak with deep wisdom, compassion, and professional dignity in elegant Persian (فارسی روان و محترمانه).
Provide guidance on application design, ethical mobile development, surprising growth (رشد شگفت‌انگیز), compassionate monitoring (رصد بیصدا), and digital self-reliance (خودکفایی دیجیتال).
Always relate your answers to the core values of Tavana City: helping people code/use software from their mobile phones without standard setups, creating joyful surprises, and silent rewards for pure hard work. Keep your response concise (under 150 words).`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: question,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Consultation error:", error);
    res.status(500).json({ error: error.message || "خطا در ارتباط با روح توانا." });
  }
});

// Integrate Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
