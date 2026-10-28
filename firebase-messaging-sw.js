importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyCv-8rsbHovO8cL9ee63eeRGdzstybYIzk",
  authDomain: "gsss-dhankoli-erp.firebaseapp.com",
  databaseURL: "https://gsss-dhankoli-erp-default-rtdb.firebaseio.com",
  projectId: "gsss-dhankoli-erp",
  storageBucket: "gsss-dhankoli-erp.firebasestorage.app",
  messagingSenderId: "127071799763",
  appId: "1:127071799763:web:85be0cdef91459a7004726",
  measurementId: "G-R65S8372X2"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  const notifTitle = (payload.notification && payload.notification.title) || "Gurukul Official Alert";
  const notifOptions = {
    body: (payload.notification && payload.notification.body) || "New update from Gurukul Sr. Sec. School, Dhankoli",
    icon: "https://gsssdhankoli.github.io/Logo.png/logo.png",
    badge: "https://gsssdhankoli.github.io/Logo.png/logo.png",
    vibrate: [350, 120, 350, 120, 500]
  };
  self.registration.showNotification(notifTitle, notifOptions);
});
