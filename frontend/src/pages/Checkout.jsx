import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getProductById } from "../data/products";
import {
  Loader2,
  CreditCard,
  ArrowLeft,
  ShieldCheck,
  Lock,
} from "lucide-react";

const Checkout = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const product = getProductById(productId);

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Product not found</p>
          <button onClick={() => navigate("/")} className="btn-primary">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    if (!formData.email || !formData.firstName || !formData.phone) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setProcessing(true);
      setError(null);

      console.log("🔄 Initializing payment...");

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/initialize`,
        {
          product: {
            name: product.name,
            description: product.description,
            price: product.price,
          },
          customer: formData,
        }
      );

      console.log("✅ Payment response:", response.data);
      if (response.data.success && response.data.data.redirectUrl) {
        // Store order tracking ID
        localStorage.setItem(
          "orderTrackingId",
          response.data.data.orderTrackingId
        );
        localStorage.setItem("productName", product.name);

        // Redirect to Pesapal (or success page in mock mode)
        window.location.href = response.data.data.redirectUrl;
      } else {
        throw new Error("Invalid payment response");
      }
    } catch (err) {
      console.error("❌ Payment error:", err);
      setError(
        err.response?.data?.message ||
          "Failed to process payment. Please check your details and try again."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 mb-8 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Products</span>
        </button>

        <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">
          Secure Checkout
        </h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg p-6 h-fit">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              Order Summary
            </h2>

            <div className="mb-6">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h3 className="font-bold text-xl mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4">
                {product.description}
              </p>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>UGX {product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>UGX 0</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t">
                <span>Total</span>
                <span className="text-blue-600">
                  UGX {product.price.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Security Badge */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-green-700">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-semibold">Secure Payment</span>
              </div>
              <p className="text-xs text-green-600 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center space-x-2 mb-6">
              <CreditCard className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">
                Payment Details
              </h2>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start space-x-2">
                <span>⚠️</span>
                <span className="text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    placeholder="John"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                    className="input-field"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+256700000000"
                  className="input-field"
                />
              </div>

              {/* Payment Methods Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 my-6">
                <div className="flex items-center space-x-2 text-blue-700 mb-2">
                  <Lock className="w-4 h-4" />
                  <span className="text-sm font-semibold">
                    Accepted Payment Methods
                  </span>
                </div>
                <div className="flex items-center space-x-3 text-xs text-blue-600">
                  <span>💳 Visa</span>
                  <span>💳 Mastercard</span>
                  <span>📱 Mobile Money</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={processing}
                className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed py-4 text-lg"
              >
                {processing ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Proceed to Secure Payment</span>
                  </>
                )}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                You will be redirected to Pesapal to complete your payment
                securely
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
