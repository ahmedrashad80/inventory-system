import React, { useState } from "react";
import { toast } from "sonner";
import AddEditOrderModal from "./AddEditOrderModal";

const TraderOrders = ({ orders, products, onRefresh }) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}api/traders/orders/${orderId}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete order");
      toast.success("تم حذف الطلب بنجاح");
      onRefresh();
    } catch (error) {
      toast.error(error.message || "فشل في حذف الطلب");
    }
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setShowOrderModal(true);
  };

  const openEditModal = (order) => {
    setEditingOrder(order);
    setShowOrderModal(true);
  };

  const printInvoice = (order) => {
    console.log(order);
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; position:relative">
        <img src="/bm.png" alt="Logo" style="position: absolute; top: 1rem; left: 1rem; width: 100px; height: 100px; margin: 0;" />
        <h2 style="text-align: center; margin-bottom: 20px;">فاتورة البيع</h2>
        <p style="text-align: center; font-weight: bold; font-size: 1.2em;">شركة BM</p>
        <h3 style="text-align: center; margin-bottom: 20px;">فاتورة الطلب رقم ${
          order.orderNumber
        }</h3>
        <p><strong>اسم التاجر:</strong> ${order.traderId.name || "-"}</p>
        <p><strong>رقم الهاتف:</strong> ${order.traderId.phone || "-"}</p>
        <p><strong>العنوان:</strong> ${order.traderId.address || "-"}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">المنتج</th>
              <th style="border: 1px solid #ddd; padding: 8px;">الكمية</th>
              <th style="border: 1px solid #ddd; padding: 8px;">سعر الجملة</th>
              <th style="border: 1px solid #ddd; padding: 8px;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${order.products
              .map(
                (p) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${p.name}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  p.quantity
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  p.wholesalePrice?.toFixed(2) || "0.00"
                } جنيه</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  p.totalPrice?.toFixed(2) || "0.00"
                } جنيه</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">الإجمالي</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.totalAmount.toFixed(
                2
              )} جنيه</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">الدفعة الأولى</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.paidAmount.toFixed(
                2
              )} جنيه</td>
            </tr>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">المتبقي</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${order.remainingAmount.toFixed(
                2
              )} جنيه</td>
            </tr>
          </tfoot>
        </table>
        <p style="text-align: center; margin-top: 20px;">شكراً لتعاملكم معنا!</p>
        <p style="text-align: center; margin-top: 10px; font-size: 0.9em;">رقم الاتصال: 01091144077</p>
      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  const truncateNotes = (notes) => {
    if (!notes) return "-";
    return notes.length > 20 ? notes.slice(0, 20) + "..." : notes;
  };

  return (
    <div dir="rtl">
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddModal}
          className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
        >
          إضافة طلب جديد
        </button>
      </div>

      {orders.length === 0 ? (
        <p className="text-center text-gray-500">لا توجد طلبات</p>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full drop-shadow-xl/50">
              <thead className="bg-teal-500">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    رقم الطلب
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    إجمالي المبلغ
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    الدفعة الأولى
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    المتبقي
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    الملاحظات
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-teal-300">
                {orders.map((order) => {
                  const isExpanded = expandedOrderId === order._id;
                  return (
                    <React.Fragment key={order._id}>
                      <tr
                        className="cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleExpand(order._id)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.totalAmount.toFixed(2)} جنيه
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.paidAmount.toFixed(2)} جنيه
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {order.remainingAmount.toFixed(2)} جنيه
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {truncateNotes(order.notes)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditModal(order);
                              }}
                              className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                            >
                              تعديل
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(order._id);
                              }}
                              className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 transition"
                            >
                              حذف
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                printInvoice(order);
                              }}
                              className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition"
                            >
                              طباعة
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={6} className="bg-gray-50 p-4">
                            <div>
                              <h4 className="font-semibold mb-2">المنتجات:</h4>
                              {order.products.map((p) => (
                                <div key={p.productId} className="mb-1">
                                  {p.name} بسعر (
                                  {p.wholesalePrice?.toFixed(2) || "0.00"}) *{" "}
                                  {p.quantity} ={" "}
                                  {(p.wholesalePrice * p.quantity).toFixed(2)}{" "}
                                  جنيه
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showOrderModal && (
        <AddEditOrderModal
          order={editingOrder}
          products={products}
          onClose={() => setShowOrderModal(false)}
          onSaved={() => {
            setShowOrderModal(false);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default TraderOrders;
