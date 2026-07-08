import React from 'react';
import { X, Printer } from 'lucide-react';

interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: string;
  items: OrderItem[];
  shippingDetails: {
    name: string;
    email: string;
    phone: string;
  };
  deliveryPoint: {
    address: string;
    city: string;
    zip: string;
  };
  subtotal: number;
  totalDiscount: number;
  total: number;
  status: string;
  createdAt: string;
}

interface OrderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedOrder: Order | null;
  formatPrice: (price: number) => string;
}

export const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  isOpen,
  onClose,
  selectedOrder,
  formatPrice,
}) => {
  if (!isOpen || !selectedOrder) return null;

  const handlePrintInvoice = () => {
    if (!selectedOrder) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Pop-up blocker is enabled. Please allow popups to print invoices.');
      return;
    }

    const taxableVal = Math.round(selectedOrder.total / 1.12);
    const taxAmt = selectedOrder.total - taxableVal;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Tax Invoice - ${selectedOrder.id}</title>
  <style>
    body {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 20px;
      font-size: 11px;
      line-height: 1.4;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #ddd;
      padding: 20px;
      background: #fff;
    }
    .header-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .header-logo {
      font-size: 24px;
      font-weight: 900;
      letter-spacing: 2px;
      color: #000;
    }
    .header-title {
      text-align: right;
      font-size: 16px;
      font-weight: bold;
      text-transform: uppercase;
      color: #555;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      border: 1px solid #eaeaea;
    }
    .details-table td {
      padding: 10px;
      vertical-align: top;
      width: 50%;
      border: 1px solid #eaeaea;
    }
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      font-weight: bold;
      color: #999;
      margin-bottom: 5px;
      letter-spacing: 1px;
    }
    .bold-text {
      font-weight: bold;
      color: #111;
    }
    .items-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
    }
    .items-table th {
      background: #f8f8f8;
      border-bottom: 2px solid #ddd;
      padding: 8px 10px;
      text-align: left;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 9px;
      color: #666;
    }
    .items-table td {
      padding: 8px 10px;
      border-bottom: 1px solid #eee;
      font-size: 11px;
    }
    .summary-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
    }
    .summary-table td {
      padding: 5px 10px;
      font-size: 11px;
    }
    .summary-label {
      text-align: right;
      color: #666;
    }
    .summary-value {
      text-align: right;
      width: 120px;
      font-weight: 600;
    }
    .grand-total {
      font-size: 13px;
      font-weight: bold;
      color: #008060;
      border-top: 1px solid #ddd;
      border-bottom: 2px double #ddd;
      padding: 8px 10px !important;
    }
    .barcode-wrap {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    .barcode-lines {
      display: flex;
      height: 30px;
      width: 160px;
      align-items: stretch;
    }
    .barcode-line-thin {
      background: #000;
      width: 1px;
      margin-right: 1px;
    }
    .barcode-line-medium {
      background: #000;
      width: 2px;
      margin-right: 1px;
    }
    .barcode-line-thick {
      background: #000;
      width: 4px;
      margin-right: 2px;
    }
    .barcode-line-space {
      width: 2px;
    }
    .footer-note {
      text-align: center;
      color: #888;
      font-size: 9px;
      margin-top: 30px;
      border-top: 1px dashed #eee;
      padding-top: 15px;
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-container {
        border: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <table class="header-table">
      <tr>
        <td>
          <div class="header-logo">CORE</div>
          <div style="font-size: 9px; color: #555; margin-top: 4px; font-weight: 500;">
            CORE Clothing Inc.<br/>
            Main Fulfillment Hub, Warehouse No. 12<br/>
            Industrial Area Phase-1, Okhla<br/>
            New Delhi, Delhi - 110020<br/>
            GSTIN: 07AAACC1234F1Z8 | Email: billing@coreclothing.in
          </div>
        </td>
        <td style="text-align: right; vertical-align: top;">
          <div class="header-title">Tax Invoice</div>
          <div style="font-size: 10px; color: #666; margin-top: 5px; font-weight: 500;">
            Invoice No: <span class="bold-text">IN-CORE-${selectedOrder.id.slice(0, 8).toUpperCase()}</span><br/>
            Date: <span class="bold-text">${new Date(selectedOrder.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span><br/>
            Order Ref ID: <span class="bold-text">${selectedOrder.id}</span>
          </div>
          <div class="barcode-wrap" style="align-items: flex-end;">
            <div class="barcode-lines">
              <div class="barcode-line-thick"></div>
              <div class="barcode-line-thin"></div>
              <div class="barcode-line-space"></div>
              <div class="barcode-line-medium"></div>
              <div class="barcode-line-thick"></div>
              <div class="barcode-line-thin"></div>
              <div class="barcode-line-space"></div>
              <div class="barcode-line-medium"></div>
              <div class="barcode-line-thin"></div>
              <div class="barcode-line-thick"></div>
            </div>
            <div style="font-size: 8px; font-family: monospace; color: #555; margin-top: 2px;">*${selectedOrder.id.slice(0, 8).toUpperCase()}*</div>
          </div>
        </td>
      </tr>
    </table>

    <table class="details-table">
      <tr>
        <td>
          <div class="section-title">Billed To (Customer Details)</div>
          <div class="bold-text" style="font-size: 12px; margin-bottom: 3px;">${selectedOrder.shippingDetails.name}</div>
          <div>Phone: ${selectedOrder.shippingDetails.phone}</div>
          <div>Email: ${selectedOrder.shippingDetails.email}</div>
        </td>
        <td>
          <div class="section-title">Shipped To (Destination Hub)</div>
          <div class="bold-text" style="font-size: 12px; margin-bottom: 3px;">Fulfillment Destination</div>
          <div>${selectedOrder.deliveryPoint.address}</div>
          <div>${selectedOrder.deliveryPoint.city} - ${selectedOrder.deliveryPoint.zip}</div>
          <div style="margin-top: 4px;">State Code: ${selectedOrder.deliveryPoint.city.toLowerCase().includes('delhi') ? '07 (Delhi)' : '06 (Haryana)'}</div>
        </td>
      </tr>
    </table>

    <table class="items-table">
      <thead>
        <tr>
          <th style="width: 5%">S.No</th>
          <th style="width: 50%">Item Description</th>
          <th style="width: 12%; text-align: right;">Unit Price</th>
          <th style="width: 8%; text-align: center;">Qty</th>
          <th style="width: 12%; text-align: right;">Gross Amt</th>
          <th style="width: 13%; text-align: right;">GST Rate</th>
        </tr>
      </thead>
      <tbody>
        ${selectedOrder.items.map((item, idx) => {
          const grossAmt = item.price * item.quantity;
          return `
            <tr>
              <td>${idx + 1}</td>
              <td>
                <span class="bold-text">${item.name}</span><br/>
                <span style="font-size: 8px; color: #777;">Product SKU: HOOD-${item.id.slice(0, 5).toUpperCase()}</span>
              </td>
              <td style="text-align: right;">₹${item.price.toLocaleString('en-IN')}</td>
              <td style="text-align: center;">${item.quantity}</td>
              <td style="text-align: right;">₹${grossAmt.toLocaleString('en-IN')}</td>
              <td style="text-align: right;">12% (Apparel)</td>
            </tr>
          `;
        }).join('')}
      </tbody>
    </table>

    <table class="summary-table" style="width: 50%; margin-left: 50%;">
      <tr>
        <td class="summary-label">Items Subtotal:</td>
        <td class="summary-value">₹${selectedOrder.subtotal.toLocaleString('en-IN')}</td>
      </tr>
      ${selectedOrder.totalDiscount > 0 ? `
      <tr>
        <td class="summary-label" style="color: #d32f2f;">Promotional Discounts:</td>
        <td class="summary-value" style="color: #d32f2f;">-₹${selectedOrder.totalDiscount.toLocaleString('en-IN')}</td>
      </tr>
      ` : ''}
      <tr>
        <td class="summary-label">Taxable Value:</td>
        <td class="summary-value">₹${taxableVal.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td class="summary-label">Integrated GST (12%):</td>
        <td class="summary-value">₹${taxAmt.toLocaleString('en-IN')}</td>
      </tr>
      <tr>
        <td class="summary-label grand-total">Payable Grand Total:</td>
        <td class="summary-value grand-total">₹${selectedOrder.total.toLocaleString('en-IN')}</td>
      </tr>
    </table>

    <div style="margin-top: 30px; font-size: 9px; line-height: 1.5; color: #555;">
      <div class="bold-text">Declaration & Terms:</div>
      <div>1. We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.</div>
      <div>2. All disputes are subject to the exclusive jurisdiction of the competent courts in Delhi.</div>
      <div>3. Keep the packaging and invoice for future verification and returns.</div>
    </div>

    <table style="width: 100%; margin-top: 40px; border-collapse: collapse;">
      <tr>
        <td>
          <div style="font-size: 10px; font-weight: bold; color: #008060; text-transform: uppercase;">
            ✔️ PAYMENT PREPAID
          </div>
          <div style="font-size: 8px; color: #777;">Charged via Online Gateway Authorization</div>
        </td>
        <td style="text-align: right; vertical-align: bottom;">
          <div style="display: inline-block; text-align: center; border-top: 1px solid #aaa; padding-top: 5px; width: 150px;">
            Authorized Signatory
            <div style="font-size: 8px; color: #777; margin-top: 2px;">CORE CLOTHING INC.</div>
          </div>
        </td>
      </tr>
    </table>

    <div class="footer-note">
      This is a computer-generated tax invoice and does not require a physical signature.<br/>
      Thank you for shopping with <strong>CORE Clothing</strong>!
    </div>
  </div>
</body>
</html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>Order Detail Ledger: {selectedOrder.id}</h4>
          <button className="modal-close" onClick={onClose}>
            <X size={16} />
          </button>
        </div>
        
        <div className="modal-body space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Buyer Details</span>
              <div className="bg-zinc-50 p-4 border border-zinc-200/60 rounded-xl space-y-1.5 font-medium text-xs">
                <p className="font-bold text-zinc-800">{selectedOrder.shippingDetails.name}</p>
                <p>Phone: {selectedOrder.shippingDetails.phone}</p>
                <p>Email: {selectedOrder.shippingDetails.email}</p>
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Shipping Address</span>
              <div className="bg-zinc-50 p-4 border border-zinc-200/60 rounded-xl space-y-1.5 font-medium text-xs">
                <p className="font-bold text-zinc-800">Fulfillment Hub Destination</p>
                <p className="leading-relaxed">{selectedOrder.deliveryPoint.address}</p>
                <p>{selectedOrder.deliveryPoint.city}, {selectedOrder.deliveryPoint.zip}</p>
              </div>
            </div>
          </div>

          <div className="detail-items-list">
            <h5>Items Checklist</h5>
            {selectedOrder.items.map((item, idx) => (
              <div key={idx} className="detail-item-row font-medium text-xs">
                <img src={item.image} className="product-thumb" alt={item.name} />
                <div className="flex-grow space-y-0.5">
                  <div className="font-bold text-zinc-800 text-sm">{item.name}</div>
                  <div className="text-zinc-400 text-[10px]">ID: {item.id} | Unit Price: {formatPrice(item.price)}</div>
                </div>
                <div className="font-bold text-zinc-800 text-sm">x{item.quantity}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-zinc-200 text-xs font-semibold space-y-2 text-zinc-500">
            <div className="flex justify-between">
              <span>Items Subtotal</span>
              <span className="text-zinc-900">{formatPrice(selectedOrder.subtotal)}</span>
            </div>
            {selectedOrder.totalDiscount > 0 && (
              <div className="flex justify-between text-brand-accent">
                <span>Coupon Discounts</span>
                <span>-{formatPrice(selectedOrder.totalDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-zinc-900 font-bold text-sm pt-2 border-t border-dashed border-zinc-200">
              <span>Payable Total charged</span>
              <span className="text-[#008060] font-black">{formatPrice(selectedOrder.total)}</span>
            </div>
          </div>
        </div>

        <div className="modal-footer flex gap-2">
          <button 
            type="button" 
            className="btn-primary text-xs flex items-center gap-1.5"
            onClick={handlePrintInvoice}
          >
            <Printer size={14} />
            <span>Print Invoice</span>
          </button>
          <button className="btn-action-outline text-xs" onClick={onClose}>
            Dismiss Details
          </button>
        </div>
      </div>
    </div>
  );
};
