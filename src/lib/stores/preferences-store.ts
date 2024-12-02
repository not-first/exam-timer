import { create } from "zustand";
import { persist } from "zustand/middleware";

type TimerSize = number;
type TimerStyle = "default" | "design 2" | "name only" | "section only";
type ThemeMode = "light" | "dark" | "system";

export interface PreferencesStore {
  showSeconds: boolean;
  accentColor: string;
  fontFamily: string;
  themeMode: ThemeMode;
  showProgressBar: boolean;
  alwaysShowIcons: boolean;
  timerSize: TimerSize;
  timerStyle: TimerStyle;

  setShowSeconds: (show: boolean) => void;
  setAccentColor: (color: string) => void;
  setFontFamily: (font: string) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setShowProgressBar: (show: boolean) => void;
  setAlwaysShowIcons: (show: boolean) => void;
  setTimerSize: (size: TimerSize) => void;
  setTimerStyle: (style: TimerStyle) => void;
}

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      showSeconds: true,
      accentColor: "#6e6e6e",
      fontFamily: "system-ui",
      themeMode: "system",
      showProgressBar: true,
      alwaysShowIcons: false,
      timerSize: 50,
      timerStyle: "default",

      setShowSeconds: (show) => set({ showSeconds: show }),
      setAccentColor: (color) => set({ accentColor: color }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setThemeMode: (mode) => set({ themeMode: mode }),
      setShowProgressBar: (show) => set({ showProgressBar: show }),
      setAlwaysShowIcons: (show) => set({ alwaysShowIcons: show }),
      setTimerSize: (size) => set({ timerSize: size }),
      setTimerStyle: (style) => set({ timerStyle: style }),
    }),
    {
      name: "preferences-storage",
      partialize: (state) => ({
        showSeconds: state.showSeconds,
        accentColor: state.accentColor,
        fontFamily: state.fontFamily,
        themeMode: state.themeMode,
        showProgressBar: state.showProgressBar,
        alwaysShowIcons: state.alwaysShowIcons,
        timerSize: state.timerSize,
        timerStyle: state.timerStyle,
      }),
    }
  )
);
