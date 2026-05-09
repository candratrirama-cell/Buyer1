/* ============================================================
   MOLI — app.js (No-Emoji Edition)
   ============================================================ */

// SVG icon helpers
const ICONS = {
  play: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><polygon points="5 3 19 12 5 21 5 3"/></svg>`,
  back: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><path d="m15 18-6-6 6-6"/></svg>`,
  info: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="12" height="12"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>`,
  tv: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"/><polyline points="17 2 12 7 7 2"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
  list: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>`,
  star: `<svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>`,
  power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  warn: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="28" height="28"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  next: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="5 4 15 12 5 20 5 4"/><line x1="19" y1="5" x2="19" y2="19"/></svg>`,
  prev: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="19 20 9 12 19 4 19 20"/><line x1="5" y1="19" x2="5" y2="5"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="40" height="40"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  film: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
  bolt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
};

// ============================================================
// AUTOPLAY STATE
// ============================================================
let autoplayEnabled = JSON.parse(localStorage.getItem('moli_autoplay') || 'false');

function toggleAutoplay() {
  autoplayEnabled = !autoplayEnabled;
  localStorage.setItem('moli_autoplay', JSON.stringify(autoplayEnabled));
  const btn = document.getElementById('autoplayBtn');
  const status = document.getElementById('autoplayStatus');
  if (btn) btn.classList.toggle('on', autoplayEnabled);
  if (status) { status.textContent = autoplayEnabled ? 'ON' : 'OFF'; status.classList.toggle('on', autoplayEnabled); }
}

// ============================================================
// FIREBASE AUTH
// ============================================================
function updateNavAuth(user) {
  const area = document.getElementById('navAuthArea');
  if (!area) return;
  if (user) {
    const avatar = user.photoURL
      ? `<img src="${esc(user.photoURL)}" alt="avatar" />`
      : (user.displayName ? user.displayName[0].toUpperCase() : ICONS.user);
    area.innerHTML = `<div class="nav-avatar" onclick="showPage('setting')">${avatar}</div>`;
  } else {
    area.innerHTML = `<button class="nav-login-btn" onclick="showPage('login')">MASUK</button>`;
  }
}

function renderSettingPage(user) {
  const wrap = document.getElementById('settingWrap');
  if (!wrap) return;
  if (!user) {
    wrap.innerHTML = `
      <div class="profile-card" style="text-align:center;padding:30px;">
        <div style="margin-bottom:12px;display:flex;justify-content:center;opacity:.4">${ICONS.user}</div>
        <div style="font-family:var(--font-ui);font-size:14px;font-weight:600;letter-spacing:1px;margin-bottom:6px;">Belum Login</div>
        <div style="font-size:12px;color:var(--text-muted);margin-bottom:18px;">Masuk untuk menyimpan progress dan profil kamu</div>
        <button class="login-submit-btn" style="max-width:200px;margin:0 auto;" onclick="showPage('login')">MASUK / DAFTAR</button>
      </div>
      <div class="setting-card" onclick="clearHistory()">
        <div class="setting-icon">${ICONS.trash}</div>
        <div class="setting-info"><div class="setting-title">Hapus Riwayat</div><div class="setting-desc">Bersihkan semua riwayat nonton</div></div>
        <span class="setting-arrow">›</span>
      </div>
      <div class="setting-card">
        <div class="setting-icon">${ICONS.bolt}</div>
        <div class="setting-info"><div class="setting-title">Tentang Moli</div><div class="setting-desc">Dark Blue Neon Edition v3.0</div></div>
        <span class="setting-badge">v3.0</span>
      </div>
    `;
    return;
  }
  const savedName = localStorage.getItem('moli_displayname') || user.displayName || 'Moli User';
  const photoUrl = user.photoURL || '';
  const avatarHtml = photoUrl
    ? `<img src="${esc(photoUrl)}" alt="avatar" />`
    : (savedName ? savedName[0].toUpperCase() : ICONS.user);
  wrap.innerHTML = `
    <div class="profile-card">
      <div class="profile-avatar-wrap">
        <div class="profile-avatar" id="profileAvatarEl">${avatarHtml}</div>
        <div class="profile-edit-btn" onclick="openEditProfileModal()" title="Edit profil">${ICONS.edit}</div>
      </div>
      <div class="profile-name" id="profileNameEl">${esc(savedName)}</div>
      <div class="profile-email">${esc(user.email || '')}</div>
      <div class="profile-sub">MEMBER MOLI</div>
    </div>
    <div class="setting-card" onclick="clearHistory()">
      <div class="setting-icon">${ICONS.trash}</div>
      <div class="setting-info"><div class="setting-title">Hapus Riwayat</div><div class="setting-desc">Bersihkan semua riwayat nonton</div></div>
      <span class="setting-arrow">›</span>
    </div>
    <div class="setting-card">
      <div class="setting-icon">${ICONS.bolt}</div>
      <div class="setting-info"><div class="setting-title">Tentang Moli</div><div class="setting-desc">Dark Blue Neon Edition v3.0</div></div>
      <span class="setting-badge">v3.0</span>
    </div>
    <div class="setting-card">
      <div class="setting-icon">${ICONS.book}</div>
      <div class="setting-info"><div class="setting-title">Sumber Data</div><div class="setting-desc">Anime Sub Indo — setiap hari</div></div>
      <span class="setting-badge on">ON</span>
    </div>
    <button class="logout-btn" onclick="doLogout()">${ICONS.power} KELUAR</button>
  `;
}

function openEditProfileModal() {
  const user = window._currentUser;
  const savedName = localStorage.getItem('moli_displayname') || (user ? user.displayName : '') || '';
  const savedPhoto = user ? (user.photoURL || '') : '';
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay'; overlay.id = 'editProfileModal';
  overlay.innerHTML = `
    <div class="modal-card">
      <div class="modal-title">Edit Profil</div>
      <div class="modal-field"><label>Nama Tampilan</label><input type="text" id="editNameInput" value="${esc(savedName)}" placeholder="Nama kamu" /></div>
      <div class="modal-field"><label>URL Foto Profil (opsional)</label><input type="url" id="editPhotoInput" value="${esc(savedPhoto)}" placeholder="https://..." /></div>
      <div class="modal-actions">
        <button class="modal-cancel" onclick="closeEditModal()">BATAL</button>
        <button class="modal-save" onclick="saveProfile()">SIMPAN</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);
}

