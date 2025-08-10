import React, { useState } from "react";
import { Edit, Printer, Trash2 } from "lucide-react";

const statusColors = {
  معلق: "bg-yellow-200 text-yellow-800",
  "تم الشحن": "bg-blue-200 text-blue-800",
  مؤكد: "bg-green-200 text-green-800",
  ملغي: "bg-red-200 text-red-800",
  راجع: "bg-gray-200 text-gray-800",
};

const statusOptions = Object.keys(statusColors);

const OrdersList = ({
  orders,
  isLoading,
  onUpdateStatus,
  onEdit,
  onDelete,
}) => {
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
    console.log(orders);
  };

  // Print invoice function
  const printInvoice = (order) => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
       <h2 style="text-align: center; margin-bottom: 20px;">فاتورة البيع</h2>
        <p style="text-align: center; font-weight: bold; font-size: 1.2em;">شركة BM</p>
        <h3 style="text-align: center; margin-bottom: 20px;">فاتورة الطلب رقم ${
          order.invoiceNumber
        }</h3>
        <p><strong>اسم العميل:</strong> ${order.customerName}</p>
        <p><strong>رقم الهاتف:</strong> ${order.phone}</p>
        <p><strong>العنوان:</strong> ${order.address}</p>
        <p><strong>المحافظة:</strong> ${order.governorate}</p>
        <p><strong>ملاحظات:</strong> ${order.notes || "-"}</p>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px;">المنتج</th>
              <th style="border: 1px solid #ddd; padding: 8px;">الكمية</th>
              <th style="border: 1px solid #ddd; padding: 8px;">السعر للوحدة</th>
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
                <td style="border: 1px solid #ddd; padding: 8px;">${p.price.toFixed(
                  2
                )} جنيه</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${(
                  p.price * p.quantity
                ).toFixed(2)} جنيه</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="border: 1px solid #ddd; padding: 8px; text-align: right;">الإجمالي</td>
              <td style="border: 1px solid #ddd; padding: 8px;">
                ${order.totalPrice} جنيه
              </td>
            </tr>
          </tfoot>
        </table>
        <p style="text-align: center; margin-top: 20px;">شكراً لتعاملكم معنا!</p>
          <p style="text-align: center; margin-top: 10px; font-size: 0.9em;">
          رقم الاتصال: 0123456789
        </p>
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

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <p className="mt-2 text-gray-600">جاري التحميل...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">لا توجد طلبات متاحة</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الفاتورة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                اسم العميل
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                رقم الهاتف
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الحالة
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => {
              const isExpanded = expandedOrderId === order._id;
              return (
                <React.Fragment key={order._id}>
                  <tr
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => toggleExpand(order._id)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.invoiceNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                          statusColors[order.status] ||
                          "bg-gray-200 text-gray-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex space-x-2 space-x-reverse">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEdit(order);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="تعديل"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(order._id);
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="حذف"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr>
                      <td colSpan="5" className="bg-gray-50 px-6 py-4">
                        <div className="space-y-2 text-sm text-gray-700">
                          <div>
                            <strong>العنوان:</strong> {order.address}
                          </div>
                          <div>
                            <strong>المحافظة:</strong> {order.governorate}
                          </div>
                          <div>
                            <strong>الشحن:</strong> {order.shippingCost}
                          </div>
                          <div>
                            <strong>اجمالى السعر:</strong> {order.totalPrice}
                          </div>

                          <div>
                            <strong>ملاحظات:</strong> {order.notes || "-"}
                          </div>
                          <div>
                            <strong>المنتجات:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {order.products.map((p, i) => (
                                <li key={i}>
                                  {p.name} - {p.quantity} × {p.price} جنيه
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="mt-2 flex space-x-2 space-x-reverse">
                            {statusOptions.map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  onUpdateStatus(order._id, status)
                                }
                                disabled={order.status === status}
                                className={`px-3 py-1 rounded text-xs font-semibold ${
                                  order.status === status
                                    ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                                    : "bg-red-600 text-white hover:bg-red-700"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                          <div className="mt-4">
                            <button
                              onClick={() => printInvoice(order)}
                              className="flex items-center bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700"
                            >
                              <Printer className="h-4 w-4" />
                              <span>طباعة الفاتورة</span>
                            </button>
                          </div>
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
  );
};

export default OrdersList;
