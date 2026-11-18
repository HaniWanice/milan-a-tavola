(() => {
'use strict';
const TRIP = { thu: '2026-11-19', fri: '2026-11-20', sat: '2026-11-21', sun: '2026-11-22' };
const DAYS = { thu: 'Jeu 19', fri: 'Ven 20', sat: 'Sam 21', sun: 'Dim 22' };
const TYPES = { boulangerie: 'Boulangerie', cafe: 'Café-pâtisserie', sandwich: 'Sandwicherie', pouce: 'Sur le pouce', pizzeria: 'Pizzeria', trattoria: 'Trattoria, osteria', resto: 'Restaurant', grand: 'Grand restaurant' };
const SIZES = { comptoir: 'au comptoir, à emporter', petit: 'petite salle', moyen: 'salle moyenne', grand: 'grande salle' };
const ICONS = {"pizza":"<path d=\"m12 14-1 1\" /> <path d=\"m13.75 18.25-1.25 1.42\" /> <path d=\"M17.775 5.654a15.68 15.68 0 0 0-12.121 12.12\" /> <path d=\"M18.8 9.3a1 1 0 0 0 2.1 7.7\" /> <path d=\"M21.964 20.732a1 1 0 0 1-1.232 1.232l-18-5a1 1 0 0 1-.695-1.232A19.68 19.68 0 0 1 15.732 2.037a1 1 0 0 1 1.232.695z\" />","utensils":"<path d=\"M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2\" /> <path d=\"M7 2v20\" /> <path d=\"M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7\" />","flame":"<path d=\"M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z\" />","sandwich":"<path d=\"m2.37 11.223 8.372-6.777a2 2 0 0 1 2.516 0l8.371 6.777\" /> <path d=\"M21 15a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5.25\" /> <path d=\"M3 15a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h9\" /> <path d=\"m6.67 15 6.13 4.6a2 2 0 0 0 2.8-.4l3.15-4.2\" /> <rect width=\"20\" height=\"4\" x=\"2\" y=\"11\" rx=\"1\" />","croissant":"<path d=\"m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z\" /> <path d=\"m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83\" /> <path d=\"M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4\" /> <path d=\"m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2\" /> <path d=\"M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5\" />","gem":"<path d=\"M6 3h12l4 6-10 13L2 9Z\" /> <path d=\"M11 3 8 9l4 13 4-13-3-6\" /> <path d=\"M2 9h20\" />","chef-hat":"<path d=\"M17 21a1 1 0 0 0 1-1v-5.35c0-.457.316-.844.727-1.041a4 4 0 0 0-2.134-7.589 5 5 0 0 0-9.186 0 4 4 0 0 0-2.134 7.588c.411.198.727.585.727 1.041V20a1 1 0 0 0 1 1Z\" /> <path d=\"M6 17h12\" />","house":"<path d=\"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8\" /> <path d=\"M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\" />","footprints":"<path d=\"M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z\" /> <path d=\"M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z\" /> <path d=\"M16 17h4\" /> <path d=\"M4 13h4\" />","star":"<path d=\"M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z\" />","percent":"<line x1=\"19\" x2=\"5\" y1=\"5\" y2=\"19\" /> <circle cx=\"6.5\" cy=\"6.5\" r=\"2.5\" /> <circle cx=\"17.5\" cy=\"17.5\" r=\"2.5\" />","fish":"<path d=\"M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.47-3.44 6-7 6s-7.56-2.53-8.5-6Z\" /> <path d=\"M18 12v.5\" /> <path d=\"M16 17.93a9.77 9.77 0 0 1 0-11.86\" /> <path d=\"M7 10.67C7 8 5.58 5.97 2.73 5.5c-1 1.5-1 5 .23 6.5-1.24 1.5-1.24 5-.23 6.5C5.58 18.03 7 16 7 13.33\" /> <path d=\"M10.46 7.26C10.2 5.88 9.17 4.24 8 3h5.8a2 2 0 0 1 1.98 1.67l.23 1.4\" /> <path d=\"m16.01 17.93-.23 1.4A2 2 0 0 1 13.8 21H9.5a5.96 5.96 0 0 0 1.49-3.98\" />","utensils-crossed":"<path d=\"m16 2-2.3 2.3a3 3 0 0 0 0 4.2l1.8 1.8a3 3 0 0 0 4.2 0L22 8\" /> <path d=\"M15 15 3.3 3.3a4.2 4.2 0 0 0 0 6l7.3 7.3c.7.7 2 .7 2.8 0L15 15Zm0 0 7 7\" /> <path d=\"m2.1 21.8 6.4-6.3\" /> <path d=\"m19 5-7 7\" />","coffee":"<path d=\"M10 2v2\" /> <path d=\"M14 2v2\" /> <path d=\"M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1\" /> <path d=\"M6 2v2\" />","drumstick":"<path d=\"M15.4 15.63a7.875 6 135 1 1 6.23-6.23 4.5 3.43 135 0 0-6.23 6.23\" /> <path d=\"m8.29 12.71-2.6 2.6a2.5 2.5 0 1 0-1.65 4.65A2.5 2.5 0 1 0 8.7 18.3l2.59-2.59\" />","wheat":"<path d=\"M2 22 16 8\" /> <path d=\"M3.47 12.53 5 11l1.53 1.53a3.5 3.5 0 0 1 0 4.94L5 19l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\" /> <path d=\"M7.47 8.53 9 7l1.53 1.53a3.5 3.5 0 0 1 0 4.94L9 15l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\" /> <path d=\"M11.47 4.53 13 3l1.53 1.53a3.5 3.5 0 0 1 0 4.94L13 11l-1.53-1.53a3.5 3.5 0 0 1 0-4.94Z\" /> <path d=\"M20 2h2v2a4 4 0 0 1-4 4h-2V6a4 4 0 0 1 4-4Z\" /> <path d=\"M11.47 17.47 13 19l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L5 19l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\" /> <path d=\"M15.47 13.47 17 15l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L9 15l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\" /> <path d=\"M19.47 9.47 21 11l-1.53 1.53a3.5 3.5 0 0 1-4.94 0L13 11l1.53-1.53a3.5 3.5 0 0 1 4.94 0Z\" />","soup":"<path d=\"M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z\" /> <path d=\"M7 21h10\" /> <path d=\"M19.5 12 22 6\" /> <path d=\"M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62\" /> <path d=\"M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62\" /> <path d=\"M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62\" />","clock":"<circle cx=\"12\" cy=\"12\" r=\"10\" /> <polyline points=\"12 6 12 12 16 14\" />","cake-slice":"<circle cx=\"9\" cy=\"7\" r=\"2\" /> <path d=\"M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6\" /> <path d=\"M16 13H3\" /> <path d=\"M16 17H3\" />","map-pin":"<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /> <circle cx=\"12\" cy=\"10\" r=\"3\" />"};
const ico = (n, cls) => '<svg class="ic ' + (cls || '') + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[n] || '') + '</svg>';
const TYPE_ICON = { boulangerie: 'croissant', cafe: 'coffee', sandwich: 'sandwich', pouce: 'drumstick', pizzeria: 'pizza', trattoria: 'chef-hat', resto: 'utensils', grand: 'utensils-crossed' };
function iconFor(p) {
  if (p.type === 'pouce' && (/pizz|taglio|trancio|panzerott|focacc/i.test(p.name) || (p.dishes && p.dishes.taglio))) return 'pizza';
  if (p.type === 'cafe' && (p.cats || []).some(c => /Pasticceria/.test(c))) return 'cake-slice';
  if ((p.type === 'resto' || p.type === 'trattoria') && p.cuisine.includes('poisson')) return 'fish';
  return TYPE_ICON[p.type] || 'utensils';
}
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const eur = v => v == null ? '–' : (Math.round(v * 100) / 100).toFixed(v % 1 ? 2 : 0).replace('.', ',');
const fs1 = v => v.toFixed(1).replace('.', ',');
const sCls = s => s >= 8 ? 's-hi' : s >= 7 ? 's-good' : s >= 6 ? 's-mid' : 's-low';
const hav = (a, b, c, d) => { const R = 6371, r = x => x * Math.PI / 180; const x = Math.sin(r(c - a) / 2) ** 2 + Math.cos(r(a)) * Math.cos(r(c)) * Math.sin(r(d - b) / 2) ** 2; return 2 * R * Math.asin(Math.sqrt(x)); };
const fmtDist = km => km < 1 ? Math.round(km * 100) * 10 + ' m' : (km < 10 ? km.toFixed(1).replace('.', ',') : Math.round(km)) + ' km';
function badgeIcons(p) { return (p.flags.pepite ? ico('gem', 'b-pep') : '') + (p.flags.slay ? ico('flame', 'b-slay') : '') + (p.flags.local ? ico('house', 'b-loc') : '') + (p.flags.copious ? ico('soup', 'b-cop') : '') + (p.tf && p.tf.max ? ico('percent', 'b-tf') : ''); }

// ---------- display settings (saved on the phone)
const CFG_DEF = { size: 'L', info: 'score', labels: false, cluster: 'normal', thumbs: true };
let cfg = Object.assign({}, CFG_DEF, JSON.parse(localStorage.getItem('atavola-cfg') || '{}'));
const SIZE_PX = { S: 30, M: 38, L: 46, XL: 58 };
const CLUSTER = { fort: 1.5, normal: 1.05, faible: 0.6, aucun: 0 };

let P = [], LODG = [], map, cluster, refLayer, markers = new Map(), me = null, meMarker = null, meCircle = null, follow = false, selected = null;
const st = { q: '', quick: new Set(), day: 'auto', useTime: false, time: '13:00', maxPrice: 60, hideExpensive: false, meal: new Set(), type: new Set(), cuisine: new Set(), flag: new Set(), minRating: 0, minScore: 0, zone: new Set(), sort: 'dist' };

function todayKey() { const d = new Date(); const iso = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); return Object.keys(TRIP).find(k => TRIP[k] === iso) || null; }
function nowMin() { const d = new Date(); return d.getHours() * 60 + d.getMinutes(); }
function activeDay() { return st.day !== 'auto' ? st.day : (todayKey() || 'thu'); }
function activeTime() { if (st.quick.has('now')) return nowMin(); if (st.useTime) { const [h, m] = st.time.split(':').map(Number); return h * 60 + m; } return null; }
function openAt(p, day, min) { const h = p.hours[day]; if (!h) return false; return h.r.some(([s, e]) => min >= s && min < e); }
function openToday(p, day) { const h = p.hours[day]; return !!(h && h.r.length); }
const priceOf = p => p.price.avg;

