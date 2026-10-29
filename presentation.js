// INCORE · herramientas de exposición (compartidas). Atajos: P exposición · F pantalla completa ·
// L puntero láser · B pantalla negra · T tema claro/oscuro · ? ayuda · Esc salir
(() => {
  const LS = 'incore_present';
  const root = document.documentElement, body = document.body;
  const $ = (tag, id, html) => { const e = document.createElement(tag); e.id = id; if (html) e.innerHTML = html; body.appendChild(e); return e; };

  const laser = $('div', 'laser');
  $('div', 'blackout');
  $('div', 'help-overlay', `<div class="help-card"><h3>Atajos de exposición</h3>
    <div><span>Modo exposición (texto mayor + pantalla completa)</span><kbd>P</kbd></div>
    <div><span>Pantalla completa</span><kbd>F</kbd></div>
    <div><span>Puntero láser</span><kbd>L</kbd></div>
    <div><span>Pantalla negra (pausa)</span><kbd>B</kbd></div>
    <div><span>Modo claro / oscuro</span><kbd>T</kbd></div>
    <div><span>Cerrar ayuda / salir</span><kbd>Esc</kbd></div>
    <div><span>Pantalla completa que SÍ se mantiene al cambiar de página</span><kbd>F11</kbd></div></div>`);
  const bar = $('div', 'present-bar', `
    <button data-a="present" title="Modo exposición (P)">▶ Exposición</button>
    <button data-a="laser" title="Puntero láser (L)">◎ Láser</button>
    <button data-a="theme" title="Claro / oscuro (T)">◐ Tema</button>
    <button data-a="help" title="Atajos (?)">?</button>`);

  const st = () => JSON.parse(localStorage.getItem(LS) || '{}');
  // Al cambiar de página el navegador sale solo de pantalla completa: eso NO debe apagar el modo exposición
  let leaving = false;
  window.addEventListener('pagehide', () => { leaving = true; });
  window.addEventListener('beforeunload', () => { leaving = true; });
  const save = (o) => localStorage.setItem(LS, JSON.stringify({ ...st(), ...o }));
  const sync = () => {
    const s = st();
    root.classList.toggle('presenting', !!s.present);
    body.classList.toggle('presenting', !!s.present);
    body.classList.toggle('laser-on', !!s.laser);
    bar.querySelector('[data-a=present]').classList.toggle('on', !!s.present);
    bar.querySelector('[data-a=laser]').classList.toggle('on', !!s.laser);
  };
  const fs = (on) => {
    try { on ? root.requestFullscreen && root.requestFullscreen() : document.fullscreenElement && document.exitFullscreen(); } catch (e) {}
  };
  const actions = {
    present() { const on = !st().present; save({ present: on }); fs(on); sync(); },
    laser() { save({ laser: !st().laser }); sync(); },
    theme() { const b = document.getElementById('theme-toggle-btn'); if (b) b.click(); },
    help() { body.classList.toggle('help'); },
    full() { fs(!document.fullscreenElement); },
    black() { body.classList.toggle('blackout'); }
  };

  bar.addEventListener('click', (e) => { const a = e.target.closest('button')?.dataset.a; if (a) actions[a](); });
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey || /input|textarea|select/i.test(e.target.tagName)) return;
    const k = e.key.toLowerCase();
    if (k === 'p') actions.present();
    else if (k === 'f') actions.full();
    else if (k === 'l') actions.laser();
    else if (k === 'b') actions.black();
    else if (k === 't') actions.theme();
    else if (k === '?' || k === 'h') actions.help();
    else if (k === 'escape') { body.classList.remove('help', 'blackout'); }
  });
  document.addEventListener('fullscreenchange', () => { if (leaving) return; if (!document.fullscreenElement && st().present) { save({ present: false }); sync(); } });

  // Puntero láser + ocultar cursor y barra tras inactividad en modo exposición
  let idle;
  document.addEventListener('mousemove', (e) => {
    laser.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    body.classList.remove('idle'); clearTimeout(idle);
    idle = setTimeout(() => body.classList.add('idle'), 3000);
  });
  // Página nueva con el modo exposición activo: el navegador exige un gesto del usuario para
  // volver a pantalla completa, así que se reanuda con el primer clic o tecla.
  if (st().present && !document.fullscreenElement) {
    const hint = document.createElement('div');
    hint.textContent = 'Haz clic o pulsa una tecla para continuar en pantalla completa';
    hint.style.cssText = 'position:fixed;left:50%;bottom:64px;transform:translateX(-50%);z-index:9000;' +
      'padding:8px 16px;border-radius:999px;font:600 .8rem system-ui,sans-serif;pointer-events:none;' +
      'background:var(--accent,#10b981);color:#fff;box-shadow:0 10px 28px -10px rgba(0,0,0,.6);transition:opacity .4s';
    body.appendChild(hint);
    const stop = () => { ['pointerdown', 'keydown'].forEach(ev => document.removeEventListener(ev, resume, true)); hint.remove(); };
    function resume(e) {
      if (e.target.closest && e.target.closest('#present-bar')) return;                 // el botón Exposición gestiona lo suyo
      if (e.type === 'keydown' && ['p', 'f', 'escape', 'f11'].includes(e.key.toLowerCase())) return;
      if (!st().present) return stop();
      fs(true); stop();
    }
    ['pointerdown', 'keydown'].forEach(ev => document.addEventListener(ev, resume, true));
    setTimeout(() => { hint.style.opacity = '0'; }, 6000);
  }
  sync();
})();
