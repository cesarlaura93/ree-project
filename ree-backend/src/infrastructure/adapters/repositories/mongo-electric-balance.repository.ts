import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ElectricBalanceRepository } from '../../../core/domain/repositories/electric-balance.repository';
import { ElectricBalance, ElectricBalanceDocument } from '../../database/schemas/electric-balance.schema';
import { ElectricBalanceDTO, ElectricBalanceMonthlyDTO } from '../../../core/domain/entities/electric-balance.entity';

@Injectable()
export class MongoElectricBalanceRepository implements ElectricBalanceRepository {
  private readonly logger = new Logger(MongoElectricBalanceRepository.name);

  constructor(
    @InjectModel(ElectricBalance.name)
    private readonly electricBalanceModel: Model<ElectricBalanceDocument>,
  ) {}

  async saveMany(electricBalances: ElectricBalanceDTO[]): Promise<void> {
    const bulkOperations = electricBalances.map(balance => ({
      updateOne: {
        filter: {
          date: new Date(balance.date),
          energy_type: balance.energy_type,
          device_type: balance.device_type,
        },
        update: {
          $set: {
            value: balance.value,
            percentage: balance.percentage,
          },
          $setOnInsert: {
            date: new Date(balance.date),
            energy_type: balance.energy_type,
            device_type: balance.device_type,
          },
        },
        upsert: true,
      },
    }));

    try {
      const result = await this.electricBalanceModel.bulkWrite(bulkOperations);
      
      this.logger.log(`Bulk operation completed: ${result.modifiedCount} modified, ${result.upsertedCount} inserted`);
    } catch (error) {
      this.logger.error('Error during bulk operation:', error);
      throw error;
    }
  }

  async findByDateRange(startDate: Date, endDate: Date, energyType?: string): Promise<ElectricBalanceDTO[]> {
    this.logger.debug(`Buscando registros por rango de fechas: ${startDate.toISOString()} - ${endDate.toISOString()}`);
    
    const nextDay = new Date(endDate);
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    nextDay.setUTCHours(0, 0, 0, 0);
    this.logger.debug(`Buscando registros por rango de fechas: ${startDate.toISOString()} - ${nextDay.toISOString()}`);
    const filter: any = {
      date: {
        $gte: startDate,
        $lt: nextDay,
      },
    };
    if (energyType) {
      filter.energy_type = energyType;
    }

    const documents = await this.electricBalanceModel
      .find(filter)
      .sort({ date: 1, energy_type: 1, device_type: 1 })
      .exec();

    return documents.map(doc => this.mapToEntity(doc));
  }

  async findByDate(date: Date): Promise<ElectricBalanceDTO[]> {
    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    
    return this.findByDateRange(startOfDay, endOfDay);
  }

  async getAggregatedByEnergyType(startDate: Date, endDate: Date) {
    return this.electricBalanceModel.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: '$energy_type',
          totalValue: { $sum: '$value' },
          avgPercentage: { $avg: '$percentage' },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          energyType: '$_id',
          totalValue: 1,
          avgPercentage: 1,
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { totalValue: -1 },
      },
    ]);
  }

  async getLatestByTypes() {
    return this.electricBalanceModel.aggregate([
      {
        $sort: { date: -1 },
      },
      {
        $group: {
          _id: {
            energy_type: '$energy_type',
            device_type: '$device_type',
          },
          latestDate: { $first: '$date' },
          value: { $first: '$value' },
          percentage: { $first: '$percentage' },
        },
      },
      {
        $project: {
          energy_type: '$_id.energy_type',
          device_type: '$_id.device_type',
          date: '$latestDate',
          value: 1,
          percentage: 1,
          _id: 0,
        },
      },
    ]);
  }

  async getMonthlySumByType(
    startYear: number,
    startMonth: number,
    endYear: number,
    endMonth: number
  ): Promise<ElectricBalanceMonthlyDTO[]> {

    const startDate = new Date(Date.UTC(startYear, startMonth - 1, 1, 0, 0, 0, 0));
    const endDate = new Date(Date.UTC(endYear, endMonth, 1, 0, 0, 0, 0)); 
  
    const documents = await this.electricBalanceModel.aggregate([
      {
        $match: {
          date: {
            $gte: startDate,
            $lt: endDate,
          },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            energy_type: '$energy_type',
            device_type: '$device_type',
          },
          totalValue: { $sum: '$value' },
        },
      },
      {
        $project: {
          year: '$_id.year',
          month: '$_id.month',
          energy_type: '$_id.energy_type',
          device_type: '$_id.device_type',
          totalValue: 1,
          _id: 0,
        },
      },
      {
        $sort: { year: 1, month: 1, energy_type: 1, device_type: 1 },
      },
    ]);

    return documents.map(doc => this.mapToMonthlyEntity(doc));
  }

  private mapToEntity(document: ElectricBalanceDocument): ElectricBalanceDTO {
    return {
      energy_type: document.energy_type,
      device_type: document.device_type,
      date: document.date,
      value: document.value,
      percentage: document.percentage
    };
  }

  private mapToMonthlyEntity(document: any): ElectricBalanceMonthlyDTO {
    return {
      energyType: document.energy_type,
      deviceType: document.device_type,
      month: document.month,
      year: document.year,
      totalValue: document.totalValue
    };
  }
}