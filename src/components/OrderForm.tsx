import { useState } from 'react';
import { menuData } from '../data/menu';
import { supabase } from '../lib/supabase';
import {
  ChevronDown,
  ChevronUp,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface OrderFormProps {
  onSuccess?: () => void;
}

export function OrderForm({ onSuccess }: OrderFormProps) {
  const [name, setName] = useState('');
  const [orders, setOrders] = useState<Record<string, OrderItem>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const [showDetails, setShowDetails] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) => {
      // Auto-collapse: hanya 1 kategori terbuka
      if (prev.has(category)) {
        return new Set(); // Tutup semua
      } else {
        return new Set([category]); // Hanya buka yang diklik
      }
    });
  };

  const getCategoryItemCount = (category: string) => {
    const categoryData = menuData.find((cat) => cat.category === category);
    if (!categoryData) return 0;

    // Cek apakah ada item yang dipilih di kategori ini
    const hasSelectedItem = categoryData.items.some(item => orders[item.id]);
    return hasSelectedItem ? 1 : 0;
  };

  const handleItemSelect = (
    itemId: string,
    itemName: string,
    itemPrice: number,
    category: string
  ) => {
    setOrders((prev) => {
      const newOrders = { ...prev };
      
      // Cek apakah item ini sudah dipilih
      const isCurrentlySelected = newOrders[itemId];
      
      if (isCurrentlySelected) {
        // Jika sudah dipilih, hapus (deselect)
        delete newOrders[itemId];
      } else {
        // Hapus item lain di kategori yang sama (1 item per kategori)
        const categoryData = menuData.find((cat) => cat.category === category);
        if (categoryData) {
          categoryData.items.forEach((item) => {
            if (newOrders[item.id]) {
              delete newOrders[item.id];
            }
          });
        }
        
        // Tambahkan item baru dengan quantity = 1
        newOrders[itemId] = {
          id: itemId,
          name: itemName,
          price: itemPrice,
          quantity: 1,
        };
      }

      return newOrders;
    });
  };

  const calculateSubtotal = () => {
    return Object.values(orders).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleSubmit = async () => {
    // Validasi
    if (!name.trim()) {
      alert('Nama wajib diisi! 😅');
      return;
    }

    if (Object.keys(orders).length === 0) {
      alert('Pesan sesuatu dulu dong! 🍽️');
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        name: name.trim(),
        items: Object.values(orders),
        total: calculateTotal(),
      };

      const { error } = await supabase.from('orders').insert([orderData]);

      if (error) {
        console.error('Error menyimpan pesanan:', error);
        alert('Waduh, ada error nih: ' + error.message);
        return;
      }

      // Sukses!
      setIsSuccess(true);
      onSuccess?.();
    } catch (error) {
      console.error('Error submit order:', error);
      alert('Gagal menyimpan pesanan 😭');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setName('');
    setOrders({});
    setIsSuccess(false);
    setShowDetails(false);
  };

  const orderItems = Object.values(orders);
  const hasOrders = orderItems.length > 0;

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <CheckCircle2 className="w-24 h-24 text-emerald-500 mb-6" />
        <h2 className="text-3xl font-bold text-slate-800 mb-3">
          Pesanan Tercatat! 🎉
        </h2>
        <p className="text-slate-600 mb-2">
          Terima kasih <span className="font-bold text-amber-600">{name}</span>,
          pesanan kamu udah aman tercatat!
        </p>
        <p className="text-slate-500 text-sm mb-8">
          Tinggal tunggu tanggal mainnya aja. See you! 👋
        </p>
        <button
          onClick={handleReset}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-8 py-3 rounded-xl transition-all"
        >
          Pesan Lagi (Buat Temen)
        </button>
      </div>
    );
  }

  return (
    <div className="pb-48">
      {/* Input Nama (RTL) */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm" dir="rtl">
        <label className="block text-xl font-semibold text-slate-800 mb-3">
          مااسمك؟
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ketik nama kamu di sini..."
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors text-slate-800"
        />
      </div>

      {/* Menu Categories (Accordion) */}
      <div className="space-y-4">
        {menuData.map((category) => {
          const isExpanded = expandedCategories.has(category.category);
          const itemCount = getCategoryItemCount(category.category);

          return (
            <div key={category.category} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.category)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-800">
                    {category.category}
                  </span>
                  {itemCount > 0 && (
                    <span className="bg-amber-500 text-white text-sm font-bold px-2.5 py-0.5 rounded-full">
                      {itemCount}
                    </span>
                  )}
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-600" />
                )}
              </button>

              {/* Category Items */}
              {isExpanded && (
                <div className="border-t border-slate-100">
                  {category.items.map((item) => {
                    const isSelected = !!orders[item.id];

                    return (
                      <div
                        key={item.id}
                        className="px-6 py-4 flex items-center justify-between border-b border-slate-50 last:border-b-0"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">
                            {item.name}
                          </p>
                          <p className="text-sm text-amber-600 font-medium">
                            {formatRupiah(item.price)}
                          </p>
                        </div>

                        {/* Select Button */}
                        <button
                          onClick={() =>
                            handleItemSelect(
                              item.id,
                              item.name,
                              item.price,
                              category.category
                            )
                          }
                          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
                            isSelected
                              ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                              : 'bg-amber-500 hover:bg-amber-600 text-white'
                          }`}
                        >
                          {isSelected ? '✓ Dipilih' : 'Pilih'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Floating Summary (Cart) */}
      {hasOrders && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-200 shadow-2xl">
          <div className="max-w-md mx-auto p-6">
            {/* Toggle Detail Button */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full text-sm text-amber-600 font-semibold mb-4 hover:text-amber-700 transition-colors"
            >
              {showDetails ? '▼ Sembunyikan Detail' : '▶ Lihat Detail Pesanan'}
            </button>

            {/* Detail Items */}
            {showDetails && (
              <div className="mb-4 p-4 bg-slate-50 rounded-xl space-y-2">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-700">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatRupiah(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(calculateSubtotal())}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">PPN (10%)</span>
                <span className="font-semibold text-slate-800">
                  {formatRupiah(calculateTax())}
                </span>
              </div>
              <div className="flex justify-between text-lg border-t border-slate-200 pt-2">
                <span className="font-bold text-slate-800">Total Bayar</span>
                <span className="font-bold text-amber-600">
                  {formatRupiah(calculateTotal())}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5" />
                  <span>Kirim Pesanan</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}