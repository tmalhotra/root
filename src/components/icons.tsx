/** Line icons (Tabler/Lucide style, 1.6–1.8 stroke) used across the app.
 *  Paths are lifted from the design prototype. */
import type { CSSProperties } from "react";

interface IconProps {
  size?: number;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
}

function Line({ size = 20, color = "currentColor", strokeWidth = 1.8, style, d }: IconProps & { d: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <path d={d} />
    </svg>
  );
}

export const ChevronLeft = (p: IconProps) => <Line {...p} d="M15 5l-7 7 7 7" />;
export const ChevronRight = (p: IconProps) => <Line {...p} d="M9 6l6 6-6 6" />;
export const ChevronDown = (p: IconProps) => <Line {...p} d="M6 9l6 6 6-6" />;
export const Plus = (p: IconProps) => <Line {...p} d="M12 5v14M5 12h14" />;
export const Check = (p: IconProps) => <Line {...p} d="M20 6L9 17l-5-5" />;
export const CheckThick = (p: IconProps) => <Line strokeWidth={2} {...p} d="M5 12l5 5 9-11" />;

export const Pin = ({ size = 14, color = "currentColor", strokeWidth = 1.7, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} style={style}>
    <path d="M12 21s-7-5.2-7-11a7 7 0 0 1 14 0c0 5.8-7 11-7 11z" />
    <circle cx="12" cy="10" r="2.5" />
  </svg>
);

export const Lock = ({ size = 14, color = "currentColor", strokeWidth = 1.8, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);

export const Refresh = ({ size = 15, color = "currentColor", strokeWidth = 1.8, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M4 12a8 8 0 0 1 13.7-5.6L20 8" />
    <path d="M20 4v4h-4" />
    <path d="M20 12a8 8 0 0 1-13.7 5.6L4 16" />
    <path d="M4 20v-4h4" />
  </svg>
);

export const Broom = ({ size = 14, color = "currentColor", strokeWidth = 1.8, style }: IconProps) => (
  <Line size={size} color={color} strokeWidth={strokeWidth} style={style} d="M14 4l6 6l-4 4l-6 -6z M13 11l-6 6 M17 15l-6 6 M4 20l3.5 -3.5" />
);

export const Sparkle = ({ size = 13, color = "currentColor", style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
    <path d="M12 2l1.9 5.6L19.5 9.5 13.9 11.4 12 17l-1.9-5.6L4.5 9.5 10.1 7.6z" />
  </svg>
);

export const Send = ({ size = 20, color = "currentColor", style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
    <path d="M3 20l18-8L3 4l4 8z" />
  </svg>
);

export const Chat = (p: IconProps) => <Line {...p} d="M4 5h16v11H8l-4 3z" />;

export const CalendarIcon = ({ size = 18, color = "currentColor", strokeWidth = 1.8, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
  </svg>
);

export const Building = ({ size = 20, color = "currentColor", strokeWidth = 1.7, style }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
    <path d="M4 20V6l8-3 8 3v14" />
    <path d="M9 20v-5h6v5" />
  </svg>
);

// ── bottom nav ────────────────────────────────────────────────────────────────
export const NavHome = ({ size = 23, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 11l8-7 8 7" />
    <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
  </svg>
);
export const NavBookings = ({ size = 23, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="5" width="16" height="15" rx="2" />
    <path d="M4 9h16M8 3v4M16 3v4" />
    <rect x="7" y="12" width="3" height="3" rx="0.5" fill={color} stroke="none" />
    <rect x="14" y="12" width="3" height="3" rx="0.5" fill={color} stroke="none" />
  </svg>
);
export const NavInbox = ({ size = 23, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 5h16v11H8l-4 3z" />
  </svg>
);
export const NavMore = ({ size = 23, color = "currentColor" }: IconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="4" width="7" height="7" rx="1.5" />
    <rect x="13" y="4" width="7" height="7" rx="1.5" />
    <rect x="4" y="13" width="7" height="7" rx="1.5" />
    <rect x="13" y="13" width="7" height="7" rx="1.5" />
  </svg>
);

/** iOS-style status bar glyphs (signal + battery). */
export const StatusBarGlyphs = () => (
  <span style={{ display: "flex", gap: 6, alignItems: "center", opacity: 0.9 }}>
    <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor">
      <rect x="0" y="6" width="3" height="5" rx="1" />
      <rect x="4.5" y="4" width="3" height="7" rx="1" />
      <rect x="9" y="2" width="3" height="9" rx="1" />
      <rect x="13.5" y="0" width="3" height="11" rx="1" />
    </svg>
    <svg width="22" height="11" viewBox="0 0 22 11" fill="none">
      <rect x="1" y="1" width="18" height="9" rx="2.5" stroke="currentColor" opacity=".5" />
      <rect x="2.5" y="2.5" width="13" height="6" rx="1.2" fill="currentColor" />
      <rect x="20" y="4" width="1.5" height="3.5" rx="1" fill="currentColor" opacity=".5" />
    </svg>
  </span>
);
