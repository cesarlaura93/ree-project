export interface ElectricBalanceDTO {
    energy_type: string;
    device_type: string;
    date: Date;
    value: number;
    percentage: number;
}

export interface ElectricBalanceMonthlyDTO {
    energyType: string;
    deviceType: string;
    month: number;
    year: number;
    totalValue: number;
}