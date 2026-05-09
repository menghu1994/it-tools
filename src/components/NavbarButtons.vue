<script setup lang="ts">
import { IconCoins, IconInfoCircle, IconMoon, IconSettings, IconSun, IconUserCircle } from '@tabler/icons-vue';
import { authService } from '@/api/auth/auth.service';
import { clearAuthTokens } from '@/api/request';
import { useLoginModalStore } from '@/stores/login-modal.store';
import { useStyleStore } from '@/stores/style.store';
import { useUserStore } from '@/stores/user.store';
import { useToolStore } from '@/tools/tools.store';

const router = useRouter();
const userStore = useUserStore();
const { user } = toRefs(userStore);

const styleStore = useStyleStore();
const { isDarkTheme } = toRefs(styleStore);
const modalStore = useLoginModalStore();
const toolStore = useToolStore();
const isAdmin = computed(() => {
  const roles = user.value?.roles || [];
  return Array.isArray(roles) && roles.some((role: any) => role === 'admin' || role?.code === 'admin');
});

async function logout() {
  user.value = null;
  toolStore.clearUserFavorites();
  clearAuthTokens();
  await authService.logout();
  await router.push('/');
}
</script>

<template>
  <div flex items-center gap-1>
    <c-tooltip tooltip="关于" position="bottom">
      <c-button circle variant="text" to="/about" aria-label="关于">
        <n-icon size="25" :component="IconInfoCircle" />
      </c-button>
    </c-tooltip>

    <c-tooltip :tooltip="isDarkTheme ? '浅色模式' : '深色模式'" position="bottom">
      <c-button circle variant="text" aria-label="颜色模式" @click="() => styleStore.toggleDark()">
        <n-icon v-if="isDarkTheme" size="25" :component="IconSun" />
        <n-icon v-else size="25" :component="IconMoon" />
      </c-button>
    </c-tooltip>

    <n-popover v-if="user" placement="bottom" trigger="hover">
      <template #trigger>
        <n-badge :value="user?.coinBalance || 0">
          <n-avatar round :src="user.avatar"
          fallback-src="https://img0.baidu.com/it/u=4066309868,2206141634&fm=253&fmt=auto&app=120&f=JPEG?w=270&h=268"
          ></n-avatar>
        </n-badge>
      </template>
      <div>
        <div flex flex-col items-center justify-center>
          <span>{{ user?.username }}</span>
          <span class="coin-line">{{ user?.coinBalance || 0 }} 金币</span>
        </div>
        <n-divider />
        <ul>
          <li class="cursor-pointer menu-item" @click="router.push('/user')">
            <n-icon :component="IconUserCircle" />
            <span>个人中心</span>
          </li>
          <li class="cursor-pointer menu-item" @click="router.push('/user')">
            <n-icon :component="IconCoins" />
            <span>充值金币</span>
          </li>
          <li v-if="isAdmin" class="cursor-pointer menu-item" @click="router.push('/admin/tool-quotas')">
            <n-icon :component="IconSettings" />
            <span>额度管理</span>
          </li>
          <li class="cursor-pointer menu-item" @click="logout()">退出</li>
        </ul>
      </div>
    </n-popover>

    <div v-else>
      <c-button round @click="modalStore.open()">登录</c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
.n-button {
  &:not(:last-child) {
    margin-right: 5px;
  }
}

ul,
li {
  list-style: none;
  padding: 0;
  margin: 0;
}

.coin-line {
  margin-top: 4px;
  color: var(--n-text-color-3);
  font-size: 12px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 0;
}
</style>
