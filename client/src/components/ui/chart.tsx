import { useRef, useEffect } from "react";
import { Chart as ChartJS, registerables } from "chart.js";

// Register all Chart.js components
ChartJS.register(...registerables);

interface ChartProps {
  type: string;
  data: any;
  options?: any;
  plugins?: any[];
  height?: string;
  width?: string;
}

export function Chart({
  type,
  data,
  options = {},
  plugins = [],
  height,
  width,
}: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<ChartJS | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // If we already have a chart instance, destroy it before creating a new one
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create chart
    chartInstance.current = new ChartJS(chartRef.current, {
      type: type as any,
      data,
      options,
      plugins,
    });

    // Clean up on unmount
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [type, data, options, plugins]);

  return (
    <div style={{ height, width, position: "relative" }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
}
