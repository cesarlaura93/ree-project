import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class ReeEntitiesModel {
  @Field()
  energyType: string;

  @Field(() => [String])
  deviceTypes: string[];
}