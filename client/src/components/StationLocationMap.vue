<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { latLng } from '../utils/station'
import type { Station } from '../types/station'

const props = defineProps<{ station: Station }>()

const mapEl = ref<HTMLElement | null>(null)
let map: L.Map | null = null

const statusColors: Record<string, string> = {
    available: '#1a9d4f',
    occupied: '#e0980f',
    offline: '#9aa3af',
}

onMounted(() => {
    if (!mapEl.value) return

    const position = latLng(props.station)

    map = L.map(mapEl.value, {
        center: position,
        zoom: 14,
        zoomControl: false,
        scrollWheelZoom: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map)

    L.circleMarker(position, {
        radius: 8,
        color: '#ffffff',
        weight: 3,
        fillColor: statusColors[props.station.status],
        fillOpacity: 1,
    }).addTo(map)
})

onUnmounted(() => {
    map?.remove()
    map = null
})
</script>

<template>
    <div ref="mapEl" class="map" role="region" :aria-label="`Map showing the location of ${station.name}`"></div>
</template>

<style scoped>
.map {
  width: 100%;
  height: 240px;
  background: #f4f4f5;
  z-index: 0;
}

.map :deep(.leaflet-tile-pane) {
  filter: grayscale(0.9) brightness(1.06) contrast(0.92) sepia(0.08);
}
</style>