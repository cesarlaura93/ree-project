import { Suspense } from "react";
import { EnergyFilter } from "../EnergyFilter";
import { ValueChart } from "./ValueChart";
import { PercentageChart } from "./PercentageChart";
import { EnergyData } from "@/types/energy";
import YearMonthFilter from "../YearMotnFilter";

async function getEnergyData(params: {
  energyType?: string;
  startDate?: string;
  endDate?: string;
}): Promise<EnergyData[]> {
  try {
    const url = new URL("/api/energy/data", window.location.origin);

    if (params.energyType && params.energyType !== "all") {
      url.searchParams.set("energyType", params.energyType);
    }

    if (params.startDate && params.endDate) {
      url.searchParams.set("startDate", params.startDate);
      url.searchParams.set("endDate", params.endDate);
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error("Error fetching energy data");
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("Error fetching energy data:", error);
    return [];
  }
}

export default function AccumulatedView({
  searchParams,
}: {
  searchParams: {
    energyType?: string;
    startDate?: string;
    endDate?: string;
  };
}) {
  return (
    <section className="space-y-8">
      <YearMonthFilter />

      <Suspense fallback={<div>Cargando datos acumulados...</div>}>
        <AccumulatedCharts searchParams={searchParams} />
      </Suspense>
    </section>
  );
}

async function AccumulatedCharts({ searchParams }: { searchParams: any }) {
  const data = await getEnergyData(searchParams);

  if (!data.length) {
    return <div>No se encontraron datos con los filtros seleccionados</div>;
  }

  return (
    <>
      <div className="grid gap-8">
        <h2 className="text-2xl font-bold">Vista Acumulada</h2>
        <ValueChart data={data} />
        <PercentageChart data={data} />
      </div>
    </>
  );
}