function closeEditModal() { const m = document.getElementById('editProfileModal'); if (m) m.remove(); }

async function saveProfile() {
  const nameVal = (document.getElementById('editNameInput') || {}).value || '';
  const photoVal = (document.getElementById('editPhotoInput') || {}).value || '';
  const user = window._currentUser;
  if (!nameVal.trim()) { showToast('Nama tidak boleh kosong!'); return; }
  try {
    if (user && window._fbUpdateProfile) {
      await window._fbUpdateProfile(user, { displayName: nameVal.trim(), photoURL: photoVal.trim() || null });
    }
    localStorage.setItem('moli_displayname', nameVal.trim());
    closeEditModal(); renderSettingPage(window._currentUser); updateNavAuth(window._currentUser);
    showToast('Profil diperbarui!');
  } catch(e) { showToast('Gagal update profil: ' + e.message); }
}

async function doEmailLogin() {
  const email = (document.getElementById('loginEmail') || {}).value || '';
  const pass = (document.getElementById('loginPassword') || {}).value || '';
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  if (!email || !pass) { if(errEl) errEl.textContent = 'Email dan password wajib diisi!'; return; }
  try { await window._fbSignInEmail(email, pass); showPage('home'); showToast('Berhasil masuk!'); }
  catch(e) { if(errEl) errEl.textContent = getAuthError(e.code); }
}

async function doRegister() {
  const name = (document.getElementById('regName') || {}).value || '';
  const email = (document.getElementById('regEmail') || {}).value || '';
  const pass = (document.getElementById('regPassword') || {}).value || '';
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  if (!name || !email || !pass) { if(errEl) errEl.textContent = 'Semua field wajib diisi!'; return; }
  try {
    const cred = await window._fbCreateUser(email, pass);
    await window._fbUpdateProfile(cred.user, { displayName: name });
    localStorage.setItem('moli_displayname', name);
    showPage('home'); showToast('Akun berhasil dibuat!');
  } catch(e) { if(errEl) errEl.textContent = getAuthError(e.code); }
}

async function doGoogleLogin() {
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  try { await window._fbGoogleSignIn(); showPage('home'); showToast('Berhasil masuk dengan Google!'); }
  catch(e) { if(errEl) errEl.textContent = getAuthError(e.code); }
}

async function doLogout() {
  try { await window._fbSignOut(); showToast('Berhasil keluar!'); showPage('home'); }
  catch(e) { showToast('Gagal keluar'); }
}

function getAuthError(code) {
  const map = {
    'auth/user-not-found': 'Akun tidak ditemukan.',
    'auth/wrong-password': 'Password salah.',
    'auth/email-already-in-use': 'Email sudah terdaftar.',
    'auth/invalid-email': 'Format email tidak valid.',
    'auth/weak-password': 'Password terlalu lemah (min. 6 karakter).',
    'auth/popup-closed-by-user': 'Login Google dibatalkan.',
    'auth/network-request-failed': 'Koneksi gagal, coba lagi.',
  };
  return map[code] || 'Terjadi kesalahan. Coba lagi.';
}

function switchAuthTab(tab) {
  const loginTab = document.getElementById('tabLogin');
  const regTab = document.getElementById('tabRegister');
  const formLogin = document.getElementById('formLogin');
  const formReg = document.getElementById('formRegister');
  const errEl = document.getElementById('loginError');
  if (errEl) errEl.textContent = '';
  if (tab === 'login') {
    loginTab.classList.add('active'); regTab.classList.remove('active');
    formLogin.style.display = ''; formReg.style.display = 'none';
  } else {
    regTab.classList.add('active'); loginTab.classList.remove('active');
    formReg.style.display = ''; formLogin.style.display = 'none';
  }
}

// ============================================================
// INIT EVENTS
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('navSearch').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doSearch();
  });
  updateNavAuth(window._currentUser || null);
  renderSettingPage(window._currentUser || null);
});

// ============================================================
// HELPERS
// ============================================================
function focusSearch() {
  const inp = document.getElementById('navSearch');
  if (inp) { inp.focus(); inp.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 3000);
}

// ============================================================
// HISTORY (localStorage)
// ============================================================
const HISTORY_KEY = 'kmoli_history';
const PROGRESS_KEY = 'kmoli_progress';

