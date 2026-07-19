"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { Sparkle } from "../icons";
import { scopedBookings, cleaningGroups, unitColor, fmtWkd } from "@/lib/domain/selectors";

export default function CleaningScreen() {
  const { state, data } = useApp();
  const bk = scopedBookings(data.bookings, state.scope);
  const groups = cleaningGroups(bk, state.autos.batch);

  return (
    <div className="dt-screen" style={{ padding: "16px 16px 24px" }}>
      <div style={{ background: "rgba(255,159,69,.1)", border: "1px solid rgba(255,159,69,.26)", borderRadius: 14, padding: 14, marginBottom: 16, display: "flex", gap: 11 }}>
        <Sparkle size={18} color={C.dunes} style={{ flex: "0 0 auto", marginTop: 1 }} />
        <div style={{ color: C.body, fontSize: 13, lineHeight: 1.5 }}>
          Turnovers auto-schedule from your checkouts. When both units flip together — or a whole-house week ends — Tide books a single combined visit. Toggle it in Automations.
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {groups.map((cl, i) => (
          <div key={i} style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ color: C.ink, fontSize: 15, fontWeight: 600 }}>{fmtWkd(cl.date)}</div>
              {cl.combined && <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".04em", color: C.ink, background: C.dunes, padding: "3px 9px", borderRadius: 100 }}>COMBINED · 1 TRIP</span>}
              <span style={{ marginLeft: "auto", color: C.muted, fontSize: 12 }}>{cl.combined ? "11:00 AM – 2:00 PM" : "11:00 AM – 12:30 PM"}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 10 }}>
              {cl.units.map((u) => (
                <span key={u} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(0,0,0,.05)", padding: "5px 11px", borderRadius: 100 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: unitColor(u) }} />
                  <span style={{ color: C.body, fontSize: 12 }}>{u}</span>
                </span>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.hair}` }}>
              <span style={{ color: C.muted, fontSize: 12.5 }}>Coastal Turnovers Co.</span>
              {cl.combined && <span style={{ color: C.dunes, fontSize: 12.5, fontWeight: 600 }}>Saved $45</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
