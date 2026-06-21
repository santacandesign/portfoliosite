/* ================================================================
   Cleartrip AI · Explore v2 · app.js
   ================================================================ */

/* ── DESTINATION DATA ────────────────────────────── */
const DESTINATIONS = [
  { id: 'tokyo',     city: 'Tokyo',       country: 'Japan',       emoji: '🗼', tag: 'Trending'    },
  { id: 'kyoto',     city: 'Kyoto',       country: 'Japan',       emoji: '⛩️', tag: 'Cultural'    },
  { id: 'osaka',     city: 'Osaka',       country: 'Japan',       emoji: '🏯', tag: 'Foodie'      },
  { id: 'bali',      city: 'Bali',        country: 'Indonesia',   emoji: '🌴', tag: 'Beach'       },
  { id: 'paris',     city: 'Paris',       country: 'France',      emoji: '🗼', tag: 'Classic'     },
  { id: 'dubai',     city: 'Dubai',       country: 'UAE',         emoji: '🌆', tag: 'Luxury'      },
  { id: 'singapore', city: 'Singapore',   country: 'Singapore',   emoji: '🦁', tag: 'City break'  },
  { id: 'maldives',  city: 'Maldives',    country: 'Maldives',    emoji: '🐠', tag: 'Beach'       },
  { id: 'london',    city: 'London',      country: 'UK',          emoji: '🎡', tag: 'Classic'     },
  { id: 'bangkok',   city: 'Bangkok',     country: 'Thailand',    emoji: '🛕', tag: 'Value'       },
  { id: 'rome',      city: 'Rome',        country: 'Italy',       emoji: '🏛️', tag: 'Historic'    },
  { id: 'newYork',   city: 'New York',    country: 'USA',         emoji: '🗽', tag: 'City break'  },
];

const EXAMPLE_PROMPT = "I'm going to the Hatsune Miku concert on August 28th, help me plan a 2 week trip around this for me and my partner";

const HISTORY = [
  { text: "I'm going to the Hatsune Miku concert on August 28th, help me plan a 2 week trip around this", time: "Just now" },
  { text: "10 days in Bali for a honeymoon, we love food and surfing", time: "Yesterday" },
  { text: "Weekend trip from Bangalore, budget under ₹30k total", time: "2 days ago" },
];

/* ── STATE ───────────────────────────────────────── */
const S = {
  where:       [],
  dateMode:    'exact',
  dateFrom:    null,
  dateTo:      null,
  calPhase:    'start',
  calYear:     2026,
  calMonth:    7,       // August
  flexMonth:   7,
  flexNights:  14,
  nightsUnit:  'nights',
  adults:      1,
  children:    0,
  activeChip:  null,    // 'where' | 'when' | 'who' | 'history' | null
  prompted:    false,   // has the textarea been pre-filled
};

