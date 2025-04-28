import { Inject, Injectable, Logger } from '@nestjs/common';
import { ElectricBalanceRepository } from 'src/core/domain/repositories/electric-balance.repository';
import { ElectricBalanceDTO, ElectricBalanceMonthlyDTO } from 'src/core/domain/entities/electric-balance.entity';

@Injectable()
export class GetElectricBalanceUseCase {
  private readonly logger = new Logger(GetElectricBalanceUseCase.name);

  constructor(
    @Inject('ElectricBalanceRepository') private readonly electricBalanceRepository: ElectricBalanceRepository,
  ) {}

  /**
   * Obtiene datos de balance eléctrico por rango de fechas
   */
  async execute(startDate: Date, endDate: Date, energyType?: string): Promise<ElectricBalanceDTO[]> {
    try {
      this.logger.log(`Obteniendo los documents de balance data desde ${startDate} hasta ${endDate}`);
      
      // Validar fechas
      if (startDate > endDate) {
        throw new Error('Start date must be before end date');
      }

      const data = await this.electricBalanceRepository.findByDateRange(startDate, endDate, energyType);
      
      this.logger.log(`Encontrados ${data.length} registros`);
      
      return data;
    } catch (error) {
      this.logger.error(`Error obteniendo electric balance data: ${error.message}`);
      throw error;
    }
  }

  //Obtiene datos de balance eléctrico por fecha específica 
  async executeByDate(date: Date): Promise<ElectricBalanceDTO[]> {
    try {
      this.logger.log(`Obteniendo electric balance data para ${date}`);
      
      const data = await this.electricBalanceRepository.findByDate(date);
      
      this.logger.log(`Encontrados ${data.length} registros para la fecha ${date}`);
      
      return data;
    } catch (error) {
      this.logger.error(`Error obteniendo electric balance data para la fecha: ${error.message}`);
      throw error;
    }
  }

  // Obtiene la suma de balance eléctrico agrupado por mes
  async executeMonthlySumByType(
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
  ): Promise<ElectricBalanceMonthlyDTO[]> {
    try {
      this.logger.log(`Fetching monthly sum by type from ${startYear}-${startMonth} to ${endYear}-${endMonth}`);
      const data = await this.electricBalanceRepository.getMonthlySumByType(startYear, startMonth, endYear, endMonth);
      this.logger.log(`Found ${data.length} records`);
      return data;
    } catch (error) {
      this.logger.error(`Error fetching monthly sum by type: ${error.message}`);
      throw error;
    }
  }


  // Obtiene estadísticas agregadas por tipo de energía para un rango de fechas
  async getAggregatedData(startDate: Date, endDate: Date) {
    try {
      this.logger.log(`Fetching aggregated data from ${startDate} to ${endDate}`);
      
      const aggregatedData = await this.electricBalanceRepository.getAggregatedByEnergyType(
        startDate,
        endDate,
      );
      
      return aggregatedData;
    } catch (error) {
      this.logger.error(`Error fetching aggregated data: ${error.message}`);
      throw error;
    }
  }

  // Obtiene los últimos datos disponibles para cada combinación de tipo de energía y dispositivo
  async getLatestData() {
    try {
      this.logger.log('Fetching latest data by types');
      
      const latestData = await this.electricBalanceRepository.getLatestByTypes();
      
      return latestData;
    } catch (error) {
      this.logger.error(`Error fetching latest data: ${error.message}`);
      throw error;
    }
  }
}