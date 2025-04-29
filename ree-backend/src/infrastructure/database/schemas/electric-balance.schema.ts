import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ElectricBalanceDocument = ElectricBalance & Document;

@Schema({
  timestamps: true,
  collection: 'electric_balance',
})
export class ElectricBalance {
  @Prop({ 
    required: true,
    type: String,
    index: true,
  })
  energy_type: string;

  @Prop({ 
    required: true,
    type: String,
    index: true,
  })
  device_type: string;

  @Prop({ 
    required: true, 
    type: Date,
    index: true,
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

ElectricBalanceSchema.index({ date: 1, energy_type: 1, device_type: 1 });
ElectricBalanceSchema.index({ date: -1 });

ElectricBalanceSchema.methods = {
  getFormattedDate(): string {
    return this.date.toISOString();
  },
};

ElectricBalanceSchema.statics = {
  async findByDateRange(startDate: Date, endDate: Date) {
    return this.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    }).sort({ date: 1 });
  },
};

ElectricBalanceSchema.pre('save', function(next) {
  if (this.percentage < 0 || this.percentage > 100) {
    next(new Error('Percentage must be between 0 and 100'));
  } else {
    next();
  }
});