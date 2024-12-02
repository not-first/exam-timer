import { useEffect } from "react";
import { useTimerStore } from "@/lib/stores/timer-store";

export function useTimer(isRunning: boolean) {
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
}
