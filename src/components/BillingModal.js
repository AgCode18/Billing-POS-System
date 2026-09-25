"use client";

import { useEffect, useState } from "react";
import {
  X,
  Minus,
  Plus,
  Printer,
  AlertCircle,
} from "lucide-react";

export default function BillingModal({
  product,
  onClose,
  onGenerateInvoice,
}) {
  const [price, setPrice] = useState(product.price);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setPrice(product.price);
    setQuantity(1);
  }, [product]);

  if (!product) return null;

  const total = Number(price || 0) * quantity;

  const increaseQuantity = () => {
    if (quantity < product.quantity) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = Number(e.target.value);

    if (value < 1) {
      setQuantity(1);
      return;
    }

    if (value > product.quantity) {
      setQuantity(product.quantity);
      return;
    }

    setQuantity(value);
  };

  const handleGenerateInvoice = () => {
    if (!price || Number(price) <= 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (quantity <= 0) {
      alert("Please select a valid quantity.");
      return;
    }

    if (quantity > product.quantity) {
      alert("Not enough stock available.");
      return;
    }

    onGenerateInvoice({
      productId: product.id,
      name: product.name,
      price: Number(price),
      quantity,
      total,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Create Invoice
            </p>

            <h2 className="mt-1 text-xl font-bold text-gray-900">
              {product.name}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 p-6">
          {/* Stock */}
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-500">
              Available stock
            </span>

            <span className="text-sm font-semibold text-gray-900">
              {product.quantity} units
            </span>
          </div>

          {/* Price */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Selling Price
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                ₹
              </span>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full rounded-xl border border-gray-200 py-3 pl-9 pr-4 text-lg font-semibold outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
              />
            </div>

            <p className="mt-2 text-xs text-gray-400">
              Default price: ₹
              {Number(product.price).toLocaleString("en-IN")}
            </p>
          </div>

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Quantity
            </label>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Minus size={18} />
              </button>

              <input
                type="number"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={handleQuantityChange}
                className="h-12 flex-1 rounded-xl border border-gray-200 text-center text-lg font-semibold outline-none focus:border-gray-400"
              />

              <button
                type="button"
                onClick={increaseQuantity}
                disabled={quantity >= product.quantity}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="rounded-2xl bg-black p-5 text-white">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">
                {quantity} × ₹
                {Number(price || 0).toLocaleString("en-IN")}
              </span>

              <span className="text-xs uppercase tracking-wide text-gray-400">
                Total
              </span>
            </div>

            <p className="mt-2 text-3xl font-bold">
              ₹{total.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Warning */}
          {product.quantity === 0 && (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              <AlertCircle size={18} />

              <span>This product is out of stock.</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex gap-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerateInvoice}
            disabled={product.quantity === 0}
            className="flex flex-[1.5] items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            <Printer size={18} />
            Generate Invoice
          </button>
        </div>
      </div>
    </div>
  );
}