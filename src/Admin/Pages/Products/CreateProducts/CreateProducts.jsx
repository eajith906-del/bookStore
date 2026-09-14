import React, { useState, useRef } from "react";
import "./CreateProducts.css";

export default function CreateProduct() {
  const [preview, setPreview] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    productName: "",
    sku: "",
    price: "",
    category: "",
    status: "",
    stock: "",
    bestSeller: false,
    description: "",
  });

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const resetPreview = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCancel = () => {
    setForm({
      productName: "",
      sku: "",
      price: "",
      category: "",
      status: "",
      stock: "",
      bestSeller: false,
      description: "",
    });
    resetPreview();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageFile = fileInputRef.current.files[0];
    if (!imageFile) {
      alert("Please choose a product image");
      return;
    }

    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("name", form.productName);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("sku", form.sku);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    formData.append("status", form.status);
    formData.append("bestSale", form.bestSeller);

    try {
      const res = await fetch("http://localhost:3004/product/create", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.status) {
        alert("Product saved successfully!");
        handleCancel();
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div className="cp-card">
      <div className="cp-card-header">
        <div>
          <h1>Add New Product</h1>
          <p>Fill in the product details below to add a new item to your store.</p>
        </div>
        <div className="cp-header-actions">
          <button type="button" className="cp-btn cp-btn-cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" form="productForm" className="cp-btn cp-btn-save">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
              <path d="M17 21v-8H7v8" />
              <path d="M7 3v5h8" />
            </svg>
            Save
          </button>
        </div>
      </div>

      <form id="productForm" onSubmit={handleSubmit}>
        <div>
          <span className="cp-field-label">
            Product Image<span className="cp-req">*</span>
          </span>

          <div
            className="cp-upload-box"
            onClick={(e) => {
              if (e.target.closest(".cp-btn-choose")) return;
              fileInputRef.current.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{ background: dragOver ? "#eef1fb" : undefined }}
          >
            <div className="cp-upload-icon">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3v12" />
                <path d="m7 8 5-5 5 5" />
                <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
              </svg>
            </div>
            <p>Click to upload or drag and drop</p>
            <div className="cp-hint">Supports JPG, PNG, WEBP (Max 5MB)</div>
            <button
              type="button"
              className="cp-btn-choose"
              onClick={() => fileInputRef.current.click()}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <path d="M17 8l-5-5-5 5" />
                <path d="M12 3v12" />
              </svg>
              Choose Image
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/jpeg,image/png,image/webp"
              style={{ display: "none" }}
              onChange={(e) => handleFile(e.target.files[0])}
            />
          </div>

          <div className="cp-preview-section">
            <span className="cp-field-label">Image Preview</span>
            <div className={`cp-preview-box ${!preview ? "cp-empty" : ""}`}>
              {preview ? (
                <>
                  <img src={preview} alt="Preview" />
                  <button type="button" className="cp-remove-img" onClick={resetPreview}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                      <path d="M18 6 6 18" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </button>
                </>
              ) : (
                "No image selected"
              )}
            </div>
          </div>
        </div>

        <div className="cp-fields-grid">
          <div className="cp-full">
            <label className="cp-field-label" htmlFor="productName">
              Product Name<span className="cp-req">*</span>
            </label>
            <input
              type="text"
              id="productName"
              placeholder="e.g. Atomic Habits"
              value={form.productName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="cp-field-label" htmlFor="sku">
              SKU<span className="cp-req">*</span>
            </label>
            <input
              type="text"
              id="sku"
              placeholder="e.g. BK001"
              value={form.sku}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="cp-field-label" htmlFor="price">
              Price<span className="cp-req">*</span>
            </label>
            <div className="cp-price-wrap">
              <span>$</span>
              <input
                type="number"
                id="price"
                placeholder="e.g. 19.99"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label className="cp-field-label" htmlFor="category">
              Category<span className="cp-req">*</span>
            </label>
            <select id="category" value={form.category} onChange={handleChange} required>
              <option value="" disabled>
                Select category
              </option>
              <option value="novel">Novel</option>
              <option value="design et art">Design &amp; Art</option>
              <option value="life style">Life Style</option>
              <option value="travel">Travel</option>
            </select>
          </div>

          <div>
            <label className="cp-field-label" htmlFor="status">
              Status<span className="cp-req">*</span>
            </label>
            <select id="status" value={form.status} onChange={handleChange} required>
              <option value="" disabled>
                Select status
              </option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="cp-field-label" htmlFor="stock">
              Stock<span className="cp-req">*</span>
            </label>
            <input
              type="number"
              id="stock"
              placeholder="e.g. 50"
              min="0"
              value={form.stock}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <span className="cp-field-label">Best Seller</span>
            <div className="cp-toggle-row">
              <label className="cp-switch">
                <input
                  type="checkbox"
                  id="bestSeller"
                  checked={form.bestSeller}
                  onChange={handleChange}
                />
                <span className="cp-slider"></span>
              </label>
              <label htmlFor="bestSeller">Mark as best seller</label>
            </div>
          </div>

          <div className="cp-full">
            <label className="cp-field-label" htmlFor="description">
              Description<span className="cp-req">*</span>
            </label>
            <textarea
              id="description"
              placeholder="Write a detailed description of the product..."
              value={form.description}
              onChange={handleChange}
              required
            />
          </div>
        </div>
      </form>
    </div>
  );
}