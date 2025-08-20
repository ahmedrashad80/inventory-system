// src/pages/Sales.jsx
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft, Boxes, Sparkles } from "lucide-react";
import WholesaleSaleModal from "../components/sales/WholesaleSaleModal";
import ClientData from "../components/sales/ClientData";

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [salesHistory, setSalesHistory] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [wholesalesItems, setWholesalesItems] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");

  useEffect(() => {
    fetchUnits();
    fetchSalesHistory();
  }, []);

  const fetchUnits = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}api/products/units`
      );
      setProducts(res.data.units);
      setProductCounts(res.data.productCounts);
      console.log(res.data);
    } catch (error) {
      toast.error("فشل في جلب المنتجات");
    }
  };

  const fetchSalesHistory = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}api/products/sell`
      );
      console.log(res.data.reverse());

      setSalesHistory(res.data);
    } catch (error) {
      toast.error("فشل في جلب تاريخ المبيعات");
    }
  };

  const handleAddItem = () => {
    if (!selectedProductId || quantity <= 0) return;

    const productEntry = productCounts[selectedProductId];
    if (!productEntry || productEntry.count < quantity) {
      toast.error("الكمية المطلوبة غير متوفرة");
      return;
    }

    const selectedUnitIds = productEntry.units.slice(0, quantity);
    setSelectedItems((prev) => [
      ...prev,
      {
        productId: selectedProductId,
        name: productEntry.product.name,
        code: productEntry.product.code,
        quantity,
        unitPrice: productEntry.product.price,
        unitIds: selectedUnitIds,
      },
    ]);

    setSelectedProductId("");
    setQuantity(1);
    setModalOpen(false);
  };

  const handleSell = async () => {
    if (selectedItems.length === 0) return;
    try {
      const items = selectedItems.map(({ productId, unitIds }) => ({
        productId,
        unitIds,
      }));
      await axios.post(`${import.meta.env.VITE_API_URL}api/products/sell`, {
        items,
      });

      // add toast with success message and with three seconds duration
      toast.success("تمت عملية البيع بنجاح", {
        duration: 3000,

        style: {
          backgroundColor: "#4CAF50",
          color: "white",
        },
      });
      setSelectedItems([]);
      fetchUnits();
      fetchSalesHistory();
    } catch (error) {
      toast.error("فشل في تنفيذ عملية البيع");
    }
  };

  const deleteSell = () => {
    // make sure the user want to delete the sell
    if (!window.confirm("هل أنت متأكد من إلغاء البيع؟")) return;
    setSelectedItems([]);

    toast.info("تم إلغاء البيع");
  };

  //   function to print the invoice
  const printInvoice = (seclectedItem, clientName = "", clientPhone = "") => {
    const printContent = document.createElement("div");

    printContent.innerHTML = `
       <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px; positon:relative">


         <img src="/bm.png" alt="Logo" style="position: absolute; top: 1rem; left: 1rem; width: 100px; height: 100px; margin: 0;" />
      <h2 style="text-align: center; margin-bottom: 20px;">فاتورة البيع</h2>
        <p style="text-align: center; font-weight: bold; font-size: 1.2em;">شركة BM</p>

        <p style="text-align: center; margin-bottom: 20px;">تاريخ: ${new Date().toLocaleDateString(
          "ar-EG",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )}</p>
        ${
          clientName
            ? `<p style="text-align: center; margin-bottom: 20px;">اسم العميل: ${clientName}</p>`
            : `<p style="text-align: center; margin-bottom: 20px;">اسم العميل: .................</p>`
        }
        ${
          clientPhone
            ? `<p style="text-align: center; margin-bottom: 20px;">رقم الهاتف: ${clientPhone}</p>`
            : `<p style="text-align: center; margin-bottom: 20px;">رقم الهاتف: ...............</p>`
        }
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">المنتج</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">الكود</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">الكمية</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">السعر للوحدة</th>
                <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">الإجمالي</th>
            </tr>
            </thead>
            <tbody>
            ${seclectedItem
              .map(
                (item) => `
                <tr>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                      item.name
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                      item.code
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${
                      item.quantity
                    }</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${item.unitPrice.toFixed(
                      2
                    )} جنيه</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${(
                      item.quantity * item.unitPrice
                    ).toFixed(2)} جنيه</td>
                </tr>
                `
              )
              .join("")}
            </tbody>

            <tfoot>
              <tr>
                <td colspan="4" style="border: 1px solid #ddd; padding: 8px; text-align: right;">الإجمالي</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${seclectedItem
                  .reduce(
                    (total, item) => total + item.quantity * item.unitPrice,
                    0
                  )
                  .toFixed(2)} جنيه</td>
              </tr>
            </tfoot>
        </table>
        <p style="text-align: center; margin-top: 20px; font-size: 0.9em; color: gray;">
          شكراً لتعاملكم معنا!
        </p>

        <p style="text-align: center; margin-top: 10px; font-size: 0.9em; color: gray;">
          رقم الاتصال:01091144077
        </p>

      </div>
    `;

    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };
  // Add handler to add wholesale item
  const handleAddWholesaleItem = (item) => {
    setWholesalesItems((prev) => [...prev, item]);
  };

  const handleWholesaleSell = async () => {
    if (wholesalesItems.length === 0) return;
    try {
      const items = wholesalesItems.map(
        ({ productId, unitIds, unitPrice }) => ({
          productId,
          unitIds,
          unitPrice, // send custom wholesale price
        })
      );
      await axios.post(`${import.meta.env.VITE_API_URL}api/products/sell`, {
        items,
      });
      toast.success("تمت عملية بيع الجملة بنجاح", { duration: 3000 });
      setWholesalesItems([]);
      fetchUnits();
      fetchSalesHistory();
    } catch (error) {
      toast.error("فشل في تنفيذ عملية بيع الجملة");
    }
  };
  // Add handler to cancel wholesale sale
  const cancelWholesaleSell = () => {
    if (!window.confirm("هل أنت متأكد من إلغاء بيع الجملة؟")) return;
    setWholesalesItems([]);
    toast.info("تم إلغاء بيع الجملة");
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
      dir="rtl"
    >
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link
                to="/"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 ml-2" />
                العودة للرئيسية
              </Link>
              <div className="w-px h-6 bg-gray-300"></div>
              <div className="flex items-center space-x-3 space-x-reverse">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-2 rounded-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">
                    إدارة المبيعات
                  </h1>
                  <p className="text-sm text-gray-600">عرض وإدارة المبيعات</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <div className="p-6 space-y-6">
        {/* Header */}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">صفحة المبيعات</h2>
          <div className="flex gap-2">
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
              <DialogTrigger asChild>
                <Button>بيع منتج</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>اختر منتجاً للبيع</DialogTitle>
                </DialogHeader>
                <select
                  className="w-full border rounded p-2"
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
                />
                <Button onClick={handleAddItem}>إضافة</Button>
              </DialogContent>
            </Dialog>
            <WholesaleSaleModal
              products={products}
              productCounts={productCounts}
              onAddWholesaleItem={handleAddWholesaleItem}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.values(productCounts).map(({ product, count }) => (
            <Card key={product._id}>
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
                <p className="text-sm text-gray-500">{product.code}</p>
              </CardHeader>
              <CardContent>
                <p>السعر: {product.price} جنيه</p>
                <p>المتوفر: {count} وحدة</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedItems.length > 0 && (
          <div className="border p-4 rounded-md bg-white">
            <h3 className="font-semibold mb-2">عناصر البيع:</h3>
            <ul className="list-disc pl-5">
              {selectedItems.map((item, idx) => (
                <li key={idx} className="">
                  {item.name}: [الكمية: {item.quantity} -- السعر:{" "}
                  {item.unitPrice} -- الإجمالي: {item.quantity * item.unitPrice}
                  ]
                </li>
              ))}
            </ul>
            <ClientData
              clientName={clientName}
              setClientName={setClientName}
              clientPhone={clientPhone}
              setClientPhone={setClientPhone}
            />
            <Button className="mt-2" onClick={handleSell}>
              تنفيذ البيع
            </Button>
            <Button
              className="mt-2 mr-2 bg-red-500 hover:bg-red-600"
              onClick={() => deleteSell()}
            >
              الغاء البيع
            </Button>
            <Button
              className="mt-2 mr-2 bg-blue-500 hover:bg-blue-600"
              onClick={() =>
                printInvoice(selectedItems, clientName, clientPhone)
              }
            >
              طباعة الفاتورة
            </Button>
          </div>
        )}

        {wholesalesItems.length > 0 && (
          <div className="border p-4 rounded-md bg-white mt-6">
            <h3 className="font-semibold mb-2">عناصر بيع الجملة:</h3>
            <ul className="list-disc pl-5">
              {wholesalesItems.map((item, idx) => (
                <li key={idx}>
                  {item.name}: [الكمية: {item.quantity} -- السعر:{" "}
                  {item.unitPrice} -- الإجمالي:{" "}
                  {(item.quantity * item.unitPrice).toFixed(2)}]
                </li>
              ))}
            </ul>
            <ClientData
              clientName={clientName}
              setClientName={setClientName}
              clientPhone={clientPhone}
              setClientPhone={setClientPhone}
            />
            <Button className="mt-2" onClick={handleWholesaleSell}>
              تنفيذ بيع الجملة
            </Button>
            <Button
              className="mt-2 mr-2 bg-red-500 hover:bg-red-600"
              onClick={cancelWholesaleSell}
            >
              إلغاء بيع الجملة
            </Button>
            <Button
              className="mt-2 mr-2 bg-blue-500 hover:bg-blue-600"
              onClick={() =>
                printInvoice(wholesalesItems, clientName, clientPhone)
              }
            >
              طباعة فاتورة بيع الجملة
            </Button>
          </div>
        )}

        <div className="mt-8  ">
          <h3 className="text-xl font-bold mb-2">تاريخ المبيعات</h3>
          <Table>
            <TableHeader className="bg-gray-200">
              <TableRow className="text-center ">
                <TableHead className="text-center">المنتج</TableHead>
                <TableHead className="text-center">الكمية</TableHead>
                <TableHead className="text-center">السعر للوحدة</TableHead>
                <TableHead className="text-center">الإجمالي</TableHead>
                <TableHead className="text-center">التاريخ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {salesHistory.flatMap((sale) =>
                sale.items.map((item, idx) => (
                  <TableRow
                    key={sale._id + idx}
                    className="text-center even:bg-gray-400 odd:bg-white"
                  >
                    <TableCell>{item.product?.name}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.totalPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(sale.soldAt).toLocaleDateString("ar-EG", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Sales;
