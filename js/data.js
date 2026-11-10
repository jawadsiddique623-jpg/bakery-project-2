/**
 * data.js — All site content as plain JS arrays/objects.
 * Edit here to update products, categories and gallery without
 * touching any HTML or CSS.
 */

/* ── Top navbar category links ────────────────────────────── */
const NAV_CATEGORIES = [
  { label: 'Cakes',           href: '#' },
  { label: 'Theme Cakes',     href: '#' },
  { label: 'By Relationship', href: '#' },
  { label: 'Desserts',        href: '#' },
  { label: 'Birthday',        href: '#' },
  { label: 'Hampers',         href: '#', badge: 'New' },
  { label: 'Anniversary',     href: '#' },
  { label: 'Occasions',       href: '#' },
  { label: 'Customized Cakes',href: '#' },
];

/* ── Menu / Category cards (Section 3) ───────────────────── */
const MENU_CATEGORIES = [
  {
    id: 'classic',
    label: 'Classic Cakes',
    desc: 'Timeless favourites',
    imgKey: 0,  // index into IMAGES.categories
  },
  {
    id: 'gourmet',
    label: 'Gourmet Cakes',
    desc: 'Premium ingredients',
    imgKey: 1,
  },
  {
    id: 'designer',
    label: 'Designer Cakes',
    desc: 'Art you can eat',
    imgKey: 2,
  },
  {
    id: 'desserts',
    label: 'Desserts',
    desc: 'Sweet bites',
    imgKey: 3,
  },
  {
    id: 'cookies',
    label: 'Cookies',
    desc: 'Crisp & chewy',
    imgKey: 4,
  },
];

/* ── Bestseller products (Section 4) ─────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: 'Rich Chocolate Cake',
    price: 699,
    rating: 4.9,
    reviews: 12400,
    imgKey: 0,  // index into IMAGES.products
  },
  {
    id: 2,
    name: 'Vanilla Berry Cake',
    price: 599,
    rating: 4.8,
    reviews: 10000,
    imgKey: 1,
  },
  {
    id: 3,
    name: 'Pineapple Cream Cake',
    price: 549,
    rating: 4.9,
    reviews: 8000,
    imgKey: 2,
  },
  {
    id: 4,
    name: 'Red Velvet Cake',
    price: 649,
    rating: 4.9,
    reviews: 9100,
    imgKey: 3,
  },
  {
    id: 5,
    name: 'Butterscotch Crunch Cake',
    price: 599,
    rating: 4.8,
    reviews: 7000,
    imgKey: 4,
  },
];

/* ── Our Promise items (Section 5) ───────────────────────── */
const PROMISES = [
  {
    icon: '<i class="fa-solid fa-truck-fast" aria-hidden="true"></i>',
    title: 'On-Time Delivery',
    desc: 'Fresh to your door, right on schedule',
  },
  {
    icon: '<i class="fa-solid fa-cake-candles" aria-hidden="true"></i>',
    title: '500+ Designs',
    desc: 'A cake for every taste & occasion',
  },
  {
    icon: '<i class="fa-solid fa-bag-shopping" aria-hidden="true"></i>',
    title: '2 Cr+ Orders',
    desc: 'Trusted by millions of happy customers',
  },
  {
    icon: '<i class="fa-solid fa-fire-flame-curved" aria-hidden="true"></i>',
    title: 'Freshly Baked',
    desc: 'Made fresh daily with premium ingredients',
  },
];

/* ── Testimonials (Section 7 testimonial area) ───────────── */
const TESTIMONIALS = [
  {
    name: 'Nusrat Jahan',
    text: '"The cakes are simply amazing! Super fresh and beautifully decorated."',
    avatarKey: 0,
  },
  {
    name: 'Rafiul Islam',
    text: '"On-time delivery and great taste. Highly recommended!"',
    avatarKey: 1,
  },
  {
    name: 'Ayesha Akter',
    text: '"The best cake shop in town. Loved it!"',
    avatarKey: 2,
  },
];

/* ── Footer link columns ──────────────────────────────────── */
const FOOTER_LINKS = [
  {
    heading: 'Know Us',
    links: [
      { label: 'About Us',    href: '#' },
      { label: 'Careers',     href: '#' },
      { label: 'Blog',        href: '#' },
      { label: 'Press',       href: '#' },
    ],
  },
  {
    heading: 'Need Help',
    links: [
      { label: 'FAQs',              href: '#' },
      { label: 'Shipping Policy',   href: '#' },
      { label: 'Return Policy',     href: '#' },
      { label: 'Privacy Policy',    href: '#' },
      { label: 'Terms & Conditions',href: '#' },
    ],
  },
  {
    heading: 'More Info',
    links: [
      { label: 'Track Order',    href: '#' },
      { label: 'Store Locator',  href: '#' },
      { label: 'Gift Cards',     href: '#' },
      { label: 'Loyalty Points', href: '#' },
    ],
  },
];

