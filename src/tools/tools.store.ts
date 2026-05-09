import { type MaybeRef, get, useStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import _ from 'lodash';
import { itToolsService } from '@/api/it-tools.service';
import { useLoginModalStore } from '@/stores/login-modal.store';
import { useUserStore } from '@/stores/user.store';
import type { Tool, ToolCategory, ToolWithCategory } from './tools.types';
import { toolsWithCategory } from './index';

export const useToolStore = defineStore('tools', () => {
  const guestFavoriteToolsName = useStorage('favoriteToolsName', []) as Ref<string[]>;
  const userFavoriteToolsName = ref<string[]>([]);
  const loadedUserId = ref<string | null>(null);

  const userStore = useUserStore();
  const modalStore = useLoginModalStore();

  const favoriteToolsName = computed({
    get() {
      return userStore.user ? userFavoriteToolsName.value : guestFavoriteToolsName.value;
    },
    set(value: string[]) {
      if (userStore.user) {
        userFavoriteToolsName.value = value;
        return;
      }
      guestFavoriteToolsName.value = value;
    },
  });

  const tools = computed<ToolWithCategory[]>(() => toolsWithCategory.map((tool) => ({
    ...tool,
    path: tool.path,
    name: tool.name,
    description: tool.description,
    category: tool.category,
  })));

  const toolsByCategory = computed<ToolCategory[]>(() => {
    return _.chain(tools.value)
      .groupBy('category')
      .map((components, name, path) => ({
        name,
        path,
        components,
      }))
      .value();
  });

  const favoriteTools = computed(() => {
    return favoriteToolsName.value
      .map(favoriteName => tools.value.find(({ name, path }) => name === favoriteName || path === favoriteName))
      .filter(Boolean) as ToolWithCategory[];
  });

  async function ensureUserFavoritesLoaded() {
    const userId = userStore.user?._id;
    if (!userId || loadedUserId.value === userId) {
      return;
    }

    userFavoriteToolsName.value = Array.isArray(userStore.user?.favoriteTools)
      ? userStore.user.favoriteTools
      : [];

    const res = await itToolsService.favorites();
    userFavoriteToolsName.value = res.data || [];
    loadedUserId.value = userId;
  }

  async function persistUserFavorites() {
    if (!userStore.user) {
      return;
    }

    const res = await itToolsService.updateFavorites(userFavoriteToolsName.value);
    if (res.data?.user) {
      userStore.user = res.data.user;
    }
  }

  async function requireUser() {
    if (userStore.user) {
      await ensureUserFavoritesLoaded();
      return true;
    }

    const loggedIn = await modalStore.open();
    if (loggedIn) {
      await ensureUserFavoritesLoaded();
    }
    return loggedIn;
  }

  watch(
    () => userStore.user?._id,
    (userId) => {
      if (!userId) {
        userFavoriteToolsName.value = [];
        loadedUserId.value = null;
      }
    },
  );

  return {
    tools,
    favoriteTools,
    toolsByCategory,
    newTools: computed(() => tools.value.filter(({ isNew }) => isNew)),
    ensureUserFavoritesLoaded,

    clearUserFavorites() {
      userFavoriteToolsName.value = [];
      loadedUserId.value = null;
    },

    async addToolToFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      if (!await requireUser()) {
        return;
      }

      const toolPath = get(tool).path;
      if (toolPath && !favoriteToolsName.value.includes(toolPath)) {
        favoriteToolsName.value = [...favoriteToolsName.value, toolPath];
        await persistUserFavorites();
      }
    },

    async removeToolFromFavorites({ tool }: { tool: MaybeRef<Tool> }) {
      if (!await requireUser()) {
        return;
      }

      favoriteToolsName.value = favoriteToolsName.value.filter(
        name => get(tool).name !== name && get(tool).path !== name,
      );
      await persistUserFavorites();
    },

    isToolFavorite({ tool }: { tool: MaybeRef<Tool> }) {
      return favoriteToolsName.value.includes(get(tool).name)
        || favoriteToolsName.value.includes(get(tool).path);
    },

    async updateFavoriteTools(newOrder: ToolWithCategory[]) {
      if (!await requireUser()) {
        return;
      }

      favoriteToolsName.value = newOrder.map(tool => tool.path);
      await persistUserFavorites();
    },
  };
});
