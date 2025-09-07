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
import { useTraders } from "../../hooks/useTraders";

const AddTraderModal = ({ onClose, onAdded }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");

  const { createTrader } = useTraders();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTrader({ name, phone, address, notes });
      if (onAdded) onAdded(); // notify parent to refresh list
      onClose();
    } catch (error) {
      alert(error.message || "Failed to add trader");
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>إضافة تاجر جديد</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit">إضافة</Button>
            <Button variant="outline" onClick={onClose}>
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTraderModal;
