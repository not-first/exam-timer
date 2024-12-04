import { useEffect } from "react";
import { useTimerStore } from "@/lib/stores/timer-store";

export function useTimer(isRunning: boolean) {
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      const store = useTimerStore.getState();
      const { timeRemaining } = store.timerState;

      if (timeRemaining <= 1) {
        store.skipSection();
      } else {
        useTimerStore.setState((state) => ({
          timerState: {
            ...state.timerState,
            timeRemaining: timeRemaining - 1,
          },
        }));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);
}
