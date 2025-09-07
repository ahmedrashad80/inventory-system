import React, { useState, useEffect } from "react";
import { useTraders } from "../../hooks/useTraders";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const Profits = () => {
  const { getTotalProfit, getProfitHistory } = useTraders();
  const [totalProfit, setTotalProfit] = useState(0);
  const [allProfits, setAllProfits] = useState([]);
  const [profitHistory, setProfitHistory] = useState([]);
  // دالة لحساب تاريخ اليوم ناقص 30 يوم
  const getDefaultDateRange = () => {
    const today = new Date();
    const priorDate = new Date();
    const tomorrow = new Date();
    priorDate.setDate(today.getDate() - 30);
    tomorrow.setDate(today.getDate() + 1);

    // تحويل التاريخ إلى صيغة YYYY-MM-DD علشان تناسب input[type="date"]
    const formatDate = (date) => date.toISOString().split("T")[0];

    return {
      from: formatDate(priorDate),
      to: formatDate(tomorrow),
    };
  };
  const [dateRange, setDateRange] = useState(getDefaultDateRange());

  const fetchData = async () => {
    const { totalProfit, allProfits } = await getTotalProfit();
    console.log(allProfits.slice(0, 50));
    setAllProfits(allProfits);
    setTotalProfit(totalProfit);
    if (dateRange.from && dateRange.to) {
      const history = await getProfitHistory(dateRange.from, dateRange.to);
      setProfitHistory(history);
    } else {
      setProfitHistory([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApply = () => {
    fetchData();
  };

  return (
    <>
      <div>
        <h2 className="text-xl font-bold mb-4">
          إجمالي الأرباح: {totalProfit.toFixed(2)} جنيه
        </h2>
        <div className="mb-4 flex space-x-4 space-x-reverse max-w-md">
          <input
            type="date"
            value={dateRange.from}
            onChange={(e) =>
              setDateRange({ ...dateRange, from: e.target.value })
            }
            className="border rounded p-2"
            placeholder="من"
          />
          <input
            type="date"
            value={dateRange.to}
            onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="border rounded p-2"
            placeholder="إلى"
          />
          <button
            onClick={handleApply}
            className="bg-teal-600 text-white px-4 py-2 rounded"
          >
            تطبيق
          </button>
        </div>
      </div>

      {profitHistory.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={profitHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="profit" stroke="#14B8A6" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <p>لا توجد بيانات للعرض</p>
      )}

      {/* New table for last 50 profit transactions */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 overflow-x-auto">
        <h3 className="text-lg font-semibold mb-4">آخر 50 معاملة أرباح</h3>
        <table className="w-full bg-white rounded-xl shadow-sm drop-shadow-xl/50">
          <thead className="bg-teal-500">
            <tr className="text-right text-xs font-medium text-white uppercase tracking-wider">
              <th className="px-6 py-3">التاريخ</th>
              <th className="px-6 py-3">الوصف</th>
              <th className="px-6 py-3">المبلغ</th>
              <th className="px-6 py-3">اسم التاجر</th>
              <th className="px-6 py-3">نوع المعاملة</th>
              <th className="px-6 py-3">رقم الطلب</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-teal-300">
            {allProfits.map((item) => (
              <tr
                key={item._id}
                className="text-right hover:bg-gray-50 cursor-pointer"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.description}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                    item.paidAmount < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {item.paidAmount.toFixed(2)} جنيه
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.traderName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {item.transactionType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.orderId?.orderNumber || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Profits;