function getHistory() { try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); } catch { return []; } }
function saveHistory(list) { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); }
function getProgress() { try { return JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}'); } catch { return {}; } }
function saveProgress(data) { localStorage.setItem(PROGRESS_KEY, JSON.stringify(data)); }

function addHistory(entry) {
  let list = getHistory();
  list = list.filter(h => h.epUrl !== entry.epUrl);
  list.unshift(entry);
  if (list.length > 50) list = list.slice(0, 50);
  saveHistory(list);
}
function updateProgress(epUrl, seconds, duration) {
  const prog = getProgress();
  prog[epUrl] = { seconds, duration, pct: duration > 0 ? Math.min(100, Math.round(seconds / duration * 100)) : 0 };
  saveProgress(prog);
  let list = getHistory();
  const idx = list.findIndex(h => h.epUrl === epUrl);
  if (idx >= 0) { list[idx].progress = prog[epUrl]; saveHistory(list); }
}
function getProgressFor(epUrl) { const prog = getProgress(); return prog[epUrl] || null; }
function formatTimeAgo(ts) {
  if (!ts) return '';
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Baru saja';
  if (m < 60) return `${m} menit lalu`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} jam lalu`;
  return `${Math.floor(h / 24)} hari lalu`;
}

// ============================================================
// PAGE ROUTER
// ============================================================
let currentPage = 'home';
let latestPage = 1;
let moviePage = 1;
const pages = ['home','login','latest','movie','top10','jadwal','search','detail','watch','history','setting'];
const PAGE_PATHS = { 'home':'/','login':'/login','latest':'/latest','movie':'/movie','top10':'/top10','jadwal':'/jadwal','search':'/search','detail':'/detail','watch':'/watch','history':'/history' };

function showPage(name, push = true, rawUrl = null, pathOverride = null) {
  pages.forEach(p => { const el = document.getElementById('page-'+p); if(el) el.classList.remove('active'); });
  const target = document.getElementById('page-'+name);
  if (target) target.classList.add('active');
  currentPage = name;
  if (push) { const path = pathOverride || PAGE_PATHS[name] || '/'; history.pushState({page:name,rawUrl}, '', path); }
  document.querySelectorAll('.bnav-item').forEach(btn => {
    const p = btn.getAttribute('data-bnav');
    let active = false;
    if (p==='home' && ['home','latest','search','detail','watch','top10'].includes(name)) active = true;
    if (p==='movie' && name==='movie') active = true;
    if (p==='jadwal' && name==='jadwal') active = true;
    if (p==='setting' && name==='setting') active = true;
    btn.classList.toggle('active', active);
  });
  if (name !== 'watch') stopProgressTracking();
  if (name === 'history') renderHistoryPage();
  if (name === 'latest' && !document.getElementById('latestGrid').children.length) loadLatest(1);
  if (name === 'movie' && !document.getElementById('movieGrid').children.length) loadMovie(1);
  if (name === 'top10' && !document.getElementById('top10List').children.length) loadTop10();
  if (name === 'jadwal' && !document.getElementById('jadwalContent').children.length) loadJadwal();
  if (name === 'setting') renderSettingPage(window._currentUser || null);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.addEventListener('popstate', (e) => {
  const state = e.state;
  if (!state) { _routeFromPath(location.pathname, location.search); return; }
  _activatePage(state.page);
  _loadPageData(state.page, state.rawUrl);
});

function _activatePage(name) {
  pages.forEach(p => { const el = document.getElementById('page-'+p); if(el) el.classList.remove('active'); });
  const target = document.getElementById('page-'+name);
  if (target) target.classList.add('active');
  currentPage = name;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function _loadPageData(name, rawUrl) {
  if (name==='home') loadHome();
  else if (name==='latest') loadLatest(1, false);
  else if (name==='movie') loadMovie(1, false);
  else if (name==='top10') loadTop10(false);
  else if (name==='jadwal') loadJadwal(false);
  else if (name==='history') renderHistoryPage();
  else if (name==='detail' && rawUrl) loadDetail(rawUrl, false);
  else if (name==='watch' && rawUrl) loadWatch(rawUrl,'',currentAnimeUrl,currentAnimeTitle,currentAnimeImage,currentEpisodes,false);
  else { _activatePage('home'); loadHome(); }
}
function _routeFromPath(path, search) {
  const params = new URLSearchParams(search);
  if (path==='/'||path==='') { _activatePage('home'); loadHome(); }
  else if (path==='/latest') { _activatePage('latest'); loadLatest(1,false); }
  else if (path==='/movie') { _activatePage('movie'); loadMovie(1,false); }
  else if (path==='/top10') { _activatePage('top10'); loadTop10(false); }
  else if (path==='/jadwal') { _activatePage('jadwal'); loadJadwal(false); }
  else if (path==='/history') { _activatePage('history'); renderHistoryPage(); }
  else if (path==='/search') { _activatePage('search'); }
  else if (path==='/detail') { const u=params.get('url'); if(u){_activatePage('detail');loadDetail(u,false);}else{_activatePage('home');loadHome();} }
  else if (path==='/watch') { const u=params.get('url'); if(u){_activatePage('watch');loadWatch(u,'','','','','',false);}else{_activatePage('home');loadHome();} }
  else { _activatePage('home'); loadHome(); }
}

// ============================================================
// HOME SECTIONS
// ============================================================
const HOME_SECTIONS = [
  { title: 'EPISODE TERBARU', mode: 'latest' },
  { title: 'ISEKAI & FANTASY', queries: ['isekai','reincarnation','maou','tensei'] },
  { title: 'ACTION HITS', queries: ['kimetsu','jujutsu','bleach','hunter','shingeki'] },
  { title: 'ROMANCE & DRAMA', queries: ['love','kanojo','romance','heroine'] },
  { title: 'SCHOOL LIFE', queries: ['school','gakuen','classroom','koukou'] },
  { title: 'MAGIC & ADVENTURE', queries: ['magic','adventure','dragon','dungeon'] },
];

function removeDuplicates(arr, key) { return [...new Map(arr.map(item=>[item[key],item])).values()]; }

async function loadHome() {
  renderHomeHistory();
  const sectionsContainer = document.getElementById('homeSections');
  if (!sectionsContainer) return;
  sectionsContainer.innerHTML = '';
  HOME_SECTIONS.forEach(async (section) => {
    const sectionEl = document.createElement('div');
    sectionEl.className = 'home-section';
    sectionEl.innerHTML =
      '<div class="section-header">' +
        '<h2 class="section-title"><span class="section-title-dot"></span>' + section.title + '</h2>' +
        '<a href="#" class="see-all" onclick="showPage(\'latest\')">SEMUA ›</a>' +
      '</div>' +
      '<div class="hscroll-wrap"><div class="hscroll-inner hscroll-loading"><div class="loading-dots"><span></span><span></span><span></span></div></div></div>';
    sectionsContainer.appendChild(sectionEl);
    const scrollInner = sectionEl.querySelector('.hscroll-inner');
    try {
      let items = [];
      if (section.mode === 'latest') {
        const res = await fetch('/api/latest'); items = await res.json();
      } else {
        const results = await Promise.all(section.queries.map(q=>fetch('/api/search?q='+encodeURIComponent(q)).then(r=>r.json()).catch(()=>[])));
        results.forEach(list => { if(Array.isArray(list)) items=[...items,...list]; });
        items = removeDuplicates(items,'url');
      }
      if (!items.length) { scrollInner.innerHTML = '<div style="font-family:var(--font-ui);font-size:10px;color:var(--text-muted);padding:20px;letter-spacing:1px;">TIDAK ADA DATA</div>'; return; }
      scrollInner.classList.remove('hscroll-loading');
      scrollInner.innerHTML = items.slice(0,15).map(function(item) {
        const ep = item.episode ? ('EP '+item.episode) : (item.score ? item.score : '');
        const title = item.title.length > 24 ? item.title.substring(0,22)+'..' : item.title;
        return '<div class="hscroll-card" onclick="loadDetail(\''+esc(item.url)+'\')"><div class="hscroll-img-wrap"><img src="'+esc(item.image)+'" alt="'+esc(item.title)+'" loading="lazy" onerror="this.src=\'https://via.placeholder.com/120x170/0d1520/00b4ff?text=?\'"/>'+(ep?'<div class="hscroll-badge">'+ep+'</div>':'')+'</div><div class="hscroll-title">'+esc(title)+'</div></div>';
      }).join('');
    } catch(e) {
      scrollInner.innerHTML = '<div style="font-family:var(--font-ui);font-size:10px;color:var(--text-muted);padding:20px;letter-spacing:1px;">GAGAL MEMUAT</div>';
    }
  });
}

function renderHomeHistory() {
  const list = getHistory().slice(0,8);
  const sec = document.getElementById('homeHistorySection');
  if (!sec) return;
  if (!list.length) { sec.innerHTML = ''; return; }
  const prog = getProgress();
  sec.innerHTML = `<div class="continue-section"><div class="section-header"><h2 class="section-title"><span class="section-title-dot"></span>LANJUTKAN NONTON</h2><a href="#" class="see-all" onclick="showPage('history')">SEMUA ›</a></div><div class="continue-scroll"><div class="continue-inner">${list.map(h=>continueCardHtml(h,prog[h.epUrl])).join('')}</div></div></div>`;
}

function continueCardHtml(h, p) {
  const pct = p ? p.pct : 0;
  return `<div class="continue-card" onclick="loadWatch('${esc(h.epUrl)}','${esc(h.epTitle)}','${esc(h.animeUrl)}')"><div class="continue-thumb"><img src="${esc(h.image)}" alt="${esc(h.animeTitle)}" onerror="this.src='https://via.placeholder.com/140x85/0d1520/00b4ff?text=?'"/><div class="continue-ep-badge">${esc(h.epTitle.substring(0,12))}</div></div><div class="continue-progress"><div class="continue-progress-fill" style="width:${pct}%"></div></div><div class="continue-title">${esc(h.animeTitle)}</div></div>`;
}

function historyItemHtml(h, p) {
  const pct = p ? p.pct : 0;
  return `<div class="history-item" onclick="loadWatch('${esc(h.epUrl)}','${esc(h.epTitle)}','${esc(h.animeUrl)}')"><img class="history-thumb" src="${esc(h.image)}" alt="${esc(h.animeTitle)}" onerror="this.src='https://via.placeholder.com/44x62/0d1520/00b4ff?text=?'"/><div class="history-info"><div class="history-title">${esc(h.animeTitle)}</div><div class="history-ep">${esc(h.epTitle)}</div><div class="history-time">${formatTimeAgo(h.timestamp)}</div><div class="history-progress-bar"><div class="history-progress-fill" style="width:${pct}%"></div></div></div></div>`;
}

// ============================================================
// LATEST
// ============================================================
async function loadLatest(page=1, push=true) {
  latestPage = page;
  showPage('latest', push, null, page>1?`/latest?page=${page}`:'/latest');
  document.getElementById('latestGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/latest?page=${page}`);
    const data = await res.json();
    renderGrid('latestGrid', data);
    renderPagination('latestPagination', page, data.length>=10, (p)=>loadLatest(p));
  } catch(e) { document.getElementById('latestGrid').innerHTML = errorState('Gagal memuat episode terbaru.'); }
}

