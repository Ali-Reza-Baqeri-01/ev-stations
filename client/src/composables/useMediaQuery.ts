import { ref, onMounted, onUnmounted } from 'vue'

export function useMediaQuery(query: string) {
    const matches = ref(false)
    let mql: MediaQueryList | null = null

    function update(e: MediaQueryListEvent | MediaQueryList) {
        matches.value = e.matches
    }

    onMounted(() => {
        mql = window.matchMedia(query)
        update(mql)
        mql.addEventListener('change', update)
    })

    onUnmounted(() => {
        mql?.removeEventListener('change', update)
    })

    return matches
}