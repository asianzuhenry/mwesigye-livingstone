import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 mx-auto text-yellow-300" />
          </motion.div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Welcome to Your Personal Store
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Discover amazing products with secure Pesapal payments
          </p>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-sm text-blue-200"
          >
            💳 Secure payments via Visa, Mastercard, and Mobile Money
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;