import { useState, useEffect } from "react";

const API_BASE = `${import.meta.env.VITE_API_URL}api/traders`;

export function useTraderDetail(traderId) {
  const [trader, setTrader] = useState(null);
  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [traderRes, ordersRes, paymentsRes, productsRes] =
        await Promise.all([
          fetch(`${API_BASE}/${traderId}`),
          fetch(`${API_BASE}/${traderId}/orders`),
          fetch(`${API_BASE}/${traderId}/payments`),
          fetch(`${import.meta.env.VITE_API_URL}api/products/units`),
        ]);

      if (!traderRes.ok) throw new Error("Failed to fetch trader");
      if (!ordersRes.ok) throw new Error("Failed to fetch orders");
      if (!paymentsRes.ok) throw new Error("Failed to fetch payments");
      if (!productsRes.ok) throw new Error("Failed to fetch products");

      const traderData = await traderRes.json();
      const ordersData = await ordersRes.json();
      const paymentsData = await paymentsRes.json();
      const productsData = await productsRes.json();

      setTrader(traderData.trader);
      setOrders(ordersData.orders || []);
      setPayments(paymentsData.payments || []);
      setProducts(productsData.productCounts || {});
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (traderId) {
      fetchData();
    }
  }, [traderId]);

  return {
    trader,
    orders,
    payments,
    products,
    loading,
    error,
    refresh: fetchData,
  };
}
