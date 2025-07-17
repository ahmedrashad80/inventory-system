import React from "react";
import { Factory, CheckCircle, AlertTriangle } from "lucide-react";

const ManufacturingForm = ({
  products,
  productsLoading,
  components,
  selectedProduct,
  manufactureData,
  setManufactureData,
  handleProductChange,
  getMaxQuantity,
  canManufacture,
  isManufacturing,
  handleManufacture,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2 space-x-reverse">
        <Factory className="h-5 w-5 text-purple-600" />
        <span>تصنيع منتج جديد</span>
      </h2>

      <form onSubmit={handleManufacture} className="space-y-6">
        {/* Product Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اختر المنتج
          </label>
          <select
            value={manufactureData.productId}
            onChange={(e) => handleProductChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="">-- اختر المنتج --</option>
            {productsLoading ? (
              <option disabled>جاري التحميل...</option>
            ) : (
              products?.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} ({product.code})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Product Details */}
        {selectedProduct && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">
              {selectedProduct.name}
            </h3>
            {selectedProduct.description && (
              <p className="text-sm text-gray-600 mb-3">
                {selectedProduct.description}
              </p>
            )}

            {/* Required Components */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                المكونات المطلوبة:
              </h4>
              <div className="space-y-1">
                {selectedProduct.components?.map((comp, index) => {
                  const componentId = comp.component._id || comp.component;
                  const availableComp = components.find(
                    (c) => c._id === componentId
                  );
                  const componentName =
                    comp.component.name || comp.componentName;
                  const isAvailable =
                    availableComp &&
                    availableComp.quantity >=
                      comp.quantity_required *
                        parseInt(manufactureData.quantity || 1);

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-gray-700">{componentName}</span>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <span className="text-gray-900 font-medium">
                          {comp.quantity_required *
                            parseInt(manufactureData.quantity || 1)}
                        </span>
                        <span className="text-gray-500">
                          من {availableComp?.quantity || 0}
                        </span>
                        {isAvailable ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Quantity Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الكمية المطلوب تصنيعها
            {selectedProduct && (
              <span className="text-gray-500 text-xs mr-2">
                (الحد الأقصى: {getMaxQuantity()})
              </span>
            )}
          </label>
          <input
            type="number"
            min="1"
            max={getMaxQuantity()}
            value={manufactureData.quantity}
            onChange={(e) =>
              setManufactureData({
                ...manufactureData,
                quantity: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="أدخل الكمية"
            required
          />
        </div>

        {/* Employee Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            اسم الموظف المنفذ (اختياري)
          </label>
          <input
            type="text"
            value={manufactureData.created_by}
            onChange={(e) =>
              setManufactureData({
                ...manufactureData,
                created_by: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="اسم الموظف"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ملاحظات (اختياري)
          </label>
          <textarea
            value={manufactureData.notes}
            onChange={(e) =>
              setManufactureData({
                ...manufactureData,
                notes: e.target.value,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            rows="3"
            placeholder="أي ملاحظات إضافية..."
          />
        </div>

        {/* Manufacturing Status */}
        {selectedProduct && manufactureData.quantity && (
          <div
            className={`p-4 rounded-lg ${
              canManufacture
                ? "bg-green-50 border border-green-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-center space-x-2 space-x-reverse">
              {canManufacture ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">
                    يمكن التصنيع
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">
                    لا يمكن التصنيع - مكونات غير كافية
                  </span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!canManufacture || isManufacturing}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-all ${
            canManufacture && !isManufacturing
              ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white hover:shadow-lg"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isManufacturing ? (
            <div className="flex items-center justify-center space-x-2 space-x-reverse">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>جاري التصنيع...</span>
            </div>
          ) : (
            "بدء التصنيع"
          )}
        </button>
      </form>
    </div>
  );
};

export default ManufacturingForm;
