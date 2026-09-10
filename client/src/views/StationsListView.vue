<script setup lang="ts">
import { useStations } from '../composables/useStations'

const { filteredStations, searchTerm, isLoading, error, reload } = useStations()
</script>