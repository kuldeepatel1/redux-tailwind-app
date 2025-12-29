import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../features/order/orderSlice";
import { fetchProducts } from "../../features/product/productSlice";

export default function MyOrdersPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders = [], loading = false, error = null } =
  useSelector((state) => state.orders);
  const { products: allProducts = [] } = useSelector(
    (state) => state.products || {}
  );
  const { user } = useSelector((state) => state.auth || {});

  // ---------------- PRODUCT MAP ----------------
  const productMap = {};
  allProducts.forEach((p) => {
    // normalize product id in case it's an object with $oid
    const pid = p._id?.$oid || p._id;
    productMap[pid] = p;
  });

  // ---------------- NORMALIZE ORDERS ----------------
// If backend returns products instead of orders
const normalizedOrders = orders.map((product) => ({
  _id: product._id,
  buyer: user?._id,
  products: [product._id],
  totalPrice: product.price,
  status: "pending",
  createdAt: product.createdAt,
}));


  // ---------------- PURCHASE ORDERS ----------------
const purchaseOrders = user ? normalizedOrders : [];
  // ---------------- SALES ORDERS ----------------
 const salesOrders = user
  ? normalizedOrders.filter((order) =>
      order.products.some((productId) => {
        const product = productMap[productId];
        return product?.seller?._id === user._id;
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
          <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
        </div>

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
        key={order._id?.$oid || order._id}
        className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <div className="flex justify-between items-start mb-4">
          <p className="font-bold text-lg md:text-xl text-gray-800">
            Order #{(order._id?.$oid || order._id).slice(0, 8)}
          </p>

          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              order.status === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.status || "pending"}
          </span>
        </div>

        <div className="text-gray-600 mb-4 space-y-1 text-sm md:text-base">
          <p>Products: {order.products?.length || 0}</p>
          {order.createdAt && (
            <p>Order Date: {new Date(order.createdAt).toLocaleDateString()}</p>
          )}
        </div>

        <div className="flex gap-4 overflow-x-auto py-2">
          {resolvedProducts.map((p) => (
            <div
              key={p._id?.$oid || p._id}
              className="flex-shrink-0 w-24 md:w-32 flex flex-col items-center bg-gray-50 rounded-lg p-2 shadow-sm"
            >
              <img
                src={
                  p.image ||
                  "https://via.placeholder.com/500x400?text=No+Image"
                }
                alt={p.name}
                className="w-20 h-20 md:w-28 md:h-28 rounded-lg object-cover mb-2"
                onError={(e) => {
                  e.target.src =
                    "https://via.placeholder.com/500x400?text=No+Image";
                }}
              />
              <p className="text-center text-sm font-medium">{p.name}</p>
              <p className="text-gray-500 text-sm">₹{p.price}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mt-4">
          <p className="font-bold text-lg md:text-xl text-gray-900">
            ₹ {order.totalPrice || 0}
          </p>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm md:text-base font-semibold rounded-lg transition">
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
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
        <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
      </div>

      {purchaseOrders.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold border-b pb-2 mb-4">
            My Purchases
          </h2>
          <div className="space-y-6">{purchaseOrders.map(renderOrderCard)}</div>
        </>
      )}

      {salesOrders.length > 0 && (
        <>
          <h2 className="text-2xl font-semibold border-b pb-2 mt-10 mb-4">
            My Sales
          </h2>
          <div className="space-y-6">{salesOrders.map(renderOrderCard)}</div>
        </>
      )}
    </div>
  );
}
