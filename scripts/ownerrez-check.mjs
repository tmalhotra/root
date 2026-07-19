#!/usr/bin/env node
/**
 * OwnerRez connection checker.
 *
 *   node scripts/ownerrez-check.mjs
 *
 * Reads OWNERREZ_EMAIL / OWNERREZ_ACCESS_TOKEN from .env.local (or the
 * environment), calls the live OwnerRez API, and prints your properties, a
 * suggested Tides/Dunes/whole-house id mapping, and a season booking count.
 *
 * Uses `curl` under the hood so it works through an ambient HTTPS proxy (e.g.
 * inside a Claude Code web environment). No dependencies, no build step.
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

function loadEnvLocal() {
  const env = { ...process.env };
  try {
    const txt = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {
    /* no .env.local — rely on process.env */
  }
  return env;
}

function apiGet(path, email, token) {
  const url = path.startsWith("http") ? path : `https://api.ownerrez.com/v2${path}`;
  try {
    const out = execFileSync(
      "curl",
      ["-sS", "-w", "\n%{http_code}", "-u", `${email}:${token}`, "-H", "User-Agent: DunesAndTides/0.1", url],
      { encoding: "utf8", maxBuffer: 20 * 1024 * 1024, stdio: ["ignore", "pipe", "pipe"] },
    );
    const nl = out.lastIndexOf("\n");
    return { code: out.slice(nl + 1).trim(), body: out.slice(0, nl) };
  } catch (e) {
    // curl exits non-zero on transport failures (e.g. a proxy 403 CONNECT).
    // Never surface the thrown command string — it contains the token.
    const stderr = String(e.stderr || "");
    if (/tunnel|CONNECT|403|407/.test(stderr)) return { code: "PROXY_BLOCKED", body: "" };
    return { code: "TRANSPORT_ERROR", body: stderr.slice(0, 200) };
  }
}

function classifyUnit(name = "") {
  const n = name.toLowerCase();
  if (n.includes("both") || n.includes("whole") || (n.includes("tides") && n.includes("dunes"))) return "WHOLE";
  if (n.includes("dunes")) return "DUNES";
  if (n.includes("tides")) return "TIDES";
  return null;
}

const env = loadEnvLocal();
const email = env.OWNERREZ_EMAIL;
const token = env.OWNERREZ_ACCESS_TOKEN;

if (!email || !token) {
  console.error("✗ Missing OWNERREZ_EMAIL / OWNERREZ_ACCESS_TOKEN (set them in .env.local).");
  process.exit(1);
}

console.log(`→ OwnerRez as ${email}\n`);

const props = apiGet("/properties", email, token);

if (props.code === "PROXY_BLOCKED" || props.code === "000" || props.code === "") {
  console.error("✗ Could not reach api.ownerrez.com — the network policy is blocking it.");
  console.error("  Start a session with an open/custom network policy that allows api.ownerrez.com.");
  process.exit(1);
}
if (props.code === "TRANSPORT_ERROR") {
  console.error("✗ Network error reaching api.ownerrez.com.\n  " + props.body);
  process.exit(1);
}
if (props.code === "401") {
  console.error("✗ 401 Unauthorized — check the email + token (username must be your OwnerRez login email).");
  process.exit(1);
}
if (props.code !== "200") {
  console.error(`✗ HTTP ${props.code}\n${props.body.slice(0, 500)}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(props.body);
} catch {
  console.error("✗ Unexpected response:\n" + props.body.slice(0, 500));
  process.exit(1);
}
const items = Array.isArray(data) ? data : data.items || [];
console.log(`✓ Connected. ${items.length} property/properties:\n`);

const mapping = {};
for (const p of items) {
  const unit = classifyUnit(p.name);
  if (unit && !mapping[unit]) mapping[unit] = p.id;
  const addr = p.address ? [p.address.city, p.address.state].filter(Boolean).join(", ") : "";
  console.log(`  • id ${p.id}  ${p.name || "(unnamed)"}${addr ? `  — ${addr}` : ""}${unit ? `   → ${unit}` : ""}`);
}

console.log("\nSuggested .env.local mapping (verify the names above are right):");
console.log(`  OWNERREZ_PROPERTY_ID_TIDES=${mapping.TIDES ?? ""}`);
console.log(`  OWNERREZ_PROPERTY_ID_DUNES=${mapping.DUNES ?? ""}`);
console.log(`  OWNERREZ_PROPERTY_ID_WHOLE=${mapping.WHOLE ?? ""}`);

// Booking count for the season, as a sanity check.
try {
  const b = apiGet("/bookings?from=2026-01-01&to=2026-12-31", email, token);
  if (b.code === "200") {
    const bd = JSON.parse(b.body);
    const bi = Array.isArray(bd) ? bd : bd.items || [];
    console.log(`\n✓ ${bi.length} booking(s) in the 2026 season are reachable.`);
  } else {
    console.log(`\n(bookings check returned HTTP ${b.code})`);
  }
} catch {
  /* non-fatal */
}
