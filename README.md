# 🌸 Raja Nxt — Women's Fashion Store

A complete, production-ready React website for **Raja Nxt**, a women's fashion shop based in Patna, Bihar.

---

## 📁 Folder Structure

```
raja-nxt/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx                  ← Main router + layout
│   ├── index.js                 ← React entry point
│   ├── index.css                ← Tailwind + global styles
│   │
│   ├── context/
│   │   └── StoreContext.jsx     ← Global state (products, cart, wishlist, admin auth)
│   │
│   ├── data/
│   │   └── products.js          ← Product data + store info
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.jsx       ← Responsive navbar with search & cart badge
│   │   │   └── Footer.jsx       ← 4-column footer
│   │   └── ui/
│   │       ├── ProductCard.jsx  ← Product card with wishlist, quick view, add to bag
│   │       ├── QuickViewModal.jsx ← Modal for product details
│   │       └── Toast.jsx        ← Global toast notifications
│   │
│   └── pages/
│       ├── Home.jsx             ← Hero, categories, featured products, testimonials
│       ├── Products.jsx         ← Shop with filters, search, sort + cart sidebar
│       ├── Contact.jsx          ← Contact form + WhatsApp + store hours
│       ├── Location.jsx         ← Store map, directions, landmarks
│       ├── Admin.jsx            ← Full admin dashboard (add/edit/delete products)
│       ├── AdminLogin.jsx       ← Admin login page
│       └── NotFound.jsx         ← 404 page
│
├── tailwind.config.js
├── postcss.config.js
└── package.json
```

---

## 🚀 Setup & Run

### 1. Install dependencies
```bash
cd raja-nxt
npm install
```

### 2. Start development server
```bash
npm start
```
App runs at → http://localhost:3000

### 3. Build for production
```bash
npm run build
```

---

## 🔐 Admin Access

- URL: `/admin-login`  
- Password: `admin@raja123`  
- Features: Add products, Edit products, Delete products, Toggle stock, Mark featured

---

## 📄 Pages

| Route | Description |
|-------|-------------|
| `/` | Home — Hero, categories, featured products, testimonials, newsletter |
| `/products` | Shop — Filters, search, sort, cart sidebar |
| `/contact` | Contact form, WhatsApp link, store hours |
| `/location` | Store map, directions, nearby landmarks |
| `/admin-login` | Admin login |
| `/admin` | Admin dashboard (protected) |

---

## ✨ Features

- **Responsive** — Mobile-first design, works on all screen sizes
- **Cart** — Add/remove items, adjust quantity, persistent in session
- **Wishlist** — Toggle products, badge count on nav
- **Admin Panel** — Full CRUD for products, stock toggle, featured toggle
- **Search & Filters** — Category, price range, in-stock, sort options
- **Quick View** — Modal preview with color/size selection
- **Toast Notifications** — Success/error feedback
- **Local Storage** — Products persist between page refreshes
- **SEO Ready** — Proper HTML, meta tags, semantic structure

---

## 🎨 Customization

- **Colors**: Edit `tailwind.config.js`
- **Store Info**: Edit `src/data/products.js` → `STORE_INFO`
- **Products**: Edit `src/data/products.js` → `INITIAL_PRODUCTS` (or use admin panel)
- **Fonts**: Edit `public/index.html` Google Fonts link

---

## 📦 Tech Stack

- **React 18** — UI framework
- **React Router v6** — Client-side routing
- **Tailwind CSS** — Styling
- **Lucide React** — Icons
- **Context API** — State management
- **localStorage** — Product persistence

---

*Built with ❤️ for Raja Nxt, Patna, Bihar*
