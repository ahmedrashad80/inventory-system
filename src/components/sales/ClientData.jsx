import React from "react";

export default function ClientData({
  clientName,
  setClientName,
  clientPhone,
  setClientPhone,
}) {
  return (
    <div className="mb-4 space-y-2">
      <input
        type="text"
        placeholder="اسم العميل (اختياري)"
        value={clientName}
        onChange={(e) => setClientName(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
      <input
        type="text"
        placeholder="رقم هاتف العميل (اختياري)"
        value={clientPhone}
        onChange={(e) => setClientPhone(e.target.value)}
        className="w-full border border-gray-300 rounded px-3 py-2"
      />
    </div>
  );
}
