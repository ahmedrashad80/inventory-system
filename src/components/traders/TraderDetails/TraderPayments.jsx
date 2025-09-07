import React, { useState } from "react";
import { toast } from "sonner";
import AddEditPaymentModal from "./AddEditPaymentModal";

const TraderPayments = ({ payments, onRefresh }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  const handleDelete = async (paymentId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذه الدفعة؟")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/traders/payments/${paymentId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete payment");
      toast.success("تم حذف الدفعة بنجاح");
      onRefresh();
    } catch (error) {
      toast.error(error.message || "فشل في حذف الدفعة");
    }
  };

  const openAddModal = () => {
    setEditingPayment(null);
    setShowPaymentModal(true);
  };

  const openEditModal = (payment) => {
    setEditingPayment(payment);
    setShowPaymentModal(true);
  };

  return (
    <div dir="rtl">
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          إضافة دفعة جديدة
        </button>
      </div>

      {payments.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد دفعات</p>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow-sm drop-shadow-xl/50">
            <thead className="bg-teal-500">
              <tr className="text-right">
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                  المبلغ
                </th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                  طريقة الدفع
                </th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                  ملاحظات
                </th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                  تاريخ التسجيل
                </th>
                <th className="px-6 py-3 text-xs font-medium text-white uppercase tracking-wider">
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-300">
              {payments.map((payment) => (
                <tr
                  key={payment._id}
                  className="text-right hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {payment.amount.toFixed(2)} جنيه
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.paymentMethod}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.notes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex space-x-2 space-x-reverse">
                      <button
                        onClick={() => openEditModal(payment)}
                        className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDelete(payment._id)}
                        className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                      >
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showPaymentModal && (
        <AddEditPaymentModal
          payment={editingPayment}
          onClose={() => setShowPaymentModal(false)}
          onSaved={() => {
            setShowPaymentModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default TraderPayments;
