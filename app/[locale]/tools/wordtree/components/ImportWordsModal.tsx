"use client";

/**
 * ImportWordsModal — مودال ایمپورت گروهی (نسخه ۲.۰ — با راهنما)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. کاربر فایل JSON رو انتخاب می‌کنه (drag & drop یا file picker).
 * ۲. ما فایل رو تجزیه می‌کنیم و نتیجه رو نشون می‌دیم.
 * ۳. راهنمای ۳ مرحله‌ای توی خود پنجره.
 * ۴. دکمه‌ی «راهنمای کامل» → پنل راهنمای تفصیلی.
 */

import { useState, useRef } from "react";
import { ImportResult } from "@/lib/wordtree/types";
import { Button } from "@/components/ui/Button";

interface ImportWordsModalProps {
  onClose: () => void;
  onImport: (fileContent: string) => ImportResult;
  labels: {
    title: string;
    subtitle: string;
    dropzone: string;
    dropzoneActive: string;
    selectFile: string;
    downloadPrompt: string;
    downloadTemplate: string;
    importing: string;
    resultTitle: string;
    totalLabel: string;
    importedLabel: string;
    rejectedLabel: string;
    coinsLabel: string;
    errorsTitle: string;
    close: string;
    invalidFile: string;
    // ─── جدید ───
    guideTitle: string;
    guideStep1: string;
    guideStep2: string;
    guideStep3: string;
    guideFull: string;
    guideFullTitle: string;
    guideFullContent: string;
    guideBack: string;
  };
  promptUrl: string;
  templateUrl: string;
}

export function ImportWordsModal({
  onClose,
  onImport,
  labels,
  promptUrl,
  templateUrl,
}: ImportWordsModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".json")) {
      setError(labels.invalidFile);
      return;
    }

    setIsImporting(true);
    setError(null);
    setResult(null);

    try {
      const content = await file.text();
      const importResult = onImport(content);
      setResult(importResult);
    } catch (err) {
      setError("خطا در خواندن فایل");
    } finally {
      setIsImporting(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  // ─── پنل راهنمای کامل ───
  if (showGuide) {
    return (
      <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
        <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
              📚 {labels.guideFullTitle}
            </h2>
          </div>

          <div className="space-y-3 text-sm text-navy-900/80 leading-relaxed">
            {labels.guideFullContent.split("\n").map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          <button
            onClick={() => setShowGuide(false)}
            className="w-full py-3 bg-navy-900 hover:bg-navy-800 text-paper-100 font-bold rounded-sm transition mt-6"
          >
            {labels.guideBack}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
        {/* هدر */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            📥 {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">{labels.subtitle}</p>
        </div>

        {/* نتیجه‌ی ایمپورت */}
        {result ? (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-navy-900 text-center">
              {labels.resultTitle}
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3 rounded-sm border border-navy-900/10">
                <p className="text-xs text-navy-900/60">{labels.totalLabel}</p>
                <p className="text-2xl font-bold text-navy-900">
                  {result.total}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-sm border border-green-200">
                <p className="text-xs text-green-700">{labels.importedLabel}</p>
                <p className="text-2xl font-bold text-green-700">
                  {result.imported}
                </p>
              </div>
              <div className="bg-red-50 p-3 rounded-sm border border-red-200">
                <p className="text-xs text-red-700">{labels.rejectedLabel}</p>
                <p className="text-2xl font-bold text-red-700">
                  {result.rejected}
                </p>
              </div>
              <div className="bg-gold-300/30 p-3 rounded-sm border border-gold-500/40">
                <p className="text-xs text-navy-900/60">{labels.coinsLabel}</p>
                <p className="text-2xl font-bold text-navy-900">
                  +{result.coinsEarned}
                </p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm max-h-40 overflow-y-auto">
                <p className="text-xs font-bold text-red-700 mb-2">
                  {labels.errorsTitle}
                </p>
                <ul className="text-xs text-red-700 space-y-1">
                  {result.errors.map((err, i) => (
                    <li key={i}>• {err}</li>
                  ))}
                </ul>
              </div>
            )}

            <Button variant="primary" size="md" onClick={onClose}>
              {labels.close}
            </Button>
          </div>
        ) : (
          <>
            {/* ─── راهنمای ۳ مرحله‌ای ─── */}
            <div className="bg-navy-900/5 border border-navy-900/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-navy-900">
                  💡 {labels.guideTitle}
                </h3>
                <button
                  onClick={() => setShowGuide(true)}
                  className="text-xs text-gold-500 hover:text-gold-600 font-bold underline"
                >
                  {labels.guideFull}
                </button>
              </div>
              <ol className="space-y-2 text-xs text-navy-900/80">
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-gold-300 rounded-full flex items-center justify-center font-bold text-navy-900 text-[10px]">
                    ۱
                  </span>
                  <span>{labels.guideStep1}</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-gold-300 rounded-full flex items-center justify-center font-bold text-navy-900 text-[10px]">
                    ۲
                  </span>
                  <span>{labels.guideStep2}</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex-shrink-0 w-5 h-5 bg-gold-300 rounded-full flex items-center justify-center font-bold text-navy-900 text-[10px]">
                    ۳
                  </span>
                  <span>{labels.guideStep3}</span>
                </li>
              </ol>
            </div>

            {/* Dropzone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? "border-gold-500 bg-gold-300/20 scale-105"
                  : "border-navy-900/30 hover:border-gold-500 hover:bg-gold-300/10"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileSelect}
                className="hidden"
              />
              <p className="text-4xl mb-3">📁</p>
              <p className="text-navy-900 font-bold mb-1">
                {isDragging ? labels.dropzoneActive : labels.dropzone}
              </p>
              <p className="text-sm text-navy-900/60">{labels.selectFile}</p>
            </div>

            {/* دکمه‌های دانلود */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <a
                href={promptUrl}
                download
                className="py-2 px-3 bg-gold-300 hover:bg-gold-500 text-navy-900 font-bold rounded-sm transition text-center text-sm"
              >
                📝 {labels.downloadPrompt}
              </a>
              <a
                href={templateUrl}
                download
                className="py-2 px-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition text-center text-sm"
              >
                📄 {labels.downloadTemplate}
              </a>
            </div>

            {error && (
              <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm mt-4">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            {isImporting && (
              <p className="text-center text-navy-900/60 mt-4">
                {labels.importing}
              </p>
            )}

            <button
              onClick={onClose}
              className="w-full py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition mt-4"
            >
              {labels.close}
            </button>
          </>
        )}
      </div>
    </div>
  );
}