/* ── UTILS ───────────────────────────────────────── */
const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOWS         = ['Su','Mo','Tu','We','Th','Fr','Sa'];
const toKey  = (y,m,d) => `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
const fmtDate = k => k ? new Date(k+'T00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'}) : '';
const $  = id => document.getElementById(id);

/* ── OPEN / CLOSE CHIP DROPDOWNS ─────────────────── */
function openChip(name) {
  S.activeChip = name;
  ['sfWhere','sfWhen','sfWho'].forEach(id => $(id)?.classList.remove('active'));
  ['dropWhere','dropWhen','dropWho','historyPanel'].forEach(id => $(id)?.classList.remove('open'));

  if (!name) return;
  if (name === 'history') { $('historyPanel')?.classList.add('open'); return; }

  const chipMap = { where: 'sfWhere', when: 'sfWhen', who: 'sfWho' };
  const dropMap = { where: 'dropWhere', when: 'dropWhen', who: 'dropWho' };

  $(chipMap[name])?.classList.add('active');
  $(dropMap[name])?.classList.add('open');

  if (name === 'where') { const i = $('destInput'); if (i) { i.focus(); renderDestGrid(''); } }
  if (name === 'when')  renderCalendar();
  if (name === 'who')   updateWhoButtons();
}

function closeAll() {
  S.activeChip = null;
  ['sfWhere','sfWhen','sfWho'].forEach(id => $(id)?.classList.remove('active'));
  ['dropWhere','dropWhen','dropWho','historyPanel'].forEach(id => $(id)?.classList.remove('open'));
}

/* ── WHERE ───────────────────────────────────────── */
function updateWhereChip() {
  const chip = $('sfWhere'), span = $('sfWhereVal');
  if (!chip || !span) return;
  if (!S.where.length) {
    span.textContent = 'Where';
    chip.classList.remove('filled');
  } else {
    span.textContent = S.where.map(d => d.emoji + ' ' + d.city).join(', ');
    chip.classList.add('filled');
  }
}

function renderDestGrid(query) {
  const q = query.toLowerCase().trim();
  const selectedIds = new Set(S.where.map(d => d.id));
  const filtered = DESTINATIONS.filter(d => {
    const match = !q || d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    return match && !selectedIds.has(d.id);
  });
  const label = $('destLabel');
  if (label) label.textContent = q ? `Results for "${query}"` : 'Suggested destinations';
  const grid = $('destGrid');
  if (!grid) return;
  if (!filtered.length) {
    grid.innerHTML = `<div class="dest-no-results">No results for "<b>${query}</b>"</div>`;
    return;
  }
  grid.innerHTML = filtered.slice(0, 10).map(d => `
    <div class="dest-card" data-dest="${d.id}">
      <div class="dest-card__emoji">${d.emoji}</div>
      <div class="dest-card__city">${d.city}</div>
      <div class="dest-card__country">${d.country}</div>
    </div>
  `).join('');
  grid.querySelectorAll('.dest-card').forEach(card => {
    card.onclick = () => {
      const dest = DESTINATIONS.find(d => d.id === card.dataset.dest);
      if (dest && !S.where.find(d => d.id === dest.id)) S.where.push(dest);
      updateWhereChip();
      const i = $('destInput'); if (i) { i.value = ''; i.focus(); }
      renderDestGrid('');
    };
  });
}

/* ── WHEN ────────────────────────────────────────── */
function renderCalendar() {
  const area = $('calendarArea');
  if (!area) return;
  S.dateMode === 'exact' ? renderExactCal(area) : renderFlexPicker(area);
}

function renderExactCal(area) {
  const yr = S.calYear, mo = S.calMonth;
  const firstDow = new Date(yr, mo, 1).getDay();
  const daysInMo = new Date(yr, mo+1, 0).getDate();
  const from = S.dateFrom, to = S.dateTo;
  let cells = '';
  DOWS.forEach(d => { cells += `<div class="cal-dow">${d}</div>`; });
  for (let i = 0; i < firstDow; i++) cells += `<div class="cal-day cal-day--empty"><div class="cal-day__num"></div></div>`;
  for (let d = 1; d <= daysInMo; d++) {
    const key = toKey(yr, mo, d);
    const dow = new Date(yr, mo, d).getDay();
    const isStart = key === from, isEnd = key === to;
    const inRange = from && to && key > from && key < to;
    let cls = 'cal-day';
    if (isStart) cls += ' cal-day--start';
    if (isEnd)   cls += ' cal-day--end';
    if (inRange) cls += ' cal-day--in-range';
    if ((inRange || isStart || isEnd) && from && to) {
      if (dow === 0 || isStart) cls += ' cal-day--row-start';
      if (dow === 6 || isEnd)   cls += ' cal-day--row-end';
    }
    cells += `<div class="${cls}" data-key="${key}"><div class="cal-day__num">${d}</div></div>`;
  }
  area.innerHTML = `
    <div class="cal-nav">
      <button class="cal-nav__btn" id="calPrev">‹</button>
      <div class="cal-nav__month">${MONTHS_LONG[mo]} ${yr}</div>
      <button class="cal-nav__btn" id="calNext">›</button>
    </div>
    <div class="cal-grid" id="calGrid">${cells}</div>
    <div class="cal-range-label">
      <div class="cal-range-box ${S.calPhase==='start'?'active':''}" id="calBoxFrom">
        <div class="cal-range-box__label">✈ Depart</div>
        <div class="cal-range-box__val ${from?'':'empty'}">${fmtDate(from)||'Add date'}</div>
      </div>
      <div class="cal-range-sep">→</div>
      <div class="cal-range-box ${S.calPhase==='end'?'active':''}" id="calBoxTo">
        <div class="cal-range-box__label">🏠 Return</div>
        <div class="cal-range-box__val ${to?'':'empty'}">${fmtDate(to)||'Add date'}</div>
      </div>
    </div>
  `;
  $('calPrev').onclick = () => { S.calMonth--; if (S.calMonth < 0) { S.calMonth = 11; S.calYear--; } renderCalendar(); };
  $('calNext').onclick = () => { S.calMonth++; if (S.calMonth > 11) { S.calMonth = 0; S.calYear++; } renderCalendar(); };

  const applyHover = hk => {
    if (!from || S.calPhase !== 'end') return;
    const lo = from < hk ? from : hk, hi = from < hk ? hk : from;
    area.querySelectorAll('.cal-day[data-key]').forEach(d => {
      const k = d.dataset.key;
      d.classList.remove('cal-day--in-range','cal-day--start','cal-day--end','cal-day--row-start','cal-day--row-end');
      if (k === from) d.classList.add('cal-day--start');
      if (k === hk)   d.classList.add(from <= hk ? 'cal-day--end' : 'cal-day--start');
      if (k > lo && k < hi) d.classList.add('cal-day--in-range');
    });
    const toBox = $('calBoxTo');
    if (toBox) toBox.querySelector('.cal-range-box__val').textContent = fmtDate(hk) || 'Add date';
  };

  area.querySelectorAll('.cal-day[data-key]').forEach(day => {
    day.onclick = () => {
      const k = day.dataset.key;
      if (S.calPhase === 'start') { S.dateFrom = k; S.dateTo = null; S.calPhase = 'end'; renderCalendar(); }
      else {
        if (k >= S.dateFrom) { S.dateTo = k; } else { S.dateTo = S.dateFrom; S.dateFrom = k; }
        S.calPhase = 'start'; setWhenChip(); renderCalendar();
        if (S.dateTo) setTimeout(() => openChip('who'), 200);
      }
    };
    day.onmouseenter = () => applyHover(day.dataset.key);
  });
  const grid = $('calGrid');
  if (grid) grid.onmouseleave = () => { if (S.calPhase === 'end') renderCalendar(); };
  const boxFrom = $('calBoxFrom');
  if (boxFrom) boxFrom.onclick = () => { S.calPhase = 'start'; S.dateFrom = null; S.dateTo = null; renderCalendar(); };
}

function renderFlexPicker(area) {
  const startMonth = 4;
  const tiles = [];
  for (let i = 0; i < 9; i++) {
    const mi = (startMonth + i) % 12;
    const yr = 2026 + Math.floor((startMonth + i) / 12);
    tiles.push({ mi, yr });
  }
  const unitToNights = { nights: 1, weeks: 7, months: 30 };
  const dispVal = Math.max(1, Math.round(S.flexNights / (unitToNights[S.nightsUnit] || 1)));
  area.innerHTML = `
    <div class="flex-months">
      ${tiles.map(t => `<div class="flex-month ${S.flexMonth===t.mi?'flex-month--on':''}" data-mi="${t.mi}">
        <span class="flex-month__name">${MONTHS_SHORT[t.mi]}</span><span class="flex-month__year">${t.yr}</span>
      </div>`).join('')}
    </div>
    <div class="flex-nights-row">
      <div class="flex-nights-label">How long?</div>
      <div class="flex-nights-stepper">
        <button class="flex-step-btn" id="nDown">−</button>
        <span class="flex-nights-val" id="nNum">${dispVal}</span>
        <button class="flex-step-btn" id="nUp">+</button>
        <select class="flex-unit-sel" id="nightsUnit">
          <option value="nights" ${S.nightsUnit==='nights'?'selected':''}>nights</option>
          <option value="weeks"  ${S.nightsUnit==='weeks' ?'selected':''}>weeks</option>
          <option value="months" ${S.nightsUnit==='months'?'selected':''}>months</option>
        </select>
      </div>
    </div>
  `;
  let disp = dispVal;
  const unitToN = () => ({ nights:1, weeks:7, months:30 })[$('nightsUnit')?.value || S.nightsUnit] || 1;
  const updN = () => { $('nNum').textContent = disp; S.nightsUnit = $('nightsUnit')?.value; S.flexNights = disp * unitToN(); setWhenChip(); };
  $('nDown').onclick = e => { e.stopPropagation(); disp = Math.max(1, disp-1); updN(); };
  $('nUp').onclick   = e => { e.stopPropagation(); disp = Math.min(52, disp+1); updN(); };
  $('nightsUnit').onchange = e => { e.stopPropagation(); S.nightsUnit = e.target.value; disp = Math.max(1, Math.round(S.flexNights / unitToN())); $('nNum').textContent = disp; setWhenChip(); };
  area.querySelectorAll('.flex-month').forEach(t => t.onclick = e => {
    e.stopPropagation(); S.flexMonth = parseInt(t.dataset.mi);
    area.querySelectorAll('.flex-month').forEach(x => x.classList.remove('flex-month--on'));
    t.classList.add('flex-month--on'); setWhenChip();
  });
}

function setWhenChip() {
  const chip = $('sfWhen'), span = $('sfWhenVal');
  if (!chip || !span) return;
  if (S.dateMode === 'exact' && S.dateFrom && S.dateTo) {
    span.textContent = `${fmtDate(S.dateFrom)} – ${fmtDate(S.dateTo)}`;
    chip.classList.add('filled');
  } else if (S.dateMode === 'flexible') {
    const u = { nights:1, weeks:7, months:30 };
    const v = Math.max(1, Math.round(S.flexNights / (u[S.nightsUnit]||1)));
    span.textContent = `${MONTHS_SHORT[S.flexMonth]} · ${v} ${S.nightsUnit}`;
    chip.classList.add('filled');
  }
}

/* ── WHO ─────────────────────────────────────────── */
function updateWhoButtons() {
  $('adultNum').textContent = S.adults;
  $('childNum').textContent = S.children;
  $('adultDown').disabled   = S.adults <= 1;
  $('childDown').disabled   = S.children <= 0;
}

function setWhoChip() {
  const total = S.adults + S.children;
  const chip = $('sfWho'), span = $('sfWhoVal');
  if (chip && span) {
    span.textContent = total === 1 ? '1 guest' : `${total} guests`;
    chip.classList.add('filled');
  }
  closeAll();
}

/* ── HISTORY ─────────────────────────────────────── */
function renderHistory() {
  const list = $('historyList');
  if (!list) return;
  list.innerHTML = HISTORY.map(h => `
    <div class="history-item" data-text="${h.text.replace(/"/g,'&quot;')}">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      <div class="history-item__text">${h.text}</div>
      <div class="history-item__time">${h.time}</div>
    </div>
  `).join('');
  list.querySelectorAll('.history-item').forEach(item => {
    item.onclick = () => {
      const ta = $('searchTextarea');
      if (ta) { ta.value = item.dataset.text; autoGrow(ta); }
      closeAll();
    };
  });
}

/* ── TEXTAREA AUTO-GROW ──────────────────────────── */
function autoGrow(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 220) + 'px';
}

/* ── NAVIGATE ────────────────────────────────────── */
function goToResults() {
  const ta = $('searchTextarea');
  const text = ta?.value?.trim();
  if (!text) return;

  const box  = $('searchBox');
  const hero = document.querySelector('.hero-inner');

  if (box) {
    const boxRect = box.getBoundingClientRect();
    // Travel from current position down to the bottom of the viewport
    const travelY = window.innerHeight - boxRect.top + 20;
    box.style.transition = 'transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.28s 0.08s';
    box.style.transform  = `translateY(${travelY}px)`;
    box.style.opacity    = '0';
  }
  if (hero) { hero.style.transition = 'opacity 0.25s'; hero.style.opacity = '0'; }

  setTimeout(() => { window.location.href = 'results.html'; }, 420);
}

/* ── INIT ────────────────────────────────────────── */
function init() {
  const ta = $('searchTextarea');

  // Focus textarea → pre-fill example if empty
  ta?.addEventListener('focus', () => {
    if (!S.prompted && !ta.value.trim()) {
      ta.value = EXAMPLE_PROMPT;
      ta.setSelectionRange(ta.value.length, ta.value.length);
      S.prompted = true;
      autoGrow(ta);
    }
    closeAll();
  });

  ta?.addEventListener('input', () => autoGrow(ta));

  // Enter (without Shift) submits
  ta?.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); goToResults(); }
  });

  // Send button
  $('sendBtn')?.addEventListener('click', e => { e.stopPropagation(); goToResults(); });

  // History button
  $('historyBtn')?.addEventListener('click', e => {
    e.stopPropagation();
    if (S.activeChip === 'history') { closeAll(); return; }
    renderHistory(); openChip('history');
  });

  // Chip buttons
  ['sfWhere','sfWhen','sfWho'].forEach(id => {
    $(id)?.addEventListener('click', e => {
      e.stopPropagation();
      const field = id.replace('sf','').toLowerCase();
      S.activeChip === field ? closeAll() : openChip(field);
    });
  });

  // When tabs
  document.querySelectorAll('.when-tab').forEach(tab => {
    tab.addEventListener('click', e => {
      e.stopPropagation();
      S.dateMode = tab.dataset.mode;
      document.querySelectorAll('.when-tab').forEach(t => t.classList.remove('when-tab--on'));
      tab.classList.add('when-tab--on');
      renderCalendar();
    });
  });

  // Who stepper
  $('adultUp')?.addEventListener('click',   e => { e.stopPropagation(); S.adults++; updateWhoButtons(); });
  $('adultDown')?.addEventListener('click', e => { e.stopPropagation(); S.adults = Math.max(1, S.adults-1); updateWhoButtons(); });
  $('childUp')?.addEventListener('click',   e => { e.stopPropagation(); S.children++; updateWhoButtons(); });
  $('childDown')?.addEventListener('click', e => { e.stopPropagation(); S.children = Math.max(0, S.children-1); updateWhoButtons(); });
  $('whoDone')?.addEventListener('click',   e => { e.stopPropagation(); setWhoChip(); });

  // Dest search input
  document.addEventListener('input', e => {
    if (e.target.id === 'destInput') renderDestGrid(e.target.value);
  });

  // Stop dropdown clicks bubbling
  ['dropWhere','dropWhen','dropWho','historyPanel'].forEach(id => {
    $(id)?.addEventListener('click', e => e.stopPropagation());
  });

  // Close on outside click
  document.addEventListener('click', closeAll);
}

document.addEventListener('DOMContentLoaded', init);
