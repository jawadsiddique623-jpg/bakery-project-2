/**
 * main.js — All interactivity for [YOUR BRAND NAME] Bakery.
 * Depends on: data.js (loaded first), images.js (loaded first).
 */

/* ═══════════════════════════════════════════════════════════
   0.  HELPERS
══════════════════════════════════════════════════════════════ */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatPrice(n) {
  return '৳' + Number(n).toLocaleString('en-IN');
}

function formatReviews(n) {
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
  return n;
}

/* ═══════════════════════════════════════════════════════════
   1.  CART  (localStorage)
══════════════════════════════════════════════════════════════ */
let cart = JSON.parse(localStorage.getItem('bk_cart') || '[]');

function saveCart() {
  localStorage.setItem('bk_cart', JSON.stringify(cart));
}

function cartCount() {
  return cart.reduce((s, i) => s + i.qty, 0);
}

function updateCartBadge() {
  const count = cartCount();
  $$('.cart-badge').forEach(el => {
    el.textContent = count;
    el.style.display = 'flex';
  });
}

function addToCart(product) {
  const existing = cart.find(i => i.id === product.id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...product, qty: 1 });
  }
  saveCart();
  updateCartBadge();
  showToast(`"${product.name}" added to cart`);
}

/* ═══════════════════════════════════════════════════════════
   2.  WISHLIST  (localStorage)
══════════════════════════════════════════════════════════════ */
let wishlist = new Set(JSON.parse(localStorage.getItem('bk_wishlist') || '[]'));

function saveWishlist() {
  localStorage.setItem('bk_wishlist', JSON.stringify([...wishlist]));
}

function toggleWishlist(id, btn) {
  if (wishlist.has(id)) {
    wishlist.delete(id);
    btn.classList.remove('active');
    btn.setAttribute('aria-label', 'Add to wishlist');
  } else {
    wishlist.add(id);
    btn.classList.add('active');
    btn.setAttribute('aria-label', 'Remove from wishlist');
    showToast('Added to wishlist');
  }
  saveWishlist();
}

