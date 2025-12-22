import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function ProductCard({ product, onClick }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { actionLoading } = useSelector((state) => state.cart);

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // 🔐 User check
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    // 🛑 Product validation (THIS FIXES 400 ERROR)
    if (!product || !product._id) {
      console.error("Invalid product data:", product);
      alert("Unable to add product. Please refresh.");
      return;
    }

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
      })
    );
  };

  // 🖼️ Safe image handling
  const imageSrc =
    product?.image && typeof product.image === "string"
      ? product.image.startsWith("http")
        ? product.image
        : `data:image/jpeg;base64,${product.image}`
      : "/placeholder.png";

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow hover:shadow-lg cursor-pointer transition"
    >
      <img
        src={imageSrc}
        alt={product?.name || "Product"}
        className="h-48 w-full object-cover rounded-t-xl"
        onError={(e) => (e.target.src = "/placeholder.png")}
      />

      <div className="p-4">
        <h3 className="font-bold truncate">
          {product?.name || "Unnamed Product"}
        </h3>

        <p className="text-orange-600 font-semibold">
          ₹{product?.price ?? "N/A"}
        </p>

        <button
          onClick={handleAddToCart}
          disabled={actionLoading}
          className="mt-3 w-full bg-orange-500 text-white py-2 rounded disabled:opacity-60"
        >
          {actionLoading ? "Adding..." : "Add to Cart"}
        </button>
      </div>
    </div>
  );
}
