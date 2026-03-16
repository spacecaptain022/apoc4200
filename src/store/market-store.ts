import { create } from "zustand";
import type { MarketAsset } from "@/app/api/markets/crypto/route";

type FetchState = "idle" | "loading" | "ok" | "error";

type MarketStore = {
  crypto: MarketAsset[];
  stocks: MarketAsset[];
  cryptoState: FetchState;
  stocksState: FetchState;
  cryptoTs: number | null;
  stocksTs: number | null;

  fetchCrypto: () => Promise<void>;
  fetchStocks: () => Promise<void>;
  fetchAll: () => Promise<void>;
};

export const useMarketStore = create<MarketStore>((set, get) => ({
  crypto: [],
  stocks: [],
  cryptoState: "idle",
  stocksState: "idle",
  cryptoTs: null,
  stocksTs: null,

  async fetchCrypto() {
    set({ cryptoState: "loading" });
    try {
      const res = await fetch("/api/markets/crypto");
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      set({ crypto: data.assets ?? [], cryptoState: "ok", cryptoTs: data.ts });
    } catch {
      set({ cryptoState: "error" });
    }
  },

  async fetchStocks() {
    set({ stocksState: "loading" });
    try {
      const res = await fetch("/api/markets/stocks");
      if (!res.ok) throw new Error(`${res.status}`);
      const data = await res.json();
      set({ stocks: data.assets ?? [], stocksState: "ok", stocksTs: data.ts });
    } catch {
      set({ stocksState: "error" });
    }
  },

  async fetchAll() {
    await Promise.all([get().fetchCrypto(), get().fetchStocks()]);
  },
}));
