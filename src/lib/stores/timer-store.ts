import { create } from "zustand";
import { useNavigationStore } from "./navigation-store";

interface TimerState {
  currentSection: "reading" | "writing" | "completed";
  timeRemaining: number;
  isRunning: boolean;
  examName: string;
  readingTime: number;
  writingTime: number;
}

export interface TimerStore {
  timerState: TimerState;
  startTimer: (
    examName: string,
    readingTime: number,
    writingTime: number
  ) => void;
  skipSection: () => void;
  restartSection: () => void;
  toggleTimer: () => void;
  exitTimer: () => void;
  goBack: () => void;
}

export const useTimerStore = create<TimerStore>()((set, get) => ({
  timerState: {
    currentSection: "reading",
    timeRemaining: 0,
    isRunning: false,
    examName: "",
    readingTime: 0,
    writingTime: 0,
  },
  startTimer: (examName, readingTime, writingTime) => {
    set({
      timerState: {
        currentSection: "reading",
        timeRemaining: readingTime * 60,
        isRunning: false,
        examName,
        readingTime,
        writingTime,
      },
    });
  },
  skipSection: () => {
    set((state) => {
      if (state.timerState.currentSection === "reading") {
        return {
          timerState: {
            ...state.timerState,
            currentSection: "writing",
            timeRemaining: state.timerState.writingTime * 60,
            isRunning: false,
          },
        };
      } else if (state.timerState.currentSection === "writing") {
        return {
          timerState: {
            ...state.timerState,
            currentSection: "completed",
            timeRemaining: 0,
            isRunning: false,
          },
        };
      }
      return state;
    });
  },
  restartSection: () => {
    set((state) => ({
      timerState: {
        ...state.timerState,
        timeRemaining:
          state.timerState.currentSection === "reading"
            ? Math.round(state.timerState.readingTime * 60)
            : Math.round(state.timerState.writingTime * 60),
        isRunning: false,
      },
    }));
  },
  toggleTimer: () => {
    const currentSection = get().timerState.currentSection;
    if (currentSection === "completed") {
      get().exitTimer();
    } else {
      set((state) => ({
        timerState: {
          ...state.timerState,
          isRunning: !state.timerState.isRunning,
        },
      }));
    }
  },
  exitTimer: () => {
    useNavigationStore.getState().setPage("home");
    set({
      timerState: {
        currentSection: "reading",
        timeRemaining: 0,
        isRunning: false,
        examName: "",
        readingTime: 0,
        writingTime: 0,
      },
    });
  },
  goBack: () => {
    set((state) => {
      if (state.timerState.currentSection === "writing") {
        return {
          timerState: {
            ...state.timerState,
            currentSection: "reading",
            timeRemaining: state.timerState.readingTime * 60,
            isRunning: false,
          },
        };
      }
      return state;
    });
  },
}));

export const examTimerSelector = (state: TimerStore) => ({
  examName: state.timerState.examName,
  currentSection: state.timerState.currentSection,
  readingTime: state.timerState.readingTime,
  writingTime: state.timerState.writingTime,
  timeRemaining: state.timerState.timeRemaining,
  isRunning: state.timerState.isRunning,
  toggleTimer: state.toggleTimer,
  skipSection: state.skipSection,
  restartSection: state.restartSection,
  exitTimer: state.exitTimer,
  goBack: state.goBack,
});
