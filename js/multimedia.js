/**
 * LUCHNOS - Multimedia Page JavaScript
 * Video filtering and display
 */

// Placeholder image for videos
const VIDEO_PLACEHOLDER = "assets/images/video-placeholder.svg";

let allVideos = [];

// Extract YouTube ID from URL
function getYoutubeId(video) {
  // If youtubeId exists, use it directly
  if (video.youtubeId) return video.youtubeId;

  // Extract from youtubeUrl
  if (video.youtubeUrl) {
    const match = video.youtubeUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
    if (match) return match[1];
  }
  return '';
}

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

  // Populate theme filter dynamically
  const themes = [...new Set(allVideos.map(v => v.categorie).filter(Boolean))].sort();
  const themeFilter = document.getElementById('theme-filter');
  themes.forEach(theme => {
    const option = document.createElement('option');
    option.value = theme;
    option.textContent = theme;
    themeFilter.appendChild(option);
  });

  // Populate auteur filter dynamically
  const auteurs = [...new Set(allVideos.map(v => v.auteur).filter(Boolean))].sort();
  const auteurFilter = document.getElementById('auteur-filter');
  auteurs.forEach(auteur => {
    const option = document.createElement('option');
    option.value = auteur;
    option.textContent = auteur;
    auteurFilter.appendChild(option);
  });

  // Populate annee filter dynamically
  const annees = [...new Set(allVideos.map(v => v.anneePublication || (v.datePublication ? new Date(v.datePublication).getFullYear() : null)).filter(Boolean))].sort((a, b) => b - a);
  const anneeFilter = document.getElementById('annee-filter');
  annees.forEach(annee => {
    const option = document.createElement('option');
    option.value = annee;
    option.textContent = annee;
    anneeFilter.appendChild(option);
  });

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
    <div class="video-card" onclick="Luchnos.openVideoModal('${getYoutubeId(video)}')">
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
  const themeFilter = document.getElementById('theme-filter');
  const auteurFilter = document.getElementById('auteur-filter');
  const anneeFilter = document.getElementById('annee-filter');
  const sortFilter = document.getElementById('sort-filter');

  const applyFilters = Luchnos.debounce(() => {
    let filtered = [...allVideos];

    // Search filter
    const searchTerm = searchInput.value.toLowerCase().trim();
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.titre.toLowerCase().includes(searchTerm) ||
        video.description?.toLowerCase().includes(searchTerm)
      );
    }

    // Theme filter
    const theme = themeFilter.value;
    if (theme) {
      filtered = filtered.filter(video => video.categorie === theme);
    }

    // Auteur filter
    const auteur = auteurFilter.value;
    if (auteur) {
      filtered = filtered.filter(video => video.auteur === auteur);
    }

    // Annee filter
    const annee = anneeFilter.value;
    if (annee) {
      filtered = filtered.filter(video => {
        const videoYear = video.anneePublication || (video.datePublication ? new Date(video.datePublication).getFullYear() : null);
        return videoYear == annee;
      });
    }

    // Sort
    const sort = sortFilter.value;
    if (sort === 'recent') {
      filtered.sort((a, b) => new Date(b.datePublication) - new Date(a.datePublication));
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => new Date(a.datePublication) - new Date(b.datePublication));
    } else if (sort === 'views') {
      filtered.sort((a, b) => (b.vues || 0) - (a.vues || 0));
    }

    renderVideos(filtered);
  }, 300);

  searchInput.addEventListener('input', applyFilters);
  themeFilter.addEventListener('change', applyFilters);
  auteurFilter.addEventListener('change', applyFilters);
  anneeFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
}