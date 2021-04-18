'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "dc9d6b71a10b9ba9bfed51491a5618cb",
"index.html": "70f7659b447a0c5dca65c226f1028941",
"/": "70f7659b447a0c5dca65c226f1028941",
"main.dart.js": "7969192c7e45a711d23f5910c8033ef4",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"manifest.json": "64077cbb3a05d1d7073434ff307fd8ab",
"assets/ironman.png": "05e79f0f269794aaa84c04a140b68d67",
"assets/AssetManifest.json": "2efbb41d7877d10aac9d091f58ccd7b9",
"assets/NOTICES": "d142e5c8407a222d203e9d79508eb42e",
"assets/FontManifest.json": "bba6de124be1c7617d70d89641b3b25f",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/Merriweather-Regular.ttf": "f96a44b40f99ae4b63f275f1142f7c98",
"assets/fonts/HelveticaNeue/HelveticaNeue%20Thin.ttf": "78c28465643a20597ce65eee037a7675",
"assets/fonts/HelveticaNeue/HelveticaNeueIt.ttf": "33baa0a123d13fcda4e6cad9c93ed2ef",
"assets/fonts/HelveticaNeue/HelveticaNeueHv.ttf": "c1e969c8f421f5f755e1e68d21d93b78",
"assets/fonts/HelveticaNeue/HelveticaNeue%20Medium.ttf": "0a13c540938b1b7dd3996b02ea568e5f",
"assets/fonts/HelveticaNeue/helveticaneue.png": "b4a23804594d12278cc845414aaa5b82",
"assets/fonts/HelveticaNeue/HelveticaNeueMed.ttf": "9f25b1f8c62ddd2ad699a89aaaf11a59",
"assets/fonts/HelveticaNeue/www.freefontsdownload.net.url": "520ff1f46679547637578bbb6393bb2d",
"assets/fonts/HelveticaNeue/HelveticaNeueLt.ttf": "bb5671edae4b3cecbd3c98159511f2ea",
"assets/fonts/HelveticaNeue/HelveticaNeue%20Light.ttf": "0facaae97183b8fede52099930aefd8d",
"assets/fonts/HelveticaNeue/HelveticaNeue-Regular.ttf": "ccad04d46768981ff847f22e8a53b5b3",
"assets/fonts/HelveticaNeue/HelveticaNeue%20BlackCond.ttf": "4ff686ee78ff095848014f4283f67a41",
"assets/fonts/HelveticaNeue/freefontsdownload.txt": "5e4b49bf8e4349d2d9c15dbb43cdcc91",
"assets/fonts/HelveticaNeue/HelveticaNeue-Bold.ttf": "b8edca3e45f1f16bc6e20464bd8f2fff",
"assets/fonts/HelveticaNeue/Helvetica%20Neu%20Bold.ttf": "7f281199258d96e249a7fce4101006b9",
"assets/fonts/LibreFranklin-Regular.ttf": "30ee60852dd36a04ac070c7b94cd25be",
"assets/fonts/AbrilFatface-Regular.ttf": "8c6847c75ae35d0ca5fd3798d4567443",
"assets/fonts/Raleway-Regular.ttf": "580d0778ad254335be45bf58bb449f43",
"assets/fonts/GoogleSans-Regular.ttf": "51134713ade7b1f137e06ce395d39d40",
"assets/fonts/GalleryIcons.ttf": "7d45e7df60cb4a98b595018c74614367",
"assets/fonts/MaterialIcons-Regular.otf": "1288c9e28052e028aba623321f7826ac",
"assets/fonts/Arvo/Arvo-Regular.ttf": "f21cad8342165ba561eb977611423d07",
"assets/fonts/Arvo/Arvo-Bold.ttf": "993d70d20d1221ea3a717f0183a94641",
"assets/fonts/Arvo/Arvo-BoldItalic.ttf": "23b189b99dca22f2b023e789c06e019f",
"assets/fonts/Arvo/OFL.txt": "4bed12d067bd78f2b74701a0013bef71",
"assets/fonts/Arvo/Arvo-Italic.ttf": "e74f8e75ef58a494a507d888590bd847"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value + '?revision=' + RESOURCES[value], {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
