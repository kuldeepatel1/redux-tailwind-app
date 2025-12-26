import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { CartContext } from "../../context/CartContext";
import { createOrder } from "../../features/order/orderSlice";
import { addToCartApi } from "../../features/cart/cartService";

export default function CartPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.orders);
    
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
    } = useContext(CartContext);

    const subtotal = getTotalPrice();
    const shippingFee = subtotal > 0 ? 150 : 0;
    const totalAmount = subtotal + shippingFee;

    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        try {
            // First sync cart items to backend
            for (const item of cartItems) {
                await addToCartApi({ productId: item.id, quantity: item.quantity });
            }

            // Then create the order (backend will read from its cart)
            const result = await dispatch(createOrder()).unwrap();

            // Clear the local cart after successful order
            clearCart();

            // Show success message
            alert("Order placed successfully! Order ID: " + result._id);

            // Navigate to products page
            navigate("/products");

        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed: " + (error.message || "Please try again"));
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <button
                    onClick={() => navigate("/products")}
                    className="text-gray-600 hover:text-blue-600 flex items-center gap-2"
                >
                    ← Continue Shopping
                </button>

                <h1 className="text-2xl font-bold flex items-center gap-2">
                    🛒 Shopping Cart
                    <span className="text-sm bg-blue-600 text-white px-2 py-1 rounded-full">
                        {getTotalItems()}
                    </span>
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* LEFT - Cart Items */}
                <div className="lg:col-span-2">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">
                            Items in Cart ({cartItems.length})
                        </h2>
                        <button
                            onClick={clearCart}
                            className="text-gray-500 hover:text-red-600 text-sm"
                        >
                            🗑 Clear All
                        </button>
                    </div>

                    {cartItems.map((item) => {
                        const imageSrc =
                            typeof item.image === "string"
                                ? item.image.startsWith("http")
                                    ? item.image
                                    : `data:image/jpeg;base64,${item.image}`
                                : "/placeholder.png";

                        return (
                            <div
                                key={item.id}
                                className="flex justify-between items-center p-5 mb-4 bg-white rounded-xl shadow-sm border"
                            >
                                <div className="flex items-center gap-4">
                                    <img
                                        src={imageSrc}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded"
                                        onError={(e) => (e.target.src = "/placeholder.png")}
                                    />

                                    <div>
                                        <h3 className="font-semibold">{item.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Unit Price: ₹{item.price}
                                        </p>

                                        <div className="flex items-center mt-2 bg-gray-100 rounded-full px-3 py-1 w-fit">
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity - 1)
                                                }
                                                className="px-2"
                                            >
                                                −
                                            </button>
                                            <span className="px-3">{item.quantity}</span>
                                            <button
                                                onClick={() =>
                                                    updateQuantity(item.id, item.quantity + 1)
                                                }
                                                className="px-2"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-gray-500">ITEM TOTAL</p>
                                    <p className="text-xl font-bold text-blue-600">
                                        ₹{item.price * item.quantity}
                                    </p>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className="text-gray-400 hover:text-red-600 mt-2"
                                    >
                                        🗑
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT - Order Summary */}
                <div className="bg-white rounded-xl shadow-md p-6 border h-fit">
                    <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                    <div className="space-y-4 text-gray-700">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>

                        <div className="flex justify-between">
                            <span>Shipping Fee</span>
                            <span>₹{shippingFee}</span>
                        </div>

                        <div className="flex justify-between text-sm text-gray-500">
                            <span>Tax</span>
                            <span>Calculated at checkout</span>
                        </div>

                        <hr />

                        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-lg">
                            <span className="font-semibold">TOTAL AMOUNT</span>
                            <span className="text-3xl font-bold text-blue-600">
                                ₹{totalAmount}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={loading || cartItems.length === 0}
                        className={`w-full mt-6 py-3 rounded-lg font-semibold ${
                            loading || cartItems.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                        } text-white`}
                    >
                        {loading ? "PROCESSING..." : "PROCEED TO CHECKOUT"}
                    </button>
                </div>
            </div>
        </div>
    );
}
