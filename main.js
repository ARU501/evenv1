/* ============================================
   EVEN6 — main.js
   Hybrid ev4+ev5: auto-showcase + flip cards
============================================ */

// ── PROJECT DATA ──────────────────────────────
const projects = [
  {
    num:'01', cat:'Landscaping · Drainage', title:'Backyard Transformation',
    before:'images/before1.jpg',  after:'images/after1.jpg',
    capB:'Bare compacted dirt — no drainage, no plants.',
    capA:'Sod, river rock creek bed, drought-tolerant plantings.',
    desc:'Bare compacted dirt turned into a lush outdoor retreat — dry creek bed for natural drainage, fresh sod, river rock, and drought-tolerant native plantings throughout.'
  },
  {
    num:'02', cat:'Gates · Fencing', title:'Arched Double Gate',
    before:'images/gate-before.jpg', after:'images/gate-after.jpg',
    capB:'Raw steel frame and redwood posts — the skeleton.',
    capA:'Painted arch, solar lanterns, decorative bolt hardware.',
    desc:'A raw steel frame built into a stunning custom arched double gate — solar lanterns, decorative bolt hardware, precision-cut arch profile, and a professional painted finish.'
  },
  {
    num:'03', cat:'Flooring · Interior', title:'Kitchen Floor Replacement',
    before:'images/kitchen-before.jpg', after:'images/kitchen-after.jpg',
    capB:'Dated octagon-pattern vinyl tile throughout.',
    capA:'Wide-plank hardwood — warm, modern, timeless.',
    desc:'Outdated octagon vinyl tile completely removed and replaced with warm wide-plank hardwood flooring. A total kitchen modernization that adds lasting home value.'
  },
  {
    num:'04', cat:'Concrete · Hardscape', title:'Concrete Slab Pour',
    before:'images/concrete-before.jpg', after:'images/concrete-after.jpg',
    capB:'Uneven grass and dirt — no usable surface.',
    capA:'Smooth trowel-finished slab. Graded, formed, poured in a day.',
    desc:'Overgrown grass and uneven dirt cleared, graded, formed, and poured into a smooth durable concrete shed pad — finished in a single day.'
  },
  {
    num:'05', cat:'Concrete · Outdoor Living', title:'Patio & Outdoor Kitchen',
    before:'images/patio-before.jpg', after:'images/patio-after.jpg',
    capB:'Cracked paver patio — no kitchen, no hot tub pad.',
    capA:'New concrete, custom BBQ island, mini fridge, hot tub pad.',
    desc:'Old cracked pavers removed, large concrete patio poured, custom-built BBQ island with built-in grill, mini fridge, and storage. Plus a hot tub pad. Full backyard entertainment upgrade.'
  }
];

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

// ── COUNTER ANIMATION ─────────────────────────
const counters = document.querySelectorAll('.counter');
const cro = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el  = e.target;
    const end = +el.dataset.target;
    const suf = el.closest('.sb-item').querySelector('span').textContent.replace(/[0-9]/g,'').trim();
    let start = 0, dur = 1200, t0;
    const tick = ts => {
      if (!t0) t0 = ts;
      const p = Math.min((ts - t0) / dur, 1);
      el.textContent = Math.round(p * end) + (end === 5 ? '' : '+');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    cro.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cro.observe(c));

/* ════════════════════════════════════════════
   AUTO SHOWCASE
════════════════════════════════════════════ */
let scIdx     = 0;
let scPhase   = 'before';   // 'before' | 'after'
let scPaused  = false;
let scTimer   = null;
let scProg    = null;       // progress animation frame
let scProgStart = null;
let scProgDur = 2800;       // ms before-phase duration
let scAfterDur = 2000;      // ms after-phase duration
let hintDone  = new Set();
let allFlipped = false;

// DOM refs
const scCard     = document.getElementById('scCard');
const scBeforeImg = document.getElementById('scBeforeImg');
const scAfterImg  = document.getElementById('scAfterImg');
const scBeforeCap = document.getElementById('scBeforeCap');
const scAfterCap  = document.getElementById('scAfterCap');
const scNumEl    = document.getElementById('scNum');
const scCatEl    = document.getElementById('scCat');
const scTitleEl  = document.getElementById('scTitle');
const scPhaseEl  = document.getElementById('scPhase');
const scDescEl   = document.getElementById('scDesc');
const scProgBar  = document.getElementById('scProgress');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon   = document.getElementById('playIcon');
const pauseIcon  = document.getElementById('pauseIcon');

// Build showcase dots
function buildScDots() {
  const c = document.getElementById('scDots');
  projects.forEach((_, i) => {
    const b = document.createElement('button');
    b.className = 'sc-dot' + (i===0?' active':'');
    b.addEventListener('click', () => { jumpToProject(i); });
    c.appendChild(b);
  });
}

function updateScDots() {
  document.querySelectorAll('.sc-dot').forEach((d,i) => d.classList.toggle('active', i===scIdx));
}

function loadProject(idx, phase='before') {
  const p = projects[idx];
  scIdx   = idx;
  scPhase = phase;

  // Update labels
  scNumEl.textContent   = p.num;
  scCatEl.textContent   = p.cat;
  scTitleEl.textContent = p.title;
  scDescEl.textContent  = p.desc;

  // Images & captions
  scBeforeImg.src    = p.before;
  scAfterImg.src     = p.after;
  scBeforeCap.textContent = p.capB;
  scAfterCap.textContent  = p.capA;

  // Card face
  if (phase === 'before') {
    scCard.classList.remove('flipped');
    scPhaseEl.className = 'sc-phase phase-b';
    scPhaseEl.textContent = 'BEFORE';
  } else {
    scCard.classList.add('flipped');
    scPhaseEl.className = 'sc-phase phase-a';
    scPhaseEl.textContent = 'AFTER';
  }

  scNumEl.style.color = 'var(--border)';
  setTimeout(() => scNumEl.style.color = 'var(--blue)', 50);

  updateScDots();
}

