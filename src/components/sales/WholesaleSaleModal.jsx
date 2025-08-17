import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const WholesaleSaleModal = ({
  products,
  productCounts,
  onAddWholesaleItem,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [customPrice, setCustomPrice] = useState("");

  const handleAdd = () => {
    if (!selectedProductId) {
      toast.error("يرجى اختيار المنتج");
      return;
    }
    if (quantity <= 0) {
      toast.error("الكمية يجب أن تكون أكبر من صفر");
      return;
    }
    if (!customPrice || Number(customPrice) <= 0) {
      toast.error("يرجى إدخال سعر جملة صحيح");
      return;
    }

    const productEntry = productCounts[selectedProductId];
    if (!productEntry || productEntry.count < quantity) {
      toast.error("الكمية المطلوبة غير متوفرة");
      return;
    }

    const selectedUnitIds = productEntry.units.slice(0, quantity);

    onAddWholesaleItem({
      productId: selectedProductId,
      name: productEntry.product.name,
      code: productEntry.product.code,
      quantity,
      unitPrice: Number(customPrice),
      unitIds: selectedUnitIds,
    });

    setSelectedProductId("");
    setQuantity(1);
    setCustomPrice("");
    setModalOpen(false);
  };

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">بيع جملة</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>بيع منتج للموزعين</DialogTitle>
        </DialogHeader>
        <select
          className="w-full border rounded p-2 mb-2"
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
        >
          <option value="">-- اختر منتجاً --</option>
          {Object.values(productCounts).map(({ product }) => (
            <option key={product._id} value={product._id}>
              {product.name}
            </option>
          ))}
        </select>
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          placeholder="الكمية"
          className="mb-2"
        />
        <Input
          type="number"
          min={0.01}
          step={0.01}
          value={customPrice}
          onChange={(e) => setCustomPrice(e.target.value)}
          placeholder="سعر الجملة"
          className="mb-4"
        />
        <Button onClick={handleAdd}>إضافة</Button>
      </DialogContent>
    </Dialog>
  );
};

export default WholesaleSaleModal;
