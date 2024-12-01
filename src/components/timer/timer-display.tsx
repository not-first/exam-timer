import { Progress } from "@/components/ui/progress";
import { examTimerSelector, useTimerStore } from "@/lib/store";
import { useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { ActionButtons } from "./action-buttons";

interface TimerDisplayProps {
  showSeconds: boolean;
  setShowSeconds: (show: boolean) => void;
}

export function TimerDisplay({
  showSeconds,
  setShowSeconds,
}: TimerDisplayProps) {
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const {
    examName,
    currentSection,
    readingTime,
    writingTime,
    timeRemaining,
    isRunning,
  } = useTimerStore(useShallow(examTimerSelector));

  const showButtons = useCallback(() => {
    setButtonsVisible(true);
    if (isRunning) {
      const timer = setTimeout(() => setButtonsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isRunning]);

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return showSeconds
      ? `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
      : `${hours.toString().padStart(2, "0")}:${mins
          .toString()
          .padStart(2, "0")}`;
  }

  const totalTime =
    currentSection === "reading" ? readingTime * 60 : writingTime * 60;
  const elapsedTime = totalTime - timeRemaining;
  const progress = (elapsedTime / totalTime) * 100;

  return (
    <div
      className="flex flex-col items-center space-y-4"
      onMouseEnter={showButtons}
      onMouseMove={showButtons}
    >
      <p className="text-sm text-muted-foreground">{examName}</p>
      <p className="text-6xl font-light tabular-nums tracking-tight">
        {formatTime(timeRemaining)}
      </p>
      <Progress value={progress} className="h-1" />
      <p className="text-sm text-muted-foreground capitalize">
        {currentSection} Time
      </p>
      <ActionButtons
        showSeconds={showSeconds}
        setShowSeconds={setShowSeconds}
        buttonsVisible={buttonsVisible}
      />
    </div>
  );
}
