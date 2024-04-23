let currentVersion = "default-version";

self.addEventListener("message", (event) => {
  if (event.data.action === "setVersion") {
    currentVersion = event.data.version;

    const CACHE_NAME = `v${currentVersion}`;
    const urlsToCache = [
      "/",
      "/index.html",
      "/styles/main.css",
      "/script/main.js",
    ];

    self.addEventListener("install", (event) => {
      event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
          console.log("Opened cache");
          return cache.addAll(urlsToCache);
        }),
      );
    });

    self.addEventListener("fetch", (event) => {
      event.respondWith(
        caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(event.request);
        }),
      );
    });
  }
});

self.addEventListener("push", function (event) {
  const data = event.data.json();

  const options = {
    body: data.body,
  };

  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  const notificationData = event.notification.data;

  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then((windowClients) => {
      const chatUrl = `${notificationData.domain}/notification?data=${encodeURIComponent(JSON.stringify(notificationData))}`;

      for (var i = 0; i < windowClients?.length; i++) {
        var client = windowClients[i];
        if (client.url.startsWith(chatUrl) && "focus" in client) {
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(chatUrl);
      }
    }),
  );
});
