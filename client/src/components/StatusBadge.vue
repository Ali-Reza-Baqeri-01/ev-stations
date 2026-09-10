<script setup lang="ts">
import { statusLabels } from '../utils/station'
import type { StationStatus } from '../types/station'

defineProps<{ status: StationStatus }>()
</script>

<template>
    <span class="badge" :class="`badge--${status}`">{{ statusLabels[status] }}</span>
</template>

<style scoped>
.badge {
    flex-shrink: 0;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 0.625rem;
    font-weight: 500;
    letter-spacing: 0.01em;
    white-space: nowrap;
}

.badge--available {
    background: var(--success-bg);
    color: var(--success-text);
}

.badge--occupied {
    background: var(--warning-bg);
    color: var(--warning-text);
}

.badge--offline {
    background: var(--neutral-bg);
    color: var(--neutral-text);
}
</style>