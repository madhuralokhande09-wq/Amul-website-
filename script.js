/* ==========================================================================
   AMUL PROTEIN SHAKE — THE TASTE OF INDIA (SLIDE APPLICATION SCRIPT)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ── FLAVOUR DATA DICTIONARY WITH PER-FLAVOUR VIEW IMAGES & LABELS ──
  const FLAVOURS = {
    blueberry: {
      name: "Blueberry Blast",
      badge: "BESTSELLER",
      price: 50,
      image: "assets/bottle-front-view.png",
      views: {
        front: "assets/bottle-front-view.png",
        back: "assets/bottle-back-view.png",
        nutrition: "assets/bottle-nutrition-label.png"
      },
      video: "assets/hero_liquid_emerge.mp4",
      color: "#6C5CE7",
      glow: "rgba(108, 92, 231, 0.4)",
      protein: "20g",
      calories: "138 kcal",
      sugar: "0g",
      fat: "1.5g",
      description: "Hand-harvested wild blueberry extract infused with ultra-filtered whey protein isolate. A rich, refreshing antioxidant powerhouse with zero added sugar.",
      ingredients: ["Milk Protein Isolate", "Whey Protein Concentrate", "Wild Blueberry Extract", "Calcium Caseinate", "Vitamin D3", "Vitamin B12", "Natural Stevia"],
      nutrition: [
        { label: "Energy / Calories", val: "138 kcal" },
        { label: "Protein", val: "20.0 g" },
        { label: "Total Fat", val: "1.5 g" },
        { label: "Saturated Fat", val: "1.0 g" },
        { label: "Carbohydrates", val: "19.0 g" },
        { label: "Total Sugars", val: "3.3 g" },
        { label: "Added Sugars", val: "0.0 g" },
        { label: "Cholesterol", val: "4 mg" },
        { label: "Sodium", val: "40 mg" }
      ]
    },
    chocolate: {
      name: "Dutch Chocolate",
      badge: "ATHLETE FAVORITE",
      price: 50,
      image: "assets/chocolate-front-view.png",
      views: {
        front: "assets/chocolate-front-view.png",
        back: "assets/chocolate-back-view.png",
        nutrition: "assets/chocolate-nutrition-label.png"
      },
      video: "assets/purple_spin.mp4",
      color: "#D4AF37",
      glow: "rgba(212, 175, 55, 0.4)",
      protein: "10g",
      calories: "133 kcal",
      sugar: "0g",
      fat: "2.7g",
      description: "Rich, velvety Dutch cocoa blended with pure dairy protein. Indulgent chocolate taste engineered for post-workout muscle recovery.",
      ingredients: ["Milk Protein Isolate", "Whey Concentrate", "Dutch Processed Cocoa", "Dark Cocoa Solids", "Calcium", "Vitamin D3", "Natural Stevia"],
      nutrition: [
        { label: "Energy / Calories", val: "133 kcal" },
        { label: "Protein", val: "10.0 g" },
        { label: "Total Fat", val: "2.7 g" },
        { label: "Saturated Fat", val: "1.6 g" },
        { label: "Carbohydrates", val: "25.0 g" },
        { label: "Total Sugars", val: "8.3 g" },
        { label: "Added Sugars", val: "0.0 g" },
        { label: "Cholesterol", val: "7 mg" },
        { label: "Sodium", val: "97 mg" }
      ]
    },
    vanilla: {
      name: "Velvet Vanilla",
      badge: "PURE CLASSIC",
      price: 50,
      image: "assets/vanilla-front-view.png",
      views: {
        front: "assets/vanilla-front-view.png",
        back: "assets/vanilla-back-view.png",
        nutrition: "assets/vanilla-nutrition-label.png"
      },
      video: "assets/hero_liquid_emerge.mp4",
      color: "#38BDF8",
      glow: "rgba(56, 189, 248, 0.4)",
      protein: "10g",
      calories: "133 kcal",
      sugar: "0g",
      fat: "2.7g",
      description: "Smooth Madagascar vanilla bean pod extract combined with clean dairy protein. Light, subtle sweetness perfect for daily nutrition.",
      ingredients: ["Milk Protein Isolate", "Whey Protein Concentrate", "Madagascar Vanilla Bean", "Calcium", "Vitamin D3", "Vitamin B12", "Natural Stevia"],
      nutrition: [
        { label: "Energy / Calories", val: "133 kcal" },
        { label: "Protein", val: "10.0 g" },
        { label: "Total Fat", val: "2.7 g" },
        { label: "Saturated Fat", val: "1.6 g" },
        { label: "Carbohydrates", val: "24.6 g" },
        { label: "Total Sugars", val: "9.0 g" },
        { label: "Added Sugars", val: "0.0 g" },
        { label: "Cholesterol", val: "8 mg" },
        { label: "Sodium", val: "100 mg" }
      ]
    },
    kesar: {
      name: "Kesar Mango",
      badge: "ROYAL EDITION",
      price: 50,
      image: "assets/kesar-front-view.png",
      views: {
        front: "assets/kesar-front-view.png",
        back: "assets/kesar-back-view.png",
        nutrition: "assets/kesar-nutrition-label.png"
      },
      video: "assets/kesar_splash.mp4",
      color: "#FF9F43",
      glow: "rgba(255, 159, 67, 0.4)",
      protein: "10g",
      calories: "133 kcal",
      sugar: "0g",
      fat: "2.7g",
      description: "Real Gir Kesar mango pulp blended with Kashmiri saffron threads and premium dairy protein. Traditional royal Indian flavor with high nutrition.",
      ingredients: ["Milk Protein Isolate", "Gir Kesar Mango Pulp", "Kashmiri Saffron", "Whey Concentrate", "Calcium", "Vitamin D3", "Natural Stevia"],
      nutrition: [
        { label: "Energy / Calories", val: "133 kcal" },
        { label: "Protein", val: "10.0 g" },
        { label: "Total Fat", val: "2.7 g" },
        { label: "Saturated Fat", val: "1.6 g" },
        { label: "Carbohydrates", val: "25.0 g" },
        { label: "Total Sugars", val: "9.4 g" },
        { label: "Added Sugars", val: "0.0 g" },
        { label: "Cholesterol", val: "8 mg" },
        { label: "Sodium", val: "72 mg" }
      ]
    }
  };

  // Global State
  let state = {
    activeFlavor: 'blueberry',
    flavourQty: 6,
    theme: localStorage.getItem('amul_theme') || 'dark',
    cart: [
      { flavorKey: 'blueberry', qty: 6, price: 50 }
    ],
    couponApplied: true, // AMULPRO20 default active
    isEmailVerified: true
  };

  // Theme Init
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', state.theme);
      localStorage.setItem('amul_theme', state.theme);
      document.getElementById('theme-icon').className = state.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
      showToast(`Switched to ${state.theme.toUpperCase()} mode`);
    });
  }

  // ── FLAVOUR CARD QUANTITY (+) / (-) CONTROLS ──
  const qtyMinusBtn = document.getElementById('flavour-qty-minus');
  const qtyPlusBtn = document.getElementById('flavour-qty-plus');
  const qtyValEl = document.getElementById('flavour-qty-val');
  const calcTotalEl = document.getElementById('flavour-calc-total');

  if (qtyMinusBtn && qtyPlusBtn) {
    qtyMinusBtn.addEventListener('click', () => {
      if (state.flavourQty > 1) {
        state.flavourQty--;
        updateFlavourQtyDisplay();
      }
    });

    qtyPlusBtn.addEventListener('click', () => {
      state.flavourQty++;
      updateFlavourQtyDisplay();
    });
  }

  function updateFlavourQtyDisplay() {
    if (qtyValEl) qtyValEl.innerText = state.flavourQty;
    const itemPrice = FLAVOURS[state.activeFlavor].price;
    if (calcTotalEl) calcTotalEl.innerText = `₹${itemPrice * state.flavourQty}`;
  }

  // ── FLAVOUR SWITCHER (SLIDE 3) ──
  const flavourTabs = document.querySelectorAll('.flavour-tab');
  flavourTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const key = tab.getAttribute('data-flavor');
      if (key && FLAVOURS[key]) switchFlavour(key);
    });
  });

  function switchFlavour(key) {
    state.activeFlavor = key;
    const data = FLAVOURS[key];

    // CSS Tokens
    document.documentElement.style.setProperty('--current-flavor-color', data.color);
    document.documentElement.style.setProperty('--current-flavor-glow', data.glow);

    // Active Tab
    flavourTabs.forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.flavour-tab[data-flavor="${key}"]`);
    if (activeTab) activeTab.classList.add('active');

    // DOM Updates
    const mainImg = document.getElementById('flavour-main-img');
    const glow = document.getElementById('flavour-glow');
    const viewTitle = document.getElementById('current-view-title');

    if (mainImg) {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = data.views.front;
        mainImg.style.opacity = '1';
      }, 200);
    }

    if (glow) glow.style.background = data.glow;
    if (viewTitle) viewTitle.innerText = 'Front Bottle View';

    // Update Scrollable Thumbnails for this specific flavour
    const thumbTrack = document.getElementById('flavour-thumb-track');
    if (thumbTrack && data.views) {
      thumbTrack.innerHTML = `
        <button class="track-thumb-btn active" data-src="${data.views.front}" data-title="Front Bottle View">
          <img src="${data.views.front}" alt="Front View">
          <span>Front Bottle</span>
        </button>
        <button class="track-thumb-btn" data-src="${data.views.back}" data-title="Back Label & QR Code">
          <img src="${data.views.back}" alt="Back View">
          <span>Back Label & QR</span>
        </button>
        <button class="track-thumb-btn" data-src="${data.views.nutrition}" data-title="Official Nutrition Label">
          <img src="${data.views.nutrition}" alt="Nutrition Label">
          <span>Nutrition Facts</span>
        </button>
      `;

      attachTrackListeners();
    }

    document.getElementById('flavour-name-text').innerText = data.name;
    document.getElementById('flavour-badge-text').innerText = data.badge;
    document.getElementById('flavour-price-text').innerHTML = `₹${data.price} <small>/ 180ml</small>`;
    document.getElementById('flavour-desc-text').innerText = data.description;
    document.getElementById('flavour-protein-text').innerText = data.protein;
    document.getElementById('flavour-calories-text').innerText = data.calories;
    document.getElementById('flavour-sugar-text').innerText = data.sugar;
    document.getElementById('flavour-fat-text').innerText = data.fat;

    const ingFlex = document.getElementById('flavour-ingredients-flex');
    if (ingFlex) {
      ingFlex.innerHTML = data.ingredients.map(ing => `<span class="ing-chip">${ing}</span>`).join('');
    }

    // Update CTA button attribute & total cost calculation
    const orderBtn = document.getElementById('flavour-order-btn');
    if (orderBtn) orderBtn.setAttribute('data-flavor', key);

    updateFlavourQtyDisplay();
    renderNutritionTable(data.nutrition);
  }

  function renderNutritionTable(items) {
    const grid = document.getElementById('nutrition-facts-grid');
    if (!grid) return;
    grid.innerHTML = items.map(i => `
      <div class="nut-row">
        <span>${i.label}</span>
        <span>${i.val}</span>
      </div>
    `).join('');
  }

  function attachTrackListeners() {
    const trackBtns = document.querySelectorAll('.track-thumb-btn');
    const mainDisplayImg = document.getElementById('flavour-main-img');
    const viewTitleEl = document.getElementById('current-view-title');

    trackBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        trackBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const src = btn.getAttribute('data-src');
        const title = btn.getAttribute('data-title') || 'Bottle View';

        if (mainDisplayImg && src) {
          mainDisplayImg.style.opacity = '0';
          setTimeout(() => {
            mainDisplayImg.src = src;
            mainDisplayImg.style.opacity = '1';
          }, 150);
        }

        if (viewTitleEl) viewTitleEl.innerText = title;
      });
    });
  }

  // Initialize Default Flavour
  switchFlavour('blueberry');

  // ── SLIDE 2 & 4 VIDEO CONTROLS ──
  const slide2Video = document.getElementById('bottles-3d-video');
  const slide2Btn = document.getElementById('slide2-play-toggle');
  if (slide2Btn && slide2Video) {
    slide2Btn.addEventListener('click', () => {
      if (slide2Video.paused) {
        slide2Video.play();
        document.getElementById('slide2-icon').className = 'fa-solid fa-pause';
        slide2Btn.innerHTML = '<i class="fa-solid fa-pause" id="slide2-icon"></i> Pause Video';
      } else {
        slide2Video.pause();
        slide2Btn.innerHTML = '<i class="fa-solid fa-play" id="slide2-icon"></i> Pause Video';
      }
    });
  }

  const cinemaPlayer = document.getElementById('cinema-player');
  const cinemaPlayBtn = document.getElementById('cinema-play-btn');
  const cinemaSpeedBtn = document.getElementById('cinema-speed-btn');

  if (cinemaPlayBtn && cinemaPlayer) {
    cinemaPlayBtn.addEventListener('click', () => {
      if (cinemaPlayer.paused) {
        cinemaPlayer.play();
        document.getElementById('cinema-btn-icon').className = 'fa-solid fa-pause';
        document.getElementById('cinema-btn-text').innerText = 'Pause Video';
      } else {
        cinemaPlayer.pause();
        document.getElementById('cinema-btn-icon').className = 'fa-solid fa-play';
        document.getElementById('cinema-btn-text').innerText = 'Play Video';
      }
    });
  }

  if (cinemaSpeedBtn && cinemaPlayer) {
    cinemaSpeedBtn.addEventListener('click', () => {
      if (cinemaPlayer.playbackRate === 1.0) {
        cinemaPlayer.playbackRate = 0.5;
        cinemaSpeedBtn.innerHTML = '<i class="fa-solid fa-gauge-high"></i> 0.5x Slow Motion';
      } else {
        cinemaPlayer.playbackRate = 1.0;
        cinemaSpeedBtn.innerHTML = '<i class="fa-solid fa-gauge-high"></i> 1.0x Normal';
      }
    });
  }

  // ── CART & CHECKOUT MODAL ──
  const cartBtnTrigger = document.getElementById('cart-btn-trigger');
  const cartDrawerOverlay = document.getElementById('cart-drawer-overlay');
  const closeCartDrawer = document.getElementById('close-cart-drawer');

  if (cartBtnTrigger && cartDrawerOverlay) {
    cartBtnTrigger.addEventListener('click', () => {
      renderCartDrawer();
      cartDrawerOverlay.classList.add('active');
    });
  }
  if (closeCartDrawer) {
    closeCartDrawer.addEventListener('click', () => cartDrawerOverlay.classList.remove('active'));
  }

  // Order Product Triggers
  document.querySelectorAll('.buy-now-action').forEach(btn => {
    btn.addEventListener('click', () => {
      const flavorKey = btn.getAttribute('data-flavor') || state.activeFlavor;
      const qtyToAdd = (btn.id === 'flavour-order-btn') ? state.flavourQty : 6;
      addToCart(flavorKey, qtyToAdd);
      openCheckoutModal();
    });
  });

  function addToCart(flavorKey, qty = 6) {
    const existing = state.cart.find(i => i.flavorKey === flavorKey);
    if (existing) existing.qty = qty;
    else state.cart.push({ flavorKey, qty, price: 50 });
    updateCartBadges();
  }

  function updateCartBadges() {
    const count = state.cart.reduce((acc, i) => acc + i.qty, 0);
    const cartCountEl = document.getElementById('cart-count');
    const drawerCountEl = document.getElementById('cart-drawer-count');
    if (cartCountEl) cartCountEl.innerText = count;
    if (drawerCountEl) drawerCountEl.innerText = count;
  }

  function renderCartDrawer() {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    if (state.cart.length === 0) {
      container.innerHTML = '<div style="text-align:center; padding:30px; color:var(--text-muted);">Cart is empty.</div>';
    } else {
      container.innerHTML = state.cart.map((item, idx) => {
        const data = FLAVOURS[item.flavorKey];
        return `
          <div class="cart-item-card">
            <img src="${data.image}" alt="${data.name}">
            <div style="flex:1;">
              <strong style="display:block; font-size:0.9rem;">${data.name}</strong>
              <span style="font-size:0.75rem; color:var(--text-secondary);">₹${item.price} x ${item.qty}</span>
              <div class="cart-qty-ctrls">
                <button class="qty-btn" onclick="changeCartQty(${idx}, -1)">-</button>
                <span>${item.qty}</span>
                <button class="qty-btn" onclick="changeCartQty(${idx}, 1)">+</button>
              </div>
            </div>
            <strong>₹${item.price * item.qty}</strong>
          </div>
        `;
      }).join('');
    }
    calculateTotals();
  }

  window.changeCartQty = (idx, delta) => {
    state.cart[idx].qty += delta;
    if (state.cart[idx].qty <= 0) state.cart.splice(idx, 1);
    updateCartBadges();
    renderCartDrawer();
    renderCheckoutSummary();
  };

  function calculateTotals() {
    const subtotal = state.cart.reduce((s, i) => s + (i.price * i.qty), 0);
    const discount = state.couponApplied ? Math.round(subtotal * 0.20) : 0;
    const grandTotal = subtotal - discount;

    if (document.getElementById('cart-subtotal')) document.getElementById('cart-subtotal').innerText = `₹${subtotal}`;
    if (document.getElementById('cart-discount')) document.getElementById('cart-discount').innerText = `-₹${discount}`;
    if (document.getElementById('cart-grand-total')) document.getElementById('cart-grand-total').innerText = `₹${grandTotal}`;

    if (document.getElementById('co-subtotal')) document.getElementById('co-subtotal').innerText = `₹${subtotal}`;
    if (document.getElementById('co-discount')) document.getElementById('co-discount').innerText = `-₹${discount}`;
    if (document.getElementById('co-grand-total')) document.getElementById('co-grand-total').innerText = `₹${grandTotal}`;
    if (document.getElementById('checkout-pay-total')) document.getElementById('checkout-pay-total').innerText = `₹${grandTotal}`;
  }

  // Coupon
  const applyCouponBtn = document.getElementById('apply-coupon-btn');
  if (applyCouponBtn) {
    applyCouponBtn.addEventListener('click', () => {
      const code = document.getElementById('coupon-input').value.trim().toUpperCase();
      const msg = document.getElementById('coupon-message');
      if (code === 'AMULPRO20') {
        state.couponApplied = true;
        if (msg) msg.innerHTML = '<span style="color:#10B981; font-weight:700;">Coupon AMULPRO20 Applied! 20% Off.</span>';
        calculateTotals();
        showToast('Coupon AMULPRO20 Applied!');
      } else {
        if (msg) msg.innerHTML = '<span style="color:#EF4444; font-weight:700;">Invalid Coupon Code</span>';
      }
    });
  }

  // ── CHECKOUT MODAL & CUSTOMER VERIFICATION & QR CODE ──
  const checkoutModal = document.getElementById('checkout-modal');
  const proceedCheckoutBtn = document.getElementById('proceed-to-checkout-btn');
  const closeCheckoutModal = document.getElementById('close-checkout-modal');

  if (proceedCheckoutBtn) {
    proceedCheckoutBtn.addEventListener('click', () => {
      if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('active');
      openCheckoutModal();
    });
  }

  function openCheckoutModal() {
    renderCheckoutSummary();
    if (checkoutModal) checkoutModal.classList.add('active');
  }

  if (closeCheckoutModal) {
    closeCheckoutModal.addEventListener('click', () => checkoutModal.classList.remove('active'));
  }

  // Render Checkout Summary Items with Increase / Decrease (+ / -) Controls
  function renderCheckoutSummary() {
    const list = document.getElementById('checkout-summary-items');
    if (!list) return;
    list.innerHTML = state.cart.map((item, idx) => {
      const data = FLAVOURS[item.flavorKey];
      return `
        <div class="co-item-row">
          <div class="co-item-info">
            <img src="${data.image}" alt="${data.name}">
            <div>
              <strong style="display:block; font-size:0.85rem;">${data.name}</strong>
              <span style="font-size:0.75rem; color:var(--text-muted);">₹${item.price} per bottle</span>
            </div>
          </div>
          <div class="co-qty-ctrls">
            <button class="co-qty-btn" onclick="changeCartQty(${idx}, -1)">-</button>
            <strong style="font-size:0.9rem; min-width:20px; text-align:center;">${item.qty}</strong>
            <button class="co-qty-btn" onclick="changeCartQty(${idx}, 1)">+</button>
          </div>
        </div>
      `;
    }).join('');
    calculateTotals();
  }

  // Email Verification Handler
  const verifyEmailTrigger = document.getElementById('verify-email-trigger');
  if (verifyEmailTrigger) {
    verifyEmailTrigger.addEventListener('click', () => {
      state.isEmailVerified = true;
      verifyEmailTrigger.classList.add('verified');
      document.getElementById('email-verify-lbl').innerText = 'Verified';
      document.getElementById('email-status-msg').innerHTML = '<span style="color:#10B981; font-weight:700;"><i class="fa-solid fa-circle-check"></i> Email Verified! Order updates & invoice sent automatically.</span>';
      showToast('Email Verified Successfully!');
    });
  }

  // GPS Location Pin Detector
  const autoDetectLocBtn = document.getElementById('auto-detect-location-btn');
  if (autoDetectLocBtn) {
    autoDetectLocBtn.addEventListener('click', () => {
      document.getElementById('cust-address').value = 'Flat 402, Building 12, Maharashtra Bank Lane, Shivajinagar, Pune, Maharashtra 411005';
      document.getElementById('detected-loc-tag').innerHTML = '<i class="fa-solid fa-location-dot" style="color:#10B981;"></i> GPS Pinpoint: Shivajinagar, Pune 411005 (Detected)';
      showToast('Delivery Location Pinpoint Detected!');
    });
  }

  // UPI ID Click to Copy
  const copyUpiBtn = document.getElementById('copy-upi-btn');
  if (copyUpiBtn) {
    copyUpiBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('lokhande.chandrashekhar@ybl');
      showToast('UPI ID Copied to Clipboard!');
    });
  }

  // Payment Options Radio Selector
  const payOptions = document.querySelectorAll('.pay-option');
  const qrDisplayBox = document.getElementById('qr-display-box');

  payOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      payOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');

      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        if (radio.value.includes('QR') || radio.value === 'PhonePe' || radio.value === 'Google Pay' || radio.value === 'Amazon Pay') {
          if (qrDisplayBox) qrDisplayBox.style.display = 'block';
        } else {
          if (qrDisplayBox) qrDisplayBox.style.display = 'none';
        }
      }
    });
  });

  // Confirm Order / Submit
  const confirmPayBtn = document.getElementById('confirm-pay-btn');
  if (confirmPayBtn) {
    confirmPayBtn.addEventListener('click', () => {
      const name = document.getElementById('cust-name').value.trim() || 'Chandrashekhar Lokhande';
      const phone = document.getElementById('cust-phone').value.trim() || '+91 98765 43210';
      const email = document.getElementById('cust-email').value.trim() || 'lokhande.chandrashekhar@example.com';
      const address = document.getElementById('cust-address').value.trim() || 'Flat 402, Building 12, Maharashtra Bank Lane, Pune, 411001';

      const selectedPay = document.querySelector('input[name="payment"]:checked')?.value || 'Bank of Maharashtra PhonePe QR';
      const orderId = '#AMUL-' + Math.floor(10000 + Math.random() * 90000);

      if (checkoutModal) checkoutModal.classList.remove('active');
      state.cart = [];
      updateCartBadges();

      const trackingModal = document.getElementById('tracking-modal');
      const trackOrderIdEl = document.getElementById('track-order-id');
      
      if (trackOrderIdEl) trackOrderIdEl.innerText = orderId;
      if (document.getElementById('track-cust-name')) document.getElementById('track-cust-name').innerText = name;
      if (document.getElementById('track-cust-phone')) document.getElementById('track-cust-phone').innerText = phone;
      if (document.getElementById('track-cust-email')) document.getElementById('track-cust-email').innerText = email;
      if (document.getElementById('track-cust-address')) document.getElementById('track-cust-address').innerText = address;

      if (trackingModal) trackingModal.classList.add('active');

      showToast(`Order Placed via ${selectedPay}! Order ID: ${orderId}`);
    });
  }

  // Tracking Modal Close
  const closeTrackingModal = document.getElementById('close-tracking-modal');
  if (closeTrackingModal) {
    closeTrackingModal.addEventListener('click', () => {
      document.getElementById('tracking-modal').classList.remove('active');
    });
  }

  // Toast Utility
  function showToast(msg) {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

});
