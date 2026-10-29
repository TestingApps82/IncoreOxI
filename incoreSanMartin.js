// ==========================================================================
// INCORE SAN MARTÍN - LÓGICA DE CONTROL ORBITAL & ANÁLISIS 2015–2025
// ==========================================================================

// Configuración de los 6 Pilares y sus 7 Indicadores Principales cada uno (42 en total)
const PILLARS_CONFIG = [
  {
    id: 'entorno-economico',
    pilarName: 'Entorno económico',
    name: 'Entorno Económico',
    icon: '/img/pilar_economico.svg',
    indicators: ['EE1', 'EE2', 'EE3', 'EE4', 'EE5', 'EE6', 'EE7']
  },
  {
    id: 'laboral',
    pilarName: 'Laboral',
    name: 'Laboral',
    icon: '/img/pilar_laboral.svg',
    indicators: ['LA1', 'LA2', 'LA3', 'LA4', 'LA5', 'LA6', 'LA7']
  },
  {
    id: 'infraestructura',
    pilarName: 'Infraestructura',
    name: 'Infraestructura',
    icon: '/img/pilar_infraestructura.svg',
    indicators: ['IF1', 'IF2', 'IF3', 'IF4', 'IF5', 'IF6', 'IF7']
  },
  {
    id: 'salud',
    pilarName: 'Salud',
    name: 'Salud',
    icon: '/img/pilar_salud.svg',
    indicators: ['SA1', 'SA2', 'SA3', 'SA4', 'SA5', 'SA6', 'SA7']
  },
  {
    id: 'educacion',
    pilarName: 'Educación',
    name: 'Educación',
    icon: '/img/pilar_educacion.svg',
    indicators: ['ED1', 'ED2', 'ED3', 'ED4', 'ED5', 'ED6', 'ED7']
  },
  {
    id: 'instituciones',
    pilarName: 'Instituciones',
    name: 'Instituciones',
    icon: '/img/pilar_instituciones.svg',
    indicators: ['IS1', 'IS2', 'IS3', 'IS4', 'IS5', 'IS6', 'IS7']
  }
];

// Nombres oficiales completos de los 42 indicadores principales
const DEFAULT_INDICATOR_NAMES = {
  'EE1': '1.1 PBI real en logaritmos',
  'EE2': '1.2 Trabajadores en grandes empresas (más de 100 trabajadores)',
  'EE3': '1.3 Gasto real pre cápita mensual',
  'EE4': '1.4 Apertura externa',
  'EE5': '1.5 Tenencia de cuentas',
  'EE6': '1.6 Acceso al crédito',
  'EE7': '1.7 Billeteras digitales',
  'LA1': '2.1 Ingreso por hora por trabajo',
  'LA2': '2.2 Formalidad laboral',
  'LA3': '2.3 Trabajadores que ganan menos que el salario mínimo',
  'LA4': '2.4 Jóvenes que no estudian ni trabajan',
  'LA5': '2.5 Fuerza laboral educada',
  'LA6': '2.6 Brecha de género en participación laboral',
  'LA7': '2.7 Brecha de género en ingresos laborales',
  'IF1': '3.1 Hogares con acceso a agua',
  'IF2': '3.2 Hogares con acceso a saneamiento',
  'IF3': '3.3 Continuidad en la provisión de agua',
  'IF4': '3.4 Acceso a agua clorada',
  'IF5': '3.5 Precio medio de electricidad',
  'IF6': '3.6 Densidad del transporte aéreo nacional',
  'IF7': '3.7 Uso de internet',
  'SA1': '4.1 Desnutrición crónica',
  'SA2': '4.2 Anemia infantil',
  'SA3': '4.3 Vacunación',
  'SA4': '4.4 Embarazo adolescente',
  'SA5': '4.5 Cobertura del personal médico público',
  'SA6': '4.6 Desabastecimiento de medicamentos',
  'SA7': '4.7 Camas hospitalarias',
  'ED1': '5.1 Conclusión secundaria',
  'ED2': '5.2 Logro educativo en primaria en lectura',
  'ED3': '5.3 Logro educativo en primaria en matemáticas',
  'ED4': '5.4 Colegios con acceso a internet',
  'ED5': '5.5 Locales escolares con acceso a electricidad',
  'ED6': '5.6 Locales escolares con acceso a agua',
  'ED7': '5.7 Locales escolares con acceso a desagüe',
  'IS1': '6.1 Percepción de la gestión pública regional',
  'IS2': '6.2 Recaudación municipal por habitante',
  'IS3': '6.3 Atomización de proyectos',
  'IS4': '6.4 Resolución de expedientes judiciales',
  'IS5': '6.5 Conflictividad social',
  'IS6': '6.6 Victimización por hechos delictivos',
  'IS7': '6.7 Comisarías en buen estado'
};

// Estado reactivo de la aplicación
const AppState = {
  viewState: 'INITIAL', // 'INITIAL' | 'PILLARS_READY' | 'EXPANDED_L01' | PILAR_SELECTED | 'INDICATOR_SELECTED' | 'RELATED_SELECTED'
  dataMap: new Map(),       // id -> { id, pilar, tipo, control, unidad, nombre, series: [{ year, peru, sm }] }
  relatedMap: new Map(),    // parentId -> Map(id -> { id, parentId, pilar, tipo, control, unidad, nombre, series })
  activeIndicatorId: null,
  activeRelatedIndex: 0,
  controlLevels: new Set(),   // niveles de control realzados ('1', '2', '3'); vacío = sin realce
  networkRotation: 0,
  activePillarId: null,     // pilar enfocado (null = vista general)
  showPeru: true,         // serie Perú visible en los gráficos
  showSecondary: false      // indicadores de soporte visibles
};

// Parámetros de la distribución al enfocar un pilar (coordenadas locales del sistema 800x800)
const FOCUS = {
  fanRadius: 160,   // radio del abanico de indicadores alrededor del pilar
  fanArc: 180,      // apertura del abanico (grados)
  treeU: 135,       // distancia pilar -> columna de indicadores (modo con secundarios)
  treeRow: 92,      // separación vertical entre indicadores (modo con secundarios)
  kidFirst: 85,     // distancia indicador -> primer secundario
  kidStep: 76       // separación entre secundarios
};

// Evento Document Ready
document.addEventListener('DOMContentLoaded', async () => {
  initThemeToggle();
  initHeaderControls();
  initPeruToggle();
  await loadDataset();
  initOrbitalInteractions();
});

// ==========================================================================
// 1. CARGA DIRECTA Y PURA DEL ARCHIVO /DATA/datos_incore_sanmartin.txt
// ==========================================================================
async function loadDataset() {
  try {
    // Intentar primero /DATA/... y luego DATA/...
    let res = await fetch('/DATA/datos_incore_sanmartin.txt');
    if (!res.ok) {
      res = await fetch('DATA/datos_incore_sanmartin.txt');
    }
    if (!res.ok) throw new Error('No se pudo encontrar el archivo en /DATA');

    const text = await res.text();
    parseTextData(text);
  } catch (err) {
    console.error('[DATA] Error leyendo DATA/datos_incore_sanmartin.txt:', err);
  }
}

