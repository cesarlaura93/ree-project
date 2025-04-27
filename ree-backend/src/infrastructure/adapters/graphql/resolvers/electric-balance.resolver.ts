import { Resolver, Query, Args } from '@nestjs/graphql';
import { GetElectricBalanceUseCase } from '../../../../core/application/use-cases/get-electric-balance.use-case';
import { ElectricBalanceModel, ElectricBalanceMonthlyModel } from '../models/electric-balance.model';
import { ElectricBalanceDTO, ElectricBalanceMonthlyDTO } from '../../../../core/domain/entities/electric-balance.entity';

@Resolver(() => ElectricBalanceModel)
export class ElectricBalanceResolver {
  constructor(
    private readonly getElectricBalanceUseCase: GetElectricBalanceUseCase
  ) { }

  @Query(() => [ElectricBalanceModel], { name: 'electricBalance' })
  async getElectricBalance(
    @Args('startDate') startDate: string,
    @Args('endDate') endDate: string,
    @Args('energyType', { nullable: true }) energyType?: string,
  ): Promise<ElectricBalanceModel[]> {
    const data = await this.getElectricBalanceUseCase.execute(
      new Date(startDate),
      new Date(endDate),
      energyType,
    );
    return this.mapToElectricBalanceModel(data);
  }

  @Query(() => [ElectricBalanceModel], { name: 'electricBalanceByDate' })
  async getElectricBalanceByDate(
    @Args('date') date: string,
  ): Promise<ElectricBalanceModel[]> {
    const data = await this.getElectricBalanceUseCase.executeByDate(new Date(date));
    return this.mapToElectricBalanceModel(data);
  }

  @Query(() => [ElectricBalanceMonthlyModel], { name: 'monthlySumByType' })
  async getMonthlySumByType(
    @Args('startYear') startYear: number,
    @Args('startMonth') startMonth: number, // 1-12
    @Args('endYear') endYear: number,
    @Args('endMonth') endMonth: number // 1-12
  ): Promise<ElectricBalanceMonthlyModel[]> {
    const data = await this.getElectricBalanceUseCase.executeMonthlySumByType(startYear, startMonth, endYear, endMonth);
    return this.mapToMonthlyElectricBalanceModel(data);
  }

  private mapToElectricBalanceModel(data: ElectricBalanceDTO[]): ElectricBalanceModel[] {
    return data.map(item => ({
      energyType: item.energy_type,
      deviceType: item.device_type,
      date: item.date.toISOString().slice(0, 10),
      value: item.value,
      percentage: item.percentage
    }));
  }

  private mapToMonthlyElectricBalanceModel(data: ElectricBalanceMonthlyDTO[]): ElectricBalanceMonthlyModel[] {
    return data.map(item => ({
      energyType: item.energyType,
      deviceType: item.deviceType,
      month: item.month,
      year: item.year,
      totalValue: item.totalValue
    }));
  }
}