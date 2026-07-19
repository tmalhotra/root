"use client";
import { StoreProvider } from "./store";
import AppShell from "./AppShell";
import type { AppData } from "@/lib/domain/types";

/** Client root: receives server-loaded data and mounts the interactive shell. */
export default function AppRoot({ data }: { data: AppData }) {
  return (
    <StoreProvider data={data}>
      <AppShell />
    </StoreProvider>
  );
}