// Progress bar animation
function startProgress(duration, onComplete) {
  cancelProgress();
  scProgBar.style.transition = 'none';
  scProgBar.style.width = '0%';
  requestAnimationFrame(() => {
    scProgBar.style.transition = `width ${duration}ms linear`;
    scProgBar.style.width = '100%';
  });
  scTimer = setTimeout(onComplete, duration);
}

function cancelProgress() {
  if (scTimer) clearTimeout(scTimer);
  scTimer = null;
  scProgBar.style.transition = 'none';
  scProgBar.style.width = '0%';
}

function advanceShowcase() {
  if (scPaused) return;

  if (scPhase === 'before') {
    // Flip to after
    loadProject(scIdx, 'after');
    startProgress(scAfterDur, () => {
      // Advance to next project
      const next = (scIdx + 1) % projects.length;
      loadProject(next, 'before');
      startProgress(scProgDur, advanceShowcase);
    });
  } else {
    const next = (scIdx + 1) % projects.length;
    loadProject(next, 'before');
    startProgress(scProgDur, advanceShowcase);
  }
}

function jumpToProject(idx) {
  cancelProgress();
  loadProject(idx, 'before');
  if (!scPaused) startProgress(scProgDur, advanceShowcase);
}

// Play / Pause
playPauseBtn.addEventListener('click', () => {
  scPaused = !scPaused;
  playIcon.classList.toggle('hidden', !scPaused);
  pauseIcon.classList.toggle('hidden', scPaused);
  if (scPaused) {
    cancelProgress();
  } else {
    const dur = scPhase === 'before' ? scProgDur : scAfterDur;
    startProgress(dur, advanceShowcase);
  }
});

document.getElementById('prevProject').addEventListener('click', () => {
  cancelProgress();
  const prev = (scIdx - 1 + projects.length) % projects.length;
  loadProject(prev, 'before');
  if (!scPaused) startProgress(scProgDur, advanceShowcase);
});

document.getElementById('nextProject').addEventListener('click', () => {
  cancelProgress();
  const next = (scIdx + 1) % projects.length;
  loadProject(next, 'before');
  if (!scPaused) startProgress(scProgDur, advanceShowcase);
});

// Pause on hover over showcase
const stage = document.querySelector('.showcase-stage');
stage.addEventListener('mouseenter', () => { if (!scPaused) cancelProgress(); });
stage.addEventListener('mouseleave', () => {
  if (!scPaused) {
    const dur = scPhase === 'before' ? scProgDur : scAfterDur;
    startProgress(dur, advanceShowcase);
  }
});

// Click card to manually flip
scCard.addEventListener('click', () => {
  cancelProgress();
  const newPhase = scPhase === 'before' ? 'after' : 'before';
  loadProject(scIdx, newPhase);
  const dur = newPhase === 'before' ? scProgDur : scAfterDur;
  if (!scPaused) startProgress(dur, advanceShowcase);
});

/* ════════════════════════════════════════════
   FLIP CARD GALLERY
════════════════════════════════════════════ */
function flipCard(card) {
  card.classList.toggle('flipped');
  updateFlipState();
}

function updateFlipState() {
  const total   = document.querySelectorAll('.fc').length;
  const flipped = document.querySelectorAll('.fc.flipped').length;
  const stateEl = document.getElementById('flipState');
  const btn     = document.getElementById('flipAllBtn');
  if (flipped === 0)     { stateEl.textContent = 'Showing: Before'; btn.classList.remove('all-flipped'); allFlipped = false; }
  else if (flipped === total) { stateEl.textContent = 'Showing: After';  btn.classList.add('all-flipped');    allFlipped = true; }
  else                   { stateEl.textContent = `${flipped}/${total} flipped`; btn.classList.remove('all-flipped'); }
}

function flipAll() {
  allFlipped = !allFlipped;
  document.querySelectorAll('.fc').forEach((card, i) => {
    setTimeout(() => {
      if (allFlipped) card.classList.add('flipped');
      else            card.classList.remove('flipped');
    }, i * 100);
  });
  setTimeout(updateFlipState, document.querySelectorAll('.fc').length * 100 + 80);
}

// Hint shake on first hover
document.querySelectorAll('.fc').forEach((card, i) => {
  card.addEventListener('mouseenter', () => {
    if (hintDone.has(i) || card.classList.contains('flipped')) return;
    hintDone.add(i);
    card.classList.add('hint');
    card.addEventListener('animationend', () => card.classList.remove('hint'), { once: true });
  });
  card.setAttribute('tabindex','0');
  card.addEventListener('keydown', e => { if(e.key==='Enter'||e.key===' '){e.preventDefault();flipCard(card);} });
});

// ── FORM ──────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const msg = document.getElementById('cmsg');
  msg.textContent = '✓ Message received! We\'ll be in touch within 24 hours.';
  e.target.reset();
  setTimeout(() => msg.textContent = '', 6000);
}

// ── BOOT ──────────────────────────────────────
buildScDots();
loadProject(0, 'before');

// Start showcase after a short delay (let page settle)
setTimeout(() => {
  if (!scPaused) startProgress(scProgDur, advanceShowcase);
}, 1200);
