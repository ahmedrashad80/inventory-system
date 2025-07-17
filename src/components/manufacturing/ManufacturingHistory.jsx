import React from "react";
import { Clock, Calendar, ChevronUp, ChevronDown, Printer } from "lucide-react";

const ManufacturingHistory = ({
  isLoadingRecords,
  manufacturingRecords,
  expandedRecords,
  serialNumbers,
  toggleRecordExpansion,
  printSerialNumbers,
}) => {
  return (
    <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2 space-x-reverse">
        <Clock className="h-5 w-5 text-blue-600" />
        <span>سجل عمليات التصنيع</span>
      </h2>

      {isLoadingRecords ? (
        <div className="flex justify-center items-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          <p className="mr-3 text-gray-600">جاري التحميل...</p>
        </div>
      ) : !manufacturingRecords || manufacturingRecords.length === 0 ? (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">لا توجد سجلات تصنيع سابقة</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  التسلسل
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  رقم الدفعة
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المنتج
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الكمية
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  التاريخ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  المنفذ
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  الإجراءات
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Array.isArray(manufacturingRecords) &&
                manufacturingRecords.map((record, index) => (
                  <React.Fragment key={record._id || `record-${index}`}>
                    <tr className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">
                        {record.batch_no || "غير متوفر"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.product_code ||
                          (record.product &&
                            (record.product.code || record.product.name)) ||
                          "غير متوفر"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.quantity_produced}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.date
                          ? new Date(record.date).toLocaleString("en-US")
                          : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.created_by?.name ||
                          record.created_by ||
                          "لا يوجد"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-2 space-x-reverse">
                          <button
                            onClick={() =>
                              toggleRecordExpansion(
                                record.batch_no || record._id
                              )
                            }
                            className="p-1 rounded-full hover:bg-gray-100"
                            title="عرض الأرقام التسلسلية"
                          >
                            {expandedRecords[record.batch_no || record._id] ? (
                              <ChevronUp className="h-5 w-5 text-gray-600" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-600" />
                            )}
                          </button>
                          {/* <button
                            onClick={() =>
                              printSerialNumbers(
                                record.batch_no || record._id,
                                record.batch_no,
                                record.product_code ||
                                  (record.product && record.product.name)
                              )
                            }
                            className="p-1 rounded-full hover:bg-gray-100 text-blue-600"
                            title="طباعة الأرقام التسلسلية"
                          >
                            <Printer className="h-5 w-5" />
                          </button> */}
                        </div>
                      </td>
                    </tr>
                    {expandedRecords[record.batch_no || record._id] && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <div className="rounded-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gray-100 px-4 py-2 border-b flex justify-between items-center">
                              <h4 className="font-medium text-gray-700">
                                الأرقام التسلسلية للوحدات المنتجة
                              </h4>
                              <button
                                onClick={() =>
                                  printSerialNumbers(
                                    record.batch_no || record._id,
                                    record.batch_no,
                                    record.product_code ||
                                      (record.product && record.product.name)
                                  )
                                }
                                className="flex items-center space-x-1 space-x-reverse text-blue-600 hover:text-blue-800"
                              >
                                <Printer className="h-4 w-4" />
                                <span className="text-sm">طباعة</span>
                              </button>
                            </div>
                            <div className="max-h-60 overflow-y-auto p-4">
                              {serialNumbers[record.batch_no || record._id] ? (
                                <div className="grid grid-cols-1 gap-2">
                                  <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                                          الرقم التسلسلي
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                                          رقم الوحدة
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                                          الحالة
                                        </th>
                                        <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">
                                          تاريخ الإنتاج
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {serialNumbers[
                                        record.batch_no || record._id
                                      ].map((unit, idx) => (
                                        <tr
                                          key={idx}
                                          className="hover:bg-gray-50"
                                        >
                                          <td className="px-3 py-2 whitespace-nowrap text-sm font-mono">
                                            {unit.serial_number}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            #{idx + 1}
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                              {unit.status || "جاهز"}
                                            </span>
                                          </td>
                                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(
                                              unit.date_produced
                                            ).toLocaleString("en-US")}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <div className="text-center py-4 text-gray-500">
                                  جاري تحميل الأرقام التسلسلية...
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManufacturingHistory;
