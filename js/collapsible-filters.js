// Script pour rendre les filtres repliables sur mobile pour edition, multimedia et evenements
(function() {

  function setupCollapsibleFilters(sectionSelector, filtersSelector, btnId) {
    var section = document.querySelector(sectionSelector);
    var filters = section ? section.querySelector(filtersSelector) : null;
    if (!section || !filters) return;

    // Crée le bouton
    var btn = document.createElement('button');
    btn.id = btnId;
    btn.type = 'button';
    btn.className = 'btn btn-outline btn-sm show-filters-btn';
    btn.innerHTML = '<span>Afficher les filtres</span>';
    btn.style.marginBottom = '1rem';
    btn.setAttribute('aria-expanded', 'false');
    btn.setAttribute('aria-controls', filters.id || '');

    // Ajoute le bouton avant le bloc de filtres
    section.querySelector('.container-custom').insertBefore(btn, filters);

    // Masque les filtres par défaut sur mobile (dès le chargement)
    function forceInitialMobileHide() {
      if (window.innerWidth <= 767) {
        filters.classList.add('collapsible-filters-hidden');
        btn.style.display = '';
        btn.setAttribute('aria-expanded', 'false');
        btn.querySelector('span').textContent = 'Afficher les filtres';
      } else {
        filters.classList.remove('collapsible-filters-hidden');
        btn.style.display = 'none';
      }
    }
    // Applique dès le chargement, et sur resize
    forceInitialMobileHide();
    window.addEventListener('resize', forceInitialMobileHide);

    // Toggle
    btn.addEventListener('click', function() {
      var isHidden = filters.classList.toggle('collapsible-filters-hidden');
      btn.setAttribute('aria-expanded', String(!isHidden));
      btn.querySelector('span').textContent = isHidden ? 'Afficher les filtres' : 'Masquer les filtres';
    });
  }

  document.addEventListener('DOMContentLoaded', function() {
    setupCollapsibleFilters('.section-filters', '.filters', 'toggle-filters-btn');
    // Pour evenements.html, il y a deux .filters (tabs + filtres)
    if (window.location.pathname.includes('evenements')) {
      setupCollapsibleFilters('.section-filters', '.filters:last-of-type', 'toggle-filters-btn-evenements');
    }
  });
})();
