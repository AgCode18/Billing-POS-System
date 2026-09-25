"use client";

import { useEffect, useState } from "react";
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

import { useBilling } from "../../context/BillingContext";

export default function InvoicePage() {
  const { invoices } = useBilling();

  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    const invoiceId = localStorage.getItem("selected_invoice_id");

    if (!invoiceId) return;

    const foundInvoice = invoices.find(
      (item) => item.id === invoiceId
    );

    if (foundInvoice) {
      setInvoice(foundInvoice);
    }
  }, [invoices]);

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="text-center">
          <p className="font-semibold text-gray-900">
            Invoice not found.
          </p>

          <a
            href="/dashboard"
            className="mt-4 inline-block text-sm text-gray-500 underline"
          >
            Go back to dashboard
          </a>
        </div>
      </div>
    );
  }

  const invoiceDate = new Date(invoice.createdAt);

  return (
    // Main background full width rahega, lekin content center mein rahega
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:p-0 print:bg-white">
      
      {/* Content ko max-w-7xl aur mx-auto mein wrap kiya taaki bade screens par stretch na ho */}
      <div className="mx-auto max-w-7xl">
        
        {/* Controls - Mobile par stack, desktop par side-by-side */}
        <div className="no-print mx-auto mb-6 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <a
            href="/dashboard"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:justify-start"
          >
            <ArrowLeft size={17} />
            Dashboard
          </a>

          <button
            onClick={() => window.print()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
          >
            <Printer size={18} />
            Print Invoice
          </button>
        </div>

        {/* Success Message - Responsive padding and text alignment */}
        <div className="no-print mx-auto mb-5 flex max-w-2xl items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700 sm:items-center sm:p-4 sm:text-sm">
          <CheckCircle2 size={18} className="shrink-0 mt-0.5 sm:mt-0" />
          <span className="min-w-0">
            Invoice {invoice.invoiceNumber} generated successfully.
          </span>
        </div>

        {/* Thermal Invoice - Screen par max-w-[80mm] rahega, print CSS handle karega baaki */}
        <div className="invoice mx-auto w-full max-w-[80mm] rounded-lg bg-white px-3 py-5 text-black shadow-lg sm:px-4 print:rounded-none print:shadow-none">
          
          {/* Shop */}
          <div className="text-center">
            <h1 className="text-lg font-bold">
              MY SHOP
            </h1>

            <p className="mt-1 text-[11px]">
              Your Shop Address
            </p>

            <p className="text-[11px]">
              Phone: 9876543210
            </p>
          </div>

          <div className="my-4 border-t border-dashed border-black" />

          {/* Invoice Info */}
          <div className="text-[11px]">
            <div className="flex justify-between">
              <span>Invoice</span>
              <span>{invoice.invoiceNumber}</span>
            </div>

            <div className="mt-1 flex justify-between">
              <span>Date</span>
              <span>
                {invoiceDate.toLocaleDateString("en-IN")}
              </span>
            </div>

            <div className="mt-1 flex justify-between">
              <span>Time</span>
              <span>
                {invoiceDate.toLocaleTimeString("en-IN", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-black" />

          {/* Items */}
          <div className="text-[11px]">
            <div className="grid grid-cols-[1fr_35px_55px] gap-1 font-bold">
              <span>ITEM</span>
              <span className="text-center">QTY</span>
              <span className="text-right">TOTAL</span>
            </div>

            <div className="my-2 border-t border-dashed border-black" />

            <div className="grid grid-cols-[1fr_35px_55px] gap-1">
              <span className="wraps-break min-w-0">
                {invoice.productName}
              </span>
              <span className="text-center">
                {invoice.quantity}
              </span>
              <span className="text-right">
                ₹{invoice.total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="my-4 border-t border-dashed border-black" />

          {/* Total */}
          <div className="text-[11px]">
            <div className="flex justify-between">
              <span>Unit Price</span>
              <span>₹{invoice.price.toFixed(2)}</span>
            </div>

            <div className="mt-1 flex justify-between">
              <span>Quantity</span>
              <span>{invoice.quantity}</span>
            </div>

            <div className="my-3 border-t border-black" />

            <div className="flex justify-between text-sm font-bold">
              <span>TOTAL</span>
              <span>₹{invoice.total.toFixed(2)}</span>
            </div>
          </div>

          <div className="my-5 border-t border-dashed border-black" />

          {/* Footer */}
          <div className="text-center text-[11px]">
            <p className="font-bold">Thank You!</p>
            <p className="mt-1">Visit Again</p>
          </div>
        </div>
      </div>
    </div>
  );
}