'use client';

import { useState, useEffect } from 'react';
import { requestNotificationPermission, scheduleDailyReminder } from '../lib/notifications';

export default function NotificationButton() {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const handleEnableNotifications = async () => {
    const granted = await requestNotificationPermission();
    if (granted) {
      setPermission('granted');
      scheduleDailyReminder();
      alert('¡Notificaciones activadas! Recibirás recordatorios diarios.');
    } else {
      alert('No se pudieron activar las notificaciones.');
    }
  };

  if (permission === 'granted') {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
        <span className="hidden sm:inline">Notificaciones activas</span>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnableNotifications}
      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
      <span className="hidden sm:inline">Activar Recordatorios</span>
    </button>
  );
}