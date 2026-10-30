// ==========================================================================
// OxI · lógica de las 4 vistas (menú, claves, procesos, escenarios). Se elige por <body data-page="...">
// ==========================================================================
const BASE = 'data/oxi';                       // carpeta de datos: DATA/oxi/claves y DATA/oxi/flujos
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  const page = document.body.dataset.page;
  if (page === 'claves') initClaves();
  if (page === 'procesos') initProcesos();
  if (page === 'generador') initGenerador();
  if (page === 'encurso') initEnCurso();
  if (page === 'tmca') initTMCA();
});

function initTheme() {
  const btn = document.getElementById('theme-toggle-btn');
  const paint = dark => {
    document.body.classList.toggle('dark', dark);
    if (btn) btn.innerHTML = dark ? '✴︎ <span>Modo Claro</span>' : '⏺︎ <span>Modo Oscuro</span>';
  };
  paint((localStorage.getItem('incore_theme') || 'dark') === 'dark');
  if (btn) btn.addEventListener('click', () => {
    const dark = !document.body.classList.contains('dark');
    localStorage.setItem('incore_theme', dark ? 'dark' : 'light');
    paint(dark);
  });
}

/** Lee prefijo1.txt, prefijo2.txt… hasta que uno no exista (el navegador no puede listar carpetas). */
async function readSeries(dir, prefix) {
  const out = [];
  for (let i = 1; i <= 100; i++) {
    let text;
    try {
      const res = await fetch(`${BASE}/${dir}/${prefix}${i}.txt`);
      if (!res.ok) break;
      text = (await res.text()).replace(/^\uFEFF/, '');
    } catch (e) { break; }
    if (/^\s*</.test(text)) break;               // el servidor devolvió una página HTML en lugar del archivo
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (lines.length) out.push({ file: `${prefix}${i}.txt`, title: lines[0], lines: lines.slice(1) });
  }
  return out;
}

const noFiles = dir => `<p class="empty-msg">No se encontraron archivos en <b>${BASE}/${dir}/</b>.</p>`;

// 1) Consideraciones clave: tarjetas tenues; al hacer clic quedan resaltadas de forma fija
async function initClaves() {
  const grid = document.getElementById('claves-grid');
  const items = await readSeries('claves', 'oxi');
  grid.innerHTML = items.length ? items.map(it => `
    <article class="key-card">
      <div class="card-title">${esc(it.title)}</div>
      <div class="card-text">${it.lines.map(l => `<p>${esc(l)}</p>`).join('')}</div>
    </article>`).join('') : noFiles('claves');
  grid.querySelectorAll('.key-card').forEach(c => c.addEventListener('click', () => c.classList.add('fijo')));
}

// ==========================================================================
// 2) Procesos: flujograma por FASES (con plazo general); al hacer clic en una fase se ve el detalle abajo
// Formato de cada línea (desde la 2.ª): N° | Fase | Proceso | Días
// ==========================================================================
const FASE_HUE = { priorizacion: 210, actos: 265, proceso: 28, convenio: 175, ejecucion: 140, reconocimiento: 48, liquidacion: 330 };
const norm = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const hueOf = (fase, i) => FASE_HUE[norm(fase).split(/\s+/)[0]] ?? (200 + i * 47) % 360;

function parseDays(dias) {
  const m = String(dias).match(/(\d+(?:[.,]\d+)?)\s*([a-záéíóú]*)/i);
  if (!m) return null;
  const v = parseFloat(m[1].replace(',', '.')), u = m[2].toLowerCase();
  return { v, raw: m[1], kind: u.startsWith('h') ? 'h' : u.startsWith('c') ? 'c' : 'o' };
}
const pillText = dias => {
  const d = parseDays(dias);
  if (!d) return dias;
  if (d.kind === 'h') return `${d.raw} ${d.v === 1 ? 'día hábil' : 'días hábiles'}`;
  if (d.kind === 'c') return `${d.raw} ${d.v === 1 ? 'día calendario' : 'días calendario'}`;
  return `${dias} días`;
};
function sumText(steps) {
  let h = 0, c = 0, o = 0;
  steps.forEach(s => { const d = parseDays(s.dias); if (d) { if (d.kind === 'h') h += d.v; else if (d.kind === 'c') c += d.v; else o += d.v; } });
  return [h && `${h} días hábiles`, c && `${c} días calendario`, o && `${o} días`].filter(Boolean).join(' + ');
}
const parseSteps = lines => lines.map(l => {
  const [n = '', fase = '', proceso = '', dias = ''] = l.split('|').map(x => x.trim());
  return { n, fase, proceso, dias };
});

