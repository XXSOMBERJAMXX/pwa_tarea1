
# 🎮 Blog Gamer - PWA  

Una **Progressive Web App moderna** para entusiastas de videojuegos y cultura pop, desarrollada con **Next.js, React y TypeScript**.  
Permite crear, gestionar y visualizar posts con funcionalidades avanzadas como **captura de fotos, geolocalización y trabajo offline**.  

---

## ✨ Características Principales  

- 📱 **PWA Completa**: Instalable y funcionamiento offline  
- 🎯 **Temática Gamer**: Interfaz oscura optimizada para gamers  
- 📸 **Captura Multimedia**: Fotos con cámara del dispositivo  
- 📍 **Geolocalización**: Posts con ubicación automática  
- 🔔 **Notificaciones**: Recordatorios y notificaciones push  
- 💾 **Almacenamiento Local**: Funcionalidad offline completa  
- ⚡ **Rendimiento Híbrido**: SSR + CSR para máxima velocidad  
- 📱 **Responsive Design**: Adaptable a todos los dispositivos  

---

## 🛠 Stack Tecnológico  

### Dependencias Principales  
```json
{
  "next": "14.2.0",
  "react": "18.3.0",
  "typescript": "5",
  "next-pwa": "5.6.0",
  "localforage": "1.10.0",
  "tailwindcss": "3.4.17",
  "date-fns": "3.6.0"
}
```

### Dependencias de Desarrollo  
```json
{
  "@types/node": "20",
  "@types/react": "18",
  "eslint": "8",
  "postcss": "8.5.6",
  "autoprefixer": "10.4.21"
}
```

---

## 🏗 Arquitectura del Proyecto  

### Estructura de Carpetas  
```text
blog-gamer-pwa/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ClientHome.tsx
│   ├── NewEntryForm.tsx
│   ├── EntryCard.tsx
│   └── NotificationButton.tsx
├── lib/
│   ├── db.ts
│   └── notifications.ts
├── public/
│   ├── icons/
│   ├── manifest.json
│   └── sw.js
└── next.config.js
```

### Flujo de Renderizado Híbrido  

- **SSR (Server-Side Rendering)**  
  - `ServerHome.tsx` renderizado en servidor  
  - Proporciona SEO y contenido inicial rápido  
  - Accede a headers y datos de servidor  

- **CSR (Client-Side Rendering)**  
  - `ClientHome.tsx` hidratado en cliente  
  - Manejo de interactividad y APIs del navegador  
  - Estado local y almacenamiento  

---

## ⚙️ Configuración Técnica  

### Next.config.js - PWA Avanzada  
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\.json$/],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/api\.quotable\.io\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'quotes-cache',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 24 * 60 * 60
        },
        networkTimeoutSeconds: 10
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 4,
          maxAgeSeconds: 365 * 24 * 60 * 60
        }
      }
    }
  ]
});
```

### Base de Datos Local - IndexedDB  
```typescript
const diaryStore = localforage.createInstance({
  name: 'MiDiario',
  storeName: 'entries'
});
```

Operaciones disponibles:  
- `saveEntry()` → Guardar post  
- `getEntries()` → Obtener posts  
- `deleteEntry()` → Eliminar post  
- `getEntry()` → Obtener post específico  

---

## 🚀 Instalación y Configuración  

### Prerrequisitos  
- Node.js 18+  
- npm o yarn  
- Navegador moderno con soporte PWA  

### Pasos de Instalación  
```bash
git clone <repository-url>
cd tarea1pwa
npm install
```

Ejecutar en desarrollo:  
```bash
npm run dev
```

Construir para producción:  
```bash
npm run build
npm start
```

---

## 📱 Funcionalidades Offline  

### Service Worker Configuration  
- **Precaching**: Recursos críticos cacheados  
- **Runtime Caching**: Estrategias inteligentes  
- **Background Sync**: Preparado para reconexión  

### Estrategias de Caché  
- **NetworkFirst** para APIs  
- **CacheFirst** para recursos estáticos  
- **StaleWhileRevalidate** para contenido dinámico  

---

## 🧪 Testing de Funcionalidad Offline  

### Simulación de Desconexión  
- Abrir DevTools → Application → Service Workers → "Offline"  
- Verificar que:  
  - ✅ La app carga completamente  
  - ✅ Posts existentes visibles  
  - ✅ Creación de nuevos posts offline  
  - ✅ Fotos y navegación funcionan  

### Recuperación de Conexión  
- Volver a "Online" en DevTools  
- Posts creados offline deben persistir  
- Notificaciones pendientes se activan  

---

## 🔧 Scripts Disponibles  
```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## 🌐 APIs del Navegador Utilizadas  

- **Notification API**: Notificaciones push  
- **Geolocation API**: Coordenadas GPS  
- **MediaDevices API**: Cámara y fotos  
- **Battery Status API**: Estado de batería  
- **Vibration API**: Feedback háptico  
- **Service Worker API**: Offline + caching  
- **IndexedDB API**: Almacenamiento persistente  

## 🐛 Solución de Problemas Comunes

### Service Worker No Se Registra
- **Verificar que next.config.js tenga disable**: false en producción

- Revisar consola del navegador para errores

- Forzar recarga (Ctrl+Shift+R) para bypass cache

### Funcionalidad Offline No Funciona
- Ejecutar npm run build antes de probar offline

- Verificar que todos los recursos estén precacheados

- Revisar Network tab en DevTools para requests fallidos

### Fotos No Se Guardan Offline
- Verificar permisos de cámara

- Confirmar que IndexedDB tenga espacio disponible

- Revisar conversión Base64 en FileReader

### Notificaciones No Llegan
- Verificar permisos del navegador

- Confirmar que la app esté en primer plano para notificaciones

- Revisar configuración del sistema operativo