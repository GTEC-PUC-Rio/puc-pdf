import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { User } from 'oidc-client-ts';

import { oidcClient, isOidcConfigured } from './oidcClient.ts';

const LOGIN_REDIRECT_KEY = 'pucpdf.login.redirect';
const MOCK_USER_KEY = 'pucpdf.auth.mock';
const mockEnabled =
  (typeof import.meta !== 'undefined' && import.meta.env.MODE === 'test') ||
  (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') ||
  (typeof import.meta !== 'undefined' && import.meta.env.VITE_AUTH_MOCK === 'true');

interface AuthUser {
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  role?: string | null;
  raw?: User;
  userInfo?: Record<string, unknown> | null;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (returnTo?: string) => Promise<void>;
  logout: () => Promise<void>;
  completeLogin: () => Promise<string>;
  oidcEnabled: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const extractProfile = (user: User): AuthUser => ({
  name:
    user.profile?.name ||
    user.profile?.preferred_username ||
    user.profile?.email ||
    'Usuário',
  email: undefined,
  avatarUrl: null,
  role: null,
  raw: user,
  userInfo: null,
});

const fetchUserInfo = async (oidcUser: User): Promise<Record<string, unknown> | null> => {
  if (!oidcClient || !oidcUser.access_token) return null;
  try {
    const metadata = await oidcClient.metadataService.getMetadata();
    const endpoint = metadata?.userinfo_endpoint;
    if (!endpoint) return null;
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${oidcUser.access_token}`,
      },
    });
    if (!response.ok) return null;
    return (await response.json()) as Record<string, unknown>;
  } catch (err) {
    console.warn('Falha ao carregar userinfo do OIDC.', err);
    return null;
  }
};

const buildAuthUser = async (oidcUser: User): Promise<AuthUser> => {
  const base = extractProfile(oidcUser);
  if (!oidcClient) return base;
  const info = await fetchUserInfo(oidcUser);
  if (info) {
    const emailReal = typeof info.email_real === 'string' ? info.email_real : undefined;
    const infoEmail = typeof info.email === 'string' ? info.email : undefined;
    const fullName = typeof info.name === 'string' ? info.name : undefined;
    base.name = fullName?.trim() && fullName.length > 0 ? fullName : base.name;
    base.email = emailReal ?? infoEmail ?? base.email ?? null;
    base.avatarUrl =
      typeof info.profile_photo === 'string' && info.profile_photo.length > 0
        ? info.profile_photo
        : null;
    base.role =
      typeof info.usuariosgu_equivalent_role === 'string' && info.usuariosgu_equivalent_role.length > 0
        ? info.usuariosgu_equivalent_role
        : null;
    base.userInfo = info;
  }
  return base;
};

const loadMockUser = () => {
  try {
    const stored = window.localStorage.getItem(MOCK_USER_KEY);
    return stored ? (JSON.parse(stored) as AuthUser) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const resolveAndSetUser = useCallback(async (oidcUser: User | null) => {
    if (!oidcUser) {
      setUser(null);
      return;
    }
    const built = await buildAuthUser(oidcUser);
    setUser(built);
  }, []);

  useEffect(() => {
    let mounted = true;
    if (!oidcClient) {
      if (mockEnabled) {
        const mock = loadMockUser() ?? { name: 'Usuário Demo', email: 'demo@puc.pdf' };
        window.localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mock));
        setUser(mock);
        setLoading(false);
      } else {
        setError(
          'Configuração OIDC ausente. Defina as variáveis VITE_OIDC_* ou habilite o mock com VITE_AUTH_MOCK=true.'
        );
        setLoading(false);
      }
      return () => {
        mounted = false;
      };
    }

    const bootstrap = async () => {
      try {
        const loaded = await oidcClient.getUser();
        if (!mounted) return;
        if (loaded && !loaded.expired) {
          await resolveAndSetUser(loaded);
        }
      } catch (err) {
        console.error('OIDC bootstrap error', err);
        if (mounted) {
          setError('Não foi possível carregar a sessão.');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    bootstrap();

    const handleLoaded = (loaded: User) => {
      resolveAndSetUser(loaded);
    };
    const handleUnloaded = () => setUser(null);

    oidcClient.events.addUserLoaded(handleLoaded);
    oidcClient.events.addUserUnloaded(handleUnloaded);

    return () => {
      mounted = false;
      oidcClient.events.removeUserLoaded(handleLoaded);
      oidcClient.events.removeUserUnloaded(handleUnloaded);
    };
  }, [resolveAndSetUser]);

  const login = useCallback(
    async (returnTo?: string) => {
      const target =
        returnTo ??
        (typeof window !== 'undefined'
          ? window.location.pathname + window.location.search
          : '/');
      sessionStorage.setItem(LOGIN_REDIRECT_KEY, target);

      if (oidcClient) {
        await oidcClient.signinRedirect({ state: target });
        return;
      }

      if (!mockEnabled) {
        setError(
          'Configuração OIDC ausente. Defina as variáveis VITE_OIDC_* ou habilite o mock com VITE_AUTH_MOCK=true.'
        );
        return;
      }

      const mockUser: AuthUser = {
        name: 'Usuário Demo',
        email: 'demo@puc.pdf',
      };
      window.localStorage.setItem(MOCK_USER_KEY, JSON.stringify(mockUser));
      setUser(mockUser);
    },
    []
  );

  const logout = useCallback(async () => {
    if (oidcClient) {
      await oidcClient.signoutRedirect().catch((err) => {
        if (err instanceof Error && err.message === 'No end session endpoint') {
          console.warn('OIDC sem endpoint de logout; sessão limpa localmente.');
        } else {
          console.error('Erro ao encerrar sessão', err);
        }
      });
      setUser(null);
      return;
    }

    if (mockEnabled) {
      window.localStorage.removeItem(MOCK_USER_KEY);
      setUser(null);
    }
  }, []);

  const completeLogin = useCallback(async () => {
    let target =
      sessionStorage.getItem(LOGIN_REDIRECT_KEY) ??
      (typeof window !== 'undefined' ? window.location.pathname : '/');
    sessionStorage.removeItem(LOGIN_REDIRECT_KEY);

    if (oidcClient) {
      try {
        const signedIn = await oidcClient.signinRedirectCallback();
        await resolveAndSetUser(signedIn);
        if (signedIn?.state && typeof signedIn.state === 'string') {
          target = signedIn.state;
        }
      } catch (err) {
        console.error('OIDC callback error', err);
        setError('Não foi possível concluir o login.');
      }
    } else {
      const mock = loadMockUser();
      if (mock && mockEnabled) {
        setUser(mock);
      }
    }

    return target || '/';
  }, [resolveAndSetUser]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      error,
      login,
      logout,
      completeLogin,
      oidcEnabled: isOidcConfigured,
    }),
    [user, loading, error, login, logout, completeLogin]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext deve ser usado dentro de AuthProvider');
  }
  return ctx;
};
