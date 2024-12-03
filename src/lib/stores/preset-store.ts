import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ExamPreset } from "../types";

export interface PresetStore {
  presets: ExamPreset[];
  loadPreset: (presetName: string) => ExamPreset | undefined;
  addPreset: (preset: ExamPreset) => void;
  reorderPresets: (oldIndex: number, newIndex: number) => void;
  deletePreset: (presetName: string) => void;
  updatePreset: (presetName: string, updatedPreset: ExamPreset) => void;
}

export const usePresetStore = create<PresetStore>()(
  persist(
    (set, get) => ({
      presets: [],
      loadPreset: (presetName) => {
        return get().presets.find((p) => p.name === presetName);
      },
      addPreset: (preset) => {
        set((state) => ({ presets: [preset, ...state.presets] })); // Changed to prepend
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
