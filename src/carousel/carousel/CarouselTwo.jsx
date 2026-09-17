import React, { useEffect, useRef, useState } from "react";
import styles from "./CarouselTwo.module.css";
import { useShop } from "../../User/UserPages/BookStore/shopContext/ShopeContext";

const API_BASE = "https://bookstore-server-y1qn.onrender.com";

const CarouselTwo = () => {
  const trackRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addToCart, setViewProduct } = useShop();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/product/get`);
        if (!res.ok) throw new Error("Failed to load products");
        const result = await res.json();
        const list = Array.isArray(result) ? result : result.data || [];

        const visible = list.filter(
          (p) => !p.deleted && p.status !== "Inactive"
        );

        const descending = [...visible].reverse();

        setProducts(descending);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Couldn't load products.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getStep = () => {
    const track = trackRef.current;
    if (!track) return 0;
    const card = track.querySelector(`.${styles.box}`);
    if (!card) return 0;
    const trackStyle = getComputedStyle(track);
    const gap = parseFloat(trackStyle.columnGap || trackStyle.gap || "0");
    return card.getBoundingClientRect().width + gap;
  };

  const handleNext = () => {
    const track = trackRef.current;
    const step = getStep();
    if (!step || !track) return;

    const atEnd =
      track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;

    if (atEnd) {
      track.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      track.scrollBy({ left: step, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    const step = getStep();
    if (step && trackRef.current) {
      trackRef.current.scrollBy({
        left: -step,
        behavior: "smooth",
      });
    }
  };

  const handleAddToCart = (item) => {
    const id = item._id || item.id;
    addToCart(
      {
        id,
        name: item.name,
        rate: item.price,
        img: item.image,
      },
      1
    );
  };

  const handleQuickView = (item) => {
    setViewProduct(item);
  };

  if (loading) {
    return <p className={styles.status}>Loading products…</p>;
  }

  if (error) {
    return <p className={styles.status}>{error}</p>;
  }

  return (
    <div className={styles.carouselWrapper}>
      <button
        type="button"
        className={styles.navBtn}
        onClick={handlePrev}
        aria-label="Previous books"
      >
        &#10094;
      </button>

      <div className={styles.carousel} ref={trackRef}>
        {products.map((item) => {
          const id = item._id || item.id;

          return (
            <div key={id} className={styles.box}>
              <div className={styles.imageWrap}>
                <img src={item.image} alt={item.name} />

                <div
                  className={styles.quickView}
                  onClick={() => handleQuickView(item)}
                >
                  Quick View
                </div>
              </div>

              <p className={styles.name}>{item.name}</p>

              <p className={styles.rate}>
                ${Number(item.price).toFixed(2)}
              </p>

              <div className={styles.cartReveal}>
                <button
                  type="button"
                  className={styles.addToCartBtn}
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className={styles.navBtn}
        onClick={handleNext}
        aria-label="Next books"
      >
        &#10095;
      </button>
    </div>
  );
};

export default CarouselTwo;