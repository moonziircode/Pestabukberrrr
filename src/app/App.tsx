import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { OrderForm } from '../components/OrderForm';
import { AdminRecap } from '../components/AdminRecap';

type Tab = 'order' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('order');

  const logoText = 'PESTA BUKBERRR!!!';

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Container */}
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-gray-200">
          {/* Logo - Minimalist */}
          <div className="py-6 px-6">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-900 tracking-tight">
              {logoText}
            </h1>

            {/* Tab Toggle (Segmented Control) */}
            <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
              <button
                onClick={() => setActiveTab('order')}
                className={`flex-1 py-2.5 rounded-md font-semibold text-sm transition-all ${
                  activeTab === 'order'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Form Pesanan
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-2.5 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin</span>
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'order' && <OrderForm />}
          {activeTab === 'admin' && <AdminRecap />}
        </div>
      </div>
    </div>
  );
}