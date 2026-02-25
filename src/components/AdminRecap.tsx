import { useState, useEffect } from 'react';
import { supabase, Order } from '../lib/supabase';
import {
  Lock,
  ShieldCheck,
  Download,
  Trash2,
  UserMinus,
  Loader2,
} from 'lucide-react';

export function AdminRecap() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const ADMIN_PASSWORD = 'pesbukovtd';

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert('Password salah woy! 😅 Coba inget-inget lagi.');
      setPassword('');
    }
  };

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        alert('Gagal memuat data pesanan: ' + error.message);
        return;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleCopyRecap = () => {
    let recap = '*REKAP PESANAN BUKBER KALEYO*\n';
    recap += `Total Peserta: ${orders.length} orang\n`;
    recap += '--------------------------------\n';

    orders.forEach((order, index) => {
      recap += `${index + 1}. *${order.name}*\n`;
      order.items.forEach((item) => {
        recap += `   - ${item.quantity}x ${item.name}\n`;
      });
      recap += `   💰 Total: ${formatRupiah(order.total)}\n`;
      recap += '--------------------------------\n';
    });

    const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);
    recap += `*GRAND TOTAL: ${formatRupiah(grandTotal)}*`;

    navigator.clipboard.writeText(recap).then(
      () => {
        alert('Rekap berhasil disalin! 📋 Siap di-share ke grup WA! 🚀');
      },
      () => {
        alert('Gagal menyalin rekap 😭');
      }
    );
  };

  const handleResetAll = async () => {
    const confirmed = window.confirm(
      'Yakin mau hapus semua data pesanan? Ini ga bisa di-undo lho! 😱'
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const { error } = await supabase.from('orders').delete().neq('id', 0);

      if (error) {
        console.error('Error deleting all orders:', error);
        alert('Gagal menghapus data: ' + error.message);
        return;
      }

      alert('Semua pesanan berhasil dihapus! 🗑️');
      fetchOrders();
    } catch (error) {
      console.error('Error reset orders:', error);
      alert('Terjadi error saat menghapus data 😭');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    const confirmed = window.confirm(
      'Yakin mau hapus pesanan ini? 🤔'
    );

    if (!confirmed) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        console.error('Error deleting order:', error);
        alert('Gagal menghapus pesanan: ' + error.message);
        return;
      }

      alert('Pesanan berhasil dihapus! ✅');
      fetchOrders();
    } catch (error) {
      console.error('Error delete order:', error);
      alert('Terjadi error saat menghapus 😭');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="max-w-sm mx-auto mt-16">
        <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Area Admin</h2>
          <p className="text-slate-600 text-sm mb-6">
            Masukkan password untuk melihat rekap pesanan
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password..."
            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-amber-500 focus:outline-none transition-colors mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-5 h-5" />
            <span>Masuk</span>
          </button>
        </div>
      </div>
    );
  }

  // Admin Dashboard
  const grandTotal = orders.reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="pb-8">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard Admin</h2>
            <p className="text-slate-600 text-sm mt-1">
              Total ada <span className="font-bold text-amber-600">{orders.length} orang</span> yang ikutan.
            </p>
          </div>
          {isLoading && <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyRecap}
            disabled={orders.length === 0 || isLoading}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>Copy Rekap</span>
          </button>
          <button
            onClick={handleResetAll}
            disabled={orders.length === 0 || isLoading}
            className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-slate-300 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Reset Semua</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <p className="text-slate-500 text-lg">
            Belum ada pesanan masuk nih. Sepi amat. 🥺
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">
                    Nama Pemesan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-slate-800">
                    Detail Pesanan
                  </th>
                  <th className="px-6 py-4 text-right text-sm font-bold text-slate-800">
                    Total Bayar
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-slate-800">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{order.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-sm text-slate-600">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-bold text-amber-600">
                        {formatRupiah(order.total)}
                      </p>
                      <p className="text-xs text-slate-500">Inc. Tax (10%)</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => order.id && handleDeleteOrder(order.id)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors disabled:opacity-50"
                      >
                        <UserMinus className="w-4 h-4" />
                        <span className="text-sm font-semibold">Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-amber-50 border-t-2 border-amber-200">
                  <td colSpan={2} className="px-6 py-4 text-right font-bold text-slate-800">
                    GRAND TOTAL:
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-2xl text-amber-600">
                    {formatRupiah(grandTotal)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
