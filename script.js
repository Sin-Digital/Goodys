const nav = document.getElementById('mainNav');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const backToTop = document.getElementById('backToTop');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
let menuOpen = false;

// --- Navbar scroll effect ---
let lastScrollY = 0;
let navHidden = false;

function updateNav() {
  const scrollY = window.scrollY;

  if (scrollY > 60) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }

  if (scrollY > 400 && scrollY > lastScrollY && !menuOpen) {
    if (!navHidden) {
      nav.style.transform = 'translateY(-100%)';
      navHidden = true;
    }
  } else {
    if (navHidden) {
      nav.style.transform = 'translateY(0)';
      navHidden = false;
    }
  }

  lastScrollY = scrollY;
}

window.addEventListener('scroll', updateNav, { passive: true });

// --- Active nav link based on scroll position ---
function updateActiveLink() {
  const scrollY = window.scrollY + 150;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    const link = document.querySelector(`.nav-link[data-section="${id}"]`);
    if (!link) return;

    if (scrollY >= top && scrollY < top + height) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });

// --- Mobile menu toggle ---
function openMenu() {
  menuOpen = true;
  mobileMenu.style.opacity = '1';
  mobileMenu.style.pointerEvents = 'auto';
  mobileMenu.style.transform = 'translateY(0)';
  mobileMenu.classList.add('mobile-menu-open');
  mobileToggle.querySelector('.hamburger-lines').classList.add('hamburger-open');
  mobileToggle.setAttribute('aria-label', 'Navigation schliessen');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.style.opacity = '0';
  mobileMenu.style.pointerEvents = 'none';
  mobileMenu.style.transform = 'translateY(-8px)';
  mobileMenu.classList.remove('mobile-menu-open');
  mobileToggle.querySelector('.hamburger-lines').classList.remove('hamburger-open');
  mobileToggle.setAttribute('aria-label', 'Navigation öffnen');
  document.body.style.overflow = '';
}

mobileToggle.addEventListener('click', () => {
  menuOpen ? closeMenu() : openMenu();
});

mobileMenu.querySelectorAll('a').forEach((a) => {
  a.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});

// --- Back to top button ---
function updateBackToTop() {
  if (window.scrollY > 600) {
    backToTop.style.opacity = '1';
    backToTop.style.pointerEvents = 'auto';
    backToTop.style.transform = 'translateY(0)';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.pointerEvents = 'none';
    backToTop.style.transform = 'translateY(16px)';
  }
}

window.addEventListener('scroll', updateBackToTop, { passive: true });

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Scroll reveal animations ---
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach((el) => {
  revealObserver.observe(el);
});

// --- Photo carousel (infinite, cross-platform) ---
(function () {
  const track = document.getElementById('photoCarousel');
  if (!track) return;

  const items = Array.from(track.children);
  const gap = window.innerWidth >= 640 ? 12 : 8;

  items.forEach((item) => {
    const clone = item.cloneNode(true);
    track.appendChild(clone);
  });

  let offset = 0;
  let paused = false;
  const speed = 0.5;

  function getResetPoint() {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      total += items[i].offsetWidth + gap;
    }
    return total;
  }

  function animate() {
    if (!paused) {
      offset += speed;
      const resetAt = getResetPoint();
      if (offset >= resetAt) offset -= resetAt;
      track.style.transform = 'translateX(' + (-offset) + 'px)';
    }
    requestAnimationFrame(animate);
  }

  track.addEventListener('mouseenter', () => { paused = true; });
  track.addEventListener('mouseleave', () => { paused = false; });
  track.addEventListener('touchstart', () => { paused = true; }, { passive: true });
  track.addEventListener('touchend', () => { paused = false; }, { passive: true });

  requestAnimationFrame(animate);
})();

// --- Initial state ---
updateNav();
updateActiveLink();
updateBackToTop();
