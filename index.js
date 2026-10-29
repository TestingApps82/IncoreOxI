// ==========================================================================
// INCORE SAN MARTÍN - LÓGICA DE CONTROL (PURO JAVASCRIPT)
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initAvatarFallback();
  initCardsAnimation();
  initCtaButton();
});

/**
 * 1. Inicializa el cambio permanente de Modo Claro a Modo Oscuro
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

/**
 * 2. Si la foto de perfil no carga o la ruta no existe, muestra las iniciales
 */
function initAvatarFallback() {
  const avatarImg = document.getElementById('profile-avatar-img');
  const fallback = document.getElementById('profile-avatar-fallback');

  if (avatarImg && fallback) {
    avatarImg.addEventListener('error', () => {
      avatarImg.style.display = 'none';
      fallback.style.display = 'flex';
    });
  }
}

/**
 * 3. Animación de las 4 tarjetas:
 *    - En reposo: todas en tamaño reducido.
 *    - Al pasar el puntero: la tarjeta seleccionada se coloca al centro y ocupa el 90% de la altura de la vista.
 *    - Al salir el puntero del escenario: todas vuelven al tamaño reducido.
 */
function initCardsAnimation() {
  const stage = document.getElementById('cards-stage');
  const cards = document.querySelectorAll('.card');

  if (!stage || !cards.length) return;

  cards.forEach(card => {
    // Al pasar el puntero sobre una tarjeta
    card.addEventListener('mouseenter', () => {
      cards.forEach(c => c.classList.remove('is-expanded'));
      card.classList.add('is-expanded');
      stage.classList.add('has-expanded');
    });

    // Soporte para pantallas táctiles (clic para expandir)
    card.addEventListener('click', () => {
      const isAlreadyExpanded = card.classList.contains('is-expanded');
      cards.forEach(c => c.classList.remove('is-expanded'));
      if (!isAlreadyExpanded) {
        card.classList.add('is-expanded');
        stage.classList.add('has-expanded');
      } else {
        stage.classList.remove('has-expanded');
      }
    });
  });

  // Cuando el puntero sale de todo el escenario de tarjetas, vuelven al tamaño reducido
  stage.addEventListener('mouseleave', () => {
    cards.forEach(c => c.classList.remove('is-expanded'));
    stage.classList.remove('has-expanded');
  });
}

/**
 * 4. Acción del botón para navegar al portal INCORE
 */
function initCtaButton() {
  const go = (id, url) => {
    const btn = document.getElementById(id);
    if (btn) btn.addEventListener('click', () => { window.location.href = url; });
  };
  go('btn-iniciar-incore', '/incore.html');
  go('btn-iniciar-oxi', '/oxi.html');
}
