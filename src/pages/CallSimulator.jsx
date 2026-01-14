// src/pages/CallSimulator.jsx
//
// Call Simulator for Milestone 3 (Step C.1)
// -----------------------------------------
// Simulates a live phone call in the browser:
// - "Start Call" button
// - Background restaurant ambience (looped at low volume)
// - Conversation uses the new Turbo engine + ElevenLabs voice
// - Each assistant turn generates one or more audio clips
//

import { useEffect, useRef, useState } from "react";
import {
  startConversation,
  handleUserTurn,
} from "../services/conversationEngine.js";
import { generateTtsAudio } from "../services/ttsService.js";
import { logDemoEvent } from "../data/demoLogs.js";
import ambienceSrc from "../assets/restaurant_ambience.mp3";

// Convert conversation session to order for logging
function buildOrderFromSession(session) {
  if (!session) return {};

  return {
    orderType: session.orderType,
    size: session.size,
    crust: session.crust,
    toppings: session.toppings || [],
    upsells: session.upsells || [],
    address: session.address,
    phone: session.phone,
    name: session.name,
    locationId: session.locationId,
  };
}

// Guard: ignore obviously broken/system messages
function isReasonableBotMessage(bm) {
  if (!bm || typeof bm.text !== "string") return false;
  // Real prompts are short sentences; anything huge is likely a code dump / error.
  if (bm.text.length > 500) return false;
  // Extra safety: ignore anything that looks like a JS source header.
  if (
    bm.text.includes(
      "Turbo conversation engine for AI Restaurant Call Centre"
    )
  ) {
    return false;
  }
  return true;
}

