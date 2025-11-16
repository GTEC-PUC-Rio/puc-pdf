export const ContactPage = () => (
  <>
    <section className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Entre em contato</h1>
      <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
        Vamos adorar ouvir você. Se tiver uma pergunta, feedback ou pedido de recurso, fale com a gente sem receio.
      </p>
    </section>

    <div className="max-w-2xl mx-auto text-center py-8">
      <p className="text-lg text-gray-400">
        Você pode falar diretamente conosco por e-mail em{' '}
        <a className="text-indigo-400 underline hover:text-indigo-300" href="mailto:contact@bentopdf.com">
          contact@bentopdf.com
        </a>
        .
      </p>
    </div>
  </>
);
