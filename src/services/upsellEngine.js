// src/services/upsellEngine.js

/**
 * Simple rule-based upsell engine for Milestone 2.
 *
 * The goal here is not “smart AI,” but predictable, explainable suggestions:
 * - Drinks when there is at least one pizza
 * - Dips when there is at least one topping
 * - Extra cheese if not already applied
 *
 * This can later be replaced or extended with true AI suggestions,
 * but the interface should stay stable:
 *
 *   suggestUpsellsForOrder(order) => Upsell[]
 *
 * where Upsell = { id, label, price }
 */

const BASE_UPSELLS = [
  {
    id: "drink_cola",
    label: "une boisson gazeuse",
    price: 2.99,
  },
  {
    id: "dip_garlic",
    label: "une trempette à l’ail",
    price: 1.49,
  },
  {
    id: "extra_cheese",
    label: "extra fromage",
    price: 2.0,
  },
];

/**
 * Return a list of upsells that make sense for the current order.
 * We keep this extremely simple for Milestone 2.
 */
export function suggestUpsellsForOrder(order) {
  if (!order || !Array.isArray(order.items)) return [];

  const items = order.items || [];
  if (items.length === 0) return [];

  const suggestions = [];
  const firstPizza = items[0];

  const hasToppings =
    firstPizza &&
    Array.isArray(firstPizza.toppings) &&
    firstPizza.toppings.length > 0;

  const hasExtraCheese = firstPizza && firstPizza.extraCheese === true;

  // Always: drinks are a safe upsell when there is a pizza
  suggestions.push(findUpsell("drink_cola"));

  // If there are toppings, dips make sense
  if (hasToppings) {
    suggestions.push(findUpsell("dip_garlic"));
  }

  // If extra cheese is not already applied, offer it
  if (!hasExtraCheese) {
    suggestions.push(findUpsell("extra_cheese"));
  }

  // Filter out any nulls, just in case
  return suggestions.filter(Boolean);
}

function findUpsell(id) {
  return BASE_UPSELLS.find((u) => u.id === id) || null;
}

