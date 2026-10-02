// ============================================================
//  Alphabet World — bilingual UI strings
// ============================================================

import type { Level, UiLang } from "./types";

export const LANGS: { id: UiLang; label: string; flag: string }[] = [
  { id: "fa", label: "فارسی", flag: "🇮🇷" },
  { id: "de", label: "Deutsch", flag: "🇩🇪" },
];

export type Dict = {
  dir: "rtl" | "ltr";
  brandName: string;
  brandSub: string;
  langToggle: string;
  levelLabel: string;
  vocabTitle: string;
  vocabBtn: string;
  gamesBtn: string;
  composerPlaceholder: string;
  send: string;
  suggestions: string[];
  intro: {
    title: string;
    body: string;
    start: string;
  };
  levels: {
    title: string;
    sub: string;
    names: Record<Level, string>;
    descs: Record<Level, string>;
  };
  settingsBtn: string;
  settings: {
    title: string;
    sub: string;
    provider: string;
    apiKey: string;
    apiKeyPlaceholder: string;
    model: string;
    modelPlaceholder: string;
    modelHint: string;
    baseUrl: string;
    baseUrlPlaceholder: string;
    baseUrlHint: string;
    customHint: string;
    customExamples: string;
    apiFormat: string;
    formatOpenai: string;
    formatAnthropic: string;
    formatHint: string;
    save: string;
    clear: string;
    saved: string;
    cleared: string;
    active: string;
    inactive: string;
    guideTitle: string;
    guideAtria: { step: string }[];
    guideGroq: { step: string }[];
    guide: { step: string }[];
    privacy: string;
    free: string;
    groqFree: string;
    test: string;
    testing: string;
    testOk: (model: string) => string;
    testFail: string;
    keyTooShort: string;
    learnMore: string;
  };
  stats: { xp: string; words: string; streak: string };
  vocab: {
    sub: (n: number) => string;
    empty: string;
    delete: string;
  };  game: {
    bannerTitle: (t: string) => string;
    bannerSub: (n: number) => string;
    wrong: (t: string) => string;
    win: string;
    sheetTitle: string;
    sheetSub: string;
    soon: string;
    titles: { find: string; build: string; race: string; missing: string };
    descs: { find: string; build: string; race: string; missing: string };
    // بازی «کلمه بساز»
    buildHint: string;
    buildBanner: string;
    buildHintBtn: string;
    buildNext: string;
    buildStop: string;
    built: (w: string, m: string) => string;
    notWord: (a: string) => string;
    // بازی مسابقه
    raceTarget: (w: string) => string;
    raceTap: (ch: string) => string;
    raceWrong: string;
    raceWin: string;
    // بازی حرف گمشده
    missingPrompt: (word: string) => string;
    missingWrong: string;
    missingWin: string;
  };
  // ابزارهای موس: آبنبات و چوب بدبو
  tools: {
    label: string;
    normal: string;
    lollipop: string;
    smelly: string;
    lollipopHint: string;
    smellyHint: string;
  };
  word: {
    analyzing: string;
    thinking: string;
    article: string;
    plural: string;
    meaning: string;
    conjugation: string;
    forms: string;
    example: string;
    listen: string;
    save: string;
    saved: string;
    pos: { noun: string; verb: string; adjective: string; adverb: string; other: string };
    offlineMeaning: string;
  };
  toast: {
    error: string;
    tooMany: string;
    offline: string;
    saved: string;
    levelChosen: (l: string) => string;
    win: string;
    audio: string;
    signedIn: string;
  };
  hint: string;
  thinking: string;
  offlineTag: string;
  aiTag: string;
  cacheTag: string;
};

