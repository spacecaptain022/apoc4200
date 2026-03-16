import { create } from "zustand";

type UIStore = {
  marketState: "live" | "delayed" | "stale" | "offline";
  setMarketState: (s: UIStore["marketState"]) => void;
};

export const useUIStore = create<UIStore>((set) => ({
  marketState: "live",
  setMarketState: (marketState) => set({ marketState }),
}));
