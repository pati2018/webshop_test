import React from 'react';
import { X, PackageCheck, Printer, ArrowRight } from 'lucide-react';
import { Order, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface OrdersModalProps {
  isOpen: boolean;
  orders: Order[];
  currency: Currency;
  onClose: () => void;
  onOpenInvoice: (order: Order) => void;
}

export const OrdersModal: React.FC<OrdersModalProps> = ({
  isOpen,
  orders,
  currency,
  onClose,
  onOpenInvoice,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <PackageCheck className="w-5 h-5 text-stone-900" />
            <h3 className="text-lg font-bold text-stone-900">Meine Bestellungen</h3>
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
              {orders.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="py-12 text-center text-stone-500 space-y-2">
            <PackageCheck className="w-12 h-12 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">Noch keine Bestellungen getätigt</p>
            <p className="text-xs text-stone-500">
              Sobald Sie eine Bestellung über PayPal abschließen, wird Ihre Bestellhistorie hier gespeichert.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-stone-900 text-sm">{ord.id}</span>
                    <span className="text-stone-400 ml-2">· {ord.date}</span>
                  </div>
                  <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded text-[11px] font-semibold border border-emerald-200">
                    {ord.status} via PayPal
                  </span>
                </div>

                <div className="space-y-1.5">
                  {ord.items.map((it) => (
                    <div
                      key={`${it.product.id}-${it.selectedVariant.id}`}
                      className="flex items-center justify-between text-xs text-stone-700"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          className="w-7 h-7 rounded object-cover"
                        />
                        <span>
                          {it.quantity}x {it.product.name} ({it.selectedVariant.name})
                        </span>
                      </div>
                      <span className="font-mono">{formatPrice(it.product.price * it.quantity, currency)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                  <div className="text-stone-500 text-[11px]">
                    PayPal TX: <span className="font-mono text-stone-700">{ord.paypalTransactionId}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-stone-900 font-mono">
                      Gesamt: {formatPrice(ord.total, currency)}
                    </span>
                    <button
                      onClick={() => onOpenInvoice(ord)}
                      className="text-stone-700 hover:text-stone-950 font-medium underline flex items-center gap-1"
                    >
                      <Printer className="w-3 h-3" />
                      <span>Rechnung</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full bg-stone-900 text-white py-2.5 rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
