/* eslint-env node */
// server/routes/complaintsRoute.js
//
// Receives complaints from the frontend and emails them.

const express = require("express");
const router = express.Router();
const { sendComplaintEmail } = require("../email/sendComplaintEmail.js");

router.post("/", async (req, res) => {
  try {
    const {
      phone,
      issue,
      orderDateHint,
      locationId,
      sessionId,
      language,
    } = req.body || {};

    if (!issue || !phone) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    const payload = {
      phone,
      issue,
      orderDateHint: orderDateHint || "unspecified",
      locationId: locationId || null,
      sessionId: sessionId || "unknown",
      language: language || "fr",
      createdAt: Date.now(),
    };

    // Send email
    await sendComplaintEmail(payload);

    return res.json({ ok: true });
  } catch (err) {
    console.error("[complaintsRoute] Error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;

