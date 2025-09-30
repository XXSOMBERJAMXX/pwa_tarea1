'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import EntryCard from '@/components/EntryCard';
import NewEntryForm from '@/components/NewEntryForm';
import NotificationButton from '@/components/NotificationButton';
import { getEntries, DiaryEntry } from '../lib/db';

export default function ClientHome() {
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [battery, setBattery] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        // nivel inicial
        setBattery(Math.round(battery.level * 100));

        // escuchar cambios
        battery.addEventListener('levelchange', () => {
          setBattery(Math.round(battery.level * 100));
        });
      });
    }
  }, []);

  useEffect(() => {
    if (!showSplash) loadEntries();
  }, [showSplash]);

  const loadEntries = async () => {
    try {
      const data = await getEntries();
      setEntries(data);
    } catch (error) {
      console.error('Error loading entries:', error);
    } finally {
      setLoading(false);
    }
  };

  if (showSplash) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="mb-8 animate-bounce">
            <img src="/icons/icon-512x512.png" alt="logo" className="w-24 h-24 mx-auto" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Blog Gamer 🎮</h1>
          <p className="text-white text-lg opacity-90">
            Mundo videojuegos & cultura pop
          </p>
          <div className="mt-8">
            <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-gray-800 p-6 sticky top-0 h-screen shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <img src="/icons/icon-512x512.png" alt="logo" className="w-10 h-10" />
          <h1 className="text-xl font-bold text-white">Blog Gamer</h1>
        </div>
        <NotificationButton />
        <button
          onClick={() => setShowForm(true)}
          className="mt-6 w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
        >
          + Nuevo Blog
        </button>

        {/* 🔋 Mostrar batería */}
        {battery !== null && (
          <div className="mt-6 text-sm text-gray-300 flex items-center gap-2">
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7H8a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13v-2"
              />
            </svg>
            {battery}% Batería
          </div>
        )}
      </aside>

      {/* Main content */}
      <section className="flex-1 p-6">
        {/* Header solo en mobile */}
        <header className="md:hidden flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img src="/icons/icon-512x512.png" alt="logo" className="w-8 h-8" />
            <h1 className="text-lg font-bold text-white">Blog Gamer</h1>
          </div>
          <div className="flex gap-2">
            <NotificationButton />
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-3 py-1 rounded-lg"
            >
              Nuevo
            </button>
            {/* 🔋 Mostrar batería */}
            {battery !== null && (
              <div className="mt-6 text-sm text-gray-300 flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7H8a2 2 0 00-2 2v6a2 2 0 002 2h8a2 2 0 002-2V9a2 2 0 00-2-2z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 13v-2"
                  />
                </svg>
                {battery}% Batería
              </div>
            )}
          </div>
        </header>

        {/* Grid de posts */}
        <h2 className="text-2xl font-bold text-white mb-6">Posts</h2>
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-400">Cargando posts...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-12 bg-gray-800 rounded-lg shadow">
            <p className="text-gray-400 text-lg">No hay posts todavía</p>
            <p className="text-gray-500 mt-2">¡Crea tu primera publicación!</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {entries.map((entry) => (
              <EntryCard key={entry.id} entry={entry} onDelete={loadEntries} />
            ))}
          </div>
        )}
      </section>

      {/* Modal para crear post */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-xl w-full max-w-lg">
            <NewEntryForm onEntryAdded={() => { setShowForm(false); loadEntries(); }} />
            <button
              onClick={() => setShowForm(false)}
              className="mt-4 w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
