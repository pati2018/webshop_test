import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface WishlistModalProps {
  isOpen: boolean;
  wishlistProducts: Product[];
  currency: Currency;
  onClose: () => void;
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  wishlistProducts,
  currency,
  onClose,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-stone-200 p-6 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
            <h3 className="text-lg font-bold text-stone-900">Ihre Merkliste</h3>
            <span className="text-xs bg-stone-100 text-stone-600 px-2 py-0.5 rounded-full font-mono">
              {wishlistProducts.length}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="py-12 text-center text-stone-500 space-y-2">
            <Heart className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="text-sm font-semibold text-stone-800">Keine gemerkten Artikel</p>
            <p className="text-xs text-stone-500">
              Klicken Sie auf das Herz-Symbol bei einem Produkt, um es für später zu speichern.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {wishlistProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-3 p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-16 h-16 rounded-lg object-cover bg-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-stone-900 truncate">{p.name}</h4>
                  <div className="text-[11px] text-stone-500">{p.category}</div>
                  <div className="text-xs font-bold text-stone-900 font-mono mt-1">
                    {formatPrice(p.price, currency)}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(p);
                      onRemoveFromWishlist(p.id);
                    }}
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors"
                  >
                    <ShoppingBag className="w-3 h-3" />
                    <span>In den Korb</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(p.id)}
                    className="text-[11px] text-stone-500 hover:text-rose-600 flex items-center justify-center gap-1 py-0.5 transition-colors"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Entfernen</span>
                  </button>
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
            Fertig
          </button>
        </div>
      </div>
    </div>
  );
};
