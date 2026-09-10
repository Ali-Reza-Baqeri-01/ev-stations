export type StationStatus = 'available' | 'occupied' | 'offline'
export type ConnectorType = 'Type 2' | 'CCS' | 'CHAdeMO'

export interface Address {
    street: string
    city: string
    postalCode: string
    country: string
}

export interface GeoPoint {
    type: 'Point'
    coordinates: [number, number] // [longitude, latitude]
}

export interface Connector {
    type: ConnectorType
    powerKw: number
    count: number
}

export interface Station {
    id: string
    name: string
    operator: string
    status: StationStatus
    address: Address
    location: GeoPoint
    connectors: Connector[]
    pricePerKwh: number
    currency: string
    openingHours: string
}