import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../../features/product/productSlice";
import { Link } from "react-router-dom";
import ProductPageHeader from "../../components/ProductPageHeader";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const { products, loading, error, pagination } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchProducts(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo(0, 0); // Scroll to top when page changes
  };

  const handleNextPage = () => {
    if (currentPage < pagination.pages) {
      handlePageChange(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

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

  // Filter products based on search term (name and description)
  const filteredProducts = allProducts.filter((product) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const name = product.name?.toLowerCase() || "";
    const description = product.description?.toLowerCase() || "";
    
    return name.includes(searchLower) || description.includes(searchLower);
  });

  return (
    <>
      <ProductPageHeader   searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}/>

{/* HERO SECTION – FULL WIDTH */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
  <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 px-12 py-14">
    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
      Next-Gen Electronics.
    </h1>

    <p className="text-blue-200 max-w-xl mb-8">
      Discover our curated collection of premium gadgets and high-performance devices.
    </p>

    <div className="flex gap-4">
      <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-medium transition">
        Shop Collection
      </button>
      <button className="border border-white/40 hover:bg-white/10 px-6 py-3 rounded-full text-white font-medium transition">
        Learn More
      </button>
    </div>
  </div>
</div>

{/* MAIN CONTENT */}
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">


        {/* Header */}
        {/* Products Header */}
<div className="flex items-center justify-between mb-10">
  <div>
    <h2 className="text-3xl font-bold text-gray-900">All Products</h2>
    <p className="text-gray-500 mt-1">
      Browse high-quality products from trusted sellers
    </p>
  </div>

  {user && (
    <Link
      to="/add-product"
      className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 transition"
    >
      <span className="text-xl">+</span>
      Add New Product
    </Link>
  )}
</div>


        {/* Search Bar */}


        {/* Add Product Button */}
        {/* {user && (
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
        )} */}

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
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
          <>
            <div className="grid grid-cols-4 gap-4 max-w-6xl mx-auto">
              {filteredProducts.slice(0, 8).map((p) => (
                <div
                  key={p._id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition duration-200"
                >
                  <div className="w-full h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img
                      src={p.image || "https://via.placeholder.com/500x400?text=No+Image"}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/500x400?text=No+Image";
                      }}
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

            {/* Pagination Controls */}
            {pagination.pages > 1 && (
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {/* Page Info */}
                <div className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{pagination.page}</span> of{' '}
                  <span className="font-medium">{pagination.pages}</span>
                  {pagination.total && (
                    <span className="ml-2">
                      ({pagination.total} total products)
                    </span>
                  )}
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={handlePrevPage}
                    disabled={pagination.page <= 1}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                      pagination.page <= 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4 mr-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous
                  </button>

                  {/* Next Button */}
                  <button
                    onClick={handleNextPage}
                    disabled={pagination.page >= pagination.pages}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition duration-200 ${
                      pagination.page >= pagination.pages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700'
                    }`}
                  >
                    Next
                    <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