// ============================================================
// MOVIE
// ============================================================
async function loadMovie(page=1, push=true) {
  moviePage = page;
  showPage('movie', push, null, page>1?`/movie?page=${page}`:'/movie');
  document.getElementById('movieGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/movie?page=${page}`);
    const json = await res.json();
    const data = json.data || [];
    renderGrid('movieGrid', data);
    renderPagination('moviePagination', page, json.hasNext, (p)=>loadMovie(p));
  } catch(e) { document.getElementById('movieGrid').innerHTML = errorState('Gagal memuat anime movie.'); }
}

// ============================================================
// TOP 10
// ============================================================
async function loadTop10(push=true) {
  if (push) showPage('top10', push, null, '/top10');
  const container = document.getElementById('top10List');
  container.innerHTML = loadingState();
  try {
    const res = await fetch('/api/top10');
    const data = await res.json();
    if (!data.length) { container.innerHTML = emptyState('TIDAK ADA DATA', 'Tidak ada data top 10.'); return; }
    container.innerHTML = `<div class="top10-list">${data.map((item, i) => `
      <div class="top10-item" onclick="loadDetail('${esc(item.url)}')">
        <div class="top10-rank ${i < 3 ? 'top10-rank-gold' : ''}">${i+1}</div>
        <div class="top10-thumb"><img src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/60x85/0d1520/00b4ff?text=?'"/></div>
        <div class="top10-info">
          <div class="top10-title">${esc(item.title)}</div>
          ${item.score ? `<div class="top10-score">${ICONS.star} ${esc(item.score)}</div>` : ''}
        </div>
        <div class="top10-arrow">${ICONS.play}</div>
      </div>`).join('')}</div>`;
  } catch(e) { container.innerHTML = errorState('Gagal memuat top 10.'); }
}

// ============================================================
// JADWAL
// ============================================================
let _jadwalData = null;
let _jadwalActiveDay = null;

async function loadJadwal(push=true) {
  if (push) showPage('jadwal', push, null, '/jadwal');
  const container = document.getElementById('jadwalContent');
  container.innerHTML = loadingState();
  try {
    const res = await fetch('/api/jadwal');
    const data = await res.json();
    const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'];
    const keys = Object.keys(data);
    if (!keys.length) {
      container.innerHTML = emptyState('Jadwal Kosong', 'Data jadwal belum tersedia.');
      return;
    }
    _jadwalData = data;
    const orderedKeys = [...DAYS.filter(d => keys.includes(d)), ...keys.filter(d => !DAYS.includes(d))];

    // Auto-select today's day
    const todayIdx = new Date().getDay(); // 0=Sun
    const dayMap = [6,0,1,2,3,4,5]; // JS day to DAYS index
    const todayDay = DAYS[dayMap[todayIdx]];
    _jadwalActiveDay = orderedKeys.includes(todayDay) ? todayDay : orderedKeys[0];

    const tabsHtml = orderedKeys.map(day => `
      <button class="jadwal-tab ${day === _jadwalActiveDay ? 'active' : ''}" onclick="switchJadwalTab('${esc(day)}')">${esc(day)}</button>
    `).join('');

    container.innerHTML = `
      <div class="jadwal-tabs-wrap">
        <div class="jadwal-tabs">${tabsHtml}</div>
      </div>
      <div class="jadwal-grid-wrap" id="jadwalGrid"></div>`;

    renderJadwalGrid(_jadwalActiveDay);
  } catch(e) { container.innerHTML = errorState('Gagal memuat jadwal rilis.'); }
}

