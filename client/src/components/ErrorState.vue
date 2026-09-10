<script setup lang="ts">
defineProps<{ message: string }>()
defineEmits<{ retry: [] }>()
</script>

<template>
    <div class="state">
        <p class="state__message">{{ message }}</p>
        <button class="state__button" type="button" @click="$emit('retry')">
            Try again
        </button>
    </div>
</template>

<style scoped>
.state {
    padding: 2.5rem 1rem;
    text-align: center;
}

.state__message {
    margin: 0 0 0.875rem;
    font-size: 0.875rem;
    color: #b42318;
}

.state__button {
    padding: 0.5rem 1rem;
    border: 1px solid #d7dbe2;
    border-radius: 8px;
    background: #fff;
    font-family: inherit;
    font-size: 0.875rem;
    cursor: pointer;
}

.state__button:hover {
    border-color: #b9c0cc;
}
</style>