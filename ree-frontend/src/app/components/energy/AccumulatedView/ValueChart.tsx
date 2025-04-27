"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { EnergyData } from "@/types/energy";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  TimeScale
);

interface ValueChartProps {
  data: EnergyData[];
}

export function ValueChart({ data }: ValueChartProps) {
  const processedData = data.reduce((acc, entry) => {
    const date = new Date(entry.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = 0;
    }
    acc[date] += entry.value;
    return acc;
  }, {} as Record<string, number>);

  const chartData = {
    labels: Object.keys(processedData),
    datasets: [
      {
        label: "Valor Total (MWh)",
        data: Object.values(processedData),
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Producción de Energía Acumulada",
      },
    },
    scales: {
      x: {
        type: "time" as const,
        time: {
          unit: "day" as const,
          tooltipFormat: "DD/MM/YYYY",
        },
        title: {
          display: true,
          text: "Fecha",
        },
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "MWh",
        },
        ticks: {
          callback: (value: number | string) => {
            if (typeof value === "number") {
              return new Intl.NumberFormat("es-ES").format(value);
            }
            return value;
          },
        },
      },
    },
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-[400px]">
      <Line data={chartData} options={options} />
    </div>
  );
}
