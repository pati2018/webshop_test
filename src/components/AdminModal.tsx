import React, { useState, useRef } from 'react';
import {
  X,
  Plus,
  Pencil,
  Trash2,
  Package,
  ShieldAlert,
  RotateCcw,
  Check,
  Search,
  Sliders,
  DollarSign,
  AlertTriangle,
  Lock,
  LogOut,
  ExternalLink,
  Truck,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { Product, ProductVariant, Order, Currency } from '../types';
import { formatPrice } from '../utils/formatters';
import { processAndCompressImage } from '../utils/imageUtils';

interface AdminModalProps {
  isOpen: boolean;
  isLoggedIn: boolean;
  products: Product[];
  orders: Order[];
  currency: Currency;
  onLogin: (pin: string) => boolean;
  onLogout: () => void;
  onClose: () => void;
  onSaveProduct: (product: Product, isNew: boolean) => void;
  onDeleteProduct: (productId: string) => void;
  onResetToDefault: () => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  isLoggedIn,
  products,
  orders,
  currency,
  onLogin,
  onLogout,
  onClose,
  onSaveProduct,
  onDeleteProduct,
  onResetToDefault,
  onUpdateOrderStatus,
}) => {
  // Login form state
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'reset'>('products');

  // Product editor state
  const [isEditing, setIsEditing] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product>>({});
  const [formError, setFormError] = useState<string | null>(null);

  // Filter & Search inside Admin
  const [adminSearch, setAdminSearch] = useState('');

  // In-App Deletion and Reset Dialog states (no browser confirm dialogs)
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // PC Image Upload state & handlers
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedImage(file);
  };

  const handleImageDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processSelectedImage(file);
  };

  const processSelectedImage = async (file: File) => {
    setIsProcessingImage(true);
    setFormError(null);
    try {
      const { dataUrl, sizeKb } = await processAndCompressImage(file);
      setEditingProduct((prev) => ({ ...prev, image: dataUrl }));
      setUploadedFileName(`${file.name} (${sizeKb} KB)`);
    } catch (err: any) {
      setFormError(err.message || 'Fehler beim Laden des Bildes.');
    } finally {
      setIsProcessingImage(false);
    }
  };

  if (!isOpen) return null;

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLogin(pinInput)) {
      setLoginError(null);
      setPinInput('');
    } else {
      setLoginError('Ungültiger Admin-PIN. Verwenden Sie 1234 für den Demo-Zugang.');
    }
  };

  // Start new product
  const handleAddNewProduct = () => {
    setEditingProduct({
      id: `custom-prod-${Date.now()}`,
      name: '',
      subtitle: '',
      price: 99.0,
      category: 'Living & Wohlbefinden',
      stock: 10,
      rating: 5.0,
      reviewCount: 1,
      badge: 'Neu',
      image: '/src/assets/images/hero_minimalist_storefront_1792142507126.jpg',
      description: 'Hochwertiges Designobjekt mit puristischer Formensprache und langlebigen Materialien.',
      highlights: ['Handverlesene Materialien', 'Nachhaltig und langlebig gefertigt', '2 Jahre Garantie'],
      specs: [
        { label: 'Material', value: 'Aluminium & Eichenholz' },
        { label: 'Maße', value: '25 x 15 x 10 cm' },
      ],
      variants: [
        { id: 'v1', name: 'Standard Schwarz', colorHex: '#18181B' },
        { id: 'v2', name: 'Natur Sand', colorHex: '#E7E5E4' },
      ],
      careInstructions: 'Mit trockenem Tuch reinigen.',
      shippingInfo: 'Versandfertig in 24 Stunden.',
      reviews: [
        {
          id: `rev-${Date.now()}`,
          author: 'Admin Test',
          rating: 5,
          date: 'Heute',
          comment: 'Neues Produkt im Shopkatalog eingepflegt.',
          verified: true,
        },
      ],
    });
    setUploadedFileName(null);
    setIsNewProduct(true);
    setIsEditing(true);
    setFormError(null);
  };

  // Start editing existing product
  const handleStartEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setUploadedFileName(product.image?.startsWith('data:') ? 'Hochgeladenes Bild vorhanden' : null);
    setIsNewProduct(false);
    setIsEditing(true);
    setFormError(null);
  };

  // Save product form
  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct.name?.trim()) {
      setFormError('Produktname ist erforderlich.');
      return;
    }
    if (!editingProduct.price || editingProduct.price <= 0) {
      setFormError('Bitte einen gültigen Preis angeben.');
      return;
    }

    const fullProduct: Product = {
      id: editingProduct.id || `prod-${Date.now()}`,
      name: editingProduct.name.trim(),
      subtitle: editingProduct.subtitle || '',
      price: Number(editingProduct.price),
      category: (editingProduct.category as any) || 'Living & Wohlbefinden',
      stock: Number(editingProduct.stock ?? 10),
      rating: Number(editingProduct.rating ?? 4.9),
      reviewCount: Number(editingProduct.reviewCount ?? 1),
      badge: editingProduct.badge || undefined,
      image: editingProduct.image || '/src/assets/images/hero_minimalist_storefront_1792142507126.jpg',
      description: editingProduct.description || '',
      highlights: editingProduct.highlights || ['Premium Qualität'],
      specs: editingProduct.specs || [{ label: 'Ausführung', value: 'Standard' }],
      variants: editingProduct.variants || [{ id: 'std', name: 'Standard', colorHex: '#18181B' }],
      careInstructions: editingProduct.careInstructions || 'Pflegeleicht.',
      shippingInfo: editingProduct.shippingInfo || 'Lieferung 1-2 Werktage.',
      reviews: editingProduct.reviews || [],
    };

    onSaveProduct(fullProduct, isNewProduct);
    setIsEditing(false);
    setEditingProduct({});
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(adminSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-stone-200">
        {/* Admin Header */}
        <div className="sticky top-0 z-10 bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg tracking-tight uppercase">
              KONTUR Studio
            </span>
            <span className="text-stone-600">|</span>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              Admin-Bereich
            </span>
            <span className="text-stone-600 hidden sm:inline">|</span>
            <span className="text-[11px] text-emerald-400 font-mono hidden sm:flex items-center gap-1 bg-stone-800 px-2 py-0.5 rounded">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Firestore Cloud-DB aktiv</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://console.firebase.google.com/project/gen-lang-client-0626167741/firestore/databases/ai-studio-konturstudiowebs-d7a5973e-93d7-4676-9278-cd4f7719ef4b/data"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-amber-300 hover:text-white flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors"
              title="Firestore Datenbank in Google Firebase Console öffnen"
            >
              <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Firebase Console</span>
            </a>

            {isLoggedIn && (
              <button
                onClick={onLogout}
                className="text-xs text-stone-300 hover:text-white flex items-center gap-1 py-1 px-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Abmelden</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 text-stone-400 hover:text-white rounded-lg transition-colors"
              aria-label="Admin schließen"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In View */}
        {!isLoggedIn ? (
          <div className="p-8 sm:p-12 max-w-md mx-auto text-center space-y-6">
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-900 border border-stone-200">
              <Lock className="w-6 h-6" />
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold text-stone-900">Admin-Login</h3>
              <p className="text-xs text-stone-500">
                Geben Sie den Admin-PIN ein, um Produkte zu bearbeiten, neue Artikel hinzuzufügen oder Bestellungen zu verwalten.
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Sicherheits-PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="PIN eingeben (Standard: 1234)"
                  className="w-full bg-stone-50 border border-stone-300 rounded-lg px-3 py-2 text-stone-900 text-sm focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 font-mono tracking-widest text-center"
                  autoFocus
                />
              </div>

              {loginError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-3 rounded-lg shadow-sm transition-all"
              >
                Anmelden
              </button>
            </form>

            {/* Quick Demo Access */}
            <div className="pt-4 border-t border-stone-100">
              <button
                type="button"
                onClick={() => onLogin('1234')}
                className="text-xs text-stone-600 hover:text-stone-900 font-medium underline underline-offset-4"
              >
                Schnellzugang: Als Demo-Admin mit 1 Klick einloggen (PIN 1234)
              </button>
            </div>
          </div>
        ) : (
          /* Logged In View */
          <div className="p-6 sm:p-8 space-y-6">
            {/* Admin Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('products');
                    setIsEditing(false);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'products'
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  Produkte verwalten ({products.length})
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('orders');
                    setIsEditing(false);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    activeTab === 'orders'
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span>PayPal-Bestellungen</span>
                  {orders.length > 0 && (
                    <span className="bg-stone-700 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                      {orders.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('reset');
                    setIsEditing(false);
                  }}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    activeTab === 'reset'
                      ? 'bg-stone-900 text-white font-semibold'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  System & Reset
                </button>
              </div>

              {activeTab === 'products' && !isEditing && (
                <button
                  onClick={handleAddNewProduct}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Neues Produkt hinzufügen</span>
                </button>
              )}
            </div>

            {/* TAB 1: Products Management */}
            {activeTab === 'products' && (
              <div>
                {isEditing ? (
                  /* Edit / Add Product Form */
                  <form onSubmit={handleSaveProductForm} className="space-y-6 bg-stone-50 p-6 rounded-2xl border border-stone-200">
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <h4 className="font-bold text-stone-900 text-sm">
                        {isNewProduct ? 'Neues Produkt anlegen' : `Produkt bearbeiten: ${editingProduct.name}`}
                      </h4>
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="text-xs text-stone-500 hover:text-stone-900 font-medium underline"
                      >
                        Abbrechen
                      </button>
                    </div>

                    {formError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Produktname *</label>
                        <input
                          type="text"
                          value={editingProduct.name || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                          placeholder="z. B. KONTUR Balance Desk Pad"
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Untertitel / Kurzbeschreibung</label>
                        <input
                          type="text"
                          value={editingProduct.subtitle || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, subtitle: e.target.value })}
                          placeholder="z. B. Handgefertigte Schreibtischauflage aus Leder"
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Preis (€ inkl. MwSt.) *</label>
                        <input
                          type="number"
                          step="0.01"
                          min="1"
                          value={editingProduct.price || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Kategorie</label>
                        <select
                          value={editingProduct.category || 'Living & Wohlbefinden'}
                          onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as any })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                        >
                          <option value="Audio & Akustik">Audio & Akustik</option>
                          <option value="Raum & Licht">Raum & Licht</option>
                          <option value="Living & Wohlbefinden">Living & Wohlbefinden</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Lagerbestand (Stück) *</label>
                        <input
                          type="number"
                          min="0"
                          value={editingProduct.stock ?? 10}
                          onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Badge / Tag (optional)</label>
                        <input
                          type="text"
                          value={editingProduct.badge || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                          placeholder="z. B. Bestseller, Neu, Limited"
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900"
                        />
                      </div>

                      {/* PC Image Upload Section */}
                      <div className="sm:col-span-2 space-y-2">
                        <label className="block text-stone-700 font-semibold">
                          Produktbild vom PC hochladen *
                        </label>

                        {/* Hidden Native File Input */}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageFileChange}
                          accept="image/png, image/jpeg, image/jpg, image/webp"
                          className="hidden"
                          aria-label="Produktbild vom Computer auswählen"
                        />

                        {isProcessingImage ? (
                          <div className="p-8 border-2 border-dashed border-stone-300 rounded-2xl bg-stone-100 flex flex-col items-center justify-center text-center space-y-2">
                            <Loader2 className="w-8 h-8 text-stone-900 animate-spin" />
                            <span className="text-xs font-semibold text-stone-800">
                              Bild wird optimiert und vom PC geladen...
                            </span>
                            <span className="text-[11px] text-stone-500">
                              Wird automatisch komprimiert für schnelle Ladezeiten im Shop
                            </span>
                          </div>
                        ) : editingProduct.image ? (
                          /* Image Preview & Replacement Box */
                          <div className="p-4 bg-white border border-stone-200 rounded-2xl flex flex-col sm:flex-row items-center gap-5">
                            <div className="relative aspect-[4/3] w-36 sm:w-44 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 shadow-inner">
                              <img
                                src={editingProduct.image}
                                alt="Vorschau"
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="flex-1 space-y-2 text-center sm:text-left">
                              <div className="space-y-0.5">
                                <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-bold text-stone-900">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                  <span>Produktbild bereit</span>
                                </div>
                                <p className="text-[11px] text-stone-500">
                                  {uploadedFileName
                                    ? `Hochgeladen: ${uploadedFileName}`
                                    : 'Bereits verknüpftes Produktfoto'}
                                </p>
                              </div>

                              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                                >
                                  <Upload className="w-3.5 h-3.5" />
                                  <span>Neues Foto vom PC wählen</span>
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingProduct((prev) => ({ ...prev, image: '' }));
                                    setUploadedFileName(null);
                                  }}
                                  className="text-stone-500 hover:text-rose-600 text-xs px-2.5 py-2 rounded-lg hover:bg-stone-100 transition-colors"
                                >
                                  Entfernen
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Drag & Drop Upload Dropzone */
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleImageDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className="p-8 border-2 border-dashed border-stone-300 hover:border-stone-500 rounded-2xl bg-white hover:bg-stone-50/50 cursor-pointer transition-all flex flex-col items-center justify-center text-center space-y-3 group"
                          >
                            <div className="w-12 h-12 rounded-full bg-stone-100 group-hover:bg-stone-200/80 text-stone-700 flex items-center justify-center transition-colors">
                              <Upload className="w-6 h-6 text-stone-800" />
                            </div>

                            <div className="space-y-1">
                              <div className="text-xs font-bold text-stone-900">
                                Klicken, um ein Bild vom Computer auszuwählen
                              </div>
                              <p className="text-[11px] text-stone-500">
                                oder Bilddatei einfach hierher in das Feld ziehen (Drag & Drop)
                              </p>
                              <p className="text-[10px] text-stone-400">
                                Unterstützt JPG, PNG, WEBP · Automatische Skalierung für beste Shop-Performance
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                fileInputRef.current?.click();
                              }}
                              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-xs"
                            >
                              Datei vom PC auswählen
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-stone-700 font-semibold mb-1">Ausführliche Beschreibung</label>
                        <textarea
                          rows={3}
                          value={editingProduct.description || ''}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-900 text-xs"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                      <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 px-4 py-2 rounded-lg text-xs font-medium"
                      >
                        Abbrechen
                      </button>
                      <button
                        type="submit"
                        className="bg-stone-900 hover:bg-stone-800 text-white px-5 py-2 rounded-lg text-xs font-semibold shadow-sm"
                      >
                        {isNewProduct ? 'Produkt im Shop veröffentlichen' : 'Änderungen speichern'}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Products Table */
                  <div className="space-y-4">
                    {/* Search inside admin */}
                    <div className="flex items-center justify-between gap-4">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={adminSearch}
                          onChange={(e) => setAdminSearch(e.target.value)}
                          placeholder="Produkte durchsuchen..."
                          className="w-full bg-stone-50 border border-stone-200 rounded-lg pl-9 pr-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                        />
                      </div>
                      <span className="text-xs text-stone-500">
                        {filteredProducts.length} von {products.length} Produkten gelistet
                      </span>
                    </div>

                    <div className="border border-stone-200 rounded-xl overflow-hidden bg-white">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px] tracking-wider">
                          <tr>
                            <th className="py-3 px-4">Produkt</th>
                            <th className="py-3 px-4">Kategorie</th>
                            <th className="py-3 px-4">Preis</th>
                            <th className="py-3 px-4">Lagerbestand</th>
                            <th className="py-3 px-4 text-right">Aktionen</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-150">
                          {filteredProducts.map((p) => (
                            <tr key={p.id} className="hover:bg-stone-50/80 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-3">
                                  <img
                                    src={p.image}
                                    alt={p.name}
                                    className="w-10 h-10 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-200"
                                  />
                                  <div>
                                    <div className="font-semibold text-stone-900">{p.name}</div>
                                    <div className="text-[11px] text-stone-400">ID: {p.id}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-stone-600">{p.category}</td>
                              <td className="py-3 px-4 font-mono font-bold text-stone-900 tabular-nums">
                                {formatPrice(p.price, currency)}
                              </td>
                              <td className="py-3 px-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] font-mono font-medium ${
                                    p.stock <= 3
                                      ? 'bg-rose-100 text-rose-800'
                                      : p.stock <= 10
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-emerald-100 text-emerald-800'
                                  }`}
                                >
                                  {p.stock} Stk.
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleStartEdit(p)}
                                    className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded transition-colors"
                                    title="Bearbeiten"
                                    aria-label="Bearbeiten"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setProductToDelete(p)}
                                    className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                                    title="Löschen"
                                    aria-label="Löschen"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Orders & PayPal Transactions */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-stone-900 text-sm">
                    Eingegangene PayPal-Bestellungen ({orders.length})
                  </h4>
                  <span className="text-xs text-stone-500">
                    Gesamtumsatz:{' '}
                    <strong className="text-stone-900 font-mono">
                      {formatPrice(
                        orders.reduce((sum, o) => sum + o.total, 0),
                        currency
                      )}
                    </strong>
                  </span>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-stone-500 bg-stone-50 rounded-xl border border-dashed border-stone-200">
                    <Package className="w-10 h-10 text-stone-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-stone-800">Noch keine Bestellungen eingegangen</p>
                    <p className="text-[11px] text-stone-500">
                      Sobald Kunden im Shop per PayPal bestellen, werden sie hier in Echtzeit gelistet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map((ord) => (
                      <div
                        key={ord.id}
                        className="p-4 rounded-xl border border-stone-200 bg-stone-50 text-xs space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-200">
                          <div>
                            <span className="font-mono font-bold text-stone-900 text-sm">{ord.id}</span>
                            <span className="text-stone-400 ml-2">· {ord.date}</span>
                            <span className="text-[#0070BA] font-semibold ml-2">PayPal</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-stone-500 text-[11px]">Status ändern:</span>
                            <select
                              value={ord.status}
                              onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                              className="bg-white border border-stone-300 rounded px-2 py-1 text-xs text-stone-800 font-semibold focus:outline-none"
                            >
                              <option value="Bezahlt">Bezahlt</option>
                              <option value="In Bearbeitung">In Bearbeitung</option>
                              <option value="Versendet">Versendet (DHL)</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <span className="font-semibold text-stone-800 block mb-1">Kunde & Versand:</span>
                            <div className="text-stone-600">
                              {ord.shippingAddress.firstName} {ord.shippingAddress.lastName} ({ord.shippingAddress.email})
                            </div>
                            <div className="text-stone-500 text-[11px]">
                              {ord.shippingAddress.street}, {ord.shippingAddress.postalCode} {ord.shippingAddress.city}
                            </div>
                            <div className="text-stone-500 text-[11px] mt-0.5">
                              Versandart: {ord.shippingMethod === 'standard' ? 'DHL Standard' : 'DHL Express'}
                            </div>
                          </div>

                          <div>
                            <span className="font-semibold text-stone-800 block mb-1">
                              PayPal Transaktion:
                            </span>
                            <div className="font-mono text-stone-700 bg-white px-2 py-1 rounded border border-stone-200 text-[11px] truncate">
                              {ord.paypalTransactionId}
                            </div>
                            <div className="mt-2 text-right">
                              <span className="text-stone-500 text-[11px]">Gesamtbetrag: </span>
                              <span className="font-mono font-bold text-stone-900 text-sm">
                                {formatPrice(ord.total, currency)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Reset / System */}
            {activeTab === 'reset' && (
              <div className="space-y-4">
                {/* Cloud Database Info Box */}
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span>Google Cloud Firestore Datenbank</span>
                    </h4>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                      Status: Verbunden
                    </span>
                  </div>

                  <p className="text-stone-600 leading-relaxed">
                    Alle Produkte und eingegangenen PayPal-Bestellungen werden in Echtzeit in der Google Cloud Firestore-Datenbank gespeichert.
                  </p>

                  <div className="bg-white p-3.5 rounded-xl border border-stone-200 font-mono text-[11px] space-y-1 text-stone-700">
                    <div>
                      <span className="text-stone-400">Projekt-ID:</span>{' '}
                      <strong>gen-lang-client-0626167741</strong>
                    </div>
                    <div>
                      <span className="text-stone-400">Database-ID:</span>{' '}
                      <span className="break-all">ai-studio-konturstudiowebs-d7a5973e-93d7-4676-9278-cd4f7719ef4b</span>
                    </div>
                    <div>
                      <span className="text-stone-400">Collections:</span>{' '}
                      <span>/products &nbsp;|&nbsp; /orders</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <a
                      href="https://console.firebase.google.com/project/gen-lang-client-0626167741/firestore/databases/ai-studio-konturstudiowebs-d7a5973e-93d7-4676-9278-cd4f7719ef4b/data"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#003087] hover:bg-[#002060] text-white font-semibold px-4 py-2.5 rounded-lg text-xs transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-4 h-4 text-[#ffc439]" />
                      <span>Datenbank in Firebase Console öffnen</span>
                    </a>
                  </div>
                </div>

                {/* Reset Box */}
                <div className="p-6 bg-stone-50 rounded-2xl border border-stone-200 space-y-4 text-xs">
                  <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-stone-700" />
                    <span>Katalog auf Originalzustand zurücksetzen</span>
                  </h4>
                  <p className="text-stone-600 leading-relaxed">
                    Falls Sie Test-Produkte angelegt oder gelöscht haben, können Sie mit dieser Funktion den
                    Webshop auf die 3 originalen KONTUR-Design-Produkte (Kopfhörer, Tischleuchte, Diffusor) mit den Standard-Lagerbeständen zurücksetzen.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsResetConfirmOpen(true)}
                    className="bg-rose-700 hover:bg-rose-800 text-white font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Katalog jetzt auf die 3 Ursprungsprodukte zurücksetzen</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* IN-APP CONFIRMATION MODAL: PRODUCT DELETION */}
        {productToDelete && (
          <div
            className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setProductToDelete(null)}
          >
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-base font-bold text-stone-900">Produkt wirklich löschen?</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Möchten Sie das Produkt <strong>„{productToDelete.name}“</strong> wirklich unwiderruflich aus dem Shop und der Firestore-Cloud-Datenbank entfernen?
                </p>
                <div className="flex items-center justify-center gap-2 p-2 bg-stone-50 rounded-lg text-xs text-stone-500 font-mono">
                  <span>ID: {productToDelete.id}</span>
                  <span>·</span>
                  <span>{formatPrice(productToDelete.price, currency)}</span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const id = productToDelete.id;
                    setProductToDelete(null);
                    onDeleteProduct(id);
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Ja, endgültig löschen
                </button>
              </div>
            </div>
          </div>
        )}

        {/* IN-APP CONFIRMATION MODAL: CATALOG RESET */}
        {isResetConfirmOpen && (
          <div
            className="fixed inset-0 z-60 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
            onClick={() => setIsResetConfirmOpen(false)}
          >
            <div
              className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                <RotateCcw className="w-6 h-6" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="text-base font-bold text-stone-900">Katalog zurücksetzen?</h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Alle manuell hinzugefügten Produkte werden gelöscht und der Shop wird auf die 3 originalen KONTUR-Design-Objekte zurückgestellt.
                </p>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 py-2.5 rounded-xl text-xs font-semibold transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsResetConfirmOpen(false);
                    onResetToDefault();
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-semibold transition-colors shadow-sm"
                >
                  Zurücksetzen
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
