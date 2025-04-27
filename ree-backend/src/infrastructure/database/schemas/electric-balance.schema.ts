import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ElectricBalanceDocument = ElectricBalance & Document;

@Schema({
  timestamps: true, // Añade createdAt y updatedAt automáticamente
  collection: 'electric_balance', // Nombre de la colección en MongoDB
})
export class ElectricBalance {
  @Prop({ 
    required: true,
    type: String,
    index: true, // Índice para búsquedas frecuentes por tipo de energía
  })
  energy_type: string;

  @Prop({ 
    required: true,
    type: String,
    index: true, // Índice para búsquedas frecuentes por tipo de dispositivo
  })
  device_type: string;

  @Prop({ 
    required: true, 
    type: Date,
    index: true, // Índice para búsquedas por fecha (muy importante para consultas por rango)
  })
  date: Date;

  @Prop({ 
    required: true,
    type: Number 
  })
  value: number;

  @Prop({ 
    required: true,
    type: Number 
  })
  percentage: number;
}

export const ElectricBalanceSchema = SchemaFactory.createForClass(ElectricBalance);

// Índice compuesto para consultas comunes
ElectricBalanceSchema.index({ date: 1, energy_type: 1, device_type: 1 });

// Índice para consultas por rango de fechas (optimización)
ElectricBalanceSchema.index({ date: -1 });

// Definir métodos del schema si son necesarios
ElectricBalanceSchema.methods = {
  // Método de ejemplo para formatear la fecha
  getFormattedDate(): string {
    return this.date.toISOString();
  },
};

// Definir métodos estáticos si son necesarios
ElectricBalanceSchema.statics = {
  // Método estático de ejemplo para buscar por rango de fechas
  async findByDateRange(startDate: Date, endDate: Date) {
    return this.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });
  },
};

// Middleware pre-save para validaciones adicionales
ElectricBalanceSchema.pre('save', function(next) {
  // Validación de ejemplo: asegurar que el porcentaje esté entre 0 y 100
  if (this.percentage < 0 || this.percentage > 100) {
    next(new Error('Percentage must be between 0 and 100'));
  } else {
    next();
  }
});