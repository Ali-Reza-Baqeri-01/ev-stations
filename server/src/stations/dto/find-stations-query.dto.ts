import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export const STATION_STATUSES = ['available', 'occupied', 'offline'] as const;

export type StationStatus = (typeof STATION_STATUSES)[number];

export class FindStationsQueryDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
    search?: string;

    @IsOptional()
    @IsIn(STATION_STATUSES, {
        message: `status must be one of: ${STATION_STATUSES.join(', ')}`,
    })
    status?: StationStatus;
}