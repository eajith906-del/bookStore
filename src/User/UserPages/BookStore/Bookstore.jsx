import React, { useEffect, useMemo, useState } from "react";
import styles from "./BookStore.module.css";
import { useShop } from "./shopContext/ShopeContext";

const API_BASE = "https://bookstore-server-y1qn.onrender.com";

// Sidebar collection checkboxes -> mapped to backend enum values
const COLLECTIONS = [
  { label: "Novels", value: "novel" },
  { label: "Design et Art", value: "design et art" },
  { label: "Life Style", value: "life style" },
  { label: "Our books of the month", value: "book-of-month" },
  { label: "Bestsellers", value: "bestseller" },
  { label: "Travel guides", value: "travel" },
];

const Bookstore = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // shared cart + quick view, rendered once by <ShopProvider>
  const { addToCart, setViewProduct } = useShop();

  // ---- filters ----
  const [collectionOpen, setCollectionOpen] = useState(true);
  const [priceOpen, setPriceOpen] = useState(false);
  const [selectedCollections, setSelectedCollections] = useState([]);

  const [priceBounds, setPriceBounds] = useState({
    min: 0,
    max: 100,
  });

  const [priceRange, setPriceRange] = useState({
    min: 0,
    max: 100,
  });

  const [priceApplied, setPriceApplied] = useState(false);

  // ---------- fetch products from backend ----------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${API_BASE}/product/get`);

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const result = await res.json();

        const list = Array.isArray(result)
          ? result
          : result.data || [];

        setProducts(list);

        if (list.length) {
          const prices = list.map((p) =>
            Number(p.price ?? 0)
          );

          const min = Math.floor(Math.min(...prices));
          const max = Math.ceil(Math.max(...prices));

          setPriceBounds({
            min,
            max,
          });

          setPriceRange({
            min,
            max,
          });
        }

        setError(null);
      } catch (err) {
        console.error(err);
        setError(
          "Couldn't load products. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // ---------- filtering ----------
  const toggleCollection = (value) => {
    setSelectedCollections((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  const clearAllFilters = () => {
    setSelectedCollections([]);
    setPriceRange(priceBounds);
    setPriceApplied(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const price = Number(p.price ?? 0);
      const category = (p.category || "").toLowerCase();

      const matchesCollection =
        selectedCollections.length === 0 ||
        selectedCollections.some((c) => {
          if (c === "bestseller") {
            return Boolean(p.bestSale);
          }

          if (c === "book-of-month") {
            return Boolean(p.isBookOfMonth);
          }

          return category === c;
        });

      const matchesPrice = !priceApplied
        ? true
        : price >= priceRange.min &&
          price <= priceRange.max;

      return (
        matchesCollection &&
        matchesPrice
      );
    });
  }, [
    products,
    selectedCollections,
    priceApplied,
    priceRange,
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <span className={styles.heroEyebrow}>
          Our
        </span>

        <h1 className={styles.heroTitle}>
          BOOKSTORE
        </h1>
      </div>

      <div className={styles.layout}>
        {/* ---------------- Sidebar ---------------- */}

        <aside className={styles.sidebar}>
          <h2 className={styles.filterHeading}>
            Filter by
          </h2>

          <div className={styles.filterGroup}>
            <button
              type="button"
              className={styles.filterGroupHeader}
              onClick={() =>
                setCollectionOpen(
                  (o) => !o
                )
              }
            >
              <span>Collection</span>

              <span
                className={
                  styles.toggleIcon
                }
              >
                {collectionOpen
                  ? "–"
                  : "+"}
              </span>
            </button>

            {collectionOpen && (
              <div
                className={
                  styles.filterOptions
                }
              >
                {COLLECTIONS.map((c) => (
                  <label
                    key={c.value}
                    className={
                      styles.checkboxRow
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selectedCollections.includes(
                        c.value
                      )}
                      onChange={() =>
                        toggleCollection(
                          c.value
                        )
                      }
                    />

                    <span>
                      {c.label}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className={styles.filterGroup}>
            <button
              type="button"
              className={
                styles.filterGroupHeader
              }
              onClick={() =>
                setPriceOpen(
                  (o) => !o
                )
              }
            >
              <span>Price</span>

              <span
                className={
                  styles.toggleIcon
                }
              >
                {priceOpen
                  ? "–"
                  : "+"}
              </span>
            </button>

            {priceOpen && (
              <div
                className={
                  styles.priceBox
                }
              >
                <div
                  className={
                    styles.sliderTrackWrap
                  }
                >
                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange.min}
                    onChange={(e) => {
                      const val =
                        Math.min(
                          Number(
                            e.target
                              .value
                          ),
                          priceRange.max
                        );

                      setPriceRange(
                        (r) => ({
                          ...r,
                          min: val,
                        })
                      );

                      setPriceApplied(
                        true
                      );
                    }}
                  />

                  <input
                    type="range"
                    min={priceBounds.min}
                    max={priceBounds.max}
                    value={priceRange.max}
                    onChange={(e) => {
                      const val =
                        Math.max(
                          Number(
                            e.target
                              .value
                          ),
                          priceRange.min
                        );

                      setPriceRange(
                        (r) => ({
                          ...r,
                          max: val,
                        })
                      );

                      setPriceApplied(
                        true
                      );
                    }}
                  />
                </div>

                <div
                  className={
                    styles.priceLabels
                  }
                >
                  <span>
                    ${priceRange.min}
                  </span>

                  <span>
                    ${priceRange.max}
                  </span>
                </div>
              </div>
            )}
          </div>

          {(priceApplied ||
            selectedCollections.length >
              0) && (
            <div
              className={
                styles.activeFilterTag
              }
            >
              {priceApplied && (
                <span>
                  ${priceRange.min}–
                  ${priceRange.max}
                </span>
              )}

              <button
                type="button"
                onClick={
                  clearAllFilters
                }
              >
                Clear All
              </button>
            </div>
          )}
        </aside>

        {/* ---------------- Product grid ---------------- */}

        <section
          className={styles.content}
        >
          <h2
            className={
              styles.allProducts
            }
          >
            All Products
          </h2>

          {loading && (
            <p
              className={
                styles.status
              }
            >
              Loading products…
            </p>
          )}

          {error && (
            <p
              className={
                styles.status
              }
            >
              {error}
            </p>
          )}

          {!loading &&
            !error &&
            filteredProducts.length ===
              0 && (
              <p
                className={
                  styles.status
                }
              >
                No products match these
                filters.
              </p>
            )}

          <div className={styles.grid}>
            {filteredProducts.map(
              (item) => {
                const id = item._id;
                const image =
                  item.image;
                const price =
                  item.price;

                return (
                  <div
                    key={id}
                    className={
                      styles.card
                    }
                  >
                    <div
                      className={
                        styles.imageWrap
                      }
                    >
                      <img
                        src={image}
                        alt={item.name}
                      />

                      <div
                        className={
                          styles.quickView
                        }
                        onClick={() =>
                          setViewProduct(
                            item
                          )
                        }
                      >
                        Quick View
                      </div>
                    </div>

                    <h3
                      className={
                        styles.productName
                      }
                    >
                      {item.name}
                    </h3>

                    <p
                      className={
                        styles.productPrice
                      }
                    >
                      $
                      {Number(
                        price
                      ).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      className={
                        styles.addToCartBtn
                      }
                      onClick={() =>
                        addToCart(
                          {
                            id,
                            name: item.name,
                            rate: price,
                            img: image,
                          },
                          1
                        )
                      }
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              }
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Bookstore;