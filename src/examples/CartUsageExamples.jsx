import React from 'react';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { useSelector } from 'react-redux';

// Example 1: Basic cart usage in any component
export function BasicCartExample() {
  // Access cart context
  const { 
    cartItems, 
    addToCart, 
    removeFromCart, 
    getTotalItems, 
    getTotalPrice 
  } = useContext(CartContext);

  const sampleProduct = {
    id: 1,
    name: "Sample Product",
    price: 100,
    image: "/sample.jpg"
  };

  return (
    <div>
      <h3>Basic Cart Example</h3>
      <p>Total Items: {getTotalItems()}</p>
      <p>Total Price: ₹{getTotalPrice()}</p>
      
      <button onClick={() => addToCart(sampleProduct)}>
        Add Sample Product
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

// Example 2: Using the custom useCart hook
export function HookUsageExample() {
  // Using the custom hook instead of useContext directly
  const { 
    cartItems, 
    addToCart, 
    updateQuantity,
    isInCart,
    getCartItem,
    clearCart 
  } = useContext(CartContext);

  const sampleProducts = [
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 200 },
    { id: 3, name: "Product C", price: 300 },
  ];

  return (
    <div>
      <h3>Hook Usage Example</h3>
      
      {sampleProducts.map(product => (
        <div key={product.id} style={{ margin: '10px 0', padding: '10px', border: '1px solid #ccc' }}>
          <h4>{product.name}</h4>
          <p>Price: ₹{product.price}</p>
          
          {isInCart(product.id) ? (
            <div>
              <p>In Cart: {getCartItem(product.id)?.quantity || 0}</p>
              <button onClick={() => updateQuantity(product.id, (getCartItem(product.id)?.quantity || 0) + 1)}>
                Increase Quantity
              </button>
              <button onClick={() => removeFromCart(product.id)}>
                Remove from Cart
              </button>
            </div>
          ) : (
            <button onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          )}
        </div>
      ))}
      
      {cartItems.length > 0 && (
        <button 
          onClick={clearCart} 
          style={{ marginTop: '20px', backgroundColor: 'red', color: 'white' }}
        >
          Clear All Cart
        </button>
      )}
    </div>
  );
}

// Example 3: Cart status in header/navigation
export function CartStatusHeader() {
  const { getTotalItems, getTotalPrice, isCartOpen, toggleCart } = useContext(CartContext);

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '10px', 
      backgroundColor: '#f5f5f5' 
    }}>
      <nav>
        <a href="/products">Products</a> | 
        <a href="/orders">Orders</a> | 
        <a href="/profile">Profile</a>
      </nav>
      
      <div>
        <button onClick={toggleCart} style={{ position: 'relative' }}>
          🛒 Cart ({getTotalItems()})
          {getTotalItems() > 0 && (
            <span style={{
              position: 'absolute',
              top: '-8px',
              right: '-8px',
              backgroundColor: 'red',
              color: 'white',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getTotalItems()}
            </span>
          )}
        </button>
        
        <span style={{ marginLeft: '10px' }}>
          Total: ₹{getTotalPrice()}
        </span>
      </div>
    </header>
  );
}

// Example 4: Mini cart sidebar
export function MiniCartSidebar() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, closeCart } = useContext(CartContext);

  if (cartItems.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: '0',
        right: '0',
        width: '300px',
        height: '100%',
        backgroundColor: 'white',
        borderLeft: '1px solid #ccc',
        padding: '20px',
        zIndex: 1000
      }}>
        <h3>Your Cart is Empty</h3>
        <button onClick={closeCart}>Close</button>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '0',
      right: '0',
      width: '300px',
      height: '100%',
      backgroundColor: 'white',
      borderLeft: '1px solid #ccc',
      padding: '20px',
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3>Your Cart ({cartItems.length})</h3>
        <button onClick={closeCart}>✕</button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        {cartItems.map(item => (
          <div key={item.id} style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px',
            padding: '10px',
            border: '1px solid #eee'
          }}>
            <div>
              <h4>{item.name}</h4>
              <p>₹{item.price} x {item.quantity}</p>
              <p>Subtotal: ₹{item.price * item.quantity}</p>
            </div>
            
            <div>
              <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</button>
              <span style={{ margin: '0 10px' }}>{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              <br />
              <button 
                onClick={() => removeFromCart(item.id)}
                style={{ marginTop: '5px', color: 'red' }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ 
        position: 'absolute', 
        bottom: '20px', 
        left: '20px', 
        right: '20px',
        borderTop: '1px solid #ccc',
        paddingTop: '10px'
      }}>
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>
          Total: ₹{getTotalPrice()}
        </p>
        <button 
          style={{ 
            width: '100%', 
            padding: '10px', 
            backgroundColor: 'orange', 
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Checkout
        </button>
      </div>
    </div>
  );
}

// Example 5: Product page with cart integration
export function ProductPageWithCart() {
  const { addToCart, isInCart, getCartItem } = useContext(CartContext);
  const { user } = useSelector(state => state.auth);

  const product = {
    id: 123,
    name: "Premium Headphones",
    price: 2999,
    description: "High-quality wireless headphones with noise cancellation",
    image: "/headphones.jpg"
  };

  const handleAddToCart = () => {
    if (!user) {
      alert("Please login to add items to cart");
      return;
    }
    
    addToCart(product);
    alert("Product added to cart!");
  };

  const isInCartProduct = isInCart(product.id);
  const cartItem = getCartItem(product.id);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', gap: '20px' }}>
        <img 
          src={product.image} 
          alt={product.name}
          style={{ width: '300px', height: '300px', objectFit: 'cover' }}
        />
        
        <div style={{ flex: 1 }}>
          <h1>{product.name}</h1>
          <p style={{ fontSize: '24px', color: 'orange', fontWeight: 'bold' }}>
            ₹{product.price}
          </p>
          <p>{product.description}</p>
          
          {isInCartProduct ? (
            <div>
              <p style={{ color: 'green' }}>
                ✓ In Cart: {cartItem?.quantity || 0} item(s)
              </p>
              <button onClick={handleAddToCart} style={{ marginRight: '10px' }}>
                Add More
              </button>
              <button style={{ backgroundColor: 'red', color: 'white' }}>
                Remove from Cart
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAddToCart}
              style={{ 
                padding: '10px 20px', 
                backgroundColor: 'orange', 
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontSize: '16px'
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Main example component that demonstrates all usage patterns
export default function CartUsageExamples() {
  const [activeExample, setActiveExample] = React.useState('basic');

  const examples = {
    basic: BasicCartExample,
    hook: HookUsageExample,
    header: CartStatusHeader,
    sidebar: MiniCartSidebar,
    product: ProductPageWithCart,
  };

  const ActiveComponent = examples[activeExample];

  return (
    <div style={{ padding: '20px' }}>
      <h2>Cart Context Usage Examples</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setActiveExample('basic')}>Basic Usage</button>
        <button onClick={() => setActiveExample('hook')}>Hook Usage</button>
        <button onClick={() => setActiveExample('header')}>Header Example</button>
        <button onClick={() => setActiveExample('sidebar')}>Sidebar Example</button>
        <button onClick={() => setActiveExample('product')}>Product Page Example</button>
      </div>
      
      <div style={{ border: '1px solid #ccc', padding: '20px', marginTop: '20px' }}>
        <ActiveComponent />
      </div>
    </div>
  );
}
