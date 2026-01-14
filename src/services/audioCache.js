// src/services/audioCache.js
//
// DEV-ONLY AUDIO CACHE
// Stores generated audio in memory so repeated phrases
// do NOT regenerate TTS every time.

let AUDIO_CACHE = {};

export function getCachedAudio(cacheKey) {
  if (!cacheKey) return null;
  return AUDIO_CACHE[cacheKey] || null;
}

export function storeCachedAudio(cacheKey, audioObj) {
  if (!cacheKey) return;
  AUDIO_CACHE[cacheKey] = audioObj;
}

export function clearAudioCache() {
  AUDIO_CACHE = {};
}

