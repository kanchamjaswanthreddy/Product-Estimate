import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ArrowLeft, Download, Share2, Trash2 } from "lucide-react";
import { SavedEstimate } from "../types/estimate";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface SavedEstimatesProps {
  estimates: SavedEstimate[];
  onBack: () => void;
  onHome: () => void;
}

export function SavedEstimates({ estimates, onBack, onHome }: SavedEstimatesProps) {
  const downloadAsPdf = (estimate: SavedEstimate) => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text("SRI SRI SRI LAKSHMI TRADERS", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Price Estimation", 105, 28, { align: "center" });
    doc.text(`Customer: ${estimate.customerName}`, 14, 34);
    doc.text(`Date: ${new Date(estimate.dateISO).toLocaleDateString()}`, 14, 40);

    const tableData = estimate.items.map((item, index) => [
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
      foot: [["", "", "", "", "Grand Total:", `Rs. ${estimate.totalAmount.toLocaleString()}`]],
    });

    const filename = `${estimate.customerName.replace(/\s+/g, '_')}-quotation-${new Date(estimate.dateISO).toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
  };

  const shareWhatsApp = (estimate: SavedEstimate) => {
    downloadAsPdf(estimate); // triggers a download for attachment
    const message = `Price Estimation from SRI SRI SRI LAKSHMI TRADERS\nCustomer: ${estimate.customerName}\n\n`;
    const itemsList = estimate.items
      .map(
        (item, index) =>
          `${index + 1}. ${item.productName} (${item.categoryName} - ${item.sizeName})\n   Qty: ${item.quantity} × ₹${item.price.toLocaleString()} = ₹${(
            item.quantity * item.price
          ).toLocaleString()}`
      )
      .join("\n\n");
    const total = `\n\nTotal Amount: ₹${estimate.totalAmount.toLocaleString()}`;
    const fullMessage = encodeURIComponent(message + itemsList + total);
    window.open(`https://wa.me/?text=${fullMessage}`, "_blank");
  };

  const removeEstimate = (id: string) => {
    const raw = localStorage.getItem('saved-estimates');
    const list: SavedEstimate[] = raw ? JSON.parse(raw) : [];
    const updated = list.filter((e) => e.id !== id);
    localStorage.setItem('saved-estimates', JSON.stringify(updated));
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      <div className="bg-indigo-600 text-white p-6 shadow-lg relative">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl text-center">Saved Estimates</h1>
          <p className="text-center text-indigo-100 mt-2">History</p>
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
        <Button onClick={onBack} variant="outline" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        {estimates.length === 0 ? (
          <Card className="p-6 text-center text-gray-500">No saved estimates.</Card>
        ) : (
          <div className="space-y-4">
            {estimates.map((est) => (
              <Card key={est.id} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h4 className="text-lg">{est.customerName}</h4>
                    <p className="text-gray-600 text-sm">{new Date(est.dateISO).toLocaleString()}</p>
                    <p className="text-gray-800 mt-1">Total: ₹{est.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700" onClick={() => downloadAsPdf(est)}>
                      <Download className="h-4 w-4 mr-1" /> Export PDF
                    </Button>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => shareWhatsApp(est)}>
                      <Share2 className="h-4 w-4 mr-1" /> Share
                    </Button>
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => removeEstimate(est.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


