const ProductCard = ({ product }) => { 
    return (
      <div
        key={product.id}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover hover:scale-105 transition-transform duration-300"
        />

        <div className="p-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-1">
            {product.name}
          </h2>
          <p className="text-gray-500 text-sm mb-3">{product.description}</p>
          <p className="text-lg font-bold text-gray-700 mb-4">
            UGX {product.price}
          </p>

          <button
            onClick={() => (window.location.href = product.link)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium transition-colors duration-300"
          >
            Buy Now
          </button>
        </div>
      </div>
    );
}
export default ProductCard;