import { useMutation } from "@tanstack/react-query";
import { Database, Cloud, FileText, Edit, RefreshCw, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { DataSource } from "@shared/schema";

interface DataTableProps {
  dataSources?: DataSource[];
  isLoading?: boolean;
}

export default function DataTable({ dataSources = [], isLoading }: DataTableProps) {
  const { toast } = useToast();

  const syncMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/data-sources/${id}/sync`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-sources"] });
      toast({
        title: "Sync completed",
        description: "Data source has been synchronized",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/data-sources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-sources"] });
      toast({
        title: "Data source deleted",
        description: "Data source has been removed",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "text-green-50";
      case "pending": return "text-yellow-600";
      case "error": return "text-red-60";
      default: return "text-carbon-gray-60";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "database": return <Database className="h-4 w-4 text-ibm-blue" />;
      case "api": return <Cloud className="h-4 w-4 text-orange-40" />;
      case "file": return <FileText className="h-4 w-4 text-yellow-600" />;
      default: return <Database className="h-4 w-4" />;
    }
  };

  const handleAddDataSource = () => {
    toast({
      title: "Add Data Source",
      description: "This would open the data source creation form",
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Recent Data Sources</CardTitle>
            <p className="text-carbon-gray-60 text-sm">Connected databases and APIs</p>
          </div>
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Search sources..."
              className="w-64"
            />
            <Button
              onClick={handleAddDataSource}
              className="bg-ibm-blue hover:bg-ibm-blue-hover text-white"
            >
              Add Source
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border border-carbon-gray-20 rounded-lg">
                <div className="w-8 h-8 bg-carbon-gray-20 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-carbon-gray-20 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-carbon-gray-20 rounded w-1/3"></div>
                </div>
                <div className="w-20 h-4 bg-carbon-gray-20 rounded"></div>
                <div className="w-16 h-4 bg-carbon-gray-20 rounded"></div>
                <div className="w-20 h-4 bg-carbon-gray-20 rounded"></div>
                <div className="flex space-x-2">
                  <div className="w-8 h-8 bg-carbon-gray-20 rounded"></div>
                  <div className="w-8 h-8 bg-carbon-gray-20 rounded"></div>
                  <div className="w-8 h-8 bg-carbon-gray-20 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-carbon-gray-10">
                <tr>
                  <th className="text-left px-6 py-4 text-carbon-gray-70 font-medium text-sm">Source</th>
                  <th className="text-left px-6 py-4 text-carbon-gray-70 font-medium text-sm">Type</th>
                  <th className="text-left px-6 py-4 text-carbon-gray-70 font-medium text-sm">Status</th>
                  <th className="text-left px-6 py-4 text-carbon-gray-70 font-medium text-sm">Last Sync</th>
                  <th className="text-left px-6 py-4 text-carbon-gray-70 font-medium text-sm">Records</th>
                  <th className="text-left px-6 py-4 text-carbon-gray-70 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-carbon-gray-20">
                {dataSources.map((dataSource) => (
                  <tr key={dataSource.id} className="hover:bg-carbon-gray-10 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-ibm-blue bg-opacity-10 rounded-lg flex items-center justify-center mr-3">
                          {getTypeIcon(dataSource.type)}
                        </div>
                        <div>
                          <p className="font-medium text-carbon-gray-100">{dataSource.name}</p>
                          {dataSource.description && (
                            <p className="text-carbon-gray-60 text-sm">{dataSource.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="capitalize">
                        {dataSource.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className={`flex items-center ${getStatusColor(dataSource.status)}`}>
                        <span className="w-2 h-2 bg-current rounded-full mr-2"></span>
                        <span className="text-sm font-medium capitalize">{dataSource.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-carbon-gray-60 text-sm font-ibm-mono">
                      {dataSource.lastSync
                        ? new Date(dataSource.lastSync).toLocaleString()
                        : "Never"
                      }
                    </td>
                    <td className="px-6 py-4 text-carbon-gray-100 font-ibm-mono">
                      {dataSource.recordCount?.toLocaleString() || "0"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-ibm-blue hover:text-ibm-blue-hover"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => syncMutation.mutate(dataSource.id)}
                          disabled={syncMutation.isPending}
                          className="text-carbon-gray-40 hover:text-carbon-gray-70"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteMutation.mutate(dataSource.id)}
                          className="text-red-60 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading && dataSources.length === 0 && (
          <div className="text-center py-8">
            <Database className="mx-auto h-12 w-12 text-carbon-gray-40 mb-4" />
            <h3 className="text-lg font-medium text-carbon-gray-100 mb-2">No data sources</h3>
            <p className="text-carbon-gray-60 mb-4">Get started by connecting your first data source</p>
            <Button
              onClick={handleAddDataSource}
              className="bg-ibm-blue hover:bg-ibm-blue-hover text-white"
            >
              Add Data Source
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
