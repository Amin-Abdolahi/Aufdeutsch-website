"use client";

/**
 * useModals — مدیریت همه‌ی مودال‌ها
 */

import { useState } from "react";

export function useModals() {
  const [showWateringPanel, setShowWateringPanel] = useState(false);
  const [showAddWordModal, setShowAddWordModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQuizMenu, setShowQuizMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [showCreatePlotModal, setShowCreatePlotModal] = useState(false);
  const [showCreateTreeModal, setShowCreateTreeModal] = useState(false);
  const [showTreeWordManager, setShowTreeWordManager] = useState(false);
  const [showMyWordsModal, setShowMyWordsModal] = useState(false);

  return {
    showWateringPanel,
    setShowWateringPanel,
    showAddWordModal,
    setShowAddWordModal,
    showImportModal,
    setShowImportModal,
    showBackupModal,
    setShowBackupModal,
    showSnapshotModal,
    setShowSnapshotModal,
    showSettings,
    setShowSettings,
    showQuizMenu,
    setShowQuizMenu,
    showHelp,
    setShowHelp,
    showTour,
    setShowTour,
    showCreatePlotModal,
    setShowCreatePlotModal,
    showCreateTreeModal,
    setShowCreateTreeModal,
    showTreeWordManager,
    setShowTreeWordManager,
    showMyWordsModal,
    setShowMyWordsModal,
  };
}