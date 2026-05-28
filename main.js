// ===========================
// NAVBAR SCROLL
// ===========================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ===========================
// HAMBURGER MENU
// ===========================
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ===========================
// FADE-UP OBSERVER
// ===========================
const observer = new IntersectionObserver(
  entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
  { threshold: 0.12 }
);
document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

// ===========================
// BEFORE/AFTER SLIDER
// ===========================
function initSlider(wrap) {
  const beforeWrap = wrap.querySelector('.img-before-wrap');
  const handle = wrap.querySelector('.slider-handle');
  let dragging = false;

  function setPosition(x) {
    const rect = wrap.getBoundingClientRect();
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.min(Math.max(pct, 2), 98);
    beforeWrap.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  wrap.addEventListener('mousedown', e => { dragging = true; setPosition(e.clientX); });
  wrap.addEventListener('touchstart', e => { dragging = true; setPosition(e.touches[0].clientX); }, { passive: true });

  window.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
  window.addEventListener('touchmove', e => { if (dragging) setPosition(e.touches[0].clientX); }, { passive: true });

  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });
}

// Init all sliders on page
document.querySelectorAll('.slider-wrap').forEach(initSlider);

// ===========================
// FILTER BAR
// ===========================
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.project-card').forEach(card => {
      const cats = card.dataset.category || '';
      if (filter === 'all' || cats.includes(filter)) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===========================
// MODAL
// ===========================
const projectData = [
  {
    title: 'Backyard Transformation',
    before: 'images/before1.jpg',
    after:  'images/after1.jpg',
    beforeLabel: 'BEFORE',
    afterLabel:  'AFTER',
    desc: 'A complete backyard overhaul — starting from bare, compacted dirt and transforming it into a lush, functional outdoor space. We installed a natural dry creek bed for drainage, fresh sod, drought-tolerant native plantings, and decorative river rock.',
    location: 'Southern California',
    date: '2024',
    tag: 'Landscaping · Drainage'
  },
  {
    title: 'Sod & River Rock Install',
    before: 'images/during1.jpg',
    after:  'images/after1.jpg',
    beforeLabel: 'DURING',
    afterLabel:  'AFTER',
    desc: 'Mid-project to finished result — fresh sod rolls being laid alongside a winding river rock creek bed. The final product is a clean, low-maintenance yard with excellent drainage and great curb appeal.',
    location: 'Southern California',
    date: '2024',
    tag: 'Sod · River Rock · Hardscape'
  },
  {
    title: 'Creek Bed Drainage',
    before: 'images/before1.jpg',
    after:  'images/during1.jpg',
    beforeLabel: 'BEFORE',
    afterLabel:  'DURING',
    desc: 'Bare, ungraded dirt transformed into a properly sloped yard with a functional dry creek bed. The creek channels storm water naturally while adding a beautiful, landscape design feature.',
    location: 'Southern California',
    date: '2024',
    tag: 'Drainage · Hardscape'
  },
  {
    title: 'Arched Double Gate',
    before: 'images/gate-before.jpg',
    after:  'images/gate-after.jpg',
    beforeLabel: 'BEFORE',
    afterLabel:  'AFTER',
    desc: 'A complete custom gate build from bare steel frame to a stunning finished product. The double gate features a classic arched top, vertical wood planking, decorative bolt accents, solar lantern hardware, and a clean painted finish that complements the home exterior.',
    location: 'Southern California',
    date: '2024',
    tag: 'Fence · Gate · Custom Build'
  },
  {
    title: 'Gate — Final Finish',
    before: 'images/gate-during.jpg',
    after:  'images/gate-after.jpg',
    beforeLabel: 'DURING',
    afterLabel:  'AFTER',
    desc: 'From freshly-paneled to fully finished — the final stage of this custom gate project. Solar lanterns, decorative bolt hardware, and a precision-cut arch crown the completed double gate for a high-end curb appeal upgrade.',
    location: 'Southern California',
    date: '2024',
    tag: 'Fence · Gate · Finish Work'
  }
];

function openModal(idx) {
  const data = projectData[idx];
  const modal = document.getElementById('modal');
  const sliderWrap = document.getElementById('modalSliderWrap');
  const info = document.getElementById('modalInfo');

  sliderWrap.innerHTML = `
    <div class="slider-wrap" id="modalSlider">
      <img class="img-after" src="${data.after}" alt="${data.afterLabel}" />
      <div class="img-before-wrap">
        <img class="img-before" src="${data.before}" alt="${data.beforeLabel}" />
      </div>
      <div class="slider-handle">
        <div class="handle-line"></div>
        <div class="handle-btn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"></polyline></svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </div>
      </div>
      <span class="label-before">${data.beforeLabel}</span>
      <span class="label-after">${data.afterLabel}</span>
    </div>
  `;

  info.innerHTML = `
    <span style="font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--accent);display:block;margin-bottom:.5rem;">${data.tag}</span>
    <h3>${data.title}</h3>
    <p style="margin:.75rem 0 1.25rem;">${data.desc}</p>
    <div style="display:flex;gap:2rem;font-size:.82rem;color:var(--text-muted);">
      <span>📍 ${data.location}</span>
      <span>📅 ${data.date}</span>
    </div>
    <a href="#contact" style="display:inline-flex;margin-top:1.5rem;" class="btn btn-primary" onclick="closeModal()">Request a Quote →</a>
  `;

  initSlider(sliderWrap.querySelector('.slider-wrap'));
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal(event) {
  if (event && event.target !== document.getElementById('modal') && !event.target.classList.contains('modal-close')) return;
  document.getElementById('modal').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal({ target: document.getElementById('modal') });
});

// ===========================
// FORM SUBMIT
// ===========================
function handleSubmit(e) {
  e.preventDefault();
  const msg = document.getElementById('formMsg');
  msg.textContent = '✓ Message sent! We\'ll be in touch within 24 hours.';
  e.target.reset();
  setTimeout(() => { msg.textContent = ''; }, 6000);
}
