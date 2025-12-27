/**
 * LUCHNOS - Main JavaScript
 * Shared functionality across all pages
 */

// ========== DATA LOADING ==========
let siteData = null;

async function loadData() {
  if (siteData) return siteData;

  try {
    const response = await fetch('data/data.json');
    siteData = await response.json();
    return siteData;
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    return null;
  }
}

// ========== HEADER COMPONENT ==========
function renderHeader() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'index.html', label: 'Accueil' },
    { href: 'presentation.html', label: 'Présentation' },
    { href: 'qui-sommes-nous.html', label: 'Qui Sommes-Nous ?' },
    { href: 'multimedia.html', label: 'Multimédia' },
    { href: 'edition.html', label: 'Édition Plumage' },
    { href: 'evenements.html', label: 'Événements' },
    { href: 'dons.html', label: 'Nous Soutenir' },
    { href: 'contact.html', label: 'Contact' }
  ];

  const header = document.createElement('header');
  header.className = 'header';
  header.innerHTML = `
    <div class="container-custom">
      <div class="header-container">
        <a href="index.html" class="header-logo">
          <img src="assets/images/logo.png" alt="Lampe Allumée (Luchnos)">
          <div class="header-logo-text">
            <span class="header-logo-title">LAMPE ALLUMÉE</span>
            <span class="header-logo-subtitle">(LUCHNOS)</span>
          </div>
        </a>

        <nav class="nav-desktop">
          ${navLinks.map(link => `
            <a href="${link.href}" class="nav-link ${currentPage === link.href ? 'active' : ''}">${link.label}</a>
          `).join('')}
        </nav>

        <button class="menu-toggle" aria-label="Toggle menu">
          <svg class="menu-icon-open" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <svg class="menu-icon-close hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <nav class="nav-mobile">
        ${navLinks.map(link => `
          <a href="${link.href}" class="nav-link ${currentPage === link.href ? 'active' : ''}">${link.label}</a>
        `).join('')}
      </nav>
    </div>
  `;

  document.body.prepend(header);

  // Mobile menu toggle
  const menuToggle = header.querySelector('.menu-toggle');
  const navMobile = header.querySelector('.nav-mobile');
  const menuIconOpen = header.querySelector('.menu-icon-open');
  const menuIconClose = header.querySelector('.menu-icon-close');

  menuToggle.addEventListener('click', () => {
    navMobile.classList.toggle('open');
    menuIconOpen.classList.toggle('hidden');
    menuIconClose.classList.toggle('hidden');
  });

  // Close menu on link click
  navMobile.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMobile.classList.remove('open');
      menuIconOpen.classList.remove('hidden');
      menuIconClose.classList.add('hidden');
    });
  });

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ========== FOOTER COMPONENT ==========
async function renderFooter() {
  const data = await loadData();
  const site = data?.site || {};
  const socialLinks = site.socialLinks || {};

  const footer = document.createElement('footer');
  footer.className = 'footer';
  footer.innerHTML = `
    <div class="footer-main">
      <div class="container-custom">
        <div class="footer-grid">
          <!-- Logo & Description -->
          <div class="footer-section">
            <a href="index.html" class="header-logo">
              <img src="assets/images/logo.png" alt="Lampe Allumée (Luchnos)" style="height: 4rem; width: 4rem; object-fit: contain;">
              <div class="header-logo-text">
                <span class="header-logo-title">LAMPE ALLUMÉE</span>
                <span class="header-logo-subtitle">(LUCHNOS)</span>
              </div>
            </a>
            <p class="footer-description">
              Centre Missionnaire dédié à rallumer, éclairer, encourager et équiper les saints en vue de la préparation au retour de l'Époux et de répondre à son appel.
            </p>
            <div class="social-links">
              <a href="${socialLinks.facebook || '#'}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Facebook">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="${socialLinks.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="YouTube">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="${socialLinks.instagram || '#'}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="${socialLinks.whatsapp || '#'}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="WhatsApp">
                <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Navigation -->
          <div class="footer-section">
            <h4>Navigation</h4>
            <div class="footer-links">
              <a href="index.html">Accueil</a>
              <a href="presentation.html">Présentation</a>
              <a href="qui-sommes-nous.html">Qui Sommes-Nous ?</a>
              <a href="multimedia.html">Multimédia</a>
              <a href="edition.html">Édition Plumage</a>
              <a href="evenements.html">Événements</a>
              <a href="contact.html">Contact</a>
            </div>
          </div>

          <!-- Contact -->
          <div class="footer-section">
            <h4>Contact</h4>
            <div class="footer-links">
              <a href="mailto:Luchnos2020@gmail.com" class="footer-contact-item">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span>Luchnos2020@gmail.com</span>
              </a>
              <a href="mailto:fillesdesaray@gmail.com" class="footer-contact-item">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
                <span>fillesdesaray@gmail.com</span>
              </a>
              <a href="tel:+24162562910" class="footer-contact-item">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span>+241 62 56 29 10</span>
              </a>
              <a href="tel:+27787220419" class="footer-contact-item">
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
                <span>+27 78 722 0419</span>
              </a>
            </div>
          </div>

          <!-- Nous Soutenir -->
          <div class="footer-section">
            <h4>Nous Soutenir</h4>
            <p class="footer-description">
              Votre soutien permet de faire avancer l'oeuvre du Père céleste. Il ne s'agit pas de semer pour un Homme ou un groupe de personne, mais pour l'avancement du Royaume.
            </p>
            <a href="dons.html" class="btn btn-primary btn-sm">Faire un Don</a>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="container-custom">
        <p>&copy; ${new Date().getFullYear()} Centre Missionnaire Lampe Allumée (LUCHNOS). Tous droits réservés.</p>
      </div>
    </div>
  `;

  document.body.appendChild(footer);
}

