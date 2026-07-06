/**
 * Job Application Tracker — localStorage-backed daily logging & dashboard
 */

const STORAGE_KEY = 'job-application-tracker-v1';

const DEFAULT_ROLES = [
  'OA', 'Contract OA', 'ProdA', 'BI', 'DA', 'DA contract',
  'AE', 'DAE contract', 'DE contract', 'DE', 'SC', 'PI',
  'BA', 'DS', 'DS Contract', 'Misc',
];

const DEFAULT_WEBSITES = [
  'LinkedIn', 'Indeed', 'Company Site', 'Wellfound', 'Glassdoor',
  'Handshake', 'Dice', 'ZipRecruiter', 'Other',
];

const DEFAULT_MEDIUMS = [
  'LinkedIn', 'Email', 'Phone', 'In-person', 'Event', 'Referral', 'Other',
];

// --- Utilities ---

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDateInfo(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const dayNum = String(d.getDate()).padStart(2, '0');
  const date = `${year}-${month}-${dayNum}`;
  const day = d.toLocaleDateString('en-US', { weekday: 'long' });
  return { date, day };
}

function migrateLogDate(l) {
  if (l && l.timestamp) {
    const info = getDateInfo(new Date(l.timestamp));
    return { ...l, date: info.date, day: info.day };
  }
  return l;
}

function formatTime(timestamp) {
  if (!timestamp) return '—';
  const d = new Date(timestamp);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getWeekKey(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(d);
  monday.setDate(diff);
  return monday.toISOString().split('T')[0];
}

function labelById(items, id) {
  const item = items.find((i) => i.id === id);
  return item ? item.label : id || '—';
}

function sumCounts(logs) {
  return logs.reduce((s, l) => s + (l.count || 1), 0);
}

// --- State ---

function defaultState() {
  return {
    version: 2,
    roles: DEFAULT_ROLES.map((label) => ({ id: uid(), label })),
    websites: DEFAULT_WEBSITES.map((label) => ({ id: uid(), label })),
    mediums: DEFAULT_MEDIUMS.map((label) => ({ id: uid(), label })),
    logs: [],
    networkLogs: [],
    settings: { lastRoleId: null, lastWebsiteId: null, lastMediumId: null },
  };
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState();
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return defaultState();
    return {
      ...defaultState(),
      ...parsed,
      roles: Array.isArray(parsed.roles) && parsed.roles.length ? parsed.roles : defaultState().roles,
      websites: Array.isArray(parsed.websites) && parsed.websites.length ? parsed.websites : defaultState().websites,
      mediums: Array.isArray(parsed.mediums) && parsed.mediums.length ? parsed.mediums : defaultState().mediums,
      logs: (Array.isArray(parsed.logs) ? parsed.logs : []).map(migrateLogDate),
      networkLogs: (Array.isArray(parsed.networkLogs) ? parsed.networkLogs : []).map(migrateLogDate),
      settings: { ...defaultState().settings, ...(parsed.settings || {}) },
    };
  } catch {
    return defaultState();
  }
}

function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Save failed:', e);
  }
}

let state = loadState();

// --- DOM refs (set on init) ---

const els = {};

function $(id) {
  return document.getElementById(id);
}

// --- Toast ---

