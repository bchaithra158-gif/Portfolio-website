/* ============================================================
   PORTFOLIO WEBSITE – script.js
   Complete, production-ready JavaScript
============================================================ */

'use strict';

// ─── DOM REFERENCES ───────────────────────────────────────────
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');
const toast = document.getElementById('toast');
const contactForm = document.getElementById('contactForm');
const yearEl = document.getElementById('year');
const backTop = document.getElementById('backTop');
const particleContainer = document.getElementById('particles');

// ─── YEAR ─────────────────────────────────────────────────────
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ============================================================
   1. NAVIGATION – hamburger + scroll behaviour + active links
============================================================ */

// Hamburger toggle
hamburger && hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('active');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  // Prevent body scroll when menu is open
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close on outside click
document.addEventListener('click', (e) => {
  if (
    navMenu.classList.contains('active') &&
    !navMenu.contains(e.target) &&
    !hamburger.contains(e.target)
  ) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});

// Nav scroll state
let lastScrollY = 0;
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Glassmorphism on scroll
  navbar.classList.toggle('scrolled', scrollY > 20);

  // Active nav link based on section in view
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });

  // Back-to-top visibility
  if (backTop) {
    backTop.style.opacity = scrollY > 400 ? '1' : '0';
    backTop.style.pointerEvents = scrollY > 400 ? 'all' : 'none';
  }

  lastScrollY = scrollY;
}, { passive: true });

// Back to top
backTop && backTop.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Initial state
if (backTop) { backTop.style.opacity = '0'; backTop.style.transition = 'opacity 0.3s'; }

/* ============================================================
   2. SMOOTH SCROLLING (anchor links with nav offset)
============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = navbar ? navbar.offsetHeight : 70;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});

/* ============================================================
   3. TYPEWRITER EFFECT
============================================================ */
const typewriterEl = document.getElementById('typewriterText');

if (typewriterEl) {
  const phrases = [
    'Frontend Developer',
    'Problem Solver',
    'Creative Thinker',
    'Open Source Enthusiast'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPE_SPEED = 90;    // ms per character when typing
  const DELETE_SPEED = 50;    // ms per character when deleting
  const PAUSE_AFTER = 1800;  // pause after full phrase is typed
  const PAUSE_BEFORE = 300;   // pause before starting next phrase

  function typeStep() {
    const phrase = phrases[phraseIdx];

    if (isPaused) {
      isPaused = false;
      setTimeout(typeStep, isDeleting ? PAUSE_BEFORE : PAUSE_AFTER);
      return;
    }

    if (!isDeleting) {
      // Typing forward
      typewriterEl.textContent = phrase.slice(0, ++charIdx);
      if (charIdx === phrase.length) {
        isDeleting = true;
        isPaused = true;
        setTimeout(typeStep, TYPE_SPEED);
        return;
      }
      setTimeout(typeStep, TYPE_SPEED);
    } else {
      // Deleting
      typewriterEl.textContent = phrase.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typeStep, TYPE_SPEED);
        return;
      }
      setTimeout(typeStep, DELETE_SPEED);
    }
  }

  // Start after short delay
  setTimeout(typeStep, 600);
}