/* ═══════════════════════════════════════════════════════════
   3.  TOAST NOTIFICATION
══════════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  let toast = $('#toast-notification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notification';
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ═══════════════════════════════════════════════════════════
   4.  RENDER: CATEGORY NAV (sub-header)
══════════════════════════════════════════════════════════════ */
function renderCategoryNav() {
  const nav = $('#category-nav-list');
  if (!nav) return;
  nav.innerHTML = NAV_CATEGORIES.map(c => `
    <li>
      <a href="${c.href}" class="cat-link">
        ${c.label}
        ${c.badge ? `<span class="cat-badge">${c.badge}</span>` : ''}
      </a>
    </li>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════
   5.  RENDER: MENU CARDS
══════════════════════════════════════════════════════════════ */
function renderMenuCards() {
  const grid = $('#menu-cards-grid');
  if (!grid) return;
  grid.innerHTML = MENU_CATEGORIES.map(cat => `
    <div class="menu-card reveal" data-id="${cat.id}">
      <div class="menu-card__img-wrap">
        <img
          src="${IMAGES.categories[cat.imgKey]}"
          alt="${cat.label}"
          loading="lazy"
          width="300"
          height="300"
          onerror="this.src='https://placehold.co/300x300/FBD3D9/C8102E?text=${encodeURIComponent(cat.label)}'"
        />
      </div>
      <div class="menu-card__body">
        <span class="menu-card__label">${cat.label}</span>
        <span class="menu-card__desc">${cat.desc}</span>
      </div>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════
   6.  RENDER: PRODUCT CARDS (Bestsellers)
══════════════════════════════════════════════════════════════ */
function renderProducts() {
  const track = $('#products-track');
  if (!track) return;
  track.innerHTML = PRODUCTS.map(p => {
    const isWished = wishlist.has(p.id);
    const stars = '★'.repeat(Math.round(p.rating)) + '☆'.repeat(5 - Math.round(p.rating));
    return `
      <div class="product-card reveal">
        <div class="product-card__img-wrap">
          <img
            src="${IMAGES.products[p.imgKey]}"
            alt="${p.name}"
            loading="lazy"
            width="260"
            height="220"
            onerror="this.src='https://placehold.co/260x220/FBD3D9/C8102E?text=${encodeURIComponent(p.name)}'"
          />
          <button
            class="wishlist-btn${isWished ? ' active' : ''}"
            aria-label="${isWished ? 'Remove from wishlist' : 'Add to wishlist'}"
            data-id="${p.id}"
          ><i class="fa-solid fa-heart" aria-hidden="true"></i></button>
        </div>
        <div class="product-card__body">
          <p class="product-card__name">${p.name}</p>
          <div class="product-card__meta">
            <span class="stars" aria-label="${p.rating} stars">${stars}</span>
            <span class="reviews">(${formatReviews(p.reviews)} Reviews)</span>
          </div>
          <div class="product-card__footer">
            <span class="product-card__price">${formatPrice(p.price)}</span>
            <button class="btn-add-cart" data-id="${p.id}" aria-label="Add ${p.name} to cart">
              <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i> Add to Cart
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');

  /* Delegate events on the track */
  track.addEventListener('click', e => {
    const addBtn = e.target.closest('.btn-add-cart');
    const heartBtn = e.target.closest('.wishlist-btn');

    if (addBtn) {
      const id = Number(addBtn.dataset.id);
      const product = PRODUCTS.find(p => p.id === id);
      if (product) {
        addBtn.classList.add('adding');
        setTimeout(() => addBtn.classList.remove('adding'), 600);
        addToCart(product);
      }
    }

    if (heartBtn) {
      const id = Number(heartBtn.dataset.id);
      toggleWishlist(id, heartBtn);
    }
  });
}

/* ═══════════════════════════════════════════════════════════
   7.  RENDER: PROMISE ICONS
══════════════════════════════════════════════════════════════ */
function renderPromises() {
  const grid = $('#promises-grid');
  if (!grid) return;
  grid.innerHTML = PROMISES.map(p => `
    <div class="promise-item reveal">
      <div class="promise-item__icon" aria-hidden="true">${p.icon}</div>
      <strong class="promise-item__title">${p.title}</strong>
      <p class="promise-item__desc">${p.desc}</p>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════
   8.  RENDER: SOCIAL GALLERY
══════════════════════════════════════════════════════════════ */
function renderGallery() {
  const track = $('#gallery-track');
  if (!track) return;
  track.innerHTML = IMAGES.gallery.map((url, i) => `
    <div class="gallery-tile">
      <img
        src="${url}"
        alt="Community share ${i + 1}"
        loading="lazy"
        width="220"
        height="220"
        onerror="this.src='https://placehold.co/220x220/FBD3D9/C8102E?text=Share+${i + 1}'"
      />
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════
   9.  RENDER: TESTIMONIALS
══════════════════════════════════════════════════════════════ */
function renderTestimonials() {
  const track = $('#testimonials-track');
  if (!track) return;
  track.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card reveal">
      <div class="testimonial-card__header">
        <img
          src="${IMAGES.avatars[t.avatarKey]}"
          alt="${t.name}"
          width="56"
          height="56"
          loading="lazy"
          onerror="this.src='https://placehold.co/56x56/FBD3D9/C8102E?text=${encodeURIComponent(t.name[0])}'"
        />
        <div>
          <strong>${t.name}</strong>
          <div class="stars" aria-label="5 stars">★★★★★</div>
        </div>
        <span class="testimonial-heart" aria-hidden="true">
          <i class="fa-solid fa-heart"></i>
        </span>
      </div>
      <p class="testimonial-card__text">${t.text}</p>
    </div>
  `).join('');
}

/* ═══════════════════════════════════════════════════════════
   10. RENDER: FOOTER LINKS
══════════════════════════════════════════════════════════════ */
function renderFooterLinks() {
  const container = $('#footer-link-cols');
  if (!container) return;
  container.innerHTML = FOOTER_LINKS.map((col, i) => `
    <div class="footer-col">
      <button class="footer-col__heading" aria-expanded="false" data-col="${i}">
        ${col.heading}
        <span class="footer-col__arrow" aria-hidden="true">
          <i class="fa-solid fa-chevron-down"></i>
        </span>
      </button>
      <ul class="footer-col__list" id="footer-col-list-${i}" hidden>
        ${col.links.map(l => `<li><a href="${l.href}">${l.label}</a></li>`).join('')}
      </ul>
    </div>
  `).join('');

  /* Accordion toggle (mobile) — desktop shows all */
  container.addEventListener('click', e => {
    const btn = e.target.closest('.footer-col__heading');
    if (!btn) return;
    if (window.innerWidth >= 768) return; // desktop — always visible
    const colIdx = btn.dataset.col;
    const list = $(`#footer-col-list-${colIdx}`);
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    list.hidden = expanded;
  });
}

/* ═══════════════════════════════════════════════════════════
   11. STICKY HEADER
══════════════════════════════════════════════════════════════ */
function initStickyHeader() {
  const header = $('header.site-header');
  if (!header) return;
  const sentinel = document.createElement('div');
  sentinel.style.height = '1px';
  header.before(sentinel);

  const obs = new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  }, { rootMargin: '0px' });
  obs.observe(sentinel);
}

/* ═══════════════════════════════════════════════════════════
   12. MOBILE MENU & ACCORDIONS
══════════════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger = $('#hamburger-btn');
  const drawer    = $('#mobile-drawer');
  const overlay   = $('#drawer-overlay');
  const closeBtn  = $('#drawer-close');
  if (!hamburger || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    overlay.classList.add('visible');
    overlay.setAttribute('aria-hidden', 'false');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    overlay.classList.remove('visible');
    overlay.setAttribute('aria-hidden', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }

  hamburger.addEventListener('click', openDrawer);
  closeBtn?.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  /* Close on ESC */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* Drawer Accordions */
  const accordionBtns = $$('.drawer-accordion-btn', drawer);
  accordionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const subMenu = btn.nextElementSibling;

      // Close other accordions for neatness
      accordionBtns.forEach(otherBtn => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) otherBtn.nextElementSibling.hidden = true;
        }
      });

      btn.setAttribute('aria-expanded', String(!isExpanded));
      if (subMenu) subMenu.hidden = isExpanded;
    });
  });

  /* Close drawer when a link is clicked */
  $$('.drawer-sub-menu a, .drawer-item-link, .drawer-cart-btn', drawer).forEach(link => {
    link.addEventListener('click', () => {
      closeDrawer();
    });
  });
}

