import { createRouter, createWebHistory } from 'vue-router';
import { layouts } from './layouts/index';
import HomePage from './pages/Home.page.vue';
import NotFound from './pages/404.page.vue';
import { tools } from './tools';
import { config } from './config';
import { routes as demoRoutes } from './ui/demo/demo.routes';
import { useLoginModalStore } from '@/stores/login-modal.store';
import { useUserStore } from '@/stores/user.store';
import { itToolsService } from '@/api/it-tools.service';

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
    ({ path, redirectFrom }) => redirectFrom?.map((redirectSource) => ({ path: redirectSource, redirect: path })) ?? [],
  );

const router = createRouter({
  history: createWebHistory(config.app.baseUrl),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('./pages/About.vue'),
      beforeEnter: (to, from, next) => {
        next();
      },
    },
    {
      path: '/user',
      name: 'user',
      component: () => import('./pages/User.page.vue'),
    },
    {
      path: '/admin/tool-quotas',
      name: 'admin-tool-quotas',
      component: () => import('./pages/AdminToolQuotas.page.vue'),
    },
    {
      path: '/admin/comments',
      name: 'admin-comments',
      component: () => import('./pages/AdminComments.page.vue'),
    },
    ...toolsRoutes,
    ...toolsRedirectRoutes,
    ...(config.app.env === 'development' ? demoRoutes : []),
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
  ],
});

async function enterToolRoute(path: string, userStore: ReturnType<typeof useUserStore>) {
  const res = await itToolsService.enterTool(path);
  if (res.data?.user) {
    userStore.user = res.data.user;
  }
}

async function resolveToolAccess(path: string) {
  const res = await itToolsService.toolAccess(path);
  return res.data || { controlled: false, loginRequired: false };
}

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore();
  const modalStore = useLoginModalStore();
  if (to.meta?.isTool) {
    try {
      const access = await resolveToolAccess(to.path);
      const shouldGate = access.loginRequired || access.controlled;
      if (!shouldGate) {
        next();
        return;
      }

      if (!userStore.user) {
        const result = await modalStore.open();
        if (!result) {
          next(false);
          return;
        }
      }

      await enterToolRoute(to.path, userStore);
      next();
      return;
    } catch (error: any) {
      if (error?.response?.status === 402) {
        next('/user');
        return;
      }
      next(false);
      return;
    }
  }

  if (((to.meta?.meta as any)?.needLogin || to.name === 'user' || to.name === 'admin-tool-quotas' || to.name === 'admin-comments') && !userStore.user) {
    const result = await modalStore.open();
    if (result) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

export default router;
