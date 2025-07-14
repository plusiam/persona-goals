const CACHE_NAME = 'persona-goals-v1';
const OFFLINE_URL = '/offline.html';

// 캐시할 정적 자원들
const STATIC_CACHE_URLS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon-placeholder.svg'
];

// 설치 이벤트
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// 활성화 이벤트
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// 네트워크 요청 처리
self.addEventListener('fetch', (event) => {
  // API 요청은 항상 네트워크로
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response(JSON.stringify({ error: '오프라인 상태입니다' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 503
        });
      })
    );
    return;
  }

  // HTML 요청 처리 (네트워크 우선, 실패시 캐시)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // 기타 리소스 (캐시 우선, 없으면 네트워크)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      
      return fetch(event.request).then((response) => {
        // 성공적인 응답만 캐시
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});

// 백그라운드 동기화
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-goals') {
    event.waitUntil(syncGoals());
  }
});

// 푸시 알림
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : '새로운 알림이 있습니다',
    icon: '/icon-placeholder.svg',
    badge: '/icon-placeholder.svg',
    vibrate: [200, 100, 200],
    tag: 'goal-reminder',
    requireInteraction: true,
    actions: [
      { action: 'complete', title: '완료' },
      { action: 'snooze', title: '나중에' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Persona Goals', options)
  );
});

// 알림 클릭 처리
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'complete') {
    // 목표 완료 처리
    clients.openWindow('/?action=complete-goal');
  } else if (event.action === 'snooze') {
    // 알림 미루기
    clients.openWindow('/?action=snooze');
  } else {
    // 앱 열기
    clients.openWindow('/');
  }
});

// 동기화 함수
async function syncGoals() {
  // IndexedDB에서 오프라인 변경사항 가져오기
  // API로 전송
  console.log('Syncing goals...');
}