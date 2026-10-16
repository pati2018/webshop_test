import React from 'react';
import { ShoppingBag, Heart, PackageCheck, Globe, Lock } from 'lucide-react';
import { Currency } from '../types';

interface HeaderProps {
  cartCount: number;
  wishlistCount: number;
  orderCount: number;
  currency: Currency;
  isAdmin: boolean;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenOrders: () => void;
  onOpenAdmin: () => void;
  onSelectCurrency: (c: Currency) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartCount,
  wishlistCount,
  orderCount,
  currency,
  isAdmin,
  onOpenCart,
  onOpenWishlist,
  onOpenOrders,
  onOpenAdmin,
  onSelectCurrency,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-50/95 backdrop-blur-md border-b border-stone-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="text-xl font-bold tracking-tight text-stone-900 font-display uppercase whitespace-nowrap shrink-0 hover:opacity-80 transition-opacity"
        >
          KONTUR STUDIO
        </a>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-stone-600">
          <a
            href="#produkte"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Kollektion
          </a>
          <a
            href="#philosophie"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Philosophie
          </a>
          <a
            href="#service"
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0"
          >
            Versand & Garantie
          </a>
          <button
            onClick={onOpenOrders}
            className="hover:text-stone-950 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-stone-600 hover:cursor-pointer"
          >
            <PackageCheck className="w-4 h-4 text-stone-500" />
            <span>Bestellungen</span>
            {orderCount > 0 && (
              <span className="text-xs font-mono bg-stone-200 text-stone-800 rounded-full w-5 h-5 flex items-center justify-center">
                {orderCount}
              </span>
            )}
          </button>
        </nav>

        {/* Zone 3: 1 primary action + helper utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Currency Switcher */}
          <div className="relative flex items-center text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200/80 rounded-md px-2 py-1.5 transition-colors">
            <Globe className="w-3.5 h-3.5 mr-1 text-stone-500" />
            <select
              value={currency}
              onChange={(e) => onSelectCurrency(e.target.value as Currency)}
              className="bg-transparent border-none text-stone-800 focus:outline-none cursor-pointer pr-1 text-xs"
              aria-label="Währung auswählen"
            >
              <option value="EUR">EUR (€)</option>
              <option value="CHF">CHF</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          {/* Admin Mode Button */}
          <button
            onClick={onOpenAdmin}
            aria-label="Admin-Bereich öffnen"
            title={isAdmin ? 'Admin-Bereich (Angemeldet)' : 'Admin-Bereich (Login)'}
            className={`p-2 rounded-md transition-colors flex items-center gap-1.5 text-xs font-semibold ${
              isAdmin
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">{isAdmin ? 'Admin aktiv' : 'Admin'}</span>
          </button>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            aria-label="Merkliste öffnen"
            className="p-2 text-stone-600 hover:text-stone-950 hover:bg-stone-100 rounded-md transition-colors relative"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-stone-900 rounded-full" />
            )}
          </button>

          {/* Primary Action: Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            aria-label="Warenkorb öffnen"
            className="flex items-center gap-2.5 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm hover:shadow active:scale-[0.98] whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Warenkorb</span>
            <span className="bg-stone-800 text-stone-100 text-xs px-2 py-0.5 rounded-full font-mono tabular-nums">
              {cartCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
