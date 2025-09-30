import { redirect } from 'next/navigation';

export default async function SplashPage() {
  // Simular carga inicial (SSR)
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Redirigir automáticamente al home después de renderizar
  redirect('/');
}

export const dynamic = 'force-dynamic';