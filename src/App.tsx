import React, { useState, useEffect, useMemo } from 'react';
import { Search, SlidersHorizontal, CheckCircle2, RotateCcw } from 'lucide-react';
import { Header } from './components/Header';
import { TopBanner } from './components/TopBanner';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderConfirmationModal } from './components/OrderConfirmationModal';
import { OrdersModal } from './components/OrdersModal';
import { WishlistModal } from './components/WishlistModal';
import { InvoiceModal } from './components/InvoiceModal';
import { AdminModal } from './components/AdminModal';
import { ServicePillars } from './components/ServicePillars';
import { StorySection } from './components/StorySection';
import { Footer } from './components/Footer';
import { INITIAL_PRODUCTS, AVAILABLE_PROMO_CODES } from './data/products';
import { Product, CartItem, ProductVariant, ShippingAddress, Order, Currency, PromoCode } from './types';
import {
  subscribeToProducts,
  subscribeToOrders,
  saveProductToFirestore,
  deleteProductFromFirestore,
  saveOrderToFirestore,
  updateOrderStatusInFirestore,
  resetProductsToFirestore,
} from './services/firebaseService';

const STORAGE_KEYS = {
  PRODUCTS: 'kontur_products_v1',
  CART: 'kontur_cart_v1',
  WISHLIST: 'kontur_wishlist_v1',
  ORDERS: 'kontur_orders_v1',
  CURRENCY: 'kontur_currency_v1',
};

