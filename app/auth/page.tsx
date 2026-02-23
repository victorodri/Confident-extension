'use client';

import { createClient } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');
  const urlError = searchParams.get('error');

  const supabase = createClient();

  useEffect(() => {
    // Mostrar error de URL si existe
    if (urlError) {
      setError(decodeURIComponent(urlError));
    }

    // Verificar si ya está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Ya autenticado, cerrar pestaña
        window.close();
      }
    });
  }, [supabase, urlError]);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });

      if (authError) {
        console.error('[Auth] Google OAuth error:', authError);
        setError(authError.message || 'Error al iniciar sesión con Google. Intenta de nuevo.');
        setLoading(false);
      } else {
        console.log('[Auth] OAuth redirect initiated:', data);
      }
    } catch (err) {
      console.error('[Auth] Unexpected error:', err);
      setError('Error inesperado. Intenta de nuevo.');
      setLoading(false);
    }
  };

  const handleMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!email || !email.includes('@')) {
      setError('Por favor ingresa un email válido');
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (authError) {
      console.error('Error enviando magic link:', authError);
      setError('Error al enviar el enlace. Intenta de nuevo.');
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  };

  const getMessage = () => {
    if (reason === 'limit_soft') {
      return 'Has usado tus 5 sesiones gratuitas. Crea una cuenta para continuar gratis.';
    }
    if (reason === 'limit_hard') {
      return 'Has llegado al límite del plan gratuito. Elige un plan para seguir usando Confident.';
    }
    return 'Inicia sesión para continuar usando Confident.';
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg">
          <h1 className="text-2xl font-bold text-white mb-4">📧 Revisa tu email</h1>
          <p className="text-gray-300 mb-4">
            Te hemos enviado un enlace mágico a <strong>{email}</strong>
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Haz clic en el enlace del email para iniciar sesión. Puedes cerrar esta pestaña.
          </p>
          <button
            onClick={() => setSent(false)}
            className="text-violet-400 hover:text-violet-300 text-sm"
          >
            ← Volver a intentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full bg-gray-800 p-8 rounded-lg">
        <h1 className="text-2xl font-bold text-white mb-4">Confident</h1>
        <p className="text-gray-300 mb-6">{getMessage()}</p>

        {/* Google OAuth - Método principal */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mb-6"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? 'Redirigiendo...' : 'Continuar con Google'}
        </button>

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-800 text-gray-400">O usa email</span>
          </div>
        </div>

        {/* Magic Link - Opción secundaria */}
        <form onSubmit={handleMagicLink} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm text-gray-400 mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg border border-gray-600 focus:border-violet-500 focus:outline-none"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-700 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed border border-gray-600"
          >
            {loading ? 'Enviando...' : 'Enviar enlace mágico'}
          </button>
        </form>

        <p className="text-gray-500 text-xs mt-4 text-center">
          Recomendado: usa Google para acceso instantáneo
        </p>
      </div>
    </div>
  );
}
