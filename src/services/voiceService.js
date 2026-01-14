// src/services/voiceService.js

/**
 * Voice settings + metadata builder for Milestone 2.
 *
 * Scope requirements:
 * - French-Canadian voice tuning
 * - Ability to adjust voice variant
 * - Optional background restaurant noise
 * - Phrase caching support (hooked via cacheKey)
 *
 * NOTE:
 * This file does NOT call any real TTS provider yet.
 * It just centralizes configuration so Milestone 3 can plug in
 * ElevenLabs / other TTS without changing the rest of the app.
 */

const DEFAULT_VOICE_SETTINGS = {
  locale: "fr-CA",
  toneVariant: "friendly", // 'friendly' | 'neutral' | 'fast'
  includeBackgroundNoise: true,
  speakingRate: 1.0,
  volumeGainDb: 0,
};

let currentVoiceSettings = { ...DEFAULT_VOICE_SETTINGS };

/**
 * Get the current global voice settings.
 * Callers can override per-response if needed.
 */
export function getCurrentVoiceSettings() {
  return { ...currentVoiceSettings };
}

/**
 * Update global voice settings (e.g. from an admin toggle).
 * Partial updates are allowed.
 */
export function updateVoiceSettings(partial) {
  currentVoiceSettings = {
    ...currentVoiceSettings,
    ...(partial || {}),
  };
  return getCurrentVoiceSettings();
}

/**
 * Build a voice configuration object for a given response.
 *
 * @param {object} options
 * @param {string} options.text        - Text that will be spoken.
 * @param {string} [options.cacheKey]  - Key used for phrase caching / audio reuse.
 * @param {boolean} [options.isDemo]   - Whether this is demo mode.
 * @param {string} [options.overrideToneVariant] - Optional per-response tone.
 */
export function buildVoiceConfig({
  text,
  cacheKey = null,
  isDemo = true,
  overrideToneVariant,
} = {}) {
  const base = getCurrentVoiceSettings();

  return {
    text,
    locale: base.locale,
    toneVariant: overrideToneVariant || base.toneVariant,
    includeBackgroundNoise: base.includeBackgroundNoise,
    speakingRate: base.speakingRate,
    volumeGainDb: base.volumeGainDb,
    cacheKey,
    isDemo,
  };
}

/**
 * Helper to toggle background restaurant noise.
 * (Used by admin/dev tools or future settings screen.)
 */
export function setBackgroundNoiseEnabled(enabled) {
  return updateVoiceSettings({ includeBackgroundNoise: !!enabled });
}

/**
 * Helper to change tone variant.
 * Suggested values: 'friendly', 'neutral', 'fast'
 */
export function setToneVariant(variant) {
  if (!variant) return getCurrentVoiceSettings();

  const allowed = ["friendly", "neutral", "fast"];
  const selected = allowed.includes(variant) ? variant : "friendly";

  return updateVoiceSettings({ toneVariant: selected });
}

