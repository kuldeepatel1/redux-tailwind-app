
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { fetchCart, removeFromCart, checkout } from "../../features/cart/cartSlice";


export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, loading, checkoutLoading } = useSelector(
    (state) => state.cart
  );


  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleCheckout = async () => {
    const result = await dispatch(checkout());
    if (checkout.fulfilled.match(result)) {
      navigate("/products");
    }
  };

  const total = items.reduce((sum, i) => {
  if (!i.product) return sum;
  return sum + i.product.price * i.quantity;
}, 0);


  if (loading) return <p className="text-center">Loading cart...</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
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
        <h1 className="text-2xl font-bold">My Cart</h1>
      </div>

      {items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>

          {items.map((item) => {
             if (!item.product) return null;
            const imageSrc =
              typeof item.product.image === "string"
                ? item.product.image.startsWith("http")
                  ? item.product.image
                  : `data:image/jpeg;base64,${item.product.image}`
                : "/placeholder.png";

            return (
              <div
                key={item.product._id}
                className="flex justify-between items-center mb-4 p-3 border rounded"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={imageSrc}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => (e.target.src = "/placeholder.png")}
                  />

                  <div>
                    <p className="font-semibold">{item.product.name}</p>
                    <p>₹{item.product.price}</p>
                  </div>
                </div>


                <button
                  onClick={() => dispatch(removeFromCart(item.product._id))}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            );
          })}

          <div className="flex justify-between items-center mt-6">
            <p className="text-xl font-bold">Total: ₹{total}</p>


            <button
              disabled={checkoutLoading}
              onClick={handleCheckout}
              className="bg-orange-500 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {checkoutLoading ? "Processing..." : "Checkout"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