function parseTextData(rawText) {
  if (!rawText) return;
  const lines = rawText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length <= 1) return;

  AppState.dataMap.clear();
  AppState.relatedMap.clear();

  // Omitir cabecera (índice 0)
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t').map(c => c.trim());
    if (cols.length < 8) continue;

    // Formato estándar esperado:
    // Pilar | Tipo | Id | Control | Unidad | Nombre | Año_Valor | Perú | San Martín
    let pilar, tipo, id, control, unidad, nombre, anio, peru, sanMartin;
    if (cols.length >= 9) {
      [pilar, tipo, id, control, unidad, nombre, anio, peru, sanMartin] = cols;
    } else {
      [pilar, tipo, id, control, nombre, anio, peru, sanMartin] = cols;
      unidad = 'Índice';
    }

    const yearVal = parseInt(anio, 10);
    const peruVal = parseFloat(peru.replace(',', '.'));
    const smVal = parseFloat(sanMartin.replace(',', '.'));

    const mapa = cols[9] === '1';
    const sentido = (cols[10] || 'creciente').toLowerCase();


    if (tipo.toLowerCase() === 'principal') {
      if (!AppState.dataMap.has(id)) {
        AppState.dataMap.set(id, {
          id,
          pilar,
          tipo,
          control: parseInt(control, 10) || 2,
          unidad: unidad || 'Valor',
          nombre: nombre || DEFAULT_INDICATOR_NAMES[id] || id,
          series: [],
          mapa: mapa,
          sentido: sentido
        });
      }
      if (!isNaN(yearVal)) {
        AppState.dataMap.get(id).series.push({ year: yearVal, pe: peruVal, sm: smVal });
      }
    } else if (tipo.toLowerCase() === 'relacionado') {
      // Extraer parentId (ej: 'EE1' de 'EE1-1')
      const parentId = id.includes('-') ? id.split('-')[0] : id.substring(0, 3);
      if (!AppState.relatedMap.has(parentId)) {
        AppState.relatedMap.set(parentId, new Map());
      }
      const parentVars = AppState.relatedMap.get(parentId);
      if (!parentVars.has(id)) {
        parentVars.set(id, {
          id,
          parentId,
          pilar,
          tipo,
          control: parseInt(control, 10) || 2,
          unidad: unidad || 'Unidades',
          nombre: nombre || id,
          series: [],
          mapa: mapa,
          sentido: sentido
        });
      }
      if (!isNaN(yearVal)) {
        parentVars.get(id).series.push({ year: yearVal, pe: peruVal, sm: smVal });
      }
    }
  }

  // Ordenar series cronológicamente
  AppState.dataMap.forEach(item => item.series.sort((a, b) => a.year - b.year));
  AppState.relatedMap.forEach(vMap => {
    vMap.forEach(item => item.series.sort((a, b) => a.year - b.year));
  });

  console.log(`[DATA SAN MARTÍN] Cargados exitosamente ${AppState.dataMap.size} indicadores principales.`);
}

// ==========================================================================
// 2. INICIALIZACIÓN DE LA RED ORBITAL Y SUS ELEMENTOS
// ==========================================================================
function initOrbitalInteractions() {

  const indicatorsIncore = document.getElementById('btn-indicators-incore');
  if (indicatorsIncore) {
    indicatorsIncore.addEventListener('click', (e) => {
      e.stopPropagation();
      expandIndicatorsIncore();
    });
  }

  const indicatorsSecondary = document.getElementById('btn-indicadores-base');
  if (indicatorsSecondary) {
    indicatorsSecondary.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleSecondaryIndicators();
    });
  }

  // Controles de variables relacionadas (Modo B)
  const btnBackCards = document.getElementById('btn-back-to-cards');
  if (btnBackCards) {
    btnBackCards.addEventListener('click', showRelatedCardsMode);
  }

  const btnChevronNext = document.getElementById('btn-chevron-next-var');
  if (btnChevronNext) {
    btnChevronNext.addEventListener('click', advanceToNextRelatedVar);
  }

  const btnChevronPrev = document.getElementById('btn-chevron-prev-var');
  if (btnChevronPrev) {
    btnChevronPrev.addEventListener('click', backToPrevRelatedVar);
  }

  // Renderizar de inmediato los contenedores de pilares e indicadores en el DOM
  renderPillarsAndIndicatorsIncore();
  applySystemTransform(0, 1);

  // Iniciar directamente la animación secuencial de los 6 pilares al cargar la vista
  setTimeout(() => {
    revealPillars();
  }, 400);
}

/**
 * Renderiza el DOM de los 6 pilares y 42 indicadores con nombres completos
 * Todos los nodos se crean con su posición matemática exacta respecto al centro del sistema orbital (400, 400)
 */
function renderPillarsAndIndicatorsIncore() {
  const pillarsLayer = document.getElementById('pillars-orbit-layer');
  const indicatorsLayer = document.getElementById('indicators-orbit-layer');
  if (!pillarsLayer || !indicatorsLayer) return;

  pillarsLayer.innerHTML = '';
  indicatorsLayer.innerHTML = '';

  const centerSystem = 400; // Centro en 800x800
  const pillarRadius = 210; // Radio orbital de los 6 pilares
  const indRadius = 115;    // Radio de los indicadores alrededor de su pilar (espacioso)

  PILLARS_CONFIG.forEach((pillar, pIdx) => {
    // 6 pilares a 60° (simetría hexagonal perfecta)
    const angleRad = (pIdx * 60 * Math.PI) / 180;
    const px = centerSystem + pillarRadius * Math.cos(angleRad);
    const py = centerSystem + pillarRadius * Math.sin(angleRad);

    // Elemento Pilar
    const pEl = document.createElement('div');
    pEl.className = 'pillar-node';
    pEl.id = `pillar-${pillar.id}`;
    pEl.style.left = `${px}px`;
    pEl.style.top = `${py}px`;
    pEl.dataset.pillarId = pillar.id;
    pEl.dataset.angleDeg = (pIdx * 60).toString();
    pEl.dataset.cx = px.toString();
    pEl.dataset.cy = py.toString();
    pEl.title = `Pilar ${pillar.name}`;
    pEl.innerHTML = `
      <div class="pillar-node-inner">
        <img src="${pillar.icon}" class="pillar-icon-img" alt="${pillar.name}" />
        <span class="pillar-title">${pillar.name}</span>
      </div>
    `;

    // Clic: rota el esquema, oculta los demás indicadores y distribuye los del pilar
    pEl.addEventListener('click', (e) => {
      e.stopPropagation();
      selectPillar(pillar.id);
    });

    pillarsLayer.appendChild(pEl);

    // 7 Indicadores principales para este pilar
    pillar.indicators.forEach((indId, indIdx) => {
      // Distribución angular alrededor del pilar hacia el exterior
      const arcSpread = (180 * Math.PI) / 180;
      const startAngle = angleRad - arcSpread / 2;
      const indAngleRad = startAngle + (indIdx * (arcSpread / 6));

      const ix = px + indRadius * Math.cos(indAngleRad);
      const iy = py + indRadius * Math.sin(indAngleRad);

      const indEl = document.createElement('div');
      indEl.className = 'indicator-node';
      indEl.id = `indicator-${indId}`;
      indEl.style.left = `${ix}px`;
      indEl.style.top = `${iy}px`;
      indEl.dataset.indicatorId = indId;
      indEl.dataset.pillarId = pillar.id;
      indEl.dataset.cx = ix.toString();
      indEl.dataset.cy = iy.toString();
      indEl.dataset.baseX = ix.toString(); // posición original (vista general)
      indEl.dataset.baseY = iy.toString();

      // Guardar ángulo absoluto desde el centro del sistema
      const angleFromCenterDeg = (Math.atan2(iy - centerSystem, ix - centerSystem) * 180) / Math.PI;
      indEl.dataset.angleFromCenter = angleFromCenterDeg.toString();

      // Obtener el nombre completo del indicador (por ejemplo: "1.1 PBI real en logaritmos")
      const data = AppState.dataMap.get(indId);
      const fullName = (data && data.nombre) ? data.nombre : (DEFAULT_INDICATOR_NAMES[indId] || indId);
      const ctrlLevel = (data && data.control) ? data.control : 2;
      indEl.dataset.control = ctrlLevel.toString();
      indEl.title = fullName;

      // Estructura interna sin ID: sólo el nombre completo, en rectángulo horizontal
      indEl.innerHTML = `
        <div class="indicator-node-inner" id="inner-${indId}">
          <span class="indicator-full-label">${fullName}</span>
        </div>
      `;

      indEl.addEventListener('click', (e) => {
        e.stopPropagation();
        selectPrincipalIndicator(indId);
      });

      indicatorsLayer.appendChild(indEl);
    });
  });
}

