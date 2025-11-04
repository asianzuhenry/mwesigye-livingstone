const Hero = () => {
  return (
    <section className="h-screen flex items-center bg-blue-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-4">Welcome to Our Store</h1>
        <p className="text-xl mb-8">
          Find the best products at unbeatable prices.
        </p>
        <a
          href="#products"
          className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-gray-200 transition"
        >
          Shop Now
        </a>
      </div>
    </section>
  );
};

export default Hero;
