// src/pages/VoiceDebug.jsx
//
// Milestone 3 — Voice Debug with real TTS audio per assistant turn.
//

import { useState } from "react";
import {
  startConversation,
  handleUserTurn,
} from "../services/conversationEngine.js";
import { generateTtsAudio } from "../services/ttsService.js";
import { logDemoEvent } from "../data/demoLogs.js";

// Map the conversation session into an "order" object for logging/debug.
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

export default function VoiceDebug() {
  const [context, setContext] = useState(() => {
    const { session } = startConversation({ demo: true });
    return session; // context === conversation session
  });

  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [sessionId] = useState(() => `voice-debug-${Date.now()}`);

  async function handleSend(e) {
    e.preventDefault();
    const trimmed = userInput.trim();
    if (!trimmed || isLoading) return;

    setErrorMsg("");
    setIsLoading(true);
    setUserInput("");

    const userMsg = {
      id: `msg-${Date.now()}-u`,
      from: "user",
      text: trimmed,
    };

    try {
      // 1) Advance the conversation state via Turbo engine
      const result = handleUserTurn(context.id, trimmed);
      const nextSession = result.session;
      const botMessages = result.botMessages || [];

      // Base push: user message + assistant text messages (no audio yet)
      const newBotEntries = botMessages.map((bm, idx) => ({
        id: `msg-${Date.now()}-b-${idx}`,
        from: "assistant",
        text: bm.text,
        audioUrl: null,
        language: bm.language,
        backgroundNoiseProfile: bm.backgroundNoiseProfile || null,
      }));

      const pushedBotIds = newBotEntries.map((m) => m.id);

      setContext(nextSession);
      setChatHistory((prev) => [...prev, userMsg, ...newBotEntries]);

      // 2) Generate TTS audio for each assistant reply
      await Promise.all(
        newBotEntries.map(async (msg) => {
          try {
            const voiceHint = {
              language: msg.language || nextSession.language || "fr-CA",
              backgroundNoiseProfile:
                msg.backgroundNoiseProfile || "restaurant",
            };

            const audioResult = await generateTtsAudio(msg.text, voiceHint);

            if (audioResult && audioResult.audioUrl) {
              setChatHistory((prev) =>
                prev.map((m) =>
                  m.id === msg.id ? { ...m, audioUrl: audioResult.audioUrl } : m
                )
              );
            }
          } catch (err) {
            console.error("TTS error:", err);
            setErrorMsg(
              "Erreur lors de la génération audio pour une des réponses. Voir la console."
            );
          }
        })
      );

      // 3) Log to Demo Logs for observability
      logDemoEvent(sessionId, {
        type: "voice_debug_turn",
        userInput: trimmed,
        responses: botMessages.map((bm) => bm.text),
        state: nextSession.state,
        order: buildOrderFromSession(nextSession),
        botMessageIds: pushedBotIds,
      });
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur lors du traitement de la conversation.");
    } finally {
      setIsLoading(false);
    }
  }

  function handleReset() {
    const { session } = startConversation({ demo: true });
    setContext(session);
    setChatHistory([]);
    setUserInput("");
    setErrorMsg("");

    logDemoEvent(sessionId, {
      type: "voice_debug_reset",
    });
  }

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">Voice Debug</h1>
        <p className="text-sm text-gray-600">
          Simule une conversation téléphone avec l’IA. Chaque réponse génère un
          clip audio ElevenLabs (FR-CA bilingue).
        </p>
      </header>

      <form onSubmit={handleSend} className="flex gap-3">
        <input
          type="text"
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          placeholder='Tapez ce que le client dirait… (ex: "livraison", "centre-ville", "grande pizza pepperoni")'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm disabled:opacity-60"
        >
          {isLoading ? "En cours…" : "Envoyer"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm"
        >
          Reset
        </button>
      </form>

      {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

      <section className="border rounded-md bg-white">
        <div className="border-b px-3 py-2 flex justify-between items-center">
          <h2 className="text-sm font-semibold">Conversation</h2>
          <span className="text-xs text-gray-500">Session: {sessionId}</span>
        </div>

        {chatHistory.length === 0 ? (
          <p className="p-3 text-sm text-gray-500">
            Commencez en tapant “livraison” ou “ramassage” pour voir le flux.
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

