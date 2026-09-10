import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type StationDocument = HydratedDocument<Station>;

@Schema({ _id: false })
export class Address {
  @Prop({ required: true })
  street: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  postalCode: string;

  @Prop({ required: true })
  country: string;
}

@Schema({ _id: false })
export class GeoPoint {
  @Prop({ required: true, enum: ['Point'], default: 'Point' })
  type: string;

  @Prop({ required: true, type: [Number] })
  coordinates: number[]; // [longitude, latitude]
}

@Schema({ _id: false })
export class Connector {
  @Prop({ required: true, enum: ['Type 2', 'CCS', 'CHAdeMO'] })
  type: string;

  @Prop({ required: true })
  powerKw: number;

  @Prop({ required: true })
  count: number;
}

@Schema({ timestamps: true })
export class Station {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  operator: string;

  @Prop({ required: true, enum: ['available', 'occupied', 'offline'] })
  status: string;

  @Prop({ type: Address, required: true })
  address: Address;

  @Prop({ type: GeoPoint, required: true })
  location: GeoPoint;

  @Prop({ type: [Connector], required: true })
  connectors: Connector[];

  @Prop({ required: true })
  pricePerKwh: number;

  @Prop({ required: true, default: 'EUR' })
  currency: string;

  @Prop({ required: true })
  openingHours: string;
}

export const StationSchema = SchemaFactory.createForClass(Station);

StationSchema.index({ location: '2dsphere' });