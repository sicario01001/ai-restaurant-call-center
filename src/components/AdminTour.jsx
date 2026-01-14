// src/components/AdminTour.jsx
//
// Floating bilingual tutorial that explains exactly
// what this Version 1 demo does today.

import { useState } from "react";

export default function AdminTour() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs md:text-sm font-medium text-white shadow-md shadow-rose-300/40 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
      >
        <span role="img" aria-hidden="true">
          ❓
        </span>
        <span>Tutoriel / Tutorial</span>
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-16 right-4 z-40 w-[min(100%-2rem,26rem)] rounded-2xl border border-rose-100 bg-white/95 p-4 shadow-lg shadow-rose-200/60 backdrop-blur">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                Guide rapide • Quick tour
              </p>
              <h3 className="text-sm font-semibold text-gray-900">
                Comment tester le démo / How to test the demo
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-1 text-xs text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="mt-3 space-y-4 text-xs text-gray-700">
            {/* FR section */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                🇫🇷 FLUX RÉEL DU DÉMO (VERSION 1)
              </p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>
                  <span className="font-semibold">Admin Overview</span> : vue
                  d&apos;ensemble interne pour le démo seulement
                  (multi-succursales, outils de debug, journaux).
                </li>
                <li>
                  <span className="font-semibold">Call Simulator</span> :
                  lancez un appel test. L&apos;assistant commence avec{" "}
                  <em>« Livraison ou cueillette ? »</em>.
                </li>
                <li>
                  Si vous dites <em>« Livraison »</em>, il demande le{" "}
                  <span className="font-semibold">numéro de téléphone</span>,
                  puis confirme l&apos;adresse enregistrée (données de
                  démonstration).
                </li>
                <li>
                  Ensuite, vous pouvez dire{" "}
                  <span className="font-semibold">
                    toute la commande en une phrase
                  </span>{" "}
                  (taille, croûte, garnitures, boisson) et l&apos;IA construit
                  la commande structurée en arrière-plan.
                </li>
                <li>
                  Pour tester l&apos;anglais, dites simplement{" "}
                  <em>« Peux-tu parler anglais ? / Can you speak English? »</em>{" "}
                  pendant l&apos;appel et l&apos;assistant bascule de langue.
                </li>
                <li>
                  <span className="font-semibold">Order Debug</span> : montre
                  la version structurée de la commande (taille, croûte,
                  garnitures, upsells).
                </li>
                <li>
                  <span className="font-semibold">Demo Logs</span> : liste des
                  appels de démo récents avec transcripts et indicateurs
                  d&apos;escalade humaine.
                </li>
                <li>
                  <span className="font-semibold">Voice Debug / TTS Debug</span>{" "}
                  : outils internes pour tester la voix ElevenLabs et la
                  mise en cache des phrases.
                </li>
                <li>
                  <span className="font-semibold">Complaints</span> : capture
                  d&apos;une plainte et démonstration du flux
                  d&apos;escalade vers un humain (en mode démo).
                </li>
                <li>
                  <span className="font-semibold">Restaurant Config</span> :
                  maquette de configuration par succursale (
                  <span className="font-semibold">
                    lecture seule dans Version 1
                  </span>
                  ). L&apos;édition complète arrive dans une version future.
                </li>
              </ol>
            </div>

            <hr className="border-dashed border-rose-100" />

            {/* EN section */}
            <div className="space-y-2">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-500">
                🇺🇸 WHAT THIS DEMO ACTUALLY DOES (VERSION 1)
              </p>
              <ol className="list-decimal space-y-1 pl-4">
                <li>
                  <span className="font-semibold">Admin Overview</span>: high-
                  level internal shell just for testing (multi-location demo,
                  debug tools, logs).
                </li>
                <li>
                  In <span className="font-semibold">Call Simulator</span>,
                  start a call. The assistant opens with{" "}
                  <em>“Delivery or pickup?”</em>
                </li>
                <li>
                  If you say <em>“Delivery”</em>, it asks for the{" "}
                  <span className="font-semibold">phone number</span>, then
                  confirms a saved address (demo data).
                </li>
                <li>
                  After that, you can speak{" "}
                  <span className="font-semibold">
                    your whole order in one sentence
                  </span>{" "}
                  (size, crust, toppings, drink) and the AI builds the
                  structured order behind the scenes.
                </li>
                <li>
                  To switch to English mid-call, just say{" "}
                  <em>“Can you speak English?”</em> or{" "}
                  <em>“Parlez-vous français ?”</em> to go the other way. The
                  language for TTS and understanding is updated in-session.
                </li>
                <li>
                  <span className="font-semibold">Order Debug</span> shows the
                  parsed order (size, crust, toppings, upsells) for the last
                  session.
                </li>
                <li>
                  <span className="font-semibold">Demo Logs</span> shows recent
                  demo calls with transcripts and any flags for human
                  escalation or complaints.
                </li>
                <li>
                  <span className="font-semibold">Voice Debug / TTS Debug</span>{" "}
                  are internal tools to test the ElevenLabs voice and phrase
                  caching — not meant for store staff in Version 1.
                </li>
                <li>
                  <span className="font-semibold">Complaints</span> demonstrates
                  how a customer complaint can be captured and routed to a
                  human in this version.
                </li>
                <li>
                  <span className="font-semibold">Restaurant Config</span> is a{" "}
                  read-only preview of how per-location menus, hours, and
                  upsells will be managed. In Version 1 the data is fixed demo
                  content; full editing comes in a later upgrade.
                </li>
              </ol>
            </div>

            <p className="text-[11px] text-gray-500">
              Cette interface est un démo interne : aucune donnée réelle de
              client n&apos;est utilisée. • This is an internal demo only — no
              real customer data is used.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

