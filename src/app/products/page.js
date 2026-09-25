"use client";

import { useState } from "react";
import {
  Plus,
  Package,
  Trash2,
  Pencil,
} from "lucide-react";

import { useBilling } from "../../context/BillingContext";

export default function ProductsPage() {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  } = useBilling();

  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const [editingId, setEditingId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      alert("Please enter a valid price.");
      return;
    }

    if (
      form.quantity === "" ||
      Number(form.quantity) < 0
    ) {
      alert("Please enter a valid quantity.");
      return;
    }

    if (editingId) {
      updateProduct(editingId, {
        name: form.name.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
      });

      setEditingId(null);
    } else {
      addProduct({
        name: form.name.trim(),
        price: Number(form.price),
        quantity: Number(form.quantity),
      });
    }

    setForm({
      name: "",
      price: "",
      quantity: "",
    });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      price: product.price,
      quantity: product.quantity,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      name: "",
      price: "",
      quantity: "",
    });
  };

  return (
    // 1. Added bg-gray-50 for consistency with other pages
    <div className="min-h-screen bg-gray-50">
      
      {/* Header - Full width background, centered content inside */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-5">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
            Products
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Add and manage your products.
          </p>
        </div>
      </header>

      {/* Main Content - Centered max-width for ultra-wide screens */}
      <div className="mx-auto max-w-7xl p-4 sm:p-8">
        
        {/* Add Product */}
        <div className="rounded-2xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-3 sm:mb-6">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <p className="text-sm text-gray-500">
                Enter product details below.
              </p>
            </div>
          </div>

          {/* Form Grid - 1 col mobile, 2 col tablet, 4 col desktop */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Product Name
              </label>

              <input
                type="text"
                placeholder="e.g. Coca Cola"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <input
                type="number"
                min="0"
                placeholder="0"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* Buttons - Stack on mobile, row on larger screens */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800 sm:flex-1"
              >
                <Plus size={18} />
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product Table */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white sm:mt-8">
          <div className="border-b border-gray-200 px-4 py-4 sm:px-6 sm:py-5">
            <h2 className="font-bold text-gray-900">All Products</h2>

            <p className="mt-1 text-sm text-gray-500">
              {products.length} product
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center sm:py-20">
              <Package size={35} className="mx-auto text-gray-300" />

              <p className="mt-3 text-sm text-gray-500">
                No products added yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* whitespace-nowrap prevents text from breaking awkwardly on mobile */}
              <table className="w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Product
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Price
                    </th>

                    <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Quantity
                    </th>

                    {/* Hide Value column on mobile (hidden md:table-cell) */}
                    <th className="hidden px-4 py-3 text-xs font-semibold uppercase text-gray-500 md:table-cell sm:px-6 sm:py-4">
                      Value
                    </th>

                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500 sm:px-6 sm:py-4">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-gray-100 last:border-0"
                    >
                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gray-100 sm:h-10 sm:w-10">
                            <Package size={18} />
                          </div>

                          <span className="text-sm font-semibold text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">
                        ₹
                        {product.price.toLocaleString("en-IN")}
                      </td>

                      <td className="px-4 py-3 text-sm sm:px-6 sm:py-4">
                        {product.quantity}
                      </td>

                      {/* Hide Value column on mobile */}
                      <td className="hidden px-4 py-3 text-sm font-medium md:table-cell sm:px-6 sm:py-4">
                        ₹
                        {(product.price * product.quantity).toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-4 py-3 sm:px-6 sm:py-4">
                        <div className="flex justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            title="Edit product"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => {
                              const confirmed = window.confirm(
                                `Delete ${product.name}?`
                              );

                              if (confirmed) {
                                deleteProduct(product.id);
                              }
                            }}
                            title="Delete product"
                            className="rounded-lg p-2 text-gray-500 transition hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}