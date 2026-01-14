// src/App.jsx

import { useState } from "react";
import OrderDebug from "./pages/OrderDebug.jsx";
import RestaurantConfig from "./pages/RestaurantConfig.jsx";
import VoiceDebug from "./pages/VoiceDebug.jsx";
import DemoLogs from "./pages/DemoLogs.jsx";
import AdminTour from "./components/AdminTour.jsx";
import TtsDebug from "./pages/TtsDebug.jsx";
import CallSimulator from "./pages/CallSimulator.jsx";
import AdminComplaints from "./pages/AdminComplaints.jsx";

function AdminOverview() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">
            Admin shell + demo tools (Version 1)
          </h2>
          <p className="text-sm leading-relaxed text-gray-700">
            This environment matches the approved Scope Document for
            Version 1: multi-location shell, demo-mode tools, and a
            phone-first AI ordering flow. Calls open with “Delivery or
            pickup?”, capture the phone number for delivery, then let the
            customer say their whole order in one sentence. A full
            database-backed CMS comes in a later upgrade.
          </p>
        </div>
        <div className="text-xs text-gray-500 text-right">
          <p>Milestone 3 of 3 — polished demo ready</p>
          <p>Branding: Pizza Salvatoré (demo-only)</p>
        </div>
      </div>

      <AdminTour />
    </div>
  );
}

export default function App() {
  // views:
  // admin | restaurants | orderDebug | voiceDebug | callSim | demoLogs | ttsDebug | complaints
  const [view, setView] = useState("admin");

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 via-gray-50 to-gray-100">
      <header className="border-b bg-white/90 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          {/* Left side: icon + title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-rose-600 text-white shadow-sm ring-1 ring-rose-300/40">
              <span className="-mt-[2px]">🍕</span>
            </div>
            <div>
              <h1 className="text-xl font-semibold">
                Pizza Salvatoré — AI Call Centre (Demo)
              </h1>
              <p className="text-xs text-gray-600">
                Internal dev shell • AI ordering, voice + admin
              </p>
            </div>
          </div>

          {/* Right side: badges */}
          <div className="inline-flex items-center gap-2 text-xs text-gray-700 font-medium">
            <span className="px-2 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800">
              Demo Mode
            </span>
            <span className="px-2 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800">
              Branding: Pizza Salvatoré (placeholder)
            </span>
            <span className="px-2 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700">
              Milestone 3 of 3
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <nav className="inline-flex rounded-xl border bg-white p-1.5 text-sm flex-wrap gap-1.5 shadow-sm">
          <button
            type="button"
            onClick={() => setView("admin")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "admin"
                ? "bg-rose-700 text-white border-rose-700 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            Admin Overview
          </button>

          <button
            type="button"
            onClick={() => setView("restaurants")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "restaurants"
                ? "bg-gray-800 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            Restaurant Config
          </button>

          <button
            type="button"
            onClick={() => setView("orderDebug")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "orderDebug"
                ? "bg-gray-800 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            Order Debug
          </button>

          <button
            type="button"
            onClick={() => setView("voiceDebug")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "voiceDebug"
                ? "bg-gray-800 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            Voice Debug
          </button>

          <button
            type="button"
            onClick={() => setView("callSim")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "callSim"
                ? "bg-gray-800 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            Call Simulator
          </button>

          <button
            type="button"
            onClick={() => setView("demoLogs")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "demoLogs"
                ? "bg-gray-800 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            Demo Logs
          </button>

          <button
            type="button"
            onClick={() => setView("ttsDebug")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "ttsDebug"
                ? "bg-gray-800 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            TTS Debug
          </button>

          <button
            type="button"
            onClick={() => setView("complaints")}
            className={
              "px-3.5 py-1.5 rounded-md border text-xs md:text-sm transition-colors " +
              (view === "complaints"
                ? "bg-gray-800 text-white border-gray-900 shadow-sm"
                : "bg-white text-gray-700 border-transparent hover:bg-gray-50")
            }
          >
            Complaints
          </button>
        </nav>

        <section className="bg-white border rounded-xl p-6 shadow-sm">
          {view === "admin" && <AdminOverview />}
          {view === "restaurants" && <RestaurantConfig />}
          {view === "orderDebug" && <OrderDebug />}
          {view === "voiceDebug" && <VoiceDebug />}
          {view === "demoLogs" && <DemoLogs />}
          {view === "ttsDebug" && <TtsDebug />}
          {view === "callSim" && <CallSimulator />}
          {view === "complaints" && <AdminComplaints />}
        </section>
      </main>
    </div>
  );
}

