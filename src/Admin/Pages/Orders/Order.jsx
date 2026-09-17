import React, { useEffect, useMemo, useState } from "react";
import {
  FiBriefcase,
  FiCreditCard,
  FiTruck,
  FiCheckCircle,
  FiShoppingCart,
  FiSearch,
  FiEye,
  FiX,
} from "react-icons/fi";
import "./Order.css";

const API_BASE = "https://bookstore-server-y1qn.onrender.com/order";

const AVATAR_COLORS = ["ord-av-purple", "ord-av-pink", "ord-av-teal", "ord-av-blue", "ord-av-orange"];

function initialsOf(name = "") {
  return name.trim().charAt(0).toUpperCase() || "?";
}

function avatarClassFor(name = "") {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[hash];
}

function formatDate(value) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  const datePart = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  const timePart = d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
  return `${datePart} ${timePart}`;
}

function currency(n) {
  const num = Number(n) || 0;
  return `₹${num.toFixed(2)}`;
}

// Normalizes the backend record based on the actual orderDetails mongoose schema
function normalizeOrder(o) {
  const items = o.items || [];
  const qty = items.reduce((sum, it) => sum + Number(it.quantity ?? 1), 0);

  return {
    id: o._id || o.id,
    orderId: o.orderId || `#ORD${String(o._id || "").slice(-4).toUpperCase()}`,
    userId: o.userId,
    customerName: o.shippingAddress?.fullName || o.customerName || "Unknown",
    customerPhone: o.shippingAddress?.phone || "",
    items,
    quantity: qty,
    subtotal: Number(o.subtotal ?? 0),
    shippingCharge: Number(o.shippingCharge ?? 0),
    total: Number(o.totalAmount ?? 0),
    shippingAddress: o.shippingAddress || {},
    paymentMethod: (o.paymentMethod || "COD").toUpperCase(),
    paymentStatus: o.paymentStatus || "Pending",
    orderStatus: o.orderStatus || "Pending",
    paymentId: o.paymentId || null,
    orderDate: o.orderDate || o.createdAt,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    raw: o,
  };
}

const PAGE_SIZE = 8;

