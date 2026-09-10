<script setup lang="ts">
import { RouterLink } from 'vue-router'
import StationCard from './StationCard.vue'
import type { Station } from '../types/station'

defineProps<{ stations: Station[]; selectedId?: string | null }>()
</script>

<template>
    <ul class="list">
        <li v-for="station in stations" :key="station.id">
            <RouterLink :to="`/detail/${station.id}`" class="list__link"
                :class="{ 'list__link--selected': station.id === selectedId }">
                <StationCard :station="station" />
            </RouterLink>
        </li>
    </ul>
</template>

<style scoped>
.list {
    display: grid;
    gap: 0.625rem;
    margin: 0;
    padding: 0;
    list-style: none;
}

.list__link {
    display: block;
    color: inherit;
    text-decoration: none;
    border-radius: 12px;
}

.list__link:hover :deep(.card) {
    border-color: #b9c0cc;
}

.list__link--selected :deep(.card) {
    border-color: #2f6fed;
}

.list__link:focus-visible {
    outline: 2px solid #2f6fed;
    outline-offset: 2px;
}
</style>