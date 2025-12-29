import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";

export default function ProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <p className="text-red-600 font-semibold">User not found</p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/products"
            className="text-gray-500 hover:text-indigo-600 transition"
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
        <p className="text-gray-600 md:text-right">
          Manage your account and track your activity
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row items-center md:justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="h-28 w-28 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-extrabold shadow-lg">
            {user.name
              ? user.name.charAt(0).toUpperCase()
              : user.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              {user.name || "User"}
            </h2>
            <p className="text-gray-600">{user.email}</p>
            {user._id && (
              <p className="text-sm text-gray-500 mt-1 truncate">
                User ID: {user._id}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-6 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 shadow-md transition transform hover:-translate-y-1"
        >
          Logout
        </button>
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/add-product")}
              className="flex items-center p-3 gap-4 border border-gray-200 rounded-xl hover:bg-indigo-50 transition"
            >
              <span className="text-3xl">➕</span>
              <div>
                <p className="font-medium text-gray-900">Add New Product</p>
                <p className="text-sm text-gray-600">Create a new listing</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/products")}
              className="flex items-center p-3 gap-4 border border-gray-200 rounded-xl hover:bg-indigo-50 transition"
            >
              <span className="text-3xl">🛍️</span>
              <div>
                <p className="font-medium text-gray-900">Browse Products</p>
                <p className="text-sm text-gray-600">Shop for products</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex items-center p-3 gap-4 border border-gray-200 rounded-xl hover:bg-indigo-50 transition"
            >
              <span className="text-3xl">🛒</span>
              <div>
                <p className="font-medium text-gray-900">View Cart</p>
                <p className="text-sm text-gray-600">Check your shopping cart</p>
              </div>
            </button>
          </div>
        </div>

        <div className="bg-white shadow-lg rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Your Activity
          </h3>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => navigate("/my-products")}
              className="flex items-center p-3 gap-4 border border-gray-200 rounded-xl hover:bg-indigo-50 transition"
            >
              <span className="text-3xl">📦</span>
              <div>
                <p className="font-medium text-gray-900">My Products</p>
                <p className="text-sm text-gray-600">View your listings</p>
              </div>
            </button>
            <button
              onClick={() => navigate("/my-orders")}
              className="flex items-center p-3 gap-4 border border-gray-200 rounded-xl hover:bg-indigo-50 transition"
            >
              <span className="text-3xl">📋</span>
              <div>
                <p className="font-medium text-gray-900">My Orders</p>
                <p className="text-sm text-gray-600">Track your orders</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Account Information */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Account Information
        </h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <p className="text-gray-900">{user.name || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          {user.phone && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <p className="text-gray-900">{user.phone}</p>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Status
            </label>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
