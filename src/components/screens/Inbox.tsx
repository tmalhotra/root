"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { display } from "../tokens";
import { initials, unitColor } from "@/lib/domain/selectors";

export default function InboxScreen() {
  const { data, set } = useApp();
  return (
    <div className="dt-screen" style={{ padding: "18px 16px 24px" }}>
      <div style={display(28)}>Inbox</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 16 }}>
        {data.threads.map((th) => (
          <button key={th.id} onClick={() => set({ openThreadId: th.id })} style={{ textAlign: "left", display: "flex", alignItems: "flex-start", gap: 13, background: "none", border: "none", borderBottom: `1px solid ${C.hair}`, padding: "15px 4px", cursor: "pointer" }}>
            <div style={{ position: "relative", flex: "0 0 auto" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: unitColor(th.unit), display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, fontWeight: 700, fontSize: 15 }}>{initials(th.name)}</div>
              {th.unread && <span style={{ position: "absolute", top: -1, right: -1, width: 12, height: 12, borderRadius: "50%", background: C.danger, border: `2px solid ${C.screen}` }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: C.ink, fontSize: 14.5, fontWeight: 600 }}>{th.name}</span>
                <span style={{ color: C.muted, fontSize: 10.5, border: "1px solid rgba(0,0,0,.12)", padding: "1px 7px", borderRadius: 100 }}>{th.unit === "Both" ? "Whole house" : th.unit}</span>
              </div>
              <div style={{ color: C.muted, fontSize: 13, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", ...(th.unread ? { color: C.ink, fontWeight: 500 } : {}) }}>{th.snippet}</div>
            </div>
            <span style={{ color: C.muted, fontSize: 11, flex: "0 0 auto", marginTop: 2 }}>{th.time}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
