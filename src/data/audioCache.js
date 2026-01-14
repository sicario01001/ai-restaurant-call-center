// src/services/cachedTtsService.js
//
// Wraps ElevenLabs TTS with phrase caching.
// If a sentence has already been generated for this voice + lang,
// we reuse the existing audio clip instantly.
//

import { getCachedClip, putCachedClip } from "../data/audioCache.js";
import { generateRawElevenLabsClip } from "./ttsService.js";

/**
 * Main API called by CallSimulator and VoiceDebug.
 *
 * @param {string} text - sentence to speak
 * @param {{
 *   language: 'fr' | 'en',
 *   voiceId?: string,
 *   backgroundNoiseProfile?: string
 * }} options
 */
export async function generateCachedTts(text, options) {
  const language = options?.language || "fr";
  const voiceId = options?.voiceId || "default-voice";

  // 1) Try cache first
  const cached = getCachedClip({ text, language, voiceId });
  if (cached?.audioUrl) {
    return {
      audioUrl: cached.audioUrl,
      fromCache: true,
    };
  }

  // 2) Not cached → call ElevenLabs
  const fresh = await generateRawElevenLabsClip(text, {
    language,
    voiceId,
    backgroundNoiseProfile: options?.backgroundNoiseProfile,
  });

  if (fresh?.audioUrl) {
    // 3) Store in cache for future re-use
    putCachedClip({
      text,
      language,
      voiceId,
      audioUrl: fresh.audioUrl,
      createdAt: Date.now(),
    });
  }

  return {
    audioUrl: fresh?.audioUrl || null,
    fromCache: false,
  };
}

