export interface MenuItem {
  id: string;
  name: string;
  price: number;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

export const menuData: MenuCategory[] = [
  {
    category: '🍚 NASI',
    items: [
      { id: 'nasi-uduk', name: 'Nasi Uduk', price: 9546 },
      { id: 'nasi-biasa', name: 'Nasi Biasa', price: 9091 },
    ],
  },
  {
    category: '🦆🍗 LAUK BEBEK & AYAM (1/2 Ekor)',
    items: [
      { id: 'bebek-madura', name: 'Bebek Muda Madura', price: 39910 },
      { id: 'bebek-kremes', name: 'Bebek Muda Goreng Kremes', price: 39910 },
      { id: 'bebek-bakar', name: 'Bebek Muda Bakar', price: 39910 },
      { id: 'bebek-penyetan', name: 'Bebek Penyetan', price: 39910 },
      { id: 'ayam-kremes', name: 'Ayam Kampung Goreng Kremes', price: 39546 },
      { id: 'ayam-bakar', name: 'Ayam Kampung Bakar', price: 39546 },
      { id: 'ayam-madura', name: 'Ayam Kampung ala Madura', price: 39546 },
    ],
  },
  {
    category: '🍹 MINUMAN',
    items: [
      { id: 'fanta', name: 'Fanta', price: 9546 },
      { id: 'air-mineral', name: 'Air Mineral', price: 9091 },
      { id: 'es-teh', name: 'Es Teh Manis', price: 9091 },
      { id: 'teh-hangat', name: 'Teh Manis Hangat', price: 8182 },
    ],
  },
];
