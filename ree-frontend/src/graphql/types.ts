export interface ReeEntity {
    energyType: string;
    deviceTypes: string[];
  }
  
  export interface ElectricBalanceData {
    energyType: string;
    deviceType: string;
    date: string;
    value: number;
    percentage: number;
  }
  
  export interface MonthlySumData {
    energyType: string;
    deviceType: string;
    month: number;
    year: number;
    totalValue: number;
  }