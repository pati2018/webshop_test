import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { Order, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface InvoiceModalProps {
  order: Order | null;
  currency: Currency;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, currency, onClose }) => {
  if (!order) return null;

  const handlePrint = () => {
    window.print();
  };

  const vat = (order.total * 19) / 119;
  const net = order.total - vat;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 print:p-0 print:bg-white">
      <div className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-stone-200 p-8 sm:p-10 space-y-8 print:border-none print:shadow-none print:max-w-none print:p-6">
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 print:hidden">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-900 text-sm">Rechnungsansicht</span>
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">
              Bezahlt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Drucken / Als PDF speichern</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Document Body */}
        <div className="space-y-8 text-stone-800 text-xs sm:text-sm">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold font-display tracking-tight text-stone-950 uppercase">
                KONTUR STUDIO
              </h1>
              <p className="text-stone-500 text-xs mt-1">
                KONTUR Studio GmbH · Neuer Wall 42 · 20354 Hamburg
              </p>
              <p className="text-stone-400 text-[11px]">
                USt-IdNr.: DE 319 842 109 · Amtsgericht Hamburg HRB 18921
              </p>
            </div>
            <div className="text-right">
              <span className="text-lg font-bold text-stone-900 block font-mono">RECHNUNG</span>
              <span className="font-mono text-stone-600 block mt-1">Rechnungs-Nr: {order.id}</span>
              <span className="text-stone-500 block">Datum: {order.date}</span>
            </div>
          </div>

          {/* Billing & Shipping Address */}
          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-stone-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mb-1">
                Rechnungsempfänger / Lieferadresse
              </span>
              <div className="font-semibold text-stone-900">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName}
              </div>
              <div className="text-stone-600">{order.shippingAddress.street}</div>
              <div className="text-stone-600">
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </div>
              <div className="text-stone-600">{order.shippingAddress.country}</div>
              <div className="text-stone-500 mt-1">{order.shippingAddress.email}</div>
            </div>

            <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-2">
                Zahlungsinformationen
              </span>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-stone-500">Zahlungsart: </span>
                  <strong className="text-stone-900">PayPal Express Checkout</strong>
                </div>
                <div>
                  <span className="text-stone-500">Status: </span>
                  <strong className="text-emerald-700">Vollständig bezahlt</strong>
                </div>
                <div>
                  <span className="text-stone-500">PayPal Transaktions-ID: </span>
                  <span className="font-mono text-stone-800">{order.paypalTransactionId}</span>
                </div>
                <div>
                  <span className="text-stone-500">Versandart: </span>
                  <span className="text-stone-800">
                    {order.shippingMethod === 'standard' ? 'DHL Standard (Klimaneutral)' : 'DHL Express'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-300 text-stone-500 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5 font-bold">Position</th>
                  <th className="py-2.5 font-bold">Artikelbezeichnung & Variante</th>
                  <th className="py-2.5 font-bold text-center">Menge</th>
                  <th className="py-2.5 font-bold text-right">Einzelpreis</th>
                  <th className="py-2.5 font-bold text-right">Gesamt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150">
                {order.items.map((item, index) => (
                  <tr key={`${item.product.id}-${item.selectedVariant.id}`}>
                    <td className="py-3 font-mono text-stone-400">{index + 1}</td>
                    <td className="py-3">
                      <div className="font-semibold text-stone-900">{item.product.name}</div>
                      <div className="text-stone-500 text-[11px]">
                        Ausführung: {item.selectedVariant.name}
                      </div>
                    </td>
                    <td className="py-3 text-center font-mono">{item.quantity}</td>
                    <td className="py-3 text-right font-mono tabular-nums">
                      {formatPrice(item.product.price, currency)}
                    </td>
                    <td className="py-3 text-right font-mono font-medium text-stone-900 tabular-nums">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex justify-end pt-4 border-t border-stone-200">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Warenwert (netto):</span>
                <span className="font-mono tabular-nums">{formatPrice(net - order.shippingCost * 0.84, currency)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Rabatt:</span>
                  <span className="font-mono tabular-nums">-{formatPrice(order.discount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Versandkosten:</span>
                <span className="font-mono tabular-nums">
                  {order.shippingCost === 0 ? 'Kostenlos' : formatPrice(order.shippingCost, currency)}
                </span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>USt. / MwSt. (19%):</span>
                <span className="font-mono tabular-nums">{formatPrice(vat, currency)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-950 pt-2 border-t border-stone-300">
                <span>Rechnungsbetrag (brutto):</span>
                <span className="font-mono">{formatPrice(order.total, currency)}</span>
              </div>
            </div>
          </div>

          {/* Legal Footer */}
          <div className="pt-8 border-t border-stone-200 text-[11px] text-stone-500 text-center space-y-1">
            <p>Vielen Dank für Ihren Einkauf bei KONTUR Studio!</p>
            <p>
              Diese Rechnung wurde maschinell erstellt und ist ohne Unterschrift gültig. Betrag wurde vollständig via PayPal beglichen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
