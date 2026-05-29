/* ============================================
   EVEN3 — main.js
   Dark cinema style — click reveal with
   circular clip-path spotlight effect
============================================ */

// ── CUSTOM CURSOR ─────────────────────────────
const cursor     = document.getElementById('cursor');
const cursorText = document.getElementById('cursorText');
let mx = -200, my = -200;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
  if (!cursor.classList.contains('visible')) cursor.classList.add('visible');
});

document.querySelectorAll('a,button').forEach(el => {
  el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
});

// ── NAV ───────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', () => drawer.classList.toggle('open'));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

// ── SCROLL REVEAL ─────────────────────────────
const sro = new IntersectionObserver(
  entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.style.opacity    = '1';
    e.target.style.transform  = 'translateY(0)';
  }),
  { threshold: 0.1 }
);
document.querySelectorAll('.proj-info, .about-grid, .contact-grid, .intro-content').forEach(el => {
  el.style.cssText += 'opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s ease';
  sro.observe(el);
});

// ── CLICK-REVEAL on each project stage ────────
document.querySelectorAll('.proj-stage').forEach(stage => {

  // Track mouse position within stage for origin point
  let ox = 50, oy = 50;
  stage.addEventListener('mousemove', e => {
    const r  = stage.getBoundingClientRect();
    ox = ((e.clientX - r.left) / r.width  * 100).toFixed(1);
    oy = ((e.clientY - r.top)  / r.height * 100).toFixed(1);
  });

  // Cursor state
  stage.addEventListener('mouseenter', () => {
    cursor.classList.add('on-stage');
  });
  stage.addEventListener('mouseleave', () => {
    cursor.classList.remove('on-stage');
  });

  // Click toggles reveal
  stage.addEventListener('click', () => {
    const isRevealed = stage.classList.contains('revealed');
    const afterEl    = stage.querySelector('.stage-after');

    if (!isRevealed) {
      // Set clip origin to where mouse clicked
      afterEl.style.clipPath = `circle(0% at ${ox}% ${oy}%)`;
      afterEl.style.transition = 'clip-path 0s';

      // Force reflow then animate
      afterEl.getBoundingClientRect();
      afterEl.style.transition = 'clip-path 1s cubic-bezier(.22,1,.36,1)';
      afterEl.style.clipPath   = `circle(160% at ${ox}% ${oy}%)`;

      stage.classList.add('revealed');
    } else {
      // Reverse: collapse back to origin
      afterEl.style.transition = 'clip-path .7s cubic-bezier(.4,0,.2,1)';
      afterEl.style.clipPath   = `circle(0% at ${ox}% ${oy}%)`;
      stage.classList.remove('revealed');
    }
  });
});

// ── FORM ──────────────────────────────────────
function sendForm(e) {
  e.preventDefault();
  const msg = document.getElementById('fmsg');
  msg.textContent = '✓ Message received! We\'ll be in touch within 24 hours.';
  e.target.reset();
  setTimeout(() => msg.textContent = '', 6000);
}

// ── REEL DUPLICATION for seamless loop ────────
// Already handled by CSS animation + duplicate imgs in HTML

// ── KEYBOARD ACCESSIBILITY ────────────────────
document.querySelectorAll('.proj-stage').forEach(stage => {
  stage.setAttribute('tabindex', '0');
  stage.setAttribute('role', 'button');
  stage.setAttribute('aria-label', 'Click to reveal after photo');
  stage.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      stage.click();
    }
  });
});
