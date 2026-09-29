"use client";

/**
 * PromptBuilder — ساخت پرامپت شخصی‌سازیشده (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. کاربر فرم رو پر می‌کنه: تعداد کلمات، حوزه (مثلاً فرودگاه)،
 *    سطح زبان، و زبان ترجمه.
 * ۲. یه پرامپت کامل و قابل‌کپی ساخته می‌شه که کاربر می‌تونه
 *    به ChatGPT/Claude/Gemini بده.
 * ۳. پرامپت نهایی توی یه textarea نشون داده می‌شه که کاربر
 *    می‌تونه ویرایشش کنه.
 */

import { useState, useMemo } from "react";

interface PromptBuilderProps {
  labels: {
    title: string;
    subtitle: string;
    countLabel: string;
    topicLabel: string;
    topicPlaceholder: string;
    levelLabel: string;
    translationLabel: string;
    extraLabel: string;
    extraPlaceholder: string;
    previewLabel: string;
    copyButton: string;
    copied: string;
    useButton: string;
    topicSuggestions: { label: string; value: string }[];
    levels: { label: string; value: string }[];
    translationLanguages: { label: string; value: string }[];
  };
  onUse?: (promptText: string) => void;
}

export function PromptBuilder({ labels, onUse }: PromptBuilderProps) {
  const [count, setCount] = useState(50);
  const [topic, setTopic] = useState("");
  const [level, setLevel] = useState("A1");
  const [translationLang, setTranslationLang] = useState("fa");
  const [extra, setExtra] = useState("");
  const [customPrompt, setCustomPrompt] = useState("");
  const [editedManually, setEditedManually] = useState(false);
  const [copied, setCopied] = useState(false);

  // ─── ساخت پرامپت ───
  const generatedPrompt = useMemo(() => {
    return buildPrompt({
      count,
      topic: topic.trim(),
      level,
      translationLang,
      extra: extra.trim(),
    });
  }, [count, topic, level, translationLang, extra]);

  // ⚠️ مقدار نمایش‌داده‌شده: اگه کاربر دستی ویرایش نکرده،
  // همیشه پرامپت ساخته‌شده رو نشون بده (بدون نیاز به effect).
  const displayPrompt = editedManually ? customPrompt : generatedPrompt;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback برای مرورگرهایی که clipboard API ندارن
      const textarea = document.createElement("textarea");
      textarea.value = displayPrompt;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-bold text-navy-900 font-mono mb-1">
          ✨ {labels.title}
        </h3>
        <p className="text-xs text-navy-900/60">{labels.subtitle}</p>
      </div>

      {/* ─── تعداد کلمات ─── */}
      <div>
        <label className="block text-sm font-bold text-navy-900/70 mb-2">
          {labels.countLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          {[10, 25, 50, 100, 110, 150, 200].map((n) => (
            <button
              key={n}
              onClick={() => setCount(n)}
              className={`px-3 py-1.5 rounded-sm text-sm font-mono font-bold transition border-2 ${
                count === n
                  ? "border-gold-500 bg-gold-300/30 text-navy-900"
                  : "border-navy-900/10 bg-white text-navy-900/60 hover:border-gold-400"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* ─── حوزه کلمات ─── */}
      <div>
        <label className="block text-sm font-bold text-navy-900/70 mb-2">
          {labels.topicLabel}
        </label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder={labels.topicPlaceholder}
          className="w-full px-4 py-2.5 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900 text-sm"
        />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {labels.topicSuggestions.map((s) => (
            <button
              key={s.value}
              onClick={() => setTopic(s.value)}
              className="px-2.5 py-1 text-xs bg-navy-900/5 hover:bg-gold-300/30 text-navy-900/70 hover:text-navy-900 rounded-full transition border border-transparent hover:border-gold-400/50"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── سطح و زبان ترجمه ─── */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-bold text-navy-900/70 mb-2">
            {labels.levelLabel}
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2.5 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900 text-sm"
          >
            {labels.levels.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-bold text-navy-900/70 mb-2">
            {labels.translationLabel}
          </label>
          <select
            value={translationLang}
            onChange={(e) => setTranslationLang(e.target.value)}
            className="w-full px-3 py-2.5 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900 text-sm"
          >
            {labels.translationLanguages.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ─── توضیحات اضافی ─── */}
      <div>
        <label className="block text-sm font-bold text-navy-900/70 mb-2">
          {labels.extraLabel}
        </label>
        <textarea
          value={extra}
          onChange={(e) => setExtra(e.target.value)}
          placeholder={labels.extraPlaceholder}
          rows={2}
          className="w-full px-4 py-2.5 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900 text-sm resize-none"
        />
      </div>

      {/* ─── پیش‌نمایش پرامپت ─── */}
      <div>
        <label className="block text-sm font-bold text-navy-900/70 mb-2">
          {labels.previewLabel}
        </label>
        <textarea
          value={displayPrompt}
          onChange={(e) => {
            setCustomPrompt(e.target.value);
            setEditedManually(e.target.value !== generatedPrompt);
          }}
          rows={8}
          className="w-full px-4 py-3 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white font-mono text-xs resize-y"
          dir="ltr"
        />
      </div>

      {/* ─── دکمه‌ها ─── */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCopy}
          className="py-3 bg-gold-300 hover:bg-gold-500 text-navy-900 font-bold rounded-sm transition text-sm border border-gold-500/40"
        >
          {copied ? `✓ ${labels.copied}` : `📋 ${labels.copyButton}`}
        </button>
        {onUse && (
          <button
            onClick={() => onUse(displayPrompt)}
            className="py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition text-sm"
          >
            {labels.useButton}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// ساخت پرامپت
// ─────────────────────────────────────────────────────────────

interface PromptParams {
  count: number;
  topic: string;
  level: string;
  translationLang: string;
  extra: string;
}

const TRANSLATION_NAMES: Record<string, string> = {
  fa: "فارسی",
  en: "انگلیسی",
  de: "آلمانی",
};

/**
 * یه پرامپت کامل و قابل‌کپی می‌سازه.
 *
 * ⚠️ ساختار پرامپت:
 * ۱. معرفی و درخواست اصلی (تعداد + حوزه + سطح)
 * ۲. فرمت JSON مورد انتظار
 * ۳. قوانین
 * ۴. دستورالعمل خروجی
 */
export function buildPrompt(params: PromptParams): string {
  const { count, topic, level, translationLang, extra } = params;
  const translationName = TRANSLATION_NAMES[translationLang] || "فارسی";

  const topicPart = topic
    ? `در حوزه‌ی «${topic}»`
    : "کلمات پرکاربرد و روزمره";

  const extraPart = extra ? `\n\nنکات اضافی از کاربر:\n${extra}` : "";

  return `من می‌خواهم ${count} کلمه‌ی پرکاربرد آلمانی ${topicPart} (سطح ${level}) رو یاد بگیرم.

لطفاً این ${count} کلمه رو به این فرمت JSON تبدیل کن:

{
  "version": "1.0",
  "language": "de",
  "words": [
    {
      "de": "کلمه آلمانی با حرف تعریف",
      "fa": "ترجمه فارسی",
      "en": "ترجمه انگلیسی",
      "category": "noun | verb | adjective | phrase | number | color",
      "level": "${level}",
      "noun": {
        "article": "der | die | das",
        "plural": "حالت جمع"
      },
      "verb": {
        "praeteritum": "گذشته ساده",
        "perfekt": "گذشته کامل",
        "auxiliary": "haben | sein"
      },
      "pronunciation": {
        "persian": "تلفظ فارسی‌نویسی"
      },
      "example": {
        "de": "جمله آلمانی",
        "translations": {
          "fa": "ترجمه فارسی",
          "en": "ترجمه انگلیسی"
        }
      }
    }
  ]
}

قوانین:
- ترجمه‌ها به ${translationName} باشن.
- فقط فیلدهای مربوط به نوع کلمه رو وارد کن (مثلاً noun فقط برای اسم).
- اگه کلمه اسم بود، article و plural اجباری.
- اگه کلمه فعل بود، praeteritum و perfekt و auxiliary اجباری.
- تلفظ فارسی‌نویسی رو دقیق بنویس.
- مثال‌ها باید ساده و روزمره باشن.
- سطح همه‌ی کلمات ${level} باشه (یا نزدیک به اون).
- کلمات تکراری نباشن.${extraPart}

⚠️ مهم: خروجی رو **داخل یک code block** بذار (با سه تا بک‌تیک \`json شروع کن و با سه تا بک‌تیک تموم کن).
اینطوری من می‌تونم کد رو کپی کنم و توی بازی paste کنم.`;
}
