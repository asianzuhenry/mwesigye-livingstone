// src/pages/Checkout.jsx
import React, { useState } from "react";

export default function Checkout() {
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    setLoading(true);
    const response = await fetch("/.netlify/functions/pesapal-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 2000,
        email: "customer@example.com",
        description: "Purchase of Product A",
        reference: "ORDER-12345",
      }),
    });

    const data = await response.json();
    setLoading(false);
    if (data.redirect_url) {
      window.location.href = data.redirect_url;
    } else {
      alert("Payment initialization failed.");
      console.error(data);
    }
  }

  return (
    <div className="checkout">
      <h2>Pay with Pesapal</h2>
      <button onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}
