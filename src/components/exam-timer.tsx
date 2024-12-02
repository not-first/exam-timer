import { useEffect, useState, useCallback } from "react";
import { TimerDisplay } from "./timer/timer-display";
import { examTimerSelector, useTimerStore } from "@/lib/stores/timer-store";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { useShallow } from "zustand/react/shallow";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useTimer } from "@/hooks/use-timer";
import { ExitConfirmation } from "./timer/exit-confirmation";
import { AppLayout } from "./layouts/app-layout";

export default function ExamTimer() {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const { showSeconds, setShowSeconds } = usePreferencesStore();
  const {
    currentSection,
    isRunning,
    toggleTimer,
    skipSection,
    restartSection,
    exitTimer,
    goBack,
  } = useTimerStore(useShallow(examTimerSelector));

  const { toggleFullscreen } = useFullscreen();
  useTimer(isRunning);

  const handleExitRequest = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          toggleTimer();
          break;
        case "Escape":
          e.preventDefault();
          handleExitRequest();
          break;
        case "n":
          skipSection();
          break;
        case "r":
          restartSection();
          break;
        case "s":
          setShowSeconds(!showSeconds);
          break;
        case "b":
          if (currentSection === "writing") goBack();
          break;
        case "f":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    exitTimer,
    restartSection,
    showSeconds,
    skipSection,
    toggleTimer,
    goBack,
    currentSection,
    toggleFullscreen,
    handleExitRequest,
  ]);

  return (
    <AppLayout>
      <div className="flex min-h-screen items-center justify-center font-sans">
        <TimerDisplay
          showSeconds={showSeconds}
          setShowSeconds={setShowSeconds}
          onExitRequest={handleExitRequest}
        />
      </div>
      <ExitConfirmation
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        onConfirm={exitTimer}
      />
    </AppLayout>
  );
}
