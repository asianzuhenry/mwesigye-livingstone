// frontend/src/pages/Products.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // if you use react-router

const PRODUCTS = [
  { id: 'p1', name: 'Handmade Mug', price: '25.00', currency: 'USD', description: 'A simple handmade ceramic mug', image: '/images/mug.jpg' },
  { id: 'p2', name: 'Canvas Tote', price: '15.00', currency: 'USD', description: 'Durable canvas tote bag', image: '/images/tote.jpg' },
  { id: 'p3', name: 'Sticker Pack', price: '5.00', currency: 'USD', description: 'Set of 6 stickers', image: '/images/stickers.jpg' }
];

export default function Products() {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);

  const handleBuy = async (product) => {
    setError(null);
    setLoadingId(product.id);

    try {
      const resp = await fetch('http://localhost:5001/api/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product })
      });

      const data = await resp.json();
      if (!resp.ok || !data.success) {
        throw new Error(data?.details || data?.error || 'Payment init failed');
      }

      // data.url should be payment redirect link
      window.location.href = data.url;
    } catch (err) {
      console.error('Payment init error', err);
      setError(err.message || 'Failed to initialize payment');
      setLoadingId(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Products</h1>
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="border rounded p-4 flex flex-col">
            <img src={p.image} alt={p.name} className="w-full h-40 object-cover mb-3 rounded" />
            <h2 className="font-medium">{p.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{p.description}</p>
            <div className="mt-auto">
              <div className="text-lg font-semibold">{p.currency} {p.price}</div>
              <button
                className="mt-3 w-full py-2 rounded bg-blue-600 text-white disabled:opacity-60"
                onClick={() => handleBuy(p)}
                disabled={loadingId === p.id}
              >
                {loadingId === p.id ? 'Redirecting...' : 'Buy Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
