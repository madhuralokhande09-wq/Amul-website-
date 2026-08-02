/**
 * Amul Blueberry Protein Shake - Interactive 3D Canvas Scroll Engine
 * 93 Active Motion Bottle Video Frames
 */

document.addEventListener('DOMContentLoaded', async () => {

  /* ── CAMPAIGN SLIDE-IN (triggers when section enters viewport) ── */
  const campaignSection = document.getElementById('ad-section');
  if (campaignSection) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          campaignSection.classList.add('in-view');
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    observer.observe(campaignSection);
  }

  /* ── 1. LOAD FRAME LIST ── */
  let uniqueFrameNames = [];
  try {
    const res = await fetch('./unique-frames.json');
    if (res.ok) uniqueFrameNames = await res.json();
  } catch (e) {
    console.warn('unique-frames.json fetch failed, using fallback range');
  }

  if (!uniqueFrameNames || uniqueFrameNames.length === 0) {
    for (let i = 130; i <= 245; i++) {
      uniqueFrameNames.push(`ezgif-frame-${String(i).padStart(3, '0')}.jpg`);
    }
  }

  const TOTAL_FRAMES = uniqueFrameNames.length;
  const frames = new Array(TOTAL_FRAMES);
  let loadedCount = 0;
  let isLoaded = false;

  /* ── 2. ANIMATION STATE ── */
  let currentFrame = 1;
  let targetFrame  = 1;
  let isPlaying    = false;
  let fitMode      = 'contain';
  let isSoundEnabled = false;
  let audioCtx     = null;

  /* ── 3. DOM REFS (all guarded — never crash on null) ── */
  const preloader    = document.getElementById('preloader');
  const loaderBar    = document.getElementById('loader-bar');
  const loaderLiquid = document.getElementById('loader-liquid');
  const loaderText   = document.getElementById('loader-text');
  const loaderPercent= document.getElementById('loader-percent');
  const enterBtn     = document.getElementById('enter-btn');

  const navbar        = document.getElementById('navbar');
  const scrollSection = document.getElementById('hero-scroll');
  const canvas        = document.getElementById('animation-canvas');
  const ctx           = canvas ? canvas.getContext('2d') : null;

  const hotspotsLayer     = document.getElementById('hotspots-layer');
  const hotspotsToggleBtn = document.getElementById('hotspots-toggle-btn');
  const scrollHint        = document.getElementById('scroll-hint');

  const scrubber      = document.getElementById('frame-scrubber');
  const playPauseBtn  = document.getElementById('play-pause-btn');
  const playIcon      = document.getElementById('play-icon');
  const fitModeBtn    = document.getElementById('fit-mode-btn');
  const soundToggleBtn= document.getElementById('sound-toggle');
  const soundIcon     = document.getElementById('sound-icon');

  /* scrubberFill is NOT in the HTML — safe guard */
  const scrubberFill = null;

  if (scrubber) scrubber.max = TOTAL_FRAMES;

  /* ── 4. PRELOAD IMAGES ── */
  function preloadImages() {
    uniqueFrameNames.forEach((fileName, index) => {
      const img = new Image();
      img.src = `./${fileName}`;

      img.onload = () => {
        loadedCount++;
        const pct = Math.floor((loadedCount / TOTAL_FRAMES) * 100);

        if (loaderBar)     loaderBar.style.width     = `${pct}%`;
        if (loaderLiquid)  loaderLiquid.style.height  = `${pct}%`;
        if (loaderPercent) loaderPercent.textContent  = `${pct}%`;
        if (loaderText)    loaderText.textContent     = `Loading frames… ${loadedCount}/${TOTAL_FRAMES}`;

        if (loadedCount === 1) { resizeCanvas(); renderFrame(1); }
        if (loadedCount === TOTAL_FRAMES) onAllImagesLoaded();
      };

      img.onerror = () => {
        loadedCount++;
        if (loadedCount === TOTAL_FRAMES) onAllImagesLoaded();
      };

      frames[index] = img;
    });
  }

  /* ── 5. ALL LOADED ── */
  function onAllImagesLoaded() {
    isLoaded = true;
    if (loaderText)    loaderText.textContent    = `Ready! ${TOTAL_FRAMES} frames loaded.`;
    if (loaderPercent) loaderPercent.textContent = '100%';
    if (enterBtn)      enterBtn.classList.remove('hidden');

    setTimeout(() => {
      if (preloader && !preloader.classList.contains('fade-out')) {
        startExperience();
      }
    }, 800);
  }

  /* ── 6. START — auto-play immediately ── */
  function startExperience() {
    if (preloader) preloader.classList.add('fade-out');
    playSoftChime();
    resizeCanvas();
    renderFrame(1);
    isPlaying = true;                          // ← auto-play on load
    if (playIcon)     playIcon.className     = 'fa-solid fa-pause';
    if (playPauseBtn) playPauseBtn.classList.add('active');
    requestAnimationFrame(animationLoop);
  }

  if (enterBtn) enterBtn.addEventListener('click', startExperience);


  /* ── 7. CANVAS RESIZE ── */
  function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = window.innerWidth  * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    renderFrame(Math.round(currentFrame));
  }
  window.addEventListener('resize', resizeCanvas);

  /* ── 8. RENDER ONE FRAME ── */
  function renderFrame(index) {
    if (!canvas || !ctx) return;
    const i   = Math.max(0, Math.min(TOTAL_FRAMES - 1, index - 1));
    const img = frames[i];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = window.innerWidth;
    const ch = window.innerHeight;
    ctx.clearRect(0, 0, cw, ch);

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    let rw, rh;

    if (fitMode === 'cover') {
      const s = Math.max(cw / iw, ch / ih);
      rw = iw * s; rh = ih * s;
    } else {
      const s = Math.min((cw * 0.95) / iw, (ch * 0.95) / ih);
      rw = iw * s; rh = ih * s;
    }

    ctx.drawImage(img, (cw - rw) / 2, (ch - rh) / 2, rw, rh);
  }

  /* ── 9. SCROLL → TARGET FRAME ── */
  function updateTargetFromScroll() {
    if (!scrollSection) return;
    const rect          = scrollSection.getBoundingClientRect();
    const sectionHeight = scrollSection.offsetHeight - window.innerHeight;
    const scrolled      = -rect.top;
    const progress      = Math.max(0, Math.min(1, scrolled / sectionHeight));

    targetFrame = 1 + progress * (TOTAL_FRAMES - 1);

    if (scrollHint) scrollHint.style.opacity = progress > 0.05 ? '0' : '1';
    if (navbar)     navbar.classList.toggle('scrolled', window.scrollY > 50);
  }

  window.addEventListener('scroll', () => {
    if (!isPlaying) updateTargetFromScroll();
  });

  /* ── 10. ANIMATION LOOP ── */
  function animationLoop() {
    const diff = targetFrame - currentFrame;
    if (Math.abs(diff) > 0.01) {
      currentFrame += diff * 0.18;
    } else {
      currentFrame = targetFrame;
    }
    renderFrame(Math.round(currentFrame));
    updateUIControls();

    if (isPlaying) {
      targetFrame += 0.6;
      if (targetFrame >= TOTAL_FRAMES) { targetFrame = 1; currentFrame = 1; }
    }

    requestAnimationFrame(animationLoop);
  }

  /* ── 11. UI CONTROLS ── */
  function updateUIControls() {
    const f = Math.round(currentFrame);
    if (scrubber) scrubber.value = f;
    /* scrubberFill removed from DOM — skip safely */

    const showHotspots = f >= 15 && hotspotsToggleBtn && hotspotsToggleBtn.classList.contains('active');
    if (hotspotsLayer) hotspotsLayer.classList.toggle('visible', showHotspots);
  }

  if (scrubber) {
    scrubber.addEventListener('input', (e) => {
      if (isPlaying) stopAutoPlay();
      targetFrame = parseFloat(e.target.value);
    });
  }

  function toggleAutoPlay() {
    isPlaying ? stopAutoPlay() : startAutoPlay();
  }
  function startAutoPlay() {
    isPlaying = true;
    if (playIcon)     playIcon.className = 'fa-solid fa-pause';
    if (playPauseBtn) playPauseBtn.classList.add('active');
  }
  function stopAutoPlay() {
    isPlaying = false;
    if (playIcon)     playIcon.className = 'fa-solid fa-play';
    if (playPauseBtn) playPauseBtn.classList.remove('active');
  }

  if (playPauseBtn) playPauseBtn.addEventListener('click', toggleAutoPlay);

  if (fitModeBtn) {
    fitModeBtn.addEventListener('click', () => {
      fitMode = fitMode === 'contain' ? 'cover' : 'contain';
      fitModeBtn.classList.toggle('active', fitMode === 'cover');
      renderFrame(Math.round(currentFrame));
    });
  }

  if (hotspotsToggleBtn) {
    hotspotsToggleBtn.addEventListener('click', () => {
      hotspotsToggleBtn.classList.toggle('active');
      updateUIControls();
    });
  }

  /* ── 12. SOUND ── */
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundEnabled = !isSoundEnabled;
      if (soundIcon) soundIcon.className = isSoundEnabled ? 'fa-solid fa-volume-high' : 'fa-solid fa-volume-xmark';
      soundToggleBtn.classList.toggle('active', isSoundEnabled);
    });
  }

  function playSoftChime() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.setValueAtTime(523, audioCtx.currentTime);
      o.frequency.linearRampToValueAtTime(784, audioCtx.currentTime + 0.15);
      g.gain.setValueAtTime(0.08, audioCtx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      o.start(); o.stop(audioCtx.currentTime + 0.5);
    } catch(e) {}
  }

  /* ── 13. MODAL / ORDER ── */
  const orderModal     = document.getElementById('order-modal');
  const closeModal     = document.getElementById('close-modal');
  const qtyVal         = document.getElementById('qty-val');
  const qtyMinus       = document.getElementById('qty-minus');
  const qtyPlus        = document.getElementById('qty-plus');
  const priceSubtotal  = document.getElementById('price-subtotal');
  const priceTotal     = document.getElementById('price-total');
  const checkoutBtn    = document.getElementById('complete-checkout-btn');
  const toast          = document.getElementById('toast');
  const toastMsg       = document.getElementById('toast-msg');
  const UNIT_PRICE     = 50;
  let currentQty       = 6;

  function updateOrderPrice() {
    if (qtyVal)        qtyVal.textContent          = currentQty;
    if (priceSubtotal) priceSubtotal.textContent   = `₹${currentQty * UNIT_PRICE}`;
    if (priceTotal)    priceTotal.textContent      = `₹${currentQty * UNIT_PRICE}`;
  }

  document.querySelectorAll('.buy-now-trigger').forEach(btn => {
    btn.addEventListener('click', () => {
      if (orderModal) orderModal.classList.add('active');
      updateOrderPrice();
    });
  });

  if (closeModal)  closeModal.addEventListener('click',  () => orderModal && orderModal.classList.remove('active'));
  if (orderModal)  orderModal.addEventListener('click',  (e) => { if (e.target === orderModal) orderModal.classList.remove('active'); });
  if (qtyMinus)    qtyMinus.addEventListener('click',   () => { if (currentQty > 1) { currentQty--; updateOrderPrice(); } });
  if (qtyPlus)     qtyPlus.addEventListener('click',    () => { currentQty++; updateOrderPrice(); });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (orderModal) orderModal.classList.remove('active');
      showToast(`Order placed — ${currentQty} bottles (₹${currentQty * UNIT_PRICE})!`);
      playSoftChime();
    });
  }

  function showToast(msg) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg;
    toast.classList.add('active');
    setTimeout(() => toast.classList.remove('active'), 3500);
  }

  /* ── 14. FLAVOR TABS ── */
  const flavorData = {
    blueberry: { badge: 'TOP SELLER',  title: 'Blueberry Blast',   desc: 'Real blueberry extract with 20g premium whey — sweet, tangy, and packed with antioxidants.', glow: '#8b5cf6' },
    chocolate: { badge: 'FAN FAVOURITE',title: 'Dark Chocolate',   desc: 'Rich cocoa meets 20g clean protein — indulge without the guilt, post-workout bliss.', glow: '#78350f' },
    vanilla:   { badge: 'CLASSIC',      title: 'French Vanilla',    desc: 'Smooth, creamy vanilla with 20g whey protein — the everyday essential for every athlete.', glow: '#a16207' },
    mango:     { badge: 'SEASONAL',     title: 'Alphonso Mango',    desc: 'Tropical mango burst with 20g whey protein — made for India\'s summers.', glow: '#c2410c' },
  };

  document.querySelectorAll('.flavor-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.flavor-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const key  = btn.dataset.flavor;
      const data = flavorData[key] || flavorData.blueberry;
      const badge = document.getElementById('flavor-badge');
      const title = document.getElementById('flavor-title');
      const desc  = document.getElementById('flavor-desc');
      const glow  = document.getElementById('flavor-glow');
      if (badge) badge.textContent = data.badge;
      if (title) title.textContent = data.title;
      if (desc)  desc.textContent  = data.desc;
      if (glow)  glow.style.background = `radial-gradient(circle, ${data.glow} 0%, transparent 70%)`;
    });
  });

  /* ── 15. KICK OFF PRELOAD ── */
  preloadImages();

  /* ── 16. BOTTLE VIDEO CANVAS (auto-play loop in ad section) ── */
  const bvCanvas       = document.getElementById('bottle-video-canvas');
  const bvCtx          = bvCanvas ? bvCanvas.getContext('2d') : null;
  const bvProgressFill = document.getElementById('bv-progress-fill');
  const bvPlayBtn      = document.getElementById('bv-play-btn');
  const bvPlayIcon     = document.getElementById('bv-play-icon');
  const bvReplayBtn    = document.getElementById('bv-replay-btn');

  let bvCurrentFrame = 0;
  let bvIsPlaying    = true;
  let bvLastTime     = 0;
  const BV_FPS      = 28;
  const BV_INTERVAL = 1000 / BV_FPS;
  let bvStarted     = false;

  function resizeBvCanvas() {
    if (!bvCanvas || !bvCtx) return;
    const parent = bvCanvas.parentElement;
    const dpr    = window.devicePixelRatio || 1;
    bvCanvas.width  = parent.clientWidth  * dpr;
    bvCanvas.height = parent.clientHeight * dpr;
    bvCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function renderBvFrame(index) {
    if (!bvCanvas || !bvCtx) return;
    const img = frames[Math.max(0, Math.min(TOTAL_FRAMES - 1, index))];
    if (!img || !img.complete || !img.naturalWidth) return;
    const w = bvCanvas.parentElement.clientWidth;
    const h = bvCanvas.parentElement.clientHeight;
    bvCtx.clearRect(0, 0, w, h);
    const s  = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const rw = img.naturalWidth  * s;
    const rh = img.naturalHeight * s;
    bvCtx.drawImage(img, (w - rw) / 2, (h - rh) / 2, rw, rh);
  }

  function bvLoop(ts) {
    if (bvIsPlaying && ts - bvLastTime >= BV_INTERVAL) {
      bvLastTime    = ts;
      bvCurrentFrame = (bvCurrentFrame + 1) % TOTAL_FRAMES;
      renderBvFrame(bvCurrentFrame);
      if (bvProgressFill) bvProgressFill.style.width = `${(bvCurrentFrame / (TOTAL_FRAMES - 1)) * 100}%`;
    }
    requestAnimationFrame(bvLoop);
  }

  function startBottleVideo() {
    if (bvStarted) return;
    bvStarted = true;
    resizeBvCanvas();
    renderBvFrame(0);
    requestAnimationFrame(bvLoop);
  }

  // Wait for frames to be loaded then start bottle video
  function tryStartBv() {
    if (frames[0] && frames[0].complete && frames[0].naturalWidth) {
      startBottleVideo();
    } else {
      setTimeout(tryStartBv, 500);
    }
  }
  tryStartBv();

  window.addEventListener('resize', resizeBvCanvas);

  if (bvPlayBtn) {
    bvPlayBtn.addEventListener('click', () => {
      bvIsPlaying = !bvIsPlaying;
      if (bvPlayIcon) bvPlayIcon.className = bvIsPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    });
  }
  if (bvReplayBtn) {
    bvReplayBtn.addEventListener('click', () => {
      bvCurrentFrame = 0;
      bvIsPlaying    = true;
      if (bvPlayIcon) bvPlayIcon.className = 'fa-solid fa-pause';
    });
  }
});
