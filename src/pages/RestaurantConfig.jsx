// src/pages/RestaurantConfig.jsx
//
// Read-only admin view for:
// - Menu
// - Hours
// - Upsells
//
// Uses internal demo data for now so we don't risk
// breaking any existing seedData wiring before delivery.

import { useState } from "react";

const DEMO_RESTAURANTS = [
  {
    id: "salvatore-centre-ville",
    name: "Salvatoré — Centre-ville",
    city: "Montréal",
    phone: "(514) 555-1234",
    hours: {
      mon: { open: "11:00", close: "23:00" },
      tue: { open: "11:00", close: "23:00" },
      wed: { open: "11:00", close: "23:00" },
      thu: { open: "11:00", close: "23:00" },
      fri: { open: "11:00", close: "01:00" },
      sat: { open: "11:00", close: "01:00" },
      sun: { open: "12:00", close: "22:00" },
    },
    menu: {
      pizzas: [
        {
          code: "PEP-L",
          name: "Pizza Pepperoni (Large)",
          description: "Sauce tomate, mozzarella, pepperoni",
          basePrice: 21.99,
        },
        {
          code: "SUP-L",
          name: "Pizza Toute Garnie (Large)",
          description: "Pepperoni, champignons, poivrons verts",
          basePrice: 24.99,
        },
      ],
      sides: [
        {
          code: "AILES-8",
          name: "Ailes de poulet (8)",
          description: "Sauce BBQ ou piquante",
          basePrice: 11.99,
        },
        {
          code: "FRITES-L",
          name: "Frites (Large)",
          description: "Frites croustillantes",
          basePrice: 4.99,
        },
      ],
      drinks: [
        {
          code: "COKE-2L",
          name: "Coca-Cola 2L",
          description: "Bouteille 2L",
          basePrice: 3.99,
        },
        {
          code: "EAU-500",
          name: "Eau 500ml",
          description: "Bouteille d'eau",
          basePrice: 1.99,
        },
      ],
    },
    upsells: [
      {
        id: "dip-ail",
        label: "Ajouter un dip à l'ail",
        price: 1.50,
      },
      {
        id: "boisson-2l",
        label: "Ajouter une boisson 2L à prix réduit",
        price: 2.99,
      },
      {
        id: "dessert-brownie",
        label: "Ajouter un brownie dessert",
        price: 3.99,
      },
    ],
  },
  {
    id: "salvatore-rive-sud",
    name: "Salvatoré — Rive-Sud",
    city: "Longueuil",
    phone: "(450) 555-9876",
    hours: {
      mon: { open: "11:00", close: "22:00" },
      tue: { open: "11:00", close: "22:00" },
      wed: { open: "11:00", close: "22:00" },
      thu: { open: "11:00", close: "23:00" },
      fri: { open: "11:00", close: "01:00" },
      sat: { open: "11:00", close: "01:00" },
      sun: { open: "12:00", close: "22:00" },
    },
    menu: {
      pizzas: [
        {
          code: "FROM-L",
          name: "4 Fromages (Large)",
          description: "Mozzarella, cheddar, parmesan, fromage suisse",
          basePrice: 23.99,
        },
      ],
      sides: [
        {
          code: "POTATO-WED",
          name: "Quartiers de pommes de terre",
          description: "Servis avec sauce",
          basePrice: 5.49,
        },
      ],
      drinks: [
        {
          code: "7UP-2L",
          name: "7UP 2L",
          description: "Bouteille 2L",
          basePrice: 3.99,
        },
      ],
    },
    upsells: [
      {
        id: "trempette-extra",
        label: "Trempette supplémentaire",
        price: 1.50,
      },
    ],
  },
];

const DAY_LABELS = [
  { key: "mon", label: "Lundi" },
  { key: "tue", label: "Mardi" },
  { key: "wed", label: "Mercredi" },
  { key: "thu", label: "Jeudi" },
  { key: "fri", label: "Vendredi" },
  { key: "sat", label: "Samedi" },
  { key: "sun", label: "Dimanche" },
];

function formatPrice(price) {
  if (typeof price !== "number") return "-";
  return `${price.toFixed(2)}$`;
}

