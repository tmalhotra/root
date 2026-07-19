"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { display } from "../tokens";
import { ChevronLeft, ChevronRight, Broom } from "../icons";
import ReservationList from "../ui/ReservationList";
import {
  scopedBookings,
  buildMonthGrid,
  staysOnDay,
  unitColor,
  unitLabel,
  fmtWkd,
} from "@/lib/domain/selectors";
import type { CalBar } from "@/lib/domain/selectors";

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const LEGEND = [
  { label: "Tides", color: C.accent },
  { label: "Dunes", color: C.dunes },
  { label: "Whole house", color: C.whole },
];

function toggleStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 14px",
    borderRadius: 8,
    fontSize: 12.5,
    fontWeight: 600,
    border: "none",
    cursor: "pointer",
    background: active ? C.accent : "transparent",
    color: active ? C.ink : C.muted,
  };
}

function barStyle(b: CalBar): React.CSSProperties {
  const pos: React.CSSProperties =
    b.lane === "both"
      ? { top: 1, bottom: 1 }
      : b.lane === 0
        ? { top: 1, height: 15 }
        : { top: 18, height: 15 };
  const r = (side: boolean) => (side ? "7px" : "2px");
  return {
    position: "absolute",
    left: `calc(${(b.startCol / 7) * 100}% + 2px)`,
    width: `calc(${(b.span / 7) * 100}% - 4px)`,
    ...pos,
    background: b.color,
    borderRadius: `${r(b.startsHere)} ${r(b.endsHere)} ${r(b.endsHere)} ${r(b.startsHere)}`,
    display: "flex",
    alignItems: "center",
    padding: "0 6px",
    overflow: "hidden",
    cursor: "pointer",
    zIndex: 1,
  };
}

export default function BookingsScreen() {
  const { state, set, data, today } = useApp();
  const { scope, bookingsView, calOffset, selDay } = state;
  const bk = scopedBookings(data.bookings, scope);
  const isList = bookingsView === "list";

  const Toggle = (
    <div style={{ display: "flex", gap: 3, background: "rgba(0,0,0,.05)", borderRadius: 10, padding: 3 }}>
      <button onClick={() => set({ bookingsView: "month" })} style={toggleStyle(!isList)}>Monthly</button>
      <button onClick={() => set({ bookingsView: "list" })} style={toggleStyle(isList)}>List</button>
    </div>
  );

  if (isList) {
    return (
      <div className="dt-screen" style={{ padding: "18px 16px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={display(28)}>Bookings</div>
          {Toggle}
        </div>
        <div style={{ color: C.muted, fontSize: 12.5, marginTop: 8 }}>{bk.length} stays · 2026 season</div>
        <div style={{ marginTop: 16 }}>
          <ReservationList bookings={bk} />
        </div>
      </div>
    );
  }

  const grid = buildMonthGrid(bk, scope, calOffset, today);
  const selStays = selDay ? staysOnDay(bk, selDay) : [];
  const selLabel = selDay ? fmtWkd(new Date(Number(selDay.split("-")[0]), Number(selDay.split("-")[1]), Number(selDay.split("-")[2]))) : "";

  return (
    <div className="dt-screen" style={{ padding: "18px 16px 24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={display(28)}>Bookings</div>
        {Toggle}
      </div>

      {/* month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: C.ink }}>{grid.label}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button onClick={() => set((s) => ({ calOffset: s.calOffset - 1, selDay: null }))} aria-label="Previous month" style={navBtn}><ChevronLeft size={17} strokeWidth={1.9} /></button>
          <button onClick={() => set({ calOffset: 0, selDay: null })} style={{ ...navBtn, width: "auto", padding: "0 12px", fontSize: 12, fontWeight: 500 }}>Today</button>
          <button onClick={() => set((s) => ({ calOffset: s.calOffset + 1, selDay: null }))} aria-label="Next month" style={navBtn}><ChevronRight size={17} strokeWidth={1.9} /></button>
        </div>
      </div>

      {/* weekday header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3, marginTop: 14 }}>
        {WEEKDAYS.map((w, i) => (
          <div key={i} style={{ textAlign: "center", color: C.muted, fontSize: 10.5, fontWeight: 600, paddingBottom: 4 }}>{w}</div>
        ))}
      </div>

      {/* weeks */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 2 }}>
        {grid.weeks.map((wk, wi) => (
          <div key={wi} style={{ position: "relative", height: 56 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", height: "100%" }}>
              {wk.days.map((d) => (
                <div key={d.key} onClick={() => set((s) => ({ selDay: s.selDay === d.key ? null : d.key }))} style={{ position: "relative", cursor: "pointer", borderRight: "1px solid rgba(0,0,0,.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "4px 4px 0" }}>
                    <span style={d.isToday ? todayNum : { fontSize: 11.5, fontWeight: 500, paddingLeft: 2, color: d.inMonth ? C.body : "#c4bfb5" }}>{d.day}</span>
                    {d.hasClean && (
                      <span
                        onClick={(e) => { e.stopPropagation(); set({ tab: "more", moreView: "cleaning", openThreadId: null, selBookingId: null, selListing: null }); }}
                        title="Cleaning turnover"
                        style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 17, height: 17, borderRadius: "50%", background: C.dunes, cursor: "pointer" }}
                      >
                        <Broom size={11} color={C.ink} strokeWidth={2.2} />
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ position: "absolute", left: 0, right: 0, top: 23, bottom: 1 }}>
              {wk.bars.map((b, bi) => (
                <div key={bi} onClick={() => set({ selBookingId: b.bookingId, codeConfirm: false })} style={barStyle(b)}>
                  {b.showName && <span style={{ color: "#122024", fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap" }}>{b.guest}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap" }}>
        {LEGEND.map((l) => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: l.color }} />
            <span style={{ color: C.muted, fontSize: 12 }}>{l.label}</span>
          </div>
        ))}
      </div>

      {/* selected day */}
      {selDay && (
        <div style={{ marginTop: 16, background: C.card, border: `1px solid ${C.hair2}`, borderRadius: 16, padding: 15 }}>
          <div style={{ color: C.ink, fontSize: 14, fontWeight: 600, marginBottom: 10 }}>{selLabel}</div>
          {selStays.length === 0 ? (
            <div style={{ color: C.muted, fontSize: 12.5 }}>No stays on this day.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selStays.map((s) => (
                <button key={s.id} onClick={() => set({ selBookingId: s.id, codeConfirm: false })} style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 11, background: "rgba(0,0,0,.04)", border: "none", borderRadius: 12, padding: "11px 12px", cursor: "pointer" }}>
                  <span style={{ width: 9, height: 9, borderRadius: "50%", background: unitColor(s.unit), flex: "0 0 auto" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ color: C.ink, fontSize: 13.5, fontWeight: 600 }}>{s.guest}</div>
                    <div style={{ color: C.muted, fontSize: 11.5, marginTop: 1 }}>{unitLabel(s.unit)} · {s.ch}</div>
                  </div>
                  <ChevronRight size={16} color={C.muted} />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const navBtn: React.CSSProperties = {
  width: 32,
  height: 32,
  borderRadius: 8,
  border: "none",
  background: "rgba(0,0,0,.06)",
  color: C.body,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const todayNum: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: 20,
  height: 20,
  borderRadius: "50%",
  background: C.accent,
  color: C.ink,
  fontSize: 11,
  fontWeight: 700,
};
