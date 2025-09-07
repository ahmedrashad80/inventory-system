import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Package, Plus, ArrowLeft } from "lucide-react";
import TradersList from "../components/traders/TradersList";
import AddTraderModal from "../components/traders/AddTraderModal";
import Profits from "../components/traders/Profits";

const Traders = () => {
  const [activeTab, setActiveTab] = useState("traders");
  const [showAddModal, setShowAddModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const refreshTraders = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 ml-2" />
                العودة للرئيسية
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    إدارة التجار
                  </h1>
                  <p className="text-sm text-gray-600">
                    عرض وإدارة التجار والعملاء
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة تاجر جديد</span>
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex space-x-4 space-x-reverse mb-6">
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "traders"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("traders")}
          >
            التجار
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeTab === "profits"
                ? "bg-teal-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setActiveTab("profits")}
          >
            الأرباح
          </button>
        </div>

        {/* Content */}
        {activeTab === "traders" && <TradersList refreshKey={refreshKey} />}
        {activeTab === "profits" && <Profits />}
      </div>

      {/* Add Trader Modal */}
      {showAddModal && (
        <AddTraderModal
          onClose={() => setShowAddModal(false)}
          onAdded={() => {
            refreshTraders();
            setShowAddModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Traders;
