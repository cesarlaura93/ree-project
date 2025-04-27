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
} from "@mui/material";

export function EnergyFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const [energyType, setEnergyType] = useState<string>("all");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [types, setTypes] = useState<string[]>([]);
  const handleFilterChange = (name: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(name, value);
    router.replace(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    fetch("/api/energy/types")
      .then((res) => res.json())
      .then((data) => setTypes(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <FormControl fullWidth>
          <InputLabel>Tipo de Energía</InputLabel>
          <Select
            value={energyType}
            label="Tipo de Energía"
            onChange={(e: SelectChangeEvent) => {
              const value = e.target.value;
              setEnergyType(value);
              handleFilterChange("energyType", value);
            }}
          >
            <MenuItem value="all">Todos</MenuItem>
            <MenuItem value="Renovable">Renovable</MenuItem>
            <MenuItem value="No Renovable">No Renovable</MenuItem>
            <MenuItem value="Biomasa">Biomasa</MenuItem>
            <MenuItem value="Geotérmica">Geotérmica</MenuItem>
            <MenuItem value="Nuclear">Nuclear</MenuItem>
            <MenuItem value="Marina">Marina</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="Fecha Inicio"
          value={startDate}
          onChange={(newValue) => {
            setStartDate(newValue);
            if (newValue)
              handleFilterChange("startDate", newValue.toISOString());
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />

        <DatePicker
          label="Fecha Fin"
          value={endDate}
          onChange={(newValue) => {
            setEndDate(newValue);
            if (newValue) handleFilterChange("endDate", newValue.toISOString());
          }}
          slotProps={{ textField: { fullWidth: true } }}
        />
      </div>
    </LocalizationProvider>
  );
}
