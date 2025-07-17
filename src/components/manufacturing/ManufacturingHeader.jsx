import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Factory } from "lucide-react";

const ManufacturingHeader = () => {
  return (
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
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-2 rounded-lg">
                <Factory className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  عمليات التصنيع
                </h1>
                <p className="text-sm text-gray-600">
                  تصنيع المنتجات وإدارة الإنتاج
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ManufacturingHeader;
