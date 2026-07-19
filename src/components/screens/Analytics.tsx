"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { scopedBookings, kpis, revenueByMonth, channelSplit } from "@/lib/domain/selectors";

export default function AnalyticsScreen() {
  const { state, data } = useApp();
  const bk = scopedBookings(data.bookings, state.scope);
  const stats = kpis(bk, state.scope);
  const bars = revenueByMonth(bk);
  const channels = channelSplit(bk);

  return (
    <div className="dt-screen" style={{ padding: "16px 16px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {stats.map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 14 }}>
            <div style={{ color: C.muted, fontSize: 11, letterSpacing: ".08em" }}>{k.label}</div>
            <div style={{ fontFamily: "'Unbounded','Poppins',sans-serif", fontStyle: "italic", color: C.ink, fontSize: 26, marginTop: 5 }}>{k.value}</div>
          </div>
        ))}
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 16, marginTop: 14 }}>
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".12em" }}>REVENUE BY MONTH · 2026</div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, height: 140, marginTop: 16 }}>
          {bars.map((bar) => (
            <div key={bar.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, justifyContent: "flex-end", height: "100%" }}>
              <div style={{ width: "100%", borderRadius: "6px 6px 0 0", height: Math.round(bar.fraction * 118) + "px", background: bar.isMax ? C.accent : "rgba(32,183,230,.28)" }} />
              <span style={{ fontSize: 11, color: bar.isMax ? C.ink : C.muted }}>{bar.m}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 16, marginTop: 14 }}>
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".12em", marginBottom: 14 }}>REVENUE BY CHANNEL</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {channels.map((cs) => (
            <div key={cs.name}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ color: C.body, fontSize: 13 }}>{cs.name}</span>
                <span style={{ color: C.accent, fontSize: 13, fontWeight: 600 }}>{cs.pct}</span>
              </div>
              <div style={{ height: 8, background: "rgba(0,0,0,.06)", borderRadius: 100, overflow: "hidden" }}>
                <div style={{ height: "100%", width: cs.pct, background: C.accent, borderRadius: 100 }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
