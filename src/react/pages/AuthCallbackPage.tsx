import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.ts';

export const AuthCallbackPage = () => {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    let active = true;
    completeLogin()
      .then((target) => {
        if (active) {
          navigate(target || '/', { replace: true });
        }
      })
      .catch(() => {
        if (active) navigate('/', { replace: true });
      });

    return () => {
      active = false;
    };
  }, [completeLogin, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-8">
        <p className="text-lg font-semibold mb-2">Finalizando login…</p>
        <p className="text-sm text-gray-400">
          Aguarde enquanto confirmamos sua sessão com o provedor.
        </p>
      </div>
    </div>
  );
};
