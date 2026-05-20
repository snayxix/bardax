// ===== DATA & CONSTANTS =====
const ESPECES = [
  {nom:'Brochet',emoji:'🐟'},
  {nom:'Perche',emoji:'🐠'},
  {nom:'Carpe',emoji:'🐡'},
  {nom:'Truite',emoji:'🐟'},
  {nom:'Bass',emoji:'🐟'},
  {nom:'Sandre',emoji:'🦈'},
  {nom:'Silure',emoji:'🐋'},
  {nom:'Gardon',emoji:'🐟'},
  {nom:'Tanche',emoji:'🐡'},
  {nom:'Anguille',emoji:'🐍'},
];

const LEURRES = [
  'Vif', 'Vers', 'Maïs', 'Bouillette', 'Spinner',
  'Crankbait', 'Jig', 'Cuillère', 'Popper', 'Leurre souple'
];

const METEOS = [
  '☀️ Soleil', '⛅ Nuageux', '🌧 Pluie', '🌩 Orage',
  '❄️ Froid', '💨 Vent', '🌫 Brume'
];

// ===== STATE =====
let currentUser = null;
let users = JSON.parse(localStorage.getItem('carnet_users') || '{}');
let lbMode = 'nb';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
  checkLogin();
});

// ===== AUTH FUNCTIONS =====
function checkLogin() {
  const savedUser = localStorage.getItem('carnet_current_user');
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    showApp();
  } else {
    showLogin();
  }
}

function showLogin() {
  console.log('Affichage login');
  document.getElementById('page-login').style.display = 'flex';
  document.getElementById('page-signup').style.display = 'none';
  document.getElementById('page-app').style.display = 'none';
}

function showSignup(e) {
  e.preventDefault();
  console.log('Affichage signup');
  document.getElementById('page-login').style.display = 'none';
  document.getElementById('page-signup').style.display = 'flex';
  document.getElementById('page-app').style.display = 'none';
}

function showLoginFromSignup(e) {
  e.preventDefault();
  console.log('Retour login');
  document.getElementById('page-login').style.display = 'flex';
  document.getElementById('page-signup').style.display = 'none';
  document.getElementById('page-app').style.display = 'none';
}

function handleLogin(e) {
  e.preventDefault();
  const pseudo = document.getElementById('login-pseudo').value.trim();
  const password = document.getElementById('login-password').value;

  console.log('Login tentative:', pseudo);

  if (!pseudo || !password) {
    alert('Remplissez tous les champs');
    return;
  }

  if (!users[pseudo]) {
    alert('Pseudo ou mot de passe incorrect');
    return;
  }

  if (users[pseudo].password !== password) {
    alert('Pseudo ou mot de passe incorrect');
    return;
  }

  currentUser = { pseudo };
  localStorage.setItem('carnet_current_user', JSON.stringify(currentUser));
  console.log('Utilisateur connecte:', currentUser);
  
  document.getElementById('login-pseudo').value = '';
  document.getElementById('login-password').value = '';
  
  showApp();
}

function handleSignup(e) {
  e.preventDefault();
  const pseudo = document.getElementById('signup-pseudo').value.trim();
  const password = document.getElementById('signup-password').value;
  const passwordConfirm = document.getElementById('signup-password-confirm').value;

  console.log('Signup tentative:', pseudo);

  if (!pseudo || !password || !passwordConfirm) {
    alert('Remplissez tous les champs');
    return;
  }

  if (password !== passwordConfirm) {
    alert('Les mots de passe ne correspondent pas');
    return;
  }

  if (password.length < 4) {
    alert('Le mot de passe doit faire au moins 4 caractères');
    return;
  }

  if (users[pseudo]) {
    alert('Ce pseudo est deja utilise');
    return;
  }

  users[pseudo] = { password, prises: [] };
  localStorage.setItem('carnet_users', JSON.stringify(users));

  console.log('Compte cree:', pseudo);
  alert('Compte cree! Connectez-vous maintenant.');
  
  document.getElementById('signup-pseudo').value = '';
  document.getElementById('signup-password').value = '';
  document.getElementById('signup-password-confirm').value = '';
  
  showLogin();
}

function handleLogout() {
  if (confirm('Etes-vous sur de vouloir vous deconnecter ?')) {
    currentUser = null;
    localStorage.removeItem('carnet_current_user');
    showLogin();
  }
}

function showApp() {
  console.log('Affichage app');
  document.getElementById('page-login').style.display = 'none';
  document.getElementById('page-signup').style.display = 'none';
  document.getElementById('page-app').style.display = 'block';
  buildSelectors();
  renderJournal();
}

