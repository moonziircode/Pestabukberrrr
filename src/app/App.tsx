import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { OrderForm } from '../components/OrderForm';
import { AdminRecap } from '../components/AdminRecap';

type Tab = 'order' | 'admin';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('order');

  const logoText = 'PESTA BUKBERRR!!!';
  const colors = [
    'text-red-500',
    'text-blue-500',
    'text-green-500',
    'text-purple-500',
    'text-amber-500',
    'text-pink-500',
    'text-cyan-500',
    'text-indigo-500',
    'text-lime-500',
    'text-orange-500',
    'text-teal-500',
    'text-rose-500',
    'text-fuchsia-500',
    'text-yellow-500',
  ];

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Main Container */}
      <div className="max-w-md mx-auto bg-[#FAFAFA] min-h-screen shadow-xl">
        {/* Sticky Header */}
        <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
          {/* Logo - Playful */}
          <div className="py-6 px-6">
            <h1 className="text-4xl font-black text-center mb-6 select-none">
              {logoText.split('').map((char, index) => (
                <span
                  key={index}
                  className={`inline-block ${
                    colors[index % colors.length]
                  } hover:scale-125 hover:rotate-12 transition-all cursor-default`}
                  style={{
                    transform: `rotate(${(index % 2 === 0 ? 1 : -1) * (index % 5)}deg)`,
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            {/* Tab Toggle (Segmented Control) */}
            <div className="bg-slate-50 p-1.5 rounded-xl flex gap-1">
              <button
                onClick={() => setActiveTab('order')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all ${
                  activeTab === 'order'
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Form Pesanan
              </button>
              <button
                onClick={() => setActiveTab('admin')}
                className={`flex-1 py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                  activeTab === 'admin'
                    ? 'bg-white text-slate-800 shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
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
