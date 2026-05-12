// src/pages/Admin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus, Edit2, Trash2, Package, TrendingUp, ShoppingBag,
  LogOut, Search, ToggleLeft, ToggleRight, X, Save, Image,
  Tag, Star, ChevronDown, Shield,
} from "lucide-react";
import { useStore } from "../context/StoreContext";
import { CATEGORIES } from "../data/products";

const EMPTY_FORM = {
  name: "", category: "Sarees", price: "", originalPrice: "",
  image: "", description: "", colors: "", sizes: "", badge: "", inStock: true, featured: false,
};

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, toggleStock, isAdminLoggedIn, adminLogout, cartTotal } = useStore();
  const navigate = useNavigate();

  const [tab, setTab] = useState("products"); // products | add
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  if (!isAdminLoggedIn) {
    navigate("/admin-login");
    return null;
  }

  // ── Stats ──────────────────────────────────────────────
  const totalProducts = products.length;
  const inStockCount  = products.filter((p) => p.inStock).length;
  const featuredCount = products.filter((p) => p.featured).length;

  // ── Filtered list ──────────────────────────────────────
  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "All" || p.category === catFilter;
    return matchSearch && matchCat;
  });

  // ── Form helpers ───────────────────────────────────────
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditId(null);
    setFormErrors({});
    setTab("add");
  };

  const openEdit = (p) => {
    setForm({
      ...p,
      colors: p.colors?.join(", ") || "",
      sizes: p.sizes?.join(", ") || "",
      badge: p.badge || "",
    });
    setEditId(p.id);
    setFormErrors({});
    setTab("add");
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Product name is required";
    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) e.price = "Valid price required";
    if (!form.image.trim()) e.image = "Image URL is required";
    if (!form.description.trim()) e.description = "Description is required";
    return e;
  };

  const handleSave = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setFormErrors(errs); return; }
    const data = {
      ...form,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
      colors: form.colors ? form.colors.split(",").map((c) => c.trim()).filter(Boolean) : [],
      sizes: form.sizes ? form.sizes.split(",").map((s) => s.trim()).filter(Boolean) : [],
      badge: form.badge || null,
    };
    if (editId) {
      updateProduct(editId, data);
    } else {
      addProduct(data);
    }
    setTab("products");
    setEditId(null);
  };

  const handleDelete = (id) => {
    deleteProduct(id);
    setDeleteConfirm(null);
  };

  const handleLogout = () => {
    adminLogout();
    navigate("/");
  };

  const field = (key) => ({
    value: form[key],
    onChange: (e) => { setForm({ ...form, [key]: e.target.value }); setFormErrors((p) => ({ ...p, [key]: "" })); },
  });

  // ── Render ─────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stone-50 animate-fade-in">
      {/* Admin header */}
      <div className="bg-charcoal text-white shadow">
        <div className="container-xl h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
              <Shield size={16} />
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight">Raja Nxt <span className="text-rose-400">Admin</span></p>
              <p className="text-[10px] text-stone-400">Store Management Panel</p>
            </div>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm text-stone-300 hover:text-white transition-colors">
            <LogOut size={15} /> Logout
          </button>
        </div>
      </div>

      <div className="container-xl py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: totalProducts, icon: <Package size={20} />, color: "text-blue-600 bg-blue-50" },
            { label: "In Stock",       value: inStockCount,  icon: <TrendingUp size={20} />, color: "text-green-600 bg-green-50" },
            { label: "Featured",       value: featuredCount, icon: <Star size={20} />, color: "text-amber-600 bg-amber-50" },
            { label: "Categories",     value: CATEGORIES.length - 1, icon: <Tag size={20} />, color: "text-rose-600 bg-rose-50" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
              <div>
                <p className="font-display text-2xl font-bold text-charcoal">{s.value}</p>
                <p className="text-xs text-stone-400">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <button onClick={() => setTab("products")}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "products" ? "bg-charcoal text-white shadow-md" : "bg-white text-stone-600 border border-stone-200 hover:border-stone-300"}`}>
            <span className="flex items-center gap-2"><Package size={15} /> All Products ({totalProducts})</span>
          </button>
          <button onClick={openAdd}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${tab === "add" && !editId ? "bg-rose-600 text-white shadow-md" : "bg-white text-stone-600 border border-stone-200 hover:border-rose-300"}`}>
            <span className="flex items-center gap-2"><Plus size={15} /> {editId ? "Edit Product" : "Add Product"}</span>
          </button>
        </div>

        {/* ── Products list tab ─────────────────────────── */}
        {tab === "products" && (
          <div>
            {/* Search & filter */}
            <div className="flex flex-wrap gap-3 mb-5">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products…" className="input-field pl-9 py-2.5 text-sm" />
              </div>
              <div className="relative">
                <select value={catFilter} onChange={(e) => setCatFilter(e.target.value)}
                  className="appearance-none input-field py-2.5 pr-8 text-sm cursor-pointer min-w-[150px]">
                  {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50">
                      <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-widest">Product</th>
                      <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-widest hidden sm:table-cell">Category</th>
                      <th className="text-left p-4 text-xs font-semibold text-stone-500 uppercase tracking-widest">Price</th>
                      <th className="text-center p-4 text-xs font-semibold text-stone-500 uppercase tracking-widest hidden md:table-cell">Stock</th>
                      <th className="text-center p-4 text-xs font-semibold text-stone-500 uppercase tracking-widest hidden lg:table-cell">Featured</th>
                      <th className="text-right p-4 text-xs font-semibold text-stone-500 uppercase tracking-widest">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-12 text-stone-400 text-sm">No products found</td></tr>
                    ) : filtered.map((p) => (
                      <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors last:border-0">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-lg flex-shrink-0" />
                            <div>
                              <p className="font-semibold text-charcoal text-sm line-clamp-1">{p.name}</p>
                              {p.badge && <span className="text-[10px] bg-rose-100 text-rose-600 px-1.5 py-0.5 rounded-full font-semibold">{p.badge}</span>}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 hidden sm:table-cell">
                          <span className="text-xs text-stone-500 bg-stone-100 px-2 py-1 rounded-full">{p.category}</span>
                        </td>
                        <td className="p-4">
                          <p className="font-bold text-charcoal">₹{p.price.toLocaleString("en-IN")}</p>
                          {p.originalPrice && <p className="text-xs text-stone-400 line-through">₹{p.originalPrice.toLocaleString("en-IN")}</p>}
                        </td>
                        <td className="p-4 hidden md:table-cell text-center">
                          <button onClick={() => toggleStock(p.id)} className="flex items-center gap-1 mx-auto">
                            {p.inStock
                              ? <><ToggleRight size={22} className="text-green-500" /><span className="text-xs text-green-600 font-medium">In Stock</span></>
                              : <><ToggleLeft size={22} className="text-stone-300" /><span className="text-xs text-stone-400">Out of Stock</span></>
                            }
                          </button>
                        </td>
                        <td className="p-4 hidden lg:table-cell text-center">
                          <button onClick={() => updateProduct(p.id, { featured: !p.featured })}>
                            <Star size={17} className={p.featured ? "text-amber-400 fill-amber-400" : "text-stone-200"} />
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEdit(p)}
                              className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-100 transition-colors">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => setDeleteConfirm(p.id)}
                              className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Add / Edit product form ────────────────────── */}
        {tab === "add" && (
          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 max-w-3xl">
            <h2 className="font-display text-xl font-semibold text-charcoal mb-6">
              {editId ? "Edit Product" : "Add New Product"}
            </h2>

            <div className="space-y-5">
              {/* Name */}
              <div>
                <label className="label-style">Product Name *</label>
                <input {...field("name")} placeholder="e.g. Banarasi Silk Saree"
                  className={`input-field ${formErrors.name ? "border-red-300" : ""}`} />
                {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
              </div>

              {/* Category + Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-style">Category *</label>
                  <select {...field("category")} className="input-field">
                    {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-style">Badge</label>
                  <select {...field("badge")} className="input-field">
                    <option value="">None</option>
                    {["Bestseller", "New", "Premium", "Trending"].map((b) => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              {/* Prices */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-style">Selling Price (₹) *</label>
                  <input {...field("price")} type="number" min={0} placeholder="2499"
                    className={`input-field ${formErrors.price ? "border-red-300" : ""}`} />
                  {formErrors.price && <p className="text-xs text-red-500 mt-1">{formErrors.price}</p>}
                </div>
                <div>
                  <label className="label-style">Original / MRP (₹)</label>
                  <input {...field("originalPrice")} type="number" min={0} placeholder="3499 (optional)"
                    className="input-field" />
                </div>
              </div>

              {/* Image */}
              <div>
                <label className="label-style">Image URL *</label>
                <input {...field("image")} placeholder="https://images.unsplash.com/…"
                  className={`input-field ${formErrors.image ? "border-red-300" : ""}`} />
                {formErrors.image && <p className="text-xs text-red-500 mt-1">{formErrors.image}</p>}
                {form.image && (
                  <div className="mt-2 flex gap-3 items-center">
                    <img src={form.image} alt="Preview" className="w-16 h-20 object-cover rounded-xl border border-stone-200" onError={(e) => { e.target.style.display = "none"; }} />
                    <p className="text-xs text-stone-400">Preview</p>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="label-style">Description *</label>
                <textarea {...field("description")} rows={3} placeholder="Describe the product…"
                  className={`input-field resize-none ${formErrors.description ? "border-red-300" : ""}`} />
                {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
              </div>

              {/* Colors & Sizes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-style">Colors (comma separated)</label>
                  <input {...field("colors")} placeholder="Red, Blue, Green"
                    className="input-field" />
                  <p className="text-[10px] text-stone-400 mt-1">e.g. Red, Royal Blue, Emerald</p>
                </div>
                <div>
                  <label className="label-style">Sizes (comma separated)</label>
                  <input {...field("sizes")} placeholder="S, M, L, XL or Free Size"
                    className="input-field" />
                  <p className="text-[10px] text-stone-400 mt-1">e.g. S, M, L, XL or Free Size</p>
                </div>
              </div>

              {/* Toggles */}
              <div className="flex gap-6 flex-wrap">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.inStock}
                    onChange={(e) => setForm({ ...form, inStock: e.target.checked })}
                    className="w-4 h-4 accent-rose-600" />
                  <span className="text-sm font-medium text-stone-700">In Stock</span>
                </label>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-rose-600" />
                  <span className="text-sm font-medium text-stone-700">Featured on Homepage</span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn-primary flex-1 py-3.5 text-base">
                  <Save size={17} /> {editId ? "Update Product" : "Add Product"}
                </button>
                <button onClick={() => { setTab("products"); setEditId(null); }}
                  className="btn-outline px-6">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl p-7 max-w-sm w-full animate-slide-up">
            <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="font-display text-xl font-semibold text-center text-charcoal mb-2">Delete Product?</h3>
            <p className="text-stone-400 text-sm text-center mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors">Delete</button>
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 border-2 border-stone-200 py-3 rounded-xl font-semibold text-sm text-stone-600 hover:border-stone-300 transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
