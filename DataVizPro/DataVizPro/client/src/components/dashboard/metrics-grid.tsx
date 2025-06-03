import { Users, DollarSign, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricsGridProps {
  metrics?: {
    activeUsers: { value: number; change: number; trend: string };
    revenue: { value: number; change: number; trend: string };
    conversionRate: { value: number; change: number; trend: string };
    avgLoadTime: { value: number; change: number; trend: string };
  };
  isLoading?: boolean;
}

export default function MetricsGrid({ metrics, isLoading }: MetricsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-carbon-gray-20 rounded-lg"></div>
                <div className="w-16 h-4 bg-carbon-gray-20 rounded"></div>
              </div>
              <div className="w-20 h-8 bg-carbon-gray-20 rounded mb-2"></div>
              <div className="w-24 h-4 bg-carbon-gray-20 rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!metrics) return null;

  const metricsData = [
    {
      label: "Active Users",
      value: metrics.activeUsers.value.toLocaleString(),
      change: metrics.activeUsers.change,
      icon: Users,
      iconBg: "bg-ibm-blue bg-opacity-10",
      iconColor: "text-ibm-blue",
    },
    {
      label: "Revenue",
      value: `$${(metrics.revenue.value / 1000).toFixed(0)}K`,
      change: metrics.revenue.change,
      icon: DollarSign,
      iconBg: "bg-green-50 bg-opacity-10",
      iconColor: "text-green-50",
    },
    {
      label: "Conversion Rate",
      value: `${metrics.conversionRate.value}%`,
      change: metrics.conversionRate.change,
      icon: TrendingUp,
      iconBg: "bg-orange-40 bg-opacity-10",
      iconColor: "text-orange-40",
    },
    {
      label: "Avg Load Time",
      value: `${metrics.avgLoadTime.value}s`,
      change: metrics.avgLoadTime.change,
      icon: Clock,
      iconBg: "bg-yellow-30 bg-opacity-10",
      iconColor: "text-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric) => {
        const Icon = metric.icon;
        const isPositive = metric.change > 0;
        
        return (
          <Card key={metric.label} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${metric.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`${metric.iconColor} h-6 w-6`} />
                </div>
                <span className={`text-sm font-medium ${
                  isPositive ? "text-green-50" : "text-red-60"
                }`}>
                  {isPositive ? "+" : ""}{metric.change}%
                </span>
              </div>
              <h3 className="text-2xl font-semibold text-carbon-gray-100 mb-1">
                {metric.value}
              </h3>
              <p className="text-carbon-gray-60 text-sm">{metric.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
