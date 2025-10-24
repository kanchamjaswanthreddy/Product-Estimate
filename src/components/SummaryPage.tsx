import React from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Download, Share2, Save } from "lucide-react";
import { CartItem } from "../types/product";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SavedEstimate } from "../types/estimate";

interface SummaryPageProps {
  cart: CartItem[];
  onBack: () => void;
  onSave: (estimate: SavedEstimate) => void;
  customerName: string;
  onHome: () => void;
}

export function SummaryPage({ cart, onBack, onSave, customerName, onHome }: SummaryPageProps) {
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("SRI SRI SRI LAKSHMI TRADERS", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.text("Price Estimation", 105, 28, { align: "center" });
    if (customerName) {
      doc.text(`Customer: ${customerName}`, 14, 34);
    }

    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 40);

    // Table
    const tableData = cart.map((item, index) => [
      index + 1,
      item.productName,
      `${item.categoryName} - ${item.sizeName}`,
      item.quantity,
      `Rs. ${item.price.toLocaleString()}`,
      `Rs. ${(item.quantity * item.price).toLocaleString()}`,
    ]);

    autoTable(doc, {
      startY: 50,
      head: [["#", "Product Name", "Category - Size", "Qty", "Price", "Total"]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229] },
      footStyles: { fillColor: [229, 231, 235], textColor: [0, 0, 0], fontStyle: "bold" },
      foot: [
        [
          "",
          "",
          "",
          "",
          "Grand Total:",
          `Rs. ${totalAmount.toLocaleString()}`,
        ],
      ],
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 50;
    doc.setFontSize(9);
    doc.text(
      "Thank you for your business!",
      105,
      finalY + 20,
      { align: "center" }
    );

    return doc;
  };

  const handleDownloadPDF = () => {
    const doc = generatePDF();
    const filename = `${customerName ? customerName.replace(/\s+/g, '_') + '-' : ''}quotation-${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
  };

  const handleShareWhatsApp = () => {
    const doc = generatePDF();
    const pdfBlob = doc.output("blob");

    // Create a temporary download link
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${customerName ? customerName.replace(/\s+/g, '_') + '-' : ''}quotation-${new Date().toISOString().split("T")[0]}.pdf`;
    link.click();

    // Create WhatsApp message
    const message = `Price Estimation from SRI SRI SRI LAKSHMI TRADERS\n\n`;
    const itemsList = cart
      .map(
        (item, index) =>
          `${index + 1}. ${item.productName} (${item.categoryName} - ${
            item.sizeName
          })\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString()} = ₹${(
            item.quantity * item.price
          ).toLocaleString()}`
      )
      .join("\n\n");
    const total = `\n\nTotal Amount: ₹${totalAmount.toLocaleString()}`;
    const fullMessage = encodeURIComponent(message + itemsList + total);

    // Note: PDF cannot be directly sent via WhatsApp Web URL
    // User will need to manually attach the downloaded PDF
    alert(
      "PDF has been downloaded. Please manually attach it in WhatsApp to send."
    );

    window.open(`https://wa.me/?text=${fullMessage}`, "_blank");
  };

  const handleSaveEstimate = () => {
    const id = `${Date.now()}`;
    const estimate: SavedEstimate = {
      id,
      customerName: customerName || "Customer",
      dateISO: new Date().toISOString(),
      items: cart,
      totalAmount,
    };
    onSave(estimate);
    alert("Estimate saved.");
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 shadow-lg relative">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl text-center">
            SRI SRI SRI LAKSHMI TRADERS
          </h1>
          <p className="text-center text-indigo-100 mt-2">Price Estimation</p>
        </div>
        <button
          onClick={onHome}
          className="absolute left-4 top-6 bg-white/10 hover:bg-white/20 rounded px-3 py-1 font-bold"
          title="Home"
        >
          HOME
        </button>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Button
          onClick={onBack}
          variant="outline"
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Selection
        </Button>

        <Card className="p-6 md:p-8">
          <div className="space-y-6">
            {/* Header Info */}
            <div className="border-b pb-4">
              <h2 className="text-xl mb-2">Quotation Summary</h2>
              <p className="text-gray-600">
                Date: {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Items List */}
            <div className="space-y-4">
              <h3>Items:</h3>
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <table className="w-[640px] sm:w-full mx-2 sm:mx-0">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-3 text-left">#</th>
                      <th className="p-3 text-left">Product Name</th>
                      <th className="p-3 text-left">Category - Size</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{index + 1}</td>
                        <td className="p-3">{item.productName}</td>
                        <td className="p-3 text-gray-600">
                          {item.categoryName} - {item.sizeName}
                        </td>
                        <td className="p-3 text-right">{item.quantity}</td>
                        <td className="p-3 text-right">
                          ₹{item.price.toLocaleString()}
                        </td>
                        <td className="p-3 text-right">
                          ₹{(item.quantity * item.price).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-100">
                    <tr>
                      <td colSpan={5} className="p-3 text-right">
                        <strong>Grand Total:</strong>
                      </td>
                      <td className="p-3 text-right">
                        <strong className="text-xl">
                          ₹{totalAmount.toLocaleString()}
                        </strong>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-6 flex flex-col sm:flex-row gap-4">
              <Button onClick={handleSaveEstimate} className="flex-1 bg-indigo-600 hover:bg-indigo-700">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={handleDownloadPDF}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={handleShareWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share via WhatsApp
              </Button>
            </div>

            <p className="text-sm text-gray-500 text-center">
              Thank you for your business!
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
