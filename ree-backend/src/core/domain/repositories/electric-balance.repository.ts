import { ElectricBalanceDTO, ElectricBalanceMonthlyDTO } from '../entities/electric-balance.entity';

export interface ElectricBalanceRepository {
    saveMany(electricBalances: ElectricBalanceDTO[]): Promise<void>;
    findByDateRange(startDate: Date, endDate: Date, energyType?: string): Promise<ElectricBalanceDTO[]>;
    findByDate(date: Date): Promise<ElectricBalanceDTO[]>;
    getAggregatedByEnergyType(startDate: Date, endDate: Date): Promise<any[]>;
    getLatestByTypes(): Promise<any[]>;
    getMonthlySumByType(startYear: number, startMonth: number, endYear: number, endMonth: number): Promise<ElectricBalanceMonthlyDTO[]>;
}