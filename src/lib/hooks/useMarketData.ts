"use client";

import { useEffect, useRef } from "react";
import { useMarketStore } from "@/store/market-store";

type Options = {
  cryptoInterval?: number; // ms, default 30s
  stocksInterval?: number; // ms, default 60s
};

export function useMarketData({
  cryptoInterval = 30_000,
  stocksInterval = 60_000,
}: Options = {}) {
  const { fetchCrypto, fetchStocks } = useMarketStore();
  const cryptoTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const stocksTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Immediate fetch on mount
    fetchCrypto();
    fetchStocks();

    cryptoTimer.current = setInterval(fetchCrypto, cryptoInterval);
    stocksTimer.current = setInterval(fetchStocks, stocksInterval);

    return () => {
      if (cryptoTimer.current) clearInterval(cryptoTimer.current);
      if (stocksTimer.current) clearInterval(stocksTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
