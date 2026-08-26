/* ==========================================================
   PAGE NAVIGATION - FULLPAGE SCROLL
   Continuous scroll with snap points for smooth navigation
   ========================================================== */

const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('[data-page]');
const main = document.querySelector('main');

// Page order for navigation
const pageOrder = ['home', 'about', 'projects', 'contact'];

// Smooth scroll to specific page
function scrollToPage(id) {
  const targetPage = document.getElementById(id);
  if (!targetPage) return;

  targetPage.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });

  history.pushState(null, '', `#${id}`);
}

// Navigation link clicks
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('data-page');
    if (targetId) {
      scrollToPage(targetId);
    }
  });
});

// Browser back/forward buttons
window.addEventListener('popstate', () => {
  const id = window.location.hash.replace('#', '') || 'home';
  const targetPage = document.getElementById(id);
  if (targetPage) {
    targetPage.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
});

// Load initial page from hash
const initialId = window.location.hash.replace('#', '') || 'home';
if (initialId && document.getElementById(initialId)) {
  // Delay to ensure page is loaded
  setTimeout(() => {
    const targetPage = document.getElementById(initialId);
    if (targetPage) {
      targetPage.scrollIntoView({
        behavior: 'instant',
        block: 'start'
      });
    }
  }, 100);
}

// Update URL hash on scroll
let scrollTimeout;
main.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    const scrollPosition = main.scrollTop;
    const windowHeight = window.innerHeight;

    pages.forEach((page) => {
      const pageTop = page.offsetTop;
      const pageBottom = pageTop + page.offsetHeight;

      if (scrollPosition >= pageTop - windowHeight / 3 &&
          scrollPosition < pageBottom - windowHeight / 3) {
        history.replaceState(null, '', `#${page.id}`);
      }
    });
  }, 100);
});

/* ==========================================================
   SCROLL-DRIVEN ANIMATIONS
   Cinematic reveal and motion effects on scroll
   ========================================================== */

// Elements to animate on scroll
let revealElements = [];
let animFrame = null;

// Reveal handler - works in both scroll directions
function handleReveal() {
  const vh = window.innerHeight;

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();

    // Element is in viewport
    if (rect.top < vh * 0.85 && rect.bottom > vh * 0.15) {
      el.classList.add('revealed');
    }
    // Element is out of viewport
    else {
      el.classList.remove('revealed');
    }
  });

  animFrame = null;
}

// Throttled animation loop
main.addEventListener('scroll', () => {
  if (!animFrame) {
    animFrame = requestAnimationFrame(handleReveal);
  }
}, { passive: true });

// Collect all animatable elements after DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Home page elements
  const heroPhoto = document.querySelector('.hero-photo');
  const heroGreeting = document.querySelector('.hero-greeting');
  const heroHeadline = document.querySelector('.hero-headline');
  const heroTagline = document.querySelector('.hero-tagline');
  const heroActions = document.querySelector('.hero-actions');

  if (heroPhoto) heroPhoto.classList.add('scroll-reveal');
  if (heroGreeting) heroGreeting.classList.add('scroll-reveal');
  if (heroHeadline) heroHeadline.classList.add('scroll-reveal');
  if (heroTagline) heroTagline.classList.add('scroll-reveal');
  if (heroActions) heroActions.classList.add('scroll-reveal');

  // About page cards
  const aboutCards = document.querySelectorAll('.about-card');
  aboutCards.forEach(card => card.classList.add('scroll-reveal'));

  // Project cards
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => card.classList.add('scroll-reveal'));

  // Tool icons
  const toolIcons = document.querySelectorAll('.tool-icon');
  toolIcons.forEach(icon => icon.classList.add('scroll-reveal'));

  // About text content
  const aboutHeading = document.querySelector('.about-heading');
  const aboutText = document.querySelector('.about-text');
  if (aboutHeading) aboutHeading.classList.add('scroll-reveal');
  if (aboutText) aboutText.classList.add('scroll-reveal');

  // Page headers
  const pageHeaders = document.querySelectorAll('.page-header');
  pageHeaders.forEach(header => header.classList.add('scroll-reveal'));

  // Contact form
  const contactHero = document.querySelector('.contact-hero');
  const contactForm = document.querySelector('.contact-form');
  if (contactHero) contactHero.classList.add('scroll-reveal');
  if (contactForm) contactForm.classList.add('scroll-reveal');

  // Collect all reveal elements
  revealElements = document.querySelectorAll('.scroll-reveal');

  // Reveal anything already in view on initial load
  handleReveal();
});

// Parallax effect on hero photo
const heroPhoto = document.querySelector('.hero-photo');
if (heroPhoto) {
  main.addEventListener('scroll', () => {
    const scrolled = main.scrollTop;
    const rate = scrolled * 0.3;
    heroPhoto.style.transform = `translateY(${rate}px) scale(${1 - scrolled * 0.0003})`;
  });
}

// Parallax effect on about photo
const aboutPhotoFrame = document.querySelector('.about-photo-frame');
if (aboutPhotoFrame) {
  main.addEventListener('scroll', () => {
    const aboutPage = document.getElementById('about');
    if (!aboutPage) return;

    const pageTop = aboutPage.offsetTop;
    const scrolled = main.scrollTop;
    const relativeScroll = scrolled - pageTop;

    if (relativeScroll > -window.innerHeight && relativeScroll < window.innerHeight) {
      const rate = relativeScroll * 0.15;
      aboutPhotoFrame.style.transform = `translateY(${rate}px)`;
    }
  });
}