// ===== PRISES MANAGEMENT =====
function getPrises() {
  if (!currentUser) return [];
  if (!users[currentUser.pseudo]) users[currentUser.pseudo] = { password: '', prises: [] };
  return users[currentUser.pseudo].prises || [];
}

function savePrises() {
  if (!currentUser) return;
  localStorage.setItem('carnet_users', JSON.stringify(users));
}

function addPrise(prise) {
  if (!currentUser) return;
  if (!users[currentUser.pseudo]) users[currentUser.pseudo] = { password: '', prises: [] };
  users[currentUser.pseudo].prises.push(prise);
  savePrises();
}

function deletePrise(id) {
  if (!currentUser) return;
  users[currentUser.pseudo].prises = users[currentUser.pseudo].prises.filter(p => p.id !== id);
  savePrises();
}

// ===== HELPERS =====
function getEmoji(nom) {
  return (ESPECES.find(e => e.nom === nom) || {emoji: '🐟'}).emoji;
}

function formatDate(d) {
  if (!d) return '';
  const [y, m, day] = d.split('-');
  const mois = ['jan', 'fev', 'mar', 'avr', 'mai', 'jun', 'jul', 'aou', 'sep', 'oct', 'nov', 'dec'];
  return parseInt(day) + ' ' + mois[parseInt(m) - 1] + ' ' + y;
}

// ===== NAVIGATION =====
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => {
    p.classList.remove('active');
    p.classList.remove('fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in', 'flip-in');
  });
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  const animations = ['fade-in', 'slide-up', 'slide-left', 'slide-right', 'zoom-in', 'flip-in'];
  const randomAnimation = animations[Math.floor(Math.random() * animations.length)];
  
  const page = document.getElementById('page-' + id);
  page.classList.add('active');
  page.classList.add(randomAnimation);
  
  if (event && event.target) {
    event.target.classList.add('active');
  }

  if (id === 'journal') renderJournal();
  if (id === 'galerie') renderGalerie();
  if (id === 'stats') renderStats();
  if (id === 'classement') renderClassement();
}

// ===== JOURNAL PAGE =====
function renderJournal() {
  const prises = getPrises();
  const search = document.getElementById('search-input').value.toLowerCase();
  const filterEspece = document.getElementById('filter-espece').value;

  const especes = [...new Set(prises.map(p => p.espece))].sort();
  const seEl = document.getElementById('filter-espece');
  const curEsp = seEl.value;

  seEl.innerHTML = '<option value="">Toutes especes</option>' +
    especes.map(e => '<option value="' + e + '" ' + (e === curEsp ? 'selected' : '') + '>' + getEmoji(e) + ' ' + e + '</option>').join('');

  let filtered = [...prises].sort((a, b) => b.date.localeCompare(a.date));

  if (search) {
    filtered = filtered.filter(p =>
      p.espece.toLowerCase().includes(search) ||
      p.lieu.toLowerCase().includes(search)
    );
  }

  if (filterEspece) {
    filtered = filtered.filter(p => p.espece === filterEspece);
  }

  const grid = document.getElementById('journal-grid');

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="empty" style="grid-column:1/-1"><div class="empty-icon">Poisson</div><p>Aucune prise trouvee</p></div>';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    let badges = '';
    if (p.taille) badges += '<span class="badge">Taille: ' + p.taille + ' cm</span>';
    if (p.poids) badges += '<span class="badge gold">Poids: ' + p.poids + ' kg</span>';
    if (p.leurre) badges += '<span class="badge green">Leurre: ' + p.leurre + '</span>';
    if (p.meteo) badges += '<span class="badge">' + p.meteo + '</span>';
    
    return '<div class="fish-card" onclick="openModal(' + p.id + ')">' +
      '<div class="fish-card-top">' +
      '<div class="fish-emoji">' + getEmoji(p.espece) + '</div>' +
      '<div class="fish-info">' +
      '<h3>' + p.espece + '</h3>' +
      '<div class="fish-spot">Lieu: ' + p.lieu + '</div>' +
      '</div></div>' +
      '<div class="fish-card-body">' + badges + '</div>' +
      '<div class="fish-card-footer">' +
      '<span class="fish-date">Date: ' + formatDate(p.date) + '</span>' +
      '</div></div>';
  }).join('');
}

