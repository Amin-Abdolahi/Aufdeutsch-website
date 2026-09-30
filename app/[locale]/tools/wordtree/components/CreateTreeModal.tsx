"use client";

/**
 * CreateTreeModal — مودال ساخت درخت (نسخه ۳.۰)
 *
 * ⚠️ تغییرات نسخه ۳.۰:
 * - شکل درخت با SVG واقعی نمایش داده می‌شه (TreeIcon)
 * - مرحله‌ی انتخاب تک‌تک کلمات حذف شد — به جاش:
 *   ۱. آپلود/ایمپورت فایل کلمات
 *   ۲. ساخت درخت خالی (بدون کلمه — بعداً اضافه می‌شه)
 * - استخر اولیه می‌تونه از قبل پر شده باشه (کلمات پیش‌فرض یا فایل ایمپورت‌شده)
 */

import { useState } from "react";
import { TreeVariant, TreeColor, ImportResult } from "@/lib/wordtree/types";
import { Button } from "@/components/ui/Button";
import {
  TREE_COLORS,
  TREE_COLOR_IDS,
  TREE_VARIANTS,
} from "@/lib/wordtree/constants";
import { TreeIcon } from "./Tree";
import { ImportWordsModal } from "./ImportWordsModal";
import { getImportWordsLabels } from "./importWordsLabels";

interface CreateTreeModalProps {
  onClose: () => void;
  onCreate: (
    name: string,
    variant: TreeVariant,
    wordIds: string[],
    color?: TreeColor
  ) => { success: boolean; error?: string };
  /** استخر اولیه (مثلاً ۵۰ کلمه‌ی پیش‌فرض یا کلمات فایل ایمپورت‌شده) */
  initialPoolWordIds?: string[];
  initialName?: string;
  /** ایمپورت گروهی — اگه نباشه، دکمه‌ی آپلود فایل نمایش داده نمی‌شه */
  onImportWords?: (content: string, fileName?: string) => ImportResult;
  labels: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    variantLabel: string;
    next: string;
    create: string;
    cancel: string;
    back: string;
    errorRequired: string;
    variantOak: string;
    variantPine: string;
    variantPalm: string;
    variantBlossom: string;
    variantApple: string;
    variantLemon: string;
    colorLabel: string;
    treeColorGreen: string;
    treeColorAutumn: string;
    treeColorPink: string;
    treeColorBlue: string;
    treeColorPurple: string;
    treeColorGold: string;
    // ─── مرحله‌ی کلمات ───
    wordsTitle: string;
    wordsSubtitle: string;
    poolCount: string;
    uploadFile: string;
    uploadFileDesc: string;
    createEmpty: string;
    createEmptyDesc: string;
    addMoreWords: string;
    emptyPoolHint: string;
    importLabels: any;
  };
  promptUrl?: string;
  templateUrl?: string;
}

type Step = "info" | "words";

