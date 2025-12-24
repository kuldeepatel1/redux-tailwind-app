

import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById, clearProduct } from "../../features/product/productSlice";

import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const { addToCart: addToCartContext } = useContext(CartContext);
  const { product, loading, error } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);



  const handleAddToCart = () => {
    if (product && user) {
      try {
        console.log('Adding product to cart:', product._id);
        
        // Prepare product data for context-based cart
        const productData = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
        };
        
        // Use context-based cart
        addToCartContext(productData);
        console.log('Product added to cart successfully');
        setShowSuccess(true);
        
        setTimeout(() => setShowSuccess(false), 3000);
      } catch (error) {
        console.error('Add to cart failed:', error);
      }
    }
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }

    return () => {
      dispatch(clearProduct());
    };
  }, [dispatch, id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }


  if (error) {
    return (
      <div className="text-center mt-10">
        <p className="text-red-500 mb-4">{typeof error === 'object' ? error.message || JSON.stringify(error) : error}</p>
        <Link
          to="/products"
          className="text-indigo-600 hover:underline"
        >
          ← Back to Products
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center mt-10 text-gray-500">
        Product not found
      </div>
    );
  }


  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Back */}
      <Link
        to="/products"
        className="text-sm text-indigo-600 hover:underline mb-4 inline-block"
      >
        ← Back to Products
      </Link>

      {/* Success/Error Messages */}
      {showSuccess && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-md">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Product added to cart successfully!
          </div>
        </div>
      )}




      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div className="w-full h-80 bg-gray-100 flex items-center justify-center">
          <img
            src={product.image || "https://via.placeholder.com/500x400?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Details */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <p className="text-gray-600 mb-4">
            {product.description}
          </p>

          <p className="text-3xl font-bold text-indigo-600 mb-6">
            ₹{product.price}
          </p>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-medium">Stock:</span>{" "}
              {product.stock ?? "N/A"}
            </p>
            <p>
              <span className="font-medium">Product ID:</span>{" "}
              {product._id}
            </p>
          </div>


          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleAddToCart}
              disabled={!user}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition disabled:opacity-50"
            >
              Add to Cart
            </button>

            <Link
              to="/cart"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
            >
              Go to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