/* ==========================================================
   DARK MODE TOGGLE
   ========================================================== */

// Initialize dark mode from localStorage or system preference
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

// Toggle dark mode
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
}

// Initialize on page load
initTheme();

// Add click handler for theme toggle button
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

/* ==========================================================
   CONTACT FORM HANDLING (EmailJS)
   ========================================================== */

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  // Initialize EmailJS with your public key
  // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
  emailjs.init('j0kc172rjC0NqACzp');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.innerHTML = 'Sending...';
    submitBtn.disabled = true;

    // Get form data
    const formData = new FormData(contactForm);
    const templateParams = {
      from_name: formData.get('name'),
      from_email: formData.get('email'),
      message: formData.get('message'),
      to_email: 'karthikeyanramlingam@gmail.com' // Replace with your email
    };

    try {
      // Send email using EmailJS
      // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual values
      const response = await emailjs.send(
        'service_me2lpnh',
        'template_n8m109g',
        templateParams
      );

      if (response.status === 200) {
        // Show success message
        submitBtn.innerHTML = '✓ Message Sent!';
        submitBtn.style.background = 'var(--online)';

        // Reset form
        contactForm.reset();
      } else {
        throw new Error('Failed to send');
      }

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);

    } catch (error) {
      console.error('EmailJS Error:', error);
      // Show error message
      submitBtn.innerHTML = '✗ Error. Try again';
      submitBtn.style.background = '#DC2626';

      // Reset button after 3 seconds
      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
      }, 3000);
    }
  });
}

/* ==========================================================
   MOBILE TOOLTIP INTERACTION
   ========================================================== */

const techBadges = document.querySelectorAll('.tech-icon-badge');
techBadges.forEach((badge) => {
  badge.setAttribute('tabindex', '0');
  badge.addEventListener('click', (e) => {
    e.stopPropagation();
    const isActive = badge.classList.contains('tooltip-active');
    techBadges.forEach((b) => b.classList.remove('tooltip-active'));
    if (!isActive) {
      badge.classList.add('tooltip-active');
    }
  });
});

document.addEventListener('click', () => {
  techBadges.forEach((badge) => badge.classList.remove('tooltip-active'));
});

/* ==========================================================
   PROJECTS HORIZONTAL CAROUSEL CONTROLS
   ========================================================== */

function initProjectsCarousel() {
  const track = document.getElementById('projectsTrack');
  const prevBtn = document.getElementById('projPrevBtn');
  const nextBtn = document.getElementById('projNextBtn');
  const dots = document.querySelectorAll('.proj-dot');
  const counterEl = document.getElementById('counterCurrent');

  if (!track) return;

  const cards = track.querySelectorAll('.project-card');

  // Update button states, active dot & counter based on scroll
  function updateState() {
    const maxScroll = track.scrollWidth - track.clientWidth;
    const currentScroll = track.scrollLeft;

    if (prevBtn) {
      prevBtn.disabled = currentScroll <= 8;
    }
    if (nextBtn) {
      nextBtn.disabled = currentScroll >= maxScroll - 8;
    }

    let closestIdx = 0;
    let minDistance = Infinity;

    cards.forEach((card, idx) => {
      const cardOffset = card.offsetLeft;
      const distance = Math.abs(cardOffset - currentScroll);
      if (distance < minDistance) {
        minDistance = distance;
        closestIdx = idx;
      }
    });

    // Update Dots
    dots.forEach((dot, idx) => {
      if (idx === closestIdx) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Counter (01, 02, etc.)
    if (counterEl) {
      counterEl.textContent = String(closestIdx + 1).padStart(2, '0');
    }
  }

  // Scroll smoothly to target card index
  function scrollToIndex(idx) {
    if (!cards[idx]) return;
    const card = cards[idx];
    track.scrollTo({
      left: card.offsetLeft - 6,
      behavior: 'smooth'
    });
  }

  // Prev / Next button clicks
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const cardWidth = cards[0] ? cards[0].offsetWidth + 26 : 380;
      track.scrollBy({ left: -cardWidth, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const cardWidth = cards[0] ? cards[0].offsetWidth + 26 : 380;
      track.scrollBy({ left: cardWidth, behavior: 'smooth' });
    });
  }

  // Pagination dot clicks
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-index'), 10);
      scrollToIndex(idx);
    });
  });

  // Track scroll event
  track.addEventListener('scroll', () => {
    requestAnimationFrame(updateState);
  }, { passive: true });

  // Mouse Drag to Scroll
  let isDown = false;
  let startX;
  let scrollLeftStart;

  track.addEventListener('mousedown', (e) => {
    if (e.target.closest('a') || e.target.closest('button')) return;
    isDown = true;
    track.classList.add('is-dragging');
    startX = e.pageX - track.offsetLeft;
    scrollLeftStart = track.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mouseleave', () => {
    if (!isDown) return;
    isDown = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeftStart - walk;
  });

  // Initial update
  updateState();
  window.addEventListener('resize', updateState);
}

// Initialize carousel after DOM load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProjectsCarousel);
} else {
  initProjectsCarousel();
}