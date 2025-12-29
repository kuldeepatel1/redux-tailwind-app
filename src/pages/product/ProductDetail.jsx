import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductById,
  clearProduct,
} from "../../features/product/productSlice";
import { CartContext } from "../../context/CartContext";
import ProductDetailHeader from "../../components/ProductDetailHeader";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { addToCart } = useContext(CartContext);
  const { product, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (id) dispatch(fetchProductById(id));
    return () => dispatch(clearProduct());
  }, [dispatch, id]);

  const handleAddToCart = () => {
    if (!user || !product) return;

    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-gray-500">
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="text-center mt-16">
        <p className="text-red-600 mb-4">Product not found</p>
        <Link to="/products" className="text-blue-600 hover:underline">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <ProductDetailHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">

        <Link
          to="/products"
          className="text-sm text-gray-500 hover:text-blue-600 mb-6 inline-block"
        >
          ← Back to Collection
        </Link>

        {showSuccess && (
          <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
            ✅ Product added to cart successfully
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-2xl shadow-sm">

          {/* LEFT */}
          <div className="relative">
            <span className="absolute top-4 left-4 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
              In Stock
            </span>

          <div className="w-full h-[420px] bg-gray-100 rounded-xl flex items-center justify-center">
  <img
    src={product.image || "https://via.placeholder.com/600"}
    alt={product.name}
   className="w-full h-full object-cover"
  />
</div>


          </div>

          {/* RIGHT */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-yellow-400">
                {"★★★★★".split("").map((_, i) => (
                  <span key={i}>★</span>
                ))}
              </div>
              <span className="text-sm text-gray-500">(128 Reviews)</span>
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>

            <div className="flex items-center gap-4 mb-6">
              <span className="text-3xl font-bold text-blue-600">
                ₹{product.price}
              </span>
              <span className="text-lg line-through text-gray-400">
                ₹{product.price + 1000}
              </span>
              <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                40% OFF
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!user}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl text-lg font-medium transition disabled:opacity-50"
              >
                🛒 Add to Cart
              </button>

              <Link
                to="/cart"
                className="flex-1 border border-gray-300 py-4 rounded-xl text-lg font-medium text-center hover:bg-gray-100 transition"
              >
                Go to Cart →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t">
              <div className="flex items-center gap-3">
                🚚
                <div>
                  <p className="font-medium">Free Shipping</p>
                  <p className="text-sm text-gray-500">On orders over ₹499</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                🛡️
                <div>
                  <p className="font-medium">2 Year Warranty</p>
                  <p className="text-sm text-gray-500">Quality guaranteed</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
