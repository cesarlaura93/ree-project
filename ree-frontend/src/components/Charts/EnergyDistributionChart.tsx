import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Box
} from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { ElectricBalanceData } from '@/graphql/types';

interface EnergyDistributionChartProps {
  data: ElectricBalanceData[];
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

const EnergyDistributionChart: React.FC<EnergyDistributionChartProps> = ({ data }) => {
  // Transformar los datos para un grafico de barras
  const chartData = React.useMemo(() => {
    // Agrupar por tipo de energia
    const groupedByEnergyType: { [key: string]: ElectricBalanceData[] } = {};
    
    data.forEach(item => {
      if (!groupedByEnergyType[item.energyType]) {
        groupedByEnergyType[item.energyType] = [];
      }
      
      groupedByEnergyType[item.energyType].push(item);
    });
    
    // Calcular promedios
    return Object.entries(groupedByEnergyType).map(([energyType, items]) => {
      const totalValue = items.reduce((sum, item) => sum + item.value, 0);
      const deviceCount = items.length;
      
      return {
        name: energyType,
        totalValue,
        averageValue: deviceCount > 0 ? totalValue / deviceCount : 0,
      };
    });
  }, [data]);

  return (
    <Card>
      <CardHeader
        title="Distribución por Tipo de Energía"
        subheader="Comparación de valores totales y medios"
      />
      <Divider />
      <CardContent>
        <Box height={400}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis />
              <Tooltip formatter={(value: number) => [`${value.toFixed(2)} MWh`, 'Valor']} />
              <Legend />
              <Bar 
                dataKey="totalValue" 
                fill="#8884d8" 
                name="Valor Total" 
              />
              <Bar 
                dataKey="averageValue" 
                fill="#82ca9d" 
                name="Valor Promedio" 
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default EnergyDistributionChart;