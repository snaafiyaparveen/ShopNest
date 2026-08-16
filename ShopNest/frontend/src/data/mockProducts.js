// Fallback data so the UI is fully browsable even before the Spring Boot
// backend is running. ProductGrid / Home always try the real API first
// (see src/api/products.js) and only fall back to this on network failure.

export const categories = [
  { name: 'All', icon: '🛍️' },
  { name: 'Electronics', icon: '🎧' },
  { name: 'Fashion', icon: '👕' },
  { name: 'Home & Kitchen', icon: '🍳' },
  { name: 'Beauty', icon: '💄' },
  { name: 'Sports', icon: '🏸' },
  { name: 'Books', icon: '📚' },
  { name: 'Toys', icon: '🧸' },
  { name: 'Grocery', icon: '🛒' },
]

const img = (seed, w = 500, h = 500) => `https://picsum.photos/seed/${seed}/${w}/${h}`

export const mockProducts = [
  { id: 1, name: 'Wireless Over-Ear Headphones', description: 'Active noise-cancelling, 30-hr battery, plush earcups.', price: 2499, mrp: 4999, discountPercent: 50, category: 'Electronics', imageUrl: img('headphones'), rating: 4.3, ratingCount: 1240, stock: 50 },
  { id: 2, name: 'Smart Fitness Watch', description: 'AMOLED display, heart-rate & sleep tracking, 7-day battery.', price: 1799, mrp: 3499, discountPercent: 49, category: 'Electronics', imageUrl: img('smartwatch'), rating: 4.1, ratingCount: 860, stock: 80 },
  { id: 3, name: '65W Fast Charging Power Bank', description: '20,000mAh with dual USB-C ports.', price: 1399, mrp: 2199, discountPercent: 36, category: 'Electronics', imageUrl: img('powerbank'), rating: 4.4, ratingCount: 540, stock: 65 },
  { id: 4, name: 'Mechanical Keyboard, RGB', description: 'Hot-swappable switches, per-key backlight.', price: 3299, mrp: 4999, discountPercent: 34, category: 'Electronics', imageUrl: img('keyboard'), rating: 4.6, ratingCount: 302, stock: 30 },

  { id: 5, name: "Men's Running Shoes", description: 'Lightweight breathable mesh, cushioned sole.', price: 1299, mrp: 2199, discountPercent: 41, category: 'Fashion', imageUrl: img('shoes'), rating: 4.5, ratingCount: 2310, stock: 120 },
  { id: 6, name: 'Cotton Oversized T-Shirt', description: 'Relaxed fit, breathable cotton, everyday wear.', price: 499, mrp: 999, discountPercent: 50, category: 'Fashion', imageUrl: img('tshirt'), rating: 4.0, ratingCount: 985, stock: 200 },
  { id: 7, name: 'Denim Jacket', description: 'Classic washed denim, unisex fit.', price: 1899, mrp: 2999, discountPercent: 37, category: 'Fashion', imageUrl: img('jacket'), rating: 4.2, ratingCount: 410, stock: 45 },
  { id: 8, name: 'Leather Wallet', description: 'Genuine leather, RFID-blocking card slots.', price: 699, mrp: 1299, discountPercent: 46, category: 'Fashion', imageUrl: img('wallet'), rating: 4.3, ratingCount: 760, stock: 150 },

  { id: 9, name: 'Non-Stick Cookware Set (5pc)', description: 'Induction-friendly, everyday cooking essentials.', price: 1999, mrp: 3299, discountPercent: 39, category: 'Home & Kitchen', imageUrl: img('cookware'), rating: 4.2, ratingCount: 430, stock: 40 },
  { id: 10, name: 'Memory Foam Pillow (Set of 2)', description: 'Orthopedic support, breathable cover.', price: 899, mrp: 1599, discountPercent: 44, category: 'Home & Kitchen', imageUrl: img('pillow'), rating: 4.4, ratingCount: 610, stock: 90 },
  { id: 11, name: '1200W Mixer Grinder', description: '3 stainless-steel jars, powerful motor.', price: 2299, mrp: 3499, discountPercent: 34, category: 'Home & Kitchen', imageUrl: img('mixer'), rating: 4.1, ratingCount: 320, stock: 25 },
  { id: 12, name: 'Scented Candle Set (4pc)', description: 'Soy wax, long-lasting fragrance.', price: 599, mrp: 999, discountPercent: 40, category: 'Home & Kitchen', imageUrl: img('candle'), rating: 4.6, ratingCount: 250, stock: 70 },

  { id: 13, name: 'Vitamin C Face Serum', description: 'Brightening serum with hyaluronic acid.', price: 449, mrp: 799, discountPercent: 44, category: 'Beauty', imageUrl: img('serum'), rating: 4.3, ratingCount: 1890, stock: 200 },
  { id: 14, name: 'Matte Lipstick Combo (3pc)', description: 'Long-wear, transfer-proof formula.', price: 599, mrp: 999, discountPercent: 40, category: 'Beauty', imageUrl: img('lipstick'), rating: 4.5, ratingCount: 940, stock: 130 },

  { id: 15, name: 'Yoga Mat with Carry Strap', description: '6mm anti-slip, eco-friendly TPE.', price: 699, mrp: 1199, discountPercent: 42, category: 'Sports', imageUrl: img('yogamat'), rating: 4.4, ratingCount: 520, stock: 100 },
  { id: 16, name: 'Adjustable Dumbbell Set', description: '2x10kg, space-saving home gym.', price: 2799, mrp: 3999, discountPercent: 30, category: 'Sports', imageUrl: img('dumbbell'), rating: 4.2, ratingCount: 190, stock: 35 },

  { id: 17, name: 'Atomic Habits — Paperback', description: 'Bestselling guide to building good habits.', price: 349, mrp: 599, discountPercent: 42, category: 'Books', imageUrl: img('book1'), rating: 4.7, ratingCount: 5200, stock: 300 },
  { id: 18, name: 'The Alchemist — Paperback', description: "Paulo Coelho's timeless classic.", price: 249, mrp: 450, discountPercent: 45, category: 'Books', imageUrl: img('book2'), rating: 4.6, ratingCount: 4100, stock: 300 },

  { id: 19, name: 'Building Blocks Set (120pc)', description: 'Creative STEM toy for ages 4+.', price: 799, mrp: 1499, discountPercent: 47, category: 'Toys', imageUrl: img('blocks'), rating: 4.5, ratingCount: 380, stock: 90 },
  { id: 20, name: 'Remote Control Car', description: 'High-speed RC car with rechargeable battery.', price: 1299, mrp: 2199, discountPercent: 41, category: 'Toys', imageUrl: img('rccar'), rating: 4.3, ratingCount: 275, stock: 60 },

  { id: 21, name: 'Assorted Dry Fruits Box (1kg)', description: 'Almonds, cashews, raisins & pistachios.', price: 899, mrp: 1299, discountPercent: 31, category: 'Grocery', imageUrl: img('dryfruits'), rating: 4.4, ratingCount: 660, stock: 150 },
  { id: 22, name: 'Cold-Pressed Olive Oil (1L)', description: 'Extra virgin, first cold press.', price: 649, mrp: 899, discountPercent: 28, category: 'Grocery', imageUrl: img('oliveoil'), rating: 4.2, ratingCount: 340, stock: 110 },
]

export const banners = [
  { id: 1, title: 'Big Electronics Sale', subtitle: 'Up to 50% off headphones, watches & more', cta: 'Shop now', bg: 'from-navy to-violet', category: 'Electronics' },
  { id: 2, title: 'Fashion Week Deals', subtitle: 'New arrivals starting at ₹499', cta: 'Explore fashion', bg: 'from-violet to-navy', category: 'Fashion' },
  { id: 3, title: 'Home Refresh', subtitle: 'Kitchen & home essentials, up to 44% off', cta: 'Shop home', bg: 'from-navy to-slate-800', category: 'Home & Kitchen' },
]
