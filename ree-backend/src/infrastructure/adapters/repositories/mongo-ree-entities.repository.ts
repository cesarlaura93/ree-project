import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ReeEntities } from "src/infrastructure/database/schemas/ree-entities.schema";
import { ReeEntitiesRepository } from "src/core/domain/repositories/ree-entities.repository";
import { ReeEntitiesDocument } from "src/infrastructure/database/schemas/ree-entities.schema";
import { ReeEntity } from "src/core/domain/entities/ree-entitiy";

@Injectable()
export class MongoReeEntitiesRepository implements ReeEntitiesRepository {
  private readonly logger = new Logger(MongoReeEntitiesRepository.name);

  constructor(
    @InjectModel(ReeEntities.name)
    private readonly reeModel: Model<ReeEntitiesDocument>,
  ) {}

  async findAll(): Promise<ReeEntity[]> {
    this.logger.log('Fetching all ReeEntities from MongoDB');
    try {
      const documents = await this.reeModel.find().exec();
      return documents.map(doc =>  this.mapToEntity(doc))
      
    } catch (error) {
      this.logger.error('Error fetching ReeEntities from MongoDB', error.stack);
      throw error; 
    }
  }

  private mapToEntity(document: ReeEntitiesDocument): ReeEntity{
    return {
        energy_type: document.energy_type,
        device_types: document.device_types
    }
  }
}