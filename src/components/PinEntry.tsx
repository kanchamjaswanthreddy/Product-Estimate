import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Lock } from "lucide-react";

interface PinEntryProps {
  onSuccess: () => void;
  onCancel: () => void;
  onHome: () => void;
  title?: string;
}

export function PinEntry({ onSuccess, onCancel, onHome, title }: PinEntryProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "5758") {
      onSuccess();
    } else {
      setError("Incorrect PIN");
      setPin("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 safe-top safe-bottom">
      <Button
        onClick={onHome}
        variant="outline"
        className="absolute top-4 left-4 bg-white/80 hover:bg-white font-bold"
        title="Home"
      >
        HOME
      </Button>
      <Card className="p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Lock className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-2xl">{title || "Admin Access"}</h2>
          <p className="text-gray-600 mt-2">Enter PIN to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              placeholder="Enter 4-digit PIN"
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
            {error && (
              <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700">
              Enter
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
