export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('Este navegador no soporta notificaciones');
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
}

export function sendNotification(title: string, body: string, icon?: string) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body,
      icon: icon || '/icons/icon-192x192.png',
      badge: '/icons/icon-192x192.png',
      tag: 'diary-reminder'
    });

    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  }
}

export function scheduleDailyReminder() {
  if ('serviceWorker' in navigator && 'Notification' in window) {
    setTimeout(() => {
      sendNotification(
        '📝 Hora de escribir un blog',
        '¿Qué tal si escribes un nuevo blog para hoy?'
      );
    }, 5000);
  }
}