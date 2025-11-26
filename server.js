const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const Order = require('./models/Order');
const Coupon = require('./models/Coupon');
const nodemailer = require("nodemailer");

// Product data
const products = [
  {
    id: "PMA-2025-001",
    category: "sneakers",
    name: "Puma",
    price: 3500,
    description: "Step up your game with Puma sneakers—featuring lightweight mesh, responsive cushioning, and a modern, athletic look.",
    details: [
      "Lightweight, breathable mesh upper for cool comfort",
      "Responsive midsole cushioning for all-day support",
      "Durable rubber outsole for reliable traction",
      "Contemporary design with signature Puma style"
    ],
    images: [
      "https://i.imgur.com/R5WLp1Z.jpeg",
      "https://i.imgur.com/cKU1qs7.jpeg"
    ],
    colors: ["white", "black"],
    sizes: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    id: "PMA-2025-002",
    category: "sneakers",
    name: "Puma",
    price: 3500,
    description: "Step up your game with Puma sneakers—featuring lightweight mesh, responsive cushioning, and a modern, athletic look.",
    details: [
      "Lightweight, breathable mesh upper for cool comfort",
      "Responsive midsole cushioning for all-day support",
      "Durable rubber outsole for reliable traction",
      "Contemporary design with signature Puma style"
    ],
    images: [
      'https://i.imgur.com/8XoZSiZ.jpeg',
      'https://i.imgur.com/wVkljWy.jpeg'

    ],
    colors: ["black", "white"],
    sizes: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    id: "WED-2025-005",
    category: "wedges",
    name: "Zara Wedge Platforms",
    price: 2500,
    description: "Step up your style with the Zara Wedge Platforms—where comfort meets contemporary fashion for any occasion.",
    details: [
      "Premium canvas upper with elegant, modern patterns",
      "Lightweight 2.5-inch wedge heel for a flattering lift",
      "Soft, cushioned footbed for all-day comfort",
      "Adjustable ankle strap for a secure, personalized fit",
      "Durable, slip-resistant rubber outsole for confident steps",
      "Versatile design perfect for brunch, shopping, or casual evenings out"
    ],
    images: [
      "https://i.imgur.com/rvxFeFX.jpeg",
      "https://i.imgur.com/Bam6Tri.jpeg",
      "https://i.imgur.com/BxMxO5P.jpeg",
      "https://i.imgur.com/Mqzqimm.jpeg"
    ],
    colors: ["black","blue", "brown","red"],
    sizes: [7, 8, 9, 10, 11]
  },
  {
    id: "PMP-2025-008",
    category: "rubbers",
    name: "Vans Rubber Shoes",
    price: 2200,
    description: "Classic Vans-inspired rubber shoes with a sleek silhouette and comfortable sole for all-day style.",
    details: [
      "Durable canvas upper with signature Vans look",
      "Vulcanized rubber sole for grip and flexibility",
      "Cushioned insole for comfort",
      "Versatile for casual wear, skateboarding, or street style"
    ],
    images: [
      "https://i.imgur.com/LkrIYYL.jpeg",
      'https://i.imgur.com/HIntVT7.jpeg',
      'https://i.imgur.com/BXI7ZcJ.jpeg',
      'https://i.imgur.com/2BDWurS.jpeg',
      'https://i.imgur.com/lGL3jwo.jpeg'
    ],
    colors: ["white", "blue", "yellow", "red", "pink"],
    sizes: [6, 7, 8, 9, 10]
  },
  {
    id: "lct-2025-008",
    category: "rubbers",
    name: "Lacoste Rubber",
    price: 3500,
    description: "Lacoste rubber shoes combining sporty elegance with durable, water‑friendly construction and the iconic crocodile logo — perfect for casual wear and rainy days.",
    details: [
      "Premium molded rubber upper with embossed Lacoste crocodile logo",
      "Water-resistant and easy to clean — ideal for wet conditions",
      "Contoured cushioned footbed for all-day comfort",
      "Textured rubber outsole for reliable grip on slippery surfaces",
      "Lightweight design for everyday wear and travel"
    ],
    images: [
      "https://i.imgur.com/moOofAn.jpeg"
    ],
    colors: ["black"],
    sizes: [9, 10, 11, 12, 13,14]
  },
  {
    id: "ytu-2025-009",
    category: "sandals",
    name: "Yaotu Sandal",
    price: 2200,
    description: "Step into summer with Yaotu Sandals—lightweight, flexible, and bursting with vibrant color for every adventure.",
    details: [
      "Adjustable ankle strap for a secure, custom fit",
      "Flexible rubber sole for all-day comfort",
      "Water-resistant materials for poolside or beach use",
      "Available in multiple bright, eye-catching colors"
    ],
    images: [
      "https://i.imgur.com/WSh0HAk.jpeg",
      "https://i.imgur.com/haFU1uP.jpeg",
      "https://i.imgur.com/YMK9HGY.jpeg",
      "https://i.imgur.com/rK8rrp8.jpeg"
    ],
    colors: ["amber", "white", "black","rose"],
    sizes: [5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    id: "SEL-2025-015",
    category: "rubbers",
    name: "Vans Double Color Block",
    price: 2200,
    description: "Trendy Vans-inspired rubbers with a modern square toe and stylish double color design.",
    details: [
      "Square toe design",
      "Chunky block heel",
      "Double color canvas upper",
      "Signature Vans style",
      "Comfort insole"
    ],
    images: [
      "https://i.imgur.com/MqIy4K3.jpeg",
      "https://i.imgur.com/rKLnQFm.jpeg",
      "https://i.imgur.com/6b0tVLK.jpeg",
      "https://i.imgur.com/Ft1Yz5o.jpeg"
    ],
    colors: ["blue", "red", "brown","black"],
    sizes: [6, 7, 8, 9, 10]
  },
  {
    id: "AdST-2025-016",
    category: "sneakers",
    name: "Adidas Stan Smith",
    price: 2500,
    description: "The iconic Adidas Stan Smith sneaker—clean, classic, and versatile for any style.",
    details: [
      "Smooth leather upper with signature perforated 3-Stripes",
      "Comfortable textile lining",
      "Durable rubber cupsole",
      "Classic Stan Smith branding on tongue and heel tab"
    ],
    images: [
      "https://i.imgur.com/lcrMDNv.jpeg",
      "https://i.imgur.com/QWz4U3k.jpeg",
      "https://cdn.shopify.com/s/files/1/0603/3031/1875/products/main-square_bc220298-a047-4c82-ab1c-709a82b3614e_x480.jpg?w=256&v=1696318793",
      "https://i.imgur.com/DluQiof.jpeg"
    ],
    colors: ["white", "black","pink","green"],
    sizes: [6, 7, 8, 9, 10, 11, 12, 13, 14]
  },

  {
    id: "NKWE-2025-024",
    category: "sneakers",
    name: "Naked Wolfe",
    price: 3800,
    description: "Step out in bold style with Naked Wolfe sneakers—where luxury streetwear meets comfort and attitude.",
    details: [
      "Signature chunky sole for standout street style",
      "Premium materials with Naked Wolfe branding",
      "Breathable mesh and leather upper",
      "Padded collar and tongue for all-day comfort",
      "Perfect for fashion-forward, urban looks"
    ],
    images: [
      "https://i.imgur.com/Ze8noqQ.jpeg",
      "https://i.imgur.com/9qs917n.jpeg",
      "https://i.imgur.com/hZ0Ul1Q.jpeg"
    ],
    colors: ["black", "blue", "green"],
    sizes: [6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    id: "NKWBW-2025-025",
    category: "sneakers",
    name: "Naked Wolfe Black & White",
    price: 3800,
    description: "Make a statement with Naked Wolfe Black & White sneakers—bold, chunky, and designed for those who want to stand out.",
    details: [
      "Iconic chunky sole for maximum street style impact",
      "Premium black and white colorway with signature Naked Wolfe branding",
      "Breathable mesh and leather upper for comfort and durability",
      "Padded collar and tongue for all-day wear",
      "Perfect for fashion-forward, urban looks"
    ],
    images: [
      "https://storage.googleapis.com/urbantreks/products/naked-wolfe.webp",
      "https://res.cloudinary.com/dbepcxgu9/image/upload/v1723649742/products/naked-wolfe_xlO5CR.webp",
      "https://i.imgur.com/SYpJbFd.jpeg"
    ],
    colors: ["black"],
    sizes: [6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    id: "NKsl-2025-025",
    category: "slides",
    name: "Adidas slides",
    price: 2000,
    description: "Step into comfort and style with Adidas Slides—perfect for lounging, poolside, or casual outings.",
    details: [
      "Contoured footbed for superior comfort",
      "Lightweight, water-friendly construction",
      "Classic Adidas branding on the strap",
      "Slip-on design for easy wear",
      "Durable outsole for everyday use"
    ],
    images: [
      "https://i.imgur.com/cixQ0Ac.jpeg",
      "https://i.imgur.com/u9ekOqf.jpeg",
      "https://i.imgur.com/9Hoq8DM.jpeg"
    ],
    colors: ["green","red", "blue"],
    sizes: [6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    id: "air95-2025-01",
    category: "sneakers",
    name: "Airmax 95",
    price: 4000,
    description: "The iconic Adidas Stan Smith sneaker—clean, classic, and versatile for any style.",
    details: [
      "Smooth leather upper with signature perforated 3-Stripes",
      "Comfortable textile lining",
      "Durable rubber cupsole",
      "Classic Stan Smith branding on tongue and heel tab"
    ],
    images: [
      "https://i.imgur.com/tekHhRR.jpeg",
      "https://i.imgur.com/XlJLecR.jpeg"
    ],
    colors: ["white", "blue"],
    sizes: [9, 10, 11, 12, 13, 14]
  },
  {
  id: "nb990-2025-01",
  category: "sneakers",
  name: "New Balance 990v6",
  price: 4200,
  description: "The legendary New Balance 990 sneaker—premium comfort, timeless design, and everyday versatility.",
  details: [
    "Pigskin and mesh upper for durability and breathability",
    "ENCAP midsole cushioning for all-day support",
    "Blown rubber outsole for superior traction",
    "Signature New Balance 'N' branding on the sides"
  ],
  images: [
    "https://i.imgur.com/77u1o56.jpeg",
    "https://i.imgur.com/JYcGVQa.jpeg"
  ],
  colors: ["black", "pink"],
  sizes: [9, 10, 11, 12, 13, 14]
},
  {
    id: "NKsl-2025-025",
    category: "slides",
    name: "Adidas Cool slides",
    price: 2000,
    description: "Step into comfort and style with Adidas Slides—perfect for lounging, poolside, or casual outings.",
    details: [
      "Contoured footbed for superior comfort",
      "Lightweight, water-friendly construction",
      "Classic Adidas branding on the strap",
      "Slip-on design for easy wear",
      "Durable outsole for everyday use"
    ],
    images: [
      "https://i.imgur.com/tfQUMqm.jpeg",
      "https://i.imgur.com/Vjmk5kJ.jpeg",
      "https://i.imgur.com/INbyois.jpeg"
    ],
    colors: ["green","black", "brown"],
    sizes: [6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  
{
  id: "af1-custom-black-001",
  category: "sneakers",
  name: "Air Force 1 Custom Black",
  price: 3500,
  description: "A sleek custom Air Force 1 in all-black design with premium finishes and timeless street style.",
  details: [
    "Full-grain black leather upper",
    "Matte black swoosh for a subtle look",
    "Durable black rubber outsole",
    "Custom black-on-black lace tips"
  ],
  images: [
    "https://i.imgur.com/wy3L9RL.jpeg"
  ],
  colors: ["black"],
  sizes: [6, 7, 8, 9, 10, 11]
},

{
  id: "af1-custom-khaki-001",
  category: "sneakers",
  name: "Air Force 1 Custom Khaki",
  price: 3500,
  description: "A versatile custom Air Force 1 in khaki tones with premium finishes and timeless street style.",
  details: [
    "Full-grain khaki leather upper",
    "Matte khaki swoosh for a subtle look",
    "Durable khaki rubber outsole",
    "Custom khaki-on-khaki lace tips"
  ],
  images: [
    "https://i.imgur.com/FviyuFO.jpeg"
  ],
  colors: ["khaki"],
  sizes: [6, 7, 8, 9, 10, 11]
},
  {
  id: "af1-custom-brown-001",
  category: "sneakers",
  name: "Air Force 1 Custom Brown",
  price: 3500,
  description: "A versatile custom Air Force 1 in rich brown tones with premium finishes and timeless street style.",
  details: [
    "Full-grain brown leather upper",
    "Matte brown swoosh for a subtle look",
    "Durable brown rubber outsole",
    "Custom brown-on-brown lace tips"
    ],
    images: [
      "https://i.imgur.com/S9s9m1I.jpeg",
    ],
    colors: ["brown"],
    sizes: [6, 7, 8, 9, 10, 11]
  },
  {
    id: "af1-custom-004",
    category: "sneakers",
    name: "Air Force 1 yellow",
    price: 3500,
    description: "A versatile custom Air Force 1 in rich yellow tones with premium finishes and timeless street style.",
    details: [
      "Hand-painted overlays",
      "Durable rubber sole with paint-splatter effect",
      "Unique tongue tag with street-art logo"
    ],
    images: [
      "https://i.imgur.com/F7zvfiC.jpeg"
    ],
    colors: ["yellow"],
    sizes: [6,7,8, 9, 10, 11]
  },
{
  id: "af1-custom-006",
  category: "sneakers",
  name: "Air Force 1 white & red",
  price: 3500,
  description: "Custom Air Force 1 featuring bold red accents on a clean white base for a striking look.",
  details: [
    "Full-grain leather upper",
    "Red swoosh and lace eyelets",
    "Soft inner lining for comfort",
    "Embossed AF1 logo on heel"
  ],
  images: [
    "https://i.imgur.com/xDFQhZz.jpeg"
  ],
  colors: ["white"],
  sizes: [6,7, 8, 9, 10, 11]
},
{
  id: "af1-custom-007",
  category: "sneakers",
  name: "Air Force 1 White & Cream",
  price: 3500,
  description: "Elegant Air Force 1 with subtle cream accents on a clean white base, blending luxury and minimalism.",
  details: [
    "Full-grain leather upper",
    "Cream swoosh and lace eyelets",
    "Soft inner lining for comfort",
    "Embossed AF1 logo on heel"
  ],
  images: [
    "https://i.imgur.com/SeqVOdx.jpeg"
  ],
  colors: ["white"],
  sizes: [6, 7, 8, 9, 10, 11]
},
{
  id: "af1-custom-008",
  category: "sneakers",
  name: "Air Force 1 White, Brown & Black Luxe",
  price: 3500,
  description: "Sophisticated Air Force 1 with rich brown and bold black accents on a clean white base.",
  details: [
    "Full-grain leather upper",
    "Brown swoosh with black lace eyelets",
    "Soft inner lining for comfort",
    "Embossed AF1 logo on heel"
  ],
  images: [
    "https://i.imgur.com/yq7OrdA.jpeg"
  ],
  colors: ["white"],
  sizes: [6, 7, 8, 9, 10, 11]
},
{
  id: "af1-custom-009",
  category: "sneakers",
  name: "Air Force 1 White, Grey & Gold Luxe",
  price: 3500,
  description: "Premium Air Force 1 with sleek grey overlays and luxurious gold accents on a crisp white base.",
  details: [
    "Full-grain leather upper",
    "Grey swoosh with gold lace eyelets",
    "Soft inner lining for comfort",
    "Embossed metallic AF1 logo on heel"
  ],
  images: [
    "https://i.imgur.com/SkjgU10.jpeg"
  ],
  colors: ["white"],
  sizes: [6, 7, 8, 9, 10, 11]
}





];


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
// ------------------------------
// 🔐 Middleware
// ------------------------------
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return res.status(403).json({ message: 'Admin access denied' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// ------------------------------
// ✅ MongoDB Connection
// ------------------------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ------------------------------
// 🔐 Admin Login
// ------------------------------
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid admin credentials' });
  }

  const token = jwt.sign({ isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '2h'
  });

  res.json({ token });
});


// ------------------------------
// 🏷️ Coupons (CRUD)
// ------------------------------
app.get('/api/admin/coupons', adminAuth, async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

app.post('/api/admin/coupons', adminAuth, async (req, res) => {
  const { code, amount } = req.body;
  if (!code || !amount) return res.status(400).json({ message: 'Invalid data' });

  try {
    const exists = await Coupon.findOne({ code });
    if (exists) return res.status(400).json({ message: 'Coupon already exists' });

    const newCoupon = new Coupon({ code: code.toUpperCase(), amount, isActive: true });
    await newCoupon.save();
    res.status(201).json({ message: 'Coupon created', coupon: newCoupon });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/admin/coupons/:id', adminAuth, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'Coupon deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting coupon' });
  }
});

// Optional: Update Coupon
app.put('/api/admin/coupons/:id', adminAuth, async (req, res) => {
  try {
    const { code, amount, isActive } = req.body;
    const updated = await Coupon.findByIdAndUpdate(req.params.id, {
      code: code.toUpperCase(),
      amount,
      isActive
    }, { new: true });

    res.json({ message: 'Coupon updated', coupon: updated });
  } catch (err) {
    res.status(500).json({ message: 'Error updating coupon' });
  }
});

// ------------------------------
// 👥 Admin: User Management
// ------------------------------
app.get('/api/admin/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find().select('name email createdAt').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to load users' });
  }
});

app.get('/api/admin/users/:id/details', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email createdAt');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 });
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);

    res.json({ user, orders, totalSpent });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
});