export default function CallSimulator() {
  const [isInCall, setIsInCall] = useState(false);

  const [context, setContext] = useState(() => {
    const { session } = startConversation({ demo: true });
    return session; // the Turbo engine's session object
  });

  // Manual language toggle for voice (FR-CA default, EN-CA fallback)
  const [language, setLanguage] = useState("fr");

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionId] = useState(() => `call-sim-${Date.now()}`);

  const ambienceRef = useRef(null);

  // Cleanup ambience on unmount
  useEffect(() => {
    return () => {
      if (ambienceRef.current) {
        ambienceRef.current.pause();
        ambienceRef.current = null;
      }
    };
  }, []);

  function handleStartCall() {
    setIsInCall(true);
    setErrorMsg("");

    const { session } = startConversation({ demo: true });

    setContext(session);
    setChatHistory([]);
    setUserInput("");

    if (ambienceRef.current) {
      try {
        ambienceRef.current.currentTime = 0;
        ambienceRef.current.volume = 0.35;
        ambienceRef.current
          .play()
          .catch((err) =>
            console.warn("[CallSimulator] Ambience play blocked:", err)
          );
      } catch (e) {
        console.warn("[CallSimulator] Ambience error:", e);
      }
    }

    logDemoEvent(sessionId, { type: "call_sim_start" });
  }

  function handleEndCall() {
    setIsInCall(false);
    setUserInput("");

    if (ambienceRef.current) {
      ambienceRef.current.pause();
    }

    logDemoEvent(sessionId, {
      type: "call_sim_end",
    });
  }

  async function handleSend(e) {
    e.preventDefault();
    if (!isInCall || isLoading) return;

    const trimmed = userInput.trim();
    if (!trimmed) return;

    setErrorMsg("");
    setIsLoading(true);
    setUserInput("");

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      from: "user",
      text: trimmed,
    };

    try {
      // 1) Advance conversation using new Turbo engine
      const result = handleUserTurn(context.id, trimmed);
      const nextSession = result.session;
      const allBotMessages = result.botMessages || [];

      // Safety: ignore weird giant messages (like accidental source dumps)
      const botMessages = allBotMessages.filter(isReasonableBotMessage);

      // Add user message + temporary assistant entries (no audio yet)
      const botEntries = botMessages.map((bm, idx) => ({
        id: `msg-${Date.now()}-b-${idx}`,
        from: "assistant",
        text: bm.text,
        audioUrl: null,
        language: bm.language,
        backgroundNoiseProfile: bm.backgroundNoiseProfile || "restaurant",
      }));

      const pushedIds = botEntries.map((b) => b.id);

      setContext(nextSession);
      setChatHistory((prev) => [...prev, userMsg, ...botEntries]);

      // 2) Generate TTS audio for every assistant message
      await Promise.all(
        botEntries.map(async (msg) => {
          try {
            const voiceHint = {
              // Prefer engine-provided language, fallback to manual toggle
              language: msg.language || language,
              backgroundNoiseProfile: msg.backgroundNoiseProfile,
            };

            const audioResult = await generateTtsAudio(msg.text, voiceHint);
            if (audioResult?.audioUrl) {
              setChatHistory((prev) =>
                prev.map((m) =>
                  m.id === msg.id ? { ...m, audioUrl: audioResult.audioUrl } : m
                )
              );
            }
          } catch (err) {
            console.error("[CallSimulator] TTS error:", err);
            setErrorMsg(
              "Erreur audio: impossible de générer un clip pour une des réponses. Voir la console."
            );
          }
        })
      );

      // 3) Log this turn
      logDemoEvent(sessionId, {
        type: "call_sim_turn",
        userInput: trimmed,
        responses: botMessages.map((bm) => bm.text),
        state: nextSession.state,
        order: buildOrderFromSession(nextSession),
        botMessageIds: pushedIds,
      });
    } catch (err) {
      console.error("[CallSimulator] Conversation error:", err);
      setErrorMsg("Erreur lors du traitement de la conversation.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-xl font-semibold">Call Simulator</h1>
<p className="text-sm text-gray-600">
  Simule un appel téléphonique complet avec l&apos;assistante. Le
  scénario cible&nbsp;: elle commence par «&nbsp;Livraison ou
  cueillette&nbsp;?&nbsp;», puis pour la livraison demande le numéro de
  téléphone, confirme l&apos;adresse, et ensuite vous laissez le client
  dire sa commande au complet dans une seule phrase (taille, croûte,
  garnitures, boissons). Un bruit de fond de restaurant joue doucement
  et chaque réponse génère un clip audio ElevenLabs. Les commandes
  complètes sont enregistrées dans le panneau Admin (Version 1).
</p>

        {/* Manual language toggle for voice */}
        <div className="flex items-center gap-2 text-xs text-gray-700">
          <span className="font-medium">Langue de la voix:</span>
          <button
            type="button"
            onClick={() => setLanguage("fr")}
            className={
              "px-2 py-1 rounded border text-xs " +
              (language === "fr"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300")
            }
          >
            FR-CA (par défaut)
          </button>
          <button
            type="button"
            onClick={() => setLanguage("en")}
            className={
              "px-2 py-1 rounded border text-xs " +
              (language === "en"
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300")
            }
          >
            EN-CA
          </button>
        </div>

        {/* Ambience preview / manual control */}
        <div className="flex flex-col gap-1 text-xs text-gray-600 bg-gray-50 border border-dashed border-gray-200 rounded-md p-2">
          <span className="font-medium">
            Bruit de fond du restaurant (aperçu)
          </span>
          <span>
            Si vous n&apos;entendez pas le fond sonore après avoir démarré
            l&apos;appel, appuyez sur Play ici une fois pour l&apos;activer.
          </span>

          <audio
            ref={ambienceRef}
            src={ambienceSrc}
            loop
            controls
            className="mt-1 w-full"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleStartCall}
            disabled={isInCall}
            className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm disabled:opacity-60"
          >
            {isInCall ? "Appel en cours…" : "Démarrer l'appel"}
          </button>
          <button
            type="button"
            onClick={handleEndCall}
            disabled={!isInCall}
            className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm disabled:opacity-60"
          >
            Terminer l'appel
          </button>
          <span
            className={
              "text-xs px-2 py-1 rounded-full border " +
              (isInCall
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-gray-50 text-gray-500 border-gray-200")
            }
          >
            {isInCall ? "Statut: en appel" : "Statut: inactif"}
          </span>
        </div>
      </header>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <form onSubmit={handleSend} className="flex gap-3" aria-disabled={!isInCall}>
        <input
          type="text"
          className="flex-1 border rounded-md px-3 py-2 text-sm disabled:bg-gray-50"
placeholder={
  isInCall
    ? 'Ce que le client dirait… ex: "Livraison, mon numéro c’est 514-555-1234, une grande toute garnie croûte mince avec extra fromage et un 2L de Coke."'
    : "Démarrez l'appel pour commencer la simulation."
}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          disabled={!isInCall || isLoading}
        />
        <button
          type="submit"
          disabled={!isInCall || isLoading}
          className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm disabled:opacity-60"
        >
          {isLoading ? "En cours…" : "Envoyer"}
        </button>
      </form>

      <section className="border rounded-md bg-white">
        <div className="border-b px-3 py-2 flex justify-between items-center">
          <h2 className="text-sm font-semibold">Journal de l'appel</h2>
          <span className="text-xs text-gray-500">Session: {sessionId}</span>
        </div>

        {chatHistory.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">
            Démarrez l&apos;appel, puis tapez ce que le client dirait. Chaque
            réponse de l&apos;assistante apparaît ici avec un bouton audio.
          </p>
        ) : (
          <div className="p-3 space-y-3 max-h-[480px] overflow-auto">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={
                  "flex flex-col max-w-xl " +
                  (msg.from === "user" ? "items-end ml-auto" : "items-start")
                }
              >
                <div
                  className={
                    "px-3 py-2 rounded-lg text-sm " +
                    (msg.from === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-900")
                  }
                >
                  {msg.text}
                </div>

                {msg.from === "assistant" && msg.audioUrl && (
                  <div className="mt-1">
                    <audio controls src={msg.audioUrl} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

