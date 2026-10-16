import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShieldCheck, Tag, ShoppingBag } from 'lucide-react';
import { CartItem, PromoCode, Currency } from '../types';
import { formatPrice } from '../utils/formatters';
import { AVAILABLE_PROMO_CODES } from '../data/products';

interface CartDrawerProps {
  isOpen: boolean;
  items: CartItem[];
  currency: Currency;
  activePromo: PromoCode | null;
  onClose: () => void;
  onUpdateQuantity: (productId: string, variantId: string, quantity: number) => void;
  onRemoveItem: (productId: string, variantId: string) => void;
  onApplyPromo: (code: string) => { success: boolean; message: string };
  onRemovePromo: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  items,
  currency,
  activePromo,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromo,
  onRemovePromo,
  onProceedToCheckout,
}) => {
  const [promoInput, setPromoInput] = useState('');
  const [promoFeedback, setPromoFeedback] = useState<{ isError: boolean; message: string } | null>(null);

  if (!isOpen) return null;

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (activePromo?.discountPercent) {
    discountAmount = (subtotal * activePromo.discountPercent) / 100;
  }

  // Free standard shipping threshold is 50 EUR
  const FREE_SHIPPING_THRESHOLD = 50;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || activePromo?.freeShipping;
  const shippingCost = items.length === 0 ? 0 : isFreeShipping ? 0 : 4.9;

  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const vatAmount = (total * 19) / 119; // 19% MwSt. included

  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyPromoCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = onApplyPromo(promoInput.trim());
    if (res.success) {
      setPromoFeedback({ isError: false, message: res.message });
      setPromoInput('');
    } else {
      setPromoFeedback({ isError: true, message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between border-l border-stone-200 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-stone-900" />
            <h2 className="text-lg font-bold text-stone-900">Ihr Warenkorb</h2>
            <span className="text-xs text-stone-500 font-mono">
              ({items.reduce((sum, item) => sum + item.quantity, 0)})
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
            aria-label="Warenkorb schließen"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Bar */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 text-xs">
          {amountToFreeShipping > 0 ? (
            <div>
              <span className="text-stone-700">
                Noch <strong>{formatPrice(amountToFreeShipping, currency)}</strong> bis zum kostenlosen Versand!
              </span>
              <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-stone-900 h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-emerald-700 font-medium flex items-center gap-1.5">
              <span>✓ Kostenloser Versand freigeschaltet!</span>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
              <ShoppingBag className="w-12 h-12 text-stone-300 mb-3" />
              <p className="text-base font-semibold text-stone-800">Ihr Warenkorb ist leer</p>
              <p className="text-xs text-stone-500 max-w-xs mt-1">
                Entdecken Sie unsere 3 kuratierten Designobjekte und legen Sie Ihr Lieblingsstück hinein.
              </p>
              <button
                onClick={onClose}
                className="mt-5 text-xs font-semibold text-stone-900 underline underline-offset-4 hover:opacity-80"
              >
                Jetzt Kollektion ansehen
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedVariant.id}`}
                className="flex gap-4 p-3 rounded-xl border border-stone-150 bg-stone-50/50 hover:bg-stone-50 transition-colors"
              >
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-lg object-cover bg-stone-200 shrink-0"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-semibold text-stone-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.selectedVariant.id)}
                        className="text-stone-400 hover:text-rose-600 transition-colors"
                        aria-label="Artikel entfernen"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-2.5 h-2.5 rounded-full inline-block border border-stone-300"
                        style={{ backgroundColor: item.selectedVariant.colorHex }}
                      />
                      <span>{item.selectedVariant.name}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-200/60">
                    {/* Stepper */}
                    <div className="flex items-center border border-stone-300 rounded-md bg-white">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity - 1)
                        }
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 transition-colors"
                        aria-label="Menge minus"
                      >
                        -
                      </button>
                      <span className="px-2.5 py-0.5 text-xs font-mono font-semibold text-stone-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateQuantity(item.product.id, item.selectedVariant.id, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.product.stock}
                        className="px-2 py-0.5 text-xs text-stone-600 hover:bg-stone-100 disabled:opacity-30 transition-colors"
                        aria-label="Menge plus"
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm font-bold text-stone-900 font-mono tabular-nums">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Area with Voucher, Price Breakdown & Checkout Button */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50/80 space-y-4">
            {/* Promo Code Input */}
            <div>
              {activePromo ? (
                <div className="flex items-center justify-between bg-stone-200/80 px-3 py-2 rounded-lg text-xs">
                  <div className="flex items-center gap-1.5 text-stone-800">
                    <Tag className="w-3.5 h-3.5" />
                    <span className="font-mono font-semibold">{activePromo.code}</span>
                    <span className="text-stone-500">({activePromo.description})</span>
                  </div>
                  <button
                    onClick={onRemovePromo}
                    className="text-stone-600 hover:text-stone-900 text-xs font-medium underline"
                  >
                    Entfernen
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromoCode} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Gutscheincode (z.B. WILLKOMMEN10)"
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                  <button
                    type="submit"
                    className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors"
                  >
                    Einlösen
                  </button>
                </form>
              )}
              {promoFeedback && (
                <p
                  className={`text-[11px] mt-1 ${
                    promoFeedback.isError ? 'text-rose-600' : 'text-emerald-700'
                  }`}
                >
                  {promoFeedback.message}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
              <div className="flex justify-between">
                <span>Zwischensumme</span>
                <span className="font-mono tabular-nums">{formatPrice(subtotal, currency)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Rabatt ({activePromo?.code})</span>
                  <span className="font-mono tabular-nums">-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Versandkosten</span>
                <span className="font-mono tabular-nums">
                  {shippingCost === 0 ? 'Kostenlos' : formatPrice(shippingCost, currency)}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-stone-400">
                <span>Enthaltene MwSt. (19%)</span>
                <span className="font-mono tabular-nums">{formatPrice(vatAmount, currency)}</span>
              </div>

              <div className="flex justify-between text-base font-bold text-stone-900 pt-2 border-t border-stone-300">
                <span>Gesamtsumme</span>
                <span className="font-mono tabular-nums">{formatPrice(total, currency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full bg-[#ffc439] hover:bg-[#f4b82d] text-[#003087] py-3 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
              >
                <span className="font-bold tracking-tight italic font-serif text-lg text-[#003087]">PayPal</span>
                <span className="text-stone-900 font-semibold">Direkt zur PayPal-Kasse</span>
                <ArrowRight className="w-4 h-4 text-stone-900" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-500 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                <span>Offizieller Käuferschutz & verschlüsselte Bezahlung</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