function matches(p) {
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
    if (f === 'local' && !p.flags.local) return false; if (f === 'nonlocal' && p.flags.local) return false;
    if (f === 'pepite' && !p.flags.pepite) return false; if (f === 'copious' && !p.flags.copious) return false;
    if (f === 'slay' && !p.flags.slay) return false; if (f === 'standing' && !p.flags.standing) return false;
    if (f === 'menu' && !p.menu) return false; if (f === 'thefork' && !p.tf) return false; if (f === 'hp' && !p.flags.hp) return false;
  }
  if (st.quick.has('cheap') && !p.price.cheap) return false;
  if (st.quick.has('top') && p.score.total < 8) return false;
  if (p.rating < st.minRating) return false;
  if (p.score.total < st.minScore) return false;
  if (st.zone.size && !st.zone.has(p.zone)) return false;
  return true;
}
function refPoint() { if (me) return [me.lat, me.lng]; const c = map.getCenter(); return [c.lat, c.lng]; }
function sorted(list) {
  const [la, ln] = refPoint(); for (const p of list) p._d = hav(la, ln, p.lat, p.lng);
  const by = { dist: (a, b) => a._d - b._d, score: (a, b) => b.score.total - a.score.total || a._d - b._d, price: (a, b) => (priceOf(a) ?? 99) - (priceOf(b) ?? 99), rating: (a, b) => b.rating - a.rating || b.nReviews - a.nReviews };
  return list.sort(by[st.sort]);
}

