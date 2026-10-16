import React, { useState } from 'react';
import { ShieldCheck, Lock, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { ShippingAddress, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface PayPalDialogProps {
  isOpen: boolean;
  totalAmount: number;
  currency: Currency;
  shippingAddress: ShippingAddress;
  onClose: () => void;
  onSuccess: (transactionId: string) => void;
  onError: (errorMessage: string) => void;
}

export const PayPalDialog: React.FC<PayPalDialogProps> = ({
  isOpen,
  totalAmount,
  currency,
  shippingAddress,
  onClose,
  onSuccess,
  onError,
}) => {
  const [fundingSource, setFundingSource] = useState<'balance' | 'bank' | 'card' | 'paylater'>('balance');
  const [status, setStatus] = useState<'review' | 'processing' | 'success'>('review');

  if (!isOpen) return null;

  const handleApprove = () => {
    setStatus('processing');
    // Simulate authentic PayPal verification and capture
    setTimeout(() => {
      const randomTxNum = Math.floor(10000000 + Math.random() * 90000000);
      const generatedId = `PAYID-DE-${randomTxNum}-X9`;
      setStatus('success');
      setTimeout(() => {
        onSuccess(generatedId);
      }, 700);
    }, 1200);
  };

  const handleCancel = () => {
    onError('Zahlungsvorgang bei PayPal wurde vom Nutzer abgebrochen.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* PayPal Simulated Official Header */}
        <div className="bg-[#003087] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-xl italic font-serif text-[#ffc439]">
              PayPal
            </span>
            <span className="text-xs uppercase tracking-wider text-blue-200 font-semibold ml-2 pl-2 border-l border-blue-400">
              Sichere Kasse
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-blue-200">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL</span>
          </div>
        </div>

        {status === 'processing' ? (
          <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="w-10 h-10 text-[#0070BA] animate-spin" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-900">
                Zahlung wird autorisiert...
              </h3>
              <p className="text-xs text-stone-500">
                Verbindung mit PayPal Servern wird hergestellt. Bitte schließen Sie dieses Fenster nicht.
              </p>
            </div>
          </div>
        ) : status === 'success' ? (
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 animate-bounce" />
            <h3 className="text-lg font-bold text-stone-900">Zahlung erfolgreich autorisiert!</h3>
            <p className="text-xs text-stone-600">Sie werden zurück zum Webshop geleitet...</p>
          </div>
        ) : (
          <div className="p-6 space-y-5">
            {/* Merchant Info & Total */}
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs text-stone-500 uppercase tracking-wider block">Empfänger</span>
                <span className="font-semibold text-stone-900 text-sm">KONTUR Studio GmbH</span>
                <span className="text-xs text-stone-400 block">hallo@kontur-studio.de</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-stone-500 uppercase tracking-wider block">Gesamtbetrag</span>
                <span className="text-xl font-bold text-stone-900 font-mono tabular-nums">
                  {formatPrice(totalAmount, currency)}
                </span>
              </div>
            </div>

            {/* Buyer Account */}
            <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200/80 text-xs">
              <div className="flex items-center justify-between text-stone-700 font-medium mb-1">
                <span>Angemeldet als:</span>
                <span className="text-blue-700 font-semibold">{shippingAddress.email || 'kunde@paypal.de'}</span>
              </div>
              <div className="text-stone-500">
                Lieferung an: {shippingAddress.firstName} {shippingAddress.lastName}, {shippingAddress.street}, {shippingAddress.postalCode} {shippingAddress.city}
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Zahlungsquelle auswählen:
              </label>

              <div className="space-y-2 text-xs">
                {/* Option 1: Balance */}
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    fundingSource === 'balance'
                      ? 'border-[#0070BA] bg-blue-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="funding"
                      checked={fundingSource === 'balance'}
                      onChange={() => setFundingSource('balance')}
                      className="text-[#0070BA] focus:ring-[#0070BA]"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">PayPal-Guthaben</div>
                      <div className="text-stone-500">Verfügbar: 450,00 € (Sofortige Abbuchung)</div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700">Bevorzugt</span>
                </label>

                {/* Option 2: Bank Account */}
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    fundingSource === 'bank'
                      ? 'border-[#0070BA] bg-blue-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="funding"
                      checked={fundingSource === 'bank'}
                      onChange={() => setFundingSource('bank')}
                      className="text-[#0070BA] focus:ring-[#0070BA]"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">Bankkonto (SEPA-Lastschrift)</div>
                      <div className="text-stone-500">DE89 •••• •••• •••• 4810 (Deutsche Bank)</div>
                    </div>
                  </div>
                </label>

                {/* Option 3: Credit Card */}
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                    fundingSource === 'card'
                      ? 'border-[#0070BA] bg-blue-50/50 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="funding"
                      checked={fundingSource === 'card'}
                      onChange={() => setFundingSource('card')}
                      className="text-[#0070BA] focus:ring-[#0070BA]"
                    />
                    <div>
                      <div className="font-semibold text-stone-900">Visa Kreditkarte</div>
                      <div className="text-stone-500">Kreditkarte endet auf 9241 (Gültig bis 09/28)</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Buyer Protection Guarantee */}
            <div className="flex items-start gap-2.5 text-xs text-stone-600 bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-stone-900">Inklusive PayPal-Käuferschutz</span>
                <p className="text-[11px] text-stone-600 mt-0.5">
                  Wenn Ihr Artikel nicht ankommt oder erheblich von der Beschreibung abweicht, erstattet PayPal den vollen Kaufpreis inklusive Versandkosten.
                </p>
              </div>
            </div>

            {/* Confirmation CTA Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleApprove}
                className="w-full bg-[#0070BA] hover:bg-[#003087] text-white py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Zahlung in Höhe von {formatPrice(totalAmount, currency)} abschließen</span>
              </button>

              <button
                type="button"
                onClick={handleCancel}
                className="w-full text-xs text-stone-500 hover:text-stone-800 py-2 transition-colors text-center"
              >
                Abbrechen und zurück zum Warenkorb
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
