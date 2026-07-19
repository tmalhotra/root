"use client";
/* eslint-disable @next/next/no-img-element */
import { useApp } from "../store";
import { C, display } from "../tokens";
import { ChevronRight, Plus } from "../icons";
import { LISTINGS } from "../content";

export default function ListingsScreen() {
  const { set } = useApp();
  return (
    <div className="dt-screen" style={{ padding: "18px 16px 24px" }}>
      <div style={display(28)}>Listings</div>
      <div style={{ color: C.muted, fontSize: 12.5, marginTop: 4 }}>123 East Herbert St · Peahala Park oceanfront duplex</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14, marginTop: 18 }}>
        {LISTINGS.map((li) => (
          <button key={li.id} onClick={() => set({ selListing: li.id })} style={{ textAlign: "left", background: C.card, border: `1px solid ${C.hair}`, borderRadius: 20, overflow: "hidden", cursor: "pointer", padding: 0 }}>
            <div style={{ position: "relative", height: 160 }}>
              <img src={li.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(20,17,13,.9), rgba(20,17,13,0) 55%)" }} />
              <div style={{ position: "absolute", top: 12, left: 12, display: "flex", alignItems: "center", gap: 7, background: "rgba(20,17,13,.6)", backdropFilter: "blur(8px)", padding: "5px 11px", borderRadius: 100 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: li.color }} />
                <span style={{ color: "#FFFFFF", fontSize: 11, fontWeight: 600 }}>{li.floor}</span>
              </div>
              <div style={{ position: "absolute", bottom: 12, left: 14, right: 14, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                <div style={{ ...display(28, "#fff") }}>{li.name}</div>
                <div style={{ color: C.accent, fontSize: 11.5, fontWeight: 600, background: "rgba(20,17,13,.55)", backdropFilter: "blur(8px)", padding: "4px 10px", borderRadius: 100 }}>{li.statusLabel}</div>
              </div>
            </div>
            <div style={{ padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div>
                  <div style={{ color: C.muted, fontSize: 10.5, letterSpacing: ".08em" }}>SUMMER RATE</div>
                  <div style={{ color: C.ink, fontSize: 15, fontWeight: 600, marginTop: 2 }}>{li.rate}</div>
                </div>
                <div>
                  <div style={{ color: C.muted, fontSize: 10.5, letterSpacing: ".08em" }}>LAYOUT</div>
                  <div style={{ color: C.ink, fontSize: 15, fontWeight: 600, marginTop: 2 }}>{li.occ}</div>
                </div>
                <div style={{ marginLeft: "auto", color: C.accent }}>
                  <ChevronRight color="currentColor" />
                </div>
              </div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.hair}` }}>{li.specs}</div>
            </div>
          </button>
        ))}
        <button onClick={() => set({ propSheetOpen: true })} style={{ border: "1.5px dashed rgba(0,0,0,.16)", background: "none", borderRadius: 20, padding: 20, color: C.muted, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Plus color="currentColor" /> Add listing
        </button>
      </div>
    </div>
  );
}
