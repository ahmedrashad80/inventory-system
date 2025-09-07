import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useTraderDetail } from "../hooks/useTraderDetail";
import TraderHeader from "../components/traders/TraderDetails/TraderHeader";
import TraderInfo from "../components/traders/TraderDetails/TraderInfo";
import TraderOrders from "../components/traders/TraderDetails/TraderOrders";
import TraderPayments from "../components/traders/TraderDetails/TraderPayments";
import EditTraderModal from "../components/traders/TraderDetails/EditTraderModal";
import AddEditOrderModal from "../components/traders/TraderDetails/AddEditOrderModal";

const TraderPage = () => {
  const { id } = useParams();
  const { trader, orders, payments, products, loading, error, refresh } =
    useTraderDetail(id);
  const [activeTab, setActiveTab] = useState("info"); // info, orders, payments
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <TraderHeader
        traderName={trader.name}
        onBack={() => window.history.back()}
        onEdit={() => setShowEditModal(true)}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 space-x-reverse mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "info"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("info")}
          >
            معلومات التاجر
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "orders"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("orders")}
          >
            الطلبات ({orders.length})
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "payments"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("payments")}
          >
            الدفعات ({payments.length})
          </button>
        </div>

        {activeTab === "info" && <TraderInfo trader={trader} />}
        {activeTab === "orders" && (
          <TraderOrders
            orders={orders}
            products={products}
            onRefresh={refresh}
            onEditOrder={(order) => {
              setEditingOrder(order);
              setShowOrderModal(true);
            }}
            onAddOrder={() => {
              setEditingOrder(null);
              setShowOrderModal(true);
            }}
          />
        )}
        {activeTab === "payments" && (
          <TraderPayments payments={payments} onRefresh={refresh} />
        )}
      </div>
      {showEditModal && (
        <EditTraderModal
          trader={trader}
          onClose={() => setShowEditModal(false)}
          onUpdated={refresh}
        />
      )}
      {showOrderModal && (
        <AddEditOrderModal
          order={editingOrder}
          products={products}
          traderId={trader?._id}
          onClose={() => setShowOrderModal(false)}
          onSaved={() => {
            setShowOrderModal(false);
            refresh();
          }}
        />
      )}
    </div>
  );
};

export default TraderPage;
