import { create } from "zustand";
import { persist } from "zustand/middleware";

type TimerSize = number;
type ThemeMode = "light" | "dark";

export interface PreferencesStore {
  showSeconds: boolean;
  themeMode: ThemeMode;
  showProgressBar: boolean;
  alwaysShowIcons: boolean;
  timerSize: TimerSize;
  alwaysShowActions: boolean;

  toggleSeconds: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  toggleProgressBar: () => void;
  toggleIcons: () => void;
  setTimerSize: (size: TimerSize) => void;
  toggleActions: () => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  // @ts-expect-error Zustand persist middleware typing issue
  persist(
    (set) => ({
      showSeconds: false,
      themeMode: "light",
      showProgressBar: true,
      alwaysShowIcons: true,
      timerSize: 50,
      alwaysShowActions: false,

      toggleSeconds: () =>
        set((state) => ({ showSeconds: !state.showSeconds })),
      setThemeMode: (mode) => set({ themeMode: mode }),
      toggleProgressBar: () =>
        set((state) => ({ showProgressBar: !state.showProgressBar })),
      toggleIcons: () =>
        set((state) => ({ alwaysShowIcons: !state.alwaysShowIcons })),
      setTimerSize: (size) => set({ timerSize: size }),
      toggleActions: () =>
        set((state) => ({ alwaysShowActions: !state.alwaysShowActions })),
    }),
    {
      name: "preferences-storage",
      partialize: (state) => ({
        showSeconds: state.showSeconds,
        themeMode: state.themeMode,
        showProgressBar: state.showProgressBar,
        alwaysShowIcons: state.alwaysShowIcons,
        timerSize: state.timerSize,
        alwaysShowActions: state.alwaysShowActions,
      }),
    }
  )
);
