const normalizeBase = (value?: string | null) => {
  if (!value) return '/';
  return value.endsWith('/') ? value : `${value}/`;
};

const BASE_PATH = normalizeBase(import.meta.env?.BASE_URL ?? '/');

export const getBasePath = (): string => BASE_PATH;

export const withBasePath = (path = ''): string => {
  if (!path) return BASE_PATH;

  // Preserve absolute URLs (http, https, mailto, etc.)
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(path)) {
    return path;
  }

  const normalizedPath = path.replace(/^\/+/, '');
  return `${BASE_PATH}${normalizedPath}`;
};
