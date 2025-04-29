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
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { ElectricBalanceData } from '@/graphql/types';

interface DateRangeChartProps {
  data: ElectricBalanceData[];
  startDate: string;
  endDate: string;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

const DateRangeChart: React.FC<DateRangeChartProps> = ({ data, startDate, endDate }) => {
  const chartData = React.useMemo(() => {
    const groupedByDate: { [key: string]: { [key: string]: number } } = {};
    
    data.forEach(item => {
      const date = new Date(item.date).toISOString().split('T')[0];
      
      if (!groupedByDate[date]) {
        groupedByDate[date] = {};
      }
      
      if (!groupedByDate[date][item.energyType]) {
        groupedByDate[date][item.energyType] = 0;
      }
      
      groupedByDate[date][item.energyType] += item.value;
    });
    
    // Se convierte al formato que necesita recharts
    return Object.entries(groupedByDate).map(([date, values]) => ({
      date: new Date(date).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit'
      }),
      ...values
    }));
  }, [data]);

  const energyTypes = React.useMemo(() => {
    const types = new Set<string>();
    data.forEach(item => types.add(item.energyType));
    return Array.from(types);
  }, [data]);
  
  // Formato de fechas para el titulo
  const formattedStartDate = new Date(startDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  
  const formattedEndDate = new Date(endDate).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <Card>
      <CardHeader 
        title={`Evolución del Balance Eléctrico`}
        subheader={`Del ${formattedStartDate} al ${formattedEndDate}`}
      />
      <Divider />
      <CardContent>
        <Box height={500}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value.toFixed(2)} MWh`, 'Valor']}
              />
              <Legend />
              {energyTypes.map((type, index) => (
                <Area
                  key={type}
                  type="monotone"
                  dataKey={type}
                  stackId="1"
                  fill={COLORS[index % COLORS.length]}
                  stroke={COLORS[index % COLORS.length]}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DateRangeChart;