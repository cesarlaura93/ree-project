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
import { EnergyData, EnergyType, initializePercentages } from "@/types/energy";

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

interface PercentageChartProps {
  data: EnergyData[];
}

export function PercentageChart({ data }: PercentageChartProps) {
  // Procesamiento de datos para porcentajes acumulados por fecha
  const processedData = data.reduce(
    (acc, entry) => {
      const date = new Date(entry.date).toISOString().split("T")[0];

      if (!acc[date]) {
        acc[date] = {
          total: 0,
          percentages: initializePercentages(), // Inicializa con todos los tipos
        };
      }

      // Asegurar que energy_type es válido
      const energyType = entry.energy_type as EnergyType;

      // Sumar al porcentaje correspondiente
      acc[date].percentages[energyType] += entry.percentage;
      acc[date].total += entry.percentage;

      return acc;
    },
    {} as Record<
      string,
      {
        total: number;
        percentages: Record<EnergyType, number>;
      }
    >
  );

  // Configuración de colores para cada tipo de energía
  const energyColors: Record<EnergyType, string> = {
    Renovable: "#3b82f6",
    "No Renovable": "#ef4444",
    Biomasa: "#22c55e",
    Geotérmica: "#eab308",
    Nuclear: "#8b5cf6",
    Marina: "#06b6d4",
  };

  // Generamos datasets para cada tipo de energía
  const energyTypes = Array.from(
    new Set(data.map((d) => d.energy_type))
  ) as EnergyType[];
  const labels = Object.keys(processedData).sort();

  const datasets = energyTypes.map((energyType) => ({
    label: energyType,
    data: labels.map(
      (date) =>
        (processedData[date].percentages[energyType] /
          processedData[date].total) *
        100
    ),
    borderColor: energyColors[energyType],
    backgroundColor: `${energyColors[energyType]}40`,
    tension: 0.4,
    fill: false,
  }));

  const chartData = {
    labels,
    datasets,
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
        text: "Distribución Porcentual por Tipo de Energía",
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: ${value.toFixed(2)}%`;
          },
        },
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
        max: 100,
        title: {
          display: true,
          text: "Porcentaje (%)",
        },
        ticks: {
          callback: (value: number | string) => `${value}%`,
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
