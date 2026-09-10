import type { Station } from '../types/station'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

async function request<T>(path: string): Promise<T> {
    let response: Response

    try {
        response = await fetch(`${API_URL}${path}`)
    } catch {
        throw new Error('Unable to reach the server. Is it running?')
    }

    if (response.status === 404) {
        throw new Error('Not found')
    }

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`)
    }

    return response.json() as Promise<T>
}

export function fetchStations() {
    return request<Station[]>('/stations')
}

export function fetchStation(id: string) {
    return request<Station>(`/stations/${id}`)
}