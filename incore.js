// ==========================================================================
// INCORE SAN MARTÍN - LÓGICA DE CONTROL EXCLUSIVA DE ESTA VISTA
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initCircleNavigation();
  initSanMartinNavigation();
});

function initCircleNavigation() {
  const circlePeru = document.getElementById('circle-peru');
  if (circlePeru) {
    circlePeru.addEventListener('click', () => {
      window.location.href = '/incorePeru.html';
    });
  }
}

function initSanMartinNavigation() {
  const circleSanMartin = document.getElementById('circle-san-martin');
  if (circleSanMartin) {
    circleSanMartin.addEventListener('click', () => {
      window.location.href = '/incoreSanMartin.html';
    });
  }
}

/**
 * 1. Inicializa el cambio permanente de Modo Claro a Modo Oscuro
 * Guarda la elección en localStorage para sincronizar con la primera vista.
 */
function initThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (!themeBtn) return;

  const savedTheme = localStorage.getItem('incore_theme') || 'dark';

  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    updateThemeButtonText(themeBtn, true);
  } else {
    document.body.classList.remove('dark');
    updateThemeButtonText(themeBtn, false);
  }

  themeBtn.addEventListener('click', () => {
    const isDarkNow = document.body.classList.toggle('dark');
    const newTheme = isDarkNow ? 'dark' : 'light';
    localStorage.setItem('incore_theme', newTheme);
    updateThemeButtonText(themeBtn, isDarkNow);
  });
}

function updateThemeButtonText(button, isDark) {
  if (isDark) {
    button.innerHTML = '✴︎ <span>Modo Claro</span>';
    button.setAttribute('title', 'Cambiar a Modo Claro (para ambientes iluminados)');
  } else {
    button.innerHTML = '⏺︎ <span>Modo Oscuro</span>';
    button.setAttribute('title', 'Cambiar a Modo Oscuro (para salas con proyector)');
  }
}
