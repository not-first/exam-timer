import { ExamPreset } from "./types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TimerActions {
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

interface TimerState {
  currentSection: "reading" | "writing" | "completed";
  timeRemaining: number;
  isRunning: boolean;
  examName: string;
  readingTime: number;
  writingTime: number;
  buttonsVisible: boolean;
}

export interface TimerStore {
  page: "home" | "timer";
  setPage: (newPage: "home" | "timer") => void;
  presets: ExamPreset[];
  loadPreset: (presetName: string) => void;
  addPreset: (preset: ExamPreset) => void;
  timerState: TimerState;
  timerActions: TimerActions;
}

export const useTimerStore = create<TimerStore>()(
  persist(
    (set, get) => ({
      page: "home",
      setPage: (newPage) => set({ page: newPage }),
      presets: [],
      loadPreset: (presetName) => {
        const preset: ExamPreset | undefined = get().presets.find(
          (p) => p.name === presetName
        );
        if (preset) {
          set({
            timerState: {
              currentSection: "reading",
              timeRemaining: 0,
              isRunning: false,
              examName: preset.name,
              readingTime: preset.readingTime,
              writingTime: preset.writingTime,
              buttonsVisible: false,
            },
          });
        }
      },
      addPreset: (preset) => {
        set((state) => ({ presets: [...state.presets, preset] }));
      },
      timerState: {
        currentSection: "reading",
        timeRemaining: 0,
        isRunning: false,
        examName: "",
        readingTime: 0,
        writingTime: 0,
        buttonsVisible: false,
      },
      timerActions: {
        startTimer: (examName, readingTime, writingTime) => {
          console.log("Starting timer");
          set((state) => ({
            page: "timer",
            timerState: {
              ...state.timerState,
              currentSection: "reading",
              timeRemaining: readingTime * 60,
              isRunning: false,
              examName,
              readingTime,
              writingTime,
            },
          }));
          console.log("Current store state:", get());
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
                  ? state.timerState.readingTime * 60
                  : state.timerState.writingTime * 60,
              isRunning: false,
            },
          }));
        },
        toggleTimer: () => {
          const currentSection = get().timerState.currentSection;
          if (currentSection === "completed") {
            set({
              page: "home",
              timerState: {
                currentSection: "reading",
                timeRemaining: 0,
                isRunning: false,
                examName: "",
                readingTime: 0,
                writingTime: 0,
                buttonsVisible: false,
              },
            });
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
          set({
            page: "home",
            timerState: {
              currentSection: "reading",
              timeRemaining: 0,
              isRunning: false,
              examName: "",
              readingTime: 0,
              writingTime: 0,
              buttonsVisible: false,
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
      },
    }),
    {
      name: "timer-storage",
      partialize: (state) => ({ presets: state.presets }),
    }
  )
);

export const examTimerSelector = (state: TimerStore) => ({
  examName: state.timerState.examName,
  currentSection: state.timerState.currentSection,
  readingTime: state.timerState.readingTime,
  writingTime: state.timerState.writingTime,
  timeRemaining: state.timerState.timeRemaining,
  isRunning: state.timerState.isRunning,
  toggleTimer: state.timerActions.toggleTimer,
  skipSection: state.timerActions.skipSection,
  restartSection: state.timerActions.restartSection,
  exitTimer: state.timerActions.exitTimer,
  goBack: state.timerActions.goBack,
});

export const timerCreationSelector = (state: TimerStore) => ({
  presets: state.presets,
  loadPreset: state.loadPreset,
  addPreset: state.addPreset,
  startTimer: state.timerActions.startTimer,
  setPage: state.setPage,
});