/* ═══════════════════════════════════════════════════════════
   12.1 PILL NAVBAR INTERACTIONS (Dropdowns, Active, Scroll)
══════════════════════════════════════════════════════════════ */
function initPillNavbar() {
  const navWrapper = $('#pill-nav');
  if (!navWrapper) return;

  const dropdownItems = $$('.has-dropdown', navWrapper);

  // Toggle on tap/click for mobile/touch or keyboard navigation
  dropdownItems.forEach(item => {
    const toggle = $('.dropdown-toggle', item);
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('is-open');

      // Close other dropdowns
      dropdownItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
          $('.dropdown-toggle', other)?.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', !isOpen);
      toggle.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!navWrapper.contains(e.target)) {
      dropdownItems.forEach(item => {
        item.classList.remove('is-open');
        $('.dropdown-toggle', item)?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Close dropdowns on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownItems.forEach(item => {
        item.classList.remove('is-open');
        $('.dropdown-toggle', item)?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Active state switching on click
  const navLinks = $$('.pill-nav-link, .drawer-item-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      if (this.classList.contains('dropdown-toggle')) return; // handled by dropdown toggle

      navLinks.forEach(l => l.classList.remove('is-active'));
      this.classList.add('is-active');

      // Sync active state to drawer if clicked on desktop, or vice versa
      const section = this.dataset.section;
      if (section) {
        $$(`[data-section="${section}"]`).forEach(el => el.classList.add('is-active'));
      }
    });
  });

  // Active state switching on scroll (Scroll spy)
  const sections = [
    { id: 'bestsellers', name: 'cakes' },
    { id: 'menu-heading', name: 'sweets' },
    { id: 'promise-heading', name: 'about' },
    { id: 'gallery-heading', name: 'gallery' },
    { id: 'newsletter-form', name: 'contact' }
  ];

  const sectionElements = sections
    .map(s => ({ el: document.getElementById(s.id), name: s.name }))
    .filter(s => s.el !== null);

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY + 180;
    if (scrollPos < 400) {
      // Near top - Home is active
      $$('.pill-nav-link, .drawer-item-link').forEach(l => l.classList.remove('is-active'));
      $('[data-section="home"]')?.classList.add('is-active');
      $('.drawer-home-link')?.classList.add('is-active');
      return;
    }

    let currentSection = '';
    sectionElements.forEach(({ el, name }) => {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height + 200) {
        currentSection = name;
      }
    });

    if (currentSection) {
      $$('.pill-nav-link, .drawer-item-link').forEach(l => l.classList.remove('is-active'));
      $$(`[data-section="${currentSection}"]`).forEach(l => l.classList.add('is-active'));
    }
  }, { passive: true });
}