export default function RestaurantConfig() {
  const [selectedId, setSelectedId] = useState(DEMO_RESTAURANTS[0].id);

  const selected = DEMO_RESTAURANTS.find((r) => r.id === selectedId);

  if (!selected) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-300">
          Aucune succursale sélectionnée. Veuillez en choisir une dans la liste.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/70 backdrop-blur">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              Configuration des restaurants
            </h1>
            <p className="text-xs text-slate-400">
              Lecture seule • V1 démo • Menus, heures et upsells
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-red-700/20 px-3 py-1 text-xs font-medium text-red-300 border border-red-700/40">
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-red-400" />
              Milestone 3 — Bundle 7
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="mx-auto max-w-6xl px-4 py-6 space-y-6">
        {/* Location selector + summary */}
        <section className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <label
              htmlFor="location"
              className="block text-xs font-medium text-slate-400 mb-1"
            >
              Succursale
            </label>
            <div className="inline-flex items-center gap-2">
              <select
                id="location"
                className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-50 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/70"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                {DEMO_RESTAURANTS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name} • {r.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-right text-slate-400">
            <div>{selected.name}</div>
            <div className="text-slate-500">{selected.phone}</div>
          </div>
        </section>

        {/* Grid: Menu / Hours / Upsells */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Menu */}
          <div className="col-span-2 rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
            <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
<h2 className="text-lg font-semibold text-gray-800 mb-2">
<p className="text-sm text-gray-600 leading-relaxed">
  Restaurant profiles, menus, and hours will be editable in Version 2.
  For this demo, configuration screens are read-only placeholders.
</p>
              </h2>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">
                Pizzas, accompagnements & boissons
              </span>
            </div>
            <div className="p-4 space-y-4">
              {/* Pizzas */}
              <MenuSection
                title="Pizzas"
                items={selected.menu.pizzas}
                accent="P"
              />
              {/* Sides */}
              <MenuSection
                title="Accompagnements"
                items={selected.menu.sides}
                accent="A"
              />
              {/* Drinks */}
              <MenuSection
                title="Boissons"
                items={selected.menu.drinks}
                accent="B"
              />
            </div>
          </div>

          {/* Hours */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
            <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Heures d&apos;ouverture
              </h2>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">
                Lecture seule
              </span>
            </div>
            <div className="p-4">
              <table className="w-full text-xs">
                <tbody>
                  {DAY_LABELS.map((day) => {
                    const slot = selected.hours[day.key];
                    const isClosed = !slot || !slot.open || !slot.close;
                    return (
                      <tr
                        key={day.key}
                        className="border-b border-slate-800/60 last:border-0"
                      >
                        <td className="py-1.5 pr-2 text-slate-400">
                          {day.label}
                        </td>
                        <td className="py-1.5 text-right">
                          {isClosed ? (
                            <span className="inline-flex rounded-full bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                              Fermé
                            </span>
                          ) : (
                            <span className="text-slate-100">
                              {slot.open} — {slot.close}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <p className="mt-3 text-[11px] text-slate-500">
                Dans la V2, ces heures seront éditables par chaque succursale.
              </p>
            </div>
          </div>

          {/* Upsells */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 shadow-sm">
            <div className="border-b border-slate-800 px-4 py-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-100">
                Upsells suggérés
              </h2>
              <span className="text-[10px] uppercase tracking-wide text-slate-500">
                Lecture seule
              </span>
            </div>
            <div className="p-4 space-y-3">
              {selected.upsells.map((upsell) => (
                <div
                  key={upsell.id}
                  className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900 px-3 py-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-red-700/30 text-[11px] font-semibold text-red-200 border border-red-700/50">
                      +
                    </span>
                    <div>
                      <p className="text-xs font-medium text-slate-100">
                        {upsell.label}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        ID: {upsell.id}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-100">
                    {formatPrice(upsell.price)}
                  </div>
                </div>
              ))}

              {selected.upsells.length === 0 && (
                <p className="text-xs text-slate-500">
                  Aucun upsell configuré pour cette succursale (démo).
                </p>
              )}

              <p className="mt-2 text-[11px] text-slate-500">
                Dans la V2, ces upsells pourront être modifiés dans le panneau
                admin. Pour l&apos;instant, ils montrent au client comment
                l&apos;IA peut proposer des ajouts.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function MenuSection({ title, items, accent }) {
  if (!items || items.length === 0) {
    return (
      <div>
        <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </h3>
        <p className="text-xs text-slate-500">
          Aucun élément configuré (démo).
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {title}
        </h3>
        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-red-700/30 text-[11px] font-semibold text-red-200 border border-red-700/50">
          {accent}
        </span>
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.code}
            className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-slate-100">
                  {item.name}
                </p>
                {item.description && (
                  <p className="text-[11px] text-slate-500">
                    {item.description}
                  </p>
                )}
                <p className="mt-0.5 text-[10px] uppercase tracking-wide text-slate-500">
                  Code: {item.code}
                </p>
              </div>
              <div className="text-xs font-semibold text-slate-100">
                {formatPrice(item.basePrice)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

