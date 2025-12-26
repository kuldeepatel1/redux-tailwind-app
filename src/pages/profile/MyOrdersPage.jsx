import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../features/order/orderSlice";
import { fetchProducts } from "../../features/product/productSlice";

export default function MyOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], loading = false, error = null } =
    useSelector((state) => state.orders || {});

  const { products: allProducts = [] } =
    useSelector((state) => state.products || {});

  const { user } = useSelector((state) => state.auth || {});

  // ---------------- PRODUCT MAP ----------------
  const productMap = {};
  allProducts.forEach((p) => {
    productMap[p._id] = p;
  });

  // ---------------- PURCHASE ORDERS ----------------
  const purchaseOrders = user
    ? orders.filter((order) => order.buyer === user._id)
    : [];

  // ---------------- SALES ORDERS ----------------
  const salesOrders = user
    ? orders.filter((order) =>
        order.products?.some((productId) => {
          const product = productMap[productId];
          return product && product.owner === user._id;
        })
      )
    : [];

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchProducts());
  }, [dispatch]);

  // ---------------- LOADING ----------------
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-gray-700">Loading your orders...</p>
      </div>
    );
  }

  // ---------------- ERROR ----------------
  if (error) {
    return (
      <div className="max-w-3xl mx-auto p-6 text-center">
        <p className="text-red-500">Error loading orders: {error}</p>
      </div>
    );
  }

  // ---------------- EMPTY ----------------
  if (!purchaseOrders.length && !salesOrders.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        {/* BACK ICON */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-indigo-600 transition mr-4"
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
          </button>
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        </div>

        {/* EMPTY STATE */}
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
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m10-4h.01M14 9h.01"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No orders yet
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            When you place or sell a product, orders will appear here.
          </p>
        </div>
      </div>
    );
  }

  // ---------------- ORDER CARD ----------------
  const renderOrderCard = (order) => {
    const resolvedProducts = (order.products || [])
      .map((id) => productMap[id])
      .filter(Boolean);

    return (
      <div
        key={order._id}
        className="bg-orange-50 p-4 rounded-xl shadow"
      >
        <div className="flex justify-between items-start mb-2">
          <p className="font-bold">
            Order #{order._id.slice(0, 8)}
          </p>

          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            {order.status || "pending"}
          </span>
        </div>

        <div className="text-sm text-gray-600 mb-2">
          <p>Products: {order.products?.length || 0}</p>
          {order.createdAt && (
            <p>
              Order Date:{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {resolvedProducts.slice(0, 2).map((p) => (
          <div key={p._id} className="flex items-center gap-3 mt-2">
            <img
              src={p.image || "https://via.placeholder.com/500x400?text=No+Image"}
              alt={p.name}
              className="w-10 h-10 rounded object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/500x400?text=No+Image";
              }}
            />
            <div className="text-sm">
              <p className="font-medium">{p.name}</p>
              <p className="text-gray-500">₹{p.price}</p>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-3">
          <p className="font-bold text-lg">
            ₹ {order.totalPrice || 0}
          </p>
          <button className="text-indigo-600 text-sm font-medium">
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      {/* HEADER WITH BACK ICON */}
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-indigo-600 transition mr-4"
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
        </button>
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      </div>

      {purchaseOrders.length > 0 && (
        <>
          <h2 className="text-xl font-bold">My Purchases</h2>
          <div className="space-y-4">
            {purchaseOrders.map(renderOrderCard)}
          </div>
        </>
      )}

      {salesOrders.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-6">My Sales</h2>
          <div className="space-y-4">
            {salesOrders.map(renderOrderCard)}
          </div>
        </>
      )}
    </div>
  );
}
