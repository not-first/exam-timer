import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExamPreset } from "../types";

const DEFAULT_PRESETS: ExamPreset[] = [
  {
    name: "Mathematics",
    readingTime: 10,
    writingTime: 90,
  },
  {
    name: "English",
    readingTime: 15,
    writingTime: 120,
  },
  {
    name: "Chemistry",
    readingTime: 10,
    writingTime: 105,
  },
  {
    name: "Biology",
    readingTime: 15,
    writingTime: 75,
  },
];

export interface PresetStore {
  presets: ExamPreset[];
  loadPreset: (presetName: string) => ExamPreset | undefined;
  addPreset: (preset: ExamPreset) => void;
  reorderPresets: (oldIndex: number, newIndex: number) => void;
  deletePreset: (presetName: string) => void;
  updatePreset: (presetName: string, updatedPreset: ExamPreset) => void;
}

export const usePresetStore = create<PresetStore>()(
  // @ts-expect-error Zustand persist middleware typing issue
  persist<PresetStore>(
    (set, get) => ({
      presets: DEFAULT_PRESETS,
      loadPreset: (presetName) => {
        return get().presets.find((p) => p.name === presetName);
      },
      addPreset: (preset) => {
        set((state) => ({ presets: [preset, ...state.presets] }));
      },
      reorderPresets: (oldIndex, newIndex) => {
        set((state) => {
          const newPresets = [...state.presets];
          const [movedItem] = newPresets.splice(oldIndex, 1);
          newPresets.splice(newIndex, 0, movedItem);
          return { presets: newPresets };
        });
      },
      deletePreset: (presetName) => {
        set((state) => ({
          presets: state.presets.filter((p) => p.name !== presetName),
        }));
      },
      updatePreset: (presetName, updatedPreset) => {
        set((state) => ({
          presets: state.presets.map((p) =>
            p.name === presetName ? updatedPreset : p
          ),
        }));
      },
    }),
    {
      name: "preset-storage",
      partialize: (state) => ({ presets: state.presets }),
    }
  )
);