/**
 * 1. Revela los 6 pilares de manera secuencial con halos dinámicos
 */
function revealPillars() {
  AppState.viewState = 'PILLARS_READY';

  const pillars = document.querySelectorAll('.pillar-node');
  pillars.forEach((p, idx) => {
    setTimeout(() => {
      p.classList.add('visible');
      drawOrbitalConnectors('PILLARS_ONLY');
    }, idx * 100);
  });

  setTimeout(() => {
    drawOrbitalConnectors('PILLARS_ONLY');
  }, 750);
}

/**
 * 2. Clic para Despliegue de los 42 indicadores principales
 */
function expandIndicatorsIncore() {
  AppState.viewState = 'EXPANDED_L01';
  AppState.activePillarId = null;
  AppState.activeIndicatorId = null;

  // Vista general: posiciones originales, sin enfoque ni atenuaciones
  restoreDefaultIndicatorPositions();
  applySystemTransform(0, 0.88);

  const panelTopRight = document.getElementById('panel-top-right');
  if (panelTopRight) panelTopRight.classList.remove('visible');

  document.querySelectorAll('.pillar-node').forEach(p => p.classList.remove('dimmed', 'active-pillar'));
  document.querySelectorAll('.indicator-node').forEach(n => n.classList.remove('dimmed', 'active-indicator'));
  reapplyGoreHighlight();

  const indicators = document.querySelectorAll('.indicator-node');
  indicators.forEach((ind, idx) => {
    setTimeout(() => {
      ind.classList.add('visible');
      if (idx % 7 === 0 || idx === indicators.length - 1) {
        drawOrbitalConnectors('FULL_NETWORK');
      }
    }, 100 + idx * 20);
  });

  setTimeout(() => {
    drawOrbitalConnectors('FULL_NETWORK');
    if (AppState.showSecondary) refreshSecondaryLayer();
  }, 1050);
}

/**
 * 3. Clic sobre algún indicador principal:
 * - El esquema rota para colocar el indicador seleccionado a la derecha (0°)
 * - El esquema se traslada ÚNICAMENTE a la izquierda (horizontalmente) sin bajar
 * - Los textos y símbolos se contra-rotan para permanecer SIEMPRE 100% horizontales
 * - Los demás pilares e indicadores se atenúan y reducen su escala
 * - Se genera de inmediato el gráfico del indicador principal arriba y las tarjetas abajo
 */
function selectPrincipalIndicator(indId) {
  AppState.activeIndicatorId = indId;
  AppState.viewState = 'INDICATOR_SELECTED';

  const orbitalSystem = document.getElementById('orbital-system');
  const indEl = document.getElementById(`indicator-${indId}`);

  if (!indEl) return;

  const pillarId = indEl.dataset.pillarId;
  const angleFromCenter = parseFloat(indEl.dataset.angleFromCenter || '0');

  // El esquema CONSERVA el giro con el que se encuentra (el de la vista del pilar enfocado)
  // y solo se desplaza a la izquierda; así no hay rotaciones bruscas al elegir un indicador.
  const rot = AppState.networkRotation || 0;
  const scale = AppState.activePillarId ? (AppState.networkScale || 1) : 1;

  // Desplazamiento ESTRICTAMENTE HORIZONTAL hacia la izquierda (-32vw)
  if (orbitalSystem) {
    orbitalSystem.style.transform = `translate(calc(-50% - 32vw), -50%) rotate(${rot}deg) scale(${scale})`;
  }

  // Los nodos conservan su CSS (centrado + escala); los textos se contra-rotan con el giro vigente
  document.querySelectorAll('.indicator-node').forEach(n => { n.style.transform = ''; });
  counterRotateLabels(rot);

  // Atenuación de otros elementos y destaque del activo
  document.querySelectorAll('.pillar-node').forEach(p => {
    if (p.dataset.pillarId === pillarId) {
      p.classList.add('active-pillar');
      p.classList.remove('dimmed');
    } else {
      p.classList.add('dimmed');
      p.classList.remove('active-pillar');
    }
  });

  document.querySelectorAll('.indicator-node').forEach(node => {
    if (node.dataset.indicatorId === indId) {
      node.classList.add('active-indicator');
      node.classList.remove('dimmed');
    } else {
      node.classList.add('dimmed');
      node.classList.remove('active-indicator');
    }
  });

  // Secundarios: solo los del indicador activo quedan a plena intensidad
  document.querySelectorAll('.secondary-node').forEach(sec => {
    const fueraDeControl = AppState.controlLevels.size > 0 && !AppState.controlLevels.has(sec.dataset.control);
    sec.classList.toggle('dimmed', sec.dataset.parentId !== indId || fueraDeControl);
  });

  const data = AppState.dataMap.get(indId);
  const fullName = data ? data.nombre : (DEFAULT_INDICATOR_NAMES[indId] || indId);

  // Redibujar conectores adaptados a la nueva posición y rotación
  setTimeout(() => {
    drawOrbitalConnectors('FULL_NETWORK');
  }, 100);
  setTimeout(() => {
    drawOrbitalConnectors('FULL_NETWORK');
  }, 500);

  // Desplegar Panel Derecho (Gráfico del Indicador Principal)
  renderMainIndicatorPanel(indId);

  // Desplegar Tarjetas de Variables Relacionadas debajo del Gráfico
  renderRelatedCardsDeck(indId);
}

/**
 * Reinicia la vista orbital al centro sin inclinaciones ni desplazamientos
 */
function resetNetworkView() {
  AppState.viewState = 'PILLARS_READY';
  AppState.activeIndicatorId = null;
  AppState.activePillarId = null;
  AppState.showSecondary = false;

  const btnBase = document.getElementById('btn-indicadores-base');
  if (btnBase) btnBase.classList.remove('active');

  restoreDefaultIndicatorPositions();
  applySystemTransform(0, 1);

  document.querySelectorAll('.indicator-node').forEach(indnode => {
    indnode.style.transform = '';
    indnode.classList.remove('visible', 'dimmed', 'active-indicator');
  });
  document.querySelectorAll('.pillar-node').forEach(p => {
    p.classList.remove('dimmed', 'active-pillar');
  });

  // Ocultar panel derecho
  const panelTopRight = document.getElementById('panel-top-right');
  if (panelTopRight) panelTopRight.classList.remove('visible');

  refreshSecondaryLayer();
}

