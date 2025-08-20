import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  TrendingUp,
  Settings,
  Eye,
  Upload,
  Download,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useComponents } from "@/hooks/useComponents";
import ComponentMovements from "@/components/components/ComponentMovements";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Components = () => {
  const {
    components,
    isLoading,
    addComponent,
    updateComponent,
    deleteComponent,
    stockIn,
  } = useComponents();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  // unit_price: {
  //   type: Number,
  //   default: 0,
  // },

  // selling_price: {
  //   type: Number,
  //   default: function () {
  //     return this.0;
  //   },
  // }, in model of component i add selling price so i want change the code
  // if (selling_price && selling_price <= unit_price) {
  //   return res
  //     .status(400)
  //     .json({ message: "سعر البيع يجب أن يكون أكبر من " });
  // }

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    quantity: "",
    unit_price: "",
    selling_price: "",
    supplier: "",
    image: null,
    reason: "",
  });
  const [stockData, setStockData] = useState({
    quantity: "",
    reason: "",
  });

  const { data: movementsData, isLoading: isMovementsLoading } = useQuery({
    queryKey: ["component-movements"],

    queryFn: async () => {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/components/movements`
      );
      return response.data.movements;
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== null) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedComponent) {
        await updateComponent.mutateAsync({
          id: selectedComponent._id,
          data: formDataToSend,
        });
      } else {
        await addComponent.mutateAsync(formDataToSend);
      }

      toast({
        title: "تم بنجاح",
        description: selectedComponent
          ? "تم تحديث المكون بنجاح"
          : "تم إضافة المكون بنجاح",
      });

      resetForm();
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving component:", error);
      toast({
        title: "خطأ",
        description: "فشل في حفظ المكون",
        variant: "destructive",
      });
    }
  };

  const handleStockIn = async (e) => {
    e.preventDefault();
    try {
      await stockIn.mutateAsync({
        id: selectedComponent._id,
        data: {
          quantity: parseInt(stockData.quantity),
          reason: stockData.reason,
        },
      });

      toast({
        title: "تم بنجاح",
        description: `تم إضافة ${stockData.quantity} وحدة للمخزون`,
      });

      setStockData({ quantity: "", reason: "" });
      setShowStockModal(false);
      setSelectedComponent(null);
    } catch (error) {
      console.error("Error updating stock:", error);
      toast({
        title: "خطأ",
        description: "فشل في تحديث المخزون",
        variant: "destructive",
      });
    }
  };

  const handleAddComponent = async (e) => {
    e.preventDefault();
    try {
      // Ensure required fields are included
      if (!formData.code || !formData.name) {
        toast({
          title: "خطأ",
          description: "كود المكون واسم المكون مطلوبان",
          variant: "destructive",
        });
        return;
      }

      // Create data object for JSON submission
      const componentData = {
        code: formData.code,
        name: formData.name,
        quantity: parseInt(formData.quantity) || 0,
        unit_price: parseFloat(formData.unit_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        supplier: formData.supplier || "",
      };

      // If there's an image, use FormData instead
      if (formData.image) {
        const formDataToSend = new FormData();

        // Add all form fields to FormData
        Object.keys(componentData).forEach((key) => {
          formDataToSend.append(key, componentData[key]);
        });

        // Add the image
        formDataToSend.append("image", formData.image);

        await addComponent.mutateAsync(formDataToSend);
      } else {
        // No image, use JSON
        await addComponent.mutateAsync(componentData);
      }

      toast({
        title: "تم بنجاح",
        description: "تم إضافة المكون بنجاح",
      });

      resetForm();
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding component:", error);
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "فشل في إضافة المكون",
        variant: "destructive",
      });
    }
  };

  const handleUpdateComponent = async (e) => {
    e.preventDefault();
    try {
      // Ensure required fields are included
      if (!formData.code || !formData.name) {
        toast({
          title: "خطأ",
          description: "كود المكون واسم المكون مطلوبان",
          variant: "destructive",
        });
        return;
      }

      // Create data object for JSON submission
      const componentData = {
        code: formData.code,
        name: formData.name,
        quantity: parseInt(formData.quantity) || 0,
        unit_price: parseFloat(formData.unit_price) || 0,
        selling_price: parseFloat(formData.selling_price) || 0,
        supplier: formData.supplier || "",
        reason: formData.reason, // أضف السبب هنا
      };

      // If there's an image, use FormData instead
      if (formData.image) {
        const formDataToSend = new FormData();

        // Add all form fields to FormData
        Object.keys(componentData).forEach((key) => {
          formDataToSend.append(key, componentData[key]);
        });

        // Add the image
        formDataToSend.append("image", formData.image);

        await updateComponent.mutateAsync({
          id: selectedComponent._id,
          data: formDataToSend,
        });
      } else {
        // No image, use JSON
        await updateComponent.mutateAsync({
          id: selectedComponent._id,
          data: componentData,
        });
      }

      toast({
        title: "تم بنجاح",
        description: "تم تحديث المكون بنجاح",
      });

      resetForm();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating component:", error);
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "فشل في تحديث المكون",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المكون؟")) {
      try {
        await deleteComponent.mutateAsync(id);
        toast({
          title: "تم بنجاح",
          description: "تم حذف المكون بنجاح",
        });
      } catch (error) {
        console.error("Error deleting component:", error);
        toast({
          title: "خطأ",
          description: "فشل في حذف المكون",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      quantity: "",
      unit_price: "",
      selling_price: "",
      supplier: "",
      image: null,
      reason: "", // جديد
    });
    setSelectedComponent(null);
  };

  const openEditModal = (component) => {
    setSelectedComponent(component);
    setFormData({
      code: component.code,
      name: component.name,
      quantity: component.quantity.toString(),
      unit_price: component.unit_price.toString(),
      selling_price: component.selling_price.toString(),
      supplier: component.supplier || "",
      image: null,
      reason: "تعديل يدوي للمكون", // جديد
    });
    setShowEditModal(true);
  };

  const openStockModal = (component) => {
    setSelectedComponent(component);

    setShowStockModal(true);
  };

  const filteredComponents =
    components?.filter(
      (component) =>
        component.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        component.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

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
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    إدارة المكونات
                  </h1>
                  <p className="text-sm text-gray-600">
                    عرض وإدارة مكونات المصنع
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة مكون جديد</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="البحث عن مكون..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex space-x-2 space-x-reverse">
              <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Download className="h-4 w-4" />
                <span>تصدير</span>
              </button>
              <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Upload className="h-4 w-4" />
                <span>استيراد</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المكونات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {components?.length || 0}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الكمية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {components?.reduce((sum, comp) => sum + comp.quantity, 0) ||
                    0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي القيمة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(
                    components?.reduce(
                      (sum, comp) => sum + comp.quantity * comp.unit_price,
                      0
                    ) || 0
                  ).toFixed(2)}{" "}
                  جنيه
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Components Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              قائمة المكونات
            </h3>
          </div>

          {isLoading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-2 text-gray-600">جاري التحميل...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكود
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الاسم
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الكمية
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      سعر الوحدة
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      سعر البيع
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      المورد
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      الإجراءات
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredComponents.map((component) => (
                    <tr key={component._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {component.code}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {component.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            component.quantity > 100
                              ? "bg-green-100 text-green-800"
                              : component.quantity > 50
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {component.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {component.unit_price} جنيه
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {component.selling_price} جنيه
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {component.supplier || "غير محدد"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => openStockModal(component)}
                            className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                            title="إضافة للمخزون"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(component)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="تعديل"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(component._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="حذف"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredComponents.length === 0 && !isLoading && (
                <div className="p-8 text-center text-gray-500">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p>لا توجد مكونات متاحة</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Movements Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden my-12">
          {/* <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              سجل حركات المكونات
            </h3>
          </div> */}

          {isMovementsLoading ? (
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 text-center text-gray-500">
              جاري تحميل سجل الحركات...
            </div>
          ) : (
            <ComponentMovements movements={movementsData || []} />
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedComponent ? "تعديل المكون" : "إضافة مكون جديد"}
              </h3>

              <form
                onSubmit={
                  selectedComponent ? handleUpdateComponent : handleAddComponent
                }
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    كود المكون
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) =>
                      setFormData({ ...formData, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: CMP-001"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    اسم المكون
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: مسمار حديدي"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الكمية
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    سعر الوحدة (جنيه)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0"
                    value={formData.unit_price}
                    onChange={(e) =>
                      setFormData({ ...formData, unit_price: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    سعر البيع (جنيه)
                  </label>
                  <input
                    type="number"
                    step="1"
                    required
                    min={formData.unit_price}
                    value={formData.selling_price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        selling_price: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المورد (اختياري)
                  </label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) =>
                      setFormData({ ...formData, supplier: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="اسم المورد"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    صورة المكون (اختياري)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setFormData({ ...formData, image: e.target.files[0] })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {selectedComponent && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      سبب التعديل <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="مثال: تصحيح بيانات أو تعديل كمية"
                    />
                  </div>
                )}

                <div className="flex space-x-3 space-x-reverse pt-4">
                  <button
                    type="submit"
                    className={`flex-1 bg-gradient-to-r ${
                      selectedComponent
                        ? "from-green-600 to-green-700"
                        : "from-blue-600 to-purple-600"
                    } text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all`}
                  >
                    {selectedComponent ? "تحديث المكون" : "إضافة المكون"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Stock In Modal */}
      {showStockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                إضافة للمخزون - {selectedComponent?.name}
              </h3>

              <form onSubmit={handleStockIn} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الكمية المضافة
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={stockData.quantity}
                    onChange={(e) =>
                      setStockData({ ...stockData, quantity: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    سبب الإضافة (اختياري)
                  </label>
                  <input
                    type="text"
                    value={stockData.reason}
                    onChange={(e) =>
                      setStockData({ ...stockData, reason: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="مثال: توريد جديد"
                  />
                </div>

                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    الكمية الحالية:{" "}
                    <span className="font-semibold">
                      {selectedComponent?.quantity}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600">
                    الكمية بعد الإضافة:{" "}
                    <span className="font-semibold text-green-600">
                      {selectedComponent?.quantity +
                        parseInt(stockData.quantity || 0)}
                    </span>
                  </p>
                </div>

                <div className="flex space-x-3 space-x-reverse pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all"
                  >
                    إضافة للمخزون
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowStockModal(false);
                      setStockData({ quantity: "", reason: "" });
                      setSelectedComponent(null);
                    }}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    إلغاء
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Components;
