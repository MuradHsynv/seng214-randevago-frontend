import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import SearchPage from '@/views/SearchPage.vue';
import LoginRegister from '@/views/LoginRegister.vue';
import SearchResults from '@/views/SearchResults.vue';
import HotelDescription from '@/views/HotelDescription.vue';
import AdminHotelsPage from '../views/AdminHotelsPage.vue';

const routes: Array<RouteRecordRaw> = [
    { path: '/', redirect: '/login' },
    {
        path: '/search',
        component: SearchPage,
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginRegister,
    },
    {
        path: '/results',
        name: 'Results',
        component: SearchResults,
    },
    {
        path: '/details',
        name: 'Details',
        component: HotelDescription,
    },
    {
        path: '/admin/hotels',
        name: 'AdminHotels',
        component: AdminHotelsPage
    }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
});

export default router;
