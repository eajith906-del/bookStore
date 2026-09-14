import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FiArrowLeft,
  FiLock,
  FiShield,
  FiTruck,
  FiRefreshCw,
} from "react-icons/fi";
import { useShop } from "../BookStore/shopContext/ShopeContext"; 
import "./CheckOut.css";

const API_BASE = "http://localhost:3004/order";

const STATE_OPTIONS = [
  "Tamil Nadu",
  "Kerala",
  "Karnataka",
  "Andhra Pradesh",
  "Telangana",
  "Maharashtra",
  "Delhi",
  "Other",
];

function currency(n) {
  const num = Number(n) || 0;
  return `₹${num.toFixed(2)}`;
}

export default function Checkout() {
  const navigate = useNavigate();
  const { cart = [], setCart } = useShop(); 
  const userId = localStorage.getItem("userId") || null;
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    pincode: "",
    paymentMethod: "COD",
  });
  const [saveInfo, setSaveInfo] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, i) => sum + i.qty * i.rate, 0);
  const shippingCharge = 0; 
  const totalAmount = subtotal + shippingCharge;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const isValid =
    userId &&
    form.fullName.trim() &&
    form.phone.trim() &&
    form.address.trim() &&
    form.city.trim() &&
    form.state.trim() &&
    form.pincode.trim() &&
    cart.length > 0;

  const handlePlaceOrder = async () => {
    if (!isValid || placing) return;
    setPlacing(true);
    setError("");

    const payload = {
      userId,
      items: cart.map((i) => ({
        productId: i.id,
        name: i.name,
        image: i.img,
        price: i.rate,
        quantity: i.qty,
        subtotal: i.qty * i.rate,
      })),
      subtotal,
      shippingCharge,
      totalAmount,
      shippingAddress: {
        fullName: form.fullName,
        phone: form.phone,
        address: form.address2
          ? `${form.address}, ${form.address2}`
          : form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      },
      paymentMethod: form.paymentMethod,
    };

    try {
      const res = await fetch(`${API_BASE}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.status) {
        setCart && setCart([]);
        navigate("/order-success", { state: { order: data.data } });
      } else {
        setError(data.message || "Could not place order");
      }
    } catch (err) {
      setError("Could not reach server: " + err.message);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="chk-wrap">
      <div className="chk-topbar">
        <div className="chk-logo">
          <span className="chk-logo-icon">BINK</span>
          <span className="chk-logo-text">Bublishers</span>
        </div>
      </div>

      <div className="chk-subbar">
        <button className="chk-back-link" onClick={() => navigate(-1)}>
          <FiArrowLeft size={16} /> Back to Cart
        </button>
        <span className="chk-secure">
          <FiLock size={14} /> Secure Checkout
        </span>
      </div>

      <div className="chk-body">
        <div className="chk-main">
          <h1 className="chk-title">Checkout</h1>

          <div className="chk-step-row">
            <div className="chk-step chk-step-active">
              <span className="chk-step-num">1</span> Shipping
            </div>
          </div>

          <h3 className="chk-section-title">Shipping Address</h3>
          <div className="chk-form-grid">
            <input
              className="chk-full"
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
            />
            <input
              className="chk-full"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
            />
            <input
              className="chk-full"
              type="text"
              name="address"
              placeholder="Address Line 1"
              value={form.address}
              onChange={handleChange}
            />
            <input
              className="chk-full"
              type="text"
              name="address2"
              placeholder="Address Line 2 (Optional)"
              value={form.address2}
              onChange={handleChange}
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={form.city}
              onChange={handleChange}
            />
            <select name="state" value={form.state} onChange={handleChange}>
              <option value="">State / Province</option>
              {STATE_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <input
              type="text"
              name="pincode"
              placeholder="ZIP / Postal Code"
              value={form.pincode}
              onChange={handleChange}
            />
            <select
              name="paymentMethod"
              value={form.paymentMethod}
              onChange={handleChange}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="ONLINE">Pay Online</option>
            </select>
          </div>

          <label className="chk-save-row">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
            />
            Save this information for next time
          </label>

          {error && <div className="chk-error">{error}</div>}

          {!userId && (
            <div className="chk-error">
              Please login before placing an order.
            </div>
          )}

          <button
            className="chk-place-btn"
            disabled={!isValid || placing}
            onClick={handlePlaceOrder}
          >
            {placing ? "Placing Order..." : "Place Order"}
            {!placing && <span className="chk-arrow">→</span>}
          </button>
        </div>

        <div className="chk-summary">
          <h3 className="chk-summary-title">Order Summary</h3>

          <div className="chk-summary-items">
            {cart.length === 0 && (
              <p className="chk-muted">Your cart is empty.</p>
            )}
            {cart.map((item) => (
              <div className="chk-summary-item" key={item.id}>
                <img src={item.img} alt={item.name} />
                <div className="chk-summary-item-info">
                  <span className="chk-item-name">{item.name}</span>
                  <span className="chk-item-qty">Qty: {item.qty}</span>
                </div>
                <span className="chk-item-price">
                  {currency(item.qty * item.rate)}
                </span>
              </div>
            ))}
          </div>

          <div className="chk-summary-divider" />

          <div className="chk-summary-row">
            <span>Subtotal</span>
            <span>{currency(subtotal)}</span>
          </div>
          <div className="chk-summary-row">
            <span>Shipping</span>
            <span>{currency(shippingCharge)}</span>
          </div>

          <div className="chk-summary-divider" />

          <div className="chk-summary-total">
            <span>Total</span>
            <span>{currency(totalAmount)}</span>
          </div>

          <div className="chk-badges">
            <div className="chk-badge">
              <FiShield size={20} />
              <span>Secure Checkout</span>
            </div>
            <div className="chk-badge">
              <FiTruck size={20} />
              <span>Free Shipping</span>
            </div>
            <div className="chk-badge">
              <FiRefreshCw size={20} />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}