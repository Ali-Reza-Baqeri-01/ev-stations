<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useStation } from '../composables/useStation'
import StatusBadge from '../components/StatusBadge.vue'
import ConnectorTiles from '../components/ConnectorTiles.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import { formatPrice, maxPowerKw, totalPoints } from '../utils/station'

const route = useRoute()
const router = useRouter()

const { station, isLoading, error, reload } = useStation(route.params.id as string)

function goBack() {
  router.push('/')
}
</script>

<template>
  <main class="page">
    <button class="back" type="button" @click="goBack">← Back to list</button>

    <LoadingState v-if="isLoading" />

    <ErrorState v-else-if="error" :message="error" @retry="reload" />

    <article v-else-if="station" class="detail">
      <header class="detail__header">
        <div>
          <h1 class="detail__name">{{ station.name }}</h1>
          <p class="detail__operator">Operated by {{ station.operator }}</p>
        </div>
        <StatusBadge :status="station.status" />
      </header>

      <section class="block">
        <h2 class="block__title">Address</h2>
        <p class="block__text">
          {{ station.address.street }}<br />
          {{ station.address.postalCode }} {{ station.address.city }},
          {{ station.address.country }}
        </p>
      </section>

      <section class="block">
        <h2 class="block__title">
          Connectors · {{ maxPowerKw(station) }} kW max ·
          {{ totalPoints(station) }} points
        </h2>
        <ConnectorTiles :connectors="station.connectors" />
      </section>

      <section class="block">
        <h2 class="block__title">Pricing and hours</h2>
        <dl class="facts">
          <div class="facts__row">
            <dt>Price</dt>
            <dd>{{ formatPrice(station) }}</dd>
          </div>
          <div class="facts__row">
            <dt>Opening hours</dt>
            <dd>{{ station.openingHours }}</dd>
          </div>
          <div class="facts__row">
            <dt>Coordinates</dt>
            <dd>
              {{ station.location.coordinates[1].toFixed(5) }},
              {{ station.location.coordinates[0].toFixed(5) }}
            </dd>
          </div>
        </dl>
      </section>
    </article>
  </main>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.back {
  padding: 0.4375rem 0.75rem;
  border: 1px solid #d7dbe2;
  border-radius: 8px;
  background: #fff;
  font-family: inherit;
  font-size: 0.8125rem;
  color: #3d4757;
  cursor: pointer;
}

.back:hover {
  border-color: #b9c0cc;
}

.detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1.25rem;
  border: 1px solid #e2e5ea;
  border-radius: 12px;
  background: #fff;
}

.detail__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.detail__name {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.detail__operator {
  margin: 0.25rem 0 0;
  font-size: 0.8125rem;
  color: #8b95a3;
}

.block {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f2f5;
}

.block__title {
  margin: 0;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8b95a3;
}

.block__text {
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
}

.facts {
  margin: 0;
}

.facts__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.375rem 0;
  font-size: 0.875rem;
}

.facts__row dt {
  color: #5a6472;
}

.facts__row dd {
  margin: 0;
  text-align: right;
}
</style>