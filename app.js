/* ═══════════════════════════════════════
   ARTHSETU PROTOTYPE – app.js
═══════════════════════════════════════ */

/* ────────────────────────────────────
   PAGE NAVIGATION
──────────────────────────────────── */
let currentPage = 'page-login';

function goTo(pageId) {
  const prev = document.getElementById(currentPage);
  const next = document.getElementById(pageId);
  if (!next || currentPage === pageId) return;

  prev.classList.add('slide-out');
  setTimeout(() => {
    prev.classList.remove('active', 'slide-out');
    next.classList.add('active');
    currentPage = pageId;
    updateSideNav(pageId);
  }, 200);
}

function updateSideNav(pageId) {
  document.querySelectorAll('.sn-item').forEach(btn => btn.classList.remove('active'));
  const id = 'sn-' + pageId.replace('page-', '');
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

/* ────────────────────────────────────
   DRAWER
──────────────────────────────────── */
let drawerOpen = false;

function toggleDrawer() {
  drawerOpen = !drawerOpen;
  document.getElementById('navDrawer').classList.toggle('open', drawerOpen);
  document.getElementById('drawerOverlay').classList.toggle('open', drawerOpen);
}

/* ────────────────────────────────────
   CATEGORY TABS (Expenses)
──────────────────────────────────── */
function setTab(el) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/* ────────────────────────────────────
   CYCLE TABS (Expense Limit)
──────────────────────────────────── */
function setCycle(el) {
  document.querySelectorAll('.cycle-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
}

/* ────────────────────────────────────
   EXPENSE LIMIT SLIDER
──────────────────────────────────── */
function updateLimit(val) {
  const formatted = parseInt(val).toLocaleString('en-IN');
  document.getElementById('limitAmount').textContent = formatted;
}

/* ────────────────────────────────────
   SIMULATION
──────────────────────────────────── */
function updateSim() {
  const iv = parseInt(document.getElementById('incomeVariance').value);
  const mv = parseInt(document.getElementById('marketVol').value);
  const emi = parseInt(document.getElementById('emiEscalation').value);

  document.getElementById('incVarLabel').textContent = iv + '%';
  document.getElementById('mktVolLabel').textContent = mv + '%';
  document.getElementById('emiLabel').textContent = '+' + emi + '%';

  // Compute survival runway: base 12, reduce by severity
  const severity = Math.abs(iv) / 50 + Math.abs(mv) / 60 + emi / 100;
  const runway = Math.max(1.5, 12 - severity * 14).toFixed(1);
  document.getElementById('survivalVal').textContent = runway;

  const pct = Math.min(95, (parseFloat(runway) / 12) * 100);
  document.getElementById('survivalBar').style.width = pct + '%';

  // Color the label badge
  const label = document.getElementById('incVarLabel');
  label.className = iv < 0 ? 'badge-red' : 'badge-green';
  const mLabel = document.getElementById('mktVolLabel');
  mLabel.className = mv < 0 ? 'badge-red' : 'badge-green';
}

function resetSim() {
  document.getElementById('incomeVariance').value = -20;
  document.getElementById('marketVol').value = -30;
  document.getElementById('emiEscalation').value = 15;
  updateSim();
}

function toggleScenarioTag(el) {
  el.classList.toggle('active');
  updateSim();
}

/* ────────────────────────────────────
   GOALS – RE-CALCULATE
──────────────────────────────────── */
function recalculate() {
  const btn = document.querySelector('#page-goals .btn-primary');
  btn.textContent = '⚡ Calculating...';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = '⚡ RE-CALCULATE AI PATH';
    btn.style.opacity = '1';
    showMicroToast('AI path recalculated!');
  }, 1500);
}

/* ────────────────────────────────────
   THEME TOGGLE
──────────────────────────────────── */
let isDark = false;
function toggleTheme() {
  isDark = !isDark;
  document.getElementById('lightBtn').classList.toggle('active', !isDark);
  document.getElementById('darkBtn').classList.toggle('active', isDark);

  const root = document.documentElement;
  if (isDark) {
    root.style.setProperty('--surface', '#0f172a');
    root.style.setProperty('--card-bg', '#1e293b');
    root.style.setProperty('--text', '#f1f5f9');
    root.style.setProperty('--text-muted', '#94a3b8');
    root.style.setProperty('--border', '#334155');
  } else {
    root.style.setProperty('--surface', '#f8fafc');
    root.style.setProperty('--card-bg', '#ffffff');
    root.style.setProperty('--text', '#1e293b');
    root.style.setProperty('--text-muted', '#64748b');
    root.style.setProperty('--border', '#e2e8f0');
  }
}

/* ────────────────────────────────────
   NOTIFICATION TOAST
──────────────────────────────────── */
function showToast() {
  const toast = document.getElementById('notifToast');
  toast.classList.add('show');
}

function dismissToast() {
  document.getElementById('notifToast').classList.remove('show');
}

