import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import type { QueryFilter } from 'mongoose';
import { Station, StationDocument } from './schemas/station.schema';
import { FindStationsQueryDto } from './dto/find-stations-query.dto';
import { stationsSeed } from './data/stations.seed';

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

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

    async findAll(query: FindStationsQueryDto = {}) {
        const filter: QueryFilter<StationDocument> = {};

        if (query.status) {
            filter.status = query.status;
        }

        if (query.search) {
            const term = escapeRegex(query.search);

            filter.$or = [
                { name: { $regex: term, $options: 'i' } },
                { operator: { $regex: term, $options: 'i' } },
                { 'address.city': { $regex: term, $options: 'i' } },
            ];
        }

        return this.stationModel.find(filter).exec();
    }

    async findOne(id: string) {
        if (!isValidObjectId(id)) {
            throw new NotFoundException(`Station with id "${id}" not found`);
        }

        const station = await this.stationModel.findById(id).exec();

        if (!station) {
            throw new NotFoundException(`Station with id "${id}" not found`);
        }

        return station;
    }
}