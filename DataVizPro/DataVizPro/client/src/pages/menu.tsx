import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Minus, ShoppingCart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Category, MenuItem } from "@shared/schema";

// Utility function to format Uzbek som
const formatPrice = (price: string) => {
  const numPrice = parseInt(price);
  return `${numPrice.toLocaleString('ru-RU')} сум`;
};

export default function Menu() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState<Record<number, number>>({});
  
  const userId = 1; // Using default user for now

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: menuItems = [], isLoading: menuItemsLoading } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items", selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/menu-items?categoryId=${selectedCategory}`
        : "/api/menu-items";
      const response = await fetch(url);
      return response.json();
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async (data: { itemId: number; quantity: number }) => {
      const response = await apiRequest("POST", "/api/cart", {
        userId,
        itemId: data.itemId,
        quantity: data.quantity,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Добавлено в корзину",
        description: "Блюдо добавлено в вашу корзину",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/cart", userId] });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось добавить блюдо в корзину",
        variant: "destructive",
      });
    },
  });

  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateQuantity = (itemId: number, delta: number) => {
    setCartItems(prev => {
      const current = prev[itemId] || 0;
      const newQuantity = Math.max(0, current + delta);
      if (newQuantity === 0) {
        const { [itemId]: removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: newQuantity };
    });
  };

  const addToCart = (itemId: number) => {
    const quantity = cartItems[itemId] || 1;
    addToCartMutation.mutate({ itemId, quantity });
    setCartItems(prev => ({ ...prev, [itemId]: 0 }));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-gray-200 p-4 z-10 shadow-sm">
        <div className="restaurant-gradient p-6 rounded-xl mb-4 shadow-restaurant">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">Tashkent Restaurant</h1>
              <p className="text-white/90 text-sm">Аутентичная узбекская и международная кухня</p>
            </div>
            <div className="text-4xl">🏛️</div>
          </div>
        </div>
        
        {/* Search */}
        <Input
          placeholder="Поиск блюд..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 h-12 text-base"
        />
        
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            onClick={() => setSelectedCategory(null)}
            className="whitespace-nowrap restaurant-button-primary"
          >
            Все
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`whitespace-nowrap ${selectedCategory === category.id ? 'restaurant-button-primary' : ''}`}
            >
              {category.image} {category.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 overflow-auto p-4">
        {menuItemsLoading ? (
          <div className="grid gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="restaurant-card animate-pulse">
                <div className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gray-200 rounded-xl"></div>
                    <div className="flex-1">
                      <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredMenuItems.map((item) => (
              <div key={item.id} className="restaurant-card overflow-hidden">
                <div className="p-4">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <img
                        src={item.image || ""}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                      <div className="hidden w-20 h-20 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="font-semibold text-gray-900 text-lg leading-tight">{item.name}</h3>
                          {item.description && (
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                          )}
                          
                          {/* Preparation time */}
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            <span>{item.preparationTime} мин</span>
                          </div>
                          
                          {/* Tags */}
                          {item.tags && item.tags.length > 0 && (
                            <div className="flex gap-1 mt-2 flex-wrap">
                              {item.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="restaurant-badge">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-lg font-bold text-restaurant-orange">
                              {formatPrice(item.price)}
                            </span>
                            
                            <div className="flex items-center space-x-2">
                              {cartItems[item.id] > 0 && (
                                <>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateQuantity(item.id, -1)}
                                    className="h-8 w-8 p-0"
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <span className="font-medium min-w-[24px] text-center text-lg">
                                    {cartItems[item.id]}
                                  </span>
                                </>
                              )}
                              
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateQuantity(item.id, 1)}
                                className="h-8 w-8 p-0"
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                              
                              {cartItems[item.id] > 0 && (
                                <Button
                                  size="sm"
                                  onClick={() => addToCart(item.id)}
                                  disabled={addToCartMutation.isPending}
                                  className="restaurant-button-primary h-8 px-3"
                                >
                                  <ShoppingCart className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!menuItemsLoading && filteredMenuItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
              🍽️
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Блюда не найдены</h3>
            <p className="text-gray-600">
              {searchTerm ? "Попробуйте изменить поисковый запрос" : "Нет доступных блюд"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}