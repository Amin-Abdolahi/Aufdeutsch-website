/**
 * importWordsLabels — سازنده‌ی لیبل‌های مودال ایمپورت
 *
 * ⚠️ برای جلوگیری از تکرار، تو هر جایی که ImportWordsModal استفاده
 * می‌شه (SharedModals، PlantTreeScreen، CreateTreeModal) از این استفاده می‌شه.
 */

export function getImportWordsLabels(t: any) {
  return {
    title: t.importWordsTitle,
    subtitle: t.importWordsSubtitle,
    dropzone: t.importDropzone,
    dropzoneActive: t.importDropzoneActive,
    selectFile: t.importSelectFile,
    downloadPrompt: t.importDownloadPrompt,
    downloadTemplate: t.importDownloadTemplate,
    importing: t.importImporting,
    resultTitle: t.importResultTitle,
    totalLabel: t.importTotalLabel,
    importedLabel: t.importImportedLabel,
    rejectedLabel: t.importRejectedLabel,
    coinsLabel: t.importCoinsLabel,
    errorsTitle: t.importErrorsTitle,
    close: t.importClose,
    invalidFile: t.importInvalidFile,
    guideTitle: t.importGuideTitle,
    guideStep1: t.importGuideStep1,
    guideStep2: t.importGuideStep2,
    guideStep3: t.importGuideStep3,
    guideFull: t.importGuideFull,
    guideFullTitle: t.importGuideFullTitle,
    guideFullContent: t.importGuideFullContent,
    guideBack: t.importGuideBack,
    tabPaste: t.importTabPaste,
    tabUpload: t.importTabUpload,
    tabPrompt: t.importTabPrompt,
    pastePlaceholder: t.importPastePlaceholder,
    pasteButton: t.importPasteButton,
    pasteEmpty: t.importPasteEmpty,
    promptBuilder: getPromptBuilderLabels(t),
  };
}

export function getPromptBuilderLabels(t: any) {
  return {
    title: t.promptBuilderTitle,
    subtitle: t.promptBuilderSubtitle,
    countLabel: t.promptCountLabel,
    topicLabel: t.promptTopicLabel,
    topicPlaceholder: t.promptTopicPlaceholder,
    levelLabel: t.promptLevelLabel,
    translationLabel: t.promptTranslationLabel,
    extraLabel: t.promptExtraLabel,
    extraPlaceholder: t.promptExtraPlaceholder,
    previewLabel: t.promptPreviewLabel,
    copyButton: t.promptCopyButton,
    copied: t.promptCopied,
    useButton: t.promptUseButton,
    topicSuggestions: [
      { label: "فرودگاه", value: "فرودگاه" },
      { label: "فروشگاه", value: "فروشگاه" },
      { label: "رستوران", value: "رستوران" },
      { label: "هتل", value: "هتل" },
      { label: "محیط کار", value: "محیط کار" },
      { label: "سفر", value: "سفر" },
      { label: "مراجعه به پزشک", value: "مراجعه به پزشک" },
      { label: "ایستگاه قطار", value: "ایستگاه قطار" },
      { label: "دانشگاه", value: "دانشگاه" },
      { label: "خانه", value: "خانه" },
    ],
    levels: [
      { label: "A1", value: "A1" },
      { label: "A2", value: "A2" },
      { label: "B1", value: "B1" },
      { label: "B2", value: "B2" },
      { label: "C1", value: "C1" },
    ],
    translationLanguages: [
      { label: "فارسی", value: "fa" },
      { label: "English", value: "en" },
      { label: "Deutsch", value: "de" },
    ],
  };
}