// ===== MODAL =====
function openModal(id) {
  const prises = getPrises();
  const p = prises.find(x => x.id === id);
  if (!p) return;

  let details = '';
  if (p.taille) details += '<div class="detail-item"><div class="d-label">Taille</div><div class="d-val">' + p.taille + ' cm</div></div>';
  if (p.poids) details += '<div class="detail-item"><div class="d-label">Poids</div><div class="d-val">' + p.poids + ' kg</div></div>';
  if (p.leurre) details += '<div class="detail-item"><div class="d-label">Leurre</div><div class="d-val">' + p.leurre + '</div></div>';
  if (p.meteo) details += '<div class="detail-item"><div class="d-label">Meteo</div><div class="d-val">' + p.meteo + '</div></div>';

  let notes = '';
  if (p.notes) notes = '<div class="detail-item" style="margin-bottom:0"><div class="d-label">Notes</div><div class="d-val" style="font-weight:400;color:var(--text2)">' + p.notes + '</div></div>';

  document.getElementById('modal-body').innerHTML = 
    '<div style="display:flex;align-items:center;gap:14px;margin-bottom:20px">' +
    '<span style="font-size:3rem">' + getEmoji(p.espece) + '</span>' +
    '<div>' +
    '<h2>' + p.espece + '</h2>' +
    '<div style="color:var(--text2);font-size:0.85rem">Lieu: ' + p.lieu + ' - Date: ' + formatDate(p.date) + '</div>' +
    '</div></div>' +
    '<div class="modal-detail">' + details + '</div>' +
    notes;

  document.getElementById('btn-delete').onclick = () => supprimerPrise(id);
  document.getElementById('modal-overlay').classList.add('open');
}

function closeModal(e) {
  if (e.target === document.getElementById('modal-overlay')) {
    document.getElementById('modal-overlay').classList.remove('open');
  }
}

function supprimerPrise(id) {
  if (!confirm('Supprimer cette prise ?')) return;
  deletePrise(id);
  document.getElementById('modal-overlay').classList.remove('open');
  renderJournal();
}

// ===== FORM =====
function buildSelectors() {
  document.getElementById('espece-selector').innerHTML = ESPECES.map(e =>
    '<button class="sel-btn" onclick="selectSel(this,\'espece\')" data-val="' + e.nom + '">' + e.emoji + ' ' + e.nom + '</button>'
  ).join('');

  document.getElementById('leurre-selector').innerHTML = LEURRES.map(l =>
    '<button class="sel-btn" onclick="selectSel(this,\'leurre\')" data-val="' + l + '">Leurre: ' + l + '</button>'
  ).join('');

  document.getElementById('meteo-selector').innerHTML = METEOS.map(m =>
    '<button class="sel-btn" onclick="selectSel(this,\'meteo\')" data-val="' + m + '">' + m + '</button>'
  ).join('');

  document.getElementById('f-date').value = new Date().toISOString().split('T')[0];
}

