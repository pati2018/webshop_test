import React from 'react';
import { ArrowDown, Check } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-stone-100/60 border-b border-stone-200/70 pt-8 pb-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-6 space-y-6">
            <div className="text-xs uppercase tracking-wider text-stone-500 font-medium">
              Kollektion 2026 · Handverlesene Edition
            </div>

            <h1
              className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-900 leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Kuratierte Formen für zeitlosen Wohn- und Arbeitsraum.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              Drei kompromisslos gefertigte Objekte für anspruchsvolle Ästheten. Entwickelt
              aus authentischen Naturmaterialien, langlebiger Technik und klarer skandinavischer
              Formsprache.
            </p>

            {/* Value propositions without pill badges */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 pt-2 text-xs text-stone-600 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Limitierte Serienfertigung</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-stone-800 shrink-0" />
                <span>2 Jahre Vollgarantie</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-stone-800 shrink-0" />
                <span>Offizieller PayPal-Käuferschutz</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#produkte"
                className="inline-flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow"
              >
                <span>Zur 3-teiligen Kollektion</span>
                <ArrowDown className="w-4 h-4" />
              </a>

              <a
                href="#philosophie"
                className="inline-flex items-center text-sm font-medium text-stone-700 hover:text-stone-950 px-3 py-3 underline underline-offset-4 decoration-stone-300 hover:decoration-stone-900 transition-colors"
              >
                Material & Manufaktur
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="aspect-[16/10] sm:aspect-[16/9] lg:aspect-[4/3] rounded-2xl overflow-hidden shadow-xl border border-stone-200/80 bg-stone-200">
              <img
                src="/src/assets/images/hero_minimalist_storefront_1792142507126.jpg"
                alt="KONTUR Design Studio Innenraum mit Designobjekten"
                className="w-full h-full object-cover object-center transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="eager"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Subtle caption bottom */}
            <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
              <span>Studio KONTUR · Hamburg</span>
              <span>3 Designobjekte verfügbar</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
