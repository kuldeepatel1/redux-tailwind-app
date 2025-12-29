import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductPageHeader({ searchTerm, setSearchTerm }) {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  const userInitial =
    user?.name?.charAt(0).toUpperCase() ||
    user?.email?.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* LEFT – Profile */}
          <Link
            to="/profile"
            className="group flex items-center gap-3 hover:opacity-90 transition"
          >
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                {userInitial}
              </div>
              <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></span>
            </div>

            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-sm font-semibold text-gray-800">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-gray-500">View Profile</span>
            </div>
          </Link>

          {/* CENTER – Search Bar */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 rounded-full border border-gray-300 bg-white shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />

              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-3 text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* RIGHT – Cart */}
          <Link
            to="/cart"
            className="group relative flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-indigo-50 transition"
          >
            <svg
              className="h-6 w-6 text-gray-700 group-hover:text-indigo-600 transition"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 6H19M8 21a1 1 0 100-2m8 2a1 1 0 100-2"
              />
            </svg>

            {items?.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold h-5 w-5 rounded-full flex items-center justify-center animate-pulse">
                {items.length}
              </span>
            )}

            <span className="hidden sm:block text-sm font-medium text-gray-700 group-hover:text-indigo-600">
              Cart
            </span>
          </Link>

        </div>
      </div>
    </header>
  );
}