// ==========================================================================
// Función que vuelve clicable el título de indicador
// ==========================================================================
function bindMapLink(el, item) {
  if (!el) return;
  const on = item && item.mapa;
  el.classList.toggle('has-map', !!on);
  el.title = on ? 'Ver mapa distrital (se abre en otra pestaña)' : '';
  el.onclick = on ? () => window.open(`/mapa.html?id=${item.id}`, '_blank') : null;
}

// ==========================================================================
// 4. PANEL SUPERIOR DERECHO: GRÁFICO DEL INDICADOR PRINCIPAL
// ==========================================================================
function renderMainIndicatorPanel(indId) {
  const panelTopRight = document.getElementById('panel-top-right');
  const mainCard = document.getElementById('main-indicator-card');
  if (!panelTopRight || !mainCard) return;

  panelTopRight.classList.add('visible');
  mainCard.classList.remove('compact-mode'); // modo normal extendido

  // Obtener datos del indicador
  const data = AppState.dataMap.get(indId) || {
    id: indId,
    nombre: DEFAULT_INDICATOR_NAMES[indId] || `Indicador ${indId}`,
    pilar: getPilarNameForIndicator(indId),
    control: 2,
    unidad: 'Logaritmo',
    series: []
  };

  // Asignar cabecera (sólo nombre completo y badges necesarios)
  const pilarBadge = document.getElementById('chart-pilar-badge');
  if (pilarBadge) pilarBadge.textContent = data.pilar;

  const ctrlBadge = document.getElementById('chart-control-badge');
  if (ctrlBadge) {
    ctrlBadge.textContent = `Nivel de competencia: ${getControlLabel(data.control)}`;
    ctrlBadge.className = `control-badge control-${data.control}`;
  }

  const unitBadge = document.getElementById('chart-unit-badge');
  if (unitBadge) unitBadge.textContent = `Unidad: ${data.unidad}`;

  const titleEl = document.getElementById('chart-indicator-title');
  if (titleEl) titleEl.textContent = data.nombre;

  bindMapLink(titleEl, data);

  // Métricas 2025 y tendencia 2015-2025
  const series = data.series || [];
  const latest = series.length > 0 ? series[series.length - 1] : null;
  const earliest = series.length > 0 ? series[0] : null;

  if (latest) {
    document.getElementById('val-sm-current').textContent = !isNaN(latest.sm) ? latest.sm.toLocaleString('es-PE', { maximumFractionDigits: 1 }) : '-';
    document.getElementById('val-pe-current').textContent = !isNaN(latest.pe) ? latest.pe.toLocaleString('es-PE', { maximumFractionDigits: 1 }) : 'Error';
    console.log("Valor de latest.pe:", latest.pe, "Tipo:", typeof latest.pe);
  } else {
    document.getElementById('val-sm-current').textContent = '-';
    document.getElementById('val-pe-current').textContent = '-';
  }

  if (latest && earliest && !isNaN(latest.sm) && !isNaN(earliest.sm)) {
    const diff = latest.sm - earliest.sm;
    const diffSign = diff >= 0 ? '+' : '';
    const diffPct = earliest.sm !== 0 ? ((diff / Math.abs(earliest.sm)) * 100).toFixed(1) : '0';
    document.getElementById('val-trend-current').textContent = `${diffSign}${diff.toFixed(1)} (${diffSign}${diffPct}%)`;
  } else {
    document.getElementById('val-trend-current').textContent = 'Estable';
  }

  // Renderizar Gráfico SVG con líneas punteadas
  renderSvgChart('main-svg-chart-container', series, data.unidad);
}

// ==========================================================================
// 5. VARIABLES RELACIONADAS (DENTRO DE PANEL-TOP-RIGHT, DEBAJO DEL GRÁFICO)
// ==========================================================================

/**
 * Modo A: Renderiza las tarjetas de variables relacionadas debajo del gráfico principal
 */
function renderRelatedCardsDeck(indId) {
  const cardsView = document.getElementById('related-cards-view');
  const chartView = document.getElementById('related-chart-view');
  const cardsTrack = document.getElementById('cards-track');
  const deckCountPill = document.getElementById('deck-count-pill');

  if (!cardsTrack) return;

  if (cardsView) cardsView.style.display = 'block';
  if (chartView) chartView.style.display = 'none';

  cardsTrack.innerHTML = '';

  // Obtener variables relacionadas para este indicador
  const varsMap = AppState.relatedMap.get(indId);
  const varsList = varsMap ? Array.from(varsMap.values()) : [];

  // Actualizar contador
  if (deckCountPill) {
    deckCountPill.textContent = `${varsList.length} ${varsList.length === 1 ? ' Variable vinculada' : 'Variables vinculadas'}`;
  }

  /*if (varsList.length === 0) {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'var-card';
    emptyCard.innerHTML = `
      <div class="var-card-header">
        <span class="var-card-id">${indId}</span>
        <span class="var-card-unit">Cálculo INCORE</span>
      </div>
      <h4 class="var-card-name">Variables en integración en el archivo datos_incore_sanmartin.txt</h4>
      <div class="var-card-footer">
        <span>Sin registros adicionales</span>
        <span>—</span>
      </div>
    `;
    cardsTrack.appendChild(emptyCard);
    return;
  }*/

  // Crear tarjetas interactivas debajo del gráfico
  varsList.forEach((relVar, idx) => {
    const card = document.createElement('div');
    card.className = 'var-card';
    card.innerHTML = `
      <h4 class="var-card-name">${relVar.nombre}</h4>
      <div class="var-card-header">
        <span class="var-card-unit">${relVar.unidad}</span>
      </div>
      <div class="var-card-footer">
        <span>Nivel de competencia: ${getControlLabel(relVar.control)}</span>
      </div>
    `;

    card.addEventListener('click', () => {
      openRelatedVariableChart(indId, idx);
    });

    cardsTrack.appendChild(card);
  });
}

/**
 * Modo B: Al hacer clic en una tarjeta:
 * 1. El gráfico principal sube lo más posible (.compact-mode)
 * 2. Se genera el gráfico de la variable relacionada abajo
 * 3. Se activa el botón para volver a las tarjetas y el galón/chevron a la derecha
 */
