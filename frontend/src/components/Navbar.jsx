import { Link } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <ShoppingBag className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
            <span className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              MyShop
            </span>
          </Link>

          <Link 
            to="/" 
            className="text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;