import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, Plus, Search, ArrowLeft } from "lucide-react";
import EditShippingCostModal from "../components/shipping/EditShippingCostModal"; // import modal
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { EGYPTIAN_GOVERNORATES } from "../constants/governorates";

import OrdersFilter from "../components/orders/OrdersFilter";
import OrdersList from "../components/orders/OrdersList";
import ProductList from "../components/orders/ProductList";
import AddEditModal from "../components/orders/AddEditModal";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [showEditCostShipping, setShowEditCostShipping] = useState(false);
  const [shippingGovernorates, setShippingGovernorates] = useState([]);
  useEffect(() => {
    if (showEditCostShipping) {
      axios
        .get(`${import.meta.env.VITE_API_URL}api/shipping`)
        .then((res) => setShippingGovernorates(res.data))
        .catch(() =>
          toast({
            title: "خطأ",
            description: "فشل في جلب بيانات الشحن",
            variant: "destructive",
          })
        );
    }
  }, [showEditCostShipping]);

  const [formData, setFormData] = useState({
    customerName: "",
    phone: "",
    address: "",
    governorate: "",
    notes: "",
    products: [],
  });

  // Fetch orders from backend
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/orders`
      );
      setOrders(response.data.orders || []);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في جلب الطلبات",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders by status and search term
  useEffect(() => {
    let filtered = [...orders];
    if (statusFilter !== "all") {
      filtered = filtered.filter((o) => o.status === statusFilter);
    }
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.customerName.toLowerCase().includes(lowerSearch) ||
          o.phone.toLowerCase().includes(lowerSearch) ||
          o.invoiceNumber.toLowerCase().includes(lowerSearch)
      );
    }
    setFilteredOrders(filtered);
  }, [orders, statusFilter, searchTerm]);

  // Update order status inline
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}api/orders/${orderId}`, {
        status: newStatus,
      });
      toast({ title: "تم بنجاح", description: "تم تحديث حالة الطلب." });
      fetchOrders();
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تحديث حالة الطلب",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation example
    if (formData.customerName.length < 3) {
      toast({
        title: "خطأ",
        description: "اسم العميل يجب أن يكون 3 حروف أو أكثر.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.phone.match(/^(010|011|012|015)[0-9]{8}$/)) {
      toast({
        title: "خطأ",
        description: "رقم الهاتف غير صالح.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.address || formData.address.length < 5) {
      toast({
        title: "خطأ",
        description: "العنوان يجب أن يكون 5 حروف أو أكثر.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.governorate) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المحافظة.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.products || formData.products.length === 0) {
      toast({
        title: "خطأ",
        description: "يجب إضافة منتجات للطلب.",
        variant: "destructive",
      });
      return;
    }

    try {
      if (selectedOrder) {
        await axios.put(
          `${import.meta.env.VITE_API_URL}api/orders/${selectedOrder._id}`,
          formData
        );
        toast({
          title: "تم بنجاح",
          description: "تم تحديث الطلب بنجاح.",
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}api/orders`, formData);
        toast({
          title: "تم بنجاح",
          description: "تم إنشاء الطلب بنجاح.",
        });
      }
      resetForm();
      setShowAddModal(false);
      setShowEditModal(false);
      fetchOrders();
    } catch (error) {
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "فشل في حفظ الطلب",
        variant: "destructive",
      });
    }
  };

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setFormData({
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      governorate: order.governorate,
      notes: order.notes || "",
      products: order.products || [],
    });
    setShowEditModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}api/orders/${id}`);
        toast({
          title: "تم بنجاح",
          description: "تم حذف الطلب بنجاح",
        });
        fetchOrders();
      } catch (error) {
        toast({
          title: "خطأ",
          description: "فشل في حذف الطلب",
          variant: "destructive",
        });
      }
    }
  };

  // Add this inside your Orders component, before the return statement:

  const resetForm = () => {
    setFormData({
      customerName: "",
      phone: "",
      address: "",
      governorate: "",
      notes: "",
      products: [],
    });
    setSelectedOrder(null);
  };

  // Add handleCloseModal to close both modals and reset form
  const handleCloseModal = () => {
    resetForm();
    setShowAddModal(false);
    setShowEditModal(false);
  };

  // Stats cards JSX (place inside <main> before OrdersList)
  const StatsCards = () => {
    const totalOrders = orders.filter(
      (order) => order.status === "معلق"
    ).length;
    console.log(totalOrders);
    console.log(orders);
    const totalProductsOrdered = orders.reduce(
      (sum, order) =>
        order.status === "معلق"
          ? sum + order.products.reduce((pSum, p) => pSum + p.quantity, 0)
          : sum,
      0
    );
    const totalRevenue = orders.reduce(
      (sum, order) =>
        order.status === "تم الشحن"
          ? sum +
            order.products.reduce((pSum, p) => pSum + p.price * p.quantity, 0)
          : sum,
      0
    );

    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                إجمالي الطلبات المعلقه
              </p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <Package className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">
                إجمالي المنتجات المطلوبة
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {totalProductsOrdered}
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              {/* You can import BarChart3 icon if needed */}
              <svg
                className="h-6 w-6 text-yellow-600" /* icon svg here */
              ></svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">إجمالي الإيرادات</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalRevenue.toFixed(2)} جنيه
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              {/* You can import DollarSign icon if needed */}
              <svg className="h-6 w-6 text-green-600" /* icon svg here */></svg>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
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
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  إدارة الطلبات
                </h1>
                <p className="text-sm text-gray-600">
                  عرض وإدارة الطلبات الواردة
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              setShowEditCostShipping(true);
            }}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
          >
            <Plus className="h-4 w-4" />
            <span>تعديل سعر الشحن</span>
          </button>
          {/* <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
          >
            <Plus className="h-4 w-4" />
            <span>إضافة طلب جديد</span>
          </button> */}
        </div>
      </header>

      {/* Filters and Search */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <StatsCards />
        <EditShippingCostModal
          show={showEditCostShipping}
          onClose={() => setShowEditCostShipping(false)}
          governorates={shippingGovernorates}
        />

        <div className="relative max-w-md mt-4 my-6">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="البحث عن طلب..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>
        <OrdersFilter
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
        />

        {/* Orders List */}
        <OrdersList
          orders={filteredOrders}
          isLoading={isLoading}
          onUpdateStatus={updateOrderStatus}
          onEdit={openEditModal}
          onDelete={handleDelete}
        />

        {/* Use AddEditModal component */}
        <AddEditModal
          showAddModal={showAddModal}
          showEditModal={showEditModal}
          formData={formData}
          setFormData={setFormData}
          onClose={handleCloseModal}
          onSubmit={handleSubmit}
        />
      </main>
    </div>
  );
};

export default Orders;
