(() => {
'use strict';
const TRIP = { thu: '2026-11-19', fri: '2026-11-20', sat: '2026-11-21', sun: '2026-11-22' };
const DAYS = { thu: 'Jeu 19', fri: 'Ven 20', sat: 'Sam 21', sun: 'Dim 22' };
const TYPES = { boulangerie: 'Boulangerie', cafe: 'Café-pâtisserie', sandwich: 'Sandwicherie', pouce: 'Sur le pouce', pizzeria: 'Pizzeria', trattoria: 'Petit resto (trattoria, osteria)', resto: 'Restaurant', grand: 'Grand restaurant' };
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = v => v == null ? '–' : (Math.round(v * 100) / 100).toFixed(v % 1 ? 2 : 0).replace('.', ',');
const hav = (a, b, c, d) => { const R = 6371, r = x => x * Math.PI / 180; const x = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
const fmtDist = km => km < 1 ? Math.round(km * 1000 / 10) * 10 + ' m' : (km < 10 ? km.toFixed(1).replace('.', ',') : Math.round(km)) + ' km';

let P = [], LODG = [], map, cluster, markers = new Map(), me = null, meMarker = null, meCircle = null, follow = false, selected = null;
const st = { q: '', quick: new Set(), day: 'auto', useTime: false, time: '13:00', maxPrice: 60, hideExpensive: false, meal: new Set(), type: new Set(), cuisine: new Set(), flag: new Set(), minRating: 0, zone: new Set(), sort: 'dist' };

function todayKey() { const d = new Date(); const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); return Object.keys(TRIP).find(k => TRIP[k] === iso) || null; }
function nowMin() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function activeDay() { return st.day !== 'auto' ? st.day : (todayKey() || 'thu'); }
function activeTime() { if (st.quick.has('now')) return nowMin(); if (st.useTime) { const [h, m] = st.time.split(':').map(Number); return h * 60 + m; } return null; }
function openAt(p, day, min) { const h = p.hours[day]; if (!h) return false; return h.r.some(([s, e]) => min >= s && min < e); }
function openToday(p, day) { const h = p.hours[day]; return !!(h && h.r.length); }
function priceOf(p) { return p.price.avg; }

function matches(p, ignore) {
  const day = activeDay(), t = activeTime();
  if (st.q) { const hay = (p.name + ' ' + p.zoneLabel + ' ' + p.address + ' ' + (p.cats || []).join(' ') + ' ' + (p.k || '')).toLowerCase(); if (!st.q.split(/\s+/).every(w => hay.includes(w))) return false; }
  if (t != null && !openAt(p, day, t)) return false;
  if (t == null && st.day !== 'auto' && !openToday(p, day)) return false;
  const pr = priceOf(p);
  if (st.maxPrice < 60 && pr != null && pr > st.maxPrice) return false;
  if (st.hideExpensive && p.flags.expensive) return false;
  const meal = new Set([...st.meal, ...['petitdej', 'repas'].filter(m => st.quick.has(m))]);
  if (meal.size && ![...meal].some(m => p.meals.includes(m))) return false;
  if (st.type.size && !st.type.has(p.type)) return false;
  if (st.cuisine.size && !p.cuisine.some(c => st.cuisine.has(c))) return false;
  const fl = new Set([...st.flag, ...['pepite', 'standing', 'local', 'thefork'].filter(f => st.quick.has(f))]);
  for (const f of fl) {
    if (f === 'local' && !p.flags.local) return false;
    if (f === 'nonlocal' && p.flags.local) return false;
    if (f === 'pepite' && !p.flags.pepite) return false;
    if (f === 'copious' && !p.flags.copious) return false;
    if (f === 'slay' && !p.flags.slay) return false;
    if (f === 'standing' && !p.flags.standing) return false;
    if (f === 'menu' && !p.menu) return false;
    if (f === 'thefork' && !p.tf) return false;
    if (f === 'hp' && !p.flags.hp) return false;
  }
  if (st.quick.has('cheap') && !p.price.cheap) return false;
  if (p.rating < st.minRating) return false;
  if (st.zone.size && !st.zone.has(p.zone)) return false;
  return true;
}

function refPoint() { if (me) return [me.lat, me.lng]; const c = map.getCenter(); return [c.lat, c.lng]; }
function sorted(list) {
  const [la, ln] = refPoint();
  for (const p of list) p._d = hav(la, ln, p.lat, p.lng);
  const by = { dist: (a, b) => a._d - b._d, price: (a, b) => (priceOf(a) ?? 99) - (priceOf(b) ?? 99), rating: (a, b) => b.rating - a.rating || b.nReviews - a.nReviews, value: (a, b) => b._v - a._v };
  return list.sort(by[st.sort]);
}

function tagHtml(p, open) {
  const pr = priceOf(p);
  const cls = ['tag', open ? '' : 'closed', p.flags.pepite ? 'pepite' : '', p.flags.slay ? 'slay' : ''].join(' ');
  return '<div class="' + cls + '"><i></i>' + (pr != null ? '≈' + Math.round(pr) + '€' : '·') + '</div>';
}
function statusFor(p) { const day = activeDay(); const t = activeTime() ?? (todayKey() === day ? nowMin() : null); if (t == null) return openToday(p, day); return openAt(p, day, t); }

let renderLimit = 120;
function render() {
  const list = sorted(P.filter(p => matches(p)));
  // markers
  const keep = new Set(list.map(p => p.id));
  const sig = list.map(p => p.id).join('|');
  if (sig !== render._sig) { render._sig = sig; cluster.clearLayers(); cluster.addLayers(list.map(p => markers.get(p.id))); }
  for (const p of list) {
    const m = markers.get(p.id);
    { const open = statusFor(p); if (m._open !== open || m._sel !== (selected === p.id)) { m._open = open; m._sel = selected === p.id; m.setIcon(L.divIcon({ className: '', html: tagHtml(p, open).replace('class="tag', 'class="tag' + (m._sel ? ' sel' : '')), iconSize: null })); } }
  }
  const nAct = activeFilterCount();
  $('#nf').hidden = !nAct; $('#nf').textContent = nAct;
  const day = activeDay(), t = activeTime();
  $('#count').innerHTML = list.length + ' adresses <small>' + (t != null ? 'ouvertes ' + DAYS[day].toLowerCase() + ' à ' + String(Math.floor(t / 60)).padStart(2, '0') + 'h' + String(t % 60).padStart(2, '0') : (st.day !== 'auto' ? 'ouvertes ' + DAYS[day].toLowerCase() : '')) + (me ? ' · triées depuis vous' : '') + '</small>';
  const ol = $('#list');
  if (!list.length) { ol.innerHTML = '<li class="empty"><b>Aucune adresse avec ces filtres.</b>Élargissez le budget, l’heure ou la zone.<br><button class="btn" id="clear2">Effacer les filtres</button></li>'; $('#clear2').onclick = resetAll; return; }
  ol.innerHTML = list.slice(0, renderLimit).map(itemHtml).join('') + (list.length > renderLimit ? '<li class="empty"><button class="btn" id="more">Afficher ' + Math.min(120, list.length - renderLimit) + ' de plus</button></li>' : '');
  const more = $('#more'); if (more) more.onclick = () => { renderLimit += 120; render(); };
}
function itemHtml(p) {
  const open = statusFor(p), pr = priceOf(p), d = p.dishes || {};
  const kp = [];
  if (d.margherita) kp.push('Margherita <b>' + eur(d.margherita.min) + '</b>');
  else if (d.pizza) kp.push('Pizza dès <b>' + eur(d.pizza.min) + '</b>');
  if (d.pasta) kp.push('Pâtes dès <b>' + eur(d.pasta.min) + '</b>');
  if (d.tiramisu) kp.push('Tiramisù <b>' + eur(d.tiramisu.min) + '</b>');
  if (!kp.length && d.panino) kp.push('Panino dès <b>' + eur(d.panino.min) + '</b>');
  if (d.cornetto && kp.length < 3) kp.push('Cornetto <b>' + eur(d.cornetto.min) + '</b>');
  const b = [];
  if (p.flags.pepite) b.push('<span class="bdg pepite">Pépite</span>');
  if (p.flags.slay) b.push('<span class="bdg slay">Slay</span>');
  if (p.flags.local) b.push('<span class="bdg">Local</span>');
  if (p.flags.copious) b.push('<span class="bdg">Copieux</span>');
  if (p.flags.standing) b.push('<span class="bdg">Sur le pouce</span>');
  if (p.tf) b.push('<span class="bdg tf">TheFork' + (p.tf.max ? ' −' + p.tf.max + '%' : '') + '</span>');
  if (p.flags.hp) b.push('<span class="bdg">Hors des sentiers</span>');
  return '<li class="item" data-id="' + esc(p.id) + '"><h3><span class="dot' + (open ? '' : ' closed') + '" title="' + (open ? 'ouvert' : 'fermé') + '"></span><span class="nm">' + esc(p.name) + '</span></h3>' +
    '<div class="meta"><span>' + esc(TYPES[p.type]) + '</span><span>★ ' + String(p.rating).replace('.', ',') + ' (' + p.nReviews + ')</span><span>' + esc(p.zoneLabel) + '</span>' + (p._d != null ? '<span class="num">' + fmtDist(p._d) + '</span>' : '') + '</div>' +
    '<div class="price"><b>' + (pr != null ? '≈' + Math.round(pr) + ' €' : '–') + '</b><small>par pers.</small></div>' +
    (kp.length ? '<div class="keyprices">' + kp.map(x => '<span>' + x + ' €</span>').join('') + '</div>' : '') +
    (b.length ? '<div class="badges">' + b.join('') + '</div>' : '') + '</li>';
}

// ---------- detail
function listino(p) {
  const d = p.dishes || {}; const rows = [];
  const add = (k, label) => { if (d[k]) rows.push('<li><span class="n">' + label + (d[k].ex ? '<small>' + esc(d[k].ex) + (d[k].n > 1 && d[k].max !== d[k].min ? ' · jusqu’à ' + eur(d[k].max) + ' €' : '') + '</small>' : '') + '</span><span class="lead"></span><span class="p">' + eur(d[k].min) + ' €</span></li>'); };
  add('margherita', 'Pizza margherita'); if (!d.margherita) add('pizza', 'Pizza (la moins chère)');
  add('pasta', 'Pâtes (le moins cher)'); add('risotto', 'Risotto'); add('cotoletta', 'Cotoletta'); add('tiramisu', 'Tiramisù');
  add('panino', 'Panino / piadina'); add('taglio', 'Part / focaccia / panzerotto'); add('cornetto', 'Cornetto / brioche');
  return rows.join('');
}
function hist(p) {
  const h = (p.price.hist || []).filter(x => x.n != null); if (!h.length) return '';
  const max = Math.max(...h.map(x => x.n)), tot = h.reduce((a, x) => a + x.n, 0);
  return '<div class="hist" aria-hidden="true">' + h.map(x => '<div class="' + (x.n === max ? 'top' : '') + '" style="height:' + Math.max(3, x.n / max * 100) + '%"></div>').join('') + '</div><div class="hist-l">' + h.map(x => '<span>' + esc(x.label) + '<br>' + Math.round(x.n / tot * 100) + ' %</span>').join('') + '</div>' +
    '<p class="src">Ce que ' + tot + ' clients Google déclarent avoir dépensé par personne (boissons comprises).</p>';
}
function menuTable(items) {
  let html = '<table>', sec = null;
  for (const it of items) { if (it.section && it.section !== sec) { sec = it.section; html += '<tr class="s"><td colspan="2">' + esc(sec) + '</td></tr>'; } html += '<tr><td>' + esc(it.name) + '</td><td>' + esc(it.price || '–') + '</td></tr>'; }
  return html + '</table>';
}
function revHtml(r, neg) { return '<div class="rev' + (neg ? ' neg' : '') + '"><div class="h"><span><span class="stars">' + r.rating + '/5</span> · ' + esc(r.author || '') + (r.it ? '' : ' · avis non italien') + '</span><span class="num">' + esc(r.date) + '</span></div><p>' + esc(r.text) + '</p></div>'; }
function hoursHtml(p) {
  const tk = todayKey();
  let h = '<dl class="hours">' + Object.keys(TRIP).map(k => '<dt class="' + (k === tk ? 'today' : '') + '">' + DAYS[k] + '</dt><dd class="' + (k === tk ? 'today' : '') + '">' + esc(p.hours[k] ? (p.hours[k].txt === 'Chiuso' ? 'Fermé' : p.hours[k].txt) : 'non communiqué') + '</dd>').join('') + '</dl>';
  return h + '<p class="src">Horaires Google pour ces dates précises (jours fériés et fermetures compris), relevés le 18/11/2026.</p>';
}
function openDetail(id, fromMap) {
  const p = P.find(x => x.id === id); if (!p) return;
  selected = id; render();
  const front = p.frontLocal ? p.frontLocal : (p.front ? p.front + '=w800' : (p.cover ? p.cover + '=w800' : null));
  const pr = priceOf(p);
  const m = p.menu;
  let html = '';
  if (front) html += '<figure class="hero" style="margin:0"><img src="' + esc(front) + '" alt="Devanture de ' + esc(p.name) + '" loading="lazy" onerror="this.parentNode.remove()"><figcaption>' + (p.frontLocal ? 'Devanture (Street View)' : 'Photo Google') + '</figcaption></figure>';
  html += '<div class="d-head"><h2>' + esc(p.name) + '</h2><div class="d-sub">' + esc(TYPES[p.type]) + ' · ' + esc(p.cuisine.join(', ')) + ' · ★ ' + String(p.rating).replace('.', ',') + ' (' + p.nReviews + ' avis)<br>' + esc(p.address) + '</div></div>';
  const fl = [];
  if (p.flags.pepite) fl.push('<span class="bdg pepite">Pépite</span>'); if (p.flags.slay) fl.push('<span class="bdg slay">Slay</span>');
  if (p.flags.local) fl.push('<span class="bdg">Local · ' + p.sig.itShare + ' % des avis en italien</span>'); else if (p.sig.itShare != null) fl.push('<span class="bdg">' + p.sig.itShare + ' % des avis en italien</span>');
  if (p.flags.copious) fl.push('<span class="bdg">Copieux</span>'); if (p.flags.standing) fl.push('<span class="bdg">Sur le pouce</span>'); if (p.flags.expensive) fl.push('<span class="bdg">Cher</span>');
  if (p.flags.hp) fl.push('<span class="bdg">Hors des sentiers</span>');
  html += '<div class="d-actions"><a class="btn primary" href="' + esc(p.gmaps) + '" target="_blank" rel="noopener">Google Maps</a><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng + '" target="_blank" rel="noopener">Itinéraire</a>' + (p.tf ? '<a class="btn tf" href="' + esc(p.tf.url) + '" target="_blank" rel="noopener">TheFork' + (p.tf.max ? ' −' + p.tf.max + '%' : '') + '</a>' : '') + '</div>';
  if (fl.length) html += '<div class="sec"><div class="flags">' + fl.join('') + '</div>' + (p.hpNote ? '<p class="src">Trouvé par la recherche hors des sentiers (Slow Food, presse locale, forums), puis vérifié sur Google Maps.</p>' : '') + '</div>';
  // prices
  html += '<div class="sec"><h3>Prix</h3>';
  html += '<p><b class="num" style="font-size:22px;font-stretch:75%">' + (pr != null ? '≈ ' + Math.round(pr) + ' € par personne' : 'Prix par personne non renseigné') + '</b>' + (p.price.label ? ' <span class="muted">· tranche la plus citée : ' + esc(p.price.label) + '</span>' : '') + '</p>';
  html += hist(p);
  const li = listino(p);
  if (li) html += '<ul class="listino">' + li + '</ul><p class="src">' + (p.dishSource === 'photo' ? 'Prix lus sur la photo du menu du ' + esc(m.date) + ' (' + (m.ageMonths <= 1 ? 'moins d’un mois' : m.ageMonths + ' mois') + ').' + (m.infl ? ' Photo de plus de ' + (m.ageMonths > 13 ? 'un an' : '7 mois') + ' : prévoir environ +' + Math.round(m.infl * 100) + ' %.' : ' Récente : pas de hausse à prévoir.') : 'Prix de la carte publiée sur Google par l’établissement ou une plateforme de livraison : la salle peut être un peu moins chère.') + '</p>';
  html += '</div>';
  if (m) {
    html += '<div class="sec"><h3>Photos du menu</h3><div class="photos">' + m.photos.map((ph, i) => '<button data-lb="' + esc(ph.url) + '" data-cap="Menu photographié le ' + esc(ph.date || '?') + ' · ' + esc(p.name) + '"><img src="' + esc(ph.url) + '=w300" alt="Menu, photo du ' + esc(ph.date || '') + '" loading="lazy"><span>' + esc(ph.date || 'date inconnue') + '</span></button>').join('') + '</div>';
    html += '<details><summary>Transcription (' + m.items.length + ' lignes, boissons exclues)</summary><div class="tx">' + menuTable(m.items) + (m.photos.some(x => x.notes) ? '<p class="src">' + m.photos.map(x => esc(x.notes)).filter(Boolean).join('<br>') + '</p>' : '') + '<p class="src">Transcription automatique : en cas de doute, la photo fait foi.</p></div></details></div>';
  } else if (p.gmenu) {
    html += '<div class="sec"><h3>Carte publiée sur Google</h3><details open><summary>' + p.gmenu.length + ' plats</summary><div class="tx">' + menuTable(p.gmenu) + '</div></details><p class="src">Pas de photo de menu lisible récente : prix issus de la carte Google.</p></div>';
  }
  html += '<div class="sec"><h3>Horaires</h3>' + hoursHtml(p) + '</div>';
  const R = p.reviews || { pos: [], neg: [] };
  if (R.pos.length || R.neg.length) html += '<div class="sec revcol"><h3>Avis Google choisis</h3>' + (R.pos.length ? '<h4>Ce qui plaît</h4>' + R.pos.map(r => revHtml(r)).join('') : '') + (R.neg.length ? '<h4>Ce qui fâche</h4>' + R.neg.map(r => revHtml(r, true)).join('') : '<p class="src">Aucun avis négatif détaillé parmi les ' + p.nRev + ' avis lus.</p>') + '<p class="src">Sélection parmi ' + p.nRev + ' avis lus : les plus informatifs (prix, plats, portions), récents et rédigés en italien en priorité.</p></div>';
  if (p.tf) html += '<div class="sec"><h3>TheFork</h3><p>' + (p.tf.promo && p.tf.promo.length ? esc(p.tf.promo.join(' · ')) : 'Réservable sur TheFork, pas de remise affichée le 18/11.') + (p.tf.avg ? ' · prix moyen TheFork ' + p.tf.avg + ' €' : '') + '</p><p class="src">La remise dépend du jour, de l’heure et du nombre de personnes : vérifiez-la dans l’app avant de valider (TheFork Festival jusqu’au 29/11/2026, réduction sur la carte hors menus et boissons, uniquement en réservant via TheFork).</p></div>';
  $('#detail-body').innerHTML = html;
  $('#detail').hidden = false; $('#detail').scrollTop = 0;
  if (fromMap !== false) map.panTo([p.lat, p.lng], { animate: true });
  history.pushState({ d: id }, '', '#' + encodeURIComponent(id));
}
function closeDetail() { $('#detail').hidden = true; selected = null; render(); }

function activeFilterCount() { return (st.day !== 'auto') + st.useTime + (st.maxPrice < 60) + st.hideExpensive + st.meal.size + st.type.size + st.cuisine.size + st.flag.size + (st.minRating > 0) + st.zone.size; }
function resetAll() { st.q = ''; $('#q').value = ''; st.quick.clear(); document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false')); st.day = 'auto'; st.useTime = false; st.maxPrice = 60; st.hideExpensive = false; ['meal', 'type', 'cuisine', 'flag', 'zone'].forEach(k => st[k].clear()); st.minRating = 0; syncForm(); render(); }

// ---------- filters form
function buildOpts() {
  const cnt = (k, v) => P.filter(p => k === 'cuisine' ? p.cuisine.includes(v) : p[k] === v).length;
  $('#f-type').innerHTML = Object.entries(TYPES).filter(([k]) => cnt('type', k)).map(([k, v]) => '<label><input type="checkbox" value="' + k + '"><span>' + v + ' <small>' + cnt('type', k) + '</small></span></label>').join('');
  const cu = [...new Set(P.flatMap(p => p.cuisine))].sort((a, b) => cnt('cuisine', b) - cnt('cuisine', a));
  $('#f-cuisine').innerHTML = cu.map(c => '<label><input type="checkbox" value="' + esc(c) + '"><span>' + esc(c[0].toUpperCase() + c.slice(1)) + ' <small>' + cnt('cuisine', c) + '</small></span></label>').join('');
  const zs = [...new Map(P.map(p => [p.zone, p.zoneLabel]))].sort((a, b) => a[1].localeCompare(b[1]));
  $('#f-zone').innerHTML = zs.map(([z, l]) => '<label><input type="checkbox" value="' + z + '"><span>' + esc(l) + '</span></label>').join('');
}
function syncForm() {
  const f = $('#ff');
  f.querySelectorAll('input[name=day]').forEach(i => i.checked = i.value === st.day);
  f.useTime.checked = st.useTime; f.time.value = st.time; f.maxPrice.value = st.maxPrice; f.hideExpensive.checked = st.hideExpensive;
  f.querySelectorAll('input[name=minRating]').forEach(i => i.checked = +i.value === st.minRating);
  f.querySelectorAll('.opts').forEach(g => g.querySelectorAll('input').forEach(i => i.checked = st[g.dataset.name].has(i.value)));
  $('#o-price').textContent = st.maxPrice >= 60 ? 'sans limite' : '≤ ' + st.maxPrice + ' €';
  $('#f-count').textContent = P.filter(p => matches(p)).length;
}
function readForm() {
  const f = $('#ff');
  st.day = f.querySelector('input[name=day]:checked').value; st.useTime = f.useTime.checked; st.time = f.time.value || '13:00';
  st.maxPrice = +f.maxPrice.value; st.hideExpensive = f.hideExpensive.checked; st.minRating = +f.querySelector('input[name=minRating]:checked').value;
  f.querySelectorAll('.opts').forEach(g => { st[g.dataset.name] = new Set([...g.querySelectorAll('input:checked')].map(i => i.value)); });
  $('#o-price').textContent = st.maxPrice >= 60 ? 'sans limite' : '≤ ' + st.maxPrice + ' €';
  $('#f-count').textContent = P.filter(p => matches(p)).length;
}

// ---------- geolocation
function startGeo() {
  if (!('geolocation' in navigator)) { toast('La géolocalisation n’est pas disponible sur cet appareil.'); return; }
  navigator.geolocation.watchPosition(pos => {
    const first = !me; me = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
    if (!meMarker) { meMarker = L.marker([me.lat, me.lng], { icon: L.divIcon({ className: '', html: '<div class="me"></div>', iconSize: null }), zIndexOffset: 2000, interactive: false }).addTo(map); meCircle = L.circle([me.lat, me.lng], { radius: me.acc, color: '#6fb3ff', weight: 1, fillOpacity: .08, interactive: false }).addTo(map); }
    else { meMarker.setLatLng([me.lat, me.lng]); meCircle.setLatLng([me.lat, me.lng]).setRadius(me.acc); }
    if (first || follow) map.setView([me.lat, me.lng], first ? Math.max(map.getZoom(), 15) : map.getZoom());
    $('#btn-locate').classList.add('on');
    if (first) render();
  }, err => { $('#btn-locate').classList.remove('on'); toast(err.code === 1 ? 'Position refusée : autorisez la localisation pour ce site dans les réglages du navigateur, puis touchez à nouveau le bouton.' : 'Position introuvable pour l’instant (signal GPS faible). Réessayez dehors.'); }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
}

function toast(msg) { let t = document.getElementById('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 6000); }

// ---------- sheet drag
function sheetSet(s) { $('#sheet').dataset.state = s; const peek = getComputedStyle(document.documentElement).getPropertyValue('--sheet-peek'); $('#btn-locate').style.bottom = s === 'peek' ? '' : 'calc(55% + 14px)'; if (s === 'full') $('#btn-locate').style.bottom = ''; }
function initSheet() {
  const g = $('#grip'), order = ['peek', 'half', 'full']; let y0 = null;
  g.addEventListener('click', () => { const i = order.indexOf($('#sheet').dataset.state); sheetSet(order[(i + 1) % 3]); });
  g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.click(); } });
  g.addEventListener('pointerdown', e => { y0 = e.clientY; g.setPointerCapture(e.pointerId); });
  g.addEventListener('pointerup', e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; if (Math.abs(dy) < 25) return; const i = order.indexOf($('#sheet').dataset.state); sheetSet(order[Math.max(0, Math.min(2, i + (dy < 0 ? 1 : -1)))]); e.preventDefault(); });
}

// ---------- boot
async function boot() {
  const res = await fetch('data/places.json'); const data = await res.json();
  P = data.places; LODG = data.lodgings || [];
  for (const p of P) p._v = (p.rating - 4) * 3 + (p.price.avg != null ? (25 - p.price.avg) / 6 : 0) + (p.flags.local ? 0.6 : 0) + (p.flags.pepite ? 1 : 0) + (p.flags.copious ? 0.3 : 0);
  map = L.map('map', { zoomControl: false, attributionControl: true, preferCanvas: true }).setView([45.62, 9.2], 9);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OpenStreetMap', className: 'felt-tiles' }).addTo(map);
  cluster = L.markerClusterGroup({ maxClusterRadius: 46, disableClusteringAtZoom: 16, showCoverageOnHover: false, spiderfyOnMaxZoom: true, chunkedLoading: true,
    iconCreateFunction: c => { const ms = c.getAllChildMarkers(); const pr = ms.map(m => m._price).filter(v => v != null); const pep = ms.some(m => m._pep); return L.divIcon({ className: '', html: '<div class="clus' + (pep ? ' has-pep' : '') + '"><b>' + ms.length + '</b>' + (pr.length ? '<span>dès ' + Math.round(Math.min(...pr)) + '€</span>' : '') + '</div>', iconSize: null }); } }).addTo(map);
  for (const l of LODG) L.marker([l.lat, l.lng], { icon: L.divIcon({ className: '', html: '<div class="home" title="' + esc(l.name) + '"><svg viewBox="0 0 24 24"><path d="M12 3 2 11h3v9h6v-6h2v6h6v-9h3z"/></svg></div>', iconSize: null }), zIndexOffset: 1500 }).bindTooltip(l.name, { direction: 'top' }).addTo(map);
  for (const p of P) { const m = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: '', html: tagHtml(p, true), iconSize: null }), riseOnHover: true }); m._price = p.price.avg; m._pep = p.flags.pepite; m.on('click', () => openDetail(p.id, false)); markers.set(p.id, m); }
  buildOpts(); syncForm(); initSheet();
  let mt; map.on('moveend', () => { if (me || st.sort !== 'dist') return; clearTimeout(mt); mt = setTimeout(render, 250); });
  render();
  $('#list').addEventListener('click', e => { const li = e.target.closest('.item'); if (li) openDetail(li.dataset.id); });
  $('#back').onclick = () => history.back();
  window.addEventListener('popstate', () => { if (!$('#detail').hidden) closeDetail(); });
  $('#detail-body').addEventListener('click', e => { const b = e.target.closest('[data-lb]'); if (!b) return; $('#lb-fig').innerHTML = '<img src="' + esc(b.dataset.lb) + '=w1600" alt="' + esc(b.dataset.cap) + '">'; $('#lb-cap').textContent = b.dataset.cap; $('#lightbox').showModal(); });
  let qt; $('#q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value.trim().toLowerCase(); renderLimit = 120; render(); }, 150); });
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => { const k = c.dataset.quick; st.quick.has(k) ? st.quick.delete(k) : st.quick.add(k); c.setAttribute('aria-pressed', st.quick.has(k)); renderLimit = 120; render(); }));
  $('#btn-filters').onclick = () => { syncForm(); $('#filters').showModal(); };
  $('#ff').addEventListener('input', readForm);
  $('#ff').addEventListener('change', readForm);
  $('#filters').addEventListener('close', () => { readForm(); renderLimit = 120; render(); });
  $('#reset').onclick = () => { resetAll(); };
  $('#sort').onchange = e => { st.sort = e.target.value; render(); };
  $('#btn-locate').onclick = () => { if (!me) startGeo(); else { follow = true; map.setView([me.lat, me.lng], Math.max(map.getZoom(), 15)); setTimeout(() => follow = false, 400); } };
  map.on('dragstart', () => follow = false);
  if (navigator.permissions) navigator.permissions.query({ name: 'geolocation' }).then(s => { if (s.state === 'granted') startGeo(); }).catch(() => {});
  setInterval(() => { if (st.quick.has('now') || st.day === 'auto') render(); }, 60000);
  if (location.hash.length > 3) openDetail(decodeURIComponent(location.hash.slice(1)));
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
}
boot().catch(e => { document.body.insertAdjacentHTML('beforeend', '<p style="position:fixed;top:40%;left:16px;right:16px;z-index:9999;background:#151412;padding:16px;border:1px solid #e0533a">Impossible de charger les adresses : ' + esc(e.message) + '. Rechargez la page une fois connecté.</p>'); });
})();
