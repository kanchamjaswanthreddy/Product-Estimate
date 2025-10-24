import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Settings } from "lucide-react";

interface WelcomePageProps {
  onStart: (customerName: string) => void;
  onAdminAccess: () => void;
  onViewSaved: () => void;
}

export function WelcomePage({ onStart, onAdminAccess, onViewSaved }: WelcomePageProps) {
  const [customerName, setCustomerName] = useState("");
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 safe-top safe-bottom">
      <Button
        onClick={onAdminAccess}
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 bg-white/80 hover:bg-white"
      >
        <Settings className="h-5 w-5" />
      </Button>

      <div className="text-center space-y-8 max-w-2xl">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl text-indigo-900">
            WELCOME
          </h1>
          <h2 className="text-3xl md:text-5xl text-indigo-700">
            SRI SRI SRI LAKSHMI TRADERS
          </h2>
        </div>
        
        <div className="flex flex-col items-center gap-3 mt-8">
          <Input
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="max-w-sm text-center"
          />
          <Button 
            onClick={() => onStart(customerName.trim())}
            className="px-12 py-6 bg-indigo-600 hover:bg-indigo-700"
            size="lg"
            disabled={!customerName.trim()}
          >
            Start
          </Button>
          <Button
            onClick={onViewSaved}
            variant="outline"
            className="mt-2"
          >
            Saved Estimates
          </Button>
        </div>
      </div>
    </div>
  );
}
