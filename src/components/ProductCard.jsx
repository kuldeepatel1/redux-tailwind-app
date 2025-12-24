import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { useSelector } from "react-redux";

export default function ProductCard({ product, onClick }) {
  const { addToCart, removeFromCart, isInCart, getCartItem } = useContext(CartContext);
  const { user } = useSelector((state) => state.auth);

  // Prepare product data for cart
  const productId = product.id || product._id;
  const productData = {
    id: productId,
    name: product.name || product.title,
    price: product.price,
    image: product.image,
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // 🔐 User check
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }

    // 🛑 Product validation
    if (!product || !productId) {
      console.error("Invalid product data:", product);
      alert("Unable to add product. Please refresh.");
      return;
    }

    addToCart(productData);
  };

  // Check if product is already in cart
  const inCart = isInCart(productId);
  const cartItem = getCartItem(productId);

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
        alt={product?.name || product?.title || "Product"}
        className="h-48 w-full object-cover rounded-t-xl"
        onError={(e) => (e.target.src = "/placeholder.png")}
      />

      <div className="p-4">
        <h3 className="font-bold truncate">
          {product?.name || product?.title || "Unnamed Product"}
        </h3>

        <p className="text-orange-600 font-semibold">
          ₹{product?.price ?? "N/A"}
        </p>

        {inCart ? (
          <div className="mt-3">
            <p className="text-green-600 text-sm mb-2">
              In Cart: {cartItem?.quantity || 0}
            </p>
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // Decrease quantity
                  if (cartItem.quantity > 1) {
                    // We'll need to add a decreaseQuantity function to context
                    // For now, remove completely
                    removeFromCart(productId);
                  } else {
                    removeFromCart(productId);
                  }
                }}
                className="flex-1 bg-red-500 text-white py-2 rounded text-sm"
              >
                Remove
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(productData);
                }}
                className="flex-1 bg-orange-500 text-white py-2 rounded text-sm"
              >
                Add More
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            className="mt-3 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition-colors"
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
