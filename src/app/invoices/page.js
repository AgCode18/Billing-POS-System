"use client";

import {
  Eye,
  Printer,
  Receipt,
  Trash2,
  Calendar,
  Package,
} from "lucide-react";

import { useBilling } from "../../context/BillingContext";

export default function InvoicesPage() {
  const { invoices, deleteInvoice } = useBilling();

  const openInvoice = (invoice) => {
    localStorage.setItem("selected_invoice_id", invoice.id);
    window.location.href = "/invoices";
  };

  const totalSales = invoices.reduce(
    (sum, invoice) => sum + Number(invoice.total),
    0
  );

  return (
    <div className="min-h-screen">
      {/* Header - Responsive Padding & Text Size */}
      <header className="border-b border-gray-200 bg-white px-4 py-4 sm:px-8 sm:py-5">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          Invoices
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          View and reprint your previous invoices.
        </p>
      </header>

      {/* Main Content - Responsive Padding */}
      <div className="p-4 sm:p-8">
        {/* Stats - sm:grid-cols-2 for tablet view */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 sm:gap-5">
          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Invoices</p>
                <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                  {invoices.length}
                </p>
              </div>
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Receipt size={21} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-gray-500">Total Sales</p>
                <p className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl truncate">
                  ₹
                  {totalSales.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
              </div>
              <div className="ml-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Package size={21} />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="font-bold text-gray-900">Invoice History</h2>
            <p className="mt-1 text-sm text-gray-500">
              All generated invoices.
            </p>
          </div>

          {invoices.length === 0 ? (
            <EmptyInvoices />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Invoice
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Product
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Date
                    </th>
                    {/* Hide Quantity on mobile to save space */}
                    <th className="hidden px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:table-cell sm:px-6 sm:py-4">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Total
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {invoices.map((invoice) => {
                    const date = new Date(invoice.createdAt);

                    return (
                      <tr
                        key={invoice.id}
                        className="border-b border-gray-100 last:border-0"
                      >
                        {/* Invoice Number */}
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 sm:h-10 sm:w-10">
                              <Receipt size={18} />
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {invoice.invoiceNumber}
                            </span>
                          </div>
                        </td>

                        {/* Product */}
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <span className="text-sm text-gray-700">
                            {invoice.productName}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={15} />
                            <span>
                              {date.toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        </td>

                        {/* Quantity - Hidden on mobile */}
                        <td className="hidden px-4 py-3 sm:table-cell sm:px-6 sm:py-4">
                          <span className="text-sm text-gray-700">
                            {invoice.quantity}
                          </span>
                        </td>

                        {/* Total */}
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <span className="text-sm font-bold text-gray-900">
                            ₹
                            {invoice.total.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3 sm:px-6 sm:py-4">
                          <div className="flex justify-end gap-1 sm:gap-2">
                            {/* View */}
                            <button
                              onClick={() => openInvoice(invoice)}
                              title="View invoice"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                              <Eye size={17} />
                            </button>

                            {/* Print */}
                            <button
                              onClick={() => openInvoice(invoice)}
                              title="Print invoice"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                            >
                              <Printer size={17} />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => {
                                const confirmed = window.confirm(
                                  `Delete ${invoice.invoiceNumber}?`
                                );
                                if (confirmed) {
                                  deleteInvoice(invoice.id);
                                }
                              }}
                              title="Delete invoice"
                              className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={17} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function EmptyInvoices() {
  return (
    <div className="py-16 text-center sm:py-20">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
        <Receipt size={25} className="text-gray-500" />
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">
        No invoices yet
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Generate your first invoice from the dashboard.
      </p>
    </div>
  );
}