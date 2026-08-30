"use client";
/* eslint-disable @next/next/no-img-element */
import { useApp } from "../store";
import { C } from "../tokens";
import { Pin } from "../icons";
import { SCOPE_HERO } from "../content";
import {
  scopedBookings,
  todayItems,
  kpis,
  revenueByMonth,
  channelSplit,
  bookedLabelK,
  unitColor,
  unitLabel,
} from "@/lib/domain/selectors";
import type { Scope } from "@/lib/domain/types";

const HERO_TITLE: Record<Scope, string> = { all: "Long Beach Island", p1: "Dunes & Tides", Tides: "Tides", Dunes: "Dunes" };
const HERO_EYEBROW: Record<Scope, string> = { all: "", p1: "", Tides: "DUNES & TIDES", Dunes: "DUNES & TIDES" };
const HERO_DOT: Record<Scope, string> = { all: C.accent, p1: C.whole, Tides: C.accent, Dunes: C.dunes };
const SCOPE_ADDR: Record<Scope, string> = {
  all: "Long Beach Island, NJ",
  p1: "123 East Herbert St · Long Beach, NJ",
  Tides: "123 East Herbert St · Upstairs",
  Dunes: "123 East Herbert St · Downstairs",
};

const tagBg = (color: string) =>
  color === C.accent ? "rgba(32,183,230,.12)" : color === C.dunes ? "rgba(255,159,69,.14)" : "rgba(255,111,97,.14)";

export default function HomeScreen() {
  const { state, set, data, today } = useApp();
  const scope = state.scope;
  const bk = scopedBookings(data.bookings, scope);

  const items = todayItems(bk, today);
  const stats = kpis(bk, scope);
  const bars = revenueByMonth(bk);
  const channels = channelSplit(bk);

  return (
    <div className="dt-screen" style={{ padding: "0 16px 24px" }}>
      {/* hero */}
      <div style={{ position: "relative", height: 230, margin: "0 -10px 6px", borderRadius: 2, overflow: "hidden" }}>
        <img src={SCOPE_HERO[scope]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, #F4F2ED 0.5%, rgba(244,242,237,0) 26%), linear-gradient(to top, rgba(12,10,7,.9) 4%, rgba(12,10,7,.42) 50%, rgba(12,10,7,.5))" }} />
        <div style={{ position: "absolute", left: 16, right: 16, bottom: 20 }}>
          {HERO_EYEBROW[scope] && (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: HERO_DOT[scope] }} />
              <span style={{ color: "rgba(255,255,255,.92)", fontSize: 11, fontWeight: 700, letterSpacing: ".2em" }}>{HERO_EYEBROW[scope]}</span>
            </div>
          )}
          <div style={{ fontFamily: "'Poppins',sans-serif", fontStyle: "italic", fontWeight: 900, WebkitTextStroke: "1.6px #FFFFFF", textTransform: "uppercase", color: "#FFFFFF", fontSize: 32, lineHeight: 0.98, marginTop: 9, textShadow: "0 2px 24px rgba(0,0,0,.4)" }}>
            {HERO_TITLE[scope]}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 9, color: "rgba(255,255,255,.82)", fontSize: 12.5, fontWeight: 500 }}>
            <Pin color="currentColor" /> {SCOPE_ADDR[scope]}
          </div>
        </div>
      </div>

      {/* today */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".16em" }}>TODAY · {items.length} movements</div>
        <button onClick={() => set({ tab: "more", moreView: "reservations", openThreadId: null, selBookingId: null })} style={{ background: "none", border: "none", color: C.accent, fontSize: 12, cursor: "pointer" }}>
          All reservations
        </button>
      </div>
      <div className="dt-hscroll" style={{ display: "flex", gap: 12, marginTop: 12, overflowX: "auto", paddingBottom: 4 }}>
        {items.map((t) => {
          const color = unitColor(t.booking.unit);
          return (
            <button key={t.booking.id + t.tag} onClick={() => set({ selBookingId: t.booking.id, codeConfirm: false })} style={{ flex: "0 0 auto", width: 196, textAlign: "left", background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 0, cursor: "pointer", overflow: "hidden" }}>
              <div style={{ height: 5, background: color }} />
              <div style={{ padding: "13px 14px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px", borderRadius: 100, background: tagBg(color) }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
                  <span style={{ color, fontSize: 10.5, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" }}>{t.tag}</span>
                </div>
                <div style={{ color: C.ink, fontSize: 15, fontWeight: 600, marginTop: 10, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.booking.guest}</div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.detail}</div>
                <div style={{ color: C.faint, fontSize: 11, marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(0,0,0,.06)" }}>{unitLabel(t.booking.unit)}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* KPI grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 20 }}>
        {stats.map((k) => (
          <div key={k.label} style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 14 }}>
            <div style={{ color: C.muted, fontSize: 11, letterSpacing: ".1em" }}>{k.label}</div>
            <div style={{ fontFamily: "'Poppins',sans-serif", fontStyle: "italic", color: C.ink, fontSize: 26, marginTop: 5 }}>{k.value}</div>
            <div style={{ color: C.accent, fontSize: 11, marginTop: 2 }}>{k.delta}</div>
          </div>
        ))}
      </div>

      {/* revenue */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22 }}>
        <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".16em" }}>REVENUE · 2026</div>
        <div style={{ color: C.accent, fontSize: 12, fontWeight: 600 }}>{bookedLabelK(bk)} booked</div>
      </div>
      <div style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 16, marginTop: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 10, height: 130 }}>
          {bars.map((bar) => (
            <div key={bar.m} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, justifyContent: "flex-end", height: "100%" }}>
              <div style={{ width: "100%", borderRadius: "6px 6px 0 0", height: Math.round(bar.fraction * 100) + "px", background: bar.isMax ? C.accent : "rgba(32,183,230,.28)" }} />
              <span style={{ fontSize: 11, color: bar.isMax ? C.ink : C.muted }}>{bar.m}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18, paddingTop: 16, borderTop: `1px solid ${C.hair}` }}>
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
