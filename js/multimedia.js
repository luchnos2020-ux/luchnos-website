/**
 * LUCHNOS - Multimedia Page JavaScript
 * Video filtering and display
 */

// Placeholder image for videos
const VIDEO_PLACEHOLDER = "assets/images/video-placeholder.svg";

let allVideos = [];
let videosPerPage = 6;
let currentPage = 1;
let filteredVideos = [];

// Generic boilerplate description to hide
const GENERIC_DESCRIPTION_PREFIX = "Pour plus de détails sur nous et si vous souhaitez télécharger";

function isGenericDescription(description) {
  if (!description || description.trim() === '') return true;
  return description.startsWith(GENERIC_DESCRIPTION_PREFIX);
}

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

  // Sort videos by most recent first (with fallback to ID if no date)
  allVideos = data.videos.sort((a, b) => {
    const dateA = a.datePublication ? new Date(a.datePublication).getTime() : 0;
    const dateB = b.datePublication ? new Date(b.datePublication).getTime() : 0;
    
    if (dateA !== dateB) {
      return dateB - dateA; // Most recent first
    }
    
    // Fallback to ID if dates are equal
    return (b.id || 0) - (a.id || 0);
  });
  
  filteredVideos = [...allVideos];
  currentPage = 1;

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

  renderVideos(filteredVideos);
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

  // Calculate pagination - show all videos up to current page
  const endIndex = currentPage * videosPerPage;
  const displayedVideos = videos.slice(0, endIndex);
  const hasMore = endIndex < videos.length;

  // Clear container and add all displayed videos
  container.innerHTML = displayedVideos.map(video => `
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
${!isGenericDescription(video.description) ? `
        <p style="color: var(--slate-600); font-size: 0.875rem; margin-bottom: 0.5rem;">
          ${Luchnos.truncateText(video.description, 100)}
        </p>
` : ''}
        <div style="display: flex; justify-content: space-between; color: var(--slate); font-size: 0.75rem;">
          <span>${video.auteur}</span>
          <span>${video.datePublication ? Luchnos.formatDateShort(video.datePublication) : ''}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Add "Voir plus" button if there are more videos
  if (hasMore) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'grid-column: 1/-1; display: flex; justify-content: center; margin-top: 2rem;';
    buttonContainer.innerHTML = `
      <button id="load-more-btn" class="btn btn-lg btn-round" style="background: var(--primary); color: white;">
        Voir plus de vidéos
      </button>
    `;
    container.appendChild(buttonContainer);
    
    document.getElementById('load-more-btn').addEventListener('click', () => {
      currentPage++;
      renderVideos(videos);
    });
  }
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
    const sort = sortFilter.value || 'recent'; // Default to recent
    if (sort === 'recent') {
      filtered.sort((a, b) => {
        const dateA = a.datePublication ? new Date(a.datePublication).getTime() : 0;
        const dateB = b.datePublication ? new Date(b.datePublication).getTime() : 0;
        
        if (dateA !== dateB) {
          return dateB - dateA; // Most recent first
        }
        
        // Fallback to ID if dates are equal
        return (b.id || 0) - (a.id || 0);
      });
    } else if (sort === 'oldest') {
      filtered.sort((a, b) => {
        const dateA = a.datePublication ? new Date(a.datePublication).getTime() : 0;
        const dateB = b.datePublication ? new Date(b.datePublication).getTime() : 0;
        
        if (dateA !== dateB) {
          return dateA - dateB; // Oldest first
        }
        
        // Fallback to ID if dates are equal
        return (a.id || 0) - (b.id || 0);
      });
    } else if (sort === 'views') {
      filtered.sort((a, b) => (b.vues || 0) - (a.vues || 0));
    }

    filteredVideos = filtered;
    currentPage = 1;
    renderVideos(filtered);
  }, 300);

  searchInput.addEventListener('input', applyFilters);
  themeFilter.addEventListener('change', applyFilters);
  auteurFilter.addEventListener('change', applyFilters);
  anneeFilter.addEventListener('change', applyFilters);
  sortFilter.addEventListener('change', applyFilters);
}