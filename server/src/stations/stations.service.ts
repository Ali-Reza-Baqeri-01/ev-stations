import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station, StationDocument } from './schemas/station.schema';
import { stationsSeed } from './data/stations.seed';

@Injectable()
export class StationsService implements OnModuleInit {
    constructor(
        @InjectModel(Station.name)
        private readonly stationModel: Model<StationDocument>,
    ) { }

    async onModuleInit() {
        const count = await this.stationModel.estimatedDocumentCount();

        if (count === 0) {
            await this.stationModel.insertMany(stationsSeed);
        }
    }

    async findAll() {
        return this.stationModel.find().exec();
    }

    async findOne(id: string) {
        const station = await this.stationModel.findById(id).exec();

        if (!station) {
            throw new NotFoundException(`Station with id "${id}" not found`);
        }

        return station;
    }
}