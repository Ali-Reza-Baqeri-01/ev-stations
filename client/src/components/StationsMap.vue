<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { statusLabels, maxPowerKw, formatPrice } from '../utils/station'
import type { Station } from '../types/station'

const props = defineProps<{
    stations: Station[]
    selectedId?: string | null
}>()

const emit = defineEmits<{ select: [id: string] }>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null
let markerLayer: L.LayerGroup | null = null
const markers = new Map<string, L.CircleMarker>()

const statusColors: Record<string, string> = {
    available: '#1a7f42',
    occupied: '#d18700',
    offline: '#9aa3af',
}

function popupHtml(station: Station): string {
    return `
    <strong>${station.name}</strong><br />
    ${station.address.street}, ${station.address.city}<br />
    <span style="color:#5a6472">
      ${statusLabels[station.status]} · ${maxPowerKw(station)} kW · ${formatPrice(station)}
    </span>
  `
}

function renderMarkers() {
    if (!map || !markerLayer) return

    markerLayer.clearLayers()
    markers.clear()

    props.stations.forEach((station) => {
        const [lng, lat] = station.location.coordinates

        const marker = L.circleMarker([lat, lng], {
            radius: 7,
            color: '#fff',
            weight: 2,
            fillColor: statusColors[station.status],
            fillOpacity: 1,
        })

        marker.bindPopup(popupHtml(station))
        marker.on('click', () => emit('select', station.id))

        marker.addTo(markerLayer!)
        markers.set(station.id, marker)
    })

    if (props.stations.length > 0) {
        const bounds = L.latLngBounds(
            props.stations.map((s) => [
                s.location.coordinates[1],
                s.location.coordinates[0],
            ]),
        )
        map.fitBounds(bounds, { padding: [32, 32], maxZoom: 13 })
    }
}

onMounted(() => {
    if (!mapEl.value) return

    map = L.map(mapEl.value, { scrollWheelZoom: true })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map)

    markerLayer = L.layerGroup().addTo(map)
    renderMarkers()
})

onUnmounted(() => {
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
    min-height: 320px;
    border-radius: 12px;
    z-index: 0;
}

/* .map :deep(.leaflet-tile-pane) {
    filter: grayscale(1) contrast(0.85) brightness(1.08);
} */
</style>