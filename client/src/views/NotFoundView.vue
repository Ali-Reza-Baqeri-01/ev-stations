<script setup lang="ts">
import { RouterLink } from 'vue-router'
import AppHeader from '../components/AppHeader.vue'
</script>

<template>
    <AppHeader />

    <main class="page">
        <div class="content">
            <p class="code">404</p>
            <h1 class="title">Page not found</h1>
            <p class="text">
                The page you are looking for does not exist or has been moved.
            </p>
            <RouterLink to="/" class="link">Back to stations</RouterLink>
        </div>
    </main>
</template>

<style scoped>
.page {
    min-height: calc(100vh - var(--header-height));
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1.25rem;
}

.content {
    max-width: 380px;
    text-align: center;
}

.code {
    margin: 0;
    font-size: 5.5rem;
    font-weight: 600;
    line-height: 1;
    letter-spacing: -0.04em;
    color: var(--text-primary);
}

.title {
    margin: 0.75rem 0 0;
    font-size: 1.125rem;
    font-weight: 500;
    letter-spacing: -0.01em;
}

.text {
    margin: 0.5rem 0 0;
    font-size: 0.8125rem;
    color: var(--text-secondary);
}

.link {
    display: inline-block;
    margin-top: 1.5rem;
    padding: 0.5rem 1rem;
    border: 1px solid var(--border);
    border-radius: var(--radius);
    background: var(--surface);
    font-size: 0.75rem;
    color: var(--text-primary);
    text-decoration: none;
}

.link:hover {
    border-color: var(--border-strong);
}
</style>