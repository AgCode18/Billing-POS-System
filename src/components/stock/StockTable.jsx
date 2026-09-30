"use client";

import {
    ArrowDownCircle,
    ArrowUpCircle,
    Package,
    Eye,
} from "lucide-react";

export default function StockTable({
    transactions,
    onView,
}) {
    if (!transactions?.length) {
        return (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                    <Package size={25} className="text-gray-500" />
                </div>

                <h3 className="mt-4 font-semibold text-gray-900">
                    No stock transactions
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                    Stock transactions will appear here.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="overflow-x-auto">
                <table className="w-full whitespace-nowrap">
                    <thead>
                        <tr className="border-b border-gray-200 bg-gray-50 text-left">
                            <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-500 sm:px-6">
                                Product
                            </th>

                            <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-500 sm:px-6">
                                Type
                            </th>

                            <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-500 sm:px-6">
                                Quantity
                            </th>

                            <th className="hidden px-4 py-4 text-xs font-semibold uppercase text-gray-500 md:table-cell sm:px-6">
                                Previous Stock
                            </th>

                            <th className="hidden px-4 py-4 text-xs font-semibold uppercase text-gray-500 md:table-cell sm:px-6">
                                Current Stock
                            </th>

                            <th className="px-4 py-4 text-xs font-semibold uppercase text-gray-500 sm:px-6">
                                Date
                            </th>

                            <th className="px-4 py-4 text-right text-xs font-semibold uppercase text-gray-500 sm:px-6">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((transaction) => {
                            const type =
                                transaction.type ||
                                transaction.transactionType ||
                                "OUT";

                            const isIn =
                                type.toUpperCase() === "IN";

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

                            const productName =
                                transaction.product?.name ||
                                transaction.productName ||
                                "Unknown Product";

                            const date = transaction.createdAt
                                ? new Date(transaction.createdAt)
                                : null;

                            return (
                                <tr
                                    key={transaction._id || transaction.id}
                                    className="border-b border-gray-100 last:border-0"
                                >
                                    <td className="px-4 py-4 sm:px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                                                <Package size={18} />
                                            </div>

                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {productName}
                                                </p>

                                                {transaction.product?.sku && (
                                                    <p className="mt-0.5 text-xs text-gray-500">
                                                        SKU:{" "}
                                                        {
                                                            transaction
                                                                .product
                                                                .sku
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 sm:px-6">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                                                isIn
                                                    ? "bg-green-50 text-green-700"
                                                    : "bg-red-50 text-red-700"
                                            }`}
                                        >
                                            {isIn ? (
                                                <ArrowUpCircle size={14} />
                                            ) : (
                                                <ArrowDownCircle size={14} />
                                            )}

                                            {isIn
                                                ? "Stock In"
                                                : "Stock Out"}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 text-sm font-bold text-gray-900 sm:px-6">
                                        {quantity}
                                    </td>

                                    <td className="hidden px-4 py-4 text-sm text-gray-600 md:table-cell sm:px-6">
                                        {previousStock}
                                    </td>

                                    <td className="hidden px-4 py-4 text-sm font-semibold text-gray-900 md:table-cell sm:px-6">
                                        {currentStock}
                                    </td>

                                    <td className="px-4 py-4 text-sm text-gray-600 sm:px-6">
                                        {date
                                            ? date.toLocaleDateString(
                                                  "en-IN"
                                              )
                                            : "-"}
                                    </td>

                                    <td className="px-4 py-4 sm:px-6">
                                        <div className="flex justify-end">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onView(transaction)
                                                }
                                                title="View transaction"
                                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                                            >
                                                <Eye size={17} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}