// ---------- markers: shape = format (round = comptoir, square = on s'assoit), pips = size of the room, number = A tavola score
function tagHtml(p, open, sel) {
  const pr = priceOf(p), dots = { petit: 1, moyen: 2, grand: 3 }[p.size] || 0;
  let h = '<div class="mk ' + (p.size === 'comptoir' ? 'round' : 'square') + ' t-' + p.type + (open ? '' : ' closed') + (p.flags.pepite ? ' pep' : '') + (p.flags.slay ? ' slay' : '') + (sel ? ' sel' : '') + (cfg.info === 'icon' ? ' only' : '') + '" style="--s:' + SIZE_PX[cfg.size] + 'px">';
  h += '<span class="mi">' + ico(iconFor(p)) + (dots ? '<i class="pips">' + '<b></b>'.repeat(dots) + '</i>' : '') + '</span>';
  if (cfg.info !== 'icon') h += '<span class="ms ' + sCls(p.score.total) + '">' + fs1(p.score.total) + '</span>';
  if (cfg.info === 'full') h += '<span class="mp">' + (pr != null ? Math.round(pr) + '€' : '?') + '</span>';
  if (p.flags.pepite) h += '<span class="corner">' + ico('gem') + '</span>';
  return h + '</div>';
}
function statusFor(p) { const day = activeDay(); const t = activeTime() ?? (todayKey() === day ? nowMin() : null); if (t == null) return openToday(p, day); return openAt(p, day, t); }
function clusterIcon(c) {
  const ms = c.getAllChildMarkers(); const best = Math.max(...ms.map(m => m._score)); const pep = ms.some(m => m._pep);
  const cnt = {}; for (const m of ms) cnt[m._icon_] = (cnt[m._icon_] || 0) + 1; const top = Object.entries(cnt).sort((a, b) => b[1] - a[1]).slice(0, 3).map(x => x[0]);
  return L.divIcon({ className: '', html: '<div class="clus' + (pep ? ' has-pep' : '') + '" style="--s:' + SIZE_PX[cfg.size] + 'px"><div class="ci">' + top.map(k => { const [t, n] = k.split('|'); return '<i class="mini t-' + t + '">' + ico(n) + '</i>'; }).join('') + '</div><div class="cl"><b>' + ms.length + '</b><span class="ms ' + sCls(best) + '">' + fs1(best) + '</span></div>' + (pep ? '<span class="corner">' + ico('gem') + '</span>' : '') + '</div>', iconSize: null });
}
function makeCluster() {
  if (cluster) map.removeLayer(cluster);
  const k = CLUSTER[cfg.cluster] ?? 1.05; const rad = Math.max(1, Math.round(SIZE_PX[cfg.size] * 1.5 * k)); const dz = k ? 19 : 1;
  cluster = L.markerClusterGroup({ maxClusterRadius: rad, disableClusteringAtZoom: dz, showCoverageOnHover: false, spiderfyOnMaxZoom: true, chunkedLoading: true, iconCreateFunction: clusterIcon }).addTo(map);
  const hoverOK = matchMedia('(hover: hover)').matches; let peekT;
  if (hoverOK) { cluster.on('clustermouseover', e => { clearTimeout(peekT); peekT = setTimeout(() => peek(e), 250); }); cluster.on('clustermouseout', () => clearTimeout(peekT)); }
  cluster.on('clustercontextmenu', e => { if (e.originalEvent) e.originalEvent.preventDefault(); peek(e); });
  render._sig = null;
}
function peek(e) {
  const ps = e.layer.getAllChildMarkers().map(m => P.find(x => x.id === m._pid)).filter(Boolean).sort((a, b) => b.score.total - a.score.total);
  const rows = ps.slice(0, 8).map((p, i) => { const open = statusFor(p); return '<li data-id="' + esc(p.id) + '"><span class="tdisc ' + (p.size === 'comptoir' ? '' : 'sq ') + 't-' + p.type + (open ? '' : ' closed') + '">' + ico(iconFor(p)) + '</span><span class="pn">' + (i === 0 ? '<em>' + ico('star') + 'Le plus conseillé</em>' : '') + esc(p.name) + '<small>' + esc(TYPES[p.type]) + ' · ' + esc(SIZES[p.size]) + (open ? '' : ' · fermé') + '</small></span><span class="pb">' + badgeIcons(p) + '</span><span class="pr"><span class="ms ' + sCls(p.score.total) + '">' + fs1(p.score.total) + '</span><small>' + (p.price.avg != null ? '≈' + Math.round(p.price.avg) + ' €' : '?') + '</small></span></li>'; }).join('');
  const html = '<div class="peek-h">' + ps.length + ' adresses ici <small>classées par note A tavola</small></div><ol class="peek-l">' + rows + '</ol>' + (ps.length > 8 ? '<button class="peek-z">Voir les ' + ps.length + ' (zoomer)</button>' : '');
  const pop = L.popup({ className: 'peek', maxWidth: 340, minWidth: 290, autoPanPaddingTopLeft: [10, 130] }).setLatLng(e.layer.getLatLng()).setContent(html).openOn(map);
  const el = pop.getElement(); el.querySelectorAll('li[data-id]').forEach(li => li.addEventListener('click', () => { map.closePopup(); openDetail(li.dataset.id); }));
  const z = el.querySelector('.peek-z'); if (z) z.addEventListener('click', () => { map.closePopup(); e.layer.zoomToBounds({ padding: [40, 40] }); });
}

