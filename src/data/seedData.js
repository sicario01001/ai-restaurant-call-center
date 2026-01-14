// src/data/seedData.js
// Seed data for Version 1 demo
// - Fictional French-Canadian pizza chain (model brand only)
// - Multiple locations in QC
// - Menu framework with FR-CA / EN-CA names
// - Kept intentionally simple so we can swap to real client data later
// NOTE: All of this is DEMO / placeholder data and will be replaced by the real client menu & locations.

// Locations (fictional but Quebec-flavored)
export const seedLocations = [
  {
    id: "mtl-downtown",
    name: "Montréal – Centre-Ville",
    phone: "+1-555-111-1111",
    address: "123 Rue Sainte-Catherine O, Montréal, QC",
    timezone: "America/Toronto",
    defaultLanguage: "fr-CA",
    supportedLanguages: ["fr-CA", "en-CA"],
    deliveryEnabled: true,
    pickupEnabled: true,
    hours: {
      mon: { open: "11:00", close: "23:00" },
      tue: { open: "11:00", close: "23:00" },
      wed: { open: "11:00", close: "23:00" },
      thu: { open: "11:00", close: "23:00" },
      fri: { open: "11:00", close: "01:00" },
      sat: { open: "12:00", close: "01:00" },
      sun: { open: "12:00", close: "22:00" },
    },
  },
  {
    id: "lav-suburb",
    name: "Laval – Boulevard des Laurentides",
    phone: "+1-555-222-2222",
    address: "45 Boulevard des Laurentides, Laval, QC",
    timezone: "America/Toronto",
    defaultLanguage: "fr-CA",
    supportedLanguages: ["fr-CA", "en-CA"],
    deliveryEnabled: true,
    pickupEnabled: true,
    hours: {
      mon: { open: "11:00", close: "22:00" },
      tue: { open: "11:00", close: "22:00" },
      wed: { open: "11:00", close: "22:00" },
      thu: { open: "11:00", close: "23:00" },
      fri: { open: "11:00", close: "23:00" },
      sat: { open: "12:00", close: "23:00" },
      sun: { open: "12:00", close: "21:00" },
    },
  },
  {
    id: "qc-old-town",
    name: "Québec – Vieux-Québec",
    phone: "+1-555-333-3333",
    address: "10 Rue Saint-Jean, Québec, QC",
    timezone: "America/Toronto",
    defaultLanguage: "fr-CA",
    supportedLanguages: ["fr-CA", "en-CA"],
    deliveryEnabled: false,
    pickupEnabled: true,
    hours: {
      mon: { open: "11:30", close: "21:30" },
      tue: { open: "11:30", close: "21:30" },
      wed: { open: "11:30", close: "21:30" },
      thu: { open: "11:30", close: "22:30" },
      fri: { open: "11:30", close: "23:00" },
      sat: { open: "12:00", close: "23:00" },
      sun: { open: "12:00", close: "21:00" },
    },
  },
];

// Simple in-memory roles for now. Later this will tie into real auth.
export const seedUsers = [
  {
    id: "super-1",
    name: "Demo Super Admin",
    email: "super@example.com",
    role: "super-admin",
    locationId: null,
  },
  {
    id: "manager-mtl",
    name: "Gestionnaire – Montréal",
    email: "manager.mtl@example.com",
    role: "manager",
    locationId: "mtl-downtown",
  },
  {
    id: "manager-lav",
    name: "Gestionnaire – Laval",
    email: "manager.lav@example.com",
    role: "manager",
    locationId: "lav-suburb",
  },
];

