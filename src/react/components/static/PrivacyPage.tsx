const sections = [
  {
    title: '1. Nosso compromisso com a privacidade',
    paragraphs: [
      'O PUC PDF (“nós”, “nos”, “nosso”) é, antes de tudo, um serviço focado em privacidade. Nosso princípio central é simples: seus arquivos são seus. Nós não visualizamos, acessamos, armazenamos ou compartilhamos seus documentos.',
    ],
  },
  {
    title: '1.1 O princípio client-side',
    paragraphs: [
      'Diferente de outros serviços online de PDF, o PUC PDF não envia seus arquivos para um servidor para fazer o trabalho. As ferramentas são impulsionadas por bibliotecas que rodam diretamente no seu dispositivo.',
    ],
  },
  {
    title: '2. Informações que não coletamos',
    paragraphs: ['Por causa da nossa arquitetura client-side, somos tecnicamente incapazes de coletar:'],
    list: [
      'O conteúdo dos seus PDFs ou de qualquer documento usado com nossas ferramentas.',
      'Quaisquer dados pessoais contidos nos seus documentos.',
      'Os nomes dos seus arquivos ou metadados sensíveis.',
    ],
  },
];

export const PrivacyPage = () => (
  <section className="max-w-4xl mx-auto py-12 space-y-8">
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Política de Privacidade</h1>
      <p className="text-gray-500">Última atualização: 14 de setembro de 2025</p>
    </div>

    <div className="legal-content space-y-8">
      {sections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-gray-300">
              {paragraph}
            </p>
          ))}
          {section.list && (
            <ul className="list-disc list-inside text-gray-300 space-y-1">
              {section.list.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  </section>
);
