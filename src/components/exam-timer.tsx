import { useState, useCallback } from "react";
import { TimerDisplay } from "./timer/timer-display";
import { examTimerSelector, useTimerStore } from "@/lib/stores/timer-store";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { useTimer } from "@/hooks/use-timer";
import { ExitConfirmation } from "./timer/exit-confirmation";
import { AppLayout } from "./layouts/app-layout";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useShallow } from "zustand/react/shallow";

export default function ExamTimer() {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const { isRunning } = useTimerStore(useShallow(examTimerSelector));
  const { toggleFullscreen } = useFullscreen();
  console.log("ExamTimer");

  const handleExitRequest = useCallback(() => {
    setShowExitConfirmation(true);
  }, []);

  const handleConfirmExit = useCallback(() => {
    useTimerStore.getState().exitTimer();
  }, []);

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
