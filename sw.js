const CACHE_NAME = "gsss-dhankoli-v2";
const SCHOOL_LOGO = "https://gsssdhankoli.github.io/Logo.png/logo.png";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// 1. ऐप या बैकग्राउंड से आने वाले अलर्ट को फोन के ऊपर (Top Status Bar) दिखाना
self.addEventListener("message", event => {
  if (event.data && event.data.type === "SHOW_NATIVE_NOTIFICATION") {
    const { title, body, tag } = event.data;
    const options = {
      body: body || "Gurukul Sr. Sec. School, Dhankoli से नया अपडेट आया है।",
      icon: SCHOOL_LOGO,
      badge: SCHOOL_LOGO,
      vibrate: [400, 150, 400, 150, 600],
      tag: tag || "gsss-alert-" + Date.now(),
      renotify: true,
      requireInteraction: true,
      data: { url: "./index.html" }
    };
    event.waitUntil(
      self.registration.showNotification(title || "GSSS Dhankoli Official Alert", options)
    );
  }
});

// 2. जब ऐप पूरी तरह बंद (Closed) हो, तब सर्वर (Push API) से नोटिफिकेशन रिसीव करना
self.addEventListener("push", event => {
  let payload = {
    title: "Gurukul Sr. Sec. School, Dhankoli",
    body: "स्कूल की तरफ से नया नोटिस या अपडेट जारी किया गया है।",
    url: "./index.html"
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload.title = parsed.title || (parsed.notification && parsed.notification.title) || payload.title;
      payload.body = parsed.body || parsed.alert || (parsed.notification && parsed.notification.body) || payload.body;
    } catch (e) {
      payload.body = event.data.text();
    }
  }

  const options = {
    body: payload.body,
    icon: SCHOOL_LOGO,
    badge: SCHOOL_LOGO,
    vibrate: [400, 150, 400, 150, 600],
    tag: "gsss-push-" + Date.now(),
    renotify: true,
    requireInteraction: true,
    data: { url: payload.url }
  };

  event.waitUntil(
    self.registration.showNotification(payload.title, options)
  );
});

// 3. नोटिफिकेशन पर टैप करते ही सीधा स्कूल ऐप खोलना
self.addEventListener("notificationclick", event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(windowClients => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if ("focus" in client) return client.focus();
      }
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url || "./index.html");
      }
    })
  );
});
