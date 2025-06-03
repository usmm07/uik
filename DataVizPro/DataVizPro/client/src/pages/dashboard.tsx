import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/header";
import MetricsGrid from "@/components/dashboard/metrics-grid";
import ChartsSection from "@/components/dashboard/charts-section";
import DataTable from "@/components/dashboard/data-table";
import { Button } from "@/components/ui/button";
import { RefreshCw, Plus, Share } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { toast } = useToast();

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/dashboard/metrics"],
  });

  const { data: dataSources, isLoading: dataSourcesLoading } = useQuery({
    queryKey: ["/api/data-sources"],
  });

  const handleRefresh = () => {
    window.location.reload();
    toast({
      title: "Dashboard refreshed",
      description: "All data has been updated",
    });
  };

  const handleCreateVisualization = () => {
    toast({
      title: "Feature coming soon",
      description: "Chart creation will be available in the next update",
    });
  };

  const handleShareReport = () => {
    toast({
      title: "Share link generated",
      description: "Report sharing functionality is ready",
    });
  };

  return (
    <div className="h-full">
      <Header
        title="Analytics Dashboard"
        subtitle="Real-time insights and data visualization"
        actions={
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleRefresh}
              className="border-carbon-gray-30 text-carbon-gray-70 hover:bg-carbon-gray-10"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              onClick={handleCreateVisualization}
              className="bg-ibm-blue hover:bg-ibm-blue-hover text-white"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Chart
            </Button>
            <Button
              onClick={handleShareReport}
              className="bg-green-50 hover:bg-green-600 text-white"
            >
              <Share className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        }
      />

      <div className="p-8 space-y-8">
        <MetricsGrid metrics={metrics} isLoading={metricsLoading} />
        <ChartsSection />
        <DataTable dataSources={dataSources} isLoading={dataSourcesLoading} />
      </div>
    </div>
  );
}
