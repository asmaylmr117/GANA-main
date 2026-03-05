export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          console.log('[SW] Registered successfully. Scope:', reg.scope);

          // Check for updates every 30 minutes
          setInterval(() => reg.update(), 30 * 60 * 1000);

          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            newWorker?.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New content available — reload to update.');

                if (confirm('A new update is available! Reload now?')) {
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                  window.location.reload();
                }
              }
            });
          });
        })
        .catch((err) => console.error('[SW] Registration failed:', err));
    });

    window.addEventListener('online', () => {
      console.log('[App] Back online');
    });

    window.addEventListener('offline', () => {
      console.log('[App] Went offline');
    });
  }
};