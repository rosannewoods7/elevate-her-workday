self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', function (event) {
  let title = 'Elevate HER Workday';
  let message = 'You have a new reminder.';
  let url = '/today';

  if (event.data) {
    try {
      const data = JSON.parse(event.data.text());
      title = data.title || title;
      message = data.message || message;
      url = data.url || url;
    } catch (err) {
      console.error('Error parsing push data', err);
      // Fallback to text if not JSON
      message = event.data.text() || message;
    }
  }

  event.waitUntil(
    self.registration.showNotification(title, {
      body: message,
      data: { url: url }
    })
  );
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(event.notification.data?.url || '/today') && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(event.notification.data?.url || '/today');
      }
    })
  );
});
