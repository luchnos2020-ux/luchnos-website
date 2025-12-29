/**
 * LUCHNOS - Edition Page JavaScript
 * Book filtering and display
 */

// Placeholder image for books
const BOOK_PLACEHOLDER = "assets/images/book-placeholder.svg";

let allBooks = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadBooks();
  initFilters();
});

async function loadBooks() {
  const data = await Luchnos.loadData();
  if (!data || !data.livres) {
    document.getElementById('books-container').innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--slate);">Aucun livre disponible</p>';
    updateResultsCount(0);
    return;
  }

  allBooks = data.livres;

  // Populate theme filter dynamically
  const themes = [...new Set(allBooks.map(b => b.theme).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
  const themeFilter = document.getElementById('theme-filter');
  themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    themeFilter.appendChild(option);
  });

  // Populate langue filter dynamically
  const langues = [...new Set(allBooks.map(b => b.langue).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'fr'));
  const langueFilter = document.getElementById('langue-filter');
  langues.forEach(langue => {
    const option = document.createElement('option');
    option.value = langue;
    option.textContent = langue;
    langueFilter.appendChild(option);
  });

  renderBooks(allBooks);
}

function updateResultsCount(count) {
  const resultsCount = document.getElementById('results-count');
  if (resultsCount) {
    resultsCount.textContent = `${count} livre(s) trouvé(s)`;
  }
}

