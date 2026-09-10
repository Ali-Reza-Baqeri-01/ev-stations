import { createRouter, createWebHistory } from 'vue-router'
import StationsListView from '../views/StationsListView.vue'
import StationDetailView from '../views/StationDetailView.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'stations',
            component: StationsListView,
        },
        {
            path: '/detail/:id',
            name: 'station-detail',
            component: StationDetailView,
        },
    ],
})

export default router