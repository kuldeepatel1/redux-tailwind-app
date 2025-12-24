# Enhanced CartContext Implementation Guide

## Overview

This implementation provides a comprehensive context-based cart system that can be accessed from any page/component in your React application. The cart is persistent (saved to localStorage) and provides all necessary cart operations.

## Features

### ✅ Core Cart Operations
- **Add to Cart**: Add products with automatic quantity tracking
- **Remove from Cart**: Remove individual items
- **Update Quantity**: Increase/decrease item quantities
- **Clear Cart**: Remove all items at once
- **Persistent Storage**: Cart data saved to localStorage

### ✅ Computed Values
- **Total Items**: Get total number of items in cart
- **Total Price**: Calculate total price of all items
- **Cart Status**: Check if item exists in cart
- **Cart Item**: Get specific cart item details

### ✅ UI Features
- **Cart Toggle**: Show/hide cart sidebar
- **Cart State Management**: Track cart open/closed state
- **Real-time Updates**: All components update automatically

## Usage

### 1. Basic Usage (Any Component)

```jsx
import { useContext } from 'react';
import { CartContext } from './context/CartContext';

function MyComponent() {
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    getTotalItems, 
    getTotalPrice 
  } = useContext(CartContext);

  const product = {
    id: 1,
    name: "Product Name",
    price: 100,
    image: "product.jpg"
  };

  return (
    <div>
      <p>Total Items: {getTotalItems()}</p>
      <p>Total Price: ₹{getTotalPrice()}</p>
      
      <button onClick={() => addToCart(product)}>
        Add to Cart
      </button>
      
      <div>
        {cartItems.map(item => (
          <div key={item.id}>
            {item.name} - ₹{item.price} (Qty: {item.quantity})
            <button onClick={() => removeFromCart(item.id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 2. Using the Custom Hook

```jsx
import { useCart } from './context/CartContext';

function ProductComponent({ product }) {
  const { 
    addToCart, 
    isInCart, 
    getCartItem, 
    updateQuantity 
  } = useCart();

  const isInCartProduct = isInCart(product.id);
  const cartItem = getCartItem(product.id);

  return (
    <div>
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      
      {isInCartProduct ? (
        <div>
          <p>In Cart: {cartItem?.quantity || 0}</p>
          <button onClick={() => updateQuantity(product.id, (cartItem?.quantity || 0) + 1)}>
            Add More
          </button>
          <button onClick={() => removeFromCart(product.id)}>
            Remove
          </button>
        </div>
      ) : (
        <button onClick={() => addToCart(product)}>
          Add to Cart
        </button>
      )}
    </div>
  );
}
```

### 3. Header/Cart Indicator

```jsx
function Header() {
  const { getTotalItems, getTotalPrice } = useContext(CartContext);

  return (
    <header>
      <nav>
        <Link to="/products">Products</Link>
        <Link to="/cart">Cart ({getTotalItems()} items - ₹{getTotalPrice()})</Link>
      </nav>
    </header>
  );
}
```

### 4. Cart Page Implementation

```jsx
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  } = useContext(CartContext);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  return (
    <div>
      <h1>My Cart</h1>
      
      {cartItems.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cartItems.map(item => (
            <div key={item.id}>
              <h3>{item.name}</h3>
              <p>₹{item.price}</p>
              
              <div>
                <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
              </div>
              
              <p>Subtotal: ₹{item.price * item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          
          <div>
            <p>Total Items: {getTotalItems()}</p>
            <p>Total Price: ₹{getTotalPrice()}</p>
            <button onClick={clearCart}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
}
```

## Available Methods

### Cart Operations
- `addToCart(product)` - Add product to cart
- `removeFromCart(productId)` - Remove product from cart
- `updateQuantity(productId, quantity)` - Update product quantity
- `clearCart()` - Clear all items from cart

### UI State Management
- `toggleCart()` - Toggle cart sidebar visibility
- `openCart()` - Open cart sidebar
- `closeCart()` - Close cart sidebar

### Utility Methods
- `getTotalItems()` - Get total number of items
- `getTotalPrice()` - Get total price of all items
- `getCartItems()` - Get array of cart items
- `isInCart(productId)` - Check if product is in cart
- `getCartItem(productId)` - Get specific cart item

### Legacy Compatibility
- `items` - Array of cart items (alias for cartItems)
- `totalItems` - Total number of items (alias for getTotalItems())

## Integration Examples

### With Authentication
```jsx
function AddToCartButton({ product }) {
  const { addToCart } = useCart();
  const { user } = useSelector(state => state.auth);

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }
    addToCart(product);
  };

  return (
    <button onClick={handleAddToCart}>
      Add to Cart
    </button>
  );
}
```

### With Product Data
```jsx
// Compatible with different product data structures
const product = {
  id: product.id || product._id, // Support both id and _id
  name: product.name || product.title,
  price: product.price,
  image: product.image,
};
```

## File Structure

```
src/
├── context/
│   └── CartContext.jsx          # Main cart context implementation
├── components/
│   └── ProductCard.jsx          # Updated to use CartContext
├── pages/
│   └── cart/
│       └── CartPage.jsx         # Updated to use CartContext
├── examples/
│   └── CartUsageExamples.jsx    # Usage examples and demos
└── App.jsx                      # Updated to use CartContext
```

## Key Benefits

1. **Global Access**: Cart can be accessed from any component
2. **Persistent**: Cart data survives page refreshes
3. **Type-Safe**: Strong typing with custom hooks
4. **Performance**: Optimized updates and re-renders
5. **Flexible**: Compatible with different data structures
6. **User-Friendly**: Easy to integrate and use

## Migration from Redux

The CartContext provides the same functionality as Redux cart but with:
- Simpler syntax (`useContext` instead of `useSelector`)
- No async operations (instant updates)
- Local persistence (no API calls needed)
- Direct state access (no thunks needed)

## Testing

To test the cart functionality:

1. Add products to cart from any page
2. Check cart persistence (refresh page)
3. Verify cart updates across components
4. Test quantity changes and removals
5. Confirm total calculations

## Browser Support

- localStorage support required
- Modern browser JavaScript features
- React 18+ compatible
