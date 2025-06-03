import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Share, Eye, Edit, Trash2, Copy, ExternalLink } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import type { Report, Visualization } from "@shared/schema";

export default function SharedReports() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { data: reports = [], isLoading } = useQuery<Report[]>({
    queryKey: ["/api/reports"],
  });

  const { data: visualizations = [] } = useQuery<Visualization[]>({
    queryKey: ["/api/visualizations"],
  });

  const createMutation = useMutation({
    mutationFn: async (newReport: Partial<Report>) => {
      const response = await apiRequest("POST", "/api/reports", newReport);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Report created",
        description: "New report has been created successfully",
      });
    },
  });

  const shareMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest("POST", `/api/reports/${id}/share`);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      navigator.clipboard.writeText(`${window.location.origin}${data.shareUrl}`);
      toast({
        title: "Report shared",
        description: "Share link copied to clipboard",
      });
    },
  });

  const handleCreateReport = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const selectedVisualizations = formData.getAll("visualizations") as string[];
    
    const newReport = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      visualizationIds: selectedVisualizations.map(id => parseInt(id)),
    };

    createMutation.mutate(newReport);
  };

  const filteredReports = reports.filter(report =>
    report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full">
      <Header
        title="Shared Reports"
        subtitle="Create and manage shareable reports"
        actions={
          <div className="flex items-center space-x-3">
            <Input
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-ibm-blue hover:bg-ibm-blue-hover text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Report
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Report</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateReport} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Report Name</Label>
                    <Input id="name" name="name" placeholder="e.g., Monthly Analytics Report" required />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Brief description of the report" />
                  </div>
                  <div>
                    <Label>Include Visualizations</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-carbon-gray-20 rounded p-3">
                      {visualizations.length === 0 ? (
                        <p className="text-sm text-carbon-gray-60">No visualizations available</p>
                      ) : (
                        visualizations.map((viz) => (
                          <label key={viz.id} className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              name="visualizations"
                              value={viz.id}
                              className="rounded border-carbon-gray-30"
                            />
                            <span className="text-sm">{viz.name}</span>
                          </label>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending}>
                      Create Report
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
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    <div className="flex items-center space-x-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => shareMutation.mutate(report.id)}
                        disabled={shareMutation.isPending}
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" className="text-red-60 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {report.description && (
                    <p className="text-sm text-carbon-gray-60">{report.description}</p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Visualizations:</span>
                      <Badge variant="outline">
                        {report.visualizationIds?.length || 0} charts
                      </Badge>
                    </div>
                    
                    {report.isShared && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status:</span>
                        <div className="flex items-center space-x-2">
                          <Badge className="bg-green-50 text-white">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Shared
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(`${window.location.origin}/shared/report/${report.shareToken}`);
                              toast({ title: "Link copied", description: "Share link copied to clipboard" });
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Created:</span>
                      <span className="text-sm text-carbon-gray-60 font-ibm-mono">
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Updated:</span>
                      <span className="text-sm text-carbon-gray-60 font-ibm-mono">
                        {new Date(report.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredReports.length === 0 && (
          <div className="text-center py-12">
            <Share className="mx-auto h-12 w-12 text-carbon-gray-40 mb-4" />
            <h3 className="text-lg font-medium text-carbon-gray-100 mb-2">
              {searchTerm ? "No reports found" : "No reports yet"}
            </h3>
            <p className="text-carbon-gray-60 mb-4">
              {searchTerm
                ? "Try adjusting your search criteria"
                : "Create your first report to share insights with your team"}
            </p>
            {!searchTerm && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-ibm-blue hover:bg-ibm-blue-hover text-white"
                disabled={visualizations.length === 0}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Report
              </Button>
            )}
            {!searchTerm && visualizations.length === 0 && (
              <p className="text-sm text-carbon-gray-60 mt-2">
                Create some visualizations first to build reports
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