/** Dibuja el flujograma general por fases y, bajo él, el detalle de la fase elegida. */
function renderFlowView(steps) {
  const phases = [];
  steps.forEach(s => {
    let p = phases.find(x => x.name === s.fase);
    if (!p) { p = { name: s.fase, steps: [] }; p.hue = hueOf(s.fase, phases.length); phases.push(p); }
    p.steps.push(s);
  });
  const box = document.getElementById('phases'), detail = document.getElementById('phase-detail');
  detail.hidden = true;
  box.innerHTML = phases.map((p, i) => `
    <button class="phase" style="--h:${p.hue}" data-i="${i}">
      <span class="phase-name">${esc(p.name)}</span>
      <span class="phase-meta">${p.steps.length} ${p.steps.length === 1 ? 'paso' : 'pasos'}</span>
      <span class="phase-days">${sumText(p.steps) || 'Plazo según Convenio o bases'}</span>
    </button>`).join('');
  const total = sumText(steps);
  document.getElementById('flow-total').textContent = total ? `Suma de plazos indicados: ${total}` : '';
  box.querySelectorAll('.phase').forEach(b => b.addEventListener('click', () => {
    const p = phases[+b.dataset.i];
    box.querySelectorAll('.phase').forEach(x => x.classList.toggle('sel', x === b));
    detail.style.setProperty('--h', p.hue);
    document.getElementById('pd-title').textContent = `${p.name} · ${sumText(p.steps) || 'plazo según Convenio o bases'}`;
    document.getElementById('pd-flow').innerHTML = p.steps.map(s => `
      <div class="step" style="--h:${p.hue}">
        <span class="step-n">${esc(s.n)}</span>
        <span class="step-p">${esc(s.proceso)}</span>
        ${s.dias ? `<span class="step-d">${esc(pillText(s.dias))}</span>` : ''}
      </div>`).join('');
    detail.hidden = false;
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

async function initProcesos() {
  const grid = document.getElementById('flow-grid');
  const items = await readSeries('flujos', 'flujo');
  grid.innerHTML = (items.length ? items.map((it, i) => `
    <article class="flow-card" data-i="${i}">
      <div class="card-title">${esc(it.title)}</div>
      <div class="card-text">${it.lines.length} pasos</div>
    </article>`).join('') : noFiles('flujos')) + `
    <a class="flow-card gen-card" href="/oxiGenerador.html">
      <div class="card-title">Generador de flujograma de Inversiones</div>
      <div class="card-text">Elige cuántas inversiones se financian y los compromisos de la Empresa Privada.</div>
    </a>`;
  const list = document.getElementById('flow-list'), view = document.getElementById('flow-view');
  grid.querySelectorAll('.flow-card[data-i]').forEach(c => c.addEventListener('click', () => {
    const it = items[+c.dataset.i];
    document.getElementById('flow-title').textContent = it.title;
    renderFlowView(parseSteps(it.lines));
    list.hidden = true; view.hidden = false; window.scrollTo(0, 0);
  }));
  document.getElementById('btn-flow-back').addEventListener('click', () => { view.hidden = true; list.hidden = false; });
}

// ==========================================================================
// 3) Generador interactivo de flujogramas de INVERSIONES
// ==========================================================================
const COMPROMISOS = [
  [1, 'Ejecución de la obra', true],
  [2, 'Financiamiento de la actualización del estudio de preinversión o de la ficha técnica'],
  [3, 'Financiamiento de la actualización del Expediente Técnico del proyecto'],
  [4, 'Elaboración del Expediente Técnico'],
  [5, 'Financiamiento de la supervisión de la ejecución de la obra'],
  [6, 'Financiamiento de la supervisión de la elaboración del Expediente Técnico'],
  [7, 'Elaboración del estudio de preinversión (iniciativa privada)'],
  [8, 'Elaboración del Expediente de Mantenimiento'],
  [9, 'Actividades de mantenimiento'],
  [10, 'Elaboración del Manual de Operación'],
  [11, 'Actividades de operación']
];
const CASOS = [
  ['Caso 1: 1 proyecto + ejecución', 'proyecto', 1, [1]],
  ['Caso 2: 1 proyecto + expediente técnico + ejecución', 'proyecto', 1, [1, 4]],
  ['Caso 3: 1 proyecto + actualización del estudio de preinversión + expediente técnico + ejecución', 'proyecto', 1, [1, 2, 4]],
  ['Caso 4: 2 proyectos + ejecución', 'proyecto', 2, [1]],
  ['Caso 5: 1 proyecto + expediente técnico + supervisiones + mantenimiento', 'proyecto', 1, [1, 4, 5, 6, 8, 9]]
];

/** Compone el flujo a partir de los bloques de DATA/oxi/pasos.json según el tipo, el N° de inversiones y los compromisos. */
function buildFlow(B, { tipo, n, c }) {
  const P = tipo === 'proyecto', multi = n > 1, has = k => c.has(k);
  const omActs = has(9) || has(11), plan = has(8) || has(10) || omActs;
  const sub = {
    '{ET}': P ? 'Expediente Técnico' : 'Documento Equivalente', '{n}': n,
    '{por_cada}': multi ? ` (por cada una de las ${n} inversiones)` : '',
    '{sup}': has(5) ? ', con supervisión financiada por la Empresa Privada' : '',
    '{par}': has(4) && P ? ' (puede iniciar en paralelo al diseño, art. 131.1)' : '',
    '{omlabel}': has(9) && has(11) ? 'Actividades de operación y mantenimiento' : has(11) ? 'Actividades de operación' : 'Actividades de mantenimiento'
  };
  const out = [];
  const add = k => (B[k] || []).forEach(([f, p, d]) => out.push([f, Object.entries(sub).reduce((t, [a, b]) => t.split(a).join(b), p), d]));
  if (has(7)) add('iniciativa');
  if (has(2)) add('actualiza_pre');
  add('prio'); add('comite');
  add(multi ? 'bases_agr' : P ? 'bases_p' : 'bases_i'); add('legal');
  add(P ? (multi ? 'cgr_p2' : 'cgr_p') : (multi ? 'cgr_i2' : 'cgr_i')); add('impl'); add('aprob');
  add(P ? 'sel_p' : 'sel_i'); add('conv'); if (has(5) || has(6)) add('eps');
  add(has(4) ? 'hab_emp' : 'hab_ent');
  if (has(4)) add('et_elab');
  if (has(6) && (has(4) || has(3))) add('et_sup');
  if (has(3)) add('et_act');
  if (has(3) || has(4)) add(P ? 'et_apr_p' : 'et_apr_i');
  add('obra'); add('recep');
  if (plan) add('plan');
  if (omActs) add('om_act');
  add('reco'); if (has(2) || has(3) || has(4) || has(7) || plan) add('reco_est');
  add('liq_obl'); if (omActs) add('liq_om'); add('liq_conv');
  return out.map(([fase, proceso, dias], i) => ({ n: String(i + 1), fase, proceso, dias }));
}

async function initGenerador() {
  let B;
  try { B = (await (await fetch(`${BASE}/pasos.json`)).json()).bloques; }
  catch (e) { document.getElementById('gen-note').textContent = `No se pudo leer ${BASE}/pasos.json`; return; }
  const sel = new Set([1]), tipoEl = document.getElementById('gen-tipo'), nEl = document.getElementById('gen-n');
  const commit = document.getElementById('gen-commit');
  commit.innerHTML = COMPROMISOS.map(([id, label, fixed]) => `
    <label class="commit${fixed ? ' fixed' : ''}"><input type="checkbox" data-id="${id}" ${fixed ? 'checked disabled' : ''}>
      <span><b>${id}.</b> ${esc(label)}${fixed ? ' <em>(obligatorio)</em>' : ''}</span></label>`).join('');

  const generate = () => {
    const n = Math.max(1, Math.min(20, parseInt(nEl.value, 10) || 1));
    const tipo = tipoEl.value;
    const steps = buildFlow(B, { tipo, n, c: sel });
    const nombres = COMPROMISOS.filter(([id]) => sel.has(id)).map(([id, l]) => `${id}. ${l}`);
    document.getElementById('gen-summary').innerHTML =
      `<span class="chip chip-main">${n} ${tipo === 'proyecto' ? (n === 1 ? 'proyecto' : 'proyectos') : 'IOARR'}</span>` +
      nombres.map(t => `<span class="chip">${esc(t)}</span>`).join('');
    const needPlan = [8, 9, 10, 11].some(k => sel.has(k));
    document.getElementById('gen-note').textContent = needPlan
      ? 'Se incluye el Plan de Operación y/o Mantenimiento, que se presenta antes de la recepción total (art. 152.2). La Empresa también puede financiar solo actividades de operación y/o mantenimiento, sin la inversión (art. 151.1): ver el flujograma específico en Procesos.'
      : 'La Empresa también puede financiar solo actividades de operación y/o mantenimiento, sin la inversión (art. 151.1): ver el flujograma específico en Procesos.';
    renderFlowView(steps);
  };
  const paint = () => commit.querySelectorAll('input').forEach(i => { i.checked = sel.has(+i.dataset.id); });
  commit.addEventListener('change', e => { const id = +e.target.dataset.id; e.target.checked ? sel.add(id) : sel.delete(id); sel.add(1); generate(); });
  tipoEl.addEventListener('change', generate); nEl.addEventListener('input', generate);

  const pre = document.getElementById('gen-presets');
  pre.innerHTML = CASOS.map((c, i) => `<button class="preset" data-i="${i}">${esc(c[0])}</button>`).join('');
  pre.querySelectorAll('.preset').forEach(b => b.addEventListener('click', () => {
    const [, tipo, n, ids] = CASOS[+b.dataset.i];
    tipoEl.value = tipo; nEl.value = n; sel.clear(); ids.forEach(x => sel.add(x));
    pre.querySelectorAll('.preset').forEach(x => x.classList.toggle('on', x === b));
    paint(); generate();
  }));
  generate();
}

// ==========================================================================
// 4) Procesos en curso: una tarjeta por cada DATA/oxi/procesos/proceso_N.txt
// Cada archivo: Proyecto|IOARR N: nombre · CUI N · Monto N (repetibles), Total, Compromisos (con "+"), Buena Pro, Estado
// ==========================================================================
const MAX_PROCESOS = 80;   // se prueban proceso_1.txt … proceso_80.txt (pueden faltar números)

function parseProceso(num, text) {
  const p = { num, items: [], total: '', compromisos: [], buenaPro: '', estado: '' };
  const item = n => p.items.find(i => i.n === n);
  text.split(/\r?\n/).map(l => l.trim()).filter(Boolean).forEach(l => {
    let m;
    if ((m = l.match(/^(proyecto|ioarr)\s*(\d+)\s*:\s*(.+)$/i))) p.items.push({ tipo: m[1].toLowerCase(), n: m[2], nombre: m[3], cui: '', monto: '' });
    else if ((m = l.match(/^cui\s*(\d+)\s*:\s*(.+)$/i)) && item(m[1])) item(m[1]).cui = m[2];
    else if ((m = l.match(/^monto\s*(\d+)\s*:\s*(.+)$/i)) && item(m[1])) item(m[1]).monto = m[2];
    else if ((m = l.match(/^total\s*:\s*(.+)$/i))) p.total = m[1];
    else if ((m = l.match(/^compromisos\s*:\s*(.+)$/i))) p.compromisos = m[1].split('+').map(x => x.trim()).filter(Boolean);
    else if ((m = l.match(/^buena\s*pro\s*:\s*(.+)$/i))) p.buenaPro = m[1];
    else if ((m = l.match(/^estado\s*:\s*(.+)$/i))) p.estado = m[1];
  });
  const tipos = new Set(p.items.map(i => i.tipo));
  p.tipo = tipos.size > 1 ? 'mixto' : tipos.has('ioarr') ? 'ioarr' : 'proyecto';
  return p;
}

async function readProcesos() {
  const jobs = Array.from({ length: MAX_PROCESOS }, (_, k) => k + 1).map(async i => {
    try {
      const res = await fetch(`${BASE}/procesos/proceso_${i}.txt`);
      if (!res.ok) return null;
      const text = (await res.text()).replace(/^\uFEFF/, '');
      return /^\s*</.test(text) ? null : parseProceso(i, text);   // HTML = el servidor no encontró el archivo
    } catch (e) { return null; }
  });
  return (await Promise.all(jobs)).filter(Boolean);
}

const TIPO_TXT = { proyecto: ['PROYECTO', 'PROYECTOS'], ioarr: ['IOARR', 'IOARR'] };
const tipoTag = p => p.tipo === 'mixto' ? `MIXTO · ${p.items.length}`
  : `${TIPO_TXT[p.tipo][p.items.length === 1 ? 0 : 1]}${p.items.length > 1 ? ' ×' + p.items.length : ''}`;

async function initEnCurso() {
  const grid = document.getElementById('proc-grid'), detail = document.getElementById('proc-detail');
  const procs = await readProcesos();
  grid.innerHTML = procs.length ? procs.map((p, i) => `
    <article class="proc-card tipo-${p.tipo}" data-i="${i}">
      <div class="card-title">PROCESO ${p.num}</div>
      <span class="proc-tag">${esc(tipoTag(p))}</span>
      <div class="proc-total">${esc(p.total || '—')}</div>
      ${p.estado ? `<div class="card-text">${esc(p.estado)}</div>` : ''}
    </article>`).join('') : noFiles('procesos');

  grid.querySelectorAll('.proc-card').forEach(c => c.addEventListener('click', () => {
    const p = procs[+c.dataset.i];
    grid.querySelectorAll('.proc-card').forEach(x => x.classList.toggle('sel', x === c));
    detail.className = `proc-detail tipo-${p.tipo}`;
    detail.innerHTML = `
      <div class="proc-detail-head">
        <h2>Proceso ${p.num}: </h2><span class="proc-total">${esc(p.total || '—')}</span>
        ${p.estado ? `<span class="chip chip-main">${esc(p.estado)}</span>` : ''}
      </div>
      <div class="proc-items">${p.items.map(it => `
        <div class="proc-item tipo-${it.tipo}">
          <span class="proc-item-tag">${esc(it.tipo === 'ioarr' ? 'IOARR' : 'PROYECTO')} ${esc(it.n)}</span>
          <p class="proc-item-name">${esc(it.nombre)}</p>
          <div class="proc-item-meta"><span>CUI: <b>${esc(it.cui || '—')}</b></span><span>Monto: <b>${esc(it.monto || '—')}</b></span></div>
        </div>`).join('')}
      </div>
      <div class="proc-meta">
        ${p.compromisos.length ? `<div class="bloque-detail"><span class="lbl">Compromisos</span><div class="chips">${p.compromisos.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div></div>` : ''}
        ${p.buenaPro ? `<div class="bloque-detail"><span class="lbl">Buena Pro</span><b>${esc(p.buenaPro)}</b></div>` : ''}
      </div>`;
    detail.hidden = false;
    detail.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
}

// ==========================================================================
// 5) Tope Máximo de Capacidad Anual (TMCA) - CIPRL
// Simulación interactiva con Card 1 (CIPRL), Card 2 (Procesos en curso) y Card 3 (Diferencia)
// ==========================================================================

// ==========================================================================
// CONSTANTE DE CONFIGURACIÓN FÁCILMENTE EDITABLE:
// Modifique este valor numérico para cambiar el valor base del CIPRL (Card 1)
// ==========================================================================
export const VALOR_CIPRL_BASE = 1722368749.00; // S/ 1'722,368,749.00

/**
 * Convierte un texto de moneda como "S/ 87,290,544.11" o "87290544.11" en un número flotante
 */
function parseNumericTotal(str) {
  if (!str) return 0;
  // Extraer dígitos, comas y puntos
  const clean = String(str).replace(/[^\d.,]/g, '').trim();
  if (!clean) return 0;

  // Si tiene coma y punto, asumimos formato internacional (coma para miles, punto para decimales)
  // o formato peruano / europeo según corresponda.
  if (clean.includes(',') && clean.includes('.')) {
    // Si la coma está antes del punto: "87,290,544.11"
    if (clean.lastIndexOf(',') < clean.lastIndexOf('.')) {
      return parseFloat(clean.replace(/,/g, '')) || 0;
    } else {
      // Si el punto está antes de la coma: "87.290.544,11"
      return parseFloat(clean.replace(/\./g, '').replace(',', '.')) || 0;
    }
  }

  // Si solo tiene coma y 2 dígitos después: "87290544,11"
  if (clean.includes(',') && !clean.includes('.')) {
    const parts = clean.split(',');
    if (parts.length === 2 && parts[1].length <= 2) {
      return parseFloat(parts[0] + '.' + parts[1]) || 0;
    }
    return parseFloat(clean.replace(/,/g, '')) || 0;
  }

  return parseFloat(clean) || 0;
}

/**
 * Formatea un número en formato estándar peruano con apóstrofe de millones opcional o comas
 * Ejemplo: S/ 1'722,368,749.00 o S/ 1'090,748,390.97
 */
function formatSoles(amount, withDecimals = true) {
  const isNeg = amount < 0;
  const absVal = Math.abs(amount);

  const fixed = withDecimals ? absVal.toFixed(2) : Math.round(absVal).toString();
  const [entera, dec] = fixed.split('.');

  // Formatear separador de miles y millones
  let enteraFmt = '';
  const len = entera.length;
  for (let i = 0; i < len; i++) {
    const posFromEnd = len - i;
    if (i > 0 && posFromEnd % 3 === 0) {
      if (posFromEnd >= 6) {
        enteraFmt += "'";
      } else {
        enteraFmt += ',';
      }
    }
    enteraFmt += entera[i];
  }

  const sign = isNeg ? '-' : '';
  return withDecimals && dec !== undefined
    ? `${sign}S/ ${enteraFmt}.${dec}`
    : `${sign}S/ ${enteraFmt}`;
}

async function initTMCA() {
  const grid = document.getElementById('tmca-grid');
  const detail = document.getElementById('proc-detail');
  const valCiprlEl = document.getElementById('tmca-val-ciprl');
  const valProcesosEl = document.getElementById('tmca-val-procesos');
  const valDiferenciaEl = document.getElementById('tmca-val-diferencia');
  const countBadgeEl = document.getElementById('tmca-count-badge');
  const selectionStatusEl = document.getElementById('tmca-selection-status');
  const btnSelectAll = document.getElementById('btn-select-all');
  const btnDeselectAll = document.getElementById('btn-deselect-all');

  if (!grid) return;

  // Configurar valor visual de Card 1
  if (valCiprlEl) {
    valCiprlEl.textContent = formatSoles(VALOR_CIPRL_BASE, false);
  }

  // Leer procesos disponibles
  const procs = await readProcesos();
  if (!procs || procs.length === 0) {
    grid.innerHTML = noFiles('procesos');
    return;
  }

  // Parsear monto numérico de cada proceso
  procs.forEach((p, idx) => {
    p.numericTotal = parseNumericTotal(p.total);
    p.active = true; // Por defecto todos seleccionados
    p.id = `proc-${p.num || idx + 1}`;
  });

  // Renderizar tarjetas de proceso compactas con checkbox
  grid.innerHTML = procs.map((p, i) => {
    const mainItem = p.items && p.items.length > 0 ? p.items[0] : null;
    const itemName = mainItem ? mainItem.nombre : (p.items && p.items.length > 1 ? `${p.items.length} inversiones` : 'Intervención OxI');
    const itemCui = mainItem && mainItem.cui ? mainItem.cui : '—';

    return `
      <article class="tmca-proc-card tipo-${p.tipo}" data-i="${i}" id="tmca-card-${i}">
        <div>
          <div class="tmca-proc-head">
            <label class="tmca-checkbox-label" onclick="event.stopPropagation()">
              <input type="checkbox" class="tmca-checkbox" data-i="${i}" checked aria-label="Incluir proceso ${p.num} en el cálculo">
              <span class="tmca-proc-title">Proceso ${p.num}</span>
            </label>
            <span class="tmca-proc-tag">${esc(tipoTag(p))}</span>
          </div>

          <div class="tmca-proc-total">${esc(p.total || '—')}</div>
          <div class="tmca-proc-name" title="${esc(itemName)}">${esc(itemName)}</div>
        </div>

        <div class="tmca-proc-footer">
          <span>CUI: <b>${esc(itemCui)}</b></span>
          <span>${esc(p.estado || 'Activo')}</span>
        </div>
      </article>
    `;
  }).join('');

  /**
   * Recalcula dinámicamente los totales de Card 2 y Card 3
   */
  function updateCalculations() {
    let sumProcesos = 0;
    let activeCount = 0;

    procs.forEach(p => {
      if (p.active) {
        sumProcesos += p.numericTotal;
        activeCount++;
      }
    });

    const diferencia = VALOR_CIPRL_BASE - sumProcesos;

    // Card 2: Procesos en curso
    if (valProcesosEl) {
      valProcesosEl.textContent = formatSoles(sumProcesos, true);
    }

    // Card 3: Tope Máximo de Capacidad Anual (Junio 2027) = Card 1 - Card 2
    if (valDiferenciaEl) {
      valDiferenciaEl.textContent = formatSoles(diferencia, true);
    }

    // Badges y textos de estado
    if (countBadgeEl) {
      countBadgeEl.textContent = `${activeCount} de ${procs.length} activos`;
    }

    if (selectionStatusEl) {
      if (activeCount === procs.length) {
        selectionStatusEl.textContent = `Todos los ${procs.length} procesos están seleccionados`;
      } else if (activeCount === 0) {
        selectionStatusEl.textContent = 'Ningún proceso seleccionado (Card 2 = S/ 0.00)';
      } else {
        selectionStatusEl.textContent = `${activeCount} de ${procs.length} procesos seleccionados`;
      }
    }
  }

  // Manejador de eventos en checkboxes
  grid.querySelectorAll('.tmca-checkbox').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const idx = +e.target.dataset.i;
      const isChecked = e.target.checked;
      procs[idx].active = isChecked;

      const card = document.getElementById(`tmca-card-${idx}`);
      if (card) {
        card.classList.toggle('is-off', !isChecked);
      }

      updateCalculations();
    });
  });

  // Clic en la tarjeta (fuera del checkbox) alterna la selección para mayor usabilidad
  grid.querySelectorAll('.tmca-proc-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Si el clic fue directamente en el input o label, el evento change ya se encarga
      if (e.target.closest('.tmca-checkbox-label')) return;

      const idx = +card.dataset.i;
      const chk = card.querySelector('.tmca-checkbox');
      if (chk) {
        chk.checked = !chk.checked;
        procs[idx].active = chk.checked;
        card.classList.toggle('is-off', !chk.checked);
        updateCalculations();
      }

      // Opcional: mostrar detalle abajo
      const p = procs[idx];
      if (detail) {
        detail.className = `proc-detail tipo-${p.tipo}`;
        detail.innerHTML = `
          <div class="proc-detail-head">
            <h2>Proceso ${p.num}</h2><span class="proc-total">${esc(p.total || '—')}</span>
            ${p.estado ? `<span class="chip chip-main">${esc(p.estado)}</span>` : ''}
          </div>
          <div class="proc-items">${p.items.map(it => `
            <div class="proc-item tipo-${it.tipo}">
              <span class="proc-item-tag">${esc(it.tipo === 'ioarr' ? 'IOARR' : 'PROYECTO')} ${esc(it.n)}</span>
              <p class="proc-item-name">${esc(it.nombre)}</p>
              <div class="proc-item-meta"><span>CUI <b>${esc(it.cui || '—')}</b></span><span>Monto <b>${esc(it.monto || '—')}</b></span></div>
            </div>`).join('')}
          </div>
          <div class="proc-meta">
            ${p.compromisos.length ? `<div><span class="lbl">Compromisos</span><div class="chips">${p.compromisos.map(x => `<span class="chip">${esc(x)}</span>`).join('')}</div></div>` : ''}
            ${p.buenaPro ? `<div><span class="lbl">Buena Pro</span><b>${esc(p.buenaPro)}</b></div>` : ''}
          </div>`;
        detail.hidden = false;
        detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  // Botón Seleccionar todos
  if (btnSelectAll) {
    btnSelectAll.addEventListener('click', () => {
      procs.forEach((p, i) => {
        p.active = true;
        const chk = grid.querySelector(`.tmca-checkbox[data-i="${i}"]`);
        if (chk) chk.checked = true;
        const card = document.getElementById(`tmca-card-${i}`);
        if (card) card.classList.remove('is-off');
      });
      updateCalculations();
    });
  }

  // Botón Deseleccionar todos
  if (btnDeselectAll) {
    btnDeselectAll.addEventListener('click', () => {
      procs.forEach((p, i) => {
        p.active = false;
        const chk = grid.querySelector(`.tmca-checkbox[data-i="${i}"]`);
        if (chk) chk.checked = false;
        const card = document.getElementById(`tmca-card-${i}`);
        if (card) card.classList.add('is-off');
      });
      updateCalculations();
    });
  }

  // Ejecución inicial de cálculos
  updateCalculations();
}
