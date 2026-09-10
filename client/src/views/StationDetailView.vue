<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface Station {
  id: string
  name: string
}

const route = useRoute()
const router = useRouter()

const station = ref<Station | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadStation() {
  isLoading.value = true
  error.value = null

  try {
    const response = await fetch(`http://localhost:3000/stations/${route.params.id}`)

    if (!response.ok) {
      throw new Error(
        response.status === 404
          ? 'Station not found'
          : `Request failed with status ${response.status}`
      )
    }

    station.value = await response.json()
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Something went wrong'
  } finally {
    isLoading.value = false
  }
}

function goBack() {
  router.push('/')
}

onMounted(loadStation)
</script>

<template>
  <main>
    <button @click="goBack">← Back to list</button>

    <p v-if="isLoading">Loading…</p>

    <div v-else-if="error">
      <p>{{ error }}</p>
      <button @click="loadStation">Retry</button>
    </div>

    <div v-else-if="station">
      <h1>{{ station.name }}</h1>
      <p>ID: {{ station.id }}</p>
    </div>
  </main>
</template>