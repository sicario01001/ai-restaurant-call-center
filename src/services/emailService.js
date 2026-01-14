// src/services/emailService.js
//
// Demo-friendly email service stub.
// In Version 2 this can be wired to EmailJS, SendGrid, or a backend endpoint.

export async function sendComplaintEmail(complaint) {
  try {
    // In a real implementation, this is where you'd call:
    // - EmailJS
    // - A Firebase Function
    // - A custom backend endpoint
    //
    // For Version 1 we keep it as a demo-only logger so nothing breaks
    // if there is no email backend configured.

    console.info("[emailService] Complaint email (demo):", {
      to: "owner@example.com",
      subject: "New customer complaint (demo)",
      complaint,
    });

    return { success: true };
  } catch (err) {
    console.error("[emailService] Failed to send complaint email:", err);
    return { success: false, error: err?.message || "Unknown error" };
  }
}

