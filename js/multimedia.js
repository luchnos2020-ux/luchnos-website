/**
 * LUCHNOS - Multimedia Page JavaScript
 * Video filtering and display
 */

// Placeholder image for videos
const VIDEO_PLACEHOLDER = "assets/images/video-placeholder.svg";

let allVideos = [];

document.addEventListener('DOMContentLoaded', async () => {
  await loadVideos();
  initFilters();
});

async function loadVideos() {
  const data = await Luchnos.loadData();
  if (!data || !data.videos) {
    document.getElementById('videos-container').innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--slate);">Aucune vidéo disponible</p>';
    return;
  }

  allVideos = data.videos;
  renderVideos(allVideos);
}

function renderVideos(videos) {
  const container = document.getElementById('videos-container');
  const noResults = document.getElementById('no-results');

  if (videos.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  container.innerHTML = videos.map(video => `
    <div class="video-card" onclick="Luchnos.openVideoModal('${video.youtubeId}')">
      <div class="video-thumbnail">
        <img src="${video.thumbnail}" alt="${video.titre}" onerror="this.src='${VIDEO_PLACEHOLDER}'">
        <div class="video-play-btn">
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
        </div>
      </div>
      <div class="video-content">
        <span class="video-category">${video.categorie}</span>
        <h3 class="video-title">${video.titre}</h3>
        <p style="color: var(--slate-600); font-size: 0.875rem; margin-bottom: 0.5rem;">
          ${Luchnos.truncateText(video.description, 100)}
        </p>
        <div style="display: flex; justify-content: space-between; color: var(--slate); font-size: 0.75rem;">
          <span>${video.auteur}</span>
          <span>${video.datePublication ? Luchnos.formatDateShort(video.datePublication) : ''}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function initFilters() {
  const searchInput = document.getElementById('search-input');
  const categoryFilter = document.getElementById('category-filter');
  const sortFilter = document.getElementById('sort-filter');

  const applyFilters = Luchnos.debounce(() => {
    let filtered = [...allVideos];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.titre.toLowerCase().includes(searchTerm) ||
        video.description.toLowerCase().includes(searchTerm) ||
        video.auteur.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    const category = categoryFilter.value;
    if (category) {
      filtered = filtered.filter(video => video.categorie === category);
    }

    // Sort
    const sort = sortFilter.value;
    if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.datePublication) - new Date(b.datePublication));
    }

    renderVideos(filtered);
  }, 300);

  searchInput.addEventListener('input', applyFilters);
  categoryFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
}
