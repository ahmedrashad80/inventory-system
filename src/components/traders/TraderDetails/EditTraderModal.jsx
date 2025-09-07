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
import { useTraders } from "../../../hooks/useTraders";

const EditTraderModal = ({ trader, onClose, onUpdated }) => {
  const [name, setName] = useState(trader?.name || "");
  const [phone, setPhone] = useState(trader?.phone || "");
  const [address, setAddress] = useState(trader?.address || "");
  const [notes, setNotes] = useState(trader?.notes || "");
  const { updateTrader } = useTraders();

  useEffect(() => {
    setName(trader?.name || "");
    setPhone(trader?.phone || "");
    setAddress(trader?.address || "");
    setNotes(trader?.notes || "");
  }, [trader]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateTrader(trader._id, { name, phone, address, notes });
      toast.success("تم تحديث بيانات التاجر بنجاح");
      onUpdated();
      onClose();
    } catch (error) {
      toast.error(error.message || "فشل في تحديث بيانات التاجر");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>تعديل بيانات التاجر</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
          <Input
            required
            placeholder="اسم التاجر"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            placeholder="العنوان"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <Input
            placeholder="ملاحظات"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <div className="flex justify-end space-x-2 space-x-reverse">
            <Button type="submit">حفظ</Button>
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTraderModal;
