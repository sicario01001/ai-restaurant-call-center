// src/services/voiceCache.js
//
// Simple text+language keyed cache scaffold.
// Intended to back ElevenLabs TTS caching in a later step.

const STORAGE_KEY = "rc_tts_cache_v1";

function loadAll() {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (typeof parsed !== "object" || parsed === null) return {};
    return parsed;
  } catch (err) {
    console.warn("[voiceCache] Failed to load cache:", err);
    return {};
  }
}

function saveAll(map) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch (err) {
    console.warn("[voiceCache] Failed to save cache:", err);
  }
}

function makeKey(text, lang) {
  const base = (text || "").trim() + "|" + (lang || "fr-CA");
  // Tiny hash to keep keys short
  let hash = 0;
  for (let i = 0; i < base.length; i += 1) {
    hash = (hash << 5) - hash + base.charCodeAt(i);
    hash |= 0;
  }
  return "k_" + hash.toString(16);
}

/**
 * Look up a cached audio URL for (text, lang), if any.
 */
export function getCachedClip(text, lang) {
  const key = makeKey(text, lang);
  const map = loadAll();
  return map[key] || null;
}

/**
 * Save a cached audio URL for (text, lang).
 */
export function saveCachedClip(text, lang, audioUrl) {
  if (!audioUrl) return;
  const key = makeKey(text, lang);
  const map = loadAll();
  map[key] = audioUrl;
  saveAll(map);
}

