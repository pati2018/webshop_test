import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Headphones } from 'lucide-react';

export const ServicePillars: React.FC = () => {
  return (
    <section id="service" className="py-16 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-2">
            Unser Qualitätsversprechen
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Transparenz, Schnelligkeit & kompromissloser Schutz.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Kostenloser DHL Versand</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Klimaneutraler GoGreen-Versand ab 50 € Bestellwert. Lieferzeit innerhalb Deutschlands nur 1-2 Werktage.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">30 Tage Rückgaberecht</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Testen Sie unsere Produkte in Ruhe in Ihren eigenen vier Wänden. Kostenlose Rücksendung mit beiliegendem Retourenlabel.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#003087] text-[#ffc439] flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">PayPal-Käuferschutz</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Jeder Einkauf ist durch das offizielle PayPal-Käuferschutzprogramm vollständig abgesichert. Schnelle und sichere Abwicklung.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center">
              <Headphones className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-stone-900">Persönlicher Kundenservice</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Direkter Ansprechpartner in Hamburg via Telefon & E-Mail. Bei Fragen zu Technik oder Pflege beraten wir Sie persönlich.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
