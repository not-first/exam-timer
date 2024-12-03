import { Progress } from "@/components/ui/progress";
import { examTimerSelector, useTimerStore } from "@/lib/stores/timer-store";
import { usePreferencesStore } from "@/lib/stores/preferences-store";
import { useCallback, useState, useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { ActionButtons } from "./action-buttons";
import { cn } from "@/lib/utils";

interface TimerDisplayProps {
  onExitRequest: () => void;
}

export function TimerDisplay({ onExitRequest }: TimerDisplayProps) {
  const [buttonsVisible, setButtonsVisible] = useState(false);
  const { showProgressBar, showSeconds, alwaysShowActions, timerSize } =
    usePreferencesStore(
      useShallow((state) => ({
        showProgressBar: state.showProgressBar,
        showSeconds: state.showSeconds,
        alwaysShowActions: state.alwaysShowActions,
        timerSize: state.timerSize,
      }))
    );
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
    if (isRunning && !alwaysShowActions) {
      const timer = setTimeout(() => setButtonsVisible(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isRunning, alwaysShowActions]);

  // Add effect to handle preference changes
  useEffect(() => {
    if (!alwaysShowActions && isRunning) {
      setButtonsVisible(false);
    }
  }, [alwaysShowActions, isRunning]);

  const shouldShowButtons =
    alwaysShowActions ||
    buttonsVisible ||
    (!isRunning &&
      timeRemaining ===
        (currentSection === "reading" ? readingTime * 60 : writingTime * 60));

  function formatTime(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    const timeString = `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;

    return (
      <span className="flex items-center">
        <span>{timeString}</span>
        <span
          className={cn(
            "overflow-hidden",
            showSeconds ? "w-[2.5ch] opacity-100" : "w-0 opacity-0"
          )}
        >
          :{secs.toString().padStart(2, "0")}
        </span>
      </span>
    );
  }

  // Wider range for timer size (0.7-1.3) while keeping 50 as the midpoint
  const sizeMultiplier = 0.7 + (timerSize / 100) * 0.6;

  const totalTime =
    currentSection === "reading" ? readingTime * 60 : writingTime * 60;
  const elapsedTime = totalTime - timeRemaining;
  const progress = (elapsedTime / totalTime) * 100;

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={showButtons}
      onMouseMove={showButtons}
      style={{ "--scale": sizeMultiplier } as React.CSSProperties}
    >
      <p className="text-sm text-muted-foreground mb-1">{examName}</p>
      <div className="flex flex-col items-center">
        <div className="flex justify-center">
          <p
            className="font-light tabular-nums tracking-tight leading-none mb-3"
            style={{ fontSize: `calc(4rem * var(--scale))` }}
          >
            {formatTime(timeRemaining)}
          </p>
        </div>

        <div
          className={cn(
            "w-full overflow-hidden transition-all duration-300 ease-in-out",
            showProgressBar
              ? "max-h-8 mb-3 mt-1 opacity-100"
              : "max-h-0 opacity-0"
          )}
        >
          <Progress value={progress} className="h-1" />
        </div>

        <p className="text-sm text-muted-foreground capitalize">
          {currentSection} Time
        </p>
      </div>
      <ActionButtons
        buttonsVisible={shouldShowButtons}
        onExitRequest={onExitRequest}
      />
    </div>
  );
}
