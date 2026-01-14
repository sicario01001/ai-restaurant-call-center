// src/services/ttsService.js
//
// Layer 1: generateRawElevenLabsClip → direct ElevenLabs API call
// Layer 2: generateTtsAudio → high-level API used by CallSimulator / TtsDebug
//           - includes a simple in-memory phrase cache so repeated phrases
//             don’t re-call ElevenLabs within the same session.
//

const ELEVEN_API_KEY = import.meta.env.VITE_ELEVEN_API_KEY || "";

// We support one FR-CA voice and one EN voice, plus a generic default.
// The envs are flexible so you can wire them however you like.
const VOICE_FR =
  import.meta.env.VITE_ELEVEN_VOICE_FR ||
  import.meta.env.VITE_ELEVEN_VOICE_ID ||
  null;

const VOICE_EN =
  import.meta.env.VITE_ELEVEN_VOICE_EN ||
  import.meta.env.VITE_ELEVEN_VOICE_ID ||
  null;

const DEFAULT_VOICE_ID =
  import.meta.env.VITE_ELEVEN_VOICE_ID || VOICE_FR || VOICE_EN || null;

// In-memory cache: key = JSON(text + voice + language + extra), value = { audioUrl, voiceId, language }
const phraseCache = new Map();

/**
 * Decide which ElevenLabs voice to use for a given language.
 * - "en" or "en-CA" → EN voice first, fallback to FR/default
 * - everything else → FR voice first, fallback to EN/default
 */
function selectVoiceId(language) {
  const lang = (language || "").toLowerCase();

  if (lang === "en" || lang.startsWith("en-")) {
    return VOICE_EN || VOICE_FR || DEFAULT_VOICE_ID;
  }

  // Default: treat as French-Canadian
  return VOICE_FR || VOICE_EN || DEFAULT_VOICE_ID;
}

function buildCacheKey({ text, language, voiceId, extra }) {
  return JSON.stringify({
    t: text,
    lang: language || "fr",
    v: voiceId || null,
    x: extra || null,
  });
}

/**
 * Low-level: call ElevenLabs API and return an ArrayBuffer (raw mp3 bytes).
 * No caching happens here.
 */
export async function generateRawElevenLabsClip(
  text,
  {
    language = "fr",
    voiceId,
    modelId = "eleven_multilingual_v2",
    voiceSettings = {},
  } = {}
) {
  if (!text || typeof text !== "string") {
    throw new Error("generateRawElevenLabsClip: text must be a non-empty string");
  }

  const resolvedVoiceId = voiceId || selectVoiceId(language);

  if (!ELEVEN_API_KEY) {
    console.warn("[ttsService] ELEVEN_API_KEY is not set; skipping TTS call.");
    return null;
  }

  if (!resolvedVoiceId) {
    console.warn("[ttsService] No voiceId configured; skipping TTS call.");
    return null;
  }

  const url = `https://api.elevenlabs.io/v1/text-to-speech/${resolvedVoiceId}/stream`;

  const body = {
    text,
    model_id: modelId,
    voice_settings: {
      stability: 0.4,
      similarity_boost: 0.8,
      style: 0.0,
      use_speaker_boost: true,
      ...voiceSettings,
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "xi-api-key": ELEVEN_API_KEY,
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        "[ttsService] ElevenLabs error",
        response.status,
        response.statusText
      );
      return null;
    }

    // Raw mp3 bytes
    return await response.arrayBuffer();
  } catch (err) {
    console.error("[ttsService] Failed to call ElevenLabs:", err);
    return null;
  }
}

/**
 * High-level helper: returns { audioUrl, voiceId, language } and caches
 * by (text + language + voiceId). This is what CallSimulator / TtsDebug
 * should use.
 *
 * Options:
 *   - language: "fr" or "en" (affects voice selection + cache key)
 *   - voiceId: override if you want a specific voice
 *   - cacheKeyExtra: optional, to separate different styles if needed
 */
export async function generateTtsAudio(
  text,
  { language = "fr", voiceId, cacheKeyExtra, voiceSettings, modelId } = {}
) {
  const resolvedVoiceId = voiceId || selectVoiceId(language);
  const cacheKey = buildCacheKey({
    text,
    language,
    voiceId: resolvedVoiceId,
    extra: cacheKeyExtra,
  });

  // In-memory phrase cache to avoid duplicate ElevenLabs calls
  const cached = phraseCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const arrayBuffer = await generateRawElevenLabsClip(text, {
    language,
    voiceId: resolvedVoiceId,
    modelId,
    voiceSettings,
  });

  if (!arrayBuffer) {
    // Hard fallback: no audio, but keep a stub so callers don't explode.
    const fallback = {
      audioUrl: null,
      voiceId: resolvedVoiceId,
      language,
      error: true,
    };
    phraseCache.set(cacheKey, fallback);
    return fallback;
  }

  const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
  const audioUrl = URL.createObjectURL(blob);

  const result = {
    audioUrl,
    voiceId: resolvedVoiceId,
    language,
  };

  phraseCache.set(cacheKey, result);
  return result;
}

/**
 * Optional helper for clearing the in-memory phrase cache between sessions.
 */
export function clearTtsCache() {
  phraseCache.clear();
}

