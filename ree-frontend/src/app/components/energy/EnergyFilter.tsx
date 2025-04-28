"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  CircularProgress,
  Typography,
} from "@mui/material";
import { gql, useQuery } from "@apollo/client";

const GET_ENERGY_TYPES = gql`
  query ReeEntities {
    reeEntities {
      energyType
      deviceTypes
    }
  }
`;

export function EnergyFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const [energyType, setEnergyType] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const { loading, error, data } = useQuery(GET_ENERGY_TYPES);

  const handleFilterChange = (name: string, value: string | null) => {
    const params = new URLSearchParams(window.location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FormControl fullWidth>
          <InputLabel>Tipo de Energías</InputLabel>
          <Select
            value={energyType}
            label="Tipo de Energía"
            onChange={(e: SelectChangeEvent) => {
              const value = e.target.value;
              setEnergyType(value);
              handleFilterChange("energyType", value === "all" ? null : value);
            }}
            disabled={loading || !!error}
          >
            <MenuItem value="all">Todos</MenuItem>
            {loading && <MenuItem value="loading" disabled><CircularProgress size={20} /></MenuItem>}
            {error && (
              <MenuItem value="error" disabled>
                <Typography color="error">
                  Error al cargar tipos: {error.message}
                  {error.networkError && error.networkError.result && error.networkError.result.errors && (
                    <pre style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
                      {JSON.stringify(error.networkError.result.errors, null, 2)}
                    </pre>
                  )}
                </Typography>
              </MenuItem>
            )}
            {data && data.reeEntities && data.reeEntities.map((entity: { energyType: string }) => (
              <MenuItem key={entity.energyType} value={entity.energyType}>
                {entity.energyType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <DatePicker
          label="Fecha Inicio"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            handleFilterChange("startDate", newValue ? newValue.toISOString().split('T')[0] : null);
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DatePicker
          label="Fecha Fin"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            handleFilterChange("endDate", newValue ? newValue.toISOString().split('T')[0] : null);
          }}
          slotProps={{ textField: { fullWidth: true } }}
          minDate={startDate || undefined}
        />
      </div>
    </LocalizationProvider>
  );
}
