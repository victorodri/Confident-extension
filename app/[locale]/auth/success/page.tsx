'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthSuccessPage() {
  const router = useRouter();
  const [sessionsAdded, setSessionsAdded] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    async function loadUserStats() {
      try {
        // PRIMERO: Garantizar que el perfil existe
        console.log('[AuthSuccess] Creando/verificando perfil...');
        const profileResponse = await fetch('/api/profile');

        if (!profileResponse.ok) {
          console.error('[AuthSuccess] Error obteniendo perfil:', profileResponse.status);
          setLoading(false);
          return;
        }

        const profileData = await profileResponse.json();
        console.log('[AuthSuccess] Perfil obtenido:', profileData);

        // SEGUNDO: Obtener stats de uso
        const usageResponse = await fetch('/api/usage');
        if (usageResponse.ok) {
          const usageData = await usageResponse.json();
          console.log('[AuthSuccess] Usage data:', usageData);

          setRemaining(usageData.remaining || 0);
          // Inferir cuántas sesiones se añadieron (15 es el límite Free)
          const added = usageData.user_type === 'free' ? 10 : 0;
          setSessionsAdded(added);
        }
      } catch (err) {
        console.error('[AuthSuccess] Error loading stats:', err);
      } finally {
        setLoading(false);
      }
    }

    loadUserStats();
  }, []);

  useEffect(() => {
    // Countdown para cerrar automáticamente
    if (countdown === 0) {
      window.close();
      // Si window.close() no funciona (popup bloqueado), redirigir al dashboard
      setTimeout(() => router.push('/dashboard'), 100);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Ícono de éxito */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            ¡Cuenta creada con éxito!
          </h1>

          {/* Mensaje principal */}
          {loading ? (
            <p className="text-gray-600 mb-6">Cargando...</p>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Se han añadido <span className="font-bold text-violet-600">{sessionsAdded} sesiones</span> a tu plan.
              </p>

              {/* Stats */}
              <div className="bg-violet-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-gray-600 mb-1">Sesiones disponibles</p>
                <p className="text-3xl font-bold text-violet-600">{remaining}</p>
                <p className="text-xs text-gray-500 mt-1">Plan Gratuito</p>
              </div>
            </>
          )}

          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={() => window.close()}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Cerrar esta pestaña
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-6 rounded-lg border border-gray-300 transition-colors"
            >
              Ver Dashboard
            </button>
          </div>

          {/* Auto-close countdown */}
          <p className="text-xs text-gray-500 mt-4">
            Esta pestaña se cerrará automáticamente en {countdown} segundo{countdown !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Instrucciones */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Vuelve a Google Meet y activa Confident para empezar 🎯
          </p>
        </div>
      </div>
    </div>
  );
}
