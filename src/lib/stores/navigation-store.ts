import { create } from "zustand";

export interface NavigationStore {
  page: "home" | "timer";
  setPage: (newPage: "home" | "timer") => void;
}

export const useNavigationStore = create<NavigationStore>()((set) => ({
  page: "home",
  setPage: (newPage) => set({ page: newPage }),
}));
