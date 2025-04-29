import React, { useEffect } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardHeader,
  Divider,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Grid
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { MonthlySumData } from '@/graphql/types';

interface MonthlyTrendChartProps {
  data: MonthlySumData[];
  startYear: number;
  startMonth: number;
  endYear: number;
  endMonth: number;
}

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8',
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  data,
  startYear,
  startMonth,
  endYear,
  endMonth
}) => {
  // Estado para dispositivos seleccionados
  const [selectedDeviceTypes, setSelectedDeviceTypes] = React.useState<string[]>([]);
  
  // Obtener todos los dispositivos únicos
  const deviceTypes = React.useMemo(() => {
    const types = new Set<string>();
    data.forEach(item => {
      types.add(item.deviceType);
    });
    return Array.from(types);
  }, [data]);


  useEffect(() => {
    if (deviceTypes.length > 0 && selectedDeviceTypes.length === 0) {
      setSelectedDeviceTypes(deviceTypes.slice(0, 1));
    }
  }, [deviceTypes, selectedDeviceTypes.length]);


  const chartData = React.useMemo(() => {
    const groupedByMonth: { [key: string]: { [key: string]: number } } = {};
    data.forEach(item => {

      const monthKey = `${item.year}-${item.month}`;
      
      if (!groupedByMonth[monthKey]) {
        groupedByMonth[monthKey] = {};
      }
      
      groupedByMonth[monthKey][item.deviceType] = item.totalValue;
    });
    
    // Convertir a formato para Recharts
    return Object.entries(groupedByMonth)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([monthKey, values]) => {
        const [year, month] = monthKey.split('-');
        return {
          month: `${month}/${year}`,
          ...values
        };
      });
  }, [data]);

  const handleDeviceChange = (event: SelectChangeEvent<string[]>) => {
    const value = event.target.value;
    setSelectedDeviceTypes(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <Card>
      <CardHeader
        title="Tendencias Mensuales"
        subheader={`Evolución mensual por tipo de dispositivo (${startMonth}/${startYear} - ${endMonth}/${endYear})`}
      />
      <Divider />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <FormControl fullWidth>
              <InputLabel id="device-select-label">Dispositivos a mostrar</InputLabel>
              <Select
                labelId="device-select-label"
                value={selectedDeviceTypes}
                onChange={handleDeviceChange}
                renderValue={(selected) => selected.join(', ')}
                label="Dispositivos a mostrar"
              >
                {deviceTypes.map((device) => (
                  <MenuItem key={device} value={device}>
                    {device}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid size={{ xs: 12 }}>
            <div style={{ width: '100%', height: 500 }}>
              <LineChart
                width={1000}
                height={500}
                data={chartData}
                margin={{ top: 10, right: 30, left: 20, bottom: 50 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  scale="log"
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value: number) => [`${value.toFixed(2)} MWh`, 'Valor']} 
                  labelFormatter={(label) => `Mes: ${label}`}
                />
                <Legend />
                {selectedDeviceTypes.map((device, index) => (
                  <Line
                    key={device}
                    type="monotone"
                    dataKey={device}
                    name={device}
                    stroke={COLORS[index % COLORS.length]}
                    activeDot={{ r: 8 }}
                    isAnimationActive={false}
                  />
                ))}
              </LineChart>
            </div>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MonthlyTrendChart;