/* ═══════════════════════════════════════════════════════════
   13. TRUST LINE TOGGLE
══════════════════════════════════════════════════════════════ */
function initTrustToggle() {
  const btn     = $('#trust-toggle-btn');
  const content = $('#trust-content');
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    content.hidden = expanded;
    // rotate the chevron icon via CSS (see .trust-toggle-btn[aria-expanded="true"] .trust-arrow)
  });
}

/* ═══════════════════════════════════════════════════════════
   14. SCROLL-REVEAL (IntersectionObserver)
══════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    $$('.reveal').forEach(el => el.classList.add('revealed'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  $$('.reveal').forEach(el => obs.observe(el));
}

/* ═══════════════════════════════════════════════════════════
   15. NEWSLETTER FORM
══════════════════════════════════════════════════════════════ */
function initNewsletterForm() {
  const form = $('#newsletter-form');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value.trim();
    if (!email) return;
    showToast('Thank you for subscribing!');
    form.reset();
  });
}

/* ═══════════════════════════════════════════════════════════
   16. LOCATION SELECTOR
══════════════════════════════════════════════════════════════ */
function initLocationSelector() {
  const btn   = $('#location-btn');
  const popup = $('#location-popup');
  if (!btn || !popup) return;

  btn.addEventListener('click', () => {
    const open = popup.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !popup.contains(e.target)) {
      popup.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  popup.addEventListener('click', e => {
    const item = e.target.closest('[data-city]');
    if (!item) return;
    btn.querySelector('.location-city').textContent = item.dataset.city;
    popup.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
    showToast(`Delivering to ${item.dataset.city}`);
  });
}

/* ═══════════════════════════════════════════════════════════
   17. DESKTOP FOOTER: always show lists
══════════════════════════════════════════════════════════════ */
function ensureFooterDesktop() {
  function check() {
    if (window.innerWidth >= 768) {
      $$('.footer-col__list').forEach(list => { list.hidden = false; });
      $$('.footer-col__heading').forEach(btn => btn.setAttribute('aria-expanded', 'true'));
    }
  }
  check();
  window.addEventListener('resize', check);
}

/* ═══════════════════════════════════════════════════════════
   18. BOOTSTRAP
══════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderCategoryNav();
  renderMenuCards();
  renderProducts();
  renderPromises();
  renderGallery();
  renderTestimonials();
  renderFooterLinks();

  updateCartBadge();
  initStickyHeader();
  initMobileMenu();
  initPillNavbar();
  initTrustToggle();
  initNewsletterForm();
  initLocationSelector();
  ensureFooterDesktop();

  /* Scroll-reveal runs after all elements are in the DOM */
  requestAnimationFrame(() => {
    requestAnimationFrame(initScrollReveal);
  });
});
