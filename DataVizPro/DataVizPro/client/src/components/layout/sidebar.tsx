import { Link, useLocation } from "wouter";
import { BarChart3, Database, Share, Plug, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: BarChart3 },
  { name: "Data Sources", href: "/data-sources", icon: Database },
  { name: "Visualizations", href: "/visualizations", icon: BarChart3 },
  { name: "Shared Reports", href: "/shared-reports", icon: Share },
  { name: "Integrations", href: "/integrations", icon: Plug },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <aside className="bg-carbon-gray-100 w-64 flex-shrink-0 border-r border-carbon-gray-80">
      <div className="p-6">
        <div className="flex items-center mb-8">
          <div className="bg-ibm-blue p-2 rounded-lg mr-3">
            <BarChart3 className="text-white h-6 w-6" />
          </div>
          <div>
            <h1 className="text-white text-xl font-semibold">DataViz Pro</h1>
            <p className="text-carbon-gray-40 text-sm">Analytics Platform</p>
          </div>
        </div>
        
        <nav className="space-y-2">
          {navigation.map((item) => {
            const isActive = location === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start px-4 py-3 transition-colors ${
                    isActive
                      ? "bg-ibm-blue text-white hover:bg-ibm-blue-hover"
                      : "text-carbon-gray-40 hover:text-white hover:bg-carbon-gray-90"
                  }`}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              </Link>
            );
          })}
        </nav>
        
        <div className="mt-8 pt-8 border-t border-carbon-gray-80">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-carbon-gray-70 rounded-full flex items-center justify-center mr-3">
              <User className="h-4 w-4 text-carbon-gray-30" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">Sarah Chen</p>
              <p className="text-carbon-gray-40 text-xs">Data Analyst</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
