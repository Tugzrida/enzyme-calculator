let cacheName = "enzcalc-2020090400";
let filesToCache = [
    "/enzyme-calculator/",
    "index.html",
    "enzicon192.png",
    "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.slim.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/4.5.0/js/bootstrap.min.js"
];

// On install of a SW, cache all required resources
self.addEventListener("install", e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log("Installing cache", cacheName);
            return cache.addAll(filesToCache);
        })
    );
    self.skipWaiting();
});

// On activation of a SW, remove all old caches then claim clients
self.addEventListener("activate", e => {
    e.waitUntil(
        caches.keys().then(keyList => Promise.all(keyList.map(key => {
            if (key !== cacheName) {
                console.log("Removing cache", key);
                return caches.delete(key);
            }
        })))
    );
    self.clients.claim();
});

// Respond with cached files first, falling back to fetch
self.addEventListener("fetch", e => {
    e.respondWith(
        caches.open(cacheName).then(cache => cache.match(e.request).then(response => response || fetch(e.request)))
    );
});
