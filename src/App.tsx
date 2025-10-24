import { useEffect, useState } from "react";
import { WelcomePage } from "./components/WelcomePage";
import { ProductSelector } from "./components/ProductSelector";
import { SummaryPage } from "./components/SummaryPage";
import { PinEntry } from "./components/PinEntry";
import { AdminPanel } from "./components/AdminPanel";
import { CartItem, Category } from "./types/product";
import { categories as initialCategories } from "./data/products";
import { SavedEstimate } from "./types/estimate";
import { SavedEstimates } from "./components/SavedEstimates";

type Screen = "welcome" | "selection" | "summary" | "pin" | "admin" | "saved" | "savedPin";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [customerName, setCustomerName] = useState<string>("");
  const [savedEstimates, setSavedEstimates] = useState<SavedEstimate[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('saved-estimates');
      if (raw) setSavedEstimates(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('saved-estimates', JSON.stringify(savedEstimates));
    } catch {}
  }, [savedEstimates]);

  const handleStart = (name: string) => {
    setCustomerName(name);
    setCurrentScreen("selection");
  };

  const handleAdminAccess = () => {
    setCurrentScreen("pin");
  };

  const handlePinSuccess = () => {
    setCurrentScreen("admin");
  };

  const handlePinCancel = () => {
    setCurrentScreen("welcome");
  };

  const handleBackToWelcome = () => {
    setCurrentScreen("welcome");
  };

  const handleHome = () => {
    setCurrentScreen("welcome");
  };

  const handleUpdateProducts = async (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    try {
      await fetch('/api/save-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories: updatedCategories })
      });
    } catch (e) {
      // silently ignore in UI; changes remain in memory
      console.error('Failed to save products:', e);
    }
  };

  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => [...prev, item]);
  };

  const handleUpdateQuantity = (itemKey: string, quantity: number) => {
    if (quantity === 0) {
      setCart((prev) =>
        prev.filter(
          (item) =>
            `${item.categoryId}-${item.sizeId}-${item.productId}` !== itemKey
        )
      );
    } else {
      setCart((prev) =>
        prev.map((item) =>
          `${item.categoryId}-${item.sizeId}-${item.productId}` === itemKey
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  const handleFinish = () => {
    setCurrentScreen("summary");
  };

  const handleBackToSelection = () => {
    setCurrentScreen("selection");
  };

  return (
    <div className="size-full">
      {currentScreen === "welcome" && (
        <WelcomePage onStart={handleStart} onAdminAccess={handleAdminAccess} onViewSaved={() => setCurrentScreen("savedPin")} />
      )}
      {currentScreen === "pin" && (
        <PinEntry onSuccess={handlePinSuccess} onCancel={handlePinCancel} onHome={handleHome} title="Admin Access" />
      )}
      {currentScreen === "savedPin" && (
        <PinEntry onSuccess={() => setCurrentScreen("saved")} onCancel={() => setCurrentScreen("welcome")} onHome={handleHome} title="Saved Estimates Access" />
      )}
      {currentScreen === "admin" && (
        <AdminPanel
          categories={categories}
          onUpdateProducts={handleUpdateProducts}
          onBack={handleBackToWelcome}
          onHome={handleHome}
        />
      )}
      {currentScreen === "selection" && (
        <ProductSelector
          categories={categories}
          cart={cart}
          onAddToCart={handleAddToCart}
          onUpdateQuantity={handleUpdateQuantity}
          onFinish={handleFinish}
          onHome={handleHome}
        />
      )}
      {currentScreen === "summary" && (
        <SummaryPage cart={cart} onBack={handleBackToSelection}
          onSave={(est) => setSavedEstimates((prev) => [est, ...prev])}
          customerName={customerName}
          onHome={handleHome}
        />
      )}
      {currentScreen === "saved" && (
        <SavedEstimates estimates={savedEstimates} onBack={() => setCurrentScreen("welcome")} onHome={handleHome} />
      )}
    </div>
  );
}
