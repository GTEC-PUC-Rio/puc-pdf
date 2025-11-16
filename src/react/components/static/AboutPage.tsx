import { useEffect } from 'react';
import { createIcons, icons } from 'lucide';

const whyItems = [
  {
    icon: 'zap',
    title: 'Feito para ser rápido',
    body:
      'Nada de esperar uploads ou downloads para um servidor. Ao processar os arquivos diretamente no seu navegador com tecnologias modernas como WebAssembly, oferecemos uma velocidade incomparável em todas as ferramentas.',
  },
  {
    icon: 'badge-dollar-sign',
    title: 'Totalmente gratuito',
    body:
      'Sem testes, sem assinaturas, sem taxas escondidas e sem recursos “premium” presos atrás de um portão. Acreditamos que ferramentas poderosas de PDF devem ser um serviço público, não uma máquina de lucro.',
  },
  {
    icon: 'user-plus',
    title: 'Sem conta necessária',
    body:
      'Comece a usar qualquer ferramenta imediatamente. Não precisamos do seu e-mail, senha ou de qualquer informação pessoal. Seu fluxo de trabalho deve ser anônimo e sem atritos.',
  },
  {
    icon: 'code-2',
    title: 'Espírito open source',
    body:
      'Construído com transparência em mente. Aproveitamos bibliotecas open source incríveis como PDF-lib e PDF.js, e acreditamos no esforço da comunidade para tornar ferramentas poderosas acessíveis a todos.',
  },
];

const timelineItems = [
  {
    year: '2022',
    title: 'Quando tudo começou',
    description:
      'Nas aulas do laboratório de tecnologia educativa da PUC-Rio, identificamos o desafio recorrente dos alunos que precisavam lidar com PDFs gigantes e lentos para rotinas simples.',
  },
  {
    year: '2023',
    title: 'Primeiras versões',
    description:
      'Criamos a primeira geração do PUC PDF, com foco total em privacidade local. A recepção foi imediata, e o produto ganhou o status de projeto oficial do laboratório.',
  },
  {
    year: '2024',
    title: 'Expansão das ferramentas',
    description:
      'Adicionamos dezenas de ferramentas novas, suporte a OCR offline e um dos conversores mais rápidos do mercado.',
  },
  {
    year: '2025',
    title: 'Código aberto e colaboração',
    description:
      'Abrimos o código no GitHub para convidar a comunidade da PUC e do mundo para colaborar. Agora, você também pode construir novas ferramentas com a gente.',
  },
];

export const AboutPage = () => {
  useEffect(() => {
    createIcons({ icons });
  }, []);

  return (
    <>
      <section className="text-center py-16 md:py-24">
        <h1 className="text-3xl md:text-6xl font-bold text-white mb-4">
          Acreditamos que as ferramentas de PDF precisam ser{' '}
          <span className="marker-slanted">rápidas, privadas e gratuitas.</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400">Sem concessões.</p>
      </section>

      <div className="section-divider" />

      <section className="py-16 max-w-4xl mx-auto">
        <div className="text-center">
          <i data-lucide="rocket" className="w-16 h-16 text-indigo-400 mx-auto mb-6"></i>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nossa missão</h2>
          <p className="text-lg text-gray-400 leading-relaxed">
            Oferecer a caixa de ferramentas de PDF mais completa, que respeita sua privacidade e nunca pede pagamento.
            Acreditamos que ferramentas essenciais de documentos devem ser acessíveis para todos, em qualquer lugar, sem
            barreiras.
          </p>
        </div>
      </section>

      <div className="bg-gray-800 rounded-xl p-8 md:p-12 my-16 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <span className="text-indigo-400 font-bold uppercase">Nossa filosofia central</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mt-2 mb-4">
              Privacidade em primeiro lugar. Sempre.
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Em uma era em que dados são mercadoria, seguimos outro caminho. Todo o processamento das ferramentas do PUC
              PDF acontece localmente no seu navegador. Isso significa que seus arquivos nunca encostam em nossos servidores,
              não vemos os seus documentos e não rastreamos o que você faz.
            </p>
          </div>
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 bg-indigo-500 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute inset-4 bg-indigo-500 rounded-full opacity-30 animate-pulse delay-500"></div>
              <i data-lucide="shield-check" className="w-48 h-48 text-indigo-400"></i>
            </div>
          </div>
        </div>
      </div>

      <section className="py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Por que <span className="marker-slanted">o PUC PDF?</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {whyItems.map((item) => (
            <div key={item.title} className="bg-gray-800 p-6 rounded-lg flex items-start gap-4">
              <i data-lucide={item.icon} className="w-10 h-10 text-indigo-400 flex-shrink-0 mt-1"></i>
              <div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-10">Nossa linha do tempo</h2>
        <div className="space-y-8">
          {timelineItems.map((item) => (
            <div key={item.year} className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4">
                <div className="text-indigo-400 text-3xl font-bold">{item.year}</div>
                <div className="w-12 h-1 bg-indigo-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="text-gray-400 mt-2">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};
