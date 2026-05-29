/* ============================================
   EVEN4 — main.js
   White/cobalt 3D flip card gallery
============================================ */

// ── NAV ───────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 50));
const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', () => drawer.classList.toggle('open'));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

// ── SCROLL REVEAL ─────────────────────────────
const ro = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// Also stagger-reveal sections
const sro = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.opacity   = '1';
    e.target.style.transform = 'translateY(0)';
  }),
  { threshold: 0.08 }
);
['.gallery-head', '.about-inner', '.contact-inner', '.hero-inner'].forEach(sel => {
  document.querySelectorAll(sel).forEach(el => {
    el.style.cssText += 'opacity:0;transform:translateY(22px);transition:opacity .75s ease,transform .75s ease';
    sro.observe(el);
  });
});

// ── HERO DEMO CARD ─────────────────────────────
const heroDemo = document.getElementById('heroDemo');
heroDemo.addEventListener('click', () => heroDemo.classList.toggle('flipped'));

// Auto flip demo once after 2s to show the mechanic
setTimeout(() => {
  heroDemo.classList.add('flipped');
  setTimeout(() => heroDemo.classList.remove('flipped'), 2200);
}, 2000);

// ── FLIP CARDS ────────────────────────────────
const cards = document.querySelectorAll('.flip-card');
const flipBtn = document.getElementById('flipAllBtn');
const flipState = document.getElementById('flipState');
let allFlipped = false;
let hintDone = new Set();

cards.forEach((card, i) => {
  // Hint shake on first hover for each card
  card.addEventListener('mouseenter', () => {
    if (!hintDone.has(i) && !card.classList.contains('flipped')) {
      hintDone.add(i);
      card.classList.add('hint-shake');
      card.addEventListener('animationend', () => card.classList.remove('hint-shake'), { once: true });
    }
  });

  card.addEventListener('click', () => {
    card.classList.toggle('flipped');
    updateFlipState();
  });

  // Keyboard support
  card.setAttribute('tabindex', '0');
  card.setAttribute('role', 'button');
  card.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
  });
});

function updateFlipState() {
  const flipped = [...cards].filter(c => c.classList.contains('flipped')).length;
  if (flipped === 0) {
    flipState.textContent = 'Showing: BEFORE';
    flipBtn.classList.remove('all-flipped');
    allFlipped = false;
  } else if (flipped === cards.length) {
    flipState.textContent = 'Showing: AFTER';
    flipBtn.classList.add('all-flipped');
    allFlipped = true;
  } else {
    flipState.textContent = `${flipped}/${cards.length} flipped`;
    flipBtn.classList.remove('all-flipped');
    allFlipped = false;
  }
}

// Flip All
function flipAll() {
  allFlipped = !allFlipped;
  // Stagger the flip for a satisfying cascade effect
  cards.forEach((card, i) => {
    setTimeout(() => {
      if (allFlipped) card.classList.add('flipped');
      else card.classList.remove('flipped');
    }, i * 120);
  });
  setTimeout(updateFlipState, cards.length * 120 + 100);
}

// ── COUNTER ANIMATION ─────────────────────────
function animateCount(el, target, suffix = '') {
  let start = 0;
  const duration = 1400;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    statsObserver.disconnect();
    document.querySelectorAll('.hero-stats strong').forEach(el => {
      const txt = el.textContent;
      const num = parseInt(txt);
      const suffix = txt.replace(/[0-9]/g, '');
      animateCount(el, num, suffix);
    });
    document.querySelectorAll('.ags strong').forEach(el => {
      const txt = el.textContent;
      const num = parseInt(txt);
      if (!isNaN(num)) {
        const suffix = txt.replace(/[0-9]/g, '');
        animateCount(el, num, suffix);
      }
    });
  });
}, { threshold: 0.3 });
const statsEl = document.querySelector('.hero-stats');
if (statsEl) statsObserver.observe(statsEl);

// ── FORM ──────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const msg = document.getElementById('cmsg');
  msg.textContent = '✓ Got it! We\'ll be in touch within 24 hours.';
  e.target.reset();
  setTimeout(() => msg.textContent = '', 6000);
}
