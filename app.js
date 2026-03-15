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
    
    // Start OTP timer when navigating to OTP page
    if (pageId === 'page-otp') {
      otpTimer = 30;
      clearOtpInputs();
      document.getElementById('resendBtn').style.display = 'none';
      document.getElementById('timerText').style.display = 'inline';
      startOtpTimer();
      // Focus first OTP input
      setTimeout(() => {
        document.getElementById('otp1').focus();
      }, 100);
      
      // Display the phone number or email used for OTP
      const mobileInput = document.getElementById('mobileInput').value;
      const emailInput = document.getElementById('emailInput').value;
      const phoneDisplay = document.getElementById('otpPhoneDisplay');
      
      if (mobileInput) {
        phoneDisplay.textContent = '+91 ' + mobileInput;
      } else if (emailInput) {
        phoneDisplay.textContent = emailInput;
      }
    }
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
   OTP VERIFICATION
──────────────────────────────────── */
let otpTimer = 30;
let otpTimerInterval = null;

function moveToNext(current, nextId) {
  if (current.value.length === 1) {
    const nextField = document.getElementById(nextId);
    if (nextField) {
      nextField.focus();
    }
  }
}

function handleLastOtp(current) {
  if (current.value.length === 1) {
    // Auto-trigger verification when last digit is entered
    // Optional: You can remove this and let user click verify button
  }
}

function getOtpValue() {
  const otp1 = document.getElementById('otp1').value;
  const otp2 = document.getElementById('otp2').value;
  const otp3 = document.getElementById('otp3').value;
  const otp4 = document.getElementById('otp4').value;
  const otp5 = document.getElementById('otp5').value;
  const otp6 = document.getElementById('otp6').value;
  return otp1 + otp2 + otp3 + otp4 + otp5 + otp6;
}

function clearOtpInputs() {
  for (let i = 1; i <= 6; i++) {
    document.getElementById('otp' + i).value = '';
  }
}

function verifyOtp() {
  const otp = getOtpValue();
  
  if (otp.length !== 6) {
    showMicroToast('Please enter all 6 digits');
    return;
  }
  
  // Simulate OTP verification
  const btn = document.getElementById('verifyOtpBtn');
  btn.textContent = '⏳ Verifying...';
  btn.disabled = true;
  
  setTimeout(() => {
    // For demo: accept any 6-digit code, or you can add specific validation
    if (otp === '000000') {
      showMicroToast('Invalid OTP');
      btn.textContent = 'Verify & Continue';
      btn.disabled = false;
    } else {
      showMicroToast('✓ OTP Verified!');
      btn.textContent = 'Verify & Continue';
      btn.disabled = false;
      // Navigate to profile page
      setTimeout(() => {
        goTo('page-profile');
      }, 600);
    }
  }, 1500);
}

function resendOtp() {
  clearOtpInputs();
  otpTimer = 30;
  document.getElementById('resendBtn').style.display = 'none';
  document.getElementById('timerText').style.display = 'inline';
  startOtpTimer();
  showMicroToast('OTP resent to your mobile number');
}

function startOtpTimer() {
  const timerElement = document.getElementById('timerText');
  
  if (otpTimerInterval) {
    clearInterval(otpTimerInterval);
  }
  
  otpTimerInterval = setInterval(() => {
    otpTimer--;
    timerElement.textContent = 'Resend code in ' + otpTimer + 's';
    
    if (otpTimer <= 0) {
      clearInterval(otpTimerInterval);
      document.getElementById('timerText').style.display = 'none';
      document.getElementById('resendBtn').style.display = 'block';
    }
  }, 1000);
}

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

  // Init cashflow chart (monthly by default)
  updateCashflowChart();
});

/* ────────────────────────────────────
   CASHFLOW CHART – PERIOD SWITCHER
──────────────────────────────────── */

