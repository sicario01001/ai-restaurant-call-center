// src/services/conversationEngine.js

import { logDemoEvent } from "../data/demoLogs.js";
import { sendComplaintToServer } from "./complaintsClient.js";

let SESSIONS = {};

function newSession({ demo = false }) {
  const id = `sess-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  SESSIONS[id] = {
    id,
    demo,
    state: "start",
    language: "fr",
    orderType: null,
    size: null,
    crust: null,
    toppings: [],
    phone: null,
    address: null,
    locationId: null,
    upsells: [],
    isComplaint: false,
    complaintIssue: null,
    complaintDateHint: null,
  };

  return { session: SESSIONS[id] };
}

export function startConversation(opts = {}) {
  return newSession(opts);
}

function setLanguage(session, langCode) {
  session.language = langCode;
}

function detectLanguageSwitch(text) {
  const lower = text.toLowerCase();
  const engHints = ["english", "speak english", "in english", "do you speak"];
  const frHints = ["français", "parlez français", "en français"];

  if (engHints.some((w) => lower.includes(w))) return "en";
  if (frHints.some((w) => lower.includes(w))) return "fr";
  return null;
}

/**
 * Complaint detection — lightweight keywords.
 */
function detectComplaintIntent(text) {
  const t = text.toLowerCase();
  return (
    t.includes("wrong") ||
    t.includes("cold") ||
    t.includes("missing") ||
    t.includes("late") ||
    t.includes("bad") ||
    t.includes("complaint") ||
    t.includes("not good") ||
    t.includes("problem")
  );
}

export function handleUserTurn(sessionId, text) {
  const session = SESSIONS[sessionId];
  if (!session) {
    return {
      session: null,
      botMessages: [{ text: "Session expired.", language: "fr" }],
    };
  }

  // 1) Language switch detection
  const lang = detectLanguageSwitch(text);
  if (lang) {
    setLanguage(session, lang);
    return {
      session,
      botMessages: [
        {
          text:
            lang === "en"
              ? "Sure, no worries — I can continue in English!"
              : "Bien sûr, aucun problème — je peux continuer en français!",
          language: lang,
        },
      ],
    };
  }

  // 2) Complaint intent detection
  if (detectComplaintIntent(text) && !session.isComplaint) {
    session.isComplaint = true;
    session.state = "collecting_complaint";
    return {
      session,
      botMessages: [
        {
          text:
            session.language === "en"
              ? "Oh I'm really sorry about that — let me take the details so a manager can follow up."
              : "Oh je suis vraiment désolé pour ça — laissez-moi prendre les détails pour qu’un responsable vous rappelle.",
          language: session.language,
        },
        {
          text:
            session.language === "en"
              ? "Can you tell me briefly what went wrong?"
              : "Pouvez-vous me dire brièvement ce qui s’est passé?",
          language: session.language,
        },
      ],
    };
  }

  // 3) Capture complaint details
  if (session.isComplaint) {
    if (!session.complaintIssue) {
      session.complaintIssue = text;
      return {
        session,
        botMessages: [
          {
            text:
              session.language === "en"
                ? "Got it — when did that order happen? Today, yesterday, or earlier?"
                : "D’accord — c’était quand la commande? Aujourd’hui, hier ou avant?",
            language: session.language,
          },
        ],
      };
    }

    if (!session.complaintDateHint) {
      session.complaintDateHint = text;

      const payload = {
        phone: session.phone || "unknown",
        issue: session.complaintIssue,
        orderDateHint: session.complaintDateHint,
        locationId: session.locationId,
        sessionId: session.id,
        language: session.language,
        createdAt: Date.now(),
      };

      logDemoEvent(session.id, {
        type: "complaint",
        payload,
      });

      // Send to backend
      sendComplaintToServer(payload);

      return {
        session,
        botMessages: [
          {
            text:
              session.language === "en"
                ? "Thank you — I’ve sent that to a manager and they will follow up. Is there anything else I can help with today?"
                : "Merci — j’ai envoyé ces informations à un responsable qui vous contactera. Puis-je vous aider avec autre chose?",
            language: session.language,
          },
        ],
      };
    }
  }

  // 4) Fallback — ordering continues normally.
  return {
    session,
    botMessages: [
      {
        text:
          session.language === "en"
            ? "I heard you — tell me more!"
            : "Je vous écoute — dites-m'en plus!",
        language: session.language,
      },
    ],
  };
}

