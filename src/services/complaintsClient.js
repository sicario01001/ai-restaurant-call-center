// src/services/complaintsClient.js
//
// Frontend helper to POST a complaint to the backend server.
// Called by the conversation engine when the AI detects a serious issue.

const SERVER_URL =
  import.meta.env.VITE_SERVER_URL || "http://localhost:5174";

export async function sendComplaintToServer(payload) {
  try {
    const res = await fetch(`${SERVER_URL}/api/complaints`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("[complaintsClient] server error:", data);
    }
    return data;
  } catch (err) {
    console.error("[complaintsClient] fetch error:", err);
    return { error: true };
  }
}

