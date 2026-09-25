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
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white px-8 py-5">
        <h1 className="text-2xl font-bold text-gray-900">
          Products
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add and manage your products.
        </p>
      </header>

      <div className="p-8">
        {/* Add Product */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Plus size={20} />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">
                {editingId
                  ? "Edit Product"
                  : "Add Product"}
              </h2>

              <p className="text-sm text-gray-500">
                Enter product details below.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-5 md:grid-cols-4"
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
              />
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-gray-800"
              >
                <Plus size={18} />

                {editingId
                  ? "Update Product"
                  : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-5">
            <h2 className="font-bold text-gray-900">
              All Products
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {products.length} product
              {products.length !== 1 ? "s" : ""}
            </p>
          </div>

          {products.length === 0 ? (
            <div className="py-16 text-center">
              <Package
                size={35}
                className="mx-auto text-gray-300"
              />

              <p className="mt-3 text-sm text-gray-500">
                No products added yet.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-left">
                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Product
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Price
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Quantity
                    </th>

                    <th className="px-6 py-4 text-xs font-semibold uppercase text-gray-500">
                      Value
                    </th>

                    <th className="px-6 py-4 text-right text-xs font-semibold uppercase text-gray-500">
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                            <Package size={18} />
                          </div>

                          <span className="text-sm font-semibold text-gray-900">
                            {product.name}
                          </span>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        ₹
                        {product.price.toLocaleString(
                          "en-IN"
                        )}
                      </td>

                      <td className="px-6 py-4 text-sm">
                        {product.quantity}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium">
                        ₹
                        {(
                          product.price *
                          product.quantity
                        ).toLocaleString("en-IN")}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleEdit(product)
                            }
                            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                          >
                            <Pencil size={17} />
                          </button>

                          <button
                            onClick={() => {
                              const confirmed =
                                window.confirm(
                                  `Delete ${product.name}?`
                                );

                              if (confirmed) {
                                deleteProduct(
                                  product.id
                                );
                              }
                            }}
                            className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
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