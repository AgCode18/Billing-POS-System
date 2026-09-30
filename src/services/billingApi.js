const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data?.message || "Something went wrong"
        );
    }

    return data;
}

// =========================
// PRODUCTS
// =========================

export const getProducts = async () => {
    return request("/products");
};

export const getProductById = async (id) => {
    return request(`/products/${id}`);
};

export const createProduct = async (product) => {
    return request("/products", {
        method: "POST",
        body: JSON.stringify(product),
    });
};

export const updateProduct = async (id, product) => {
    return request(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(product),
    });
};

export const deleteProduct = async (id) => {
    return request(`/products/${id}`, {
        method: "DELETE",
    });
};

// =========================
// INVOICES
// =========================

export const getInvoices = async () => {
    return request("/invoices");
};

export const getInvoiceById = async (id) => {
    return request(`/invoices/${id}`);
};

export const createInvoice = async (invoice) => {
    return request("/invoices", {
        method: "POST",
        body: JSON.stringify(invoice),
    });
};

export const deleteInvoice = async (id) => {
    return request(`/invoices/${id}`, {
        method: "DELETE",
    });
};

// =========================
// SETTINGS
// =========================

export const getSettings = async () => {
    return request("/settings");
};

export const updateSettings = async (settings) => {
    return request("/settings", {
        method: "PUT",
        body: JSON.stringify(settings),
    });
};