// src/data/phraseCache.js

/**
 * Simple phrase cache for Milestone 2.
 *
 * In a future version this can be backed by a database or external TTS cache.
 * For now it's just an in-memory map of "keys" -> FR-CA phrases that are
 * reused frequently in the voice flow.
 */

const PHRASES = {
  greeting:
    "Bonjour, merci d’avoir appelé la pizzeria. Est-ce pour livraison ou pour ramassage?",
  goodbye: "Parfait, merci d’avoir appelé. Bonne journée!",
  askOrderType:
    "Est-ce pour livraison ou pour ramassage?",
  askLocationDelivery:
    "Parfait, pour la livraison, à quel emplacement ou secteur voulez-vous commander?",
  askLocationPickup:
    "Super, pour le ramassage, à quel emplacement voulez-vous commander?",
  askPizzaSize:
    "On va commencer avec la pizza. Quelle taille voulez-vous? Petite, moyenne ou grande?",
  askCrust:
    "Parfait. Pour la croûte, voulez-vous régulière, mince ou pan?",
  askToppings:
    "Très bien. Quels garnitures voulez-vous sur la pizza? Par exemple: pepperoni, fromage, champignons…",
  askMoreToppings:
    "Super, autre chose sur la pizza ou c’est tout pour les garnitures?",
  askContact:
    "Maintenant, j’aurais besoin d’un nom et d’un numéro de téléphone pour la commande.",
  askConfirm:
    "Est-ce que tout est correct avec la commande? Vous pouvez dire oui ou non.",
};

/**
 * Get a phrase by key.
 * Returns `null` if the phrase isn't defined so callers can use their own fallback.
 */
export function getCachedPhrase(key) {
  if (!key) return null;
  return PHRASES[key] ?? null;
}

