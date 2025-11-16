const faqEntries = [
  {
    question: 'Meus arquivos estão seguros e privados?',
    answer: [
      'Com certeza. Todo o processamento acontece 100% localmente no seu navegador. Seus arquivos nunca são enviados para servidores, o que significa que nós — ou qualquer outra pessoa — nunca veremos seus dados.',
    ],
  },
  {
    question: 'O PUC PDF é realmente gratuito? Onde está a pegadinha?',
    answer: ['Sim, é totalmente gratuito. Não há taxas escondidas nem recursos pagos.'],
  },
  {
    question: 'Preciso de internet para usar as ferramentas?',
    answer: [
      'Depois de carregar o site pela primeira vez, a maioria das ferramentas funciona totalmente offline.',
      ' Apenas algumas ferramentas específicas que precisam de dados externos podem exigir conexão.',
    ],
  },
  {
    question: 'Existem limitações de tamanho ou uso?',
    answer: [
      'Não impomos limites artificiais. A única limitação prática é o poder de processamento do seu próprio computador.',
    ],
  },
  {
    question: 'Por que meu PDF falhou ao processar?',
    answer: [
      'Falhas são raras, mas podem acontecer por alguns motivos:',
      {
        type: 'list',
        items: [
          'O PDF pode estar corrompido ou fora das especificações padrão.',
          'O arquivo pode estar protegido por senha (use primeiro Descriptografar).',
          'Pode ser um PDF especial XFA ou baseado em formulários dinâmicos.',
        ],
      },
    ],
  },
];

export const FaqPage = () => (
  <>
    <section className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Perguntas frequentes</h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
        Tem dúvidas? Nós temos respostas. Aqui estão alguns dos tópicos que mais perguntam sobre o PUC PDF.
      </p>
    </section>

    <div className="max-w-4xl mx-auto space-y-4">
      {faqEntries.map((entry) => (
        <details key={entry.question} className="bg-gray-800 border border-gray-700 rounded-lg p-5 group">
          <summary className="flex items-center justify-between cursor-pointer">
            <h3 className="font-semibold text-white text-lg">{entry.question}</h3>
            <i
              data-lucide="plus"
              className="w-6 h-6 text-indigo-400 flex-shrink-0 transition-transform group-open:rotate-45"
            ></i>
          </summary>
          <div className="mt-4 text-gray-400 space-y-3">
            {entry.answer.map((block, index) =>
              typeof block === 'string' ? (
                <p key={index}>{block}</p>
              ) : (
                <ul key={index} className="list-disc list-inside space-y-1">
                  {block.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              )
            )}
          </div>
        </details>
      ))}
    </div>
  </>
);