function showMicroToast(msg) {
  const t = document.createElement('div');
  t.style.cssText = `
    position:fixed;bottom:80px;left:50%;transform:translateX(-50%);
    background:#1e293b;color:#fff;padding:10px 20px;border-radius:20px;
    font-size:13px;font-weight:600;z-index:999;
    animation:fadeInUp .3s ease, fadeOut .3s ease 1.7s forwards;
    pointer-events:none;
  `;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2100);
}

/* ────────────────────────────────────
   MICRO-ANIMATION KEYFRAMES (injected)
──────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
@keyframes fadeInUp {
  from { opacity:0; transform:translateX(-50%) translateY(20px); }
  to   { opacity:1; transform:translateX(-50%) translateY(0); }
}
@keyframes fadeOut {
  from { opacity:1; }
  to   { opacity:0; }
}
`;
document.head.appendChild(style);

/* ────────────────────────────────────
   INIT
──────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  // Show notification toast after 2.5s
  setTimeout(showToast, 2500);
  setTimeout(dismissToast, 8000);

  // Init sim slider labels
  updateSim();

  // Init side nav
  updateSideNav('page-login');

  // Animate progress bars in on load
  setTimeout(() => {
    document.querySelectorAll('.progress-bar').forEach(bar => {
      const w = bar.style.width;
      bar.style.width = '0';
      setTimeout(() => { bar.style.width = w; }, 100);
    });
  }, 300);
});
/* ────────────────────────────────────
   ADD ASSET PAGE
──────────────────────────────────── */

function selectAssetType(el, icon, label) {
  document.querySelectorAll('.asset-type-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
  document.getElementById('selectedTypeIcon').textContent = icon;
  document.getElementById('selectedTypeLabel').textContent = label;
}

function calcCurrentVal() {
  const qty = parseFloat(document.getElementById('assetQtyInput').value) || 0;
  const price = parseFloat(document.getElementById('assetBuyPriceInput').value) || 0;
  const currVal = document.getElementById('assetCurrValInput');
  const totalCost = qty * price;
  if (totalCost > 0 && !currVal.value) {
    currVal.value = totalCost.toFixed(2);
  }
  updateGainLoss();
}

function updateGainLoss() {
  const qty = parseFloat(document.getElementById('assetQtyInput').value) || 0;
  const buy = parseFloat(document.getElementById('assetBuyPriceInput').value) || 0;
  const curr = parseFloat(document.getElementById('assetCurrValInput').value) || 0;
  const row = document.getElementById('gainLossRow');
  if (qty > 0 && buy > 0 && curr > 0) {
    const cost = qty * buy;
    const gain = curr - cost;
    const pct = ((gain / cost) * 100).toFixed(2);
    const isPos = gain >= 0;
    document.getElementById('gainVal').textContent = (isPos ? '+' : '') + '₹' + Math.abs(gain).toLocaleString('en-IN', { maximumFractionDigits: 2 });
    document.getElementById('gainVal').className = 'gain-val ' + (isPos ? 'positive' : 'negative');
    document.getElementById('gainPct').textContent = (isPos ? '+' : '') + pct + '%';
    document.getElementById('gainPct').className = 'gain-val ' + (isPos ? 'positive' : 'negative');
    row.style.display = 'flex';
  } else {
    row.style.display = 'none';
  }
}

// also recalc when current value changes
document.addEventListener('DOMContentLoaded', () => {
  const currValEl = document.getElementById('assetCurrValInput');
  if (currValEl) currValEl.addEventListener('input', updateGainLoss);
});

function fetchLivePrice() {
  const btn = document.querySelector('.fetch-btn');
  btn.textContent = '⏳ Fetching...';
  btn.disabled = true;
  // Simulate a 1.2s fetch
  setTimeout(() => {
    const mockPrice = (Math.random() * 4000 + 500).toFixed(2);
    document.getElementById('assetCurrValInput').value = mockPrice;
    btn.textContent = '✅ Fetched';
    btn.disabled = false;
    updateGainLoss();
    setTimeout(() => { btn.textContent = '⚡ Fetch Live'; }, 2000);
  }, 1200);
}

function toggleSIP() {
  const on = document.getElementById('sipToggle').checked;
  document.getElementById('sipFields').style.display = on ? 'block' : 'none';
}

function selectRisk(el) {
  document.querySelectorAll('.risk-chip').forEach(c => c.classList.remove('active'));
  el.classList.add('active');
}

function saveAsset() {
  const name = document.getElementById('assetNameInput').value.trim();
  if (!name) {
    showMicroToast('⚠ Please enter asset name');
    return;
  }
  const btn = document.querySelector('#page-add-asset .btn-primary');
  btn.textContent = '⏳ Saving...';
  btn.style.opacity = '0.7';
  setTimeout(() => {
    btn.textContent = '💾 Save Asset to Portfolio';
    btn.style.opacity = '1';
    showMicroToast('✅ ' + name + ' added to portfolio!');
    setTimeout(() => goTo('page-wealth'), 600);
  }, 1000);
}
