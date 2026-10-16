import React, { useState } from 'react';
import { Lock, ShieldCheck, Check } from 'lucide-react';

interface FooterProps {
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenOrders, onOpenAdmin }) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim() && newsletterEmail.includes('@')) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-stone-950 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-4 space-y-4">
            <span className="text-xl font-bold font-display tracking-tight text-white block uppercase">
              KONTUR STUDIO
            </span>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Designstudio und Manufaktur für akustische, visuelle und atmosphärische Objekte.
              Gegründet in Hamburg. Zeitlose Formen, gefertigt für die Ewigkeit.
            </p>
            <div className="pt-2 flex items-center gap-2 text-xs text-stone-400">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Geprüfter Online-Shop mit Käuferschutz</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider block">Shop</span>
            <ul className="space-y-2">
              <li>
                <a href="#produkte" className="hover:text-white transition-colors">
                  Alle 3 Produkte
                </a>
              </li>
              <li>
                <a href="#philosophie" className="hover:text-white transition-colors">
                  Materialien & Herkunft
                </a>
              </li>
              <li>
                <a href="#service" className="hover:text-white transition-colors">
                  Versand & DHL GoGreen
                </a>
              </li>
              <li>
                <button
                  onClick={onOpenOrders}
                  className="hover:text-white transition-colors text-left"
                >
                  Bestellungen einsehen
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenAdmin}
                  className="hover:text-white transition-colors text-left text-stone-400 hover:text-amber-300 flex items-center gap-1"
                >
                  <Lock className="w-3 h-3" />
                  <span>Admin-Bereich</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Service & Rechtliches */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <span className="font-semibold text-white uppercase tracking-wider block">Rechtliches</span>
            <ul className="space-y-2 text-stone-400">
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Impressum</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Datenschutz</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">AGB & Kundeninfo</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Widerrufsrecht</span>
              </li>
              <li>
                <span className="hover:text-white transition-colors cursor-pointer">Batteriegesetz</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Journal */}
          <div className="lg:col-span-4 space-y-3">
            <span className="font-semibold text-white text-xs uppercase tracking-wider block">
              KONTUR Journal
            </span>
            <p className="text-xs text-stone-400 leading-relaxed">
              Erhalten Sie vierteljährlich Einblicke in Designprozesse und Vorab-Zugang zu limitierten Auflagen.
            </p>
            {newsletterSubscribed ? (
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-stone-900 border border-emerald-800/40 p-3 rounded-lg">
                <Check className="w-4 h-4 shrink-0" />
                <span>Vielen Dank! Sie wurden erfolgreich eingetragen.</span>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                  required
                  className="bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-xs text-white placeholder-stone-500 flex-1 focus:outline-none focus:border-stone-600"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-stone-200 text-stone-950 font-semibold px-4 py-2 rounded-lg text-xs transition-colors shrink-0"
                >
                  Anmelden
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Payment & Security Row */}
        <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-stone-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="text-stone-500 font-medium">Sichere Bezahlung:</span>
            <div className="flex items-center gap-2 bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-md">
              <span className="font-bold tracking-tight italic font-serif text-sm text-[#0070BA]">
                PayPal
              </span>
              <span className="text-[11px] text-stone-300 font-medium">Käuferschutz</span>
            </div>
            <div className="bg-stone-900 border border-stone-800 px-2.5 py-1.5 rounded-md text-[11px] text-stone-300">
              PayPal Ratenzahlung
            </div>
            <div className="bg-stone-900 border border-stone-800 px-2.5 py-1.5 rounded-md text-[11px] text-stone-300">
              SEPA-Lastschrift
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-stone-500">
            <span>Versandpartner: DHL GoGreen</span>
            <span>·</span>
            <span>256-Bit SSL Verschlüsselt</span>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 border-t border-stone-900 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} KONTUR Studio GmbH · Alle Rechte vorbehalten.
        </div>
      </div>
    </footer>
  );
};
