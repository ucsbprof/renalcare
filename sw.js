// ===== RenalCare Service Worker =====
const CACHE_NAME = 'renalcare-v1';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

// プッシュ通知受信
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(
    self.registration.showNotification(data.title || 'RenalCare', {
      body: data.body || '',
      icon: data.icon || '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.tag || 'renalcare',
      data: { url: data.url || '/' }
    })
  );
});

// 通知クリック
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(cs => {
    if (cs.length) { cs[0].focus(); return; }
    return clients.openWindow(e.notification.data.url || '/');
  }));
});

// スケジュール通知（メッセージ経由）
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay, tag } = e.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
        tag: tag || 'renalcare',
        requireInteraction: false
      });
    }, delay);
  }
});
