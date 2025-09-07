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

const AddEditPaymentModal = ({ payment, onClose, onSaved }) => {
  const [amount, setAmount] = useState(payment?.amount || "");
  const [paymentMethod, setPaymentMethod] = useState(
    payment?.paymentMethod || ""
  );
  const [notes, setNotes] = useState(payment?.notes || "");
  const { id } = useParams();

  useEffect(() => {
    setAmount(payment?.amount || "");
    setPaymentMethod(payment?.paymentMethod || "");
    setNotes(payment?.notes || "");
  }, [payment]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      toast.error("يرجى إدخال مبلغ صحيح");
      return;
    }

    if (!paymentMethod) {
      toast.error("يرجى اختيار طريقة الدفع");
      return;
    }

    const paymentData = {
      traderId: id,
      amount: Number(amount),
      paymentMethod,
      notes,
    };

    try {
      const url = payment
        ? `${import.meta.env.VITE_API_URL}api/traders/payments/${payment._id}`
        : `${import.meta.env.VITE_API_URL}api/traders/payments`;
      const method = payment ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(paymentData),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "فشل في حفظ الدفعة");
      }

      toast.success(
        payment ? "تم تحديث الدفعة بنجاح" : "تم إضافة الدفعة بنجاح"
      );
      onSaved();
    } catch (error) {
      toast.error(error.message || "حدث خطأ أثناء حفظ الدفعة");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {payment ? "تعديل الدفعة" : "إضافة دفعة جديدة"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <Input
            type="number"
            min="0.01"
            step="0.01"
            placeholder="المبلغ"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <select
            className="w-full border rounded p-2"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">اختر طريقة الدفع</option>
            <option value="نقدي">نقدي</option>
            <option value="تحويل">تحويل</option>
            <option value="شيك">شيك</option>
            <option value="أخرى">أخرى</option>
          </select>
          <Input
            placeholder="ملاحظات"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button type="submit">
              {payment ? "حفظ التعديلات" : "إضافة الدفعة"}
            </Button>
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditPaymentModal;
