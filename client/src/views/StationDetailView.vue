<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useStation } from '../composables/useStation'
import AppHeader from '../components/AppHeader.vue'
import StatusBadge from '../components/StatusBadge.vue'
import StationLocationMap from '../components/StationLocationMap.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import {
  formatPrice,
  maxPowerKw,
  totalPoints,
  statusLabels,
  googleMapsUrl,
  latLng,
} from '../utils/station'

const route = useRoute()
const router = useRouter()

const { station, isLoading, error, reload } = useStation(route.params.id as string)

function goBack() {
  router.push('/')
}
</script>

<template>
  <AppHeader />

  <main class="page">
    <button class="back" type="button" @click="goBack">← Back to list</button>

    <LoadingState v-if="isLoading" />

    <ErrorState v-else-if="error" :message="error" @retry="reload" />

    <div v-else-if="station" class="detail">
      <section class="panel">
        <div class="panel__body panel__body--head">
          <div>
            <h1 class="name">{{ station.name }}</h1>
            <p class="address">
              {{ station.address.street }}, {{ station.address.postalCode }}
              {{ station.address.city }}, {{ station.address.country }}
            </p>
            <p class="operator">{{ station.operator }}</p>
          </div>
          <StatusBadge :status="station.status" />
        </div>

        <div class="metrics">
          <div class="metric">
            <p class="metric__label">Max power</p>
            <p class="metric__value">{{ maxPowerKw(station) }} kW</p>
          </div>
          <div class="metric">
            <p class="metric__label">Charging points</p>
            <p class="metric__value">{{ totalPoints(station) }}</p>
          </div>
          <div class="metric">
            <p class="metric__label">Price</p>
            <p class="metric__value">
              {{ station.pricePerKwh.toFixed(2) }} {{ station.currency }}
            </p>
          </div>
        </div>
      </section>

      <section class="panel">
        <header class="panel__head">
          <h2 class="panel__title">Connectors</h2>
        </header>
        <div class="panel__body">
          <table class="table table--connectors">
            <thead>
              <tr>
                <th>Type</th>
                <th class="table__right">Power</th>
                <th class="table__right">Points</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="connector in station.connectors" :key="connector.type">
                <td>{{ connector.type }}</td>
                <td class="table__right">{{ connector.powerKw }} kW</td>
                <td class="table__right">{{ connector.count }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <header class="panel__head">
          <h2 class="panel__title">Details</h2>
        </header>
        <div class="panel__body">
          <table class="table">
            <tbody>
              <tr>
                <td class="table__key">Operator</td>
                <td class="table__right">{{ station.operator }}</td>
              </tr>
              <tr>
                <td class="table__key">Status</td>
                <td class="table__right">{{ statusLabels[station.status] }}</td>
              </tr>
              <tr>
                <td class="table__key">Opening hours</td>
                <td class="table__right">{{ station.openingHours }}</td>
              </tr>
              <tr>
                <td class="table__key">Price per kWh</td>
                <td class="table__right">{{ formatPrice(station) }}</td>
              </tr>
              <tr>
                <td class="table__key">Coordinates</td>
                <td class="table__right table__mono">
                  {{ latLng(station)[0].toFixed(5) }},
                  {{ latLng(station)[1].toFixed(5) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="panel">
        <header class="panel__head">
          <h2 class="panel__title">Location</h2>
          <a class="external" :href="googleMapsUrl(station)" target="_blank" rel="noopener noreferrer">Open in Google
            Maps ↗</a>
        </header>
        <StationLocationMap :station="station" />
      </section>
    </div>
  </main>
</template>

<style scoped>
.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.back {
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  padding: 0.375rem 0.6875rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.back:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.page {
  max-width: 760px;
  margin: 0 auto;
  padding: 1.25rem 1.25rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.back {
  padding: 0.375rem 0.6875rem;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  font-family: inherit;
  font-size: 0.75rem;
  color: var(--text-secondary);
  cursor: pointer;
}

.back:hover {
  border-color: var(--border-strong);
  color: var(--text-primary);
}

.detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  overflow: hidden;
}

.panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.625rem 1rem;
  border-bottom: 1px solid var(--border);
  background: var(--surface-muted);
}

.panel__title {
  margin: 0;
  font-size: 0.6875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.panel__body {
  padding: 0.5rem 1rem;
}

.panel__body--head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.875rem;
  padding: 1rem;
}

.external {
  font-size: 0.75rem;
  color: var(--accent);
  text-decoration: none;
  white-space: nowrap;
}

.external:hover {
  text-decoration: underline;
}

.name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.address {
  margin: 0.1875rem 0 0;
  font-size: 0.8125rem;
  color: var(--text-secondary);
}

.operator {
  margin: 0.1875rem 0 0;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.metrics {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1px;
  background: var(--border);
  border-top: 1px solid var(--border);
}

.metric {
  background: var(--surface);
  padding: 0.75rem 1rem;
}

.metric__label {
  margin: 0;
  font-size: 0.6875rem;
  color: var(--text-muted);
}

.metric__value {
  margin: 0.125rem 0 0;
  font-size: 1.125rem;
  font-weight: 500;
  letter-spacing: -0.015em;
}

.table {
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  font-size: 0.8125rem;
}

.table th {
  padding: 0.375rem 0;
  border-bottom: 1px solid var(--border);
  font-size: 0.6875rem;
  font-weight: 400;
  color: var(--text-muted);
  text-align: left;
}

.table td {
  padding: 0.5625rem 0;
  border-bottom: 1px solid var(--border);
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table th.table__right,
.table td.table__right {
  text-align: right;
}

.table__key {
  color: var(--text-muted);
}

.table__mono {
  font-family: ui-monospace, 'SFMono-Regular', 'Cascadia Code', monospace;
  font-size: 0.75rem;
}
</style>