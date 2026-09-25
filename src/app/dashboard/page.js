"use client";

import { useMemo, useState } from "react";
import {
    Package,
    Search,
    Plus,
    ShoppingCart,
    IndianRupee,
    Boxes,
} from "lucide-react";

import { useBilling } from "../../context/BillingContext";
import BillingModal from "../../components/BillingModal";

export default function DashboardPage() {
    const { products, createInvoice } = useBilling();

    const [search, setSearch] = useState("");
    const [selectedProduct, setSelectedProduct] = useState(null);

    const filteredProducts = useMemo(() => {
        return products.filter((product) =>
            product.name
                .toLowerCase()
                .includes(search.toLowerCase())
        );
    }, [products, search]);

    const totalProducts = products.length;

    const totalStock = products.reduce(
        (sum, product) => sum + product.quantity,
        0
    );

    const totalValue = products.reduce(
        (sum, product) =>
            sum + product.price * product.quantity,
        0
    );

    /*
     * This is called after the user clicks
     * "Generate Invoice".
     */
    const handleGenerateInvoice = (invoiceItem) => {
        const invoice = createInvoice(invoiceItem);

        // Store only the selected invoice ID.
        localStorage.setItem(
            "selected_invoice_id",
            invoice.id
        );

        window.location.href = "/invoice";
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-5">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage products and create invoices.
                    </p>
                </div>

                <a
                    href="/products"
                    className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                    <Plus size={18} />
                    Add Product
                </a>
            </header>

            <div className="p-8">
                {/* Stats */}
                <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    <StatCard
                        title="Total Products"
                        value={totalProducts}
                        icon={Package}
                    />

                    <StatCard
                        title="Total Stock"
                        value={totalStock}
                        icon={Boxes}
                    />

                    <StatCard
                        title="Inventory Value"
                        value={`₹${totalValue.toLocaleString("en-IN")}`}
                        icon={IndianRupee}
                    />
                </div>

                {/* Products */}
                <section className="mt-8">
                    <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Products
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Select a product to create an invoice.
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />

                            <input
                                type="text"
                                placeholder="Search products..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-xl border border-gray-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 md:w-72"
                            />
                        </div>
                    </div>

                    {filteredProducts.length === 0 ? (
                        <EmptyState />
                    ) : (
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onClick={() => setSelectedProduct(product)}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </div>

            {/* Billing Modal */}
            {selectedProduct && (
                <BillingModal
                    product={selectedProduct}
                    onClose={() => setSelectedProduct(null)}
                    onGenerateInvoice={handleGenerateInvoice}
                />
            )}
        </div>
    );
}

function generateInvoiceNumber() {
    const timestamp = Date.now();

    return `INV-${timestamp}`;
}

function StatCard({ title, value, icon: Icon }) {
    return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
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
                    <Icon size={21} className="text-gray-700" />
                </div>
            </div>
        </div>
    );
}

function ProductCard({ product, onClick }) {
    const outOfStock = product.quantity <= 0;

    return (
        <button
            type="button"
            disabled={outOfStock}
            onClick={onClick}
            className="group text-left disabled:cursor-not-allowed"
        >
            <div
                className={`rounded-2xl border bg-white p-5 transition ${outOfStock
                        ? "border-gray-200 opacity-60"
                        : "border-gray-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
                    }`}
            >
                <div className="flex items-start justify-between">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                        <Package
                            size={22}
                            className="text-gray-700"
                        />
                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${outOfStock
                                ? "bg-red-50 text-red-700"
                                : "bg-green-50 text-green-700"
                            }`}
                    >
                        {outOfStock ? "Out of Stock" : "In Stock"}
                    </span>
                </div>

                <h3 className="mt-5 font-semibold text-gray-900">
                    {product.name}
                </h3>

                <div className="mt-3 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">
                            Price
                        </p>

                        <p className="mt-1 text-lg font-bold text-gray-900">
                            ₹{product.price.toLocaleString("en-IN")}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-xs text-gray-500">
                            Stock
                        </p>

                        <p className="mt-1 text-sm font-semibold text-gray-800">
                            {product.quantity}
                        </p>
                    </div>
                </div>

                <div
                    className={`mt-5 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold transition ${outOfStock
                            ? "bg-gray-100 text-gray-400"
                            : "bg-gray-100 text-gray-700 group-hover:bg-black group-hover:text-white"
                        }`}
                >
                    <ShoppingCart size={17} />

                    {outOfStock
                        ? "Unavailable"
                        : "Create Invoice"}
                </div>
            </div>
        </button>
    );
}

function EmptyState() {
    return (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                <Package
                    size={25}
                    className="text-gray-500"
                />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
                No products found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                Add your first product to start billing.
            </p>

            <a
                href="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white"
            >
                <Plus size={17} />
                Add Product
            </a>
        </div>
    );
}