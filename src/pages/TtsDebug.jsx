// src/pages/TtsDebug.jsx
//
// Simple dev page to test ElevenLabs TTS with our FR-CA voice.
//

import { useState } from "react";
import { buildVoiceConfig } from "../services/voiceService.js";
import { generateTtsAudio } from "../services/ttsService.js";

export default function TtsDebug() {
  const [text, setText] = useState(
    "Bonjour! Ceci est un test en français canadien. Now switching to English — please confirm your order."
  );
  const [audioUrl, setAudioUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleGenerate() {
    setIsLoading(true);
    setErrorMsg("");
    setAudioUrl(null);

    try {
      const cfg = buildVoiceConfig({ text, cacheKey: "tts_debug_sample" });
      const result = await generateTtsAudio(text, cfg);
      setAudioUrl(result.audioUrl);
    } catch (err) {
      console.error(err);
      setErrorMsg("Erreur lors de la génération audio. Voir la console.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <header className="space-y-1">
        <h1 className="text-xl font-semibold">TTS Debug</h1>
        <p className="text-sm text-gray-600">
          Génère de l’audio avec la voix ElevenLabs (FR-CA bilingue) pour les
          tests internes.
        </p>
      </header>

      <textarea
        className="w-full border rounded-md p-3 text-sm"
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading}
        className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50 text-sm disabled:opacity-60"
      >
        {isLoading ? "Génération en cours…" : "Générer l’audio"}
      </button>

      {errorMsg && (
        <p className="text-sm text-red-600">
          {errorMsg}
        </p>
      )}

      {audioUrl && (
        <div className="mt-4 space-y-1">
          <p className="text-xs text-gray-600">
            Aperçu audio (cache activé pour ce texte).
          </p>
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
}