let renderLimit = 120;
function render(forceIcons) {
  const list = sorted(P.filter(p => matches(p)));
  const sig = list.map(p => p.id).join('|');
  for (const p of list) { const m = markers.get(p.id); const open = statusFor(p), sel = selected === p.id; if (forceIcons || m._open !== open || m._sel !== sel) { m._open = open; m._sel = sel; m.setIcon(L.divIcon({ className: '', html: tagHtml(p, open, sel), iconSize: null })); } }
  if (sig !== render._sig || forceIcons) { render._sig = sig; cluster.clearLayers(); cluster.addLayers(list.map(p => markers.get(p.id))); }
  const nAct = activeFilterCount(); $('#nf').hidden = !nAct; $('#nf').textContent = nAct;
  const day = activeDay(), t = activeTime();
  $('#count').innerHTML = list.length + ' adresses <small>' + (t != null ? 'ouvertes ' + DAYS[day].toLowerCase() + ' à ' + String(Math.floor(t / 60)).padStart(2, '0') + 'h' + String(t % 60).padStart(2, '0') : (st.day !== 'auto' ? 'ouvertes ' + DAYS[day].toLowerCase() : '')) + (me ? ' · depuis vous' : '') + '</small>';
  const ol = $('#list');
  if (!list.length) { ol.innerHTML = '<li class="empty"><b>Aucune adresse avec ces filtres.</b>Élargissez le budget, l’heure ou la zone.<br><button class="btn" id="clear2">Effacer les filtres</button></li>'; $('#clear2').onclick = resetAll; return; }
  ol.innerHTML = list.slice(0, renderLimit).map(itemHtml).join('') + (list.length > renderLimit ? '<li class="empty"><button class="btn" id="more">Afficher ' + Math.min(120, list.length - renderLimit) + ' de plus</button></li>' : '');
  const more = $('#more'); if (more) more.onclick = () => { renderLimit += 120; render(); };
}
function itemHtml(p) {
  const open = statusFor(p), pr = priceOf(p), d = p.dishes || {}, kp = [];
  if (d.margherita) kp.push('Margherita <b>' + eur(d.margherita.min) + '</b>'); else if (d.pizza) kp.push('Pizza dès <b>' + eur(d.pizza.min) + '</b>');
  if (d.pasta) kp.push('Pâtes dès <b>' + eur(d.pasta.min) + '</b>'); if (d.tiramisu) kp.push('Tiramisù <b>' + eur(d.tiramisu.min) + '</b>');
  if (!kp.length && d.panino) kp.push('Panino dès <b>' + eur(d.panino.min) + '</b>'); if (d.cornetto && kp.length < 3) kp.push('Cornetto <b>' + eur(d.cornetto.min) + '</b>');
  const b = [];
  if (p.flags.pepite) b.push('<span class="bdg pepite">' + ico('gem') + 'Pépite</span>'); if (p.flags.slay) b.push('<span class="bdg slay">' + ico('flame') + 'Slay</span>');
  if (p.flags.local) b.push('<span class="bdg">' + ico('house') + 'Local</span>'); if (p.flags.copious) b.push('<span class="bdg">' + ico('soup') + 'Copieux</span>');
  if (p.tf) b.push('<span class="bdg tf">' + ico('percent') + 'TheFork' + (p.tf.max ? ' −' + p.tf.max + '%' : '') + '</span>');
  const disc = '<span class="tdisc big2 ' + (p.size === 'comptoir' ? '' : 'sq ') + 't-' + p.type + (open ? '' : ' closed') + '" title="' + esc(TYPES[p.type]) + '">' + ico(iconFor(p)) + '</span>';
  const lead = cfg.thumbs && p.food && p.food.length ? '<span class="th"><img src="' + esc(p.food[0].url) + '=w180-h180-p-k-no" alt="' + esc(p.food[0].label || 'Plat') + ' chez ' + esc(p.name) + '" loading="lazy" onerror="this.remove()">' + disc + '</span>' : disc;
  return '<li class="item" data-id="' + esc(p.id) + '">' + lead +
    '<div class="ib"><h3><span class="nm">' + esc(p.name) + '</span></h3>' +
    '<div class="meta"><span>' + esc(TYPES[p.type]) + ' · ' + esc(SIZES[p.size]) + '</span>' + (p._d != null ? '<span class="num">' + fmtDist(p._d) + '</span>' : '') + (open ? '' : '<span class="cl">fermé</span>') + '</div>' +
    (kp.length ? '<div class="keyprices">' + kp.map(x => '<span>' + x + ' €</span>').join('') + '</div>' : '') + (b.length ? '<div class="badges">' + b.join('') + '</div>' : '') + '</div>' +
    '<div class="sc"><span class="ms big ' + sCls(p.score.total) + '">' + fs1(p.score.total) + '</span><small>/10</small><b>' + (pr != null ? '≈' + Math.round(pr) + ' €' : '–') + '</b></div></li>';
}

