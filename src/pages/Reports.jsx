import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart3,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Package,
  Boxes,
  Factory,
  Calendar,
  Download,
  Filter,
  Eye,
} from "lucide-react";

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: new Date().toISOString().split("T")[0],
  });

  // Mock data for reports
  const reportData = {
    overview: {
      totalComponents: 125,
      totalProducts: 42,
      manufacturingOperations: 18,
      productionRate: 89,
    },
    topComponents: [
      { name: "مسمار حديدي", quantity: 1500, usage: 85 },
      { name: "صامولة معدنية", quantity: 800, usage: 70 },
      { name: "أنبوب بلاستيكي", quantity: 200, usage: 45 },
    ],
    topProducts: [
      { name: "كرسي مكتبي", manufactured: 25, pending: 5 },
      { name: "طاولة خشبية", manufactured: 18, pending: 3 },
      { name: "رف كتب", manufactured: 12, pending: 2 },
    ],
    monthlyProduction: [
      { month: "يناير", produced: 45, target: 50 },
      { month: "فبراير", produced: 52, target: 55 },
      { month: "مارس", produced: 38, target: 45 },
      { month: "أبريل", produced: 61, target: 60 },
    ],
    recentActivities: [
      {
        id: 1,
        type: "manufacturing",
        description: "تم تصنيع 10 وحدات من كرسي مكتبي",
        date: "2024-01-20",
        time: "14:30",
      },
      {
        id: 2,
        type: "stock_in",
        description: "تم إضافة 500 وحدة من مسمار حديدي",
        date: "2024-01-19",
        time: "09:15",
      },
      {
        id: 3,
        type: "product_added",
        description: "تم إضافة منتج جديد: رف كتب",
        date: "2024-01-18",
        time: "11:45",
      },
    ],
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "manufacturing":
        return <Factory className="h-4 w-4 text-purple-600" />;
      case "stock_in":
        return <Package className="h-4 w-4 text-green-600" />;
      case "product_added":
        return <Boxes className="h-4 w-4 text-blue-600" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityBgColor = (type) => {
    switch (type) {
      case "manufacturing":
        return "bg-purple-50";
      case "stock_in":
        return "bg-green-50";
      case "product_added":
        return "bg-blue-50";
      default:
        return "bg-gray-50";
    }
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
                <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    التقارير والإحصائيات
                  </h1>
                  <p className="text-sm text-gray-600">
                    عرض تقارير الإنتاج والمخزون
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 space-x-reverse">
              <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                <Filter className="h-4 w-4" />
                <span>تصفية</span>
              </button>
              <button className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                <Download className="h-4 w-4" />
                <span>تصدير التقرير</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Date Range Filter */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              فترة التقرير
            </h3>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="flex items-center space-x-2 space-x-reverse">
                <label className="text-sm text-gray-600">من:</label>
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, from: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <label className="text-sm text-gray-600">إلى:</label>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, to: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
              <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                تطبيق
              </button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المكونات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview.totalComponents}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                  <span className="text-sm text-green-600">
                    +12% من الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المنتجات</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview.totalProducts}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                  <span className="text-sm text-green-600">
                    +8% من الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Boxes className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">عمليات التصنيع</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview.manufacturingOperations}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingDown className="h-4 w-4 text-red-500 ml-1" />
                  <span className="text-sm text-red-600">
                    -3% من الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Factory className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">معدل الإنتاج</p>
                <p className="text-2xl font-bold text-gray-900">
                  {reportData.overview.productionRate}%
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 ml-1" />
                  <span className="text-sm text-green-600">
                    +5% من الشهر الماضي
                  </span>
                </div>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Components */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              أكثر المكونات استخداماً
            </h3>
            <div className="space-y-4">
              {reportData.topComponents.map((component, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {component.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {component.usage}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${component.usage}%` }}
                      ></div>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        المخزون: {component.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              أكثر المنتجات إنتاجاً
            </h3>
            <div className="space-y-4">
              {reportData.topProducts.map((product, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {product.name}
                    </span>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        مكتمل: {product.manufactured}
                      </span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        قيد التنفيذ: {product.pending}
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (product.manufactured /
                            (product.manufactured + product.pending)) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Production Chart */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            الإنتاج الشهري
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {reportData.monthlyProduction.map((month, index) => (
              <div key={index} className="text-center">
                <div className="bg-gray-100 rounded-lg p-4 mb-2">
                  <div className="flex items-end justify-center space-x-2 space-x-reverse h-24">
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{
                        height: `${(month.produced / month.target) * 100}%`,
                        width: "20px",
                      }}
                    ></div>
                    <div
                      className="bg-gray-300 rounded-t"
                      style={{
                        height: `${100}%`,
                        width: "20px",
                        opacity: 0.5,
                      }}
                    ></div>
                  </div>
                </div>
                <h4 className="font-medium text-gray-900">{month.month}</h4>
                <div className="text-sm text-gray-600">
                  <span className="text-blue-600 font-medium">
                    {month.produced}
                  </span>
                  <span className="mx-1">/</span>
                  <span>{month.target}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              النشاط الأخير
            </h3>
            <button className="flex items-center space-x-2 space-x-reverse text-orange-600 hover:text-orange-700 transition-colors">
              <Eye className="h-4 w-4" />
              <span className="text-sm">عرض الكل</span>
            </button>
          </div>

          <div className="space-y-4">
            {reportData.recentActivities.map((activity) => (
              <div
                key={activity.id}
                className={`${getActivityBgColor(
                  activity.type
                )} rounded-lg p-4`}
              >
                <div className="flex items-center space-x-3 space-x-reverse">
                  <div className="flex-shrink-0">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.description}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.date).toLocaleDateString("ar-SA")} -{" "}
                      {activity.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Reports;
