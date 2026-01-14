// src/services/orderBuilder.js

/**
 * Centralized order-building logic used by conversationEngine and debug tools.
 * Includes:
 * - delivery/pickup mode
 * - delivery address
 * - pizza configuration
 * - upsells
 * - contact info
 * - summary generation
 */

export function createEmptyOrder() {
  return {
    locationId: null,
    mode: null, // 'delivery' | 'pickup'
    deliveryAddress: "", // ADDED for delivery flows
    items: [],
    upsells: [],
    contact: {
      name: "",
      phone: "",
    },
    notes: "",
  };
}

/**
 * Adds a pizza item for configuration.
 */
export function addPizza(order) {
  const pizza = {
    id: `pizza_${order.items.length + 1}`,
    type: "pizza",
    size: null,
    crust: null,
    toppings: [],
    quantity: 1,
    extraCheese: false,
  };

  return {
    ...order,
    items: [...order.items, pizza],
  };
}

/**
 * Set delivery or pickup.
 */
export function setOrderMode(order, mode) {
  if (!["delivery", "pickup"].includes(mode)) return order;
  return { ...order, mode };
}

/**
 * Set location ID.
 */
export function setLocation(order, locationId) {
  return { ...order, locationId };
}

/**
 * ⭐ NEW FUNCTION (fixes your import error)
 * Store the delivery address.
 */
export function setDeliveryAddress(order, address) {
  return {
    ...order,
    deliveryAddress: (address || "").trim(),
  };
}

/**
 * Pizza configuration helpers.
 */
export function setPizzaSize(order, pizzaId, size) {
  return {
    ...order,
    items: order.items.map((p) =>
      p.id === pizzaId ? { ...p, size } : p
    ),
  };
}

export function setPizzaCrust(order, pizzaId, crust) {
  return {
    ...order,
    items: order.items.map((p) =>
      p.id === pizzaId ? { ...p, crust } : p
    ),
  };
}

export function toggleTopping(order, pizzaId, topping) {
  return {
    ...order,
    items: order.items.map((p) => {
      if (p.id !== pizzaId) return p;
      const has = p.toppings.includes(topping);
      return {
        ...p,
        toppings: has
          ? p.toppings.filter((t) => t !== topping)
          : [...p.toppings, topping],
      };
    }),
  };
}

export function applyExtraCheese(order, pizzaId, value = true) {
  return {
    ...order,
    items: order.items.map((p) =>
      p.id === pizzaId ? { ...p, extraCheese: value } : p
    ),
  };
}

/**
 * Upsells.
 */
export function addUpsell(order, upsell) {
  return {
    ...order,
    upsells: [...order.upsells, upsell],
  };
}

/**
 * Contact info.
 */
export function setContact(order, name, phone) {
  return {
    ...order,
    contact: { name, phone },
  };
}

export function setNotes(order, notes) {
  return { ...order, notes };
}

/**
 * Order summary string.
 */
export function summarizeOrder(order) {
  const pizzas = order.items
    .map((p) => {
      const t = p.toppings.length ? p.toppings.join(", ") : "no toppings";
      return `${p.size} pizza with ${t}`;
    })
    .join("; ");

  const ups = order.upsells.length
    ? ` You also added: ${order.upsells.map((u) => u.label).join(", ")}.`
    : "";

  let modePart = "";
  if (order.mode === "delivery" && order.deliveryAddress) {
    modePart = ` for delivery to ${order.deliveryAddress}`;
  } else if (order.mode === "pickup") {
    modePart = " for pickup";
  }

  return `You ordered: ${pizzas}${modePart}.${ups}`;
}

/**
 * Reset entire order.
 */
export function resetOrder() {
  return createEmptyOrder();
}

