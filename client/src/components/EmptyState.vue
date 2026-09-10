<script setup lang="ts">
defineProps<{ message: string }>()
</script>

<template>
    <p class="state">{{ message }}</p>
</template>

<style scoped>
.state {
    margin: 0;
    padding: 2.5rem 1rem;
    text-align: center;
    color: #8b95a3;
    font-size: 0.875rem;
}
</style>