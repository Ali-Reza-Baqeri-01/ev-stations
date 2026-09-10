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
                <p class="card__operator">{{ station.operator }}</p>
            </div>

            <StatusBadge :status="station.status" />
        </div>

        <p class="card__power">
            <span class="card__power-value">{{ power }}</span>
            <span class="card__power-unit">
                kW max · {{ points }} {{ points === 1 ? 'point' : 'points' }}
            </span>
        </p>

        <ul class="types">
            <li v-for="type in connectorTypes" :key="type" class="types__item">
                {{ type }}
            </li>
        </ul>

        <footer class="card__footer">
            <span class="card__price">{{ formatPrice(station) }}</span>
            <span class="card__cta">
                Details
                <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
                    <path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"
                        stroke-linejoin="round" />
                </svg>
            </span>
        </footer>
    </article>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    padding: 0.8125rem 0.9375rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    transition: border-color 0.12s ease;
}

.card--offline {
    opacity: 0.55;
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
    font-size: 0.875rem;
    font-weight: 500;
    letter-spacing: -0.005em;
}

.card__address {
    margin: 0.125rem 0 0;
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.card__operator {
    margin: 0.1875rem 0 0;
    font-size: 0.6875rem;
    color: var(--text-muted);
}

.card__power {
    display: flex;
    align-items: baseline;
    gap: 0.3125rem;
    margin: 0;
}

.card__power-value {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: -0.02em;
}

.card__power-unit {
    font-size: 0.75rem;
    color: var(--text-secondary);
}

.types {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.types__item {
    padding: 2px 7px;
    border-radius: 3px;
    background: var(--surface-muted);
    color: var(--text-secondary);
    font-size: 0.6875rem;
}

.card__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    padding-top: 0.5625rem;
    border-top: 1px solid var(--border);
    font-size: 0.75rem;
}

.card__price {
    font-weight: 500;
}

.card__cta {
    display: flex;
    align-items: center;
    gap: 0.1875rem;
    color: var(--text-secondary);
}
</style>