import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';

import { StationsModule } from './stations/stations.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/ev-stations'),
    StationsModule
  ]
})
export class AppModule { }
