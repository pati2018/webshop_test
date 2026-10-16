import { Product, PromoCode } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'kontur-one',
    name: 'KONTUR One Studio-Kopfhörer',
    subtitle: 'Kabelloser Over-Ear Kopfhörer mit hybrider Geräuschunterdrückung',
    price: 189.0,
    category: 'Audio & Akustik',
    image: '/src/assets/images/product_studio_headphones_1792142507876.jpg',
    rating: 4.9,
    reviewCount: 128,
    stock: 14,
    badge: 'Bestseller',
    description:
      'Der KONTUR One kombiniert kompromisslose Klangtreue mit minimalistischem Industriedesign. Ausgestattet mit maßgefertigten 40-mm-Beryllium-Treibern und aktiver Hybrid-Geräuschunterdrückung (ANC) für ein ungestörtes Hörerlebnis in Studioqualität. Das ergonomische Kopfband aus Memory-Schaum und weichem Proteinleder garantiert stundenlangen Tragekomfort.',
    highlights: [
      'Hybrides Active Noise Cancelling (ANC) mit Transparenzmodus',
      'Bis zu 40 Stunden Akkulaufzeit mit Schnellladefunktion (10 Min = 5h)',
      '40 mm Beryllium-beschichtete Akustiktreiber für präzise Bässe',
      'Bluetooth 5.3 mit Multipoint-Konnektivität für 2 Geräte gleichzeitig',
      'Gehäuse aus eloxiertem Aluminium und veganem Leder',
    ],
    specs: [
      { label: 'Frequenzbereich', value: '10 Hz – 40.000 Hz' },
      { label: 'Akkulaufzeit', value: '40 Stunden (ANC an), 55 Stunden (ANC aus)' },
      { label: 'Ladeanschluss', value: 'USB-C Fast Charging (Kabel enthalten)' },
      { label: 'Gewicht', value: '254 g' },
      { label: 'Konnektivität', value: 'Bluetooth 5.3 & 3,5 mm Klinkenkabel' },
    ],
    variants: [
      { id: 'slate', name: 'Graphitgrau', colorHex: '#475569' },
      { id: 'black', name: 'Titan-Schwarz', colorHex: '#18181B' },
      { id: 'champagne', name: 'Champagner-Beige', colorHex: '#D6D3D1' },
    ],
    careInstructions:
      'Ohrpolster mit einem leicht angefeuchteten Mikrofasertuch reinigen. Vor Feuchtigkeit und extremen Temperaturen schützen. Im mitgelieferten Hartschalen-Etui aufbewahren.',
    shippingInfo: 'Kostenloser DHL Expressversand innerhalb Deutschlands. Lieferzeit 1-2 Werktage.',
    reviews: [
      {
        id: 'rev-1',
        author: 'Moritz V.',
        rating: 5,
        date: '14. Oktober 2026',
        comment: 'Der Klang ist phänomenal aufgelöst und das Noise Cancelling filtert Bürolärm perfekt heraus. Verarbeitung auf Top-Niveau!',
        verified: true,
      },
      {
        id: 'rev-2',
        author: 'Elena S.',
        rating: 5,
        date: '02. Oktober 2026',
        comment: 'Wunderschönes, schlichtes Design ohne aufdringliche Logos. Der Tragekomfort auch mit Brille ist hervorragend.',
        verified: true,
      },
    ],
  },
  {
    id: 'aura-desk',
    name: 'AURA Desk Minimalistische Leuchte',
    subtitle: 'Architektonische LED-Tischleuchte mit stufenlosem Dimming',
    price: 129.0,
    category: 'Raum & Licht',
    image: '/src/assets/images/product_architectural_desk_lamp_1792142509131.jpg',
    rating: 4.8,
    reviewCount: 84,
    stock: 9,
    badge: 'Design Award',
    description:
      'Die AURA Desk Leuchte definiert Arbeitsplatzbeleuchtung neu. Gefertigt aus mattschwarz eloxiertem Flugzeugaluminium mit feinen Messingakzenten. Der ringförmige Leuchtkopf spendet blendfreies, tageslichtähnliches Licht mit einem außergewöhnlich hohen Farbwiedergabeindex (CRI > 97) zur Schonung der Augen.',
    highlights: [
      'Stufenloses Touch-Dimming mit Memory-Funktion',
      'Einstellbare Farbtemperatur von 2200K (Warmglow) bis 4000K (Fokuslicht)',
      'Präzises 360-Grad-Messinggelenk für exakte Lichtausrichtung',
      'Integrierter USB-C Ladeport im massiven Sockel für Smartphone & Zubehör',
      'Energieeffiziente 12W LED-Einheit mit über 50.000 Stunden Lebensdauer',
    ],
    specs: [
      { label: 'Material', value: 'Eloxiertes Aluminium, massives Messing, Gusseisensockel' },
      { label: 'Lichtstrom', value: 'Bis zu 950 Lumen (stufenlos dimmbar)' },
      { label: 'Farbwiedergabe', value: 'CRI 97+ (R9 > 90)' },
      { label: 'Stromversorgung', value: '24V Steckernetzteil mit Textilkabel (2m)' },
      { label: 'Maße', value: 'Höhe: 46 cm, Reichweite Arm: 52 cm, Sockel: 16x12 cm' },
    ],
    variants: [
      { id: 'matte-black', name: 'Mattschwarz & Messing', colorHex: '#18181B' },
      { id: 'brushed-brass', name: 'Poliertes Messing', colorHex: '#CA8A04' },
      { id: 'anodized-silver', name: 'Alu-Silber matt', colorHex: '#94A3B8' },
    ],
    careInstructions:
      'Vor der Reinigung vom Strom trennen. Mit einem weichen, trockenen Tuch abstauben. Keine Scheuermittel oder scharfen Lösungsmittel verwenden.',
    shippingInfo: 'Sicher verpackt im umweltfreundlichen Karton. Versandfertig in 24 Stunden.',
    reviews: [
      {
        id: 'rev-3',
        author: 'Florian K.',
        rating: 5,
        date: '28. September 2026',
        comment: 'Das Licht ist absolut augenschonend beim abendlichen Arbeiten. Das Messingdetail verleiht dem Schreibtisch einen eleganten Touch.',
        verified: true,
      },
      {
        id: 'rev-4',
        author: 'Sophie B.',
        rating: 4,
        date: '19. September 2026',
        comment: 'Sehr hochwertig und schwerer, standfester Sockel. Das Dimmen reagiert extrem flüssig.',
        verified: true,
      },
    ],
  },
  {
    id: 'forma-diffuser',
    name: 'FORMA Keramik Aroma-Diffusor',
    subtitle: 'Handgefertigter Ultraschall-Diffusor aus feinstem Steinzeug',
    price: 69.0,
    category: 'Living & Wohlbefinden',
    image: '/src/assets/images/product_ceramic_aroma_diffuser_1792142508990.jpg',
    rating: 4.9,
    reviewCount: 96,
    stock: 18,
    badge: 'Handgefertigt',
    description:
      'Der FORMA Diffusor verwandelt jeden Wohnraum in eine Oase der Ruhe. Jede Abdeckung wird in Portugal aus natürlichem Ton gegossen und mattiert. Die flüsterleise Ultraschall-Technologie verteilt ätherische Öle als mikrofeinen Kaltnebel, ohne die molekulare Struktur der Düfte durch Hitze zu beschädigen.',
    highlights: [
      'Handgefertigte Keramikhaube mit natürlicher Textur',
      'Flüsterleiser Betrieb unter 20 dB – ideal fürs Schlafzimmer',
      'Zwei Nebel-Modi: Kontinuierlich (bis 8h) oder Intervallmodus (bis 16h)',
      'Warmweißes Ambient-Licht separat vom Nebel schaltbar',
      'Sicherheits-Abschaltautomatik bei leerem 180ml Wassertank',
    ],
    specs: [
      { label: 'Material', value: 'Steinzeugkeramik, BPA-freier Kunststofftank' },
      { label: 'Tankvolumen', value: '180 ml' },
      { label: 'Raumgröße', value: 'Optimal für Räume bis 45 m²' },
      { label: 'Lautstärke', value: '< 20 dB (unhörbar)' },
      { label: 'Lieferumfang', value: 'Diffusor, USB-C Textilkabel, Messbecher, Anleitung' },
    ],
    variants: [
      { id: 'chalk-white', name: 'Kreideweiß matt', colorHex: '#F5F5F4' },
      { id: 'stone-grey', name: 'Naturstein-Grau', colorHex: '#78716C' },
      { id: 'warm-terracotta', name: 'Terrakotta-Sand', colorHex: '#B45309' },
    ],
    careInstructions:
      'Wassertank alle 5-7 Tage mit warmem Wasser und einem Tropfen Essig ausspülen. Die Ultraschall-Membran vorsichtig mit einem Wattestäbchen reinigen.',
    shippingInfo: 'Inklusive 100% plastikfreier Schutzverpackung.',
    reviews: [
      {
        id: 'rev-5',
        author: 'Carina M.',
        rating: 5,
        date: '08. Oktober 2026',
        comment: 'Sieht aus wie eine Design-Vase und zerstäubt Lavendelöl unglaublich fein. Die automatische Abschaltung funktioniert zuverlässig.',
        verified: true,
      },
      {
        id: 'rev-6',
        author: 'Jonas W.',
        rating: 5,
        date: '25. September 2026',
        comment: 'Das Material fasst sich toll an, nicht dieses billige Plastik wie sonst überall. Absolute Kaufempfehlung!',
        verified: true,
      },
    ],
  },
];

export const AVAILABLE_PROMO_CODES: PromoCode[] = [
  {
    code: 'WILLKOMMEN10',
    discountPercent: 10,
    description: '10% Willkommensrabatt auf Ihre Bestellung',
  },
  {
    code: 'KONTUR20',
    discountPercent: 20,
    minSpend: 150,
    description: '20% Rabatt ab einem Bestellwert von 150 €',
  },
  {
    code: 'VERSANDFREI',
    freeShipping: true,
    description: 'Kostenloser Expressversand geschenkt',
  },
];