// ---------- detail
function listino(p) {
  const d = p.dishes || {}; const rows = [];
  const add = (k, label) => { if (d[k]) rows.push('<li><span class="n">' + label + (d[k].ex ? '<small>' + esc(d[k].ex) + (d[k].n > 1 && d[k].max !== d[k].min ? ' · jusqu’à ' + eur(d[k].max) + ' €' : '') + '</small>' : '') + '</span><span class="lead"></span><span class="p">' + eur(d[k].min) + ' €</span></li>'); };
  add('margherita', 'Pizza margherita'); if (!d.margherita) add('pizza', 'Pizza (la moins chère)'); add('pasta', 'Pâtes (le moins cher)'); add('risotto', 'Risotto'); add('cotoletta', 'Cotoletta'); add('tiramisu', 'Tiramisù');
  add('panino', 'Panino / piadina'); add('taglio', 'Part / focaccia / panzerotto'); add('cornetto', 'Cornetto / brioche');
  return rows.join('');
}
function hist(p) {
  const h = (p.price.hist || []).filter(x => x.n != null); if (!h.length) return '';
  const max = Math.max(...h.map(x => x.n)), tot = h.reduce((a, x) => a + x.n, 0);
  return '<div class="hist" aria-hidden="true">' + h.map(x => '<div class="' + (x.n === max ? 'top' : '') + '" style="height:' + Math.max(3, x.n / max * 100) + '%"></div>').join('') + '</div><div class="hist-l">' + h.map(x => '<span>' + esc(x.label) + '<br>' + Math.round(x.n / tot * 100) + ' %</span>').join('') + '</div><p class="src">Ce que ' + tot + ' clients Google déclarent avoir dépensé par personne (boissons comprises).</p>';
}
function menuTable(items) { let html = '<table>', sec = null; for (const it of items) { if (it.section && it.section !== sec) { sec = it.section; html += '<tr class="s"><td colspan="2">' + esc(sec) + '</td></tr>'; } html += '<tr><td>' + esc(it.name) + '</td><td>' + esc(it.price || '–') + '</td></tr>'; } return html + '</table>'; }
function revHtml(r, neg) { return '<div class="rev' + (neg ? ' neg' : '') + '"><div class="h"><span><span class="stars">' + r.rating + '/5</span> · ' + esc(r.author || '') + (r.it ? '' : ' · avis non italien') + '</span><span class="num">' + esc(r.date) + '</span></div><p>' + esc(r.text) + '</p></div>'; }
function hoursHtml(p) { const tk = todayKey(); return '<dl class="hours">' + Object.keys(TRIP).map(k => '<dt class="' + (k === tk ? 'today' : '') + '">' + DAYS[k] + '</dt><dd class="' + (k === tk ? 'today' : '') + '">' + esc(p.hours[k] ? (p.hours[k].txt === 'Chiuso' ? 'Fermé' : p.hours[k].txt) : 'non communiqué') + '</dd>').join('') + '</dl><p class="src">Horaires Google pour ces dates précises (jours fériés et fermetures compris), relevés le 18/11/2026.</p>'; }
const GROUP = { bf: 'cafés et boulangeries', snack: 'adresses sur le pouce', pizza: 'pizzerias', plats: 'restaurants' };
function scoreHtml(p) {
  const s = p.score, bar = (l, v, why) => '<div class="sb"><span>' + l + '</span><i><b style="width:' + v * 10 + '%"></b></i><strong>' + fs1(v) + '</strong><small>' + why + '</small></div>';
  return '<div class="sec score"><h3>Note A tavola</h3><div class="sc-big"><span class="ms huge ' + sCls(s.total) + '">' + fs1(s.total) + '</span><span>/10<br><small>rapport qualité, prix et quantité</small></span></div>' +
    bar('Qualité', s.quality, '★ ' + String(p.rating).replace('.', ',') + ' sur ' + p.nReviews + ' avis, pondéré par le nombre d’avis') +
    bar('Prix', s.value, (p.price.avg != null ? '≈' + Math.round(p.price.avg) + ' € par pers., comparé aux ' + GROUP[s.group] + ' (de ' + Math.round(s.ref.lo) + ' à ' + Math.round(s.ref.hi) + ' €)' : 'prix inconnu : note prudente')) +
    bar('Quantité', s.copious, p.sig.copious + ' avis parlent de portions généreuses, ' + (p.sig.small || 0) + ' de portions petites') +
    '<p class="src">Calcul : qualité ' + (s.group === 'bf' ? '50' : s.group === 'snack' ? '45' : '40') + ' %, prix ' + (s.group === 'bf' ? '42' : s.group === 'snack' ? '38' : '36') + ' %, quantité ' + (s.group === 'bf' ? '8' : s.group === 'snack' ? '17' : '24') + ' %, +0,35 si local, −0,2 par mention « piège à touristes ».</p></div>';
}
function openDetail(id, fromMap) {
  const p = P.find(x => x.id === id); if (!p) return;
  selected = id; render();
  const front = p.frontLocal ? p.frontLocal : (p.front ? p.front + '=w800' : (p.cover ? p.cover + '=w800' : null));
  const pr = priceOf(p), m = p.menu;
  let html = '';
  if (front) html += '<figure class="hero" style="margin:0"><img src="' + esc(front) + '" alt="Devanture de ' + esc(p.name) + '" loading="lazy" onerror="this.parentNode.remove()"><figcaption>' + (p.frontLocal ? 'Devanture (Street View)' : 'Photo Google') + '</figcaption></figure>';
  html += '<div class="d-head"><div class="d-row"><span class="tdisc big ' + (p.size === 'comptoir' ? '' : 'sq ') + 't-' + p.type + '">' + ico(iconFor(p)) + '</span><div><h2>' + esc(p.name) + '</h2><div class="d-sub">' + esc(TYPES[p.type]) + ' · ' + esc(SIZES[p.size]) + ' · ' + esc(p.cuisine.join(', ')) + '</div></div><span class="ms big ' + sCls(p.score.total) + '">' + fs1(p.score.total) + '</span></div><div class="d-sub">★ ' + String(p.rating).replace('.', ',') + ' sur Google (' + p.nReviews + ' avis) · ' + esc(p.address) + '</div></div>';
  if (p.food && p.food.length) { const fd = d => { if (!d) return ''; const [y, mo] = d.split('-'); return String(mo).padStart(2, '0') + '/' + y; }; html += '<div class="sec food"><h3>Les plats en photo</h3><div class="photos">' + p.food.map(f => '<button data-lb="' + esc(f.url) + '" data-cap="' + esc((f.label ? f.label + ' · ' : '') + p.name + (f.date ? ' · photo du ' + fd(f.date) : '')) + '"><img src="' + esc(f.url) + '=w320-h320-p-k-no" alt="' + esc(f.label || 'Plat') + '" loading="lazy" onerror="this.parentNode.remove()"><span>' + esc(f.label || 'Plats et boissons') + (f.date ? ' · ' + fd(f.date) : '') + '</span></button>').join('') + '</div><p class="src">Photos publiées par les clients sur Google Maps. Touchez pour agrandir.</p></div>'; }
  const fl = [];
  if (p.flags.pepite) fl.push('<span class="bdg pepite">' + ico('gem') + 'Pépite</span>'); if (p.flags.slay) fl.push('<span class="bdg slay">' + ico('flame') + 'Slay</span>');
  if (p.flags.local) fl.push('<span class="bdg">' + ico('house') + 'Local · ' + p.sig.itShare + ' % des avis en italien</span>'); else if (p.sig.itShare != null) fl.push('<span class="bdg">' + p.sig.itShare + ' % des avis en italien</span>');
  if (p.flags.copious) fl.push('<span class="bdg">' + ico('soup') + 'Copieux</span>'); if (p.flags.standing) fl.push('<span class="bdg">' + ico('footprints') + 'Sur le pouce</span>'); if (p.flags.expensive) fl.push('<span class="bdg">Cher</span>'); if (p.flags.hp) fl.push('<span class="bdg">Hors des sentiers</span>');
  html += '<div class="d-actions"><a class="btn primary" href="' + esc(p.gmaps) + '" target="_blank" rel="noopener">Google Maps</a><a class="btn" href="https://www.google.com/maps/dir/?api=1&destination=' + p.lat + ',' + p.lng + '" target="_blank" rel="noopener">Itinéraire</a>' + (p.tf ? '<a class="btn tf" href="' + esc(p.tf.url) + '" target="_blank" rel="noopener">TheFork' + (p.tf.max ? ' −' + p.tf.max + '%' : '') + '</a>' : '') + '</div>';
  if (fl.length) html += '<div class="sec"><div class="flags">' + fl.join('') + '</div>' + (p.hpNote ? '<p class="src">Trouvé par la recherche hors des sentiers (Slow Food, presse locale, forums), puis vérifié sur Google Maps.</p>' : '') + '</div>';
  html += scoreHtml(p);
  html += '<div class="sec"><h3>Prix</h3><p><b class="num" style="font-size:22px;font-stretch:75%">' + (pr != null ? '≈ ' + Math.round(pr) + ' € par personne' : 'Prix par personne non renseigné') + '</b>' + (p.price.label ? ' <span class="muted">· tranche la plus citée : ' + esc(p.price.label) + '</span>' : '') + '</p>' + hist(p);
  const li = listino(p);
  if (li) html += '<ul class="listino">' + li + '</ul><p class="src">' + (p.dishSource === 'photo' ? 'Prix lus sur la photo du menu du ' + esc(m.date) + ' (' + (m.ageMonths <= 1 ? 'moins d’un mois' : m.ageMonths + ' mois') + ').' + (m.infl ? ' Photo de plus de ' + (m.ageMonths > 13 ? 'un an' : '7 mois') + ' : prévoir environ +' + Math.round(m.infl * 100) + ' %.' : ' Récente : pas de hausse à prévoir.') : 'Prix de la carte publiée sur Google par l’établissement ou une plateforme de livraison : la salle peut être un peu moins chère.') + '</p>';
  html += '</div>';
  if (m) html += '<div class="sec"><h3>Photos du menu</h3><div class="photos">' + m.photos.map(ph => '<button data-lb="' + esc(ph.url) + '" data-cap="Menu photographié le ' + esc(ph.date || '?') + ' · ' + esc(p.name) + '"><img src="' + esc(ph.url) + '=w300" alt="Menu, photo du ' + esc(ph.date || '') + '" loading="lazy"><span>' + esc(ph.date || 'date inconnue') + '</span></button>').join('') + '</div><details><summary>Transcription (' + m.items.length + ' lignes, boissons exclues)</summary><div class="tx">' + menuTable(m.items) + (m.photos.some(x => x.notes) ? '<p class="src">' + m.photos.map(x => esc(x.notes)).filter(Boolean).join('<br>') + '</p>' : '') + '<p class="src">Transcription automatique : en cas de doute, la photo fait foi.</p></div></details></div>';
  else if (p.gmenu) html += '<div class="sec"><h3>Carte publiée sur Google</h3><details open><summary>' + p.gmenu.length + ' plats</summary><div class="tx">' + menuTable(p.gmenu) + '</div></details><p class="src">Pas de photo de menu lisible récente : prix issus de la carte Google.</p></div>';
  html += '<div class="sec"><h3>Horaires</h3>' + hoursHtml(p) + '</div>';
  const R = p.reviews || { pos: [], neg: [] };
  if (R.pos.length || R.neg.length) html += '<div class="sec revcol"><h3>Avis Google choisis</h3>' + (R.pos.length ? '<h4>Ce qui plaît</h4>' + R.pos.map(r => revHtml(r)).join('') : '') + (R.neg.length ? '<h4>Ce qui fâche</h4>' + R.neg.map(r => revHtml(r, true)).join('') : '<p class="src">Aucun avis négatif détaillé parmi les ' + p.nRev + ' avis lus.</p>') + '<p class="src">Sélection parmi ' + p.nRev + ' avis lus : les plus informatifs (prix, plats, portions), récents et rédigés en italien en priorité.</p></div>';
  if (p.tf) html += '<div class="sec"><h3>TheFork</h3><p>' + (p.tf.promo && p.tf.promo.length ? esc(p.tf.promo.join(' · ')) : 'Réservable sur TheFork, pas de remise affichée le 18/11.') + (p.tf.avg ? ' · prix moyen TheFork ' + p.tf.avg + ' €' : '') + '</p><p class="src">La remise dépend du jour, de l’heure et du nombre de personnes : vérifiez-la dans l’app avant de valider (TheFork Festival jusqu’au 29/11/2026, réduction sur la carte hors menus et boissons, uniquement en réservant via TheFork).</p></div>';
  $('#detail-body').innerHTML = html; $('#detail').hidden = false; $('#detail').scrollTop = 0;
  if (fromMap !== false) map.panTo([p.lat, p.lng], { animate: true });
  history.pushState({ d: id }, '', '#' + encodeURIComponent(id));
}
function closeDetail() { $('#detail').hidden = true; selected = null; render(); }
function activeFilterCount() { return (st.day !== 'auto') + st.useTime + (st.maxPrice < 60) + st.hideExpensive + st.meal.size + st.type.size + st.cuisine.size + st.flag.size + (st.minRating > 0) + (st.minScore > 0) + st.zone.size; }
function resetAll() { st.q = ''; $('#q').value = ''; st.quick.clear(); document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false')); st.day = 'auto'; st.useTime = false; st.maxPrice = 60; st.hideExpensive = false; ['meal', 'type', 'cuisine', 'flag', 'zone'].forEach(k => st[k].clear()); st.minRating = 0; st.minScore = 0; syncForm(); render(); }

// ---------- filters form
function buildOpts() {
  const cnt = (k, v) => P.filter(p => k === 'cuisine' ? p.cuisine.includes(v) : p[k] === v).length;
  $('#f-type').innerHTML = Object.entries(TYPES).filter(([k]) => cnt('type', k)).map(([k, v]) => '<label><input type="checkbox" value="' + k + '"><span><i class="tdisc ' + (['cafe', 'boulangerie', 'sandwich', 'pouce'].includes(k) ? '' : 'sq ') + 't-' + k + '">' + ico(TYPE_ICON[k]) + '</i>' + v + ' <small>' + cnt('type', k) + '</small></span></label>').join('');
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
  f.querySelectorAll('input[name=minScore]').forEach(i => i.checked = +i.value === st.minScore);
  f.querySelectorAll('.opts').forEach(g => g.querySelectorAll('input').forEach(i => i.checked = st[g.dataset.name].has(i.value)));
  $('#o-price').textContent = st.maxPrice >= 60 ? 'sans limite' : '≤ ' + st.maxPrice + ' €';
  $('#f-count').textContent = P.filter(p => matches(p)).length;
}
function readForm() {
  const f = $('#ff');
  st.day = f.querySelector('input[name=day]:checked').value; st.useTime = f.useTime.checked; st.time = f.time.value || '13:00';
  st.maxPrice = +f.maxPrice.value; st.hideExpensive = f.hideExpensive.checked; st.minRating = +f.querySelector('input[name=minRating]:checked').value; st.minScore = +f.querySelector('input[name=minScore]:checked').value;
  f.querySelectorAll('.opts').forEach(g => { st[g.dataset.name] = new Set([...g.querySelectorAll('input:checked')].map(i => i.value)); });
  $('#o-price').textContent = st.maxPrice >= 60 ? 'sans limite' : '≤ ' + st.maxPrice + ' €';
  $('#f-count').textContent = P.filter(p => matches(p)).length;
}

// ---------- display settings
function applyLabels() { if (cfg.labels && !map.hasLayer(refLayer)) refLayer.addTo(map); if (!cfg.labels && map.hasLayer(refLayer)) map.removeLayer(refLayer); }
function saveCfg() { localStorage.setItem('atavola-cfg', JSON.stringify(cfg)); }
function initSettings() {
  const f = $('#sf');
  const sync = () => { f.querySelectorAll('input').forEach(i => { if (i.type === 'radio') i.checked = String(cfg[i.name]) === i.value; else i.checked = !!cfg[i.name]; }); };
  $('#btn-settings').onclick = () => { sync(); $('#settings').showModal(); };
  f.addEventListener('change', () => {
    const prevCluster = cfg.cluster;
    f.querySelectorAll('input[type=radio]:checked').forEach(i => cfg[i.name] = i.value);
    cfg.labels = f.labels.checked; cfg.thumbs = f.thumbs.checked; saveCfg(); applyLabels();
    if (cfg.cluster !== prevCluster) makeCluster();
    render(true);
  });
  $('#s-reset').onclick = () => { cfg = Object.assign({}, CFG_DEF); saveCfg(); sync(); applyLabels(); makeCluster(); render(true); };
}

// ---------- geolocation
function toast(msg) { let t = document.getElementById('toast'); if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.setAttribute('role', 'status'); document.body.appendChild(t); } t.textContent = msg; t.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('on'), 6000); }
function startGeo() {
  if (!('geolocation' in navigator)) { toast('La géolocalisation n’est pas disponible sur cet appareil.'); return; }
  navigator.geolocation.watchPosition(pos => {
    const first = !me; me = { lat: pos.coords.latitude, lng: pos.coords.longitude, acc: pos.coords.accuracy };
    if (!meMarker) { meMarker = L.marker([me.lat, me.lng], { icon: L.divIcon({ className: '', html: '<div class="me"></div>', iconSize: null }), zIndexOffset: 2000, interactive: false }).addTo(map); meCircle = L.circle([me.lat, me.lng], { radius: me.acc, color: '#6fb3ff', weight: 1, fillOpacity: .08, interactive: false }).addTo(map); }
    else { meMarker.setLatLng([me.lat, me.lng]); meCircle.setLatLng([me.lat, me.lng]).setRadius(me.acc); }
    if (first || follow) map.setView([me.lat, me.lng], first ? Math.max(map.getZoom(), 15) : map.getZoom());
    $('#btn-locate').classList.add('on'); if (first) render();
  }, err => { $('#btn-locate').classList.remove('on'); toast(err.code === 1 ? 'Position refusée : autorisez la localisation pour ce site dans les réglages du navigateur, puis touchez à nouveau le bouton.' : 'Position introuvable pour l’instant (signal GPS faible). Réessayez dehors.'); }, { enableHighAccuracy: true, maximumAge: 10000, timeout: 20000 });
}
function sheetSet(s) { $('#sheet').dataset.state = s; $('#btn-locate').style.bottom = s === 'half' ? 'calc(55% + 14px)' : ''; }
function initSheet() {
  const g = $('#grip'), order = ['peek', 'half', 'full']; let y0 = null;
  g.addEventListener('click', () => { const i = order.indexOf($('#sheet').dataset.state); sheetSet(order[(i + 1) % 3]); });
  g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); g.click(); } });
  g.addEventListener('pointerdown', e => { y0 = e.clientY; g.setPointerCapture(e.pointerId); });
  g.addEventListener('pointerup', e => { if (y0 == null) return; const dy = e.clientY - y0; y0 = null; if (Math.abs(dy) < 25) return; const i = order.indexOf($('#sheet').dataset.state); sheetSet(order[Math.max(0, Math.min(2, i + (dy < 0 ? 1 : -1)))]); e.preventDefault(); });
}

