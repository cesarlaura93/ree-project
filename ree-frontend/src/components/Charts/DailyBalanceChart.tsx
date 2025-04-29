import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid,
  CardHeader,
  Divider,
  Box
} from '@mui/material';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import { ElectricBalanceData } from '@/graphql/types';

interface DailyBalanceChartProps {
  data: ElectricBalanceData[];
  date: string;
}

// Colores para los graficos
const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

const DailyBalanceChart: React.FC<DailyBalanceChartProps> = ({ data, date }) => {
  // Se agrupa por tipo de energia para el grafico de torta
  const energyTypeData = React.useMemo(() => {
    const result: { [key: string]: number } = {};
    
    data.forEach(item => {
      if (result[item.energyType]) {
        result[item.energyType] += item.value;
      } else {
        result[item.energyType] = item.value;
      }
    });
    
    return Object.entries(result).map(([name, value]) => ({
      name,
      value: Math.abs(value)
    }));
  }, [data]);

  const deviceTypeData = React.useMemo(() => {
    return [...data]
      .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
      .slice(0, 10)
      .map(item => ({
        name: item.deviceType,
        value: Math.abs(item.value),
        energyType: item.energyType
      }));
  }, [data]);

  const formattedDate = new Date(date).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card>
      <CardHeader 
        title={`Balance Eléctrico - ${formattedDate}`}
        subheader="Distribución por tipo de energía y dispositivo"
      />
      <Divider />
      <CardContent>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Distribución por Tipo de Energía
            </Typography>
            <Box height={300}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={energyTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {energyTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value.toFixed(2)} MWh`, 'Valor']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
          
          <Grid size={{ xs: 12, md: 7 }}>
            <Typography variant="h6" align="center" gutterBottom>
              Top 10 Dispositivos por Valor
            </Typography>
            
            <Box height={300} width="100%">
              {deviceTypeData.length > 0 ? (
                <BarChart
                  layout="vertical"
                  width={600}
                  height={300}
                  data={deviceTypeData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 150,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12 }}
                    width={140}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`${value.toFixed(2)} MWh`, 'Valor']} 
                    labelFormatter={(value) => `Dispositivo: ${value}`}
                  />
                  <Legend />
                  <Bar 
                    dataKey="value" 
                    fill="#8884d8" 
                    
                    label={{
                      position: 'right',
                      formatter: (value: number) => value.toFixed(0),
                    }}
                  />
                </BarChart>
              ) : (
                <Typography>No hay datos disponibles</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DailyBalanceChart;