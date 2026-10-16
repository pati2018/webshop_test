import React, { useState } from 'react';
import { X, Lock, ShieldCheck, Truck, Check, AlertCircle } from 'lucide-react';
import { CartItem, ShippingAddress, PromoCode, Currency } from '../types';
import { formatPrice } from '../utils/formatters';
import { PayPalDialog } from './PayPalDialog';

interface CheckoutModalProps {
  isOpen: boolean;
  items: CartItem[];
  currency: Currency;
  activePromo: PromoCode | null;
  onClose: () => void;
  onCompleteOrder: (orderData: {
    shippingAddress: ShippingAddress;
    shippingMethod: 'standard' | 'express';
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    paypalTransactionId: string;
  }) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  items,
  currency,
  activePromo,
  onClose,
  onCompleteOrder,
}) => {
  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [address, setAddress] = useState<ShippingAddress>({
    firstName: 'Maximilian',
    lastName: 'Mustermann',
    email: 'maximilian.mustermann@example.de',
    street: 'Neuer Wall 42',
    postalCode: '20354',
    city: 'Hamburg',
    country: 'Deutschland',
  });
  const [addressErrors, setAddressErrors] = useState<Record<string, string>>({});
  const [showPayPalDialog, setShowPayPalDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Pricing
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  let discountAmount = 0;
  if (activePromo?.discountPercent) {
    discountAmount = (subtotal * activePromo.discountPercent) / 100;
  }

  const isFreeStandard = subtotal >= 50 || activePromo?.freeShipping;
  const standardCost = isFreeStandard ? 0 : 4.9;
  const expressCost = 4.9; // If express chosen, 4.90 EUR flat
  const shippingCost = shippingMethod === 'standard' ? standardCost : expressCost;

  const total = Math.max(0, subtotal - discountAmount + shippingCost);
  const vatAmount = (total * 19) / 119;

  const validateAddress = (): boolean => {
    const errors: Record<string, string> = {};
    if (!address.firstName.trim()) errors.firstName = 'Vorname ist erforderlich';
    if (!address.lastName.trim()) errors.lastName = 'Nachname ist erforderlich';
    if (!address.email.trim() || !address.email.includes('@')) errors.email = 'Gültige E-Mail-Adresse erforderlich';
    if (!address.street.trim()) errors.street = 'Straße und Hausnummer erforderlich';
    if (!address.postalCode.trim()) errors.postalCode = 'PLZ erforderlich';
    if (!address.city.trim()) errors.city = 'Ort erforderlich';

    setAddressErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleStartPayPalCheckout = () => {
    if (!validateAddress()) {
      setErrorMessage('Bitte füllen Sie alle erforderlichen Adressfelder aus.');
      return;
    }
    setErrorMessage(null);
    setShowPayPalDialog(true);
  };

  const handlePayPalSuccess = (txId: string) => {
    setShowPayPalDialog(false);
    onCompleteOrder({
      shippingAddress: address,
      shippingMethod,
      subtotal,
      discount: discountAmount,
      shippingCost,
      total,
      paypalTransactionId: txId,
    });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
        <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-display font-bold text-lg text-stone-900 tracking-tight">
                KONTUR STUDIO
              </span>
              <span className="text-stone-300">|</span>
              <span className="text-sm font-medium text-stone-600 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-700" />
                Sichere Kasse
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Kasse schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Form: Delivery Address & Shipping */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Address */}
              <div>
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-mono">
                    1
                  </span>
                  <span>Lieferadresse & Kontaktdaten</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Vorname *</label>
                    <input
                      type="text"
                      value={address.firstName}
                      onChange={(e) => setAddress({ ...address, firstName: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    {addressErrors.firstName && (
                      <span className="text-rose-600 text-[11px]">{addressErrors.firstName}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Nachname *</label>
                    <input
                      type="text"
                      value={address.lastName}
                      onChange={(e) => setAddress({ ...address, lastName: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    {addressErrors.lastName && (
                      <span className="text-rose-600 text-[11px]">{addressErrors.lastName}</span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-medium mb-1">E-Mail für Bestellbestätigung & PayPal *</label>
                    <input
                      type="email"
                      value={address.email}
                      onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    {addressErrors.email && (
                      <span className="text-rose-600 text-[11px]">{addressErrors.email}</span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-medium mb-1">Straße und Hausnummer *</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    {addressErrors.street && (
                      <span className="text-rose-600 text-[11px]">{addressErrors.street}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Postleitzahl *</label>
                    <input
                      type="text"
                      value={address.postalCode}
                      onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    {addressErrors.postalCode && (
                      <span className="text-rose-600 text-[11px]">{addressErrors.postalCode}</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-stone-600 font-medium mb-1">Stadt / Ort *</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                    />
                    {addressErrors.city && (
                      <span className="text-rose-600 text-[11px]">{addressErrors.city}</span>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-stone-600 font-medium mb-1">Land</label>
                    <select
                      value={address.country}
                      onChange={(e) => setAddress({ ...address, country: e.target.value })}
                      className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
                    >
                      <option value="Deutschland">Deutschland</option>
                      <option value="Österreich">Österreich</option>
                      <option value="Schweiz">Schweiz</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Step 2: Shipping Options */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-mono">
                    2
                  </span>
                  <span>Versandmethode</span>
                </h3>

                <div className="space-y-2 text-xs">
                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'standard'
                        ? 'border-stone-900 bg-stone-50 font-medium'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="text-stone-900 focus:ring-stone-900"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">DHL Standardversand (Klimaneutral)</div>
                        <div className="text-stone-500">Lieferzeit 2-3 Werktage mit Sendungsverfolgung</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900">
                      {isFreeStandard ? 'Kostenlos' : formatPrice(4.9, currency)}
                    </span>
                  </label>

                  <label
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      shippingMethod === 'express'
                        ? 'border-stone-900 bg-stone-50 font-medium'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="text-stone-900 focus:ring-stone-900"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">DHL Express Next-Day</div>
                        <div className="text-stone-500">Garantierte Zustellung morgen bis 12:00 Uhr</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-stone-900">
                      {formatPrice(4.9, currency)}
                    </span>
                  </label>
                </div>
              </div>

              {/* Step 3: Payment with PayPal */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-stone-900 text-white text-xs flex items-center justify-center font-mono">
                    3
                  </span>
                  <span>Bezahlung per PayPal</span>
                </h3>

                <div className="p-4 rounded-xl border-2 border-[#0070BA]/30 bg-blue-50/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold tracking-tight text-xl italic font-serif text-[#003087]">
                        PayPal
                      </span>
                      <span className="text-xs text-stone-600 font-medium">Offizieller Checkout</span>
                    </div>
                    <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200">
                      Käuferschutz aktiv
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    Bezahlen Sie schnell und sicher mit Ihrem PayPal-Konto. Sie können Ihr PayPal-Guthaben,
                    SEPA-Lastschrift, Kreditkarte oder „Später bezahlen“ nutzen.
                  </p>

                  {errorMessage && (
                    <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* PayPal Primary Action Button */}
                  <button
                    type="button"
                    onClick={handleStartPayPalCheckout}
                    className="w-full bg-[#ffc439] hover:bg-[#f4b82d] text-[#003087] py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.99]"
                  >
                    <span className="italic font-serif text-xl tracking-tight">PayPal</span>
                    <span className="text-stone-900 font-semibold text-sm">Jetzt mit PayPal bezahlen ({formatPrice(total, currency)})</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary */}
            <div className="lg:col-span-5 bg-stone-50 p-6 rounded-2xl border border-stone-200/90 h-fit space-y-5">
              <h4 className="text-sm font-bold text-stone-900 uppercase tracking-wider pb-2 border-b border-stone-200">
                Bestellübersicht ({items.length} {items.length === 1 ? 'Artikel' : 'Artikel'})
              </h4>

              {/* Items Preview */}
              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div
                    key={`${item.product.id}-${item.selectedVariant.id}`}
                    className="flex items-center gap-3 text-xs"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-200 shrink-0 border border-stone-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-stone-900 truncate">
                        {item.product.name}
                      </div>
                      <div className="text-stone-500 text-[11px]">
                        {item.quantity}x {item.selectedVariant.name}
                      </div>
                    </div>
                    <div className="font-mono font-medium text-stone-900 shrink-0">
                      {formatPrice(item.product.price * item.quantity, currency)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Cost Calculations */}
              <div className="space-y-2 pt-4 border-t border-stone-200 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Zwischensumme</span>
                  <span className="font-mono tabular-nums">{formatPrice(subtotal, currency)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Gutscheinrabatt</span>
                    <span className="font-mono tabular-nums">-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Versand ({shippingMethod === 'standard' ? 'DHL Standard' : 'DHL Express'})</span>
                  <span className="font-mono tabular-nums">
                    {shippingCost === 0 ? 'Kostenlos' : formatPrice(shippingCost, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Darin enthaltene MwSt. (19%)</span>
                  <span className="font-mono tabular-nums">{formatPrice(vatAmount, currency)}</span>
                </div>

                <div className="flex justify-between text-base font-bold text-stone-900 pt-3 border-t border-stone-300">
                  <span>Gesamtsumme</span>
                  <span className="font-mono tabular-nums">{formatPrice(total, currency)}</span>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs space-y-2">
                <div className="flex items-center gap-2 text-stone-700">
                  <Check className="w-3.5 h-3.5 text-stone-900" />
                  <span>30 Tage uneingeschränktes Rückgaberecht</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <Check className="w-3.5 h-3.5 text-stone-900" />
                  <span>Kostenloser Rückversand per DHL Label</span>
                </div>
                <div className="flex items-center gap-2 text-stone-700">
                  <ShieldCheck className="w-3.5 h-3.5 text-stone-900" />
                  <span>100% Absicherung durch PayPal-Käuferschutz</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render PayPal Simulated Popup Dialog */}
      <PayPalDialog
        isOpen={showPayPalDialog}
        totalAmount={total}
        currency={currency}
        shippingAddress={address}
        onClose={() => setShowPayPalDialog(false)}
        onSuccess={handlePayPalSuccess}
        onError={(err) => setErrorMessage(err)}
      />
    </>
  );
};
