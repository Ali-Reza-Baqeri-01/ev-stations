<script setup lang="ts">
import type { Connector } from '../types/station'

defineProps<{ connectors: Connector[] }>()
</script>

<template>
  <ul class="tiles">
    <li v-for="connector in connectors" :key="connector.type" class="tile">
      <p class="tile__type">{{ connector.type }}</p>
      <p class="tile__power">{{ connector.powerKw }} kW</p>
      <p class="tile__count">
        {{ connector.count }} {{ connector.count === 1 ? 'point' : 'points' }}
      </p>
    </li>
  </ul>
</template>

<style scoped>
.tiles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}

.tile {
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  background: #f4f6f9;
}

.tile__type {
  margin: 0;
  font-size: 0.75rem;
  color: #5a6472;
}

.tile__power {
  margin: 0.125rem 0 0;
  font-size: 0.9375rem;
  font-weight: 600;
}

.tile__count {
  margin: 0.0625rem 0 0;
  font-size: 0.6875rem;
  color: #8b95a3;
}
</style>