let toastTimer;
function showToast(msg) {
  const t = $('tracker-toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// --- Logging ---

function addLog({ roleId, websiteId, count = 1, networkType = null, notes = '' }) {
  const { date, day } = getDateInfo();
  const log = {
    id: uid(),
    timestamp: new Date().toISOString(),
    date,
    day,
    roleId,
    websiteId,
    count,
    networkType,
    notes: notes.trim(),
  };
  state.logs.push(log);
  state.settings.lastRoleId = roleId;
  state.settings.lastWebsiteId = websiteId;
  saveState(state);
  return log;
}

function deleteLog(id) {
  state.logs = state.logs.filter((l) => l.id !== id);
  saveState(state);
}

function addNetworkLog({ mediumId, count = 1, notes = '' }) {
  const { date, day } = getDateInfo();
  const log = {
    id: uid(),
    timestamp: new Date().toISOString(),
    date,
    day,
    mediumId,
    count,
    notes: notes.trim(),
  };
  state.networkLogs.push(log);
  state.settings.lastMediumId = mediumId;
  saveState(state);
  return log;
}

function deleteNetworkLog(id) {
  state.networkLogs = state.networkLogs.filter((l) => l.id !== id);
  saveState(state);
}

// --- Aggregations ---

function logsForDate(date) {
  return state.logs.filter((l) => l.date === date);
}

function logsForWeek(weekKey) {
  return state.logs.filter((l) => getWeekKey(l.date) === weekKey);
}

function networkLogsForDate(date) {
  return state.networkLogs.filter((l) => l.date === date);
}

function networkLogsForWeek(weekKey) {
  return state.networkLogs.filter((l) => getWeekKey(l.date) === weekKey);
}

function aggregateByRole(logs) {
  const map = {};
  for (const l of logs) {
    map[l.roleId] = (map[l.roleId] || 0) + (l.count || 1);
  }
  return map;
}

function aggregateByWebsite(logs) {
  const map = {};
  for (const l of logs) {
    map[l.websiteId] = (map[l.websiteId] || 0) + (l.count || 1);
  }
  return map;
}

function aggregateByMedium(logs) {
  const map = {};
  for (const l of logs) {
    map[l.mediumId] = (map[l.mediumId] || 0) + (l.count || 1);
  }
  return map;
}

function networkCounts(logs) {
  let normal = 0;
  let jobPost = 0;
  for (const l of logs) {
    if (l.networkType === 'normal') normal += l.count || 1;
    if (l.networkType === 'job_post') jobPost += l.count || 1;
  }
  return { normal, jobPost };
}

function dailyRollup() {
  const byDate = {};
  for (const l of state.logs) {
    if (!byDate[l.date]) {
      byDate[l.date] = { date: l.date, day: l.day, week: getWeekKey(l.date), logs: [] };
    }
    byDate[l.date].logs.push(l);
  }
  return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
}

function getMonthKey(dateStr) {
  return dateStr.slice(0, 7);
}

function monthlyRollup() {
  const byMonth = {};
  for (const l of state.logs) {
    const month = getMonthKey(l.date);
    if (!byMonth[month]) byMonth[month] = { month, total: 0 };
    byMonth[month].total += l.count || 1;
  }
  return Object.values(byMonth).sort((a, b) => a.month.localeCompare(b.month));
}

function formatMonthLabel(monthKey) {
  const [year, month] = monthKey.split('-');
  const d = new Date(Number(year), Number(month) - 1, 1);
  return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
}

// --- Render helpers ---

function fillSelect(select, items, selectedId) {
  select.innerHTML = '';
  for (const item of items) {
    const opt = document.createElement('option');
    opt.value = item.id;
    opt.textContent = item.label;
    if (item.id === selectedId) opt.selected = true;
    select.appendChild(opt);
  }
}

function renderBarChart(container, map, items) {
  const entries = items
    .map((item) => ({ label: item.label, value: map[item.id] || 0 }))
    .filter((e) => e.value > 0)
    .sort((a, b) => b.value - a.value);

  if (!entries.length) {
    container.innerHTML = '<p class="tracker-empty">No data yet</p>';
    return;
  }

  const max = Math.max(...entries.map((e) => e.value), 1);
  container.innerHTML = entries
    .map(
      (e) => `
    <div class="tracker-bar-row">
      <span class="tracker-bar-label" title="${e.label}">${e.label}</span>
      <div class="tracker-bar-track"><div class="tracker-bar-fill" style="width:${(e.value / max) * 100}%"></div></div>
      <span class="tracker-bar-value">${e.value}</span>
    </div>`
    )
    .join('');
}

function renderDateBar() {
  const { date, day } = getDateInfo();
  const weekKey = getWeekKey(date);
  const todayLogs = logsForDate(date);
  const weekLogs = logsForWeek(weekKey);
  $('tracker-today-date').textContent = date;
  $('tracker-today-day').textContent = day;
  const todayTotal = sumCounts(todayLogs);
  const weekTotal = sumCounts(weekLogs);
  $('tracker-stat-today').textContent = todayTotal;
  $('tracker-stat-week').textContent = weekTotal;
  $('tracker-stat-today-card').textContent = todayTotal;
  $('tracker-stat-week-card').textContent = weekTotal;

  const todayNetwork = sumCounts(networkLogsForDate(date));
  const weekNetwork = sumCounts(networkLogsForWeek(weekKey));
  $('tracker-stat-network-today').textContent = todayNetwork;
  $('tracker-stat-network-week').textContent = weekNetwork;
  $('tracker-stat-network-today-card').textContent = todayNetwork;

  const networkTotalEl = $('tracker-stat-network-total');
  if (networkTotalEl) networkTotalEl.textContent = sumCounts(state.networkLogs);
}

function renderQuickRoles() {
  const container = $('tracker-quick-roles');
  const selected = els.roleSelect.value;
  container.innerHTML = state.roles
    .map(
      (r) =>
        `<button type="button" class="tracker-role-chip${r.id === selected ? ' selected' : ''}" data-role-id="${r.id}">${r.label}</button>`
    )
    .join('');

  container.querySelectorAll('.tracker-role-chip').forEach((btn) => {
    btn.addEventListener('click', () => {
      els.roleSelect.value = btn.dataset.roleId;
      renderQuickRoles();
    });
  });
}

function renderLogForm() {
  const currentRole = els.roleSelect?.value || state.settings.lastRoleId || state.roles[0]?.id;
  const currentWeb = els.websiteSelect?.value || state.settings.lastWebsiteId || state.websites[0]?.id;
  const currentMedium = els.mediumSelect?.value || state.settings.lastMediumId || state.mediums[0]?.id;
  fillSelect(els.roleSelect, state.roles, currentRole);
  fillSelect(els.websiteSelect, state.websites, currentWeb);
  if (els.mediumSelect) fillSelect(els.mediumSelect, state.mediums, currentMedium);
  renderQuickRoles();
}

function addRoleLabel(label, selectInForm = false) {
  const trimmed = label.trim();
  if (!trimmed) return null;
  const existing = state.roles.find((r) => r.label.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    if (selectInForm) {
      els.roleSelect.value = existing.id;
      renderQuickRoles();
    }
    return existing.id;
  }
  const item = { id: uid(), label: trimmed };
  state.roles.push(item);
  state.settings.lastRoleId = item.id;
  saveState(state);
  fillSelect(els.roleSelect, state.roles, item.id);
  renderQuickRoles();
  renderManageList('tracker-roles-list', state.roles, 'role');
  return item.id;
}

function addWebsiteLabel(label, selectInForm = false) {
  const trimmed = label.trim();
  if (!trimmed) return null;
  const existing = state.websites.find((w) => w.label.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    if (selectInForm) {
      els.websiteSelect.value = existing.id;
    }
    return existing.id;
  }
  const item = { id: uid(), label: trimmed };
  state.websites.push(item);
  state.settings.lastWebsiteId = item.id;
  saveState(state);
  fillSelect(els.websiteSelect, state.websites, item.id);
  renderManageList('tracker-websites-list', state.websites, 'website');
  return item.id;
}

function addMediumLabel(label, selectInForm = false) {
  const trimmed = label.trim();
  if (!trimmed) return null;
  const existing = state.mediums.find((m) => m.label.toLowerCase() === trimmed.toLowerCase());
  if (existing) {
    if (selectInForm && els.mediumSelect) els.mediumSelect.value = existing.id;
    return existing.id;
  }
  const item = { id: uid(), label: trimmed };
  state.mediums.push(item);
  state.settings.lastMediumId = item.id;
  saveState(state);
  if (els.mediumSelect) fillSelect(els.mediumSelect, state.mediums, item.id);
  renderManageList('tracker-mediums-list', state.mediums, 'medium');
  return item.id;
}

function renderRecentActivity() {
  const tbody = $('tracker-recent-body');
  const recent = [...state.logs].sort((a, b) => b.timestamp.localeCompare(a.timestamp)).slice(0, 25);

  if (!recent.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="tracker-empty">No applications logged yet</td></tr>';
    return;
  }

  tbody.innerHTML = recent
    .map((l) => {
      const net =
        l.networkType === 'normal' ? 'Normal' : l.networkType === 'job_post' ? 'Job post' : '—';
      return `<tr>
        <td>${l.date}<br><small>${formatTime(l.timestamp)}</small></td>
        <td>${l.day}</td>
        <td>${labelById(state.roles, l.roleId)}</td>
        <td>${labelById(state.websites, l.websiteId)}</td>
        <td class="num">${l.count || 1}</td>
        <td>${net}${l.notes ? ` — ${escapeHtml(l.notes)}` : ''}
          <button type="button" class="tracker-icon-btn" data-delete="${l.id}" title="Delete">✕</button>
        </td>
      </tr>`;
    })
    .join('');

  tbody.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteLog(btn.dataset.delete);
      renderAll();
      showToast('Entry removed');
    });
  });
}

