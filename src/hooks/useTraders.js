import { useState, useEffect } from "react";
const API_BASE = `${import.meta.env.VITE_API_URL}api/traders`;

export function useTraders() {
  const [traders, setTraders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all traders
  const fetchAllTraders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API_BASE);
      if (!res.ok) throw new Error("Failed to fetch traders");
      const data = await res.json();
      setTraders(data.traders || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch trader by ID
  const fetchTraderById = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error("Failed to fetch trader");
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Create new trader
  const createTrader = async (traderData) => {
    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(traderData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create trader");
      }
      const data = await res.json();
      await fetchAllTraders(); // refresh list
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Update trader by ID
  const updateTrader = async (id, traderData) => {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(traderData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update trader");
      }
      const data = await res.json();
      await fetchAllTraders(); // refresh list
      return data;
    } catch (err) {
      throw err;
    }
  };

  // Create trader order
  const createTraderOrder = async (orderData) => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to create order");
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Update trader order by ID
  const updateTraderOrder = async (id, orderData) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update order");
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Delete trader order by ID
  const deleteTraderOrder = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete order");
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Record payment
  const recordPayment = async (paymentData) => {
    try {
      const res = await fetch(`${API_BASE}/payments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to record payment");
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Update payment by ID
  const updatePayment = async (id, paymentData) => {
    try {
      const res = await fetch(`${API_BASE}/payments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to update payment");
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Delete payment by ID
  const deletePayment = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/payments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Failed to delete payment");
      }
      return await res.json();
    } catch (err) {
      throw err;
    }
  };

  // Get total profit
  const getTotalProfit = async () => {
    try {
      const res = await fetch(`${API_BASE}/profits/total`);
      if (!res.ok) throw new Error("Failed to fetch total profit");
      const data = await res.json();
      return data || 0;
    } catch (err) {
      throw err;
    }
  };
  // Get profit history filtered by date range
  const getProfitHistory = async (from, to) => {
    try {
      const query = new URLSearchParams();
      if (from) query.append("from", from);
      if (to) query.append("to", to);

      const res = await fetch(
        `${API_BASE}/profits/history?${query.toString()}`
      );
      if (!res.ok) throw new Error("Failed to fetch profit history");
      const data = await res.json();

      return data.allProfits.map((record) => ({
        date: new Date(record.createdAt).toLocaleDateString("ar-EG"),
        profit: record.totalCumulativeProfit,
      }));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchAllTraders();
  }, []);

  return {
    traders,
    loading,
    error,
    fetchAllTraders,
    fetchTraderById,
    createTrader,
    updateTrader,
    createTraderOrder,
    updateTraderOrder,
    deleteTraderOrder,
    recordPayment,
    updatePayment,
    deletePayment,
    getTotalProfit,
    getProfitHistory,
  };
}
