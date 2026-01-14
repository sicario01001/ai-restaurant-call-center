// src/services/languageDetector.js
//
// Lightweight helper to detect if the caller is explicitly
// asking to switch language (FR ↔ EN) during the call.
//
// We DO NOT try to fully auto-detect every utterance here.
// This is only for clear "do you speak English / French"
// style requests so we can respond warmly and flip session.language.
//

const EN_PATTERNS = [
  "speak english",
  "do you speak english",
  "in english",
  "english please",
  "can we speak english",
  "parlez-vous english",
  "parlez vous english",
  "anglais s'il vous plaît",
];

const FR_PATTERNS = [
  "speak french",
  "in french",
  "french please",
  "parlez français",
  "parler français",
  "en français",
  "can we speak french",
];

/**
 * Detect whether the user is explicitly asking to change languages.
 * Returns the *target* language code ('en-CA' | 'fr-CA') or null.
 *
 * @param {string} lcText - lowercased user text
 * @param {string} currentLanguage - current session.language
 */
export function detectLanguageSwitch(lcText, currentLanguage = "fr-CA") {
  if (!lcText) return null;

  const isCurrentlyFr = (currentLanguage || "fr-CA").startsWith("fr");
  const isCurrentlyEn = (currentLanguage || "fr-CA").startsWith("en");

  // From FR → EN (most common case)
  if (isCurrentlyFr) {
    for (const pattern of EN_PATTERNS) {
      if (lcText.includes(pattern)) {
        return "en-CA";
      }
    }
  }

  // From EN → FR
  if (isCurrentlyEn) {
    for (const pattern of FR_PATTERNS) {
      if (lcText.includes(pattern)) {
        return "fr-CA";
      }
    }
  }

  return null;
}

