import React, { useState } from "react";
import printJS from "print-js";
import QRCode from "qrcode";
import {
  Boxes,
  CheckCircle,
  Package,
  Hash,
  Clock,
  User,
  Calendar,
  Factory,
} from "lucide-react";
import JsBarcode from "jsbarcode";
import ProductLabel from "./ProductLabel";

const ManufacturingResult = ({
  manufacturingResult,
  setManufacturingResult,
}) => {
  const [labelToPrint, setLabelToPrint] = useState(null);

  const printManufacturingReport = (result) => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 20px;">تقرير عملية التصنيع</h2>

        <div style="border: 1px solid #d1fae5; background-color: #ecfdf5; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <div style="margin-bottom: 15px; font-weight: bold; color: #065f46;">
            تم التصنيع بنجاح
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
            <div>
              <span style="color: #6b7280;">المنتج:</span>
              <span style="font-weight: 500; margin-right: 5px;">${
                result.productName
              }</span>
            </div>
            <div>
              <span style="color: #6b7280;">الكمية:</span>
              <span style="font-weight: 500; margin-right: 5px;">${
                result.quantity
              }</span>
            </div>
            <div>
              <span style="color: #6b7280;">وقت التصنيع:</span>
              <span style="font-weight: 500; margin-right: 5px;">${
                result.manufacturedAt
              }</span>
            </div>
            <div>
              <span style="color: #6b7280;">المنفذ:</span>
              <span style="font-weight: 500; margin-right: 5px;">${
                result.created_by
              }</span>
            </div>
          </div>

          <div style="padding-top: 10px; border-top: 1px solid #d1fae5;">
            <span style="color: #6b7280;">رقم الدفعة:</span>
            <span style="font-family: monospace; background: white; padding: 2px 6px; border: 1px solid #e5e7eb; border-radius: 4px;">${
              result.batchNumber
            }</span>
          </div>

          ${
            result.notes
              ? `
          <div style="padding-top: 10px; margin-top: 10px; border-top: 1px solid #d1fae5;">
            <span style="color: #6b7280; font-size: 0.875rem;">الملاحظات:</span>
            <p style="margin-top: 5px; color: #1f2937; font-size: 0.875rem;">${result.notes}</p>
          </div>
          `
              : ""
          }
        </div>

        <h3 style="margin-bottom: 10px; font-weight: 500;">الأرقام التسلسلية للوحدات المنتجة:</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background-color: #f9fafb;">
              <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">الرقم التسلسلي</th>
              <th style="border: 1px solid #e5e7eb; padding: 8px; text-align: right;">رقم الوحدة</th>
            </tr>
          </thead>
          <tbody>
            ${result.manufacturedUnits
              .map(
                (unit, index) => `
              <tr>
                <td style="border: 1px solid #e5e7eb; padding: 8px; font-family: monospace;">${unit.serialNumber}</td>
                <td style="border: 1px solid #e5e7eb; padding: 8px;">الوحدة #${unit.unitNumber}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
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

  // دالة طباعة كل الاستيكرات مع QR لكل واحد
  const handlePrintAllLabels = async () => {
    let units = manufacturingResult.manufacturedUnits;
    // i want to duble number of units to print the qr code twice
    units = [
      ...manufacturingResult.manufacturedUnits,
      ...manufacturingResult.manufacturedUnits,
    ];

    console.log(units);

    const labelsHtmlArr = await Promise.all(
      units.map(async (unit, idx) => {
        const qrDataUrl = await QRCode.toDataURL(
          `${import.meta.env.VITE_API_URL}api/product/${unit.serialNumber}`,
          { width: 54, margin: 0 }
        );

        // Barcode text = company name + date (e.g., "BM_2025-07-26")

        const barcodeText = `BM Company – Home & Kitchen Tools - ${
          new Date().toISOString().split("T")[0]
        }`;

        // Create barcode as data URL
        const canvas = document.createElement("canvas");
        JsBarcode(canvas, barcodeText, {
          format: "CODE128",
          displayValue: false,
          height: 40,
          margin: 0,
          width: 1,
        });
        const barcodeDataUrl = canvas.toDataURL();
        // الفاصل قبل كل استيكر ما عدا الأول
        const pageBreak = idx > 0 ? "page-break-before: always;" : "";
        return `
        <div style="width:8cm;height:5cm;display:block ;box-sizing:border-box;margin:0;padding:2mm;overflow:hidden;${pageBreak}">
          <div style="border:1px solid #ccc; border-radius:6px; padding:8px; width:100%; height:100%; font-size:12px; direction:rtl; text-align:right; box-sizing:border-box;">
            <div><strong>المنتج:</strong> ${
              manufacturingResult.productName
            }</div>
            <div><strong>الدفعة:</strong> ${
              manufacturingResult.batchNumber
            }</div>
            <div><strong>التسلسل:</strong> ${unit.serialNumber}</div>
            <div><strong>التاريخ:</strong> ${
              manufacturingResult.manufacturedAt
                ? new Date(
                    manufacturingResult.manufacturedAt
                  ).toLocaleDateString()
                : ""
            }</div>
             <div style="display: flex; justify-content: space-between; gap:5px;">
             <div style="margin-right: 8px; margin-left: 8px;">
             <img src="${qrDataUrl}" alt="QR" style="width:48px;height:48px;" />
             </div>
             <div style="width: 5px;"></div>
             <div>
              <img src="${barcodeDataUrl}" alt="Barcode" style="height:40px;" />
              </div>

            </div>
          </div>
        </div>
      `;
      })
    );

    const labelsHtml = labelsHtmlArr.join("");

    const container = document.createElement("section");
    container.style.overflow = "hidden";
    container.innerHTML = labelsHtml;
    document.body.appendChild(container);

    printJS({
      printable: container,
      type: "html",
      style: `
      @page { size: 8cm 5cm; margin: -.3mm; }
      body { direction: rtl; }
    `,
    });

    document.body.removeChild(container);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2 space-x-reverse">
        <Boxes className="h-5 w-5 text-green-600" />
        <span>نتائج التصنيع</span>
      </h2>

      {manufacturingResult ? (
        <div className="space-y-6">
          {/* Manufacturing Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 space-x-reverse mb-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">
                تم التصنيع بنجاح
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Package className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">المنتج:</span>
                <span className="font-medium">
                  {manufacturingResult.productName}
                </span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">الكمية:</span>
                <span className="font-medium">
                  {manufacturingResult.quantity}
                </span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">وقت التصنيع:</span>
                <span className="font-medium">
                  {manufacturingResult.manufacturedAt}
                </span>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <User className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">المنفذ:</span>
                <span className="font-medium">
                  {manufacturingResult.created_by}
                </span>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="flex items-center space-x-2 space-x-reverse">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">رقم الدفعة:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded border">
                  {manufacturingResult.batchNumber}
                </span>
              </div>
            </div>
            {manufacturingResult.notes && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <span className="text-gray-600 text-sm">الملاحظات:</span>
                <p className="text-gray-800 text-sm mt-1">
                  {manufacturingResult.notes}
                </p>
              </div>
            )}
          </div>

          {/* Serial Numbers */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">
              الأرقام التسلسلية للوحدات المنتجة:
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 max-h-60 overflow-y-auto">
              <div className="grid gap-2">
                {manufacturingResult.manufacturedUnits.map((unit, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-2 rounded border text-sm"
                  >
                    <span className="font-mono text-gray-800">
                      {unit.serialNumber}
                    </span>
                    <span className="text-gray-500">
                      الوحدة #{unit.unitNumber}
                    </span>
                    {/* زر طباعة الاستيكر
                    <button
                      className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                      onClick={() => {
                        setLabelToPrint({
                          productName: manufacturingResult.productName,
                          batchNo: manufacturingResult.batchNumber,
                          serialNumber: unit.serialNumber,
                          manufacturedAt: manufacturingResult.manufacturedAt,
                        });
                        setTimeout(() => {
                          printJS({
                            printable: "label-to-print",
                            type: "html",
                            style: `
                              @page { size: 8cm 5cm; margin: 0; }
                              body { direction: rtl; }
                            `,
                          });
                        }, 0);
                      }}
                    >
                      طباعة الاستيكر
                    </button> */}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 space-x-reverse">
            <button
              onClick={() => setManufacturingResult(null)}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              تصنيع جديد
            </button>
            <button
              onClick={() => printManufacturingReport(manufacturingResult)}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
            >
              طباعة التقرير
            </button>
            <button
              onClick={handlePrintAllLabels}
              className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              طباعة كل الاستيكرات
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <Factory className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">لا توجد عمليات تصنيع مكتملة</p>
          <p className="text-gray-400 text-sm mt-1">
            ستظهر نتائج التصنيع هنا بعد اكتمال العملية
          </p>
        </div>
      )}

      {/* يمكنك حذف عنصر الطباعة المخفي القديم إذا لم تعد بحاجة له */}
    </div>
  );
};

export default ManufacturingResult;
