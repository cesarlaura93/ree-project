import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const sampleData = [
  {
    month: "07/2024",
    "Carga batería": -924.676,
    "Consumo bombeo": -629387.339,
  },
  { month: "08/2024", "Carga batería": -850.0, "Consumo bombeo": -600000.0 },
  { month: "09/2024", "Carga batería": -900.0, "Consumo bombeo": -615000.0 },
  { month: "10/2024", "Carga batería": -875.0, "Consumo bombeo": -620000.0 },
];

const SimplifiedChart: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Grafico de prueba simplificado
        </Typography>

        {/* Intentar con div normal primero */}
        <div style={{ width: "100%", height: 400, marginBottom: 20 }}>
          <Typography variant="subtitle2" gutterBottom>
            Prueba 1: Div normal sin ResponsiveContainer
          </Typography>
          <LineChart
            width={800}
            height={300}
            data={sampleData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Carga batería"
              stroke="#8884d8"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </div>

        {/* Prueba con valores positivos */}
        <div style={{ width: "100%", height: 400, marginBottom: 20 }}>
          <Typography variant="subtitle2" gutterBottom>
            Prueba 2: Usando valores absolutos (convertir negativos a positivos)
          </Typography>
          <LineChart
            width={800}
            height={300}
            data={sampleData.map((item) => ({
              month: item.month,
              "Carga batería": Math.abs(item["Carga batería"]),
              "Consumo bombeo": Math.abs(item["Consumo bombeo"]),
            }))}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Carga batería"
              stroke="#8884d8"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </div>

        {/* Prueba con escala logaritmica */}
        <div style={{ width: "100%", height: 400 }}>
          <Typography variant="subtitle2" gutterBottom>
            Prueba 3: Diferencias de escala - valores muy grandes vs pequeños
          </Typography>
          <LineChart
            width={800}
            height={300}
            data={sampleData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis scale="log" domain={["auto", "auto"]} allowDataOverflow />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Carga batería"
              stroke="#8884d8"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="Consumo bombeo"
              stroke="#82ca9d"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </div>
      </CardContent>
    </Card>
  );
};

export default SimplifiedChart;