function selectSel(btn, group) {
  btn.closest('.selector').querySelectorAll('.sel-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

function getSelected(id) {
  const el = document.querySelector('#' + id + '-selector .sel-btn.selected');
  return el ? el.dataset.val : '';
}

function ajouterPrise() {
  const date = document.getElementById('f-date').value;
  const lieu = document.getElementById('f-lieu').value.trim();
  const espece = getSelected('espece');

  if (!date || !lieu || !espece) {
    alert('Remplis au moins : Date, Lieu et Espece');
    return;
  }

  addPrise({
    id: Date.now(),
    date: date,
    lieu: lieu,
    espece: espece,
    taille: parseFloat(document.getElementById('f-taille').value) || 0,
    poids: parseFloat(document.getElementById('f-poids').value) || 0,
    leurre: getSelected('leurre'),
    meteo: getSelected('meteo'),
    notes: document.getElementById('f-notes').value.trim(),
  });

  ['f-lieu', 'f-taille', 'f-poids', 'f-notes'].forEach(id => {
    document.getElementById(id).value = '';
  });

  document.querySelectorAll('.sel-btn').forEach(b => b.classList.remove('selected'));
  document.getElementById('f-date').value = new Date().toISOString().split('T')[0];

  alert('Prise enregistree!');
  renderJournal();
}

// ===== GALLERY PAGE =====
function renderGalerie() {
  const prises = getPrises();
  const sorted = [...prises].sort((a, b) => b.date.localeCompare(a.date));

  if (sorted.length === 0) {
    document.getElementById('galerie-grid').innerHTML = '<div class="empty"><div class="empty-icon">Photo</div><p>Aucune prise a afficher</p></div>';
    return;
  }

  document.getElementById('galerie-grid').innerHTML = sorted.map(p => {
    let sub = '';
    if (p.taille) sub += p.taille + ' cm ';
    if (p.poids) sub += '- ' + p.poids + ' kg';
    
    return '<div class="gallery-item" onclick="openModal(' + p.id + ')">' +
      '<div class="big-emoji">' + getEmoji(p.espece) + '</div>' +
      '<div class="g-name">' + p.espece + '</div>' +
      '<div class="g-sub">' + sub + '</div>' +
      '</div>';
  }).join('');
}

// ===== STATS PAGE =====
function renderStats() {
  const prises = getPrises();
  const total = prises.length;
  const maxTaille = prises.reduce((m, p) => Math.max(m, p.taille || 0), 0);
  const maxPoids = prises.reduce((m, p) => Math.max(m, p.poids || 0), 0);

  document.getElementById('stats-top').innerHTML = [
    {icon: 'Poisson', val: total, label: 'Prises totales'},
    {icon: 'Taille', val: maxTaille ? maxTaille + ' cm' : '-', label: 'Plus grand poisson'},
    {icon: 'Poids', val: maxPoids ? maxPoids + ' kg' : '-', label: 'Prise la plus lourde'},
    {icon: 'Pecheur', val: currentUser.pseudo, label: 'Vous etes'},
  ].map(s => 
    '<div class="stat-card">' +
    '<div class="stat-icon">' + s.icon + '</div>' +
    '<div class="stat-val">' + s.val + '</div>' +
    '<div class="stat-label">' + s.label + '</div>' +
    '</div>'
  ).join('');

  const colors = ['#4fc3f7', '#69f0ae', '#ffd54f', '#ff6b6b', '#ce93d8', '#ffcc80', '#80cbc4', '#ef9a9a'];

  renderChart('chart-especes', countBy(prises, 'espece'), colors);
  renderChart('chart-leurres', countBy(prises.filter(p => p.leurre), 'leurre'), colors);
  renderChart('chart-meteo', countBy(prises.filter(p => p.meteo), 'meteo'), colors);

  const byMois = {};
  const moisNom = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];

  prises.forEach(p => {
    if (p.date) {
      const m = parseInt(p.date.split('-')[1]) - 1;
      byMois[moisNom[m]] = (byMois[moisNom[m]] || 0) + 1;
    }
  });

  renderChart('chart-mois', byMois, colors);
}

function countBy(arr, key) {
  return arr.reduce((acc, p) => {
    acc[p[key]] = (acc[p[key]] || 0) + 1;
    return acc;
  }, {});
}

function renderChart(id, data, colors) {
  const sorted = Object.entries(data).sort((a, b) => b[1] - a[1]).slice(0, 7);
  const max = sorted[0]?.[1] || 1;

  document.getElementById(id).innerHTML = sorted.length === 0
    ? '<p style="color:var(--text2);font-size:0.85rem">Pas de donnees</p>'
    : sorted.map(([k, v], i) => 
      '<div class="chart-row">' +
      '<div class="chart-label">' + k + '</div>' +
      '<div class="chart-bar-wrap">' +
      '<div class="chart-bar" style="width:' + Math.round(v / max * 100) + '%;background:' + colors[i % colors.length] + '">' + v + '</div>' +
      '</div></div>'
    ).join('');
}

// ===== LEADERBOARD PAGE =====
function showLb(mode) {
  lbMode = mode;

  document.querySelectorAll('.sub-tab').forEach((t, i) => {
    t.classList.toggle('active', ['nb', 'taille', 'poids'][i] === mode);
  });

  renderClassement();
}

function renderClassement() {
  const prises = getPrises();

  let content = '<p style="text-align:center;color:var(--text2)">Vos statistiques personnelles :</p><div style="margin-top:20px">';

  if (lbMode === 'nb') {
    content += '<div style="font-size:1.5rem;color:var(--accent);text-align:center"><strong>' + prises.length + '</strong> prises au total</div>';
  } else if (lbMode === 'taille') {
    const maxTaille = Math.max(...prises.filter(p => p.taille).map(x => x.taille), 0);
    content += '<div style="font-size:1.5rem;color:var(--accent);text-align:center"><strong>' + (maxTaille || '-') + '</strong> cm (plus grand poisson)</div>';
  } else {
    const maxPoids = Math.max(...prises.filter(p => p.poids).map(x => x.poids), 0);
    content += '<div style="font-size:1.5rem;color:var(--accent);text-align:center"><strong>' + (maxPoids || '-') + '</strong> kg (prise la plus lourde)</div>';
  }

  content += '</div>';
  document.getElementById('lb-content').innerHTML = content;
}
