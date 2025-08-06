import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Boxes,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  Package,
  Settings,
  Eye,
  Upload,
  Download,
  X,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useComponents } from "@/hooks/useComponents";

const Products = () => {
  const { products, isLoading, addProduct, updateProduct, deleteProduct } =
    useProducts();
  const { components } = useComponents();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // تعديل حالة formData لتحتوي على مصفوفة واحدة للصور
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    price: "",
    components: [],
    images: [], // مصفوفة واحدة لجميع الصور
  });
  // في useState أضف حالة جديدة للصور القديمة
  const [oldImages, setOldImages] = useState([]);

  // تعديل دالة handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // إضافة البيانات الأساسية
      const productData = {
        code: formData.code,
        name: formData.name,
        price: formData.price || 0,
        description: formData.description || "",
        components: formData.components || [],
      };

      // إضافة البيانات للFormData
      Object.keys(productData).forEach((key) => {
        if (key === "components") {
          formDataToSend.append(key, JSON.stringify(productData[key]));
        } else {
          formDataToSend.append(key, productData[key]);
        }
      });

      // إضافة جميع الصور
      formData.images.forEach((img, index) => {
        if (typeof img === "string") {
          // إذا كانت الصورة URL
          formDataToSend.append(`image`, img);
        } else {
          // إذا كانت الصورة ملف جديد
          formDataToSend.append(`image`, img);
        }
      });

      if (selectedProduct) {
        await updateProduct.mutateAsync({
          id: selectedProduct._id,
          data: formDataToSend,
        });
      } else {
        await addProduct.mutateAsync(formDataToSend);
      }

      toast({
        title: "تم بنجاح",
        description: selectedProduct
          ? "تم تحديث المنتج بنجاح"
          : "تم إضافة المنتج بنجاح",
      });

      resetForm();
      setOldImages([]); // إعادة تعيين الصور القديمة
      setShowAddModal(false);
      setShowEditModal(false);
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "خطأ",
        description: error.response?.data?.message || "فشل في حفظ المنتج",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
      try {
        await deleteProduct.mutateAsync(id);
        toast({
          title: "تم بنجاح",
          description: "تم حذف المنتج بنجاح",
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        toast({
          title: "خطأ",
          description: "فشل في حذف المنتج",
          variant: "destructive",
        });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      code: "",
      name: "",
      description: "",
      price: "",
      components: [],
      images: [], // تغيير من null إلى مصفوفة فارغة
    });
    setSelectedProduct(null);
    setOldImages([]); // تأكد من إعادة تعيين الصور القديمة أيضاً
  };

  const openEditModal = (product) => {
    setSelectedProduct(product);
    setFormData({
      code: product.code,
      name: product.name,
      price: product.price || 0,
      description: product.description || "",
      components:
        product.components?.map((comp) => ({
          component: comp.component?._id || comp.component,
          componentName: comp.componentName || comp.component?.name || "",
          quantity_required: comp.quantity_required,
        })) || [],
      images: product.image || [], // نضع الصور الموجودة
    });
    setShowEditModal(true);
  };

  const addComponent = () => {
    setFormData({
      ...formData,
      components: [
        ...formData.components,
        { component: "", quantity_required: 1 },
      ],
    });
  };

  const removeComponent = (index) => {
    const newComponents = formData.components.filter((_, i) => i !== index);
    setFormData({ ...formData, components: newComponents });
  };

  const updateComponent = (index, field, value) => {
    const newComponents = [...formData.components];
    if (field === "component") {
      const selectedComp = components.find((c) => c._id === value);
      newComponents[index] = {
        ...newComponents[index],
        component: value,
        componentName: selectedComp ? selectedComp.name : "",
      };
    } else {
      newComponents[index][field] = value;
    }
    setFormData({ ...formData, components: newComponents });
  };

  const filteredProducts =
    products?.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  // تعديل دالة handleImageChange
  const handleImageChange = (e) => {
    if (e.target.files?.length) {
      const newImages = Array.from(e.target.files);
      setFormData((prev) => {
        const updatedImages = [...prev.images];
        newImages.forEach((img) => {
          if (updatedImages.length < 5) {
            // التحقق من حد 5 صور
            updatedImages.push(img);
          }
        });
        return {
          ...prev,
          images: updatedImages,
        };
      });
    }
  };

  // دالة لحذف أي صورة
  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
    }));
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
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
                  <Boxes className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    إدارة المنتجات
                  </h1>
                  <p className="text-sm text-gray-600">
                    عرض وإدارة المنتجات النهائية
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowAddModal(true);
              }}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all flex items-center space-x-2 space-x-reverse"
            >
              <Plus className="h-4 w-4" />
              <span>إضافة منتج جديد</span>
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
                placeholder="البحث عن منتج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                <p className="text-sm text-gray-600 mb-1">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products?.length || 0}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Boxes className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">المنتجات النشطة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products?.length || 0}
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
                <p className="text-sm text-gray-600 mb-1">المكونات المستخدمة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {products?.reduce(
                    (sum, prod) => sum + (prod.components?.length || 0),
                    0
                  ) || 0}
                </p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <p className="mr-3 text-gray-600">جاري التحميل...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Boxes className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">لا توجد منتجات متاحة</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  {/* Product Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500">{product.code}</p>
                    </div>
                    <div className="flex space-x-1 space-x-reverse">
                      <button
                        onClick={() => openEditModal(product)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        title="تعديل"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        title="حذف"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Product Description */}
                  {product.description && (
                    <p className="text-sm text-gray-600 mb-4">
                      {product.description}
                    </p>
                  )}
                  {/* Product price */}
                  <div className="text-sm text-gray-700 mb-4">
                    <span className="font-medium">السعر:</span>{" "}
                    {product.price ? (
                      <span className="text-green-600">
                        {product.price} جنيه
                      </span>
                    ) : (
                      <span className="text-red-600">غير محدد</span>
                    )}
                  </div>

                  {/* Components List */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-700">
                      المكونات المطلوبة:
                    </h4>
                    {product.components && product.components.length > 0 ? (
                      <div className="space-y-1">
                        {product.components.map((comp, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between text-xs bg-gray-50 rounded px-2 py-1"
                          >
                            <span className="text-gray-700">
                              {comp.component?.name || comp.componentName}
                            </span>
                            <span className="font-medium text-gray-900">
                              {comp.quantity_required}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">
                        لا توجد مكونات محددة
                      </p>
                    )}
                  </div>

                  {/* Product Image */}
                  {product.image.length ? (
                    // there is more than image in array
                    <div className="mt-4">
                      {product.image.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={`${product.name}-${index + 1}`}
                          className="w-full rounded-lg mb-2"
                        />
                      ))}
                    </div>
                  ) : (
                    ""
                  )}

                  {/* Product Footer */}
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      تم الإنشاء:{" "}
                      {new Date(product.createdAt).toLocaleDateString("ar")}
                    </span>
                    <Link
                      to="/manufacturing"
                      state={{ selectedProduct: product }}
                      className="text-xs bg-gradient-to-r from-green-600 to-green-700 text-white px-3 py-1 rounded-full hover:shadow-md transition-all"
                    >
                      تصنيع الآن
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {selectedProduct ? "تعديل المنتج" : "إضافة منتج جديد"}
              </h3>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      كود المنتج
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({ ...formData, code: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="مثال: PRD-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم المنتج
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="مثال: كرسي مكتبي"
                    />
                  </div>
                </div>
                {/* price */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      سعر المنتج
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="مثال: 100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الوصف (اختياري)
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows="3"
                    placeholder="وصف المنتج..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    صور المنتج ({formData.images.length}/5)
                  </label>

                  {formData.images.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group">
                            <img
                              src={
                                typeof img === "string"
                                  ? img
                                  : URL.createObjectURL(img)
                              }
                              alt={`صورة ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg border"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              title="حذف الصورة"
                            >
                              <X className="w-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {formData.images.length < 5 && (
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  )}
                </div>

                {/* Components Section */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      المكونات المطلوبة
                    </label>
                    <button
                      type="button"
                      onClick={addComponent}
                      className="text-green-600 hover:text-green-800 text-sm flex items-center space-x-1 space-x-reverse"
                    >
                      <Plus className="h-4 w-4" />
                      <span>إضافة مكون</span>
                    </button>
                  </div>

                  {/* Components Section in the form */}
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {formData.components.map((component, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-2 space-x-reverse p-3 bg-gray-50 rounded-lg"
                      >
                        <select
                          value={component.component || ""}
                          onChange={(e) =>
                            updateComponent(index, "component", e.target.value)
                          }
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        >
                          <option value="">اختر المكون</option>
                          {components?.map((comp) => (
                            <option key={comp._id} value={comp._id}>
                              {comp.name} ({comp.code})
                            </option>
                          ))}
                        </select>

                        <input
                          type="number"
                          min="1"
                          value={component.quantity_required}
                          onChange={(e) =>
                            updateComponent(
                              index,
                              "quantity_required",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="الكمية"
                          required
                        />

                        <button
                          type="button"
                          onClick={() => removeComponent(index)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}

                    {formData.components.length === 0 && (
                      <p className="text-sm text-gray-500 text-center py-4">
                        لم يتم إضافة أي مكونات بعد
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 space-x-reverse pt-4">
                  <button
                    type="submit"
                    className={`flex-1 bg-gradient-to-r ${
                      selectedProduct
                        ? "from-green-600 to-green-700"
                        : "from-green-600 to-green-700"
                    } text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all`}
                  >
                    {selectedProduct ? "تحديث المنتج" : "إضافة المنتج"}
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
    </div>
  );
};

export default Products;
