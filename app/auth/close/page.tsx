'use client';

import { useEffect, useState } from 'react';

export default function ClosePage() {
  const [status, setStatus] = useState('Finalizando autenticación...');

  useEffect(() => {
    async function migrateAndClose() {
      try {
        // Intentar migrar sesiones anónimas si existen
        // El anonymous_id (device fingerprint) está en chrome.storage.local de la extensión
        // Por seguridad, esta migración se hará automáticamente en el servidor
        // cuando el usuario autenticado haga su primera llamada a /api/usage

        setStatus('Autenticación exitosa. Puedes cerrar esta pestaña.');

        // Esperar 1 segundo para que el usuario vea el mensaje
        setTimeout(() => {
          window.close();
        }, 1000);
      } catch (err) {
        console.error('[Close] Error:', err);
        setStatus('Autenticación exitosa. Puedes cerrar esta pestaña.');
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    }

    migrateAndClose();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <p className="text-white">{status}</p>
    </div>
  );
}