function renderBooks(books) {
  const container = document.getElementById('books-container');
  const noResults = document.getElementById('no-results');

  updateResultsCount(books.length);

  if (books.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  function getImageSrc(img) {
    if (!img) return BOOK_PLACEHOLDER;
    // Google Drive file link - use lh3.googleusercontent.com for reliable embedding
    const match = img.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
    if (match) {
      return `https://lh3.googleusercontent.com/d/${match[1]}`;
    }
    return img;
  }
  container.innerHTML = books.map(book => `
    <div class="book-card" onclick="openBookModal(${book.id})">
      <div class="book-image">
        <div class="book-cover-3d">
          <img src="${getImageSrc(book.image)}" alt="${book.titre}" onerror="this.src='${BOOK_PLACEHOLDER}'">
        </div>
        ${book.gratuit ? '<span class="book-badge badge badge-green">Gratuit</span>' : ''}
      </div>
      <div class="book-content">
        <p class="book-author">${book.auteur}</p>
        <h3 class="book-title">${book.titre}</h3>
        <p class="book-description">${book.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          ${book.nombrePages ? `<span style="color: var(--slate); font-size: 0.875rem;">${book.nombrePages} pages</span>` : '<span></span>'}
          ${book.gratuit && book.pdfUrl ? `
            <a href="${book.pdfUrl}" class="btn btn-sm btn-primary" onclick="event.stopPropagation();" target="_blank">
              Télécharger
            </a>
          ` : `
            <span style="color: var(--gold); font-weight: 600;">
              ${book.prix > 0 ? book.prix + ' €' : 'Gratuit'}
            </span>
          `}
        </div>
      </div>
    </div>
  `).join('');
}

function getBookImageSrc(img) {
  if (!img) return BOOK_PLACEHOLDER;
  const match = img.match(/drive\.google\.com\/file\/d\/([\w-]+)/);
  if (match) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return img;
}

function openBookModal(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;
  const bookImageUrl = getBookImageSrc(book.image);

  const content = `
    <div style="display: grid; gap: 2rem; grid-template-columns: 1fr 2fr;">
      <div class="book-cover-3d" style="text-align: center;">
        <img src="${bookImageUrl}" alt="${book.titre}" style="max-width: 200px; margin: 0 auto;" onerror="this.src='${BOOK_PLACEHOLDER}'">
      </div>
      <div>
        <p style="color: var(--copper); font-size: 0.875rem; margin-bottom: 0.5rem;">${book.auteur}</p>
        <h2 style="color: var(--primary); font-size: 1.5rem; font-weight: 700; margin-bottom: 1rem;">${book.titre}</h2>

        <div style="display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap;">
          ${book.gratuit ? '<span class="badge badge-green">Gratuit</span>' : ''}
          <span class="badge badge-primary">${book.theme}</span>
          <span class="badge" style="background: var(--slate-200); color: var(--slate-700);">${book.langue}</span>
        </div>

        <p style="color: var(--slate-700); line-height: 1.8; margin-bottom: 1.5rem; text-align: justify;">
          ${book.description}
        </p>

${book.nombrePages ? `
        <div style="display: flex; gap: 1rem; color: var(--slate); font-size: 0.875rem; margin-bottom: 1.5rem;">
          <span>${book.nombrePages} pages</span>
        </div>
` : ''}

        ${book.gratuit && book.pdfUrl ? `
          <a href="${book.pdfUrl}" class="btn btn-primary btn-lg" target="_blank">
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" style="margin-right: 0.5rem;"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            Télécharger le PDF
          </a>
        ` : `
          <p style="color: var(--slate-600); font-style: italic;">
            Ce livre sera bientôt disponible en téléchargement.
          </p>
        `}
      </div>
    </div>
  `;

  Luchnos.createModal(content, { title: 'Détails du livre' });
}

function initFilters() {
  // Dropdown (mobile)
  const searchInput = document.getElementById('search-input');
  const themeFilter = document.getElementById('theme-filter');
  const langueFilter = document.getElementById('langue-filter');
  const auteurFilter = document.getElementById('auteur-filter');
  const sortFilter = document.getElementById('sort-filter');
  // Inline (desktop/tablette)
  const searchInputInline = document.getElementById('search-input-inline');
  const themeFilterInline = document.getElementById('theme-filter-inline');
  const langueFilterInline = document.getElementById('langue-filter-inline');
  const auteurFilterInline = document.getElementById('auteur-filter-inline');
  const sortFilterInline = document.getElementById('sort-filter-inline');

  function getActiveFilters() {
    // Si mobile (dropdown visible), on prend les valeurs du dropdown, sinon inline
    const isMobile = window.innerWidth <= 767;
    return {
      search: isMobile && searchInput ? searchInput.value : (searchInputInline ? searchInputInline.value : ''),
      theme: isMobile && themeFilter ? themeFilter.value : (themeFilterInline ? themeFilterInline.value : ''),
      langue: isMobile && langueFilter ? langueFilter.value : (langueFilterInline ? langueFilterInline.value : ''),
      auteur: isMobile && auteurFilter ? auteurFilter.value : (auteurFilterInline ? auteurFilterInline.value : ''),
      sort: isMobile && sortFilter ? sortFilter.value : (sortFilterInline ? sortFilterInline.value : 'recent'),
    };
  }

  const applyFilters = Luchnos.debounce(() => {
    let filtered = [...allBooks];
    const filters = getActiveFilters();
    // Search filter
    const searchTerm = filters.search.toLowerCase().trim();
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.titre.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm) ||
        book.auteur.toLowerCase().includes(searchTerm)
      );
    }
    // Theme filter
    const theme = filters.theme;
    if (theme) {
      filtered = filtered.filter(book =>
        book.theme?.toLowerCase().includes(theme.toLowerCase()) ||
        book.categorie?.toLowerCase().includes(theme.toLowerCase())
      );
    }
    // Langue filter
    const langue = filters.langue;
    if (langue) {
      filtered = filtered.filter(book => book.langue?.toLowerCase() === langue.toLowerCase());
    }
    // Auteur filter
    const auteur = filters.auteur.toLowerCase().trim();
    if (auteur) {
      filtered = filtered.filter(book => book.auteur?.toLowerCase().includes(auteur));
    }
    // Sort
    const sort = filters.sort;
    switch (sort) {
      case 'recent':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'title':
        filtered.sort((a, b) => a.titre.localeCompare(b.titre));
        break;
      case 'author':
        filtered.sort((a, b) => a.auteur.localeCompare(b.auteur));
        break;
      case 'views':
        if (filtered[0] && filtered[0].views !== undefined) {
          filtered.sort((a, b) => b.views - a.views);
        }
        break;
    }
    renderBooks(filtered);
  }, 300);

  // Dropdown (mobile)
  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (themeFilter) themeFilter.addEventListener('change', applyFilters);
  if (langueFilter) langueFilter.addEventListener('change', applyFilters);
  if (auteurFilter) auteurFilter.addEventListener('input', applyFilters);
  if (sortFilter) sortFilter.addEventListener('change', applyFilters);
  // Inline (desktop/tablette)
  if (searchInputInline) searchInputInline.addEventListener('input', applyFilters);
  if (themeFilterInline) themeFilterInline.addEventListener('change', applyFilters);
  if (langueFilterInline) langueFilterInline.addEventListener('change', applyFilters);
  if (auteurFilterInline) auteurFilterInline.addEventListener('input', applyFilters);
  if (sortFilterInline) sortFilterInline.addEventListener('change', applyFilters);

  // Synchronisation des valeurs entre dropdown et inline (pour garder la même sélection si on change de taille d'écran)
  function syncFilters() {
    if (themeFilter && themeFilterInline) themeFilterInline.value = themeFilter.value;
    if (langueFilter && langueFilterInline) langueFilterInline.value = langueFilter.value;
    if (auteurFilter && auteurFilterInline) auteurFilterInline.value = auteurFilter.value;
    if (sortFilter && sortFilterInline) sortFilterInline.value = sortFilter.value;
    if (searchInput && searchInputInline) searchInputInline.value = searchInput.value;
  }
  function syncFiltersReverse() {
    if (themeFilter && themeFilterInline) themeFilter.value = themeFilterInline.value;
    if (langueFilter && langueFilterInline) langueFilter.value = langueFilterInline.value;
    if (auteurFilter && auteurFilterInline) auteurFilter.value = auteurFilterInline.value;
    if (sortFilter && sortFilterInline) sortFilter.value = sortFilterInline.value;
    if (searchInput && searchInputInline) searchInput.value = searchInputInline.value;
  }
  window.addEventListener('resize', function() {
    if (window.innerWidth <= 767) syncFiltersReverse();
    else syncFilters();
  });
  // Initial sync
  if (window.innerWidth <= 767) syncFiltersReverse();
  else syncFilters();
}