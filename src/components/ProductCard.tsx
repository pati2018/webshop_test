import React from 'react';
import { Heart, Star, ShoppingBag, Eye } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  isWishlisted: boolean;
  onOpenDetails: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onToggleWishlist: (productId: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  isWishlisted,
  onOpenDetails,
  onQuickAddToCart,
  onToggleWishlist,
}) => {
  return (
    <article className="group bg-white rounded-xl border border-stone-200/90 overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      {/* Product Image Frame */}
      <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer" onClick={() => onOpenDetails(product)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Minimal text badge if present */}
        {product.badge && (
          <div className="absolute top-3 left-3 bg-stone-900/90 backdrop-blur-sm text-stone-100 text-[11px] font-medium tracking-wide uppercase px-2.5 py-1 rounded">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product.id);
          }}
          aria-label={isWishlisted ? 'Aus Merkliste entfernen' : 'Auf Merkliste setzen'}
          className={`absolute top-3 right-3 p-2 rounded-full transition-all backdrop-blur-sm ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600 shadow-sm'
              : 'bg-white/80 text-stone-600 hover:text-stone-900 hover:bg-white shadow-sm'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-600' : ''}`} />
        </button>

        {/* Hover Quick Action Overlay Bar */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(product);
            }}
            className="flex-1 bg-white/95 hover:bg-white text-stone-800 text-xs font-medium py-2 px-3 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Details</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onQuickAddToCart(product);
            }}
            className="flex-1 bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium py-2 px-3 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>+ Warenkorb</span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata line with typographic dot separator */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <span>{product.category}</span>
            <span aria-hidden="true">·</span>
            <div className="flex items-center gap-1 text-stone-700">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="font-medium">{product.rating}</span>
              <span className="text-stone-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => onOpenDetails(product)}
            className="text-base font-semibold text-stone-900 group-hover:text-stone-700 transition-colors cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          {/* Product Short Subtitle */}
          <p className="text-xs text-stone-500 line-clamp-2 mt-1 mb-4 leading-relaxed">
            {product.subtitle}
          </p>
        </div>

        {/* Pricing & Footer Bar */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-400 font-normal">Preis inkl. MwSt.</div>
            <div className="text-lg font-bold text-stone-900 font-mono tabular-nums">
              {formatPrice(product.price, currency)}
            </div>
          </div>

          {/* Direct Buy Button for mobile / tap */}
          <button
            type="button"
            onClick={() => onQuickAddToCart(product)}
            className="sm:hidden bg-stone-900 text-white text-xs font-medium px-3.5 py-2 rounded-lg flex items-center gap-1.5 active:bg-stone-800"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Kaufen</span>
          </button>

          {/* Available stock note */}
          <div className="hidden sm:block text-right">
            <span className="text-[11px] text-emerald-700 font-medium">
              ● Auf Lager ({product.stock} Stk.)
            </span>
            <div className="text-[10px] text-stone-400">1-2 Werktage</div>
          </div>
        </div>
      </div>
    </article>
  );
};