const fa: Dict = {
  dir: "rtl",
  brandName: "دنیای حروف",
  brandSub: "آلمانی · حروف زنده",
  langToggle: "Deutsch",
  levelLabel: "سطح",
  vocabTitle: "واژگان من",
  vocabBtn: "واژگان",
  gamesBtn: "بازی‌ها",
  composerPlaceholder: "چیزی از حروف بپرس…",
  send: "ارسال",
  suggestions: [
    "Fernweh یعنی چی؟",
    "«صبح بخیر» چطور می‌شه؟",
    "حرف تعریف der رو توضیح بده",
    "Schmetterling یعنی چی؟",
    "gemütlich یعنی چی؟",
  ],
  intro: {
    title: "دنیای حروف",
    body: "این حروف زنده‌اند. یه سؤال آلمانی بپرس — و ببین چطور جواب رو برات می‌سازن.",
    start: "شروع کن",
  },
  levels: {
    title: "سطح تو",
    sub: "جواب‌ها و تمرین‌ها با سطح تو تنظیم می‌شن.",
    names: {
      A1: "A1 · مبتدی",
      A2: "A2 · پایه",
      B1: "B1 · متوسط",
      B2: "B2 · پیش‌متوسط",
      C1: "C1 · پیشرفته",
    },
    descs: {
      A1: "اولین کلمه‌ها و جملات",
      A2: "زبان روزمره",
      B1: "صحبت مستقل",
      B2: "روان و مطمئن",
      C1: "تقریباً مثل زبان مادری",
    },
  },
  stats: { xp: "امتیاز", words: "کلمات", streak: "پیاپی" },
  vocab: {
    sub: (n) => `${n} کلمه ذخیره · آفلاین`,
    empty: "هنوز کلمه‌ای ذخیره نشده.\nتو جواب، یه کلمه رو لمس کن!",
    delete: "حذف",
  },
  game: {
    bannerTitle: (t) => `همه‌ی «${t}» رو پیدا کن`,
    bannerSub: (n) => `${n} تا مونده · لمسشون کن`,
    wrong: (t) => `این «${t}» نیست`,
    win: "آفرین! +۱۵ امتیاز",
    sheetTitle: "بازی‌های کوچک",
    sheetSub: "با حروف زنده بازی کن.",
    soon: "به‌زودی",
    titles: {
      find: "حرف رو پیدا کن",
      build: "کلمه رو بساز",
      race: "مسابقه کلمه",
      missing: "حرف گمشده",
    },
    descs: {
      find: "تمام کپی‌های یه حرف رو بزن",
      build: "حروف رو جمع کن تا کلمه بسازی",
      race: "حرف‌ها مسابقه می‌دن",
      missing: "جای خالی رو پر کن: Sch__le",
    },
    buildHint: "معنی کلمهٔ هدف:",
    buildBanner: "کلمه رو بساز",
    buildHintBtn: "راهنما",
    buildNext: "کلمهٔ بعدی",
    buildStop: "تمام بازی",
    built: (w, m) => `«${w}» یعنی ${m} · +۲۰ امتیاز`,
    notWord: (a) => `«${a}» کلمه نیست — دوباره امتحان کن`,
    raceTarget: (w) => `حروف «${w}» دارن فرار می‌کنن — به ترتیب بزن!`,
    raceTap: (ch) => `«${ch}» خوب — بعدی!`,
    raceWrong: "اشتباه — از اول",
    raceWin: "عالی! مسابقه رو بردی · +۲۰ امتیاز",
    missingPrompt: (word) => `حرف گمشده چیه؟ ${word}`,
    missingWrong: "نه، اشتباهه!",
    missingWin: "درسته! · +۱۵ امتیاز",
  },
  tools: {
    label: "ابزار",
    normal: "عادی",
    lollipop: "آبنبات",
    smelly: "چوب بدبو",
    lollipopHint: "حرف‌ها دنبال آبنبات می‌دن",
    smellyHint: "حرف‌ها از چوب بدبو فرار می‌کنن",
  },
  word: {
    analyzing: "در حال تحلیل…",
    thinking: "حروف دنبالش می‌گردن…",
    article: "حرف تعریف",
    plural: "جمع",
    meaning: "معنی",
    conjugation: "صرف فعل",
    forms: "درجات صفت",
    example: "مثال",
    listen: "گوش بده",
    save: "ذخیره",
    saved: "ذخیره شد",
    pos: {
      noun: "اسم",
      verb: "فعل",
      adjective: "صفت",
      adverb: "قید",
      other: "کلمه",
    },
    offlineMeaning: "برای ترجمه اینترنت لازمه — ذخیره کن تا بعداً ببینی.",
  },
  settingsBtn: "تنظیمات",
  settings: {
    title: "کلید هوش مصنوعی شخصی",
    sub: "اگر سایت هنوز کلید رایگان نداره، می‌تونی کلید خودت رو بذاری. جواب‌ها مستقیم برای تو میان.",
    provider: "شرکت ارائه‌دهنده",
    apiKey: "کلید API",
    apiKeyPlaceholder: "sk-...",
    model: "مدل (اختیاری)",
    modelPlaceholder: "پیش‌فرض همون کار می‌کنه",
    modelHint: "اگر نمی‌دونی چی باشه، خالی بذار.",
    baseUrl: "آدرس سرور (API Base URL)",
    baseUrlPlaceholder: "https://api.example.com/v1",
    baseUrlHint: "باید با https:// شروع شود. معمولاً آدرس + /v1 است.",
    customHint:
      "برای هر سرور OpenAI-سازگار: آدرس، مدل و کلید را وارد کن.",
    customExamples:
      "Groq: https://api.groq.com/openai/v1 · llama-3.3-70b-versatile\nOpenRouter: https://openrouter.ai/api/v1 · google/gemini-2.0-flash-exp:free\nAtria: https://api.atlantic.ac · atria-1\nDeepSeek: https://api.deepseek.com · deepseek-chat",
    apiFormat: "فرمت API",
    formatOpenai: "OpenAI (پیش‌فرض)",
    formatAnthropic: "Anthropic (Atria)",
    formatHint: "اگر نمی‌دونی، OpenAI را انتخاب کن. Atria از Anthropic استفاده می‌کند.",
    save: "ذخیره",
    clear: "پاک کردن کلید",
    saved: "کلید ذخیره شد",
    cleared: "کلید پاک شد",
    active: "فعال",
    inactive: "بدون کلید شخصی",
    guideTitle: "چطور کلید رایگان دیپ‌سیک بگیرم؟",
    guideGroq: [
      { step: "به console.groq.com برو و با حساب گوگل وارد شو." },
      { step: "از منو، API Keys را باز کن." },
      { step: "روی Create API Key بزن، اسم دلخواه بنویس و Create بزن." },
      { step: "کلید را کپی کن (با gsk_ شروع می‌شود)." },
      { step: "توی بازی، Groq را انتخاب کن، کلید را پیست کن و Save را بزن." },
    ],
    guideAtria: [
      { step: "بهatria-asi.ai برو و ثبت‌نام کن." },
      { step: "از پنل، کلید API بساز (با atr_ شروع می‌شود)." },
      { step: "کلید را کپی کن." },
      { step: "Atria را انتخاب کن، کلید را پیست کن و تست را بزن." },
    ],
    guide: [
      { step: "به platform.deepseek.com برو و با حساب گوگل یا ایمیل وارد شو." },
      { step: "از منوی سمت چپ «API Keys» رو باز کن." },
      { step: "روی «Create API Key» بزن و یه اسم دلخواه بنویس." },
      { step: "کلیدی که می‌سازه رو کپی کن (فقط یک‌بار نشونش می‌دن)." },
      { step: "همین‌جا پیست کن و ذخیره رو بزن. تمام!" },
    ],
    privacy:
      "کلید فقط در همین مرورگر و برای درخواست‌های این بازی ذخیره می‌شود و هرگز جایی لو نمی‌رود.",
    free: "دیپ‌سیک به حساب‌های جدید اعتبار رایگان می‌ده و قیمتش هم بسیار پایین است.",
    groqFree: "Groq رایگان است: ۳۰ درخواست در دقیقه و ۱۴٬۴۰۰ در روز. برای یادگیری کافی است.",
    test: "تست کلید",
    testing: "در حال تست…",
    testOk: (m) => `کلید کار می‌کند ✓ (${m})`,
    testFail: "کلید کار نکرد:",
    keyTooShort: "کلید کوتاه است — کلید واقعی معمولاً با sk- شروع می‌شود.",
    learnMore: "ساخت کلید در platform.deepseek.com",
  },
  toast: {
    error: "یه چیزی اشتباه پیش رفت.",
    tooMany: "زیادی سریع! یه چند ثانیه صبر کن.",
    offline: "آفلاینیم ولی حروف هنوز زنده‌ان.",
    saved: "کلمه ذخیره شد! +۵ امتیاز",
    levelChosen: (l) => `سطح ${l} انتخاب شد`,
    win: "آفرین! +۱۵ امتیاز",
    audio: "صدا در دسترس نیست",
    signedIn: "پیشرفت ذخیره شد",
  },
  hint: "یه کلمه رو لمس کن تا یادش بگیری و ذخیره‌اش کنی",
  thinking: "حروف دارن فکر می‌کنن…",
  offlineTag: "جواب آفلاین",
  aiTag: "مونتاژشده توسط حروف",
  cacheTag: "مونتاژشده توسط حروف",
};