function openRelatedVariableChart(indId, varIndex) {
  AppState.viewState = 'RELATED_SELECTED';
  AppState.activeRelatedIndex = varIndex;

  // 1. Compactar el gráfico principal arriba
  //const mainCard = document.getElementById('main-indicator-card');
  //if (mainCard) {
  //  mainCard.classList.add('compact-mode');
  //}

  // 2. Cambiar sección al Modo Gráfico de la variable
  const cardsView = document.getElementById('related-cards-view');
  const chartView = document.getElementById('related-chart-view');
  if (cardsView) cardsView.style.display = 'none';
  if (chartView) chartView.style.display = 'block';

  // 3. Obtener la variable seleccionada
  const varsMap = AppState.relatedMap.get(indId);
  const varsList = varsMap ? Array.from(varsMap.values()) : [];
  if (varsList.length === 0) return;

  const currentVar = varsList[varIndex];
  if (!currentVar) return;

  // Actualizar metadatos del toolbar
  document.getElementById('related-step-indicator').textContent = `Variable ${varIndex + 1} de ${varsList.length} | Nivel de competencia: ${getControlLabel(varsList[varIndex].control)}`;
  document.getElementById('related-step-indicator').className = `step-indicator control-${varsList[varIndex].control}`
  document.getElementById('related-active-title').textContent = currentVar.nombre;
  bindMapLink(document.getElementById('related-active-title'), currentVar);
  document.getElementById('related-active-unit').textContent = `Unidad: ${currentVar.unidad}`;

  // Actualizar texto del botón chevron
  const nextIdx = (varIndex + 1) % varsList.length;
  const chevronText = document.getElementById('chevron-ribbon-text');
  if (chevronText) {
    chevronText.textContent = varsList.length > 1 ? `Siguiente (${nextIdx + 1}/${varsList.length})` : 'Siguiente';
  }

  // 4. Renderizar Gráfico de la Variable Relacionada (2015-2025)
  renderSvgChart('secondary-svg-chart-container', currentVar.series, currentVar.unidad, true);
}

/**
 * Vuelve al modo de tarjetas completas debajo del gráfico
 */
function showRelatedCardsMode() {
  AppState.viewState = 'INDICATOR_SELECTED';

  // Descompactar gráfico principal
  const mainCard = document.getElementById('main-indicator-card');
  if (mainCard) {
    mainCard.classList.remove('compact-mode');
  }

  const cardsView = document.getElementById('related-cards-view');
  const chartView = document.getElementById('related-chart-view');
  if (cardsView) cardsView.style.display = 'block';
  if (chartView) chartView.style.display = 'none';
}

/**
 * Vuelve secuencialmente a la anterior variable relacionada con el botón Chevron
 */
function backToPrevRelatedVar() {
  if (!AppState.activeIndicatorId) return;

  const varsMap = AppState.relatedMap.get(AppState.activeIndicatorId);
  const varsList = varsMap ? Array.from(varsMap.values()) : [];
  if (varsList.length <= 1) return;

  const prevIndex = (AppState.activeRelatedIndex - 1 + + varsList.length) % varsList.length;
  openRelatedVariableChart(AppState.activeIndicatorId, prevIndex);
}

/**
 * Avanza secuencialmente a la siguiente variable relacionada con el botón Chevron
 */
function advanceToNextRelatedVar() {
  if (!AppState.activeIndicatorId) return;

  const varsMap = AppState.relatedMap.get(AppState.activeIndicatorId);
  const varsList = varsMap ? Array.from(varsMap.values()) : [];
  if (varsList.length <= 1) return;

  const nextIndex = (AppState.activeRelatedIndex + 1) % varsList.length;
  openRelatedVariableChart(AppState.activeIndicatorId, nextIndex);
}

// ==========================================================================
// 6. MOTOR DE GRÁFICOS SVG CON LÍNEAS PUNTEADAS INTERANUALES (2015-2025)
// ==========================================================================
// Registro de gráficos renderizados (para redibujarlos al ocultar/mostrar la serie Perú)
const chartRegistry = new Map();

/** Etiqueta de valor en cada vértice */
function formatValueLabel(v) {
  const a = Math.abs(v);
  const maxFrac = a >= 1000 ? 0 : a >= 100 ? 1 : 2;
  return v.toLocaleString('es-PE', { maximumFractionDigits: maxFrac });
}

/** Marcas del eje Y: precisión según el rango visible (clave al ver solo San Martín) */
function formatAxisTick(v, span) {
  const a = Math.abs(v);
  if (a >= 1000) {
    if (span >= 5000) return (v / 1000).toFixed(0) + 'k';
    if (span >= 500) return (v / 1000).toFixed(1) + 'k';
    return v.toLocaleString('es-PE', { maximumFractionDigits: 0 });
  }
  const dec = span >= 1 ? 1 : span >= 0.1 ? 2 : 3;
  return v.toFixed(dec);
}