export default function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewOrder, setViewOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE}/get`);
      const data = await res.json();
      if (data.status) {
        setOrders((data.data || []).map(normalizeOrder));
      } else {
        setError(data.message || "Failed to load orders");
      }
    } catch (err) {
      setError("Could not reach server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return orders;
    return orders.filter(
      (o) =>
        o.orderId.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.customerPhone.toLowerCase().includes(q)
    );
  }, [orders, search]);

  useEffect(() => setPage(1), [search]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const pagedOrders = filteredOrders.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => {
    const norm = (s) => (s || "").toLowerCase();
    return {
      total: orders.length,
      pending: orders.filter((o) => norm(o.orderStatus) === "pending").length,
      dispatched: orders.filter((o) =>
        ["shipped", "out for delivery"].includes(norm(o.orderStatus))
      ).length,
      delivered: orders.filter((o) => norm(o.orderStatus) === "delivered").length,
    };
  }, [orders]);

  return (
    <div className="ord-wrap">
      <div className="ord-stats-grid">
        <StatCard icon={<FiBriefcase size={20} />} tone="amber" count={stats.total} label="Total Orders" caption="All time" />
        <StatCard icon={<FiCreditCard size={20} />} tone="blue" count={stats.pending} label="Total Pending" caption="Awaiting confirmation" />
        <StatCard icon={<FiTruck size={20} />} tone="green" count={stats.dispatched} label="Total Dispatched" caption="On the way" />
        <StatCard icon={<FiCheckCircle size={20} />} tone="purple" count={stats.delivered} label="Total Delivered" caption="Completed" />
      </div>

      <div className="ord-card">
        <div className="ord-card-header">
          <div className="ord-card-heading">
            <div className="ord-card-icon">
              <FiShoppingCart size={20} />
            </div>
            <div>
              <h1>Order Details</h1>
              <p>View and manage all customer orders</p>
            </div>
          </div>

          <div className="ord-search">
            <FiSearch size={16} />
            <input
              type="text"
              placeholder="Search by Order ID, Customer Name or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="ord-table-container">
          {loading ? (
            <div className="ord-state">Loading orders...</div>
          ) : error ? (
            <div className="ord-state ord-error">{error}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="ord-state">No orders found.</div>
          ) : (
            <>
              <table className="ord-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Product(s)</th>
                    <th>Quantity</th>
                    <th>Shipping</th>
                    <th>Total</th>
                    <th>Payment Method</th>
                    <th>Payment Status</th>
                    <th>Order Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pagedOrders.map((o) => {
                    const first = o.items[0] || {};
                    const more = o.items.length - 1;
                    return (
                      <tr key={o.id}>
                        <td className="ord-id">{o.orderId}</td>
                        <td>
                          <div className="ord-customer-cell">
                            {/* <span className={`ord-avatar ${avatarClassFor(o.customerName)}`}>
                              {initialsOf(o.customerName)}
                            </span> */}
                            <div className="ord-customer-info">
                              <span className="ord-customer-name">{o.customerName}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="ord-product-cell">
                            {first.image && <img src={first.image} alt={first.name || ""} className="ord-thumb" />}
                            <div className="ord-product-info">
                              <span className="ord-product-name">{first.name || "-"}</span>
                              {more > 0 && <span className="ord-more">+{more} more</span>}
                            </div>
                          </div>
                        </td>
                        <td>{o.quantity}</td>
                        <td>{currency(o.shippingCharge)}</td>
                        <td className="ord-price">{currency(o.total)}</td>
                        <td>
                          <span className={`ord-pill ${o.paymentMethod === "ONLINE" ? "ord-pill-online" : "ord-pill-cod"}`}>
                            {o.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <span className={`ord-pill ${o.paymentStatus?.toLowerCase() === "paid" ? "ord-pill-paid" : "ord-pill-pendingpay"}`}>
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className={`ord-status ord-status-${o.orderStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                            {o.orderStatus}
                          </span>
                        </td>
                        <td>
                          <div className="ord-actions">
                            <button className="ord-icon-btn" title="View order" onClick={() => setViewOrder(o)}>
                              <FiEye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <div className="ord-footer">
                <span>
                  Showing {(page - 1) * PAGE_SIZE + 1} to {Math.min(page * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} orders
                </span>
                <div className="ord-pagination">
                  <button className="ord-page-btn" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>‹</button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button key={n} className={`ord-page-btn ${n === page ? "ord-page-active" : ""}`} onClick={() => setPage(n)}>
                      {n}
                    </button>
                  ))}
                  <button className="ord-page-btn" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>›</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {viewOrder && (
        <div className="ord-modal-overlay" onClick={() => setViewOrder(null)}>
          <div className="ord-modal" onClick={(e) => e.stopPropagation()}>
            <div className="ord-modal-header">
              <div>
                <h2>{viewOrder.orderId}</h2>
                <p>Ordered on {formatDate(viewOrder.orderDate)}</p>
              </div>
              <button className="ord-icon-btn" onClick={() => setViewOrder(null)}>
                <FiX size={16} />
              </button>
            </div>

            <div className="ord-modal-section">
              <span className="ord-field-label">Customer</span>
              <div className="ord-customer-cell">
                <span className={`ord-avatar ${avatarClassFor(viewOrder.customerName)}`}>
                  {initialsOf(viewOrder.customerName)}
                </span>
                <div className="ord-customer-info">
                  <span className="ord-customer-name">{viewOrder.customerName}</span>
                  <span className="ord-customer-email">{viewOrder.customerPhone}</span>
                </div>
              </div>
            </div>

            <div className="ord-modal-section">
              <span className="ord-field-label">Shipping Address</span>
              <div className="ord-address-box">
                <span>{viewOrder.shippingAddress.address}</span>
                <span>
                  {viewOrder.shippingAddress.city}, {viewOrder.shippingAddress.state} - {viewOrder.shippingAddress.pincode}
                </span>
              </div>
            </div>

            <div className="ord-modal-section">
              <span className="ord-field-label">Products</span>
              <div className="ord-modal-products">
                {viewOrder.items.length === 0 && <div className="ord-muted">No product details</div>}
                {viewOrder.items.map((p, idx) => (
                  <div className="ord-modal-product-row" key={idx}>
                    {p.image && <img src={p.image} alt={p.name || ""} className="ord-thumb" />}
                    <div className="ord-product-info">
                      <span className="ord-product-name">{p.name || "Item"}</span>
                      <span className="ord-muted">Qty: {p.quantity ?? 1} × {currency(p.price)}</span>
                    </div>
                    {p.subtotal != null && <span className="ord-price">{currency(p.subtotal)}</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="ord-modal-grid">
              <div>
                <span className="ord-field-label">Payment Method</span>
                <span className={`ord-pill ${viewOrder.paymentMethod === "ONLINE" ? "ord-pill-online" : "ord-pill-cod"}`}>
                  {viewOrder.paymentMethod}
                </span>
              </div>
              <div>
                <span className="ord-field-label">Payment Status</span>
                <span className={`ord-pill ${viewOrder.paymentStatus?.toLowerCase() === "paid" ? "ord-pill-paid" : "ord-pill-pendingpay"}`}>
                  {viewOrder.paymentStatus}
                </span>
              </div>
              <div>
                <span className="ord-field-label">Order Status</span>
                <span className={`ord-status ord-status-${viewOrder.orderStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                  {viewOrder.orderStatus}
                </span>
              </div>
              <div>
                <span className="ord-field-label">Payment ID</span>
                <span className="ord-muted">{viewOrder.paymentId || "-"}</span>
              </div>
            </div>

            <div className="ord-modal-section">
              <div className="ord-summary-row">
                <span>Subtotal</span>
                <span>{currency(viewOrder.subtotal)}</span>
              </div>
              <div className="ord-summary-row">
                <span>Shipping</span>
                <span>{currency(viewOrder.shippingCharge)}</span>
              </div>
            </div>

            <div className="ord-modal-total">
              <span>Total</span>
              <span className="ord-price">{currency(viewOrder.total)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, tone, count, label, caption }) {
  return (
    <div className={`ord-stat-card ord-tone-${tone}`}>
      <div className="ord-stat-icon">{icon}</div>
      <div className="ord-stat-body">
        <span className="ord-stat-count">{count}</span>
        <span className="ord-stat-label">{label}</span>
        <span className="ord-stat-caption">{caption}</span>
      </div>
    </div>
  );
}