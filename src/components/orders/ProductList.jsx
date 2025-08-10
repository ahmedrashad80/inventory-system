import React from "react";

const ProductList = ({ products, setProducts }) => {
  const updateProduct = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] =
      field === "quantity" || field === "price" ? Number(value) : value;
    setProducts(newProducts);
  };

  const addProduct = () => {
    setProducts([...products, { name: "", quantity: 1, price: 0 }]);
  };

  const removeProduct = (index) => {
    const newProducts = products.filter((_, i) => i !== index);
    setProducts(newProducts);
  };

  return (
    <div>
      <h3 className="font-semibold mb-2">المنتجات</h3>
      {products.length === 0 && (
        <p className="text-gray-500 mb-2">لا توجد منتجات مضافة</p>
      )}
      {products.map((product, index) => (
        <div key={index} className="flex gap-2 mb-2 items-center">
          <input
            type="text"
            placeholder="اسم المنتج"
            value={product.name}
            onChange={(e) => updateProduct(index, "name", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 flex-1"
          />
          <input
            type="number"
            min="1"
            placeholder="الكمية"
            value={product.quantity}
            onChange={(e) => updateProduct(index, "quantity", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-20"
          />
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="السعر"
            value={product.price}
            onChange={(e) => updateProduct(index, "price", e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 w-24"
          />
          <button
            type="button"
            onClick={() => removeProduct(index)}
            className="text-red-600 hover:text-red-900"
            title="حذف المنتج"
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addProduct}
        className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
      >
        إضافة منتج جديد
      </button>
    </div>
  );
};

export default ProductList;
