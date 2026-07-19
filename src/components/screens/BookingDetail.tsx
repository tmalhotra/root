"use client";
import { useApp } from "../store";
import { C, FONT_MONO, display } from "../tokens";
import { Lock, Refresh, Chat } from "../icons";
import {
  unitColor,
  unitLabel,
  initials,
  status,
  channelInfo,
  nights,
  money,
  genDoorCode,
  fmtWkd,
  fmtMD,
  toDate,
} from "@/lib/domain/selectors";

const IN_TIME = { Dunes: "3 PM", Tides: "2 PM", Both: "3 PM" } as const;
const OUT_TIME = { Dunes: "10 AM", Tides: "12 PM", Both: "11 AM" } as const;

export default function BookingDetailScreen() {
  const { state, set, data, today } = useApp();
  const b = data.bookings.find((x) => x.id === state.selBookingId);
  if (!b) return null;

  const color = unitColor(b.unit);
  const st = status(b, today);
  const ci = channelInfo(b.ch);
  const inTime = IN_TIME[b.unit];
  const outTime = OUT_TIME[b.unit];
  const doorCode = state.codeOverrides[b.id] || genDoorCode(b);
  const lockOn = state.autos.lock;
  const codeConfirm = state.codeConfirm;

  const messageGuest = () => {
    const tr = data.threads.find((t) => t.name === b.guest);
    set({ selBookingId: null, openThreadId: tr ? tr.id : data.threads[0]?.id ?? null });
  };
  const changeCode = () =>
    set((s) => ({ codeOverrides: { ...s.codeOverrides, [b.id]: String(Math.floor(1000 + Math.random() * 9000)) }, codeConfirm: false }));

  const cell = (label: string, value: string) => (
    <div style={{ background: C.card, padding: "13px 14px" }}>
      <div style={{ color: C.muted, fontSize: 11, letterSpacing: ".1em" }}>{label}</div>
      <div style={{ color: C.ink, fontSize: 14, marginTop: 3, fontWeight: 500 }}>{value}</div>
    </div>
  );

  return (
    <div className="dt-screen" style={{ padding: "18px 16px 32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: color }} />
        <span style={display(22)}>{unitLabel(b.unit)}</span>
        <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 600, color: st.color, background: "rgba(0,0,0,.06)", padding: "5px 11px", borderRadius: 100 }}>{st.label}</span>
      </div>

      <div style={{ background: C.card, border: `1px solid ${C.hair2}`, borderRadius: 18, padding: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{ width: 46, height: 46, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, fontWeight: 700, fontSize: 16 }}>{initials(b.guest)}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.ink, fontSize: 17, fontWeight: 600 }}>{b.guest}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 4 }}>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 22, height: 20, padding: "0 6px", borderRadius: 6, background: ci.bg, color: ci.fg, fontSize: 10, fontWeight: 700, letterSpacing: ".02em" }}>{ci.mark}</span>
              <span style={{ color: C.muted, fontSize: 12 }}>Booked via {b.ch}</span>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "rgba(0,0,0,.08)", borderRadius: 12, overflow: "hidden" }}>
          {cell("CHECK-IN", `${fmtWkd(toDate(b.s))}, ${inTime}`)}
          {cell("CHECK-OUT", `${fmtWkd(toDate(b.e))}, ${outTime}`)}
          {cell("GUESTS", `${b.guests} guests`)}
          {cell("NIGHTS", `${nights(b)} nights`)}
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.hair2}` }}>
          <span style={{ color: C.muted, fontSize: 13 }}>Net payout</span>
          <span style={{ ...display(24), color: C.accent }}>{money(b.payout)}</span>
        </div>
      </div>

      {/* door code */}
      {lockOn && (
        <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.hair2}`, borderRadius: 18, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".1em" }}>
            <Lock color={C.accent} /> YALE DOOR CODE
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 30, fontWeight: 700, letterSpacing: ".2em", color: C.ink }}>{doorCode}</div>
            {codeConfirm ? (
              <span style={{ color: C.muted, fontSize: 12 }}>Replace code?</span>
            ) : (
              <button onClick={() => set({ codeConfirm: true })} style={{ display: "flex", alignItems: "center", gap: 6, background: "rgba(32,183,230,.12)", border: "none", color: C.accentDeep, fontSize: 13, fontWeight: 600, padding: "9px 14px", borderRadius: 100, cursor: "pointer" }}>
                <Refresh color="currentColor" /> Change
              </button>
            )}
          </div>
          {codeConfirm ? (
            <div style={{ marginTop: 12, padding: "12px 14px", background: "rgba(255,159,69,.1)", border: "1px solid rgba(255,159,69,.3)", borderRadius: 12 }}>
              <div style={{ color: C.body, fontSize: 12.5, lineHeight: 1.45 }}>This immediately reprograms the Yale lock and texts the new code to the guest. Continue?</div>
              <div style={{ display: "flex", gap: 8, marginTop: 11 }}>
                <button onClick={() => set({ codeConfirm: false })} style={{ flex: 1, background: "rgba(0,0,0,.05)", border: "none", color: C.muted, fontSize: 13, fontWeight: 600, padding: 10, borderRadius: 10, cursor: "pointer" }}>Cancel</button>
                <button onClick={changeCode} style={{ flex: 1, background: C.dunes, border: "none", color: C.ink, fontSize: 13, fontWeight: 600, padding: 10, borderRadius: 10, cursor: "pointer" }}>Yes, change code</button>
              </div>
            </div>
          ) : (
            <div style={{ color: C.muted, fontSize: 12, marginTop: 10, lineHeight: 1.4 }}>
              Active {fmtMD(toDate(b.s))}, {inTime} → {fmtMD(toDate(b.e))}, {outTime} — Yale programs it automatically and expires it at checkout.
            </div>
          )}
        </div>
      )}

      <button onClick={messageGuest} style={{ width: "100%", marginTop: 14, background: C.accent, border: "none", color: C.ink, fontWeight: 600, fontSize: 15, padding: 14, borderRadius: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        <Chat color="currentColor" /> Message guest
      </button>
    </div>
  );
}
