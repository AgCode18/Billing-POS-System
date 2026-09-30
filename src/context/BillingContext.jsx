"use client";

import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getProducts,
    createProduct,
    updateProduct as updateProductApi,
    deleteProduct as deleteProductApi,
    getInvoices,
    createInvoice as createInvoiceApi,
    deleteInvoice as deleteInvoiceApi,
} from "../services/billingApi";

const BillingContext = createContext(null);

export function BillingProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [invoices, setInvoices] = useState([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // =========================
    // LOAD DATA FROM BACKEND
    // =========================

    const loadData = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const [productsResponse, invoicesResponse] =
                await Promise.all([
                    getProducts(),
                    getInvoices(),
                ]);

            /*
             * Backend response ke according
             * data extraction handle kar rahe hain.
             */

            setProducts(
                productsResponse?.data ||
                productsResponse?.products ||
                productsResponse ||
                []
            );

            setInvoices(
                invoicesResponse?.data ||
                invoicesResponse?.invoices ||
                invoicesResponse ||
                []
            );
        } catch (error) {
            console.error(
                "Failed to load billing data:",
                error
            );

            setError(
                error.message ||
                "Failed to load billing data."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // =========================
    // ADD PRODUCT
    // =========================

    const addProduct = async (product) => {
        try {
            setError(null);

            const response = await createProduct({
                name: product.name.trim(),
                price: Number(product.price),
                quantity: Number(product.quantity),
            });

            const newProduct =
                response?.data ||
                response?.product ||
                response;

            setProducts((prev) => [
                ...prev,
                newProduct,
            ]);

            return newProduct;
        } catch (error) {
            console.error(
                "Failed to create product:",
                error
            );

            setError(
                error.message ||
                "Failed to create product."
            );

            throw error;
        }
    };

    // =========================
    // UPDATE PRODUCT
    // =========================

    const updateProduct = async (
        id,
        updatedData
    ) => {
        try {
            setError(null);

            const response =
                await updateProductApi(id, {
                    name: updatedData.name,
                    price:
                        updatedData.price !== undefined
                            ? Number(updatedData.price)
                            : undefined,
                    quantity:
                        updatedData.quantity !== undefined
                            ? Number(updatedData.quantity)
                            : undefined,
                });

            const updatedProduct =
                response?.data ||
                response?.product ||
                response;

            setProducts((prev) =>
                prev.map((product) =>
                    product.id === id
                        ? updatedProduct
                        : product
                )
            );

            return updatedProduct;
        } catch (error) {
            console.error(
                "Failed to update product:",
                error
            );

            setError(
                error.message ||
                "Failed to update product."
            );

            throw error;
        }
    };

    // =========================
    // DELETE PRODUCT
    // =========================

    const deleteProduct = async (id) => {
        try {
            setError(null);

            await deleteProductApi(id);

            setProducts((prev) =>
                prev.filter(
                    (product) =>
                        product.id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete product:",
                error
            );

            setError(
                error.message ||
                "Failed to delete product."
            );

            throw error;
        }
    };

    // =========================
    // CREATE INVOICE
    // =========================

    const createInvoice = async (
        invoiceData
    ) => {
        try {
            setError(null);

            const response =
                await createInvoiceApi({
                    productId:
                        invoiceData.productId,

                    name:
                        invoiceData.name,

                    price:
                        Number(invoiceData.price),

                    quantity:
                        Number(invoiceData.quantity),

                    total:
                        Number(invoiceData.total),
                });

            const newInvoice =
                response?.data ||
                response?.invoice ||
                response;

            setInvoices((prev) => [
                newInvoice,
                ...prev,
            ]);

            /*
             * Invoice create hone ke baad
             * backend stock reduce karega.
             *
             * Isliye products ko reload kar rahe hain
             * taaki latest stock frontend par aaye.
             */

            const productsResponse =
                await getProducts();

            setProducts(
                productsResponse?.data ||
                productsResponse?.products ||
                productsResponse ||
                []
            );

            return newInvoice;
        } catch (error) {
            console.error(
                "Failed to create invoice:",
                error
            );

            setError(
                error.message ||
                "Failed to create invoice."
            );

            throw error;
        }
    };

    // =========================
    // DELETE INVOICE
    // =========================

    const deleteInvoice = async (id) => {
        try {
            setError(null);

            await deleteInvoiceApi(id);

            setInvoices((prev) =>
                prev.filter(
                    (invoice) =>
                        invoice.id !== id
                )
            );
        } catch (error) {
            console.error(
                "Failed to delete invoice:",
                error
            );

            setError(
                error.message ||
                "Failed to delete invoice."
            );

            throw error;
        }
    };

    // =========================
    // REFRESH
    // =========================

    const refreshBillingData = async () => {
        await loadData();
    };

    return (
        <BillingContext.Provider
            value={{
                products,
                invoices,

                isLoading,
                error,

                addProduct,
                updateProduct,
                deleteProduct,

                createInvoice,
                deleteInvoice,

                refreshBillingData,
            }}
        >
            {children}
        </BillingContext.Provider>
    );
}

export function useBilling() {
    const context =
        useContext(BillingContext);

    if (!context) {
        throw new Error(
            "useBilling must be used inside BillingProvider"
        );
    }

    return context;
}