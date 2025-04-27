import { Inject, Injectable } from "@nestjs/common";
import { ReeEntity } from "src/core/domain/entities/ree-entitiy";
import { ReeEntitiesRepository } from "src/core/domain/repositories/ree-entities.repository";

@Injectable()
export class GetReeEntitiesUseCase {
    constructor(
        @Inject('ReeEntitiesRepository') private readonly reeEntitiesRepository: ReeEntitiesRepository,
    ) {}

    async execute(): Promise<ReeEntity[]> {
        return this.reeEntitiesRepository.findAll();
    }
}