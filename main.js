/* ============================================
   EVEN5 — Photo Book JS
   Horizontal page navigation, transitions,
   keyboard support, dot indicators
============================================ */

const TOTAL_SPREADS = 12;
let current = 0;
let isAnimating = false;

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  buildDots();
  updateNav();
  updateCounter();

  // Show keyboard hint, then fade it
  const hint = document.getElementById('keyHint');
  setTimeout(() => hint && hint.classList.add('fade'), 4000);
});

// ── BUILD NAV DOTS ────────────────────────────
function buildDots() {
  const container = document.getElementById('navDots');
  if (!container) return;
  for (let i = 0; i < TOTAL_SPREADS; i++) {
    const btn = document.createElement('button');
    btn.className = 'nav-dot' + (i === 0 ? ' active' : '');
    btn.setAttribute('aria-label', `Go to spread ${i + 1}`);
    btn.addEventListener('click', () => goToSpread(i));
    container.appendChild(btn);
  }
}

// ── TURN PAGE ─────────────────────────────────
function turnPage(dir) {
  const next = current + dir;
  if (next < 0 || next >= TOTAL_SPREADS || isAnimating) return;
  goToSpread(next, dir);
}

function goToSpread(idx, dir = 1) {
  if (idx === current || isAnimating) return;
  isAnimating = true;

  const fromEl = document.getElementById(`s${current}`);
  const toEl   = document.getElementById(`s${idx}`);
  if (!fromEl || !toEl) { isAnimating = false; return; }

  // Direction: slide left or right
  const outClass = dir >= 0 ? 'leaving' : 'leaving-right';

  // Set entering position
  toEl.style.transform = dir >= 0 ? 'translateX(60px)' : 'translateX(-60px)';
  toEl.style.opacity = '0';
  toEl.classList.remove('hidden');

  // Trigger reflow
  toEl.getBoundingClientRect();

  // Animate in
  toEl.style.transition = 'opacity .45s ease, transform .45s ease';
  toEl.style.transform = 'translateX(0)';
  toEl.style.opacity = '1';

  // Animate out
  fromEl.style.transition = 'opacity .45s ease, transform .45s ease';
  fromEl.style.transform = dir >= 0 ? 'translateX(-60px)' : 'translateX(60px)';
  fromEl.style.opacity = '0';

  setTimeout(() => {
    fromEl.classList.add('hidden');
    fromEl.style.transform = '';
    fromEl.style.opacity = '';
    fromEl.style.transition = '';
    toEl.style.transition = '';
    current = idx;
    isAnimating = false;
    updateNav();
    updateCounter();
    updateDots();
  }, 460);
}

// ── UPDATE CONTROLS ───────────────────────────
function updateNav() {
  const prev = document.getElementById('prevBtn');
  const next = document.getElementById('nextBtn');
  if (prev) prev.disabled = current === 0;
  if (next) next.disabled = current === TOTAL_SPREADS - 1;

  // Show quote CTA only when not on contact spread
  const cta = document.getElementById('quoteCta');
  if (cta) cta.style.opacity = current === TOTAL_SPREADS - 1 ? '0' : '1';
}

function updateCounter() {
  const num = document.getElementById('spreadNum');
  if (num) num.textContent = current + 1;
}

function updateDots() {
  document.querySelectorAll('.nav-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === current);
  });
}

// ── KEYBOARD ──────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
    e.preventDefault(); turnPage(1);
  }
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
    e.preventDefault(); turnPage(-1);
  }
});

// ── SWIPE / TOUCH ─────────────────────────────
let touchStartX = 0;
let touchStartY = 0;
document.getElementById('bookStage').addEventListener('touchstart', e => {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}, { passive: true });

document.getElementById('bookStage').addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - touchStartX;
  const dy = e.changedTouches[0].clientY - touchStartY;
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 45) {
    turnPage(dx < 0 ? 1 : -1);
  }
}, { passive: true });

// ── PHOTO MOUNT DEPTH TILT ────────────────────
// Subtle 3D tilt on mousemove over mounted photos
document.querySelectorAll('.photo-mount').forEach(mount => {
  mount.addEventListener('mousemove', e => {
    const r = mount.getBoundingClientRect();
    const cx = (e.clientX - r.left) / r.width  - .5;
    const cy = (e.clientY - r.top)  / r.height - .5;
    const baseRot = parseFloat(mount.style.getPropertyValue('--rot')) || 0;
    mount.style.transform = `rotate(${baseRot * .3}deg) perspective(600px) rotateY(${cx * 8}deg) rotateX(${-cy * 6}deg) scale(1.04)`;
  });
  mount.addEventListener('mouseleave', () => {
    const baseRot = parseFloat(mount.style.getPropertyValue('--rot')) || 0;
    mount.style.transform = `rotate(${baseRot}deg)`;
  });
});

// ── FORM ──────────────────────────────────────
function sendForm(e) {
  e.preventDefault();
  const msg = document.getElementById('fmsg');
  msg.textContent = '✓ Message received — we\'ll be in touch within 24 hours.';
  e.target.reset();
  setTimeout(() => msg.textContent = '', 6000);
}
