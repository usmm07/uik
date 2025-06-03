import type { Visualization } from "@shared/schema";

export interface ChartData {
  labels: string[];
  datasets: {
    label?: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string;
    borderWidth?: number;
    tension?: number;
    fill?: boolean;
  }[];
}

export interface ChartOptions {
  responsive: boolean;
  maintainAspectRatio: boolean;
  plugins?: {
    legend?: {
      display: boolean;
      position?: string;
    };
    tooltip?: {
      enabled: boolean;
    };
  };
  scales?: {
    x?: {
      grid?: {
        display: boolean;
        color?: string;
      };
    };
    y?: {
      beginAtZero: boolean;
      grid?: {
        display: boolean;
        color?: string;
      };
      ticks?: {
        callback?: (value: any) => string;
      };
    };
  };
}

// Carbon Design System color palette
export const CARBON_COLORS = {
  primary: "hsl(217, 91%, 60%)", // #0f62fe
  green: "hsl(143, 71%, 52%)", // #42be65
  orange: "hsl(25, 100%, 59%)", // #ff832b
  yellow: "hsl(45, 93%, 54%)", // #f1c21b
  red: "hsl(348, 83%, 47%)", // #da1e28
  purple: "hsl(270, 100%, 62%)", // #8a3ffc
  teal: "hsl(178, 100%, 40%)", // #00a6a6
  cyan: "hsl(195, 100%, 50%)", // #0099cc
};

export const CHART_COLOR_PALETTE = [
  CARBON_COLORS.primary,
  CARBON_COLORS.green,
  CARBON_COLORS.orange,
  CARBON_COLORS.yellow,
  CARBON_COLORS.red,
  CARBON_COLORS.purple,
  CARBON_COLORS.teal,
  CARBON_COLORS.cyan,
];

/**
 * Generate default chart options based on chart type
 */
export function getDefaultChartOptions(type: string): ChartOptions {
  const baseOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: type !== "line",
        position: "top",
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  if (type === "line" || type === "bar") {
    baseOptions.scales = {
      x: {
        grid: {
          display: type === "line" ? false : true,
          color: "hsl(0, 0%, 88%)",
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          display: true,
          color: "hsl(0, 0%, 88%)",
        },
      },
    };
  }

  return baseOptions;
}

/**
 * Generate sample data for different chart types
 */
export function generateSampleChartData(type: string): ChartData {
  switch (type) {
    case "line":
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [
          {
            label: "Data Series",
            data: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100) + 20),
            borderColor: CARBON_COLORS.primary,
            backgroundColor: CARBON_COLORS.primary + "20",
            tension: 0.4,
            fill: true,
          },
        ],
      };

    case "bar":
      return {
        labels: ["Category A", "Category B", "Category C", "Category D", "Category E", "Category F"],
        datasets: [
          {
            label: "Values",
            data: Array.from({ length: 6 }, () => Math.floor(Math.random() * 100) + 10),
            backgroundColor: CHART_COLOR_PALETTE.slice(0, 6),
            borderWidth: 0,
          },
        ],
      };

    case "pie":
      return {
        labels: ["Segment 1", "Segment 2", "Segment 3", "Segment 4", "Segment 5"],
        datasets: [
          {
            data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 50) + 10),
            backgroundColor: CHART_COLOR_PALETTE.slice(0, 5),
            borderWidth: 2,
          },
        ],
      };

    default:
      return {
        labels: [],
        datasets: [],
      };
  }
}

/**
 * Format numbers for display in charts
 */
export function formatChartValue(value: number, type: "currency" | "percentage" | "number" = "number"): string {
  switch (type) {
    case "currency":
      if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
      }
      return `$${value.toLocaleString()}`;

    case "percentage":
      return `${value.toFixed(1)}%`;

    case "number":
      if (value >= 1000000) {
        return `${(value / 1000000).toFixed(1)}M`;
      } else if (value >= 1000) {
        return `${(value / 1000).toFixed(0)}K`;
      }
      return value.toLocaleString();

    default:
      return value.toString();
  }
}

/**
 * Convert visualization config to Chart.js format
 */
export function convertVisualizationToChartConfig(visualization: Visualization) {
  const config = visualization.config as any;
  
  if (!config || !config.data) {
    return {
      type: visualization.type,
      data: generateSampleChartData(visualization.type),
      options: getDefaultChartOptions(visualization.type),
    };
  }

  return {
    type: visualization.type,
    data: config.data,
    options: {
      ...getDefaultChartOptions(visualization.type),
      ...config.options,
    },
  };
}

/**
 * Export chart data to different formats
 */
export function exportChartData(data: ChartData, format: "csv" | "json"): string {
  if (format === "csv") {
    const headers = ["Label", ...data.datasets.map(d => d.label || "Dataset")];
    const rows = data.labels.map((label, index) => [
      label,
      ...data.datasets.map(d => d.data[index] || 0),
    ]);
    
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }

  if (format === "json") {
    return JSON.stringify(data, null, 2);
  }

  return "";
}

/**
 * Generate shareable chart URL
 */
export function generateShareableChartUrl(visualizationId: number, shareToken?: string): string {
  const baseUrl = window.location.origin;
  if (shareToken) {
    return `${baseUrl}/shared/visualization/${shareToken}`;
  }
  return `${baseUrl}/visualizations/${visualizationId}`;
}

/**
 * Validate chart data structure
 */
export function validateChartData(data: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data) {
    errors.push("Chart data is required");
    return { isValid: false, errors };
  }

  if (!data.labels || !Array.isArray(data.labels)) {
    errors.push("Chart labels must be an array");
  }

  if (!data.datasets || !Array.isArray(data.datasets)) {
    errors.push("Chart datasets must be an array");
  } else {
    data.datasets.forEach((dataset: any, index: number) => {
      if (!dataset.data || !Array.isArray(dataset.data)) {
        errors.push(`Dataset ${index + 1} must have a data array`);
      } else if (data.labels && dataset.data.length !== data.labels.length) {
        errors.push(`Dataset ${index + 1} data length must match labels length`);
      }
    });
  }

  return { isValid: errors.length === 0, errors };
}

/**
 * Create chart download functionality
 */
export function downloadChart(canvas: HTMLCanvasElement, filename: string, format: "png" | "jpg" = "png"): void {
  const link = document.createElement("a");
  link.download = `${filename}.${format}`;
  link.href = canvas.toDataURL(`image/${format}`);
  link.click();
}

/**
 * Resize chart data for responsive display
 */
export function optimizeChartDataForMobile(data: ChartData, maxLabels: number = 6): ChartData {
  if (data.labels.length <= maxLabels) {
    return data;
  }

  const step = Math.ceil(data.labels.length / maxLabels);
  const optimizedLabels = data.labels.filter((_, index) => index % step === 0);
  
  const optimizedDatasets = data.datasets.map(dataset => ({
    ...dataset,
    data: dataset.data.filter((_, index) => index % step === 0),
  }));

  return {
    labels: optimizedLabels,
    datasets: optimizedDatasets,
  };
}

/**
 * Calculate chart statistics
 */
export function calculateChartStatistics(data: ChartData) {
  const allValues = data.datasets.flatMap(dataset => dataset.data);
  
  if (allValues.length === 0) {
    return {
      min: 0,
      max: 0,
      average: 0,
      total: 0,
      count: 0,
    };
  }

  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const total = allValues.reduce((sum, value) => sum + value, 0);
  const average = total / allValues.length;

  return {
    min,
    max,
    average: Math.round(average * 100) / 100,
    total,
    count: allValues.length,
  };
}
