"use client";

import {
    X,
    Package,
    ArrowDownCircle,
    ArrowUpCircle,
} from "lucide-react";

export default function StockTransactionModal({
    transaction,
    onClose,
}) {
    if (!transaction) return null;

    const type =
        transaction.type ||
        transaction.transactionType ||
        "OUT";

    const isIn = type.toUpperCase() === "IN";

    const productName =
        transaction.product?.name ||
        transaction.productName ||
        "Unknown Product";

    const quantity =
        Number(transaction.quantity) || 0;

    const previousStock =
        Number(
            transaction.previousStock ??
            transaction.previousQuantity ??
            0
        );

    const currentStock =
        Number(
            transaction.currentStock ??
            transaction.remainingStock ??
            0
        );

    const createdAt = transaction.createdAt
        ? new Date(transaction.createdAt)
        : null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
                <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                            Stock Transaction
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-gray-900">
                            Transaction Details
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="space-y-4 p-6">
                    <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                            <Package size={22} />
                        </div>

                        <div>
                            <p className="text-xs text-gray-500">
                                Product
                            </p>

                            <p className="mt-1 font-semibold text-gray-900">
                                {productName}
                            </p>
                        </div>
                    </div>

                    <div
                        className={`flex items-center gap-3 rounded-xl p-4 ${
                            isIn
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                        }`}
                    >
                        {isIn ? (
                            <ArrowUpCircle size={21} />
                        ) : (
                            <ArrowDownCircle size={21} />
                        )}

                        <div>
                            <p className="text-xs opacity-70">
                                Transaction Type
                            </p>

                            <p className="font-bold">
                                {isIn ? "Stock In" : "Stock Out"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <InfoBox
                            label="Quantity"
                            value={quantity}
                        />

                        <InfoBox
                            label="Previous"
                            value={previousStock}
                        />

                        <InfoBox
                            label="Current"
                            value={currentStock}
                        />
                    </div>

                    <div className="rounded-xl border border-gray-200 p-4">
                        <p className="text-xs text-gray-500">
                            Created At
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-900">
                            {createdAt
                                ? createdAt.toLocaleString("en-IN")
                                : "-"}
                        </p>
                    </div>
                </div>

                <div className="border-t border-gray-200 p-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

function InfoBox({ label, value }) {
    return (
        <div className="rounded-xl bg-gray-50 p-3 text-center">
            <p className="text-xs text-gray-500">
                {label}
            </p>

            <p className="mt-1 text-lg font-bold text-gray-900">
                {value}
            </p>
        </div>
    );
}