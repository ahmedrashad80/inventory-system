import React from "react";

const statuses = [
  { label: "الكل", value: "all" },
  { label: "معلق", value: "معلق" },
  { label: "تم الشحن", value: "تم الشحن" },
  { label: "مؤكد", value: "مؤكد" },
  { label: "ملغي", value: "ملغي" },
  { label: "راجع", value: "راجع" },
];

const OrdersFilter = ({ statusFilter, setStatusFilter }) => {
  return (
    // i want to add align center for div
    // the calss you should add is flex justify-center items-center
    <div className="flex space-x-2 space-x-reverse overflow-x-auto mb-2 justify-center items-center">
      {statuses.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => setStatusFilter(value)}
          className={`px-4 py-2 rounded-lg border ${
            statusFilter === value
              ? "bg-red-600 text-white border-red-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-red-400"
          } transition`}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default OrdersFilter;
