const V='atavola-v2';
const SHELL=['./','index.html','app.css','app.js','data/places.json','manifest.webmanifest','icon.svg','https://unpkg.com/leaflet@1.9.4/dist/leaflet.css','https://unpkg.com/leaflet@1.9.4/dist/leaflet.js','https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css','https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})))));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!=='atavola-media').map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener('fetch',e=>{const u=e.request.url; if(e.request.method!=='GET')return;
  const media=/tile\.openstreetmap|googleusercontent|fonts\.(googleapis|gstatic)|\/img\//.test(u);
  if(media){e.respondWith(caches.open('atavola-media').then(async c=>{const hit=await c.match(e.request); if(hit) return hit; try{const r=await fetch(e.request); if(r.ok||r.type==='opaque') c.put(e.request,r.clone()); return r;}catch(err){return hit||Response.error();}}));return;}
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const cl=r.clone();caches.open(V).then(c=>c.put(e.request,cl));}return r;}).catch(()=>caches.match(e.request).then(h=>h||caches.match('index.html'))));
});
