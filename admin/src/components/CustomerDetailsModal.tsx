import React from 'react';
import { X, Mail, Phone, MapPin, ListChecks } from 'lucide-react';

interface Customer {
  name: string;
  phone: string;
  email: string;
  verified: boolean;
  count: number;
  lastVal: number;
}

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: Customer | null;
  formatPrice: (price: number) => string;
}

export const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
  formatPrice,
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Customer Ledger Profile</h4>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>

        <div className="modal-body space-y-5">
          {/* Profile Overview */}
          <div className="bg-zinc-50 p-5 border border-zinc-200/60 rounded-xl flex items-start gap-4">
            <div className="w-12 h-12 bg-zinc-950 text-white rounded-full flex items-center justify-center font-black text-lg">
              {customer.name[0]}
            </div>
            <div className="flex-grow space-y-1">
              <h3 className="font-bold text-zinc-900 text-base flex items-center gap-2">
                <span>{customer.name}</span>
                <span className={`badge ${customer.verified ? 'active' : 'draft'} text-[9px] font-bold py-0.5 px-2`}>
                  {customer.verified ? 'Verified' : 'Unverified'}
                </span>
              </h3>
              <p className="text-zinc-500 font-medium text-xs flex items-center gap-1.5">
                <Mail size={12} />
                <span>{customer.email}</span>
              </p>
              <p className="text-zinc-500 font-medium text-xs flex items-center gap-1.5">
                <Phone size={12} />
                <span>{customer.phone}</span>
              </p>
            </div>
          </div>

          {/* Slices of Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-zinc-200 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Orders Placed</span>
              <span className="text-xl font-black text-zinc-800 mt-1">{customer.count} orders</span>
            </div>
            <div className="border border-zinc-200 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Average Spend</span>
              <span className="text-xl font-black text-[#008060] mt-1">{formatPrice(customer.lastVal)}</span>
            </div>
          </div>

          {/* Address Ledger */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block flex items-center gap-1">
              <MapPin size={12} />
              <span>Registered Locations</span>
            </span>
            <div className="bg-zinc-50 p-4 border border-zinc-200/60 rounded-xl text-xs font-medium text-zinc-600 leading-relaxed">
              <p className="font-bold text-zinc-800">Primary Delivery Destination</p>
              <p className="mt-1">1134 Kartar Nagar, Model Town</p>
              <p>Delhi, 110009 - India</p>
            </div>
          </div>

          {/* Purchase Timeline */}
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block flex items-center gap-1">
              <ListChecks size={12} />
              <span>Purchase History ledger</span>
            </span>
            <div className="table-container border border-zinc-200 rounded-xl overflow-hidden">
              <table className="custom-table m-0 text-xs">
                <thead>
                  <tr className="bg-zinc-50 text-zinc-500 font-bold">
                    <th>Reference ID</th>
                    <th>Date</th>
                    <th>Billing Total</th>
                    <th className="text-right">Fulfillment</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { ref: 'CR-5021', date: 'June 14, 2026', total: customer.lastVal, status: 'Delivered' },
                    customer.count > 1 && { ref: 'CR-5012', date: 'May 22, 2026', total: 1899, status: 'Delivered' },
                    customer.count > 2 && { ref: 'CR-4995', date: 'April 05, 2026', total: 2499, status: 'Delivered' }
                  ].filter(Boolean).map((t: any, idx) => (
                    <tr key={idx}>
                      <td className="font-bold text-zinc-900">{t.ref}</td>
                      <td className="font-medium text-zinc-500">{t.date}</td>
                      <td className="font-semibold text-zinc-800">{formatPrice(t.total)}</td>
                      <td className="text-right font-bold text-zinc-800">
                        <span className="badge active text-[9px] font-bold py-0.5 px-2 bg-green-50 text-green-700 border border-green-200 rounded-full">
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-action-outline text-xs" onClick={onClose}>
            Dismiss Ledger
          </button>
        </div>
      </div>
    </div>
  );
};
