import React, { useState } from "react";
import "./ViewProduct.css";

const ViewProduct = ({ product, onClose, onAddToCart }) => {
  const [qty, setQty] = useState(1);

  if (!product) return null;

  const image = product.image || product.img;
  const price = product.price ?? product.rate;
  const sku = product.sku || product._id || product.id;

  const inc = () => setQty((q) => q + 1);
  const dec = () => setQty((q) => Math.max(1, q - 1));

  return (
    <div className="vp-overlay" onClick={onClose}>
      <div className="vp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="vp-close" onClick={onClose} aria-label="Close">
          ✕
        </button>

        <div className="vp-image">
          <img src={image} alt={product.name} />
        </div>

        <div className="vp-details">
          <h2 className="vp-name">{product.name}</h2>
          <p className="vp-price">${Number(price).toFixed(2)}</p>
          {sku && <p className="vp-sku">SKU: {sku}</p>}

          <div className="vp-qty-label">Quantity *</div>
          <div className="vp-qty-box">
            <button onClick={dec} aria-label="Decrease quantity">
              −
            </button>
            <span>{qty}</span>
            <button onClick={inc} aria-label="Increase quantity">
              +
            </button>
          </div>

          <button
            className="vp-add-btn"
            onClick={() => onAddToCart(qty)}
          >
            Add to Cart
          </button>

          {product.description && (
            <details className="vp-more-details">
              <summary>View More Details</summary>
              <p>{product.description}</p>
            </details>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;