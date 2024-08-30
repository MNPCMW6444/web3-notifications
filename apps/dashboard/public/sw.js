let currentVersion = "default-version";
const defaultCacheName = `v${currentVersion}`;
const urlsToCache = ["/", "/index.html", "/styles/main.css", "/script/main.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(defaultCacheName).then((cache) => {
      return cache.addAll(urlsToCache);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});

self.addEventListener("message", (event) => {
  if (event.data.action === "setVersion") {
    currentVersion = event.data.version;
    console.log(`Version set to ${currentVersion}`);
  }
});

self.addEventListener("push", function (event) {
  const data = event.data.json();
  const options = {
    body: data.body,
    data: data, // This line ensures that data used in the notificationclick event is available
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