async function boot() {
  const data = await (await fetch('data/places.json')).json();
  P = data.places; LODG = data.lodgings || [];
  map = L.map('map', { zoomControl: false, attributionControl: true, tapHold: true }).setView([45.62, 9.2], 9);
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', { maxZoom: 16, maxNativeZoom: 16, attribution: '© Esri, HERE, OpenStreetMap', className: 'map-tiles' }).addTo(map);
  refLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19, maxNativeZoom: 16, pane: 'shadowPane' });
  map.setMaxZoom(19); applyLabels();
  for (const l of LODG) L.marker([l.lat, l.lng], { icon: L.divIcon({ className: '', html: '<div class="home" title="' + esc(l.name) + '">' + ico('house') + '</div>', iconSize: null }), zIndexOffset: 1500 }).bindTooltip(l.name, { direction: 'top' }).addTo(map);
  const hoverOK = matchMedia('(hover: hover)').matches;
  for (const p of P) { const m = L.marker([p.lat, p.lng], { icon: L.divIcon({ className: '', html: '', iconSize: null }), riseOnHover: true }); m._score = p.score.total; m._pep = p.flags.pepite; m._pid = p.id; m._icon_ = p.type + '|' + iconFor(p); m.on('click', () => openDetail(p.id, false)); if (hoverOK) m.bindTooltip('<b>' + esc(p.name) + '</b><br>' + esc(TYPES[p.type]) + ' · ' + esc(SIZES[p.size]) + '<br>Note A tavola ' + fs1(p.score.total) + ' · ' + (p.price.avg != null ? '≈' + Math.round(p.price.avg) + ' € / pers.' : 'prix ?'), { direction: 'top', offset: [0, -18], className: 'tip' }); markers.set(p.id, m); }
  makeCluster(); buildOpts(); syncForm(); initSheet(); initSettings();
  let mt; map.on('moveend', () => { if (me || st.sort !== 'dist') return; clearTimeout(mt); mt = setTimeout(render, 250); });
  render(true);
  $('#list').addEventListener('click', e => { const li = e.target.closest('.item'); if (li) openDetail(li.dataset.id); });
  $('#back').onclick = () => history.back();
  window.addEventListener('popstate', () => { if (!$('#detail').hidden) closeDetail(); });
  $('#detail-body').addEventListener('click', e => { const b = e.target.closest('[data-lb]'); if (!b) return; $('#lb-fig').innerHTML = '<img src="' + esc(b.dataset.lb) + '=w1600" alt="' + esc(b.dataset.cap) + '">'; $('#lb-cap').textContent = b.dataset.cap; $('#lightbox').showModal(); });
  let qt; $('#q').addEventListener('input', e => { clearTimeout(qt); qt = setTimeout(() => { st.q = e.target.value.trim().toLowerCase(); renderLimit = 120; render(); }, 150); });
  document.querySelectorAll('.chip').forEach(c => c.addEventListener('click', () => { const k = c.dataset.quick; st.quick.has(k) ? st.quick.delete(k) : st.quick.add(k); c.setAttribute('aria-pressed', st.quick.has(k)); renderLimit = 120; render(); }));
  $('#btn-filters').onclick = () => { syncForm(); $('#filters').showModal(); };
  $('#ff').addEventListener('input', readForm); $('#ff').addEventListener('change', readForm);
  $('#filters').addEventListener('close', () => { readForm(); renderLimit = 120; render(); });
  $('#reset').onclick = () => resetAll();
  $('#sort').onchange = e => { st.sort = e.target.value; render(); };
  $('#btn-locate').onclick = () => { if (!me) startGeo(); else { follow = true; map.setView([me.lat, me.lng], Math.max(map.getZoom(), 15)); setTimeout(() => follow = false, 400); } };
  map.on('dragstart', () => follow = false);
  if (navigator.permissions) navigator.permissions.query({ name: 'geolocation' }).then(s => { if (s.state === 'granted') startGeo(); }).catch(() => {});
  setInterval(() => { if (st.quick.has('now') || st.day === 'auto') render(); }, 60000);
  if (location.hash.length > 3) openDetail(decodeURIComponent(location.hash.slice(1)));
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js');
}
boot().catch(e => { document.body.insertAdjacentHTML('beforeend', '<p style="position:fixed;top:40%;left:16px;right:16px;z-index:9999;background:#fbf9f5;padding:16px;border:1px solid #e0533a">Impossible de charger les adresses : ' + esc(e.message) + '. Rechargez la page une fois connecté.</p>'); });
})();
