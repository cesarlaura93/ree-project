import { Resolver, Query } from '@nestjs/graphql';
import { GetReeEntitiesUseCase } from 'src/core/application/use-cases/get-ree-entities.use-case';
import { ReeEntitiesModel } from '../models/ree-entities.model';
import { ReeEntity } from 'src/core/domain/entities/ree-entitiy';

@Resolver(() => ReeEntitiesModel)
export class ReeEntitiesResolver {
  constructor(
      private readonly getReeEntitiesUseCase: GetReeEntitiesUseCase,
    ) {}

  @Query(() => [ReeEntitiesModel], { name: 'reeEntities' })
  async getAll() {
    const data = await this.getReeEntitiesUseCase.execute();
    return this.mapToReeEntitiesModel(data);
  }

  private mapToReeEntitiesModel(data: ReeEntity[]): ReeEntitiesModel[] {
    return data.map(item => ({
      energyType: item.energy_type,
      deviceTypes: item.device_types,
    }));
  }
}