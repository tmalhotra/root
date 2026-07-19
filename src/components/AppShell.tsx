"use client";

import { useApp } from "./store";
import { C } from "./tokens";
import { StatusBarGlyphs, ChevronLeft, NavHome, NavBookings, NavInbox, NavMore, ChevronDown } from "./icons";
import HomeScreen from "./screens/Home";
import BookingsScreen from "./screens/Bookings";
import InboxScreen from "./screens/Inbox";
import ThreadScreen from "./screens/Thread";
import BookingDetailScreen from "./screens/BookingDetail";
import ListingDetailScreen from "./screens/ListingDetail";
import MoreScreen from "./screens/More";
import ListingsScreen from "./screens/Listings";
import CleaningScreen from "./screens/Cleaning";
import AutomationsScreen from "./screens/Automations";
import AnalyticsScreen from "./screens/Analytics";
import IntegrationsScreen from "./screens/Integrations";
import ReservationsScreen from "./screens/Reservations";
import ScopeSheet from "./sheets/ScopeSheet";
import PropertySheet from "./sheets/PropertySheet";

const SCOPE_LABEL: Record<string, string> = { all: "All listings", p1: "123 East Herbert St", Tides: "Tides", Dunes: "Dunes" };
const SCOPE_SUB: Record<string, string> = { all: "1 property · 2 units", p1: "Both units", Tides: "Upstairs · Oceanfront", Dunes: "Downstairs · Oceanfront" };
const MORE_LABELS: Record<string, string> = { reservations: "Reservations", cleaning: "Cleaning schedule", automations: "Automations", analytics: "Analytics", connections: "Integrations" };

