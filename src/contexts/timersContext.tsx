import React, { createContext, useContext, useMemo, useState } from "react";
import { DEFAULT_TIMERS } from "../constants";

const STORAGE_KEY = (i: number) => `timer:${i}`;

const loadTimer = (i: number) => {
  const raw = localStorage.getItem(STORAGE_KEY(i));
  const n = raw === null ? DEFAULT_TIMERS[i] ?? 30 : Number(raw);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : (DEFAULT_TIMERS[i] ?? 30);
};

const loadAll = (count: number) => Array.from({ length: count }, (_, i) => loadTimer(i));

type TimersContextType = {
  timers: number[];
  setTimerAt: (index: number, seconds: number) => void;
  getTimerAt: (index: number) => number;
};

const TimersContext = createContext<TimersContextType | null>(null);

export const TimersProvider = ({
  count = 8,
  children
}: {
  count?: number;
  children: React.ReactNode;
}) => {
  const [timers, setTimers] = useState<number[]>(() => loadAll(count));

  const setTimerAt = (index: number, seconds: number) => {
    const next = Math.max(0, Math.floor(seconds));

    setTimers((prev) => {
      const copy = [...prev];
      copy[index] = next;
      return copy;
    });

    localStorage.setItem(STORAGE_KEY(index), String(next));
  };

  const getTimerAt = (index: number) => timers[index] ?? (DEFAULT_TIMERS[index] ?? 30);

  const value = useMemo(
    () => ({ timers, setTimerAt, getTimerAt }),
    [timers]
  );

  return <TimersContext.Provider value={value}>{children}</TimersContext.Provider>;
};

export const useTimers = () => {
  const ctx = useContext(TimersContext);
  if (!ctx) throw new Error("useTimers must be used within a TimersProvider");
  return ctx;
};
