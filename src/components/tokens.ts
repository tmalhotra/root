/** Design tokens as TS constants, for use in inline styles.
 *  Mirrors the CSS variables in globals.css — keep the two in sync. */
export const C = {
  screen: "#F4F2ED",
  card: "#FFFFFF",
  ink: "#1D1D1B",
  body: "#2b2823",
  muted: "#6f6a62",
  faint: "#8f8a82",
  accent: "#20B7E6",
  accentDeep: "#0e7fa6",
  dunes: "#FF9F45",
  whole: "#FF6F61",
  airbnb: "#FF5A5F",
  vrbli: "#245ABC",
  danger: "#E5484D",
  hair: "rgba(0,0,0,.07)",
  hair2: "rgba(0,0,0,.08)",
} as const;

// Display face. The design specifies Mafinest with a Poppins fallback; since
// Mafinest isn't freely available we render the Poppins fallback (italic) —
// exactly what the design mockups fall back to. Do NOT prepend another display
// font here; it shifts the weights/letterforms off the design.
export const FONT_DISPLAY = "'Poppins',system-ui,sans-serif";
export const FONT_MONO = "ui-monospace,'SF Mono',monospace";

/** Reusable inline style fragment for the italic uppercase display face. */
export const display = (size: number, color: string = C.ink): React.CSSProperties => ({
  fontFamily: FONT_DISPLAY,
  fontStyle: "italic",
  textTransform: "uppercase",
  color,
  fontSize: size,
  lineHeight: 1,
});