// Global menu options – toppings, crusts, sizes
// These are what the AI will treat as "valid" values.
export const menuOptions = {
  toppings: [
    { id: "pepperoni", name: { "fr-CA": "Pepperoni", "en-CA": "Pepperoni" } },
    { id: "bacon", name: { "fr-CA": "Bacon fumé", "en-CA": "Smoked bacon" } },
    { id: "ham", name: { "fr-CA": "Jambon", "en-CA": "Ham" } },
    {
      id: "italian-sausage",
      name: { "fr-CA": "Saucisse italienne", "en-CA": "Italian sausage" },
    },
    {
      id: "chicken",
      name: { "fr-CA": "Poulet grillé", "en-CA": "Grilled chicken" },
    },
    {
      id: "mushrooms",
      name: { "fr-CA": "Champignons", "en-CA": "Mushrooms" },
    },
    {
      id: "onions",
      name: { "fr-CA": "Oignons rouges", "en-CA": "Red onions" },
    },
    {
      id: "green-peppers",
      name: { "fr-CA": "Poivrons verts", "en-CA": "Green peppers" },
    },
    {
      id: "black-olives",
      name: { "fr-CA": "Olives noires", "en-CA": "Black olives" },
    },
    {
      id: "jalapenos",
      name: { "fr-CA": "Jalapeños", "en-CA": "Jalapeños" },
    },
    {
      id: "extra-cheese",
      name: { "fr-CA": "Fromage supplémentaire", "en-CA": "Extra cheese" },
    },
    { id: "feta", name: { "fr-CA": "Feta", "en-CA": "Feta" } },
    {
      id: "parmesan",
      name: { "fr-CA": "Parmesan", "en-CA": "Parmesan" },
    },
    // Still no pineapple – by client preference :)
    //  { id: "pineapple", name: { "fr-CA": "Ananas", "en-CA": "Pineapple" } },
  ],
  crustTypes: [
    { id: "thin", name: { "fr-CA": "Croûte mince", "en-CA": "Thin crust" } },
    {
      id: "regular",
      name: { "fr-CA": "Croûte régulière", "en-CA": "Regular crust" },
    },
    {
      id: "deep-dish",
      name: { "fr-CA": "Croûte épaisse", "en-CA": "Deep dish" },
    },
  ],
  sizes: [
    { id: "sm", name: { "fr-CA": 'Petite 10"', "en-CA": 'Small 10"' } },
    { id: "md", name: { "fr-CA": 'Moyenne 12"', "en-CA": 'Medium 12"' } },
    { id: "lg", name: { "fr-CA": 'Grande 14"', "en-CA": 'Large 14"' } },
  ],
};

