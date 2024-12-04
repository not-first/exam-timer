import { useState, useCallback, useEffect } from "react";
import { TimerDisplay } from "./timer/timer-display";
import { examTimerSelector, useTimerStore } from "@/lib/stores/timer-store";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useTimer } from "@/hooks/use-timer";
import { ExitConfirmation } from "./timer/exit-confirmation";
import { AppLayout } from "./layouts/app-layout";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useShallow } from "zustand/react/shallow";
import { usePreferencesStore } from "@/lib/stores/preferences-store";

function formatTimeForTitle(seconds: number, showSeconds: boolean) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const baseTime = `${hours.toString().padStart(2, "0")}:${mins
    .toString()
    .padStart(2, "0")}`;
  return showSeconds
    ? `${baseTime}:${secs.toString().padStart(2, "0")}`
    : baseTime;
}

export default function ExamTimer() {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const { isRunning, timeRemaining, examName } = useTimerStore(
    useShallow(examTimerSelector)
  );
  const { toggleFullscreen } = useFullscreen();
  const showSeconds = usePreferencesStore((state) => state.showSeconds);
  console.log("ExamTimer");

  const handleExitRequest = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  const handleConfirmExit = useCallback(() => {
    useTimerStore.getState().exitTimer();
  }, []);

  useEffect(() => {
    const originalTitle = document.title;

    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        document.title = `${formatTimeForTitle(
          timeRemaining,
          showSeconds
        )} - ${examName}`;
      } else {
        document.title = originalTitle;
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      document.title = originalTitle;
    };
  }, [timeRemaining, isRunning, examName, showSeconds]);

  useTimer(isRunning);
  useKeyboardShortcuts({
    onExitRequest: handleExitRequest,
    onFullscreenToggle: toggleFullscreen,
    dialogOpen: showExitConfirmation,
  });

  return (
    <AppLayout>
      <div className="flex min-h-screen items-center justify-center font-sans">
        <TimerDisplay onExitRequest={handleExitRequest} />
      </div>
      <ExitConfirmation
        open={showExitConfirmation}
        onOpenChange={setShowExitConfirmation}
        onConfirm={handleConfirmExit}
      />
    </AppLayout>
  );
}
