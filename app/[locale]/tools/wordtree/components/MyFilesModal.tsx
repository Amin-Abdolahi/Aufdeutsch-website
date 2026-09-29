"use client";

/**
 * MyFilesModal — مدیریت فایل‌های کلمات (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. این مودال، فایل‌های ایمپورت‌شده‌ی کاربر رو نشون می‌ده.
 * ۲. هر فایل شامل: اسم، تعداد کلمات، تاریخ ساخت، وضعیت اتصال به درخت‌ها.
 * ۳. کاربر می‌تونه فایل‌ها رو حذف کنه:
 *    - اگه فایل به درخت وصل باشه، میوه‌های مرتبط هم حذف می‌شن.
 *    - کلماتی که توی درخت‌های دیگه هم هستن، از فایل حذف می‌شن ولی از state.words پاک نمی‌شن.
 */

import { useState, useMemo } from "react";
import { WordFile } from "@/lib/wordtree/types";
import { WordEntry } from "@/lib/wordtree/types";

interface MyFilesModalProps {
  files: WordFile[];
  customWords: WordEntry[];
  attachedWordIds: string[];
  onClose: () => void;
  onDeleteFile: (fileId: string, attachedWordIds: string[]) => void;
  labels: {
    title: string;
    subtitle: string;
    empty: string;
    wordsCount: string;
    attached: string;
    notAttached: string;
    delete: string;
    deleteConfirm: string;
    close: string;
    importing: string;
  };
}

export function MyFilesModal({
  files,
  customWords,
  attachedWordIds,
  onClose,
  onDeleteFile,
  labels,
}: MyFilesModalProps) {
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null);

  const attachedSet = useMemo(
    () => new Set(attachedWordIds),
    [attachedWordIds]
  );

  // ─── کلمات هر فایل (برای شمارش و نمایش) ───
  const fileWordMap = useMemo(() => {
    const map = new Map<string, WordEntry[]>();
    for (const word of customWords) {
      const fileId = word.fileId || "unfiled";
      const existing = map.get(fileId);
      if (existing) {
        existing.push(word);
      } else {
        map.set(fileId, [word]);
      }
    }
    return map;
  }, [customWords]);

  const handleDelete = (fileId: string) => {
    const attached = (fileWordMap.get(fileId) || [])
      .filter((w) => attachedSet.has(w.id))
      .map((w) => w.id);
    onDeleteFile(fileId, attached);
    setDeletingFileId(null);
  };

  return (
    <div className="fixed inset-0 bg-navy-900/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-paper-100 p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden animate-panel-in border border-gold-300/30 flex flex-col">
        {/* ─── هدر ─── */}
        <div className="mb-4 text-center flex-shrink-0">
          <h2 className="text-xl font-bold text-navy-900 font-mono mb-1">
            📁 {labels.title}
          </h2>
          <p className="text-xs text-navy-900/60">
            {labels.subtitle.replace("{count}", files.length.toString())}
          </p>
        </div>

        {/* ─── لیست فایل‌ها ─── */}
        <div className="flex-1 overflow-y-auto bg-white rounded-sm border border-navy-900/10 mb-4">
          {files.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-3 opacity-40">📭</div>
              <p className="text-sm text-navy-900/60">{labels.empty}</p>
            </div>
          ) : (
            <div className="divide-y divide-navy-900/5">
              {files.map((file) => {
                const isDeleting = deletingFileId === file.id;
                const fileWords = fileWordMap.get(file.id) || [];
                const attachedCount = fileWords.filter((w) =>
                  attachedSet.has(w.id)
                ).length;
                const isAttached = attachedCount > 0;

                return (
                  <div
                    key={file.id}
                    className="p-3 flex items-center gap-3"
                  >
                    <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-gold-100 to-gold-200 flex items-center justify-center text-lg">
                      📄
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-navy-900 text-sm truncate">
                        {file.name}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-navy-900/50 font-mono">
                          {labels.wordsCount.replace(
                            "{count}",
                            file.wordCount.toString()
                          )}
                        </span>
                        <span
                          className={`inline-block text-[9px] px-2 py-0.5 rounded-full border ${
                            isAttached
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-navy-900/5 text-navy-900/40 border-navy-900/10"
                          }`}
                        >
                          {isAttached
                            ? labels.attached.replace(
                                "{count}",
                                attachedCount.toString()
                              )
                            : labels.notAttached}
                        </span>
                      </div>
                    </div>

                    {isDeleting ? (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button
                          onClick={() => handleDelete(file.id)}
                          className="px-2 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-sm transition"
                        >
                          ✓ {labels.deleteConfirm}
                        </button>
                        <button
                          onClick={() => setDeletingFileId(null)}
                          className="px-2 py-1.5 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 text-[10px] font-bold rounded-sm transition"
                        >
                          ✗
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingFileId(file.id)}
                        className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-full text-red-500 hover:bg-red-50 transition text-sm"
                        title={labels.delete}
                      >
                        🗑
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ─── دکمه‌ی بستن ─── */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 font-bold rounded-sm transition text-sm flex-shrink-0"
        >
          {labels.close}
        </button>
      </div>
    </div>
  );
}
