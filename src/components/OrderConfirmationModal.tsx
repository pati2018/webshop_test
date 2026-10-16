import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, Printer, ArrowRight, ShieldCheck, Truck, Package } from 'lucide-react';
import { Order, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface OrderConfirmationModalProps {
  order: Order | null;
  currency: Currency;
  onClose: () => void;
  onOpenInvoice: (order: Order) => void;
}

export const OrderConfirmationModal: React.FC<OrderConfirmationModalProps> = ({
  order,
  currency,
  onClose,
  onOpenInvoice,
}) => {
  useEffect(() => {
    if (order) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0070BA', '#ffc439', '#1c1917', '#10b981'],
        });
      } catch (err) {
        // Safe fallback
      }
    }
  }, [order]);

  if (!order) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase tracking-wider text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            Zahlung erfolgreich bestätigt
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Vielen Dank für Ihre Bestellung!
          </h2>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            Ihre Bestellung ist bei uns eingegangen und wird für den klimaneutralen DHL-Versand vorbereitet.
          </p>
        </div>

        {/* Order & PayPal Details Box */}
        <div className="bg-stone-50 rounded-xl p-5 border border-stone-200 space-y-3 text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pb-3 border-b border-stone-200">
            <div>
              <span className="text-stone-400 block font-normal">Bestellnummer</span>
              <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-normal">Datum</span>
              <span className="font-medium text-stone-800">{order.date}</span>
            </div>
            <div>
              <span className="text-stone-400 block font-normal">Zahlart</span>
              <span className="font-bold text-[#003087]">PayPal</span>
            </div>
            <div>
              <span className="text-stone-400 block font-normal">Status</span>
              <span className="text-emerald-700 font-semibold">{order.status}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-stone-600">
            <div>
              <span className="text-stone-400">PayPal Transaktions-ID: </span>
              <span className="font-mono text-stone-800 font-medium">{order.paypalTransactionId}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>PayPal Käuferschutz aktiviert</span>
            </div>
          </div>
        </div>

        {/* Items Summary */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Gekaufte Artikel ({order.items.length})
          </h4>
          <div className="space-y-2 border border-stone-200 rounded-xl p-3 bg-white">
            {order.items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant.id}`}
                className="flex items-center justify-between text-xs py-1.5 border-b border-stone-100 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-10 h-10 rounded-md object-cover bg-stone-100"
                  />
                  <div>
                    <div className="font-semibold text-stone-900">{item.product.name}</div>
                    <div className="text-stone-500 text-[11px]">
                      {item.quantity}x {item.selectedVariant.name}
                    </div>
                  </div>
                </div>
                <div className="font-mono font-medium text-stone-900">
                  {formatPrice(item.product.price * item.quantity, currency)}
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Row */}
          <div className="flex justify-between items-center text-sm font-bold text-stone-900 pt-1 px-1">
            <span>Gesamtbetrag (inkl. MwSt. & Versand)</span>
            <span className="font-mono text-base">{formatPrice(order.total, currency)}</span>
          </div>
        </div>

        {/* Shipping Address Summary */}
        <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs flex items-start gap-3">
          <Truck className="w-5 h-5 text-stone-700 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-stone-900">Lieferadresse:</div>
            <div className="text-stone-600 mt-0.5">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName} · {order.shippingAddress.street} · {order.shippingAddress.postalCode} {order.shippingAddress.city} · {order.shippingAddress.country}
            </div>
            <div className="text-stone-500 text-[11px] mt-1">
              Bestätigung gesendet an: <strong className="text-stone-800">{order.shippingAddress.email}</strong>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenInvoice(order)}
            className="w-full sm:w-1/2 bg-stone-100 hover:bg-stone-200 text-stone-800 py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-stone-300"
          >
            <Printer className="w-4 h-4 text-stone-600" />
            <span>Rechnung anzeigen / drucken</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-1/2 bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <span>Weiter einkaufen</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
