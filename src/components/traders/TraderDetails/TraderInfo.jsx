import React from "react";

const TraderInfo = ({ trader }) => {
  if (!trader) return null;

  const remainingAmount = trader.totalBalance - trader.totalPaid;

  return (
    <div className="bg-white rounded-lg shadow p-6" dir="rtl">
      <h2 className="text-lg font-semibold mb-4">معلومات التاجر</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
        <div className="bg-teal-100 p-4 rounded">
          <p className="text-sm text-gray-600">إجمالي الرصيد</p>
          <p className="text-2xl font-bold">
            {trader.totalBalance.toFixed(2)} جنيه
          </p>
        </div>
        <div className="bg-green-100 p-4 rounded">
          <p className="text-sm text-gray-600">إجمالي المدفوع</p>
          <p className="text-2xl font-bold">
            {trader.totalPaid.toFixed(2)} جنيه
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-sm text-gray-600">إجمالي الطلبات</p>
          <p className="text-2xl font-bold">{trader.totalOrders}</p>
        </div>
        <div className="bg-red-100 p-4 rounded">
          <p className="text-sm text-gray-600">المتبقي</p>
          <p className="text-2xl font-bold">
            {remainingAmount.toFixed(2)} جنيه
          </p>
        </div>
      </div>
    </div>
  );
};

export default TraderInfo;
