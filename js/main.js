/**
 * Sana Hasan Portfolio - Core Vanilla JavaScript
 * Mobile Navigation, Active State Management, Project Details Modals, and Contact Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveNav();
  initContactForm();
  initProjectModals();
  initCopyActions();
});

/**
 * Mobile Navigation Menu Handler
 */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuIcon = document.getElementById('menu-icon');
  const closeIcon = document.getElementById('close-icon');

  if (!toggleBtn || !mobileMenu) return;

  function toggleMenu(isOpen) {
    const currentState = toggleBtn.getAttribute('aria-expanded') === 'true';
    const nextState = typeof isOpen === 'boolean' ? isOpen : !currentState;

    toggleBtn.setAttribute('aria-expanded', String(nextState));

    if (nextState) {
      mobileMenu.classList.remove('hidden');
      // small delay to allow transition if desired
      setTimeout(() => {
        mobileMenu.classList.remove('opacity-0', '-translate-y-2');
        mobileMenu.classList.add('opacity-100', 'translate-y-0');
      }, 10);
      if (menuIcon) menuIcon.classList.add('hidden');
      if (closeIcon) closeIcon.classList.remove('hidden');
      document.body.classList.add('overflow-hidden', 'md:overflow-auto');
    } else {
      mobileMenu.classList.add('opacity-0', '-translate-y-2');
      mobileMenu.classList.remove('opacity-100', 'translate-y-0');
      setTimeout(() => {
        mobileMenu.classList.add('hidden');
      }, 200);
      if (menuIcon) menuIcon.classList.remove('hidden');
      if (closeIcon) closeIcon.classList.add('hidden');
      document.body.classList.remove('overflow-hidden', 'md:overflow-auto');
    }
  }

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close when clicking nav links inside mobile menu
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      toggleMenu(false);
    });
  });

  // Close when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggleBtn.getAttribute('aria-expanded') === 'true') {
      toggleMenu(false);
    }
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (
      toggleBtn.getAttribute('aria-expanded') === 'true' &&
      !mobileMenu.contains(e.target) &&
      !toggleBtn.contains(e.target)
    ) {
      toggleMenu(false);
    }
  });
}

/**
 * Active Navigation Link Highlighter
 */
function initActiveNav() {
  const currentPath = window.location.pathname;
  let filename = currentPath.substring(currentPath.lastIndexOf('/') + 1);
  if (!filename || filename === '') {
    filename = 'index.html';
  }

  // Highlight in desktop and mobile links
  const navLinks = document.querySelectorAll('header nav a, #mobile-menu a');
  navLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;
    const linkFile = href.substring(href.lastIndexOf('/') + 1);

    if (linkFile === filename || (filename === '' && linkFile === 'index.html')) {
      link.classList.add('active-nav-link');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/**
 * Contact Form Interaction (Client-side validation & direct mailto fallback)
 */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const feedbackBox = document.getElementById('form-feedback');
  const mailtoActionBtn = document.getElementById('mailto-action-btn');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('sender-name');
    const emailInput = document.getElementById('sender-email');
    const subjectInput = document.getElementById('sender-subject');
    const messageInput = document.getElementById('sender-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const subject = subjectInput ? subjectInput.value.trim() : 'Project Inquiry';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) {
      alert('Please fill out all required fields (Name, Email, and Message).');
      return;
    }

    // Construct mailto link
    const mailtoSubject = encodeURIComponent(`Portfolio Inquiry: ${subject} (from ${name})`);
    const mailtoBody = encodeURIComponent(`Hi Sana,\n\n${message}\n\nFrom,\n${name}\nEmail: ${email}`);
    const mailtoURL = `mailto:hasansana998@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

    if (mailtoActionBtn) {
      mailtoActionBtn.setAttribute('href', mailtoURL);
    }

    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      feedbackBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Optionally trigger the default mail client
    window.location.href = mailtoURL;
  });
}

/**
 * Modal Lightbox for Project Previews
 */
function initProjectModals() {
  const modal = document.getElementById('project-modal');
  if (!modal) return;

  const modalTitle = document.getElementById('modal-title');
  const modalCategory = document.getElementById('modal-category');
  const modalDescription = document.getElementById('modal-description');
  const modalTags = document.getElementById('modal-tags');
  const modalContributions = document.getElementById('modal-contributions');
  const modalImg = document.getElementById('modal-img');
  const closeModalBtns = document.querySelectorAll('.close-project-modal');

  const projectTriggers = document.querySelectorAll('[data-project-trigger]');

  projectTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-project-title') || '';
      const category = btn.getAttribute('data-project-category') || '';
      const description = btn.getAttribute('data-project-description') || '';
      const tags = (btn.getAttribute('data-project-tags') || '').split(',');
      const contributions = btn.getAttribute('data-project-contributions') || '';
      const imgSrc = btn.getAttribute('data-project-img') || '';

      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalDescription) modalDescription.textContent = description;
      if (modalContributions) modalContributions.textContent = contributions;
      if (modalImg && imgSrc) {
        modalImg.setAttribute('src', imgSrc);
        modalImg.setAttribute('alt', title);
        modalImg.classList.remove('hidden');
      } else if (modalImg) {
        modalImg.classList.add('hidden');
      }

      if (modalTags) {
        modalTags.innerHTML = '';
        tags.forEach((tag) => {
          if (!tag.trim()) return;
          const span = document.createElement('span');
          span.className = 'text-xs text-[#172B4D]/70 font-mono py-1 px-2.5 bg-[#FAF7F0] border border-[#172B4D]/10 rounded-sm';
          span.textContent = tag.trim();
          modalTags.appendChild(span);
        });
      }

      modal.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }

  closeModalBtns.forEach((btn) => {
    btn.addEventListener('click', closeModal);
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
}

/**
 * Quick Copy Actions (Email to clipboard)
 */
function initCopyActions() {
  const copyBtns = document.querySelectorAll('[data-copy-email]');
  copyBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const email = 'hasansana998@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = btn.innerHTML;
        btn.innerHTML = `<span class="text-emerald-700">Copied hasansana998@gmail.com</span>`;
        setTimeout(() => {
          btn.innerHTML = originalText;
        }, 2200);
      }).catch(() => {
        window.location.href = `mailto:${email}`;
      });
    });
  });
}
