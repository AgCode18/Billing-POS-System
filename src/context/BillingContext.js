"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

const BillingContext = createContext();

export function BillingProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // =========================
    // LOAD DATA
    // =========================

    useEffect(() => {
        try {
            const storedProducts =
                localStorage.getItem("billing_products");

            const storedInvoices =
                localStorage.getItem("billing_invoices");

            if (storedProducts) {
                setProducts(JSON.parse(storedProducts));
            }

            if (storedInvoices) {
                setInvoices(JSON.parse(storedInvoices));
            }
        } catch (error) {
            console.error("Failed to load billing data:", error);
        }

        setIsLoaded(true);
    }, []);

    // =========================
    // SAVE PRODUCTS
    // =========================

    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem(
            "billing_products",
            JSON.stringify(products)
        );
    }, [products, isLoaded]);

    // =========================
    // SAVE INVOICES
    // =========================

    useEffect(() => {
        if (!isLoaded) return;

        localStorage.setItem(
            "billing_invoices",
            JSON.stringify(invoices)
        );
    }, [invoices, isLoaded]);

    // =========================
    // ADD PRODUCT
    // =========================

    const addProduct = (product) => {
        const newProduct = {
            id: crypto.randomUUID(),
            name: product.name.trim(),
            price: Number(product.price),
            quantity: Number(product.quantity),
            createdAt: new Date().toISOString(),
        };

        setProducts((prev) => [
            ...prev,
            newProduct,
        ]);

        return newProduct;
    };

    // =========================
    // UPDATE PRODUCT
    // =========================

    const updateProduct = (id, updatedData) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === id
                    ? {
                        ...product,
                        ...updatedData,
                        price:
                            updatedData.price !== undefined
                                ? Number(updatedData.price)
                                : product.price,
                        quantity:
                            updatedData.quantity !== undefined
                                ? Number(updatedData.quantity)
                                : product.quantity,
                    }
                    : product
            )
        );
    };

    // =========================
    // DELETE PRODUCT
    // =========================

    const deleteProduct = (id) => {
        setProducts((prev) =>
            prev.filter(
                (product) => product.id !== id
            )
        );
    };

    // =========================
    // REDUCE STOCK
    // =========================

    const reduceStock = (id, quantity) => {
        setProducts((prev) =>
            prev.map((product) =>
                product.id === id
                    ? {
                        ...product,
                        quantity: Math.max(
                            0,
                            product.quantity - Number(quantity)
                        ),
                    }
                    : product
            )
        );
    };

    // =========================
    // GENERATE INVOICE NUMBER
    // =========================

    const generateInvoiceNumber = () => {
        const currentNumber =
            Number(
                localStorage.getItem(
                    "billing_invoice_counter"
                )
            ) || 0;

        const nextNumber = currentNumber + 1;

        localStorage.setItem(
            "billing_invoice_counter",
            String(nextNumber)
        );

        return `INV-${String(nextNumber).padStart(
            5,
            "0"
        )}`;
    };

    // =========================
    // CREATE INVOICE
    // =========================

    const createInvoice = (invoiceData) => {
        const newInvoice = {
            id: crypto.randomUUID(),

            invoiceNumber:
                generateInvoiceNumber(),

            productId: invoiceData.productId,

            productName: invoiceData.name,

            price: Number(invoiceData.price),

            quantity: Number(invoiceData.quantity),

            total: Number(invoiceData.total),

            createdAt:
                new Date().toISOString(),
        };

        setInvoices((prev) => [
            newInvoice,
            ...prev,
        ]);

        // Reduce stock
        reduceStock(
            invoiceData.productId,
            invoiceData.quantity
        );

        return newInvoice;
    };

    // =========================
    // DELETE INVOICE
    // =========================

    const deleteInvoice = (id) => {
        setInvoices((prev) =>
            prev.filter(
                (invoice) => invoice.id !== id
            )
        );
    };

    // =========================
    // CLEAR ALL DATA
    // =========================

    const clearAllData = () => {
        setProducts([]);
        setInvoices([]);

        localStorage.removeItem(
            "billing_products"
        );

        localStorage.removeItem(
            "billing_invoices"
        );
    };

    return (
        <BillingContext.Provider
            value={{
                products,
                invoices,

                addProduct,
                updateProduct,
                deleteProduct,

                reduceStock,

                createInvoice,
                deleteInvoice,

                clearAllData,
            }}
        >
            {children}
        </BillingContext.Provider>
    );
}

export function useBilling() {
    const context = useContext(
        BillingContext
    );

    if (!context) {
        throw new Error(
            "useBilling must be used inside BillingProvider"
        );
    }

    return context;
}   