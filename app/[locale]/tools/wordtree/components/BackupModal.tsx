"use client";

/**
 * BackupModal — مودال بک‌آپ کلمات سفارشی (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. دو بخش داره:
 *    - خروجی گرفتن (دانلود فایل JSON)
 *    - وارد کردن (آپلود فایل JSON)
 * ۲. برای فاز ۲ (Supabase)، این مودال می‌تونه جایگزین بشه.
 * ۳. برای اضافه کردن بک‌آپ از کلمات یادگرفته‌شده (نه فقط سفارشی)،
 *    می‌تونیم `exportGameState` رو هم اضافه کنیم.
 */

import { useState, useRef } from "react";
import {
  exportCustomWords,
  importCustomWords,
  downloadJSON,
  loadCustomWords,
} from "@/lib/wordtree/customWords";
import { Button } from "@/components/ui/Button";

interface BackupModalProps {
  onClose: () => void;
  onImportSuccess?: () => void;
  labels: {
    title: string;
    subtitle: string;
    // خروجی
    exportTitle: string;
    exportDesc: string;
    exportButton: string;
    exportSuccess: string;
    exportEmpty: string;
    // وارد کردن
    importTitle: string;
    importDesc: string;
    importButton: string;
    importSuccess: string;
    importError: string;
    importResult: string;
    importInvalidFile: string;
    // عمومی
    close: string;
    wordsCount: string;
    dragHere: string;
    orClick: string;
  };
}

export function BackupModal({
  onClose,
  onImportSuccess,
  labels,
}: BackupModalProps) {
  const [importResult, setImportResult] = useState<{
    imported: number;
    rejected: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ─── تعداد کلمات فعلی ───
  const wordCount = loadCustomWords().length;

  // ─── خروجی گرفتن ───
  const handleExport = () => {
    if (wordCount === 0) {
      setError(labels.exportEmpty);
      return;
    }

    const backup = exportCustomWords();
    const date = new Date().toISOString().split("T")[0];
    downloadJSON(backup, `wordtree-backup-${date}.json`);

    setError(null);
    setImportResult(null);
  };

  // ─── وارد کردن ───
  const handleFile = async (file: File) => {
    if (!file.name.endsWith(".json")) {
      setError(labels.importInvalidFile);
      return;
    }

    try {
      const content = await file.text();
      const result = importCustomWords(content);

      if (!result.success) {
        setError(result.error || labels.importError);
        return;
      }

      setImportResult({
        imported: result.imported,
        rejected: result.rejected,
      });
      setError(null);

      // ─── اگه کلمه‌ای اضافه شد، callback رو صدا بزن ───
      if (result.imported > 0 && onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      setError(labels.importError);
    }
  };

  // ─── Drag & Drop ───
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

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-panel-in border border-gold-300/30">
        {/* ─── هدر ─── */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            💾 {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">{labels.subtitle}</p>
          <p className="text-sm text-navy-900/50 font-mono mt-2">
            {labels.wordsCount.replace("{count}", wordCount.toString())}
          </p>
        </div>

        {/* ─── خروجی گرفتن ─── */}
        <div className="bg-white p-4 rounded-sm border border-navy-900/10 mb-4">
          <h3 className="text-sm font-bold text-navy-900 mb-2 flex items-center gap-2">
            <span>📤</span>
            <span>{labels.exportTitle}</span>
          </h3>
          <p className="text-xs text-navy-900/60 mb-3">{labels.exportDesc}</p>
          <button
            onClick={handleExport}
            disabled={wordCount === 0}
            className="w-full py-3 bg-gold-300 hover:bg-gold-500 disabled:opacity-50 disabled:cursor-not-allowed text-navy-900 font-bold rounded-sm transition text-sm border border-gold-500/40"
          >
            {labels.exportButton}
          </button>
        </div>

        {/* ─── وارد کردن ─── */}
        <div className="bg-white p-4 rounded-sm border border-navy-900/10 mb-4">
          <h3 className="text-sm font-bold text-navy-900 mb-2 flex items-center gap-2">
            <span>📥</span>
            <span>{labels.importTitle}</span>
          </h3>
          <p className="text-xs text-navy-900/60 mb-3">{labels.importDesc}</p>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${
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
            <p className="text-3xl mb-2">📁</p>
            <p className="text-xs font-bold text-navy-900 mb-1">
              {labels.dragHere}
            </p>
            <p className="text-[10px] text-navy-900/60">{labels.orClick}</p>
          </div>
        </div>

        {/* ─── نتیجه‌ی وارد کردن ─── */}
        {importResult && (
          <div className="bg-green-50 border border-green-300 rounded-sm p-3 mb-4 animate-panel-in">
            <p className="text-xs font-bold text-green-700 mb-1">
              ✓ {labels.importSuccess}
            </p>
            <p className="text-xs text-green-600">
              {labels.importResult
                .replace("{imported}", importResult.imported.toString())
                .replace("{rejected}", importResult.rejected.toString())}
            </p>
          </div>
        )}

        {/* ─── خطا ─── */}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-3 rounded-sm mb-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* ─── دکمه‌ی بستن ─── */}
        <Button variant="primary" size="md" onClick={onClose}>
          {labels.close}
        </Button>
      </div>
    </div>
  );
}