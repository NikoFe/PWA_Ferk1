const CACHE_NAME = 'smart-eat-v1';
const assets = [
  '/',
  '/index.html',
  'App.css',
  "/styles.css",
  '/manifest.json',
  '/favicon.ico',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/0.chunk.js',
];
 
self.addEventListener('install', event => {
  try{
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Caching all: app shell and content');
      return cache.addAll(assets);
    })
  );
  } 
  catch(error){

    console.log("SW INSTALL ERROR: ",error)
  }
});

self.addEventListener('fetch', event => {
  try{
  event.respondWith(
    caches.match(event.request).then(response => {
      // Return cached version if available, or fetch from network
      return response || fetch(event.request);
    })
  );
}catch(error){

   console.log("SW FETCH ERROR: ",error)
}
});

self.addEventListener('activate', event => {
  try{
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
}catch(error){

  console.log("SW ACTIVATE ERROR: ",error)
}
});