const cashflowData = {
  daily: {
    subtitle: 'Income vs. Expenses · Daily View (This Week)',
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    income:  [3200,  2800, 4100,  3500, 5200, 1800, 2200],
    expense: [1800,  2100, 1500,  2800, 3100, 2400,  900],
  },
  monthly: {
    subtitle: 'Income vs. Expenses · Monthly View (This Year)',
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    income:  [52000, 48000, 55000, 51000, 58000, 60000],
    expense: [34000, 31000, 33000, 38000, 29000, 25000],
  },
  quarterly: {
    subtitle: 'Income vs. Expenses · Quarterly View',
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    income:  [155000, 164000, 172000, 185000],
    expense: [ 98000, 100000, 104000, 111000],
  },
  yearly: {
    subtitle: 'Income vs. Expenses · Yearly View',
    labels: ['2021', '2022', '2023', '2024'],
    income:  [560000, 620000, 690000, 740000],
    expense: [380000, 410000, 440000, 470000],
  },
};

function formatBarVal(n) {
  if (n >= 100000) return (n / 100000).toFixed(1) + 'L';
  if (n >= 1000)   return (n / 1000).toFixed(0) + 'K';
  return String(n);
}

function formatRupee(n) {
  return '₹' + n.toLocaleString('en-IN');
}

function updateCashflowChart() {
  const period = document.getElementById('cashflowPeriod').value;
  const d = cashflowData[period];
  if (!d) return;

  // Update subtitle
  document.getElementById('cashflowSubtitle').textContent = d.subtitle;

  // Compute totals
  const totalIncome  = d.income.reduce((a, b) => a + b, 0);
  const totalExpense = d.expense.reduce((a, b) => a + b, 0);
  const netSavings   = totalIncome - totalExpense;
  const savingsPct   = ((netSavings / totalIncome) * 100).toFixed(1);

  document.getElementById('cfTotalIncome').textContent  = formatRupee(totalIncome);
  document.getElementById('cfTotalExpense').textContent = formatRupee(totalExpense);
  document.getElementById('cfNetSavings').textContent   = formatRupee(netSavings);
  document.getElementById('cfSavingsBadge').textContent = '💹 ' + savingsPct + '% Saved';

  // Normalise bar heights: max income → 80px
  const maxVal = Math.max(...d.income, ...d.expense);

  const container = document.getElementById('cashflowBars');
  container.innerHTML = '';

  d.labels.forEach((label, i) => {
    const incH  = Math.round((d.income[i]  / maxVal) * 80);
    const expH  = Math.round((d.expense[i] / maxVal) * 80);
    const incFmt = formatBarVal(d.income[i]);
    const expFmt = formatBarVal(d.expense[i]);

    const group = document.createElement('div');
    group.className = 'bar-group';
    group.innerHTML = `
      <div class="bar-val-group">
        <span class="bar-val income-val">${incFmt}</span>
        <span class="bar-val expense-val">${expFmt}</span>
      </div>
      <div class="bars-stack">
        <div class="bar income" style="--h:${incH}px; transition:height .5s ease"></div>
        <div class="bar expense" style="--h:${expH}px; transition:height .5s ease"></div>
      </div>
      <span class="bar-label">${label}</span>
    `;
    container.appendChild(group);
  });
}

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

/* ────────────────────────────────────
   CATEGORIES DETAIL PAGE
──────────────────────────────────── */

function toggleCatEdit(id) {
  const panel = document.getElementById('edit-' + id);
  const chevron = document.getElementById('chev-' + id);
  const isOpen = panel.style.display !== 'none';
  panel.style.display = isOpen ? 'none' : 'block';
  chevron.classList.toggle('open', !isOpen);
}

function toggleCatActive(checkbox, id) {
  const card = document.getElementById('catcard-' + id);
  card.classList.toggle('inactive', !checkbox.checked);
  showMicroToast(checkbox.checked ? '✅ Category enabled' : '⛔ Category disabled');
}

