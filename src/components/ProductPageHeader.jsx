import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductPageHeader() {
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Profile Icon - Left Side */}
          <Link
            to="/profile"
            className="flex items-center space-x-3 text-gray-700 hover:text-indigo-600 transition duration-200"
          >
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-lg font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : user?.email?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium">
              {user?.name || user?.email}
            </span>
          </Link>

          {/* Cart Icon - Right Side */}
          <Link
            to="/cart"
            className="relative flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition duration-200"
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6H19m-12 0A1 1 0 004 20h16a1 1 0 001-1M8 21a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z"
              />
            </svg>
            {items && items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
              </span>
            )}
            <span className="hidden sm:block text-sm font-medium">Cart</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