// Example menu items for one location (we can reuse for others)
// Categories: "pizzas", "sides", "drinks" etc. – keep it stable for the engine.
export const seedMenus = [
  {
    id: "margherita",
    locationId: "mtl-downtown",
    category: "pizzas",
    name: {
      "fr-CA": "Margherita",
      "en-CA": "Margherita",
    },
    description: {
      "fr-CA": "Sauce tomate, mozzarella, basilic frais.",
      "en-CA": "Tomato sauce, mozzarella, fresh basil.",
    },
    basePrice: 12.99,
    sizes: {
      sm: 12.99,
      md: 15.99,
      lg: 18.99,
    },
    availableCrusts: ["thin", "regular"],
    defaultToppings: ["extra-cheese"],
    allowedToppings: [
      "pepperoni",
      "bacon",
      "ham",
      "italian-sausage",
      "mushrooms",
      "onions",
      "green-peppers",
      "black-olives",
      "jalapenos",
      "extra-cheese",
      "feta",
      "parmesan",
    ],
    isCustomizable: true,
    isActive: true,
  },
  {
    id: "all-dressed",
    locationId: "mtl-downtown",
    category: "pizzas",
    name: {
      "fr-CA": "Toute garnie",
      "en-CA": "All-dressed",
    },
    description: {
      "fr-CA": "Pepperoni, champignons, poivrons verts, mozzarella.",
      "en-CA": "Pepperoni, mushrooms, green peppers, mozzarella.",
    },
    basePrice: 15.99,
    sizes: {
      sm: 15.99,
      md: 18.99,
      lg: 21.99,
    },
    availableCrusts: ["regular", "deep-dish"],
    defaultToppings: [
      "pepperoni",
      "mushrooms",
      "green-peppers",
      "extra-cheese",
    ],
    allowedToppings: [
      "pepperoni",
      "bacon",
      "ham",
      "italian-sausage",
      "mushrooms",
      "onions",
      "green-peppers",
      "black-olives",
      "jalapenos",
      "extra-cheese",
      "feta",
      "parmesan",
    ],
    isCustomizable: true,
    isActive: true,
  },
  {
    id: "meat-lovers",
    locationId: "mtl-downtown",
    category: "pizzas",
    name: {
      "fr-CA": "Carnivore",
      "en-CA": "Meat Lovers",
    },
    description: {
      "fr-CA": "Pepperoni, bacon fumé, jambon, saucisse italienne.",
      "en-CA": "Pepperoni, smoked bacon, ham, Italian sausage.",
    },
    basePrice: 17.99,
    sizes: {
      sm: 17.99,
      md: 20.99,
      lg: 24.99,
    },
    availableCrusts: ["regular", "deep-dish"],
    defaultToppings: [
      "pepperoni",
      "bacon",
      "ham",
      "italian-sausage",
      "extra-cheese",
    ],
    allowedToppings: [
      "pepperoni",
      "bacon",
      "ham",
      "italian-sausage",
      "chicken",
      "mushrooms",
      "onions",
      "green-peppers",
      "black-olives",
      "jalapenos",
      "extra-cheese",
      "feta",
      "parmesan",
    ],
    isCustomizable: true,
    isActive: true,
  },
  {
    id: "build-your-own",
    locationId: "mtl-downtown",
    category: "pizzas",
    name: {
      "fr-CA": "Composez votre pizza",
      "en-CA": "Create Your Own",
    },
    description: {
      "fr-CA": "Choisissez la croûte, la taille et vos garnitures.",
      "en-CA": "Choose your crust, size and toppings.",
    },
    basePrice: 11.99,
    sizes: {
      sm: 11.99,
      md: 14.99,
      lg: 17.99,
    },
    availableCrusts: ["thin", "regular", "deep-dish"],
    defaultToppings: [],
    allowedToppings: [
      "pepperoni",
      "bacon",
      "ham",
      "italian-sausage",
      "chicken",
      "mushrooms",
      "onions",
      "green-peppers",
      "black-olives",
      "jalapenos",
      "extra-cheese",
      "feta",
      "parmesan",
    ],
    isCustomizable: true,
    isActive: true,
  },
  {
    id: "poutine-classic",
    locationId: "mtl-downtown",
    category: "sides",
    name: {
      "fr-CA": "Poutine classique",
      "en-CA": "Classic Poutine",
    },
    description: {
      "fr-CA": "Frites, fromage en grains, sauce.",
      "en-CA": "Fries, cheese curds, gravy.",
    },
    basePrice: 7.99,
    sizes: null,
    availableCrusts: [],
    defaultToppings: [],
    allowedToppings: [],
    isCustomizable: false,
    isActive: true,
  },
  {
    id: "garlic-fingers",
    locationId: "mtl-downtown",
    category: "sides",
    name: {
      "fr-CA": "Doigts à l’ail",
      "en-CA": "Garlic fingers",
    },
    description: {
      "fr-CA": "Pâte à pizza, beurre à l’ail, fromage.",
      "en-CA": "Pizza dough, garlic butter, cheese.",
    },
    basePrice: 6.99,
    sizes: null,
    availableCrusts: [],
    defaultToppings: [],
    allowedToppings: [],
    isCustomizable: false,
    isActive: true,
  },
  {
    id: "soft-drink-2l",
    locationId: "mtl-downtown",
    category: "drinks",
    name: {
      "fr-CA": "Boisson gazeuse 2L",
      "en-CA": "2L Soft drink",
    },
    description: {
      "fr-CA": "Coca, Diet, Sprite, etc.",
      "en-CA": "Coke, Diet, Sprite, etc.",
    },
    basePrice: 3.99,
    sizes: null,
    availableCrusts: [],
    defaultToppings: [],
    allowedToppings: [],
    isCustomizable: false,
    isActive: true,
  },
];

// Prompt keys for future voice flows – only keys for now
export const promptKeys = {
  ASK_WELCOME: "ASK_WELCOME",
  ASK_DELIVERY_OR_PICKUP: "ASK_DELIVERY_OR_PICKUP",
  ASK_LOCATION: "ASK_LOCATION",
  ASK_PIZZA_DETAILS: "ASK_PIZZA_DETAILS",
  CONFIRM_ORDER_SUMMARY: "CONFIRM_ORDER_SUMMARY",
  ASK_ANYTHING_ELSE: "ASK_ANYTHING_ELSE",
};

