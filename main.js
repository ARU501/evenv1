/* ============================================
   EVEN2 — main.js
============================================ */

// ── NAV ──────────────────────────────────────
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 60));

const burger = document.getElementById('burger');
const drawer = document.getElementById('drawer');
burger.addEventListener('click', () => drawer.classList.toggle('open'));
drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

// ── REVEAL ON SCROLL ─────────────────────────
const ro = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); }),
  { threshold: 0.1 }
);
document.querySelectorAll('.reveal').forEach(el => ro.observe(el));

// ── FILTER ───────────────────────────────────
document.querySelectorAll('.f').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.f').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;
    document.querySelectorAll('.project').forEach(p => {
      const cats = p.dataset.cat || '';
      const show = f === 'all' || cats.split(' ').includes(f);
      p.classList.toggle('hidden', !show);
    });
  });
});

// ── SPOTLIGHT HOVER (dim siblings) ───────────
document.querySelectorAll('.duo').forEach(duo => {
  const panels = duo.querySelectorAll('.duo-panel');
  panels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      panels.forEach(p => p.classList.toggle('dimmed', p !== panel));
    });
    panel.addEventListener('mouseleave', () => {
      panels.forEach(p => p.classList.remove('dimmed'));
    });
  });
});

// ── PROJECT DATA ──────────────────────────────
const projects = [
  { cat:'Landscaping · Drainage',    title:'Backyard Transformation',     before:'images/before1.jpg',         after:'images/after1.jpg',         lblB:'Before', lblA:'After',  desc:'Bare compacted dirt turned into a lush outdoor retreat — dry creek bed, river rock, sod, and drought-tolerant native plantings.' },
  { cat:'Sod · River Rock',          title:'Sod & Rock Install',          before:'images/during1.jpg',         after:'images/after1.jpg',         lblB:'During', lblA:'After',  desc:'Mid-project to finished — fresh sod laid alongside a winding decorative river rock creek bed drainage channel.' },
  { cat:'Drainage · Hardscape',      title:'Creek Bed Drainage',          before:'images/before1.jpg',         after:'images/during1.jpg',        lblB:'Before', lblA:'During', desc:'Ungraded bare dirt shaped and sloped — river rock creek bed channels storm water beautifully and naturally.' },
  { cat:'Fence · Custom Gate',       title:'Arched Double Gate',          before:'images/gate-before.jpg',     after:'images/gate-after.jpg',     lblB:'Before', lblA:'After',  desc:'Raw steel frame and wood posts built into a stunning arched double gate — solar lanterns, decorative bolt hardware, and painted finish.' },
  { cat:'Gate · Finish Work',        title:'Gate — Final Finish',         before:'images/gate-during.jpg',     after:'images/gate-after.jpg',     lblB:'During', lblA:'After',  desc:'From bare white panels installed at night to the fully painted and decorated gate — hardware, bolt accents, arch trim complete.' },
  { cat:'Flooring · Interior',       title:'Kitchen Floor Replacement',   before:'images/kitchen-before.jpg',  after:'images/kitchen-after.jpg',  lblB:'Before', lblA:'After',  desc:'Dated octagon vinyl tile pulled out and replaced with beautiful warm hardwood flooring — a total kitchen modernization.' },
  { cat:'Concrete · Hardscape',      title:'Concrete Slab Pour',          before:'images/concrete-before.jpg', after:'images/concrete-after.jpg', lblB:'Before', lblA:'After',  desc:'Overgrown grass and uneven dirt cleared, graded, formed, and poured into a clean durable concrete shed pad.' },
  { cat:'Concrete · Pour',           title:'Forms to Finish',             before:'images/concrete-during.jpg', after:'images/concrete-after.jpg', lblB:'During', lblA:'After',  desc:'Ground graded and wood forms carefully set — then a smooth large-format slab trowel-finished to perfection in a single day.' },
  { cat:'Concrete · Outdoor Kitchen',title:'Patio & Outdoor Kitchen',     before:'images/patio-before.jpg',    after:'images/patio-after.jpg',    lblB:'Before', lblA:'After',  desc:'Full patio overhaul — old cracked pavers removed, large concrete patio poured, custom BBQ island built with fridge and storage, plus hot tub pad.' },
  { cat:'Concrete · Patio',          title:'Demo to Done',                before:'images/patio-during1.jpg',   after:'images/patio-after.jpg',    lblB:'During', lblA:'After',  desc:'Pavers demolished and forms set in the cleared dirt — then a fresh smooth concrete patio poured and finished for the new outdoor living space.' },
  { cat:'Outdoor Kitchen · BBQ',     title:'Plan to Reality',             before:'images/patio-during2.jpg',   after:'images/patio-after.jpg',    lblB:'Layout', lblA:'After',  desc:'Gas line routes and BBQ island layout spray-painted on bare dirt — that blueprint became a fully equipped outdoor kitchen and entertainment area.' },
];

// ── LIGHTBOX ──────────────────────────────────
let currentIdx = 0;
const lb      = document.getElementById('lb');
const lbSlide = document.getElementById('lbSlider');
const lbMeta  = document.getElementById('lbMeta');

function openLB(idx) {
  currentIdx = idx;
  renderLB(idx);
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function renderLB(idx) {
  const p = projects[idx];
  lbSlide.innerHTML = `
    <img class="lb-after" src="${p.after}" alt="${p.lblA}"/>
    <div class="lb-before-clip">
      <img class="lb-before" src="${p.before}" alt="${p.lblB}"/>
    </div>
    <div class="lb-handle">
      <div class="lb-line"></div>
      <div class="lb-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
    <span class="lb-lbl-b">${p.lblB}</span>
    <span class="lb-lbl-a">${p.lblA}</span>
  `;
  lbMeta.innerHTML = `
    <p class="proj-cat">${p.cat}</p>
    <h3>${p.title}</h3>
    <p>${p.desc}</p>
  `;
  initSlider(lbSlide);
}

function closeLB() {
  lb.classList.remove('open');
  document.body.style.overflow = '';
}

function lbClickOutside(e) { if (e.target === lb) closeLB(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });

function lbMove(dir) {
  const visibleProjects = [...document.querySelectorAll('.project:not(.hidden)')];
  const indices = visibleProjects.map(p => +p.dataset.idx);
  const pos = indices.indexOf(currentIdx);
  const next = indices[(pos + dir + indices.length) % indices.length];
  currentIdx = next;
  renderLB(next);
}

// ── DRAG SLIDER (inside LB) ───────────────────
function initSlider(wrap) {
  const clip   = wrap.querySelector('.lb-before-clip');
  const handle = wrap.querySelector('.lb-handle');
  if (!clip) return;
  let drag = false;

  function setPos(x) {
    const r = wrap.getBoundingClientRect();
    let pct = ((x - r.left) / r.width) * 100;
    pct = Math.max(2, Math.min(98, pct));
    clip.style.width   = pct + '%';
    handle.style.left  = pct + '%';
  }

  wrap.addEventListener('mousedown',  e => { drag = true; setPos(e.clientX); });
  wrap.addEventListener('touchstart', e => { drag = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mousemove',  e => { if (drag) setPos(e.clientX); });
  window.addEventListener('touchmove',  e => { if (drag) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('mouseup',  () => { drag = false; });
  window.addEventListener('touchend', () => { drag = false; });
}

// ── FORM ──────────────────────────────────────
function submitForm(e) {
  e.preventDefault();
  const msg = document.getElementById('cmsg');
  msg.textContent = '✓ Message received! We\'ll be in touch within 24 hours.';
  e.target.reset();
  setTimeout(() => msg.textContent = '', 6000);
}
