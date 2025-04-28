"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Grid,
  Typography,
  Box,
  SelectChangeEvent // Importar SelectChangeEvent
} from "@mui/material";

export default function YearMonthFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Generar años para el selector (últimos 10 años)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  // Lista de meses
  const months = [
    { value: "1", label: "Enero" },
    { value: "2", label: "Febrero" },
    { value: "3", label: "Marzo" },
    { value: "4", label: "Abril" },
    { value: "5", label: "Mayo" },
    { value: "6", label: "Junio" },
    { value: "7", label: "Julio" },
    { value: "8", label: "Agosto" },
    { value: "9", label: "Septiembre" },
    { value: "10", label: "Octubre" },
    { value: "11", label: "Noviembre" },
    { value: "12", label: "Diciembre" },
  ];

  // Estado para almacenar las selecciones
  const [startYear, setStartYear] = useState(currentYear.toString());
  const [startMonth, setStartMonth] = useState("1"); // Default a Enero
  const [endYear, setEndYear] = useState(currentYear.toString());
  const [endMonth, setEndMonth] = useState((new Date().getMonth() + 1).toString()); // Default al mes actual
  const [error, setError] = useState("");

  // Cargar valores desde la URL al iniciar y validar
  useEffect(() => {
    const startYearParam = searchParams.get("startYear") || currentYear.toString();
    const startMonthParam = searchParams.get("startMonth") || "1";
    const endYearParam = searchParams.get("endYear") || currentYear.toString();
    const endMonthParam = searchParams.get("endMonth") || (new Date().getMonth() + 1).toString();

    // Validar y establecer valores iniciales
    if (years.includes(parseInt(startYearParam))) setStartYear(startYearParam);
    if (months.some(m => m.value === startMonthParam)) setStartMonth(startMonthParam);
    if (years.includes(parseInt(endYearParam))) setEndYear(endYearParam);
    if (months.some(m => m.value === endMonthParam)) setEndMonth(endMonthParam);

    // Validar fechas después de establecerlas desde la URL o por defecto
    validateDates(startYearParam, startMonthParam, endYearParam, endMonthParam);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]); // Solo se ejecuta cuando cambian los searchParams

  // Validar que la fecha de fin no sea anterior a la de inicio
  const validateDates = (
    currentStartYear = startYear,
    currentStartMonth = startMonth,
    currentEndYear = endYear,
    currentEndMonth = endMonth
  ) => {
    const startDate = new Date(parseInt(currentStartYear), parseInt(currentStartMonth) - 1);
    const endDate = new Date(parseInt(currentEndYear), parseInt(currentEndMonth) - 1);

    if (endDate < startDate) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return false;
    }

    setError(""); // Limpiar error si es válido
    return true;
  };

  // Manejadores de cambio que validan al instante (adaptados para MUI)
  const handleStartYearChange = (e: SelectChangeEvent<string>) => {
    const newStartYear = e.target.value;
    setStartYear(newStartYear);
    validateDates(newStartYear, startMonth, endYear, endMonth);
  };
  const handleStartMonthChange = (e: SelectChangeEvent<string>) => {
    const newStartMonth = e.target.value;
    setStartMonth(newStartMonth);
    validateDates(startYear, newStartMonth, endYear, endMonth);
  };
  const handleEndYearChange = (e: SelectChangeEvent<string>) => {
    const newEndYear = e.target.value;
    setEndYear(newEndYear);
    validateDates(startYear, startMonth, newEndYear, endMonth);
  };
  const handleEndMonthChange = (e: SelectChangeEvent<string>) => {
    const newEndMonth = e.target.value;
    setEndMonth(newEndMonth);
    validateDates(startYear, startMonth, endYear, newEndMonth);
  };


  // Aplicar el filtro
  const applyFilter = () => {
    // Re-validar antes de aplicar
    if (!validateDates()) return;

    // Crear los nuevos parámetros de búsqueda
    const params = new URLSearchParams(searchParams.toString());
    params.set("startYear", startYear);
    params.set("startMonth", startMonth);
    params.set("endYear", endYear);
    params.set("endMonth", endMonth);

    // Navegar con los nuevos parámetros
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <Box sx={{ p: 2, border: '1px solid #e0e0e0', borderRadius: 1, mb: 4, backgroundColor: '#fff' }}>
       <Typography variant="h6" gutterBottom component="div" sx={{ mb: 2 }}>
         Filtrar por Período
       </Typography>
      <Grid container spacing={3}>
        {/* Fecha de inicio */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Fecha de Inicio</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="start-year-label">Año Inicio</InputLabel>
                <Select
                  labelId="start-year-label"
                  id="startYear"
                  value={startYear}
                  label="Año Inicio"
                  onChange={handleStartYearChange}
                >
                  {years.map((year) => (
                    <MenuItem key={`start-year-${year}`} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="start-month-label">Mes Inicio</InputLabel>
                <Select
                  labelId="start-month-label"
                  id="startMonth"
                  value={startMonth}
                  label="Mes Inicio"
                  onChange={handleStartMonthChange}
                >
                  {months.map((month) => (
                    <MenuItem key={`start-month-${month.value}`} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Fecha de fin */}
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'medium' }}>Fecha de Fin</Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="end-year-label">Año Fin</InputLabel>
                <Select
                  labelId="end-year-label"
                  id="endYear"
                  value={endYear}
                  label="Año Fin"
                  onChange={handleEndYearChange}
                >
                  {years.map((year) => (
                    <MenuItem key={`end-year-${year}`} value={year.toString()}>
                      {year}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth size="small">
                <InputLabel id="end-month-label">Mes Fin</InputLabel>
                <Select
                  labelId="end-month-label"
                  id="endMonth"
                  value={endMonth}
                  label="Mes Fin"
                  onChange={handleEndMonthChange}
                >
                  {months.map((month) => (
                    <MenuItem key={`end-month-${month.value}`} value={month.value}>
                      {month.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>

        {/* Mensaje de error y Botón */}
        <Grid item xs={12}>
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1, mb: 2 }}>
              {error}
            </Typography>
          )}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={applyFilter}
              disabled={!!error} // Deshabilitar si hay error
            >
              Aplicar Filtro
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}