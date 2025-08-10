import React from "react";
import ProductList from "./ProductList";
import { EGYPTIAN_GOVERNORATES } from "../../constants/governorates";

const AddEditModal = React.memo(
  ({
    showAddModal,
    showEditModal,
    formData,
    setFormData,
    onClose,
    onSubmit,
  }) => {
    if (!showAddModal && !showEditModal) return null;

    const isEdit = showEditModal;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-auto">
          <h2 className="text-xl font-bold mb-4">
            {isEdit ? "تعديل الطلب" : "إضافة طلب جديد"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <input
              type="text"
              value={formData.customerName}
              onChange={(e) =>
                setFormData({ ...formData, customerName: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="اسم العميل"
            />
            <input
              type="text"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="رقم الهاتف"
            />
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              required
              className="w-full border border-gray-300 rounded px-3 py-2"
              placeholder="العنوان"
            />
            <select
              required
              value={formData.governorate}
              onChange={(e) =>
                setFormData({ ...formData, governorate: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">اختر المحافظة</option>
              {EGYPTIAN_GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows={3}
              placeholder="ملاحظات"
            />
            <ProductList
              products={formData.products}
              setProducts={(products) => setFormData({ ...formData, products })}
            />
            <div className="flex justify-end space-x-2 space-x-reverse">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded border border-gray-300"
              >
                إلغاء
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              >
                {isEdit ? "تحديث" : "إضافة"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
);

export default AddEditModal;
