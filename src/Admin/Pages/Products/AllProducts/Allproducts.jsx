import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AllProducts.css";

// Render Backend URL
const API_URL = "https://bookstore-server-y1qn.onrender.com";

const axiosDetails = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const CATEGORY_LABELS = {
  novel: "Novel",
  "design et art": "Design & Art",
  "life style": "Life Style",
  travel: "Travel",
};

const PRICE_RANGES = [
  { value: "", label: "All Prices" },
  { value: "0-15", label: "Under $15" },
  { value: "15-25", label: "$15 - $25" },
  { value: "25-9999", label: "Above $25" },
];

const emptyForm = {
  productName: "",
  sku: "",
  price: "",
  category: "",
  status: "",
  stock: "",
  bestSeller: false,
  description: "",
  image: "",
};

export default function AllProducts() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [priceRange, setPriceRange] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axiosDetails.get("/product/get");

      if (res.data.status) {
        setProducts(res.data.data || []);
      } else {
        setError(res.data.message || "Failed to load products");
      }
    } catch (err) {
      setError("Could not reach server: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.sku?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory = !category || p.category === category;
      const matchesStatus = !status || p.status === status;

      let matchesPrice = true;

      if (priceRange) {
        const [min, max] = priceRange.split("-").map(Number);
        matchesPrice = p.price >= min && p.price <= max;
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus &&
        matchesPrice
      );
    });
  }, [products, search, category, status, priceRange]);

  const handleAddProduct = () => {
    navigate("/admin/products/create");
  };

  const openEdit = (p) => {
    setEditingId(p._id);

    setForm({
      productName: p.name || "",
      sku: p.sku || "",
      price: p.price ?? "",
      category: p.category || "",
      status: p.status || "",
      stock: p.stock ?? "",
      bestSeller: !!p.bestSale,
      description: p.description || "",
      image: p.image || "",
    });

    setPreview(p.image || null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const closeEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
    setPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFormChange = (e) => {
    const { id, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFile = (file) => {
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
      setPreview(e.target.result);
    };

    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData();
    const newFile = fileInputRef.current?.files?.[0];

    formData.append("_id", editingId);

    if (newFile) {
      formData.append("image", newFile);
    } else {
      formData.append("image", form.image);
    }

    formData.append("name", form.productName);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("sku", form.sku);
    formData.append("category", form.category);
    formData.append("stock", form.stock);
    formData.append("status", form.status);
    formData.append("bestSale", form.bestSeller);

    try {
      const res = await axiosDetails.put(
        "/product/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.status) {
        await fetchProducts();
        closeEdit();
      } else {
        alert(res.data.message || "Failed to update product");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this product?");

    if (!confirmed) return;

    try {
      const res = await axiosDetails.put(
        "/product/delete",
        {
          _id: id,
        }
      );

      if (res.data.status) {
        setProducts((prev) =>
          prev.filter((p) => p._id !== id)
        );

        if (editingId === id) {
          closeEdit();
        }
      } else {
        alert(res.data.message || "Failed to delete product");
      }
    } catch (err) {
      alert("Something went wrong: " + err.message);
    }
  };

  return (
    <div className="ap-wrap">

      {editingId && (
        <div className="ap-edit-panel">

          <div className="ap-edit-header">
            <div>
              <h2>Edit Product</h2>
              <p>
                Update the product details below and save your changes.
              </p>
            </div>

            <div className="ap-edit-actions">

              <button
                type="button"
                className="ap-btn ap-btn-cancel"
                onClick={closeEdit}
              >
                Cancel
              </button>

              <button
                type="submit"
                form="editProductForm"
                className="ap-btn ap-btn-save"
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </div>

          <form
            id="editProductForm"
            onSubmit={handleUpdate}
          >

            <div>

              <span className="ap-field-label">
                Product Image
              </span>

              <div
                className="ap-upload-box"
                onClick={(e) => {
                  if (
                    e.target.closest(".ap-btn-choose")
                  ) {
                    return;
                  }

                  fileInputRef.current.click();
                }}
              >

                <div className="ap-upload-icon">

                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  >
                    <path d="M12 3v12" />
                    <path d="m7 8 5-5 5 5" />
                    <path d="M20 17v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2" />
                  </svg>

                </div>

                <p>
                  Click to upload a new image
                </p>

                <div className="ap-hint">
                  Leave empty to keep the current image
                </div>

                <button
                  type="button"
                  className="ap-btn-choose"
                  onClick={() =>
                    fileInputRef.current.click()
                  }
                >
                  Choose Image
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/jpeg,image/png,image/webp"
                  style={{ display: "none" }}
                  onChange={(e) =>
                    handleFile(e.target.files[0])
                  }
                />

              </div>

              <div className="ap-preview-section">

                <span className="ap-field-label">
                  Image Preview
                </span>

                <div
                  className={`ap-preview-box ${
                    !preview ? "ap-empty" : ""
                  }`}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                    />
                  ) : (
                    "No image selected"
                  )}
                </div>

              </div>

            </div>

            <div className="ap-fields-grid">

              <div className="ap-full">

                <label
                  className="ap-field-label"
                  htmlFor="productName"
                >
                  Product Name
                </label>

                <input
                  type="text"
                  id="productName"
                  value={form.productName}
                  onChange={handleFormChange}
                  required
                />

              </div>

              <div>

                <label
                  className="ap-field-label"
                  htmlFor="sku"
                >
                  SKU
                </label>

                <input
                  type="text"
                  id="sku"
                  value={form.sku}
                  onChange={handleFormChange}
                  required
                />

              </div>

              <div>

                <label
                  className="ap-field-label"
                  htmlFor="price"
                >
                  Price
                </label>

                <div className="ap-price-wrap">

                  <span>$</span>

                  <input
                    type="number"
                    id="price"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                  />

                </div>

              </div>

              <div>

                <label
                  className="ap-field-label"
                  htmlFor="category"
                >
                  Category
                </label>

                <select
                  id="category"
                  value={form.category}
                  onChange={handleFormChange}
                  required
                >

                  <option value="" disabled>
                    Select category
                  </option>

                  {Object.entries(CATEGORY_LABELS).map(
                    ([value, label]) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {label}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label
                  className="ap-field-label"
                  htmlFor="status"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={form.status}
                  onChange={handleFormChange}
                  required
                >

                  <option value="" disabled>
                    Select status
                  </option>

                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>

                </select>

              </div>

              <div>

                <label
                  className="ap-field-label"
                  htmlFor="stock"
                >
                  Stock
                </label>

                <input
                  type="number"
                  id="stock"
                  min="0"
                  value={form.stock}
                  onChange={handleFormChange}
                  required
                />

              </div>

              <div>

                <span className="ap-field-label">
                  Best Seller
                </span>

                <div className="ap-toggle-row">

                  <label className="ap-switch">

                    <input
                      type="checkbox"
                      id="bestSeller"
                      checked={form.bestSeller}
                      onChange={handleFormChange}
                    />

                    <span className="ap-slider"></span>

                  </label>

                  <label htmlFor="bestSeller">
                    Mark as best seller
                  </label>

                </div>

              </div>

              <div className="ap-full">

                <label
                  className="ap-field-label"
                  htmlFor="description"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  value={form.description}
                  onChange={handleFormChange}
                  required
                />

              </div>

            </div>

          </form>

        </div>
      )}

      <div className="ap-header">

        <div>

          <h1>All Products</h1>

          <p>
            Manage your products and inventory
          </p>

        </div>

        <button
          className="ap-btn-add"
          onClick={handleAddProduct}
        >

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>

          Add Product

        </button>

      </div>

      <div className="ap-filters">

        <div className="ap-search">

          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle
              cx="11"
              cy="11"
              r="7"
            />
            <path d="m21 21-4.3-4.3" />
          </svg>

          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <select
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        >

          <option value="">
            All Categories
          </option>

          {Object.entries(CATEGORY_LABELS).map(
            ([value, label]) => (
              <option
                key={value}
                value={value}
              >
                {label}
              </option>
            )
          )}

        </select>

        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value)
          }
        >

          <option value="">
            All Status
          </option>

          <option value="Active">
            Active
          </option>

          <option value="Inactive">
            Inactive
          </option>

        </select>

        <select
          value={priceRange}
          onChange={(e) =>
            setPriceRange(e.target.value)
          }
        >

          {PRICE_RANGES.map((r) => (
            <option
              key={r.value}
              value={r.value}
            >
              {r.label}
            </option>
          ))}

        </select>

      </div>

      <div className="ap-table-container">

        {loading ? (

          <div className="ap-state">
            Loading products...
          </div>

        ) : error ? (

          <div className="ap-state ap-error">
            {error}
          </div>

        ) : filteredProducts.length === 0 ? (

          <div className="ap-state">
            No products found.
          </div>

        ) : (

          <>

            <table className="ap-table">

              <thead>

                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Best Seller</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredProducts.map((p) => (

                  <tr
                    key={p._id}
                    className={
                      editingId === p._id
                        ? "ap-row-editing"
                        : ""
                    }
                  >

                    <td>

                      <div className="ap-product-cell">

                        <img
                          src={p.image}
                          alt={p.name}
                          className="ap-thumb"
                        />

                        <span className="ap-product-name">
                          {p.name}
                        </span>

                      </div>

                    </td>

                    <td className="ap-muted">
                      {p.sku}
                    </td>

                    <td className="ap-category-text">
                      {CATEGORY_LABELS[p.category] ||
                        p.category}
                    </td>

                    <td className="ap-price">
                      ${Number(p.price).toFixed(2)}
                    </td>

                    <td>
                      {p.stock}
                    </td>

                    <td>

                      <span
                        className={`ap-status ${
                          p.status === "Active"
                            ? "ap-status-on"
                            : "ap-status-off"
                        }`}
                      >

                        <span className="ap-dot" />

                        {p.status}

                      </span>

                    </td>

                    <td className="ap-muted">
                      {p.bestSale ? "Yes" : "-"}
                    </td>

                    <td>

                      <div className="ap-actions">

                        <button
                          className="ap-icon-btn"
                          title="Edit"
                          onClick={() =>
                            openEdit(p)
                          }
                        >

                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" />
                          </svg>

                        </button>

                        <button
                          className="ap-icon-btn"
                          title="Delete"
                          onClick={() =>
                            handleDelete(p._id)
                          }
                        >

                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M3 6h18" />
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-2" />
                          </svg>

                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

            <div className="ap-footer">

              <span>
                Showing 1 - {filteredProducts.length} of{" "}
                {filteredProducts.length} products
              </span>

              <div className="ap-pagination">

                <button
                  className="ap-page-btn"
                  disabled
                >
                  ‹
                </button>

                <button
                  className="ap-page-btn ap-page-active"
                >
                  1
                </button>

                <button
                  className="ap-page-btn"
                  disabled
                >
                  ›
                </button>

              </div>

            </div>

          </>

        )}

      </div>

    </div>
  );
}