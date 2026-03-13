/* =============================================
   ROWAN SEXTON — PORTFOLIO
   main.js
   ============================================= */

/* --- PASSWORD GATE --- */
(function () {
  const gate = document.getElementById('pwGate');
  if (!gate) return;

  const input = document.getElementById('pwInput');
  const btn   = document.getElementById('pwBtn');
  const error = document.getElementById('pwError');
  const HASH  = '9ba1e2e9258f8ee3eaa0538231a50af2f8cef5b3cba2ffbe9c5dddac8d6196ed';

  async function sha256(str) {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  if (sessionStorage.getItem('cs_unlocked') === '1') {
    gate.remove();
    return;
  }

  async function attempt() {
    const hash = await sha256(input.value.trim());
    if (hash === HASH) {
      sessionStorage.setItem('cs_unlocked', '1');
      gate.style.opacity = '0';
      gate.style.transition = 'opacity 0.3s ease';
      setTimeout(() => gate.remove(), 300);
    } else {
      input.classList.add('error');
      error.classList.add('visible');
      input.value = '';
      input.focus();
    }
  }

  btn.addEventListener('click', attempt);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') attempt();
    input.classList.remove('error');
    error.classList.remove('visible');
  });
})();

/* --- TESTIMONIAL TEXT FIT (binary search) --- */
(function () {
  const cards = Array.from(document.querySelectorAll('.testi-card'));

  function fitCard(card) {
    const body = card.querySelector('.testi-body');
    if (!body) return;

    // Reset so measurements are clean
    body.style.fontSize = '';

    // Binary search: largest font-size (px) where content height ≤ container height
    let lo = 6, hi = 60;
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      body.style.fontSize = mid + 'px';
      if (body.scrollHeight <= body.clientHeight) {
        lo = mid;
      } else {
        hi = mid;
      }
    }
    // Apply found size (floor for safety)
    body.style.fontSize = Math.floor(lo) + 'px';
  }

  function fitAll() {
    cards.forEach(fitCard);
  }

  // Fit immediately, after fonts, and on resize
  fitAll();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitAll);
  }
  window.addEventListener('resize', fitAll);
})();

/* --- REMOVE UNICORN STUDIO BADGE --- */
(function () {
  function removeBadge() {
    document.querySelectorAll('a[href*="unicorn.studio"], a[href*="unicornstudio"]').forEach(el => {
      // Walk up to remove the outermost single-child wrapper too
      let node = el;
      while (node.parentElement && node.parentElement !== document.body && node.parentElement.children.length === 1) {
        node = node.parentElement;
      }
      node.remove();
    });
  }
  removeBadge();
  new MutationObserver(removeBadge).observe(document.body, { childList: true, subtree: true });
})();

/* --- NAV SCROLL SHADOW + PROGRESS BAR --- */
const nav = document.getElementById('nav');
const navProgress = document.getElementById('navProgress');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 20);

  if (navProgress) {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    navProgress.style.width = pct + '%';
  }
}, { passive: true });

/* --- ACTIVE NAV LINK ON SCROLL --- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));

/* --- MOBILE BURGER --- */
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', open);
  burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
  });
});

/* --- MOBILE DROPDOWN --- */
const mobileDropdownToggle = document.getElementById('mobileDropdownToggle');
const mobileDropdownList = document.getElementById('mobileDropdownList');

mobileDropdownToggle.addEventListener('click', () => {
  const open = mobileDropdownList.classList.toggle('open');
  mobileDropdownToggle.querySelector('.dropdown-chevron').style.transform =
    open ? 'rotate(180deg)' : '';
});

/* --- SCROLL REVEAL --- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* --- CURSOR GLOW --- */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let glowX = 0, glowY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateGlow() {
  glowX += (mouseX - glowX) * 0.07;
  glowY += (mouseY - glowY) * 0.07;
  cursorGlow.style.left = glowX + 'px';
  cursorGlow.style.top  = glowY + 'px';
  requestAnimationFrame(animateGlow);
}
animateGlow();

