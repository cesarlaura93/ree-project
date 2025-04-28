'use client';
// app/page.tsx
import { Suspense, useState, useMemo } from "react";
import { EnergyFilter } from "@/app/components/energy/EnergyFilter";
import AccumulatedView from "@/app/components/energy/AccumulatedView";
// import DailyReport from '@/app/components/energy/DailyReport';
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { useSearchParams } from 'next/navigation'; 

/*
interface HomePageProps {
  searchParams?: { [key: string]: string | string[] | undefined };
}*/

export default function Home() {
  const [tab, setTab] = useState(0);
  const searchParamsHook = useSearchParams(); // Usa el hook

  const searchParamsObject = useMemo(() => {
    const params: { [key: string]: string } = {};
    searchParamsHook.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParamsHook]);

  return (
    <main className="container mx-auto p-4">

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)}>
          <Tab label="Vista Acumulada" />
          <Tab label="Reporte Diario Detallado" />
        </Tabs>
      </Box>

      {tab === 0 && (
        <section className="mb-12">
          <h1 className="text-3xl font-bold mb-6">
            Monitor de Energía - Vista Acumulada
          </h1>
          <Suspense fallback={<div className="text-lg">Cargando datos acumulados...</div>}>
            <AccumulatedView searchParams={searchParamsObject} />
          </Suspense>
        </section>
      )}

      {tab === 1 && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Reporte Diario Detallado</h2>
          <Suspense fallback={<div className="text-lg">Cargando reporte diario...</div>}>
            {/* <DailyReport searchParams={searchParams} /> */}
          </Suspense>
        </section>
      )}
    </main>
  );
}
