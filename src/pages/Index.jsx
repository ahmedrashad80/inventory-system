import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  Boxes,
  Factory,
  BarChart3,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import EditUserModal from "../components/EditUserModal";

// إضافة دالة لجلب الإحصائيات
const fetchStats = async () => {
  try {
    // يمكنك إنشاء نقطة نهاية مخصصة للإحصائيات أو استخدام عدة طلبات
    const componentsRes = await axios.get(
      `${import.meta.env.VITE_API_URL}api/components`
    );
    const productsRes = await axios.get(
      `${import.meta.env.VITE_API_URL}api/products`
    );
    const manufacturingRes = await axios.get(
      `${import.meta.env.VITE_API_URL}api/products/manufacture`
    ); // افتراضي، قد تحتاج لتعديله
    const allProductUnits = await axios.get(
      `${import.meta.env.VITE_API_URL}api/products/units`
    );

    console.log(componentsRes.data);
    console.log(manufacturingRes.data);
    return {
      componentsCount: componentsRes.data.length || 0,
      productsCount: productsRes.data.length || 0,
      manufacturingCount: manufacturingRes.data.length || 0,
      manufacturedUnitsCount: allProductUnits.data.total || 0,
      allProductUnits: allProductUnits.data.units || [],
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      componentsCount: "حدث خطأ",
      productsCount: "حدث خطأ",
      manufacturingCount: "حدث خطأ",
      manufacturedUnitsCount: "حدث خطأ",
      allProductUnits: [],
    };
  }
};

const Index = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // استخرج بيانات المستخدم من التوكن
  // const token = Cookies.get("token");
  // let user = null;
  // if (token) {
  //   try {
  //     user = jwtDecode(token);
  //     console.log("Decoded user:", user);
  //   } catch (e) {
  //     console.error("Token decode error:", e);
  //   }
  // }

  // تسجيل الخروج
  const handleLogout = async () => {
    await axios.post(
      `${import.meta.env.VITE_API_URL}api/user/logout`,
      {},
      {
        withCredentials: true,
      }
    );
    navigate("/login");
  };

  // حفظ التعديل
  const handleSaveUser = async ({ newUsername, newPassword }) => {
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}api/user/verify`,
        {
          withCredentials: true,
        }
      );
      console.log(data);
      user = data.user;

      await axios.put(`${import.meta.env.VITE_API_URL}api/user/update`, {
        id: user?.id,
        username: newUsername,
        password: newPassword,
      });

      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات المستخدم بنجاح",
        duration: 3000,
        className: "bg-green-100 text-green-800",
      });

      // alert("تم تحديث المستخدم بنجاح");
      setShowModal(false);
    } catch (error) {
      toast({
        title: "خطأ في التحديث",
        description:
          error.response?.data?.message ||
          "حدث خطأ أثناء تحديث بيانات المستخدم",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // استخدام React Query لجلب الإحصائيات
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchStats,
    // تعطيل التحديث التلقائي عند عدم الاتصال بالإنترنت
    enabled: isOnline,
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    const checkConnection = async () => {
      try {
        await fetch("//www.google.com/favicon.ico", {
          mode: "no-cors",
          cache: "no-store",
        });
        setIsOnline(true);
      } catch (err) {
        setIsOnline(false);
      }
    };

    // Initial check
    checkConnection();

    // Set up periodic check
    const intervalId = setInterval(checkConnection, 20000);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [setIsOnline]);

  // تحديث مصفوفة الإحصائيات لاستخدام البيانات من API
  const stats = [
    {
      title: "إجمالي المكونات",
      value: statsLoading ? "..." : statsData?.componentsCount.toString(),
      icon: Package,
      color: "bg-blue-500",
    },
    {
      title: "المنتجات المتاحة",
      value: statsLoading ? "..." : statsData?.productsCount.toString(),
      icon: Boxes,
      color: "bg-green-500",
    },
    {
      title: "عمليات التصنيع",
      value: statsLoading ? "..." : statsData?.manufacturingCount.toString(),
      icon: Factory,
      color: "bg-purple-500",
    },
    {
      title: "الوحدات المصنعة",
      value: statsLoading
        ? "..."
        : statsData?.manufacturedUnitsCount.toString(),
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  const quickActions = [
    {
      title: "إدارة المكونات",
      description: "عرض وإدارة مكونات المصنع",
      link: "/components",
      icon: Package,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "إدارة المنتجات",
      description: "عرض وإدارة المنتجات النهائية",
      link: "/products",
      icon: Boxes,
      color: "from-green-500 to-green-600",
    },
    {
      title: "عمليات التصنيع",
      description: "تصنيع المنتجات وإدارة الإنتاج",
      link: "/manufacturing",
      icon: Factory,
      color: "from-purple-500 to-purple-600",
    },
    // {
    //   title: "التقارير",
    //   description: "عرض تقارير الإنتاج والمخزون",
    //   link: "/reports",
    //   icon: BarChart3,
    //   color: "from-orange-500 to-orange-600",
    // },
  ];

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-lg">
                <Factory className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  نظام إدارة المصنع
                </h1>
                <p className="text-sm text-gray-600">إدارة المخزون والتصنيع</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse">
              <div className="relative">
                <button
                  className="text-sm font-medium text-gray-700"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  الإعدادات ⚙️
                </button>
                {showDropdown && (
                  <div className="absolute mt-2 bg-white shadow-md rounded-md text-right right-0 w-40 z-10">
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        setShowModal(true);
                      }}
                      className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      تعديل المستخدم
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                        handleLogout();
                      }}
                      className="block w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100"
                    >
                      تسجيل الخروج
                    </button>
                  </div>
                )}
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                  isOnline
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {isOnline ? (
                  <>
                    <Wifi className="h-4 w-4" />
                    متصل
                  </>
                ) : (
                  <>
                    <WifiOff className="h-4 w-4" />
                    غير متصل
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">مرحباً بك</h2>
          <p className="text-gray-600">
            اختر من الخيارات أدناه لإدارة المصنع بكفاءة
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            الإجراءات السريعة
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group block bg-white rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200"
              >
                <div
                  className={`bg-gradient-to-r ${action.color} p-6 rounded-t-xl`}
                >
                  <action.icon className="h-8 w-8 text-white mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    {action.title}
                  </h4>
                  <p className="text-blue-100">{action.description}</p>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm">انقر للوصول</span>
                    <div className="bg-gray-100 group-hover:bg-gray-200 p-2 rounded-full transition-colors">
                      <svg
                        className="h-4 w-4 text-gray-600 transform rotate-180"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        {/* <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            النشاط الأخير
          </h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="bg-green-100 p-2 rounded-full">
                <Package className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  تم إضافة مكون جديد
                </p>
                <p className="text-xs text-gray-500">منذ ساعتين</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="bg-blue-100 p-2 rounded-full">
                <Factory className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  تم تصنيع 50 وحدة من المنتج أ
                </p>
                <p className="text-xs text-gray-500">منذ 3 ساعات</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 space-x-reverse p-3 bg-gray-50 rounded-lg">
              <div className="bg-purple-100 p-2 rounded-full">
                <Boxes className="h-4 w-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  تم تحديث معلومات المنتج ب
                </p>
                <p className="text-xs text-gray-500">منذ 5 ساعات</p>
              </div>
            </div>
          </div>
        </div> */}
        <EditUserModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          user={user}
          onSave={handleSaveUser}
        />
      </main>
    </div>
  );
};

export default Index;
