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
    return;
  }

  allBooks = data.livres;
  renderBooks(allBooks);
}

function renderBooks(books) {
  const container = document.getElementById('books-container');
  const noResults = document.getElementById('no-results');

  if (books.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  container.innerHTML = books.map(book => `
    <div class="book-card" onclick="openBookModal(${book.id})">
      <div class="book-image">
        <div class="book-cover-3d">
          <img src="${book.image}" alt="${book.titre}" onerror="this.src='${BOOK_PLACEHOLDER}'">
        </div>
        ${book.gratuit ? '<span class="book-badge badge badge-green">Gratuit</span>' : ''}
      </div>
      <div class="book-content">
        <p class="book-author">${book.auteur}</p>
        <h3 class="book-title">${book.titre}</h3>
        <p class="book-description">${book.description}</p>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
          <span style="color: var(--slate); font-size: 0.875rem;">${book.nombrePages} pages</span>
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

function openBookModal(bookId) {
  const book = allBooks.find(b => b.id === bookId);
  if (!book) return;

  const content = `
    <div style="display: grid; gap: 2rem; grid-template-columns: 1fr 2fr;">
      <div class="book-cover-3d" style="text-align: center;">
        <img src="${book.image}" alt="${book.titre}" style="max-width: 200px; margin: 0 auto;" onerror="this.src='${BOOK_PLACEHOLDER}'">
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

        <div style="display: flex; gap: 1rem; color: var(--slate); font-size: 0.875rem; margin-bottom: 1.5rem;">
          <span>${book.nombrePages} pages</span>
        </div>

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
  const searchInput = document.getElementById('search-input');
  const themeFilter = document.getElementById('theme-filter');
  const sortFilter = document.getElementById('sort-filter');

  const applyFilters = Luchnos.debounce(() => {
    let filtered = [...allBooks];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
      filtered = filtered.filter(book =>
        book.titre.toLowerCase().includes(searchTerm) ||
        book.description.toLowerCase().includes(searchTerm) ||
        book.auteur.toLowerCase().includes(searchTerm)
      );
    }

    // Theme filter
    const theme = themeFilter.value;
    if (theme) {
      filtered = filtered.filter(book => book.theme === theme);
    }

    // Sort
    const sort = sortFilter.value;
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
    }

    renderBooks(filtered);
  }, 300);

  searchInput.addEventListener('input', applyFilters);
  themeFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
}
