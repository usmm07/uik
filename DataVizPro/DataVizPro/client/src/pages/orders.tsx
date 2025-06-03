import { useQuery } from "@tanstack/react-query";
import { Clock, CheckCircle, Truck, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Order, OrderItem, MenuItem } from "@shared/schema";

// Utility function to format Uzbek som
const formatPrice = (price: string) => {
  const numPrice = parseInt(price);
  return `${numPrice.toLocaleString('ru-RU')} сум`;
};

export default function Orders() {
  const userId = 1; // Using default user for now

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders", userId],
    queryFn: async () => {
      const response = await fetch(`/api/orders/${userId}`);
      return response.json();
    },
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "preparing":
        return <Package className="h-4 w-4 text-orange-600" />;
      case "ready":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "delivered":
        return <Truck className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Ожидает";
      case "confirmed":
        return "Подтвержден";
      case "preparing":
        return "Готовится";
      case "ready":
        return "Готов";
      case "delivered":
        return "Доставлен";
      case "cancelled":
        return "Отменен";
      default:
        return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "confirmed":
        return "status-confirmed";
      case "preparing":
        return "status-preparing";
      case "ready":
        return "status-ready";
      case "delivered":
        return "status-delivered";
      case "cancelled":
        return "status-cancelled";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
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
                <Clock className="mr-3 h-8 w-8" />
                Мои заказы
              </h1>
              <p className="text-white/90 text-sm mt-1">Tashkent Restaurant</p>
            </div>
            <div className="text-4xl">📋</div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 overflow-auto p-4">
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-orange-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Заказов пока нет</h3>
            <p className="text-gray-600">Сделайте первый заказ, чтобы увидеть его здесь!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="restaurant-card">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Заказ №{order.id}</h3>
                    <span className={`restaurant-badge ${getStatusColor(order.status)}`}>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(order.status)}
                        <span>{getStatusText(order.status)}</span>
                      </div>
                    </span>
                  </div>
                  
                  <div className="space-y-3">
                    {/* Order Info */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Сумма заказа:</span>
                        <div className="text-lg font-semibold text-restaurant-orange">
                          {formatPrice(order.totalAmount)}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Дата заказа:</span>
                        <div>{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Тип доставки:</span>
                        <div>{order.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}</div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Оплата:</span>
                        <div>
                          {order.paymentMethod === 'cash' ? 'Наличные' : 
                           order.paymentMethod === 'card' ? 'Карта' : 
                           order.paymentMethod === 'telegram_wallet' ? 'Telegram Wallet' : 
                           order.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {/* Delivery Address */}
                    {order.deliveryAddress && (
                      <div>
                        <span className="font-medium text-gray-700">Адрес доставки:</span>
                        <div className="text-sm text-gray-600 mt-1">{order.deliveryAddress}</div>
                      </div>
                    )}

                    {/* Estimated Delivery Time */}
                    {order.estimatedDeliveryTime && (
                      <div>
                        <span className="font-medium text-gray-700">Ожидаемое время доставки:</span>
                        <div className="text-sm text-gray-600 mt-1">
                          {new Date(order.estimatedDeliveryTime).toLocaleString('ru-RU')}
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    {order.notes && (
                      <div>
                        <span className="font-medium text-gray-700">Комментарий:</span>
                        <div className="text-sm text-gray-600 mt-1">{order.notes}</div>
                      </div>
                    )}

                    {/* Order Status Timeline */}
                    <div className="border-t pt-3 mt-4">
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Заказан: {new Date(order.createdAt).toLocaleTimeString('ru-RU')}</span>
                        <span>Обновлен: {new Date(order.updatedAt).toLocaleTimeString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}