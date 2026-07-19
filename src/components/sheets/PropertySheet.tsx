"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { Building, CheckThick, Plus } from "../icons";

export default function PropertySheet() {
  const { state, set, data } = useApp();
  return (
    <div onClick={() => set({ propSheetOpen: false })} style={{ position: "absolute", inset: 0, background: "rgba(10,8,6,.6)", display: "flex", alignItems: "flex-end", zIndex: 50 }}>
      <div className="dt-sheet" onClick={(e) => e.stopPropagation()} style={{ width: "100%", background: C.card, borderRadius: "26px 26px 0 0", borderTop: "1px solid rgba(0,0,0,.1)", padding: "10px 16px 26px" }}>
        <div style={{ width: 38, height: 4, borderRadius: 100, background: "rgba(0,0,0,.18)", margin: "6px auto 16px" }} />
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".16em", marginBottom: 12 }}>YOUR PROPERTIES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {data.properties.map((p) => {
            const active = p.id === state.propId;
            return (
              <button
                key={p.id}
                onClick={() => set({ propId: p.id, propSheetOpen: false })}
                style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 13, background: active ? "rgba(32,183,230,.08)" : C.card, border: `1px solid ${active ? "rgba(32,183,230,.3)" : C.hair}`, borderRadius: 16, padding: 14, cursor: "pointer" }}
              >
                <div style={{ width: 42, height: 42, flex: "0 0 auto", borderRadius: 12, background: "rgba(32,183,230,.14)", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
                  <Building color={C.accent} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: C.ink, fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{p.city} · {p.units}</div>
                </div>
                {active && <CheckThick size={20} color={C.accent} />}
              </button>
            );
          })}
          <button onClick={() => set({ propSheetOpen: false })} style={{ border: "1.5px dashed rgba(0,0,0,.16)", background: "none", borderRadius: 16, padding: 16, color: C.muted, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <Plus color="currentColor" /> Add a property
          </button>
        </div>
      </div>
    </div>
  );
}
