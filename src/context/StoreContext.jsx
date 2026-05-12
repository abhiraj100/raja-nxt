// src/context/StoreContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { INITIAL_PRODUCTS } from "../data/products";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("rn_products");
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch { return INITIAL_PRODUCTS; }
  });

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast] = useState(null);

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(
    () => localStorage.getItem("rn_admin") === "true"
  );

  useEffect(() => {
    localStorage.setItem("rn_products", JSON.stringify(products));
  }, [products]);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  };

  // ── Products ──────────────────────────────────────────
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      rating: 0,
      reviews: 0,
      inStock: true,
      featured: false,
      badge: product.badge || null,
      price: Number(product.price),
      originalPrice: product.originalPrice ? Number(product.originalPrice) : null,
    };
    setProducts((p) => [newProduct, ...p]);
    showToast(`"${product.name}" added successfully!`);
    return newProduct;
  };

  const updateProduct = (id, data) => {
    setProducts((p) => p.map((x) => (x.id === id ? { ...x, ...data } : x)));
    showToast("Product updated!");
  };

  const deleteProduct = (id) => {
    setProducts((p) => p.filter((x) => x.id !== id));
    showToast("Product deleted.", "error");
  };

  const toggleStock = (id) => {
    setProducts((p) =>
      p.map((x) => (x.id === id ? { ...x, inStock: !x.inStock } : x))
    );
  };

  // ── Cart ──────────────────────────────────────────────
  const addToCart = (product, selectedColor, selectedSize) => {
    setCart((prev) => {
      const key = `${product.id}-${selectedColor}-${selectedSize}`;
      const exists = prev.find((i) => i._key === key);
      if (exists) return prev.map((i) => i._key === key ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, selectedColor, selectedSize, qty: 1, _key: key }];
    });
    showToast("Added to bag!");
  };

  const updateCartQty = (key, qty) => {
    if (qty < 1) { removeFromCart(key); return; }
    setCart((p) => p.map((i) => i._key === key ? { ...i, qty } : i));
  };

  const removeFromCart = (key) => {
    setCart((p) => p.filter((i) => i._key !== key));
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // ── Wishlist ──────────────────────────────────────────
  const toggleWishlist = (id) => {
    setWishlist((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  };
  const isWishlisted = (id) => wishlist.includes(id);

  // ── Admin Auth ────────────────────────────────────────
  const adminLogin = (pw) => {
    if (pw === "admin@raja123") {
      setIsAdminLoggedIn(true);
      localStorage.setItem("rn_admin", "true");
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem("rn_admin");
  };

  return (
    <StoreContext.Provider value={{
      products, addProduct, updateProduct, deleteProduct, toggleStock,
      cart, addToCart, updateCartQty, removeFromCart, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isWishlisted,
      isAdminLoggedIn, adminLogin, adminLogout,
      toast,
    }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be inside StoreProvider");
  return ctx;
};
