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

  const supabase = createClient();

  useEffect(() => {
    // Verificar si ya está autenticado
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // Ya autenticado, cerrar pestaña
        window.close();
      }
    });
  }, [supabase]);

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
            className="w-full bg-violet-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Enviando...' : 'Enviar enlace mágico'}
          </button>
        </form>

        <p className="text-gray-500 text-xs mt-6 text-center">
          Recibirás un enlace por email para iniciar sesión sin contraseña
        </p>
      </div>
    </div>
  );
}
