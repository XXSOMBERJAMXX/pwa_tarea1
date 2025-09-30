'use client';

import { useState, useEffect } from 'react';
import { saveEntry } from '../lib/db';

interface NewEntryFormProps {
  onEntryAdded: () => void;
}

export default function NewEntryForm({ onEntryAdded }: NewEntryFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [photo, setPhoto] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<string>('');
  const [loadingQuote, setLoadingQuote] = useState(false);

  // 🔔 Pedimos permiso de notificación al cargar el componente
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const getLocation = async () => {
    return new Promise<GeolocationPosition>((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      } else {
        reject(new Error('Geolocalización no disponible'));
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    // 📳 Vibración antes de guardar
    if ("vibrate" in navigator) {
      navigator.vibrate(300);
    }

    setLoading(true);
    try {
      let location;
      try {
        const position = await getLocation();
        location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
      } catch (error) {
        console.log('No se pudo obtener la ubicación');
      }

      await saveEntry({
        title: title.trim(),
        content: content.trim(),
        date: new Date().toISOString(),
        photo: photo || undefined,
        quote: quote || undefined,
        location
      });

      // ✅ Notificación al crear
      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("📢 Blog creado", {
            body: `Tu blog "${title}" fue guardado con éxito.`,
            icon: "/icons/icon-192x192.png"
          });
        } else if (Notification.permission !== "denied") {
          Notification.requestPermission().then(permission => {
            if (permission === "granted") {
              new Notification("📢 Blog creado", {
                body: `Tu blog "${title}" fue guardado con éxito.`,
                icon: "/icons/icon-192x192.png"
              });
            }
          });
        }
      }

      setTitle('');
      setContent('');
      setPhoto('');
      setQuote('');
      onEntryAdded();
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('Error al guardar la entrada');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">Nuevo Blog</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Título
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 text-gray-700 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="Título del Blog"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Contenido
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-gray-700 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows={4}
            placeholder="Informe sobre el mundo de los videojuegos y la cultura pop..."
            required
          />
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => document.getElementById('photo-input')?.click()}
            className="flex-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {photo ? 'Cambiar Foto' : 'Agregar Foto'}
          </button>
          <input
            id="photo-input"
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
          />
        </div>

        {photo && (
          <div className="relative">
            <img src={photo} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
            <button
              type="button"
              onClick={() => setPhoto('')}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : 'Subir Blog'}
        </button>
      </form>
    </div>
  );
}
