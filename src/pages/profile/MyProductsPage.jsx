

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyProducts } from "../../features/product/productSlice";

export default function MyProductsPage() {
  const dispatch = useDispatch();

  const { myProducts = [], loading = false, error = null } =
    useSelector(state => state.products || {});

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  if (loading) return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center">
        <p className="text-gray-700">Loading your products...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center">
        <p className="text-red-500">Error loading products: {error}</p>
      </div>
    </div>
  );

  if (!myProducts.length) return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m10-4h.01M14 9h.01"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No products yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
        <div className="mt-6">
          <Link
            to="/add-product"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Add Product
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <Link
            to="/profile"
            className="flex items-center text-gray-600 hover:text-indigo-600 transition duration-200 mr-4"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        </div>
        <p className="text-gray-600">Manage your product listings</p>
      </div>
      
      {myProducts.map(p => (
        <div
          key={p._id}
          className="flex gap-6 bg-orange-50 p-4 rounded-xl shadow hover:shadow-md transition"
        >
          <img
            src={p.image || "https://via.placeholder.com/150"}
            alt={p.name}
            className="h-24 w-24 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-bold text-lg">{p.name}</h3>
            <p className="text-gray-700 mb-2">₹ {p.price}</p>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">{p.description}</p>
            <Link
              to={`/product/${p._id}`}
              className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
