"use client";

/**
 * PlantTreeScreen — صفحه‌ی کاشت درخت (نسخه ۲.۰)
 *
 * ⚠️ وظیفه: نمایش صفحه‌ی کاشت + مدیریت روند ایمپورت/ساخت
 *
 * ⚠️ روند جدید:
 * - درخت پیش‌فرض: مستقیم CreateTreeModal با ۵۰ کلمه‌ی پیش‌فرض باز می‌شه
 *   (کاربر اسم/شکل/رنگ رو انتخاب می‌کنه)
 * - درخت شخصی: اول مودال ایمپورت باز می‌شه → بعد از ایمپورت،
 *   CreateTreeModal با کلمات فایل ایمپورت‌شده باز می‌شه
 */

import { useState } from "react";
import {
  GameState,
  WordEntry,
  TreeVariant,
  TreeColor,
} from "@/lib/wordtree/types";
import { Locale } from "@/lib/i18n";
import { PlantTreeScreen as PlantTreeView } from "../components/PlantTreeScreen";
import { ImportWordsModal } from "../components/ImportWordsModal";
import { CreateTreeModal } from "../components/CreateTreeModal";
import { plantTree } from "@/lib/wordtree/gameLogic";
import { loadCustomWords, generateFileId } from "@/lib/wordtree/customWords";
import { WORDS_DE } from "@/data/wordtree/words-de";
import { CUSTOM_TREE_TYPE } from "@/lib/wordtree/constants";
import { importWordsFromJSON } from "@/lib/wordtree/jsonImport";
import { getImportWordsLabels } from "../components/importWordsLabels";

interface PlantTreeScreenProps {
  gameState: GameState;
  setGameState: (state: GameState) => void;
  customWords: WordEntry[];
  setCustomWords: (words: WordEntry[]) => void;
  safeLocale: Locale;
  t: any;
  onTourStart: () => void;
}

export function PlantTreeScreen({
  gameState,
  setGameState,
  customWords,
  setCustomWords,
  t,
  onTourStart,
}: PlantTreeScreenProps) {
  const [showImportModal, setShowImportModal] = useState(false);
  const [pendingPoolWordIds, setPendingPoolWordIds] = useState<string[] | null>(
    null
  );

  // ─── ساخت نهایی درخت (از CreateTreeModal) ───
  const handleCreate = (
    name: string,
    variant: TreeVariant,
    wordIds: string[],
    color?: TreeColor
  ) => {
    setGameState(plantTree(gameState, name, variant, wordIds, color));
    setPendingPoolWordIds(null);
    onTourStart();
    return { success: true };
  };

  const handlePlant = (treeTypeId: string) => {
    if (treeTypeId === CUSTOM_TREE_TYPE) {
      // ⚠️ درخت شخصی: اول ایمپورت
      setShowImportModal(true);
      return;
    }
    // ⚠️ درخت پیش‌فرض: مستقیم به CreateTreeModal با ۵۰ کلمه‌ی پیش‌فرض
    setPendingPoolWordIds(WORDS_DE.slice(0, 50).map((w) => w.id));
  };

  return (
    <>
      <PlantTreeView
        onPlant={handlePlant}
        onOpenImport={() => setShowImportModal(true)}
        customWordsCount={customWords.length}
        labels={{
          welcome: t.plantWelcome || "به باغت خوش اومدی! 🌱",
          subtitle: t.plantSubtitle || "",
          selectTree: t.plantSelectTree || "",
          treeTypeDefault: t.treeTypeDefault || "آلمانی پیش‌فرض",
          treeTypeDefaultDesc: t.treeTypeDefaultDesc || "",
          treeTypeCustom: t.treeTypeCustom || "درخت شخصی",
          treeTypeCustomDesc: t.treeTypeCustomDesc || "",
          plantButton: t.plantButton || "بکار",
          customWordsImported: t.customWordsImported || "{count} کلمه آماده",
          wordsCount: t.plantWordsCount || "{count} کلمه",
        }}
      />

      {/* ─── مودال ایمپورت (برای درخت شخصی) ─── */}
      {showImportModal && (
        <ImportWordsModal
          onClose={() => setShowImportModal(false)}
          onImport={(fileContent, fileName) => {
            const fileId = generateFileId();
            const result = importWordsFromJSON(fileContent, 0, fileId, fileName);
            if (result.imported > 0) {
              setCustomWords(loadCustomWords());
              setShowImportModal(false);
              // ⚠️ مستقیم به مرحله‌ی ساخت درخت با کلمات فایل
              setPendingPoolWordIds(result.importedWordIds || []);
            }
            return result;
          }}
          labels={getImportWordsLabels(t)}
          promptUrl="/wordtree/wordtree-prompt.txt"
          templateUrl="/wordtree/wordtree-template.json"
        />
      )}

      {/* ─── مودال ساخت درخت (اسم/شکل/رنگ) ─── */}
      {pendingPoolWordIds !== null && (
        <CreateTreeModal
          onClose={() => setPendingPoolWordIds(null)}
          onCreate={handleCreate}
          initialPoolWordIds={pendingPoolWordIds}
          initialName={t.plantTreeDefaultName || "درخت من"}
          onImportWords={(content, fileName) => {
            const fileId = generateFileId();
            const result = importWordsFromJSON(content, 0, fileId, fileName);
            if (result.imported > 0) {
              setCustomWords(loadCustomWords());
            }
            return result;
          }}
          labels={{
            title: t.createTreeTitle || "درخت جدید",
            subtitle: t.createTreeSubtitle || "",
            nameLabel: t.createTreeNameLabel || "اسم درخت",
            namePlaceholder: t.createTreeNamePlaceholder || "مثلاً: سفر",
            variantLabel: t.createTreeVariantLabel || "شکل درخت",
            next: t.createTreeNext || "بعدی",
            create: t.createTreeCreate || "ساخت درخت",
            cancel: t.createTreeCancel || "انصراف",
            back: t.createTreeBack || "قبلی",
            errorRequired: t.createTreeErrorRequired || "",
            variantOak: t.variantOak,
            variantPine: t.variantPine,
            variantPalm: t.variantPalm,
            variantBlossom: t.variantBlossom,
            variantApple: t.variantApple,
            variantLemon: t.variantLemon,
            colorLabel: t.colorLabel,
            treeColorGreen: t.treeColorGreen,
            treeColorAutumn: t.treeColorAutumn,
            treeColorPink: t.treeColorPink,
            treeColorBlue: t.treeColorBlue,
            treeColorPurple: t.treeColorPurple,
            treeColorGold: t.treeColorGold,
            // ─── مرحله‌ی کلمات ───
            wordsTitle: t.createTreeWordsTitle || "کلمات درخت",
            wordsSubtitle: t.createTreeWordsSubtitleV3 || "",
            poolCount: t.createTreePoolCount || "{count} کلمه در استخر",
            uploadFile: t.createTreeUploadFile || "آپلود فایل کلمات",
            uploadFileDesc: t.createTreeUploadFileDesc || "",
            createEmpty: t.createTreeCreateEmpty || "ساخت درخت خالی",
            createEmptyDesc: t.createTreeCreateEmptyDesc || "",
            addMoreWords: t.createTreeAddMoreWords || "افزودن کلمات بیشتر",
            emptyPoolHint: t.createTreeEmptyPoolHint || "",
            importLabels: t,
          }}
          promptUrl="/wordtree/wordtree-prompt.txt"
          templateUrl="/wordtree/wordtree-template.json"
        />
      )}
    </>
  );
}
