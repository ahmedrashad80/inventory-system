import React, { useState, useMemo } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const typeLabels = {
  in: "إضافة مخزون",
  update: "تعديل",
  out: "سحب من المخزون",
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  // التاريخ: يوم-شهر-سنة ساعة:دقيقة (بدون ثواني)
  return `${date.toLocaleDateString()} ${date.getHours()}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;
};

const ComponentMovements = ({ movements }) => {
  const [filter, setFilter] = useState("all");
  const [expanded, setExpanded] = useState({});

  const filteredMovements = useMemo(() => {
    if (filter === "all") return movements;
    return movements.filter((m) => m.type === filter);
  }, [movements, filter]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="my-12 p-5">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-2 border-b-2 border-blue-200 pb-2">
          سجل وفهرس تغييرات المكونات
        </h2>
        <p className="text-gray-500 mb-4">
          يمكنك هنا مراجعة كل الحركات والتعديلات التي تمت على المكونات مع
          إمكانية الفلترة حسب نوع الحركة.
        </p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-8 border border-blue-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            فهرس التغييرات والحركات
          </h3>
          <div className="flex gap-2">
            <button
              className={`px-4 py-1 rounded-full transition ${
                filter === "all"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setFilter("all")}
            >
              الكل
            </button>
            <button
              className={`px-4 py-1 rounded-full transition ${
                filter === "in"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setFilter("in")}
            >
              إضافة مخزون
            </button>
            <button
              className={`px-4 py-1 rounded-full transition ${
                filter === "update"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-blue-50"
              }`}
              onClick={() => setFilter("update")}
            >
              تعديل
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-right font-medium text-blue-700">
                  التسلسل
                </th>
                <th className="px-4 py-2 text-right font-medium text-blue-700">
                  التاريخ
                </th>
                <th className="px-4 py-2 text-right font-medium text-blue-700">
                  المكون
                </th>
                <th className="px-4 py-2 text-right font-medium text-blue-700">
                  النوع
                </th>
                <th className="px-4 py-2 text-right font-medium text-blue-700">
                  الكمية
                </th>
                <th className="px-4 py-2 text-right font-medium text-blue-700">
                  السبب
                </th>
                <th className="px-4 py-2 text-right font-medium text-blue-700">
                  ملاحظات
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    لا توجد نتائج
                  </td>
                </tr>
              )}
              {filteredMovements.map((move, index) => (
                <React.Fragment key={move._id}>
                  <tr className="hover:bg-blue-200 transition">
                    <td className="px-4 py-2 whitespace-nowrap">{index + 1}</td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {move.createdAt ? formatDate(move.createdAt) : "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {move.component?.name || "-"}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {typeLabels[move.type] || move.type}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {move.quantity}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      {move.reason || "-"}
                    </td>
                    <td className="px-4 py-2 text-right" dir="rtl">
                      <button
                        className="text-blue-600 hover:underline flex items-center gap-1"
                        onClick={() => toggleExpand(move._id)}
                        title="عرض التفاصيل"
                        type="button"
                      >
                        {move.notes && (
                          <span className="text-xs flex items-center">
                            {expanded[move._id] ? (
                              <ChevronUp className="inline w-4 h-4" />
                            ) : (
                              <ChevronDown className="inline w-4 h-4" />
                            )}
                            <span className="ml-1">
                              {expanded[move._id]
                                ? "إخفاء التفاصيل"
                                : "عرض التفاصيل"}
                            </span>
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                  {expanded[move._id] && move.notes && (
                    <tr>
                      <td
                        colSpan={8}
                        className="bg-blue-50 px-4 py-2 text-right"
                        dir="rtl"
                      >
                        <div
                          style={{
                            whiteSpace: "pre-line",
                            wordBreak: "break-word",
                          }}
                        >
                          <ul className="list-disc pr-4 space-y-1">
                            {move.notes.split("|").map((note, idx) => {
                              const cleanNote = note.trim();
                              // يدعم وجود مسافة بعد أو قبل |
                              const match = cleanNote.match(
                                /^(\w+): من "(.*)" إلى "(.*)"$/
                              );
                              if (!match) {
                                // fallback: عرض النص كما هو إذا لم يتطابق مع النمط
                                return (
                                  <li key={idx} className="text-gray-700">
                                    {cleanNote}
                                  </li>
                                );
                              }
                              const [_, field, from, to] = match;
                              const fieldLabels = {
                                name: "اسم المكون",
                                code: "الكود",
                                quantity: "الكمية",
                                unit_price: "سعر الوحدة",
                                supplier: "المورد",
                                image: "الصورة",
                              };
                              return (
                                <li key={idx}>
                                  <span className="font-semibold text-blue-900">
                                    {fieldLabels[field] || field}:
                                  </span>{" "}
                                  <span className="text-gray-700">من</span>{" "}
                                  <span className="text-red-700 font-mono">
                                    {from}
                                  </span>{" "}
                                  <span className="text-gray-700">إلى</span>{" "}
                                  <span className="text-green-700 font-mono">
                                    {to}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default ComponentMovements;
