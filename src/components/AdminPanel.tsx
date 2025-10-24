import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { ArrowLeft, Plus, Edit2, Trash2, Save, X, Home } from "lucide-react";
import { Category, Product } from "../types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface AdminPanelProps {
  categories: Category[];
  onUpdateProducts: (categories: Category[]) => void;
  onBack: () => void;
  onHome: () => void;
}

export function AdminPanel({ categories, onUpdateProducts, onBack, onHome }: AdminPanelProps) {
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");

  const currentCategory = categories.find((c) => c.id === selectedCategory);

  const handleAddProduct = () => {
    if (!selectedSize || !productName || !productPrice) return;

    const newCategories = categories.map((cat) => {
      if (cat.id === selectedCategory) {
        return {
          ...cat,
          sizes: cat.sizes.map((size) => {
            if (size.id === selectedSize) {
              const newProduct: Product = {
                id: `${selectedSize}-${Date.now()}`,
                name: productName,
                price: parseFloat(productPrice),
              };
              return {
                ...size,
                products: [...size.products, newProduct],
              };
            }
            return size;
          }),
        };
      }
      return cat;
    });

    onUpdateProducts(newCategories);
    setProductName("");
    setProductPrice("");
    setAddingProduct(false);
  };

  const handleEditPrice = (productId: string, newPrice: string) => {
    if (!selectedSize) return;

    const newCategories = categories.map((cat) => {
      if (cat.id === selectedCategory) {
        return {
          ...cat,
          sizes: cat.sizes.map((size) => {
            if (size.id === selectedSize) {
              return {
                ...size,
                products: size.products.map((prod) =>
                  prod.id === productId
                    ? { ...prod, price: parseFloat(newPrice) || 0 }
                    : prod
                ),
              };
            }
            return size;
          }),
        };
      }
      return cat;
    });

    onUpdateProducts(newCategories);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (!selectedSize) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    const newCategories = categories.map((cat) => {
      if (cat.id === selectedCategory) {
        return {
          ...cat,
          sizes: cat.sizes.map((size) => {
            if (size.id === selectedSize) {
              return {
                ...size,
                products: size.products.filter((prod) => prod.id !== productId),
              };
            }
            return size;
          }),
        };
      }
      return cat;
    });

    onUpdateProducts(newCategories);
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-top safe-bottom">
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6 shadow-lg relative">
        <div className="container mx-auto">
          <h1 className="text-2xl md:text-3xl text-center">
            Admin Panel
          </h1>
          <p className="text-center text-indigo-100 mt-2">
            Manage Products & Prices
          </p>
        </div>
        <button
          onClick={onHome}
          className="absolute left-3 top-3 sm:left-4 sm:top-6 bg-white/10 hover:bg-white/20 rounded p-2"
          title="Home"
        >
          <Home className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <div className="container mx-auto p-4 md:p-6 max-w-4xl">
        <Button onClick={onBack} variant="outline" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Welcome
        </Button>

        <Card className="p-6">
          <Tabs
            value={selectedCategory}
            onValueChange={(value) => {
              setSelectedCategory(value);
              setSelectedSize(null);
              setEditingProduct(null);
              setAddingProduct(false);
            }}
          >
            <TabsList className="w-full h-auto gap-2 mb-6 overflow-x-auto no-scrollbar grid grid-flow-col auto-cols-max">
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
                className="space-y-6"
              >
                {/* Sizes */}
                <div>
                  <h3 className="mb-3">Select Size:</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {category.sizes.map((size) => (
                      <Button
                        key={size.id}
                        variant={selectedSize === size.id ? "default" : "outline"}
                        onClick={() => {
                          setSelectedSize(size.id);
                          setEditingProduct(null);
                          setAddingProduct(false);
                        }}
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
                    <div className="flex items-center justify-between mb-3">
                      <h3>Products:</h3>
                      <Button
                        onClick={() => {
                          setAddingProduct(true);
                          setEditingProduct(null);
                        }}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Product
                      </Button>
                    </div>

                    <div className="space-y-3">
                      {/* Add Product Form */}
                      {addingProduct && (
                        <Card className="p-4 bg-green-50 border-green-200">
                          <div className="space-y-3">
                            <Input
                              placeholder="Product Name"
                              value={productName}
                              onChange={(e) => setProductName(e.target.value)}
                            />
                            <Input
                              type="number"
                              placeholder="Price"
                              value={productPrice}
                              onChange={(e) => setProductPrice(e.target.value)}
                            />
                            <div className="flex gap-2">
                              <Button
                                onClick={handleAddProduct}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={!productName || !productPrice}
                              >
                                <Save className="h-4 w-4 mr-1" />
                                Save
                              </Button>
                              <Button
                                onClick={() => {
                                  setAddingProduct(false);
                                  setProductName("");
                                  setProductPrice("");
                                }}
                                variant="outline"
                                className="flex-1"
                              >
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </Card>
                      )}

                      {/* Product List */}
                      {category.sizes
                        .find((s) => s.id === selectedSize)
                        ?.products.map((product) => (
                          <Card key={product.id} className="p-4">
                            {editingProduct === product.id ? (
                              <div className="space-y-3">
                                <div>
                                  <p className="mb-2">{product.name}</p>
                                  <Input
                                    type="number"
                                    defaultValue={product.price}
                                    placeholder="New Price"
                                    id={`price-${product.id}`}
                                  />
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => {
                                      const input = document.getElementById(
                                        `price-${product.id}`
                                      ) as HTMLInputElement;
                                      handleEditPrice(product.id, input.value);
                                    }}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                                  >
                                    <Save className="h-4 w-4 mr-1" />
                                    Save
                                  </Button>
                                  <Button
                                    onClick={() => setEditingProduct(null)}
                                    variant="outline"
                                    className="flex-1"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-between">
                                <div>
                                  <h4>{product.name}</h4>
                                  <p className="text-gray-600 mt-1">
                                    ₹{product.price.toLocaleString()}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setEditingProduct(product.id);
                                      setAddingProduct(false);
                                    }}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </Card>
                        ))}

                      {category.sizes.find((s) => s.id === selectedSize)
                        ?.products.length === 0 && !addingProduct && (
                        <p className="text-gray-500 text-center py-8">
                          No products in this size. Click "Add Product" to get started.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
