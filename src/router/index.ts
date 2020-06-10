import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
    {
        path: '/',
        name: 'Main',
        component: () => import("@/views/Main.vue")
    },
    {
        path: '/pdf/:year/:month',
        name: 'PDF',
        component: () => import("@/views/PDF.vue")
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router
