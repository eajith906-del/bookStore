import React, { createContext, useContext, useState } from "react";
// NOTE: adjust these two paths to match your actual project structure.
import Cart from "../../Cart/Cart";
import ViewProduct from "../viewProduct/ViewProduct";

const ShopContext = createContext(null);

// Mount <ShopProvider> ONCE, near the top of your app (e.g. in App.jsx,
// wrapping <Routing />) - somewhere with NO transformed ancestors, so
// Cart's position:fixed panel isn't broken. Bookstore and Carousel then
// both read from this same context, so they share one cart and one
// Quick View modal instead of each running their own.
export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const addToCart = (item, qty = 1) => {
    setCart((prev) => {
      const exist = prev.find((x) => x.id === item.id);
      if (exist) {
        return prev.map((x) =>
          x.id === item.id ? { ...x, qty: x.qty + qty } : x
        );
      }
      return [...prev, { ...item, qty }];
    });
    setShowCart(true);
  };

  return (
    <ShopContext.Provider
      value={{ cart, setCart, showCart, setShowCart, addToCart, setViewProduct }}
    >
      {children}

      {viewProduct && (
        <ViewProduct
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onAddToCart={(qty) => {
            const id = viewProduct._id || viewProduct.id;
            const image = viewProduct.image || viewProduct.img;
            const price = viewProduct.price ?? viewProduct.rate;
            addToCart(
              { id, name: viewProduct.name, rate: price, img: image },
              qty
            );
            setViewProduct(null);
          }}
        />
      )}

      <Cart
        cart={cart}
        setCart={setCart}
        showCart={showCart}
        setShowCart={setShowCart}
      />
    </ShopContext.Provider>
  );
};

// Any component calls this to get the shared cart / addToCart / setViewProduct
// instead of keeping its own local state.
// Throws a clear error if used outside <ShopProvider>, instead of the
// confusing "Cannot destructure property 'addToCart' of null" crash.
export const useShop = () => {
  const ctx = useContext(ShopContext);
  if (!ctx) {
    throw new Error(
      "useShop() must be used inside <ShopProvider>. Wrap your App.jsx (around <Routing />) with <ShopProvider>."
    );
  }
  return ctx;
};