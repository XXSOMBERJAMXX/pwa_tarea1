'use client';

import { DiaryEntry, deleteEntry } from '../lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface EntryCardProps {
  entry: DiaryEntry;
  onDelete: () => void;
}

export default function EntryCard({ entry, onDelete }: EntryCardProps) {
  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta entrada?')) {
      await deleteEntry(entry.id);
      onDelete();
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {entry.photo && (
        <img 
          src={entry.photo} 
          alt={entry.title} 
          className="w-full h-48 object-cover"
        />
      )}
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-white mb-1">{entry.title}</h3>
            <p className="text-sm text-gray-400">
              Creado el: {format(new Date(entry.date), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}
            </p>
          </div>
          <button
            onClick={handleDelete}
            className="text-red-500 hover:text-red-700 p-2 flex"
            title="Eliminar entrada"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Eliminar
          </button>
        </div>

        <p className="text-white whitespace-pre-wrap mb-4">{entry.content}</p>

        

        {entry.location && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>
              Ubicación: 
                <span className="font-mono ml-1">
                  {entry.location.latitude.toFixed(4)}, {entry.location.longitude.toFixed(4)}
                </span> 
            </span>
          </div>
        )}
      </div>
    </div>
  );
}