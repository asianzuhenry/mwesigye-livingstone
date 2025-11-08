import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { Package } from 'lucide-react';
import { products } from '../data/products';

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Hero />
      
      {/* Products Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <Package className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Our Products
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Browse our collection and buy instantly with secure Pesapal payments
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              index={index}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 MyShop. Secure payments powered by Pesapal.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;