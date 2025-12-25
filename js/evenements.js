/**
 * LUCHNOS - Events Page JavaScript
 * Event filtering and display
 */

// Placeholder image for events
const EVENT_PLACEHOLDER = "assets/images/event-placeholder.svg";

let allEvents = [];
let currentStatus = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  await loadEvents();
  initTabs();
  initFilters();
});

async function loadEvents() {
  const data = await Luchnos.loadData();
  if (!data || !data.evenements) {
    document.getElementById('events-container').innerHTML = '<p class="text-center" style="grid-column: 1/-1; color: var(--slate);">Aucun événement disponible</p>';
    return;
  }

  // Update status based on actual dates
  allEvents = data.evenements.map(event => ({
    ...event,
    statut: Luchnos.getEventStatus(event.date)
  }));

  renderEvents(allEvents);
}

function renderEvents(events) {
  const container = document.getElementById('events-container');
  const noResults = document.getElementById('no-results');

  if (events.length === 0) {
    container.innerHTML = '';
    noResults.classList.remove('hidden');
    return;
  }

  noResults.classList.add('hidden');

  container.innerHTML = events.map(event => `
    <div class="event-card card-lift" onclick="openEventModal(${event.id})">
      <div class="event-image ${event.statut === 'a_venir' ? 'event-image-3d upcoming' : 'event-image-3d'}">
        <img src="${event.image}" alt="${event.titre}" onerror="this.src='${EVENT_PLACEHOLDER}'">
        <div class="event-badges">
          <span class="badge ${Luchnos.getStatusBadgeClass(event.statut)}">${Luchnos.getStatusLabel(event.statut)}</span>
          <span class="badge badge-gold">${Luchnos.getEventTypeLabel(event.type)}</span>
        </div>
      </div>
      <div class="event-content">
        <h3 style="font-size: 1.125rem; font-weight: 700; color: var(--primary); margin-bottom: 0.5rem;">${event.titre}</h3>
        <p style="color: var(--slate-600); font-size: 0.875rem; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
          ${event.description}
        </p>
        <div class="event-meta">
          <span class="event-meta-item">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
            ${Luchnos.formatDateShort(event.date)}
          </span>
          <span class="event-meta-item">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            ${event.heure}
          </span>
          <span class="event-meta-item">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            ${event.lieu}
          </span>
        </div>
      </div>
    </div>
  `).join('');
}

function openEventModal(eventId) {
  const event = allEvents.find(e => e.id === eventId);
  if (!event) return;

  const content = `
    <div>
      <div style="position: relative; height: 250px; margin: -1.5rem -1.5rem 1.5rem; overflow: hidden; border-radius: var(--radius-xl) var(--radius-xl) 0 0;">
        <img src="${event.image}" alt="${event.titre}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${EVENT_PLACEHOLDER}'">
        <div style="position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.7), transparent);"></div>
        <div style="position: absolute; bottom: 1rem; left: 1.5rem; right: 1.5rem;">
          <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
            <span class="badge ${Luchnos.getStatusBadgeClass(event.statut)}">${Luchnos.getStatusLabel(event.statut)}</span>
            <span class="badge badge-gold">${Luchnos.getEventTypeLabel(event.type)}</span>
          </div>
          <h2 style="color: white; font-size: 1.5rem; font-weight: 700;">${event.titre}</h2>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
        <div class="card" style="padding: 1rem; text-align: center;">
          <svg width="24" height="24" fill="var(--gold)" viewBox="0 0 24 24" style="margin: 0 auto 0.5rem;"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
          <p style="font-size: 0.75rem; color: var(--slate); margin-bottom: 0.25rem;">Date</p>
          <p style="font-weight: 600; color: var(--primary);">${Luchnos.formatDateShort(event.date)}</p>
        </div>
        <div class="card" style="padding: 1rem; text-align: center;">
          <svg width="24" height="24" fill="var(--gold)" viewBox="0 0 24 24" style="margin: 0 auto 0.5rem;"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
          <p style="font-size: 0.75rem; color: var(--slate); margin-bottom: 0.25rem;">Heure</p>
          <p style="font-weight: 600; color: var(--primary);">${event.heure}</p>
        </div>
        <div class="card" style="padding: 1rem; text-align: center;">
          <svg width="24" height="24" fill="var(--gold)" viewBox="0 0 24 24" style="margin: 0 auto 0.5rem;"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
          <p style="font-size: 0.75rem; color: var(--slate); margin-bottom: 0.25rem;">Lieu</p>
          <p style="font-weight: 600; color: var(--primary);">${event.lieu}</p>
        </div>
      </div>

      <h3 style="font-weight: 600; color: var(--primary); margin-bottom: 0.75rem;">Description</h3>
      <p style="color: var(--slate-700); line-height: 1.8; text-align: justify; margin-bottom: 1.5rem;">
        ${event.description}
      </p>

      ${event.statut === 'a_venir' ? `
        <a href="contact.html" class="btn btn-primary btn-lg" style="width: 100%;">
          Nous contacter pour plus d'informations
        </a>
      ` : ''}
    </div>
  `;

  Luchnos.createModal(content, { title: '' });
}

function initTabs() {
  const tabs = document.querySelectorAll('#status-tabs .tab');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentStatus = tab.dataset.status;
      applyAllFilters();
    });
  });
}

function initFilters() {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');

  searchInput.addEventListener('input', Luchnos.debounce(applyAllFilters, 300));
  typeFilter.addEventListener('change', applyAllFilters);
}

function applyAllFilters() {
  const searchInput = document.getElementById('search-input');
  const typeFilter = document.getElementById('type-filter');

  let filtered = [...allEvents];

  // Status filter (from tabs)
  if (currentStatus !== 'all') {
    filtered = filtered.filter(event => event.statut === currentStatus);
  }

  // Search filter
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (searchTerm) {
    filtered = filtered.filter(event =>
      event.titre.toLowerCase().includes(searchTerm) ||
      event.description.toLowerCase().includes(searchTerm) ||
      event.lieu.toLowerCase().includes(searchTerm)
    );
  }

  // Type filter
  const type = typeFilter.value;
  if (type) {
    filtered = filtered.filter(event => event.type === type);
  }

  // Sort by date (upcoming first, then by date)
  filtered.sort((a, b) => {
    if (a.statut === 'a_venir' && b.statut !== 'a_venir') return -1;
    if (a.statut !== 'a_venir' && b.statut === 'a_venir') return 1;
    return new Date(a.date) - new Date(b.date);
  });

  renderEvents(filtered);
}
