import api from "./api";

export const getStockTransactions = async (params = {}) => {
    const response = await api.get("/stock-transactions", {
        params,
    });

    return response.data;
};

export const getStockTransactionById = async (id) => {
    const response = await api.get(`/stock-transactions/${id}`);

    return response.data;
};