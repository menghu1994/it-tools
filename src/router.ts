import { createRouter, createWebHistory } from 'vue-router';
import { layouts } from './layouts/index';
import HomePage from './pages/Home.page.vue';
import NotFound from './pages/404.page.vue';
import { tools } from './tools';
import { config } from './config';
import { routes as demoRoutes } from './ui/demo/demo.routes';
import { useLoginModalStore } from '@/stores/login-modal.store'
import { useUserStore } from '@/stores/user.store';

const toolsRoutes = tools.map(({ path, name, component, ...config }) => ({
  path,
  name,
  component,
  meta: { isTool: true, layout: layouts.toolLayout, name, ...config },
  children: config?.children ?? [],
}));
const toolsRedirectRoutes = tools
  .filter(({ redirectFrom }) => redirectFrom && redirectFrom.length > 0)
  .flatMap(
    ({ path, redirectFrom }) => redirectFrom?.map(redirectSource => ({ path: redirectSource, redirect: path })) ?? [],
  );

const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/About.vue'),
      beforeEnter: (to, from, next) => {next()}
    },
    ...toolsRoutes,
    ...toolsRedirectRoutes,
    ...(config.app.env === 'development' ? demoRoutes : []),
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
});

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const modalStore = useLoginModalStore();
  if ((to.meta?.meta as any)?.needLogin && !userStore.user) {
    const result = await modalStore.open();
    if (result) {
      next()
    } else {
      next(false)
    }
  } else {
    next();
  }
});

export default router;
