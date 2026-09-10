<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
    <div class="search">
        <input class="search__input" type="search" placeholder="Search name, operator or city"
            aria-label="Search stations" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
    </div>
</template>

<style scoped>
.search {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    min-width: 0;
}

.search__input {
    width: 280px;
    max-width: 100%;
    padding: 0.375rem 0.625rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    font-family: inherit;
    font-size: 0.8125rem;
    color: var(--text-primary);
    background: var(--surface);
}

.search__input::placeholder {
    color: var(--text-muted);
}

.search__input:focus {
    outline: none;
    border-color: var(--border-strong);
}

.search__count {
    font-size: 0.75rem;
    color: var(--text-muted);
    white-space: nowrap;
}

@media (max-width: 640px) {
    .search__input {
        flex: 1;
        width: auto;
    }

    .search__count {
        display: none;
    }
}
</style>