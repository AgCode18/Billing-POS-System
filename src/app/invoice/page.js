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

  const [invoice, setInvoice] =
    useState(null);

  useEffect(() => {
    const invoiceId =
      localStorage.getItem(
        "selected_invoice_id"
      );

    if (!invoiceId) return;

    const foundInvoice =
      invoices.find(
        (item) => item.id === invoiceId
      );

    if (foundInvoice) {
      setInvoice(foundInvoice);
    }
  }, [invoices]);

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
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

  const invoiceDate = new Date(
    invoice.createdAt
  );

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Controls */}
      <div className="no-print mx-auto mb-6 flex max-w-2xl items-center justify-between">
        <a
          href="/dashboard"
          className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft size={17} />
          Dashboard
        </a>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
        >
          <Printer size={18} />
          Print Invoice
        </button>
      </div>

      {/* Success */}
      <div className="no-print mx-auto mb-5 flex max-w-2xl items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
        <CheckCircle2 size={18} />

        <span>
          Invoice {invoice.invoiceNumber} generated
          successfully.
        </span>
      </div>

      {/* Thermal Invoice */}
      <div className="invoice mx-auto w-[80mm] bg-white px-4 py-5 text-black shadow-lg">
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

            <span>
              {invoice.invoiceNumber}
            </span>
          </div>

          <div className="mt-1 flex justify-between">
            <span>Date</span>

            <span>
              {invoiceDate.toLocaleDateString(
                "en-IN"
              )}
            </span>
          </div>

          <div className="mt-1 flex justify-between">
            <span>Time</span>

            <span>
              {invoiceDate.toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              )}
            </span>
          </div>
        </div>

        <div className="my-4 border-t border-dashed border-black" />

        {/* Items */}
        <div className="text-[11px]">
          <div className="grid grid-cols-[1fr_35px_55px] gap-1 font-bold">
            <span>ITEM</span>

            <span className="text-center">
              QTY
            </span>

            <span className="text-right">
              TOTAL
            </span>
          </div>

          <div className="my-2 border-t border-dashed border-black" />

          <div className="grid grid-cols-[1fr_35px_55px] gap-1">
            <span className="break-words">
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

            <span>
              ₹{invoice.price.toFixed(2)}
            </span>
          </div>

          <div className="mt-1 flex justify-between">
            <span>Quantity</span>

            <span>
              {invoice.quantity}
            </span>
          </div>

          <div className="my-3 border-t border-black" />

          <div className="flex justify-between text-sm font-bold">
            <span>TOTAL</span>

            <span>
              ₹{invoice.total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="my-5 border-t border-dashed border-black" />

        {/* Footer */}
        <div className="text-center text-[11px]">
          <p className="font-bold">
            Thank You!
          </p>

          <p className="mt-1">
            Visit Again
          </p>
        </div>
      </div>
    </div>
  );
}