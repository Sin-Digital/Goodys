var nav = document.getElementById('mainNav');
var mobileToggle = document.getElementById('mobileToggle');
var mobileMenu = document.getElementById('mobileMenu');
var backToTop = document.getElementById('backToTop');
var navLinks = document.querySelectorAll('.nav-link');
var sections = document.querySelectorAll('section[id]');
var menuOpen = false;

// --- Navbar scroll effect ---
var lastScrollY = 0;
var navHidden = false;

function updateNav() {
  var scrollY = window.scrollY || window.pageYOffset;

  if (scrollY > 60) {
    nav.classList.add('nav-scrolled');
  } else {
    nav.classList.remove('nav-scrolled');
  }

  if (scrollY > 400 && scrollY > lastScrollY && !menuOpen) {
    if (!navHidden) {
      nav.style.webkitTransform = 'translateY(-100%)';
      nav.style.transform = 'translateY(-100%)';
      navHidden = true;
    }
  } else {
    if (navHidden) {
      nav.style.webkitTransform = 'translateY(0)';
      nav.style.transform = 'translateY(0)';
      navHidden = false;
    }
  }

  lastScrollY = scrollY;
}

window.addEventListener('scroll', updateNav, { passive: true });

// --- Active nav link based on scroll position ---
function updateActiveLink() {
  var scrollY = (window.scrollY || window.pageYOffset) + 150;

  sections.forEach(function (section) {
    var top = section.offsetTop;
    var height = section.offsetHeight;
    var id = section.getAttribute('id');

    var link = document.querySelector('.nav-link[data-section="' + id + '"]');
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
  mobileMenu.style.webkitTransform = 'translateY(0)';
  mobileMenu.style.transform = 'translateY(0)';
  mobileMenu.classList.add('mobile-menu-open');
  mobileToggle.querySelector('.hamburger-lines').classList.add('hamburger-open');
  document.body.style.overflow = 'hidden';
}

function closeMenu() {
  menuOpen = false;
  mobileMenu.style.opacity = '0';
  mobileMenu.style.pointerEvents = 'none';
  mobileMenu.style.webkitTransform = 'translateY(-8px)';
  mobileMenu.style.transform = 'translateY(-8px)';
  mobileMenu.classList.remove('mobile-menu-open');
  mobileToggle.querySelector('.hamburger-lines').classList.remove('hamburger-open');
  document.body.style.overflow = '';
}

mobileToggle.addEventListener('click', function () {
  menuOpen ? closeMenu() : openMenu();
});

mobileMenu.querySelectorAll('a').forEach(function (a) {
  a.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && menuOpen) closeMenu();
});

// --- Back to top button ---
function updateBackToTop() {
  var scrollY = window.scrollY || window.pageYOffset;
  if (scrollY > 600) {
    backToTop.style.opacity = '1';
    backToTop.style.pointerEvents = 'auto';
    backToTop.style.webkitTransform = 'translateY(0)';
    backToTop.style.transform = 'translateY(0)';
  } else {
    backToTop.style.opacity = '0';
    backToTop.style.pointerEvents = 'none';
    backToTop.style.webkitTransform = 'translateY(16px)';
    backToTop.style.transform = 'translateY(16px)';
  }
}

window.addEventListener('scroll', updateBackToTop, { passive: true });

backToTop.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Scroll reveal animations ---
if ('IntersectionObserver' in window) {
  var revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    revealObserver.observe(el);
  });
} else {
  document.querySelectorAll('.reveal').forEach(function (el) {
    el.classList.add('visible');
  });
}

// --- JS-driven infinite scroll (marquee + carousel) ---
function createInfiniteScroll(trackId, pixelsPerFrame) {
  var track = document.getElementById(trackId);
  if (!track) return;

  var children = [];
  for (var i = 0; i < track.children.length; i++) {
    children.push(track.children[i]);
  }
  if (children.length === 0) return;

  var setsNeeded = 3;
  for (var s = 0; s < setsNeeded; s++) {
    for (var j = 0; j < children.length; j++) {
      track.appendChild(children[j].cloneNode(true));
    }
  }

  var offset = 0;
  var paused = false;
  var setWidth = 0;
  var measured = false;

  function measure() {
    setWidth = 0;
    var style = window.getComputedStyle(track);
    var gap = parseFloat(style.gap) || 0;
    for (var k = 0; k < children.length; k++) {
      setWidth += children[k].getBoundingClientRect().width + gap;
    }
    measured = true;
  }

  function step() {
    if (!measured) measure();
    if (!paused && setWidth > 0) {
      offset += pixelsPerFrame;
      if (offset >= setWidth) offset -= setWidth;
      track.style.webkitTransform = 'translate3d(' + (-offset) + 'px, 0, 0)';
      track.style.transform = 'translate3d(' + (-offset) + 'px, 0, 0)';
    }
    requestAnimationFrame(step);
  }

  track.addEventListener('mouseenter', function () { paused = true; });
  track.addEventListener('mouseleave', function () { paused = false; });
  track.addEventListener('touchstart', function () { paused = true; }, { passive: true });
  track.addEventListener('touchend', function () { setTimeout(function () { paused = false; }, 300); }, { passive: true });

  window.addEventListener('resize', function () { measured = false; });

  requestAnimationFrame(step);
}

createInfiniteScroll('marqueeTrack', 1);
createInfiniteScroll('photoCarousel', 0.5);

// --- Initial state ---
updateNav();
updateActiveLink();
updateBackToTop();
