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

// --- Utilities ---

function uid() {
  return crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getDateInfo(d = new Date()) {
  const date = d.toISOString().split('T')[0];
  const day = d.toLocaleDateString('en-US', { weekday: 'long' });
  return { date, day };
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
    version: 1,
    roles: DEFAULT_ROLES.map((label) => ({ id: uid(), label })),
    websites: DEFAULT_WEBSITES.map((label) => ({ id: uid(), label })),
    logs: [],
    settings: { lastRoleId: null, lastWebsiteId: null },
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
      logs: Array.isArray(parsed.logs) ? parsed.logs : [],
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

// --- Aggregations ---

function logsForDate(date) {
  return state.logs.filter((l) => l.date === date);
}

function logsForWeek(weekKey) {
  return state.logs.filter((l) => getWeekKey(l.date) === weekKey);
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
  const nets = networkCounts(weekLogs);
  $('tracker-stat-network').textContent = nets.normal;
  $('tracker-stat-job-network').textContent = nets.jobPost;
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
  fillSelect(els.roleSelect, state.roles, currentRole);
  fillSelect(els.websiteSelect, state.websites, currentWeb);
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

  renderBarChart($('tracker-chart-roles-today'), aggregateByRole(todayLogs), state.roles);
  renderBarChart($('tracker-chart-websites-today'), aggregateByWebsite(todayLogs), state.websites);
  renderBarChart($('tracker-chart-roles-week'), aggregateByRole(weekLogs), state.roles);
  renderBarChart($('tracker-chart-websites-week'), aggregateByWebsite(weekLogs), state.websites);
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
      const arr = type === 'role' ? state.roles : state.websites;
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
      } else {
        state.websites = state.websites.filter((i) => i.id !== id);
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
  renderDashboard();
  renderDailyTable();
  renderWeeklyTable();
  renderManageList('tracker-roles-list', state.roles, 'role');
  renderManageList('tracker-websites-list', state.websites, 'website');
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
  showToast('CSV exported');
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
        logs: Array.isArray(parsed.logs) ? parsed.logs : [],
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

function initTabs() {
  document.querySelectorAll('.tracker-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tracker-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.tracker-panel').forEach((p) => p.classList.remove('active'));
      tab.classList.add('active');
      $(`panel-${tab.dataset.panel}`).classList.add('active');
    });
  });
}

function init() {
  els.roleSelect = $('tracker-role');
  els.websiteSelect = $('tracker-website');
  els.notesInput = $('tracker-notes');

  initTabs();

  els.roleSelect.addEventListener('change', () => renderQuickRoles());

  $('tracker-btn-log').addEventListener('click', () => handleLog(getLogCount()));

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

  ['tracker-inline-new-role', 'tracker-inline-new-website'].forEach((id) => {
    $(id).addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        $(id === 'tracker-inline-new-role' ? 'tracker-inline-add-role' : 'tracker-inline-add-website').click();
      }
    });
  });

  $('tracker-export-json').addEventListener('click', exportJSON);
  $('tracker-export-csv').addEventListener('click', exportCSV);

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
