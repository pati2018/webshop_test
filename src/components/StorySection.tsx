import React from 'react';

export const StorySection: React.FC = () => {
  return (
    <section id="philosophie" className="py-20 bg-stone-900 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold">
              Unsere Philosophie
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight text-white font-display">
              Weniger, aber von Grund auf kompromisslos.
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Wir glauben nicht an schnelllebige Massenware oder saisonale Überproduktion.
              KONTUR Studio entstand aus dem Anspruch, genau drei essentielle Gegenstände des
              täglichen Lebens zur Perfektion zu führen: Klang, Licht und Raumklima.
            </p>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Jedes Gehäuse wird präzise gefräst, jede Keramikhaube von Hand gegossen.
              Reparierbar, zeitlos und darauf ausgelegt, über Jahrzehnte Freude zu bereiten.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-stone-800 text-xs">
              <div>
                <div className="font-mono text-xl font-bold text-white tabular-nums">100%</div>
                <div className="text-stone-400 mt-0.5">Plastikfreie Verpackung</div>
              </div>
              <div>
                <div className="font-mono text-xl font-bold text-white tabular-nums">5 Jahre</div>
                <div className="text-stone-400 mt-0.5">Ersatzteil-Garantie</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-800 border border-stone-800">
              <img
                src="/src/assets/images/product_studio_headphones_1792142507876.jpg"
                alt="Präzisionsfertigung Audio"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-800 border border-stone-800 sm:translate-y-8">
              <img
                src="/src/assets/images/product_ceramic_aroma_diffuser_1792142508990.jpg"
                alt="Handgefertigte Keramik"
                className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-700"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