/* ============================================================
   4. PARTICLE SYSTEM (Hero background)
============================================================ */
function createParticles() {
  if (!particleContainer) return;
  const count = 55;

  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'particle';

    const size = Math.random() * 4 + 2;    // 2–6 px
    const left = Math.random() * 100;       // %
    const duration = Math.random() * 20 + 15;  // 15–35 s
    const delay = Math.random() * 20;        // 0–20 s
    const opacity = Math.random() * 0.5 + 0.2;

    p.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${left}%;
      bottom: -10px;
      opacity: ${opacity};
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
      animation-name: particleDrift;
      animation-timing-function: linear;
      animation-iteration-count: infinite;
    `;

    particleContainer.appendChild(p);
  }
}

createParticles();

/* ============================================================
   5. INTERSECTION OBSERVER – scroll animations
============================================================ */
const animatables = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .slide-up');

const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate');
      animObserver.unobserve(entry.target); // fire once
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

animatables.forEach(el => animObserver.observe(el));

/* ============================================================
   6. SKILLS PROGRESS BARS
============================================================ */
const skillsSection = document.getElementById('skills');
let skillsAnimated = false;

function animateSkills() {
  if (skillsAnimated) return;
  skillsAnimated = true;

  document.querySelectorAll('.skill-progress').forEach(item => {
    const target = parseInt(item.dataset.percent, 10);
    const fill = item.querySelector('.progress-fill');
    const pct = item.querySelector('.skill-pct');

    if (!fill || !pct) return;

    // Animate fill width
    fill.style.width = target + '%';

    // Animate counter
    let current = 0;
    const step = Math.ceil(target / 60);
    const counter = setInterval(() => {
      current = Math.min(current + step, target);
      pct.textContent = current + '%';
      if (current >= target) clearInterval(counter);
    }, 20);
  });
}

if (skillsSection) {
  const skillObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting) {
      animateSkills();
      skillObserver.disconnect();
    }
  }, { threshold: 0.2 });
  skillObserver.observe(skillsSection);
}

/* ============================================================
   7. PROJECT FILTER
============================================================ */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active state
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const category = card.dataset.category;
      const show = filter === 'all' || category === filter;

      if (show) {
        card.style.display = '';
        // Trigger reflow for animation
        void card.offsetWidth;
        card.classList.remove('fade-out');
        card.classList.add('animate');
      } else {
        card.classList.add('fade-out');
        setTimeout(() => {
          if (card.classList.contains('fade-out')) {
            card.style.display = 'none';
          }
        }, 300);
      }
    });
  });
});

/* ============================================================
   8. CONTACT FORM VALIDATION & SUBMISSION
============================================================ */

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;

  setTimeout(() => {
    toast.classList.replace('show', 'hide');
    setTimeout(() => { toast.className = 'toast'; }, 400);
  }, 4000);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setError(inputId, errorId, message) {
  const input = document.getElementById(inputId);
  const error = document.getElementById(errorId);
  if (!input || !error) return false;

  if (!message) {
    input.classList.remove('invalid');
    error.textContent = '';
    return true;
  }

  input.classList.add('invalid');
  error.textContent = message;

  // Remove animation class then re-add to replay
  input.style.animation = 'none';
  void input.offsetWidth;
  input.style.animation = '';

  return false;
}

function validateForm(data) {
  let valid = true;

  // Name
  if (!data.name.trim()) {
    setError('name', 'nameError', 'Please enter your name.');
    valid = false;
  } else {
    setError('name', 'nameError', '');
  }

  // Email
  if (!data.email.trim()) {
    setError('email', 'emailError', 'Please enter your email address.');
    valid = false;
  } else if (!isValidEmail(data.email)) {
    setError('email', 'emailError', 'Please enter a valid email address.');
    valid = false;
  } else {
    setError('email', 'emailError', '');
  }

  // Subject
  if (!data.subject.trim()) {
    setError('subject', 'subjectError', 'Please enter a subject.');
    valid = false;
  } else {
    setError('subject', 'subjectError', '');
  }

  // Message
  if (!data.message.trim()) {
    setError('message', 'messageError', 'Please enter your message.');
    valid = false;
  } else if (data.message.trim().length < 10) {
    setError('message', 'messageError', 'Message must be at least 10 characters.');
    valid = false;
  } else {
    setError('message', 'messageError', '');
  }

  return valid;
}

contactForm && contactForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const data = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
  };

  if (!validateForm(data)) return;

  // Simulate async send
  const submitBtn = contactForm.querySelector('.btn-submit');
  const btnText = submitBtn.querySelector('span');
  const originalText = btnText ? btnText.textContent : 'Send Message';

  submitBtn.disabled = true;
  if (btnText) btnText.textContent = 'Sending…';

  setTimeout(() => {
    submitBtn.disabled = false;
    if (btnText) btnText.textContent = originalText;
    contactForm.reset();

    // Clear floating label states
    contactForm.querySelectorAll('.form-input').forEach(el => el.blur());

    showToast("✅ Message sent successfully! I'll get back to you soon.", 'success');
  }, 1500);
});

// Clear individual field errors on input
['name', 'email', 'subject', 'message'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input', () => {
    el.classList.remove('invalid');
    const errEl = document.getElementById(id + 'Error');
    if (errEl) errEl.textContent = '';
  });
});

/* ============================================================
   9. RIPPLE EFFECT ON BUTTONS
============================================================ */
document.querySelectorAll('.btn, .btn-card, .filter-btn, .social-btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;

    // Ensure button has relative positioning
    if (getComputedStyle(this).position === 'static') {
      this.style.position = 'relative';
    }

    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
  });
});

/* ============================================================
   10. KEYBOARD ACCESSIBILITY (Escape closes mobile menu)
============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navMenu.classList.contains('active')) {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }
});

/* ============================================================
   11. PERFORMANCE – lazy load animations for off-screen cards
============================================================ */
// Make sure project cards that are initially visible get the animate class
document.querySelectorAll('.project-card').forEach(card => {
  const rect = card.getBoundingClientRect();
  if (rect.top < window.innerHeight) {
    card.classList.add('animate');
  }
});
