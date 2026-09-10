<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStations } from '../composables/useStations'
import { useMediaQuery } from '../composables/useMediaQuery'
import AppHeader from '../components/AppHeader.vue'
import SearchInput from '../components/SearchInput.vue'
import StationList from '../components/StationList.vue'
import StationsMap from '../components/StationsMap.vue'
import LoadingState from '../components/LoadingState.vue'
import ErrorState from '../components/ErrorState.vue'
import EmptyState from '../components/EmptyState.vue'

const router = useRouter()
const { filteredStations, searchTerm, isLoading, error, reload } = useStations()

const isDesktop = useMediaQuery('(min-width: 900px)')
const mobileView = ref<'list' | 'map'>('list')
const selectedId = ref<string | null>(null)

function toggleMobileView() {
  mobileView.value = mobileView.value === 'list' ? 'map' : 'list'
}

function openStation(id: string) {
  router.push(`/detail/${id}`)
}
</script>

<template>
  <AppHeader>
    <SearchInput v-model="searchTerm" />
  </AppHeader>

  <main class="page">

    <div class="panes" :class="{ 'panes--split': isDesktop }">
      <div v-if="isDesktop || mobileView === 'list'" class="panes__list scrollable">
        <LoadingState v-if="isLoading" />
        <ErrorState v-else-if="error" :message="error" @retry="reload" />
        <EmptyState v-else-if="filteredStations.length === 0" message="No stations match your search." />
        <StationList v-else :stations="filteredStations" :selected-id="selectedId" />
      </div>

      <div v-if="isDesktop || mobileView === 'map'" class="panes__map">
        <StationsMap :stations="filteredStations" :selected-id="selectedId" @select="selectedId = $event"
          @open="openStation" />
      </div>
    </div>

    <button v-if="!isDesktop && !isLoading && !error" class="toggle" type="button" @click="toggleMobileView">
      {{ mobileView === 'list' ? 'Map' : 'List' }}
    </button>
  </main>
</template>

<style scoped>
.page {
  max-width: 1400px;
  margin: 0 auto;
  padding: 1rem 1.25rem 2rem;
}

.panes--split {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: start;
}

.panes--split .panes__list {
  height: calc(100vh - var(--header-height) - 3rem);
  overflow-y: auto;
  padding-right: 0.625rem;
}

.panes--split .panes__map {
  position: sticky;
  top: calc(var(--header-height) + 1rem);
  height: calc(100vh - var(--header-height) - 3rem);
}

.panes__map {
  height: 62vh;
}

.toggle {
  position: fixed;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  padding: 0.5625rem 1.25rem;
  border: none;
  border-radius: 999px;
  background: var(--text-primary);
  color: #fff;
  font-family: inherit;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 3px 12px rgb(16 20 30 / 0.22);
  z-index: 700;
}

@media (min-width: 1200px) {
  .page {
    padding: 1.25rem 2.5rem 2rem;
  }
}
</style>