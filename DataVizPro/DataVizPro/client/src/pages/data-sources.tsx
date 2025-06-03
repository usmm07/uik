import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Database, Cloud, FileText, Edit, Trash2, RefreshCw } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { DataSource } from "@shared/schema";

export default function DataSources() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: dataSources = [], isLoading } = useQuery<DataSource[]>({
    queryKey: ["/api/data-sources"],
  });

  const createMutation = useMutation({
    mutationFn: async (newDataSource: Partial<DataSource>) => {
      const response = await apiRequest("POST", "/api/data-sources", newDataSource);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/data-sources"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Data source created",
        description: "New data source has been added successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create data source",
        variant: "destructive",
      });
    },
  });

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

  const handleCreateDataSource = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const newDataSource = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      type: formData.get("type") as string,
      status: "disconnected",
      connectionConfig: {},
    };

    createMutation.mutate(newDataSource);
  };

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

  const filteredDataSources = dataSources.filter(ds =>
    ds.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ds.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      <Header
        title="Data Sources"
        subtitle="Manage your connected databases and APIs"
        actions={
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Search sources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-ibm-blue hover:bg-ibm-blue-hover text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Source
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add Data Source</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateDataSource} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Production Database" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Brief description of the data source" />
                  </div>
                  <div>
                    <Label htmlFor="type">Type</Label>
                    <Select name="type" required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="database">Database</SelectItem>
                        <SelectItem value="api">API</SelectItem>
                        <SelectItem value="file">File</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      Create
                    </Button>
                  </div>
                </form>
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
                  <div className="space-y-2">
                    <div className="h-3 bg-carbon-gray-20 rounded"></div>
                    <div className="h-3 bg-carbon-gray-20 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDataSources.map((dataSource) => (
              <Card key={dataSource.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(dataSource.type)}
                      <CardTitle className="text-lg">{dataSource.name}</CardTitle>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => syncMutation.mutate(dataSource.id)}
                        disabled={syncMutation.isPending}
                      >
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
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
                  </div>
                  {dataSource.description && (
                    <p className="text-sm text-carbon-gray-60">{dataSource.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Status:</span>
                      <div className={`flex items-center ${getStatusColor(dataSource.status)}`}>
                        <span className="w-2 h-2 rounded-full bg-current mr-2"></span>
                        <span className="text-sm font-medium capitalize">{dataSource.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Type:</span>
                      <Badge variant="outline" className="capitalize">
                        {dataSource.type}
                      </Badge>
                    </div>
                    {dataSource.lastSync && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Last Sync:</span>
                        <span className="text-sm text-carbon-gray-60 font-ibm-mono">
                          {new Date(dataSource.lastSync).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Records:</span>
                      <span className="text-sm text-carbon-gray-100 font-ibm-mono">
                        {dataSource.recordCount?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredDataSources.length === 0 && (
          <div className="text-center py-12">
            <Database className="mx-auto h-12 w-12 text-carbon-gray-40 mb-4" />
            <h3 className="text-lg font-medium text-carbon-gray-100 mb-2">
              {searchTerm ? "No data sources found" : "No data sources yet"}
            </h3>
            <p className="text-carbon-gray-60 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Get started by connecting your first data source"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-ibm-blue hover:bg-ibm-blue-hover text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Data Source
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
