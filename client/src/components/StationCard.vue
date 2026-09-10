<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from './StatusBadge.vue'
import { maxPowerKw, totalPoints, formatPrice } from '../utils/station'
import type { Station } from '../types/station'

const props = defineProps<{ station: Station }>()

const power = computed(() => maxPowerKw(props.station))
const points = computed(() => totalPoints(props.station))
const connectorTypes = computed(() => [
    ...new Set(props.station.connectors.map((c) => c.type)),
])
</script>

<template>
    <article class="card" :class="{ 'card--offline': station.status === 'offline' }">
        <div class="card__top">
            <div class="card__identity">
                <h2 class="card__name">{{ station.name }}</h2>
                <p class="card__address">
                    {{ station.address.street }}, {{ station.address.city }}
                </p>
                <p class="card__operator">Operated by {{ station.operator }}</p>
            </div>

            <StatusBadge :status="station.status" />
        </div>

        <p class="card__power">
            <span class="card__power-value">{{ power }}</span>
            <span class="card__power-unit">
                kW max · {{ points }} charging {{ points === 1 ? 'point' : 'points' }}
            </span>
        </p>

        <ul class="types">
            <li v-for="type in connectorTypes" :key="type" class="types__item">
                {{ type }}
            </li>
        </ul>

        <footer class="card__footer">
            <span class="card__price">{{ formatPrice(station) }}</span>
            <span>{{ station.openingHours }}</span>
        </footer>
    </article>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 0.875rem 1rem;
    border: 1px solid #e2e5ea;
    border-radius: 12px;
    background: #fff;
    transition: border-color 0.15s;
}

.card--offline {
    opacity: 0.65;
}

.card__top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 0.625rem;
}

.card__identity {
    min-width: 0;
}

.card__name {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
}

.card__address {
    margin: 0.125rem 0 0;
    font-size: 0.8125rem;
    color: #5a6472;
}

.card__operator {
    margin: 0.25rem 0 0;
    font-size: 0.75rem;
    color: #8b95a3;
}

.card__power {
    display: flex;
    align-items: baseline;
    gap: 0.375rem;
    margin: 0;
}

.card__power-value {
    font-size: 1.375rem;
    font-weight: 600;
    line-height: 1;
}

.card__power-unit {
    font-size: 0.8125rem;
    color: #5a6472;
}

.types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.types__item {
    padding: 0.1875rem 0.5625rem;
    border-radius: 999px;
    background: #eef3fd;
    color: #1d4ed8;
    font-size: 0.75rem;
}

.card__footer {
    display: flex;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.625rem;
    border-top: 1px solid #f0f2f5;
    font-size: 0.8125rem;
    color: #5a6472;
}

.card__price {
    color: #1a1f2b;
    font-weight: 500;
}
</style>