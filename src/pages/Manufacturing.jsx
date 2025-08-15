import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import axios from "axios";
import { useProducts } from "@/hooks/useProducts";
import { useComponents } from "@/hooks/useComponents";

// Import components
import ManufacturingHeader from "@/components/manufacturing/ManufacturingHeader";
import ManufacturingForm from "@/components/manufacturing/ManufacturingForm";
import ManufacturingResult from "@/components/manufacturing/ManufacturingResult";
import ManufacturingHistory from "@/components/manufacturing/ManufacturingHistory";

const Manufacturing = () => {
  // State variables
  const [expandedRecords, setExpandedRecords] = useState({});
  const [serialNumbers, setSerialNumbers] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [manufactureData, setManufactureData] = useState({
    productId: "",
    quantity: "",
    notes: "",
    created_by: "",
  });
  const [isManufacturing, setIsManufacturing] = useState(false);
  const [manufacturingResult, setManufacturingResult] = useState(null);
  const [canManufacture, setCanManufacture] = useState(false);
  const [manufacturingRecords, setManufacturingRecords] = useState([]);
  const [isLoadingRecords, setIsLoadingRecords] = useState(false);

  const printRef = useRef(null);
  const location = useLocation();

  const { products, isLoading: productsLoading } = useProducts();
  const { components, isLoading: componentsLoading } = useComponents();

  useEffect(() => {
    // Check if a product was passed from the products page
    if (location.state?.selectedProduct) {
      const product = location.state.selectedProduct;
      setSelectedProduct(product);
      setManufactureData({
        productId: product._id,
        quantity: "1",
        notes: "",
        created_by: "",
      });
    }

    // Fetch manufacturing records
    fetchManufacturingRecords();
  }, [location.state]);

  useEffect(() => {
    if (selectedProduct && manufactureData.quantity) {
      checkManufacturingCapacity();
    }
  }, [selectedProduct, manufactureData.quantity, components]);

  const fetchManufacturingRecords = async () => {
    try {
      setIsLoadingRecords(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}api/products/manufacture`
      );
      setManufacturingRecords(
        Array.isArray(response.data) ? response.data : []
      );
    } catch (error) {
      console.error("Error fetching manufacturing records:", error);
      toast({
        title: "خطأ",
        description: "فشل في جلب سجلات التصنيع",
        variant: "destructive",
      });
      setManufacturingRecords([]);
    } finally {
      setIsLoadingRecords(false);
    }
  };

  const checkManufacturingCapacity = () => {
    if (!selectedProduct || !manufactureData.quantity) {
      setCanManufacture(false);
      return;
    }

    const requestedQuantity = parseInt(manufactureData.quantity);
    let canProduce = true;

    if (selectedProduct.components) {
      for (const productComponent of selectedProduct.components) {
        const availableComponent = components.find(
          (c) =>
            c._id === productComponent.component._id ||
            c._id === productComponent.component
        );
        if (!availableComponent) {
          canProduce = false;
          break;
        }

        const requiredQuantity =
          productComponent.quantity_required * requestedQuantity;
        if (availableComponent.quantity < requiredQuantity) {
          canProduce = false;
          break;
        }
      }
    }

    setCanManufacture(canProduce);
  };

  const handleProductChange = (productId) => {
    const product = products.find((p) => p._id === productId);
    setSelectedProduct(product);
    setManufactureData({
      ...manufactureData,
      productId: productId,
    });
  };

  const getMaxQuantity = () => {
    if (!selectedProduct || !selectedProduct.components) return 0;

    let maxQuantity = Infinity;

    selectedProduct.components.forEach((productComponent) => {
      const availableComponent = components.find(
        (c) =>
          c._id ===
          (productComponent.component._id || productComponent.component)
      );

      if (availableComponent) {
        const possibleQuantity = Math.floor(
          availableComponent.quantity / productComponent.quantity_required
        );
        maxQuantity = Math.min(maxQuantity, possibleQuantity);
      } else {
        maxQuantity = 0;
      }
    });

    return maxQuantity;
  };

  const handleManufacture = async (e) => {
    e.preventDefault();

    if (!canManufacture) {
      toast({
        title: "تعذر التصنيع",
        description: "المكونات المتاحة غير كافية للكمية المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setIsManufacturing(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL;
      // Include the product ID in the request payload
      const response = await axios.post(`${API_URL}api/products/manufacture`, {
        ...manufactureData,
        productId: selectedProduct._id, // Ensure product ID is included
      });

      setManufacturingResult({
        batchNumber: response.data.batch_no,
        productName: selectedProduct.name,
        productId: selectedProduct._id,
        quantity: parseInt(manufactureData.quantity),
        manufacturedUnits: response.data.units.map((unit, index) => ({
          serialNumber: unit.serial_number,
          unitNumber: index + 1,
          productName: selectedProduct.name,
          manufacturedAt: new Date().toLocaleString("en-US"),
        })),
        manufacturedAt: new Date().toLocaleString("en-US"),
        notes: manufactureData.notes,
        created_by: manufactureData.created_by || "النظام",
      });

      toast({
        title: "تم التصنيع بنجاح",
        description: `تم تصنيع ${manufactureData.quantity} وحدة من ${selectedProduct.name}`,
      });

      // Refresh manufacturing records
      fetchManufacturingRecords();

      // Reset form
      setManufactureData({
        productId: "",
        quantity: "",
        notes: "",
        created_by: "",
      });
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error manufacturing product:", error);
      toast({
        title: "خطأ في التصنيع",
        description: error.response?.data?.message || "حدث خطأ أثناء التصنيع",
        variant: "destructive",
      });
    } finally {
      setIsManufacturing(false);
    }
  };

  const toggleRecordExpansion = async (recordId) => {
    if (expandedRecords[recordId]) {
      // If already expanded, just collapse
      setExpandedRecords({
        ...expandedRecords,
        [recordId]: false,
      });
    } else {
      // If not expanded, fetch serial numbers first
      try {
        if (!serialNumbers[recordId]) {
          const API_URL = import.meta.env.VITE_API_URL;
          const response = await axios.get(
            `${API_URL}api/products/units/batch/${recordId}`
          );

          // Update to use the units array from the response
          setSerialNumbers({
            ...serialNumbers,
            [recordId]: response.data.units || [],
          });
        }
        // Then expand
        setExpandedRecords({
          ...expandedRecords,
          [recordId]: true,
        });
      } catch (error) {
        console.error("Error fetching serial numbers:", error);
        toast({
          title: "خطأ",
          description: "فشل في جلب الأرقام التسلسلية",
          variant: "destructive",
        });
      }
    }
  };

  const printSerialNumbers = (recordId, batchNo, productName) => {
    const printContent = document.createElement("div");
    printContent.innerHTML = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2 style="text-align: center; margin-bottom: 20px;">الأرقام التسلسلية للمنتجات</h2>
        <div style="margin-bottom: 15px;">
          <strong>المنتج:</strong> ${productName || "غير معروف"}
        </div>
        <div style="margin-bottom: 15px;">
          <strong>رقم الدفعة:</strong> ${batchNo || "غير معروف"}
        </div>
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">الرقم التسلسلي</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">رقم الوحدة</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">الحالة</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">تاريخ الإنتاج</th>
            </tr>
          </thead>
          <tbody>
            ${
              serialNumbers[recordId]
                ?.map(
                  (unit, index) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px; font-family: monospace;">${
                  unit.serial_number
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  index + 1
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${
                  unit.status || "جاهز"
                }</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${new Date(
                  unit.date_produced
                ).toLocaleString("en-US")}</td>
              </tr>
            `
                )
                .join("") ||
              '<tr><td colspan="4" style="text-align: center; padding: 15px;">لا توجد أرقام تسلسلية</td></tr>'
            }
          </tbody>
        </table>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <ManufacturingHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ManufacturingForm
              products={products}
              productsLoading={productsLoading}
              components={components}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
              manufactureData={manufactureData}
              setManufactureData={setManufactureData}
              handleProductChange={handleProductChange}
              getMaxQuantity={getMaxQuantity}
              canManufacture={canManufacture}
              isManufacturing={isManufacturing}
              handleManufacture={handleManufacture}
            />

            <ManufacturingResult
              manufacturingResult={manufacturingResult}
              setManufacturingResult={setManufacturingResult}
            />
          </div>

          {/* سجل عمليات التصنيع في سطر كامل */}
          <div className="w-full">
            <ManufacturingHistory
              isLoadingRecords={isLoadingRecords}
              manufacturingRecords={manufacturingRecords}
              expandedRecords={expandedRecords}
              serialNumbers={serialNumbers}
              toggleRecordExpansion={toggleRecordExpansion}
              printSerialNumbers={printSerialNumbers}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Manufacturing;
