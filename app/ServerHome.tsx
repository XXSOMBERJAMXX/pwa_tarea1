import { headers } from 'next/headers';
import ClientHome from './ClientHome';

export default async function ServerHome() {
  // Esto se ejecuta en el servidor
  const headersList = headers();
  const userAgent = headersList.get('user-agent') || 'unknown';
  
  // Puedes obtener datos del servidor aquí
  const serverTime = new Date().toISOString();
  
  return (
    <div>
      <div className="bg-blue-100 p-4 text-sm text-gray-700">
        <strong>Renderizado del Servidor:</strong> Hora del servidor: {serverTime} | User Agent: {userAgent.substring(0, 50)}...
      </div>
      <ClientHome />
    </div>
  );
}