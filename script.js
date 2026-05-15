/* ═══════════════════════════════════════
   KIBRAN — JAVASCRIPT
   Ethiopian Handcrafted Furniture
═══════════════════════════════════════ */

'use strict';

/* ─── LOADER ─── */
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
    // Reveal hero — class goes on parent so all child selectors fire
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) heroContent.classList.add('hero-revealed');
    // Start particles
    initParticles();
  }, 2800);
});

/* ─── CUSTOM CURSOR ─── */
(function initCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor cursor-dot';
  ring.className = 'cursor cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  (function animRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animRing);
  })();

  document.querySelectorAll('a, button, .prod-card, .pattern-card, .tilt-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
})();

/* ─── PARTICLES CANVAS ─── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const GOLD = [201, 168, 76];
  const particles = [];

  class Particle {
    constructor() { this.reset(true); }
    reset(init) {
      this.x    = Math.random() * canvas.width;
      this.y    = init ? Math.random() * canvas.height : canvas.height + 10;
      this.vy   = -(Math.random() * 0.4 + 0.1);
      this.vx   = (Math.random() - 0.5) * 0.2;
      this.size = Math.random() * 2 + 0.5;
      this.life = Math.random();
      this.maxLife = Math.random() * 0.4 + 0.3;
      this.type = Math.random() > 0.6 ? 'diamond' : 'dot';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life += 0.003;
      if (this.life > this.maxLife || this.y < -10) this.reset(false);
    }
    draw() {
      const progress = this.life / this.maxLife;
      const alpha = progress < 0.2 ? progress / 0.2
                  : progress > 0.8 ? (1 - progress) / 0.2
                  : 1;
      ctx.globalAlpha = alpha * 0.5;
      ctx.fillStyle = `rgb(${GOLD[0]},${GOLD[1]},${GOLD[2]})`;
      if (this.type === 'diamond') {
        const s = this.size * 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y - s);
        ctx.lineTo(this.x + s, this.y);
        ctx.lineTo(this.x, this.y + s);
        ctx.lineTo(this.x - s, this.y);
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    ctx.globalAlpha = 1;
    requestAnimationFrame(loop);
  }
  loop();
}

/* ─── NAVBAR ─── */
(function initNavbar() {
  const nav      = document.getElementById('navbar');
  const progress = document.getElementById('navProgress');
  const toggle   = document.getElementById('navToggle');
  const links    = document.getElementById('navLinks');

  if (!nav) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    // Scrolled class
    nav.classList.toggle('scrolled', scrollY > 60);

    // Progress bar
    if (progress) {
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      progress.style.width = (scrollY / maxScroll * 100) + '%';
    }
  });

  // Mobile toggle
  if (toggle && links) {
    const closeMenu = () => {
      toggle.classList.remove('active');
      links.classList.remove('mobile-open');
      document.body.classList.remove('menu-open');
    };

    toggle.addEventListener('click', () => {
      const open = !links.classList.contains('mobile-open');
      toggle.classList.toggle('active', open);
      links.classList.toggle('mobile-open', open);
      document.body.classList.toggle('menu-open', open);
    });

    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    document.querySelector('.nav-cta')?.addEventListener('click', closeMenu);
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeMenu();
    });
  }
})();

/* ─── SCROLL REVEAL ─── */
(function initScrollReveal() {
  const els = document.querySelectorAll('[data-scroll-reveal]');
  if (!els.length) return;

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => io.observe(el));
})();

