import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

export const TopBanner: React.FC = () => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <aside
      aria-label="Ankündigung"
      className="bg-stone-900 text-stone-200 text-xs py-2 px-4 transition-all border-b border-stone-800"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 text-center font-normal flex items-center justify-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-stone-400 shrink-0 hidden sm:inline" />
          <span>
            Kostenloser DHL Versand ab 50 € <span className="opacity-50 mx-1.5">·</span> 30 Tage Bedenkzeit <span className="opacity-50 mx-1.5">·</span> Sichere Zahlung & Käuferschutz mit <strong className="font-semibold text-white">PayPal</strong>
          </span>
        </div>
        <button
          onClick={() => setVisible(false)}
          className="text-stone-400 hover:text-white p-0.5 rounded transition-colors"
          aria-label="Banner schließen"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
