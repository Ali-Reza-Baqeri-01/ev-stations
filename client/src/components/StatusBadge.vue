<script setup lang="ts">
import { statusLabels } from '../utils/station'
import type { StationStatus } from '../types/station'

defineProps<{ status: StationStatus }>()
</script>

<template>
    <span class="badge" :class="`badge--${status}`">
        {{ statusLabels[status] }}
    </span>
</template>

<style scoped>
.badge {
    flex-shrink: 0;
    padding: 3px 8px;
    border-radius: 999px;
    font-size: 0.6875rem;
    font-weight: 500;
    white-space: nowrap;
}

.badge--available {
    background: #e6f6ec;
    color: #1a7f42;
}

.badge--occupied {
    background: #fff4e0;
    color: #a35c00;
}

.badge--offline {
    background: #f2f3f5;
    color: #6b7280;
}
</style>