function renderRecentNetworking() {
  const tbody = $('tracker-recent-network-body');
  if (!tbody) return;

  const recent = [...state.networkLogs]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, 12);

  if (!recent.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="tracker-empty">No networking logged yet</td></tr>';
    return;
  }

  tbody.innerHTML = recent
    .map(
      (l) => `<tr>
        <td>${l.date}<br><small>${formatTime(l.timestamp)}</small></td>
        <td>${labelById(state.mediums, l.mediumId)}</td>
        <td class="num">${l.count || 1}</td>
        <td>${l.notes ? escapeHtml(l.notes) : '—'}
          <button type="button" class="tracker-icon-btn" data-delete-network="${l.id}" title="Delete">✕</button>
        </td>
      </tr>`
    )
    .join('');

  tbody.querySelectorAll('[data-delete-network]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteNetworkLog(btn.dataset.deleteNetwork);
      renderAll();
      showToast('Networking entry removed');
    });
  });
}

function escapeHtml(s) {
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

function renderDashboard() {
  const { date } = getDateInfo();
  const weekKey = getWeekKey(date);
  const todayLogs = logsForDate(date);
  const weekLogs = logsForWeek(weekKey);
  const weekNetworkLogs = networkLogsForWeek(weekKey);

  renderBarChart($('tracker-chart-roles-today'), aggregateByRole(todayLogs), state.roles);
  renderBarChart($('tracker-chart-websites-today'), aggregateByWebsite(todayLogs), state.websites);
  renderBarChart($('tracker-chart-roles-week'), aggregateByRole(weekLogs), state.roles);
  renderBarChart($('tracker-chart-websites-week'), aggregateByWebsite(weekLogs), state.websites);
  renderBarChart($('tracker-chart-mediums-week'), aggregateByMedium(weekNetworkLogs), state.mediums);
  renderMonthlyLineChart();
  renderDailyChart();
}

function renderMonthlyLineChart() {
  const container = $('tracker-monthly-chart');
  const totalEl = $('tracker-stat-total');
  const total = sumCounts(state.logs);

  if (totalEl) totalEl.textContent = total;
  if (!container) return;

  const months = monthlyRollup();
  if (!months.length) {
    container.innerHTML = '<p class="tracker-empty">No data yet</p>';
    return;
  }

  const width = Math.max(640, months.length * 72 + 80);
  const height = 240;
  const pad = { top: 28, right: 24, bottom: 52, left: 44 };
  const chartW = width - pad.left - pad.right;
  const chartH = height - pad.top - pad.bottom;
  const max = Math.max(...months.map((m) => m.total), 1);

  const points = months.map((m, i) => {
    const x = pad.left + (months.length === 1 ? chartW / 2 : (i / (months.length - 1)) * chartW);
    const y = pad.top + chartH - (m.total / max) * chartH;
    return { x, y, ...m };
  });

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${pad.top + chartH} L${points[0].x.toFixed(1)},${pad.top + chartH} Z`;
  const yTicks = Array.from(new Set([0, Math.round(max / 2), max])).sort((a, b) => a - b);

  container.innerHTML = `
    <div class="tracker-monthly-chart-scroll">
      <svg class="tracker-monthly-svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" role="img" aria-label="Monthly applications line chart">
        ${yTicks
          .map((tick) => {
            const y = pad.top + chartH - (tick / max) * chartH;
            return `<line x1="${pad.left}" y1="${y}" x2="${width - pad.right}" y2="${y}" class="tracker-line-grid"/>
              <text x="${pad.left - 8}" y="${y + 4}" class="tracker-line-axis" text-anchor="end">${tick}</text>`;
          })
          .join('')}
        <path d="${areaPath}" class="tracker-line-area"/>
        <path d="${linePath}" class="tracker-line-path"/>
        ${points
          .map(
            (p) => `
          <circle cx="${p.x}" cy="${p.y}" r="4.5" class="tracker-line-dot">
            <title>${formatMonthLabel(p.month)}: ${p.total} applications</title>
          </circle>
          <text x="${p.x}" y="${height - 18}" class="tracker-line-axis" text-anchor="middle">${formatMonthLabel(p.month)}</text>
          <text x="${p.x}" y="${p.y - 10}" class="tracker-line-value" text-anchor="middle">${p.total}</text>`
          )
          .join('')}
      </svg>
    </div>`;

  const scroll = container.querySelector('.tracker-monthly-chart-scroll');
  if (scroll) scroll.scrollLeft = scroll.scrollWidth;
}

function renderDailyChart() {
  const container = $('tracker-daily-chart');
  if (!container) return;

  const days = [...dailyRollup()].reverse();

  if (!days.length) {
    container.innerHTML = '<p class="tracker-empty">No data yet</p>';
    return;
  }

  const max = Math.max(...days.map((d) => sumCounts(d.logs)), 1);

  container.innerHTML = days
    .map((d) => {
      const total = sumCounts(d.logs);
      const height = Math.round((total / max) * 100);
      const shortDate = d.date.slice(5);
      const dayAbbr = d.day ? d.day.slice(0, 3) : '';
      return `
      <div class="tracker-daily-col" title="${d.date} (${d.day}): ${total} applications">
        <span class="tracker-daily-col-value">${total}</span>
        <div class="tracker-daily-col-barwrap">
          <div class="tracker-daily-col-bar" style="height:${height}%"></div>
        </div>
        <span class="tracker-daily-col-label">${shortDate}</span>
        <span class="tracker-daily-col-day">${dayAbbr}</span>
      </div>`;
    })
    .join('');

  container.scrollLeft = container.scrollWidth;
}

function renderDailyTable() {
  const tbody = $('tracker-daily-body');
  const days = dailyRollup().slice(0, 60);

  if (!days.length) {
    tbody.innerHTML = '<tr><td colspan="6" class="tracker-empty">No daily data yet</td></tr>';
    return;
  }

  tbody.innerHTML = days
    .map((d) => {
      const total = sumCounts(d.logs);
      const byRole = aggregateByRole(d.logs);
      const topRoles = state.roles
        .filter((r) => byRole[r.id])
        .map((r) => `${r.label}: ${byRole[r.id]}`)
        .join(', ');
      const byWeb = aggregateByWebsite(d.logs);
      const topWebs = state.websites
        .filter((w) => byWeb[w.id])
        .map((w) => `${w.label}: ${byWeb[w.id]}`)
        .join(', ');
      const nets = networkCounts(d.logs);
      const notes = d.logs
        .filter((l) => l.notes)
        .map((l) => l.notes)
        .join('; ');
      return `<tr>
        <td>${d.date}</td>
        <td>${d.day}</td>
        <td class="num">${total}</td>
        <td>${escapeHtml(topRoles || '—')}</td>
        <td>${escapeHtml(topWebs || '—')}</td>
        <td>${nets.normal} / ${nets.jobPost}${notes ? ` — ${escapeHtml(notes)}` : ''}</td>
      </tr>`;
    })
    .join('');
}

function renderWeeklyTable() {
  const tbody = $('tracker-weekly-body');
  const weekMap = {};

  for (const l of state.logs) {
    const wk = getWeekKey(l.date);
    if (!weekMap[wk]) weekMap[wk] = { week: wk, total: 0 };
    weekMap[wk].total += l.count || 1;
  }

  const weeks = Object.values(weekMap).sort((a, b) => b.week.localeCompare(a.week));

  if (!weeks.length) {
    tbody.innerHTML = '<tr><td colspan="2" class="tracker-empty">No weekly data yet</td></tr>';
    return;
  }

  tbody.innerHTML = weeks
    .map((w) => `<tr><td>Week of ${w.week}</td><td class="num">${w.total}</td></tr>`)
    .join('');
}

function renderManageList(containerId, items, type) {
  const ul = $(containerId);
  ul.innerHTML = items
    .map(
      (item) => `
    <li class="tracker-list-item" data-id="${item.id}">
      <input type="text" value="${escapeHtml(item.label)}" data-field="label" />
      <div class="tracker-list-actions">
        <button type="button" class="tracker-icon-btn" data-action="delete" title="Remove">✕</button>
      </div>
    </li>`
    )
    .join('');

  ul.querySelectorAll('.tracker-list-item').forEach((li) => {
    const id = li.dataset.id;
    li.querySelector('[data-field="label"]').addEventListener('change', (e) => {
      const arr =
        type === 'role' ? state.roles : type === 'website' ? state.websites : state.mediums;
      const item = arr.find((i) => i.id === id);
      if (item) {
        item.label = e.target.value.trim() || item.label;
        saveState(state);
        renderLogForm();
        renderAll();
      }
    });
    li.querySelector('[data-action="delete"]').addEventListener('click', () => {
      if (type === 'role') {
        state.roles = state.roles.filter((i) => i.id !== id);
      } else if (type === 'website') {
        state.websites = state.websites.filter((i) => i.id !== id);
      } else {
        state.mediums = state.mediums.filter((i) => i.id !== id);
      }
      saveState(state);
      renderLogForm();
      renderAll();
      showToast('Removed');
    });
  });
}

function renderAll() {
  renderDateBar();
  renderLogForm();
  renderRecentActivity();
  renderRecentNetworking();
  renderDashboard();
  renderDailyTable();
  renderWeeklyTable();
  renderManageList('tracker-roles-list', state.roles, 'role');
  renderManageList('tracker-websites-list', state.websites, 'website');
  renderManageList('tracker-mediums-list', state.mediums, 'medium');
}

// --- Export / Import ---

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  downloadBlob(blob, `job-tracker-backup-${getDateInfo().date}.json`);
  showToast('JSON exported');
}

function exportCSV() {
  const header = ['Date', 'Time', 'Day', 'Role', 'Website', 'Count', 'Network Type', 'Notes', 'Week', 'Timestamp'];
  const rows = state.logs.map((l) => [
    l.date,
    formatTime(l.timestamp),
    l.day,
    labelById(state.roles, l.roleId),
    labelById(state.websites, l.websiteId),
    l.count || 1,
    l.networkType || '',
    (l.notes || '').replace(/"/g, '""'),
    getWeekKey(l.date),
    l.timestamp,
  ]);

  const csv =
    header.join(',') +
    '\n' +
    rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, `job-tracker-${getDateInfo().date}.csv`);
  showToast('Applications CSV exported');
}

function exportNetworkCSV() {
  const header = ['Date', 'Time', 'Day', 'Medium', 'Count', 'Notes', 'Week', 'Timestamp'];
  const rows = state.networkLogs.map((l) => [
    l.date,
    formatTime(l.timestamp),
    l.day,
    labelById(state.mediums, l.mediumId),
    l.count || 1,
    (l.notes || '').replace(/"/g, '""'),
    getWeekKey(l.date),
    l.timestamp,
  ]);

  const csv =
    header.join(',') +
    '\n' +
    rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, `networking-tracker-${getDateInfo().date}.csv`);
  showToast('Networking CSV exported');
}

function downloadBlob(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const parsed = JSON.parse(reader.result);
      if (!parsed.roles || !parsed.websites) throw new Error('Invalid backup');
      state = {
        ...defaultState(),
        ...parsed,
        logs: (Array.isArray(parsed.logs) ? parsed.logs : []).map(migrateLogDate),
        networkLogs: (Array.isArray(parsed.networkLogs) ? parsed.networkLogs : []).map(migrateLogDate),
      };
      saveState(state);
      renderAll();
      showToast('Backup imported');
    } catch {
      showToast('Import failed — invalid file');
    }
  };
  reader.readAsText(file);
}

// --- Event wiring ---

function getNetworkType() {
  const active = document.querySelector('.tracker-network-btn.active');
  return active ? active.dataset.network : null;
}

function setNetworkType(type) {
  document.querySelectorAll('.tracker-network-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.network === type);
  });
}

function handleLog(count) {
  const parsed = Number(count);
  const safeCount = Number.isFinite(parsed) && parsed >= 1 ? Math.min(Math.floor(parsed), 999) : 1;
  const roleId = els.roleSelect.value;
  const websiteId = els.websiteSelect.value;
  if (!roleId || !websiteId) {
    showToast('Select a role and website');
    return;
  }
  const notes = els.notesInput.value;
  const networkType = getNetworkType();
  addLog({ roleId, websiteId, count: safeCount, networkType, notes });
  els.notesInput.value = '';
  renderAll();
  const role = labelById(state.roles, roleId);
  const web = labelById(state.websites, websiteId);
  showToast(`+${safeCount} ${role} @ ${web}`);
}

function getLogCount() {
  const input = $('tracker-count');
  return input ? input.value : 1;
}

function getNetworkLogCount() {
  const input = $('tracker-network-count');
  return input ? input.value : 1;
}

function handleNetworkLog(count) {
  const parsed = Number(count);
  const safeCount = Number.isFinite(parsed) && parsed >= 1 ? Math.min(Math.floor(parsed), 99) : 1;
  const mediumId = els.mediumSelect.value;
  if (!mediumId) {
    showToast('Select a medium');
    return;
  }
  const notes = els.networkNotesInput.value;
  addNetworkLog({ mediumId, count: safeCount, notes });
  els.networkNotesInput.value = '';
  renderAll();
  const medium = labelById(state.mediums, mediumId);
  showToast(`+${safeCount} network via ${medium}`);
}

function initTabs() {
  document.querySelectorAll('.tracker-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tracker-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tracker-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      $(`panel-${tab.dataset.panel}`).classList.add('active');
      if (tab.dataset.panel === 'dashboard') {
        renderMonthlyLineChart();
        renderDailyChart();
      }
    });
  });
}

function init() {
  els.roleSelect = $('tracker-role');
  els.websiteSelect = $('tracker-website');
  els.mediumSelect = $('tracker-medium');
  els.notesInput = $('tracker-notes');
  els.networkNotesInput = $('tracker-network-notes');

  initTabs();

  els.roleSelect.addEventListener('change', () => renderQuickRoles());

  $('tracker-btn-log').addEventListener('click', () => handleLog(getLogCount()));
  $('tracker-btn-log-network').addEventListener('click', () => handleNetworkLog(getNetworkLogCount()));

  const dailyChart = $('tracker-daily-chart');
  const monthlyChart = $('tracker-monthly-chart');
  $('tracker-daily-scroll-left').addEventListener('click', () =>
    dailyChart.scrollBy({ left: -260, behavior: 'smooth' })
  );
  $('tracker-daily-scroll-right').addEventListener('click', () =>
    dailyChart.scrollBy({ left: 260, behavior: 'smooth' })
  );
  $('tracker-monthly-scroll-left').addEventListener('click', () => {
    const scroll = monthlyChart.querySelector('.tracker-monthly-chart-scroll');
    if (scroll) scroll.scrollBy({ left: -280, behavior: 'smooth' });
  });
  $('tracker-monthly-scroll-right').addEventListener('click', () => {
    const scroll = monthlyChart.querySelector('.tracker-monthly-chart-scroll');
    if (scroll) scroll.scrollBy({ left: 280, behavior: 'smooth' });
  });

  document.querySelectorAll('.tracker-network-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      setNetworkType(isActive ? null : btn.dataset.network);
    });
  });

  $('tracker-add-role').addEventListener('click', () => {
    const label = $('tracker-new-role').value;
    if (addRoleLabel(label)) {
      $('tracker-new-role').value = '';
      showToast('Role added');
    }
  });

  $('tracker-add-website').addEventListener('click', () => {
    const label = $('tracker-new-website').value;
    if (addWebsiteLabel(label)) {
      $('tracker-new-website').value = '';
      showToast('Website added');
    }
  });

  $('tracker-inline-add-role').addEventListener('click', () => {
    const input = $('tracker-inline-new-role');
    if (addRoleLabel(input.value, true)) {
      input.value = '';
      showToast('Role added');
    }
  });

  $('tracker-inline-add-website').addEventListener('click', () => {
    const input = $('tracker-inline-new-website');
    if (addWebsiteLabel(input.value, true)) {
      input.value = '';
      showToast('Website added');
    }
  });

  $('tracker-inline-add-medium').addEventListener('click', () => {
    const input = $('tracker-inline-new-medium');
    if (addMediumLabel(input.value, true)) {
      input.value = '';
      showToast('Medium added');
    }
  });

  $('tracker-add-medium').addEventListener('click', () => {
    const label = $('tracker-new-medium').value;
    if (addMediumLabel(label)) {
      $('tracker-new-medium').value = '';
      showToast('Medium added');
    }
  });

  ['tracker-inline-new-role', 'tracker-inline-new-website', 'tracker-inline-new-medium'].forEach((id) => {
    $(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const btnId =
          id === 'tracker-inline-new-role'
            ? 'tracker-inline-add-role'
            : id === 'tracker-inline-new-website'
              ? 'tracker-inline-add-website'
              : 'tracker-inline-add-medium';
        $(btnId).click();
      }
    });
  });

  $('tracker-export-json').addEventListener('click', exportJSON);
  $('tracker-export-csv').addEventListener('click', exportCSV);
  $('tracker-export-network-csv').addEventListener('click', exportNetworkCSV);

  const importInput = $('tracker-import-json');
  $('tracker-import-btn').addEventListener('click', () => importInput.click());
  importInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) importJSON(file);
    e.target.value = '';
  });

  $('tracker-reset').addEventListener('click', () => {
    if (confirm('Reset all tracker data? This cannot be undone. Export a backup first.')) {
      state = defaultState();
      saveState(state);
      renderAll();
      showToast('Data reset');
    }
  });

  renderAll();
}

document.addEventListener('DOMContentLoaded', init);