/* ─── COUNTER ANIMATION ─── */
(function initCounters() {
  function animCount(el, target, duration) {
    const start = performance.now();
    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(ease * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        animCount(el, target, 1800);
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.hero-stats, .about-stats').forEach(el => io.observe(el));
})();

/* ─── 3D TILT CARDS ─── */
(function initTilt() {
  document.querySelectorAll('[data-tilt]').forEach(card => {
    const glow = card.querySelector('.prod-3d-glow');

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      card.style.transform =
        `perspective(800px) rotateY(${dx * 12}deg) rotateX(${-dy * 10}deg) scale3d(1.02,1.02,1.02)`;

      if (glow) {
        const mx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const my = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        glow.style.setProperty('--mx', mx + '%');
        glow.style.setProperty('--my', my + '%');
        glow.style.background = `radial-gradient(circle at ${mx}% ${my}%, rgba(201,168,76,0.18) 0%, transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      if (glow) glow.style.background = '';
    });
  });
})();

/* ─── HERO CARD 3D PARALLAX ─── */
(function initHeroParallax() {
  const card = document.getElementById('heroCard');
  if (!card || window.matchMedia('(pointer: coarse)').matches) return;

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    card.style.transform =
      `perspective(1200px) rotateY(${dx * 10}deg) rotateX(${-dy * 8}deg)`;
  });

  document.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
})();

/* ─── TESTIMONIALS SLIDER ─── */
(function initTestimonials() {
  const track  = document.getElementById('testimonialsTrack');
  const dotsEl = document.getElementById('tnavDots');
  const prev   = document.getElementById('tnavPrev');
  const next   = document.getElementById('tnavNext');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;
  let perView = window.innerWidth < 768 ? 1 : 2;
  let current = 0;
  let autoplay;

  let dots = [];
  let maxDot = Math.ceil(total / perView);

  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    dots = [];
    maxDot = Math.ceil(total / perView);
    for (let i = 0; i < maxDot; i++) {
      const d = document.createElement('div');
      d.className = 'tnav-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsEl.appendChild(d);
      dots.push(d);
    }
  }

  function goTo(idx) {
    current = ((idx % maxDot) + maxDot) % maxDot;
    const gap = parseFloat(getComputedStyle(track).gap) || 28;
    const cardWidth = cards[0].getBoundingClientRect().width + gap;
    track.style.transform = `translateX(-${current * perView * cardWidth}px)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  function onResize() {
    const nextPerView = window.innerWidth < 768 ? 1 : 2;
    if (nextPerView === perView) {
      goTo(current);
      return;
    }
    perView = nextPerView;
    current = 0;
    buildDots();
    goTo(0);
  }

  buildDots();

  prev && prev.addEventListener('click', () => { clearInterval(autoplay); goTo(current - 1); startAuto(); });
  next && next.addEventListener('click', () => { clearInterval(autoplay); goTo(current + 1); startAuto(); });

  function startAuto() {
    clearInterval(autoplay);
    autoplay = setInterval(() => goTo(current + 1), 5000);
  }

  window.addEventListener('resize', onResize);
  startAuto();
})();

/* ─── ENQUIRY MODAL ─── */
(function initModal() {
  const overlay  = document.getElementById('enquiryModal');
  const closeBtn = document.getElementById('modalClose');
  const pieceName = document.getElementById('modalPieceName');
  if (!overlay) return;

  // Wire up product Enquire buttons
  document.querySelectorAll('.prod-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.prod-card');
      const name = card && card.querySelector('.prod-name');
      if (pieceName) pieceName.textContent = name ? name.textContent : '';
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  function close() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  closeBtn && closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ─── FORM HANDLERS ─── */
function handleFormSubmit(e) {
  e.preventDefault();
  const form    = document.getElementById('commissionForm');
  const success = document.getElementById('formSuccess');
  if (!form || !success) return;

  // Fake submit delay
  const btn = form.querySelector('.form-submit');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  setTimeout(() => {
    form.style.display = 'none';
    success.style.display = 'flex';
    // Animate success SVG
    const circle = success.querySelector('.success-circle');
    const check  = success.querySelector('.success-check');
    if (circle) circle.style.animation = 'draw-ring 1s ease forwards';
    if (check)  check.style.animation  = 'draw-ring 0.6s ease forwards 0.8s';
  }, 1200);
}

function handleEnquirySubmit(e) {
  e.preventDefault();
  const modal = document.getElementById('enquiryModal');
  const body  = modal && modal.querySelector('.modal-body');
  if (body) {
    body.innerHTML = `
      <div style="text-align:center;padding:40px 20px">
        <div style="font-size:48px;color:var(--gold);margin-bottom:16px">✦</div>
        <h3 style="font-family:var(--font-serif);font-size:20px;color:var(--gold);margin-bottom:10px">Enquiry Sent</h3>
        <p style="font-size:13px;line-height:1.7;color:var(--text-light)">We will contact you within 48 hours.</p>
      </div>`;
  }
  setTimeout(() => {
    if (modal) modal.classList.remove('open');
    document.body.style.overflow = '';
  }, 2500);
}

/* ─── SMOOTH ANCHOR SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─── PATTERN CARD DRAW ANIMATION ─── */
(function initPatternDraw() {
  const paths = document.querySelectorAll('.pattern-card svg path, .pattern-card svg circle');
  paths.forEach(p => {
    const len = p.getTotalLength ? p.getTotalLength() : 0;
    if (!len) return;
    p.style.strokeDasharray  = len;
    p.style.strokeDashoffset = len;
    p.style.transition = 'stroke-dashoffset 1.5s ease';
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('path, circle').forEach(p => {
        if (p.style.strokeDasharray) p.style.strokeDashoffset = '0';
      });
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.pattern-card').forEach(c => io.observe(c));
})();

/* ─── DIVIDER STRIP PARALLAX ─── */
(function initDividerParallax() {
  const strips = document.querySelectorAll('.divider-strip svg');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    strips.forEach((s, i) => {
      const speed = i % 2 === 0 ? 0.3 : -0.3;
      s.style.transform = `translateX(${scrollY * speed * 0.05}%)`;
    });
  }, { passive: true });
})();

/* ─── ACTIVE NAV LINK ─── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(l => {
        l.style.color = l.getAttribute('href') === '#' + entry.target.id
          ? 'var(--gold)' : '';
      });
    });
  }, { threshold: 0.5 });

  sections.forEach(s => io.observe(s));
})();
