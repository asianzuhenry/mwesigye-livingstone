import { motion } from 'framer-motion';
import { ShoppingCart, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product, index }) => {
  const navigate = useNavigate();

  const handleBuyNow = () => {
    navigate(`/checkout/${product.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="card"
    >
      {/* Product Image */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 shadow-lg">
          <Tag className="w-4 h-4" />
          <span>{product.category}</span>
        </div>
      </div>
      
      {/* Product Info */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
          {product.description}
        </p>
        
        {/* Price and Buy Button */}
        <div className="flex items-center justify-between mt-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">Price</p>
            <p className="text-2xl font-bold text-blue-600">
              UGX {product.price.toLocaleString()}
            </p>
          </div>
          
          <button
            onClick={handleBuyNow}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg font-semibold"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;