/* --- SKILL CARDS — TAG HOVER COLOUR --- */
document.querySelectorAll('.skill-category').forEach(card => {
  const icon = card.querySelector('.skill-icon');
  if (!icon) return;
  const color = icon.style.color;
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = `0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px ${color}33`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

/* --- SHARED STICKY CONSTANTS --- */
const NAV_H       = 72;
const CS_HEADER_H = 120;       // matches CSS: --cs-header-h
const CS_BASE     = NAV_H + CS_HEADER_H + 24;  // matches CSS: var(--nav-h) + var(--cs-header-h) + 24px
const CS_STEP     = 18;        // matches CSS: var(--i) * 18px
const TOLERANCE   = 3;         // px fudge for subpixel rendering

/* --- TESTIMONIAL HORIZONTAL SCROLL (scroll-driven, no snap, no spring) ---
   Vertical scroll through the tall #testimonials section maps linearly to
   horizontal card position. Past cards peek 24 px left; upcoming cards sit
   one full card-width to the right (mostly off-screen), sliding in smoothly. */
(function () {
  const section = document.getElementById('testimonials');
  const cards   = Array.from(document.querySelectorAll('.testi-card'));
  if (!section || !cards.length) return;

  const LAST = cards.length - 1;

  function applyCards(pos) {
    const cardW = cards[0].offsetWidth;

    cards.forEach((card, i) => {
      const offset = i - pos;
      let x, scale, brightness, zIndex;

      if (offset < 0) {
        // Past: stays slightly LEFT — peek = 24 px per level (no scale so peek = offset)
        const t   = Math.min(3, -offset);
        x          = -t * 24;
        scale      = 1.0;
        brightness = Math.max(0.50, 1 - t * 0.25);
        zIndex     = Math.max(1, 30 - Math.round(t * 8));
      } else {
        // Active (offset=0) or upcoming — one full card-width to the right per step
        // Higher offset = higher z-index so incoming cards always slide ON TOP of active
        x          = offset * cardW;
        scale      = Math.max(0.86, 1 - offset * 0.05);
        brightness = Math.max(0.38, 1 - offset * 0.28);
        zIndex     = 30 + Math.round(offset * 8);
      }

      card.style.transform  = `translate3d(calc(-50% + ${x}px), -50%, 0) scale(${scale})`;
      card.style.filter     = `brightness(${brightness})`;
      card.style.zIndex     = String(zIndex);
    });
  }

  function onScroll() {
    const rect       = section.getBoundingClientRect();
    const scrollable = section.offsetHeight - window.innerHeight;
    if (scrollable <= 0) { applyCards(0); return; }

    // Direct linear map — no easing, no snap, moves exactly with finger/wheel
    const progress = Math.max(0, Math.min(1, -rect.top / scrollable));
    applyCards(progress * LAST);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll(); // position cards on load
})();

/* --- STICKY CARD STACKING SCALE EFFECT --- */
const stickyCards = document.querySelectorAll('.cs-card');

function updateStickyScale() {
  stickyCards.forEach((card, i) => {
    const stickyTop = CS_BASE + i * CS_STEP;
    const rect      = card.getBoundingClientRect();

    // getBoundingClientRect reflects applied transforms, so subtract our stored translateY
    // to recover the true layout (sticky) position before deciding if the card is stuck.
    const appliedTY = parseFloat(card.dataset.ty || '0');
    const layoutTop = rect.top - appliedTY;
    const isStuck   = layoutTop <= stickyTop + TOLERANCE && layoutTop >= stickyTop - TOLERANCE;

    if (!isStuck) {
      card.dataset.ty      = '0';
      card.style.transform = 'translateZ(0)';
      card.style.filter    = '';
      card.style.opacity   = '';
      const arrowReset = card.querySelector('.cs-arrow-icon');
      if (arrowReset) arrowReset.style.transform = '';
      return;
    }

    // Continuous depth — correct next-card positions the same way
    let depth = 0;
    for (let j = i + 1; j < stickyCards.length; j++) {
      const nextTop       = CS_BASE + j * CS_STEP;
      const nextRect      = stickyCards[j].getBoundingClientRect();
      const nextAppliedTY = parseFloat(stickyCards[j].dataset.ty || '0');
      const nextLayoutTop = nextRect.top - nextAppliedTY;

      if (nextLayoutTop <= nextTop + TOLERANCE) {
        depth += 1;
      } else {
        const dist = nextLayoutTop - nextTop;
        depth += Math.max(0, 1 - dist / (window.innerHeight * 0.5));
        break;
      }
    }

    const arrow = card.querySelector('.cs-arrow-icon');

    if (depth > 0) {
      const scale      = Math.max(0.88, 1 - depth * 0.04);
      const brightness = Math.max(0.55, 1 - depth * 0.15);
      const opacity    = Math.max(0.05, 1 - depth * 0.55);
      const ty         = -depth * 60;
      card.dataset.ty      = String(ty);
      card.style.transform = `translateY(${ty}px) scale(${scale}) translateZ(0)`;
      card.style.filter    = `brightness(${brightness})`;
      card.style.opacity   = String(opacity);
      if (arrow) arrow.style.transform = `rotate(${-45 + depth * 60}deg)`;
    } else {
      card.dataset.ty      = '0';
      card.style.transform = 'translateZ(0)';
      card.style.filter    = '';
      card.style.opacity   = '';
      if (arrow) arrow.style.transform = '';
    }
  });
}

window.addEventListener('scroll', updateStickyScale, { passive: true });

/* --- CS CARD SNAP — removed for natural scroll feel; CTA uses absTop directly --- */
(function () {
  function absTop(el) {
    let top = 0, node = el;
    while (node) { top += node.offsetTop; node = node.offsetParent; }
    return top;
  }
  window._csSnap0 = () => {
    const firstCard = document.querySelector('.cs-card');
    return firstCard ? absTop(firstCard) - (72 + 24) : 0;
  };
  window.addEventListener('load', () => { /* positions stable after load */ });
})();

/* --- STICKY CTA BUTTON --- */
(function () {
  const btn = document.getElementById('stickyCta');
  if (!btn) return;

  let isSeeMore = true;

  function setLabel(label) {
    btn.classList.add('swap');
    setTimeout(() => {
      btn.textContent = label;
      btn.classList.remove('swap');
    }, 200);
  }

  function updateBtn() {
    const hero = document.getElementById('hero');
    const heroBottom = hero ? hero.offsetTop + hero.offsetHeight : window.innerHeight;
    const pastHero = window.scrollY > heroBottom - 80;

    if (pastHero && isSeeMore) {
      isSeeMore = false;
      setLabel('Back to top');
    } else if (!pastHero && !isSeeMore) {
      isSeeMore = true;
      setLabel('See more');
    }
  }

  btn.addEventListener('click', () => {
    if (isSeeMore) {
      // Use the pre-calculated absolute snap position for card 0
      const target = window._csSnap0 ? window._csSnap0() : null;
      if (target != null) {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', updateBtn, { passive: true });
  updateBtn();
})();

/* --- SMOOTH SCROLL for anchor links --- */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    if (!id) return;
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