export default function App() {
  // Products state (persists in localStorage)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Currency
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY);
      return (saved as Currency) || 'EUR';
    } catch {
      return 'EUR';
    }
  });

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state (set of product IDs)
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders history
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Promo code
  const [activePromo, setActivePromo] = useState<PromoCode | null>(null);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Admin state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Modal open states
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProductForModal, setSelectedProductForModal] = useState<Product | null>(null);
  const [activeInvoiceOrder, setActiveInvoiceOrder] = useState<Order | null>(null);
  const [recentOrderConfirmation, setRecentOrderConfirmation] = useState<Order | null>(null);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Alle');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to save wishlist to localStorage', e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Failed to save orders to localStorage', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
    } catch (e) {
      console.warn('Failed to save currency to localStorage', e);
    }
  }, [currency]);

  // Connect real-time Firestore subscriptions on mount
  useEffect(() => {
    const unsubProducts = subscribeToProducts(
      (firestoreProducts) => {
        if (firestoreProducts && firestoreProducts.length > 0) {
          setProducts(firestoreProducts);
        }
      },
      (err) => console.warn('Products sync err:', err)
    );

    const unsubOrders = subscribeToOrders(
      (firestoreOrders) => {
        if (firestoreOrders) {
          setOrders(firestoreOrders);
        }
      },
      (err) => console.warn('Orders sync err:', err)
    );

    return () => {
      unsubProducts();
      unsubOrders();
    };
  }, []);

  // Toast trigger
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3200);
  };

  // Admin handlers
  const handleAdminLogin = (pin: string): boolean => {
    if (pin === '1234') {
      setIsAdminLoggedIn(true);
      showToast('Erfolgreich als Administrator angemeldet');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Admin-Modus beendet');
  };

  const handleSaveProduct = async (product: Product, isNew: boolean) => {
    try {
      await saveProductToFirestore(product);
      showToast(
        isNew
          ? `Produkt „${product.name}“ in Cloud-Datenbank angelegt`
          : `Produkt „${product.name}“ in Cloud-Datenbank aktualisiert`
      );
    } catch (err) {
      if (isNew) {
        setProducts((prev) => [product, ...prev]);
      } else {
        setProducts((prev) => prev.map((p) => (p.id === product.id ? product : p)));
      }
      showToast(`Produkt „${product.name}“ gespeichert`);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    const toDelete = products.find((p) => p.id === productId);

    // Optimistically remove from local state immediately for instant UI feedback
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setWishlist((prev) => prev.filter((id) => id !== productId));

    try {
      await deleteProductFromFirestore(productId);
      showToast(`Produkt „${toDelete?.name || productId}“ erfolgreich gelöscht`);
    } catch (err) {
      console.warn('Firestore deletion error:', err);
      showToast(`Produkt „${toDelete?.name || productId}“ gelöscht`);
    }
  };

  const handleResetProducts = async () => {
    try {
      await resetProductsToFirestore();
      showToast('Katalog in Cloud-Datenbank auf 3 Produkte zurückgesetzt');
    } catch (err) {
      setProducts(INITIAL_PRODUCTS);
      showToast('Katalog zurückgesetzt');
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateOrderStatusInFirestore(orderId, status);
      showToast(`Bestellstatus für ${orderId} in Cloud-Datenbank auf „${status}“ aktualisiert`);
    } catch (err) {
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      showToast(`Bestellstatus für ${orderId} auf „${status}“ geändert`);
    }
  };

  // Cart operations
  const handleAddToCart = (product: Product, quantity: number, variant: ProductVariant) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant.id === variant.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(product.stock, updated[existingIndex].quantity + quantity);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          quantity: Math.min(product.stock, quantity),
          selectedVariant: variant,
        },
      ];
    });

    showToast(`„${product.name} (${variant.name})“ zum Warenkorb hinzugefügt`);
  };

  const handleQuickAddToCart = (product: Product) => {
    const defaultVariant = product.variants[0];
    handleAddToCart(product, 1, defaultVariant);
  };

  const handleInstantPayPalBuy = (product: Product, quantity: number, variant: ProductVariant) => {
    handleAddToCart(product, quantity, variant);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleUpdateQuantity = (productId: string, variantId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId, variantId);
      return;
    }

    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant.id === variantId) {
          return {
            ...item,
            quantity: Math.min(item.product.stock, quantity),
          };
        }
        return item;
      })
    );
  };

  const handleRemoveFromCart = (productId: string, variantId: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedVariant.id === variantId)
      )
    );
  };

  // Promo code handler
  const handleApplyPromo = (code: string): { success: boolean; message: string } => {
    const found = AVAILABLE_PROMO_CODES.find(
      (p) => p.code.toUpperCase() === code.trim().toUpperCase()
    );

    if (!found) {
      return { success: false, message: 'Ungültiger Rabattcode. Probieren Sie WILLKOMMEN10' };
    }

    const currentSubtotal = cart.reduce((sum, it) => sum + it.product.price * it.quantity, 0);
    if (found.minSpend && currentSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Dieser Code erfordert einen Mindestbestellwert von ${found.minSpend} €`,
      };
    }

    setActivePromo(found);
    return { success: true, message: `Gutschein „${found.code}“ erfolgreich aktiviert!` };
  };

  // Wishlist operations
  const handleToggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Aus Merkliste entfernt');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Auf Merkliste gespeichert');
        return [...prev, productId];
      }
    });
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlist.includes(p.id));
  }, [products, wishlist]);

  // Order submission
  const handleCompleteOrder = (orderData: {
    shippingAddress: ShippingAddress;
    shippingMethod: 'standard' | 'express';
    subtotal: number;
    discount: number;
    shippingCost: number;
    total: number;
    paypalTransactionId: string;
  }) => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newOrder: Order = {
      id: `#KTR-2026-${randomSuffix}`,
      date: new Date().toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      items: [...cart],
      subtotal: orderData.subtotal,
      discount: orderData.discount,
      shippingCost: orderData.shippingCost,
      total: orderData.total,
      shippingMethod: orderData.shippingMethod,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: 'paypal',
      paypalTransactionId: orderData.paypalTransactionId,
      status: 'Bezahlt',
    };

    // Decrement stock in store and persist to Firestore
    setProducts((prev) =>
      prev.map((prod) => {
        const ordered = cart.filter((it) => it.product.id === prod.id);
        const qtySum = ordered.reduce((s, it) => s + it.quantity, 0);
        if (qtySum > 0) {
          const updatedProd = {
            ...prod,
            stock: Math.max(0, prod.stock - qtySum),
          };
          saveProductToFirestore(updatedProd).catch((e) =>
            console.warn('Stock update in Firestore failed', e)
          );
          return updatedProd;
        }
        return prod;
      })
    );

    // Save order in Firestore & local state
    saveOrderToFirestore(newOrder).catch((e) =>
      console.warn('Order save in Firestore failed', e)
    );
    setOrders((prev) => [newOrder, ...prev]);

    // Clear cart and checkout modal
    setCart([]);
    setActivePromo(null);
    setIsCheckoutOpen(false);

    // Open confirmation
    setRecentOrderConfirmation(newOrder);
  };

  // Filter & sort logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'Alle') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, selectedCategory, sortBy]);

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* Admin Mode Status Banner */}
      {isAdminLoggedIn && (
        <aside
          aria-label="Admin Status"
          className="bg-amber-950 text-amber-100 text-xs py-2 px-4 flex items-center justify-between border-b border-amber-900"
        >
          <div className="flex items-center gap-2 max-w-7xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold text-white">Administrator-Modus aktiv</span>
              <span className="text-amber-300 hidden sm:inline">
                · {products.length} Produkte im Katalog · Firestore Cloud-Datenbank live synchronisiert
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsAdminModalOpen(true)}
                className="bg-amber-800 hover:bg-amber-700 text-white font-medium text-[11px] px-2.5 py-1 rounded transition-colors"
              >
                Admin-Dashboard öffnen
              </button>
              <button
                onClick={handleAdminLogout}
                className="text-amber-300 hover:text-white text-[11px] underline"
              >
                Abmelden
              </button>
            </div>
          </div>
        </aside>
      )}

      {/* Top Banner */}
      <TopBanner />

      {/* Header conforming strictly to Top Bar Contract */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        orderCount={orders.length}
        currency={currency}
        isAdmin={isAdminLoggedIn}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
        onSelectCurrency={setCurrency}
      />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Campaign Section */}
        <Hero />

        {/* Product Catalog Section */}
        <section id="produkte" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-200">
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block mb-1">
                Kollektion 2026
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-display">
                Die 3 Design-Ikonen
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 mt-1">
                Kompakt, vollendet und sofort lieferbar. Schnelle Bezahlung direkt mit PayPal.
              </p>
            </div>

            {/* Live Filter & Search Controls */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Segmented Control */}
              <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-lg text-xs font-medium text-stone-700">
                {['Alle', 'Audio & Akustik', 'Raum & Licht', 'Living & Wohlbefinden'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white text-stone-950 shadow-xs font-semibold'
                        : 'hover:text-stone-950 text-stone-600'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort By Dropdown */}
              <div className="flex items-center bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-700">
                <SlidersHorizontal className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent focus:outline-none cursor-pointer pr-1 text-xs"
                  aria-label="Sortierung auswählen"
                >
                  <option value="featured">Empfohlen</option>
                  <option value="price-asc">Preis aufsteigend</option>
                  <option value="price-desc">Preis absteigend</option>
                  <option value="rating">Beste Bewertung</option>
                </select>
              </div>

              {/* Live Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Suchen..."
                  className="bg-white border border-stone-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 w-36 sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Product Grid: 3-column layout */}
          {filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-stone-500 space-y-3 bg-stone-100/50 rounded-2xl border border-dashed border-stone-300">
              <p className="text-base font-semibold text-stone-800">Keine Produkte gefunden</p>
              <p className="text-xs text-stone-500">
                Passen Sie Ihre Suche oder den Filter an, um die Kollektion zu sehen.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('Alle');
                }}
                className="text-xs font-semibold text-stone-900 underline underline-offset-4"
              >
                Filter zurücksetzen
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  currency={currency}
                  isWishlisted={wishlist.includes(product.id)}
                  onOpenDetails={(p) => setSelectedProductForModal(p)}
                  onQuickAddToCart={handleQuickAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}

          {/* PayPal Banner Strip in Collection */}
          <div className="mt-14 bg-gradient-to-r from-blue-50/80 via-white to-amber-50/80 rounded-2xl p-6 sm:p-8 border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <span className="font-bold tracking-tight text-xl italic font-serif text-[#003087]">
                  PayPal
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Einfach & Sicher Bezahlen
                </span>
              </div>
              <p className="text-xs text-stone-600 max-w-xl">
                Bestellen Sie bequem in 1 Klick ohne Weitergabe sensibler Bankdaten. Genießen Sie 180 Tage PayPal-Käuferschutz und flexible Zahlungsweisen wie Ratenzahlung oder Später Bezahlen.
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => {
                  if (cart.length > 0) {
                    setIsCheckoutOpen(true);
                  } else {
                    handleQuickAddToCart(products[0]);
                    setIsCheckoutOpen(true);
                  }
                }}
                className="bg-[#ffc439] hover:bg-[#f4b82d] text-[#003087] font-bold text-xs px-5 py-3 rounded-xl shadow-xs transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <span className="italic font-serif text-sm">PayPal</span>
                <span className="text-stone-900 font-semibold">Jetzt Express-Kasse testen</span>
              </button>
            </div>
          </div>
        </section>

        {/* Brand & Craftsmanship Section */}
        <StorySection />

        {/* Service, Shipping & Guarantees */}
        <ServicePillars />
      </main>

      {/* Footer */}
      <Footer
        onOpenOrders={() => setIsOrdersOpen(true)}
        onOpenAdmin={() => setIsAdminModalOpen(true)}
      />

      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-stone-100 text-xs py-3 px-4 rounded-xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300 border border-stone-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        items={cart}
        currency={currency}
        activePromo={activePromo}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onApplyPromo={handleApplyPromo}
        onRemovePromo={() => setActivePromo(null)}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProductForModal}
        currency={currency}
        isWishlisted={selectedProductForModal ? wishlist.includes(selectedProductForModal.id) : false}
        onClose={() => setSelectedProductForModal(null)}
        onAddToCart={handleAddToCart}
        onInstantPayPalBuy={handleInstantPayPalBuy}
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        items={cart}
        currency={currency}
        activePromo={activePromo}
        onClose={() => setIsCheckoutOpen(false)}
        onCompleteOrder={handleCompleteOrder}
      />

      {/* Order Confirmation Modal */}
      <OrderConfirmationModal
        order={recentOrderConfirmation}
        currency={currency}
        onClose={() => setRecentOrderConfirmation(null)}
        onOpenInvoice={(ord) => {
          setRecentOrderConfirmation(null);
          setActiveInvoiceOrder(ord);
        }}
      />

      {/* Orders History Modal */}
      <OrdersModal
        isOpen={isOrdersOpen}
        orders={orders}
        currency={currency}
        onClose={() => setIsOrdersOpen(false)}
        onOpenInvoice={(ord) => {
          setIsOrdersOpen(false);
          setActiveInvoiceOrder(ord);
        }}
      />

      {/* Wishlist Modal */}
      <WishlistModal
        isOpen={isWishlistOpen}
        wishlistProducts={wishlistProducts}
        currency={currency}
        onClose={() => setIsWishlistOpen(false)}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleQuickAddToCart}
      />

      {/* Printable Invoice Modal */}
      <InvoiceModal
        order={activeInvoiceOrder}
        currency={currency}
        onClose={() => setActiveInvoiceOrder(null)}
      />

      {/* Admin Management Modal */}
      <AdminModal
        isOpen={isAdminModalOpen}
        isLoggedIn={isAdminLoggedIn}
        products={products}
        orders={orders}
        currency={currency}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        onClose={() => setIsAdminModalOpen(false)}
        onSaveProduct={handleSaveProduct}
        onDeleteProduct={handleDeleteProduct}
        onResetToDefault={handleResetProducts}
        onUpdateOrderStatus={handleUpdateOrderStatus}
      />
    </div>
  );
}
