import React from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

const Cart = ({ cart = [], setCart, showCart, setShowCart }) => {
  const navigate = useNavigate();
  const close = () => setShowCart(false);

  const inc = (id) => {
    setCart(cart.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i)));
  };

  const dec = (id) => {
    setCart(
      cart
        .map((i) => (i.id === id ? { ...i, qty: i.qty - 1 } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart(cart.filter((i) => i.id !== id));
  };

  const total = cart.reduce((a, b) => a + b.qty * b.rate, 0);

  const handleCheckout = () => {
    setShowCart(false);
    navigate("/checkout"); // matches the route added in Routing.jsx
  };

  return (
    <div className={`cart-overlay ${showCart ? "cart-show" : ""}`}>
      <div className="cart-panel">
        <div className="cart-header">
          <h2>Cart ({cart.length} items)</h2>
          <button className="cart-close-btn" onClick={close}>
            ✕
          </button>
        </div>

        <div className="cart-items">
          {cart.length === 0 && (
            <p className="cart-empty">Your cart is empty.</p>
          )}

          {cart.map((item) => (
            <div key={item.id} className="cart-item-row">
              <img src={item.img} alt={item.name} />

              <div className="cart-item-info">
                <h4>{item.name}</h4>
                <p>${item.rate}</p>

                <div className="cart-qty-box">
                  <button onClick={() => dec(item.id)}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => inc(item.id)}>+</button>
                </div>
              </div>

              <div className="cart-item-price">
                ${(item.qty * item.rate).toFixed(2)}
              </div>

              <button
                className="cart-delete-btn"
                onClick={() => removeItem(item.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="cart-footer">
          <div className="cart-total-row">
            <span>Estimated total</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <p className="cart-tax-note">
            Taxes and shipping are calculated at checkout.
          </p>
          <button
            className="cart-checkout-btn"
            disabled={cart.length === 0}
            onClick={handleCheckout}
          >
            Checkout
          </button>
          <button className="cart-viewcart-btn">View Cart</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;