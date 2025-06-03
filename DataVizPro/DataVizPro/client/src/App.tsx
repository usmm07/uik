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

function Router() {
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
