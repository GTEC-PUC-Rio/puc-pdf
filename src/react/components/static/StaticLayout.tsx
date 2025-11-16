import { ReactNode, useEffect } from 'react';
import { createIcons, icons } from 'lucide';

import { withBasePath } from '../../../js/utils/base-path.js';

const companyLinks = [
  { href: 'about', label: 'Sobre nós' },
  { href: 'faq', label: 'Perguntas frequentes' },
  { href: 'contact', label: 'Fale conosco' },
];

const legalLinks = [
  { href: 'terms', label: 'Termos e Condições' },
  { href: 'privacy', label: 'Política de Privacidade' },
];

export const StaticLayout = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    createIcons({ icons });
    document.body?.removeAttribute('data-loading');
  }, []);

  const logoSrc = withBasePath('images/logo-puc.png');
  const resolveHref = (slug: string) => withBasePath(slug);

  return (
    <>
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-30">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <img src={logoSrc} alt="Logo da PUC-Rio" className="h-8 w-auto" />
          <div className="ml-3">
            <p className="text-white font-bold text-lg leading-tight">PUC PDF</p>
            <p className="text-gray-400 text-sm leading-tight">
              Ferramentas privadas de PDF da PUC-Rio
            </p>
          </div>
        </div>
      </nav>

      <div id="app" className="min-h-screen container mx-auto">
        {children}
      </div>

      <footer className="mt-16 border-t-2 border-gray-700 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <img src={logoSrc} alt="Logo da PUC-Rio" className="h-10 w-auto mr-3" />
                <span className="text-xl font-bold text-white">PUC PDF</span>
              </div>
              <p className="text-gray-500 text-xs mt-2">
                <a
                  href="https://github.com/GTEC-PUC-Rio/puc-pdf"
                  className="hover:text-indigo-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Código-fonte
                </a>
              </p>
              <p className="text-gray-500 text-xs">
                Baseado em{' '}
                <a
                  href="https://github.com/alam00000/bentopdf"
                  className="hover:text-indigo-400 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  BentoPDF
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                {companyLinks.map((link) => (
                  <li key={link.href}>
                    <a href={resolveHref(link.href)} className="hover:text-indigo-400">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Jurídico</h3>
              <ul className="space-y-2 text-gray-400">
                {legalLinks.map((link) => (
                  <li key={link.href}>
                    <a href={resolveHref(link.href)} className="hover:text-indigo-400">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-4">Siga-nos</h3>
              <div className="flex justify-center md:justify-start space-x-4">
                <a
                  href="https://www.instagram.com/pucrio.oficial"
                  className="text-gray-400 hover:text-indigo-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i data-lucide="instagram"></i>
                </a>
                <a
                  href="https://www.linkedin.com/school/puc-rio/"
                  className="text-gray-400 hover:text-indigo-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i data-lucide="linkedin"></i>
                </a>
                <a
                  href="https://x.com/pucriooficial"
                  className="text-gray-400 hover:text-indigo-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};
