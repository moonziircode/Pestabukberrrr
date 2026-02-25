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
        <div className="bg-white rounded-lg p-8 border border-gray-200 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-900" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Area Admin</h2>
          <p className="text-gray-600 text-sm mb-6">
            Masukkan password untuk melihat rekap pesanan
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Password..."
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 transition-colors mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 rounded-md transition-colors flex items-center justify-center gap-2"
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
      <div className="bg-white rounded-lg p-6 mb-4 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dashboard Admin</h2>
            <p className="text-gray-600 text-sm mt-1">
              Total ada <span className="font-bold text-gray-900">{orders.length} orang</span> yang ikutan.
            </p>
          </div>
          {isLoading && <Loader2 className="w-6 h-6 text-gray-900 animate-spin" />}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCopyRecap}
            disabled={orders.length === 0 || isLoading}
            className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-300 text-white font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Copy Rekap</span>
          </button>
          <button
            onClick={handleResetAll}
            disabled={orders.length === 0 || isLoading}
            className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 text-gray-900 font-semibold py-2.5 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Semua</span>
          </button>
        </div>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-lg">
            Belum ada pesanan masuk nih. Sepi amat. 🥺
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Detail
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-bold text-gray-900 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="font-semibold text-gray-900 text-sm">{order.name}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="space-y-0.5">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-xs text-gray-600">
                            {item.quantity}x {item.name}
                          </p>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <p className="font-bold text-gray-900 text-sm">
                        {formatRupiah(order.total)}
                      </p>
                      <p className="text-xs text-gray-500">Inc. Tax (10%)</p>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        onClick={() => order.id && handleDeleteOrder(order.id)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-md transition-colors disabled:opacity-50"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                        <span className="text-xs font-semibold">Hapus</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-gray-900 border-t-2 border-gray-900">
                  <td colSpan={2} className="px-5 py-3 text-right font-bold text-white text-sm">
                    GRAND TOTAL:
                  </td>
                  <td className="px-5 py-3 text-right font-bold text-xl text-white">
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