function renderSvgChart(containerId, series, unitLabel, isSecondary = false) {
  const container = document.getElementById(containerId);
  if (!container) return;

  chartRegistry.set(containerId, { series, unitLabel, isSecondary });

  if (!series || series.length === 0) {
    container.innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">No se encontraron series numéricas en el archivo de datos para este indicador.</div>`;
    return;
  }

  const showPe = AppState.showPeru;

  // Dimensiones del contenedor SVG adaptadas a la altura completa (90vh)
  const width = container.clientWidth || 750;
  const height = container.clientHeight || (isSecondary ? 260 : 280);

  const margin = { top: 26, right: 36, bottom: 28, left: 54 };
  const plotW = width - margin.left - margin.right;
  const plotH = height - margin.top - margin.bottom;

  // Extremos de datos: sin Perú, la escala se ajusta solo a San Martín (más detalle)
  const allVals = [];
  series.forEach(d => {
    if (!isNaN(d.sm)) allVals.push(d.sm);
    if (showPe && !isNaN(d.pe)) allVals.push(d.pe);
  });

  if (allVals.length === 0) {
    container.innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--text-muted);font-size:0.85rem;">Datos numéricos no disponibles.</div>`;
    return;
  }

  let minVal = Math.min(...allVals);
  let maxVal = Math.max(...allVals);

  // Espaciado vertical
  const span = maxVal - minVal;
  const pad = span > 0 ? span * 0.14 : Math.max(Math.abs(maxVal) * 0.05, 1);
  minVal = minVal >= 0 && (minVal - pad) < 0 ? 0 : minVal - pad;
  maxVal = maxVal + pad;

  // Rango de años de la serie (por defecto 2015-2025)
  const years = series.map(d => d.year).filter(y => !isNaN(y));
  const minYear = years.length ? Math.min(...years) : 2015;
  const maxYear = years.length ? Math.max(...years) : 2025;
  const yearSpan = maxYear - minYear || 10;

  const getX = yr => margin.left + ((yr - minYear) / yearSpan) * plotW;
  const getY = val => margin.top + plotH - ((val - minVal) / (maxVal - minVal || 1)) * plotH;

  // Construcción de trazo y puntos de una serie (omite valores no numéricos)
  function buildSeries(key) {
    let path = '';
    const pts = [];
    series.forEach(d => {
      const val = d[key];
      if (isNaN(val) || isNaN(d.year)) return;
      const x = getX(d.year);
      const y = getY(val);
      path += `${pts.length === 0 ? 'M' : ' L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      pts.push({ x, y, year: d.year, val });
    });
    return { path, pts };
  }

  const sm = buildSeries('sm');
  const pe = showPe ? buildSeries('pe') : { path: '', pts: [] };
  const peByYear = new Map(pe.pts.map(p => [p.year, p]));
  const smByYear = new Map(sm.pts.map(p => [p.year, p]));

  // Rejilla horizontal de referencia
  let gridLinesSvg = '';
  for (let g = 0; g <= 3; g++) {
    const gVal = minVal + (g / 3) * (maxVal - minVal);
    const gy = getY(gVal);
    gridLinesSvg += `
      <line x1="${margin.left}" y1="${gy.toFixed(1)}" x2="${margin.left + plotW}" y2="${gy.toFixed(1)}" class="chart-grid-line" />
      <text x="${margin.left - 8}" y="${(gy + 3.5).toFixed(1)}" text-anchor="end" class="chart-axis-text">
        ${formatAxisTick(gVal, maxVal - minVal)}
      </text>
    `;
  }

  // Eje X: TODOS los años (sin saltos)
  let yearTicksSvg = '';
  for (let yr = minYear; yr <= maxYear; yr++) {
    yearTicksSvg += `
      <text x="${getX(yr).toFixed(1)}" y="${height - 8}" text-anchor="middle" class="chart-axis-text">${yr}</text>
    `;
  }

  // Puntos interactivos con Tooltips nativos (Perú primero, San Martín al frente)
  let circlesPeSvg = '';
  pe.pts.forEach(pt => {
    circlesPeSvg += `
      <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4.5" class="chart-point-pe" stroke="#ffffff" stroke-width="1.5" fill="var(--accent-pe)">
        <title>Perú (${pt.year}): ${pt.val} ${unitLabel}</title>
      </circle>
    `;
  });

  let circlesSmSvg = '';
  sm.pts.forEach(pt => {
    circlesSmSvg += `
      <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="5" class="chart-point-sm" stroke="#ffffff" stroke-width="1.8" fill="var(--accent-sm)">
        <title>San Martín (${pt.year}): ${pt.val} ${unitLabel}</title>
      </circle>
    `;
  });

  // Etiquetas de valor en cada vértice.
  // Con dos series: la de mayor valor va arriba y la menor abajo (no se pisan).
  // Con una sola serie: arriba, salvo en mínimos locales (abajo) para no cruzar la línea.
  function valueLabels(pts, cls, key) {
    let svgLabels = '';
    pts.forEach((pt, i) => {
      let below;
      if (key === 'sm') {
        const other = peByYear.get(pt.year);
        below = other ? pt.y > other.y : false;
      } else {
        const other = smByYear.get(pt.year);
        below = other ? pt.y >= other.y : false;
      }
      if (!(showPe && (key === 'sm' ? peByYear.has(pt.year) : smByYear.has(pt.year)))) {
        const prev = pts[i - 1], next = pts[i + 1];
        below = !!(prev && next && pt.y > prev.y && pt.y > next.y); // mínimo local
      }
      const ty = below ? Math.min(height - 22, pt.y + 17) : Math.max(11, pt.y - 9);
      svgLabels += `<text x="${pt.x.toFixed(1)}" y="${ty.toFixed(1)}" text-anchor="middle" class="${cls}">${formatValueLabel(pt.val)}</text>`;
    });
    return svgLabels;
  }

  container.innerHTML = `
    <svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
      ${gridLinesSvg}
      ${yearTicksSvg}
      ${showPe ? `<!-- Serie Perú Promedio Nacional (Línea punteada + Puntos) -->
      <path d="${pe.path}" class="chart-line-pe" stroke="var(--accent-pe)" stroke-width="2.4" stroke-dasharray="5 4" fill="none" />
      ${circlesPeSvg}` : ''}
      <!-- Serie San Martín Regional (Línea punteada + Puntos) -->
      <path d="${sm.path}" class="chart-line-sm" stroke="var(--accent-sm)" stroke-width="3" stroke-dasharray="4 4" fill="none" />
      ${circlesSmSvg}
      <!-- Etiquetas de valor -->
      ${valueLabels(pe.pts, 'chart-value-pe', 'pe')}
      ${valueLabels(sm.pts, 'chart-value-sm', 'sm')}
    </svg>
  `;
}

// ---- Botón (chip de la leyenda) para ocultar / mostrar la serie Perú ----
function updatePeruToggleUI() {
  document.querySelectorAll('.legend-chip.chip-pe').forEach(chip => {
    chip.classList.toggle('is-off', !AppState.showPeru);
    chip.setAttribute('aria-pressed', String(AppState.showPeru));
    chip.title = AppState.showPeru
      ? 'Ocultar la serie Perú para ver el detalle de San Martín'
      : 'Mostrar la serie Perú';
  });
}

function togglePeruSeries() {
  AppState.showPeru = !AppState.showPeru;
  updatePeruToggleUI();
  chartRegistry.forEach((cfg, id) => {
    const c = document.getElementById(id);
    if (c && c.clientWidth > 0) renderSvgChart(id, cfg.series, cfg.unitLabel, cfg.isSecondary);
  });
}

function initPeruToggle() {
  document.querySelectorAll('.legend-chip.chip-pe').forEach(chip => {
    chip.classList.add('legend-toggle');
    chip.setAttribute('role', 'button');
    chip.tabIndex = 0;
    chip.addEventListener('click', togglePeruSeries);
    chip.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePeruSeries(); }
    });
  });
  updatePeruToggleUI();
}

// ==========================================================================
// 7. DIBUJO DE CONECTORES ORBITALES SVG PERFECTAMENTE ALINEADOS
// ==========================================================================
function drawOrbitalConnectors(mode) {
  const svg = document.getElementById('orbital-svg-lines');
  if (!svg) return;

  // Centro exacto del sistema orbital en espacio local de 800x800
  const cx = 400;
  const cy = 400;

  let linesHtml = '';

  // 1. Conectar San Martín (400, 400) con cada uno de los 6 pilares
  const pillars = document.querySelectorAll('.pillar-node.visible');
  pillars.forEach(p => {
    const px = parseFloat(p.dataset.cx || '400');
    const py = parseFloat(p.dataset.cy || '400');

    linesHtml += `
      <line x1="${cx}" y1="${cy}" x2="${px}" y2="${py}" 
            stroke="rgba(16, 185, 129, 0.6)" stroke-width="2" stroke-dasharray="3 3" />
    `;
  });

  // 2. Conectar cada pilar con sus indicadores activos
  if (mode === 'FULL_NETWORK') {
    const indicators = document.querySelectorAll('.indicator-node.visible');
    indicators.forEach(ind => {
      const pilarId = ind.dataset.pillarId;
      const pilarNode = document.getElementById(`pillar-${pilarId}`);
      if (pilarNode) {
        const px = parseFloat(pilarNode.dataset.cx || '400');
        const py = parseFloat(pilarNode.dataset.cy || '400');

        const ix = parseFloat(ind.dataset.cx || '400');
        const iy = parseFloat(ind.dataset.cy || '400');

        linesHtml += `
          <line x1="${px}" y1="${py}" x2="${ix}" y2="${iy}" 
                stroke="rgba(148, 163, 184, 0.45)" stroke-width="1.5" stroke-dasharray="2 3" />
        `;
      }
    });
  }

  // 3. Conectar cada indicador principal con sus indicadores secundarios
  document.querySelectorAll('.secondary-node').forEach(sec => {
    const parent = document.getElementById(`indicator-${sec.dataset.parentId}`);
    if (!parent || !parent.classList.contains('visible')) return;
    linesHtml += `
      <line x1="${parent.dataset.cx}" y1="${parent.dataset.cy}" x2="${sec.dataset.cx}" y2="${sec.dataset.cy}"
            stroke="rgba(16, 185, 129, 0.55)" stroke-width="1.3" stroke-dasharray="2 3" />
    `;
  });

  svg.innerHTML = linesHtml;
}

// Mantener conectores alineados en resize
window.addEventListener('resize', () => {
  if (AppState.viewState !== 'INITIAL') {
    drawOrbitalConnectors(AppState.viewState === 'EXPANDED_L01' || AppState.viewState === 'PILLAR_SELECTED' || AppState.viewState === 'INDICATOR_SELECTED' || AppState.viewState === 'RELATED_SELECTED' ? 'FULL_NETWORK' : 'PILLARS_ONLY');
  }
});

// ==========================================================================
// 8. CONTROLES DE CABECERA Y HERRAMIENTAS
// ==========================================================================
function initHeaderControls() {
  // Botones de foco por nivel de control GORE (1 = bajo, 2 = medio, 3 = alto). Se pueden combinar.
  const CONTROL_BUTTONS = { '1': 'btn-highlight-control-1', '2': 'btn-highlight-control-2', '3': 'btn-highlight-control' };
  Object.entries(CONTROL_BUTTONS).forEach(([level, id]) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener('click', () => {
      if (AppState.controlLevels.has(level)) AppState.controlLevels.delete(level);
      else AppState.controlLevels.add(level);
      btn.classList.toggle('active', AppState.controlLevels.has(level));
      applyControlFocus();
    });
  });

  // Botón Reiniciar Red
  const btnReset = document.getElementById('btn-reset-view');
  if (btnReset) {
    btnReset.addEventListener('click', () => {
      resetNetworkView();
    });
  }
}

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
    localStorage.setItem('incore_theme', isDarkNow ? 'dark' : 'light');
    updateThemeButtonText(themeBtn, isDarkNow);

    // Re-renderizar gráficos
    if (AppState.activeIndicatorId) {
      renderMainIndicatorPanel(AppState.activeIndicatorId);
      if (AppState.viewState === 'RELATED_SELECTED') {
        openRelatedVariableChart(AppState.activeIndicatorId, AppState.activeRelatedIndex);
      }
    }
  });
}

function updateThemeButtonText(button, isDark) {
  if (isDark) {
    button.innerHTML = '✴︎ <span>Modo Claro</span>';
    button.setAttribute('title', 'Cambiar a Modo Claro');
  } else {
    button.innerHTML = '⏺︎ <span>Modo Oscuro</span>';
    button.setAttribute('title', 'Cambiar a Modo Oscuro');
  }
}

function getControlLabel(level) {
  switch (parseInt(level, 10)) {
    case 3: return 'Alta';
    case 2: return 'Media';
    default: return 'Baja';
  }
}

function getPilarNameForIndicator(indId) {
  for (const p of PILLARS_CONFIG) {
    if (p.indicators.includes(indId)) return p.name;
  }
  return 'General';
}


// ==========================================================================
// 9. ROTACIÓN COMPARTIDA, ENFOQUE EN PILAR E INDICADORES SECUNDARIOS
// ==========================================================================

/** Giro equivalente más cercano al actual (evita vueltas de 300°) */
function nearestRotation(target) {
  const current = AppState.networkRotation || 0;
  const delta = ((((target - current + 540) % 360) + 360) % 360) - 180;
  return current + delta;
}

/** Contra-rotación para que textos e iconos permanezcan siempre horizontales */
function counterRotateLabels(rot) {
  const t = `rotate(${-rot}deg)`;
  document.querySelectorAll(
    '.indicator-node-inner, .secondary-node-inner, .pillar-node-inner, .sphere-san-martin .sphere-inner'
  ).forEach(el => { el.style.transform = t; });
}

/** Transformación del sistema: traslación -> rotación -> escala (orden fijo para animar suave) */
function applySystemTransform(rot, scale, shiftX = 0) {
  const sys = document.getElementById('orbital-system');
  if (!sys) return;
  AppState.networkRotation = rot;
  AppState.networkScale = scale;
  sys.style.transform = `translate(calc(-50% + ${shiftX}px), -50%) rotate(${rot}deg) scale(${scale})`;
  counterRotateLabels(rot);
}

function setNodePosition(node, x, y) {
  node.style.left = `${x}px`;
  node.style.top = `${y}px`;
  node.dataset.cx = x.toString();
  node.dataset.cy = y.toString();
  node.dataset.angleFromCenter = ((Math.atan2(y - 400, x - 400) * 180) / Math.PI).toString();
}

function restoreDefaultIndicatorPositions() {
  document.querySelectorAll('.indicator-node').forEach(n => {
    n.classList.remove('is-hidden');
    setNodePosition(n, parseFloat(n.dataset.baseX), parseFloat(n.dataset.baseY));
  });
}

/**
 * Aplica el foco por nivel de control a indicadores principales y secundarios:
 * los niveles activos se realzan (color propio) y el resto se atenúa.
 */
function applyControlFocus() {
  const levels = AppState.controlLevels;
  document.querySelectorAll('.indicator-node, .secondary-node').forEach(node => {
    const lvl = node.dataset.control;
    [...node.classList].filter(c => c.startsWith('highlight-control-')).forEach(c => node.classList.remove(c));
    if (levels.size === 0) {
      node.classList.remove('dimmed');
    } else if (levels.has(lvl)) {
      node.classList.remove('dimmed');
      node.classList.add(`highlight-control-${lvl}`);
    } else {
      node.classList.add('dimmed');
    }
  });
}

function reapplyGoreHighlight() {
  if (AppState.controlLevels.size === 0) return;
  applyControlFocus();
}

function redrawConnectors() {
  drawOrbitalConnectors(AppState.viewState === 'PILLARS_READY' ? 'PILLARS_ONLY' : 'FULL_NETWORK');
}

/**
 * Clic sobre un pilar:
 * - el esquema rota para dejar el pilar a la derecha (0°), igual que con un indicador
 * - se ocultan los indicadores de los demás pilares
 * - los indicadores del pilar se redistribuyen para verse completos
 * Un segundo clic sobre el mismo pilar regresa a la vista inicial.
 */
function selectPillar(pillarId) {
  if (AppState.activePillarId === pillarId && AppState.viewState === 'PILLAR_SELECTED') {
    resetNetworkView();
    return;
  }
  focusPillar(pillarId);
}

function focusPillar(pillarId) {
  AppState.activePillarId = pillarId;
  AppState.activeIndicatorId = null;
  AppState.viewState = 'PILLAR_SELECTED';

  const panelTopRight = document.getElementById('panel-top-right');
  if (panelTopRight) panelTopRight.classList.remove('visible');

  document.querySelectorAll('.pillar-node').forEach(p => {
    const mine = p.dataset.pillarId === pillarId;
    p.classList.toggle('active-pillar', mine);
    p.classList.toggle('dimmed', !mine);
  });
  document.querySelectorAll('.indicator-node').forEach(n => n.classList.remove('active-indicator', 'dimmed'));

  layoutPillarFocus();
}

function layoutPillarFocus() {
  const pillarId = AppState.activePillarId;
  const pillar = PILLARS_CONFIG.find(p => p.id === pillarId);
  const pEl = document.getElementById(`pillar-${pillarId}`);
  if (!pillar || !pEl) return;

  const F = FOCUS;
  const px = parseFloat(pEl.dataset.cx);
  const py = parseFloat(pEl.dataset.cy);
  const alphaDeg = parseFloat(pEl.dataset.angleDeg);
  const alpha = (alphaDeg * Math.PI) / 180;
  const n = pillar.indicators.length;
  const tree = AppState.showSecondary; // con secundarios: columna ordenada; sin ellos: abanico

  let maxKids = 0;
  pillar.indicators.forEach(id => {
    const m = AppState.relatedMap.get(id);
    if (m) maxKids = Math.max(maxKids, m.size);
  });

  document.querySelectorAll('.indicator-node').forEach(node => {
    if (node.dataset.pillarId !== pillarId) {
      node.classList.add('is-hidden');
      node.classList.remove('visible', 'active-indicator');
      return;
    }

    const idx = pillar.indicators.indexOf(node.dataset.indicatorId);
    let u, v; // u: hacia afuera del pilar, v: perpendicular
    if (tree) {
      u = F.treeU;
      v = (idx - (n - 1) / 2) * F.treeRow;
    } else {
      const off = ((-F.fanArc / 2 + (idx * F.fanArc) / (n - 1)) * Math.PI) / 180;
      u = F.fanRadius * Math.cos(off);
      v = F.fanRadius * Math.sin(off);
    }
    const x = px + u * Math.cos(alpha) - v * Math.sin(alpha);
    const y = py + u * Math.sin(alpha) + v * Math.cos(alpha);

    const wasVisible = node.classList.contains('visible') && !node.classList.contains('is-hidden');
    if (!wasVisible) node.style.transition = 'none'; // aparece ya en su lugar, sin "volar"
    setNodePosition(node, x, y);
    if (!wasVisible) { void node.offsetWidth; node.style.transition = ''; }

    node.classList.remove('is-hidden');
    node.classList.add('visible');
  });
  reapplyGoreHighlight();

  // Encuadre: el conjunto completo debe caber en pantalla
  const dist = Math.hypot(px - 400, py - 400);
  const left = -(dist + 55);
  let right, halfH;
  if (tree) {
    const kidsExtent = maxKids > 0 ? F.kidFirst + (maxKids - 1) * F.kidStep + 34 : 40;
    right = dist + F.treeU + kidsExtent;
    halfH = ((n - 1) / 2) * F.treeRow + 40;
  } else {
    right = dist + F.fanRadius + 40;
    halfH = Math.max(F.fanRadius + 40, 270);
  }
  const mu = document.getElementById('main-universe');
  const W = (mu && mu.clientWidth) || window.innerWidth;
  const H = (mu && mu.clientHeight) || (window.innerHeight - 60);
  const scale = Math.min(1, (W * 0.94) / (right - left), (H * 0.94) / (2 * halfH));
  const shiftX = -((right + left) / 2) * scale;

  applySystemTransform(nearestRotation(-alphaDeg), scale, shiftX);

  refreshSecondaryLayer();
  setTimeout(redrawConnectors, 750);
}

/**
 * Botón "Indicadores de soporte": muestra / oculta los indicadores secundarios
 * (ids tipo EE1-1, EE1-2, EE1-3 ligados a su principal EE1 en el archivo de datos)
 */
function toggleSecondaryIndicators() {
  AppState.showSecondary = !AppState.showSecondary;

  const btn = document.getElementById('btn-indicadores-base');
  if (btn) btn.classList.toggle('active', AppState.showSecondary);

  if (AppState.activePillarId) {
    // Se redistribuye el pilar (abanico <-> columna con ramas) y se cierra el panel si estaba abierto
    focusPillar(AppState.activePillarId);
    return;
  }

  const anyVisible = document.querySelector('.indicator-node.visible');
  if (AppState.showSecondary && !anyVisible) {
    expandIndicatorsIncore(); // muestra los principales y, al terminar, los secundarios
  } else {
    refreshSecondaryLayer();
  }
}

function ensureSecondaryLayer() {
  let layer = document.getElementById('secondary-orbit-layer');
  if (!layer) {
    layer = document.createElement('div');
    layer.id = 'secondary-orbit-layer';
    layer.className = 'secondary-orbit-layer';
    const sys = document.getElementById('orbital-system');
    const indLayer = document.getElementById('indicators-orbit-layer');
    if (sys) sys.insertBefore(layer, indLayer);
  }
  return layer;
}

function refreshSecondaryLayer() {
  const layer = ensureSecondaryLayer();
  layer.innerHTML = '';

  if (AppState.showSecondary) {
    const focusEl = AppState.activePillarId ? document.getElementById(`pillar-${AppState.activePillarId}`) : null;
    const compact = !focusEl;
    let counter = 0;

    document.querySelectorAll('.indicator-node.visible').forEach(parentEl => {
      const pid = parentEl.dataset.indicatorId;
      const vars = AppState.relatedMap.get(pid);
      if (!vars || vars.size === 0) return;

      const list = Array.from(vars.values());
      const ix = parseFloat(parentEl.dataset.cx);
      const iy = parseFloat(parentEl.dataset.cy);

      // Dirección de crecimiento: hacia afuera del pilar
      let baseAngle;
      if (focusEl) {
        baseAngle = (parseFloat(focusEl.dataset.angleDeg) * Math.PI) / 180;
      } else {
        const parentPillar = document.getElementById(`pillar-${parentEl.dataset.pillarId}`);
        baseAngle = Math.atan2(iy - parseFloat(parentPillar.dataset.cy), ix - parseFloat(parentPillar.dataset.cx));
      }

      list.forEach((relVar, j) => {
        let x, y;
        if (focusEl) {
          const d = FOCUS.kidFirst + j * FOCUS.kidStep; // fila recta junto a su principal
          x = ix + d * Math.cos(baseAngle);
          y = iy + d * Math.sin(baseAngle);
        } else {
          const off = ((j - (list.length - 1) / 2) * 34 * Math.PI) / 180; // satélites en vista general
          x = ix + 64 * Math.cos(baseAngle + off);
          y = iy + 64 * Math.sin(baseAngle + off);
        }

        const el = document.createElement('div');
        el.className = `secondary-node${compact ? ' compact' : ''}`;
        el.dataset.parentId = pid;
        el.dataset.varId = relVar.id;
        el.dataset.control = String(relVar.control);
        if (AppState.controlLevels.size > 0) {
          const lvl = String(relVar.control);
          el.classList.add(AppState.controlLevels.has(lvl) ? `highlight-control-${lvl}` : 'dimmed');
        }
        el.dataset.cx = x.toString();
        el.dataset.cy = y.toString();
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.title = `${relVar.nombre} (${relVar.unidad}) · Competencia: ${getControlLabel(relVar.control)}`;
        el.innerHTML = `
          <div class="secondary-node-inner" style="transform: rotate(${-AppState.networkRotation}deg)">
            <span class="secondary-full-label">${relVar.nombre}</span>
          </div>
        `;
        el.addEventListener('click', (e) => {
          e.stopPropagation();
          selectPrincipalIndicator(pid);
          openRelatedVariableChart(pid, j);
        });

        // Al pasar el mouse, toda la capa de secundarios sube por encima de pilares e indicadores
        el.addEventListener('mouseenter', () => layer.classList.add('hover-top'));
        el.addEventListener('mouseleave', () => layer.classList.remove('hover-top'));
        layer.appendChild(el);
        setTimeout(() => el.classList.add('visible'), 30 + (counter++ % 14) * 25);
      });
    });
  }

  redrawConnectors();
}