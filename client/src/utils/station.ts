import type { Station, StationStatus } from '../types/station'

export const statusLabels: Record<StationStatus, string> = {
    available: 'Free',
    occupied: 'In use',
    offline: 'Out of service',
}

export function maxPowerKw(station: Station): number {
    return Math.max(...station.connectors.map((c) => c.powerKw))
}

export function totalPoints(station: Station): number {
    return station.connectors.reduce((sum, c) => sum + c.count, 0)
}

export function formatPrice(station: Station): string {
    return `${station.pricePerKwh.toFixed(2)} ${station.currency}/kWh`
}