import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Menu from "./pages/menu";
import Cart from "./pages/cart";
import Orders from "./pages/orders";
import Profile from "./pages/profile";
import NotFound from "./pages/not-found";
import BottomNav from "./components/layout/bottom-nav";
import { useEffect } from "react";
import WebApp from "@twa-dev/sdk";

function useTelegramIntegration() {
  useEffect(() => {
    WebApp.ready();

    WebApp.MainButton.setParams({
      text: "Оформить заказ",
      is_visible: true
    });

    WebApp.MainButton.onClick(() => {
      // Здесь можно подставить реальные данные заказа
      const order = {
        items: [
          { name: "Плов", quantity: 2, price: 45000 },
          { name: "Айран", quantity: 1, price: 12000 }
        ],
        total: 102000
      };

      WebApp.sendData(JSON.stringify(order));
    });

    return () => {
      WebApp.MainButton.offClick();
    };
  }, []);
}

function Router() {
  useTelegramIntegration();

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="max-w-md mx-auto bg-white min-h-screen">
        <Switch>
          <Route path="/" component={Menu} />
          <Route path="/cart" component={Cart} />
          <Route path="/orders" component={Orders} />
          <Route path="/profile" component={Profile} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNav />
    </div>
  );
}

function App() {
  useTelegramIntegration();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

