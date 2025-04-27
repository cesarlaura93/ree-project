import { ElectricBalanceDTO } from "../entities/electric-balance.entity";

export interface REEApiRepository {
    fetchElectricBalance(startDate: string, endDate: string): Promise<ElectricBalanceDTO[]>;
  }