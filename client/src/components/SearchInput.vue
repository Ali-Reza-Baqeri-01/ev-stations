<script setup lang="ts">
defineProps<{ modelValue: string; resultCount: number }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
    <div class="search">
        <input class="search__input" type="search" placeholder="Search by name, operator or city"
            aria-label="Search stations" :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)" />
        <p class="search__count">
            {{ resultCount }} {{ resultCount === 1 ? 'station' : 'stations' }}
        </p>
    </div>
</template>

<style scoped>
.search {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.search__input {
    flex: 1;
    min-width: 0;
    padding: 0.5625rem 0.75rem;
    border: 1px solid #d7dbe2;
    border-radius: 8px;
    font-size: 0.875rem;
    font-family: inherit;
    background: #fff;
}

.search__input:focus {
    outline: none;
    border-color: #2f6fed;
}

.search__count {
    margin: 0;
    font-size: 0.75rem;
    color: #8b95a3;
    white-space: nowrap;
}
</style>