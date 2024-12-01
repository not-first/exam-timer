import { useCallback, useEffect, useState } from "react";
import { MaximiseMinimiseButton, ShortcutsButton } from "./timer/side-buttons";
import { TimerDisplay } from "./timer/timer-display";
import { examTimerSelector, useTimerStore } from "@/lib/store";
import { useShallow } from "zustand/react/shallow";

export default function ExamTimer() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSeconds, setShowSeconds] = useState(true);
  const {
    currentSection,
    isRunning,
    toggleTimer,
    skipSection,
    restartSection,
    exitTimer,
    goBack,
  } = useTimerStore(useShallow(examTimerSelector));

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      useTimerStore.setState((state) => {
        const newTime = state.timerState.timeRemaining - 1;
        if (newTime < 0) {
          if (state.timerState.currentSection === "reading") {
            return {
              timerState: {
                ...state.timerState,
                currentSection: "writing",
                timeRemaining: state.timerState.writingTime * 60,
                isRunning: false,
              },
            };
          }
          return {
            timerState: {
              ...state.timerState,
              currentSection: "completed",
              timeRemaining: 0,
              isRunning: false,
            },
          };
        }
        return {
          timerState: {
            ...state.timerState,
            timeRemaining: newTime,
          },
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case " ":
          e.preventDefault();
          toggleTimer();
          break;
        case "Escape":
          exitTimer();
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
  ]);

  return (
    <div className="relative min-h-screen">
      <MaximiseMinimiseButton
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
      <div className="flex min-h-screen items-center justify-center font-sans">
        <TimerDisplay
          showSeconds={showSeconds}
          setShowSeconds={setShowSeconds}
        />
      </div>
      <ShortcutsButton />
    </div>
  );
}
