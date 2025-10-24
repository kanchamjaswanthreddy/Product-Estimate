import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { CartItem, Category } from "../types/product";

interface ProductSelectorProps {
  categories: Category[];
  cart: CartItem[];
  onAddToCart: (item: CartItem) => void;
  onUpdateQuantity: (itemKey: string, quantity: number) => void;
  onFinish: () => void;
  onHome: () => void;
}

export function ProductSelector({
  categories,
  cart,
  onAddToCart,
  onUpdateQuantity,
  onFinish,
  onHome,
}: ProductSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  const getCartItemKey = (
    categoryId: string,
    sizeId: string,
    productId: string
  ) => {
    return `${categoryId}-${sizeId}-${productId}`;
  };

  const getQuantityInCart = (
    categoryId: string,
    sizeId: string,
    productId: string
  ) => {
    const key = getCartItemKey(categoryId, sizeId, productId);
    const item = cart.find(
      (i) =>
        getCartItemKey(i.categoryId, i.sizeId, i.productId) === key
    );
    return item?.quantity || 0;
  };

  const handleQuantityChange = (
    categoryId: string,
    categoryName: string,
    sizeId: string,
    sizeName: string,
    productId: string,
    productName: string,
    price: number,
    delta: number
  ) => {
    const currentQty = getQuantityInCart(categoryId, sizeId, productId);
    const newQty = Math.max(0, currentQty + delta);
    const key = getCartItemKey(categoryId, sizeId, productId);

    if (newQty === 0) {
      onUpdateQuantity(key, 0);
    } else if (currentQty === 0) {
      onAddToCart({
        categoryId,
        categoryName,
        sizeId,
        sizeName,
        productId,
        productName,
        price,
        quantity: newQty,
      });
    } else {
      onUpdateQuantity(key, newQty);
    }
  };

  const handleDirectQuantityInput = (
    categoryId: string,
    categoryName: string,
    sizeId: string,
    sizeName: string,
    productId: string,
    productName: string,
    price: number,
    value: string
  ) => {
    const numValue = parseInt(value) || 0;
    const newQty = Math.max(0, numValue);
    const currentQty = getQuantityInCart(categoryId, sizeId, productId);
    const key = getCartItemKey(categoryId, sizeId, productId);

    if (newQty === 0) {
      onUpdateQuantity(key, 0);
    } else if (currentQty === 0) {
      onAddToCart({
        categoryId,
        categoryName,
        sizeId,
        sizeName,
        productId,
        productName,
        price,
        quantity: newQty,
      });
    } else {
      onUpdateQuantity(key, newQty);
    }
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 shadow-lg relative">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl text-center">
            SRI SRI SRI LAKSHMI TRADERS
          </h1>
          <p className="text-center text-indigo-100 mt-2">
            Product Selection
          </p>
        </div>
        <button
          onClick={onHome}
          className="absolute left-4 top-6 bg-white/10 hover:bg-white/20 rounded px-3 py-1 font-bold"
          title="Home"
        >
          HOME
        </button>
      </div>

      <div className="container mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Selection Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Categories */}
            <Card className="p-6">
              <Tabs
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setSelectedSize(null);
                }}
              >
                <TabsList className="w-full grid grid-cols-2 md:grid-cols-5 h-auto gap-2">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.id}
                      value={category.id}
                      className="py-3"
                    >
                      {category.name}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent
                    key={category.id}
                    value={category.id}
                    className="mt-6"
                  >
                    {/* Sizes */}
                    <div className="mb-6">
                      <h3 className="mb-3">Select Size:</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {category.sizes.map((size) => (
                          <Button
                            key={size.id}
                            variant={
                              selectedSize === size.id ? "default" : "outline"
                            }
                            onClick={() => setSelectedSize(size.id)}
                            className="h-auto py-3"
                          >
                            {size.name}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Products */}
                    {selectedSize && (
                      <div>
                        <h3 className="mb-3">Products:</h3>
                        <div className="space-y-3">
                          {category.sizes
                            .find((s) => s.id === selectedSize)
                            ?.products.map((product) => {
                              const qty = getQuantityInCart(
                                category.id,
                                selectedSize,
                                product.id
                              );
                              const size = category.sizes.find(
                                (s) => s.id === selectedSize
                              )!;

                              return (
                                <Card
                                  key={product.id}
                                  className="p-4 hover:shadow-md transition-shadow"
                                >
                                  <div className="flex items-center justify-between gap-4">
                                    <div className="flex-1">
                                      <h4>{product.name}</h4>
                                      <p className="text-gray-600 mt-1">
                                        ₹{product.price.toLocaleString()}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 sm:gap-3">
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          handleQuantityChange(
                                            category.id,
                                            category.name,
                                            selectedSize,
                                            size.name,
                                            product.id,
                                            product.name,
                                            product.price,
                                            -1
                                          )
                                        }
                                        disabled={qty === 0}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <input
                                        type="number"
                                        min="0"
                                        value={qty}
                                        onChange={(e) =>
                                          handleDirectQuantityInput(
                                            category.id,
                                            category.name,
                                            selectedSize,
                                            size.name,
                                            product.id,
                                            product.name,
                                            product.price,
                                            e.target.value
                                          )
                                        }
                                        className="w-14 sm:w-16 text-center border border-gray-300 rounded px-2 py-1"
                                      />
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() =>
                                          handleQuantityChange(
                                            category.id,
                                            category.name,
                                            selectedSize,
                                            size.name,
                                            product.id,
                                            product.name,
                                            product.price,
                                            1
                                          )
                                        }
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </Card>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-6">
              <div className="flex items-center gap-2 mb-4">
                <ShoppingCart className="h-5 w-5" />
                <h3>Cart Summary</h3>
                {totalItems > 0 && (
                  <Badge variant="secondary">{totalItems}</Badge>
                )}
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
                {cart.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No items selected
                  </p>
                ) : (
                  cart.map((item) => (
                    <div
                      key={getCartItemKey(
                        item.categoryId,
                        item.sizeId,
                        item.productId
                      )}
                      className="border-b pb-3"
                    >
                      <div className="space-y-1">
                        <p className="text-sm">{item.productName}</p>
                        <p className="text-xs text-gray-500">
                          {item.categoryName} - {item.sizeName}
                        </p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">
                            {item.quantity} × ₹{item.price.toLocaleString()}
                          </span>
                          <span>
                            ₹{(item.quantity * item.price).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span>Total Amount:</span>
                  <span className="text-2xl">
                    ₹{totalAmount.toLocaleString()}
                  </span>
                </div>

                <Button
                  onClick={onFinish}
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={cart.length === 0}
                >
                  Finish
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