// ========== UTILITY FUNCTIONS ==========

// Format date in French
function formatDate(dateString) {
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Format short date
function formatDateShort(dateString) {
  const options = {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  return new Date(dateString).toLocaleDateString('fr-FR', options);
}

// Get event status based on date
function getEventStatus(dateString) {
  const eventDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);

  const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return 'a_venir';
  if (diffDays === 0) return 'en_cours';
  return 'termine';
}

// Get status label
function getStatusLabel(status) {
  const labels = {
    'a_venir': 'À venir',
    'en_cours': 'En cours',
    'termine': 'Terminé'
  };
  return labels[status] || status;
}

// Get status badge class
function getStatusBadgeClass(status) {
  const classes = {
    'a_venir': 'badge-green',
    'en_cours': 'badge-blue',
    'termine': 'badge-primary'
  };
  return classes[status] || 'badge-primary';
}

// Get event type label
function getEventTypeLabel(type) {
  const labels = {
    'conference': 'Conférence',
    'seminaire': 'Séminaire',
    'culte': 'Culte',
    'reunion': 'Réunion',
    'autre': 'Autre'
  };
  return labels[type] || type;
}

// Truncate text
function truncateText(text, maxLength) {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
}

// Create modal
function createModal(content, options = {}) {
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  if (options.videoModal) overlay.classList.add('video-modal');

  overlay.innerHTML = `
    <div class="modal">
      ${!options.noHeader ? `
        <div class="modal-header">
          <h3>${options.title || ''}</h3>
          <button class="modal-close">&times;</button>
        </div>
      ` : ''}
      <div class="modal-body">
        ${content}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Force reflow for animation
  overlay.offsetHeight;
  overlay.classList.add('open');

  // Close handlers
  const closeModal = () => {
    overlay.classList.remove('open');
    setTimeout(() => overlay.remove(), 300);
  };

  overlay.querySelector('.modal-close')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', function escHandler(e) {
    if (e.key === 'Escape') {
      closeModal();
      document.removeEventListener('keydown', escHandler);
    }
  });

  return { overlay, close: closeModal };
}

// Open video modal
function openVideoModal(youtubeId) {
  const content = `
    <iframe
      src="https://www.youtube.com/embed/${youtubeId}?autoplay=1"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen>
    </iframe>
  `;
  createModal(content, { videoModal: true, noHeader: true });
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ========== SCROLL TO TOP ==========
function initScrollToTop() {
  window.scrollTo(0, 0);
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', async () => {
  renderHeader();
  await renderFooter();
  initScrollToTop();
});

// Export functions for use in other scripts
window.Luchnos = {
  loadData,
  formatDate,
  formatDateShort,
  getEventStatus,
  getStatusLabel,
  getStatusBadgeClass,
  getEventTypeLabel,
  truncateText,
  createModal,
  openVideoModal,
  debounce
};
