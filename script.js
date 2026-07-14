// =============================================
// EMBER — Interactions
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  initEmberCanvas();
  initNavScroll();
  initMobileNav();
  initRevealOnScroll();
  initTestimonialCarousel();
  initReservationForm();
  initBackToTop();
});

/* ---------- Ambient ember particle canvas ---------- */
function initEmberCanvas(){
  const canvas = document.getElementById('ember-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width, height, particles;
  const COLORS = ['#E8542A', '#FF7A45', '#C9A227'];

  function resize(){
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  function makeParticle(startAtBottom){
    return {
      x: Math.random() * width,
      y: startAtBottom ? height + Math.random() * 100 : Math.random() * height,
      r: Math.random() * 2 + 0.6,
      speedY: Math.random() * 0.6 + 0.25,
      drift: (Math.random() - 0.5) * 0.4,
      alpha: Math.random() * 0.5 + 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      flicker: Math.random() * Math.PI * 2
    };
  }

  const COUNT = reduceMotion ? 0 : (window.innerWidth < 720 ? 26 : 48);
  particles = Array.from({ length: COUNT }, () => makeParticle(false));

  function tick(){
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.y -= p.speedY;
      p.x += p.drift;
      p.flicker += 0.05;
      const flickerAlpha = p.alpha * (0.7 + 0.3 * Math.sin(p.flicker));

      if (p.y < -10){
        Object.assign(p, makeParticle(true));
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = hexToRgba(p.color, flickerAlpha);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6;
      ctx.fill();
    });
    if (!reduceMotion) requestAnimationFrame(tick);
  }

  function hexToRgba(hex, alpha){
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  if (!reduceMotion) tick();
}

/* ---------- Navbar shrink + blur on scroll ---------- */
function initNavScroll(){
  const nav = document.getElementById('nav');
  if(!nav) return;
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile nav toggle ---------- */
function initMobileNav(){
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  if(!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav__links a, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- Scroll-triggered reveal animations ---------- */
function initRevealOnScroll(){
  const items = document.querySelectorAll('.reveal');
  if(!items.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting){
        setTimeout(() => entry.target.classList.add('is-visible'), i * 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  items.forEach(item => observer.observe(item));
}

/* ---------- Testimonial carousel ---------- */
function initTestimonialCarousel(){
  const track = document.getElementById('quote-track');
  const dotsWrap = document.getElementById('quote-dots');
  if(!track || !dotsWrap) return;

  const quotes = Array.from(track.querySelectorAll('.quote'));
  let current = 0;
  let timer;

  quotes.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.setAttribute('aria-label', `Show testimonial ${i + 1}`);
    if (i === 0) dot.classList.add('is-active');
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.children);

  function goTo(index){
    quotes[current].classList.remove('is-active');
    dots[current].classList.remove('is-active');
    current = index;
    quotes[current].classList.add('is-active');
    dots[current].classList.add('is-active');
    resetTimer();
  }

  function next(){ goTo((current + 1) % quotes.length); }

  function resetTimer(){
    clearInterval(timer);
    timer = setInterval(next, 6000);
  }

  resetTimer();
}

/* ---------- Reservation form (demo submit) ---------- */
function initReservationForm(){
  const form = document.getElementById('reserve-form');
  const success = document.getElementById('reserve-success');
  if(!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    success.classList.add('is-visible');
    form.reset();
    setTimeout(() => success.classList.remove('is-visible'), 6000);
  });
}

/* ---------- Back to top ---------- */
function initBackToTop(){
  const btn = document.getElementById('back-to-top');
  if(!btn) return;
  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
