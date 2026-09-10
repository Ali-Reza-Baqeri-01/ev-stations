import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StationsController } from './stations.controller';
import { StationsService } from './stations.service';
import { Station, StationSchema } from './schemas/station.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Station.name, schema: StationSchema }]),
  ],
  controllers: [StationsController],
  providers: [StationsService]
})
export class StationsModule { }
