import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Users, Trophy, MessageSquare, Send, Heart, MessageCircle, 
  Gift, Award, Star, Crown, Palette, Sparkles, User, Zap, 
  Car, Plane, ShieldCheck, Flame, UserCheck, ArrowLeftRight, HelpCircle, AlertCircle, RefreshCw,
  Code, Shield, AlertTriangle
} from "lucide-react";

interface SocialClubProps {
  points: number;
  addPoints: (amount: number, reason: string) => void;
  setPoints: React.Dispatch<React.SetStateAction<number>>;
  unlockReward: (id: string) => void;
}

interface FamilyMember {
  name: string;
  role: "Captain" | "Admin" | "TechLead" | "Member";
  level: number;
  xpContribution: number;
}

interface Family {
  id: string;
  name: string;
  motto: string;
  level: number;
  xp: number;
  captain: string;
  admin: string;
  techLead: string;
  members: FamilyMember[];
  allianceIds: string[];
}

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: string;
  isSpecial: boolean;
  frame: string;
  entrance: string;
  fontStyle: string;
}

interface PeerDeveloper {
  id: string;
  name: string;
  level: number;
  xp: number;
  rank: number;
  projectIdea: string;
  likes: number;
  hasLiked: boolean;
  comments: Array<{ author: string; text: string }>;
}

