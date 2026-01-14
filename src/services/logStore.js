// src/services/logStore.js
// Minimal in-memory storage for Version 1 demo orders.

const logs = new Map(); // { id: { createdAt, summary, transcript } }

export function saveLog({ id, summary, transcript }) {
  logs.set(id, {
    id,
    createdAt: Date.now(),
    summary,
    transcript,
  });
}

export function getAllLogs() {
  return Array.from(logs.values()).sort((a, b) => b.createdAt - a.createdAt);
}

export function getLogById(id) {
  return logs.get(id) || null;
}

