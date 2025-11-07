// src/components/Products.jsx
import { useState } from "react";
import { ShoppingCart, AlertCircle, CheckCircle } from "lucide-react";
import products from "../data/products";

const Products = () => {
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-UG', {
      style: 'currency',
      currency: 'UGX',
      minimumFractionDigits: 0
    }).format(price);
  };

  const initiatePayment = (product) => {
    setSelectedProduct(product);
    setShowEmailModal(true);
    setError(null);
  };

  const handlePayment = async () => {
    if (!userEmail || !userEmail.includes('@')) {
      setError({ type: 'error', message: "Please enter a valid email address" });
      return;
    }

    setLoadingId(selectedProduct.id);
    setError(null);
    setShowEmailModal(false);

    try {
      // ✅ CORRECT: Call YOUR Netlify function (backend)
      const response = await fetch("/.netlify/functions/pesapal-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedProduct.price,
          email: userEmail,
          description: selectedProduct.description,
          reference: `ORDER-${selectedProduct.id}-${Date.now()}`,
        }),
      });

      const data = await response.json();
      console.log("Payment response:", data);

      if (data.success && data.redirect_url) {
        setError({ type: 'success', message: 'Redirecting to payment...' });
        setTimeout(() => {
          window.location.href = data.redirect_url;
        }, 1000);
      } else {
        setError({ 
          type: 'error', 
          message: data.error || "Payment initialization failed" 
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setError({ 
        type: 'error', 
        message: "Connection error. Please try again." 
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Package
          </h1>
          <p className="text-lg text-gray-600">
            Select the perfect plan for your needs
          </p>
        </div>

        {/* Error/Success Alert */}
        {error && (
          <div className={`max-w-2xl mx-auto mb-8 p-4 rounded-lg flex items-center gap-3 ${
            error.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {error.type === 'success' ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm font-medium">{error.message}</p>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-sm underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative h-48">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow-md">
                  <span className="text-sm font-bold">{formatPrice(product.price)}</span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-6 min-h-[3rem]">
                  {product.description}
                </p>

                <button
                  disabled={loadingId === product.id}
                  onClick={() => initiatePayment(product)}
                  className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 ${
                    loadingId === product.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loadingId === product.id ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Pay Now
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Email Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Purchase
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedProduct?.name} - {formatPrice(selectedProduct?.price)}
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowEmailModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={!userEmail}
                  className={`flex-1 px-4 py-3 rounded-lg font-semibold ${
                    userEmail
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;