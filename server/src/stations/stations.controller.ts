import { Controller, Get, Param, Query } from '@nestjs/common';
import { StationsService } from './stations.service';
import { FindStationsQueryDto } from './dto/find-stations-query.dto';

@Controller('stations')
export class StationsController {
    constructor(private readonly stationsService: StationsService) { }

    @Get()
    findAll(@Query() query: FindStationsQueryDto) {
        return this.stationsService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.stationsService.findOne(id);
    }
}
