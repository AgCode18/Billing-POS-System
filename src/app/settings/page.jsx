"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Store,
  Phone,
  MapPin,
  Save,
  RotateCcw,
  Trash2,
} from "lucide-react";

const DEFAULT_SETTINGS = {
  shopName: "MY SHOP",
  address: "Your Shop Address",
  phone: "9876543210",
};

export default function SettingsPage() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("billing_settings");

      if (stored) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...JSON.parse(stored),
        });
      }
    } catch (error) {
      console.error("Failed to load settings:", error);
    }
  }, []);

  const handleChange = (field, value) => {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!settings.shopName.trim()) {
      alert("Please enter shop name.");
      return;
    }

    if (!settings.address.trim()) {
      alert("Please enter shop address.");
      return;
    }

    if (!settings.phone.trim()) {
      alert("Please enter phone number.");
      return;
    }

    localStorage.setItem(
      "billing_settings",
      JSON.stringify({
        shopName: settings.shopName.trim(),
        address: settings.address.trim(),
        phone: settings.phone.trim(),
      }),
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleReset = () => {
    const confirmed = window.confirm("Reset shop settings to default?");

    if (!confirmed) return;

    setSettings(DEFAULT_SETTINGS);

    localStorage.setItem("billing_settings", JSON.stringify(DEFAULT_SETTINGS));

    setSaved(false);
  };

  const handleClearData = () => {
    const confirmed = window.confirm(
      "This will delete all products and invoices. Are you sure?",
    );

    if (!confirmed) return;

    localStorage.removeItem("billing_products");
    localStorage.removeItem("billing_invoices");
    localStorage.removeItem("billing_invoice_counter");

    alert("All billing data has been cleared.");

    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-8 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
              <Settings size={20} />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                Settings
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your shop and billing preferences.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl p-4 sm:p-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Shop Settings */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-200 bg-white">
              <div className="border-b border-gray-200 p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100">
                    <Store size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      Shop Information
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                      These details will appear on invoices.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSave} className="space-y-5 p-5 sm:p-6">
                {/* Shop Name */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Shop Name
                  </label>

                  <div className="relative">
                    <Store
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="text"
                      value={settings.shopName}
                      onChange={(e) => handleChange("shopName", e.target.value)}
                      placeholder="My Shop"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Shop Address
                  </label>

                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-3.5 text-gray-400"
                    />

                    <textarea
                      rows={3}
                      value={settings.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      placeholder="Enter shop address"
                      className="w-full resize-none rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Phone Number
                  </label>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      type="tel"
                      value={settings.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      placeholder="9876543210"
                      className="w-full rounded-xl border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <RotateCcw size={17} />
                    Reset
                  </button>

                  <button
                    type="submit"
                    className="flex items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-800"
                  >
                    <Save size={17} />
                    Save Settings
                  </button>
                </div>

                {saved && (
                  <div className="rounded-xl bg-green-50 p-3 text-center text-sm font-medium text-green-700">
                    Settings saved successfully.
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
              <h2 className="font-bold text-gray-900">Invoice Preview</h2>

              <p className="mt-1 text-sm text-gray-500">
                This information will be used on printed invoices.
              </p>

              <div className="mt-5 rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-center">
                <p className="font-bold text-gray-900">
                  {settings.shopName || "MY SHOP"}
                </p>

                <p className="mt-2 whitespace-pre-line text-xs text-gray-500">
                  {settings.address || "Your Shop Address"}
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  Phone: {settings.phone || "9876543210"}
                </p>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-2xl border border-red-200 bg-white p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                  <Trash2 size={19} className="text-red-600" />
                </div>

                <div>
                  <h2 className="font-bold text-gray-900">Danger Zone</h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Delete all billing data.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearData}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
              >
                <Trash2 size={17} />
                Clear All Billing Data
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