function switchJadwalTab(day) {
  _jadwalActiveDay = day;
  document.querySelectorAll('.jadwal-tab').forEach(b => b.classList.toggle('active', b.textContent.trim() === day));
  renderJadwalGrid(day);
}

function renderJadwalGrid(day) {
  const grid = document.getElementById('jadwalGrid');
  if (!grid || !_jadwalData) return;
  const animes = _jadwalData[day] || [];
  if (!animes.length) {
    grid.innerHTML = `<div style="padding:40px 16px;text-align:center;color:var(--text-muted);font-family:var(--font-ui);font-size:12px;letter-spacing:1px;">Tidak ada jadwal hari ini</div>`;
    return;
  }
  grid.innerHTML = `<div class="jadwal-anime-grid">${animes.map(anime => `
    <div class="jadwal-card" onclick="${anime.url ? `loadDetail('${esc(anime.url)}')` : ''}">
      <div class="jadwal-card-thumb">
        ${anime.img ? `<img src="${esc(anime.img)}" alt="${esc(anime.title)}" loading="lazy" onerror="this.parentElement.style.background='var(--dark-card2)'"/>` : '<div class="jadwal-no-img"></div>'}
        <div class="jadwal-card-badges">
          ${anime.type ? `<span class="jadwal-badge-type">${esc(anime.type)}</span>` : ''}
          ${anime.score ? `<span class="jadwal-badge-score">★ ${esc(anime.score)}</span>` : ''}
        </div>
      </div>
      <div class="jadwal-card-info">
        <div class="jadwal-card-title">${esc(anime.title)}</div>
        ${anime.genre ? `<div class="jadwal-card-genre">${esc(anime.genre)}</div>` : ''}
        ${anime.time ? `<div class="jadwal-card-time">${ICONS.calendar} ${esc(anime.time)}</div>` : ''}
      </div>
    </div>`).join('')}
  </div>`;
}

// ============================================================
// SEARCH
// ============================================================
async function doSearch() {
  const q = document.getElementById('navSearch').value.trim();
  if (!q) return;
  showPage('search', true, null, `/search?q=${encodeURIComponent(q)}`);
  document.getElementById('searchDesc').textContent = `Hasil untuk: "${q}"`;
  document.getElementById('searchGrid').innerHTML = loadingState();
  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (!data.length) { document.getElementById('searchGrid').innerHTML = emptyState('TIDAK DITEMUKAN', `Tidak ada anime dengan kata kunci "${q}"`); }
    else { renderGrid('searchGrid', data); }
  } catch(e) { document.getElementById('searchGrid').innerHTML = errorState('Pencarian gagal.'); }
}

