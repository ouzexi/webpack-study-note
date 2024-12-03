import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import(/* webpackChunkName: "home-route" */ '../views/Home');
const About = () => import(/* webpackChunkName: "about-route" */ '../views/About');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/home',
            component: Home
        },
        {
            path: '/about',
            component: About
        }
    ]
})

export default router;