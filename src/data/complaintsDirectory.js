// src/data/complaintsDirectory.js
//
// Simple localStorage-backed complaint directory for demo/admin.
// In V2 this can be moved to a real database.

const STORAGE_KEY = "rc_demo_complaints_v1";

function loadAll() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (err) {
    console.warn("[complaintsDirectory] Failed to load complaints:", err);
    return [];
  }
}

function saveAll(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("[complaintsDirectory] Failed to save complaints:", err);
  }
}

function generateId() {
  return "cmp_" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Return all complaints (newest first).
 */
export function getAllComplaints() {
  const list = loadAll();
  return list.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
}

/**
 * Add a new complaint entry.
 * @param {Object} payload
 * @param {string} payload.phone
 * @param {string} payload.issue
 * @param {string} [payload.locationId]
 * @param {string} [payload.sessionId]
 * @param {string} [payload.orderType]
 * @returns {Object} complaint
 */
export function addComplaint(payload) {
  const now = Date.now();
  const complaint = {
    id: generateId(),
    phone: payload.phone || "unknown",
    issue: payload.issue || "",
    locationId: payload.locationId || null,
    sessionId: payload.sessionId || null,
    orderType: payload.orderType || null,
    status: "new",
    createdAt: now,
  };

  const list = loadAll();
  list.push(complaint);
  saveAll(list);

  return complaint;
}

/**
 * Update complaint status.
 * @param {string} id
 * @param {'new'|'reviewed'|'closed'} status
 */
export function markComplaintStatus(id, status) {
  const list = loadAll();
  const next = list.map((c) =>
    c.id === id ? { ...c, status: status || c.status } : c
  );
  saveAll(next);
}