// ============================================================
// DETAIL
// ============================================================
async function loadDetail(url, push=true) {
  showPage('detail', push, url, `/detail?url=${encodeURIComponent(url)}`);
  document.getElementById('detailContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat detail...</span></div>`;
  try {
    const res = await fetch(`/api/detail?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderDetail(data, url);
  } catch(e) { document.getElementById('detailContent').innerHTML = errorState('Gagal memuat detail anime.'); }
}

let _detailData = null;
let _detailUrl = '';

function renderDetail(data, url) {
  _detailData = data; _detailUrl = url;
  currentEpisodes = data.episodes || [];
  currentAnimeTitle = data.title || '';
  currentAnimeImage = data.image || '';
  currentAnimeUrl = url;
  const prog = getProgress();

  // Meta badges (episode count, type, status, score)
  const info = data.info || {};
  const epCount = (data.episodes||[]).length;
  const typeVal = info['tipe'] || info['type'] || info['format'] || '';
  const statusVal = info['status'] || '';
  const scoreVal = info['skor'] || info['score'] || info['rating'] || '';
  const isOngoing = statusVal.toLowerCase().includes('ongoing') || statusVal.toLowerCase().includes('airing');

  const metaBadges = [
    epCount ? `<span class="detail-meta-badge">${ICONS.list} ${epCount} Episode</span>` : '',
    typeVal ? `<span class="detail-meta-badge">${ICONS.film} ${esc(typeVal)}</span>` : '',
    statusVal ? `<span class="detail-meta-badge${isOngoing?' status-on':''}">${esc(statusVal)}</span>` : '',
    scoreVal ? `<span class="detail-score-badge">★ ${esc(scoreVal)}</span>` : '',
  ].filter(Boolean).join('');

  // Genre tags
  const genreRaw = info['genre'] || info['genres'] || '';
  const genreTags = genreRaw ? genreRaw.split(',').map(g=>`<span class="genre-tag">${esc(g.trim())}</span>`).join('') : '';

  // Meta grid (exclude genre, score, status, type, episode from grid)
  const skipKeys = ['genre','genres','tipe','type','format','status','skor','score','rating'];
  const metaHtml = Object.entries(info).filter(([k])=>!skipKeys.includes(k.toLowerCase())).slice(0,6).map(([k,v])=>`<div class="meta-item"><div class="meta-key">${esc(k.replace(/_/g,' '))}</div><div class="meta-val">${esc(v)}</div></div>`).join('');

  // Episode list
  const epHtml = (data.episodes||[]).map((ep,i)=>{
    const p = prog[ep.url]; const pct = p ? p.pct : 0;
    return `<div class="ep-item" onclick="watchEpFromDetail(${i})">
      <div class="ep-play-icon">${ICONS.play}</div>
      <div class="ep-info">
        <div class="ep-title">${esc(ep.title)}</div>
        <div class="ep-date">${esc(ep.date)}</div>
        ${pct>0?`<div class="watch-ep-progress-bar"><div class="watch-ep-progress-fill" style="width:${pct}%"></div></div>`:''}
      </div>
    </div>`;
  }).join('');

  // First episode URL for watch button
  const firstEp = data.episodes && data.episodes.length > 0 ? data.episodes[data.episodes.length-1] : null;

  document.getElementById('detailContent').innerHTML = `
    <div class="detail-wrapper">

      <!-- Banner area -->
      <div class="detail-banner-area">
        <img class="detail-banner-img" src="${esc(data.image)}" alt="${esc(data.title)}" onerror="this.style.display='none'"/>
        <div class="detail-banner-overlay"></div>
        <button class="detail-back-btn-abs" onclick="history.go(-1)">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" width="16" height="16"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button class="detail-fav-btn-abs">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" width="16" height="16"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        </button>
      </div>

      <!-- Poster + title row -->
      <div class="detail-top-row">
        <div class="detail-poster">
          <img src="${esc(data.image)}" alt="${esc(data.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/200x280/0d1520/00b4ff?text=?'"/>
        </div>
        <div class="detail-info">
          <h1 class="detail-title">${esc(data.title)}</h1>
          <div class="detail-meta-inline">${metaBadges}</div>
        </div>
      </div>

      <!-- Watch button -->
      ${firstEp ? `<button class="detail-watch-btn" onclick="watchEpFromDetail(${(data.episodes.length||1)-1})">
        <svg viewBox="0 0 24 24" fill="black" width="16" height="16"><polygon points="5 3 19 12 5 21 5 3"/></svg>
        Tonton Episode 1
      </button>` : ''}

      <!-- Body -->
      <div class="detail-body">

        <!-- Sinopsis -->
        <div class="detail-section-label">SINOPSIS</div>
        <div class="detail-section-line"></div>
        <p class="detail-desc" id="detailDescText" style="-webkit-line-clamp:4;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;">${esc(data.description||'Tidak ada deskripsi.')}</p>
        <span class="detail-desc-toggle" onclick="toggleDetailDesc()">Selengkapnya</span>

        <!-- Genre -->
        ${genreTags ? `<div class="detail-section-label">GENRE</div><div class="detail-section-line"></div><div class="detail-genres">${genreTags}</div>` : ''}

        <!-- Info meta -->
        ${metaHtml ? `<div class="detail-meta-grid">${metaHtml}</div>` : ''}

        <div class="glow-line"></div>

        <!-- Episode list -->
        <div class="ep-section-title">${ICONS.tv}DAFTAR EPISODE<span class="ep-count">${epCount} EPS</span></div>
        <div class="episode-list">${epHtml||`<div class="empty-state"><div style="display:flex;justify-content:center;opacity:.3;margin-bottom:8px">${ICONS.tv}</div><p class="empty-title">BELUM ADA EPISODE</p></div>`}</div>
      </div>
    </div>`;
}

function toggleDetailDesc() {
  const el = document.getElementById('detailDescText');
  const btn = el ? el.nextElementSibling : null;
  if (!el) return;
  if (el.style.webkitLineClamp === '4' || el.style.WebkitLineClamp === '4') {
    el.style.cssText = 'display:block;overflow:visible;';
    if (btn) btn.textContent = 'Sembunyikan';
  } else {
    el.style.cssText = '-webkit-line-clamp:4;display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;';
    if (btn) btn.textContent = 'Selengkapnya';
  }
}

// ============================================================
// WATCH
// ============================================================
let currentWatchData = null;
let currentAnimeUrl = '';
let currentAnimeTitle = '';
let currentAnimeImage = '';
let currentEpisodes = [];
let progressInterval = null;

async function loadWatch(url, title, animeUrl, animeTitle, animeImage, episodes, push=true) {
  showPage('watch', push, url, `/watch?url=${encodeURIComponent(url)}`);
  currentAnimeUrl = animeUrl || currentAnimeUrl || '';
  currentAnimeTitle = animeTitle || currentAnimeTitle || '';
  currentAnimeImage = animeImage || currentAnimeImage || '';
  if (episodes && episodes.length) currentEpisodes = episodes;
  document.getElementById('watchContent').innerHTML = `<div class="loading-wrap" style="min-height:60vh"><div class="spinner"></div><span>Memuat player...</span></div>`;
  try {
    const res = await fetch(`/api/watch?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    renderWatch(data, url, title || data.title);
    addHistory({ epUrl:url, epTitle:title||data.title||'', animeUrl:animeUrl||data.animeLink||'', animeTitle:animeTitle||data.title||'', image:animeImage||'', timestamp:Date.now() });
  } catch(e) { document.getElementById('watchContent').innerHTML = errorState('Gagal memuat video player.'); }
}

let currentStreams = [];
let currentStreamIdx = 0;
let currentEpUrl = '';

function renderWatch(data, url, title) {
  currentWatchData = data; currentEpUrl = url;
  currentStreams = data.streams || []; currentStreamIdx = 0;
  if (progressInterval) clearInterval(progressInterval);

  const serverTabsHtml = currentStreams.map((s,i)=>`<button class="server-tab ${i===0?'active':''}" onclick="switchServer(${i},this)">${esc(s.server)}</button>`).join('');
  const dlHtml = (data.downloads||[]).map(group=>`<div class="dl-group"><div class="dl-quality">${ICONS.film} ${esc(group.quality)}</div><div class="dl-links">${(group.links||[]).map(l=>`<a class="dl-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.host)}</a>`).join('')}</div></div>`).join('');
  const videoHtml = currentStreams.length > 0
    ? `<iframe src="${esc(currentStreams[0].url)}" allowfullscreen allow="autoplay; fullscreen" id="videoFrame"></iframe>`
    : `<div class="no-stream"><div class="no-stream-icon" style="display:flex;justify-content:center;opacity:.3">${ICONS.tv}</div><span>STREAM TIDAK TERSEDIA</span></div>`;
  const epListItems = currentEpisodes.length > 0
    ? currentEpisodes.map((ep,i)=>buildWatchEpItem(ep,url,i)).join('')
    : '<div style="padding:20px;font-family:var(--font-ui);font-size:10px;color:var(--text-muted);text-align:center;letter-spacing:1px;">BUKA DETAIL UNTUK LIST EP</div>';
  const prog = getProgressFor(url);
  const savedSec = prog ? prog.seconds : 0;
  const autoOn = autoplayEnabled;

  document.getElementById('watchContent').innerHTML = `
    <div class="watch-wrapper">
      <div class="watch-back-area">
        <button class="back-btn" onclick="${currentAnimeUrl?`loadDetail('${esc(currentAnimeUrl)}')`:' history.go(-1)'}">${ICONS.back}KEMBALI</button>
      </div>
      <div class="watch-title-area">
        <h2 class="watch-title">${ICONS.tv} ${esc(data.title||title)}</h2>
      </div>
      <div class="watch-video-area">
        <div class="video-container" id="videoContainer">${videoHtml}</div>
      </div>
      <div class="watch-autoplay-area">
        <div class="autoplay-toggle-row">
          <div class="autoplay-label">${ICONS.next}Auto Next Episode</div>
          <div class="autoplay-toggle-right">
            <span class="autoplay-status ${autoOn?'on':''}" id="autoplayStatus">${autoOn?'ON':'OFF'}</span>
            <button class="autoplay-btn ${autoOn?'on':''}" id="autoplayBtn" onclick="toggleAutoplay()"></button>
          </div>
        </div>
      </div>
      ${currentStreams.length>1?`<div class="watch-servers-area"><div class="server-label">SERVER:</div><div class="server-tabs">${serverTabsHtml}</div></div>`:'<div class="watch-servers-area"></div>'}
      <div class="watch-naveps-area">
        <div class="nav-eps">
          <button class="ep-nav-btn" onclick="navEp('${esc(data.prevEp)}','${esc(currentAnimeUrl)}')" ${!data.prevEp?'disabled':''}>${ICONS.prev} EP SEBELUMNYA</button>
          <button class="ep-nav-btn" onclick="navEp('${esc(data.nextEp)}','${esc(currentAnimeUrl)}')" ${!data.nextEp?'disabled':''}>EP SELANJUTNYA ${ICONS.next}</button>
        </div>
      </div>
      <div class="watch-eplist-area">
        <div class="watch-ep-panel">
          <div class="watch-ep-panel-header">${ICONS.list} DAFTAR EPISODE</div>
          <div class="watch-ep-list" id="watchEpList">${epListItems}</div>
        </div>
      </div>
      ${dlHtml?`<div class="watch-download-area"><div class="download-section"><div class="download-title">${ICONS.download} DOWNLOAD</div><div class="download-groups">${dlHtml}</div></div></div>`:''}
    </div>`;

  setTimeout(() => {
    const active = document.querySelector('.watch-ep-item.active');
    if (active) active.scrollIntoView({ block: 'center' });
  }, 200);

  window._nextEpUrl = data.nextEp || '';
  window._currentEpAnimeUrl = currentAnimeUrl;

  startProgressTracking(url, savedSec);
}

function watchEpFromDetail(idx) {
  const ep = currentEpisodes[idx]; if(!ep) return;
  loadWatch(ep.url, ep.title, currentAnimeUrl, currentAnimeTitle, currentAnimeImage, currentEpisodes);
}
function watchEpFromPanel(idx) {
  const ep = currentEpisodes[idx]; if(!ep) return;
  loadWatch(ep.url, ep.title, currentAnimeUrl, currentAnimeTitle, currentAnimeImage, currentEpisodes);
}
function buildWatchEpItem(ep, currentUrl, idx) {
  const prog = getProgressFor(ep.url); const pct = prog ? prog.pct : 0; const isActive = ep.url === currentUrl;
  return `<div class="watch-ep-item ${isActive?'active':''}" onclick="watchEpFromPanel(${idx})"><div class="watch-ep-item-title">${esc(ep.title)}</div>${pct>0?`<div class="watch-ep-progress-bar"><div class="watch-ep-progress-fill" style="width:${pct}%"></div></div>`:''}</div>`;
}
function navEp(epUrl, animeUrl) {
  if (!epUrl) return;
  loadWatch(epUrl, '', animeUrl||currentAnimeUrl, currentAnimeTitle, currentAnimeImage, currentEpisodes);
}
function switchServer(idx, btn) {
  if (!currentStreams[idx]) return;
  currentStreamIdx = idx;
  document.querySelectorAll('.server-tab').forEach((t,i)=>t.classList.toggle('active',i===idx));
  const container = document.getElementById('videoContainer');
  if (container) container.innerHTML = `<iframe src="${esc(currentStreams[idx].url)}" allowfullscreen allow="autoplay; fullscreen" id="videoFrame"></iframe>`;
}

// ============================================================
// PROGRESS TRACKING + AUTOPLAY
// ============================================================
let trackedSeconds = 0;
const AUTOPLAY_THRESHOLD = 600;

function startProgressTracking(epUrl, startSec) {
  if (progressInterval) clearInterval(progressInterval);
  trackedSeconds = startSec || 0;
  _saveTrackedProgress(epUrl);
  progressInterval = setInterval(() => {
    if (!document.querySelector('#videoFrame')) return;
    trackedSeconds += 10;
    _saveTrackedProgress(epUrl);
    if (autoplayEnabled && trackedSeconds > 0 && trackedSeconds % AUTOPLAY_THRESHOLD === 0) {
      const nextUrl = window._nextEpUrl;
      if (nextUrl && currentPage === 'watch') {
        showToast('Lanjut ke episode berikutnya...');
        setTimeout(() => navEp(nextUrl, window._currentEpAnimeUrl || currentAnimeUrl), 1500);
      }
    }
  }, 10000);
}
function _saveTrackedProgress(epUrl) { updateProgress(epUrl, trackedSeconds, trackedSeconds + 600); }
function stopProgressTracking() { if (progressInterval) { clearInterval(progressInterval); progressInterval = null; } }

// ============================================================
// HISTORY PAGE
// ============================================================
function renderHistoryPage() {
  const list = getHistory(); const prog = getProgress();
  const container = document.getElementById('historyContent');
  if (!list.length) {
    container.innerHTML = `<div class="history-panel"><div class="history-header"><span>RIWAYAT NONTON</span></div><div class="history-list"><div class="history-empty">BELUM ADA RIWAYAT<br/><br/>Mulai nonton anime untuk muncul di sini!</div></div></div>`;
    return;
  }
  container.innerHTML = `<div class="history-panel"><div class="history-header"><span>${list.length} RIWAYAT NONTON</span><button class="history-clear-btn" onclick="clearHistory()">${ICONS.trash} HAPUS SEMUA</button></div><div class="history-list">${list.map(h=>historyItemHtml(h,prog[h.epUrl])).join('')}</div></div>`;
}

function clearHistory() {
  if (!confirm('Hapus semua riwayat?')) return;
  localStorage.removeItem(HISTORY_KEY); localStorage.removeItem(PROGRESS_KEY);
  renderHistoryPage(); renderHomeHistory();
  showToast('Riwayat dihapus!');
}

// ============================================================
// RENDER HELPERS
// ============================================================
function renderGrid(containerId, items) {
  const container = document.getElementById(containerId);
  if (!items || !items.length) { container.innerHTML = emptyState('BELUM ADA DATA', ''); return; }
  container.innerHTML = items.map(item=>animeCard(item)).join('');
}

function animeCard(item) {
  const onclick = `loadDetail('${esc(item.url)}')`;
  const epBadge = item.episode ? `<div class="card-ep-badge">EP ${esc(item.episode)}</div>` : '';
  const typeBadge = item.type ? `<div class="card-badge">${esc(item.type)}</div>` : '';
  const scoreMeta = item.score ? `<span class="card-score">${ICONS.star} ${esc(item.score)}</span>` : '';
  return `<div class="anime-card" onclick="${onclick}"><div class="card-img-wrap"><img class="card-img" src="${esc(item.image)}" alt="${esc(item.title)}" loading="lazy" onerror="this.src='https://via.placeholder.com/160x224/0d1520/00b4ff?text=?'"/><div class="card-overlay"></div><div class="card-play">${ICONS.play}</div>${typeBadge}${epBadge}</div><div class="card-body"><div class="card-title">${esc(item.title)}</div><div class="card-meta">${scoreMeta}</div></div></div>`;
}

function renderPagination(containerId, current, hasNext, callback) {
  const container = document.getElementById(containerId); if(!container) return;
  let html = '';
  if (current > 1) html += `<button class="page-btn" onclick="(${callback.toString()})(${current-1})">◀</button>`;
  const start = Math.max(1, current-2);
  for (let i=start; i<=current+2; i++) {
    if (i===current) html += `<button class="page-btn active">${i}</button>`;
    else if (i>=1) html += `<button class="page-btn" onclick="(${callback.toString()})(${i})">${i}</button>`;
  }
  if (hasNext) html += `<button class="page-btn" onclick="(${callback.toString()})(${current+1})">▶</button>`;
  container.innerHTML = html;
}

// ============================================================
// UTILS
// ============================================================
function esc(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}
function loadingState(msg='Memuat data...') { return `<div class="loading-wrap"><div class="spinner"></div><span>${msg}</span></div>`; }
function errorState(msg) { return `<div class="empty-state"><div class="empty-icon" style="display:flex;justify-content:center;opacity:.5">${ICONS.warn}</div><p class="empty-title">OOPS!</p><p>${msg}</p></div>`; }
function emptyState(title, msg) { return `<div class="empty-state" style="grid-column:1/-1"><p class="empty-title">${title}</p><p>${msg}</p></div>`; }

// ============================================================
// HERO SLIDER
// ============================================================
const HERO_SEARCHES = ['isekai','action','romance','fantasy','school','magic','adventure','shounen'];
let heroSlides = [], heroIdx = 0, heroTimer = null;

async function loadHeroSlider() {
  const shuffled = [...HERO_SEARCHES].sort(()=>Math.random()-0.5).slice(0,4);
  const results = await Promise.all(shuffled.map(async(q)=>{
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const list = await res.json();
      return (list||[]).filter(a=>a.image).sort(()=>Math.random()-0.5).slice(0,2);
    } catch { return []; }
  }));
  heroSlides = results.flat().filter(Boolean).sort(()=>Math.random()-0.5).slice(0,10);
  if (!heroSlides.length) {
    try { const res=await fetch('/api/latest'); const list=await res.json(); heroSlides=list.slice(0,8); } catch {}
  }
  if (!heroSlides.length) return;
  renderHeroSlides(); heroIdx=0; updateHeroContent(0); buildHeroDots(); startHeroTimer();
}

function renderHeroSlides() {
  const container = document.getElementById('heroSlides'); if(!container) return;
  container.innerHTML = heroSlides.map((s,i)=>`<div class="hero-slide-img${i===0?' active':''}" style="background-image:url('${esc(s.image)}')" data-idx="${i}"></div>`).join('');
}
function updateHeroContent(idx) {
  const s = heroSlides[idx]; if(!s) return;
  const title=document.getElementById('heroTitle');
  const btnWatch=document.getElementById('heroBtnWatch'); const btnDetail=document.getElementById('heroBtnDetail');
  if(title) title.textContent = s.title||'—';
  if(btnWatch) btnWatch.onclick = ()=>loadDetail(s.url);
  if(btnDetail) btnDetail.onclick = ()=>loadDetail(s.url);
  document.querySelectorAll('.hero-slide-img').forEach((el,i)=>el.classList.toggle('active',i===idx));
  document.querySelectorAll('#heroDots .dot').forEach((d,i)=>d.classList.toggle('active',i===idx));
}
function buildHeroDots() {
  const dotsEl = document.getElementById('heroDots'); if(!dotsEl) return;
  dotsEl.innerHTML = heroSlides.map((_,i)=>`<span class="dot${i===0?' active':''}" onclick="heroGoTo(${i})"></span>`).join('');
}
function heroGoTo(idx) { heroIdx=idx; updateHeroContent(idx); resetHeroTimer(); }
function startHeroTimer() { heroTimer=setInterval(()=>{ heroIdx=(heroIdx+1)%heroSlides.length; updateHeroContent(heroIdx); },4500); }
function resetHeroTimer() { if(heroTimer) clearInterval(heroTimer); startHeroTimer(); }

document.addEventListener('DOMContentLoaded', ()=>{
  history.replaceState({page:_getPageFromPath(location.pathname,location.search),rawUrl:new URLSearchParams(location.search).get('url')},'',location.pathname+location.search);
  _routeFromPath(location.pathname, location.search);
  loadHeroSlider();
  updateNavAuth(window._currentUser||null);
  renderSettingPage(window._currentUser||null);
});

function _getPageFromPath(path, search) {
  if(path==='/'||path==='') return 'home';
  if(path==='/latest') return 'latest';
  if(path==='/movie') return 'movie';
  if(path==='/top10') return 'top10';
  if(path==='/jadwal') return 'jadwal';
  if(path==='/history') return 'history';
  if(path==='/search') return 'search';
  if(path==='/detail') return 'detail';
  if(path==='/watch') return 'watch';
  return 'home';
}
