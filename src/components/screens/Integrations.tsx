"use client";
import { useApp } from "../store";
import { C } from "../tokens";
import { Lock, Check } from "../icons";
import { PMS_INTEGRATIONS, CHANNEL_INTEGRATIONS } from "../content";

function SectionLabel({ children, mt = 0 }: { children: React.ReactNode; mt?: number }) {
  return <div style={{ color: C.muted, fontSize: 11, fontWeight: 600, letterSpacing: ".16em", margin: `${mt}px 0 12px` }}>{children}</div>;
}

export default function IntegrationsScreen() {
  const { data, state, set } = useApp();
  const live = data.source === "ownerrez";

  return (
    <div className="dt-screen" style={{ padding: "16px 16px 24px" }}>
      <div style={{ color: C.muted, fontSize: 13, lineHeight: 1.5, marginBottom: 16 }}>
        OwnerRez is the hub. Airbnb connects to it natively and VRBLI feeds in over iCal — every booking, rate, and block syncs through OwnerRez, and this app reads it all from there.
      </div>

      <SectionLabel>PROPERTY MANAGEMENT SYSTEM</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {PMS_INTEGRATIONS.map((p) => (
          <div key={p.name} style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 15 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 42, height: 42, flex: "0 0 auto", borderRadius: 12, background: p.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: p.iconFg, fontWeight: 700, fontSize: 13 }}>{p.mark}</div>
              <div style={{ flex: 1 }}>
                <div style={{ color: C.ink, fontSize: 15, fontWeight: 600 }}>{p.name}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: live ? C.accent : C.dunes }} />
                  <span style={{ color: C.muted, fontSize: 12 }}>{live ? p.sub : "Not connected · showing demo data"}</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
              <button style={{ flex: 1, background: "rgba(32,183,230,.12)", border: "none", color: C.accent, fontSize: 13, fontWeight: 600, padding: 10, borderRadius: 10, cursor: "pointer" }}>Sync now</button>
              <button style={{ flex: 1, background: "rgba(0,0,0,.05)", border: "none", color: C.muted, fontSize: 13, padding: 10, borderRadius: 10, cursor: "pointer" }}>Settings</button>
            </div>
          </div>
        ))}
      </div>

      <SectionLabel mt={22}>CHANNELS · VIA OWNERREZ</SectionLabel>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {CHANNEL_INTEGRATIONS.map((c) => (
          <div key={c.name} style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 15, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, flex: "0 0 auto", borderRadius: 12, background: c.iconBg, display: "flex", alignItems: "center", justifyContent: "center", color: c.iconFg, fontWeight: 700, fontSize: 13 }}>{c.mark}</div>
            <div style={{ flex: 1 }}>
              <div style={{ color: C.ink, fontSize: 15, fontWeight: 600 }}>{c.name}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
                <span style={{ color: C.muted, fontSize: 12 }}>{c.sub}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <SectionLabel mt={22}>SMART HOME</SectionLabel>
      <div style={{ background: C.card, border: `1px solid ${C.hair}`, borderRadius: 16, padding: 15 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 42, height: 42, flex: "0 0 auto", borderRadius: 12, background: "rgba(32,183,230,.14)", display: "flex", alignItems: "center", justifyContent: "center", color: C.accent }}>
            <Lock size={20} color={C.accent} strokeWidth={1.7} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.ink, fontSize: 15, fontWeight: 600 }}>Yale Smart Lock</div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: C.accent }} />
              <span style={{ color: C.muted, fontSize: 12 }}>Tides &amp; Dunes keypads</span>
            </div>
          </div>
        </div>
        {state.autos.lock && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, padding: "10px 12px", background: "rgba(32,183,230,.08)", borderRadius: 10, color: C.accentDeep, fontSize: 12, fontWeight: 500 }}>
            <Check size={15} color="currentColor" /> Codes auto-rotate every stay
          </div>
        )}
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button onClick={() => set({ tab: "bookings", moreView: null, openThreadId: null, selBookingId: null, selListing: null })} style={{ flex: 1, background: "rgba(32,183,230,.12)", border: "none", color: C.accent, fontSize: 13, fontWeight: 600, padding: 10, borderRadius: 10, cursor: "pointer" }}>Manage codes</button>
          <button style={{ flex: 1, background: "rgba(0,0,0,.05)", border: "none", color: C.muted, fontSize: 13, padding: 10, borderRadius: 10, cursor: "pointer" }}>Settings</button>
        </div>
      </div>
    </div>
  );
}
