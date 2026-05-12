// src/components/ui/QuickViewModal.jsx
import React, { useState } from "react";
import { X, Star, ShoppingBag, Heart, Check } from "lucide-react";
import { useStore } from "../../context/StoreContext";

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [added, setAdded] = useState(false);
  const wishlisted = isWishlisted(product.id);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAdd = () => {
    if (!product.inStock) return;
    addToCart(product, selectedColor, selectedSize);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden animate-slide-up flex flex-col sm:flex-row max-h-[95vh]">
        {/* Image */}
        <div className="sm:w-2/5 h-56 sm:h-auto flex-shrink-0 overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        </div>

        {/* Details */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center hover:bg-stone-200 transition-colors">
            <X size={16} />
          </button>

          <p className="text-[11px] text-rose-500 font-bold tracking-widest uppercase">{product.category}</p>
          <h2 className="font-display text-xl font-semibold text-charcoal mt-1 pr-8">{product.name}</h2>

          {product.rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} className={i < Math.floor(product.rating) ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"} />
              ))}</div>
              <span className="text-xs text-stone-400">{product.rating} · {product.reviews} reviews</span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-4">
            <span className="font-display text-2xl font-bold text-charcoal">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <>
                <span className="text-sm text-stone-400 line-through">₹{product.originalPrice.toLocaleString("en-IN")}</span>
                <span className="text-xs font-bold bg-rose-100 text-rose-600 px-2 py-0.5 rounded-full">{discount}% OFF</span>
              </>
            )}
          </div>

          <p className="text-sm text-stone-500 leading-relaxed mt-4">{product.description}</p>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-5">
              <p className="text-xs font-semibold text-stone-700 mb-2">COLOR: <span className="text-rose-600">{selectedColor}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.colors.map((c) => (
                  <button key={c} onClick={() => setSelectedColor(c)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${selectedColor === c ? "border-rose-600 bg-rose-50 text-rose-600 font-semibold" : "border-stone-200 text-stone-600 hover:border-rose-300"}`}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Sizes */}
          {product.sizes?.length > 0 && product.sizes[0] !== "Free Size" && (
            <div className="mt-4">
              <p className="text-xs font-semibold text-stone-700 mb-2">SIZE: <span className="text-rose-600">{selectedSize}</span></p>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((s) => (
                  <button key={s} onClick={() => setSelectedSize(s)}
                    className={`w-10 h-10 rounded-lg text-xs border transition-all ${selectedSize === s ? "border-rose-600 bg-rose-600 text-white font-bold" : "border-stone-200 text-stone-600 hover:border-rose-300"}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <button onClick={handleAdd} disabled={!product.inStock}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold transition-all ${
                !product.inStock ? "bg-stone-100 text-stone-400 cursor-not-allowed"
                : added ? "bg-emerald-500 text-white"
                : "bg-rose-600 text-white hover:bg-rose-700 active:scale-95 shadow-md"
              }`}>
              {added ? <Check size={16} /> : <ShoppingBag size={16} />}
              {!product.inStock ? "Out of Stock" : added ? "Added!" : "Add to Bag"}
            </button>
            <button onClick={() => toggleWishlist(product.id)}
              className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${wishlisted ? "border-rose-600 bg-rose-600 text-white" : "border-stone-200 text-stone-500 hover:border-rose-400"}`}>
              <Heart size={16} className={wishlisted ? "fill-white" : ""} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
