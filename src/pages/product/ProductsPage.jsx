import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../features/product/productSlice";
import { Link } from "react-router-dom";
import ProductPageHeader from "../../components/ProductPageHeader";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  if (loading) return (
    <>
      <ProductPageHeader />
      <div className="text-center mt-10">
        <p className="text-gray-700">Loading...</p>
      </div>
    </>
  );

  if (error) return (
    <>
      <ProductPageHeader />
      <div className="text-center mt-10">
        <p className="text-red-500">{error}</p>
      </div>
    </>
  );
  // Filter out products owned by the current user
 const allProducts = user
  ? products.filter((product) => {
      const sellerId =
        product.seller?._id ||
        product.seller ||
        product.user?._id ||
        product.user;

      return sellerId !== user._id;
    })
  : products;


  return (
    <>
      <ProductPageHeader />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Browse products from other sellers</p>


        </div>

        {/* Add Product Button */}
        {user && (
          <div className="mb-6">
            <Link
              to="/add-product"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add New Product
            </Link>
          </div>
        )}



        {/* Products Grid */}
        {allProducts.length === 0 ? (
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new product.</p>
            {user && (
              <div className="mt-6">
                <Link
                  to="/add-product"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Add Product
                </Link>
              </div>
            )}
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allProducts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200"
              >
                <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={
                      p.image
                        ? p.image.startsWith("data:image")
                          ? p.image
                          : `data:image/jpeg;base64,${p.image}`
                        : "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-semibold text-lg text-gray-900 mb-1 truncate">{p.name}</h2>
                  <p className="text-gray-600 text-sm mb-2 line-clamp-2">{p.description}</p>
                  <p className="text-2xl font-bold text-indigo-600 mb-4">₹{p.price}</p>

                  <div className="flex justify-center items-center">
                    <Link
                      to={`/product/${p._id}`}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
