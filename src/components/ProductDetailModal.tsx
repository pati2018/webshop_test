import React, { useState } from 'react';
import { X, Star, Check, ShieldCheck, Truck, RotateCcw, Heart, ShoppingBag } from 'lucide-react';
import { Product, ProductVariant, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, variant: ProductVariant) => void;
  onInstantPayPalBuy: (product: Product, quantity: number, variant: ProductVariant) => void;
  onToggleWishlist: (productId: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isWishlisted,
  onClose,
  onAddToCart,
  onInstantPayPalBuy,
  onToggleWishlist,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || { id: 'default', name: 'Standard', colorHex: '#18181B' }
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'highlights' | 'specs' | 'care' | 'reviews'>('highlights');

  const handleDecQty = () => setQuantity((prev) => Math.max(1, prev - 1));
  const handleIncQty = () => setQuantity((prev) => Math.min(product.stock, prev + 1));

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-500 hover:text-stone-950 bg-white/90 hover:bg-white rounded-full shadow-sm transition-colors"
          aria-label="Schließen"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-0">
          {/* Left Column: Product Imagery */}
          <div className="md:col-span-6 bg-stone-100 p-6 sm:p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-stone-200">
            <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-inner bg-stone-200 relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
                referrerPolicy="no-referrer"
              />
              {product.badge && (
                <div className="absolute top-3 left-3 bg-stone-900 text-stone-100 text-[11px] font-medium uppercase px-2.5 py-1 rounded">
                  {product.badge}
                </div>
              )}
            </div>

            {/* Trust Badges Bar */}
            <div className="mt-6 pt-6 border-t border-stone-200/80 grid grid-cols-3 gap-2 text-center text-[11px] text-stone-600">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-stone-700" />
                <span>Kostenloser DHL Versand</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-stone-700" />
                <span>30 Tage Retoure</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-stone-700" />
                <span>2 Jahre Garantie</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span>{product.category}</span>
                <div className="flex items-center gap-1 text-stone-700">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-semibold">{product.rating}</span>
                  <span className="text-stone-400">({product.reviewCount} Bewertungen)</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight leading-snug">
                {product.name}
              </h2>
              <p className="text-sm text-stone-500 mt-1 leading-relaxed">
                {product.subtitle}
              </p>

              {/* Price */}
              <div className="mt-4 pb-4 border-b border-stone-100 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-stone-900 font-mono tabular-nums">
                  {formatPrice(product.price * quantity, currency)}
                </span>
                <span className="text-xs text-stone-500">
                  inkl. 19% MwSt., versandkostenfrei
                </span>
              </div>

              {/* Variant Picker */}
              <div className="mt-5 space-y-2">
                <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                  Farbvariante: <span className="font-normal text-stone-900 normal-case">{selectedVariant.name}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.variants.map((v) => {
                    const isSelected = selectedVariant.id === v.id;
                    return (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                          isSelected
                            ? 'border-stone-900 bg-stone-900 text-white shadow-sm'
                            : 'border-stone-200 text-stone-700 hover:border-stone-400 bg-white'
                        }`}
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-stone-300"
                          style={{ backgroundColor: v.colorHex }}
                        />
                        <span>{v.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper & Stock */}
              <div className="mt-5 flex items-center justify-between">
                <div>
                  <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block mb-1.5">
                    Menge
                  </label>
                  <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                    <button
                      type="button"
                      onClick={handleDecQty}
                      disabled={quantity <= 1}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 disabled:opacity-30 transition-colors"
                      aria-label="Menge reduzieren"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 text-xs font-mono font-bold text-stone-900 tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={handleIncQty}
                      disabled={quantity >= product.stock}
                      className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 disabled:opacity-30 transition-colors"
                      aria-label="Menge erhöhen"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-medium text-emerald-700">
                    ● Sofort lieferbar ({product.stock} Stück)
                  </div>
                  <div className="text-[11px] text-stone-400">Lieferzeit ca. 1-2 Werktage</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2.5">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onAddToCart(product, quantity, selectedVariant);
                      onClose();
                    }}
                    className="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99]"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>In den Warenkorb ({formatPrice(product.price * quantity, currency)})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleWishlist(product.id)}
                    aria-label="Auf Merkliste"
                    className={`p-3 rounded-xl border transition-colors ${
                      isWishlisted
                        ? 'border-rose-200 bg-rose-50 text-rose-600'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-600'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-600' : ''}`} />
                  </button>
                </div>

                {/* Direct PayPal Express Button */}
                <button
                  type="button"
                  onClick={() => {
                    onInstantPayPalBuy(product, quantity, selectedVariant);
                    onClose();
                  }}
                  className="w-full bg-[#ffc439] hover:bg-[#f4b82d] text-[#003087] font-semibold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all shadow-sm active:scale-[0.99]"
                >
                  <span className="font-bold tracking-tight italic font-serif text-base text-[#003087]">PayPal</span>
                  <span className="text-stone-900 text-xs font-medium">Direkt Express-Kauf mit Käuferschutz</span>
                </button>
              </div>

              {/* Tab Navigation for Specs / Info */}
              <div className="mt-8 border-t border-stone-200 pt-4">
                <div className="flex items-center gap-4 border-b border-stone-100 pb-2 text-xs font-medium text-stone-500">
                  <button
                    type="button"
                    onClick={() => setActiveTab('highlights')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'highlights' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : 'hover:text-stone-900'
                    }`}
                  >
                    Vorteile
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('specs')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'specs' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : 'hover:text-stone-900'
                    }`}
                  >
                    Details & Daten
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('care')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'care' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : 'hover:text-stone-900'
                    }`}
                  >
                    Pflege & Versand
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('reviews')}
                    className={`pb-1 transition-colors ${
                      activeTab === 'reviews' ? 'text-stone-950 border-b-2 border-stone-900 font-semibold' : 'hover:text-stone-900'
                    }`}
                  >
                    Bewertungen ({product.reviews.length})
                  </button>
                </div>

                <div className="py-3 text-xs text-stone-600 leading-relaxed">
                  {activeTab === 'highlights' && (
                    <ul className="space-y-2">
                      {product.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-stone-800 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {activeTab === 'specs' && (
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2">
                      {product.specs.map((s, i) => (
                        <div key={i} className="border-b border-stone-100 pb-1">
                          <dt className="text-stone-400 font-normal">{s.label}</dt>
                          <dd className="font-semibold text-stone-800">{s.value}</dd>
                        </div>
                      ))}
                    </dl>
                  )}

                  {activeTab === 'care' && (
                    <div className="space-y-3">
                      <div>
                        <div className="font-semibold text-stone-800 mb-0.5">Pflegehinweise:</div>
                        <p>{product.careInstructions}</p>
                      </div>
                      <div>
                        <div className="font-semibold text-stone-800 mb-0.5">Lieferinformation:</div>
                        <p>{product.shippingInfo}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'reviews' && (
                    <div className="space-y-3">
                      {product.reviews.map((r) => (
                        <div key={r.id} className="p-3 bg-stone-50 rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-semibold text-stone-900">{r.author}</span>
                            <span className="text-[11px] text-stone-400">{r.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-1.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star
                                key={idx}
                                className={`w-3 h-3 ${
                                  idx < r.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300'
                                }`}
                              />
                            ))}
                            {r.verified && (
                              <span className="text-[10px] text-emerald-700 ml-1">Verifizierter Kauf</span>
                            )}
                          </div>
                          <p className="text-stone-600 italic">„{r.comment}“</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
