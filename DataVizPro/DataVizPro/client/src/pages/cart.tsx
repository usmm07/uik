import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Cart, MenuItem } from "@shared/schema";

// Utility function to format Uzbek som
const formatPrice = (price: string) => {
  const numPrice = parseInt(price);
  return `${numPrice.toLocaleString('ru-RU')} сум`;
};

export default function CartPage() {
  const { toast } = useToast();
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("delivery");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  
  const userId = 1; // Using default user for now

  const { data: cartItems = [], isLoading } = useQuery<(Cart & { menuItem: MenuItem })[]>({
    queryKey: ["/api/cart", userId],
    queryFn: async () => {
      const response = await fetch(`/api/cart/${userId}`);
      return response.json();
    },
  });

  const updateCartMutation = useMutation({
    mutationFn: async (data: { id: number; quantity: number }) => {
      const response = await apiRequest("PUT", `/api/cart/${data.id}`, {
        quantity: data.quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/cart/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest("POST", "/api/orders", orderData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
      queryClient.invalidateQueries({ queryKey: ["/api/orders", userId] });
      toast({
        title: "Order placed successfully!",
        description: "Your order has been confirmed and is being prepared",
      });
      // Reset form
      setDeliveryAddress("");
      setNotes("");
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCartMutation.mutate(id);
    } else {
      updateCartMutation.mutate({ id, quantity });
    }
  };

  const totalAmount = cartItems.reduce((total, item) => {
    return total + (parseFloat(item.menuItem.price) * item.quantity);
  }, 0);

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      toast({
        title: "Корзина пуста",
        description: "Добавьте блюда в корзину перед оформлением заказа",
        variant: "destructive",
      });
      return;
    }

    if (deliveryType === "delivery" && !deliveryAddress.trim()) {
      toast({
        title: "Не указан адрес",
        description: "Пожалуйста, укажите адрес доставки",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate({
      userId,
      cartItems,
      deliveryAddress: deliveryType === "delivery" ? deliveryAddress : null,
      deliveryType,
      paymentMethod,
      notes: notes.trim() || null,
    });
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
        <div className="restaurant-gradient p-6 rounded-xl shadow-restaurant">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center">
                <ShoppingBag className="mr-3 h-8 w-8" />
                Корзина
              </h1>
              <p className="text-white/90 text-sm mt-1">Tashkent Restaurant</p>
            </div>
            <div className="text-4xl">🛒</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Корзина пуста</h3>
            <p className="text-gray-600">Добавьте вкусные блюда для начала!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="restaurant-card">
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={item.menuItem.image || ""}
                            alt={item.menuItem.name}
                            className="w-16 h-16 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                          <div className="hidden w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center text-lg">
                            🍽️
                          </div>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.menuItem.name}</h3>
                          <p className="text-sm text-gray-600">{formatPrice(item.menuItem.price)} за шт.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={updateCartMutation.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        
                        <span className="font-medium min-w-[32px] text-center text-lg">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={updateCartMutation.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => removeFromCartMutation.mutate(item.id)}
                          disabled={removeFromCartMutation.isPending}
                          className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="restaurant-card">
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-4">Детали заказа</h3>
                <div className="space-y-4">
                  {/* Delivery Type */}
                  <div>
                    <Label htmlFor="deliveryType" className="text-sm font-medium text-gray-700">Тип доставки</Label>
                    <Select value={deliveryType} onValueChange={setDeliveryType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delivery">Доставка</SelectItem>
                        <SelectItem value="pickup">Самовывоз</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Delivery Address */}
                  {deliveryType === "delivery" && (
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">Адрес доставки</Label>
                      <Input
                        id="address"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        placeholder="Введите адрес доставки"
                        className="mt-1"
                      />
                    </div>
                  )}

                  {/* Payment Method */}
                  <div>
                    <Label htmlFor="payment" className="text-sm font-medium text-gray-700">Способ оплаты</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Наличные</SelectItem>
                        <SelectItem value="card">Карта</SelectItem>
                        <SelectItem value="telegram_wallet">Telegram Wallet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-sm font-medium text-gray-700">Комментарий к заказу</Label>
                    <Textarea
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Укажите особые пожелания..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="restaurant-card">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm text-gray-600">Итого:</span>
                    <div className="text-2xl font-bold text-restaurant-orange">
                      {formatPrice(totalAmount.toString())}
                    </div>
                  </div>
                  <Button
                    onClick={handlePlaceOrder}
                    disabled={createOrderMutation.isPending}
                    className="restaurant-button-primary px-8 py-3 text-lg"
                  >
                    {createOrderMutation.isPending ? "Оформление..." : "Оформить заказ"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}