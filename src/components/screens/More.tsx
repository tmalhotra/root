"use client";
import { useApp } from "../store";
import { C, display } from "../tokens";
import { ChevronRight } from "../icons";
import { MORE_ITEMS } from "../content";

export default function MoreScreen() {
  const { set } = useApp();
  return (
    <div className="dt-screen" style={{ padding: "18px 16px 24px" }}>
      <div style={display(28)}>More</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 16 }}>
        {MORE_ITEMS.map((mi) => (
          <button
            key={mi.title}
            onClick={() => (mi.target.tab ? set({ tab: mi.target.tab, moreView: null, openThreadId: null, selBookingId: null, selListing: null }) : set({ moreView: mi.target.moreView ?? null }))}
            style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 14, background: "none", border: "none", borderBottom: `1px solid ${C.hair}`, padding: "17px 4px", cursor: "pointer" }}
          >
            <div style={{ width: 40, height: 40, flex: "0 0 auto", borderRadius: 11, background: "rgba(32,183,230,.1)", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
                <path d={mi.icon} />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.ink, fontSize: 15, fontWeight: 600 }}>{mi.title}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{mi.desc}</div>
            </div>
            <ChevronRight size={18} color={C.muted} />
          </button>
        ))}
      </div>
      <button style={{ width: "100%", marginTop: 22, background: "rgba(0,0,0,.05)", border: "1px solid rgba(0,0,0,.09)", color: C.muted, fontSize: 14, padding: 13, borderRadius: 12, cursor: "pointer" }}>Sign out</button>
    </div>
  );
}
