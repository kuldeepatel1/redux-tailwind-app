import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);

  if (!user) {
    return (
      <div className="max-w-md mx-auto p-6">
        <div className="text-center">
          <p className="text-red-600">User not found</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <Link
            to="/products"
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
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
        </div>
        <p className="text-gray-600">Manage your account and view your activity</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
        <div className="flex items-center space-x-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
            {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name || "User"}</h2>
            <p className="text-gray-600">{user.email}</p>
            {user._id && (
              <p className="text-sm text-gray-500 mt-1">User ID: {user._id}</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/add-product")}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <span className="text-2xl mr-3">➕</span>
              <div>
                <p className="font-medium text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-600">Create a new product listing</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/products")}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <span className="text-2xl mr-3">🛍️</span>
              <div>
                <p className="font-medium text-gray-900">Browse Products</p>
                <p className="text-sm text-gray-600">Shop for products</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/cart")}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <span className="text-2xl mr-3">🛒</span>
              <div>
                <p className="font-medium text-gray-900">View Cart</p>
                <p className="text-sm text-gray-600">Check your shopping cart</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Activity</h3>
          <div className="space-y-3">
            <button
              onClick={() => navigate("/my-products")}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <span className="text-2xl mr-3">📦</span>
              <div>
                <p className="font-medium text-gray-900">My Products</p>
                <p className="text-sm text-gray-600">View your product listings</p>
              </div>
            </button>
            
            <button
              onClick={() => navigate("/my-orders")}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition duration-200 flex items-center"
            >
              <span className="text-2xl mr-3">📋</span>
              <div>
                <p className="font-medium text-gray-900">My Orders</p>
                <p className="text-sm text-gray-600">Track your orders</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <p className="text-gray-900">{user.name || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