// ------------------------------
// 📊 Admin: Analytics
// ------------------------------
app.get('/api/admin/analytics', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email');

    let totalRevenue = 0;
    let productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        totalRevenue += item.price * item.quantity;

        if (!productSales[item.name]) {
          productSales[item.name] = {
            quantity: 0,
            revenue: 0,
            image: item.image,
            price: item.price
          };
        }

        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    const totalOrders = orders.length;
    const totalUsers = await User.countDocuments();

    res.json({
      totalRevenue,
      totalOrders,
      totalUsers,
      productSales
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load analytics' });
  }
});

// ------------------------------
// 👤 User Auth Routes
// ------------------------------
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Signup error', error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login error' });
  }
});

app.get('/api/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/orders', authMiddleware, async (req, res) => {
  const {
    items,
    deliveryAddress,
    coupon,
    discount,
    shippingFee = 0,
    paymentRef,
    paymentMethod = 'pay-online'
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const requiredFields = ['name', 'email', 'phone', 'address', 'country', 'state', 'city', 'zip'];
  const missing = requiredFields.filter(field => !deliveryAddress?.[field]);
  if (missing.length > 0) {
    return res.status(400).json({ message: `Missing delivery fields: ${missing.join(', ')}` });
  }

  try {
    // ✅ Block PoD for new users
    if (paymentMethod === 'pay-on-delivery') {
      const previousOrders = await Order.find({ userId: req.user.id }).limit(1);
      if (!previousOrders.length) {
        return res.status(403).json({
          message: 'Payment on delivery is only available for returning customers.'
        });
      }
    }

    let validCoupon = null;

    if (coupon) {
      validCoupon = await Coupon.findOne({
        code: coupon.toUpperCase(),
        isActive: true
      });

      if (!validCoupon) {
        return res.status(400).json({ message: 'Coupon is invalid or already used' });
      }

      const usedBefore = await Order.findOne({
        userId: req.user.id,
        coupon: coupon.toUpperCase()
      });

      if (usedBefore) {
        return res.status(400).json({ message: 'You have already used this coupon' });
      }
    }

    const normalizedItems = items.map(item => ({
      name: item.name || 'Unnamed Product',
      price: item.price || 0,
      size: item.size || 'N/A',
      color: item.color || 'N/A',
      productId: item.productId || '',
      quantity: item.quantity || 1,
      image: item.image || ''
    }));

    const itemTotal = normalizedItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const finalPrice = itemTotal - (discount || 0) + (shippingFee || 0);

    const isDeliveryFeePaid = true;
    const isFullyPaid = paymentMethod === 'pay-online';

    const order = new Order({
      userId: req.user.id,
      items: normalizedItems,
      deliveryAddress,
      totalPrice: finalPrice,
      discount: discount || 0,
      shippingFee,
      coupon: coupon?.toUpperCase() || null,
      paymentRef: paymentRef || '',
      paymentMethod,
      isDeliveryFeePaid,
      isFullyPaid
    });

    await order.save();

    if (validCoupon) {
      validCoupon.isActive = false;
      await validCoupon.save();
    }

    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const itemDetailsHTML = normalizedItems.map(item =>
      `<li>${item.quantity} × ${item.name} - Ksh${item.price} (${item.color}, ${item.size})</li>`
    ).join('');

    const userEmail = {
      to: deliveryAddress.email,
      from: process.env.EMAIL_USER,
      subject: 'Your Order Confirmation',
      html: `
        <h2>Thank you for your order!</h2>
        <p>Here's what you ordered:</p>
        <ul>${itemDetailsHTML}</ul>
        <p><strong>Discount:</strong> Ksh${discount || 0}</p>
        <p><strong>Shipping Fee:</strong> Ksh${shippingFee}</p>
        <p><strong>Total:</strong> Ksh${finalPrice}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod === 'pay-on-delivery' ? 'Pay on Delivery' : 'Paid Online'}</p>
        <p>We'll notify you when it's shipped. 🚚</p>
      `
    };

    const adminEmail = {
      to: process.env.ADMIN_EMAIL,
      from: process.env.EMAIL_USER,
      subject: 'New Order Received',
      html: `
        <h2>New Order Placed</h2>
        <p><strong>User:</strong> ${deliveryAddress.name} (${deliveryAddress.email})</p>
        <p><strong>Phone:</strong> ${deliveryAddress.phone}</p>
        <h4>Shipping Address:</h4>
        <p>${deliveryAddress.address}, ${deliveryAddress.city}, ${deliveryAddress.state}, ${deliveryAddress.zip}, ${deliveryAddress.country}</p>
        <h4>Items:</h4>
        <ul>${itemDetailsHTML}</ul>
        <p><strong>Discount:</strong> Ksh${discount || 0}</p>
        <p><strong>Shipping:</strong> Ksh${shippingFee}</p>
        <p><strong>Total:</strong> Ksh${finalPrice}</p>
        <p><strong>Coupon:</strong> ${coupon || 'None'}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
      `
    };

    transporter.sendMail(userEmail, err => {
      if (err) console.error('❌ Email to user failed:', err.message);
    });

    transporter.sendMail(adminEmail, err => {
      if (err) console.error('❌ Email to admin failed:', err.message);
    });

    res.status(201).json({ message: 'Order placed successfully', order });

  } catch (err) {
    console.error('❌ Order creation error:', err);
    res.status(500).json({ message: 'Server error during order processing' });
  }
});




app.get('/api/coupons/:code', authMiddleware, async (req, res) => {
  const { code } = req.params;
  const userId = req.user.id;

  try {
    // Check if it's the automatic discount
    if (code.trim().toUpperCase() === "AUTOMATIC DISCOUNT") {
      const user = await User.findById(userId);
      if (user.hasUsedAutomaticDiscount) {
        return res.status(400).json({ message: 'You have already used the Automatic Discount.' });
      }
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    if (!coupon) return res.status(404).json({ message: 'Coupon not found or inactive' });

    if (coupon.usedBy?.includes(userId)) {
      return res.status(400).json({ message: 'You have already used this coupon' });
    }

    res.json({ amount: coupon.amount });
  } catch (err) {
    res.status(500).json({ message: 'Server error while fetching coupon' });
  }
});


// ✅ ADMIN: Get all orders
app.get('/api/admin/orders', adminAuth, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });

    const formatted = orders.map(order => {
      const itemTotal = order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      const total = order.totalPrice || (itemTotal - (order.discount || 0) + (order.shippingFee || 0));

      return {
        id: order._id,
        user: {
          name: order.userId?.name || 'N/A',
          email: order.userId?.email || 'N/A'
        },
        items: order.items,
        deliveryAddress: order.deliveryAddress,
        totalPrice: total,
        discount: order.discount || 0,
        shippingFee: order.shippingFee || 0,
        coupon: order.coupon || null,
        paymentRef: order.paymentRef || null,
        paymentMethod: order.paymentMethod || 'pay-online',
        isDeliveryFeePaid: order.isDeliveryFeePaid || false,
        isFullyPaid: order.isFullyPaid || false,
        status: order.status || 'Pending',
        createdAt: order.createdAt
      };
    });

    res.json(formatted);
  } catch (err) {
    console.error('Order fetch error:', err);
    res.status(500).json({ message: 'Failed to load orders' });
  }
});