export default function AppShell() {
  const { state, set, data } = useApp();
  const { tab, moreView, openThreadId, selBookingId, selListing, scope } = state;

  const inThread = !!openThreadId;
  const inBooking = !!selBookingId;
  const inListing = !!selListing;
  const showTabs = !inThread && !inBooking && !inListing;
  const isMore = tab === "more";
  const showBack = inThread || inBooking || inListing || (isMore && !!moreView);
  const showSwitcher = !showBack;
  const showScope = showTabs && (tab === "home" || tab === "bookings");
  const showNav = !inThread;

  const thread = inThread ? data.threads.find((t) => t.id === openThreadId) : undefined;
  const barTitle = inThread ? thread?.name : inBooking ? "Reservation" : inListing ? "Listing" : moreView ? MORE_LABELS[moreView] : "";
  const barSub = inThread && thread ? `${thread.unit} · ${thread.ch}` : "";

  const goBack = () => {
    if (inThread) set({ openThreadId: null });
    else if (inBooking) set({ selBookingId: null });
    else if (inListing) set({ selListing: null });
    else set({ moreView: null });
  };

  const navColor = (t: string) => (tab === t && showTabs ? C.accent : "#807b72");
  const hasUnread = data.threads.some((t) => t.unread);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 404,
          height: "min(872px, calc(100vh - 40px))",
          background: C.screen,
          borderRadius: 44,
          border: "1px solid #4a4640",
          boxShadow: "0 30px 70px rgba(60,60,80,.22), inset 0 0 0 6px #0f0d0b",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* status bar */}
        <div style={{ height: 44, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 26px 0 30px", color: C.ink, fontSize: 14, fontWeight: 600, letterSpacing: ".02em" }}>
          <span>9:41</span>
          <StatusBarGlyphs />
        </div>

        {/* app bar */}
        <div style={{ flex: "0 0 auto", minHeight: 56, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", borderBottom: `1px solid ${C.hair}` }}>
          {showBack ? (
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <button onClick={goBack} aria-label="Back" style={{ width: 34, height: 34, flex: "0 0 auto", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.06)", border: "none", borderRadius: "50%", color: C.ink, cursor: "pointer" }}>
                <ChevronLeft />
              </button>
              <div style={{ minWidth: 0 }}>
                <div style={{ color: C.ink, fontSize: 15, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{barTitle}</div>
                {barSub && <div style={{ color: C.muted, fontSize: 11, marginTop: 1 }}>{barSub}</div>}
              </div>
            </div>
          ) : null}
          {showSwitcher && (
            <div style={{ fontFamily: "'Unbounded','Poppins',sans-serif", fontStyle: "italic", fontSize: 20, letterSpacing: ".01em", color: C.ink, textTransform: "uppercase", paddingLeft: 4 }}>
              Dunes <span style={{ color: C.accent }}>+</span> Tides
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "0 0 auto" }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#20B7E6,#0d7ea6)", display: "flex", alignItems: "center", justifyContent: "center", color: C.ink, fontWeight: 700, fontSize: 12.5 }}>SK</div>
          </div>
        </div>

        {/* scope bar */}
        {showScope && (
          <div style={{ flex: "0 0 auto", padding: "10px 12px", borderBottom: `1px solid ${C.hair}` }}>
            <button onClick={() => set({ scopeOpen: true })} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 14px", border: "1px solid rgba(0,0,0,.09)", borderRadius: 12, background: C.card, cursor: "pointer", width: "100%", textAlign: "left" }}>
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".14em", color: C.muted }}>VIEWING</span>
              <span style={{ color: C.ink, fontSize: 13.5, fontWeight: 600 }}>{SCOPE_LABEL[scope]}</span>
              <span style={{ color: C.muted, fontSize: 11.5 }}>· {SCOPE_SUB[scope]}</span>
              <ChevronDown size={17} color={C.muted} style={{ marginLeft: "auto" }} />
            </button>
          </div>
        )}

        {/* scroll area */}
        <div className="dt-scroll" style={{ flex: "1 1 auto", overflowY: "auto", overflowX: "hidden" }}>
          {inThread && thread ? (
            <ThreadScreen thread={thread} />
          ) : inBooking ? (
            <BookingDetailScreen />
          ) : inListing ? (
            <ListingDetailScreen />
          ) : (
            <ActiveTab />
          )}
        </div>

        {/* bottom nav */}
        {showNav && (
          <div style={{ flex: "0 0 auto", display: "flex", justifyContent: "space-around", alignItems: "center", padding: "8px 6px 20px", borderTop: `1px solid ${C.hair2}`, background: "rgba(255,255,255,.75)" }}>
            <NavButton label="Home" color={navColor("home")} onClick={() => set({ tab: "home", moreView: null, openThreadId: null, selBookingId: null, selListing: null })}>
              <NavHome color={navColor("home")} />
            </NavButton>
            <NavButton label="Bookings" color={navColor("bookings")} onClick={() => set({ tab: "bookings", moreView: null, openThreadId: null, selBookingId: null, selListing: null })}>
              <NavBookings color={navColor("bookings")} />
            </NavButton>
            <NavButton label="Inbox" color={navColor("inbox")} onClick={() => set({ tab: "inbox", moreView: null, openThreadId: null, selBookingId: null, selListing: null })}>
              <span style={{ position: "relative", display: "inline-flex" }}>
                <NavInbox color={navColor("inbox")} />
                {hasUnread && <span style={{ position: "absolute", top: -2, right: -3, width: 9, height: 9, borderRadius: "50%", background: C.danger, border: `1.5px solid ${C.screen}` }} />}
              </span>
            </NavButton>
            <NavButton label="More" color={navColor("more")} onClick={() => set({ tab: "more", moreView: null, openThreadId: null, selBookingId: null, selListing: null })}>
              <NavMore color={navColor("more")} />
            </NavButton>
          </div>
        )}

        {/* sheets */}
        {state.scopeOpen && <ScopeSheet />}
        {state.propSheetOpen && <PropertySheet />}
      </div>
    </div>
  );
}

function NavButton({ label, color, onClick, children }: { label: string; color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} style={{ background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", padding: "4px 12px", color }}>
      {children}
      <span style={{ fontSize: 10, fontWeight: 500 }}>{label}</span>
    </button>
  );
}

/** Route the active tab / moreView to a screen. */
function ActiveTab() {
  const { state } = useApp();
  const { tab, moreView } = state;
  if (tab === "home") return <HomeScreen />;
  if (tab === "bookings") return <BookingsScreen />;
  if (tab === "inbox") return <InboxScreen />;
  if (tab === "listings") return <ListingsScreen />;
  if (tab === "more") {
    if (!moreView) return <MoreScreen />;
    if (moreView === "reservations") return <ReservationsScreen />;
    if (moreView === "cleaning") return <CleaningScreen />;
    if (moreView === "automations") return <AutomationsScreen />;
    if (moreView === "analytics") return <AnalyticsScreen />;
    if (moreView === "connections") return <IntegrationsScreen />;
  }
  return null;
}