function selectEmoji(btn, id) {
  document.querySelectorAll('#emoji-' + id + ' .ep-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  // update the icon in the header
  const wrap = document.querySelector('#catcard-' + id + ' .cdc-icon-wrap');
  if (wrap) wrap.textContent = btn.textContent;
}

function saveCat(id) {
  const name   = document.getElementById('name-' + id).value.trim() || id;
  const budget = document.getElementById('budget-' + id).value;
  // Update the displayed name
  const nameEl = document.querySelector('#catcard-' + id + ' .cdc-name');
  if (nameEl) nameEl.textContent = name;
  // Show toast & collapse
  showMicroToast('💾 ' + name + ' updated!');
  toggleCatEdit(id);
}

/* Add New Category panel */
function openAddCategory() {
  const sec = document.getElementById('addCatSection');
  sec.style.display = 'block';
  sec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function closeAddCategory() {
  document.getElementById('addCatSection').style.display = 'none';
  document.getElementById('newCatName').value = '';
  document.getElementById('newCatBudget').value = '';
  // reset emoji selection
  document.querySelectorAll('#newCatEmoji .ep-btn').forEach((b, i) => {
    b.classList.toggle('active', i === 0);
  });
}

function selectNewEmoji(btn) {
  document.querySelectorAll('#newCatEmoji .ep-btn')
    .forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
}

function addNewCategory() {
  const name   = document.getElementById('newCatName').value.trim();
  const budget = document.getElementById('newCatBudget').value || '0';
  const active = document.getElementById('newCatActive').checked;
  const emojiBtn = document.querySelector('#newCatEmoji .ep-btn.active');
  const emoji  = emojiBtn ? emojiBtn.textContent : '🏷️';

  if (!name) {
    showMicroToast('⚠ Please enter a category name');
    return;
  }

  const slug = name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now();
  const colors = [
    { bg:'blue-bg', bar:'blue-bar', txt:'blue-text' },
    { bg:'green-bg', bar:'green-bar', txt:'green-text' },
    { bg:'orange-bg', bar:'orange-bar', txt:'orange-text' },
    { bg:'purple-bg', bar:'purple-bar', txt:'purple-text' },
    { bg:'red-bg', bar:'red-bar', txt:'red-text' },
  ];
  const c = colors[Math.floor(Math.random() * colors.length)];

  const html = `
<div class="cat-detail-card${active ? '' : ' inactive'}" id="catcard-${slug}" data-cat="${slug}">
  <div class="cdc-header" onclick="toggleCatEdit('${slug}')">
    <div class="cdc-icon-wrap ${c.bg}">${emoji}</div>
    <div class="cdc-info">
      <div class="cdc-name">${name}</div>
      <div class="cdc-meta">₹0 spent · 0% of month</div>
    </div>
    <div class="cdc-right">
      <span class="cdc-pct ${c.txt}">₹0</span>
      <span class="cdc-chevron" id="chev-${slug}">›</span>
    </div>
  </div>
  <div class="cdc-bar-wrap">
    <div class="cdc-bar ${c.bar}" style="width:0%"></div>
  </div>
  <div class="cdc-edit-panel" id="edit-${slug}" style="display:none">
    <div class="cdc-toggle-row">
      <span class="field-label" style="margin:0">Category Active</span>
      <label class="toggle-switch">
        <input type="checkbox" ${active ? 'checked' : ''} onchange="toggleCatActive(this,'${slug}')">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="field-group" style="margin-top:12px">
      <label class="field-label">Budget Limit (₹)</label>
      <input class="field-input" type="number" value="${budget}" id="budget-${slug}" />
    </div>
    <div class="field-group">
      <label class="field-label">Rename Category</label>
      <input class="field-input" type="text" value="${name}" id="name-${slug}" />
    </div>
    <button class="btn-primary" style="margin-top:4px" onclick="saveCat('${slug}')">💾 Save Changes</button>
  </div>
</div>`;

  document.getElementById('categoriesList').insertAdjacentHTML('beforeend', html);
  closeAddCategory();
  showMicroToast('✅ "' + name + '" category added!');
}

