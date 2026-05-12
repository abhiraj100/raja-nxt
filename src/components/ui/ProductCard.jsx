// src/components/ui/ProductCard.jsx
import React, { useState } from "react";
import { Heart, ShoppingBag, Star, Eye } from "lucide-react";
import { useStore } from "../../context/StoreContext";

const BADGE_COLORS = {
  Bestseller: "bg-amber-100 text-amber-700",
  New: "bg-emerald-100 text-emerald-700",
  Premium: "bg-purple-100 text-purple-700",
  Trending: "bg-sky-100 text-sky-700",
};

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [adding, setAdding] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    setAdding(true);
    addToCart(product, product.colors?.[0] || "", product.sizes?.[0] || "");
    setTimeout(() => setAdding(false), 1200);
  };

  return (
    <div className="card group relative flex flex-col">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[3/4] bg-stone-50 flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Quick view overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <button
            onClick={(e) => { e.preventDefault(); onQuickView?.(product); }}
            className="flex items-center gap-1.5 bg-white text-stone-700 text-xs font-semibold px-4 py-2 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-600 transition-colors"
          >
            <Eye size={14} /> Quick View
          </button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.badge && (
            <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold ${BADGE_COLORS[product.badge] || "bg-rose-100 text-rose-700"}`}>
              {product.badge}
            </span>
          )}
          {discount > 0 && product.inStock && (
            <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-600 text-white">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200 ${wishlisted ? "bg-rose-600 text-white" : "bg-white text-stone-400 hover:text-rose-600"}`}
          aria-label="Wishlist"
        >
          <Heart size={14} className={wishlisted ? "fill-white" : ""} />
        </button>

        {/* Out of stock */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="text-xs font-semibold text-stone-500 bg-white px-3 py-1.5 rounded-full border border-stone-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-[10px] text-rose-500 font-bold tracking-widest uppercase mb-1">{product.category}</p>
        <h3 className="font-display text-[15px] font-semibold text-charcoal line-clamp-1 mb-1.5">{product.name}</h3>

        {product.rating > 0 && (
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={11} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"} />
              ))}
            </div>
            <span className="text-[11px] text-stone-400">{product.rating} ({product.reviews})</span>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-baseline gap-1.5">
            <span className="font-display text-lg font-bold text-charcoal">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
            )}
          </div>

          <button
            onClick={handleAdd}
            disabled={!product.inStock || adding}
            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 flex-shrink-0 ${
              !product.inStock ? "bg-stone-100 text-stone-300 cursor-not-allowed"
              : adding ? "bg-emerald-500 text-white scale-90"
              : "bg-rose-600 text-white hover:bg-rose-700 active:scale-90 shadow-md"
            }`}
            aria-label="Add to cart"
          >
            <ShoppingBag size={15} />
          </button>
        </div>

        {/* Color chips */}
        {product.colors?.length > 0 && (
          <div className="flex gap-1.5 mt-3 flex-wrap">
            {product.colors.slice(0, 3).map((c) => (
              <span key={c} className="text-[10px] text-stone-400 bg-stone-50 px-2 py-0.5 rounded-full border border-stone-100">{c}</span>
            ))}
            {product.colors.length > 3 && <span className="text-[10px] text-stone-400">+{product.colors.length - 3}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
