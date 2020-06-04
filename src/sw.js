self.addEventListener("install", async event => {
    // js, cssはビルドの度にファイル名が変わるので、swの更新時にキャッシュを全て削除する。
    caches.keys().then(function (names) {
        for (let name of names) {
            if (name.endsWith(".js") || name.endsWith(".css")) {
                caches.delete(name);
            }
        }
    });
    event.waitUntil(self.skipWaiting());
})

workbox.core.setCacheNameDetails({ prefix: "kotsuhi" });

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
