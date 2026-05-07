// firebase-messaging-sw.js
// HomeBase service worker — receives push notifications when the app is closed
// This file MUST live at the root of your domain (e.g. /firebase-messaging-sw.js)

importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyA2lrJJ0T_y_CBk8kOqRmwejCqHx6RVPXA",
  authDomain: "homebase-56151.firebaseapp.com",
  projectId: "homebase-56151",
  storageBucket: "homebase-56151.firebasestorage.app",
  messagingSenderId: "647157335008",
  appId: "1:647157335008:web:a15452fabd943bf5a8a185"
});

const messaging = firebase.messaging();

// Listen for messages received while the app is in the background or closed.
// (Foreground messages are handled in index.html via onMessage.)
//
// CRITICAL FIX: When the cloud function sends a `notification` payload (title/body),
// Firebase's web SDK AUTO-DISPLAYS the notification before this handler even runs.
// If we ALSO call self.registration.showNotification(), the user gets duplicate
// notifications. So we only manually display when the payload is data-only.
messaging.onBackgroundMessage((payload) => {
  console.log('[HomeBase SW] Push received:', payload);

  // If FCM is already auto-displaying this notification, do nothing.
  // This prevents the "two identical pushes per event" bug.
  if (payload.notification) {
    return;
  }

  // Data-only payload — we control the display.
  const title = payload.data?.title || 'HomeBase';
  const body = payload.data?.body || '';
  const tag = payload.data?.tag || 'homebase-' + Date.now();
  const url = payload.data?.url || '/';

  const options = {
    body,
    tag,
    icon: '/favicon-192.png',
    badge: '/favicon-192.png',
    data: { url },
    requireInteraction: false,
    silent: false
  };

  self.registration.showNotification(title, options);
});

// When the user taps the notification, focus or open the app at the right URL.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If a HomeBase window is already open, focus it
      for (const client of clientList) {
        if (client.url.includes(self.location.host) && 'focus' in client) {
          client.postMessage({ type: 'NOTIFICATION_CLICK', url: targetUrl });
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Skip the "waiting" state on update so updates apply immediately
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});
