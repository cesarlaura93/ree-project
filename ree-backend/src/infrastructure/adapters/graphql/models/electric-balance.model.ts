import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class ElectricBalanceModel {
  @Field()
  energyType: string;

  @Field()
  deviceType: string;

  @Field()
  date: string;

  @Field()
  value: number;

  @Field()
  percentage: number;
}

@ObjectType()
export class ElectricBalanceMonthlyModel {
  @Field()
  energyType: string;

  @Field()
  deviceType: string;

  @Field()
  month: number;

  @Field()
  year: number;

  @Field()
  totalValue: number;
}
