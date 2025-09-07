import React from "react";
import { ArrowLeft, Edit } from "lucide-react";

const TraderHeader = ({ traderName, onBack, onEdit }) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between"
        dir="rtl"
      >
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 ml-2" />
          العودة للتجار
        </button>
        <div className="flex items-center space-x-3 space-x-reverse">
          <h1 className="text-xl font-bold text-gray-900">{traderName}</h1>
          <button
            onClick={onEdit}
            className="bg-teal-600 text-white px-3 py-1 rounded hover:bg-teal-700 transition"
          >
            تعديل بيانات التاجر
          </button>
        </div>
      </div>
    </header>
  );
};

export default TraderHeader;
