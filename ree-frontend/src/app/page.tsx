// app/page.tsx
import { Suspense } from "react";
import { EnergyFilter } from "@/app/components/energy/EnergyFilter";
import AccumulatedView from "@/app/components/energy/AccumulatedView";
// import DailyReport from '@/app/components/energy/DailyReport';

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  return (
    <main className="container mx-auto p-4">
      {/* Filtros Globales */}
      <EnergyFilter />

      {/* Sección de Vista Acumulada */}
      <section className="mb-12">
        <h1 className="text-3xl font-bold mb-6">
          Monitor de Energía - Vista Acumulada
        </h1>
        <Suspense
          fallback={<div className="text-lg">Cargando datos acumulados...</div>}
        >
          <AccumulatedView searchParams={searchParams} />
        </Suspense>
      </section>

      {/* Sección de Reporte Diario */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold mb-6">Reporte Diario Detallado</h2>
        <Suspense
          fallback={<div className="text-lg">Cargando reporte diario...</div>}
        >
          {/* <DailyReport searchParams={searchParams} /> */}
        </Suspense>
      </section>
    </main>
  );
}
