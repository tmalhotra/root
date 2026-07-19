"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { reservationsByCheckIn, initials, unitColor, unitLabel, status, fmtMD, toDate } from "@/lib/domain/selectors";
import type { Booking } from "@/lib/domain/types";

export default function ReservationList({ bookings }: { bookings: Booking[] }) {
  const { set, today } = useApp();
  const rows = reservationsByCheckIn(bookings);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {rows.map((b) => {
        const st = status(b, today);
        const color = unitColor(b.unit);
        return (
          <button
            key={b.id}
            onClick={() => set({ selBookingId: b.id, codeConfirm: false })}
            style={{ textAlign: "left", display: "flex", alignItems: "center", gap: 13, background: C.card, border: `1px solid ${C.hair}`, borderLeft: `3px solid ${color}`, borderRadius: 14, padding: "13px 14px", cursor: "pointer" }}
          >
            <div style={{ width: 40, height: 40, flex: "0 0 auto", borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, fontWeight: 700, fontSize: 14 }}>{initials(b.guest)}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: C.ink, fontSize: 14.5, fontWeight: 600 }}>{b.guest}</div>
              <div style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{fmtMD(toDate(b.s))} – {fmtMD(toDate(b.e))} · {b.ch}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: st.color, fontSize: 11, fontWeight: 600 }}>{st.label}</div>
              <div style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{unitLabel(b.unit)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
