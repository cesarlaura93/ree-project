'use client';

import React, { useState } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Tabs, 
  Tab, 
  Paper,
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Button
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { es } from 'date-fns/locale';
import { format, subMonths, addDays, subDays } from 'date-fns';

import TabPanel from '@/components/Layout/TabPanel';
import LoadingOverlay from '@/components/common/LoadingOverlay';
import ErrorAlert from '@/components/common/ErrorAlert';
import DailyBalanceChart from '@/components/Charts/DailyBalanceChart';
import DateRangeChart from '@/components/Charts/DateRangeChart';
import MonthlyTrendChart from '@/components/Charts/MonthlyTrendChart';
import EnergyDistributionChart from '@/components/Charts/EnergyDistributionChart';
import EnergyTypeFilter from '@/components/Filters/EnergyTypeFilter';

import { useElectricBalanceByDate } from '@/hooks/useElectricBalanceByDate';
import { useElectricBalance } from '@/hooks/useElectricBalance';
import { useMonthlySumByType } from '@/hooks/useMonthlySumByType';

export default function HomePage() {
  // Estado para las pestañas
  const [tabIndex, setTabIndex] = useState(0);
  
  // Estado para filtros de fecha y tipo de energia
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 1));
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [selectedEnergyType, setSelectedEnergyType] = useState<string>('');
  
  // Estado para filtros de tendencias mensuales
  const [trendStartYear, setTrendStartYear] = useState<number>(new Date().getFullYear());
  const [trendStartMonth, setTrendStartMonth] = useState<number>(1);
  const [trendEndYear, setTrendEndYear] = useState<number>(new Date().getFullYear());
  const [trendEndMonth, setTrendEndMonth] = useState<number>(new Date().getMonth());

  // Estado para notificaciones
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info',
  });
  
  const { 
    electricBalanceData: dailyData, 
    loading: dailyLoading, 
    error: dailyError,
    refetch: refetchDaily
  } = useElectricBalanceByDate(
    selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''
  );
  
  const { 
    electricBalanceData: rangeData, 
    loading: rangeLoading, 
    error: rangeError,
    refetch: refetchRange
  } = useElectricBalance(
    format(startDate, 'yyyy-MM-dd'),
    format(endDate, 'yyyy-MM-dd'),
    selectedEnergyType
  );
  
  const {
    monthlySumData: trendData,
    loading: trendLoading,
    error: trendError,
    refetch: refetchTrend
  } = useMonthlySumByType(
    trendStartYear,
    trendStartMonth,
    trendEndYear,
    trendEndMonth
  );

  // Manejadores de eventos
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };
  
  const handleEnergyTypeChange = (value: string) => {
    setSelectedEnergyType(value);
  };
  
  const handleRetry = () => {
    if (tabIndex === 0) {
      refetchDaily();
    } else if (tabIndex === 1) {
      refetchRange();
    } else if (tabIndex === 2) {
      refetchTrend();
    }
    
    setSnackbar({
      open: true,
      message: 'Actualizando datos...',
      severity: 'info',
    });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Comprobar si hay errores para mostrar
  const currentError = tabIndex === 0 ? dailyError : 
                      tabIndex === 1 ? rangeError : 
                      tabIndex === 2 ? trendError : null;
  
  const isLoading = tabIndex === 0 ? dailyLoading : 
                    tabIndex === 1 ? rangeLoading : 
                    tabIndex === 2 ? trendLoading : false;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="xl">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center">
            Dashboard de Balance Eléctrico
          </Typography>
          
          <Paper sx={{ mb: 3 }}>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Balance Diario" />
              <Tab label="Evolución por Periodo" />
              <Tab label="Tendencias Mensuales" />
              <Tab label="Distribución de Energía" />
            </Tabs>
          </Paper>
          
          {currentError && (
            <Box sx={{ mb: 3 }}>
              <ErrorAlert error={currentError} />
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleRetry}
                >
                  Reintentar
                </Button>
              </Box>
            </Box>
          )}
          
          <LoadingOverlay loading={isLoading} />
          
          <TabPanel value={tabIndex} index={0}>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 6 }}>
                  <DatePicker
                    label="Seleccione una fecha"
                    value={selectedDate}
                    onChange={(newDate) => setSelectedDate(newDate || new Date())}
                    maxDate={new Date()}
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </Box>
            
            {dailyData.length > 0 && (
              <DailyBalanceChart 
                data={dailyData} 
                date={format(selectedDate, 'yyyy-MM-dd')} 
              />
            )}
          </TabPanel>
          
          <TabPanel value={tabIndex} index={1}>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 4 }}>
                  <DatePicker
                    label="Fecha de inicio"
                    value={startDate}
                    onChange={(newDate) => newDate && setStartDate(newDate)}
                    maxDate={subDays(endDate, 1)}
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <DatePicker
                    label="Fecha de fin"
                    value={endDate}
                    onChange={(newDate) => newDate && setEndDate(newDate)}
                    minDate={addDays(startDate, 1)}
                    maxDate={new Date()}
                    slotProps={{
                      textField: {
                        variant: 'outlined',
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <EnergyTypeFilter
                    value={selectedEnergyType}
                    onChange={handleEnergyTypeChange}
                    includeEmpty={true}
                    helperText="Filtrar por tipo de energía (opcional)"
                  />
                </Grid>
              </Grid>
            </Box>
            
            {rangeData.length > 0 && (
              <DateRangeChart 
                data={rangeData} 
                startDate={format(startDate, 'yyyy-MM-dd')}
                endDate={format(endDate, 'yyyy-MM-dd')}
              />
            )}
          </TabPanel>
          
          <TabPanel value={tabIndex} index={2}>
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id="start-year-label">Año inicial</InputLabel>
                    <Select
                      labelId="start-year-label"
                      value={trendStartYear.toString()}
                      label="Año inicial"
                      onChange={(e) => setTrendStartYear(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 4 + i).map(year => (
                        <MenuItem key={`start-${year}`} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id="start-month-label">Mes inicial</InputLabel>
                    <Select
                      labelId="start-month-label"
                      value={trendStartMonth.toString()}
                      label="Mes inicial"
                      onChange={(e) => setTrendStartMonth(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <MenuItem key={`start-month-${month}`} value={month}>
                          {new Date(2000, month - 1, 1).toLocaleDateString('es-ES', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id="end-year-label">Año final</InputLabel>
                    <Select
                      labelId="end-year-label"
                      value={trendEndYear.toString()}
                      label="Año final"
                      onChange={(e) => setTrendEndYear(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 4 + i).map(year => (
                        <MenuItem key={`end-${year}`} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 6, md: 3 }}>
                  <FormControl fullWidth>
                    <InputLabel id="end-month-label">Mes final</InputLabel>
                    <Select
                      labelId="end-month-label"
                      value={trendEndMonth.toString()}
                      label="Mes final"
                      onChange={(e) => setTrendEndMonth(parseInt(e.target.value))}
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <MenuItem key={`end-month-${month}`} value={month}>
                          {new Date(2000, month - 1, 1).toLocaleDateString('es-ES', { month: 'long' })}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
            
            {trendData.length > 0 && (
              <MonthlyTrendChart 
                data={trendData}
                startYear={trendStartYear}
                startMonth={trendStartMonth}
                endYear={trendEndYear}
                endMonth={trendEndMonth}
              />
            )}

          </TabPanel>
          
          <TabPanel value={tabIndex} index={3}>
            {rangeData.length > 0 && (
              <EnergyDistributionChart data={rangeData} />
            )}
          </TabPanel>
        </Box>
        
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
}