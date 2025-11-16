import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const authority = import.meta.env.VITE_OIDC_AUTHORITY;
const clientId = import.meta.env.VITE_OIDC_CLIENT_ID;
const scope = import.meta.env.VITE_OIDC_SCOPE ?? 'openid profile email';

const redirectUri =
  import.meta.env.VITE_OIDC_REDIRECT_URI ??
  (typeof window !== 'undefined'
    ? `${window.location.origin}/auth/callback`
    : '');

const postLogoutRedirectUri =
  import.meta.env.VITE_OIDC_LOGOUT_REDIRECT_URI ??
  (typeof window !== 'undefined' ? `${window.location.origin}/` : '');

const silentRedirectUri =
  import.meta.env.VITE_OIDC_SILENT_REDIRECT_URI ??
  (typeof window !== 'undefined'
    ? `${window.location.origin}/auth/silent-renew`
    : '');

const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
const mockFlag =
  typeof import.meta !== 'undefined' && import.meta.env.VITE_AUTH_MOCK === 'true';

let userManager: UserManager | null = null;

if (
  typeof window !== 'undefined' &&
  authority &&
  clientId &&
  redirectUri &&
  !isTestEnv &&
  !mockFlag
) {
  userManager = new UserManager({
    authority,
    client_id: clientId,
    redirect_uri: redirectUri,
    post_logout_redirect_uri: postLogoutRedirectUri,
    silent_redirect_uri: silentRedirectUri,
    response_type: 'code',
    scope,
    automaticSilentRenew: true,
    monitorSession: false,
    userStore: new WebStorageStateStore({ store: window.localStorage }),
  });
}

export const oidcClient = userManager;
export const isOidcConfigured = Boolean(userManager);
