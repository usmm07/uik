import { useLocation } from "wouter";
import { Home, ShoppingCart, Clock, User } from "lucide-react";
import { Link } from "wouter";

export default function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    {
      icon: Home,
      label: "Меню",
      path: "/",
      isActive: location === "/",
    },
    {
      icon: ShoppingCart,
      label: "Корзина",
      path: "/cart",
      isActive: location === "/cart",
    },
    {
      icon: Clock,
      label: "Заказы",
      path: "/orders",
      isActive: location === "/orders",
    },
    {
      icon: User,
      label: "Профиль",
      path: "/profile",
      isActive: location === "/profile",
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                item.isActive
                  ? "text-orange-600 bg-orange-50"
                  : "text-gray-600 hover:text-orange-600"
              }`}
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}