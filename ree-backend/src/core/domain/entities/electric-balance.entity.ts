// Para manejar los documentos de balance eléctrico
export interface ElectricBalanceDTO {
    energy_type: string;
    device_type: string;
    date: Date;
    value: number;
    percentage: number;
}

// Para manejar los documentos de balance eléctrico agrupados por mes
export interface ElectricBalanceMonthlyDTO {
    energyType: string;
    deviceType: string;
    month: number;
    year: number;
    totalValue: number;
}