import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class StationsService {
    private readonly stations = [
        { id: "1", name: "station 1" },
        { id: "2", name: "station 2" },
        { id: "3", name: "station 3" },
    ]


    findAll() {
        return this.stations;
    }

    findOne(id: string) {
        const station = this.stations.find((s) => s.id === id);

        if (!station) {
            throw new NotFoundException(`Station with id "${id}" not found`);
        }

        return station;
    }
}
