"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Search,
    Package,
    ArrowDownCircle,
    ArrowUpCircle,
    RefreshCw,
} from "lucide-react";

import StockTable from "../../components/stock/StockTable";
import StockTransactionModal from "../../components/stock/StockTransactionModal";
import { getStockTransactions } from "../../services/stockService";

export default function StockPage() {
    const [transactions, setTransactions] = useState([]);

    const [search, setSearch] = useState("");
    const [type, setType] = useState("all");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedTransaction, setSelectedTransaction] =
        useState(null);

    const loadTransactions = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getStockTransactions();

            const data =
                response?.data ||
                response?.transactions ||
                response ||
                [];

            setTransactions(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            console.error(
                "Failed to load stock transactions:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Failed to load stock transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []);

    const filteredTransactions = useMemo(() => {
        return transactions.filter((transaction) => {
            const productName =
                transaction.product?.name ||
                transaction.productName ||
                "";

            const transactionType = (
                transaction.type ||
                transaction.transactionType ||
                ""
            ).toLowerCase();

            const searchMatch = productName
                .toLowerCase()
                .includes(search.toLowerCase());

            const typeMatch =
                type === "all" ||
                transactionType === type;

            return searchMatch && typeMatch;
        });
    }, [transactions, search, type]);

    const stockInCount = transactions.filter(
        (transaction) =>
            (
                transaction.type ||
                transaction.transactionType ||
                ""
            ).toUpperCase() === "IN"
    ).length;

    const stockOutCount = transactions.filter(
        (transaction) =>
            (
                transaction.type ||
                transaction.transactionType ||
                ""
            ).toUpperCase() === "OUT"
    ).length;

    const totalQuantity = transactions.reduce(
        (sum, transaction) =>
            sum + Number(transaction.quantity || 0),
        0
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-8 sm:py-5">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                            Stock Transactions
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            Track all stock movements and inventory changes.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={loadTransactions}
                        disabled={loading}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50 sm:w-auto"
                    >
                        <RefreshCw
                            size={17}
                            className={
                                loading
                                    ? "animate-spin"
                                    : ""
                            }
                        />

                        Refresh
                    </button>
                </div>
            </header>

            <main className="mx-auto max-w-7xl p-4 sm:p-8">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5">
                    <StatCard
                        title="Total Transactions"
                        value={transactions.length}
                        icon={Package}
                    />

                    <StatCard
                        title="Stock In"
                        value={stockInCount}
                        icon={ArrowUpCircle}
                    />

                    <StatCard
                        title="Stock Out"
                        value={stockOutCount}
                        icon={ArrowDownCircle}
                    />
                </div>

                {/* Filters */}
                <section className="mt-8">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Transaction History
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {totalQuantity} total units moved.
                            </p>
                        </div>

                        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                            <div className="relative w-full sm:w-72">
                                <Search
                                    size={18}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                                />

                                <input
                                    type="text"
                                    placeholder="Search product..."
                                    value={search}
                                    onChange={(event) =>
                                        setSearch(
                                            event.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400"
                                />
                            </div>

                            <select
                                value={type}
                                onChange={(event) =>
                                    setType(
                                        event.target.value
                                    )
                                }
                                className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-medium text-gray-700 outline-none focus:border-gray-400"
                            >
                                <option value="all">
                                    All Transactions
                                </option>

                                <option value="in">
                                    Stock In
                                </option>

                                <option value="out">
                                    Stock Out
                                </option>
                            </select>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {loading ? (
                        <LoadingState />
                    ) : (
                        <StockTable
                            transactions={
                                filteredTransactions
                            }
                            onView={
                                setSelectedTransaction
                            }
                        />
                    )}
                </section>
            </main>

            {selectedTransaction && (
                <StockTransactionModal
                    transaction={
                        selectedTransaction
                    }
                    onClose={() =>
                        setSelectedTransaction(null)
                    }
                />
            )}
        </div>
    );
}

function StatCard({
    title,
    value,
    icon: Icon,
}) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold text-gray-900">
                        {value}
                    </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-100">
                    <Icon size={21} />
                </div>
            </div>
        </div>
    );
}

function LoadingState() {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
            <RefreshCw
                size={25}
                className="mx-auto animate-spin text-gray-400"
            />

            <p className="mt-3 text-sm text-gray-500">
                Loading stock transactions...
            </p>
        </div>
    );
}