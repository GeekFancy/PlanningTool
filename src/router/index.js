import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
        path: '/',
        name: 'Home',
        component: () =>
            import ('../views/Home.vue'),
        meta: {
            title: 'JIRA Tool'
        },
    }, {
        path: '/planning',
        name: 'Planning',
        component: () =>
            import ('../views/planning/planning.vue'),
        meta: {
            title: 'Planning'
        },
    },
    {
        path: '/worklog',
        name: 'Worklog',
        component: () =>
            import ('../views/worklog/index.vue'),
        meta: {
            title: 'Worklog'
        },
    },
    {
        path: '/EPICEstimate',
        name: 'EPICEstimate',
        component: () =>
            import ('../views/EPICEstimate/EPICEstimate.vue'),
        meta: {
            title: 'EPICEstimate'
        },
    },
]

const router = createRouter({
    history: createWebHistory(),
    mode: "history",
    routes
})

router.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
})

export default router