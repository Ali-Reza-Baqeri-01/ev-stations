<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { statusLabels, maxPowerKw, formatPrice, latLng } from '../utils/station'
import type { Station } from '../types/station'

const props = defineProps<{
    stations: Station[]
    selectedId?: string | null
}>()

const emit = defineEmits<{ select: [id: string]; open: [id: string] }>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
const markers = new Map<string, L.CircleMarker>()

const statusColors: Record<string, string> = {
    available: '#1a9d4f',
    occupied: '#e0980f',
    offline: '#9aa3af',
}

function popupHtml(station: Station): string {
    return `
    <div class="popup">
      <div class="popup__top">
        <span class="popup__name">${station.name}</span>
        <span class="popup__badge popup__badge--${station.status}">${statusLabels[station.status]}</span>
      </div>
      <p class="popup__meta">${station.address.street}, ${station.address.city}</p>
      <p class="popup__meta">${maxPowerKw(station)} kW · ${formatPrice(station)}</p>
      <button class="popup__link" type="button" data-station-id="${station.id}">View details →</button>
    </div>
  `
}

function handleContainerClick(event: MouseEvent) {
    const target = event.target as HTMLElement | null
    const link = target?.closest<HTMLElement>('.popup__link')
    if (!link) return

    event.preventDefault()
    event.stopPropagation()

    const id = link.dataset.stationId
    if (id) emit('open', id)
}

function renderMarkers() {
    if (!map || !markerLayer) return

    markerLayer.clearLayers()
    markers.clear()

    props.stations.forEach((station) => {
        const marker = L.circleMarker(latLng(station), {
            radius: 6,
            color: '#ffffff',
            weight: 2,
            fillColor: statusColors[station.status],
            fillOpacity: 1,
        })

        marker.bindPopup(popupHtml(station), {
            closeButton: false,
            offset: [0, -4],
        })

        marker.on('click', () => emit('select', station.id))
        marker.addTo(markerLayer!)
        markers.set(station.id, marker)
    })

    if (props.stations.length > 0) {
        map.fitBounds(L.latLngBounds(props.stations.map(latLng)), {
            padding: [40, 40],
            maxZoom: 13,
        })
    }
}

onMounted(() => {
    if (!mapEl.value) return

    map = L.map(mapEl.value, { zoomControl: false })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map)

    L.control.zoom({ position: 'topright' }).addTo(map)

    mapEl.value.addEventListener('click', handleContainerClick)

    markerLayer = L.layerGroup().addTo(map)
    renderMarkers()
})

onUnmounted(() => {
    mapEl.value?.removeEventListener('click', handleContainerClick)
    map?.remove()
    map = null
})

watch(() => props.stations, renderMarkers)

watch(
    () => props.selectedId,
    (id) => {
        if (!id || !map) return
        const marker = markers.get(id)
        if (!marker) return
        map.panTo(marker.getLatLng())
        marker.openPopup()
    },
)
</script>

<template>
    <div ref="mapEl" class="map" role="region" aria-label="Map of charging stations"></div>
</template>

<style scoped>
.map {
    width: 100%;
    height: 100%;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: #ebebeb;
    z-index: 0;
}

.map :deep(.leaflet-tile-pane) {
  filter: grayscale(0.9) brightness(1.06) contrast(0.92) sepia(0.08);
}

.map :deep(.leaflet-popup-content-wrapper) {
    border-radius: var(--radius);
    box-shadow: 0 2px 10px rgb(16 20 30 / 0.12);
}

.map :deep(.leaflet-popup-content) {
    margin: 0;
    width: 190px !important;
}

.map :deep(.leaflet-popup-tip) {
    box-shadow: none;
}

.map :deep(.popup) {
    padding: 0.625rem 0.75rem;
    font-family: inherit;
}

.map :deep(.popup__top) {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.375rem;
}

.map :deep(.popup__name) {
    font-size: 0.75rem;
    font-weight: 500;
    color: var(--text-primary);
}

.map :deep(.popup__badge) {
    flex-shrink: 0;
    padding: 1px 5px;
    border-radius: 3px;
    font-size: 0.5625rem;
    font-weight: 500;
    white-space: nowrap;
}

.map :deep(.popup__badge--available) {
    background: var(--success-bg);
    color: var(--success-text);
}

.map :deep(.popup__badge--occupied) {
    background: var(--warning-bg);
    color: var(--warning-text);
}

.map :deep(.popup__badge--offline) {
    background: var(--neutral-bg);
    color: var(--neutral-text);
}

.map :deep(.popup__meta) {
    margin: 0.1875rem 0 0;
    font-size: 0.6875rem;
    color: var(--text-secondary);
}

.map :deep(.popup__link) {
    display: block;
    width: 100%;
    margin-top: 0.5rem;
    padding: 0.375rem 0 0;
    text-align: left;
    border: none;
    border-top: 1px solid var(--border);
    background: none;
    font-family: inherit;
    font-size: 0.6875rem;
    color: var(--accent);
    cursor: pointer;
}
</style>