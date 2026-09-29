"use client";

/**
 * SnapshotModal — مودال مدیریت snapshotها (نسخه ۱.۰)
 *
 * ⚠️ نکته برای توسعه‌دهنده‌های آینده:
 *
 * ۱. لیست snapshotها رو نشون می‌ده.
 * ۲. کاربر می‌تونه به هر snapshot برگرده.
 * ۳. کاربر می‌تونه snapshotها رو پاک کنه.
 * ۴. توی تنظیمات، گزینه‌ی «Snapshotها» باز می‌کنه.
 */

import { useState, useEffect } from "react";
import {
  loadSnapshots,
  restoreSnapshot,
  deleteSnapshot,
  createSnapshot,
  getRelativeTime,
  MAX_SNAPSHOTS,
} from "@/lib/wordtree/snapshot";
import { Snapshot } from "@/lib/wordtree/types";
import { Button } from "@/components/ui/Button";

interface SnapshotModalProps {
  onClose: () => void;
  onRestoreSuccess?: () => void;
  locale: string;
  labels: {
    title: string;
    subtitle: string;
    empty: string;
    createNow: string;
    restore: string;
    delete: string;
    restoreConfirm: string;
    restoreSuccess: string;
    deleteConfirm: string;
    wordsCount: string;
    version: string;
    close: string;
    maxNote: string;
  };
}

export function SnapshotModal({
  onClose,
  onRestoreSuccess,
  locale,
  labels,
}: SnapshotModalProps) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [confirmRestore, setConfirmRestore] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // ─── بارگذاری snapshots ───
  useEffect(() => {
    setSnapshots(loadSnapshots());
  }, []);

  // ─── ساخت snapshot دستی ───
  const handleCreateNow = () => {
    const snapshot = createSnapshot("دستی");
    if (snapshot) {
      const updated = loadSnapshots();
      setSnapshots(updated);
      setSuccessMessage("✓ Snapshot جدید ساخته شد");
      setTimeout(() => setSuccessMessage(null), 2000);
    }
  };

  // ─── بازگردانی ───
  const handleRestore = (id: string) => {
    const success = restoreSnapshot(id);
    if (success) {
      setConfirmRestore(null);
      setSuccessMessage(labels.restoreSuccess);
      setSnapshots(loadSnapshots());
      if (onRestoreSuccess) {
        setTimeout(() => onRestoreSuccess(), 500);
      }
    }
  };

  // ─── پاک کردن ───
  const handleDelete = (id: string) => {
    deleteSnapshot(id);
    setSnapshots(loadSnapshots());
    setConfirmDelete(null);
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
          <p className="text-[10px] text-navy-900/40 mt-1">
            {labels.maxNote.replace("{max}", MAX_SNAPSHOTS.toString())}
          </p>
        </div>

        {/* ─── پیام موفقیت ─── */}
        {successMessage && (
          <div className="bg-green-50 border border-green-300 rounded-sm p-3 mb-4 text-center animate-panel-in">
            <p className="text-sm text-green-700 font-bold">{successMessage}</p>
          </div>
        )}

        {/* ─── دکمه‌ی ساخت snapshot دستی ─── */}
        <button
          onClick={handleCreateNow}
          className="w-full py-2 mb-4 bg-gold-300 hover:bg-gold-500 text-navy-900 font-bold rounded-sm transition text-sm border border-gold-500/40"
        >
          ➕ {labels.createNow}
        </button>

        {/* ─── لیست snapshotها ─── */}
        {snapshots.length === 0 ? (
          <div className="bg-white p-6 rounded-sm border border-navy-900/10 text-center">
            <p className="text-sm text-navy-900/60">{labels.empty}</p>
          </div>
        ) : (
          <div className="space-y-2">
            {snapshots.map((snapshot) => (
              <div
                key={snapshot.id}
                className="bg-white p-3 rounded-sm border border-navy-900/10"
              >
                {/* ─── اطلاعات snapshot ─── */}
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <p className="text-sm font-bold text-navy-900">
                      {snapshot.label}
                    </p>
                    <p className="text-xs text-navy-900/60">
                      {getRelativeTime(snapshot.createdAt, locale)}
                    </p>
                    <p className="text-[10px] text-navy-900/40 font-mono mt-1">
                      {labels.wordsCount.replace(
                        "{count}",
                        snapshot.customWords.length.toString()
                      )}{" "}
                      • {labels.version} {snapshot.version}
                    </p>
                  </div>
                </div>

                {/* ─── دکمه‌ها ─── */}
                <div className="flex gap-2">
                  {confirmRestore === snapshot.id ? (
                    <>
                      <button
                        onClick={() => handleRestore(snapshot.id)}
                        className="flex-1 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-sm transition"
                      >
                        ✓ {labels.restoreConfirm}
                      </button>
                      <button
                        onClick={() => setConfirmRestore(null)}
                        className="flex-1 py-1.5 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 text-xs font-bold rounded-sm transition"
                      >
                        لغو
                      </button>
                    </>
                  ) : confirmDelete === snapshot.id ? (
                    <>
                      <button
                        onClick={() => handleDelete(snapshot.id)}
                        className="flex-1 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-sm transition"
                      >
                        ✓ حذف
                      </button>
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="flex-1 py-1.5 bg-navy-900/10 hover:bg-navy-900/20 text-navy-900 text-xs font-bold rounded-sm transition"
                      >
                        لغو
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setConfirmRestore(snapshot.id)}
                        className="flex-1 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-sm transition"
                      >
                        ↻ {labels.restore}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(snapshot.id)}
                        className="py-1.5 px-3 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold rounded-sm transition border border-red-200"
                      >
                        🗑
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ─── دکمه‌ی بستن ─── */}
        <div className="mt-4">
          <Button variant="primary" size="md" onClick={onClose}>
            {labels.close}
          </Button>
        </div>
      </div>
    </div>
  );
}