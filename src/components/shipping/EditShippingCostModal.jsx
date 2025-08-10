import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";

const API_URL = import.meta.env.VITE_API_URL;

const EditShippingCostModal = ({ show, onClose, governorates }) => {
  const [selectedGov, setSelectedGov] = useState("");
  const [cost, setCost] = useState("");
  const [loadingCost, setLoadingCost] = useState(false);

  useEffect(() => {
    if (selectedGov) {
      setLoadingCost(true);
      axios
        .get(`${API_URL}api/shipping/${selectedGov}`)
        .then((res) => {
          setCost(res.data.cost);
        })
        .catch(() => {
          toast({
            title: "خطأ",
            description: "فشل في جلب تكلفة الشحن",
            variant: "destructive",
          });
          setCost("");
        })
        .finally(() => setLoadingCost(false));
    } else {
      setCost("");
    }
  }, [selectedGov]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGov) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار المحافظة",
        variant: "destructive",
      });
      return;
    }
    if (cost === "" || isNaN(cost) || Number(cost) < 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال تكلفة شحن صحيحة",
        variant: "destructive",
      });
      return;
    }

    try {
      await axios.put(`${API_URL}api/shipping`, {
        name: selectedGov,
        shippingCost: Number(cost),
      });
      toast({
        title: "تم بنجاح",
        description: "تم تحديث تكلفة الشحن",
      });
      onClose();
    } catch {
      toast({
        title: "خطأ",
        description: "فشل في تحديث تكلفة الشحن",
        variant: "destructive",
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">تعديل سعر الشحن</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">المحافظة</label>
            <select
              value={selectedGov}
              onChange={(e) => setSelectedGov(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">اختر المحافظة</option>
              {governorates.map((gov) => (
                <option key={gov.name} value={gov.name}>
                  {gov.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-semibold">تكلفة الشحن</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              disabled={loadingCost}
            />
          </div>
          <div className="flex justify-end space-x-2 space-x-reverse">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded border border-gray-300"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
              disabled={loadingCost}
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditShippingCostModal;
