const CACHE_NAME = 'moonbucks-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/menu.json',
    '/images/icon-192x192.png',
    '/images/icon-512x512.webp',
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-512x512.png',
    '/icons/browserconfig.xml',
    '/icons/favicon.ico',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    '/icons/mstile-150x150.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});


//On activate update the cache with the new version and clean out old caches
self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheName.startsWith('moonbucks-cache-') && CACHE_NAME !== cacheName) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }

                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(
                    (response) => {
                        // Check if we received a valid response
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    }
                );
            })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
      fetch(event.request).catch(function() {
        return new Response(
          'There seems to be a problem with your connection.\n'+  
  'We look forward to telling you about dogs as soon as you are online'
        );
      })
    );
  });

  

// Cache, then network fallback
const cacheThenNetwork = (event) => {
    event.respondWith(
        caches.match(event.request).then(function(response){

            // Did we find a match for this request in our caches?
            if(response){
                // Yes, return it from the cache
                //console.log(`Returning ${event.request.url} from cache!`);
                return response;
            }

            // No, so return an outside fetch request for it (go to network)
            console.log(`Sorry, ${event.request.url} not found in cache`);
            return fetch(event.request).then(function(response) {
                if (response.status === 404) {
                    return caches.match('fouro4.html');
                } else {
                    return response;
                }
            });
        }).catch(function(error) {
            console.log('Error, ', error);
            // this just returns offline.html for any resources not found. This would need
            // changing to include files like replacement images
            return caches.match('offline.html');
        })
    );
};

// Intercept any network requests
self.addEventListener("fetch", function(event){
    
    //console.log("Service worker intercepting fetch event: ", event);
    
   cacheThenNetwork(event);
});


self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
