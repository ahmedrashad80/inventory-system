// ProductLabel.js
import React from "react";

const ProductLabel = ({
  productName,
  batchNo,
  serialNumber,
  manufacturedAt,
}) => (
  <div
    className="border border-gray-300 rounded p-2"
    style={{
      width: "7cm",
      height: "5cm",
      display: "flex",
      flexDirection: "column",
      fontSize: "10px",
      direction: "rtl",
      textAlign: "right",
      boxSizing: "border-box",
      margin: 0, // احذف أي هوامش خارجية
      overflow: "hidden", // يمنع ظهور أي جزء خارج الاستيكر
    }}
  >
    <div>
      <div>
        <strong>المنتج:</strong> {productName}
      </div>
      <div>
        <strong>الدفعة:</strong> {batchNo}
      </div>
      <div>
        <strong>التسلسل:</strong> {serialNumber}
      </div>
      <div>
        <strong>التاريخ:</strong>{" "}
        {manufacturedAt ? new Date(manufacturedAt).toLocaleDateString() : ""}
      </div>
    </div>
  </div>
);

export default ProductLabel;
