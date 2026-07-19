"use client";

/**
 * App state store. Mirrors the prototype's single state object exactly. The
 * `set()` updater takes a partial patch or a `(state) => patch` function, so it
 * behaves like React's setState — making the port from the prototype 1:1.
 */
import { createContext, useContext, useMemo, useReducer } from "react";
import type { AppData, Automations, Scope } from "@/lib/domain/types";
import { DEFAULT_AUTOMATIONS } from "@/lib/domain/seed";
import { REFERENCE_TODAY } from "@/lib/domain/constants";

export type Tab = "home" | "bookings" | "inbox" | "more" | "listings";
export type MoreView =
  | "reservations"
  | "cleaning"
  | "automations"
  | "analytics"
  | "connections"
  | null;
export type BookingsView = "month" | "list";

export interface State {
  tab: Tab;
  moreView: MoreView;
  openThreadId: string | null;
  selBookingId: string | null;
  selListing: string | null;
  propId: string;
  propSheetOpen: boolean;
  calOffset: number;
  selDay: string | null;
  scope: Scope;
  scopeOpen: boolean;
  bookingsView: BookingsView;
  codeConfirm: boolean;
  codeOverrides: Record<string, string>;
  autos: Automations;
}

const INITIAL: State = {
  tab: "home",
  moreView: null,
  openThreadId: null,
  selBookingId: null,
  selListing: null,
  propId: "p1",
  propSheetOpen: false,
  calOffset: 0,
  selDay: null,
  scope: "all",
  scopeOpen: false,
  bookingsView: "month",
  codeConfirm: false,
  codeOverrides: {},
  autos: DEFAULT_AUTOMATIONS,
};

type Updater = Partial<State> | ((s: State) => Partial<State>);

function reducer(state: State, updater: Updater): State {
  const patch = typeof updater === "function" ? updater(state) : updater;
  return { ...state, ...patch };
}

interface Store {
  state: State;
  set: (u: Updater) => void;
  data: AppData;
  /** The "today" all date math is relative to. */
  today: Date;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ data, children }: { data: AppData; children: React.ReactNode }) {
  const [state, set] = useReducer(reducer, INITIAL);
  // Seed data is anchored to the design's reference date so statuses/calendar
  // match the mockups. For a live deployment, switch this to `new Date()`.
  const today = REFERENCE_TODAY;
  const value = useMemo<Store>(() => ({ state, set, data, today }), [state, data, today]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp(): Store {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within <StoreProvider>");
  return ctx;
}
