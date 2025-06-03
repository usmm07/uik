import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, BarChart3, LineChart, PieChart, Table2, Share, Edit, Trash2 } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import ChartBuilder from "@/components/visualizations/chart-builder";
import type { Visualization, DataSource } from "@shared/schema";

export default function Visualizations() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: visualizations = [], isLoading } = useQuery<Visualization[]>({
    queryKey: ["/api/visualizations"],
  });

  const { data: dataSources = [] } = useQuery<DataSource[]>({
    queryKey: ["/api/data-sources"],
  });

  const shareMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/visualizations/${id}/share`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/visualizations"] });
      toast({
        title: "Visualization shared",
        description: `Share URL: ${window.location.origin}${data.shareUrl}`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/visualizations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/visualizations"] });
      toast({
        title: "Visualization deleted",
        description: "Visualization has been removed",
      });
    },
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "line": return <LineChart className="h-4 w-4 text-ibm-blue" />;
      case "bar": return <BarChart3 className="h-4 w-4 text-green-50" />;
      case "pie": return <PieChart className="h-4 w-4 text-orange-40" />;
      case "table": return <Table2 className="h-4 w-4 text-yellow-600" />;
      default: return <BarChart3 className="h-4 w-4" />;
    }
  };

  const filteredVisualizations = visualizations.filter(viz =>
    viz.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    viz.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      <Header
        title="Visualizations"
        subtitle="Create and manage your data visualizations"
        actions={
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Search visualizations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-ibm-blue hover:bg-ibm-blue-hover text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  New Visualization
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Visualization</DialogTitle>
                </DialogHeader>
                <ChartBuilder
                  dataSources={dataSources}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  onSuccess={() => {
                    setIsCreateDialogOpen(false);
                    queryClient.invalidateQueries({ queryKey: ["/api/visualizations"] });
                  }}
                />
              </DialogContent>
            </Dialog>
          </div>
        }
      />

      <div className="p-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-carbon-gray-20 rounded w-3/4"></div>
                  <div className="h-3 bg-carbon-gray-20 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-40 bg-carbon-gray-20 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVisualizations.map((visualization) => (
              <Card key={visualization.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(visualization.type)}
                      <CardTitle className="text-lg">{visualization.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => shareMutation.mutate(visualization.id)}
                        disabled={shareMutation.isPending}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteMutation.mutate(visualization.id)}
                        className="text-red-60 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {visualization.description && (
                    <p className="text-sm text-carbon-gray-60">{visualization.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Chart preview area */}
                    <div className="h-40 bg-carbon-gray-10 rounded-lg flex items-center justify-center border border-carbon-gray-20">
                      <div className="text-center">
                        {getTypeIcon(visualization.type)}
                        <p className="text-sm text-carbon-gray-60 mt-2">
                          {visualization.type.charAt(0).toUpperCase() + visualization.type.slice(1)} Chart
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <Badge variant="outline" className="capitalize">
                        {visualization.type}
                      </Badge>
                    </div>
                    
                    {visualization.isShared && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Shared:</span>
                        <Badge className="bg-green-50 text-white">
                          Public
                        </Badge>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm text-carbon-gray-60 font-ibm-mono">
                        {new Date(visualization.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredVisualizations.length === 0 && (
          <div className="text-center py-12">
            <BarChart3 className="mx-auto h-12 w-12 text-carbon-gray-40 mb-4" />
            <h3 className="text-lg font-medium text-carbon-gray-100 mb-2">
              {searchTerm ? "No visualizations found" : "No visualizations yet"}
            </h3>
            <p className="text-carbon-gray-60 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Create your first visualization to get started"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-ibm-blue hover:bg-ibm-blue-hover text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Visualization
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
