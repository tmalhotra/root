"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { AUTOMATION_DEFS } from "../content";

export default function AutomationsScreen() {
  const { state, set } = useApp();
  return (
    <div className="dt-screen" style={{ padding: "16px 16px 24px" }}>
      <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
        Rules run automatically across both units. Toggle anything off to take manual control — it&apos;s your operation.
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {AUTOMATION_DEFS.map((a) => {
          const on = state.autos[a.key];
          return (
            <div key={a.key} style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 15, display: "flex", gap: 13, alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.ink, fontSize: 14.5, fontWeight: 600 }}>{a.title}</div>
                <div style={{ color: C.muted, fontSize: 12.5, lineHeight: 1.45, marginTop: 4 }}>{a.desc}</div>
              </div>
              <button
                onClick={() => set((s) => ({ autos: { ...s.autos, [a.key]: !s.autos[a.key] } }))}
                role="switch"
                aria-checked={on}
                aria-label={a.title}
                style={{ flex: "0 0 auto", width: 46, height: 28, borderRadius: 100, border: "none", cursor: "pointer", padding: 0, position: "relative", background: on ? C.accent : "rgba(0,0,0,.14)" }}
              >
                <span style={{ position: "absolute", top: 3, left: on ? 21 : 3, width: 22, height: 22, borderRadius: "50%", background: "#fff", transition: "left .18s ease" }} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
