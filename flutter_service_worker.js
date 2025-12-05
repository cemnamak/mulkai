'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"flutter_bootstrap.js": "4b605ae3457468541e6e6d6e1ebf4bdb",
"version.json": "a96c8eeb965041884520b00481816f5d",
"index.html": "a760c5f481e8e76b7b5903db8c820429",
"/": "a760c5f481e8e76b7b5903db8c820429",
"main.dart.js": "e222308e64166534d62b8b0386779290",
"flutter.js": "83d881c1dbb6d6bcd6b42e274605b69c",
"favicon.png": "578a01f17de3beb6196ef8ec55bd731f",
"icons/Icon-192.png": "515e9de8356829ce2319ec3cb889815c",
"icons/Icon-maskable-192.png": "515e9de8356829ce2319ec3cb889815c",
"icons/Icon-maskable-512.png": "5ffd97472de94bdc02d42c75f7f8c3ab",
"icons/Icon-512.png": "5ffd97472de94bdc02d42c75f7f8c3ab",
"manifest.json": "8f734a836e123de1b9ab03a947cdf5d8",
"assets/AssetManifest.json": "ec83de4030aab2a6bb33fb03c399f496",
"assets/NOTICES": "af3a6945214d726dd9945984874fe863",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"assets/AssetManifest.bin.json": "4c3c8041be4165b18ef2610450002b09",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "33b7d9392238c04c131b6ce224e13711",
"assets/packages/wakelock_plus/assets/no_sleep.js": "7748a45cd593f33280669b29c2c8919a",
"assets/shaders/ink_sparkle.frag": "ecc85a2e95f5e9f53123dcaf8cb9b6ce",
"assets/AssetManifest.bin": "d4eca69c8eccccdfe6115c2d2c955a61",
"assets/fonts/MaterialIcons-Regular.otf": "bac8a9812f1da7592fdc97d5de834ec3",
"assets/assets/images/before_1.jpeg": "50079d27c80b53fb3cdfc801c5603688",
"assets/assets/images/mulkai_logo2.png": "6698db83c2051a36d58153ef9d3bde68",
"assets/assets/images/mulkai_logo1.png": "6624c0e5dcfc1a4dd489a35c3d215f40",
"assets/assets/images/before_1.png": "af56b217d068626e40c2580da1287874",
"assets/assets/images/before_3.png": "77c121ddbd48c51965690636c1649fec",
"assets/assets/images/before_2.png": "50fc940c5f0129c7ec5873723cc50fd6",
"assets/assets/images/after_2.jpeg": "c38e18c983a778ab91ff3ed705c10af1",
"assets/assets/images/before_4.png": "7ab08643dc1f8c959fdbbb3e6df3c2da",
"assets/assets/images/after_1.jpeg": "6ae44e904a8becbaa441fc893cbfdeac",
"assets/assets/images/mulkai_logo.png": "2c33fd481687bcf003fed30b51ed2fae",
"assets/assets/images/after_4.png": "cc408c74efe5351c136f77e4affb1253",
"assets/assets/images/after_3.png": "bb21af421c5afc14154a7568ff603c86",
"assets/assets/images/google_logo.png": "51791544f2482d53a28225ae7ef91dfe",
"assets/assets/images/after_2.png": "1dcb7a09223dc1b088a820b88ec559d4",
"assets/assets/images/after_1.png": "484220dafb0a2ea00aa5c76d4e36dab0",
"assets/assets/images/rotate.gif": "3ab0388ead0386de12f36f99505f1831",
"assets/assets/images/coin.png": "7f55dec01433901848ce3ecf81d5c655",
"assets/assets/images/before_2.jpeg": "32a028c1741f5235a82a31982d045288",
"canvaskit/skwasm.js": "ea559890a088fe28b4ddf70e17e60052",
"canvaskit/skwasm.js.symbols": "e72c79950c8a8483d826a7f0560573a1",
"canvaskit/canvaskit.js.symbols": "bdcd3835edf8586b6d6edfce8749fb77",
"canvaskit/skwasm.wasm": "39dd80367a4e71582d234948adc521c0",
"canvaskit/chromium/canvaskit.js.symbols": "b61b5f4673c9698029fa0a746a9ad581",
"canvaskit/chromium/canvaskit.js": "8191e843020c832c9cf8852a4b909d4c",
"canvaskit/chromium/canvaskit.wasm": "f504de372e31c8031018a9ec0a9ef5f0",
"canvaskit/canvaskit.js": "728b2d477d9b8c14593d4f9b82b484f3",
"canvaskit/canvaskit.wasm": "7a3f4ae7d65fc1de6a6e7ddd3224bc93"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"flutter_bootstrap.js",
"assets/AssetManifest.bin.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
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
        // Claim client to enable caching on first launch
        self.clients.claim();
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
      // Claim client to enable caching on first launch
      self.clients.claim();
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
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
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
