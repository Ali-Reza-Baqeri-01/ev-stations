import { ref, computed, onMounted } from 'vue'
import { fetchStations } from '../api/stations'
import type { Station } from '../types/station'

export function useStations() {
    const stations = ref<Station[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const searchTerm = ref('')

    const filteredStations = computed(() => {
        const term = searchTerm.value.trim().toLowerCase()

        if (!term) return stations.value

        return stations.value.filter((station) =>
            [station.name, station.operator, station.address.city]
                .join(' ')
                .toLowerCase()
                .includes(term),
        )
    })

    async function load() {
        isLoading.value = true
        error.value = null

        try {
            stations.value = await fetchStations()
        } catch (e) {
            error.value = e instanceof Error ? e.message : 'Something went wrong'
        } finally {
            isLoading.value = false
        }
    }

    onMounted(load)

    return {
        stations,
        filteredStations,
        searchTerm,
        isLoading,
        error,
        reload: load,
    }
}