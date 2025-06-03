import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Share, Maximize } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    Chart: any;
  }
}

export default function ChartsSection() {
  const { toast } = useToast();
  const userGrowthRef = useRef<HTMLCanvasElement>(null);
  const revenueRef = useRef<HTMLCanvasElement>(null);

  const { data: userGrowthData } = useQuery({
    queryKey: ["/api/dashboard/chart-data", { type: "user-growth" }],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/chart-data?type=user-growth");
      return response.json();
    },
  });

  const { data: revenueData } = useQuery({
    queryKey: ["/api/dashboard/chart-data", { type: "revenue-by-channel" }],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/chart-data?type=revenue-by-channel");
      return response.json();
    },
  });

  useEffect(() => {
    // Load Chart.js
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/chart.js";
    script.async = true;
    script.onload = () => {
      initializeCharts();
    };
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  useEffect(() => {
    if (window.Chart && userGrowthData && revenueData) {
      initializeCharts();
    }
  }, [userGrowthData, revenueData]);

  const initializeCharts = () => {
    if (!window.Chart || !userGrowthData || !revenueData) return;

    // User Growth Chart
    if (userGrowthRef.current) {
      const ctx = userGrowthRef.current.getContext("2d");
      if (ctx) {
        new window.Chart(ctx, {
          type: "line",
          data: {
            labels: userGrowthData.labels,
            datasets: [
              {
                label: "Users",
                data: userGrowthData.datasets[0].data,
                borderColor: "hsl(217, 91%, 60%)",
                backgroundColor: "hsla(217, 91%, 60%, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "hsl(0, 0%, 88%)",
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }

    // Revenue Chart
    if (revenueRef.current) {
      const ctx = revenueRef.current.getContext("2d");
      if (ctx) {
        new window.Chart(ctx, {
          type: "bar",
          data: {
            labels: revenueData.labels,
            datasets: [
              {
                label: "Revenue",
                data: revenueData.datasets[0].data,
                backgroundColor: [
                  "hsl(217, 91%, 60%)",
                  "hsl(143, 71%, 52%)",
                  "hsl(25, 100%, 59%)",
                  "hsl(45, 93%, 54%)",
                  "hsl(348, 83%, 47%)",
                  "hsl(270, 100%, 62%)",
                ],
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: "hsl(0, 0%, 88%)",
                },
                ticks: {
                  callback: function (value: any) {
                    return "$" + (value / 1000) + "K";
                  },
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }
  };

  const handleAction = (action: string) => {
    toast({
      title: `${action} action`,
      description: `${action} functionality would be implemented here`,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* User Growth Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">User Growth Trend</CardTitle>
              <p className="text-carbon-gray-60 text-sm">Last 12 months</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("Download")}
                className="text-carbon-gray-40 hover:text-carbon-gray-70"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("Share")}
                className="text-carbon-gray-40 hover:text-carbon-gray-70"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("Fullscreen")}
                className="text-carbon-gray-40 hover:text-carbon-gray-70"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={userGrowthRef} />
          </div>
        </CardContent>
      </Card>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">Revenue by Channel</CardTitle>
              <p className="text-carbon-gray-60 text-sm">Current quarter breakdown</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("Download")}
                className="text-carbon-gray-40 hover:text-carbon-gray-70"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("Share")}
                className="text-carbon-gray-40 hover:text-carbon-gray-70"
              >
                <Share className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction("Fullscreen")}
                className="text-carbon-gray-40 hover:text-carbon-gray-70"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <canvas ref={revenueRef} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
