<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Station {
  id: string
  name: string
}

const stations = ref<Station[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadStations() {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch('http://localhost:3000/stations')

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    stations.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Something went wrong'
  } finally {
    isLoading.value = false
  }
}

onMounted(loadStations)
</script>

<template>
  <main>
    <h1>Charging stations</h1>

    <p v-if="isLoading">Loading…</p>

    <div v-else-if="error">
      <p>{{ error }}</p>
      <button @click="loadStations">Retry</button>
    </div>

    <p v-else-if="stations.length === 0">No stations found.</p>

    <ul v-else>
      <li v-for="station in stations" :key="station.id">
        {{ station.name }}
      </li>
    </ul>
  </main>
</template>