export function CreateTreeModal({
  onClose,
  onCreate,
  initialPoolWordIds = [],
  initialName = "",
  onImportWords,
  labels,
  promptUrl = "/wordtree/wordtree-prompt.txt",
  templateUrl = "/wordtree/wordtree-template.json",
}: CreateTreeModalProps) {
  const [step, setStep] = useState<Step>("info");
  const [name, setName] = useState(initialName);
  const [variant, setVariant] = useState<TreeVariant>("oak");
  const [color, setColor] = useState<TreeColor>("green");
  const [poolWordIds, setPoolWordIds] = useState<string[]>(initialPoolWordIds);
  const [showImportModal, setShowImportModal] = useState(false);
  const [error, setError] = useState("");

  // ─── رفتن به مرحله‌ی بعد ───
  const handleNext = () => {
    if (!name.trim()) {
      setError(labels.errorRequired);
      return;
    }
    setError("");
    setStep("words");
  };

  // ─── ساخت درخت ───
  const handleCreate = () => {
    if (!name.trim()) {
      setError(labels.errorRequired);
      setStep("info");
      return;
    }

    // ⚠️ استخر می‌تونه خالی باشه — هیچ کلمه‌ی پیش‌فرضی اضافه نمی‌شه
    const result = onCreate(name.trim(), variant, poolWordIds, color);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || "خطا در ساخت درخت");
    }
  };

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-panel-in border border-gold-300/30 flex flex-col">
        {/* ─── مرحله ۱: اطلاعات (اسم + شکل + رنگ) ─── */}
        {step === "info" && (
          <>
            <div className="mb-5 text-center flex-shrink-0">
              <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
                {labels.title}
              </h2>
              <p className="text-xs text-navy-900/60">{labels.subtitle}</p>
            </div>

            {/* ─── پیش‌نمایش زنده‌ی درخت ─── */}
            <div className="flex justify-center mb-4 flex-shrink-0">
              <div className="bg-gradient-to-b from-sky-100 to-emerald-50 rounded-xl p-2 border border-navy-900/10">
                <TreeIcon variant={variant} color={color} className="w-24 h-28" />
              </div>
            </div>

            {/* ─── اسم درخت ─── */}
            <div className="mb-4 flex-shrink-0">
              <label className="block text-sm font-bold text-navy-900/70 mb-2">
                {labels.nameLabel}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError("");
                }}
                placeholder={labels.namePlaceholder}
                className="w-full px-4 py-3 border border-navy-900/20 rounded-sm focus:outline-none focus:border-gold-500 bg-white text-navy-900"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleNext();
                }}
              />
            </div>

            {/* ─── انتخاب شکل درخت ─── */}
            <div className="mb-4 flex-shrink-0">
              <label className="block text-sm font-bold text-navy-900/70 mb-2">
                {labels.variantLabel}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {TREE_VARIANTS.map((v) => {
                  const isSelected = variant === v.id;
                  const nameKey = v.nameKey as keyof typeof labels;
                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setVariant(v.id as TreeVariant)}
                      className={`p-2 rounded-lg border-2 transition-all flex flex-col items-center ${
                        isSelected
                          ? "border-gold-500 bg-gold-300/30 scale-105"
                          : "border-navy-900/10 bg-white hover:border-gold-400"
                      }`}
                    >
                      <TreeIcon
                        variant={v.id as TreeVariant}
                        color={color}
                        className="w-12 h-14"
                      />
                      <div className="text-[9px] text-navy-900/70 font-mono truncate">
                        {(labels as any)[nameKey]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ─── انتخاب رنگ درخت ─── */}
            <div className="mb-4 flex-shrink-0">
              <label className="block text-sm font-bold text-navy-900/70 mb-2">
                {labels.colorLabel}
              </label>
              <div className="flex gap-2 justify-between">
                {TREE_COLOR_IDS.map((colorId) => {
                  const c = TREE_COLORS[colorId];
                  const isSelected = color === colorId;
                  const nameKey = c.nameKey as keyof typeof labels;
                  return (
                    <button
                      key={colorId}
                      type="button"
                      onClick={() => setColor(colorId as TreeColor)}
                      className={`flex-1 py-2 rounded-lg border-2 transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? "border-gold-500 scale-105"
                          : "border-navy-900/10 bg-white hover:border-gold-400"
                      }`}
                      title={labels[nameKey]}
                    >
                      <div
                        className="w-7 h-7 rounded-full"
                        style={{
                          background: `linear-gradient(135deg, ${c.light}, ${c.main})`,
                          boxShadow: isSelected
                            ? `0 2px 6px ${c.dark}50`
                            : "none",
                        }}
                      />
                      <div className="text-[9px] text-navy-900/70 font-mono truncate w-full text-center">
                        {labels[nameKey]}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm mb-4 flex-shrink-0">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <button
                onClick={onClose}
                className="py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition"
              >
                {labels.cancel}
              </button>
              <Button variant="primary" size="md" onClick={handleNext}>
                {labels.next}
              </Button>
            </div>
          </>
        )}

        {/* ─── مرحله ۲: کلمات (آپلود فایل یا خالی) ─── */}
        {step === "words" && (
          <>
            <div className="mb-4 text-center flex-shrink-0">
              <h2 className="text-lg font-bold text-navy-900 font-mono mb-1">
                📚 {labels.wordsTitle}
              </h2>
              <p className="text-xs text-navy-900/60">{labels.wordsSubtitle}</p>
            </div>

            {/* ─── وضعیت استخر فعلی ─── */}
            <div className="mb-4 p-3 bg-white rounded-sm border border-navy-900/10 flex-shrink-0">
              <p className="text-sm font-bold text-navy-900 font-mono">
                {labels.poolCount.replace(
                  "{count}",
                  poolWordIds.length.toString()
                )}
              </p>
              {poolWordIds.length === 0 && (
                <p className="text-[10px] text-navy-900/50 mt-1">
                  {labels.emptyPoolHint}
                </p>
              )}
            </div>

            {/* ─── گزینه‌ها ─── */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {/* آپلود فایل کلمات */}
              {onImportWords && (
                <button
                  onClick={() => setShowImportModal(true)}
                  className="w-full p-4 text-right bg-white hover:bg-gold-300/20 border-2 border-navy-900/10 hover:border-gold-400 rounded-lg transition group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 flex-shrink-0 rounded-lg bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center text-xl">
                      📥
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-navy-900 text-sm">
                        {labels.uploadFile}
                      </p>
                      <p className="text-[10px] text-navy-900/50 mt-0.5">
                        {labels.uploadFileDesc}
                      </p>
                    </div>
                    {poolWordIds.length > 0 && (
                      <span className="text-[10px] text-gold-600 font-bold flex-shrink-0">
                        {labels.addMoreWords}
                      </span>
                    )}
                  </div>
                </button>
              )}

              {/* ساخت بدون کلمه */}
              <button
                onClick={() => setPoolWordIds([])}
                className={`w-full p-4 text-right border-2 rounded-lg transition ${
                  poolWordIds.length === 0
                    ? "bg-gold-300/20 border-gold-400"
                    : "bg-white hover:bg-navy-900/5 border-navy-900/10 hover:border-gold-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 flex-shrink-0 rounded-lg bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center text-xl">
                    🌱
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-navy-900 text-sm">
                      {labels.createEmpty}
                    </p>
                    <p className="text-[10px] text-navy-900/50 mt-0.5">
                      {labels.createEmptyDesc}
                    </p>
                  </div>
                  {poolWordIds.length === 0 && (
                    <span className="text-emerald-600 font-bold flex-shrink-0">
                      ✓
                    </span>
                  )}
                </div>
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm mb-4 flex-shrink-0">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="flex gap-3 flex-shrink-0">
              <button
                onClick={() => setStep("info")}
                className="py-3 px-4 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition text-sm"
              >
                ← {labels.back}
              </button>
              <Button variant="primary" size="md" onClick={handleCreate} className="flex-1">
                {labels.create}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* ─── مودال ایمپورت (تودرتو) ─── */}
      {showImportModal && onImportWords && (
        <ImportWordsModal
          onClose={() => setShowImportModal(false)}
          onImport={(content, fileName) => {
            const result = onImportWords(content, fileName);
            if (result.imported > 0 && result.importedWordIds) {
              // ⚠️ کلمات جدید به استخر اضافه می‌شن (بدون تکرار)
              setPoolWordIds((prev) => [
                ...prev,
                ...result.importedWordIds!.filter(
                  (id) => !prev.includes(id)
                ),
              ]);
              setShowImportModal(false);
            }
            return result;
          }}
          labels={getImportWordsLabels(labels.importLabels)}
          promptUrl={promptUrl}
          templateUrl={templateUrl}
        />
      )}
    </div>
  );
}
