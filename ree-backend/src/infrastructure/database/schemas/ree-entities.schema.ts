import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReeEntitiesDocument = ReeEntities & Document;

@Schema({
  timestamps: true, 
  collection: 'ree_entities',
})
export class ReeEntities {
  @Prop({ required: true })
  energy_type: string;

  @Prop({ type: [String], required: true })
  device_types: string[];
}

export const ReeEntitiesSchema = SchemaFactory.createForClass(ReeEntities);