// ✅ USER: Get current user's orders
app.get('/api/user/orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    const enriched = orders.map(order => {
      const itemTotal = order.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
      return {
        id: order._id,
        items: order.items,
        deliveryAddress: order.deliveryAddress,
        coupon: order.coupon,
        discount: order.discount || 0,
        shippingFee: order.shippingFee || 0,
        totalPrice: order.totalPrice || (itemTotal - (order.discount || 0) + (order.shippingFee || 0)),
        paymentRef: order.paymentRef || null,
        status: order.status || 'Pending',
        createdAt: order.createdAt
      };
    });

    res.status(200).json(enriched);
  } catch (err) {
    console.error('❌ Failed to fetch user orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});


// ✅ ADMIN: Update order status and full payment flag
app.patch('/api/admin/orders/:id/status', adminAuth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const allowedStatuses = [
      'Pending', 'Confirmed', 'Ready for Shipping',
      'Shipped', 'Delivered', 'Cancelled'
    ];

    const newStatus = req.body.status;
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    order.status = newStatus;

    // ✅ If delivered and not yet fully paid, mark as paid
    if (newStatus === 'Delivered' && !order.isFullyPaid) {
      order.isFullyPaid = true;
    }

    await order.save();

    res.json({
      message: 'Status updated',
      status: order.status,
      isFullyPaid: order.isFullyPaid
    });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Failed to update order status' });
  }
});


