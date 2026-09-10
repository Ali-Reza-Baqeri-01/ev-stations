<script setup lang="ts">
import { ref } from 'vue'
import { useStations } from '../composables/useStations'
import { useMediaQuery } from '../composables/useMediaQuery'
import SearchInput from '../components/SearchInput.vue'
import StationList from '../components/StationList.vue'
import StationsMap from '../components/StationsMap.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import EmptyState from '../components/EmptyState.vue'

const { filteredStations, searchTerm, isLoading, error, reload } = useStations()

const isDesktop = useMediaQuery('(min-width: 900px)')
const mobileView = ref<'list' | 'map'>('list')
const selectedId = ref<string | null>(null)

function toggleMobileView() {
  mobileView.value = mobileView.value === 'list' ? 'map' : 'list'
}
</script>

<template>
  <main class="page">
    <header class="page__header">
      <div>
        <h1 class="page__title">Charging stations</h1>
        <p class="page__subtitle">Find an EV charging point across Italy</p>
      </div>

      <SearchInput v-model="searchTerm" :result-count="filteredStations.length" />
    </header>

    <LoadingState v-if="isLoading" />

    <ErrorState v-else-if="error" :message="error" @retry="reload" />

    <EmptyState v-else-if="filteredStations.length === 0" message="No stations match your search." />

    <div v-else class="panes" :class="{ 'panes--split': isDesktop }">
      <div v-if="isDesktop || mobileView === 'list'" class="panes__list">
        <StationList :stations="filteredStations" />
      </div>

      <div v-if="isDesktop || mobileView === 'map'" class="panes__map">
        <StationsMap :stations="filteredStations" :selected-id="selectedId" @select="selectedId = $event" />
      </div>
    </div>

    <button v-if="!isDesktop && !isLoading && !error" class="toggle" type="button" @click="toggleMobileView">
      {{ mobileView === 'list' ? 'Map' : 'List' }}
    </button>
  </main>
</template>

<style scoped>
.page {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.25rem 1rem 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.page__header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.page__title {
  margin: 0;
  font-size: 1.375rem;
  font-weight: 600;
}

.page__subtitle {
  margin: 0.125rem 0 0;
  font-size: 0.875rem;
  color: #8b95a3;
}

.panes--split {
  display: grid;
  grid-template-columns: minmax(0, 400px) minmax(0, 1fr);
  gap: 1rem;
  align-items: start;
}

.panes--split .panes__list {
  max-height: calc(100vh - 190px);
  overflow-y: auto;
  padding-right: 0.25rem;
}

.panes--split .panes__map {
  position: sticky;
  top: 1rem;
  height: calc(100vh - 190px);
}

.panes__map {
  height: 60vh;
}

.toggle {
  position: fixed;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  padding: 0.625rem 1.375rem;
  border: none;
  border-radius: 999px;
  background: #1a1f2b;
  color: #fff;
  font-family: inherit;
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 14px rgb(0 0 0 / 0.18);
  z-index: 500;
}

@media (min-width: 900px) {
  .page__header {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .page__header :deep(.search) {
    width: 380px;
  }
}
</style>