import React, { useState } from "react";

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [newUsername, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ newUsername, newPassword });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold mb-4">تعديل بيانات المستخدم</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* <div>
            <label className="block text-sm font-medium text-gray-700">
              اسم المستخدم الحالي
            </label>
            <input
              type="text"
              value={user?.name || ""}
              readOnly
              className="mt-1 w-full px-3 py-2 border rounded-md bg-gray-100"
            />
          </div> */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              اسم المستخدم الجديد
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              كلمة المرور الجديدة
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border rounded-md"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;
