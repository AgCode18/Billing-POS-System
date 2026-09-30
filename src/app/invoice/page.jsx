"use client";

import { useEffect, useState } from "react";
import {
    Printer,
    ArrowLeft,
    CheckCircle2,
} from "lucide-react";

import { useBilling } from "../../context/BillingContext";
import { getSettings } from "../../services/billingApi";

const DEFAULT_SETTINGS = {
    shopName: "MY SHOP",
    address: "Your Shop Address",
    phone: "9876543210",
};

export default function InvoicePage() {
    const { invoices } = useBilling();

    const [invoice, setInvoice] = useState(null);
    const [settings, setSettings] = useState(DEFAULT_SETTINGS);
    const [settingsLoading, setSettingsLoading] = useState(true);

    // =========================
    // LOAD SELECTED INVOICE
    // =========================

    useEffect(() => {
        const invoiceId =
            localStorage.getItem("selected_invoice_id");

        if (!invoiceId) return;

        const foundInvoice = invoices.find(
            (item) => item.id === invoiceId
        );

        if (foundInvoice) {
            setInvoice(foundInvoice);
        }
    }, [invoices]);

    // =========================
    // LOAD SHOP SETTINGS
    // =========================

    useEffect(() => {
        const loadSettings = async () => {
            try {
                const response = await getSettings();

                const data =
                    response?.data ||
                    response?.settings ||
                    response;

                if (data) {
                    setSettings({
                        ...DEFAULT_SETTINGS,
                        ...data,
                    });
                }
            } catch (error) {
                console.error(
                    "Failed to load invoice settings:",
                    error
                );

                /*
                 * Backend unavailable hone par
                 * default values use hongi.
                 */
            } finally {
                setSettingsLoading(false);
            }
        };

        loadSettings();
    }, []);

    // =========================
    // INVOICE NOT FOUND
    // =========================

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

    const invoiceDate =
        new Date(invoice.createdAt);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 print:bg-white print:p-0">
            <div className="mx-auto max-w-7xl">

                {/* =========================
                    CONTROLS
                ========================= */}

                <div className="no-print mx-auto mb-6 flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <a
                        href="/invoices"
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                    >
                        <ArrowLeft size={17} />
                        Invoices
                    </a>

                    <button
                        onClick={() => window.print()}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:w-auto"
                    >
                        <Printer size={18} />
                        Print Invoice
                    </button>
                </div>

                {/* =========================
                    SUCCESS MESSAGE
                ========================= */}

                <div className="no-print mx-auto mb-5 flex max-w-2xl items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700 sm:items-center sm:p-4 sm:text-sm">
                    <CheckCircle2
                        size={18}
                        className="mt-0.5 shrink-0 sm:mt-0"
                    />

                    <span>
                        Invoice{" "}
                        {invoice.invoiceNumber}{" "}
                        generated successfully.
                    </span>
                </div>

                {/* =========================
                    THERMAL INVOICE
                ========================= */}

                <div className="invoice mx-auto w-full max-w-[80mm] rounded-lg bg-white px-3 py-5 text-black shadow-lg sm:px-4 print:rounded-none print:shadow-none">

                    {/* SHOP */}

                    <div className="text-center">
                        <h1 className="text-lg font-bold">
                            {settings.shopName}
                        </h1>

                        <p className="mt-1 whitespace-pre-line text-[11px]">
                            {settings.address}
                        </p>

                        <p className="text-[11px]">
                            Phone: {settings.phone}
                        </p>
                    </div>

                    <div className="my-4 border-t border-dashed border-black" />

                    {/* INVOICE INFO */}

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

                    {/* ITEMS */}

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
                            <span className="min-w-0 break-words">
                                {invoice.productName}
                            </span>

                            <span className="text-center">
                                {invoice.quantity}
                            </span>

                            <span className="text-right">
                                ₹
                                {Number(
                                    invoice.total
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="my-4 border-t border-dashed border-black" />

                    {/* TOTAL */}

                    <div className="text-[11px]">
                        <div className="flex justify-between">
                            <span>
                                Unit Price
                            </span>

                            <span>
                                ₹
                                {Number(
                                    invoice.price
                                ).toFixed(2)}
                            </span>
                        </div>

                        <div className="mt-1 flex justify-between">
                            <span>
                                Quantity
                            </span>

                            <span>
                                {invoice.quantity}
                            </span>
                        </div>

                        <div className="my-3 border-t border-black" />

                        <div className="flex justify-between text-sm font-bold">
                            <span>TOTAL</span>

                            <span>
                                ₹
                                {Number(
                                    invoice.total
                                ).toFixed(2)}
                            </span>
                        </div>
                    </div>

                    <div className="my-5 border-t border-dashed border-black" />

                    {/* FOOTER */}

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
        </div>
    );
}