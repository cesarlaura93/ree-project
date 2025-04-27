import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReeEntitiesDocument = ReeEntities & Document;

@Schema({
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  collection: 'ree_entities', // Nombre de la colección en MongoDB
})
export class ReeEntities {
  // Mongoose maneja el _id automáticamente, pero podemos declararlo si queremos tiparlo explícitamente
  // @Prop({ type: MongooseSchema.Types.ObjectId, auto: true }) // Opcional: si quieres definirlo explícitamente
  // _id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  energy_type: string;

  @Prop({ type: [String], required: true }) // Array de strings
  device_types: string[];
}

export const ReeEntitiesSchema = SchemaFactory.createForClass(ReeEntities);
