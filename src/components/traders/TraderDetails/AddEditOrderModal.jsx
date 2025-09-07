import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useParams } from "react-router-dom";

const AddEditOrderModal = ({ order, products, traderId, onClose, onSaved }) => {
  const [paidAmount, setPaidAmount] = useState(order?.paidAmount || 0);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [notes, setNotes] = useState(order?.notes || "");
  const { id } = useParams();
  useEffect(() => {
    console.log(products);
    console.log(order);
  }, []);

  useEffect(() => {
    if (order) {
      setSelectedProducts(
        order.products.map((p) => ({
          productId: p.productId._id,
          name: p.name,
          code: p.code,
          quantity: p.quantity,
          wholesalePrice: p.wholesalePrice,
          totalPrice: p.totalPrice,
        }))
      );
      setNotes(order.notes || "");
      setPaidAmount(order.paidAmount || 0);
    } else {
      setSelectedProducts([]);
      setNotes("");
      setPaidAmount(0);
    }
  }, [order]);

  const handleAddProduct = () => {
    setSelectedProducts((prev) => [
      ...prev,
      {
        productId: "",
        name: "",
        code: "",
        quantity: 1,
        wholesalePrice: 0,
        totalPrice: 0,
      },
    ]);
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    updated[index][field] =
      field === "quantity" || field === "wholesalePrice"
        ? Number(value)
        : value;

    // Update name and code if productId changed
    if (field === "productId") {
      const prod = products[value];
      if (prod) {
        updated[index].name = prod.product.name;
        updated[index].code = prod.product.code;
        updated[index].wholesalePrice = prod.product.price;
        updated[index].quantity = 1;
      }
    }

    // Update totalPrice
    updated[index].totalPrice =
      updated[index].quantity * updated[index].wholesalePrice;

    setSelectedProducts(updated);
  };

  const handleRemoveProduct = (index) => {
    const updated = [...selectedProducts];
    updated.splice(index, 1);
    setSelectedProducts(updated);
  };

  const calculateTotalAmount = () => {
    return selectedProducts.reduce((sum, p) => sum + p.totalPrice, 0);
  };

  // دالة بسيطة لإنشاء قائمة خيارات المنتجات
  const getProductOptions = (selectedProductId) => {
    // جميع المنتجات الموجودة في products متوفرة
    const availableProducts = Object.entries(products).map(
      ([prodId, prodData]) => ({
        id: prodId,
        name: prodData.product.name,
        count: prodData.count,
        price: prodData.product.price,
        available: true,
      })
    );

    // فقط إذا كان المنتج المحدد غير موجود في products (نفدت كميته حقاً)
    if (selectedProductId && !products[selectedProductId]) {
      const selectedProduct = selectedProducts.find(
        (p) => p.productId === selectedProductId
      );

      if (selectedProduct) {
        availableProducts.unshift({
          id: selectedProductId,
          name: selectedProduct.name,
          count: 0,
          price: selectedProduct.wholesalePrice,
          available: false,
        });
      }
    }

    return availableProducts;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedProducts.length === 0) {
      toast.error("يرجى إضافة منتج واحد على الأقل");
      return;
    }

    // Validate quantities and productIds
    for (const p of selectedProducts) {
      if (!p.productId) {
        toast.error("يرجى اختيار المنتج");
        return;
      }
      if (p.quantity <= 0) {
        toast.error("الكمية يجب أن تكون أكبر من صفر");
        return;
      }
    }

    const totalAmount = calculateTotalAmount();

    if (paidAmount > totalAmount) {
      toast.error("المبلغ المدفوع لا يمكن أن يكون أكبر من إجمالي الطلب");
      return;
    }

    const orderData = {
      traderId: id,
      products: selectedProducts.map(
        ({ productId, name, code, quantity, wholesalePrice, totalPrice }) => ({
          productId,
          name,
          code,
          quantity,
          wholesalePrice,
          totalPrice,
        })
      ),
      totalAmount,
      paidAmount,
      remainingAmount: totalAmount - paidAmount,
      notes,
    };

    try {
      const url = order
        ? `${import.meta.env.VITE_API_URL}api/traders/orders/${order._id}`
        : `${import.meta.env.VITE_API_URL}api/traders/orders`;
      const method = order ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "فشل في حفظ الطلب");
      }

      toast.success(order ? "تم تحديث الطلب بنجاح" : "تم إضافة الطلب بنجاح");
      onSaved();
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء حفظ الطلب");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{order ? "تعديل الطلب" : "إضافة طلب جديد"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          {/* Header للجدول */}
          <div className="grid grid-cols-12 gap-3 font-bold text-sm bg-gray-100 p-3 rounded">
            <div className="col-span-4 text-center">المنتج</div>
            <div className="col-span-2 text-center">الكمية</div>
            <div className="col-span-2 text-center">سعر الجملة</div>
            <div className="col-span-2 text-center">إجمالي السعر</div>
            <div className="col-span-2 text-center">إجراءات</div>
          </div>

          {selectedProducts.map((p, idx) => {
            const productOptions = getProductOptions(p.productId);
            const currentProduct = products[p.productId];
            const isProductAvailable = !!currentProduct;

            return (
              <div
                key={idx}
                className="grid grid-cols-12 gap-3 items-center border-b pb-3"
              >
                {/* اختيار المنتج */}
                <div className="col-span-4">
                  <select
                    className="w-full border rounded p-2 text-sm"
                    value={p.productId || ""}
                    onChange={(e) =>
                      handleProductChange(idx, "productId", e.target.value)
                    }
                    required
                  >
                    <option value="">اختر المنتج</option>
                    {productOptions.map((product) => (
                      <option
                        key={product.id}
                        value={product.id}
                        className={!product.available ? "text-red-600" : ""}
                      >
                        {product.name}
                        {product.available
                          ? ` (متوفر: ${product.count})`
                          : " (نفدت الكمية)"}
                      </option>
                    ))}
                  </select>
                  {/* تحذير فقط للمنتجات التي نفدت فعلاً */}
                  {p.productId && !isProductAvailable && (
                    <div className="text-red-500 text-xs mt-1">
                      تنبيه: هذا المنتج نفدت كميته من المخزون
                    </div>
                  )}
                </div>

                {/* الكمية */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min={1}
                    max={currentProduct?.count || 999}
                    className="text-center"
                    value={p.quantity}
                    onChange={(e) =>
                      handleProductChange(idx, "quantity", e.target.value)
                    }
                    placeholder="الكمية"
                    required
                  />
                  {currentProduct && p.quantity > currentProduct.count && (
                    <div className="text-red-500 text-xs mt-1">
                      الحد الأقصى: {currentProduct.count}
                    </div>
                  )}
                </div>

                {/* سعر الجملة */}
                <div className="col-span-2">
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    className="text-center"
                    value={p.wholesalePrice}
                    onChange={(e) =>
                      handleProductChange(idx, "wholesalePrice", e.target.value)
                    }
                    placeholder="سعر الجملة"
                    required
                  />
                </div>

                {/* إجمالي السعر */}
                <div className="col-span-2 text-center font-semibold">
                  {p.totalPrice.toFixed(2)} جنيه
                </div>

                {/* زر الحذف */}
                <div className="col-span-2 text-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveProduct(idx)}
                    className="bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700 transition text-sm"
                  >
                    حذف
                  </button>
                </div>
              </div>
            );
          })}

          {/* زر إضافة منتج */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddProduct}
              className="bg-teal-600 text-white px-6 py-3 rounded hover:bg-teal-700 transition"
            >
              إضافة منتج
            </button>
          </div>

          {/* معلومات الطلب */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                إجمالي الطلب: {calculateTotalAmount().toFixed(2)} جنيه
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                المتبقي: {(calculateTotalAmount() - paidAmount).toFixed(2)} جنيه
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                الدفعة الأولى
              </label>
              <Input
                type="number"
                min={0}
                max={calculateTotalAmount()}
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                placeholder="الدفعة الأولى"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ملاحظات</label>
              <Input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="ملاحظات اختيارية"
              />
            </div>
          </div>

          {/* أزرار الحفظ والإلغاء */}
          <div className="flex justify-end space-x-3 space-x-reverse pt-4">
            <Button type="submit" className="px-8">
              {order ? "حفظ التعديلات" : "إضافة الطلب"}
            </Button>
            <Button variant="outline" onClick={onClose} className="px-8">
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditOrderModal;
