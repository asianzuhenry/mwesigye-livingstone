import "./App.css";
import ProductCard from "./components/ProductCard";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    price: 30000,
    image:
      "https://images.unsplash.com/photo-1519677100203-a0e668c92439?auto=format&fit=crop&w=500&q=80",
    description: "Noise-cancelling over-ear headphones for immersive sound.",
    link: "https://buy.stripe.com/test_9AQeYy7aH3fVfYk6oo",
  },
  {
    id: 2,
    name: "Smart Watch",
    price: 50000,
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80",
    description: "Fitness tracker with heart rate and sleep monitor.",
    link: "https://buy.stripe.com/test_14kg1C6xM6wZgVq6oo",
  },
  {
    id: 3,
    name: "Bluetooth Speaker",
    price: 25000,
    image:
      "https://images.unsplash.com/photo-1570829460005-c840387bb1ca?auto=format&fit=crop&w=500&q=80",
    description: "Portable speaker with deep bass and clear sound.",
    link: "https://buy.stripe.com/test_00g3cv2lb7oY7vq6op",
  },
  {
    id: 4,
    name: "E-book Reader",
    price: 60000,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
    description: "Lightweight e-reader with adjustable backlight.",
    link: "https://buy.stripe.com/test_5kA8yU2lb4oY7vq6op",
  },
  {
    id: 5,
    name: "Gaming Mouse",
    price: 80000,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=500&q=80",
    description: "Ergonomic mouse with customizable buttons and RGB lighting.",
    link: "https://buy.stripe.com/test_9AQeYy7aH3fVfYk6oo",
  },
];

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <Hero />
      <div className="p-12">
        <h2 className="text-3xl text-center font-bold mb-6">Featured Products</h2>
        <div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto py-8"
          id="products"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
