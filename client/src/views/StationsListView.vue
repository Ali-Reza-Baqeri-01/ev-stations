<script setup lang="ts">
import { useStations } from '../composables/useStations'
import SearchInput from '../components/SearchInput.vue'
import StationList from '../components/StationList.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import EmptyState from '../components/EmptyState.vue'

const { filteredStations, searchTerm, isLoading, error, reload } = useStations()
</script>

<template>
  <main class="page">
    <header class="page__header">
      <h1 class="page__title">Charging stations</h1>
      <p class="page__subtitle">Find an EV charging point across Italy</p>
    </header>

    <SearchInput v-model="searchTerm" :result-count="filteredStations.length" />

    <LoadingState v-if="isLoading" />

    <ErrorState v-else-if="error" :message="error" @retry="reload" />

    <EmptyState v-else-if="filteredStations.length === 0" message="No stations match your search." />

    <StationList v-else :stations="filteredStations" />
  </main>
</template>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1.5rem 1rem 3rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page__header {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.page__title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.page__subtitle {
  margin: 0;
  font-size: 0.875rem;
  color: #8b95a3;
}
</style>