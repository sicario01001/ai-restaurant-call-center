// src/data/customerDirectory.js
//
// Lightweight customer "directory" for demo / Version 1.
// Uses window.localStorage so returning callers feel real in the demo.
// In a future version this can be swapped for a real DB/API.

const STORAGE_KEY = "rc_customer_directory_v1";

function loadStore() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("[customerDirectory] Failed to load store", err);
    return [];
  }
}

function saveStore(list) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch (err) {
    console.warn("[customerDirectory] Failed to save store", err);
  }
}

function normalizePhone(phone) {
  if (!phone) return "";
  return String(phone).replace(/[^\d]/g, "");
}

/**
 * Look up a customer by phone (normalized digits).
 * @param {string} phone
 * @returns {object|null}
 */
export function lookupCustomerByPhone(phone) {
  const norm = normalizePhone(phone);
  if (!norm) return null;
  const store = loadStore();
  return store.find((c) => c.phone === norm) || null;
}

/**
 * Create or update a customer record.
 * @param {object} partial
 * @param {string} partial.phone
 * @param {string} [partial.name]
 * @param {string} [partial.address]
 * @param {string} [partial.locationId]
 * @param {number} [partial.totalOrders]
 * @returns {object|null}
 */
export function saveCustomerRecord(partial) {
  const norm = normalizePhone(partial.phone);
  if (!norm) return null;

  const store = loadStore();
  const now = new Date().toISOString();

  const index = store.findIndex((c) => c.phone === norm);

  if (index === -1) {
    const record = {
      phone: norm,
      name: partial.name || "",
      address: partial.address || "",
      locationId: partial.locationId || null,
      totalOrders: partial.totalOrders || 0,
      createdAt: now,
      updatedAt: now,
    };
    store.push(record);
    saveStore(store);
    return record;
  }

  const existing = store[index];
  const updated = {
    ...existing,
    ...partial,
    phone: norm,
    updatedAt: now,
  };

  store[index] = updated;
  saveStore(store);
  return updated;
}

