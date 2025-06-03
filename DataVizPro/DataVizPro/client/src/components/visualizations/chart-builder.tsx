import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { DataSource } from "@shared/schema";

interface ChartBuilderProps {
  dataSources: DataSource[];
  onCancel: () => void;
  onSuccess: () => void;
}

export default function ChartBuilder({ dataSources, onCancel, onSuccess }: ChartBuilderProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "",
    dataSourceId: "",
  });

  const createMutation = useMutation({
    mutationFn: async (visualization: any) => {
      const response = await apiRequest("POST", "/api/visualizations", visualization);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Visualization created",
        description: "Your visualization has been created successfully",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create visualization",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!formData.name || !formData.type || !formData.dataSourceId) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Generate sample config based on chart type
    const config = {
      chartType: formData.type,
      data: generateSampleData(formData.type),
      options: getDefaultOptions(formData.type),
    };

    createMutation.mutate({
      name: formData.name,
      description: formData.description,
      type: formData.type,
      dataSourceId: parseInt(formData.dataSourceId),
      config,
    });
  };

  const generateSampleData = (type: string) => {
    switch (type) {
      case "line":
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          datasets: [{
            label: "Sample Data",
            data: [12, 19, 3, 5, 2, 3],
          }],
        };
      case "bar":
        return {
          labels: ["Category A", "Category B", "Category C", "Category D"],
          datasets: [{
            label: "Sample Data",
            data: [12, 19, 3, 5],
          }],
        };
      case "pie":
        return {
          labels: ["Red", "Blue", "Yellow", "Green"],
          datasets: [{
            data: [12, 19, 3, 5],
          }],
        };
      default:
        return {};
    }
  };

  const getDefaultOptions = (type: string) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: type !== "line",
        },
      },
    };
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Visualization Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Monthly Sales Chart"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of the visualization"
            />
          </div>

          <div>
            <Label htmlFor="type">Chart Type *</Label>
            <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select chart type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="table">Data Table</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="dataSource">Data Source *</Label>
            <Select value={formData.dataSourceId} onValueChange={(value) => setFormData(prev => ({ ...prev, dataSourceId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select data source" />
              </SelectTrigger>
              <SelectContent>
                {dataSources.map((source) => (
                  <SelectItem key={source.id} value={source.id.toString()}>
                    {source.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-48 bg-carbon-gray-10 rounded-lg flex items-center justify-center border border-carbon-gray-20">
                <div className="text-center">
                  <p className="text-carbon-gray-60 text-sm">
                    {formData.type ? `${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Chart Preview` : "Select chart type to see preview"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-carbon-gray-20">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={createMutation.isPending}
          className="bg-ibm-blue hover:bg-ibm-blue-hover text-white"
        >
          {createMutation.isPending ? "Creating..." : "Create Visualization"}
        </Button>
      </div>
    </form>
  );
}
