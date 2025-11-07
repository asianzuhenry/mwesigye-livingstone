import "./App.css";
// import ProductCard from "./components/ProductCard";
// import Navbar from "./components/Navbar";
// import Hero from "./components/Hero";
// import Footer from "./components/Footer";
// import products from "../products";



import { BrowserRouter, Routes, Route } from "react-router-dom";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Products />} />
        <Route path="/thank-you" element={<Checkout />} />
      </Routes>
    </BrowserRouter>
  );
}