const de: Dict = {
  dir: "ltr",
  brandName: "Alphabet World",
  brandSub: "Deutsch · lebende Buchstaben",
  langToggle: "فارسی",
  levelLabel: "Niveau",
  vocabTitle: "Meine Wörter",
  vocabBtn: "Wörter",
  gamesBtn: "Spiele",
  composerPlaceholder: "Frag die Buchstaben etwas…",
  send: "senden",
  suggestions: [
    "Was bedeutet Fernweh?",
    "Wie sagt man 'guten Morgen'?",
    "Erkläre den Artikel 'der'",
    "Was heißt Schmetterling?",
    "Was heißt gemütlich?",
  ],
  intro: {
    title: "Alphabet World",
    body: "Diese Buchstaben leben. Stell eine Frage auf Deutsch — und sieh zu, wie sie die Antwort für dich zusammensetzen.",
    start: "Los geht's",
  },
  levels: {
    title: "Dein Niveau",
    sub: "Antworten & Übungen passen sich deinem Level an.",
    names: {
      A1: "A1 · Anfänger",
      A2: "A2 · Grundlagen",
      B1: "B1 · Mittelstufe",
      B2: "B2 · Fortgeschritten",
      C1: "C1 · Kompetent",
    },
    descs: {
      A1: "Erste Wörter & Sätze",
      A2: "Alltagssprache",
      B1: "Selbstständig sprechen",
      B2: "Fließend & sicher",
      C1: "Nahezu muttersprachlich",
    },
  },
  stats: { xp: "XP", words: "Wörter", streak: "Streak" },
  vocab: {
    sub: (n) => `${n} gespeichert · offline verfügbar`,
    empty: "Noch keine Wörter gespeichert.\nTippe in einer Antwort ein Wort an!",
    delete: "Löschen",
  },
  game: {
    bannerTitle: (t) => `Finde alle „${t}"`,
    bannerSub: (n) => `${n} übrig · tippe sie an`,
    wrong: (t) => `Das ist kein „${t}"`,
    win: "Geschafft! +15 XP",
    sheetTitle: "Mini-Spiele",
    sheetSub: "Spiele mit den lebenden Buchstaben.",
    soon: "Bald",
    titles: {
      find: "Finde den Buchstaben",
      build: "Baue das Wort",
      race: "Wort-Rennen",
      missing: "Fehlender Buchstabe",
    },
    descs: {
      find: "Fange alle passenden Buchstaben",
      build: "Buchstaben sammeln, um ein Wort zu bauen",
      race: "Buchstaben treten im Wettlauf an",
      missing: "Die Lücke füllen: Sch__le",
    },
    buildHint: "Gesuchtes Wort bedeutet:",
    buildBanner: "Baue das Wort",
    buildHintBtn: "Hinweis",
    buildNext: "Nächstes Wort",
    buildStop: "Spiel beenden",
    built: (w, m) => `„${w}" heißt ${m} · +20 XP`,
    notWord: (a) => `„${a}" ist kein Wort — versuch's nochmal`,
    raceTarget: (w) => `Buchstaben von \u201e${w}\u201c fliehen \u2014 tippe der Reihe nach!`,
    raceTap: (ch) => `\u201e${ch}\u201c richtig \u2014 weiter!`,
    raceWrong: "Falsch \u2014 nochmal von vorne",
    raceWin: "Super! Rennen gewonnen \u00b7 +20 XP",
    missingPrompt: (word) => `Welcher Buchstabe fehlt? ${word}`,
    missingWrong: "Nein, falsch!",
    missingWin: "Richtig! \u00b7 +15 XP",
  },
  tools: {
    label: "Werkzeug",
    normal: "Normal",
    lollipop: "Lutscher",
    smelly: "Stinkender Stock",
    lollipopHint: "Buchstaben folgen dem Lutscher",
    smellyHint: "Buchstaben fliehen vor dem Stock",
  },
  word: {
    analyzing: "wird analysiert…",
    thinking: "Die Buchstaben schlagen nach…",
    article: "Artikel",
    plural: "Plural",
    meaning: "Bedeutung",
    conjugation: "Konjugation",
    forms: "Steigerung",
    example: "Beispiel",
    listen: "Hören",
    save: "Speichern",
    saved: "Gespeichert",
    pos: {
      noun: "Nomen",
      verb: "Verb",
      adjective: "Adjektiv",
      adverb: "Adverb",
      other: "Wort",
    },
    offlineMeaning: "Übersetzung braucht Internet — speichere es für später.",
  },
  settingsBtn: "Einstellungen",
  settings: {
    title: "Eigener KI-Schlüssel",
    sub: "Wenn die Seite noch keinen kostenlosen Schlüssel hat, kannst du deinen eigenen hinterlegen.",
    provider: "Anbieter",
    apiKey: "API-Schlüssel",
    apiKeyPlaceholder: "sk-...",
    model: "Modell (optional)",
    modelPlaceholder: "Standard funktioniert",
    modelHint: "Frei lassen, wenn du nicht weißt, was rein soll.",
    baseUrl: "Serveradresse (API Base URL)",
    baseUrlPlaceholder: "https://api.example.com/v1",
    baseUrlHint: "Muss mit https:// beginnen, meist Adresse + /v1.",
    customHint:
      "Für jeden OpenAI-kompatiblen Server: URL, Modell und Schlüssel eingeben.",
    customExamples:
      "Groq: https://api.groq.com/openai/v1 · llama-3.3-70b-versatile\nOpenRouter: https://openrouter.ai/api/v1 · google/gemini-2.0-flash-exp:free\nAtria: https://api.atlantic.ac · atria-1\nDeepSeek: https://api.deepseek.com · deepseek-chat",
    apiFormat: "API-Format",
    formatOpenai: "OpenAI (Standard)",
    formatAnthropic: "Anthropic (Atria)",
    formatHint: "Im Zweifel OpenAI wählen. Atria verwendet Anthropic.",
    save: "Speichern",
    clear: "Schlüssel löschen",
    saved: "Schlüssel gespeichert",
    cleared: "Schlüssel gelöscht",
    active: "aktiv",
    inactive: "ohne eigenen Schlüssel",
    guideTitle: "So bekommst du einen kostenlosen DeepSeek-Schlüssel",
    guideGroq: [
      { step: "Gehe zu console.groq.com und melde dich mit Google an." },
      { step: "Öffne links „API Keys“." },
      { step: "Klicke „Create API Key“, gib einen Namen ein, dann „Create“." },
      { step: "Kopiere den Schlüssel (beginnt mit gsk_)." },
      { step: "Wähle Groq im Spiel, füge den Schlüssel ein und speichere." },
    ],
    guideAtria: [
      { step: "Gehe zu atria-asi.ai und registriere dich." },
      { step: "Erstelle im Panel einen API-Schlüssel (beginnt mit atr_)." },
      { step: "Kopiere den Schlüssel." },
      { step: "Wähle Atria, füge den Schlüssel ein und teste." },
    ],
    guide: [
      { step: "Gehe zu platform.deepseek.com und melde dich an." },
      { step: "Öffne links „API Keys“." },
      { step: "Klicke auf „Create API Key“." },
      { step: "Kopiere den Schlüssel (er wird nur einmal angezeigt)." },
      { step: "Füge ihn hier ein und speichere. Fertig!" },
    ],
    privacy:
      "Der Schlüssel bleibt nur in diesem Browser und wird nur für Anfragen dieses Spiels verwendet.",
    free: "DeepSeek gibt neuen Konten Guthaben und ist sehr günstig.",
    groqFree: "Groq ist kostenlos: 30 Anfragen/Minute, 14.400/Tag. Zum Lernen ausreichend.",
    test: "Schlüssel testen",
    testing: "Test läuft…",
    testOk: (m) => `Schlüssel funktioniert ✓ (${m})`,
    testFail: "Schlüssel funktioniert nicht:",
    keyTooShort: "Schlüssel zu kurz — echte Schlüssel beginnen mit sk-.",
    learnMore: "Schlüssel erstellen auf platform.deepseek.com",
  },
  toast: {
    error: "Etwas ist schiefgelaufen.",
    tooMany: "Zu schnell! Bitte warte einen Moment.",
    offline: "Ich bin offline, aber die Buchstaben leben weiter.",
    saved: "Wort gespeichert! +5 XP",
    levelChosen: (l) => `Niveau ${l} gewählt`,
    win: "Geschafft! +15 XP",
    audio: "Audio nicht verfügbar",
    signedIn: "Fortschritt gesichert",
  },
  hint: "Tippe ein Wort an, um es zu lernen & zu speichern",
  thinking: "Die Buchstaben denken nach…",
  offlineTag: "Offline-Antwort",
  aiTag: "Zusammengesetzt von den Buchstaben",
  cacheTag: "Zusammengesetzt von den Buchstaben",
};

export const STRINGS: Record<UiLang, Dict> = { fa, de };

export function t(lang: UiLang): Dict {
  return STRINGS[lang] ?? fa;
}
