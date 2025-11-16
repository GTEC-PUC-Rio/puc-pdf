const termsSections = [
  {
    title: '1. Aceitação dos termos',
    content:
      'Ao acessar e utilizar o PUC PDF (“Serviço”), você aceita e concorda em seguir estes termos. Caso não concorde, não utilize o serviço.',
  },
  {
    title: '2. Descrição do serviço',
    content:
      'O PUC PDF oferece ferramentas client-side para processar arquivos PDF, garantindo que nenhum dado seja enviado aos nossos servidores.',
  },
  {
    title: '3. Conduta e responsabilidades do usuário',
    content:
      'Você é o único responsável pelo conteúdo dos arquivos que processa. Concorda em não usar o serviço para fins ilegais ou que infrinjam direitos de terceiros.',
  },
  {
    title: '7. Lei aplicável',
    content:
      'Estes Termos serão regidos e interpretados de acordo com as leis da Índia, sem considerar conflitos de leis.',
  },
  {
    title: '9. Fale conosco',
    content:
      'Se tiver dúvidas sobre estes Termos, escreva para <a href="mailto:contact@bentopdf.com" class="text-indigo-400 underline">contact@bentopdf.com</a>.',
  },
];

export const TermsPage = () => (
  <section className="max-w-4xl mx-auto py-12 space-y-8">
    <div className="text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Termos e Condições</h1>
      <p className="text-gray-500">Última atualização: 14 de setembro de 2025</p>
    </div>

    <div className="legal-content space-y-8">
      {termsSections.map((section) => (
        <div key={section.title} className="space-y-3">
          <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
          <p className="text-gray-300" dangerouslySetInnerHTML={{ __html: section.content }}></p>
        </div>
      ))}
    </div>
  </section>
);
