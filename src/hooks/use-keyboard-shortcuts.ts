import { useEffect } from "react";
import { useTimerStore } from "@/lib/stores/timer-store";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { useShallow } from "zustand/react/shallow";

export const shortcuts = [
  { key: "Space", description: "Play/Pause timer" },
  { key: "Esc", description: "Exit timer" },
  { key: "N", description: "Next section" },
  { key: "R", description: "Restart section" },
  { key: "S", description: "Toggle seconds" },
  { key: "P", description: "Toggle progress bar" },
  { key: "A", description: "Toggle actions visibility" },
  { key: "B", description: "Back to reading (Writing section only)" },
  { key: "F", description: "Toggle fullscreen" },
] as const;

interface UseKeyboardShortcutsProps {
  onExitRequest: () => void;
  onFullscreenToggle: () => void;
  dialogOpen?: boolean;
}

export function useKeyboardShortcuts({
  onExitRequest,
  onFullscreenToggle,
  dialogOpen = false,
}: UseKeyboardShortcutsProps) {
  const { toggleProgressBar, toggleSeconds, toggleActions } =
    usePreferencesStore(
      useShallow((state) => ({
        toggleProgressBar: state.toggleProgressBar,
        toggleSeconds: state.toggleSeconds,
        toggleActions: state.toggleActions,
      }))
    );

  const { currentSection, toggleTimer, skipSection, restartSection, goBack } =
    useTimerStore(
      useShallow((state) => ({
        currentSection: state.timerState.currentSection,
        toggleTimer: state.toggleTimer,
        skipSection: state.skipSection,
        restartSection: state.restartSection,
        goBack: state.goBack,
      }))
    );

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (dialogOpen) return;

      switch (e.key.toLowerCase()) {
        case " ":
          e.preventDefault();
          toggleTimer();
          break;
        case "escape":
          e.preventDefault();
          onExitRequest();
          break;
        case "n":
          skipSection();
          break;
        case "r":
          restartSection();
          break;
        case "s":
          toggleSeconds();
          break;
        case "p":
          toggleProgressBar();
          break;
        case "a":
          toggleActions();
          break;
        case "b":
          if (currentSection === "writing") goBack();
          break;
        case "f":
          e.preventDefault();
          onFullscreenToggle();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    dialogOpen,
    currentSection,
    toggleTimer,
    skipSection,
    restartSection,
    goBack,
    toggleSeconds,
    toggleProgressBar,
    toggleActions,
    onExitRequest,
    onFullscreenToggle,
  ]);

  return { shortcuts };
}
