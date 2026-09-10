import { ref, onMounted } from 'vue'
import { fetchStation } from '../api/stations'
import type { Station } from '../types/station'

export function useStation(id: string) {
    const station = ref<Station | null>(null)
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    async function load() {
        isLoading.value = true
        error.value = null

        try {
            station.value = await fetchStation(id)
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Something went wrong'
        } finally {
            isLoading.value = false
        }
    }

    onMounted(load)

    return { station, isLoading, error, reload: load }
}