<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
    <header class="header">
        <div class="header__inner">
            <RouterLink to="/" class="brand">
                <span class="brand__mark" aria-hidden="true"></span>
                <span class="brand__name">Stations</span>
            </RouterLink>

            <div class="header__slot">
                <slot />
            </div>
        </div>
    </header>
</template>

<style scoped>
.header {
    position: sticky;
    top: 0;
    z-index: 600;
    background: var(--surface);
    border-bottom: 1px solid var(--border);
}

.header__inner {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0.75rem 1.25rem;
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.brand {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    text-decoration: none;
    color: inherit;
    flex-shrink: 0;
}

.brand__mark {
    width: 8px;
    height: 16px;
    border-radius: 1px;
    background: var(--text-primary);
    clip-path: polygon(55% 0, 0 58%, 42% 58%, 30% 100%, 100% 40%, 55% 40%);
}

.brand__name {
    font-size: 1rem;
    font-weight: 600;
    letter-spacing: -0.015em;
}

.header__slot {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 1rem;
    min-width: 0;
}

@media (max-width: 640px) {
    .header__inner {
        padding: 0.625rem 1rem;
        gap: 0.75rem;
    }
}
</style>