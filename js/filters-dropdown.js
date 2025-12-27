// JS pour menu déroulant des filtres (édition)
(function() {
  function closeDropdown(menu, btn) {
    menu.style.display = 'none';
    btn.setAttribute('aria-expanded', 'false');
  }
  function openDropdown(menu, btn) {
    menu.style.display = 'flex';
    btn.setAttribute('aria-expanded', 'true');
  }
  document.addEventListener('DOMContentLoaded', function() {
    var btn = document.getElementById('filters-dropdown-btn');
    var menu = document.getElementById('filters-dropdown-menu');
    if (!btn || !menu) return;
    btn.setAttribute('aria-haspopup', 'true');
    btn.setAttribute('aria-expanded', 'false');
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      if (menu.style.display === 'flex') {
        closeDropdown(menu, btn);
      } else {
        openDropdown(menu, btn);
      }
    });
    // Fermer si clic en dehors
    document.addEventListener('click', function(e) {
      if (!menu.contains(e.target) && e.target !== btn) {
        closeDropdown(menu, btn);
      }
    });
    // Accessibilité : fermer avec Echap
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') closeDropdown(menu, btn);
    });
  });
})();
