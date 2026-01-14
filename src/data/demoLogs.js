// src/data/demoLogs.js
//
// Demo logging system for the admin "Demo Logs" screen.
// - In-memory array + optional localStorage persistence
// - logDemoEvent(sessionId, payload)
// - getDemoLogs() → flat list, newest first
// - clearDemoLogs() → wipe demo data only
//
// This is DEMO-ONLY logging for the browser tools, not production infra.

const STORAGE_KEY = "rcc_demo_logs_v1";

let logs = [];

// ---- helpers ----

function loadFromStorage() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[demoLogs] Failed to load from storage", err);
    return [];
  }
}

function saveToStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  } catch (err) {
    console.warn("[demoLogs] Failed to save to storage", err);
  }
}

function safeIsoDate(value) {
  if (!value) return new Date().toISOString();
  try {
    if (typeof value === "string") return value;
    if (value instanceof Date) return value.toISOString();
    return new Date(value).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

// Load any existing demo logs on the client
if (typeof window !== "undefined") {
  logs = loadFromStorage();
}

// ---- public API ----

/**
 * Low-level logger used by CallSimulator / debug tools.
 *
 * Keep the signature flexible so existing calls like:
 *   logDemoEvent(sessionId, { type, userInput, responses, state, order })
 * continue to work.
 */
export function logDemoEvent(sessionId, payload = {}) {
  const createdAt = safeIsoDate(payload.createdAt);

  const entry = {
    id:
      payload.id ||
      `${Date.now().toString(36)}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
    sessionId: sessionId || payload.sessionId || "unknown",
    createdAt,
    type: payload.type || "event",

    // Try to infer location + phone + language from whatever we get
    locationId:
      payload.locationId ||
      payload.state?.locationId ||
      payload.order?.locationId ||
      null,
    phone:
      payload.phone ||
      payload.order?.phone ||
      payload.state?.customerPhone ||
      null,
    language:
      payload.language ||
      payload.state?.language ||
      payload.order?.language ||
      null,

    direction: payload.direction || null, // "user" | "bot" etc.

    // Optional “nice” fields if callers provide them
    orderSummary: payload.orderSummary || null,
    transcript: payload.transcript || null,
    audioUrl: payload.audioUrl || null,

    // Flags / cross-links
    hasHumanEscalation:
      payload.hasHumanEscalation ||
      payload.flags?.includes("human-escalation") ||
      false,
    complaintId: payload.complaintId || null,

    // Keep the raw payload for deep-dive debug
    raw: payload,
  };

  logs.push(entry);

  // Avoid blowing up localStorage – keep the last 200 events only
  if (logs.length > 200) {
    logs = logs.slice(logs.length - 200);
  }

  saveToStorage();
  return entry;
}
// Simple wrapper so OrderDebug can "submit" a demo order and have it
// show up in the same logs as other events.
export function submitDemoOrder(orderPayload) {
  // Use a stable-ish session id for demo orders if none is provided
  const sessionId =
    orderPayload?.sessionId || `demo-order-${Date.now().toString(36)}`;

  return logDemoEvent(sessionId, {
    type: "demo-order",
    orderSummary:
      orderPayload?.summary ||
      orderPayload?.orderSummary ||
      null,
    order: orderPayload || null,
  });
}

/**
 * Returns a flat list of all demo log entries, newest first.
 */
export function getDemoLogs() {
  return [...logs].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * Clears all demo logs (for clean test runs).
 * This only affects DEMO data in the browser.
 */
export function clearDemoLogs() {
  logs = [];
  saveToStorage();
}

// Provide a default export so older imports are still safe
const demoLogsApi = {
  logDemoEvent,
  getDemoLogs,
  clearDemoLogs,
};

export default demoLogsApi;

