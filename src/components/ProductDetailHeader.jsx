import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProductDetailHeader() {
  const { items } = useSelector((state) => state.cart);

  return (
    <header className="sticky top-0 z-30 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Left */}
        <div className="flex items-center gap-6">
          <Link to="/products" className="text-xl font-bold text-blue-600">
            E-SHOP
          </Link>

          <nav className="hidden md:flex gap-6 text-sm text-gray-600">
            <Link to="/products" className="hover:text-blue-600">Products</Link>
            <Link to="/my-orders" className="hover:text-blue-600">Orders</Link>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          <Link
            to="/add-product"
            className="flex items-center gap-2 text-sm font-medium hover:text-blue-600"
          >
            ➕ Add Product
          </Link>

          <Link to="/cart" className="relative">
            🛒
            {items?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs h-5 w-5 rounded-full flex items-center justify-center">
                {items.length}
              </span>
            )}
          </Link>

          <Link to="/profile">👤</Link>
        </div>

      </div>
    </header>
  );
}
