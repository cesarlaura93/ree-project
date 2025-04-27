import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GetReeEntitiesUseCase } from 'src/core/application/use-cases/get-ree-entities.use-case';
import { ReeEntitiesResolver } from 'src/infrastructure/adapters/graphql/resolvers/ree-entities.resolver';
import { MongoReeEntitiesRepository } from 'src/infrastructure/adapters/repositories/mongo-ree-entities.repository';
import { ReeEntities, ReeEntitiesSchema } from 'src/infrastructure/database/schemas/ree-entities.schema';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ReeEntities.name, schema: ReeEntitiesSchema },
        ]),
    ],
    providers: [
        ReeEntitiesResolver,
        GetReeEntitiesUseCase,
        {
            provide: 'ReeEntitiesRepository',
            useClass: MongoReeEntitiesRepository,
        },
    ],
    exports: [GetReeEntitiesUseCase, ReeEntitiesResolver],
    controllers: []
})
export class ReeEntitiesModule { }