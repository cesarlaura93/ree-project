import { ReeEntity } from "src/core/domain/entities/ree-entitiy";

export interface ReeEntitiesRepository {
    findAll(): Promise<ReeEntity[]>;
}