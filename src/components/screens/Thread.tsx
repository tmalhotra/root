"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { Sparkle, Send } from "../icons";
import type { Thread, Message } from "@/lib/domain/types";

function bubbleStyles(m: Message) {
  const out = m.from !== "guest";
  const ai = m.from === "ai";
  const row: React.CSSProperties = { display: "flex", justifyContent: out ? "flex-end" : "flex-start" };
  const bubble: React.CSSProperties = {
    maxWidth: "82%",
    padding: "11px 14px",
    borderRadius: out ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
    ...(ai
      ? { background: "rgba(32,183,230,.14)", border: "1px solid rgba(32,183,230,.35)" }
      : out
        ? { background: C.accent }
        : { background: "rgba(0,0,0,.08)" }),
  };
  const text: React.CSSProperties = { fontSize: 14, lineHeight: 1.45, color: out && !ai ? C.ink : C.body };
  const time: React.CSSProperties = { fontSize: 10, marginTop: 5, opacity: 0.55, color: out && !ai ? C.ink : C.body, ...(out ? { textAlign: "right" } : {}) };
  return { row, bubble, text, time, ai };
}

export default function ThreadScreen({ thread }: { thread: Thread }) {
  const { set } = useApp();
  const firstName = thread.name.split(" ")[0];
  return (
    <div className="dt-screen" style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 12 }}>
        {thread.messages.map((m, i) => {
          const s = bubbleStyles(m);
          return (
            <div key={i} style={s.row}>
              <div style={s.bubble}>
                {s.ai && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5, color: C.accent, fontSize: 11, fontWeight: 600, letterSpacing: ".04em" }}>
                    <Sparkle color={C.accent} /> TIDE DRAFTED THIS
                  </div>
                )}
                <div style={s.text}>{m.text}</div>
                <div style={s.time}>{m.time}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* smart replies */}
      <div style={{ marginTop: "auto", padding: "12px 14px 6px" }}>
        <div style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: ".14em", margin: "0 2px 8px" }}>TIDE · SMART REPLIES</div>
        <div className="dt-hscroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
          {thread.quick.map((q, i) => (
            <button key={i} onClick={() => set({ openThreadId: null })} style={{ flex: "0 0 auto", background: "rgba(32,183,230,.1)", border: "1px solid rgba(32,183,230,.3)", color: C.accentDeep, padding: "9px 14px", borderRadius: 100, fontSize: 13, cursor: "pointer" }}>
              {q}
            </button>
          ))}
        </div>
      </div>

      {/* composer */}
      <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 10, padding: "10px 14px 18px", borderTop: `1px solid ${C.hair}` }}>
        <div style={{ flex: 1, background: "rgba(0,0,0,.06)", border: "1px solid rgba(0,0,0,.1)", borderRadius: 100, padding: "11px 16px", color: C.muted, fontSize: 14 }}>Message {firstName}…</div>
        <button aria-label="Send" style={{ width: 42, height: 42, flex: "0 0 auto", borderRadius: "50%", background: C.accent, border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, cursor: "pointer" }}>
          <Send color={C.ink} />
        </button>
      </div>
    </div>
  );
}
