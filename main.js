/* ============================================================
   PORTFOLIO JavaScript — Khengie Luiz D. Gernalin
   ============================================================ */

// ── NAVBAR ──────────────────────────────────────────────────
const navbar   = document.getElementById('navbar');
const backToTop= document.getElementById('backToTop');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  navbar.classList.toggle('scrolled', y > 60);
  backToTop.classList.toggle('visible', y > 400);
  highlightActiveSection();
}, { passive: true });

// ── HAMBURGER & BOOTSTRAP COLLAPSE ───────────────────────────
const navNavbar = document.getElementById('navNavbar');
const hamburger = document.getElementById('hamburger');

if (navNavbar && hamburger) {
  navNavbar.addEventListener('show.bs.collapse', () => {
    const spans = hamburger.querySelectorAll('span');
    if (spans.length >= 3) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    }
  });

  navNavbar.addEventListener('hide.bs.collapse', () => {
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
}

// Auto-close collapse when a link is clicked on mobile
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    if (navNavbar && navNavbar.classList.contains('show') && window.bootstrap) {
      const bsCollapse = bootstrap.Collapse.getInstance(navNavbar);
      if (bsCollapse) {
        bsCollapse.hide();
      }
    }
  });
});

// ── ACTIVE SECTION HIGHLIGHT ─────────────────────────────────
const sections = document.querySelectorAll('section[id]');

function highlightActiveSection() {
  const mid = window.scrollY + window.innerHeight * 0.4;
  sections.forEach(sec => {
    const link = document.querySelector(`.nav-link[href="#${sec.id}"]`);
    if (!link) return;
    const inView = mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight;
    link.classList.toggle('active', inView);
  });
}

// ── SMOOTH SCROLL ─────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
  });
});

// ── REVEAL ON SCROLL ─────────────────────────────────────────
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      // Stagger delay based on position
      entry.target.style.transitionDelay = (i * 0.06) + 's';
      entry.target.classList.add('visible');

      // Animate skill bars inside
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.classList.add('animated');
      });
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

// Also animate all skill fills when their column becomes visible
const skillColObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(f => f.classList.add('animated'));
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-column').forEach(col => skillColObs.observe(col));

// ── CONTACT FORM ──────────────────────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');

  btn.textContent = 'Sending…';
  btn.disabled    = true;
  btn.style.opacity = '0.65';

  setTimeout(() => {
    btn.style.display   = 'none';
    success.style.display = 'block';
    document.getElementById('contactForm').reset();
  }, 1400);
}

// ── PROFILE TILT (hero) ───────────────────────────────────────
const profileFrame = document.querySelector('.profile-frame');
if (profileFrame) {
  profileFrame.addEventListener('mousemove', e => {
    const r = profileFrame.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width  / 2) / r.width;
    const y = (e.clientY - r.top  - r.height / 2) / r.height;
    profileFrame.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg)`;
    profileFrame.style.transition = 'transform 0.1s ease';
  });
  profileFrame.addEventListener('mouseleave', () => {
    profileFrame.style.transform  = '';
    profileFrame.style.transition = 'transform 0.5s ease';
  });
}

// ── SUBTLE CURSOR GLOW ─────────────────────────────────────────
const glow = document.createElement('div');
glow.style.cssText = [
  'position:fixed', 'pointer-events:none', 'z-index:9998',
  'width:350px', 'height:350px', 'border-radius:50%',
  'background:radial-gradient(circle, rgba(124,111,255,0.05) 0%, transparent 70%)',
  'transform:translate(-50%,-50%)',
  'transition:left 0.2s ease, top 0.2s ease',
  'left:-999px', 'top:-999px'
].join(';');
document.body.appendChild(glow);

let glowRaf;
document.addEventListener('mousemove', e => {
  cancelAnimationFrame(glowRaf);
  glowRaf = requestAnimationFrame(() => {
    glow.style.left = e.clientX + 'px';
    glow.style.top  = e.clientY + 'px';
  });
});

// ── NUMBER COUNTER ANIMATION ──────────────────────────────────
function animateCounter(el, target, duration = 1500) {
  let start = 0;
  const step = timestamp => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    el.textContent = Math.floor(progress * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const statsObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        const val = parseInt(num.textContent);
        if (!isNaN(val)) {
          const accent = num.querySelector('.accent');
          animateCounter(num, val);
          if (accent) {
            setTimeout(() => num.appendChild(accent), 1200);
          }
        }
      });
      statsObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero-stats');
if (statsSection) statsObs.observe(statsSection);

// ── INIT ──────────────────────────────────────────────────────
highlightActiveSection();
