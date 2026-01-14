// src/services/demoService.js
// Milestone 1 – Demo mode scaffolding (stub)
// In Milestone 2+, this will store demo logs separately from live logs.

let demoLogs = []

export function logDemoInteraction({ sessionId, userMessage, systemReply }) {
  demoLogs.push({
    sessionId,
    timestamp: Date.now(),
    userMessage,
    systemReply,
  })
}

export function getDemoLogs() {
  return demoLogs
}

