import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LogOut, Menu } from 'lucide-react';

import { useAuth } from '../../hooks/useAuth.ts';
import { withBasePath } from '../../../js/utils/base-path.js';

const logoSrc = withBasePath('images/logo-puc.png');

const getInitials = (name?: string | null) => {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const AppHeader = () => {
  const { user, isAuthenticated, login, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogin = () => {
    const target = `${location.pathname}${location.search}`;
    void login(target);
  };

  const handleLogout = () => {
    setMenuOpen(false);
    void logout();
  };

  const secondaryLabel = user?.role ?? user?.email ?? null;
  const displayName = user?.name?.trim() || user?.email || 'Usuário';

  return (
    <header className="app-header bg-main-color w-full shrink-0 sticky top-0 z-50">
      <div className="flex h-max lg:h-[106px] items-center justify-between gap-4 px-4 md:px-6 py-2 lg:py-0">
        <div className="w-full md:px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="contents md:flex items-center justify-start gap-6">
              <Link to="/" className="text-on-primary hover:text-on-primary-muted flex items-center">
                <img src={logoSrc} alt="Logo" className="w-full max-w-28 max-h-16 object-contain" />
              </Link>
              <p className="font-semibold text-on-primary text-xl lg:text-2xl hidden md:block">PUC PDF</p>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-[color,box-shadow] h-auto p-0 hover:text-on-primary-muted"
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  <div className="flex flex-col items-end mr-2 leading-tight">
                    <span className="text-on-primary font-semibold lg:text-base truncate max-w-[160px]">
                      {displayName}
                    </span>
                    {secondaryLabel && (
                      <span className="text-xs text-on-primary-muted truncate max-w-[160px]">
                        {secondaryLabel}
                      </span>
                    )}
                  </div>
                  {user?.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user?.name ?? 'Usuário'}
                      className="h-12 w-12 rounded-full object-cover border border-white/40"
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[var(--primary)] font-semibold">
                      {getInitials(user?.name)}
                    </span>
                  )}
                </button>
                {menuOpen && (
                  <div className="absolute right-0 mt-3 min-w-64 rounded-md border bg-white text-slate-900 shadow-lg z-50 p-1">
                    <div className="px-2 py-1.5 flex flex-col min-w-0">
                      <span className="text-sm font-medium text-slate-900 truncate">{user?.name}</span>
                      {secondaryLabel && (
                        <span className="text-xs font-normal text-slate-600 truncate">
                          {secondaryLabel}
                        </span>
                      )}
                    </div>
                    <div className="bg-gray-200 -mx-1 my-1 h-px"></div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-slate-700 hover:bg-gray-100 w-full"
                    >
                      <LogOut className="w-4 h-4 opacity-60" />
                      <span>Sair</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogin}
                className="px-4 py-2 rounded-xl bg-white text-[var(--primary)] font-semibold shadow-sm hover:shadow-md transition"
              >
                Entrar
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
