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
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="${socialLinks.youtube || '#'}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="YouTube">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
              </a>
              <a href="${socialLinks.instagram || '#'}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="Instagram">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </a>
              <a href="${socialLinks.whatsapp || '#'}" target="_blank" rel="noopener noreferrer" class="social-link" aria-label="WhatsApp">
                <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
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
