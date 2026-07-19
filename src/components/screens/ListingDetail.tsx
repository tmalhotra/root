"use client";
/* eslint-disable @next/next/no-img-element */
import { useApp } from "../store";
import { C, display } from "../tokens";
import { Check, CalendarIcon } from "../icons";
import { LISTINGS } from "../content";
import type { Scope } from "@/lib/domain/types";

export default function ListingDetailScreen() {
  const { state, set } = useApp();
  const li = LISTINGS.find((l) => l.id === state.selListing);
  if (!li) return null;

  return (
    <div className="dt-screen" style={{ padding: "0 0 32px" }}>
      <div style={{ position: "relative", height: 190 }}>
        <img src={li.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(23,20,16,.85), rgba(23,20,16,0) 55%)" }} />
        <div style={{ position: "absolute", bottom: 14, left: 16, right: 16, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: li.color }} />
              <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{li.floor}</span>
            </div>
            <div style={display(30, "#fff")}>{li.name}</div>
          </div>
        </div>
      </div>

      <div style={{ padding: "18px 16px 0" }}>
        <div style={{ display: "flex", gap: 1, background: "rgba(0,0,0,.08)", borderRadius: 12, overflow: "hidden" }}>
          {[li.beds, li.baths, li.sleeps].map((v) => (
            <div key={v} style={{ flex: 1, background: C.card, padding: "13px 10px", textAlign: "center" }}>
              <div style={{ color: C.ink, fontSize: 15, fontWeight: 600 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
          <span style={{ color: C.muted, fontSize: 13 }}>Summer rate</span>
          <span style={{ ...display(24), color: C.accent }}>{li.rate}</span>
        </div>

        <div style={{ color: C.body, fontSize: 13.5, lineHeight: 1.55, marginTop: 16 }}>{li.desc}</div>

        <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".14em", margin: "20px 0 10px" }}>AMENITIES</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
          {li.amenities.map((a) => (
            <div key={a} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Check size={17} color={C.accent} strokeWidth={1.9} style={{ flex: "0 0 auto" }} />
              <span style={{ color: C.body, fontSize: 13.5 }}>{a}</span>
            </div>
          ))}
        </div>

        <button onClick={() => set({ selListing: null, tab: "bookings", scope: li.id as Scope })} style={{ width: "100%", marginTop: 22, background: C.accent, border: "none", color: C.ink, fontWeight: 600, fontSize: 15, padding: 14, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <CalendarIcon color="currentColor" /> View bookings
        </button>
      </div>
    </div>
  );
}
