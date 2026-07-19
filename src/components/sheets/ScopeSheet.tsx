"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { Pin, CheckThick } from "../icons";
import type { Scope } from "@/lib/domain/types";

interface ScopeItem {
  key: Scope;
  name: string;
  sub: string;
  dot: string;
}
interface ScopeGroup {
  header: string | null;
  headerAddr?: string;
  items: ScopeItem[];
}

const GROUPS: ScopeGroup[] = [
  { header: null, items: [{ key: "all", name: "All listings", sub: "1 property · 2 units", dot: C.whole }] },
  {
    header: "DUNES + TIDES",
    headerAddr: "123 East Herbert St · Long Beach, NJ",
    items: [
      { key: "p1", name: "Entire property", sub: "Tides + Dunes", dot: C.whole },
      { key: "Tides", name: "Tides", sub: "Upstairs · Oceanfront", dot: C.accent },
      { key: "Dunes", name: "Dunes", sub: "Downstairs · Oceanfront", dot: C.dunes },
    ],
  },
];

export default function ScopeSheet() {
  const { state, set } = useApp();
  return (
    <div onClick={() => set({ scopeOpen: false })} style={{ position: "absolute", inset: 0, background: "rgba(10,8,6,.45)", display: "flex", alignItems: "flex-end", zIndex: 60 }}>
      <div className="dt-sheet" onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.card, borderRadius: "26px 26px 0 0", borderTop: `1px solid ${C.hair2}`, padding: "10px 16px 26px" }}>
        <div style={{ width: 38, height: 4, borderRadius: 100, background: "rgba(0,0,0,.14)", margin: "6px auto 16px" }} />
        {GROUPS.map((g, gi) => (
          <div key={gi}>
            {g.header && (
              <div style={{ margin: "16px 2px 8px" }}>
                <div style={{ color: C.ink, fontSize: 13, fontWeight: 700, letterSpacing: ".06em" }}>{g.header}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 3, color: C.muted, fontSize: 11.5 }}>
                  <Pin size={12} color="currentColor" strokeWidth={1.8} /> {g.headerAddr}
                </div>
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {g.items.map((it) => {
                const active = state.scope === it.key;
                return (
                  <button
                    key={it.key}
                    onClick={() => set({ scope: it.key, scopeOpen: false, selDay: null })}
                    style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 12, borderRadius: 14, padding: "13px 14px", cursor: "pointer", background: active ? "rgba(32,183,230,.1)" : "#F7F5F0", border: `1px solid ${active ? "rgba(32,183,230,.35)" : "rgba(0,0,0,.06)"}` }}
                  >
                    <span style={{ width: 10, height: 10, flex: "0 0 auto", borderRadius: "50%", background: it.dot }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: C.ink, fontSize: 14.5, fontWeight: 600 }}>{it.name}</div>
                      <div style={{ color: C.muted, fontSize: 12, marginTop: 1 }}>{it.sub}</div>
                    </div>
                    {active && <CheckThick size={20} color={C.accent} />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