export default function SocialClubView({ points, addPoints, setPoints, unlockReward }: SocialClubProps) {
  // --- STATE PERSISTENCE & INITIALIZATION ---
  
  // 1. My Profile customizations
  const [profileName, setProfileName] = useState<string>(() => {
    return localStorage.getItem("tavana_social_name") || "آفرینش‌گر همدرد";
  });
  const [profileFrame, setProfileFrame] = useState<string>(() => {
    return localStorage.getItem("tavana_profile_frame") || "gold_glow";
  });
  const [entranceEffect, setEntranceEffect] = useState<string>(() => {
    return localStorage.getItem("tavana_entrance_effect") || "royal_lion";
  });
  const [chatFontStyle, setChatFontStyle] = useState<string>(() => {
    return localStorage.getItem("tavana_chat_font") || "royal_gold";
  });
  const [userLevel, setUserLevel] = useState<number>(() => {
    const saved = localStorage.getItem("tavana_user_level");
    return saved ? parseInt(saved) : 5;
  });

  // Track transferred XP to enforce the 40% rule
  const [transferredXp, setTransferredXp] = useState<number>(() => {
    const saved = localStorage.getItem("tavana_transferred_xp");
    return saved ? parseInt(saved) : 0;
  });

  // 2. Family state
  const [myFamily, setMyFamily] = useState<Family | null>(() => {
    const saved = localStorage.getItem("tavana_user_family");
    if (saved) return JSON.parse(saved);
    // Default family
    return {
      id: "fam_saraye_tavana",
      name: "فمیلی معماران پارس",
      motto: "خلق ابزارهای مقتدر بدون نیاز به شبکه غربی",
      level: 3,
      xp: 450,
      captain: "آفرینش‌گر همدرد",
      admin: "سهراب ممیز",
      techLead: "آناهیتا کدر",
      members: [
        { name: "آفرینش‌گر همدرد", role: "Captain", level: 5, xpContribution: 250 },
        { name: "سهراب ممیز", role: "Admin", level: 4, xpContribution: 120 },
        { name: "آناهیتا کدر", role: "TechLead", level: 6, xpContribution: 80 }
      ],
      allianceIds: []
    };
  });

  // Other families list for competition & alliances
  const [otherFamilies, setOtherFamilies] = useState<Family[]>(() => {
    return [
      {
        id: "fam_alborz",
        name: "فمیلی سیمرغ البرز",
        motto: "پرواز بر فراز کدهای سبک و ارگونومیک",
        level: 4,
        xp: 620,
        captain: "مریم کدر",
        admin: "آرش تستر",
        techLead: "کامران بهینه‌ساز",
        members: [
          { name: "مریم کدر", role: "Captain", level: 6, xpContribution: 300 },
          { name: "آرش تستر", role: "Admin", level: 3, xpContribution: 150 },
          { name: "کامران بهینه‌ساز", role: "TechLead", level: 5, xpContribution: 170 }
        ],
        allianceIds: []
      },
      {
        id: "fam_kavir",
        name: "فمیلی تفکر کویر",
        motto: "پایداری آفلاین مطلق در دل محدودیت‌ها",
        level: 2,
        xp: 280,
        captain: "یزدان همدرد",
        admin: "حامد اسکنر",
        techLead: "شادی ارگونومی",
        members: [
          { name: "یزدان همدرد", role: "Captain", level: 4, xpContribution: 100 },
          { name: "حامد اسکنر", role: "Admin", level: 2, xpContribution: 90 },
          { name: "شادی ارگونومی", role: "TechLead", level: 3, xpContribution: 90 }
        ],
        allianceIds: []
      }
    ];
  });

  // Peer Developers for likes, comments, XP transfers
  const [peers, setPeers] = useState<PeerDeveloper[]>(() => {
    return [
      {
        id: "peer_behnam",
        name: "بهنام الگوریتم",
        level: 8,
        xp: 950,
        rank: 1,
        projectIdea: "سامانه رهگیری کبوتران نامه‌بر دیجیتال به کمک وای‌فای داخلی آفلاین",
        likes: 14,
        hasLiked: false,
        comments: [
          { author: "رستا کامپایلر", text: "طرحی خارق‌العاده برای شرایط بحرانی مخابرات!" }
        ]
      },
      {
        id: "peer_rasta",
        name: "رستا کامپایلر",
        level: 7,
        xp: 820,
        rank: 2,
        projectIdea: "ویرایشگر کدهای توانا سازگار با تبلت‌های ۴.۵ اینچی ارزان قیمت",
        likes: 19,
        hasLiked: false,
        comments: [
          { author: "بهنام الگوریتم", text: "تطابق ارگونومی لمس این ایده بی‌نظیر است." }
        ]
      },
      {
        id: "peer_kaveh",
        name: "کاوه بازنویس",
        level: 4,
        xp: 340,
        rank: 3,
        projectIdea: "سیستم فشرده‌سازی بایگانی تمدنی برای لود سریع در سخت‌افزار فرسوده",
        likes: 8,
        hasLiked: false,
        comments: []
      }
    ];
  });

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: "m1",
        sender: "بهنام الگوریتم",
        message: "سلام دوستان تمدنی! فمیلی سیمرغ البرز آماده شروع یک اتحاد جدید برای دریافت ایاکسپی چندبرابری است. پیشنهادی دارید؟",
        timestamp: "۱۲:۳۰ UTC",
        isSpecial: true,
        frame: "silver",
        entrance: "luxury_car",
        fontStyle: "elegant_serif"
      },
      {
        id: "m2",
        sender: "رستا کامپایلر",
        message: "من ایده پروژه جدیدم را در بخش لیگ‌ها آپلود کردم. حتماً بررسی کنید و لایک/کامنت بفرستید تا لول فمیلی بالا برود.",
        timestamp: "۱۲:۳۲ UTC",
        isSpecial: true,
        frame: "legendary_mythic",
        entrance: "supersonic_plane",
        fontStyle: "retro_cyber"
      }
    ];
  });

  const [typedMessage, setTypedMessage] = useState("");
  const [newCommentTexts, setNewCommentTexts] = useState<{ [key: string]: string }>({});
  const [xpTransferAmount, setXpTransferAmount] = useState<string>("10");
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>("peer_kaveh");
  const [newFamilyName, setNewFamilyName] = useState("");
  const [newFamilyMotto, setNewFamilyMotto] = useState("");

  // --- NEW STATES FOR GAMIFICATION & RECRUITMENT & ABANDONED PROGRAMS ---
  const [recruitName, setRecruitName] = useState("");
  const [recruitRole, setRecruitRole] = useState<"Admin" | "TechLead" | "Member">("Member");
  
  // Honorary titles owned by the user
  const [myTitles, setMyTitles] = useState<string[]>(() => {
    const saved = localStorage.getItem("tavana_user_titles");
    return saved ? JSON.parse(saved) : ["آفرینش‌گر همدرد", "مدیر توانا"];
  });

  // active / abandoned programs
  interface SystemProgram {
    id: string;
    title: string;
    familyId: string;
    familyName: string;
    status: "Active" | "Discontinued";
    members: string[];
    memberXps: { [key: string]: number };
    description: string;
    replaced?: boolean;
  }

  const [programs, setPrograms] = useState<SystemProgram[]>(() => {
    const saved = localStorage.getItem("tavana_system_programs");
    if (saved) return JSON.parse(saved);
    return [
      {
        id: "prog_web_shahr",
        title: "سامانه ملی وب‌شهر توانا",
        familyId: "fam_saraye_tavana",
        familyName: "فمیلی معماران پارس",
        status: "Active",
        members: ["سهراب ممیز", "آناهیتا کدر"],
        memberXps: { "سهراب ممیز": 120, "آناهیتا کدر": 80 },
        description: "طراحی هاب جامع خدمات آفلاین و ارگونومیک شهری"
      },
      {
        id: "prog_simurgh_v3",
        title: "موتور رندر سبک سیمرغ نسخه ۳",
        familyId: "fam_alborz",
        familyName: "فمیلی سیمرغ البرز",
        status: "Active",
        members: ["آرش تستر", "کامران بهینه‌ساز"],
        memberXps: { "آرش تستر": 150, "کامران بهینه‌ساز": 170 },
        description: "کاهش مصرف پردازنده تبلت‌ها به زیر ۵ درصد"
      },
      {
        id: "prog_kavir_data",
        title: "پایگاه ذخیره اطلاعات کویر پسیو",
        familyId: "fam_kavir",
        familyName: "فمیلی تفکر کویر",
        status: "Discontinued",
        members: ["حامد اسکنر", "شادی ارگونومی"],
        memberXps: { "حامد اسکنر": 90, "شادی ارگونومی": 90 },
        description: "پروژه رها شده توزیع‌یافته بدون همگام‌سازی"
      }
    ];
  });

  // Active dopamine injection state for confetti / splash
  const [dopamineBurst, setDopamineBurst] = useState<string | null>(null);

  // Active Cheat Code state
  const [cheatCodeInput, setCheatCodeInput] = useState("");
  const [activeXpMultiplier, setActiveXpMultiplier] = useState(1); // multiplier

  // Simulated announcements
  const [entranceNotification, setEntranceNotification] = useState<string | null>(null);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem("tavana_social_name", profileName);
    localStorage.setItem("tavana_profile_frame", profileFrame);
    localStorage.setItem("tavana_entrance_effect", entranceEffect);
    localStorage.setItem("tavana_chat_font", chatFontStyle);
    localStorage.setItem("tavana_user_level", userLevel.toString());
    localStorage.setItem("tavana_transferred_xp", transferredXp.toString());
    localStorage.setItem("tavana_user_titles", JSON.stringify(myTitles));
    localStorage.setItem("tavana_system_programs", JSON.stringify(programs));
    if (myFamily) {
      localStorage.setItem("tavana_user_family", JSON.stringify(myFamily));
    } else {
      localStorage.removeItem("tavana_user_family");
    }
  }, [profileName, profileFrame, entranceEffect, chatFontStyle, userLevel, transferredXp, myFamily, myTitles, programs]);

  // Calculate maximum XP tradable (40% of overall earned eXP)
  // Overall eXP = current points + transferredXp
  const totalEarnedXp = points + transferredXp;
  const maxXpTradable = Math.floor(totalEarnedXp * 0.4);
  const remainingXpTradable = Math.max(0, maxXpTradable - transferredXp);

  // Trigger entrance effect when component mounts or entrance is updated
  const triggerEntrance = () => {
    let emoji = "🚗";
    let text = "با یک دستگاه سوپر اسپرت فراری لوکس";
    if (entranceEffect === "supersonic_plane") {
      emoji = "✈️";
      text = "با جنگنده هواپیمای مافوق‌صوت تمدنی";
    } else if (entranceEffect === "ocean_wave") {
      emoji = "🌊";
      text = "سوار بر امواج خروشان اقیانوس آرام";
    } else if (entranceEffect === "legendary_phoenix") {
      emoji = "🐉";
      text = "بر بال‌های باشکوه سیمرغ اسطوره‌ای مشرق‌زمین";
    } else if (entranceEffect === "royal_lion") {
      emoji = "🦁";
      text = "همراه با غرش شیر اساطیری بیشه توانا";
    }

    const notification = `✨ هم‌اکنون [${profileName}] ${text} وارد چت‌روم مرکزی تمدن همدردان شد! ✨`;
    setEntranceNotification(notification);
    
    // Add an automated system log message in the chat
    const systemMsg: ChatMessage = {
      id: "sys_" + Date.now(),
      sender: "📡 رادار ورودی تمدن",
      message: `${emoji} ${profileName} ${text} شکوهمندانه تشریف‌فرما شد!`,
      timestamp: "اکنون",
      isSpecial: true,
      frame: profileFrame,
      entrance: entranceEffect,
      fontStyle: "royal_gold"
    };

    setChatMessages(prev => [...prev, systemMsg]);

    setTimeout(() => {
      setEntranceNotification(null);
    }, 5000);
  };

  useEffect(() => {
    triggerEntrance();
  }, [entranceEffect]);

  // --- ACTIONS ---

  // Handle XP Transfer with 40% rule check
  const handleXpTransfer = () => {
    const amount = parseInt(xpTransferAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("⚠️ لطفا مقدار عددی معتبری برای انتقال وارد کنید.");
      return;
    }

    if (amount > points) {
      alert("⚠️ شما ایاکسپی کافی برای این انتقال ندارید.");
      return;
    }

    if (amount > remainingXpTradable) {
      alert(`❌ خطای منشور تمدن: قانون ۴۰٪ ایاکسپی! \n\nشما مجاز به انتقال حداکثر ۴۰٪ از کل ایاکسپی خود هستید.\nحداکثر ایاکسپی قابل واگذاری باقیمانده شما: ${remainingXpTradable} XP است.\n۶۰٪ باقیمانده به عنوان وثیقه تعهد تمدنی قفل است.`);
      return;
    }

    // Process transfer
    setPoints(prev => prev - amount);
    setTransferredXp(prev => prev + amount);
    
    // Update recipient XP locally for visual response
    setPeers(prev => prev.map(p => {
      if (p.id === selectedRecipientId) {
        return { ...p, xp: p.xp + amount };
      }
      return p;
    }));

    const recipientName = peers.find(p => p.id === selectedRecipientId)?.name || "همدرد";
    addPoints(15, `موفقیت: انتقال ${amount} ایاکسپی به ${recipientName} بر اساس ضابطه ۴۰ درصد`);
    
    // Send auto-notification message in chat
    const chatNotify: ChatMessage = {
      id: "tx_" + Date.now(),
      sender: "💸 شبکه تبادل ایاکسپی",
      message: `مبلغ ${amount} eXP از طرف [${profileName}] به حساب [${recipientName}] با موفقیت منتقل و ثبت شد.`,
      timestamp: "اکنون",
      isSpecial: false,
      frame: "none",
      entrance: "none",
      fontStyle: "default"
    };
    setChatMessages(prev => [...prev, chatNotify]);
  };

  // --- NEW ACTIONS FOR GAMIFICATION, RECRUITMENT & REPLACEMENTS ---

  // Recruitment of people under their group (By Leaders)
  const handleRecruitMember = () => {
    if (!myFamily) {
      alert("⚠️ شما ابتدا باید یک فمیلی تاسیس کنید یا عضو شوید!");
      return;
    }
    
    // Check if leader (Captain)
    const isCaptain = myFamily.captain === profileName;
    if (!isCaptain) {
      alert("❌ خطای عدم دسترسی: تنها کاپیتان/لیدر فمیلی مجاز به استخدام و جذب نیروهای جدید است!");
      return;
    }

    const name = recruitName.trim();
    if (!name) {
      alert("⚠️ لطفا نام همدرد گرامی جهت جذب نیرو را وارد کنید.");
      return;
    }

    if (myFamily.members.some(m => m.name.toLowerCase() === name.toLowerCase())) {
      alert("⚠️ این توسعه‌دهنده هم‌اکنون عضو فمیلی شماست!");
      return;
    }

    const newMem: FamilyMember = {
      name,
      role: recruitRole,
      level: Math.floor(Math.random() * 3) + 1,
      xpContribution: 0
    };

    setMyFamily(prev => {
      if (!prev) return null;
      return {
        ...prev,
        members: [...prev.members, newMem]
      };
    });

    addPoints(25 * activeXpMultiplier, `جذب و استخدام موفقیت‌آمیز [${name}] در جایگاه شغلی تمدنی ${recruitRole}`);
    
    // Send chat announcement
    const recruitNotice: ChatMessage = {
      id: "rec_" + Date.now(),
      sender: "📢 مجمع فمیلی",
      message: `🎉 تبریک صمیمانه! [${name}] به عنوان [${recruitRole}] با دعوت مستقیم کاپیتان [${profileName}] به کادر متخصصان فمیلی [${myFamily.name}] پیوست!`,
      timestamp: "اکنون",
      isSpecial: true,
      frame: "silver",
      entrance: "none",
      fontStyle: "elegant_serif"
    };
    setChatMessages(prev => [...prev, recruitNotice]);
    setRecruitName("");
  };

  // Abandoned programs / Discontinued programs rule
  const handleDiscontinueProgram = (programId: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        // 1. Reduce member XPs by 50%
        const updatedXps = { ...p.memberXps };
        Object.keys(updatedXps).forEach(k => {
          updatedXps[k] = Math.floor(updatedXps[k] * 0.5);
        });

        // 2. Chat alarm
        const alarmMsg: ChatMessage = {
          id: "sys_disc_" + Date.now(),
          sender: "📡 ناظر ارشد برنامه‌ها",
          message: `🚨 انحلال پروژه: برنامه «${p.title}» متعلق به [${p.familyName}] به دلیل عدم فعالیت اعضا منحل شد! امتیاز نخبگان آن (${p.members.join(" و ")}) ۵۰٪ جریمه کسر شد و فاقد فعالیت شدند!`,
          timestamp: "اکنون",
          isSpecial: true,
          frame: "legendary_mythic",
          entrance: "none",
          fontStyle: "royal_gold"
        };
        setChatMessages(prevChat => [...prevChat, alarmMsg]);

        return {
          ...p,
          status: "Discontinued",
          memberXps: updatedXps
        };
      }
      return p;
    }));
    
    addPoints(10 * activeXpMultiplier, "ثبت گزارش نظارتی رکود و انحلال برنامه رهاشده");
  };

  // System replacement protocol
  const handleReplaceMembers = (programId: string) => {
    const targetProg = programs.find(p => p.id === programId);
    if (!targetProg) return;

    // Find active high-level peers who are not currently members
    const availablePeers = [...peers]
      .filter(p => !targetProg.members.includes(p.name))
      .sort((a, b) => b.level - a.level);

    if (availablePeers.length < targetProg.members.length) {
      alert("⚠️ تعداد نخبگان آماده به خدمت تمدن برای جایگزینی کافی نیست!");
      return;
    }

    const newMembers = availablePeers.slice(0, targetProg.members.length).map(pe => pe.name);
    const newMemberXps: { [key: string]: number } = {};
    availablePeers.slice(0, targetProg.members.length).forEach(pe => {
      newMemberXps[pe.name] = pe.xp;
    });

    setPrograms(prev => prev.map(p => {
      if (p.id === programId) {
        // Chat announcement
        const systemNotice: ChatMessage = {
          id: "sys_replace_" + Date.now(),
          sender: "⚙️ سیستم خودکار جایگزینی توانا",
          message: `⚡ پروتکل جایگزینی فعال شد: اعضای بی‌تحرک برنامه «${p.title}» برکنار شدند! نخبگان برتر تمدن [${newMembers.join(" و ")}] به دلیل فعالیت بالا جایگزین آنها شدند و کار از سر گرفته شد!`,
          timestamp: "اکنون",
          isSpecial: true,
          frame: "gold_glow",
          entrance: "none",
          fontStyle: "retro_cyber"
        };
        setChatMessages(prevChat => [...prevChat, systemNotice]);

        return {
          ...p,
          status: "Active",
          members: newMembers,
          memberXps: newMemberXps,
          replaced: true
        };
      }
      return p;
    }));

    addPoints(40 * activeXpMultiplier, "فعال‌سازی هوشمند پروتکل نجات ملی پروژه رهاشده و انتصاب نخبگان جایگزین");
  };

  // Dopamine injection and random honorary titles lists
  const prefixTitles = ["مدیر توانا", "کدنویس ماهر", "اندیشه خلاق", "معمار بی‌بدیل", "سفیر ارگونومی", "نابودگر باگ‌ها", "آفلاین‌شناس زبردست", "فناور مقتدر", "راهبر فرهمند", "نگهبان دیتابیس", "الگوریتم‌نویس نخبه", "طراح ساختارشکن", "دیباگر خستگی‌ناپذیر"];
  const suffixTitles = ["تمدن توانا", "همدرد وطن", "آفلاین پایدار", "معماری ارگونومیک", "امپراطوری دیجیتال", "کویر پسیو", "سخت‌افزار محروم", "هسته سیستم‌عامل", "ملی وب‌شهر", "سرای امید"];

  const generateRandomTitle = () => {
    const pre = prefixTitles[Math.floor(Math.random() * prefixTitles.length)];
    const suf = suffixTitles[Math.floor(Math.random() * suffixTitles.length)];
    const title = `✨ ${pre} ${suf} ✨`;
    
    if (!myTitles.includes(title)) {
      setMyTitles(prev => [...prev, title]);
    }

    setDopamineBurst(`🎉 تبریک! شما مفتخر به دریافت لقب والای «${title}» شدید! دوپامین تازه در مغزتان جریان یافت.`);
    addPoints(25 * activeXpMultiplier, `تزریق دوپامین حسی: کسب عنوان مجلل و رسمی «${title}»`);

    // Broadcast to chat
    const titleMsg: ChatMessage = {
      id: "title_" + Date.now(),
      sender: "👑 دبیرخانه القاب تمدنی",
      message: `📣 شادباش ملی! طبق مصوبه مجمع نخبگان، همدرد گرامی [${profileName}] به دلیل خدمات خلاقانه به کسب لقب شکوهمند [${title}] نائل آمد!`,
      timestamp: "اکنون",
      isSpecial: true,
      frame: "gold_glow",
      entrance: "none",
      fontStyle: "royal_gold"
    };
    setChatMessages(prev => [...prev, titleMsg]);

    setTimeout(() => {
      setDopamineBurst(null);
    }, 4500);
  };

  const handleMicroCodeSubmit = () => {
    const encouragingMsgs = [
      "حتی نوشتن یک خط کد، تکیه‌گاهی امن برای خودکفایی نرم‌افزاری ماست! 💻",
      "یک کار کوچک امروز، فردا بنیان کدهای بزرگ تمدنی ما خواهد شد! 🌟",
      "مغز تو با نوشتن این کد، دوپامین تازه‌ای برای ادامه راه تولید کرد! 🧠✨",
      "احسنت! توانا به داشتن کدنویسان فعالی همچون تو به خود می‌بالد! 🛡️",
      "کد ارگونومیک تو، کار با سیستم را برای هزاران همدرد آسان‌تر می‌کند! 🤝"
    ];
    const randMsg = encouragingMsgs[Math.floor(Math.random() * encouragingMsgs.length)];
    
    setDopamineBurst(`🎉 تبریک دوپامینی! کار خرد شما ثبت شد.\n\n${randMsg}`);
    addPoints(10 * activeXpMultiplier, "ثبت یک خط کد پربرکت / کار خرد خلاقانه جهت رشد مداوم");

    const microMsg: ChatMessage = {
      id: "micro_" + Date.now(),
      sender: "⚡ ناظر دوپامین توانا",
      message: `کدنویس ماهر [${profileName}] با نوشتن کوچکترین کار ممکن، شعله خلاقیت خود را فروزان نگه داشت!`,
      timestamp: "اکنون",
      isSpecial: false,
      frame: "none",
      entrance: "none",
      fontStyle: "retro_cyber"
    };
    setChatMessages(prev => [...prev, microMsg]);

    setTimeout(() => {
      setDopamineBurst(null);
    }, 5000);
  };

  const handleApplyCheatCode = () => {
    const code = cheatCodeInput.trim().toUpperCase();
    if (!code) return;

    if (code === "TAVANA_GOD_MODE") {
      setActiveXpMultiplier(2);
      setDopamineBurst("🔥 کد تقلب فعال شد: حالت خدای توانا! ضریب تمام پاداش‌های شما از این پس ۲ برابر شد!");
      addPoints(100, "فعال‌سازی کد تقلب TAVANA_GOD_MODE");
    } else if (code === "BYPASS_WESTERN_API") {
      setPoints(prev => prev + 150);
      setDopamineBurst("📡 کد تقلب فعال شد: دور زدن سرورهای غربی! ۱۵۰ ایاکسپی به حسابتان واریز شد!");
      addPoints(150, "کد تقلب BYPASS_WESTERN_API");
    } else if (code === "INFINITE_DOPAMINE") {
      setUserLevel(prev => prev + 1);
      setDopamineBurst("🧠 کد تقلب فعال شد: دوپامین نامحدود! لول اکانت شما فوراً یک پله افزایش یافت!");
      addPoints(50, "کد تقلب INFINITE_DOPAMINE");
    } else if (code === "ERGONOMIC_STRIKE") {
      setPoints(prev => prev + 80);
      setDopamineBurst("🎯 کد تقلب فعال شد: ضربه ارگونومیک! تاچ‌پد کدهای شما روان و ۸۰ ایاکسپی آزاد شد!");
    } else {
      alert("⚠️ کد تقلب اشتباه است! رموز معتبر: TAVANA_GOD_MODE, BYPASS_WESTERN_API, INFINITE_DOPAMINE, ERGONOMIC_STRIKE");
    }
    setCheatCodeInput("");
    setTimeout(() => {
      setDopamineBurst(null);
    }, 5000);
  };

  // Chat message send
  const sendChatMessage = () => {
    if (!typedMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: "msg_" + Date.now(),
      sender: profileName,
      message: typedMessage,
      timestamp: "اکنون",
      isSpecial: profileFrame !== "none" || entranceEffect !== "none",
      frame: profileFrame,
      entrance: entranceEffect,
      fontStyle: chatFontStyle
    };

    setChatMessages(prev => [...prev, newMsg]);
    setTypedMessage("");
    addPoints(8, "مشارکت فعال و ارسال پیام گرانبها در چت‌روم تمدن");

    // Simulated Peer reply after 2 seconds
    setTimeout(() => {
      const replies = [
        "درود بر تو همدرد گرامی! قاب دور پروفایلت عالی به نظر می‌رسد.",
        "چه جالب! آیا برای پروژه بعدی فمیلی ما مایل به پیشنهاد همکاری دو جانبه هستید؟ ایاکسپی بالایی دارد.",
        "از انتقال ایاکسپی و حمایت‌های بی‌دریغ شما در لیگ بسیار سپاسگزاریم.",
        "من کدهای پروژه شما را خواندم و ارگونومی لمس آن واقعاً درخشان بود!",
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      const randomPeer = peers[Math.floor(Math.random() * peers.length)];

      const peerMsg: ChatMessage = {
        id: "reply_" + Date.now(),
        sender: randomPeer.name,
        message: randomReply,
        timestamp: "اکنون",
        isSpecial: true,
        frame: "silver",
        entrance: "none",
        fontStyle: "elegant_serif"
      };
      setChatMessages(prev => [...prev, peerMsg]);
    }, 2000);
  };

  // Like developer idea
  const handleLikePeer = (id: string) => {
    setPeers(prev => prev.map(p => {
      if (p.id === id) {
        const liked = !p.hasLiked;
        if (liked) {
          addPoints(5, `لایک کردن طرح تمدنیِ ${p.name}`);
          return { ...p, likes: p.likes + 1, hasLiked: true };
        } else {
          return { ...p, likes: p.likes - 1, hasLiked: false };
        }
      }
      return p;
    }));
  };

  // Comment on developer idea
  const handleAddComment = (peerId: string) => {
    const text = newCommentTexts[peerId];
    if (!text || !text.trim()) return;

    setPeers(prev => prev.map(p => {
      if (p.id === peerId) {
        return {
          ...p,
          comments: [...p.comments, { author: profileName, text: text }]
        };
      }
      return p;
    }));

    setNewCommentTexts(prev => ({ ...prev, [peerId]: "" }));
    addPoints(10, "ثبت نظر کارشناسی و خلاقانه روی ایده تمدنی همدردان");
  };

  // Create new Custom Family
  const handleCreateFamily = () => {
    if (!newFamilyName.trim()) {
      alert("⚠️ لطفا نامی شایسته برای فمیلی خود انتخاب کنید.");
      return;
    }

    const newFam: Family = {
      id: "fam_" + Date.now(),
      name: newFamilyName,
      motto: newFamilyMotto || "همکاری خلاقانه تحت لوای توانا",
      level: 1,
      xp: 100,
      captain: profileName,
      admin: "سهراب ممیز",
      techLead: "آفلاین‌شناس جوان",
      members: [
        { name: profileName, role: "Captain", level: userLevel, xpContribution: 100 },
        { name: "سهراب ممیز", role: "Admin", level: 4, xpContribution: 0 },
        { name: "آفلاین‌شناس جوان", role: "TechLead", level: 3, xpContribution: 0 }
      ],
      allianceIds: []
    };

    setMyFamily(newFam);
    addPoints(100, `تأسیس رسمی فمیلی مستقل [${newFamilyName}] در مراجع توانا`);
  };

  // Join or change roles inside family
  const handleAssignRole = (memberName: string, newRole: any) => {
    if (!myFamily) return;

    const updatedMembers = myFamily.members.map(m => {
      if (m.name === memberName) {
        return { ...m, role: newRole };
      }
      return m;
    });

    let captain = myFamily.captain;
    let admin = myFamily.admin;
    let techLead = myFamily.techLead;

    if (newRole === "Captain") captain = memberName;
    if (newRole === "Admin") admin = memberName;
    if (newRole === "TechLead") techLead = memberName;

    const updatedFamily = {
      ...myFamily,
      members: updatedMembers,
      captain,
      admin,
      techLead
    };

    setMyFamily(updatedFamily);
    addPoints(20, `به‌روزرسانی ساختار انسانی فمیلی و انتصاب ${memberName} به سمت ${newRole}`);
  };

  // Level Up Family with XP contribution
  const handleContributeXpToFamily = () => {
    if (!myFamily) return;
    if (points < 50) {
      alert("⚠️ برای ارتقای فمیلی باید حداقل ۵۰ ایاکسپی اهدا کنید.");
      return;
    }

    setPoints(prev => prev - 50);
    
    // Add contribution to current user in family
    const updatedMembers = myFamily.members.map(m => {
      if (m.name === profileName) {
        return { ...m, xpContribution: m.xpContribution + 50 };
      }
      return m;
    });

    const newXp = myFamily.xp + 50;
    const newLevel = Math.floor(newXp / 200) + 1; // Level ups every 200 family XP

    const updatedFamily = {
      ...myFamily,
      xp: newXp,
      level: newLevel,
      members: updatedMembers
    };

    setMyFamily(updatedFamily);
    addPoints(30, `اهدای ۵۰ ایاکسپی انفرادی جهت ارتقای سطح فمیلی به لول ${newLevel}`);
  };

  // Proposal for multi-family alliances (Boosts XP yields!)
  const handleLaunchAlliance = (targetFamId: string) => {
    if (!myFamily) return;
    if (myFamily.allianceIds.includes(targetFamId)) {
      alert("⚠️ این اتحاد صمیمانه پیش از این ثبت شده و پایدار است.");
      return;
    }

    const updatedFamily = {
      ...myFamily,
      allianceIds: [...myFamily.allianceIds, targetFamId]
    };
    setMyFamily(updatedFamily);

    // Update the other family to align as well
    const targetName = otherFamilies.find(f => f.id === targetFamId)?.name || "فمیلی متحد";
    addPoints(120, `پیشنهاد همکاری چند فمیلی با [${targetName}] جهت کسب ضریب ایاکسپی ۲ برابری تیمی`);
    
    // System notification in chat
    const allianceChat: ChatMessage = {
      id: "alliance_" + Date.now(),
      sender: "🤝 پیمان تضامنی فمیلی‌ها",
      message: `شادباش! پیمان همکاری دو فمیلی بین [${myFamily.name}] و [${targetName}] منعقد شد. پاداش پروژه‌های مشترک از این پس با ضریب ویژه ایاکسپی محاسبه می‌شود.`,
      timestamp: "اکنون",
      isSpecial: true,
      frame: "legendary_mythic",
      entrance: "none",
      fontStyle: "royal_gold"
    };
    setChatMessages(prev => [...prev, allianceChat]);
  };


  return (
    <div className="space-y-8 text-right" id="social_club_panel">
      
      {/* Visual Entrance Effects slide-in toast */}
      <AnimatePresence>
        {entranceNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 left-6 right-6 md:left-1/2 md:-translate-x-1/2 md:max-w-xl z-50 bg-gradient-to-r from-blue-900 via-slate-900 to-blue-900 border border-blue-500/30 rounded-2xl p-4 shadow-2xl flex items-center gap-3"
            dir="rtl"
          >
            <div className="bg-blue-500/10 p-2.5 rounded-xl border border-blue-500/20 shrink-0">
              {entranceEffect === "luxury_car" && <Car className="w-6 h-6 text-blue-400 animate-pulse" />}
              {entranceEffect === "supersonic_plane" && <Plane className="w-6 h-6 text-blue-400 animate-pulse" />}
              {entranceEffect === "ocean_wave" && <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />}
              {entranceEffect === "legendary_phoenix" && <Flame className="w-6 h-6 text-blue-400 animate-pulse" />}
              {entranceEffect === "royal_lion" && <Award className="w-6 h-6 text-blue-400 animate-pulse" />}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] text-blue-400 uppercase font-mono tracking-wider block font-bold">ورود شکوهمندانه اسطوره‌ای</span>
              <p className="text-xs text-slate-200 mt-1 font-semibold leading-relaxed break-words">{entranceNotification}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dopamine Explosion / Reward Notification Banner */}
      <AnimatePresence>
        {dopamineBurst && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 100 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-10 right-6 left-6 md:left-auto md:right-10 md:max-w-md z-50 bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-700 border-2 border-yellow-300 rounded-3xl p-5 shadow-[0_0_50px_rgba(234,179,8,0.4)] text-right relative overflow-hidden"
            dir="rtl"
          >
            {/* Pulsing glow circles background */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/20 blur-2xl rounded-full animate-pulse"></div>
            <div className="relative z-10 flex gap-4">
              <div className="bg-white/25 p-3 rounded-2xl shrink-0 flex items-center justify-center border border-white/30 animate-bounce">
                <Sparkles className="w-8 h-8 text-white animate-spin" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] bg-white/35 text-slate-900 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider block w-max font-mono">
                  ⚡ تزریق آنی دوپامین خالص توانا ⚡
                </span>
                <p className="text-xs font-black text-slate-950 mt-1.5 leading-relaxed whitespace-pre-line break-words">
                  {dopamineBurst}
                </p>
                <div className="mt-2 text-[9px] text-amber-950 font-bold bg-white/20 px-2 py-1 rounded w-max">
                  + ایاکسپی دوبل تمدنی و رتبه برتر سیستمی آزاد شد!
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Jumbotron Header */}
      <div className="bg-gradient-to-l from-slate-900 via-slate-900/80 to-blue-950/20 border border-slate-800 rounded-2xl p-6 relative overflow-hidden" id="social_jumbotron">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-3xl rounded-full"></div>
        <div className="relative z-10">
          <span className="bg-blue-500/10 text-blue-400 text-[10px] px-3 py-1 rounded-full border border-blue-500/20 font-mono font-bold">
            Tavana Gamified Social Arena / لیگ و فمیلی‌های خلاقانه تمدن
          </span>
          <h2 className="text-xl font-extrabold text-slate-100 mt-3">
            باشگاه اجتماعی، رقابت فمیلی‌ها و چت‌روم نخبگان
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-4xl leading-relaxed">
            در این تالار مجلل، منشور همکاری و پویایی جمعی تمدن توانا حاکم است. شما می‌توانید با همدردان خود فمیلی تشکیل داده، برای پروژه‌های مشترک چند فمیلی پیمان اتحاد امضا کنید، ایاکسپی اهدا کنید (قانون ۴۰٪)، ایده پروژه‌ها را لایک کنید و در چت‌روم مرکزی با اینترانس‌های افسانه‌ای نظیر هواپیمای فوق‌صوت یا شیر اساطیری بدرخشید!
          </p>
        </div>
      </div>

      {/* Dynamic Dopamine Booster & Cheat Codes Control Deck */}
      <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-5 relative overflow-hidden" id="dopamine_cheats_deck">
        <div className="absolute top-0 left-0 w-32 h-32 bg-yellow-500/5 blur-2xl rounded-full"></div>
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 relative z-10">
          
          {/* Column 1: Dopamine Generators */}
          <div className="flex-1 space-y-3">
            <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5 justify-end">
              <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
              مرکز تزریق مداوم دوپامین و افتخارات تمدن
            </h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              اگر حتی یک خط کد نوشته‌اید یا خردترین کار خلاقانه را انجام داده‌اید، فوراً با دکمه‌های زیر خود را شارژ کنید! نگذارید دکمه یادگیری و کدنویسی شما خاموش شود.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={handleMicroCodeSubmit}
                className="bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white text-[11px] font-extrabold px-3.5 py-2 rounded-xl border border-emerald-500/20 transition-all flex items-center gap-1.5 shadow-lg shadow-emerald-500/5 cursor-pointer"
              >
                <Code className="w-3.5 h-3.5 text-emerald-200 animate-pulse" />
                <span>✍️ ثبت نوشتن حتی ۱ خط کد / کار کوچک مفید</span>
              </button>

              <button
                onClick={generateRandomTitle}
                className="bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-400 hover:to-yellow-500 text-slate-950 text-[11px] font-black px-3.5 py-2 rounded-xl border border-yellow-400/20 transition-all flex items-center gap-1.5 shadow-lg shadow-yellow-500/10 cursor-pointer"
              >
                <Award className="w-3.5 h-3.5 text-slate-950 animate-bounce" />
                <span>👑 کسب لقب اساطیری جدید (مدیر توانا، کدنویس ماهر...)</span>
              </button>
            </div>
          </div>

          {/* Column 2: Cheat Codes Hub */}
          <div className="bg-slate-900/60 p-3.5 rounded-xl border border-slate-850 w-full md:w-72 space-y-2.5">
            <span className="text-[10px] text-slate-400 block font-bold">⌨️ بخش اعمال کدهای تقلب تمدنی:</span>
            <div className="flex gap-1.5">
              <input
                type="text"
                value={cheatCodeInput}
                onChange={(e) => setCheatCodeInput(e.target.value)}
                placeholder="مثلا: TAVANA_GOD_MODE"
                className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-center text-xs text-slate-300 font-mono w-full uppercase focus:outline-none focus:border-yellow-500"
              />
              <button
                onClick={handleApplyCheatCode}
                className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-yellow-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                اعمال رمـز
              </button>
            </div>
            <p className="text-[8px] text-slate-500 text-center leading-normal">
              رموز مکتوب تمدن: <span className="font-mono text-slate-400">TAVANA_GOD_MODE | BYPASS_WESTERN_API</span>
            </p>
          </div>

        </div>

        {/* Display Current User Titles */}
        <div className="border-t border-slate-900 mt-4 pt-3 flex flex-wrap gap-1.5 items-center justify-end">
          <span className="text-[10px] text-slate-500 ml-2 font-bold">مدال‌ها و القاب افتخاری من:</span>
          {myTitles.map((t, idx) => (
            <span 
              key={idx}
              className="text-[9px] bg-slate-900 text-amber-400/90 px-2 py-0.5 rounded-md border border-amber-500/10 hover:border-amber-500/30 transition-all font-bold"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Profile Customizer & XP Transferee (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section 1: User Profile & Frame & Entrance Selector */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4" id="social_profile_customizer">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-end">
              <Palette className="w-4 h-4 text-blue-500" />
              شخصی‌سازی هویت اساطیری من
            </h3>

            {/* Profile Avatar Card with Frame */}
            <div className="flex items-center gap-4 bg-slate-950/60 p-4 rounded-xl border border-slate-850/60 justify-between">
              
              <div className="flex items-center gap-3">
                {/* Frame container */}
                <div className={`relative p-1 rounded-full ${
                  profileFrame === "bronze" ? "bg-gradient-to-tr from-amber-800 to-amber-600 shadow-md" :
                  profileFrame === "silver" ? "bg-gradient-to-tr from-slate-400 to-slate-200 shadow-lg" :
                  profileFrame === "gold_glow" ? "bg-gradient-to-tr from-yellow-500 via-amber-400 to-yellow-600 shadow-xl shadow-yellow-500/10 animate-pulse" :
                  profileFrame === "legendary_mythic" ? "bg-gradient-to-tr from-purple-600 via-rose-500 to-blue-600 shadow-2xl shadow-purple-500/20 animate-bounce" : "bg-slate-800"
                }`}>
                  <div className="bg-slate-950 rounded-full p-2.5">
                    <User className="w-8 h-8 text-slate-300" />
                  </div>
                  {profileFrame !== "none" && (
                    <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-[8px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      ✓
                    </span>
                  )}
                </div>

                <div className="text-right">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1">
                    {profileName}
                    <Crown className="w-3 h-3 text-yellow-500" />
                  </h4>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    سطح توسعه‌دهنده: <span className="text-blue-400 font-mono font-bold">Lvl {userLevel}</span>
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    کل ایاکسپی من: <span className="text-emerald-400 font-mono font-bold">{points} eXP</span>
                  </p>
                </div>
              </div>

              {/* Edit name input */}
              <div className="text-left">
                <input 
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-xs text-slate-200 text-center w-28 focus:outline-none focus:border-blue-500"
                  placeholder="نام تمدنی شما"
                />
              </div>

            </div>

            {/* Custom Frame & Entrance Dropdowns */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block">قاب دور پروفایل:</label>
                <select
                  value={profileFrame}
                  onChange={(e) => {
                    setProfileFrame(e.target.value);
                    addPoints(10, "به‌روزرسانی و انتخاب قاب پروفایل جدید تمدنی");
                  }}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="none">بدون قاب (ساده)</option>
                  <option value="bronze">🥉 قاب برنزی همدردان</option>
                  <option value="silver">🥈 قاب نقره‌ای ممیزان</option>
                  <option value="gold_glow">🥇 قاب طلایی درخشان توانا</option>
                  <option value="legendary_mythic">🔮 قاب حماسی اساطیر تمدن</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 block">افکت باشکوه ورود (اینترانس):</label>
                <select
                  value={entranceEffect}
                  onChange={(e) => {
                    setEntranceEffect(e.target.value);
                    addPoints(15, "تنظیم جلوه ورودی مجلل جدید در چت‌روم");
                  }}
                  className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                >
                  <option value="none">بدون اینترانس (پیاده‌رو)</option>
                  <option value="luxury_car">🚗 اتومبیل سوپر اسپرت فراری</option>
                  <option value="supersonic_plane">✈️ هواپیمای فوق‌صوت تمدنی</option>
                  <option value="ocean_wave">🌊 موج باشکوه اقیانوس آرام</option>
                  <option value="legendary_phoenix">🐉 سیمرغ اسطوره‌ای مشرق‌زمین</option>
                  <option value="royal_lion">🦁 شیر اساطیری بیشه توانا</option>
                </select>
              </div>
            </div>

            {/* Custom font style selector for Chat messages */}
            <div className="space-y-1 pt-1">
              <label className="text-[10px] text-slate-400 block">قلم تخصصی پیام‌ها در چت (Font Style):</label>
              <select
                value={chatFontStyle}
                onChange={(e) => {
                  setChatFontStyle(e.target.value);
                  addPoints(10, "تغییر و ارتقای فونت پیام‌های گفتگو");
                }}
                className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
              >
                <option value="default">قلم ساده سیستم (Default)</option>
                <option value="royal_gold">🌟 طلایی درخشان مقتدر (Royal Gold Glow)</option>
                <option value="retro_cyber">👾 سایبرپانک الکترونیک (Retro Cyber Green)</option>
                <option value="elegant_serif">✒️ خوش‌نویسی سنتی تمدنی (Elegant Calligraphy)</option>
              </select>
            </div>

          </div>

          {/* Section 2: XP Transfer Arena with 40% rule */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4" id="social_xp_transfer">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
                قانون ۴۰٪ ایاکسپی قفل تمدنی
              </span>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-end">
                <ArrowLeftRight className="w-4 h-4 text-blue-500" />
                شبکه انتقال و واگذاری ایاکسپی (eXP)
              </h3>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              شما مجازید تا سقف ۴۰٪ از کل ایاکسپی کسب‌شده خود را به دلخواه خود بفروشید، هدیه دهید یا به همدرد دیگری منتقل کنید. ۶۰٪ مابقی به عنوان ذخیره سرمایه ملّی در حسابتان مسدود است.
            </p>

            {/* Live limit calculator */}
            <div className="bg-slate-950/60 p-3.5 rounded-xl border border-slate-850 text-xs space-y-2 font-mono">
              <div className="flex justify-between items-center text-slate-400">
                <span>کل ایاکسپی به دست آمده:</span>
                <span className="text-slate-200 font-bold">{totalEarnedXp} XP</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>حد نصاب مجاز انتقال (۴۰٪):</span>
                <span className="text-amber-400 font-bold">{maxXpTradable} XP</span>
              </div>
              <div className="flex justify-between items-center text-slate-400">
                <span>مبلغ منتقل‌شده تا کنون:</span>
                <span className="text-rose-400 font-bold">{transferredXp} XP</span>
              </div>
              <div className="border-t border-slate-900 my-1 pb-1"></div>
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-300">ظرفیت واگذاری آزاد باقیمانده:</span>
                <span className="text-emerald-400 font-bold">{remainingXpTradable} XP</span>
              </div>
            </div>

            {/* Transfer form */}
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block">انتخاب همدرد گیرنده:</label>
                  <select
                    value={selectedRecipientId}
                    onChange={(e) => setSelectedRecipientId(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                  >
                    {peers.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Lvl {p.level})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 block">مبلغ انتقال (eXP):</label>
                  <input
                    type="number"
                    value={xpTransferAmount}
                    onChange={(e) => setXpTransferAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-mono text-center"
                    min="1"
                  />
                </div>
              </div>

              <button
                onClick={handleXpTransfer}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/10 cursor-pointer"
              >
                <ArrowLeftRight className="w-3.5 h-3.5" />
                <span>ثبت واگذاری و کسر از حساب</span>
              </button>
            </div>

          </div>

        </div>

        {/* RIGHT COLUMN: Chat Room & Families Area (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Chat Room Frame */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col h-[400px]" id="social_chat_room">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>بخش مرکزی تالار: چت سراسری</span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-end">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                گفتگوی زنده تمدن همدردان (Homeland Chat)
              </h3>
            </div>

            {/* Chat Area Scrollbox */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-950/80 border border-slate-850 rounded-xl" dir="ltr">
              {chatMessages.map((msg) => {
                // Style fonts dynamically based on chosen config
                let fontClass = "text-slate-300 font-sans text-xs";
                if (msg.fontStyle === "royal_gold") {
                  fontClass = "font-extrabold text-xs text-yellow-400 bg-gradient-to-r from-yellow-500/10 to-transparent p-1 px-2 rounded border-r-2 border-yellow-500 font-display";
                } else if (msg.fontStyle === "retro_cyber") {
                  fontClass = "font-mono text-xs text-emerald-400 bg-emerald-950/20 p-1 px-2 rounded border-r-2 border-emerald-500";
                } else if (msg.fontStyle === "elegant_serif") {
                  fontClass = "font-serif text-xs italic text-slate-200 leading-relaxed";
                }

                // Render customized profile frames visual
                let frameStyle = "border-slate-850";
                if (msg.frame === "bronze") frameStyle = "border-amber-800 border-2";
                else if (msg.frame === "silver") frameStyle = "border-slate-400 border-2";
                else if (msg.frame === "gold_glow") frameStyle = "border-yellow-400 border-2 shadow-sm shadow-yellow-400/20";
                else if (msg.frame === "legendary_mythic") frameStyle = "border-purple-500 border-2 shadow-md shadow-purple-500/30";

                return (
                  <div key={msg.id} className="text-right space-y-1" dir="rtl">
                    <div className="flex items-center gap-2">
                      {/* Name with frame badge */}
                      <span className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        msg.sender.includes("📡") ? "bg-slate-900 text-blue-400" :
                        msg.sender.includes("💸") ? "bg-slate-900 text-amber-500" :
                        msg.sender.includes("🤝") ? "bg-slate-900 text-purple-400" : "bg-slate-900 text-slate-400"
                      } border ${frameStyle}`}>
                        {msg.sender}
                      </span>
                      <span className="text-[9px] text-slate-600 font-mono">{msg.timestamp}</span>
                    </div>
                    <div className="pr-4">
                      <p className={fontClass}>{msg.message}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Input message form */}
            <div className="flex gap-2">
              <button
                onClick={sendChatMessage}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2.5 rounded-xl transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
              <input
                type="text"
                value={typedMessage}
                onChange={(e) => setTypedMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                placeholder="پیام ارزشمند خود را در کادر بنویسید..."
                className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-right"
                dir="rtl"
              />
            </div>

          </div>

          {/* Families & Alliances Section */}
          <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4" id="social_families_arena">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 justify-end">
              <Users className="w-4 h-4 text-blue-500" />
              فمیلی تمدنی من و اتحادیه‌های صمیمانه
            </h3>

            {myFamily ? (
              <div className="space-y-4">
                {/* Active Family Card */}
                <div className="bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900 border border-slate-850 p-4 rounded-xl space-y-3 text-right">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-500/10 p-1.5 rounded-lg border border-blue-500/20 text-blue-400 font-mono font-bold text-xs">
                        Lvl {myFamily.level}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-200">{myFamily.name}</h4>
                        <p className="text-[10px] text-slate-500 italic mt-0.5">{myFamily.motto}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={handleContributeXpToFamily}
                        className="bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded text-[10px] font-bold transition-all cursor-pointer"
                      >
                        🚀 اهدا و ارتقا (+50 XP)
                      </button>
                      <button
                        onClick={() => {
                          if (confirm("آیا قصد خروج از این فمیلی را دارید؟")) {
                            setMyFamily(null);
                            addPoints(-30, "انحلال/خروج از فمیلی");
                          }
                        }}
                        className="bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 px-2.5 py-1 rounded text-[10px] cursor-pointer"
                      >
                        خروج
                      </button>
                    </div>
                  </div>

                  {/* Family Structure Positions */}
                  <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-850/40">
                      <span className="text-slate-500 block">👑 کاپیتان (Captain)</span>
                      <span className="text-slate-200 font-bold block mt-1">{myFamily.captain}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-850/40">
                      <span className="text-slate-500 block">👮 ادمین (Admin)</span>
                      <span className="text-slate-200 font-bold block mt-1">{myFamily.admin}</span>
                    </div>
                    <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-850/40">
                      <span className="text-slate-500 block">⚙️ مسئول فنی (TechLead)</span>
                      <span className="text-slate-200 font-bold block mt-1">{myFamily.techLead}</span>
                    </div>
                  </div>

                  {/* Members list */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] text-slate-500 block">ترکیب انسانی و مشارکت اعضا:</span>
                    <div className="space-y-1">
                      {myFamily.members.map((mem, mIdx) => (
                        <div key={mIdx} className="flex justify-between items-center text-[10px] bg-slate-900/20 p-1.5 rounded border border-slate-900">
                          <div className="flex gap-2">
                            <select
                              value={mem.role}
                              onChange={(e) => handleAssignRole(mem.name, e.target.value as any)}
                              className="bg-slate-950 border border-slate-850 rounded text-[9px] text-slate-400 px-1 py-0.5"
                            >
                              <option value="Captain">کاپیتان</option>
                              <option value="Admin">ادمین</option>
                              <option value="TechLead">مسئول فنی</option>
                              <option value="Member">عضو ساده</option>
                            </select>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-slate-500 font-mono">(سهم: {mem.xpContribution}eXP)</span>
                            <span className="text-slate-300 font-bold">{mem.name}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Captain's Recruitment Panel */}
                  {myFamily.captain === profileName && (
                    <div className="border-t border-slate-900 pt-3 space-y-2 text-right">
                      <span className="text-[10px] text-amber-400 block font-bold">🛠️ پنل عضوگیری کاپیتان فمیلی:</span>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={recruitName}
                          onChange={(e) => setRecruitName(e.target.value)}
                          placeholder="نام ممیز یا عضو جدید برای جذب..."
                          className="bg-slate-950 border border-slate-850 rounded-lg px-2 py-1 text-[11px] text-slate-200 text-right flex-1 focus:outline-none focus:border-blue-500"
                        />
                        <select
                          value={recruitRole}
                          onChange={(e) => setRecruitRole(e.target.value as any)}
                          className="bg-slate-950 border border-slate-850 rounded-lg px-1 py-1 text-[11px] text-slate-300"
                        >
                          <option value="Member">عضو ساده</option>
                          <option value="Admin">ادمین فمیلی</option>
                          <option value="TechLead">مسئول فنی</option>
                        </select>
                        <button
                          onClick={handleRecruitMember}
                          className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] px-3 py-1 rounded-lg shrink-0 transition-colors cursor-pointer"
                        >
                          ➕ جذب نیرو
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Multi-family Alliances Panel */}
                  <div className="border-t border-slate-900 pt-3 space-y-2">
                    <span className="text-[10px] text-slate-400 block font-bold">پیمان‌های اتحاد چند فمیلی فعال:</span>
                    <div className="flex flex-wrap gap-2">
                      {myFamily.allianceIds.length === 0 ? (
                        <span className="text-[9px] text-slate-600 italic">هیچ اتحادی با فمیلی‌های بیرونی برقرار نیست.</span>
                      ) : (
                        myFamily.allianceIds.map(aId => {
                          const fName = otherFamilies.find(f => f.id === aId)?.name || "فمیلی متحد";
                          return (
                            <span key={aId} className="bg-purple-500/10 text-purple-400 text-[10px] px-2.5 py-0.5 rounded-full border border-purple-500/20 flex items-center gap-1">
                              🤝 {fName} (ضریب ۲ برابر فعال)
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* Available foreign families for forming Alliances */}
                <div className="space-y-2 pt-2">
                  <span className="text-[10px] text-slate-400 block">فمیلی‌های شایسته جهت پیشنهاد همکاری چندجانبه:</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {otherFamilies.map(fam => (
                      <div key={fam.id} className="bg-slate-950/40 border border-slate-850 rounded-xl p-3 flex flex-col justify-between text-right">
                        <div>
                          <div className="flex justify-between items-center">
                            <span className="text-[9px] text-slate-500 font-mono">Lvl {fam.level}</span>
                            <h5 className="text-[11px] font-bold text-slate-300">{fam.name}</h5>
                          </div>
                          <p className="text-[9px] text-slate-500 italic mt-1">{fam.motto}</p>
                        </div>
                        <button
                          onClick={() => handleLaunchAlliance(fam.id)}
                          className="bg-slate-900 hover:bg-slate-850 text-blue-400 border border-slate-800 text-[10px] font-bold py-1 px-2 rounded-lg mt-3 text-center transition-all cursor-pointer"
                        >
                          🤝 امضای پیمان همکاری تیمی
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              /* Create Family Form if user has none */
              <div className="bg-slate-950/40 border border-slate-850 p-4 rounded-xl space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed text-center">
                  شما در حال حاضر عضو فمیلی خاصی نیستید. برای ارتقای گروهی و شرکت در لیگ‌های چندجانبه، همین حالا اولین فمیلی خود را تأسیس کنید و کاپیتان آن شوید!
                </p>

                <div className="space-y-2.5">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block">نام فمیلی جدید:</label>
                    <input
                      type="text"
                      value={newFamilyName}
                      onChange={(e) => setNewFamilyName(e.target.value)}
                      placeholder="مثلاً: فمیلی فناوران دنا"
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-right"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 block">شعار تمدنی فمیلی:</label>
                    <input
                      type="text"
                      value={newFamilyMotto}
                      onChange={(e) => setNewFamilyMotto(e.target.value)}
                      placeholder="شعار الهام‌بخش گروه"
                      className="w-full bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-right"
                    />
                  </div>

                  <button
                    onClick={handleCreateFamily}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    👑 تأسیس فمیلی و شروع لول‌آپ تیمی
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* FOOTER ROW: Individual Leagues Leaderboard, Likes, and Comments on projects */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4" id="social_league_leaderboard">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 mb-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/10 p-2 rounded-lg">
              <Trophy className="w-5 h-5 text-blue-400 animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">رتبه‌بندی تمدن، لیگ سراسری و تالار لایک/کامنت پروژه‌ها</h3>
              <p className="text-xs text-slate-500 mt-0.5">برنامه‌نویسان پیشرو را تشویق کنید و در بستر کارهایشان پیشنهادهای راهبردی بنویسید.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-400 bg-blue-500/5 border border-blue-500/10 px-3 py-1 rounded-full font-mono">
            جام قهرمانان خلاق توانا
          </span>
        </div>

        {/* Peer Developers Feed & Collaboration Panels */}
        <div className="space-y-4">
          {peers.map((peer) => (
            <div key={peer.id} className="bg-slate-950/60 border border-slate-850 rounded-xl p-4 flex flex-col md:flex-row justify-between gap-4 text-right">
              
              {/* Left Section: Likes, Comments Feed */}
              <div className="flex-1 space-y-3">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 text-xs">
                  <span className="text-[10px] text-slate-500 block mb-1">💡 طرح تمدنی ثبت‌شده در لیگ:</span>
                  <p className="text-slate-300 font-semibold leading-relaxed">{peer.projectIdea}</p>
                </div>

                {/* Likes trigger and comments summary */}
                <div className="flex items-center gap-4 justify-start">
                  <button
                    onClick={() => handleLikePeer(peer.id)}
                    className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border transition-all cursor-pointer ${
                      peer.hasLiked 
                        ? "bg-rose-500/15 text-rose-400 border-rose-500/30" 
                        : "bg-slate-900 text-slate-400 border-slate-850 hover:text-rose-400"
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${peer.hasLiked ? "fill-rose-400" : ""}`} />
                    <span>{peer.likes} لایک تایید خلاقیت</span>
                  </button>

                  <div className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                    <MessageCircle className="w-3.5 h-3.5 text-blue-500" />
                    <span>{peer.comments.length} نظر کارشناسی</span>
                  </div>
                </div>

                {/* Read comments list */}
                {peer.comments.length > 0 && (
                  <div className="space-y-1.5 pl-4 border-l border-slate-900/60">
                    {peer.comments.map((comm, cIdx) => (
                      <div key={cIdx} className="text-[10px] bg-slate-900/10 p-2 rounded border border-slate-900/40">
                        <span className="text-blue-400 font-bold ml-1">{comm.author}:</span>
                        <span className="text-slate-300">{comm.text}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Comment input */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddComment(peer.id)}
                    className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/20 text-blue-400 px-3 rounded-lg text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    ارسال نظر
                  </button>
                  <input
                    type="text"
                    value={newCommentTexts[peer.id] || ""}
                    onChange={(e) => setNewCommentTexts({ ...newCommentTexts, [peer.id]: e.target.value })}
                    placeholder="پیشنهاد همکاری یا نقد ارگونومی..."
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-[11px] text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500 text-right"
                    dir="rtl"
                  />
                </div>

              </div>

              {/* Right Section: Developer Profile Info & Ranking (Vertical Line separation) */}
              <div className="md:w-56 bg-slate-900/20 p-3.5 rounded-xl border border-slate-900/60 flex flex-col justify-between shrink-0">
                <div className="text-right">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono">رتبه {peer.rank}</span>
                    <span className="bg-blue-500/15 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-500/10">
                      سطح {peer.level}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-slate-200 mt-2">{peer.name}</h4>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">انباشت: <span className="text-emerald-400 font-bold">{peer.xp} eXP</span></p>
                </div>

                <div className="pt-3 border-t border-slate-900 mt-3">
                  <button
                    onClick={() => {
                      setSelectedRecipientId(peer.id);
                      document.getElementById("social_xp_transfer")?.scrollIntoView({ behavior: "smooth" });
                      addPoints(5, `علاقه‌مندی به انتقال ایاکسپی به ${peer.name}`);
                    }}
                    className="w-full bg-slate-950 hover:bg-slate-900 text-slate-400 border border-slate-850 text-[10px] font-bold py-1.5 rounded-lg text-center transition-all cursor-pointer"
                  >
                    💸 واگذاری ایاکسپی به او
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* SECTION 4: Abandoned Projects & System Replacement Protocol */}
      <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 space-y-4" id="social_abandoned_programs">
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-800 pb-4 mb-2 gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-rose-500/10 p-2 rounded-lg">
              <Shield className="w-5 h-5 text-rose-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">سامانه نظارت ملّی بر برنامه‌های تمدن و جایگزینی خودکار</h3>
              <p className="text-xs text-slate-500 mt-0.5">ضابطه انضباطی: در صورت انحلال، رهاشدگی یا رکود پروژه، امتیاز اعضا نصف شده و نخبگان فعال جایگزین می‌شوند.</p>
            </div>
          </div>
          <span className="text-xs font-bold text-rose-400 bg-rose-500/5 border border-rose-500/10 px-3 py-1 rounded-full font-mono">
            کنترل بقای پایدار پروژه‌ها
          </span>
        </div>

        {/* Info Box */}
        <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-850/60 text-xs text-slate-400 leading-relaxed text-right space-y-2">
          <p className="font-bold text-slate-300 flex items-center gap-1 justify-end">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            مرور قوانین صیانت از کدهای توانا:
          </p>
          <ul className="list-disc list-inside space-y-1 pr-4">
            <li>اگر برنامه‌ای توسط اعضا متوقف یا رها شود، کل امتیاز کسب‌شده (XP) اعضا در آن پروژه فوراً به <span className="text-rose-400 font-bold">۵۰ درصد</span> تقلیل می‌یابد.</li>
            <li>اعضای تنبل فاقد هرگونه فعالیت ممیزی خواهند شد و توسط مجمع نخبگان اخراج می‌شوند.</li>
            <li>سیستم هوشمند به جای آنها متخصصان فعال با رتبه بالا و فعال‌تر را به کار گمارده و کار را احیا می‌کند.</li>
          </ul>
        </div>

        {/* Programs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {programs.map((prog) => (
            <div 
              key={prog.id} 
              className={`bg-slate-950 border rounded-xl p-4 flex flex-col justify-between text-right transition-all ${
                prog.status === "Discontinued" 
                  ? "border-rose-900/40 bg-gradient-to-b from-slate-950 to-rose-950/10 shadow-lg shadow-rose-950/5" 
                  : "border-slate-850 bg-gradient-to-b from-slate-950 to-slate-900/40"
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2.5">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    prog.status === "Active" 
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse"
                  }`}>
                    {prog.status === "Active" ? "✓ فعال و پویا" : "🚨 راکد و رهاشده"}
                  </span>
                  <h4 className="text-xs font-extrabold text-slate-200">{prog.title}</h4>
                </div>

                <p className="text-[10px] text-slate-400 mb-3">{prog.description}</p>
                
                <div className="bg-slate-900/40 p-2.5 rounded-lg border border-slate-900 text-[10px] space-y-1">
                  <span className="text-slate-500 block">👥 اعضای مشارکت‌کننده:</span>
                  {prog.members.map((member, mIdx) => (
                    <div key={mIdx} className="flex justify-between items-center text-slate-300 font-mono">
                      <span className="text-blue-400 font-bold">{prog.memberXps[member] || 0} XP</span>
                      <span>{member}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-900 flex gap-2">
                {prog.status === "Active" ? (
                  <button
                    onClick={() => handleDiscontinueProgram(prog.id)}
                    className="w-full bg-rose-950 hover:bg-rose-900 text-rose-400 border border-rose-900/40 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                  >
                    ⚠️ اعلام رهاشدگی پروژه (کسر ۵۰٪ امتیاز)
                  </button>
                ) : (
                  <button
                    onClick={() => handleReplaceMembers(prog.id)}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white py-1.5 rounded-lg text-[10px] font-bold transition-all shadow-lg shadow-blue-500/15 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ArrowLeftRight className="w-3 h-3" />
                    <span>⚡ احیای پروژه با نخبگان جایگزین سیستم</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
