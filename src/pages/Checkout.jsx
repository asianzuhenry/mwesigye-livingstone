// src/pages/Checkout.jsx
import React, { useEffect, useState } from "react";

export default function Checkout() {
  const [status, setStatus] = useState("Verifying payment...");

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const orderTrackingId = query.get("OrderTrackingId");

    if (!orderTrackingId) {
      setStatus("Invalid payment reference. Please contact support.");
      return;
    }

    async function verifyPayment() {
      try {
        const res = await fetch("/.netlify/functions/pesapal-verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderTrackingId }),
        });
        const data = await res.json();

        if (data.payment_status_description === "COMPLETED") {
          setStatus("✅ Payment successful! Thank you for your purchase.");
        } else if (data.payment_status_description === "PENDING") {
          setStatus("⌛ Payment pending. Please wait a few moments.");
        } else {
          setStatus("❌ Payment failed or cancelled.");
        }
      } catch (err) {
        console.error(err);
        setStatus("⚠️ Verification failed. Please try again later.");
      }
    }

    verifyPayment();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-blue-600">Payment Status</h1>
      <p className="text-gray-700 text-lg">{status}</p>
    </div>
  );
}
