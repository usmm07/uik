import { useQuery } from "@tanstack/react-query";
import { Database, Code, FileSpreadsheet, Plus, ExternalLink } from "lucide-react";
import Header from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import type { Integration } from "@shared/schema";

export default function Integrations() {
  const { toast } = useToast();

  const { data: integrations = [], isLoading } = useQuery<Integration[]>({
    queryKey: ["/api/integrations"],
  });

  const handleConnect = (integration: Integration) => {
    toast({
      title: `Connect to ${integration.name}`,
      description: "Integration setup would open here",
    });
  };

  const handleViewDocumentation = () => {
    toast({
      title: "API Documentation",
      description: "Developer documentation would open here",
    });
  };

  const getIntegrationIcon = (type: string, iconClass: string) => {
    if (iconClass.includes("fa-database")) {
      return <Database className="h-6 w-6 text-white" />;
    } else if (iconClass.includes("fa-google")) {
      return <FileSpreadsheet className="h-6 w-6 text-white" />;
    } else if (iconClass.includes("fa-code")) {
      return <Code className="h-6 w-6 text-white" />;
    }
    return <Database className="h-6 w-6 text-white" />;
  };

  const getGradientClass = (type: string) => {
    switch (type) {
      case "database": return "bg-gradient-to-br from-blue-500 to-blue-600";
      case "api": return "bg-gradient-to-br from-purple-500 to-purple-600";
      case "file": return "bg-gradient-to-br from-red-500 to-red-600";
      default: return "bg-gradient-to-br from-gray-500 to-gray-600";
    }
  };

  return (
    <div className="h-full">
      <Header
        title="Integrations"
        subtitle="Connect your data sources and external services"
        actions={
          <Button
            onClick={handleViewDocumentation}
            variant="outline"
            className="border-carbon-gray-30 text-carbon-gray-70 hover:bg-carbon-gray-10"
          >
            <ExternalLink className="mr-2 h-4 w-4" />
            API Documentation
          </Button>
        }
      />

      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Integrations */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-carbon-gray-100 mb-2">
                Available Integrations
              </h3>
              <p className="text-carbon-gray-60 text-sm mb-6">
                Connect your data sources to start analyzing
              </p>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-carbon-gray-20 rounded-lg"></div>
                          <div>
                            <div className="h-4 bg-carbon-gray-20 rounded w-24 mb-2"></div>
                            <div className="h-3 bg-carbon-gray-20 rounded w-32"></div>
                          </div>
                        </div>
                        <div className="h-8 bg-carbon-gray-20 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <Card key={integration.id} className="hover:bg-carbon-gray-10 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getGradientClass(integration.type)}`}>
                            {getIntegrationIcon(integration.type, integration.icon)}
                          </div>
                          <div>
                            <p className="font-medium text-carbon-gray-100">{integration.name}</p>
                            <p className="text-carbon-gray-60 text-sm">{integration.description}</p>
                          </div>
                        </div>
                        <Button
                          onClick={() => handleConnect(integration)}
                          className="border border-ibm-blue text-ibm-blue hover:bg-ibm-blue hover:text-white transition-colors"
                          variant="outline"
                        >
                          Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sharing & Export */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-carbon-gray-100 mb-2">
                Sharing & Export
              </h3>
              <p className="text-carbon-gray-60 text-sm mb-6">
                Share reports with your team and export data
              </p>
            </div>

            <div className="space-y-6">
              {/* Generate Share Link */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Generate Share Link</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex space-x-3">
                    <select className="flex-1 px-3 py-2 border border-carbon-gray-30 rounded-lg focus:ring-2 focus:ring-ibm-blue focus:border-transparent bg-white">
                      <option>View Only</option>
                      <option>Can Edit</option>
                      <option>Admin Access</option>
                    </select>
                    <Button className="bg-ibm-blue hover:bg-ibm-blue-hover text-white">
                      Generate
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Export Options */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Export Options</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="flex items-center justify-center py-3 border-carbon-gray-30 hover:bg-carbon-gray-10"
                    >
                      <span className="text-red-500 mr-2">📄</span>
                      PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center py-3 border-carbon-gray-30 hover:bg-carbon-gray-10"
                    >
                      <span className="text-green-50 mr-2">📊</span>
                      CSV
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center py-3 border-carbon-gray-30 hover:bg-carbon-gray-10"
                    >
                      <span className="text-blue-500 mr-2">🖼️</span>
                      PNG
                    </Button>
                    <Button
                      variant="outline"
                      className="flex items-center justify-center py-3 border-carbon-gray-30 hover:bg-carbon-gray-10"
                    >
                      <span className="text-purple-500 mr-2">⚡</span>
                      JSON
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Developer API */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Developer API</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-carbon-gray-10 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-carbon-gray-60 text-sm">Endpoint:</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-carbon-gray-40 hover:text-carbon-gray-70"
                        onClick={() => {
                          navigator.clipboard.writeText("https://api.datavizpro.com/v1/dashboard/123abc");
                          toast({ title: "Copied", description: "API endpoint copied to clipboard" });
                        }}
                      >
                        📋
                      </Button>
                    </div>
                    <code className="text-carbon-gray-100 text-sm font-ibm-mono block break-all">
                      https://api.datavizpro.com/v1/dashboard/123abc
                    </code>
                  </div>
                  <Button
                    variant="link"
                    onClick={handleViewDocumentation}
                    className="text-ibm-blue hover:text-ibm-blue-hover p-0"
                  >
                    View API Documentation →
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