app.post('/api/auth/change-password', authMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: '✅ Password updated successfully!' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ message: 'Server error' });
  }
});
// ------------------------------
// 🔁 Reset Password
// ------------------------------
app.post('/api/auth/reset-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    // Generate token
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Save token and expiration in user model (you can add these fields)
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `https://lukumisteress.onrender.com/resetpassword/?token=${resetToken}`;

    // Send email (basic example)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset Request',
      html: `<p>You requested a password reset. Click the link below:</p>
             <a href="${resetUrl}">${resetUrl}</a>`
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        console.error('Email error:', err);
        return res.status(500).json({ message: 'Error sending email' });
      }
      res.json({ message: 'Password reset email sent' });
    });
  } catch (err) {
    console.error('Reset error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle resetting the password with token
app.post('/api/auth/reset-password/:token', async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.resetPasswordToken || user.resetPasswordExpire < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password successfully reset' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});





app.post('/api/auth/mark-automatic-discount-used', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.hasUsedAutomaticDiscount) {
      return res.status(400).json({ message: 'Already marked as used' });
    }

    user.hasUsedAutomaticDiscount = true;
    await user.save();

    res.json({ message: 'Automatic discount marked as used' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------------------
// 📦 Products
// ------------------------------
app.get('/api/products', (req, res) => {
  res.json(products);
});

// ------------------------------
// 🚀 Start Server
// ------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
